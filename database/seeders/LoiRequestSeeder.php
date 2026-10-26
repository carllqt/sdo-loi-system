<?php

namespace Database\Seeders;

use App\Models\LoiRequest;
use App\Services\EmployeeRequestIdentity;
use App\Services\GoogleSheetSync;
use Illuminate\Database\Seeder;

class LoiRequestSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(GoogleSheetSync $sync, EmployeeRequestIdentity $identity): void
    {
        // Uses the same configured response Sheet as the Requested module's sync button.
        $result = $sync->run();

        $requests = [
            [
                'first_name' => 'Maria',
                'gender' => 'Female',
                'middle_name' => 'Santos',
                'last_name' => 'Dela Cruz',
                'position' => 'Teacher I',
                'school' => 'Ilagan North Central School',
                'email' => 'maria.delacruz@example.com',
                'status' => 'Pending',
                'request_date' => '2026-09-22',
            ],
            [
                'first_name' => 'Juan',
                'gender' => 'Male',
                'middle_name' => 'Garcia',
                'last_name' => 'Reyes',
                'position' => 'Teacher II',
                'school' => 'Ilagan South Central School',
                'email' => 'juan.reyes@example.com',
                'status' => 'Processing',
                'request_date' => '2026-09-23',
            ],
            [
                'first_name' => 'Ana',
                'gender' => 'Female',
                'middle_name' => 'Lopez',
                'last_name' => 'Mendoza',
                'position' => 'Teacher I',
                'school' => 'San Felipe Elementary School',
                'email' => 'ana.mendoza@example.com',
                'status' => 'Pending',
                'request_date' => '2026-09-24',
            ],
            [
                'first_name' => 'Carlos',
                'gender' => 'Male',
                'middle_name' => 'Ramos',
                'last_name' => 'Santos',
                'position' => 'Teacher III',
                'school' => 'Ilagan West Central School',
                'email' => 'carlos.santos@example.com',
                'status' => 'Completed',
                'request_date' => '2026-09-25',
            ],
            [
                'first_name' => 'Liza',
                'gender' => 'Female',
                'middle_name' => 'Bautista',
                'last_name' => 'Navarro',
                'position' => 'Teacher I',
                'school' => 'Malalam-Malam Elementary School',
                'email' => 'liza.navarro@example.com',
                'status' => 'Pending',
                'request_date' => '2026-09-26',
            ],
            [
                'first_name' => 'Mark',
                'gender' => 'Male',
                'middle_name' => 'Villanueva',
                'last_name' => 'Garcia',
                'position' => 'Teacher II',
                'school' => 'Sta. Barbara Elementary School',
                'email' => 'mark.garcia@example.com',
                'status' => 'Processing',
                'request_date' => '2026-09-27',
            ],
            [
                'first_name' => 'Rosa',
                'gender' => 'Female',
                'middle_name' => 'Fernandez',
                'last_name' => 'Aquino',
                'position' => 'Teacher I',
                'school' => 'Naguilian Elementary School',
                'email' => 'rosa.aquino@example.com',
                'status' => 'Completed',
                'request_date' => '2026-09-28',
            ],
            [
                'first_name' => 'Kevin',
                'gender' => 'Male',
                'middle_name' => 'Dizon',
                'last_name' => 'Torres',
                'position' => 'Teacher III',
                'school' => 'San Antonio Elementary School',
                'email' => 'kevin.torres@example.com',
                'status' => 'Pending',
                'request_date' => '2026-09-29',
            ],
            [
                'first_name' => 'Elena',
                'gender' => 'Female',
                'middle_name' => 'Castillo',
                'last_name' => 'Flores',
                'position' => 'Teacher II',
                'school' => 'Baligatan Elementary School',
                'email' => 'elena.flores@example.com',
                'status' => 'Completed',
                'request_date' => '2026-09-30',
            ],
            [
                'first_name' => 'Robert',
                'gender' => 'Male',
                'middle_name' => 'Magsaysay',
                'last_name' => 'Cruz',
                'position' => 'Teacher I',
                'school' => 'Alibagu Elementary School',
                'email' => 'robert.cruz@example.com',
                'status' => 'Pending',
                'request_date' => '2026-10-01',
            ],
            [
                'first_name' => 'Sofia',
                'gender' => 'Female',
                'middle_name' => 'Rivera',
                'last_name' => 'Garcia',
                'position' => 'Teacher II',
                'school' => 'Ilagan Central School',
                'email' => 'sofia.garcia@example.com',
                'status' => 'Processing',
                'request_date' => '2026-10-01',
            ],
            [
                'first_name' => 'Daniel',
                'gender' => 'Male',
                'middle_name' => 'Aquino',
                'last_name' => 'Ramos',
                'position' => 'Teacher I',
                'school' => 'Calamagui Elementary School',
                'email' => 'daniel.ramos@example.com',
                'status' => 'Pending',
                'request_date' => '2026-10-01',
            ],
            [
                'first_name' => 'Patricia',
                'gender' => 'Female',
                'middle_name' => 'Lim',
                'last_name' => 'Domingo',
                'position' => 'Teacher III',
                'school' => 'San Vicente Elementary School',
                'email' => 'patricia.domingo@example.com',
                'status' => 'Completed',
                'request_date' => '2026-10-02',
            ],
            [
                'first_name' => 'Michael',
                'gender' => 'Male',
                'middle_name' => 'Tan',
                'last_name' => 'Santiago',
                'position' => 'Teacher II',
                'school' => 'Paliueg Elementary School',
                'email' => 'michael.santiago@example.com',
                'status' => 'Processing',
                'request_date' => '2026-10-02',
            ],
            [
                'first_name' => 'Christine',
                'gender' => 'Female',
                'middle_name' => 'Reyes',
                'last_name' => 'Villanueva',
                'position' => 'Teacher I',
                'school' => 'Rang-ayan Elementary School',
                'email' => 'christine.villanueva@example.com',
                'status' => 'Pending',
                'request_date' => '2026-10-02',
            ],
            [
                'first_name' => 'Anthony',
                'gender' => 'Male',
                'middle_name' => 'Dela Cruz',
                'last_name' => 'Mendoza',
                'position' => 'Teacher II',
                'school' => 'San Ignacio Elementary School',
                'email' => 'anthony.mendoza@example.com',
                'status' => 'Completed',
                'request_date' => '2026-10-03',
            ],
            [
                'first_name' => 'Jennifer',
                'gender' => 'Female',
                'middle_name' => 'Santos',
                'last_name' => 'Rivera',
                'position' => 'Teacher I',
                'school' => 'Fuyo Elementary School',
                'email' => 'jennifer.rivera@example.com',
                'status' => 'Processing',
                'request_date' => '2026-10-03',
            ],
            [
                'first_name' => 'Patrick',
                'gender' => 'Male',
                'middle_name' => 'Garcia',
                'last_name' => 'Navarro',
                'position' => 'Teacher III',
                'school' => 'Marana Elementary School',
                'email' => 'patrick.navarro@example.com',
                'status' => 'Pending',
                'request_date' => '2026-10-03',
            ],
            [
                'first_name' => 'Angela',
                'gender' => 'Female',
                'middle_name' => 'Lopez',
                'last_name' => 'Torres',
                'position' => 'Teacher II',
                'school' => 'San Pablo Elementary School',
                'email' => 'angela.torres@example.com',
                'status' => 'Completed',
                'request_date' => '2026-10-04',
            ],
            [
                'first_name' => 'Jonathan',
                'gender' => 'Male',
                'middle_name' => 'Bautista',
                'last_name' => 'Flores',
                'position' => 'Teacher I',
                'school' => 'Calaoacan Elementary School',
                'email' => 'jonathan.flores@example.com',
                'status' => 'Processing',
                'request_date' => '2026-10-04',
            ],
            [
                'first_name' => 'Michelle',
                'gender' => 'Female',
                'middle_name' => 'Castillo',
                'last_name' => 'Aquino',
                'position' => 'Teacher II',
                'school' => 'Lullutan Elementary School',
                'email' => 'michelle.aquino@example.com',
                'status' => 'Pending',
                'request_date' => '2026-10-04',
            ],
            [
                'first_name' => 'Steven',
                'gender' => 'Male',
                'middle_name' => 'Fernandez',
                'last_name' => 'Cruz',
                'position' => 'Teacher III',
                'school' => 'Centro Elementary School',
                'email' => 'steven.cruz@example.com',
                'status' => 'Completed',
                'request_date' => '2026-10-05',
            ],
            [
                'first_name' => 'Rachel',
                'gender' => 'Female',
                'middle_name' => 'Dizon',
                'last_name' => 'Reyes',
                'position' => 'Teacher I',
                'school' => 'San Andres Elementary School',
                'email' => 'rachel.reyes@example.com',
                'status' => 'Pending',
                'request_date' => '2026-10-05',
            ],
            [
                'first_name' => 'Brian',
                'gender' => 'Male',
                'middle_name' => 'Magsaysay',
                'last_name' => 'Santos',
                'position' => 'Teacher II',
                'school' => 'Cabannungan Elementary School',
                'email' => 'brian.santos@example.com',
                'status' => 'Processing',
                'request_date' => '2026-10-05',
            ],
            [
                'first_name' => 'Nicole',
                'gender' => 'Female',
                'middle_name' => 'Villanueva',
                'last_name' => 'Garcia',
                'position' => 'Teacher I',
                'school' => 'Fugu Elementary School',
                'email' => 'nicole.garcia@example.com',
                'status' => 'Completed',
                'request_date' => '2026-10-05',
            ],
            [
                'first_name' => 'Joshua',
                'gender' => 'Male',
                'middle_name' => 'Ramos',
                'last_name' => 'Dela Cruz',
                'position' => 'Teacher III',
                'school' => 'San Isidro Elementary School',
                'email' => 'joshua.delacruz@example.com',
                'status' => 'Pending',
                'request_date' => '2026-10-06',
            ],
            [
                'first_name' => 'Stephanie',
                'gender' => 'Female',
                'middle_name' => 'Domingo',
                'last_name' => 'Mendoza',
                'position' => 'Teacher II',
                'school' => 'Santa Isabel Elementary School',
                'email' => 'stephanie.mendoza@example.com',
                'status' => 'Processing',
                'request_date' => '2026-10-06',
            ],
            [
                'first_name' => 'Ryan',
                'gender' => 'Male',
                'middle_name' => 'Santiago',
                'last_name' => 'Aquino',
                'position' => 'Teacher I',
                'school' => 'San Juan Elementary School',
                'email' => 'ryan.aquino@example.com',
                'status' => 'Pending',
                'request_date' => '2026-10-06',
            ],
            [
                'first_name' => 'Catherine',
                'gender' => 'Female',
                'middle_name' => 'Rivera',
                'last_name' => 'Navarro',
                'position' => 'Teacher III',
                'school' => 'Villa Imelda Elementary School',
                'email' => 'catherine.navarro@example.com',
                'status' => 'Completed',
                'request_date' => '2026-10-06',
            ],
            [
                'first_name' => 'Edward',
                'gender' => 'Male',
                'middle_name' => 'Tan',
                'last_name' => 'Flores',
                'position' => 'Teacher II',
                'school' => 'San Lorenzo Elementary School',
                'email' => 'edward.flores@example.com',
                'status' => 'Processing',
                'request_date' => '2026-10-06',
            ],
        ];

        $sampleGendersUpdated = $identity->exclusively(function () use ($identity, $requests) {
            $employees = $identity->existingKeys();
            $updated = 0;
            foreach ($requests as $request) {
                $key = $identity->key($request);
                if (!isset($employees[$key])) {
                    LoiRequest::create($request);
                    $employees[$key] = true;
                } else {
                    // Only fill missing gender on these exact demo records.
                    // Never apply fictional seed genders to imported employees.
                    $samples = LoiRequest::query()
                        ->where('email', $request['email'])
                        ->whereNull('google_source_key')
                        ->where(fn ($query) => $query->whereNull('gender')->orWhere('gender', ''))
                        ->get();
                    foreach ($samples as $sample) {
                        if ($identity->key($sample->getAttributes()) === $key) {
                            $sample->update(['gender' => $request['gender']]);
                            $updated++;
                        }
                    }
                }
            }
            return $updated;
        });

        $this->command?->info("Gender filled for {$sampleGendersUpdated} existing sample requests.");
        $this->command?->info("Google Sheet: {$result['imported']} imported, {$result['skipped']} duplicates skipped, {$result['invalid']} invalid.");
        $this->command?->info("Gender filled for {$result['gender_updated']} existing requests.");
        foreach ($result['issues'] as $issue) {
            $this->command?->warn($issue);
        }
        if ($result['missing_email'] > 0) {
            $this->command?->warn("{$result['missing_email']} imported requests have no notification email address.");
        }
    }
}
