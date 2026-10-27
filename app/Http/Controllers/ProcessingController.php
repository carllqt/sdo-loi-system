<?php

namespace App\Http\Controllers;

use App\Mail\LoiRequestProcessed;
use App\Models\LoiRequest;
use App\Support\EmailNotificationError;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class ProcessingController extends Controller
{
    public function index(Request $request): Response
    {
        $requests = LoiRequest::query()
            ->where('status', 'Processing')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Processing/Index', [
            'requests' => $requests,
        ]);
    }

    public function moveToCompleted(LoiRequest $loiRequest): RedirectResponse
    {
        if ($loiRequest->status === 'Processing' && ! $loiRequest->processed_email_sent_at) {
            return back()->withErrors([
                'request' => 'Send the employee notification email before moving this request to Completed.',
            ]);
        }

        $updated = LoiRequest::query()
            ->whereKey($loiRequest->getKey())
            ->where('status', 'Processing')
            ->whereNotNull('processed_email_sent_at')
            ->update(['status' => 'Completed']);

        if (! $updated) {
            return back()->withErrors([
                'request' => 'Only processing requests can be moved to completed.',
            ]);
        }

        return back();
    }

    public function sendProcessedEmail(LoiRequest $loiRequest): RedirectResponse
    {
        if ($loiRequest->status !== 'Processing') {
            return back()->withErrors([
                'email_title' => 'Request is no longer processing',
                'email' => 'Only processing requests can receive this notification. Refresh the page to see the current status.',
            ]);
        }

        if (blank($loiRequest->email)) {
            return back()->withErrors([
                'email_title' => 'Email address missing',
                'email' => 'This request has no email address. Add the employee email address before sending.',
            ]);
        }

        if (! filter_var($loiRequest->email, FILTER_VALIDATE_EMAIL)) {
            return back()->withErrors([
                'email_title' => 'Invalid email address',
                'email' => 'The employee email address has an invalid format. Correct it before sending.',
            ]);
        }

        $mailer = config('mail.default');
        $transport = config("mail.mailers.{$mailer}.transport");

        if (blank($transport) || in_array($transport, ['log', 'array'], true)) {
            return back()->withErrors([
                'email_title' => 'Email service is not configured',
                'email' => 'The email service is not set up yet. Ask your administrator to configure an outgoing mail service.',
            ]);
        }

        $fromAddress = strtolower((string) config('mail.from.address'));
        if (! filter_var($fromAddress, FILTER_VALIDATE_EMAIL) || str_ends_with($fromAddress, '@example.com')) {
            return back()->withErrors([
                'email_title' => 'Sender email is not configured',
                'email' => 'Ask your administrator to set a valid sender email address for the configured mail service.',
            ]);
        }

        try {
            Mail::mailer($mailer)
                ->to($loiRequest->email)
                ->send(new LoiRequestProcessed($loiRequest));

            $loiRequest->forceFill(['processed_email_sent_at' => now()])->save();
        } catch (Throwable $exception) {
            report($exception);

            return back()->withErrors(EmailNotificationError::fromException($exception));
        }

        return back();
    }
}
