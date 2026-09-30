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

// 1. Authentication & Users
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::put('/auth/profile/{id}', [AuthController::class, 'updateProfile']);
Route::get('/users', [AuthController::class, 'index']);
Route::post('/users', [AuthController::class, 'store']);
Route::put('/users/{id}', [AuthController::class, 'update']);
Route::delete('/users/{id}', [AuthController::class, 'destroy']);

// 2. Extracurriculars & Members
Route::get('/ekskul', [EkskulController::class, 'index']);
Route::get('/ekskul/{slug}', [EkskulController::class, 'show']);
Route::post('/ekskul', [EkskulController::class, 'store']);
Route::put('/ekskul/{id}', [EkskulController::class, 'update']);
Route::delete('/ekskul/{id}', [EkskulController::class, 'destroy']);
Route::get('/ekskul/{id}/members', [EkskulController::class, 'getMembers']);
Route::get('/members', [EkskulController::class, 'allMembers']);
Route::post('/ekskul/{id}/members', [EkskulController::class, 'addMember']);
Route::delete('/ekskul/members/{memberId}', [EkskulController::class, 'removeMember']);

// 3. Registrations
Route::get('/registrations', [RegistrationController::class, 'index']);
Route::post('/registrations', [RegistrationController::class, 'store']);
Route::put('/registrations/{id}/status', [RegistrationController::class, 'updateStatus']);

// 4. Attendance
Route::get('/attendance/sessions', [AttendanceController::class, 'getSessions']);
Route::post('/attendance/sessions', [AttendanceController::class, 'createSession']);
Route::get('/attendance/records', [AttendanceController::class, 'getRecords']);
Route::post('/attendance/records', [AttendanceController::class, 'saveRecord']);

// 5. School Events
Route::get('/events', [EventController::class, 'index']);
Route::post('/events', [EventController::class, 'store']);
Route::put('/events/{id}', [EventController::class, 'update']);
Route::delete('/events/{id}', [EventController::class, 'destroy']);

// 6. Achievements
Route::get('/achievements', [AchievementController::class, 'index']);
Route::post('/achievements', [AchievementController::class, 'store']);
Route::put('/achievements/{id}/verify', [AchievementController::class, 'verify']);
Route::delete('/achievements/{id}', [AchievementController::class, 'destroy']);

// 7. Certificates
Route::get('/certificates', [CertificateController::class, 'index']);
Route::post('/certificates', [CertificateController::class, 'store']);
Route::delete('/certificates/{id}', [CertificateController::class, 'destroy']);

// 8. Verification & Portfolios
Route::get('/verification/{id}', [VerificationController::class, 'show']);
Route::post('/verification', [VerificationController::class, 'store']);

// 9. School Settings
Route::get('/settings', [SettingsController::class, 'get']);
Route::put('/settings', [SettingsController::class, 'update']);
