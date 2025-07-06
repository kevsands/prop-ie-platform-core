<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Help-to-Buy Calculator - PropIE Platform</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .calculator-card {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: none;
        }
        .result-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }
        .info-card {
            background-color: #f8f9fa;
            border-left: 4px solid #007bff;
        }
    </style>
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
            <div class="col-lg-8 mx-auto">
                <div class="text-center mb-5">
                    <h1><i class="fas fa-calculator me-2"></i>Help-to-Buy Calculator</h1>
                    <p class="lead text-muted">Calculate your potential Help-to-Buy relief for first-time property purchases in Ireland</p>
                </div>

                @if(session('success'))
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i>{{ session('success') }}
                    </div>
                @endif

                @if(session('error'))
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle me-2"></i>{{ session('error') }}
                    </div>
                @endif

                <div class="row">
                    <div class="col-lg-6">
                        <div class="card calculator-card mb-4">
                            <div class="card-header bg-primary text-white">
                                <h5 class="mb-0"><i class="fas fa-edit me-2"></i>Property & Income Details</h5>
                            </div>
                            <div class="card-body">
                                <form method="POST" action="{{ route('htb.calculate') }}">
                                    @csrf
                                    
                                    <div class="mb-3">
                                        <label class="form-label">Property Purchase Price</label>
                                        <div class="input-group">
                                            <span class="input-group-text">€</span>
                                            <input type="number" class="form-control" name="property_price" 
                                                   value="{{ old('property_price', $calculations['property_price'] ?? '') }}" 
                                                   min="50000" max="500000" step="1000" required>
                                        </div>
                                        <small class="text-muted">Maximum €500,000 for HTB eligibility</small>
                                        @error('property_price')
                                            <div class="text-danger small">{{ $message }}</div>
                                        @enderror
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">Annual Gross Income</label>
                                        <div class="input-group">
                                            <span class="input-group-text">€</span>
                                            <input type="number" class="form-control" name="annual_income" 
                                                   value="{{ old('annual_income', $calculations['annual_income'] ?? '') }}" 
                                                   min="10000" step="1000" required>
                                        </div>
                                        @error('annual_income')
                                            <div class="text-danger small">{{ $message }}</div>
                                        @enderror
                                    </div>

                                    <div class="mb-3">
                                        <div class="form-check">
                                            <input type="hidden" name="is_first_time_buyer" value="0">
                                            <input class="form-check-input" type="checkbox" name="is_first_time_buyer" 
                                                   value="1" {{ old('is_first_time_buyer', true) ? 'checked' : '' }}>
                                            <label class="form-check-label">
                                                I am a first-time buyer
                                            </label>
                                        </div>
                                        <small class="text-muted">Required for HTB eligibility</small>
                                    </div>

                                    <div class="mb-4">
                                        <div class="form-check">
                                            <input type="hidden" name="is_owner_occupier" value="0">
                                            <input class="form-check-input" type="checkbox" name="is_owner_occupier" 
                                                   value="1" {{ old('is_owner_occupier', true) ? 'checked' : '' }}>
                                            <label class="form-check-label">
                                                I will occupy the property as my primary residence
                                            </label>
                                        </div>
                                        <small class="text-muted">Required for HTB eligibility</small>
                                    </div>

                                    <button type="submit" class="btn btn-primary w-100">
                                        <i class="fas fa-calculator me-2"></i>Calculate HTB Relief
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div class="card info-card">
                            <div class="card-body">
                                <h6><i class="fas fa-info-circle me-2"></i>Help-to-Buy Scheme Information</h6>
                                <ul class="mb-0 small">
                                    <li>Relief of 10% of purchase price up to €30,000</li>
                                    <li>Available for new build properties only</li>
                                    <li>Must be first-time buyer and owner-occupier</li>
                                    <li>Property value must not exceed €500,000</li>
                                    <li>Subject to minimum income requirements</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-6">
                        @if(isset($calculations))
                            <div class="card result-card mb-4">
                                <div class="card-header border-0">
                                    <h5 class="mb-0">
                                        <i class="fas fa-chart-pie me-2"></i>Calculation Results
                                    </h5>
                                </div>
                                <div class="card-body">
                                    @if($calculations['is_eligible'])
                                        <div class="text-center mb-4">
                                            <div class="display-4 fw-bold">€{{ number_format($calculations['relief_amount'], 0) }}</div>
                                            <p class="mb-0">Potential HTB Relief</p>
                                        </div>

                                        <div class="row text-center">
                                            <div class="col-6 mb-3">
                                                <h4>€{{ number_format($calculations['net_property_cost'], 0) }}</h4>
                                                <small>Net Property Cost</small>
                                            </div>
                                            <div class="col-6 mb-3">
                                                <h4>€{{ number_format($calculations['required_deposit'], 0) }}</h4>
                                                <small>Required Deposit (10%)</small>
                                            </div>
                                            <div class="col-12">
                                                <h4>€{{ number_format($calculations['estimated_mortgage'], 0) }}</h4>
                                                <small>Estimated Mortgage</small>
                                            </div>
                                        </div>

                                        <hr class="my-3" style="border-color: rgba(255,255,255,0.3);">
                                        
                                        <div class="text-center">
                                            <p class="mb-3"><i class="fas fa-check-circle me-2"></i><strong>You are eligible for HTB relief!</strong></p>
                                            <a href="{{ route('htb.create') }}" class="btn btn-light">
                                                <i class="fas fa-file-alt me-2"></i>Start HTB Application
                                            </a>
                                        </div>
                                    @else
                                        <div class="text-center">
                                            <i class="fas fa-times-circle fa-3x mb-3"></i>
                                            <h4>Not Eligible</h4>
                                            <p>Based on the information provided, you may not be eligible for Help-to-Buy relief.</p>
                                            
                                            <div class="alert alert-warning mt-3">
                                                <small>
                                                    <strong>Requirements:</strong><br>
                                                    • First-time buyer<br>
                                                    • Owner-occupier<br>
                                                    • Property price ≤ €500,000<br>
                                                    • Minimum income requirements met
                                                </small>
                                            </div>
                                        </div>
                                    @endif
                                </div>
                            </div>
                        @else
                            <div class="card">
                                <div class="card-body text-center py-5">
                                    <i class="fas fa-calculator fa-3x text-muted mb-3"></i>
                                    <h5>Enter Your Details</h5>
                                    <p class="text-muted">Complete the form to calculate your potential Help-to-Buy relief</p>
                                </div>
                            </div>
                        @endif

                        @if(isset($calculations) && $calculations['is_eligible'])
                            <div class="card">
                                <div class="card-header">
                                    <h6 class="mb-0"><i class="fas fa-list me-2"></i>Next Steps</h6>
                                </div>
                                <div class="card-body">
                                    <div class="d-grid gap-2">
                                        <a href="{{ route('htb.create') }}" class="btn btn-outline-primary">
                                            <i class="fas fa-file-alt me-2"></i>Apply for HTB Relief
                                        </a>
                                        <a href="{{ route('properties.search') }}" class="btn btn-outline-secondary">
                                            <i class="fas fa-search me-2"></i>Browse New Build Properties
                                        </a>
                                        <a href="{{ route('buyer.journey.index') }}" class="btn btn-outline-info">
                                            <i class="fas fa-map-marked-alt me-2"></i>Start Buyer Journey
                                        </a>
                                    </div>
                                </div>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Real-time calculation preview
        document.addEventListener('DOMContentLoaded', function() {
            const priceInput = document.querySelector('input[name="property_price"]');
            const firstTimeBuyerInput = document.querySelector('input[name="is_first_time_buyer"]');
            const ownerOccupierInput = document.querySelector('input[name="is_owner_occupier"]');
            
            function updatePreview() {
                const price = parseFloat(priceInput.value) || 0;
                const isFirstTime = firstTimeBuyerInput.checked;
                const isOwnerOccupier = ownerOccupierInput.checked;
                
                if (price > 0 && isFirstTime && isOwnerOccupier && price <= 500000) {
                    const relief = Math.min(price * 0.10, 30000);
                    console.log('Estimated relief: €' + relief.toLocaleString());
                }
            }
            
            priceInput.addEventListener('input', updatePreview);
            firstTimeBuyerInput.addEventListener('change', updatePreview);
            ownerOccupierInput.addEventListener('change', updatePreview);
        });
    </script>
</body>
</html>