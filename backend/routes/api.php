<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EkskulController;
use App\Http\Controllers\RegistrationController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AchievementController;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\QuestionnaireController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/login', function () {
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login');

// ==========================================
// 1. Public Routes (Throttled & Read-only)
// ==========================================
Route::middleware(['throttle:15,1'])->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
});

// Public Catalog, Calendar, Settings, and Verification
Route::get('/ekskul', [EkskulController::class, 'index']);
Route::get('/ekskul/{slug}', [EkskulController::class, 'show']);
Route::get('/ekskul/{id}/members', [EkskulController::class, 'getMembers']);
Route::get('/members', [EkskulController::class, 'allMembers']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/settings', [SettingsController::class, 'get']);
Route::get('/verification/{id}', [VerificationController::class, 'show']);
Route::get('/questionnaire', [QuestionnaireController::class, 'index']);
Route::post('/questionnaire/submit', [QuestionnaireController::class, 'submit'])->middleware('throttle:30,1');

// Public Read-Only data with privacy sanitization in controllers
Route::get('/users', [AuthController::class, 'index']);
Route::get('/achievements', [AchievementController::class, 'index']);

// ==========================================
// 2. Authenticated Routes (Requires Validated Sanctum Bearer Token)
// ==========================================
Route::middleware(['hybrid.auth', 'throttle:60,1'])->group(function () {
    // Auth & Profile
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile/{id}', [AuthController::class, 'updateProfile']);

    // Protected data listings (Isolated by student_id or restricted to staff)
    Route::get('/certificates', [CertificateController::class, 'index']);
    Route::get('/verifications', [VerificationController::class, 'index']);
    Route::get('/attendance/sessions', [AttendanceController::class, 'getSessions']);
    Route::get('/attendance/records', [AttendanceController::class, 'getRecords']);

    // Registrations & Achievements creation
    Route::get('/registrations', [RegistrationController::class, 'index']);
    Route::post('/registrations', [RegistrationController::class, 'store']);
    Route::post('/achievements', [AchievementController::class, 'store']);


    // ==========================================
    // 3. Operational Staff (Pengurus, Pembina, Guru, Teacher, Admin)
    // ==========================================
    Route::middleware(['role:pengurus,pembina,guru,teacher,admin'])->group(function () {
        Route::put('/registrations/{id}/status', [RegistrationController::class, 'updateStatus']);
        Route::post('/attendance/sessions', [AttendanceController::class, 'createSession']);
        Route::post('/attendance/records', [AttendanceController::class, 'saveRecord']);
        Route::post('/ekskul/{id}/members', [EkskulController::class, 'addMember']);
        Route::delete('/ekskul/members/{memberId}', [EkskulController::class, 'removeMember']);
        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);
        Route::post('/events/import-excel', [EventController::class, 'importExcel']);
    });

    // ==========================================
    // 4. Verification Authority (Pengurus, Admin)
    // ==========================================
    Route::middleware(['role:pengurus,admin'])->group(function () {
        Route::post('/verification', [VerificationController::class, 'store']);
    });

    // ==========================================
    // 4. Pedagogical & Advisory Staff (Pembina, Guru, Teacher, Admin)
    // ==========================================
    Route::middleware(['role:pembina,guru,teacher,admin'])->group(function () {
        Route::put('/achievements/{id}/verify', [AchievementController::class, 'verify']);
        Route::post('/certificates', [CertificateController::class, 'store']);
        Route::delete('/certificates/{id}', [CertificateController::class, 'destroy']);
        Route::post('/ekskul', [EkskulController::class, 'store']);
        Route::put('/ekskul/{id}', [EkskulController::class, 'update']);
        Route::delete('/ekskul/{id}', [EkskulController::class, 'destroy']);
    });

    // ==========================================
    // 5. High-Privilege Administration (Admin only)
    // ==========================================
    Route::middleware(['role:admin'])->group(function () {
        Route::post('/users', [AuthController::class, 'store']);
        Route::put('/users/{id}', [AuthController::class, 'update']);
        Route::delete('/users/{id}', [AuthController::class, 'destroy']);
        Route::put('/settings', [SettingsController::class, 'update']);
        Route::delete('/achievements/{id}', [AchievementController::class, 'destroy']);
    });
});
