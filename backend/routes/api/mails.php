<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Mails\MailController;

Route::middleware('auth:api')->prefix('mails')->name('mails.')->group(function () {

    Route::prefix('incoming')->name('incoming.')->group(function() {

        Route::get('/', [MailController::class, 'index'])->name('index');
        Route::get('/summary', [MailController::class, 'summary'])->name('summary');
        Route::post('/', [MailController::class, 'store'])->name('store');
        Route::get('/{id}', [MailController::class, 'show'])->name('show');
        Route::put('/{id}', [MailController::class, 'update'])->name('update');
        Route::delete('/{id}', [MailController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('outgoing')->name('outgoing.')->group(function() {

        Route::get('/', [MailController::class, 'index'])->name('index');
        Route::get('/summary', [MailController::class, 'summary'])->name('summary');
        Route::post('/', [MailController::class, 'store'])->name('store');
        Route::get('/{id}', [MailController::class, 'show'])->name('show');
        Route::put('/{id}', [MailController::class, 'update'])->name('update');
        Route::delete('/{id}', [MailController::class, 'destroy'])->name('destroy');
    });
});
