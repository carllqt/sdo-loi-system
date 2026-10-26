<?php

namespace Tests\Feature;

use App\Models\LoiRequest;
use App\Models\Position;
use App\Models\Schools;
use App\Models\User;
use App\Services\GoogleSheetRequestImporter;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class RequestedEntryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'google-sheets.spreadsheet_id' => 'test-sheet',
            'google-sheets.sheet_id' => '0',
            'google-sheets.access_mode' => 'public',
            'google-sheets.ca_bundle' => null,
            'google-sheets.date_format' => 'm/d/Y',
        ]);
        Http::preventStrayRequests();
    }

    private function rows(): array
    {
        return [
            ['Timestamp', 'First Name: eg. (Juan)', 'Middle Initial: eg. (D.)', 'Last Name eg. (Dela Cruz)', 'School ', 'Position : (Teacher I)'],
            ['10/21/2026 09:15:00', 'Juan', 'D.', 'Dela Cruz', 'Example School', 'Teacher I'],
        ];
    }

    public function test_guests_cannot_add_or_sync_requests(): void
    {
        $this->post(route('requests.store'), [])->assertRedirect(route('login'));
        $this->post(route('requests.syncGoogleSheet'))->assertRedirect(route('login'));
        Http::assertNothingSent();
        $this->assertDatabaseCount('loi_requests', 0);
    }

    public function test_manual_entry_creates_pending_request_with_optional_fields_blank(): void
    {
        Position::factory()->create(['name' => 'Teacher I']);
        Schools::factory()->create(['code' => '123456', 'name' => 'Example School']);
        $this->actingAs(User::factory()->create())->post(route('requests.store'), [
            'first_name' => 'Juan', 'last_name' => 'Dela Cruz',
            'position' => 'Teacher I', 'school' => 'Example School',
            'request_date' => '2026-10-21', 'status' => 'Completed',
            'google_source_key' => 'injected',
        ])->assertSessionHasNoErrors()->assertRedirect(route('requests.requested'));
        $this->assertDatabaseHas('loi_requests', [
            'first_name' => 'Juan', 'middle_name' => '', 'email' => '',
            'status' => 'Pending', 'google_source_key' => null,
        ]);
    }

    public function test_invalid_manual_entry_is_rejected(): void
    {
        $this->actingAs(User::factory()->create())->post(route('requests.store'), [
            'first_name' => 'Juan', 'last_name' => 'Dela Cruz',
            'position' => 'Unknown', 'school' => 'Unknown',
            'email' => 'invalid', 'request_date' => 'not-a-date',
        ])->assertSessionHasErrors(['position', 'school', 'email', 'request_date']);
        $this->assertDatabaseCount('loi_requests', 0);
    }

    public function test_supplied_headers_import_without_email_and_repeated_sync_preserves_status(): void
    {
        $importer = app(GoogleSheetRequestImporter::class);
        $result = $importer->import($this->rows());
        $this->assertSame(1, $result['imported']);
        $this->assertSame(1, $result['missing_email']);
        $request = LoiRequest::firstOrFail();
        $this->assertSame('2026-10-21', $request->request_date->format('Y-m-d'));
        $this->assertSame('D.', $request->middle_name);
        $request->update(['status' => 'Completed']);
        $result = $importer->import($this->rows());
        $this->assertSame(0, $result['imported']);
        $this->assertSame(1, $result['skipped']);
        $this->assertSame('Completed', $request->fresh()->status);
        $this->assertDatabaseCount('loi_requests', 1);
    }

    public function test_reordering_and_new_submission_by_same_employee_are_handled(): void
    {
        $rows = $this->rows();
        $second = $rows[1];
        $second[0] = '10/22/2026 09:15:00';
        $rows[] = $second;
        $importer = app(GoogleSheetRequestImporter::class);
        $this->assertSame(1, $importer->import($rows)['imported']);
        $this->assertSame(2, $importer->import([$rows[0], $rows[2], $rows[1]])['skipped']);
        $this->assertDatabaseCount('loi_requests', 1);
    }

    public function test_bad_rows_can_be_corrected_and_resynced_without_reimporting_good_rows(): void
    {
        $rows = $this->rows();
        $bad = $rows[1];
        $bad[0] = '10/22/2026 09:15:00';
        $bad[1] = '';
        $rows[] = $bad;
        $rows[] = [''];
        $importer = app(GoogleSheetRequestImporter::class);
        $result = $importer->import($rows);
        $this->assertSame(1, $result['imported']);
        $this->assertSame(1, $result['invalid']);
        $this->assertStringContainsString('Row 3:', $result['issues'][0]);
        $rows[2][1] = 'Maria';
        $result = $importer->import($rows);
        $this->assertSame(1, $result['imported']);
        $this->assertSame(1, $result['skipped']);
    }

    public function test_sync_reads_csv_with_quoted_fields_and_returns_counts(): void
    {
        config(['google-sheets.sheet_id' => '']);
        Http::fake(['docs.google.com/*' => Http::response(
            "Timestamp,First Name,Middle Initial,Last Name,School,Position,Email Address\r\n10/21/2026 09:15:00,Juan,D.,Dela Cruz,\"School, Annex\",Teacher I,juan@example.com\r\n",
            200, ['Content-Type' => 'text/csv; charset=utf-8']
        )]);
        $this->actingAs(User::factory()->create())->post(route('requests.syncGoogleSheet'))
            ->assertSessionHasNoErrors()->assertSessionHas('google_sync_result.imported', 1)
            ->assertRedirect(route('requests.requested'));
        $this->assertDatabaseHas('loi_requests', ['school' => 'School, Annex', 'email' => 'juan@example.com']);
        Http::assertSentCount(1);
        Http::assertSent(fn ($request) => !str_contains($request->url(), 'gid='));
    }

    public function test_inaccessible_sheet_has_a_clear_error_and_no_writes(): void
    {
        Http::fake(['docs.google.com/*' => Http::response('private sheet', 403)]);
        $this->actingAs(User::factory()->create())->post(route('requests.syncGoogleSheet'))->assertSessionHasErrors('sync');
        $this->assertDatabaseCount('loi_requests', 0);
    }

    public function test_wrong_sheet_columns_do_not_import_partial_data(): void
    {
        Http::fake(['docs.google.com/*' => Http::response("Name,School\nJuan,School", 200, ['Content-Type' => 'text/csv'])]);
        $this->actingAs(User::factory()->create())->post(route('requests.syncGoogleSheet'))->assertSessionHasErrors('sync');
        $this->assertDatabaseCount('loi_requests', 0);
    }

    public function test_private_mode_requires_credentials_and_does_not_fall_back_to_public(): void
    {
        config(['google-sheets.access_mode' => 'service_account', 'google-sheets.credentials' => '/missing-google-key.json']);
        $this->actingAs(User::factory()->create())->post(route('requests.syncGoogleSheet'))->assertSessionHasErrors('sync');
        Http::assertNothingSent();
    }

    public function test_api_numeric_timestamp_matches_csv_submission_identity(): void
    {
        $importer = app(GoogleSheetRequestImporter::class);
        $importer->import($this->rows());
        $rows = $this->rows();
        $base = new \DateTimeImmutable('1899-12-30 00:00:00', new \DateTimeZone('UTC'));
        $date = new \DateTimeImmutable('2026-10-21 09:15:00', new \DateTimeZone('UTC'));
        $rows[1][0] = ($date->getTimestamp() - $base->getTimestamp()) / 86400;
        $this->assertSame(1, $importer->import($rows)['skipped']);
        $this->assertDatabaseCount('loi_requests', 1);
    }

    public function test_seeder_and_sync_share_duplicate_tracking_without_resetting_status(): void
    {
        Http::fake(['docs.google.com/*' => Http::response(
            "Timestamp,First Name,Middle Initial,Last Name,School,Position\n10/21/2026 09:15:00,Juan,D.,Dela Cruz,Example School,Teacher I\n",
            200, ['Content-Type' => 'text/csv']
        )]);
        $this->seed(\Database\Seeders\LoiRequestSeeder::class);
        $count = LoiRequest::count();
        $imported = LoiRequest::whereNotNull('google_source_key')->firstOrFail();
        $imported->update(['status' => 'Completed']);

        $this->seed(\Database\Seeders\LoiRequestSeeder::class);
        $this->assertSame($count, LoiRequest::count());
        $this->assertSame('Completed', $imported->fresh()->status);
        $this->assertSame(1, app(GoogleSheetRequestImporter::class)->import($this->rows())['skipped']);
    }

    public function test_day_first_sheet_seeding_imports_valid_employee_and_reports_invalid_name_and_initial(): void
    {
        config(['google-sheets.date_format' => 'd/m/Y']);
        Http::fake(['docs.google.com/*' => Http::response(
            "Timestamp,First Name: eg. (Juan),Middle Initial: eg. (D.),Last Name eg. (Dela Cruz),School ,Position : (Teacher I),Email\n21/10/2026 14:56:01,4wrwerwe,rwerwer,werwe,INHS,rwerwe,\n21/10/2026 15:04:11,Crizel Joy,A.,Simon,INHS,Principal IV,employee@example.com\n",
            200, ['Content-Type' => 'text/csv']
        )]);
        $this->seed(\Database\Seeders\LoiRequestSeeder::class);
        $request = LoiRequest::whereNotNull('google_source_key')->sole();
        $this->assertSame('Crizel Joy', $request->first_name);
        $this->assertSame('2026-10-21', $request->request_date->format('Y-m-d'));
        $this->assertSame('Principal IV', $request->position);
        $this->assertSame('Pending', $request->status);
        $this->actingAs(User::factory()->create())->post(route('requests.syncGoogleSheet'))
            ->assertSessionHas('google_sync_result.imported', 0)
            ->assertSessionHas('google_sync_result.skipped', 1)
            ->assertSessionHas('google_sync_result.invalid', 1)
            ->assertSessionHas('google_sync_result.issues', function ($issues) {
                return str_contains($issues[0], 'Row 2:')
                    && str_contains($issues[0], 'First name must')
                    && str_contains($issues[0], 'Middle initial must')
                    && !str_contains($issues[0], 'timestamp');
            });
    }

    public function test_ambiguous_dates_follow_the_configured_sheet_format(): void
    {
        $rows = $this->rows();
        $rows[1][0] = '05/10/2026 14:56:01';
        config(['google-sheets.date_format' => 'd/m/Y']);
        app(GoogleSheetRequestImporter::class)->import($rows);
        $this->assertSame('2026-10-05', LoiRequest::firstOrFail()->request_date->format('Y-m-d'));

        config(['google-sheets.date_format' => 'm/d/Y']);
        $rows[1][1] = 'Maria';
        app(GoogleSheetRequestImporter::class)->import($rows);
        $this->assertSame('2026-05-10', LoiRequest::where('first_name', 'Maria')->firstOrFail()->request_date->format('Y-m-d'));
    }

    public function test_impossible_day_first_date_is_rejected_without_overflow(): void
    {
        config(['google-sheets.date_format' => 'd/m/Y']);
        $rows = $this->rows();
        $rows[1][0] = '31/02/2026 14:56:01';
        $result = app(GoogleSheetRequestImporter::class)->import($rows);
        $this->assertSame(1, $result['invalid']);
        $this->assertStringContainsString('Expected DD/MM/YYYY', $result['issues'][0]);
        $this->assertDatabaseCount('loi_requests', 0);
    }

    public function test_name_validation_accepts_accents_apostrophes_hyphens_and_missing_initial(): void
    {
        $rows = $this->rows();
        $rows[1][1] = 'María-José';
        $rows[1][2] = '';
        $rows[1][3] = "D’Angelo O'Neil";
        $this->assertSame(1, app(GoogleSheetRequestImporter::class)->import($rows)['imported']);
    }
}
