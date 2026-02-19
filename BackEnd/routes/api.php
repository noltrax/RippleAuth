<?php

use App\Http\Controllers\LoginController;

Route::post('/auth/identify', [LoginController::class, 'identify']);
Route::post('/auth/verify', [LoginController::class, 'verify']);

