<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HtbApplication;
use App\Models\Property;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class HtbController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except(['calculator', 'calculate', 'eligibilityCheck']);
    }

    public function calculator()
    {
        return view('propie.htb.calculator');
    }

    public function calculate(Request $request)
    {
        $request->validate([
            'property_price' => 'required|numeric|min:50000|max:500000',
            'annual_income' => 'required|numeric|min:10000',
            'is_first_time_buyer' => 'required|boolean',
            'is_owner_occupier' => 'required|boolean',
        ]);

        $propertyPrice = $request->property_price;
        $annualIncome = $request->annual_income;
        $isFirstTimeBuyer = $request->is_first_time_buyer;
        $isOwnerOccupier = $request->is_owner_occupier;

        // HTB Eligibility Rules (Irish Help to Buy Scheme)
        $eligible = $isFirstTimeBuyer && $isOwnerOccupier && $propertyPrice <= 500000 && $annualIncome >= 10000;
        
        $maxRelief = 0;
        $reliefRate = 0;
        
        if ($eligible) {
            // Help to Buy relief is 10% of purchase price up to €30,000
            $reliefRate = 0.10;
            $maxRelief = min($propertyPrice * $reliefRate, 30000);
        }

        $calculations = [
            'property_price' => $propertyPrice,
            'annual_income' => $annualIncome,
            'is_eligible' => $eligible,
            'relief_amount' => $maxRelief,
            'relief_percentage' => $reliefRate * 100,
            'net_property_cost' => $propertyPrice - $maxRelief,
            'required_deposit' => ($propertyPrice - $maxRelief) * 0.10, // 10% deposit on remaining
            'estimated_mortgage' => ($propertyPrice - $maxRelief) * 0.90,
        ];

        return view('propie.htb.calculator', compact('calculations'));
    }

    public function application()
    {
        $applications = HtbApplication::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return view('propie.htb.application', compact('applications'));
    }

    public function create(Property $property = null)
    {
        return view('propie.htb.create', compact('property'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'property_id' => 'nullable|exists:properties,id',
            'property_purchase_price' => 'required|numeric|min:50000|max:500000',
            'annual_income' => 'required|numeric|min:10000',
            'is_first_time_buyer' => 'required|boolean',
            'is_owner_occupier' => 'required|boolean',
            'applicant_details' => 'required|array',
            'employment_details' => 'required|array',
            'financial_details' => 'required|array',
        ]);

        // Calculate HTB relief
        $propertyPrice = $request->property_purchase_price;
        $htbRelief = min($propertyPrice * 0.10, 30000);

        $application = HtbApplication::create([
            'id' => Str::uuid(),
            'user_id' => Auth::id(),
            'property_id' => $request->property_id,
            'property_purchase_price' => $propertyPrice,
            'htb_relief_amount' => $htbRelief,
            'annual_income' => $request->annual_income,
            'is_first_time_buyer' => $request->is_first_time_buyer,
            'is_owner_occupier' => $request->is_owner_occupier,
            'applicant_details' => $request->applicant_details,
            'employment_details' => $request->employment_details,
            'financial_details' => $request->financial_details,
            'application_reference' => 'HTB-' . strtoupper(Str::random(8)),
            'application_date' => now()->toDateString(),
            'status' => 'DRAFT',
        ]);

        return redirect()->route('htb.show', $application)
            ->with('success', 'HTB application created successfully. Review and submit when ready.');
    }

    public function show(HtbApplication $application)
    {
        $this->authorize('view', $application);
        
        $application->load(['property.location', 'user']);
        
        return view('propie.htb.show', compact('application'));
    }

    public function submit(HtbApplication $application)
    {
        $this->authorize('update', $application);
        
        if ($application->status !== 'DRAFT') {
            return redirect()->back()->with('error', 'Application has already been submitted.');
        }

        $application->update([
            'status' => 'SUBMITTED',
            'application_date' => now()->toDateString(),
        ]);

        return redirect()->route('htb.show', $application)
            ->with('success', 'HTB application submitted successfully. You will receive updates on the status.');
    }

    public function eligibilityCheck(Request $request)
    {
        $request->validate([
            'annual_income' => 'required|numeric|min:0',
            'property_price' => 'required|numeric|min:0',
            'is_first_time_buyer' => 'required|boolean',
            'is_owner_occupier' => 'required|boolean',
        ]);

        $eligible = $request->is_first_time_buyer && 
                   $request->is_owner_occupier && 
                   $request->property_price <= 500000 && 
                   $request->annual_income >= 10000;

        $maxRelief = $eligible ? min($request->property_price * 0.10, 30000) : 0;

        return response()->json([
            'eligible' => $eligible,
            'max_relief' => $maxRelief,
            'relief_percentage' => $eligible ? 10 : 0,
            'reasons' => $this->getIneligibilityReasons($request),
        ]);
    }

    private function getIneligibilityReasons($request)
    {
        $reasons = [];
        
        if (!$request->is_first_time_buyer) {
            $reasons[] = 'Must be a first-time buyer';
        }
        
        if (!$request->is_owner_occupier) {
            $reasons[] = 'Must be purchasing as owner-occupier';
        }
        
        if ($request->property_price > 500000) {
            $reasons[] = 'Property price exceeds €500,000 limit';
        }
        
        if ($request->annual_income < 10000) {
            $reasons[] = 'Minimum annual income requirement not met';
        }
        
        return $reasons;
    }
}
