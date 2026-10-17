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
        // 1. ekskul_members
        Schema::table('ekskul_members', function (Blueprint $table) {
            $table->index(['extracurricular_id', 'student_id']);
            $table->index('student_id');
        });

        // 2. registrations
        Schema::table('registrations', function (Blueprint $table) {
            $table->index(['student_id', 'status']);
            $table->index(['extracurricular_id', 'status']);
        });

        // 3. attendance_sessions
        Schema::table('attendance_sessions', function (Blueprint $table) {
            $table->index(['extracurricular_id', 'session_date']);
        });

        // 4. attendance_records
        Schema::table('attendance_records', function (Blueprint $table) {
            $table->index('attendance_session_id');
            $table->index('student_id');
            $table->index(['student_id', 'status']);
        });

        // 5. activities
        Schema::table('activities', function (Blueprint $table) {
            $table->index('extracurricular_id');
        });

        // 6. achievements
        Schema::table('achievements', function (Blueprint $table) {
            $table->index('student_id');
            $table->index('extracurricular_id');
            $table->index('is_verified');
        });

        // 7. certificates
        Schema::table('certificates', function (Blueprint $table) {
            $table->index('student_id');
        });

        // 8. portfolio_verifications
        Schema::table('portfolio_verifications', function (Blueprint $table) {
            $table->index('student_id');
            $table->index('verification_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('portfolio_verifications', function (Blueprint $table) {
            $table->dropIndex(['student_id']);
            $table->dropIndex(['verification_id']);
        });

        Schema::table('certificates', function (Blueprint $table) {
            $table->dropIndex(['student_id']);
        });

        Schema::table('achievements', function (Blueprint $table) {
            $table->dropIndex(['student_id']);
            $table->dropIndex(['extracurricular_id']);
            $table->dropIndex(['is_verified']);
        });

        Schema::table('activities', function (Blueprint $table) {
            $table->dropIndex(['extracurricular_id']);
        });

        Schema::table('attendance_records', function (Blueprint $table) {
            $table->dropIndex(['attendance_session_id']);
            $table->dropIndex(['student_id']);
            $table->dropIndex(['student_id', 'status']);
        });

        Schema::table('attendance_sessions', function (Blueprint $table) {
            $table->dropIndex(['extracurricular_id', 'session_date']);
        });

        Schema::table('registrations', function (Blueprint $table) {
            $table->dropIndex(['student_id', 'status']);
            $table->dropIndex(['extracurricular_id', 'status']);
        });

        Schema::table('ekskul_members', function (Blueprint $table) {
            $table->dropIndex(['extracurricular_id', 'student_id']);
            $table->dropIndex(['student_id']);
        });
    }
};
