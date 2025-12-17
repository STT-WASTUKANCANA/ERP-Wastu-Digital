<?php

use App\Http\Controllers\Api\Master\MailCategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')
    ->prefix('master')
    ->name('master.')
    ->group(function () {
        Route::apiResource('mail-category', MailCategoryController::class);
    });
