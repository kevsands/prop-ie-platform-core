<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $property->title }} - PropIE Platform</title>
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
                <a class="nav-link" href="{{ route('properties.index') }}">All Properties</a>
                <a class="nav-link" href="{{ route('dashboard') }}">Dashboard</a>
            </div>
        </div>
    </nav>

    <div class="container py-5">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Home</a></li>
                <li class="breadcrumb-item"><a href="{{ route('properties.index') }}">Properties</a></li>
                @if($property->development)
                    <li class="breadcrumb-item"><a href="{{ route('developments.show', $property->development->slug) }}">{{ $property->development->name }}</a></li>
                @endif
                <li class="breadcrumb-item active">{{ $property->title }}</li>
            </ol>
        </nav>

        <div class="row">
            <div class="col-lg-8">
                <div class="card mb-4">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h1 class="h2">{{ $property->title }}</h1>
                                <p class="text-muted mb-2">
                                    <i class="fas fa-map-marker-alt me-1"></i>
                                    {{ $property->location->full_address }}
                                </p>
                                @if($property->development)
                                    <p class="text-muted">
                                        <i class="fas fa-building me-1"></i>
                                        Part of <a href="{{ route('developments.show', $property->development->slug) }}">{{ $property->development->name }}</a>
                                    </p>
                                @endif
                            </div>
                            <div class="text-end">
                                <h2 class="text-primary">{{ $property->formatted_price }}</h2>
                                <small class="text-muted">€{{ number_format($property->price_per_sqm, 0) }}/m²</small>
                                <br>
                                <span class="badge bg-{{ $property->status === 'AVAILABLE' ? 'success' : 'warning' }} mt-1">
                                    {{ $property->status }}
                                </span>
                            </div>
                        </div>

                        <div class="row mb-4">
                            <div class="col-md-3 col-6 text-center">
                                <div class="border rounded p-3">
                                    <i class="fas fa-bed fa-2x text-primary mb-2"></i>
                                    <h5>{{ $property->bedrooms }}</h5>
                                    <small class="text-muted">Bedrooms</small>
                                </div>
                            </div>
                            <div class="col-md-3 col-6 text-center">
                                <div class="border rounded p-3">
                                    <i class="fas fa-bath fa-2x text-primary mb-2"></i>
                                    <h5>{{ $property->bathrooms }}</h5>
                                    <small class="text-muted">Bathrooms</small>
                                </div>
                            </div>
                            <div class="col-md-3 col-6 text-center">
                                <div class="border rounded p-3">
                                    <i class="fas fa-ruler-combined fa-2x text-primary mb-2"></i>
                                    <h5>{{ $property->floor_area_sqm }}m²</h5>
                                    <small class="text-muted">Floor Area</small>
                                </div>
                            </div>
                            <div class="col-md-3 col-6 text-center">
                                <div class="border rounded p-3">
                                    <i class="fas fa-leaf fa-2x text-success mb-2"></i>
                                    <h5>{{ $property->ber_rating ?? 'N/A' }}</h5>
                                    <small class="text-muted">BER Rating</small>
                                </div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <h4>Description</h4>
                            <p>{{ $property->description }}</p>
                        </div>

                        @if($property->features && count($property->features) > 0)
                            <div class="mb-4">
                                <h4>Property Features</h4>
                                <div class="row">
                                    @foreach($property->features as $feature)
                                        <div class="col-md-6 mb-2">
                                            <i class="fas fa-check-circle text-success me-2"></i>{{ $feature }}
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @endif

                        @if($property->amenities && count($property->amenities) > 0)
                            <div class="mb-4">
                                <h4>Development Amenities</h4>
                                <div class="row">
                                    @foreach($property->amenities as $amenity)
                                        <div class="col-md-6 mb-2">
                                            <i class="fas fa-star text-warning me-2"></i>{{ $amenity }}
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @endif
                    </div>
                </div>

                @if($property->development)
                    <div class="card mb-4">
                        <div class="card-header">
                            <h5 class="mb-0">About {{ $property->development->name }}</h5>
                        </div>
                        <div class="card-body">
                            <p>{{ $property->development->description }}</p>
                            
                            <div class="row">
                                <div class="col-md-3 text-center">
                                    <h4 class="text-primary">{{ $property->development->total_units }}</h4>
                                    <small class="text-muted">Total Units</small>
                                </div>
                                <div class="col-md-3 text-center">
                                    <h4 class="text-success">{{ $property->development->available_units }}</h4>
                                    <small class="text-muted">Available</small>
                                </div>
                                <div class="col-md-3 text-center">
                                    <h4 class="text-warning">{{ $property->development->reserved_units }}</h4>
                                    <small class="text-muted">Reserved</small>
                                </div>
                                <div class="col-md-3 text-center">
                                    <h4 class="text-info">{{ $property->development->sold_units }}</h4>
                                    <small class="text-muted">Sold</small>
                                </div>
                            </div>
                        </div>
                    </div>
                @endif
            </div>

            <div class="col-lg-4">
                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Express Your Interest</h5>
                    </div>
                    <div class="card-body">
                        @auth
                            <form method="POST" action="{{ route('buyer.express-interest', $property) }}">
                                @csrf
                                <div class="mb-3">
                                    <label class="form-label">Message</label>
                                    <textarea class="form-control" name="message" rows="3" 
                                              placeholder="I'm interested in this property and would like to arrange a viewing..." required></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Viewing Preference</label>
                                    <select class="form-select" name="viewing_preference">
                                        <option value="">No preference</option>
                                        <option value="weekday_morning">Weekday Morning</option>
                                        <option value="weekday_afternoon">Weekday Afternoon</option>
                                        <option value="weekday_evening">Weekday Evening</option>
                                        <option value="weekend">Weekend</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn btn-primary w-100">
                                    <i class="fas fa-envelope me-2"></i>Express Interest
                                </button>
                            </form>
                        @else
                            <div class="text-center">
                                <p class="text-muted mb-3">Please log in to express interest in this property</p>
                                <a href="{{ route('login') }}" class="btn btn-primary w-100">
                                    <i class="fas fa-sign-in-alt me-2"></i>Login to Continue
                                </a>
                                <hr>
                                <p class="small text-muted">Don't have an account? <a href="{{ route('register') }}">Register here</a></p>
                            </div>
                        @endauth
                    </div>
                </div>

                <div class="card mb-4">
                    <div class="card-header">
                        <h5 class="mb-0">Property Statistics</h5>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                            <span>Property Views</span>
                            <strong>{{ $property->view_count }}</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Inquiries</span>
                            <strong>{{ $property->inquiry_count }}</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Property Type</span>
                            <strong>{{ $property->property_type }}</strong>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span>Year Built</span>
                            <strong>{{ $property->year_built ?? 'N/A' }}</strong>
                        </div>
                        @if($property->is_new_build)
                            <div class="d-flex justify-content-between mb-2">
                                <span>New Build</span>
                                <span class="badge bg-success">Yes</span>
                            </div>
                        @endif
                    </div>
                </div>

                @if($property->development && $property->development->developer)
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Developer Information</h5>
                        </div>
                        <div class="card-body">
                            <h6>{{ $property->development->developer->organization ?? $property->development->developer->full_name }}</h6>
                            <p class="text-muted mb-2">{{ $property->development->developer->position }}</p>
                            
                            <div class="d-grid gap-2">
                                <button class="btn btn-outline-primary btn-sm">
                                    <i class="fas fa-phone me-2"></i>Contact Developer
                                </button>
                                <button class="btn btn-outline-secondary btn-sm">
                                    <i class="fas fa-building me-2"></i>View All Properties
                                </button>
                            </div>
                        </div>
                    </div>
                @endif
            </div>
        </div>

        @if($relatedProperties->count() > 0)
            <div class="mt-5">
                <h3>Other Properties in {{ $property->development->name }}</h3>
                <div class="row">
                    @foreach($relatedProperties as $related)
                        <div class="col-md-6 col-lg-3 mb-4">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h6 class="card-title">{{ $related->title }}</h6>
                                    <p class="text-muted small">{{ $related->short_description }}</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <small class="text-primary fw-bold">{{ $related->formatted_price }}</small>
                                        <a href="{{ route('properties.show', $related->slug) }}" class="btn btn-sm btn-outline-primary">
                                            View
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>