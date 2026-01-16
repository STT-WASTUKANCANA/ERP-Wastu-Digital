<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DivisionSeeder extends Seeder
{
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('divisions')->truncate();
        Schema::enableForeignKeyConstraints();

        $divisions = [
            ['id' => 1, 'name' => 'STT WASTUKANCANA', 'active' => 1],
            ['id' => 2, 'name' => 'PSI, Simpus, Com, CAD', 'active' => 1],
            ['id' => 3, 'name' => 'AKADEMIK', 'active' => 1],
            ['id' => 4, 'name' => 'SDM, KEU, SARPRAS', 'active' => 1],
            ['id' => 5, 'name' => 'KMH HUMAS & HUBIN', 'active' => 1],
            ['id' => 6, 'name' => 'PUSAT KERJASAMA, USAHA DAN LSP', 'active' => 1],
            ['id' => 7, 'name' => 'PUSAT SPMI', 'active' => 1],
            ['id' => 8, 'name' => 'PUSAT PPM', 'active' => 1],
            ['id' => 9, 'name' => 'PUSAT KARIR DAN KWU', 'active' => 1],
            ['id' => 10, 'name' => 'PRODI', 'active' => 1],
            ['id' => 11, 'name' => 'LAB', 'active' => 1],
            ['id' => 12, 'name' => 'BENGKEL', 'active' => 1],
            ['id' => 13, 'name' => 'TATALAKSANA', 'active' => 1],
            ['id' => 14, 'name' => 'PD DIKTI & PULAHTA', 'active' => 1],
            ['id' => 15, 'name' => 'PERPUSTAKAAN', 'active' => 1],
            ['id' => 16, 'name' => 'K3', 'active' => 1],
            ['id' => 17, 'name' => 'TEKNISI', 'active' => 1],
            ['id' => 18, 'name' => 'KEPEGAWAIAN', 'active' => 1],
            ['id' => 19, 'name' => 'KEMAHASISWAAN', 'active' => 1],
            ['id' => 20, 'name' => 'PUSAT PENGOLAHAN DATA', 'active' => 1],
            ['id' => 21, 'name' => 'KEUANGAN', 'active' => 1],
            ['id' => 22, 'name' => 'PRODI TEKNIK INFORMATIKA', 'active' => 1],
            ['id' => 23, 'name' => 'PRODI TEKNIK MESIN', 'active' => 1],
            ['id' => 24, 'name' => 'PRODI TEKNIK INDUSTRI', 'active' => 1],
            ['id' => 25, 'name' => 'PRODI TEKNIK TEKSTIL', 'active' => 1],
            ['id' => 26, 'name' => 'PRODI MANAJEMEN INDUSTRI', 'active' => 1],
            ['id' => 27, 'name' => 'STAF SEKERTARIS UMUM', 'active' => 1],
            ['id' => 28, 'name' => 'STAF KHUSUS BIDANG HUMAS DAN HUBIN', 'active' => 1],
            ['id' => 29, 'name' => 'STAF KHUSUS BIDANG KONEKSI DAN JARINGAN INTERNET', 'active' => 1],
        ];

        foreach ($divisions as $division) {
            DB::table('divisions')->insert([
                'id' => $division['id'],
                'name' => $division['name'],
                'active' => $division['active'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
