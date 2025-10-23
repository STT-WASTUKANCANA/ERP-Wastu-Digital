<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DivisionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('divisions')->insert([
            ['name' => 'Rektorat', 'description' => 'Mengelola kebijakan umum dan tata kelola universitas'],
            ['name' => 'Wakil Rektor Bidang Akademik', 'description' => 'Menangani kegiatan akademik dan kurikulum'],
            ['name' => 'Wakil Rektor Bidang Keuangan dan SDM', 'description' => 'Mengelola keuangan dan sumber daya manusia'],
            ['name' => 'Fakultas Teknik', 'description' => 'Koordinasi akademik dan administrasi fakultas teknik'],
            ['name' => 'Fakultas Ekonomi dan Bisnis', 'description' => 'Koordinasi akademik dan administrasi fakultas ekonomi'],
            ['name' => 'Biro Akademik dan Kemahasiswaan', 'description' => 'Administrasi kegiatan akademik dan kemahasiswaan'],
            ['name' => 'Biro Umum dan Keuangan', 'description' => 'Pengelolaan sarana, prasarana, dan keuangan universitas'],
            ['name' => 'LPPM', 'description' => 'Mengelola penelitian dan pengabdian kepada masyarakat'],
            ['name' => 'UPT TIK', 'description' => 'Mengelola sistem informasi dan teknologi universitas'],
            ['name' => 'Humas dan Kerjasama', 'description' => 'Komunikasi publik dan hubungan eksternal universitas'],
        ]);
    }
}
