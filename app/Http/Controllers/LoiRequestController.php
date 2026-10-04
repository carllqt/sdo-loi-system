<?php

namespace App\Http\Controllers;

use App\Models\LoiRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoiRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $requests = LoiRequest::query()
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('AllRequest/Index', [
            'requests' => $requests,
        ]);
    }
}