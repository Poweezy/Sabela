// Interactive Maps for The Climate Watch
// Uses Leaflet.js for mapping functionality

document.addEventListener('DOMContentLoaded', function() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.warn('Leaflet library not loaded. Loading from CDN...');
        loadLeaflet();
        return;
    }

    initMap();
});

function loadLeaflet() {
    // Load Leaflet CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    cssLink.crossOrigin = '';
    document.head.appendChild(cssLink);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = initMap;
    document.head.appendChild(script);
}

function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.error('Map container not found');
        return;
    }

    // Check if map is already initialized
    if (mapContainer._leaflet_id) {
        console.log('Map already initialized');
        return;
    }

    // Eswatini coordinates (centered)
    const eswatiniCenter = [-26.5, 31.5];

    // Initialize map
    const map = L.map('map', {
        center: eswatiniCenter,
        zoom: 8,
        zoomControl: false, // We'll add custom controls
        scrollWheelZoom: false, // Disable scroll zoom for better UX
        maxBounds: [
            [-28.0, 30.5], // Southwest
            [-25.5, 32.5]  // Northeast
        ],
        maxBoundsViscosity: 1.0
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(map);

    // Add custom zoom controls
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const resetViewBtn = document.getElementById('resetView');

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            map.zoomIn();
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            map.zoomOut();
        });
    }

    if (resetViewBtn) {
        resetViewBtn.addEventListener('click', () => {
            map.setView(eswatiniCenter, 8);
        });
    }

    // Project locations data
    const projectLocations = [
        {
            name: 'Mbabane Community Center',
            lat: -26.3167,
            lng: 31.1333,
            type: 'community',
            description: 'Community education and climate adaptation programs',
            status: 'active',
            icon: 'map-pin'
        },
        {
            name: 'Lubombo Mountains Conservation',
            lat: -26.2833,
            lng: 31.8833,
            type: 'conservation',
            description: 'Biodiversity monitoring and reforestation projects',
            status: 'active',
            icon: 'trees'
        },
        {
            name: 'Manzini Technical College',
            lat: -26.4833,
            lng: 31.3833,
            type: 'education',
            description: 'Climate-smart agriculture training center',
            status: 'active',
            icon: 'graduation-cap'
        },
        {
            name: 'Hhohho Region Farmers Co-op',
            lat: -26.0833,
            lng: 31.1333,
            type: 'agriculture',
            description: 'Sustainable farming practices and crop diversification',
            status: 'active',
            icon: 'wheat'
        },
        {
            name: 'Shiselweni Water Project',
            lat: -27.0833,
            lng: 31.2833,
            type: 'water',
            description: 'Rainwater harvesting and water conservation initiatives',
            status: 'planning',
            icon: 'droplets'
        },
        {
            name: 'Siteki Climate Research Station',
            lat: -26.4500,
            lng: 31.9500,
            type: 'research',
            description: 'Climate data collection and research facility',
            status: 'active',
            icon: 'microscope'
        }
    ];

    // Custom icons for different project types
    const iconColors = {
        community: '#16a34a',
        conservation: '#059669',
        education: '#0d9488',
        agriculture: '#ca8a04',
        water: '#2563eb',
        research: '#7c3aed'
    };

    // Create custom markers
    const markers = [];
    projectLocations.forEach(location => {
        // Create custom icon
        const customIcon = L.divIcon({
            html: `
                <div class="map-marker" style="background-color: ${iconColors[location.type]}">
                    <i data-lucide="${location.icon}"></i>
                </div>
            `,
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });

        // Create marker
        const marker = L.marker([location.lat, location.lng], {
            icon: customIcon
        }).addTo(map);

        // Create popup content
        const popupContent = `
            <div class="map-popup">
                <div class="popup-header">
                    <h4>${location.name}</h4>
                    <span class="status-badge ${location.status}">${location.status}</span>
                </div>
                <p>${location.description}</p>
                <div class="popup-actions">
                    <button class="popup-btn learn-more" data-location="${location.name}">
                        <i data-lucide="info"></i>
                        Learn More
                    </button>
                    <button class="popup-btn get-directions" data-lat="${location.lat}" data-lng="${location.lng}">
                        <i data-lucide="navigation"></i>
                        Directions
                    </button>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);

        // Store marker reference
        markers.push({
            marker: marker,
            location: location
        });
    });

    // Add marker clustering for better UX when zoomed out
    if (typeof L.markerClusterGroup !== 'undefined') {
        const clusterGroup = L.markerClusterGroup({
            chunkedLoading: true,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            removeOutsideVisibleBounds: true,
            animate: true
        });

        markers.forEach(item => {
            clusterGroup.addLayer(item.marker);
        });

        map.addLayer(clusterGroup);
    }

    // Add region boundaries (simplified)
    const regionBoundaries = {
        "Hhohho": [
            [-25.5, 30.8], [-26.0, 30.8], [-26.2, 31.2], [-26.5, 31.5],
            [-26.8, 31.3], [-26.5, 31.0], [-25.8, 30.9], [-25.5, 30.8]
        ],
        "Manzini": [
            [-26.2, 31.0], [-26.5, 31.0], [-26.8, 31.3], [-27.0, 31.5],
            [-27.2, 31.2], [-26.8, 30.8], [-26.5, 30.8], [-26.2, 31.0]
        ],
        "Shiselweni": [
            [-26.8, 30.8], [-27.2, 31.2], [-27.5, 31.5], [-27.8, 31.3],
            [-27.5, 30.8], [-27.2, 30.8], [-26.8, 30.8]
        ],
        "Lubombo": [
            [-25.5, 31.5], [-26.2, 31.2], [-26.5, 31.5], [-26.8, 31.8],
            [-26.5, 32.0], [-25.8, 32.2], [-25.5, 31.8], [-25.5, 31.5]
        ]
    };

    // Add region polygons
    Object.keys(regionBoundaries).forEach(region => {
        L.polygon(regionBoundaries[region], {
            color: '#16a34a',
            weight: 2,
            opacity: 0.6,
            fillColor: '#16a34a',
            fillOpacity: 0.1
        }).addTo(map).bindPopup(`<strong>${region} Region</strong><br>Climate monitoring active`);
    });

    // Add legend
    addMapLegend();

    // Handle popup button clicks
    map.on('popupopen', function(e) {
        const popup = e.popup;
        const container = popup.getElement();

        // Learn more button
        const learnMoreBtn = container.querySelector('.learn-more');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', function() {
                const locationName = this.dataset.location;
                showLocationDetails(locationName);
                map.closePopup();
            });
        }

        // Get directions button
        const directionsBtn = container.querySelector('.get-directions');
        if (directionsBtn) {
            directionsBtn.addEventListener('click', function() {
                const lat = parseFloat(this.dataset.lat);
                const lng = parseFloat(this.dataset.lng);
                openDirections(lat, lng);
            });
        }

        // Initialize Lucide icons in popup
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    });

    // Add search functionality
    addMapSearch(map, projectLocations);

    // Add layer controls
    addLayerControls(map);

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    console.log('Interactive map initialized');
}

function addMapLegend() {
    const legend = document.querySelector('.kuleszo-map-legend');
    if (!legend) return;

    const legendContent = `
        <div class="legend-header">
            <h4>Project Types</h4>
        </div>
        <div class="legend-items">
            <div class="legend-item">
                <div class="legend-marker" style="background-color: #16a34a"></div>
                <span>Community Centers</span>
            </div>
            <div class="legend-item">
                <div class="legend-marker" style="background-color: #059669"></div>
                <span>Conservation Areas</span>
            </div>
            <div class="legend-item">
                <div class="legend-marker" style="background-color: #0d9488"></div>
                <span>Education Facilities</span>
            </div>
            <div class="legend-item">
                <div class="legend-marker" style="background-color: #ca8a04"></div>
                <span>Agriculture Projects</span>
            </div>
            <div class="legend-item">
                <div class="legend-marker" style="background-color: #2563eb"></div>
                <span>Water Initiatives</span>
            </div>
            <div class="legend-item">
                <div class="legend-marker" style="background-color: #7c3aed"></div>
                <span>Research Stations</span>
            </div>
        </div>
    `;

    legend.innerHTML = legendContent;
}

function addMapSearch(map, locations) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'map-search-container';
    searchContainer.innerHTML = `
        <div class="map-search">
            <input type="text" id="mapSearch" placeholder="Search locations..." autocomplete="off">
            <button id="searchBtn">
                <i data-lucide="search"></i>
            </button>
        </div>
        <div id="searchResults" class="search-results"></div>
    `;

    document.querySelector('.map-wrapper').appendChild(searchContainer);

    const searchInput = document.getElementById('mapSearch');
    const searchResults = document.getElementById('searchResults');
    const searchBtn = document.getElementById('searchBtn');

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const matches = locations.filter(location =>
            location.name.toLowerCase().includes(query) ||
            location.description.toLowerCase().includes(query) ||
            location.type.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            searchResults.innerHTML = matches.map(location => `
                <div class="search-result-item" data-lat="${location.lat}" data-lng="${location.lng}">
                    <div class="result-name">${location.name}</div>
                    <div class="result-type">${location.type}</div>
                </div>
            `).join('');
            searchResults.style.display = 'block';

            // Add click handlers
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', function() {
                    const lat = parseFloat(this.dataset.lat);
                    const lng = parseFloat(this.dataset.lng);
                    map.setView([lat, lng], 12);
                    searchResults.style.display = 'none';
                    searchInput.value = '';
                });
            });
        } else {
            searchResults.innerHTML = '<div class="no-results">No locations found</div>';
            searchResults.style.display = 'block';
        }
    }

    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);

    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function addLayerControls(map) {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'map-layer-controls';
    controlsContainer.innerHTML = `
        <div class="layer-control-group">
            <button class="layer-toggle active" data-layer="projects">
                <i data-lucide="map-pin"></i>
                Projects
            </button>
            <button class="layer-toggle active" data-layer="regions">
                <i data-lucide="square"></i>
                Regions
            </button>
        </div>
    `;

    document.querySelector('.map-wrapper').appendChild(controlsContainer);

    // Layer toggle functionality would be implemented here
    // For now, just initialize icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function showLocationDetails(locationName) {
    // This would show a detailed modal with location information
    // For now, just scroll to the projects section
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Show notification
    if (typeof ClimateWatch !== 'undefined' && ClimateWatch.showNotification) {
        ClimateWatch.showNotification(`Showing details for ${locationName}`, 'info');
    }
}

function openDirections(lat, lng) {
    // Open Google Maps directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

// Add CSS for map components
function addMapStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .custom-marker {
            border: none !important;
            background: none !important;
        }

        .map-marker {
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            border: 2px solid white;
        }

        .map-marker i {
            transform: rotate(45deg);
            width: 14px;
            height: 14px;
        }

        .map-popup {
            min-width: 200px;
        }

        .popup-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 0.5rem;
        }

        .popup-header h4 {
            margin: 0;
            font-size: 1rem;
            color: #1a365d;
        }

        .status-badge {
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
        }

        .status-badge.active {
            background: #dcfce7;
            color: #166534;
        }

        .status-badge.planning {
            background: #fef3c7;
            color: #92400e;
        }

        .popup-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 0.75rem;
        }

        .popup-btn {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.375rem 0.75rem;
            border: 1px solid #d1d5db;
            background: white;
            border-radius: 6px;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s;
        }

        .popup-btn:hover {
            background: #f9fafb;
            border-color: #9ca3af;
        }

        .popup-btn i {
            width: 14px;
            height: 14px;
        }

        .map-search-container {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
            width: 250px;
        }

        .map-search {
            display: flex;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        #mapSearch {
            flex: 1;
            padding: 0.5rem 0.75rem;
            border: none;
            outline: none;
            font-size: 0.875rem;
        }

        #searchBtn {
            padding: 0.5rem 0.75rem;
            border: none;
            background: #16a34a;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #searchBtn:hover {
            background: #15803d;
        }

        .search-results {
            display: none;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            margin-top: 0.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            max-height: 200px;
            overflow-y: auto;
        }

        .search-result-item {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            border-bottom: 1px solid #e5e7eb;
            transition: background 0.2s;
        }

        .search-result-item:hover {
            background: #f9fafb;
        }

        .search-result-item:last-child {
            border-bottom: none;
        }

        .result-name {
            font-weight: 500;
            color: #1a365d;
            font-size: 0.875rem;
        }

        .result-type {
            font-size: 0.75rem;
            color: #6b7280;
            text-transform: capitalize;
        }

        .no-results {
            padding: 0.75rem;
            text-align: center;
            color: #6b7280;
            font-size: 0.875rem;
        }

        .map-layer-controls {
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 1000;
        }

        .layer-control-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .layer-toggle {
            padding: 0.5rem 0.75rem;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid #d1d5db;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            display: flex;
            align-items: center;
            gap: 0.375rem;
            transition: all 0.2s;
        }

        .layer-toggle:hover {
            background: rgba(255, 255, 255, 1);
        }

        .layer-toggle.active {
            background: #16a34a;
            color: white;
            border-color: #16a34a;
        }

        .legend-items {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
        }

        .legend-marker {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            flex-shrink: 0;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
            .map-search-container {
                width: calc(100% - 20px);
                left: 10px;
                right: 10px;
            }

            .map-layer-controls {
                top: auto;
                bottom: 10px;
                right: 10px;
            }

            .layer-control-group {
                flex-direction: row;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize styles
addMapStyles();

// Export for global access
window.MapController = {
    initMap: initMap,
    showLocationDetails: showLocationDetails,
    openDirections: openDirections
};
