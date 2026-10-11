<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RequestedController;
use App\Http\Controllers\ProcessingController;
use App\Http\Controllers\CompletedController;
use App\Http\Controllers\AllRequestController;
use App\Http\Controllers\PublicLoiRequestController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return auth()->check()
        ? to_route('requests.index')
        : to_route('login');
});

Route::get('/loi-request', [PublicLoiRequestController::class, 'index'])
    ->name('loi-requests.index');
Route::post('/loi-request', [PublicLoiRequestController::class, 'store'])
    ->name('loi-requests.store');

Route::middleware('auth')->group(function () {
    Route::get('/all-request', [AllRequestController::class, 'index'])->name('requests.index');
    Route::get('/requested', [RequestedController::class, 'index'])->name('requests.requested');
    Route::patch('/requested/{loiRequest}/process', [RequestedController::class, 'moveToProcessing'])->name('requests.process');
    Route::get('/processing', [ProcessingController::class, 'index'])->name('requests.processing');
    Route::get('/completed', [CompletedController::class, 'index'])->name('requests.completed');


    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
