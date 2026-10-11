<?php

namespace App\Http\Controllers;

use App\Models\LoiRequest;
use App\Models\Position;
use App\Models\Schools;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicLoiRequestController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('PublicRequest/Index', [
            'positions' => Position::query()->orderBy('id')->get(['id', 'name']),
            'schools' => Schools::query()->orderBy('name')->get(['id', 'code', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255', 'exists:positions,name'],
            'school' => ['required', 'string', 'max:255', 'exists:schools,name'],
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        LoiRequest::create([
            ...$validated,
            'status' => 'Pending',
            'request_date' => now()->toDateString(),
        ]);

        return to_route('loi-requests.index');
    }
}
