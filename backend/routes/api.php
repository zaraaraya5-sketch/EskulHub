<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EkskulController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ekskul', [EkskulController::class, 'index']);
Route::get('/ekskul/{slug}', [EkskulController::class, 'show']);
