<?php

namespace Database\Factories;

use App\Models\LoiRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LoiRequest>
 */
class LoiRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $gender = fake()->randomElement(['Male', 'Female']);
        return [
            'first_name' => fake()->firstName(strtolower($gender)),
            'middle_name' => fake()->lastName(),
            'last_name' => fake()->lastName(),
            'gender' => $gender,
            'position' => 'Teacher I',
            'school' => 'Example School',
            'email' => fake()->unique()->safeEmail(),
            'status' => 'Pending',
            'request_date' => now()->toDateString(),
        ];
    }
}
