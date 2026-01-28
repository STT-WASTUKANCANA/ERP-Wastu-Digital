<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::name('api.')->group(function () {

    // Muat file rute modular
    require __DIR__ . '/api/auth.php';

    require __DIR__ . '/api/manage.php';

    require __DIR__ . '/api/master.php';
    require __DIR__ . '/api/master.php';
    require __DIR__ . '/api/mails.php';
    require __DIR__ . '/api/dashboard.php';
});
