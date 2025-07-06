<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;

class PropertyController extends Controller
{
    public function index()
    {
        $properties = Property::with(['location', 'development'])
            ->published()
            ->orderBy('is_featured', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return view('propie.properties.index', compact('properties'));
    }

    public function search(Request $request)
    {
        $query = Property::with(['location', 'development'])->published();

        if ($request->filled('location')) {
            $query->whereHas('location', function($q) use ($request) {
                $q->where('city', 'like', '%' . $request->location . '%')
                  ->orWhere('county', 'like', '%' . $request->location . '%')
                  ->orWhere('eircode', 'like', '%' . $request->location . '%');
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('property_type')) {
            $query->where('property_type', $request->property_type);
        }

        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', '>=', $request->bedrooms);
        }

        $properties = $query->orderBy('is_featured', 'desc')
                           ->orderBy('created_at', 'desc')
                           ->paginate(12);

        return view('propie.properties.search', compact('properties'));
    }

    public function show(string $slug)
    {
        $property = Property::with(['location', 'development.developer'])
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        $property->increment('view_count');

        $relatedProperties = Property::with(['location'])
            ->published()
            ->where('id', '!=', $property->id)
            ->where('development_id', $property->development_id)
            ->take(4)
            ->get();

        return view('propie.properties.show', compact('property', 'relatedProperties'));
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
