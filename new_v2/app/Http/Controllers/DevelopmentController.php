<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Development;

class DevelopmentController extends Controller
{
    public function index()
    {
        $developments = Development::with(['location', 'developer'])
            ->published()
            ->orderBy('marketing_launch_date', 'desc')
            ->paginate(12);

        return view('propie.developments.index', compact('developments'));
    }

    public function show(string $slug)
    {
        $development = Development::with(['location', 'developer', 'properties'])
            ->where('slug', $slug)
            ->published()
            ->firstOrFail();

        $availableProperties = $development->properties()
            ->published()
            ->where('status', 'AVAILABLE')
            ->orderBy('price')
            ->take(8)
            ->get();

        return view('propie.developments.show', compact('development', 'availableProperties'));
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
