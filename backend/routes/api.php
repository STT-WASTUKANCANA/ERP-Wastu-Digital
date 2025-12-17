<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Support\Facades\Route;

Route::name('api.')->group(function () {

    require __DIR__ . '/api/auth.php';

    require __DIR__ . '/api/manage.php';

    require __DIR__ . '/api/mails.php';
});
