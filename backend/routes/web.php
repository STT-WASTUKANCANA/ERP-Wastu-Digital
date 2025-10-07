<?php

use App\Http\Controllers\API\Mails\MailController;
use Illuminate\Support\Facades\Route;

Route::get('/', [MailController::class, 'index'])->name('index');
