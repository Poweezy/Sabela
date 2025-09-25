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
    initContactForm();
    initHeaderScroll();
    initScrollButtons();
    initResourceSearch();
    initQuizModal();
    initFileUpload();
});

// Mobile Menu Functionality with Enhanced Keyboard Navigation
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const navLinkElements = navLinks ? navLinks.querySelectorAll('.nav-link') : [];

    if (mobileMenuBtn && navLinks) {
        // Toggle menu function
        function toggleMenu() {
            const isOpened = navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', isOpened);

            // Change icon and aria-label
            const icon = mobileMenuBtn.querySelector('i');
            if (isOpened) {
                icon.setAttribute('data-lucide', 'x');
                mobileMenuBtn.setAttribute('aria-label', 'Close menu');
                // Focus first menu item when opened
                if (navLinkElements.length > 0) {
                    navLinkElements[0].focus();
                }
            } else {
                icon.setAttribute('data-lucide', 'menu');
                mobileMenuBtn.setAttribute('aria-label', 'Open menu');
                // Return focus to menu button when closed
                mobileMenuBtn.focus();
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
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                mobileMenuBtn.setAttribute('aria-label', 'Open menu');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                lucide.createIcons();
                // Return focus to menu button
                mobileMenuBtn.focus();
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
                    navLinks.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.setAttribute('data-lucide', 'menu');
                    mobileMenuBtn.setAttribute('aria-label', 'Open menu');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                    lucide.createIcons();
                    mobileMenuBtn.focus();
                    break;
                case 'Tab':
                    // Allow normal tab behavior but close menu if tabbing out
                    if (!navLinks.contains(e.target)) {
                        navLinks.classList.remove('active');
                        const icon = mobileMenuBtn.querySelector('i');
                        icon.setAttribute('data-lucide', 'menu');
                        mobileMenuBtn.setAttribute('aria-label', 'Open menu');
                        mobileMenuBtn.setAttribute('aria-expanded', 'false');
                        lucide.createIcons();
                    }
                    break;
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.setAttribute('data-lucide', 'menu');
                mobileMenuBtn.setAttribute('aria-label', 'Open menu');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                lucide.createIcons();
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

    const takeActionBtn = document.getElementById('take-action-btn');
    if (takeActionBtn) {
        takeActionBtn.addEventListener('click', () => scrollToSection('#get-involved'));
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
        e.preventDefault();
        quizModal.style.display = 'block';
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
        quizModal.style.display = 'none';
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
                fileItem.innerHTML = `
                    <img src="${e.target.result}" alt="${file.name}" class="file-preview">
                    <div class="file-info">
                        <p class="file-name">${file.name}</p>
                        <p class="file-size">${formatFileSize(file.size)}</p>
                    </div>
                    <button class="remove-file" aria-label="Remove ${file.name}">×</button>
                `;
                fileList.appendChild(fileItem);
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

// Add CSS classes for weather conditions, now moved to style.css for better maintainability.
// The animation for .weather-card is also defined in style.css.
})();
