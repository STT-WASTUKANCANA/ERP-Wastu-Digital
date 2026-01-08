<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('outgoing_mails', function (Blueprint $table) {
            $table->enum('status', ['1', '2', '3', '4'])->default('1')->after('purpose')->comment('1=Verifikasi Sekum, 2=Perlu Perbaikan, 3=Disetujui, 4=Ditolak');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('outgoing_mails', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
