<?php

namespace Database\Seeders;

use App\Models\LoiRequest;
use Illuminate\Database\Seeder;

class LoiRequestSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $requests = [
            [
                'first_name' => 'Maria',
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
                'middle_name' => 'Magsaysay',
                'last_name' => 'Cruz',
                'position' => 'Teacher I',
                'school' => 'Alibagu Elementary School',
                'email' => 'robert.cruz@example.com',
                'status' => 'Pending',
                'request_date' => '2026-10-01',
            ],
        ];

        foreach ($requests as $request) {
            LoiRequest::create($request);
        }
    }
}
