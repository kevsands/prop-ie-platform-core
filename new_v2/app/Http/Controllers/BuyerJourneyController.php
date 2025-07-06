<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use App\Models\Transaction;
use App\Models\Reservation;
use App\Models\HtbApplication;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class BuyerJourneyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();
        $transactions = Transaction::with(['property.location', 'property.development'])
            ->where('buyer_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        $reservations = Reservation::with(['property.location'])
            ->where('buyer_id', $user->id)
            ->where('status', 'ACTIVE')
            ->get();

        $htbApplications = HtbApplication::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return view('propie.buyer.journey.index', compact('transactions', 'reservations', 'htbApplications'));
    }

    public function expressInterest(Request $request, Property $property)
    {
        $request->validate([
            'message' => 'required|string|max:1000',
            'viewing_preference' => 'nullable|string',
        ]);

        $transaction = Transaction::create([
            'id' => Str::uuid(),
            'property_id' => $property->id,
            'buyer_id' => Auth::id(),
            'status' => 'ENQUIRY',
            'notes' => $request->message,
            'timeline' => [
                [
                    'status' => 'ENQUIRY',
                    'date' => now()->toDateString(),
                    'notes' => 'Initial enquiry submitted'
                ]
            ]
        ]);

        $property->increment('inquiry_count');

        return redirect()->route('buyer.journey.show', $transaction)
            ->with('success', 'Your interest has been registered. We will contact you shortly.');
    }

    public function show(Transaction $transaction)
    {
        $this->authorize('view', $transaction);
        
        $transaction->load(['property.location', 'property.development.developer']);
        
        return view('propie.buyer.journey.show', compact('transaction'));
    }

    public function makeOffer(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);
        
        $request->validate([
            'offer_amount' => 'required|numeric|min:1000',
            'conditions' => 'nullable|string|max:1000',
        ]);

        $transaction->update([
            'offer_amount' => $request->offer_amount,
            'status' => 'OFFER_MADE',
            'offer_made_at' => now(),
            'timeline' => array_merge($transaction->timeline ?? [], [
                [
                    'status' => 'OFFER_MADE',
                    'date' => now()->toDateString(),
                    'amount' => $request->offer_amount,
                    'conditions' => $request->conditions,
                ]
            ])
        ]);

        return redirect()->route('buyer.journey.show', $transaction)
            ->with('success', 'Your offer has been submitted and is under review.');
    }

    public function scheduleViewing(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);
        
        $request->validate([
            'preferred_date' => 'required|date|after:today',
            'preferred_time' => 'required|string',
            'notes' => 'nullable|string|max:500',
        ]);

        $transaction->update([
            'status' => 'VIEWING_SCHEDULED',
            'timeline' => array_merge($transaction->timeline ?? [], [
                [
                    'status' => 'VIEWING_SCHEDULED',
                    'date' => now()->toDateString(),
                    'preferred_date' => $request->preferred_date,
                    'preferred_time' => $request->preferred_time,
                    'notes' => $request->notes,
                ]
            ])
        ]);

        return redirect()->route('buyer.journey.show', $transaction)
            ->with('success', 'Viewing request submitted. We will confirm the appointment shortly.');
    }

    public function reserve(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);
        
        $request->validate([
            'reservation_fee' => 'required|numeric|min:500',
            'deposit_amount' => 'required|numeric|min:1000',
        ]);

        $reservation = Reservation::create([
            'id' => Str::uuid(),
            'property_id' => $transaction->property_id,
            'buyer_id' => $transaction->buyer_id,
            'transaction_id' => $transaction->id,
            'reservation_fee' => $request->reservation_fee,
            'deposit_amount' => $request->deposit_amount,
            'reservation_date' => now()->toDateString(),
            'expiry_date' => now()->addDays(28)->toDateString(),
        ]);

        $transaction->update([
            'status' => 'RESERVED',
            'deposit_amount' => $request->deposit_amount,
            'timeline' => array_merge($transaction->timeline ?? [], [
                [
                    'status' => 'RESERVED',
                    'date' => now()->toDateString(),
                    'reservation_fee' => $request->reservation_fee,
                    'deposit_amount' => $request->deposit_amount,
                ]
            ])
        ]);

        return redirect()->route('buyer.journey.show', $transaction)
            ->with('success', 'Property reserved successfully. Reservation expires in 28 days.');
    }
}
