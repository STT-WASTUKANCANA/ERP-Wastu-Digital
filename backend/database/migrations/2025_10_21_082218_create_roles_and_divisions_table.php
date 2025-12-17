<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('divisions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique();
            $table->string('description')->nullable();
            $table->unsignedBigInteger('leader_id');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('leader_id')
                    ->references('id')->on('users')
                    ->onDelete('cascade');
        });

    }
    public function down(): void
    {
        Schema::dropIfExists('divisions');
        Schema::dropIfExists('roles');
    }
};
