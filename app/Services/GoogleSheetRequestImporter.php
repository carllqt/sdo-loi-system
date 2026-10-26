<?php

namespace App\Services;

use App\Models\LoiRequest;
use Carbon\CarbonImmutable;
use DateTimeImmutable;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class GoogleSheetRequestImporter
{
    public function __construct(private EmployeeRequestIdentity $identity) {}

    public function import(array $rows): array
    {
        $result = ['imported' => 0, 'skipped' => 0, 'invalid' => 0, 'missing_email' => 0, 'gender_updated' => 0, 'issues' => []];
        if (!$rows) {
            return $result;
        }

        $columns = [];
        $middleInitialOnly = false;
        foreach (array_shift($rows) as $index => $heading) {
            $heading = Str::lower(trim(preg_replace('/[^\pL\pN]+/u', ' ', (string) $heading)));
            $field = match (true) {
                $heading === 'timestamp', str_starts_with($heading, 'submission time') => 'timestamp',
                str_starts_with($heading, 'first name') => 'first_name',
                str_starts_with($heading, 'middle name'), str_starts_with($heading, 'middle initial') => 'middle_name',
                str_starts_with($heading, 'last name'), str_starts_with($heading, 'surname') => 'last_name',
                $heading === 'gender', str_starts_with($heading, 'gender '), $heading === 'sex' => 'gender',
                str_starts_with($heading, 'school') => 'school',
                str_starts_with($heading, 'position') => 'position',
                str_starts_with($heading, 'email'), str_starts_with($heading, 'e mail') => 'email',
                default => null,
            };
            if ($field !== null) {
                if (isset($columns[$field])) {
                    throw ValidationException::withMessages(['sync' => "More than one column matches {$field}. Give each response field a single column."]);
                }
                $columns[$field] = $index;
                if ($field === 'middle_name') {
                    $middleInitialOnly = str_starts_with($heading, 'middle initial');
                }
            }
        }
        $missing = array_diff(['timestamp', 'first_name', 'last_name', 'gender', 'school', 'position'], array_keys($columns));
        if ($missing) {
            throw ValidationException::withMessages(['sync' => 'Missing Sheet columns: '.implode(', ', $missing).'.']);
        }

        $dateFormat = config('google-sheets.date_format', 'd/m/Y');
        if (!in_array($dateFormat, ['d/m/Y', 'm/d/Y'], true)) {
            throw ValidationException::withMessages(['sync' => 'GOOGLE_SHEETS_DATE_FORMAT must be d/m/Y or m/d/Y.']);
        }
        $expectedDate = $dateFormat === 'd/m/Y' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
        $namePattern = '/^[\p{L}][\p{L}\p{M}\s.\x{0027}\x{2019}-]*$/u';

        return $this->identity->exclusively(function () use ($rows, $columns, $result, $middleInitialOnly, $dateFormat, $expectedDate, $namePattern) {
            $employees = LoiRequest::query()->get(['id', 'first_name', 'middle_name', 'last_name', 'gender'])
                ->groupBy(fn ($request) => $this->identity->key($request->getAttributes()));
            foreach ($rows as $offset => $row) {
                if (!array_filter($row, fn ($value) => trim((string) $value) !== '')) {
                    continue;
                }
                $data = [];
                foreach (['first_name', 'middle_name', 'last_name', 'gender', 'school', 'position', 'email'] as $field) {
                    $data[$field] = isset($columns[$field]) ? trim((string) ($row[$columns[$field]] ?? '')) : '';
                }
                $data['gender'] = ucfirst(Str::lower($data['gender']));
                $timestamp = $this->timestamp($row[$columns['timestamp']] ?? null, $dateFormat);
                $validator = Validator::make($data, [
                    'first_name' => ['required', 'string', 'max:255', 'regex:'.$namePattern],
                    'middle_name' => ['nullable', 'string', 'max:255', 'regex:'.($middleInitialOnly ? '/^\p{L}\p{M}*\.?$/u' : $namePattern)],
                    'last_name' => ['required', 'string', 'max:255', 'regex:'.$namePattern],
                    'gender' => ['required', 'in:Male,Female'],
                    'school' => 'required|string|max:255',
                    'position' => 'required|string|max:255',
                    'email' => 'nullable|email|max:255',
                ], [
                    'first_name.regex' => 'First name must use letters, spaces, apostrophes, hyphens or periods only.',
                    'last_name.regex' => 'Last name must use letters, spaces, apostrophes, hyphens or periods only.',
                    'middle_name.regex' => $middleInitialOnly
                        ? 'Middle initial must be one letter, optionally followed by a period (e.g. A.).'
                        : 'Middle name must use letters, spaces, apostrophes, hyphens or periods only.',
                ]);
                if ($validator->fails() || !$timestamp) {
                    $result['invalid']++;
                    if (count($result['issues']) < 10) {
                        $messages = $validator->errors()->all();
                        if (!$timestamp) {
                            array_unshift($messages, "Missing or invalid submission timestamp. Expected {$expectedDate} HH:MM:SS.");
                        }
                        $result['issues'][] = 'Row '.($offset + 2).': '.implode(' ', $messages);
                    }
                    continue;
                }

                $employeeKey = $this->identity->key($data);
                if (isset($employees[$employeeKey])) {
                    $matches = $employees[$employeeKey];
                    // Fill only missing gender on an unambiguous existing employee.
                    // Keep known gender, all other details and workflow status unchanged.
                    if ($matches->count() === 1 && !$matches->first()->gender) {
                        $matches->first()->update(['gender' => $data['gender']]);
                        $result['gender_updated']++;
                    }
                    $result['skipped']++;
                    continue;
                }

                // Keep the submission key for compatibility with previously imported rows.
                $sourceKey = hash('sha256', json_encode([
                    config('google-sheets.spreadsheet_id'), (string) config('google-sheets.sheet_id'),
                    $timestamp->format('Y-m-d H:i:s'),
                    Str::lower(Str::squish($data['first_name'])),
                    Str::lower(Str::squish($data['last_name'])),
                ], JSON_THROW_ON_ERROR));
                $request = LoiRequest::firstOrCreate(['google_source_key' => $sourceKey], [
                    ...$data,
                    'status' => 'Pending',
                    'request_date' => $timestamp->format('Y-m-d'),
                ]);
                $result[$request->wasRecentlyCreated ? 'imported' : 'skipped']++;
                if (!$request->wasRecentlyCreated && !$request->gender) {
                    $request->update(['gender' => $data['gender']]);
                    $result['gender_updated']++;
                }
                $employees[$employeeKey] = collect([$request]);
                if ($request->wasRecentlyCreated && $data['email'] === '') {
                    $result['missing_email']++;
                }
            }
            return $result;
        });
    }

    private function timestamp(mixed $value, string $dateFormat): ?DateTimeImmutable
    {
        if (is_numeric($value) && (float) $value > 0 && (float) $value < 2958466) {
            return CarbonImmutable::create(1899, 12, 30, 0, 0, 0, 'UTC')->addSeconds((int) round((float) $value * 86400));
        }
        if (str_contains((string) $value, "\0")) {
            return null;
        }
        foreach ([$dateFormat.' H:i:s', $dateFormat.' H:i', $dateFormat.' h:i:s A', $dateFormat.' h:i A', 'Y-m-d H:i:s', 'Y-m-d\TH:i:sP'] as $format) {
            $date = DateTimeImmutable::createFromFormat('!'.$format, trim((string) $value));
            $errors = DateTimeImmutable::getLastErrors();
            if ($date && ($errors === false || ($errors['warning_count'] === 0 && $errors['error_count'] === 0))) {
                return $date;
            }
        }
        return null;
    }
}
