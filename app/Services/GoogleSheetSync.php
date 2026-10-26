<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;

class GoogleSheetSync
{
    public function __construct(private GoogleSheetReader $reader, private GoogleSheetRequestImporter $importer) {}

    public function run(): array
    {
        // Serialize browser and seeder syncs on this local installation.
        $lock = Cache::store('file')->lock('google-sheet-sync-'.hash('sha256', (string) config('google-sheets.spreadsheet_id')), 600);
        if (!$lock->get()) {
            throw ValidationException::withMessages(['sync' => 'Another Google Sheet sync is running. Try again after it finishes.']);
        }

        try {
            return $this->importer->import($this->reader->rows());
        } finally {
            $lock->release();
        }
    }
}
