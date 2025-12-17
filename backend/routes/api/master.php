<?php

use App\Http\Controllers\Api\Master\DivisionController;
use App\Http\Controllers\Api\Master\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')
    ->prefix('master')
    ->name('master.')
    ->group(function () {

        Route::prefix('division')
            ->name('division.')
            ->controller(DivisionController::class)
            ->group(function () {

                Route::get('/', 'index')->name('index');
                Route::post('/', 'store')->name('store');
                Route::get('/{id}', 'show')->name('show');
                Route::put('/{id}', 'update')->name('update');
                Route::delete('/{id}', 'destroy')->name('destroy');
            });

        Route::prefix('users')
            ->name('users.')
            ->controller(UserController::class)
            ->group(function () {

                Route::get('/', 'index')->name('index');
                Route::post('/', 'store')->name('store');
                Route::get('/{id}', 'show')->name('show');
                Route::put('/{id}', 'update')->name('update');
                Route::delete('/{id}', 'destroy')->name('destroy');
            });
    });
