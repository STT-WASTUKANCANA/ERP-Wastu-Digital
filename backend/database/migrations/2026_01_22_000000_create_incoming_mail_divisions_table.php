<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('incoming_mail_divisions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('incoming_mail_id')->constrained('incoming_mails')->onDelete('cascade');
            $table->foreignId('division_id')->constrained('divisions')->onDelete('cascade');
            $table->timestamps();
        });

        // Migrate existing data
        $existingMails = DB::table('incoming_mails')->whereNotNull('division_id')->get();
        foreach ($existingMails as $mail) {
            DB::table('incoming_mail_divisions')->insert([
                'incoming_mail_id' => $mail->id,
                'division_id' => $mail->division_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('incoming_mail_divisions');
    }
};
