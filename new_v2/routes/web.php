<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\DevelopmentController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('propie.dashboard');
})->name('home');

Route::get('/dashboard', function () {
    return view('propie.dashboard');
})->name('dashboard');

// Public Property Routes
Route::prefix('properties')->group(function () {
    Route::get('/', [PropertyController::class, 'index'])->name('properties.index');
    Route::get('/search', [PropertyController::class, 'search'])->name('properties.search');
    Route::get('/{property}', [PropertyController::class, 'show'])->name('properties.show');
});

Route::prefix('developments')->group(function () {
    Route::get('/', [DevelopmentController::class, 'index'])->name('developments.index');
    Route::get('/{development}', [DevelopmentController::class, 'show'])->name('developments.show');
});

// Public HTB Calculator
Route::get('/htb/calculator', [App\Http\Controllers\HtbController::class, 'calculator'])->name('htb.calculator');
Route::post('/htb/calculate', [App\Http\Controllers\HtbController::class, 'calculate'])->name('htb.calculate');

// Authenticated Routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/user/dashboard', function () {
        return view('propie.dashboard');
    })->name('user.dashboard');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Role-based Dashboards
    Route::prefix('dashboard')->group(function () {
        Route::get('/buyer', [DashboardController::class, 'buyer'])->name('dashboard.buyer');
        Route::get('/developer', [DashboardController::class, 'developer'])->name('dashboard.developer');
        Route::get('/admin', [DashboardController::class, 'admin'])->name('dashboard.admin');
    });
    
    // Buyer Journey Routes
    Route::prefix('buyer')->name('buyer.')->group(function () {
        Route::get('/journey', [App\Http\Controllers\BuyerJourneyController::class, 'index'])->name('journey.index');
        Route::get('/journey/{transaction}', [App\Http\Controllers\BuyerJourneyController::class, 'show'])->name('journey.show');
        Route::post('/properties/{property}/interest', [App\Http\Controllers\BuyerJourneyController::class, 'expressInterest'])->name('express-interest');
        Route::post('/journey/{transaction}/offer', [App\Http\Controllers\BuyerJourneyController::class, 'makeOffer'])->name('make-offer');
        Route::post('/journey/{transaction}/viewing', [App\Http\Controllers\BuyerJourneyController::class, 'scheduleViewing'])->name('schedule-viewing');
        Route::post('/journey/{transaction}/reserve', [App\Http\Controllers\BuyerJourneyController::class, 'reserve'])->name('reserve');
    });
    
    // Help-to-Buy Routes (Authenticated)
    Route::prefix('htb')->name('htb.')->group(function () {
        Route::get('/application', [App\Http\Controllers\HtbController::class, 'application'])->name('application');
        Route::get('/application/create/{property?}', [App\Http\Controllers\HtbController::class, 'create'])->name('create');
        Route::post('/application', [App\Http\Controllers\HtbController::class, 'store'])->name('store');
        Route::get('/application/{application}', [App\Http\Controllers\HtbController::class, 'show'])->name('show');
        Route::post('/application/{application}/submit', [App\Http\Controllers\HtbController::class, 'submit'])->name('submit');
        Route::post('/eligibility-check', [App\Http\Controllers\HtbController::class, 'eligibilityCheck'])->name('eligibility-check');
    });
    
    // Transaction Management
    Route::resource('transactions', App\Http\Controllers\TransactionController::class);
});

require __DIR__.'/auth.php';
