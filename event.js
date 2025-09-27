// Event Registration Modals for The Climate Watch
// Handles event registration through modals with form integration

document.addEventListener('DOMContentLoaded', function() {
    // Event data (can be loaded from API in production)
    const EVENTS_DATA = [
        {
            id: 'climate-agriculture',
            title: 'Climate-Smart Agriculture Training',
            date: 'November 15, 2024',
            time: '9:00 AM - 3:00 PM',
            location: 'Mbabane Community Center',
            category: 'workshop',
            description: 'Learn sustainable farming techniques to build resilience against climate change impacts.',
            maxAttendees: 50,
            currentAttendees: 12,
            image: 'img/events/agriculture-workshop.jpg'
        },
        {
            id: 'tree-planting',
            title: 'Tree Planting Drive',
            date: 'November 22, 2024',
            time: '8:00 AM - 12:00 PM',
            location: 'Lubombo Mountains',
            category: 'campaign',
            description: 'Join us for a community tree planting event to restore native forests and biodiversity.',
            maxAttendees: 100,
            currentAttendees: 45,
            image: 'img/events/tree-planting.jpg'
        },
        {
            id: 'youth-summit',
            title: 'Youth Climate Leadership Summit',
            date: 'December 5, 2024',
            time: '2:00 PM - 5:00 PM',
            location: 'Virtual (Zoom)',
            category: 'webinar',
            description: 'Virtual summit bringing together young climate leaders from across Eswatini.',
            maxAttendees: 200,
            currentAttendees: 78,
            image: 'img/events/youth-summit.jpg'
        },
        {
            id: 'renewable-energy',
            title: 'Renewable Energy Solutions',
            date: 'December 12, 2024',
            time: '10:00 AM - 4:00 PM',
            location: 'Manzini Technical College',
            category: 'workshop',
            description: 'Explore solar and wind energy options for rural communities and sustainable development.',
            maxAttendees: 40,
            currentAttendees: 23,
            image: 'img/events/renewable-energy.jpg'
        }
    ];

    // Initialize events functionality
    function initEvents() {
        // Setup event filtering
        setupEventFiltering();

        // Setup register buttons
        setupRegisterButtons();

        // Setup calendar integration if needed
        setupEventCalendar();

        // Add event styles
        addEventStyles();

        // Load events dynamically
        loadEvents();
    }

    // Setup event filtering
    function setupEventFiltering() {
        const categoryFilters = document.querySelectorAll('.category-filter');
        const eventCards = document.querySelectorAll('.kuleszo-event-card');

        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const category = this.dataset.category;

                // Update active filter
                categoryFilters.forEach(f => f.classList.remove('active'));
                this.classList.add('active');

                // Filter events
                eventCards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.3s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // Setup register buttons
    function setupRegisterButtons() {
        const registerBtns = document.querySelectorAll('.kuleszo-btn-event');

        registerBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const eventCard = this.closest('.kuleszo-event-card');
                const eventId = eventCard ? eventCard.dataset.eventId : 'general';
                showRegistrationModal(eventId);
            });
        });
    }

    // Load events dynamically
    function loadEvents() {
        const eventsGrid = document.querySelector('.kuleszo-events-grid');
        if (!eventsGrid) return;

        // Clear existing cards (except placeholders)
        const existingCards = eventsGrid.querySelectorAll('.kuleszo-event-card:not([data-placeholder])');
        existingCards.forEach(card => card.remove());

        // Add event cards
        EVENTS_DATA.forEach((event, index) => {
            const eventCard = createEventCard(event, index);
            eventsGrid.appendChild(eventCard);
        });

        // Re-setup register buttons after adding new cards
        setupRegisterButtons();
    }

    // Create event card HTML
    function createEventCard(event, index) {
        const card = document.createElement('div');
        card.className = `kuleszo-event-card ${event.category}`;
        card.dataset.eventId = event.id;
        card.dataset.category = event.category;
        card.dataset.animationDelay = `${index * 0.1}s`;

        const spotsLeft = event.maxAttendees - event.currentAttendees;
        const isFull = spotsLeft <= 0;

        card.innerHTML = `
            <div class="event-image" style="background-image: url('${event.image || 'img/events/default.jpg'}')">
                <div class="event-date-badge">
                    <span class="event-day">${new Date(event.date).getDate()}</span>
                    <span class="event-month">${new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
                <div class="event-type-badge ${event.category}">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</div>
                ${isFull ? '<div class="event-full-badge">Full</div>' : ''}
            </div>
            <div class="kuleszo-event-content">
                <h3>${event.title}</h3>
                <div class="event-location">
                    <i data-lucide="${event.location.includes('Virtual') ? 'monitor' : 'map-pin'}"></i>
                    <span>${event.location}</span>
                </div>
                <p class="event-description">${event.description}</p>
                <div class="event-meta">
                    <div class="meta-item">
                        <i data-lucide="clock"></i>
                        <span>${event.time}</span>
                    </div>
                    <div class="meta-item">
                        <i data-lucide="users"></i>
                        <span>${spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}</span>
                    </div>
                </div>
                <button class="kuleszo-btn kuleszo-btn-event ${isFull ? 'disabled' : ''}" ${isFull ? 'disabled' : ''} aria-label="Register for ${event.title}">
                    <span>${isFull ? 'Full' : 'Register Now'}</span>
                    <i data-lucide="arrow-right"></i>
                </button>
            </div>
        `;

        return card;
    }

    // Show registration modal
    function showRegistrationModal(eventId) {
        const event = EVENTS_DATA.find(e => e.id === eventId);
        if (!event) return;

        // Create modal HTML
        const modalHtml = createRegistrationModal(event);

        // Add to body
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Show modal
        const modal = document.getElementById('eventModal');
        const overlay = document.getElementById('modalOverlay');
        modal.style.display = 'block';
        overlay.style.display = 'block';

        // Focus management
        modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').focus();

        // Setup form
        const form = modal.querySelector('#eventRegistrationForm');
        setupEventForm(form, event);

        // Close modal handlers
        setupModalCloseHandlers(modal, overlay);

        // Trap focus in modal
        trapFocus(modal);

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Create registration modal HTML
    function createRegistrationModal(event) {
        const spotsLeft = event.maxAttendees - event.currentAttendees;
        const isFull = spotsLeft <= 0;

        return `
            <div id="modalOverlay" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle" tabindex="-1">
                <div id="eventModal" class="event-modal" role="dialog">
                    <div class="modal-header">
                        <div class="modal-icon">
                            <i data-lucide="calendar"></i>
                        </div>
                        <h2 id="modalTitle">Register for ${event.title}</h2>
                        <button class="modal-close" aria-label="Close modal">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        ${isFull ? `
                            <div class="full-event-message">
                                <i data-lucide="alert-circle"></i>
                                <h3>This event is full</h3>
                                <p>We're sorry, but this event has reached maximum capacity. Join our waitlist or check out other upcoming events.</p>
                                <button class="btn secondary" id="joinWaitlist">Join Waitlist</button>
                                <button class="btn secondary" id="viewOtherEvents">View Other Events</button>
                            </div>
                        ` : `
                            <div class="event-details">
                                <div class="detail-item">
                                    <i data-lucide="calendar"></i>
                                    <span>${event.date} at ${event.time}</span>
                                </div>
                                <div class="detail-item">
                                    <i data-lucide="${event.location.includes('Virtual') ? 'monitor' : 'map-pin'}"></i>
                                    <span>${event.location}</span>
                                </div>
                                <div class="detail-item">
                                    <i data-lucide="users"></i>
                                    <span>${event.maxAttendees - event.currentAttendees} spots remaining</span>
                                </div>
                                <p class="event-description">${event.description}</p>
                            </div>

                            <form id="eventRegistrationForm" class="event-registration-form">
                                <input type="hidden" name="event-id" value="${event.id}">
                                <div class="form-group">
                                    <label for="registrant-name">Full Name *</label>
                                    <input type="text" id="registrant-name" name="registrant-name" required>
                                </div>
                                <div class="form-group">
                                    <label for="registrant-email">Email Address *</label>
                                    <input type="email" id="registrant-email" name="registrant-email" required>
                                </div>
                                <div class="form-group">
                                    <label for="registrant-phone">Phone Number</label>
                                    <input type="tel" id="registrant-phone" name="registrant-phone">
                                </div>
                                <div class="form-group">
                                    <label for="number-of-guests">Number of Guests (including yourself) *</label>
                                    <input type="number" id="number-of-guests" name="number-of-guests" min="1" max="${spotsLeft}" value="1" required>
                                </div>
                                <div class="form-group">
                                    <label for="special-requirements">Special Requirements or Dietary Needs</label>
                                    <textarea id="special-requirements" name="special-requirements" rows="3" placeholder="Any accessibility needs, dietary restrictions, or other requirements..."></textarea>
                                </div>
                                <div class="form-group">
                                    <label class="checkbox-label">
                                        <input type="checkbox" name="newsletter-optin" id="newsletter-optin">
                                        <span class="checkmark"></span>
                                        Also subscribe me to the Climate Watch newsletter
                                    </label>
                                </div>
                                <div class="form-actions">
                                    <button type="submit" class="btn primary">
                                        <i data-lucide="send"></i>
                                        Register for Event
                                    </button>
                                    <button type="button" class="btn secondary" id="cancelRegistration">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        `}
                    </div>
                </div>
            </div>
        `;
    }

    // Setup event registration form
    function setupEventForm(form, event) {
        if (!form) return;

        // Use FormHandler if available
        if (typeof FormHandler !== 'undefined') {
            // Basic validation setup
            form.addEventListener('input', function(e) {
                const field = e.target;
                if (field.name === 'number-of-guests') {
                    const maxGuests = event.maxAttendees - event.currentAttendees;
                    if (parseInt(field.value) > maxGuests) {
                        field.value = maxGuests;
                    }
                }
                FormHandler.validateField(field, {
                    required: field.hasAttribute('required'),
                    type: field.type === 'email' ? 'email' : null,
                    min: field.min,
                    max: field.max
                });
            });

            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;

                // Show loading
                submitBtn.innerHTML = '<i data-lucide="loader"></i> Registering...';
                submitBtn.disabled = true;

                try {
                    // Simulate registration
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    // Success
                    if (typeof FormHandler !== 'undefined') {
                        FormHandler.showMessage(form.querySelector('.form-message') || document.createElement('div'), 'Registration successful! Check your email for confirmation.', 'success');
                    }

                    // Track event
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'event_registration', {
                            event_category: 'engagement',
                            event_label: event.title,
                            value: 1
                        });
                    }

                    // Close modal after success
                    setTimeout(() => closeModal(), 2000);

                } catch (error) {
                    if (typeof FormHandler !== 'undefined') {
                        FormHandler.showMessage(form.querySelector('.form-message') || document.createElement('div'), 'Registration failed. Please try again.', 'error');
                    }
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
    }

    // Setup modal close handlers
    function setupModalCloseHandlers(modal, overlay) {
        // Close button
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal());
        }

        // Overlay click
        overlay.addEventListener('click', () => closeModal());

        // Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });

        // Waitlist button
        const waitlistBtn = modal.querySelector('#joinWaitlist');
        if (waitlistBtn) {
            waitlistBtn.addEventListener('click', function() {
                // Simulate waitlist signup
                alert('Added to waitlist! We\'ll notify you if spots open up.');
                closeModal();
            });
        }

        // View other events
        const otherEventsBtn = modal.querySelector('#viewOtherEvents');
        if (otherEventsBtn) {
            otherEventsBtn.addEventListener('click', function() {
                closeModal();
                document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Cancel button
        const cancelBtn = modal.querySelector('#cancelRegistration');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => closeModal());
        }
    }

    // Close modal
    function closeModal() {
        const modal = document.getElementById('eventModal');
        const overlay = document.getElementById('modalOverlay');
        if (modal && overlay) {
            modal.style.display = 'none';
            overlay.style.display = 'none';
            // Remove from DOM after animation
            setTimeout(() => {
                modal.remove();
                overlay.remove();
            }, 300);
        }
    }

    // Trap focus within modal
    function trapFocus(modal) {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // Setup event calendar (basic implementation)
    function setupEventCalendar() {
        // If calendar container exists, initialize
        const calendarContainer = document.querySelector('.events-calendar');
        if (!calendarContainer) return;

        // Simple calendar display (can integrate FullCalendar in production)
        const today = new Date();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        calendarContainer.innerHTML = `
            <div class="calendar-header">
                <button class="nav-btn" id="prevMonth"><i data-lucide="chevron-left"></i></button>
                <h3 id="monthYear">${monthNames[today.getMonth()]} ${today.getFullYear()}</h3>
                <button class="nav-btn" id="nextMonth"><i data-lucide="chevron-right"></i></button>
            </div>
            <div class="calendar-grid" id="calendarGrid"></div>
        `;

        // Basic calendar generation
        generateCalendar(today.getMonth(), today.getFullYear());

        // Navigation
        document.getElementById('prevMonth').addEventListener('click', () => navigateMonth(-1));
        document.getElementById('nextMonth').addEventListener('click', () => navigateMonth(1));
    }

    // Generate calendar grid
    function generateCalendar(month, year) {
        const calendarGrid = document.getElementById('calendarGrid');
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let gridHTML = '<div class="calendar-weekdays"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div><div class="calendar-days">';

        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            gridHTML += '<span class="empty-day"></span>';
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const eventDay = EVENTS_DATA.find(e => new Date(e.date).getDate() === day && new Date(e.date).getMonth() === month);
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            const hasEvent = eventDay;

            gridHTML += `<span class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}" data-day="${day}">
                ${day}
                ${hasEvent ? `<div class="event-dot" title="${eventDay.title}"></div>` : ''}
            </span>`;
        }

        gridHTML += '</div>';
        calendarGrid.innerHTML = gridHTML;

        // Update header
        document.getElementById('monthYear').textContent = `${monthNames[month]} ${year}`;

        // Add click handlers for days with events
        document.querySelectorAll('.has-event').forEach(day => {
            day.addEventListener('click', function() {
                const dayNum = parseInt(this.dataset.day);
                const clickedEvent = EVENTS_DATA.find(e => new Date(e.date).getDate() === dayNum && new Date(e.date).getMonth() === month);
                if (clickedEvent) {
                    showRegistrationModal(clickedEvent.id);
                }
            });
        });

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Navigate months
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function navigateMonth(direction) {
        currentMonth += direction;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    }

    // Add event modal styles
    function addEventStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Event Card Enhancements */
            .kuleszo-event-card {
                transition: all 0.3s ease;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                position: relative;
            }

            .kuleszo-event-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
            }

            .event-image {
                height: 200px;
                background-size: cover;
                background-position: center;
                position: relative;
                overflow: hidden;
            }

            .event-date-badge {
                position: absolute;
                top: 12px;
                left: 12px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                padding: 0.5rem 0.75rem;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                font-weight: 600;
                color: #1a365d;
            }

            .event-type-badge {
                position: absolute;
                top: 12px;
                right: 12px;
                padding: 0.375rem 0.75rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                color: white;
                text-transform: uppercase;
            }

            .event-type-badge.workshop { background: #16a34a; }
            .event-type-badge.campaign { background: #ef4444; }
            .event-type-badge.webinar { background: #3b82f6; }

            .event-full-badge {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(239, 68, 68, 0.9);
                color: white;
                padding: 1rem 2rem;
                border-radius: 8px;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .kuleszo-event-content {
                padding: 1.5rem;
            }

            .kuleszo-event-content h3 {
                margin: 0 0 0.75rem 0;
                font-size: 1.25rem;
                color: #1a365d;
            }

            .event-location {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.75rem;
                color: #6b7280;
                font-size: 0.875rem;
            }

            .event-location i {
                width: 16px;
                height: 16px;
                color: #16a34a;
            }

            .event-description {
                color: #4b5563;
                line-height: 1.5;
                margin-bottom: 1rem;
            }

            .event-meta {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1.25rem;
                font-size: 0.875rem;
                color: #6b7280;
            }

            .meta-item {
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }

            .meta-item i {
                width: 14px;
                height: 14px;
                color: #16a34a;
            }

            .kuleszo-btn-event {
                width: 100%;
                justify-content: center;
                padding: 0.75rem;
            }

            .kuleszo-btn-event.disabled {
                background: #9ca3af;
                cursor: not-allowed;
                opacity: 0.6;
            }

            /* Modal Styles */
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                display: none;
                z-index: 1000;
                animation: fadeIn 0.3s ease;
            }

            .event-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                max-width: 500px;
                width: 90%;
                max-height: 90vh;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                display: none;
                z-index: 1001;
                animation: slideIn 0.3s ease;
            }

            .modal-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1.5rem;
                background: linear-gradient(135deg, #16a34a, #15803d);
                color: white;
            }

            .modal-icon {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 0.75rem;
            }

            .modal-icon i {
                width: 20px;
                height: 20px;
            }

            .modal-header h2 {
                margin: 0;
                font-size: 1.25rem;
                flex: 1;
            }

            .modal-close {
                background: none;
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background 0.2s;
            }

            .modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .modal-close i {
                width: 20px;
                height: 20px;
            }

            .modal-body {
                padding: 1.5rem;
                max-height: 60vh;
                overflow-y: auto;
            }

            .full-event-message {
                text-align: center;
                padding: 2rem;
            }

            .full-event-message i {
                width: 48px;
                height: 48px;
                color: #f59e0b;
                margin-bottom: 1rem;
            }

            .full-event-message h3 {
                color: #1a365d;
                margin-bottom: 0.5rem;
            }

            .event-details {
                background: rgba(22, 163, 74, 0.05);
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1.5rem;
            }

            .detail-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
            }

            .detail-item i {
                width: 16px;
                height: 16px;
                color: #16a34a;
            }

            .event-registration-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }

            .event-registration-form .form-group {
                margin-bottom: 0;
            }

            .event-registration-form label {
                display: block;
                margin-bottom: 0.25rem;
                font-weight: 500;
                color: #374151;
                font-size: 0.875rem;
            }

            .event-registration-form input,
            .event-registration-form textarea,
            .event-registration-form select {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid rgba(22, 163, 74, 0.2);
                border-radius: 6px;
                font-size: 0.875rem;
                transition: border-color 0.2s;
            }

            .event-registration-form input:focus,
            .event-registration-form textarea:focus,
            .event-registration-form select:focus {
                outline: none;
                border-color: #16a34a;
            }

            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
                font-size: 0.875rem;
                color: #6b7280;
            }

            .checkmark {
                width: 18px;
                height: 18px;
                border: 2px solid #d1d5db;
                border-radius: 4px;
                position: relative;
                flex-shrink: 0;
            }

            .checkbox-label input:checked + .checkmark {
                background: #16a34a;
                border-color: #16a34a;
            }

            .checkbox-label input:checked + .checkmark::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 12px;
                font-weight: bold;
            }

            .form-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
                flex-wrap: wrap;
            }

            .btn {
                padding: 0.75rem 1.5rem;
                border-radius: 6px;
                border: none;
                cursor: pointer;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.2s;
            }

            .btn.primary {
                background: #16a34a;
                color: white;
            }

            .btn.primary:hover {
                background: #15803d;
            }

            .btn.secondary {
                background: transparent;
                color: #6b7280;
                border: 1px solid #d1d5db;
            }

            .btn.secondary:hover {
                background: #f9fafb;
            }

            /* Calendar Styles */
            .events-calendar {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 1.5rem;
                margin: 2rem 0;
            }

            .calendar-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 1rem;
            }

            .nav-btn {
                background: none;
                border: 1px solid #d1d5db;
                color: #6b7280;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s;
            }

            .nav-btn:hover {
                background: #f9fafb;
                color: #16a34a;
                border-color: #16a34a;
            }

            .calendar-grid {
                display: grid;
                grid-template-columns: repeat(7, 1fr);
                gap: 2px;
                background: #f3f4f6;
                border-radius: 8px;
                overflow: hidden;
            }

            .calendar-weekdays {
                background: #e5e7eb;
                font-weight: 600;
                color: #374151;
                text-align: center;
                padding: 0.5rem 0;
            }

            .calendar-weekdays span {
                padding: 0.25rem;
            }

            .calendar-days {
                display: contents;
            }

            .calendar-day {
                aspect-ratio: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                padding: 0.5rem;
                background: white;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
                font-size: 0.875rem;
                font-weight: 500;
                color: #374151;
            }

            .calendar-day:hover {
                background: #f9fafb;
            }

            .calendar-day.today {
                background: #16a34a;
                color: white;
            }

            .calendar-day.has-event {
                position: relative;
            }

            .event-dot {
                position: absolute;
                bottom: 2px;
                right: 2px;
                width: 6px;
                height: 6px;
                background: #16a34a;
                border-radius: 50%;
                border: 2px solid white;
            }

            .empty-day {
                background: transparent;
            }

            /* Animations */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from { 
                    opacity: 0;
                    transform: translate(-50%, -60%) scale(0.95);
                }
                to { 
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            /* Responsive */
            @media (max-width: 768px) {
                .event-modal {
                    width: 95%;
                    margin: 1rem;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    transform: none;
                    height: auto;
                    max-height: none;
                    border-radius: 12px 12px 0 0;
                }

                .modal-body {
                    padding: 1rem;
                }

                .form-actions {
                    flex-direction: column;
                }

                .calendar-grid {
                    grid-template-columns: repeat(7, 1fr);
                    font-size: 0.75rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize events
    initEvents();

    // Export for global access
    window.EventManager = {
        showRegistrationModal: showRegistrationModal,
        loadEvents: loadEvents,
        closeModal: closeModal
    };
});
