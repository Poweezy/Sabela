(function() {
    'use strict';

// Initialize Lucide icons with error handling
document.addEventListener('DOMContentLoaded', function() {
    // Add aria-hidden="true" to all lucide icons for accessibility
    const icons = document.querySelectorAll('i[data-lucide]');
    icons.forEach(icon => {
        icon.setAttribute('aria-hidden', 'true');
    });

    try {
        lucide.createIcons();
    } catch (error) {
        console.warn('Lucide icons failed to load:', error);
        // Fallback: Replace icons with text
        document.querySelectorAll('[data-lucide]').forEach(el => {
            const iconName = el.getAttribute('data-lucide');
            el.innerHTML = `[${iconName}]`;
        });
    }
    
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initCounterAnimations();
    initWeatherDashboard();
    initVolunteerForm();
    initContactForm();
    initHeaderScroll();
    initScrollButtons();
    initResourceSearch();
    initBlogFilter();
    initQuizModal();
    initFileUpload();
    initMap();
    initLightboxGallery();
});

// Mobile Menu Functionality with Enhanced Keyboard Navigation
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navLinkElements = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

    if (mobileMenuBtn && navLinks) {
        // Add ARIA roles
        navLinks.setAttribute('role', 'menu');
        navLinkElements.forEach(link => {
            link.setAttribute('role', 'menuitem');
        });

        // Helper function to close menu
        function closeMenu() {
            navLinks.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', 'menu');
            mobileMenuBtn.setAttribute('aria-label', 'Open menu');
            // Set all nav links to tabindex="-1" when closed
            navLinkElements.forEach(link => link.setAttribute('tabindex', '-1'));
            // Return focus to menu button when closed
            mobileMenuBtn.focus();
            lucide.createIcons();
        }

        // Toggle menu function
        function toggleMenu() {
            const isOpened = navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpened);

            // Change icon and aria-label
            const icon = mobileMenuBtn.querySelector('i');
            if (isOpened) {
                icon.setAttribute('data-lucide', 'x');
                mobileMenuBtn.setAttribute('aria-label', 'Close menu');
                // Set all nav links to tabindex="0" when opened
                navLinkElements.forEach(link => link.setAttribute('tabindex', '0'));
                // Focus first menu item when opened
                if (navLinkElements.length > 0) {
                    navLinkElements[0].focus();
                }
            } else {
                closeMenu();
            }
            lucide.createIcons();
        }

        // Click event for menu button
        mobileMenuBtn.addEventListener('click', toggleMenu);

        // Keyboard navigation for menu button
        mobileMenuBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMenu();
            }
        });

        // Close menu when clicking on a link
        navLinks.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                closeMenu();
            }
        });

        // Enhanced keyboard navigation within menu
        navLinks.addEventListener('keydown', function(e) {
            const currentIndex = Array.from(navLinkElements).indexOf(document.activeElement);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % navLinkElements.length;
                    navLinkElements[nextIndex].focus();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex <= 0 ? navLinkElements.length - 1 : currentIndex - 1;
                    navLinkElements[prevIndex].focus();
                    break;
                case 'Escape':
                    e.preventDefault();
                    closeMenu();
                    break;
                case 'Tab':
                    // Allow normal tab behavior but close menu if tabbing out
                    if (!navLinks.contains(e.target)) {
                        closeMenu();
                    }
                    break;
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
                closeMenu();
            }
        });
    }
}

function initScrollButtons() {
    const donateBtn = document.getElementById('donate-now-btn-header');
    if (donateBtn) {
        donateBtn.addEventListener('click', () => scrollToSection('#contact'));
    }

    const discoverBtn = document.getElementById('discover-mission-btn');
    if (discoverBtn) {
        discoverBtn.addEventListener('click', () => scrollToSection('#what-we-do'));
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
                const animatedChildren = entry.target.querySelectorAll('[data-animation-delay]');
                animatedChildren.forEach(child => {
                    const delay = child.dataset.animationDelay;
                    if (delay) {
                        child.style.transitionDelay = delay;
                    }
                    child.classList.add('visible');
                });
                observer.unobserve(entry.target);
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
        const cacheKey = `weather_${lat}_${lon}`;
        const cacheDuration = 10 * 60 * 1000; // 10 minutes in milliseconds

        // Check localStorage for cached data
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < cacheDuration) {
                return data;
            }
        }

        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,visibility,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            // Cache the data
            localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp: Date.now() }));

            return data;
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
                <div class="skeleton-box image"></div>
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

    // Maps weather conditions to image URLs for visual representation
    function getWeatherImage(condition) {
        const images = {
            'Clear sky': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Mainly clear': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Partly cloudy': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Overcast': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Fog': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Depositing rime fog': 'https://images.unsplash.com/photo-1487621167305-5d248087c724?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Light drizzle': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Moderate drizzle': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Dense drizzle': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Light freezing drizzle': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Dense freezing drizzle': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Slight rain': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Moderate rain': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Heavy rain': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Light freezing rain': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Heavy freezing rain': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Slight snow fall': 'https://images.unsplash.com/photo-1516431883631-67f23b308ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Moderate snow fall': 'https://images.unsplash.com/photo-1516431883631-67f23b308ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Heavy snow fall': 'https://images.unsplash.com/photo-1516431883631-67f23b308ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Snow grains': 'https://images.unsplash.com/photo-1516431883631-67f23b308ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Slight rain showers': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Moderate rain showers': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Violent rain showers': 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Slight snow showers': 'https://images.unsplash.com/photo-1516431883631-67f23b308ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Heavy snow showers': 'https://images.unsplash.com/photo-1516431883631-67f23b308ad6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Thunderstorm': 'https://images.unsplash.com/photo-1500674425229-f692875b0ab7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Thunderstorm with hail': 'https://images.unsplash.com/photo-1500674425229-f692875b0ab7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Thunderstorm with heavy hail': 'https://images.unsplash.com/photo-1500674425229-f692875b0ab7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            'Cloudy': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        };
        return images[condition] || images['Cloudy'];
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
                    <div class="weather-image">
                        <img src="${getWeatherImage(condition)}" alt="${condition}" loading="lazy" onerror="this.style.display='none';">
                    </div>
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

function initVolunteerForm() {
    const volunteerForm = document.getElementById('volunteerForm');
    if (!volunteerForm) return;

    const formMessage = volunteerForm.querySelector('.form-message');
    const nameInput = volunteerForm.querySelector('input[name="name"]');
    const emailInput = volunteerForm.querySelector('input[name="email"]');
    const skillsSelect = volunteerForm.querySelector('select[name="skills"]');
    const availabilityInput = volunteerForm.querySelector('input[name="availability"]');
    const messageInput = volunteerForm.querySelector('textarea[name="message"]');
    const submitButton = volunteerForm.querySelector('button[type="submit"]');

    volunteerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Reset previous states
        formMessage.classList.remove('show', 'success', 'error');
        formMessage.textContent = '';
        [nameInput, emailInput, skillsSelect, availabilityInput, messageInput].forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const skills = skillsSelect.value;
        const availability = availabilityInput.value.trim();
        const message = messageInput.value.trim();
        let errors = [];

        // Validation
        if (!name) {
            errors.push('Name is required.');
            nameInput.classList.add('is-invalid');
        } else {
            nameInput.classList.add('is-valid');
        }

        if (!email) {
            errors.push('Email is required.');
            emailInput.classList.add('is-invalid');
        } else if (!isValidEmail(email)) {
            errors.push('Please enter a valid email address.');
            emailInput.classList.add('is-invalid');
        } else {
            emailInput.classList.add('is-valid');
        }

        if (!skills) {
            errors.push('Please select your skills.');
            skillsSelect.classList.add('is-invalid');
        } else {
            skillsSelect.classList.add('is-valid');
        }

        if (message) {
            messageInput.classList.add('is-valid');
        }

        if (errors.length > 0) {
            formMessage.textContent = errors.join(' ');
            formMessage.classList.add('error', 'show');
            return;
        }

        // Simulate form submission
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;

        setTimeout(() => {
            formMessage.textContent = 'Thank you for signing up to volunteer! We will contact you soon with opportunities.';
            formMessage.classList.add('success', 'show');
            
            volunteerForm.reset();
            [nameInput, emailInput, skillsSelect, availabilityInput, messageInput].forEach(input => {
                input.classList.remove('is-valid');
            });
            
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;

            // Hide the success message after 5 seconds
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 5000);
        }, 2000);
    });
}

// Contact Form with Advanced Feedback
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const formMessage = contactForm.querySelector('.form-message');
    const nameInput = contactForm.querySelector('input[name="name"]');
    const emailInput = contactForm.querySelector('input[name="email"]');
    const messageInput = contactForm.querySelector('textarea[name="message"]');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Reset previous states
        formMessage.classList.remove('show', 'success', 'error');
        formMessage.textContent = '';
        [nameInput, emailInput, messageInput].forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();
        let errors = [];

        // Validation
        if (!name) {
            errors.push('Name is required.');
            nameInput.classList.add('is-invalid');
        } else {
            nameInput.classList.add('is-valid');
        }

        if (!email) {
            errors.push('Email is required.');
            emailInput.classList.add('is-invalid');
        } else if (!isValidEmail(email)) {
            errors.push('Please enter a valid email address.');
            emailInput.classList.add('is-invalid');
        } else {
            emailInput.classList.add('is-valid');
        }

        if (!message) {
            errors.push('Message is required.');
            messageInput.classList.add('is-invalid');
        } else {
            messageInput.classList.add('is-valid');
        }

        if (errors.length > 0) {
            formMessage.textContent = errors.join(' ');
            formMessage.classList.add('error', 'show');
            return;
        }

        // Simulate form submission
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        setTimeout(() => {
            formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            formMessage.classList.add('success', 'show');
            
            contactForm.reset();
            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('is-valid');
            });
            
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;

            // Hide the success message after 5 seconds
            setTimeout(() => {
                formMessage.classList.remove('show');
            }, 5000);
        }, 2000);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Resource Search Functionality
function initResourceSearch() {
    const searchInput = document.getElementById('resourceSearch');
    const clearButton = document.getElementById('clearSearch');
    const resourceCards = document.querySelectorAll('.resource-card');

    if (!searchInput || !clearButton || !resourceCards.length) return;

    // Function to filter resources
    function filterResources(searchTerm) {
        const term = searchTerm.toLowerCase().trim();

        resourceCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const category = card.querySelector('.resource-category').textContent.toLowerCase();

            const matches = title.includes(term) ||
                           description.includes(term) ||
                           category.includes(term);

            card.style.display = matches || term === '' ? 'block' : 'none';
        });
    }

    // Search input event listener
    searchInput.addEventListener('input', function() {
        filterResources(this.value);
    });

    // Clear search button event listener
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        filterResources('');
        searchInput.focus();
    });

    // Optional: Add keyboard shortcut for clearing search (Escape key)
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchInput.value = '';
            filterResources('');
        }
    });
}

// Blog Filter Functionality
function initBlogFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    if (!filterButtons.length || !blogCards.length) return;

    // Function to filter blogs
    function filterBlogs(category) {
        blogCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Filter blogs
            const category = this.getAttribute('data-category');
            filterBlogs(category);
        });
    });

    // Show all blogs by default
    filterBlogs('all');
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof L === 'undefined') {
        console.warn('Map element not found or Leaflet not loaded');
        return;
    }

    // Initialize map centered on Eswatini
    const map = L.map('map').setView([-26.5, 31.2], 8);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Project locations with coordinates, colors, and descriptions
    const projects = [
        {
            name: 'Hhohho Region - Reforestation Project',
            lat: -26.3167,
            lon: 31.1333,
            color: '#e74c3c', // Red for Reforestation
            description: 'Community-led reforestation in the Highveld, planting native trees to restore degraded land and combat soil erosion.'
        },
        {
            name: 'Lubombo Region - Sustainable Agriculture',
            lat: -26.45,
            lon: 31.95,
            color: '#3498db', // Blue for Sustainable Agriculture
            description: 'Climate-smart farming initiatives in the Lowveld, introducing drought-resistant crops and water conservation techniques.'
        },
        {
            name: 'Manzini Region - Clean Energy Initiative',
            lat: -26.4833,
            lon: 31.3667,
            color: '#2ecc71', // Green for Clean Energy
            description: 'Solar mini-grid installations in rural communities, providing renewable energy access and reducing reliance on fossil fuels.'
        },
        {
            name: 'Shiselweni Region - Community Education',
            lat: -27.1167,
            lon: 31.2,
            color: '#f39c12', // Orange for Community Education
            description: 'Youth-led climate education programs, training local leaders on adaptation strategies and environmental stewardship.'
        }
    ];

    // Add colored circle markers
    projects.forEach(project => {
        L.circleMarker([project.lat, project.lon], {
            radius: 8,
            fillColor: project.color,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map)
        .bindPopup(`
            <div class="map-popup">
                <h4>${project.name}</h4>
                <p>${project.description}</p>
            </div>
        `);
    });

    // Fit bounds to show all markers
    if (projects.length > 0) {
        const group = new L.featureGroup(projects.map(p => L.circleMarker([p.lat, p.lon])));
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Add CSS classes for weather conditions, now moved to style.css for better maintainability.
// The animation for .weather-card is also defined in style.css.

// Quiz Modal Functionality
function initQuizModal() {
    const quizBtn = document.getElementById('take-action-btn');
    const quizModal = document.getElementById('quizModal');
    const closeBtn = quizModal.querySelector('.close');
    const quizForm = document.getElementById('quizForm');
    const quizResults = document.getElementById('quizResults');
    const restartBtn = document.getElementById('restartQuiz');

    console.log('Quiz button found:', quizBtn);
    console.log('Quiz modal found:', quizModal);
    if (quizBtn) {
        const rect = quizBtn.getBoundingClientRect();
        console.log('Button position:', rect);
        console.log('Button center:', Math.floor(rect.left + rect.width / 2), Math.floor(rect.top + rect.height / 2));
    }

    if (!quizBtn || !quizModal) return;

    // Quiz questions data
    const quizQuestions = [
        {
            question: "What is the primary goal of The Climate Watch?",
            options: [
                "To promote tourism in Eswatini",
                "To build a sustainable and resilient future through climate action",
                "To develop new technologies",
                "To increase agricultural exports"
            ],
            correct: 1
        },
        {
            question: "Which region of Eswatini is most affected by climate change according to current data?",
            options: [
                "Hhohho Region",
                "Lubombo Region",
                "Manzini Region",
                "All regions are equally affected"
            ],
            correct: 3
        },
        {
            question: "What type of solutions does The Climate Watch focus on?",
            options: [
                "Only technological solutions",
                "Only policy changes",
                "Community-driven climate action, advocacy, and education",
                "Only renewable energy projects"
            ],
            correct: 2
        },
        {
            question: "What is one of the key challenges Eswatini faces due to climate change?",
            options: [
                "Increasing temperatures and erratic rainfall",
                "Too much rainfall",
                "Stable weather patterns",
                "Decreasing temperatures"
            ],
            correct: 0
        },
        {
            question: "How can individuals get involved with The Climate Watch?",
            options: [
                "Only by donating money",
                "By joining campaigns, volunteering, partnering, or supporting youth leadership",
                "Only through social media",
                "Only by attending events"
            ],
            correct: 1
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    // Open modal
    quizBtn.addEventListener('click', function(e) {
        console.log('Take Action button clicked');
        e.preventDefault();
        quizModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        showQuestion();
    });

    // Close modal
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        if (e.target === quizModal) {
            closeModal();
        }
    });

    // Close modal function
    function closeModal() {
        quizModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        resetQuiz();
    }

    // Show current question
    function showQuestion() {
        const question = quizQuestions[currentQuestion];
        quizForm.innerHTML = `
            <div class="quiz-question">
                <h3>Question ${currentQuestion + 1} of ${quizQuestions.length}</h3>
                <p>${question.question}</p>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <label class="quiz-option">
                            <input type="radio" name="answer" value="${index}">
                            <span>${option}</span>
                        </label>
                    `).join('')}
                </div>
                <button type="submit" class="btn btn-primary" id="submitAnswer">Submit Answer</button>
            </div>
        `;

        // Handle answer submission
        quizForm.addEventListener('submit', handleAnswer);
    }

    // Handle answer submission
    function handleAnswer(e) {
        e.preventDefault();
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) return;

        const answer = parseInt(selectedAnswer.value);
        if (answer === quizQuestions[currentQuestion].correct) {
            score++;
        }

        currentQuestion++;
        if (currentQuestion < quizQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    }

    // Show quiz results
    function showResults() {
        const percentage = Math.round((score / quizQuestions.length) * 100);
        let message = '';
        let icon = '';

        if (percentage >= 80) {
            message = "Excellent! You're a climate champion!";
            icon = 'trophy';
        } else if (percentage >= 60) {
            message = "Good job! You have a solid understanding of climate issues.";
            icon = 'thumbs-up';
        } else {
            message = "Keep learning! Climate action starts with awareness.";
            icon = 'book-open';
        }

        quizResults.innerHTML = `
            <div class="quiz-results-content">
                <i data-lucide="${icon}" class="results-icon"></i>
                <h3>Quiz Complete!</h3>
                <p class="score">Your Score: ${score}/${quizQuestions.length} (${percentage}%)</p>
                <p class="message">${message}</p>
                <div class="results-actions">
                    <button class="btn btn-primary" id="shareResults">Share Results</button>
                    <button class="btn btn-secondary" id="learnMore">Learn More</button>
                </div>
            </div>
        `;

        quizForm.style.display = 'none';
        quizResults.style.display = 'block';

        lucide.createIcons();

        // Share results
        document.getElementById('shareResults').addEventListener('click', function() {
            const shareText = `I scored ${score}/${quizQuestions.length} on The Climate Watch climate quiz! Take the quiz to test your knowledge: ${window.location.href}`;
            if (navigator.share) {
                navigator.share({
                    title: 'Climate Quiz Results',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(shareText).then(() => {
                    alert('Results copied to clipboard!');
                });
            }
        });

        // Learn more
        document.getElementById('learnMore').addEventListener('click', function() {
            closeModal();
            scrollToSection('#resources');
        });
    }

    // Reset quiz
    function resetQuiz() {
        currentQuestion = 0;
        score = 0;
        quizForm.style.display = 'block';
        quizResults.style.display = 'none';
        quizForm.innerHTML = '';
    }

    // Restart quiz
    restartBtn.addEventListener('click', function() {
        resetQuiz();
        showQuestion();
    });
}

// File Upload Functionality
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const uploadBtn = document.getElementById('uploadBtn');

    if (!uploadArea || !fileInput) return;

    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        uploadArea.classList.add('dragover');
    }

    function unhighlight(e) {
        uploadArea.classList.remove('dragover');
    }

    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Click to upload
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        [...files].forEach(uploadFile);
    }

    function uploadFile(file) {
        // Validate file type and size
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            showUploadMessage('Please upload only image files (JPEG, PNG, GIF) or PDF documents.', 'error');
            return;
        }

        if (file.size > maxSize) {
            showUploadMessage('File size must be less than 5MB.', 'error');
            return;
        }

        // Create file preview
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.width = 200;
                    canvas.height = 200;

                    // Calculate cropping to center the image
                    const size = Math.min(img.width, img.height);
                    const x = (img.width - size) / 2;
                    const y = (img.height - size) / 2;

                    ctx.drawImage(img, x, y, size, size, 0, 0, 200, 200);
                    const croppedSrc = canvas.toDataURL('image/jpeg', 0.9);

                    fileItem.innerHTML = `
                        <img src="${croppedSrc}" alt="${file.name}" class="file-preview">
                        <div class="file-info">
                            <p class="file-name">${file.name}</p>
                            <p class="file-size">${formatFileSize(file.size)}</p>
                        </div>
                        <button class="remove-file" aria-label="Remove ${file.name}">×</button>
                    `;
                    fileList.appendChild(fileItem);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            fileItem.innerHTML = `
                <div class="file-icon">
                    <i data-lucide="file-text"></i>
                </div>
                <div class="file-info">
                    <p class="file-name">${file.name}</p>
                    <p class="file-size">${formatFileSize(file.size)}</p>
                </div>
                <button class="remove-file" aria-label="Remove ${file.name}">×</button>
            `;
            fileList.appendChild(fileItem);
            lucide.createIcons();
        }

        // Remove file functionality
        fileItem.querySelector('.remove-file').addEventListener('click', function() {
            fileItem.remove();
        });

        showUploadMessage('File uploaded successfully!', 'success');
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showUploadMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `upload-message ${type}`;
        messageEl.textContent = message;
        uploadArea.appendChild(messageEl);

        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    // Upload button functionality (simulate upload)
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            const files = fileList.querySelectorAll('.file-item');
            if (files.length === 0) {
                showUploadMessage('Please select files to upload.', 'error');
                return;
            }

            // Simulate upload process
            uploadBtn.textContent = 'Uploading...';
            uploadBtn.disabled = true;

            setTimeout(() => {
                showUploadMessage('All files uploaded successfully!', 'success');
                fileList.innerHTML = '';
                uploadBtn.textContent = 'Upload Files';
                uploadBtn.disabled = false;
            }, 2000);
        });
    }
}

// Lightbox Gallery Functionality
function initLightboxGallery() {
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = lightboxModal.querySelector('.close');
    const prevBtn = lightboxModal.querySelector('.prev');
    const nextBtn = lightboxModal.querySelector('.next');

    if (!lightboxModal || !lightboxImg || !lightboxCaption) return;

    let currentIndex = 0;
    let images = [];

    // Collect all resource card images
    function collectImages() {
        images = [];
        const resourceCards = document.querySelectorAll('.resource-card');
        resourceCards.forEach(card => {
            const img = card.querySelector('img');
            if (img) {
                const title = card.querySelector('h3').textContent;
                const description = card.querySelector('p').textContent;
                images.push({
                    src: img.src,
                    alt: img.alt,
                    title: title,
                    description: description
                });
            }
        });
    }

    // Open lightbox
    function openLightbox(index) {
        currentIndex = index;
        showImage(currentIndex);
        lightboxModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        lightboxModal.setAttribute('aria-hidden', 'false');
    }

    // Close lightbox
    function closeLightbox() {
        lightboxModal.classList.remove('show');
        document.body.style.overflow = 'auto';
        lightboxModal.setAttribute('aria-hidden', 'true');
    }

    // Show image at index
    function showImage(index) {
        const image = images[index];
        lightboxImg.src = image.src;
        lightboxImg.alt = image.alt;
        lightboxCaption.innerHTML = `<h3>${image.title}</h3><p>${image.description}</p>`;

        // Update navigation buttons
        prevBtn.style.display = images.length > 1 ? 'block' : 'none';
        nextBtn.style.display = images.length > 1 ? 'block' : 'none';

        // Update button states
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === images.length - 1;
    }

    // Navigate to previous image
    function prevImage() {
        if (currentIndex > 0) {
            currentIndex--;
            showImage(currentIndex);
        }
    }

    // Navigate to next image
    function nextImage() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            showImage(currentIndex);
        }
    }

    // Event listeners
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('resource-card') || e.target.closest('.resource-card')) {
            const card = e.target.closest('.resource-card');
            if (card) {
                collectImages();
                const img = card.querySelector('img');
                if (img) {
                    const index = images.findIndex(image => image.src === img.src);
                    if (index !== -1) {
                        openLightbox(index);
                    }
                }
            }
        }
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);

    // Close on click outside
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightboxModal.classList.contains('show')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
}

// Add CSS classes for weather conditions, now moved to style.css for better maintainability.
// The animation for .weather-card is also defined in style.css.
})();
