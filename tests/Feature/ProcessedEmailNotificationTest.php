<?php

namespace Tests\Feature;

use App\Mail\LoiRequestProcessed;
use App\Models\LoiRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Mail\Mailer;
use Illuminate\Mail\MailManager;
use Illuminate\Mail\PendingMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Mockery;
use PHPUnit\Framework\Attributes\DataProvider;
use RuntimeException;
use Symfony\Component\Mailer\Exception\TransportException;
use Tests\TestCase;
use Throwable;

class ProcessedEmailNotificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'mail.default' => 'smtp',
            'mail.from.address' => 'notifications@school.test',
        ]);

        Mail::fake();
    }

    public function test_guests_cannot_send_notification_emails(): void
    {
        $request = $this->processingRequest();

        $this->post(route('requests.notifyProcessed', $request))
            ->assertRedirect(route('login'));

        Mail::assertNothingSent();
        $this->assertSame('Processing', $request->fresh()->status);
    }

    public function test_deleted_request_returns_a_toast_error_instead_of_a_not_found_page(): void
    {
        $request = $this->processingRequest();
        $requestId = $request->getKey();
        $request->delete();

        $this->postNotification($requestId)
            ->assertRedirect(route('requests.processing'))
            ->assertSessionHasErrors([
                'email_title' => 'Request not found',
                'email',
            ]);

        Mail::assertNothingSent();
    }

    #[DataProvider('invalidRequestProvider')]
    public function test_request_problems_return_specific_errors_without_sending(
        array $attributes,
        string $expectedTitle,
    ): void {
        $request = $this->processingRequest($attributes);

        $this->postNotification($request->getKey())
            ->assertRedirect(route('requests.processing'))
            ->assertSessionHasErrors([
                'email_title' => $expectedTitle,
                'email',
            ]);

        Mail::assertNothingSent();
        $this->assertSame($request->status, $request->fresh()->status);
        $this->assertNull($request->fresh()->processed_email_sent_at);
    }

    public static function invalidRequestProvider(): array
    {
        return [
            'missing email' => [['email' => ''], 'Email address missing'],
            'malformed email' => [['email' => 'employee-at-school'], 'Invalid email address'],
            'completed request' => [['status' => 'Completed'], 'Request is no longer processing'],
        ];
    }

    public function test_error_title_and_description_reach_the_inertia_errors_props(): void
    {
        $request = $this->processingRequest(['email' => 'employee-at-school']);

        $this->actingAs(User::factory()->create())
            ->from(route('requests.processing'))
            ->followingRedirects()
            ->post(route('requests.notifyProcessed', $request))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Processing/Index')
                ->where('errors.email_title', 'Invalid email address')
                ->where('errors.email', fn ($message) => is_string($message) && str_contains($message, 'Correct it'))
            );

        Mail::assertNothingSent();
    }

    #[DataProvider('invalidConfigurationProvider')]
    public function test_configuration_problems_return_specific_errors_without_sending(
        array $configuration,
        string $expectedTitle,
    ): void {
        config($configuration);
        $request = $this->processingRequest();

        $this->postNotification($request->getKey())
            ->assertRedirect(route('requests.processing'))
            ->assertSessionHasErrors([
                'email_title' => $expectedTitle,
                'email',
            ]);

        Mail::assertNothingSent();
        $this->assertSame('Processing', $request->fresh()->status);
        $this->assertNull($request->fresh()->processed_email_sent_at);
    }

    public static function invalidConfigurationProvider(): array
    {
        return [
            'log mailer' => [['mail.default' => 'log'], 'Email service is not configured'],
            'array mailer' => [['mail.default' => 'array'], 'Email service is not configured'],
            'missing mailer' => [['mail.default' => 'unconfigured'], 'Email service is not configured'],
            'placeholder sender' => [['mail.from.address' => 'hello@example.com'], 'Sender email is not configured'],
            'malformed sender' => [['mail.from.address' => 'school-notifications'], 'Sender email is not configured'],
        ];
    }

    #[DataProvider('transportFailureProvider')]
    public function test_transport_failures_return_actionable_safe_errors(
        Throwable $exception,
        string $expectedTitle,
    ): void {
        $request = $this->processingRequest();
        $this->failMailWith($exception, $request);

        $this->postNotification($request->getKey())
            ->assertRedirect(route('requests.processing'))
            ->assertSessionHasErrors([
                'email_title' => $expectedTitle,
                'email',
            ]);

        $description = session('errors')->first('email');
        $this->assertNotEmpty($description);
        $this->assertStringNotContainsString('re_private_secret_for_test', $description);
        $this->assertStringNotContainsString('C:\\private\\credentials.json', $description);
        $this->assertStringNotContainsString('owner@private.test', $description);
        $this->assertSame('Processing', $request->fresh()->status);
        $this->assertNull($request->fresh()->processed_email_sent_at);
    }

    public static function transportFailureProvider(): array
    {
        $providerError = static fn (int $status, string $message): TransportException => new TransportException(
            'Unable to send the notification.', 0, new RuntimeException($message, $status),
        );

        return [
            'nested certificate error' => [
                new TransportException('Unable to send the notification.', 0, new RuntimeException(
                    'cURL error 60: SSL certificate problem: unable to get local issuer certificate',
                )),
                'Secure connection failed',
            ],
            'test sender restriction' => [
                $providerError(403, 'You can only send testing emails to your own email address (owner@private.test).'),
                'Test sender restriction',
            ],
            'unverified domain' => [
                $providerError(403, 'The school.test domain is not verified. Please add and verify your domain.'),
                'Sender domain is not verified',
            ],
            'invalid api key' => [
                $providerError(401, 'API key is invalid: re_private_secret_for_test'),
                'Email service authentication failed',
            ],
            'rate limit' => [
                $providerError(429, 'Too many requests. Please try again later.'),
                'Too many email requests',
            ],
            'recipient mailbox rejected' => [
                $providerError(422, 'Recipient address rejected: mailbox not found'),
                'Recipient email was rejected',
            ],
            'provider rejects recipient format' => [
                $providerError(422, 'Invalid `to` field. The email address needs a valid format.'),
                'Recipient email was rejected',
            ],
            'missing provider resource is not a missing mailbox' => [
                $providerError(404, 'The requested resource was not found.'),
                'Email service resource not found',
            ],
            'nested provider error without status metadata' => [
                $providerError(0, 'Unexpected provider error with re_private_secret_for_test'),
                'Could not send notification email',
            ],
            'transport status without nested provider exception' => [
                new TransportException('Upstream unavailable', 503),
                'Email service is temporarily unavailable',
            ],
            'transport rate limit without nested provider exception' => [
                new TransportException('Upstream request frequency exceeded', 429),
                'Too many email requests',
            ],
            'unknown failure does not expose raw exception' => [
                new RuntimeException('Failed loading C:\\private\\credentials.json with re_private_secret_for_test'),
                'Could not send notification email',
            ],
        ];
    }

    public function test_success_sends_the_notification_and_preserves_processing_status(): void
    {
        $this->freezeTime();
        $request = $this->processingRequest();

        $this->postNotification($request->getKey())
            ->assertRedirect(route('requests.processing'))
            ->assertSessionHasNoErrors();

        Mail::assertSent(LoiRequestProcessed::class, fn (LoiRequestProcessed $mail) => $mail->hasTo($request->email) && $mail->loiRequest->is($request)
        );
        Mail::assertSentCount(1);
        Mail::assertNothingQueued();
        $this->assertSame('Processing', $request->fresh()->status);
        $this->assertTrue($request->fresh()->processed_email_sent_at->equalTo(now()->startOfSecond()));
    }

    public function test_completion_requires_a_successful_email_even_if_the_client_submits_a_sent_timestamp(): void
    {
        $request = $this->processingRequest();

        $this->actingAs(User::factory()->create())
            ->from(route('requests.processing'))
            ->patch(route('requests.complete', $request), ['processed_email_sent_at' => now()->toISOString()])
            ->assertRedirect(route('requests.processing'))
            ->assertSessionHasErrors([
                'request' => 'Send the employee notification email before moving this request to Completed.',
            ]);

        $this->assertSame('Processing', $request->fresh()->status);
        $this->assertNull($request->fresh()->processed_email_sent_at);
        Mail::assertNothingSent();
    }

    public function test_sent_status_reaches_both_modules_and_is_preserved_when_completed(): void
    {
        $this->freezeTime();
        $request = $this->processingRequest();

        $this->postNotification($request->getKey())->assertSessionHasNoErrors();
        $sentAt = $request->fresh()->processed_email_sent_at->toISOString();

        $this->get(route('requests.processing'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Processing/Index')
                ->where('requests.data.0.processed_email_sent_at', $sentAt)
            );

        $this->from(route('requests.processing'))
            ->patch(route('requests.complete', $request))
            ->assertRedirect(route('requests.processing'))
            ->assertSessionHasNoErrors();

        $this->assertSame('Completed', $request->fresh()->status);
        $this->assertSame($sentAt, $request->fresh()->processed_email_sent_at->toISOString());

        $this->get(route('requests.completed'))
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('Completed/Index')
                ->where('requests.data.0.processed_email_sent_at', $sentAt)
            );

        Mail::assertSentCount(1);
    }

    public function test_failed_resend_preserves_the_previous_successful_send_timestamp(): void
    {
        $sentAt = now()->subDay()->startOfSecond();
        $request = $this->processingRequest(['processed_email_sent_at' => $sentAt]);
        $this->failMailWith(new TransportException('Connection refused'), $request);

        $this->postNotification($request->getKey())
            ->assertSessionHasErrors('email');

        $this->assertTrue($request->fresh()->processed_email_sent_at->equalTo($sentAt));
    }

    private function processingRequest(array $attributes = []): LoiRequest
    {
        return LoiRequest::factory()->create(array_merge([
            'email' => 'employee@school.test',
            'status' => 'Processing',
        ], $attributes));
    }

    private function postNotification(int $requestId): TestResponse
    {
        return $this->actingAs(User::factory()->create())
            ->from(route('requests.processing'))
            ->post(route('requests.notifyProcessed', $requestId));
    }

    private function failMailWith(Throwable $exception, LoiRequest $request): void
    {
        $pendingMail = Mockery::mock(PendingMail::class);
        $pendingMail->shouldReceive('send')
            ->once()
            ->with(Mockery::on(fn ($mail) => $mail instanceof LoiRequestProcessed && $mail->loiRequest->is($request)))
            ->andThrow($exception);

        $mailer = Mockery::mock(Mailer::class);
        $mailer->shouldReceive('to')->once()->with($request->email)->andReturn($pendingMail);

        $manager = Mockery::mock(MailManager::class);
        $manager->shouldReceive('mailer')->once()->with('smtp')->andReturn($mailer);
        Mail::swap($manager);
    }
}
