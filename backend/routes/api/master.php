<?php

use App\Http\Controllers\Api\Master\MailCategoryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')
    ->prefix('master')
    ->name('master.')
    ->group(function () {
        Route::apiResource('mail-category', MailCategoryController::class);
        Route::post('mail-category/export', [MailCategoryController::class, 'export'])->name('mail-category.export');
    });
