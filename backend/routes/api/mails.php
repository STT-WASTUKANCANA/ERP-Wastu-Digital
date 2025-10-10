<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Mails\IncomingController;

Route::middleware('auth:api')->prefix('mails')->name('mails.')->group(function () {
    
    Route::name('incoming.')->group(function() {

        Route::get('incoming', [IncomingController::class, 'index'])->name('index');
        Route::get('incoming/summary', [IncomingController::class, 'summary'])->name('summary');
        Route::post('incoming', [IncomingController::class, 'store'])->name('store');
        Route::get('incoming/{id}', [IncomingController::class, 'show'])->name('show');
        Route::put('incoming/{id}', [IncomingController::class, 'update'])->name('update');
        Route::delete('incoming/{id}', [IncomingController::class, 'destroy'])->name('destroy');
    });
});
