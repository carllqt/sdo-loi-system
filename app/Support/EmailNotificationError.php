<?php

namespace App\Support;

use Illuminate\Support\Str;
use Throwable;

class EmailNotificationError
{
    /**
     * Translate wrapped mail errors without exposing provider responses or credentials.
     *
     * @return array{email_title: string, email: string}
     */
    public static function fromException(Throwable $exception): array
    {
        $messages = [];
        $status = 0;

        do {
            $messages[] = $exception->getMessage();
            $code = (int) $exception->getCode();

            if ($status === 0 && $code >= 400 && $code <= 599) {
                $status = $code;
            }
        } while ($exception = $exception->getPrevious());

        $message = strtolower(implode(' ', $messages));

        [$title, $description] = match (true) {
            Str::contains($message, ['curl error 60', 'ssl certificate problem', 'certificate verify failed']) => [
                'Secure connection failed',
                'The server could not verify the email service certificate. Ask your administrator to check the server certificate settings.',
            ],
            Str::contains($message, ['curl error 28', 'timed out', 'timeout']) => [
                'Email request timed out',
                'The email service did not respond in time. Check the email delivery log before retrying to avoid sending a duplicate.',
            ],
            Str::contains($message, ['curl error 6:', 'curl error 7:', 'could not resolve host', 'connection refused', 'failed to connect']) => [
                'Email service could not be reached',
                'The server could not connect to the email service. Check the connection and try again.',
            ],
            Str::contains($message, ['only send testing emails', 'only send emails to your own']) => [
                'Test sender restriction',
                'This test sender can only email approved recipients. Ask your administrator to enable sending to employee email addresses.',
            ],
            Str::contains($message, ['domain is not verified', 'domain is unverified']) => [
                'Sender domain is not verified',
                'The sending domain has not been verified. Ask your administrator to verify it with the email service before sending.',
            ],
            Str::contains($message, ['invalid `from`', 'invalid from address']) => [
                'Sender email is not configured',
                'The sender email address is invalid. Ask your administrator to use an address on a verified sending domain.',
            ],
            $status === 401 || Str::contains($message, ['api key is invalid', 'invalid api key', 'api key is not active', 'failed to authenticate', 'authentication failed']) => [
                'Email service authentication failed',
                'The email service rejected the configured credentials or permissions. Ask your administrator to check the mail service credentials.',
            ],
            Str::contains($message, ['sending quota', 'daily email limit', 'monthly email limit']) => [
                'Email sending limit reached',
                'The email sending allowance has been used up. Wait for it to reset or ask your administrator to review the email plan.',
            ],
            $status === 429 => [
                'Too many email requests',
                'The email service is receiving requests too quickly. Wait a moment before trying again.',
            ],
            Str::contains($message, ['invalid `to`', 'invalid recipient', 'invalid email address', 'recipient address rejected', 'mailbox not found', 'recipient not found', 'no such user']) => [
                'Recipient email was rejected',
                'The email service rejected the recipient address. Confirm the employee email address and correct it before trying again.',
            ],
            $status === 404 => [
                'Email service resource not found',
                'The email service could not find the requested resource. Ask your administrator to check the email configuration.',
            ],
            $status >= 500 => [
                'Email service is temporarily unavailable',
                'The email service is having a problem. Try again later.',
            ],
            default => [
                'Could not send notification email',
                'An unexpected error prevented the notification. Ask your administrator to check the email error log before retrying.',
            ],
        };

        return ['email_title' => $title, 'email' => $description];
    }
}
