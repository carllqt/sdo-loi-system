<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoiRequest extends Model
{
    /** @use HasFactory<\Database\Factories\LoiRequestFactory> */
    use HasFactory;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'position',
        'school',
        'email',
        'status',
        'request_date',
    ];

    protected function casts(): array
    {
        return [
            'request_date' => 'date',
        ];
    }
}
