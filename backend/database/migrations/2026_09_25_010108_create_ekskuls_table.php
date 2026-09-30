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
            $table->string('supervisor_id')->nullable();
            $table->string('chairperson_name')->nullable();
            $table->string('practice_schedule')->nullable();
            $table->string('location')->nullable();
            $table->integer('member_capacity')->default(30);
            $table->integer('current_member_count')->default(0);
            $table->string('registration_status')->default('open');
            $table->integer('achievements_count')->default(0);
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
