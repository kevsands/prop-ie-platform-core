<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="PropIE Platform - Ireland's Premier Property Investment & Development Platform">
    <meta name="keywords" content="property, real estate, Ireland, investment, development, first-time buyer, help-to-buy">
    <meta name="author" content="PropIE Platform">
    
    <title><?php echo isset($pageTitle) ? $pageTitle . ' - PropIE Platform' : 'PropIE Platform - Property Investment Excellence'; ?></title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/assets/images/favicon.ico">
    
    <!-- CSS -->
    <link rel="stylesheet" href="/assets/css/propie.css">
    
    <!-- Additional CSS -->
    <?php if (isset($additionalCSS)): ?>
        <?php foreach ($additionalCSS as $css): ?>
            <link rel="stylesheet" href="<?php echo $css; ?>">
        <?php endforeach; ?>
    <?php endif; ?>
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="<?php echo isset($pageTitle) ? $pageTitle : 'PropIE Platform'; ?>">
    <meta property="og:description" content="Ireland's Premier Property Investment & Development Platform">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo APP_URL . $_SERVER['REQUEST_URI']; ?>">
    <meta property="og:image" content="/assets/images/propie-og-image.jpg">
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "PropIE Platform",
        "description": "Ireland's Premier Property Investment & Development Platform",
        "url": "<?php echo APP_URL; ?>",
        "logo": "<?php echo APP_URL; ?>/assets/images/logo.png",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+353-1-234-5678",
            "contactType": "customer service",
            "availableLanguage": "English"
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "IE"
        }
    }
    </script>
</head>
<body class="<?php echo isset($bodyClass) ? $bodyClass : ''; ?>">
    
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="sr-only sr-only-focusable">Skip to main content</a>
    
    <!-- Navigation -->
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="container">
            <div class="navbar-container">
                <!-- Brand Logo -->
                <a href="/" class="navbar-brand" aria-label="PropIE Platform Home">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" class="inline mr-2">
                        <path d="M16 2L3 10v20h26V10L16 2zm0 3.2L25 11v17H7V11l9-5.8z"/>
                        <path d="M10 14h12v2H10zm0 4h12v2H10zm0 4h8v2h-8z"/>
                    </svg>
                    PropIE Platform
                </a>
                
                <!-- Mobile Menu Toggle -->
                <button class="navbar-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
                    ☰
                </button>
                
                <!-- Navigation Menu -->
                <ul class="navbar-nav" role="menubar">
                    <li role="none">
                        <a href="/pages/properties.php" class="navbar-link" role="menuitem">Properties</a>
                    </li>
                    <li role="none">
                        <a href="/pages/developments.php" class="navbar-link" role="menuitem">Developments</a>
                    </li>
                    <li role="none">
                        <a href="/pages/htb-calculator.php" class="navbar-link" role="menuitem">HTB Calculator</a>
                    </li>
                    
                    <?php if (isLoggedIn()): ?>
                        <?php $currentUser = user(); ?>
                        <li class="relative" role="none">
                            <button class="navbar-link" data-dropdown-toggle="user-menu" aria-haspopup="true" aria-expanded="false" role="menuitem">
                                <?php echo htmlspecialchars($currentUser['first_name']); ?>
                                <svg class="w-4 h-4 ml-1 inline" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                                </svg>
                            </button>
                            
                            <!-- Dropdown Menu -->
                            <div id="user-menu" class="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50" role="menu">
                                <div class="py-1">
                                    <div class="px-4 py-2 text-sm text-secondary-700 border-b">
                                        <div class="font-medium"><?php echo htmlspecialchars($currentUser['full_name']); ?></div>
                                        <div class="text-xs text-secondary-500"><?php echo htmlspecialchars($currentUser['email']); ?></div>
                                    </div>
                                    
                                    <?php if (hasRole('BUYER')): ?>
                                        <a href="/pages/buyer-journey.php" class="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50" role="menuitem">
                                            🏠 My Property Journey
                                        </a>
                                        <a href="/pages/htb-application.php" class="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50" role="menuitem">
                                            🧮 HTB Applications
                                        </a>
                                    <?php endif; ?>
                                    
                                    <?php if (hasRole('DEVELOPER')): ?>
                                        <a href="/pages/developer-portal.php" class="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50" role="menuitem">
                                            🏗️ Developer Portal
                                        </a>
                                        <a href="/pages/my-developments.php" class="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50" role="menuitem">
                                            🏢 My Developments
                                        </a>
                                    <?php endif; ?>
                                    
                                    <?php if (hasRole('ADMIN')): ?>
                                        <a href="/pages/admin-dashboard.php" class="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50" role="menuitem">
                                            ⚙️ Admin Dashboard
                                        </a>
                                    <?php endif; ?>
                                    
                                    <hr class="my-1">
                                    <a href="/pages/profile.php" class="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50" role="menuitem">
                                        👤 Profile Settings
                                    </a>
                                    <a href="/api/auth.php?action=logout" class="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50" role="menuitem">
                                        🚪 Logout
                                    </a>
                                </div>
                            </div>
                        </li>
                    <?php else: ?>
                        <li role="none">
                            <a href="/pages/login.php" class="navbar-link" role="menuitem">Login</a>
                        </li>
                        <li role="none">
                            <a href="/pages/register.php" class="btn btn-primary btn-sm" role="menuitem">Get Started</a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>
    
    <!-- Alert Container for JavaScript alerts -->
    <div id="alert-container" class="fixed top-4 right-4 z-50 space-y-2" style="position: fixed; top: 1rem; right: 1rem; z-index: 50;"></div>
    
    <!-- Main Content Start -->
    <main id="main-content" role="main">
    
    <style>
        /* Dropdown Menu Styles */
        .relative { position: relative; }
        
        #user-menu {
            transition: all 0.2s ease-in-out;
            transform: translateY(-10px);
            opacity: 0;
            visibility: hidden;
        }
        
        #user-menu.show {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        /* Screen reader only content */
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        }
        
        .sr-only-focusable:focus {
            position: static;
            width: auto;
            height: auto;
            padding: 0.5rem 1rem;
            margin: 0;
            overflow: visible;
            clip: auto;
            white-space: normal;
            background-color: var(--primary-600);
            color: white;
            text-decoration: none;
            z-index: 100;
        }
        
        /* Loading state for navigation */
        .navbar.loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        /* Active navigation state */
        .navbar-link.active {
            color: var(--primary-600);
            font-weight: 600;
        }
        
        /* Mobile navigation improvements */
        @media (max-width: 768px) {
            .navbar-nav.open {
                animation: slideDown 0.3s ease-out;
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        }
    </style>
    
    <script>
        // Dropdown menu functionality
        document.addEventListener('DOMContentLoaded', function() {
            const dropdownToggle = document.querySelector('[data-dropdown-toggle="user-menu"]');
            const dropdownMenu = document.getElementById('user-menu');
            
            if (dropdownToggle && dropdownMenu) {
                dropdownToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isOpen = dropdownMenu.classList.contains('show');
                    
                    if (isOpen) {
                        dropdownMenu.classList.remove('show');
                        dropdownMenu.classList.add('hidden');
                        dropdownToggle.setAttribute('aria-expanded', 'false');
                    } else {
                        dropdownMenu.classList.remove('hidden');
                        setTimeout(() => dropdownMenu.classList.add('show'), 10);
                        dropdownToggle.setAttribute('aria-expanded', 'true');
                    }
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function(e) {
                    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                        dropdownMenu.classList.remove('show');
                        dropdownMenu.classList.add('hidden');
                        dropdownToggle.setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Close dropdown on escape key
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && dropdownMenu.classList.contains('show')) {
                        dropdownMenu.classList.remove('show');
                        dropdownMenu.classList.add('hidden');
                        dropdownToggle.setAttribute('aria-expanded', 'false');
                        dropdownToggle.focus();
                    }
                });
            }
        });
    </script>