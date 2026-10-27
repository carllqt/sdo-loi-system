<?php

namespace App\Models;

use Database\Factories\LoiRequestFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoiRequest extends Model
{
    /** @use HasFactory<LoiRequestFactory> */
    use HasFactory;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'gender',
        'position',
        'school',
        'email',
        'status',
        'request_date',
        'google_source_key',
    ];

    protected $hidden = ['google_source_key'];

    protected function casts(): array
    {
        return [
            'request_date' => 'date',
            'processed_email_sent_at' => 'datetime',
        ];
    }
}
