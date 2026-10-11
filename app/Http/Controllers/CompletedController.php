<?php

namespace App\Http\Controllers;

use App\Models\LoiRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompletedController extends Controller
{
    public function index(Request $request): Response
    {

    $requests = LoiRequest::query()
            ->where('status', 'Completed')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

            
        return Inertia::render('Completed/Index', [
            'requests' => $requests,
        ]);
    }
}