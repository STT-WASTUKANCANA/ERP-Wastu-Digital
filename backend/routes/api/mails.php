<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\Mails\IncomingController;

Route::middleware('auth:api')->prefix('mails')->name('mails.')->group(function () {
    
    Route::get('incoming', [IncomingController::class, 'index'])->name('incoming.index');
    Route::post('incoming', [IncomingController::class, 'store'])->name('incoming.store');
    Route::get('incoming/{id}', [IncomingController::class, 'show'])->name('incoming.show');
    Route::put('incoming/{id}', [IncomingController::class, 'update'])->name('incoming.update');
    Route::delete('incoming/{id}', [IncomingController::class, 'destroy'])->name('incoming.destroy');
});
