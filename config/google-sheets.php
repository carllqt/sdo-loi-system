<?php

return [
    'spreadsheet_id' => env('GOOGLE_SHEETS_SPREADSHEET_ID'),
    'sheet_id' => env('GOOGLE_SHEETS_TAB_ID', ''),
    'date_format' => env('GOOGLE_SHEETS_DATE_FORMAT', 'd/m/Y'),
    // Public mode only reads a sheet that is already accessible through its link.
    'access_mode' => env('GOOGLE_SHEETS_ACCESS_MODE', 'service_account'),
    'credentials' => env('GOOGLE_SHEETS_CREDENTIALS') ?: storage_path('app/private/google-service-account.json'),
    'ca_bundle' => env('GOOGLE_SHEETS_CA_BUNDLE'),
];
