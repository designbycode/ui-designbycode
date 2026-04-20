<?php

namespace Database\Factories;

use App\Models\Social;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Social>
 */
class SocialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'provider' => 'github',
            'provider_id' => (string) $this->faker->unique()->randomNumber(),
            'avatar' => $this->faker->imageUrl(),
        ];
    }
}
