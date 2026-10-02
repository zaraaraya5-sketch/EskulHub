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
        // 1. Table: user_extracurriculars
        if (!Schema::hasTable('user_extracurriculars')) {
            Schema::create('user_extracurriculars', function (Blueprint $table) {
                $table->id();
                $table->string('user_id');
                $table->string('extracurricular_id');
                $table->string('role')->default('Anggota');
                $table->timestamps();

                $table->index(['user_id', 'extracurricular_id']);
            });
        }

        // 2. Table: events
        if (!Schema::hasTable('events')) {
            Schema::create('events', function (Blueprint $table) {
                $table->string('id')->primary();
                $table->string('title');
                $table->string('category'); // school_event, national_holiday, extracurricular_training, competition
                $table->string('extracurricular_id')->nullable();
                $table->dateTime('start_time');
                $table->dateTime('end_time');
                $table->string('location');
                $table->string('organizer');
                $table->text('description')->nullable();
                $table->timestamps();

                $table->index('category');
                $table->index('extracurricular_id');
                $table->index(['start_time', 'end_time']);
            });
        }

        // 3. Create or sync view/table for extracurriculars alias if needed
        if (!Schema::hasTable('extracurriculars')) {
            DB::statement('CREATE VIEW IF NOT EXISTS extracurriculars AS SELECT id, name, slug, category, short_description, full_description, profile_image, supervisor_name, practice_schedule, location, member_capacity, current_member_count, registration_status, achievements_count, created_at, updated_at FROM ekskuls;');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS extracurriculars;');
        Schema::dropIfExists('events');
        Schema::dropIfExists('user_extracurriculars');
    }
};
