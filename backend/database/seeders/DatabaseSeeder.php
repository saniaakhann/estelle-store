<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProductSeeder::class,
        ]);

        User::updateOrCreate(
            ['email' => 'saniakhan94392@gmail.com'],
            [
                'name' => 'Sania Khan',
                'role' => 'admin',
                'password' => Str::random(32),
            ]
        );
    }
}