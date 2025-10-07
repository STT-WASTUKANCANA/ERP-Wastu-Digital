<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MailSeeder extends Seeder
{
    public function run(): void
    {
        // Seed mail_categories
        DB::table('mail_categories')->insert([
            [
                'user_id' => 1,
                'name' => 'Official Letter',
                'type' => '1', // Incoming Mail
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 1,
                'name' => 'Outgoing Report',
                'type' => '2', // Outgoing Mail
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        // Seed incoming_mails
        DB::table('incoming_mails')->insert([
            [
                'user_id' => 1,
                'number' => 'IN-001/2025',
                'category_id' => 1,
                'date' => '2025-10-06',
                'attachment' => 'incoming_001.pdf',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 1,
                'number' => 'IN-002/2025',
                'category_id' => 1,
                'date' => '2025-10-06',
                'attachment' => 'incoming_002.pdf',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);

        // Seed outgoing_mails
        DB::table('outgoing_mails')->insert([
            [
                'user_id' => 1,
                'number' => 'OUT-001/2025',
                'category_id' => 2,
                'date' => '2025-10-06',
                'attachment' => 'outgoing_001.pdf',
                'institute' => 'Department of Finance',
                'address' => 'Jl. Merdeka No. 45, Jakarta',
                'purpose' => 'Sending annual financial report',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 1,
                'number' => 'OUT-002/2025',
                'category_id' => 2,
                'date' => '2025-10-06',
                'attachment' => 'outgoing_002.pdf',
                'institute' => 'Education Office',
                'address' => 'Jl. Diponegoro No. 10, Bandung',
                'purpose' => 'Invitation to coordination meeting',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
