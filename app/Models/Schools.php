<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schools extends Model
{
    /** @use HasFactory<\Database\Factories\SchoolsFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
    ];
}