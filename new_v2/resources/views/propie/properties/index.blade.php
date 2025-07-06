<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Properties - PropIE Platform</title>
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
                <a class="nav-link" href="{{ route('dashboard') }}">Back to Dashboard</a>
            </div>
        </div>
    </nav>

    <div class="container py-5">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1><i class="fas fa-home me-2"></i>Property Listings</h1>
                    <a href="{{ route('properties.search') }}" class="btn btn-primary">
                        <i class="fas fa-search me-2"></i>Advanced Search
                    </a>
                </div>
                
                <div class="row mb-4">
                    <div class="col-md-4">
                        <div class="card bg-primary text-white">
                            <div class="card-body text-center">
                                <h3>{{ $properties->total() }}</h3>
                                <p class="mb-0">Properties Available</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-success text-white">
                            <div class="card-body text-center">
                                <h3>{{ $properties->where('is_featured', true)->count() }}</h3>
                                <p class="mb-0">Featured Properties</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card bg-info text-white">
                            <div class="card-body text-center">
                                <h3>{{ $properties->where('status', 'AVAILABLE')->count() }}</h3>
                                <p class="mb-0">Available Now</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                @if($properties->count() > 0)
                    <div class="row">
                        @foreach($properties as $property)
                            <div class="col-md-6 col-lg-4 mb-4">
                                <div class="card h-100">
                                    @if($property->is_featured)
                                        <div class="position-relative">
                                            <span class="position-absolute top-0 start-0 badge bg-warning text-dark m-2">Featured</span>
                                        </div>
                                    @endif
                                    
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between align-items-start mb-2">
                                            <h5 class="card-title">{{ $property->title }}</h5>
                                            <span class="badge bg-{{ $property->status === 'AVAILABLE' ? 'success' : 'warning' }}">
                                                {{ $property->status }}
                                            </span>
                                        </div>
                                        
                                        <p class="text-muted mb-2">
                                            <i class="fas fa-map-marker-alt me-1"></i>
                                            {{ $property->location->city }}, {{ $property->location->county }}
                                        </p>
                                        
                                        <p class="card-text">{{ Str::limit($property->short_description, 100) }}</p>
                                        
                                        <div class="row text-center mb-3">
                                            <div class="col-4">
                                                <i class="fas fa-bed text-muted"></i>
                                                <small class="d-block">{{ $property->bedrooms }} Bed</small>
                                            </div>
                                            <div class="col-4">
                                                <i class="fas fa-bath text-muted"></i>
                                                <small class="d-block">{{ $property->bathrooms }} Bath</small>
                                            </div>
                                            <div class="col-4">
                                                <i class="fas fa-ruler-combined text-muted"></i>
                                                <small class="d-block">{{ $property->floor_area_sqm }}m²</small>
                                            </div>
                                        </div>
                                        
                                        <div class="d-flex justify-content-between align-items-center">
                                            <h4 class="text-primary mb-0">{{ $property->formatted_price }}</h4>
                                            <a href="{{ route('properties.show', $property->slug) }}" class="btn btn-outline-primary">
                                                View Details
                                            </a>
                                        </div>
                                        
                                        @if($property->development)
                                            <small class="text-muted">
                                                Part of {{ $property->development->name }}
                                            </small>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                    
                    <div class="d-flex justify-content-center">
                        {{ $properties->links() }}
                    </div>
                @else
                    <div class="text-center py-5">
                        <i class="fas fa-home fa-3x text-muted mb-3"></i>
                        <h4>No Properties Found</h4>
                        <p class="text-muted">Check back soon for new listings.</p>
                    </div>
                @endif
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>