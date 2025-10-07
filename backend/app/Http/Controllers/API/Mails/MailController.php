<?php

namespace App\Http\Controllers\API\Mails;

use App\Http\Controllers\Controller;
use App\Models\Dashboard\Mail\IncomingMail;
use App\Models\Dashboard\Mail\OutgoingMail;
use Illuminate\Http\Request;

class MailController extends Controller
{
    public function index() {

        $data['incoming_mails'] = IncomingMail::with('mail_category')->latest()->get();
        $data['outgoing_mails'] = OutgoingMail::with('mail_category')->latest()->get();
    
        dd($data);
    }
}
