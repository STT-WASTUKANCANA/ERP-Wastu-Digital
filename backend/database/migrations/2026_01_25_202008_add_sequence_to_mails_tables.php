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
            $table->integer('sequence')->nullable()->after('number');
            $table->index(['sequence', 'date']); // For efficient querying of MAX(sequence) per year
        });

        Schema::table('decision_latters', function (Blueprint $table) {
            $table->integer('sequence')->nullable()->after('number');
            $table->index(['sequence', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('outgoing_mails', function (Blueprint $table) {
            $table->dropColumn('sequence');
        });

        Schema::table('decision_latters', function (Blueprint $table) {
            $table->dropColumn('sequence');
        });
    }
};
