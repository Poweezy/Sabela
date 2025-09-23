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
    initScrollToTopButton();
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
// Weather Dashboard with Enhanced Features
function initWeatherDashboard() {
    const weatherGrid = document.getElementById('weatherGrid');
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (!weatherGrid || !lastUpdatedElement) return;
    const regions = [
        { name: 'Hhohho Region', lat: -26.3167, lon: 31.1333 },
        { name: 'Lubombo Region', lat: -26.4500, lon: 31.9500 },
        { name: 'Manzini Region', lat: -26.4833, lon: 31.3667 },
        { name: 'Shiselweni Region', lat: -27.1167, lon: 31.2000 }
    ];
    async function fetchWeatherData(lat, lon) {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,visibility,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    }
    function displayWeatherSkeleton() {
        weatherGrid.innerHTML = '';
        for (let i = 0; i < regions.length; i++) {
            const card = document.createElement('div');
            card.className = 'weather-card skeleton';
            card.innerHTML = `
                <div class="skeleton-box title"></div>
                <div class="skeleton-box icon"></div>
                <div class="skeleton-box temp"></div>
                <div class="skeleton-box condition"></div>
                <div class="skeleton-box detail"></div>
            `;
            weatherGrid.appendChild(card);
        }
    }

    async function updateWeatherDashboard() {
        updateTimestamp();
        displayWeatherSkeleton();

        const weatherPromises = regions.map(region => fetchWeatherData(region.lat, region.lon));
        const weatherDataResults = await Promise.all(weatherPromises);

        createWeatherCards(weatherDataResults);
    }

    // Maps WMO weather codes to a condition string and a Lucide icon name.
    function getWeatherCondition(code) {
        const wmo = {
            0: { condition: 'Clear sky', icon: 'sun' },
            1: { condition: 'Mainly clear', icon: 'sun' },
            2: { condition: 'Partly cloudy', icon: 'cloud' },
            3: { condition: 'Overcast', icon: 'cloud' },
            45: { condition: 'Fog', icon: 'cloud' },
            48: { condition: 'Depositing rime fog', icon: 'cloud' },
            51: { condition: 'Light drizzle', icon: 'cloud-drizzle' },
            53: { condition: 'Moderate drizzle', icon: 'cloud-drizzle' },
            55: { condition: 'Dense drizzle', icon: 'cloud-drizzle' },
            56: { condition: 'Light freezing drizzle', icon: 'cloud-drizzle' },
            57: { condition: 'Dense freezing drizzle', icon: 'cloud-drizzle' },
            61: { condition: 'Slight rain', icon: 'cloud-rain' },
            63: { condition: 'Moderate rain', icon: 'cloud-rain' },
            65: { condition: 'Heavy rain', icon: 'cloud-rain' },
            66: { condition: 'Light freezing rain', icon: 'cloud-rain' },
            67: { condition: 'Heavy freezing rain', icon: 'cloud-rain' },
            71: { condition: 'Slight snow fall', icon: 'cloud-snow' },
            73: { condition: 'Moderate snow fall', icon: 'cloud-snow' },
            75: { condition: 'Heavy snow fall', icon: 'cloud-snow' },
            77: { condition: 'Snow grains', icon: 'cloud-snow' },
            80: { condition: 'Slight rain showers', icon: 'cloud-rain' },
            81: { condition: 'Moderate rain showers', icon: 'cloud-rain' },
            82: { condition: 'Violent rain showers', icon: 'cloud-rain' },
            85: { condition: 'Slight snow showers', icon: 'cloud-snow' },
            86: { condition: 'Heavy snow showers', icon: 'cloud-snow' },
            95: { condition: 'Thunderstorm', icon: 'cloud-lightning' },
            96: { condition: 'Thunderstorm with hail', icon: 'cloud-lightning' },
            99: { condition: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
        };
        return wmo[code] || { condition: 'Cloudy', icon: 'cloud' };
    }

    // Update timestamp
    function updateTimestamp() {
        const now = new Date();
        lastUpdatedElement.textContent = now.toLocaleTimeString();
    }

    // Create weather cards
    function createWeatherCards(weatherData) {
        weatherGrid.innerHTML = '';

        weatherData.forEach((data, index) => {
            const card = document.createElement('div');
            card.className = 'weather-card';
            card.style.animationDelay = `${index * 0.1}s`;

            if (data && data.current) {
                const { temperature_2m: temp, relative_humidity_2m: humidity, weather_code, visibility, wind_speed_10m: windSpeed } = data.current;
                const { condition, icon } = getWeatherCondition(weather_code);
                const visibilityKm = (visibility / 1000).toFixed(1);

                card.innerHTML = `
                    <div class="weather-location">
                        <i data-lucide="map-pin"></i>
                        ${regions[index].name}
                    </div>
                    <div class="weather-icon">
                        <i data-lucide="${icon}"></i>
                    </div>
                    <div class="weather-temp ${getTemperatureClass(temp)}">${Math.round(temp)}°C</div>
                    <div class="weather-condition ${getConditionClass(condition)}">${condition}</div>
                    <div class="weather-details">
                        <div class="weather-detail">
                            <i data-lucide="droplets"></i>
                            <div class="weather-detail-value">${humidity}%</div>
                            <div class="weather-detail-label">Humidity</div>
                        </div>
                        <div class="weather-detail">
                            <i data-lucide="wind"></i>
                            <div class="weather-detail-value">${Math.round(windSpeed)} km/h</div>
                            <div class="weather-detail-label">Wind</div>
                        </div>
                        <div class="weather-detail">
                            <i data-lucide="eye"></i>
                            <div class="weather-detail-value">${visibilityKm} km</div>
                            <div class="weather-detail-label">Visibility</div>
                        </div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="weather-location">
                        <i data-lucide="map-pin"></i>
                        ${regions[index].name}
                    </div>
                    <div class="weather-error">
                        <i data-lucide="alert-triangle"></i>
                        <p>Could not load weather data.</p>
                        <p>Please try again later.</p>
                    </div>
                `;
                card.classList.add('error-card');
            }

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
        const lowerCaseCondition = condition.toLowerCase();
        if (lowerCaseCondition.includes('sun') || lowerCaseCondition.includes('clear')) {
            return 'condition-sunny';
        }
        if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('drizzle')) {
            return 'condition-rainy';
        }
        if (lowerCaseCondition.includes('cloud')) {
            return 'condition-partly-cloudy';
        }
        return 'condition-default';
    }

    // Initial load
    updateWeatherDashboard();

    // Update every 5 minutes
    setInterval(updateWeatherDashboard, 300000);

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

// Add CSS classes for weather conditions, now moved to style.css for better maintainability.
// The animation for .weather-card is also defined in style.css.

function initScrollToTopButton() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}