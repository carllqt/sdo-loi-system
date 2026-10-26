<?php

namespace App\Services;

use Google\Auth\Credentials\ServiceAccountCredentials;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\ValidationException;
use Psr\Http\Message\RequestInterface;
use Throwable;

class GoogleSheetReader
{
    public function rows(): array
    {
        $id = (string) config('google-sheets.spreadsheet_id');
        $tab = (string) config('google-sheets.sheet_id');
        if (!preg_match('/^[a-zA-Z0-9_-]+$/', $id) || ($tab !== '' && !ctype_digit($tab))) {
            $this->fail('Configure the Google Sheet and its response tab before syncing.');
        }

        try {
            return config('google-sheets.access_mode') === 'public'
                ? $this->publicRows($id, $tab)
                : $this->privateRows($id, $tab);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable) {
            // Do not expose Google responses, tokens, keys or employee data in errors.
            $this->fail('Could not connect to Google Sheets. Check the internet connection, credentials and trusted certificates, then try again.');
        }
    }

    private function client(): PendingRequest
    {
        return Http::connectTimeout(10)->timeout(30)->withOptions([
            'verify' => config('google-sheets.ca_bundle') ?: true,
        ]);
    }

    private function publicRows(string $id, string $tab): array
    {
        $response = $this->client()->get("https://docs.google.com/spreadsheets/d/{$id}/export", array_filter([
            'format' => 'csv', 'gid' => $tab,
        ], fn ($value) => $value !== ''));
        if (!$response->successful() || !str_contains(strtolower($response->header('Content-Type')), 'text/csv')) {
            $this->fail('The response sheet is not accessible through its link. Configure a service account with Viewer access if the sheet is private.');
        }

        $stream = fopen('php://temp', 'r+');
        try {
            fwrite($stream, $response->body());
            rewind($stream);
            $rows = [];
            while (($row = fgetcsv($stream, 0, ',', '"', '')) !== false) {
                $rows[] = $row;
            }
            return $rows;
        } finally {
            fclose($stream);
        }
    }

    protected function authorizedClient(): PendingRequest
    {
        $path = config('google-sheets.credentials');
        if (!$path || !is_file($path) || !is_readable($path)) {
            $this->fail('The Google service-account JSON file is missing. Set GOOGLE_SHEETS_CREDENTIALS to its local path.');
        }
        $key = json_decode(file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
        if (($key['type'] ?? '') !== 'service_account' || empty($key['client_email']) || empty($key['private_key'])) {
            $this->fail('Use a Google service-account JSON key, not an OAuth client configuration.');
        }

        $scope = 'https://www.googleapis.com/auth/spreadsheets.readonly';
        $credentials = new ServiceAccountCredentials($scope, $key);
        $token = $credentials->fetchAuthToken(function (RequestInterface $request) {
            return $this->client()->send($request->getMethod(), (string) $request->getUri(), [
                'headers' => $request->getHeaders(),
                'body' => (string) $request->getBody(),
            ])->toPsrResponse();
        });
        if (empty($token['access_token'])) {
            $this->fail('Google could not authenticate the service account. Check the credentials file.');
        }

        return $this->client()->withToken($token['access_token']);
    }

    private function privateRows(string $id, string $tab): array
    {
        $client = $this->authorizedClient();
        $metadata = $client->get("https://sheets.googleapis.com/v4/spreadsheets/{$id}", [
            'fields' => 'sheets.properties(sheetId,title)',
        ]);
        if (!$metadata->successful()) {
            $this->fail('Google could not open the Sheet. Enable Google Sheets API and share the Sheet with the service-account email as Viewer.');
        }
        $sheets = collect($metadata->json('sheets', []));
        $sheet = $tab === '' ? $sheets->first() : $sheets->first(fn ($sheet) => (string) $sheet['properties']['sheetId'] === $tab);
        if (!$sheet) {
            $this->fail('The configured response tab was not found. Check GOOGLE_SHEETS_TAB_ID.');
        }
        $range = rawurlencode("'".str_replace("'", "''", $sheet['properties']['title'])."'!A:ZZ");
        $response = $client->get("https://sheets.googleapis.com/v4/spreadsheets/{$id}/values/{$range}", [
            'valueRenderOption' => 'UNFORMATTED_VALUE',
            'dateTimeRenderOption' => 'SERIAL_NUMBER',
        ]);
        if (!$response->successful()) {
            $this->fail('Google could not read the response rows. Try syncing again.');
        }
        return $response->json('values', []);
    }

    private function fail(string $message): never
    {
        throw ValidationException::withMessages(['sync' => $message]);
    }
}
