<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        $roles = [
            ['id' => 1, 'name' => 'Tata Laksana', 'description' => 'Role Tata Laksana'],
            ['id' => 2, 'name' => 'Sekum', 'description' => 'Role Sekum'],
            ['id' => 3, 'name' => 'Pulahta', 'description' => 'Role Pulahta'],
            ['id' => 4, 'name' => 'Bidang', 'description' => 'Role Bidang'],
        ];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['id' => $role['id']],
                [
                    'name' => $role['name'],
                    'description' => $role['description']
                ]
            );
        }

        $users = [
            ['id' => 1, 'name' => 'Tata Laksana', 'email' => 'tatalaksana@gmail.com', 'password' => 'Minimal8@', 'role_id' => '1'],
            ['id' => 2, 'name' => 'Sekum', 'email' => 'sekum@gmail.com', 'password' => 'Minimal8@', 'role_id' => '2'],
            ['id' => 3, 'name' => 'Pulahta', 'email' => 'pulahta@gmail.com', 'password' => 'Minimal8@', 'role_id' => '3'],
            ['id' => 4, 'name' => 'Bidang', 'email' => 'bidang@gmail.com', 'password' => 'Minimal8@', 'role_id' => '3', 'division_id' => 1],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['id' => $user['id']],
                $user
            );
        }
    }
}
