<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ekskuls', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category');
            $table->text('short_description');
            $table->text('full_description')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('supervisor_name');
            $table->string('chairman_name');
            $table->string('schedule_day');
            $table->string('schedule_time');
            $table->string('location');
            $table->integer('max_quota');
            $table->integer('current_members')->default(0);
            $table->boolean('is_registration_open')->default(true);
            $table->json('syllabus')->nullable();
            $table->json('achievements')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ekskuls');
    }
};
