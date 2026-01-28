<?php

use App\Http\Controllers\Api\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')
    ->prefix('dashboard')
    ->name('dashboard.')
    ->group(function () {
        Route::get('/stats', [DashboardController::class, 'index'])->name('stats');
    });
