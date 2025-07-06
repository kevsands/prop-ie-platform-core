<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Developments - PropIE Platform</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand fw-bold" href="{{ route('dashboard') }}">
                <i class="fas fa-building me-2"></i>PropIE Platform
            </a>
            <div class="navbar-nav ms-auto">
                <a class="nav-link" href="{{ route('properties.index') }}">Properties</a>
                <a class="nav-link" href="{{ route('dashboard') }}">Dashboard</a>
            </div>
        </div>
    </nav>

    <div class="container py-5">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1><i class="fas fa-building me-2"></i>Property Developments</h1>
                    <a href="{{ route('properties.index') }}" class="btn btn-primary">
                        <i class="fas fa-home me-2"></i>View All Properties
                    </a>
                </div>
                
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="card bg-primary text-white">
                            <div class="card-body text-center">
                                <h3>{{ $developments->total() }}</h3>
                                <p class="mb-0">Active Developments</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <h3>{{ $developments->sum('available_units') }}</h3>
                                <p class="mb-0">Units Available</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-info text-white">
                            <div class="card-body text-center">
                                <h3>{{ $developments->where('status', 'MARKETING')->count() }}</h3>
                                <p class="mb-0">Now Marketing</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                @if($developments->count() > 0)
                    <div class="row">
                        @foreach($developments as $development)
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card h-100">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <h5 class="card-title">{{ $development->name }}</h5>
                                            <span class="badge bg-{{ $development->status === 'MARKETING' ? 'success' : ($development->status === 'CONSTRUCTION' ? 'warning' : 'info') }}">
                                                {{ ucwords(str_replace('_', ' ', $development->status)) }}
                                            </span>
                                        </div>
                                        
                                        <p class="text-muted mb-2">
                                            <i class="fas fa-map-marker-alt me-1"></i>
                                            {{ $development->location->city }}, {{ $development->location->county }}
                                        </p>
                                        
                                        <p class="card-text">{{ Str::limit($development->short_description, 120) }}</p>
                                        
                                        <div class="row text-center mb-3">
                                            <div class="col-3">
                                                <div class="border rounded p-2">
                                                    <h6 class="text-primary mb-0">{{ $development->total_units }}</h6>
                                                    <small class="text-muted">Total</small>
                                                </div>
                                            </div>
                                            <div class="col-3">
                                                <div class="border rounded p-2">
                                                    <h6 class="text-success mb-0">{{ $development->available_units }}</h6>
                                                    <small class="text-muted">Available</small>
                                                </div>
                                            </div>
                                            <div class="col-3">
                                                <div class="border rounded p-2">
                                                    <h6 class="text-warning mb-0">{{ $development->reserved_units }}</h6>
                                                    <small class="text-muted">Reserved</small>
                                                </div>
                                            </div>
                                            <div class="col-3">
                                                <div class="border rounded p-2">
                                                    <h6 class="text-info mb-0">{{ $development->sold_units }}</h6>
                                                    <small class="text-muted">Sold</small>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        @if($development->features && count($development->features) > 0)
                                            <div class="mb-3">
                                                <small class="text-muted">Key Features:</small>
                                                <div class="mt-1">
                                                    @foreach(array_slice($development->features, 0, 3) as $feature)
                                                        <span class="badge bg-light text-dark me-1">{{ $feature }}</span>
                                                    @endforeach
                                                    @if(count($development->features) > 3)
                                                        <span class="badge bg-secondary">+{{ count($development->features) - 3 }} more</span>
                                                    @endif
                                                </div>
                                            </div>
                                        @endif
                                        
                                        <div class="d-flex justify-content-between align-items-center">
                                            <div>
                                                @if($development->completion_date)
                                                    <small class="text-muted">
                                                        <i class="fas fa-calendar me-1"></i>
                                                        Complete {{ \Carbon\Carbon::parse($development->completion_date)->format('M Y') }}
                                                    </small>
                                                @endif
                                            </div>
                                            <a href="{{ route('developments.show', $development->slug) }}" class="btn btn-outline-primary">
                                                View Details
                                            </a>
                                        </div>
                                        
                                        @if($development->developer)
                                            <hr>
                                            <small class="text-muted">
                                                <i class="fas fa-user-tie me-1"></i>
                                                {{ $development->developer->organization ?? $development->developer->full_name }}
                                            </small>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                    
                    <div class="d-flex justify-content-center">
                        {{ $developments->links() }}
                    </div>
                @else
                    <div class="text-center py-5">
                        <i class="fas fa-building fa-3x text-muted mb-3"></i>
                        <h4>No Developments Found</h4>
                        <p class="text-muted">Check back soon for new development projects.</p>
                    </div>
                @endif
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>