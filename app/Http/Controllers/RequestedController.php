<?php

namespace App\Http\Controllers;

use App\Models\LoiRequest;
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
        ]);
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
