// Weather Dashboard for The Climate Watch
// Integrates with OpenWeatherMap API for real-time weather data

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with actual API key
    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

    // Eswatini regions with coordinates
    const regions = {
        mbabane: { lat: -26.3167, lon: 31.1333, name: 'Mbabane' },
        manzini: { lat: -26.4833, lon: 31.3833, name: 'Manzini' },
        nhlangano: { lat: -27.1167, lon: 31.2167, name: 'Nhlangano' },
        siteki: { lat: -26.4500, lon: 31.9500, name: 'Siteki' }
    };

    // Weather icons mapping
    const weatherIcons = {
        '01d': 'sun',           // clear sky day
        '01n': 'moon',          // clear sky night
        '02d': 'cloud-sun',     // few clouds day
        '02n': 'cloud-moon',    // few clouds night
        '03d': 'cloud',         // scattered clouds
        '03n': 'cloud',
        '04d': 'cloud',         // broken clouds
        '04n': 'cloud',
        '09d': 'cloud-drizzle', // shower rain
        '09n': 'cloud-drizzle',
        '10d': 'cloud-rain',    // rain
        '10n': 'cloud-rain',
        '11d': 'cloud-lightning', // thunderstorm
        '11n': 'cloud-lightning',
        '13d': 'cloud-snow',    // snow
        '13n': 'cloud-snow',
        '50d': 'cloud-fog',     // mist
        '50n': 'cloud-fog'
    };

    // Initialize weather dashboard
    function initWeatherDashboard() {
        const weatherGrid = document.getElementById('weatherGrid');
        if (!weatherGrid) return;

        // Add loading state
        showWeatherLoading();

        // Fetch weather data for all regions
        const weatherPromises = Object.keys(regions).map(region =>
            fetchWeatherData(regions[region])
        );

        Promise.all(weatherPromises)
            .then(weatherData => {
                updateWeatherCards(weatherData);
                hideWeatherLoading();
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
                showWeatherError();
                hideWeatherLoading();
            });

        // Set up weather filters
        initWeatherFilters();

        // Auto-refresh every 30 minutes
        setInterval(() => {
            refreshWeatherData();
        }, 30 * 60 * 1000);
    }

    // Fetch weather data for a specific location
    async function fetchWeatherData(location) {
        try {
            const url = `${BASE_URL}?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();
            return {
                ...data,
                regionName: location.name,
                regionKey: Object.keys(regions).find(key => regions[key].name === location.name)
            };
        } catch (error) {
            console.error(`Error fetching weather for ${location.name}:`, error);
            // Return mock data as fallback
            return getMockWeatherData(location);
        }
    }

    // Mock weather data for fallback
    function getMockWeatherData(location) {
        const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];

        return {
            regionName: location.name,
            regionKey: Object.keys(regions).find(key => regions[key].name === location.name),
            main: {
                temp: Math.round(20 + Math.random() * 15), // 20-35°C
                humidity: Math.round(40 + Math.random() * 40), // 40-80%
                pressure: Math.round(1010 + Math.random() * 20) // 1010-1030 hPa
            },
            wind: {
                speed: Math.round(5 + Math.random() * 15) // 5-20 km/h
            },
            weather: [{
                main: randomCondition,
                description: randomCondition.toLowerCase(),
                icon: getRandomIcon(randomCondition)
            }],
            rain: randomCondition.includes('Rain') ? { '1h': Math.round(Math.random() * 5 * 10) / 10 } : null,
            mock: true
        };
    }

    // Get random weather icon based on condition
    function getRandomIcon(condition) {
        const iconMap = {
            'Sunny': '01d',
            'Clear': '01d',
            'Partly Cloudy': '02d',
            'Cloudy': '03d',
            'Light Rain': '10d'
        };
        return iconMap[condition] || '01d';
    }

    // Update weather cards with data
    function updateWeatherCards(weatherData) {
        weatherData.forEach(data => {
            const card = document.querySelector(`[data-region="${data.regionKey}"]`);
            if (!card) return;

            // Update temperature
            const tempElement = card.querySelector('.temperature');
            if (tempElement) {
                tempElement.innerHTML = `
                    <span class="temp-value">${Math.round(data.main.temp)}</span>
                    <span class="temp-unit">°C</span>
                `;
            }

            // Update weather condition
            const conditionElement = card.querySelector('.weather-condition');
            if (conditionElement) {
                conditionElement.textContent = data.weather[0].main;
            }

            // Update weather icon
            const iconElement = card.querySelector('.weather-icon-display i');
            if (iconElement) {
                const iconName = weatherIcons[data.weather[0].icon] || 'cloud-sun';
                iconElement.setAttribute('data-lucide', iconName);
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }

            // Update humidity
            const humidityElement = card.querySelector('.weather-detail:nth-child(1) .detail-value');
            if (humidityElement) {
                humidityElement.textContent = `${data.main.humidity}%`;
            }

            // Update wind speed
            const windElement = card.querySelector('.weather-detail:nth-child(2) .detail-value');
            if (windElement) {
                windElement.textContent = `${Math.round(data.wind.speed)} km/h`;
            }

            // Update rainfall
            const rainElement = card.querySelector('.weather-detail:nth-child(3) .detail-value');
            if (rainElement) {
                const rainfall = data.rain ? data.rain['1h'] || 0 : 0;
                rainElement.textContent = `${rainfall} mm`;
            }

            // Add data freshness indicator
            updateDataFreshness(card, data.mock);

            // Add click handler for detailed view
            card.addEventListener('click', () => showWeatherDetails(data));
        });
    }

    // Update data freshness indicator
    function updateDataFreshness(card, isMock) {
        const header = card.querySelector('.weather-card-header');
        if (!header) return;

        // Remove existing freshness indicator
        const existingIndicator = header.querySelector('.data-freshness');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const indicator = document.createElement('div');
        indicator.className = 'data-freshness';
        indicator.innerHTML = `
            <i data-lucide="${isMock ? 'alert-triangle' : 'check-circle'}"></i>
            <span>${isMock ? 'Demo Data' : 'Live Data'}</span>
        `;

        if (isMock) {
            indicator.classList.add('mock-data');
        }

        header.appendChild(indicator);

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Show weather details modal
    function showWeatherDetails(data) {
        const modal = document.createElement('div');
        modal.className = 'weather-modal';
        modal.innerHTML = `
            <div class="weather-modal-content">
                <div class="weather-modal-header">
                    <h3>${data.regionName} Weather Details</h3>
                    <button class="weather-modal-close">&times;</button>
                </div>
                <div class="weather-modal-body">
                    <div class="weather-detail-grid">
                        <div class="detail-item">
                            <i data-lucide="thermometer"></i>
                            <div>
                                <span class="detail-label">Temperature</span>
                                <span class="detail-value">${Math.round(data.main.temp)}°C</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i data-lucide="droplets"></i>
                            <div>
                                <span class="detail-label">Humidity</span>
                                <span class="detail-value">${data.main.humidity}%</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i data-lucide="wind"></i>
                            <div>
                                <span class="detail-label">Wind Speed</span>
                                <span class="detail-value">${Math.round(data.wind.speed)} km/h</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i data-lucide="gauge"></i>
                            <div>
                                <span class="detail-label">Pressure</span>
                                <span class="detail-value">${data.main.pressure} hPa</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i data-lucide="cloud-rain"></i>
                            <div>
                                <span class="detail-label">Rainfall (1h)</span>
                                <span class="detail-value">${data.rain ? data.rain['1h'] || 0 : 0} mm</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i data-lucide="eye"></i>
                            <div>
                                <span class="detail-label">Visibility</span>
                                <span class="detail-value">${data.visibility ? Math.round(data.visibility / 1000) : 'N/A'} km</span>
                            </div>
                        </div>
                    </div>
                    <div class="weather-description">
                        <p><strong>Current Condition:</strong> ${data.weather[0].description}</p>
                        ${data.mock ? '<p class="mock-notice">* This is demo data. Connect to weather API for live data.</p>' : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal handlers
        const closeBtn = modal.querySelector('.weather-modal-close');
        closeBtn.addEventListener('click', () => document.body.removeChild(modal));

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Initialize weather filters
    function initWeatherFilters() {
        const filters = document.querySelectorAll('.weather-filter');
        filters.forEach(filter => {
            filter.addEventListener('click', function() {
                // Remove active class from all filters
                filters.forEach(f => f.classList.remove('active'));
                // Add active class to clicked filter
                this.classList.add('active');

                const filterType = this.dataset.filter;
                filterWeatherCards(filterType);
            });
        });
    }

    // Filter weather cards
    function filterWeatherCards(filterType) {
        const cards = document.querySelectorAll('.kuleszo-weather-card');

        cards.forEach(card => {
            const temp = parseInt(card.querySelector('.temp-value')?.textContent || 0);
            const humidity = parseInt(card.querySelector('.weather-detail:nth-child(1) .detail-value')?.textContent || 0);
            const rainfall = parseFloat(card.querySelector('.weather-detail:nth-child(3) .detail-value')?.textContent || 0);

            let show = true;

            switch (filterType) {
                case 'temperature':
                    show = temp > 25; // Show hot regions
                    break;
                case 'rainfall':
                    show = rainfall > 0; // Show regions with rain
                    break;
                case 'humidity':
                    show = humidity > 60; // Show humid regions
                    break;
                default:
                    show = true; // Show all
            }

            card.style.display = show ? 'block' : 'none';
        });
    }

    // Show loading state
    function showWeatherLoading() {
        const cards = document.querySelectorAll('.kuleszo-weather-card');
        cards.forEach(card => {
            card.classList.add('loading');
            const tempElement = card.querySelector('.temperature');
            if (tempElement) {
                tempElement.innerHTML = '<div class="loading-spinner"></div>';
            }
        });
    }

    // Hide loading state
    function hideWeatherLoading() {
        const cards = document.querySelectorAll('.kuleszo-weather-card');
        cards.forEach(card => {
            card.classList.remove('loading');
        });
    }

    // Show error state
    function showWeatherError() {
        const statusElement = document.querySelector('.weather-status');
        if (statusElement) {
            statusElement.innerHTML = `
                <div class="status-indicator error"></div>
                <span>Unable to load weather data</span>
            `;
        }

        // Show fallback message
        const grid = document.getElementById('weatherGrid');
        if (grid) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'weather-error-message';
            errorMsg.innerHTML = `
                <i data-lucide="alert-triangle"></i>
                <h3>Weather Data Unavailable</h3>
                <p>We're currently showing demo data. For live weather information, please check back later or contact our team.</p>
            `;
            grid.appendChild(errorMsg);

            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    // Refresh weather data
    function refreshWeatherData() {
        console.log('Refreshing weather data...');
        initWeatherDashboard();
    }

    // Add CSS for weather components
    function addWeatherStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .weather-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
            }

            .weather-modal-content {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 16px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                border: 1px solid rgba(22, 163, 74, 0.2);
            }

            .weather-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }

            .weather-modal-header h3 {
                margin: 0;
                color: #1a365d;
            }

            .weather-modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #64748b;
                padding: 0.25rem;
                border-radius: 4px;
                transition: all 0.2s;
            }

            .weather-modal-close:hover {
                background: rgba(100, 116, 139, 0.1);
                color: #334155;
            }

            .weather-detail-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .detail-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                background: rgba(22, 163, 74, 0.05);
                border-radius: 8px;
                border: 1px solid rgba(22, 163, 74, 0.1);
            }

            .detail-item i {
                color: #16a34a;
                width: 20px;
                height: 20px;
            }

            .detail-label {
                display: block;
                font-size: 0.875rem;
                color: #64748b;
                margin-bottom: 0.25rem;
            }

            .detail-value {
                font-weight: 600;
                color: #1a365d;
            }

            .weather-description {
                padding-top: 1rem;
                border-top: 1px solid rgba(22, 163, 74, 0.1);
            }

            .weather-description p {
                margin: 0.5rem 0;
                color: #374151;
            }

            .mock-notice {
                color: #dc2626;
                font-style: italic;
            }

            .data-freshness {
                display: flex;
                align-items: center;
                gap: 0.25rem;
                font-size: 0.75rem;
                margin-top: 0.5rem;
            }

            .data-freshness i {
                width: 12px;
                height: 12px;
            }

            .data-freshness.mock-data {
                color: #dc2626;
            }

            .data-freshness:not(.mock-data) {
                color: #16a34a;
            }

            .weather-error-message {
                grid-column: 1 / -1;
                text-align: center;
                padding: 2rem;
                background: rgba(220, 38, 38, 0.05);
                border: 1px solid rgba(220, 38, 38, 0.1);
                border-radius: 8px;
                color: #dc2626;
            }

            .weather-error-message i {
                font-size: 2rem;
                margin-bottom: 1rem;
                display: block;
            }

            .loading-spinner {
                width: 20px;
                height: 20px;
                border: 2px solid rgba(22, 163, 74, 0.2);
                border-top: 2px solid #16a34a;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .kuleszo-weather-card.loading .temperature .loading-spinner {
                display: inline-block;
            }

            .kuleszo-weather-card.loading .temp-value,
            .kuleszo-weather-card.loading .temp-unit {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize when DOM is ready
    addWeatherStyles();
    initWeatherDashboard();

    // Export for global access
    window.WeatherDashboard = {
        refresh: refreshWeatherData,
        showDetails: showWeatherDetails
    };
});
