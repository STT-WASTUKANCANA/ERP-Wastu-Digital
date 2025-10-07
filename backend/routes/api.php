<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;

Route::name('api.')->group(function () {

    Route::prefix('auth')->name('auth.')->group(function () {

        Route::post('signup', [AuthController::class, 'signup'])->name('signup');
        Route::post('signin', [AuthController::class, 'signin'])->name('signin');
    
        Route::middleware('auth:api')->group(function () {

            Route::post('profile', [AuthController::class, 'profile'])->name('profile');
            Route::post('signout', [AuthController::class, 'signout'])->name('signout');
            Route::post('refresh', [AuthController::class, 'refresh'])->name('refresh');
        });
    });
});
