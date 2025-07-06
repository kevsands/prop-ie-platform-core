/**
 * PropIE Platform v3 - JavaScript Core
 * Modern vanilla JavaScript for enhanced user experience
 * Author: PropIE Development Team
 * Version: 3.0.0
 */

class PropIE {
    constructor() {
        this.init();
    }

    init() {
        this.initNavigation();
        this.initForms();
        this.initModals();
        this.initAnimations();
        this.initUtils();
        console.log('PropIE Platform v3.0.0 initialized');
    }

    // Navigation functionality
    initNavigation() {
        const navToggle = document.querySelector('.navbar-toggle');
        const navMenu = document.querySelector('.navbar-nav');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('open');
                navToggle.innerHTML = navMenu.classList.contains('open') ? '✕' : '☰';
            });
        }

        // Close mobile menu on link click
        document.querySelectorAll('.navbar-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) navMenu.classList.remove('open');
                if (navToggle) navToggle.innerHTML = '☰';
            });
        });

        // Active navigation highlighting
        this.highlightActiveNav();
    }

    highlightActiveNav() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.navbar-link').forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    // Form enhancements
    initForms() {
        // Real-time validation
        document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => this.clearFieldError(e.target));
        });

        // Form submission handling
        document.querySelectorAll('form[data-ajax="true"]').forEach(form => {
            form.addEventListener('submit', (e) => this.handleAjaxForm(e));
        });

        // File upload preview
        document.querySelectorAll('input[type="file"]').forEach(input => {
            input.addEventListener('change', (e) => this.handleFilePreview(e));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        this.clearFieldError(field);

        // Required field validation
        if (required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        // Phone validation
        if (field.name === 'phone' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        // Password validation
        if (type === 'password' && value && value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters';
        }

        // Price validation
        if (field.name.includes('price') && value && (isNaN(value) || parseFloat(value) < 0)) {
            isValid = false;
            errorMessage = 'Please enter a valid price';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.form-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // AJAX form handling
    async handleAjaxForm(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Validate all fields
        let isFormValid = true;
        form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showAlert('Please correct the errors above', 'error');
            return;
        }

        // Show loading state
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert(result.message || 'Operation completed successfully', 'success');
                if (result.redirect) {
                    setTimeout(() => window.location.href = result.redirect, 1500);
                }
                if (result.reset) {
                    form.reset();
                }
            } else {
                this.showAlert(result.message || 'An error occurred', 'error');
                if (result.errors) {
                    this.showFormErrors(form, result.errors);
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showAlert('Network error. Please try again.', 'error');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
        }
    }

    showFormErrors(form, errors) {
        Object.keys(errors).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.showFieldError(field, errors[fieldName]);
            }
        });
    }

    // File upload preview
    handleFilePreview(event) {
        const input = event.target;
        const files = Array.from(input.files);
        const previewContainer = document.querySelector(`#${input.id}-preview`);

        if (!previewContainer) return;

        previewContainer.innerHTML = '';

        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'w-20 h-20 object-cover rounded-lg';
                    previewContainer.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Modal functionality
    initModals() {
        // Open modal
        document.querySelectorAll('[data-modal-target]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal-target');
                this.openModal(modalId);
            });
        });

        // Close modal
        document.querySelectorAll('[data-modal-close]').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                const modal = closeBtn.closest('.modal');
                if (modal) this.closeModal(modal.id);
            });
        });

        // Close modal on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    const modal = overlay.querySelector('.modal');
                    if (modal) this.closeModal(modal.id);
                }
            });
        });

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.open');
                if (openModal) this.closeModal(openModal.id);
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    // Animation initialization
    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Utility functions
    initUtils() {
        // Auto-hide alerts
        document.querySelectorAll('.alert[data-auto-hide]').forEach(alert => {
            const delay = parseInt(alert.getAttribute('data-auto-hide')) || 5000;
            setTimeout(() => {
                alert.style.opacity = '0';
                setTimeout(() => alert.remove(), 300);
            }, delay);
        });

        // Copy to clipboard functionality
        document.querySelectorAll('[data-copy]').forEach(copyBtn => {
            copyBtn.addEventListener('click', () => {
                const text = copyBtn.getAttribute('data-copy');
                navigator.clipboard.writeText(text).then(() => {
                    this.showAlert('Copied to clipboard!', 'success');
                });
            });
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Alert system
    showAlert(message, type = 'info', duration = 5000) {
        const alertContainer = document.getElementById('alert-container') || this.createAlertContainer();
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} animate-fade-in`;
        alert.innerHTML = `
            <div class="flex items-center justify-between">
                <span>${message}</span>
                <button class="ml-4 text-lg" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        alertContainer.appendChild(alert);

        // Auto-remove after duration
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 300);
        }, duration);
    }

    createAlertContainer() {
        const container = document.createElement('div');
        container.id = 'alert-container';
        container.className = 'fixed top-4 right-4 z-50 space-y-2';
        container.style.cssText = 'position: fixed; top: 1rem; right: 1rem; z-index: 50;';
        document.body.appendChild(container);
        return container;
    }

    // Property search functionality
    initPropertySearch() {
        const searchForm = document.getElementById('property-search-form');
        if (!searchForm) return;

        const searchInput = searchForm.querySelector('#search-input');
        const locationFilter = searchForm.querySelector('#location-filter');
        const priceMinFilter = searchForm.querySelector('#price-min');
        const priceMaxFilter = searchForm.querySelector('#price-max');
        const propertyTypeFilter = searchForm.querySelector('#property-type');
        const bedroomsFilter = searchForm.querySelector('#bedrooms');

        // Debounced search
        let searchTimeout;
        const performSearch = () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.searchProperties();
            }, 500);
        };

        [searchInput, locationFilter, priceMinFilter, priceMaxFilter, propertyTypeFilter, bedroomsFilter]
            .forEach(input => {
                if (input) {
                    input.addEventListener('input', performSearch);
                    input.addEventListener('change', performSearch);
                }
            });
    }

    async searchProperties() {
        const form = document.getElementById('property-search-form');
        const resultsContainer = document.getElementById('search-results');
        
        if (!form || !resultsContainer) return;

        const formData = new FormData(form);
        const params = new URLSearchParams(formData);

        try {
            resultsContainer.innerHTML = '<div class="text-center p-4"><div class="spinner mx-auto"></div></div>';

            const response = await fetch(`/api/properties/search?${params}`, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });

            const data = await response.json();

            if (data.success) {
                this.renderSearchResults(data.properties, resultsContainer);
            } else {
                resultsContainer.innerHTML = '<p class="text-center text-muted p-4">No properties found</p>';
            }
        } catch (error) {
            console.error('Search error:', error);
            resultsContainer.innerHTML = '<p class="text-center text-error p-4">Search failed. Please try again.</p>';
        }
    }

    renderSearchResults(properties, container) {
        if (!properties.length) {
            container.innerHTML = '<p class="text-center text-muted p-4">No properties found matching your criteria</p>';
            return;
        }

        const html = properties.map(property => `
            <div class="property-card animate-on-scroll">
                <div class="relative">
                    <img src="${property.main_image_url || '/assets/images/placeholder-property.jpg'}" 
                         alt="${property.title}" class="property-card-image">
                    ${property.is_featured ? '<div class="property-badge">Featured</div>' : ''}
                </div>
                <div class="property-card-content">
                    <h3 class="property-card-title">${property.title}</h3>
                    <p class="property-card-location">${property.location}</p>
                    <div class="property-card-price">${this.formatPrice(property.price)}</div>
                    <div class="property-card-features">
                        <div class="property-feature">
                            <span>🛏️</span> ${property.bedrooms} bed
                        </div>
                        <div class="property-feature">
                            <span>🚿</span> ${property.bathrooms} bath
                        </div>
                        <div class="property-feature">
                            <span>📐</span> ${property.floor_area_sqm}m²
                        </div>
                    </div>
                    <a href="/properties/${property.slug}" class="btn btn-primary btn-full">View Details</a>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;

        // Re-initialize animations for new elements
        container.querySelectorAll('.animate-on-scroll').forEach(el => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in');
                    }
                });
            }, { threshold: 0.1 });
            observer.observe(el);
        });
    }

    // HTB Calculator functionality
    initHTBCalculator() {
        const calculatorForm = document.getElementById('htb-calculator-form');
        if (!calculatorForm) return;

        const propertyPriceInput = calculatorForm.querySelector('#property-price');
        const annualIncomeInput = calculatorForm.querySelector('#annual-income');
        const firstTimeBuyerInput = calculatorForm.querySelector('#first-time-buyer');
        const ownerOccupierInput = calculatorForm.querySelector('#owner-occupier');
        const resultsContainer = calculatorForm.querySelector('#calculator-results');

        const calculateHTB = () => {
            const propertyPrice = parseFloat(propertyPriceInput.value) || 0;
            const annualIncome = parseFloat(annualIncomeInput.value) || 0;
            const isFirstTimeBuyer = firstTimeBuyerInput.checked;
            const isOwnerOccupier = ownerOccupierInput.checked;

            // HTB eligibility rules
            const isEligible = isFirstTimeBuyer && isOwnerOccupier && 
                              propertyPrice <= 500000 && annualIncome >= 10000;

            const reliefAmount = isEligible ? Math.min(propertyPrice * 0.1, 30000) : 0;
            const netCost = propertyPrice - reliefAmount;
            const requiredDeposit = netCost * 0.1;
            const estimatedMortgage = netCost * 0.9;

            this.displayHTBResults({
                isEligible,
                propertyPrice,
                reliefAmount,
                netCost,
                requiredDeposit,
                estimatedMortgage
            }, resultsContainer);
        };

        // Real-time calculation
        [propertyPriceInput, annualIncomeInput, firstTimeBuyerInput, ownerOccupierInput]
            .forEach(input => {
                if (input) {
                    input.addEventListener('input', calculateHTB);
                    input.addEventListener('change', calculateHTB);
                }
            });
    }

    displayHTBResults(results, container) {
        if (!results.propertyPrice) {
            container.innerHTML = '<p class="text-center text-muted">Enter property details to see calculations</p>';
            return;
        }

        const html = results.isEligible ? `
            <div class="bg-success text-white rounded-xl p-6 text-center">
                <h3 class="text-2xl font-bold mb-4">✅ You're Eligible!</h3>
                <div class="text-4xl font-bold mb-2">${this.formatPrice(results.reliefAmount)}</div>
                <p class="mb-4">Potential HTB Relief</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                        <div class="text-xl font-semibold">${this.formatPrice(results.netCost)}</div>
                        <div class="text-sm opacity-90">Net Property Cost</div>
                    </div>
                    <div>
                        <div class="text-xl font-semibold">${this.formatPrice(results.requiredDeposit)}</div>
                        <div class="text-sm opacity-90">Required Deposit</div>
                    </div>
                    <div>
                        <div class="text-xl font-semibold">${this.formatPrice(results.estimatedMortgage)}</div>
                        <div class="text-sm opacity-90">Estimated Mortgage</div>
                    </div>
                </div>
                <a href="/htb/application" class="btn btn-outline-primary mt-4">Apply for HTB</a>
            </div>
        ` : `
            <div class="bg-error text-white rounded-xl p-6 text-center">
                <h3 class="text-2xl font-bold mb-4">❌ Not Eligible</h3>
                <p class="mb-4">Based on the current criteria, you may not qualify for Help-to-Buy relief.</p>
                <div class="text-sm opacity-90">
                    <p><strong>Requirements:</strong></p>
                    <ul class="list-disc list-inside mt-2">
                        <li>First-time buyer</li>
                        <li>Owner-occupier</li>
                        <li>Property price ≤ €500,000</li>
                        <li>Minimum income requirements</li>
                    </ul>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Utility methods
    formatPrice(price) {
        return '€' + new Intl.NumberFormat('en-IE').format(price);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-IE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // API helper methods
    async apiRequest(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };

        const response = await fetch(url, { ...defaultOptions, ...options });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}

// Initialize PropIE when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.propie = new PropIE();
    
    // Initialize specific components based on page
    const path = window.location.pathname;
    
    if (path.includes('/properties') || path.includes('/search')) {
        window.propie.initPropertySearch();
    }
    
    if (path.includes('/htb/calculator')) {
        window.propie.initHTBCalculator();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PropIE;
}