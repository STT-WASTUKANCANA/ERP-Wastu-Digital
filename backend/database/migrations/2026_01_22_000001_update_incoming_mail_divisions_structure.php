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
        // 1. Add user_view_id to pivot table
        Schema::table('incoming_mail_divisions', function (Blueprint $table) {
            $table->unsignedBigInteger('user_view_id')->nullable()->after('division_id');
            $table->foreign('user_view_id')->references('id')->on('users')->onDelete('set null');
        });

        // 2. Migrate existing data
        // We assume division_id still exists on incoming_mails at this point
        $mails = DB::table('incoming_mails')->whereNotNull('user_view_id')->get();
        
        foreach ($mails as $mail) {
            // Find the corresponding pivot entry. 
            // We migrated data based on mail->division_id previously.
            if ($mail->division_id) {
                DB::table('incoming_mail_divisions')
                    ->where('incoming_mail_id', $mail->id)
                    ->where('division_id', $mail->division_id)
                    ->update(['user_view_id' => $mail->user_view_id]);
            }
        }

        // 3. Drop columns from incoming_mails
        Schema::table('incoming_mails', function (Blueprint $table) {
            // Drop foreign keys first. Laravel standard naming is table_column_foreign
            $table->dropForeign(['user_view_id']); 
            // division_id might not have FK constraint in previous migration, but check just in case or try/catch.
            // Based on file inspection, division_id was just bigInteger, no foreign key defined in create_mails_table
            // But if it was added later with FK, we should drop it. 
            // create_incoming_mail_divisions_table used constrained(), so pivot has FK.
            // incoming_mails.division_id likely has no FK based on inspection of create_mails_table.php step 18.
            
            $table->dropColumn(['division_id', 'user_view_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('incoming_mails', function (Blueprint $table) {
            $table->bigInteger('division_id')->nullable();
            $table->unsignedBigInteger('user_view_id')->nullable();
            // Re-add FKs if needed
             $table->foreign('user_view_id')->references('id')->on('users')->onDelete('set null');
        });

        Schema::table('incoming_mail_divisions', function (Blueprint $table) {
            $table->dropForeign(['user_view_id']);
            $table->dropColumn('user_view_id');
        });
    }
};
