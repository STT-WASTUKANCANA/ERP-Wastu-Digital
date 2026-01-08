<?php

namespace App\Mail;

use App\Models\Workspace\Mails\IncomingMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DispositionNotification extends Mailable
{
    use Queueable, SerializesModels;

    public IncomingMail $mail;
    public string $note;

    /**
     * Create a new message instance.
     */
    public function __construct(IncomingMail $mail, string $note)
    {
        $this->mail = $mail;
        $this->note = $note;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Disposisi Surat Masuk: ' . $this->mail->number,
        );
    }
    
    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.disposition_notification',
            with: [
                'leaderName' => $this->mail->division->leader->name ?? 'Kepala Bidang',
                'mailNumber' => $this->mail->number,
                'category'   => $this->mail->mail_category->name ?? '-',
                'date'       => $this->mail->date->format('d F Y'),
                'desc'       => $this->note,
                'url'        => env('FRONTEND_URL', 'http://localhost:3000') . '/workspace/mail/incoming?id=' . $this->mail->id,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
