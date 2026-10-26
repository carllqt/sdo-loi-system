<?php

namespace App\Support;

use Illuminate\Support\Str;
use Resend\Exceptions\ErrorException;
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
        $type = '';
        $status = 0;

        do {
            $messages[] = $exception->getMessage();
            $code = (int) $exception->getCode();

            if ($status === 0 && $code >= 400 && $code <= 599) {
                $status = $code;
            }

            if ($exception instanceof ErrorException) {
                try {
                    $type = $exception->getErrorType();
                    $status = $exception->getErrorCode();
                } catch (Throwable) {
                    // Some SDK error payloads contain only a message; use the safe fallback.
                }
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
                'This test sender can only email the Resend account owner. Ask your administrator to use a verified sending domain for employee notifications.',
            ],
            Str::contains($message, ['domain is not verified', 'domain is unverified']) => [
                'Sender domain is not verified',
                'The sending domain has not been verified. Ask your administrator to verify it in Resend before sending.',
            ],
            $type === 'invalid_from_address' || Str::contains($message, ['invalid `from`', 'invalid from address']) => [
                'Sender email is not configured',
                'The sender email address is invalid. Ask your administrator to use an address on a verified sending domain.',
            ],
            in_array($type, ['missing_api_key', 'invalid_api_key', 'restricted_api_key', 'suspended_api_key', 'invalid_access', 'invalid_permission'], true)
                || $status === 401 || Str::contains($message, ['api key is invalid', 'invalid api key', 'api key is not active']) => [
                    'Email service authentication failed',
                    'The email service rejected the configured credentials or permissions. Ask your administrator to check the Resend API key.',
                ],
            in_array($type, ['daily_quota_exceeded', 'monthly_quota_exceeded'], true)
                || Str::contains($message, ['sending quota', 'daily email limit', 'monthly email limit']) => [
                    'Email sending limit reached',
                    'The email sending allowance has been used up. Wait for it to reset or ask your administrator to review the email plan.',
                ],
            $type === 'rate_limit_exceeded' || $status === 429 => [
                'Too many email requests',
                'The email service is receiving requests too quickly. Wait a moment before trying again.',
            ],
            Str::contains($message, ['invalid `to`', 'invalid recipient', 'invalid email address', 'recipient address rejected', 'mailbox not found', 'recipient not found', 'no such user']) => [
                'Recipient email was rejected',
                'The email service rejected the recipient address. Confirm the employee email address and correct it before trying again.',
            ],
            $type === 'not_found' || $status === 404 => [
                'Email service resource not found',
                'The email service could not find the requested resource. Ask your administrator to check the email configuration.',
            ],
            in_array($type, ['application_error', 'internal_server_error', 'service_unavailable'], true) || $status >= 500 => [
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
