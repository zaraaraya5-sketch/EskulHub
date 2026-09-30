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
        // 1. School Settings
        Schema::create('school_settings', function (Blueprint $table) {
            $table->id();
            $table->string('school_name');
            $table->string('npsn');
            $table->string('address');
            $table->string('academic_year');
            $table->string('principal_name');
            $table->string('vice_principal_student_affairs');
            $table->timestamps();
        });

        // 2. Extracurricular Members
        Schema::create('ekskul_members', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('extracurricular_id');
            $table->string('student_id');
            $table->string('student_name');
            $table->string('student_nisn');
            $table->string('student_class');
            $table->string('role')->default('Anggota');
            $table->string('joined_at')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        // 3. Registrations
        Schema::create('registrations', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('extracurricular_id');
            $table->string('extracurricular_name');
            $table->string('student_id');
            $table->string('student_name');
            $table->string('student_class');
            $table->string('student_nisn');
            $table->string('registration_date');
            $table->string('status')->default('pending');
            $table->text('reason')->nullable();
            $table->text('notes')->nullable();
            $table->string('reviewer_name')->nullable();
            $table->string('reviewed_at')->nullable();
            $table->timestamps();
        });

        // 4. Attendance Sessions
        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('extracurricular_id');
            $table->string('extracurricular_name');
            $table->string('title');
            $table->string('session_date');
            $table->string('start_time');
            $table->string('end_time');
            $table->string('location');
            $table->text('notes')->nullable();
            $table->string('created_by_name');
            $table->integer('total_members')->default(0);
            $table->integer('present_count')->default(0);
            $table->integer('late_count')->default(0);
            $table->integer('excused_count')->default(0);
            $table->integer('absent_count')->default(0);
            $table->timestamps();
        });

        // 5. Attendance Records
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('attendance_session_id');
            $table->string('session_title');
            $table->string('session_date');
            $table->string('extracurricular_name');
            $table->string('student_id');
            $table->string('student_name');
            $table->string('status')->default('present'); // present, late, excused, absent
            $table->text('notes')->nullable();
            $table->string('verified_by_name')->nullable();
            $table->timestamps();
        });

        // 6. School Events
        Schema::create('school_events', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('title');
            $table->string('event_type')->nullable();
            $table->string('category')->nullable();
            $table->string('status')->nullable();
            $table->string('location');
            $table->string('start_datetime');
            $table->string('end_datetime');
            $table->text('description')->nullable();
            $table->string('organizer');
            $table->timestamps();
        });

        // 7. Activities
        Schema::create('activities', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('extracurricular_id');
            $table->string('extracurricular_name');
            $table->string('title');
            $table->string('activity_date');
            $table->text('description')->nullable();
            $table->string('location');
            $table->json('documentation_urls')->nullable();
            $table->integer('participant_count')->default(0);
            $table->string('created_by_name');
            $table->timestamps();
        });

        // 8. Achievements
        Schema::create('achievements', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('extracurricular_id')->nullable();
            $table->string('extracurricular_name')->nullable();
            $table->string('student_id');
            $table->string('student_name');
            $table->string('title');
            $table->string('competition_name');
            $table->string('level');
            $table->string('rank');
            $table->string('achievement_date');
            $table->string('certificate_url')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->string('verified_by_name')->nullable();
            $table->string('verified_at')->nullable();
            $table->timestamps();
        });

        // 9. Certificates
        Schema::create('certificates', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('student_id');
            $table->string('title');
            $table->string('issuer');
            $table->string('issue_date');
            $table->string('file_url')->nullable();
            $table->string('certificate_number')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });

        // 10. Portfolio Verifications
        Schema::create('portfolio_verifications', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('student_id');
            $table->string('student_name');
            $table->string('student_nisn');
            $table->string('student_class');
            $table->string('school_name');
            $table->string('verification_id')->unique();
            $table->string('academic_year');
            $table->string('issue_date');
            $table->string('status')->default('verified');
            $table->string('qr_code_url')->nullable();
            $table->string('verified_by_name');
            $table->json('summary_data')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_verifications');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('school_events');
        Schema::dropIfExists('attendance_records');
        Schema::dropIfExists('attendance_sessions');
        Schema::dropIfExists('registrations');
        Schema::dropIfExists('ekskul_members');
        Schema::dropIfExists('school_settings');
    }
};
