<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('incoming_mails', function (Blueprint $table) {
            $table->enum('status', ['1', '2', '3'])
                ->default('1')
                ->after('attachment')
                ->comment('1 = Sekum Review, 2 = Division Follow Up, 3 = Done');
            $table->enum('follow_status', ['1', '2', '3'])
                ->default('1')
                ->after('status')
                ->comment('1 = Pending, 2 = Progress, 3 = Done');
        });
    }

    public function down(): void
    {
        Schema::table('incoming_mails', function (Blueprint $table) {
            $table->dropColumn(['status', 'follow_status']);
        });
    }
};
