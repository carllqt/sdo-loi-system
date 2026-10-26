<?php

namespace App\Http\Controllers;

use App\Models\LoiRequest;
use App\Models\Position;
use App\Models\Schools;
use App\Services\GoogleSheetSync;
use App\Services\EmployeeRequestIdentity;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RequestedController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Requested/Index', [
            'requests' => LoiRequest::query()
                ->where('status', 'Pending')
                ->orderByDesc('id')
                ->paginate(10)
                ->withQueryString(),
            'positions' => Position::orderBy('id')->get(['id', 'name']),
            'schools' => Schools::orderBy('name')->get(['id', 'name']),
            'syncResult' => $request->session()->get('google_sync_result'),
        ]);
    }

    public function store(Request $request, EmployeeRequestIdentity $identity): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:Male,Female'],
            'position' => ['required', 'string', 'max:255', 'exists:positions,name'],
            'school' => ['required', 'string', 'max:255', 'exists:schools,name'],
            'email' => ['nullable', 'email', 'max:255'],
            'request_date' => ['required', 'date_format:Y-m-d'],
        ]);
        $identity->exclusively(function () use ($identity, $data) {
            if (isset($identity->existingKeys()[$identity->key($data)])) {
                throw ValidationException::withMessages(['first_name' => 'This employee already has a request. Each employee can apply only once.']);
            }
            LoiRequest::create([
                ...$data,
                'middle_name' => $data['middle_name'] ?? '',
                'email' => $data['email'] ?? '',
                'status' => 'Pending',
            ]);
        }, 'first_name');

        return to_route('requests.requested');
    }

    public function syncGoogleSheet(GoogleSheetSync $sync): RedirectResponse
    {
        return to_route('requests.requested')->with('google_sync_result', $sync->run());
    }

    public function moveToProcessing(LoiRequest $loiRequest): RedirectResponse
    {
        $updated = LoiRequest::query()
            ->whereKey($loiRequest->getKey())
            ->where('status', 'Pending')
            ->update(['status' => 'Processing']);

        if (!$updated) {
            return back()->withErrors([
                'request' => 'Only pending requests can be moved to processing.',
            ]);
        }

        return back();
    }
}
