<?php

namespace Database\Seeders;

use App\Models\Position;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Seed teaching positions used by the LOI request form.
     */
    public function run(): void
    {
        $positions = [
            'Teacher I',
            'Teacher II',
            'Teacher III',
            'Teacher IV',
            'Teacher V',
            'Teacher VI',
            'Teacher VII',
            'Master Teacher I',
            'Master Teacher II',
            'Master Teacher III',
            'Master Teacher IV',
            'Master Teacher V',
        ];

        foreach ($positions as $name) {
            Position::firstOrCreate(['name' => $name]);
        }
    }
}
