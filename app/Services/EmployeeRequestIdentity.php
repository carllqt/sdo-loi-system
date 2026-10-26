<?php

namespace App\Services;

use App\Models\LoiRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class EmployeeRequestIdentity
{
    public function key(array $data): string
    {
        return json_encode([
            Str::lower(Str::squish($data['first_name'])),
            Str::lower(mb_substr(Str::squish($data['middle_name'] ?? ''), 0, 1)),
            Str::lower(Str::squish($data['last_name'])),
        ], JSON_THROW_ON_ERROR);
    }

    public function existingKeys(): array
    {
        $keys = [];
        foreach (LoiRequest::query()->select(['first_name', 'middle_name', 'last_name'])->cursor() as $request) {
            $keys[$this->key($request->getAttributes())] = true;
        }
        return $keys;
    }

    public function exclusively(callable $callback, string $errorField = 'sync'): mixed
    {
        // Manual entry and Sheet imports share one lock on this local installation.
        $lock = Cache::store('file')->lock('employee-request-creation', 600);
        if (!$lock->get()) {
            throw ValidationException::withMessages([$errorField => 'Another request is being saved. Please try again shortly.']);
        }
        try {
            return DB::transaction($callback);
        } finally {
            $lock->release();
        }
    }
}
