<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Property Search - PropIE Platform</title>
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
        <div class="row">
            <div class="col-12">
                <h1><i class="fas fa-search me-2"></i>Advanced Property Search</h1>
                
                <div class="alert alert-info mb-4">
                    <i class="fas fa-info-circle me-2"></i>{{ $message }}
                    <br><small>This will include comprehensive search filters, map integration, and real-time results.</small>
                </div>
                
                <div class="row">
                    <div class="col-lg-3">
                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0">Search Filters</h6>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <label class="form-label">Location</label>
                                    <input type="text" class="form-control" placeholder="City, County, or Eircode">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Price Range</label>
                                    <div class="row">
                                        <div class="col-6">
                                            <input type="number" class="form-control" placeholder="Min €">
                                        </div>
                                        <div class="col-6">
                                            <input type="number" class="form-control" placeholder="Max €">
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Property Type</label>
                                    <select class="form-select">
                                        <option>All Types</option>
                                        <option>Apartment</option>
                                        <option>House</option>
                                        <option>Townhouse</option>
                                        <option>Duplex</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Bedrooms</label>
                                    <select class="form-select">
                                        <option>Any</option>
                                        <option>1+</option>
                                        <option>2+</option>
                                        <option>3+</option>
                                        <option>4+</option>
                                    </select>
                                </div>
                                <button class="btn btn-primary w-100">
                                    <i class="fas fa-search me-2"></i>Search Properties
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-9">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="mb-0">Search Results</h6>
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-outline-secondary active">
                                            <i class="fas fa-th me-1"></i>Grid
                                        </button>
                                        <button class="btn btn-outline-secondary">
                                            <i class="fas fa-list me-1"></i>List
                                        </button>
                                        <button class="btn btn-outline-secondary">
                                            <i class="fas fa-map me-1"></i>Map
                                        </button>
                                    </div>
                                </div>
                                
                                <div class="text-center py-5">
                                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                                    <h5>Advanced Search Feature</h5>
                                    <p class="text-muted">This will include real-time property search with:</p>
                                    <ul class="list-unstyled">
                                        <li><i class="fas fa-check text-success me-2"></i>Multi-criteria filtering</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Interactive map integration</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Saved searches & alerts</li>
                                        <li><i class="fas fa-check text-success me-2"></i>Property comparison tools</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>