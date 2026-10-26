<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestedController;
use App\Http\Controllers\ProcessingController;
use App\Http\Controllers\CompletedController;
use App\Http\Controllers\AllRequestController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check()
        ? to_route('requests.index')
        : to_route('login');
});

Route::middleware('auth')->group(function () {
    Route::get('/all-request', [AllRequestController::class, 'index'])->name('requests.index');
    Route::get('/requested', [RequestedController::class, 'index'])->name('requests.requested');
    Route::post('/requested', [RequestedController::class, 'store'])->name('requests.store');
    Route::post('/requested/sync-google-sheet', [RequestedController::class, 'syncGoogleSheet'])->middleware('throttle:6,1')->name('requests.syncGoogleSheet');
    Route::patch('/requested/{loiRequest}/process', [RequestedController::class, 'moveToProcessing'])->name('requests.process');
    Route::get('/processing', [ProcessingController::class, 'index'])->name('requests.processing');
    Route::patch('/processing/{loiRequest}/complete', [ProcessingController::class, 'moveToCompleted'])->name('requests.complete');
    Route::post('/processing/{loiRequest}/notify-processed', [ProcessingController::class, 'sendProcessedEmail'])
        ->name('requests.notifyProcessed')
        ->missing(fn () => to_route('requests.processing')->withErrors([
            'email_title' => 'Request not found',
            'email' => 'This request no longer exists. Refresh the page and try again.',
        ]));
    Route::get('/completed', [CompletedController::class, 'index'])->name('requests.completed');


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
