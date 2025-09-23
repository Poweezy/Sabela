// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initCounterAnimations();
    initWeatherDashboard();
    initContactForm();
    initHeaderScroll();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Change icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
        
        // Close menu when clicking on a link
        navLinks.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    }
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Scroll Animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Counter Animations
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        }
    }, duration / steps);
}

// Weather Dashboard
function initWeatherDashboard() {
    const weatherGrid = document.getElementById('weatherGrid');
    const lastUpdatedElement = document.getElementById('lastUpdated');
    
    if (!weatherGrid || !lastUpdatedElement) return;
    
    // Mock weather data for Eswatini regions
    const weatherData = [
        {
            location: 'Hhohho Region',
            temperature: 22,
            condition: 'Partly Cloudy',
            humidity: 65,
            windSpeed: 12,
            visibility: 10,
            icon: 'cloud'
        },
        {
            location: 'Lubombo Region',
            temperature: 28,
            condition: 'Sunny',
            humidity: 45,
            windSpeed: 8,
            visibility: 15,
            icon: 'sun'
        },
        {
            location: 'Manzini Region',
            temperature: 25,
            condition: 'Light Rain',
            humidity: 78,
            windSpeed: 15,
            visibility: 8,
            icon: 'cloud-rain'
        },
        {
            location: 'Shiselweni Region',
            temperature: 24,
            condition: 'Cloudy',
            humidity: 70,
            windSpeed: 10,
            visibility: 12,
            icon: 'cloud'
        }
    ];
    
    // Update timestamp
    function updateTimestamp() {
        const now = new Date();
        lastUpdatedElement.textContent = now.toLocaleTimeString();
    }
    
    // Create weather cards
    function createWeatherCards() {
        weatherGrid.innerHTML = '';
        
        weatherData.forEach((region, index) => {
            // Add some randomization to make it feel more real-time
            const temp = Math.round(region.temperature + (Math.random() - 0.5) * 2);
            const humidity = Math.max(30, Math.min(90, Math.round(region.humidity + (Math.random() - 0.5) * 10)));
            const windSpeed = Math.max(0, Math.round(region.windSpeed + (Math.random() - 0.5) * 5));
            
            const card = document.createElement('div');
            card.className = 'weather-card';
            card.style.animationDelay = `${index * 0.1}s`;
            
            card.innerHTML = `
                <div class="weather-location">
                    <i data-lucide="map-pin"></i>
                    ${region.location}
                </div>
                <div class="weather-icon">
                    <i data-lucide="${region.icon}"></i>
                </div>
                <div class="weather-temp ${getTemperatureClass(temp)}">${temp}°C</div>
                <div class="weather-condition ${getConditionClass(region.condition)}">${region.condition}</div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <i data-lucide="droplets"></i>
                        <div class="weather-detail-value">${humidity}%</div>
                        <div class="weather-detail-label">Humidity</div>
                    </div>
                    <div class="weather-detail">
                        <i data-lucide="wind"></i>
                        <div class="weather-detail-value">${windSpeed} km/h</div>
                        <div class="weather-detail-label">Wind</div>
                    </div>
                    <div class="weather-detail">
                        <i data-lucide="eye"></i>
                        <div class="weather-detail-value">${region.visibility} km</div>
                        <div class="weather-detail-label">Visibility</div>
                    </div>
                </div>
            `;
            
            weatherGrid.appendChild(card);
        });
        
        // Recreate icons for new elements
        lucide.createIcons();
    }
    
    function getTemperatureClass(temp) {
        if (temp >= 30) return 'temp-hot';
        if (temp >= 25) return 'temp-warm';
        if (temp >= 20) return 'temp-mild';
        return 'temp-cool';
    }
    
    function getConditionClass(condition) {
        switch (condition.toLowerCase()) {
            case 'sunny': return 'condition-sunny';
            case 'partly cloudy': return 'condition-partly-cloudy';
            case 'light rain': return 'condition-rainy';
            case 'cloudy': return 'condition-cloudy';
            default: return 'condition-default';
        }
    }
    
    // Initialize weather dashboard
    updateTimestamp();
    createWeatherCards();
    
    // Update every 5 minutes
    setInterval(() => {
        updateTimestamp();
        createWeatherCards();
    }, 300000);
    
    // Update timestamp every minute
    setInterval(updateTimestamp, 60000);
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Add CSS classes for weather conditions
const style = document.createElement('style');
style.textContent = `
    .temp-hot { color: #ef4444; }
    .temp-warm { color: #f97316; }
    .temp-mild { color: #22c55e; }
    .temp-cool { color: #3b82f6; }
    
    .condition-sunny { color: #f59e0b; }
    .condition-partly-cloudy { color: #6b7280; }
    .condition-rainy { color: #3b82f6; }
    .condition-cloudy { color: #6b7280; }
    .condition-default { color: #6b7280; }
    
    .weather-card {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(1rem);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);