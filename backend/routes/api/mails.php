<?php

use App\Http\Controllers\Api\Mails\CategoryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Mails\MailController;

Route::middleware('auth:api')
    ->prefix('mails')
    ->name('mails.')
    ->group(function () {

        Route::controller(CategoryController::class)
            ->prefix('categories')
            ->name('categories.')
            ->group(function () {
                Route::post('/', 'store')->name('store');
                Route::get('/{category}', 'show')->name('show');
                Route::put('/{category}', 'update')->name('update');
                Route::delete('/{category}', 'destroy')->name('destroy');
            });

        Route::prefix('incoming')
            ->name('incoming.')
            ->group(function () {

                Route::get('/category', [CategoryController::class, 'index'])->name('category');

                Route::controller(MailController::class)
                    ->group(function () {

                        Route::get('/', 'index')->name('index');
                        Route::get('/summary', 'summary')->name('summary');
                        Route::post('/', 'store')->name('store');
                        Route::put('/review/{id}', 'review')->name('review');
                        Route::get('/{id}', 'show')->name('show');
                        Route::put('/{id}', 'update')->name('update');
                        Route::delete('/{id}', 'destroy')->name('destroy');
                    });
            });

        Route::prefix('outgoing')
            ->name('outgoing.')
            ->group(function () {

                Route::get('/category', [CategoryController::class, 'index'])->name('category');

                Route::controller(MailController::class)
                    ->group(function () {

                        Route::get('/', 'index')->name('index');
                        Route::get('/summary', 'summary')->name('summary');
                        Route::post('/', 'store')->name('store');
                        Route::get('/{id}', 'show')->name('show');
                        Route::put('/{id}', 'update')->name('update');
                        Route::delete('/{id}', 'destroy')->name('destroy');
                    });
            });
    });
