<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PropIE Platform - Property Investment Excellence</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        .hero-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 80px 0;
        }
        .feature-card {
            border: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-5px);
        }
        .stat-box {
            background: #f8f9fa;
            border-radius: 10px;
            padding: 30px;
            text-align: center;
        }
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #667eea;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container">
            <a class="navbar-brand fw-bold" href="{{ route('dashboard') }}">
                <i class="fas fa-building me-2"></i>PropIE Platform
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('properties.index') }}">Properties</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('developments.index') }}">Developments</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('properties.search') }}">Search</a>
                    </li>
                </ul>
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('htb.calculator') }}">HTB Calculator</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-user me-1"></i>User Portal
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="{{ route('dashboard.buyer') }}">Buyer Dashboard</a></li>
                            <li><a class="dropdown-item" href="{{ route('dashboard.developer') }}">Developer Portal</a></li>
                            <li><a class="dropdown-item" href="{{ route('dashboard.admin') }}">Admin Panel</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="{{ route('buyer.journey.index') }}">My Buyer Journey</a></li>
                            <li><a class="dropdown-item" href="{{ route('htb.application') }}">HTB Applications</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h1 class="display-4 fw-bold mb-4">PropIE Platform</h1>
                    <p class="lead mb-4">Comprehensive Property Investment & Development Platform for Ireland</p>
                    <p class="mb-4">Multi-professional collaboration platform supporting developers, buyers, architects, engineers, quantity surveyors, solicitors, and project managers.</p>
                    <div class="d-flex gap-3 flex-wrap">
                        <a href="{{ route('properties.index') }}" class="btn btn-light btn-lg">
                            <i class="fas fa-search me-2"></i>Browse Properties
                        </a>
                        <a href="{{ route('developments.index') }}" class="btn btn-outline-light btn-lg">
                            <i class="fas fa-building me-2"></i>View Developments
                        </a>
                        <a href="{{ route('htb.calculator') }}" class="btn btn-outline-light btn-lg">
                            <i class="fas fa-calculator me-2"></i>HTB Calculator
                        </a>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="row g-3">
                        <div class="col-6">
                            <div class="stat-box bg-white">
                                <div class="stat-number">285+</div>
                                <div>Platform Features</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="stat-box bg-white">
                                <div class="stat-number">9</div>
                                <div>Professional Roles</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="stat-box bg-white">
                                <div class="stat-number">50+</div>
                                <div>Database Tables</div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="stat-box bg-white">
                                <div class="stat-number">80+</div>
                                <div>User Interfaces</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="py-5">
        <div class="container">
            <div class="row text-center mb-5">
                <div class="col-lg-8 mx-auto">
                    <h2 class="display-5 fw-bold">Platform Features</h2>
                    <p class="lead text-muted">Comprehensive tools for every stage of property development and investment</p>
                </div>
            </div>
            
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <div class="mb-3">
                                <i class="fas fa-users fa-3x text-primary"></i>
                            </div>
                            <h5 class="card-title">User Management</h5>
                            <p class="card-text">Multi-role user system supporting 9 distinct professional roles with granular permissions and KYC verification.</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <div class="mb-3">
                                <i class="fas fa-building fa-3x text-success"></i>
                            </div>
                            <h5 class="card-title">Property Management</h5>
                            <p class="card-text">Advanced property listings, development lifecycle tracking, unit management, and 3D customization engine.</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <div class="mb-3">
                                <i class="fas fa-handshake fa-3x text-warning"></i>
                            </div>
                            <h5 class="card-title">Transaction Engine</h5>
                            <p class="card-text">Complete purchase workflow with legal reservations, document management, and Help-to-Buy integration.</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <div class="mb-3">
                                <i class="fas fa-chart-line fa-3x text-info"></i>
                            </div>
                            <h5 class="card-title">Analytics & BI</h5>
                            <p class="card-text">Real-time analytics, business intelligence, automated reporting, and predictive insights.</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <div class="mb-3">
                                <i class="fas fa-home fa-3x text-danger"></i>
                            </div>
                            <h5 class="card-title">First-Time Buyers</h5>
                            <p class="card-text">Specialized tools for first-time buyers including HTB calculator, guided journey, and legal support.</p>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-4">
                    <div class="card feature-card h-100">
                        <div class="card-body text-center">
                            <div class="mb-3">
                                <i class="fas fa-hard-hat fa-3x text-secondary"></i>
                            </div>
                            <h5 class="card-title">Professional Services</h5>
                            <p class="card-text">Integrated workflows for architects, engineers, quantity surveyors, and legal professionals.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Professional Roles Section -->
    <section class="py-5 bg-light">
        <div class="container">
            <div class="row text-center mb-5">
                <div class="col-lg-8 mx-auto">
                    <h2 class="display-5 fw-bold">Supported Professional Roles</h2>
                    <p class="lead text-muted">Comprehensive support for all stakeholders in property development</p>
                </div>
            </div>
            
            <div class="row g-3">
                <div class="col-md-3 col-sm-6">
                    <div class="text-center p-3">
                        <i class="fas fa-user-tie fa-2x text-primary mb-2"></i>
                        <h6>Admin</h6>
                        <small class="text-muted">Platform oversight</small>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="text-center p-3">
                        <i class="fas fa-drafting-compass fa-2x text-success mb-2"></i>
                        <h6>Developer</h6>
                        <small class="text-muted">Project development</small>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="text-center p-3">
                        <i class="fas fa-home fa-2x text-warning mb-2"></i>
                        <h6>Buyer</h6>
                        <small class="text-muted">Property purchase</small>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="text-center p-3">
                        <i class="fas fa-handshake fa-2x text-info mb-2"></i>
                        <h6>Agent</h6>
                        <small class="text-muted">Sales professional</small>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="text-center p-3">
                        <i class="fas fa-balance-scale fa-2x text-danger mb-2"></i>
                        <h6>Solicitor</h6>
                        <small class="text-muted">Legal services</small>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="text-center p-3">
                        <i class="fas fa-chart-pie fa-2x text-secondary mb-2"></i>
                        <h6>Investor</h6>
                        <small class="text-muted">Investment analysis</small>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="text-center p-3">
                        <i class="fas fa-ruler-combined fa-2x text-dark mb-2"></i>
                        <h6>Architect</h6>
                        <small class="text-muted">Design & planning</small>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6">
                    <div class="text-center p-3">
                        <i class="fas fa-tasks fa-2x text-primary mb-2"></i>
                        <h6>Project Manager</h6>
                        <small class="text-muted">Project coordination</small>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-5">
        <div class="container">
            <div class="row text-center">
                <div class="col-lg-8 mx-auto">
                    <h2 class="display-5 fw-bold mb-4">Ready to Get Started?</h2>
                    <p class="lead mb-4">Join Ireland's most comprehensive property development and investment platform</p>
                    <div class="d-flex justify-content-center gap-3">
                        <a href="{{ route('properties.search') }}" class="btn btn-primary btn-lg">
                            <i class="fas fa-search me-2"></i>Search Properties
                        </a>
                        <a href="{{ route('dashboard.developer') }}" class="btn btn-outline-primary btn-lg">
                            <i class="fas fa-building me-2"></i>Developer Portal
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="fas fa-building me-2"></i>PropIE Platform</h6>
                    <p class="mb-0">Ireland's comprehensive property development platform</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <p class="mb-0">Built with Laravel 10 + PHP 8.2 + MySQL 8.0</p>
                    <small class="text-muted">Version 2.0 - PropIE Platform Core</small>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>