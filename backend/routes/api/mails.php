<?php

use App\Http\Controllers\Api\Mails\CategoryController;
use App\Http\Controllers\Api\Mails\MailController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')
    ->prefix('mails')
    ->name('mails.')
    ->group(function () {

        // CRUD kategori global
        Route::prefix('categories')->name('categories.')->group(function () {
            Route::post('/', [CategoryController::class, 'store'])->name('store');
            Route::get('/{category}', [CategoryController::class, 'show'])->name('show');
            Route::put('/{category}', [CategoryController::class, 'update'])->name('update');
            Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');
        });

        // Tipe-tipe surat yang didukung
        $types = [
            'incoming',
            'outgoing',
            'decision',
        ];

        // Loop untuk membuat rute dinamis per tipe surat
        foreach ($types as $type) {
            Route::prefix($type)
                ->name($type . '.')
                ->group(function () use ($type) {

                    Route::get('/category', [CategoryController::class, 'index'])->name('category');

                    Route::controller(MailController::class)->group(function () use ($type) {

                        Route::get('/', 'index')->name('index');
                        Route::get('/summary', 'summary')->name('summary');
                        Route::get('/latest-number', 'latestNumber')->name('latestNumber');
                        Route::post('/', 'store')->name('store');
                        Route::post('/export', 'export')->name('export');
                        Route::get('/{id}', 'show')->name('show');
                        Route::put('/{id}', 'update')->name('update');
                        Route::delete('/{id}', 'destroy')->name('destroy');

                        if ($type === 'incoming') {
                            // Rute khusus review surat masuk
                            Route::put('/review/{id}', 'review')->name('review');
                            Route::put('/division-review/{id}', 'review')->name('divisionReview');
                        }

                        if ($type === 'outgoing') {
                            // Rute validasi surat keluar
                            Route::put('/validate/{id}', 'validateOutgoing')->name('validate');
                        }
                    });
                });
        }
    });
