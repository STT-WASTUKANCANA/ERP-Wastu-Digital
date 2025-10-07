<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mail_categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('name', 100);
            $table->enum('type', ['1', '2'])->comment('1 = Incoming Mail, 2 = Outgoing Mail');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('incoming_mails', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('number', 100);
            $table->unsignedBigInteger('category_id');
            $table->date('date');
            $table->string('attachment', 255);
            $table->timestamps();
            $table->softDeletes();

            // Foreign key
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });

        Schema::create('outgoing_mails', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('number', 100);
            $table->unsignedBigInteger('category_id');
            $table->date('date');
            $table->string('attachment', 255);
            $table->string('institute', 100);
            $table->text('address');
            $table->string('purpose', 255);
            $table->timestamps();
            $table->softDeletes();

            // Foreign key
            $table->foreign('user_id')
                ->references('id')->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('outgoing_mails');
        Schema::dropIfExists('incoming_mails');
        Schema::dropIfExists('category_mails');
    }
};
