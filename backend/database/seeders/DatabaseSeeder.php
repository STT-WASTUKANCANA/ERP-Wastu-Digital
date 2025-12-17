<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\MailCategory;
use App\Models\Workspace\Mails\MailCategory as MailsMailCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
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
            ['id' => 1, 'name' => 'Administrator', 'email' => 'admin@gmail.com', 'password' => 'Minimal8@'],
            ['id' => 2, 'name' => 'Tata Laksana', 'email' => 'tatalaksana@gmail.com', 'password' => 'Minimal8@', 'role_id' => 1],
            ['id' => 3, 'name' => 'Sekum', 'email' => 'sekum@gmail.com', 'password' => 'Minimal8@', 'role_id' => 2],
            ['id' => 4, 'name' => 'Pulahta', 'email' => 'pulahta@gmail.com', 'password' => 'Minimal8@', 'role_id' => 3],
            ['id' => 5, 'name' => 'Bidang', 'email' => 'bidang@gmail.com', 'password' => 'Minimal8@', 'role_id' => 3, 'division_id' => 1],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['id' => $user['id']],
                [
                    'name' => $user['name'],
                    'email' => $user['email'],
                    'password' => Hash::make($user['password']),
                    'role_id' => $user['role_id'] ?? null,
                    'division_id' => $user['division_id'] ?? null,
                ]
            );
        }

        $mailCategories = [
            ['id' => 1, 'user_id' => 1, 'name' => 'Kategori Surat Masuk 1', 'type' => 1],
            ['id' => 2, 'user_id' => 1, 'name' => 'Kategori Surat Masuk 2', 'type' => 1],
            ['id' => 3, 'user_id' => 1, 'name' => 'Kategori Surat Keluar 1', 'type' => 2],
            ['id' => 4, 'user_id' => 1, 'name' => 'Kategori Surat Keluar 2', 'type' => 2],
            ['id' => 5, 'user_id' => 1, 'name' => 'Kategori Surat Keputusan 1', 'type' => 3],
            ['id' => 6, 'user_id' => 1, 'name' => 'Kategori Surat Keputusan 2', 'type' => 3],
        ];

        foreach ($mailCategories as $category) {
            MailsMailCategory::updateOrCreate(
                ['id' => $category['id']],
                $category
            );
        }
    }
}
