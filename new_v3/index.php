<?php
/**
 * PropIE Platform v3 - Homepage
 * Modern property investment platform homepage
 */

require_once 'includes/auth.php';
require_once 'config/database.php';

$pageTitle = 'Home';
$bodyClass = 'homepage';

// Get featured properties for homepage
try {
    $db = Database::getInstance()->getConnection();
    $stmt = $db->prepare("
        SELECT p.*, l.city, l.county, d.name as development_name,
               (SELECT image_url FROM property_images WHERE property_id = p.id ORDER BY display_order LIMIT 1) as main_image_url
        FROM properties p
        LEFT JOIN locations l ON p.location_id = l.id
        LEFT JOIN developments d ON p.development_id = d.id
        WHERE p.status = 'AVAILABLE' AND p.is_featured = 1
        ORDER BY p.created_at DESC
        LIMIT 6
    ");
    $stmt->execute();
    $featuredProperties = $stmt->fetchAll();
} catch (Exception $e) {
    $featuredProperties = [];
    error_log("Featured properties error: " . $e->getMessage());
}

// Get property statistics
try {
    $stmt = $db->prepare("SELECT COUNT(*) as total_properties FROM properties WHERE status = 'AVAILABLE'");
    $stmt->execute();
    $totalProperties = $stmt->fetch()['total_properties'];
    
    $stmt = $db->prepare("SELECT COUNT(*) as total_developments FROM developments WHERE status = 'ACTIVE'");
    $stmt->execute();
    $totalDevelopments = $stmt->fetch()['total_developments'];
    
    $stmt = $db->prepare("SELECT COUNT(*) as total_buyers FROM users u JOIN user_roles ur ON u.id = ur.user_id WHERE ur.role = 'BUYER'");
    $stmt->execute();
    $totalBuyers = $stmt->fetch()['total_buyers'];
} catch (Exception $e) {
    $totalProperties = 0;
    $totalDevelopments = 0;
    $totalBuyers = 0;
    error_log("Statistics error: " . $e->getMessage());
}

include 'includes/header.php';
?>

<!-- Hero Section -->
<section class="hero">
    <div class="container">
        <div class="text-center">
            <h1 class="animate-fade-in">Ireland's Premier Property Investment Platform</h1>
            <p class="animate-fade-in" style="animation-delay: 0.2s;">
                Connect with the best developments, access Help-to-Buy relief, and find your perfect home with expert guidance.
            </p>
            <div class="flex flex-col md:grid-cols-2 gap-4 justify-center mt-6 max-w-md mx-auto animate-fade-in" style="animation-delay: 0.4s;">
                <a href="/pages/properties.php" class="btn btn-lg btn-outline-primary">Browse Properties</a>
                <a href="/pages/htb-calculator.php" class="btn btn-lg btn-secondary">HTB Calculator</a>
            </div>
        </div>
    </div>
</section>

<!-- Search Section -->
<section class="bg-white py-6 border-b shadow-sm">
    <div class="container">
        <div class="card">
            <div class="card-body">
                <h3 class="text-center mb-4">Find Your Perfect Property</h3>
                <form id="property-search-form" class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div class="form-group">
                        <label class="form-label">Location</label>
                        <select id="location-filter" name="location" class="form-select">
                            <option value="">Any Location</option>
                            <option value="Dublin">Dublin</option>
                            <option value="Cork">Cork</option>
                            <option value="Galway">Galway</option>
                            <option value="Limerick">Limerick</option>
                            <option value="Waterford">Waterford</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Property Type</label>
                        <select id="property-type" name="property_type" class="form-select">
                            <option value="">Any Type</option>
                            <option value="APARTMENT">Apartment</option>
                            <option value="HOUSE">House</option>
                            <option value="DUPLEX">Duplex</option>
                            <option value="TOWNHOUSE">Townhouse</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Max Price</label>
                        <select id="price-max" name="price_max" class="form-select">
                            <option value="">Any Price</option>
                            <option value="300000">€300,000</option>
                            <option value="400000">€400,000</option>
                            <option value="500000">€500,000</option>
                            <option value="750000">€750,000</option>
                            <option value="1000000">€1,000,000</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Bedrooms</label>
                        <select id="bedrooms" name="bedrooms" class="form-select">
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                        </select>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<!-- Statistics Section -->
<section class="py-6 bg-secondary-50">
    <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div class="animate-on-scroll">
                <div class="text-4xl font-bold text-primary-600"><?php echo number_format($totalProperties); ?></div>
                <div class="text-lg text-secondary-600">Available Properties</div>
            </div>
            <div class="animate-on-scroll">
                <div class="text-4xl font-bold text-primary-600"><?php echo number_format($totalDevelopments); ?></div>
                <div class="text-lg text-secondary-600">Active Developments</div>
            </div>
            <div class="animate-on-scroll">
                <div class="text-4xl font-bold text-primary-600"><?php echo number_format($totalBuyers); ?></div>
                <div class="text-lg text-secondary-600">Happy Buyers</div>
            </div>
        </div>
    </div>
</section>

<!-- Featured Properties Section -->
<section class="py-6">
    <div class="container">
        <div class="text-center mb-6">
            <h2>Featured Properties</h2>
            <p class="text-lg text-secondary-600">Discover our hand-picked selection of premium properties</p>
        </div>

        <?php if (!empty($featuredProperties)): ?>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="featured-properties">
                <?php foreach ($featuredProperties as $property): ?>
                    <div class="property-card animate-on-scroll">
                        <div class="relative">
                            <img src="<?php echo $property['main_image_url'] ?: '/assets/images/placeholder-property.jpg'; ?>" 
                                 alt="<?php echo htmlspecialchars($property['title']); ?>" 
                                 class="property-card-image">
                            <?php if ($property['is_featured']): ?>
                                <div class="property-badge">Featured</div>
                            <?php endif; ?>
                        </div>
                        <div class="property-card-content">
                            <h3 class="property-card-title"><?php echo htmlspecialchars($property['title']); ?></h3>
                            <p class="property-card-location">
                                📍 <?php echo htmlspecialchars($property['city'] . ', ' . $property['county']); ?>
                            </p>
                            <div class="property-card-price">€<?php echo number_format($property['price']); ?></div>
                            <div class="property-card-features">
                                <div class="property-feature">
                                    <span>🛏️</span> <?php echo $property['bedrooms']; ?> bed
                                </div>
                                <div class="property-feature">
                                    <span>🚿</span> <?php echo $property['bathrooms']; ?> bath
                                </div>
                                <div class="property-feature">
                                    <span>📐</span> <?php echo number_format($property['floor_area_sqm']); ?>m²
                                </div>
                            </div>
                            <a href="/pages/property-detail.php?id=<?php echo $property['id']; ?>" 
                               class="btn btn-primary btn-full">View Details</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div class="text-center py-6">
                <p class="text-lg text-secondary-600">No featured properties available at the moment.</p>
                <a href="/pages/properties.php" class="btn btn-primary mt-4">Browse All Properties</a>
            </div>
        <?php endif; ?>

        <div class="text-center mt-6">
            <a href="/pages/properties.php" class="btn btn-outline-primary btn-lg">View All Properties</a>
        </div>
    </div>
</section>

<!-- Services Section -->
<section class="py-6 bg-secondary-50">
    <div class="container">
        <div class="text-center mb-6">
            <h2>Our Services</h2>
            <p class="text-lg text-secondary-600">Comprehensive property solutions for every need</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="card text-center animate-on-scroll">
                <div class="card-body">
                    <div class="text-4xl mb-4">🏠</div>
                    <h4>First-Time Buyers</h4>
                    <p class="text-secondary-600 mb-4">Expert guidance and Help-to-Buy assistance for your first home purchase.</p>
                    <a href="/pages/buyer-services.php" class="btn btn-outline-primary">Learn More</a>
                </div>
            </div>

            <div class="card text-center animate-on-scroll">
                <div class="card-body">
                    <div class="text-4xl mb-4">🏗️</div>
                    <h4>Developers</h4>
                    <p class="text-secondary-600 mb-4">Showcase your developments and connect with qualified buyers.</p>
                    <a href="/pages/developer-services.php" class="btn btn-outline-primary">Learn More</a>
                </div>
            </div>

            <div class="card text-center animate-on-scroll">
                <div class="card-body">
                    <div class="text-4xl mb-4">🧮</div>
                    <h4>HTB Calculator</h4>
                    <p class="text-secondary-600 mb-4">Calculate your Help-to-Buy relief and see potential savings.</p>
                    <a href="/pages/htb-calculator.php" class="btn btn-outline-primary">Calculate Now</a>
                </div>
            </div>

            <div class="card text-center animate-on-scroll">
                <div class="card-body">
                    <div class="text-4xl mb-4">⚖️</div>
                    <h4>Legal Services</h4>
                    <p class="text-secondary-600 mb-4">Professional legal support throughout your property journey.</p>
                    <a href="/pages/legal-services.php" class="btn btn-outline-primary">Learn More</a>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- HTB Information Section -->
<section class="py-6 bg-primary-600 text-white">
    <div class="container">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            <div class="animate-on-scroll">
                <h2 class="text-white">Help-to-Buy Relief in Ireland</h2>
                <p class="text-xl mb-4 opacity-90">
                    Save up to €30,000 on your first home with Ireland's Help-to-Buy scheme.
                </p>
                <ul class="space-y-2 mb-6">
                    <li class="flex items-center">
                        <span class="mr-3">✓</span>
                        Up to 10% of property value (max €30,000)
                    </li>
                    <li class="flex items-center">
                        <span class="mr-3">✓</span>
                        Available for first-time buyers
                    </li>
                    <li class="flex items-center">
                        <span class="mr-3">✓</span>
                        Properties up to €500,000
                    </li>
                    <li class="flex items-center">
                        <span class="mr-3">✓</span>
                        Must be your principal residence
                    </li>
                </ul>
                <div class="flex gap-4">
                    <a href="/pages/htb-calculator.php" class="btn btn-lg btn-secondary">Calculate Relief</a>
                    <a href="/pages/htb-info.php" class="btn btn-lg btn-outline-primary">Learn More</a>
                </div>
            </div>
            <div class="text-center animate-on-scroll">
                <div class="bg-white text-primary-600 rounded-2xl p-6 inline-block">
                    <div class="text-5xl font-bold mb-2">€30,000</div>
                    <div class="text-lg">Maximum Relief</div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- Why Choose PropIE Section -->
<section class="py-6">
    <div class="container">
        <div class="text-center mb-6">
            <h2>Why Choose PropIE Platform?</h2>
            <p class="text-lg text-secondary-600">Ireland's most trusted property investment platform</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center animate-on-scroll">
                <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-2xl">🎯</span>
                </div>
                <h4>Expert Guidance</h4>
                <p class="text-secondary-600">Professional advice from experienced property experts throughout your journey.</p>
            </div>

            <div class="text-center animate-on-scroll">
                <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-2xl">🔒</span>
                </div>
                <h4>Secure Platform</h4>
                <p class="text-secondary-600">Advanced security measures to protect your personal and financial information.</p>
            </div>

            <div class="text-center animate-on-scroll">
                <div class="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="text-2xl">🚀</span>
                </div>
                <h4>Fast Process</h4>
                <p class="text-secondary-600">Streamlined processes to get you from browsing to owning your dream home faster.</p>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="py-6 bg-secondary-900 text-white">
    <div class="container text-center">
        <h2 class="text-white mb-4">Ready to Start Your Property Journey?</h2>
        <p class="text-xl mb-6 opacity-90">
            Join thousands of satisfied buyers who found their perfect home through PropIE Platform.
        </p>
        <div class="flex flex-col md:grid-cols-2 gap-4 justify-center max-w-md mx-auto">
            <?php if (isLoggedIn()): ?>
                <a href="/pages/buyer-journey.php" class="btn btn-lg btn-primary">View My Journey</a>
                <a href="/pages/properties.php" class="btn btn-lg btn-outline-primary">Browse Properties</a>
            <?php else: ?>
                <a href="/pages/register.php" class="btn btn-lg btn-primary">Get Started</a>
                <a href="/pages/login.php" class="btn btn-lg btn-outline-primary">Sign In</a>
            <?php endif; ?>
        </div>
    </div>
</section>

<script>
// Initialize property search on homepage
document.addEventListener('DOMContentLoaded', function() {
    // Auto-initialize property search functionality
    if (window.propie) {
        window.propie.initPropertySearch();
    }
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
</script>

<?php include 'includes/footer.php'; ?>