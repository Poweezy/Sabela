// Carbon Footprint Calculator for The Climate Watch
// Interactive calculator to estimate personal carbon emissions

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const EMISSION_FACTORS = {
        // Transportation (kg CO2 per km or per unit)
        car: 0.25, // per km
        bus: 0.1, // per km
        train: 0.04, // per km
        flight_short: 0.25, // per km (short haul)
        flight_long: 0.15, // per km (long haul)
        motorcycle: 0.15, // per km

        // Energy (kg CO2 per kWh)
        electricity: 0.5, // average grid
        gas: 0.2, // per kWh equivalent
        heating: 0.3, // per unit

        // Diet (kg CO2 per serving/day)
        beef: 15, // per day
        chicken: 6,
        fish: 3,
        vegetarian: 2,
        vegan: 1.5,

        // Waste (kg CO2 per week)
        recycling: -0.5, // reduction
        composting: -1, // reduction
    };

    // Initialize calculator
    function initCalculator() {
        const calculatorForm = document.querySelector('.kuleszo-calculator-form');
        const resultsContainer = document.getElementById('carbonResults');
        const calculateBtn = document.querySelector('.calculate-btn');
        const resetBtn = document.querySelector('.reset-btn');

        if (!calculatorForm || !resultsContainer || !calculateBtn) return;

        // Add event listeners
        calculatorForm.addEventListener('input', debounce(calculateFootprint, 300));
        calculateBtn.addEventListener('click', calculateFootprint);
        resetBtn.addEventListener('click', resetCalculator);

        // Initial calculation
        calculateFootprint();

        // Step navigation
        initStepNavigation();

        // Add loading states
        addLoadingStates();
    }

    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Calculate carbon footprint
    function calculateFootprint() {
        const formData = new FormData(document.querySelector('.kuleszo-calculator-form'));

        let totalEmissions = 0;
        let categoryBreakdown = {};

        // Transportation
        const transportMode = formData.get('transport-mode');
        const transportDistance = parseFloat(formData.get('transport-distance')) || 0;
        if (transportMode && transportDistance > 0) {
            const factor = EMISSION_FACTORS[transportMode] || 0.2;
            const transportEmissions = transportDistance * factor * 365; // Annual estimate
            totalEmissions += transportEmissions;
            categoryBreakdown.transport = transportEmissions;
        }

        // Energy usage
        const electricityUsage = parseFloat(formData.get('electricity-usage')) || 0;
        const gasUsage = parseFloat(formData.get('gas-usage')) || 0;
        const energyEmissions = (electricityUsage * EMISSION_FACTORS.electricity) + (gasUsage * EMISSION_FACTORS.gas);
        totalEmissions += energyEmissions * 12; // Annual
        categoryBreakdown.energy = energyEmissions * 12;

        // Diet
        const dietType = formData.get('diet-type');
        if (dietType) {
            totalEmissions += EMISSION_FACTORS[dietType] * 365; // Annual
            categoryBreakdown.diet = EMISSION_FACTORS[dietType] * 365;
        }

        // Waste and recycling
        const recyclingFreq = parseInt(formData.get('recycling-freq')) || 0;
        const composting = formData.get('composting') === 'yes' ? 1 : 0;
        const wasteReduction = (recyclingFreq * EMISSION_FACTORS.recycling) + (composting * EMISSION_FACTORS.composting) * 52;
        totalEmissions += wasteReduction; // Can be negative
        categoryBreakdown.waste = wasteReduction;

        // Display results
        displayResults(totalEmissions, categoryBreakdown);

        // Show results container
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Display results
    function displayResults(totalEmissions, breakdown) {
        const resultsContainer = document.getElementById('carbonResults');
        if (!resultsContainer) return;

        // Convert to metric tons
        const totalTons = (totalEmissions / 1000).toFixed(1);

        // Determine footprint level
        let level = 'low';
        let color = '#10b981';
        let message = 'Excellent! Your carbon footprint is low.';
        if (totalEmissions > 8000) {
            level = 'high';
            color = '#ef4444';
            message = 'High footprint. Consider making changes to reduce emissions.';
        } else if (totalEmissions > 4000) {
            level = 'medium';
            color = '#f59e0b';
            message = 'Moderate footprint. Small changes can make a big difference.';
        }

        // Update results HTML
        resultsContainer.innerHTML = `
            <div class="results-header">
                <h3>Your Annual Carbon Footprint</h3>
                <div class="footprint-gauge" style="background: linear-gradient(90deg, #ef4444 0%, ${color} 100%)">
                    <div class="gauge-fill" style="width: ${Math.min((totalEmissions / 12000) * 100, 100)}%; background: ${color};"></div>
                </div>
                <div class="footprint-value">
                    <span class="value">${totalTons}</span>
                    <span class="unit">metric tons CO₂</span>
                </div>
                <p class="level-message ${level}">${message}</p>
            </div>

            <div class="breakdown-section">
                <h4>Breakdown by Category</h4>
                <div class="breakdown-grid">
                    ${Object.entries(breakdown).map(([category, value]) => {
                        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
                        const categoryTons = (value / 1000).toFixed(1);
                        const categoryColor = getCategoryColor(category);
                        return `
                            <div class="breakdown-item">
                                <div class="category-icon" style="background: ${categoryColor};">
                                    <i data-lucide="${getCategoryIcon(category)}"></i>
                                </div>
                                <div class="category-info">
                                    <span class="category-name">${categoryName}</span>
                                    <span class="category-value">${categoryTons}t CO₂</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="recommendations-section">
                <h4>Personalized Recommendations</h4>
                <div class="recommendations-list">
                    ${getRecommendations(totalEmissions, breakdown)}
                </div>
            </div>

            <div class="action-buttons">
                <button class="btn primary" onclick="if (typeof ClimateWatch !== 'undefined' && ClimateWatch.showNotification) { ClimateWatch.showNotification('Thank you for calculating your footprint! Share your results to inspire others.', 'success'); }">
                    <i data-lucide="share-2"></i>
                    Share Results
                </button>
                <button class="btn secondary" onclick="document.querySelector('.kuleszo-calculator-form').reset(); document.getElementById('carbonResults').style.display='none';">
                    <i data-lucide="refresh-cw"></i>
                    Recalculate
                </button>
            </div>
        `;

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Animate gauge
        animateGauge();
    }

    // Get category color
    function getCategoryColor(category) {
        const colors = {
            transport: '#ef4444',
            energy: '#f59e0b',
            diet: '#10b981',
            waste: '#8b5cf6'
        };
        return colors[category] || '#6b7280';
    }

    // Get category icon
    function getCategoryIcon(category) {
        const icons = {
            transport: 'car',
            energy: 'zap',
            diet: 'utensils',
            waste: 'trash-2'
        };
        return icons[category] || 'circle';
    }

    // Get personalized recommendations
    function getRecommendations(total, breakdown) {
        const recs = [];

        if (breakdown.transport > 2000) {
            recs.push('Consider using public transport or carpooling to reduce transportation emissions by up to 50%.');
        }

        if (breakdown.energy > 1500) {
            recs.push('Switch to energy-efficient appliances and LED lighting to cut energy use by 20-30%.');
        }

        if (breakdown.diet > 3000 && breakdown.diet < 5000) {
            recs.push('Try incorporating more plant-based meals. Reducing meat consumption can lower your diet emissions significantly.');
        }

        if (breakdown.waste > 0) {
            recs.push('Increase recycling and composting to reduce waste-related emissions and landfill use.');
        }

        // General recommendations
        recs.push('Plant trees through our programs - each tree absorbs about 22kg of CO2 per year!');
        recs.push('Join our community events to learn more about sustainable living practices.');

        return recs.map(rec => `<div class="recommendation-item">${rec}</div>`).join('');
    }

    // Animate gauge
    function animateGauge() {
        const gaugeFill = document.querySelector('.gauge-fill');
        if (gaugeFill) {
            gaugeFill.style.width = '0%';
            setTimeout(() => {
                gaugeFill.style.transition = 'width 1.5s ease-out';
                gaugeFill.style.width = gaugeFill.dataset.width || '100%';
            }, 100);
        }
    }

    // Reset calculator
    function resetCalculator() {
        document.querySelector('.kuleszo-calculator-form').reset();
        document.getElementById('carbonResults').style.display = 'none';
        document.querySelector('.current-step').classList.remove('current-step');
        document.querySelector('.step-1').classList.add('current-step');
    }

    // Initialize step navigation
    function initStepNavigation() {
        const steps = document.querySelectorAll('.calculator-step');
        const nextBtns = document.querySelectorAll('.step-next');
        const prevBtns = document.querySelectorAll('.step-prev');

        let currentStep = 1;

        nextBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep < steps.length) {
                    steps[currentStep - 1].classList.remove('current-step');
                    currentStep++;
                    steps[currentStep - 1].classList.add('current-step');
                    updateProgress(currentStep);
                }
            });
        });

        prevBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (currentStep > 1) {
                    steps[currentStep - 1].classList.remove('current-step');
                    currentStep--;
                    steps[currentStep - 1].classList.add('current-step');
                    updateProgress(currentStep);
                }
            });
        });
    }

    // Update progress bar
    function updateProgress(step) {
        const progressBar = document.querySelector('.calculator-progress .progress-fill');
        if (progressBar) {
            const percentage = (step / 4) * 100; // Assuming 4 steps
            progressBar.style.width = percentage + '%';
        }
    }

    // Add loading states to buttons
    function addLoadingStates() {
        const calculateBtn = document.querySelector('.calculate-btn');
        if (calculateBtn) {
            const originalText = calculateBtn.innerHTML;
            calculateBtn.addEventListener('click', function() {
                this.innerHTML = '<i data-lucide="loader"></i> Calculating...';
                this.classList.add('btn-loading');
                this.disabled = true;

                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('btn-loading');
                    this.disabled = false;
                }, 1500);
            });
        }
    }

    // Add CSS for calculator components
    function addCalculatorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .kuleszo-calculator-form .form-group {
                position: relative;
                margin-bottom: 1.5rem;
            }

            .kuleszo-calculator-form .form-input {
                width: 100%;
                padding: 0.75rem 1rem;
                border: 1px solid rgba(22, 163, 74, 0.2);
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(10px);
                transition: all 0.3s;
                font-size: 1rem;
            }

            .kuleszo-calculator-form .form-input:focus {
                outline: none;
                border-color: #16a34a;
                box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
                transform: translateY(-1px);
            }

            .calculator-step {
                display: none;
            }

            .calculator-step.current-step {
                display: block;
            }

            .step-navigation {
                display: flex;
                justify-content: space-between;
                margin-top: 2rem;
                gap: 1rem;
            }

            .step-btn {
                padding: 0.75rem 1.5rem;
                border: 1px solid #d1d5db;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .step-btn.primary {
                background: #16a34a;
                color: white;
                border-color: #16a34a;
            }

            .step-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .calculator-progress {
                width: 100%;
                height: 4px;
                background: rgba(22, 163, 74, 0.2);
                border-radius: 2px;
                margin: 2rem 0;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: #16a34a;
                transition: width 0.3s ease;
                width: 0%;
            }

            .footprint-gauge {
                width: 100%;
                height: 12px;
                border-radius: 6px;
                background: rgba(22, 163, 74, 0.2);
                margin: 1rem 0;
                overflow: hidden;
            }

            .gauge-fill {
                height: 100%;
                background: linear-gradient(90deg, #ef4444, #f59e0b, #10b981);
                transition: width 1.5s ease-out;
                width: 0%;
            }

            .footprint-value {
                text-align: center;
                margin: 1rem 0;
            }

            .footprint-value .value {
                font-size: 2.5rem;
                font-weight: bold;
                color: #1a365d;
            }

            .footprint-value .unit {
                font-size: 1rem;
                color: #6b7280;
            }

            .level-message {
                text-align: center;
                padding: 0.75rem;
                border-radius: 8px;
                margin: 1rem 0;
                font-weight: 500;
            }

            .level-message.low {
                background: rgba(16, 185, 129, 0.1);
                color: #065f46;
            }

            .level-message.medium {
                background: rgba(245, 158, 11, 0.1);
                color: #92400e;
            }

            .level-message.high {
                background: rgba(239, 68, 68, 0.1);
                color: #991b1b;
            }

            .breakdown-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin: 1.5rem 0;
            }

            .breakdown-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(255, 255, 255, 0.8);
                backdrop-filter: blur(10px);
                border-radius: 8px;
                border: 1px solid rgba(22, 163, 74, 0.1);
                transition: transform 0.2s;
            }

            .breakdown-item:hover {
                transform: translateY(-2px);
            }

            .category-icon {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }

            .category-icon i {
                width: 20px;
                height: 20px;
            }

            .category-info {
                flex: 1;
            }

            .category-name {
                display: block;
                font-weight: 500;
                color: #1a365d;
                margin-bottom: 0.25rem;
            }

            .category-value {
                font-size: 0.875rem;
                color: #6b7280;
            }

            .recommendations-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin: 1rem 0;
            }

            .recommendation-item {
                padding: 0.75rem;
                background: rgba(22, 163, 74, 0.05);
                border-left: 3px solid #16a34a;
                border-radius: 4px;
                font-size: 0.875rem;
                line-height: 1.5;
            }

            .action-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 2rem;
                flex-wrap: wrap;
            }

            .btn-loading {
                opacity: 0.7;
                cursor: not-allowed;
            }

            .btn-loading i {
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .breakdown-grid {
                    grid-template-columns: 1fr;
                }

                .action-buttons {
                    flex-direction: column;
                }

                .footprint-value .value {
                    font-size: 2rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize calculator
    initCalculator();
    addCalculatorStyles();

    // Export for global access
    window.CarbonCalculator = {
        calculate: calculateFootprint,
        reset: resetCalculator
    };
});
