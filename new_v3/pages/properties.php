<?php
/**
 * PropIE Platform v3 - Properties Listing Page
 * Browse and search available properties
 */

require_once '../includes/auth.php';
require_once '../config/database.php';

$pageTitle = 'Properties';
$bodyClass = 'properties-page';

// Initialize filters
$location = $_GET['location'] ?? '';
$propertyType = $_GET['property_type'] ?? '';
$priceMin = $_GET['price_min'] ?? '';
$priceMax = $_GET['price_max'] ?? '';
$bedrooms = $_GET['bedrooms'] ?? '';
$search = $_GET['search'] ?? '';
$page = (int)($_GET['page'] ?? 1);
$limit = 12;
$offset = ($page - 1) * $limit;

try {
    $db = Database::getInstance()->getConnection();
    
    // Build WHERE clause
    $whereConditions = ["p.status = 'AVAILABLE'"];
    $params = [];
    
    if ($location) {
        $whereConditions[] = "(l.city LIKE ? OR l.county LIKE ?)";
        $params[] = "%$location%";
        $params[] = "%$location%";
    }
    
    if ($propertyType) {
        $whereConditions[] = "p.property_type = ?";
        $params[] = $propertyType;
    }
    
    if ($priceMin) {
        $whereConditions[] = "p.price >= ?";
        $params[] = $priceMin;
    }
    
    if ($priceMax) {
        $whereConditions[] = "p.price <= ?";
        $params[] = $priceMax;
    }
    
    if ($bedrooms) {
        $whereConditions[] = "p.bedrooms >= ?";
        $params[] = $bedrooms;
    }
    
    if ($search) {
        $whereConditions[] = "(p.title LIKE ? OR p.description LIKE ? OR d.name LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    $whereClause = implode(' AND ', $whereConditions);
    
    // Get total count for pagination
    $countQuery = "
        SELECT COUNT(*) as total
        FROM properties p
        LEFT JOIN locations l ON p.location_id = l.id
        LEFT JOIN developments d ON p.development_id = d.id
        WHERE $whereClause
    ";
    
    $stmt = $db->prepare($countQuery);
    $stmt->execute($params);
    $totalProperties = $stmt->fetch()['total'];
    $totalPages = ceil($totalProperties / $limit);
    
    // Get properties
    $query = "
        SELECT p.*, l.city, l.county, d.name as development_name,
               (SELECT image_url FROM property_images WHERE property_id = p.id ORDER BY display_order LIMIT 1) as main_image_url
        FROM properties p
        LEFT JOIN locations l ON p.location_id = l.id
        LEFT JOIN developments d ON p.development_id = d.id
        WHERE $whereClause
        ORDER BY p.is_featured DESC, p.created_at DESC
        LIMIT $limit OFFSET $offset
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $properties = $stmt->fetchAll();
    
    // Get available locations for filter
    $stmt = $db->prepare("SELECT DISTINCT city, county FROM locations ORDER BY city");
    $stmt->execute();
    $locations = $stmt->fetchAll();
    
} catch (Exception $e) {
    error_log("Properties page error: " . $e->getMessage());
    $properties = [];
    $totalProperties = 0;
    $totalPages = 1;
    $locations = [];
}

include '../includes/header.php';
?>

<!-- Page Header -->
<section class="bg-secondary-50 py-6 border-b">
    <div class="container">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 class="mb-2">Properties</h1>
                <p class="text-secondary-600">
                    <?php echo number_format($totalProperties); ?> properties available
                    <?php if ($location || $propertyType || $priceMin || $priceMax || $bedrooms || $search): ?>
                        matching your criteria
                    <?php endif; ?>
                </p>
            </div>
            <div class="flex gap-2">
                <a href="/pages/htb-calculator.php" class="btn btn-outline-primary">HTB Calculator</a>
                <?php if (isLoggedIn()): ?>
                    <a href="/pages/saved-properties.php" class="btn btn-secondary">Saved Properties</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>

<!-- Search and Filters -->
<section class="bg-white py-4 border-b shadow-sm sticky top-[73px] z-40">
    <div class="container">
        <form method="GET" class="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <!-- Search -->
            <div class="form-group mb-0">
                <label class="form-label">Search</label>
                <input type="text" name="search" value="<?php echo htmlspecialchars($search); ?>" 
                       placeholder="Property name, location..." class="form-input">
            </div>
            
            <!-- Location -->
            <div class="form-group mb-0">
                <label class="form-label">Location</label>
                <select name="location" class="form-select">
                    <option value="">Any Location</option>
                    <?php foreach ($locations as $loc): ?>
                        <option value="<?php echo htmlspecialchars($loc['city']); ?>" 
                                <?php echo $location === $loc['city'] ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($loc['city'] . ', ' . $loc['county']); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            
            <!-- Property Type -->
            <div class="form-group mb-0">
                <label class="form-label">Type</label>
                <select name="property_type" class="form-select">
                    <option value="">Any Type</option>
                    <option value="APARTMENT" <?php echo $propertyType === 'APARTMENT' ? 'selected' : ''; ?>>Apartment</option>
                    <option value="HOUSE" <?php echo $propertyType === 'HOUSE' ? 'selected' : ''; ?>>House</option>
                    <option value="DUPLEX" <?php echo $propertyType === 'DUPLEX' ? 'selected' : ''; ?>>Duplex</option>
                    <option value="TOWNHOUSE" <?php echo $propertyType === 'TOWNHOUSE' ? 'selected' : ''; ?>>Townhouse</option>
                </select>
            </div>
            
            <!-- Price Range -->
            <div class="form-group mb-0">
                <label class="form-label">Price Range</label>
                <div class="flex gap-2">
                    <select name="price_min" class="form-select">
                        <option value="">Min</option>
                        <option value="200000" <?php echo $priceMin === '200000' ? 'selected' : ''; ?>>€200k</option>
                        <option value="300000" <?php echo $priceMin === '300000' ? 'selected' : ''; ?>>€300k</option>
                        <option value="400000" <?php echo $priceMin === '400000' ? 'selected' : ''; ?>>€400k</option>
                        <option value="500000" <?php echo $priceMin === '500000' ? 'selected' : ''; ?>>€500k</option>
                    </select>
                    <select name="price_max" class="form-select">
                        <option value="">Max</option>
                        <option value="300000" <?php echo $priceMax === '300000' ? 'selected' : ''; ?>>€300k</option>
                        <option value="400000" <?php echo $priceMax === '400000' ? 'selected' : ''; ?>>€400k</option>
                        <option value="500000" <?php echo $priceMax === '500000' ? 'selected' : ''; ?>>€500k</option>
                        <option value="750000" <?php echo $priceMax === '750000' ? 'selected' : ''; ?>>€750k</option>
                        <option value="1000000" <?php echo $priceMax === '1000000' ? 'selected' : ''; ?>>€1M</option>
                    </select>
                </div>
            </div>
            
            <!-- Bedrooms -->
            <div class="form-group mb-0">
                <label class="form-label">Bedrooms</label>
                <select name="bedrooms" class="form-select">
                    <option value="">Any</option>
                    <option value="1" <?php echo $bedrooms === '1' ? 'selected' : ''; ?>>1+</option>
                    <option value="2" <?php echo $bedrooms === '2' ? 'selected' : ''; ?>>2+</option>
                    <option value="3" <?php echo $bedrooms === '3' ? 'selected' : ''; ?>>3+</option>
                    <option value="4" <?php echo $bedrooms === '4' ? 'selected' : ''; ?>>4+</option>
                </select>
            </div>
            
            <!-- Search Button -->
            <div class="flex gap-2">
                <button type="submit" class="btn btn-primary">Search</button>
                <a href="/pages/properties.php" class="btn btn-secondary">Clear</a>
            </div>
        </form>
    </div>
</section>

<!-- Properties Grid -->
<section class="py-6">
    <div class="container">
        <?php if (!empty($properties)): ?>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="properties-grid">
                <?php foreach ($properties as $property): ?>
                    <div class="property-card animate-on-scroll">
                        <div class="relative">
                            <img src="<?php echo $property['main_image_url'] ?: '/assets/images/placeholder-property.jpg'; ?>" 
                                 alt="<?php echo htmlspecialchars($property['title']); ?>" 
                                 class="property-card-image"
                                 loading="lazy">
                            <?php if ($property['is_featured']): ?>
                                <div class="property-badge">Featured</div>
                            <?php endif; ?>
                            
                            <!-- Save Property Button -->
                            <?php if (isLoggedIn()): ?>
                                <button class="absolute top-3 left-3 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all"
                                        onclick="toggleSaveProperty('<?php echo $property['id']; ?>')"
                                        data-property-id="<?php echo $property['id']; ?>">
                                    <svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                                    </svg>
                                </button>
                            <?php endif; ?>
                        </div>
                        
                        <div class="property-card-content">
                            <h3 class="property-card-title"><?php echo htmlspecialchars($property['title']); ?></h3>
                            <p class="property-card-location">
                                📍 <?php echo htmlspecialchars($property['city'] . ', ' . $property['county']); ?>
                                <?php if ($property['development_name']): ?>
                                    <br><span class="text-xs text-secondary-500"><?php echo htmlspecialchars($property['development_name']); ?></span>
                                <?php endif; ?>
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
                            
                            <!-- HTB Eligibility -->
                            <?php if ($property['price'] <= 500000): ?>
                                <div class="bg-success-50 text-success-700 text-sm px-3 py-2 rounded-lg mb-3">
                                    ✓ Help-to-Buy Eligible (up to €<?php echo number_format(min($property['price'] * 0.1, 30000)); ?>)
                                </div>
                            <?php endif; ?>
                            
                            <div class="flex gap-2">
                                <a href="/pages/property-detail.php?id=<?php echo $property['id']; ?>" 
                                   class="btn btn-primary flex-1">View Details</a>
                                <?php if (isLoggedIn()): ?>
                                    <button onclick="scheduleViewing('<?php echo $property['id']; ?>')" 
                                            class="btn btn-outline-primary">
                                        📅
                                    </button>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            
            <!-- Pagination -->
            <?php if ($totalPages > 1): ?>
                <div class="flex justify-center items-center gap-2 mt-8">
                    <?php if ($page > 1): ?>
                        <a href="?<?php echo http_build_query(array_merge($_GET, ['page' => $page - 1])); ?>" 
                           class="btn btn-secondary">← Previous</a>
                    <?php endif; ?>
                    
                    <div class="flex gap-1">
                        <?php for ($i = max(1, $page - 2); $i <= min($totalPages, $page + 2); $i++): ?>
                            <a href="?<?php echo http_build_query(array_merge($_GET, ['page' => $i])); ?>" 
                               class="btn <?php echo $i === $page ? 'btn-primary' : 'btn-secondary'; ?>">
                                <?php echo $i; ?>
                            </a>
                        <?php endfor; ?>
                    </div>
                    
                    <?php if ($page < $totalPages): ?>
                        <a href="?<?php echo http_build_query(array_merge($_GET, ['page' => $page + 1])); ?>" 
                           class="btn btn-secondary">Next →</a>
                    <?php endif; ?>
                </div>
                
                <div class="text-center mt-4 text-secondary-600">
                    Showing <?php echo (($page - 1) * $limit) + 1; ?>-<?php echo min($page * $limit, $totalProperties); ?> 
                    of <?php echo number_format($totalProperties); ?> properties
                </div>
            <?php endif; ?>
            
        <?php else: ?>
            <!-- No Properties Found -->
            <div class="text-center py-12">
                <div class="text-6xl mb-4">🏠</div>
                <h3 class="mb-4">No Properties Found</h3>
                <p class="text-secondary-600 mb-6">
                    We couldn't find any properties matching your search criteria.<br>
                    Try adjusting your filters or browse all available properties.
                </p>
                <div class="flex gap-4 justify-center">
                    <a href="/pages/properties.php" class="btn btn-primary">View All Properties</a>
                    <a href="/pages/htb-calculator.php" class="btn btn-outline-primary">HTB Calculator</a>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>

<!-- CTA Section -->
<?php if (!isLoggedIn()): ?>
<section class="py-6 bg-primary-600 text-white">
    <div class="container text-center">
        <h3 class="text-white mb-4">Ready to Find Your Dream Home?</h3>
        <p class="mb-6 opacity-90">Create an account to save properties, schedule viewings, and get personalized recommendations.</p>
        <div class="flex gap-4 justify-center">
            <a href="/pages/register.php" class="btn btn-lg btn-secondary">Get Started</a>
            <a href="/pages/login.php" class="btn btn-lg btn-outline-primary">Sign In</a>
        </div>
    </div>
</section>
<?php endif; ?>

<script>
// Save property functionality
function toggleSaveProperty(propertyId) {
    if (!propertyId) return;
    
    fetch('/api/properties/save.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ property_id: propertyId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const button = document.querySelector(`[data-property-id="${propertyId}"]`);
            if (button) {
                button.innerHTML = data.saved ? 
                    '<svg class="w-5 h-5 text-error-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>' :
                    '<svg class="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>';
            }
            
            if (window.propie) {
                window.propie.showAlert(
                    data.saved ? 'Property saved!' : 'Property removed from saved list',
                    'success'
                );
            }
        } else {
            if (window.propie) {
                window.propie.showAlert(data.message || 'Error saving property', 'error');
            }
        }
    })
    .catch(error => {
        console.error('Save property error:', error);
        if (window.propie) {
            window.propie.showAlert('Error saving property', 'error');
        }
    });
}

// Schedule viewing functionality
function scheduleViewing(propertyId) {
    if (window.propie) {
        window.propie.showAlert('Viewing scheduling coming soon!', 'info');
    }
    // TODO: Implement viewing scheduling modal
}

// Initialize property search functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.propie) {
        window.propie.initPropertySearch();
    }
});
</script>

<?php include '../includes/footer.php'; ?>