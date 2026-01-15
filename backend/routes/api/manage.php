<?php

use App\Http\Controllers\Api\Manage\DivisionController;
use App\Http\Controllers\Api\Manage\UserController;
use App\Models\Role;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')
    ->prefix('manage')
    ->name('manage.')
    ->group(function () {

        // Daftar role sederhana untuk dropdown
        Route::get('/role', function () {
            return response()->json(['data' => Role::all()]);
        })->name('role.index');

        // Manajemen Divisi
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

        // Manajemen Pengguna
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
