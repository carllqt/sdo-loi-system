<?php

namespace App\Mail;

use App\Models\LoiRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LoiRequestProcessed extends Mailable
{
    use Queueable, SerializesModels;

    public string $employeeName;

    public function __construct(public LoiRequest $loiRequest)
    {
        $this->employeeName = trim(implode(' ', array_filter([
            $loiRequest->first_name,
            $loiRequest->middle_name,
            $loiRequest->last_name,
        ])));
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Letter of Introduction request has been processed',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.loi-request-processed',
        );
    }
}
