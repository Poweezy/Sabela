// Donation System for The Climate Watch
// Handles donation modals, payment processing, and donation tracking

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const DONATION_AMOUNTS = [25, 50, 100, 250, 500, 1000];
    const DONATION_FREQUENCIES = ['one-time', 'monthly', 'yearly'];

    // Initialize donation system
    function initDonations() {
        // Setup donation buttons
        setupDonationButtons();

        // Setup donation modal
        setupDonationModal();

        // Setup donation form
        setupDonationForm();

        // Add donation styles
        addDonationStyles();

        // Load donation stats
        loadDonationStats();
    }

    // Setup donation buttons
    function setupDonationButtons() {
        const donateBtns = document.querySelectorAll('.kuleszo-btn-donate, [onclick*="donationModal"]');

        donateBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                showDonationModal();
            });
        });
    }

    // Setup donation modal
    function setupDonationModal() {
        const modal = document.getElementById('donationModal');
        if (!modal) return;

        // Close modal handlers
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => hideDonationModal());
        }

        // Click outside to close
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideDonationModal();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                hideDonationModal();
            }
        });
    }

    // Show donation modal
    function showDonationModal() {
        const modal = document.getElementById('donationModal');
        if (!modal) return;

        // Reset form
        resetDonationForm();

        // Show modal
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');

        // Focus management
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }

        // Trap focus
        trapFocus(modal);

        // Track modal open
        if (typeof gtag !== 'undefined') {
            gtag('event', 'donation_modal_open', {
                event_category: 'engagement',
                event_label: 'donation_modal'
            });
        }
    }

    // Hide donation modal
    function hideDonationModal() {
        const modal = document.getElementById('donationModal');
        if (!modal) return;

        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
    }

    // Reset donation form
    function resetDonationForm() {
        const form = document.getElementById('donationForm');
        if (!form) return;

        form.reset();

        // Reset amount selection
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Reset frequency selection
        document.querySelectorAll('.frequency-btn').forEach(btn => {
            btn.classList.remove('selected');
        });

        // Reset custom amount
        const customAmount = document.getElementById('customAmount');
        if (customAmount) {
            customAmount.style.display = 'none';
            customAmount.value = '';
        }

        // Hide payment section
        const paymentSection = document.querySelector('.payment-section');
        if (paymentSection) {
            paymentSection.style.display = 'none';
        }

        // Reset progress
        updateDonationProgress(0);
    }

    // Setup donation form
    function setupDonationForm() {
        const form = document.getElementById('donationForm');
        if (!form) return;

        // Amount selection
        setupAmountSelection();

        // Frequency selection
        setupFrequencySelection();

        // Custom amount input
        setupCustomAmount();

        // Form validation and submission
        form.addEventListener('submit', handleDonationSubmit);

        // Real-time validation
        form.addEventListener('input', function(e) {
            validateDonationField(e.target);
        });
    }

    // Setup amount selection
    function setupAmountSelection() {
        const amountBtns = document.querySelectorAll('.amount-btn');

        amountBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove selected class from all buttons
                amountBtns.forEach(b => b.classList.remove('selected'));

                // Add selected class to clicked button
                this.classList.add('selected');

                // Update hidden input
                const amount = parseInt(this.dataset.amount);
                document.getElementById('donationAmount').value = amount;

                // Hide custom amount input
                const customAmount = document.getElementById('customAmount');
                if (customAmount) {
                    customAmount.style.display = 'none';
                    customAmount.value = '';
                }

                // Show payment section
                showPaymentSection();

                // Update progress
                updateDonationProgress(1);
            });
        });

        // Custom amount button
        const customBtn = document.querySelector('.custom-amount-btn');
        if (customBtn) {
            customBtn.addEventListener('click', function() {
                // Remove selected class from all buttons
                amountBtns.forEach(b => b.classList.remove('selected'));
                this.classList.add('selected');

                // Show custom amount input
                const customAmount = document.getElementById('customAmount');
                if (customAmount) {
                    customAmount.style.display = 'block';
                    customAmount.focus();
                }

                // Update progress
                updateDonationProgress(1);
            });
        }
    }

    // Setup frequency selection
    function setupFrequencySelection() {
        const frequencyBtns = document.querySelectorAll('.frequency-btn');

        frequencyBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove selected class from all buttons
                frequencyBtns.forEach(b => b.classList.remove('selected'));

                // Add selected class to clicked button
                this.classList.add('selected');

                // Update hidden input
                const frequency = this.dataset.frequency;
                document.getElementById('donationFrequency').value = frequency;

                // Update progress
                updateDonationProgress(2);
            });
        });
    }

    // Setup custom amount input
    function setupCustomAmount() {
        const customAmount = document.getElementById('customAmount');
        if (!customAmount) return;

        customAmount.addEventListener('input', function() {
            const value = parseFloat(this.value);
            if (value > 0) {
                document.getElementById('donationAmount').value = value;
                showPaymentSection();
            } else {
                document.getElementById('donationAmount').value = '';
            }
        });

        customAmount.addEventListener('blur', function() {
            const value = parseFloat(this.value);
            if (value <= 0) {
                this.value = '';
                document.getElementById('donationAmount').value = '';
            }
        });
    }

    // Show payment section
    function showPaymentSection() {
        const paymentSection = document.querySelector('.payment-section');
        if (paymentSection) {
            paymentSection.style.display = 'block';
            paymentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Update donation progress
    function updateDonationProgress(step) {
        const progressBar = document.querySelector('.donation-progress .progress-fill');
        if (progressBar) {
            const percentage = (step / 3) * 100; // 3 steps total
            progressBar.style.width = percentage + '%';
        }

        // Update step indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            if (index <= step) {
                indicator.classList.add('completed');
            } else {
                indicator.classList.remove('completed');
            }
        });
    }

    // Validate donation field
    function validateDonationField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Field-specific validation
        switch (field.id) {
            case 'donorName':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Name is required';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;

            case 'donorEmail':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Email is required';
                } else {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                }
                break;

            case 'customAmount':
                if (value && (isNaN(value) || parseFloat(value) <= 0)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid amount';
                }
                break;
        }

        // Update field appearance
        field.parentNode.classList.toggle('field-error', !isValid);

        // Show error message
        if (!isValid && errorMessage) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errorMessage;
            field.parentNode.appendChild(errorDiv);
        }

        return isValid;
    }

    // Handle donation submission
    async function handleDonationSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Validate form
        const isValid = validateDonationForm(form);
        if (!isValid) {
            return;
        }

        // Show loading state
        submitBtn.innerHTML = '<i data-lucide="loader"></i> Processing...';
        submitBtn.disabled = true;

        try {
            // Get form data
            const formData = new FormData(form);
            const donationData = {
                amount: parseFloat(formData.get('donationAmount')),
                frequency: formData.get('donationFrequency'),
                name: formData.get('donorName'),
                email: formData.get('donorEmail'),
                paymentMethod: formData.get('paymentMethod'),
                anonymous: formData.get('anonymous') === 'on',
                newsletter: formData.get('newsletter') === 'on'
            };

            // Process donation (simulate payment processing)
            const result = await processDonation(donationData);

            if (result.success) {
                // Show success message
                showDonationSuccess(donationData);

                // Track donation
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'donation_complete', {
                        event_category: 'conversion',
                        event_label: 'donation',
                        value: donationData.amount
                    });
                }

                // Close modal after delay
                setTimeout(() => {
                    hideDonationModal();
                }, 3000);

            } else {
                throw new Error(result.message || 'Donation failed');
            }

        } catch (error) {
            console.error('Donation error:', error);
            showDonationError(error.message);
        } finally {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    // Validate donation form
    function validateDonationForm(form) {
        let isValid = true;

        // Check required fields
        const requiredFields = ['donationAmount', 'donationFrequency', 'donorName', 'donorEmail', 'paymentMethod'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !field.value.trim()) {
                validateDonationField(field);
                isValid = false;
            }
        });

        // Check amount
        const amount = parseFloat(document.getElementById('donationAmount').value);
        if (!amount || amount <= 0) {
            isValid = false;
            const customAmount = document.getElementById('customAmount');
            if (customAmount && customAmount.style.display !== 'none') {
                validateDonationField(customAmount);
            }
        }

        return isValid;
    }

    // Process donation (simulate payment processing)
    async function processDonation(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success (90% success rate)
        const success = Math.random() > 0.1;

        if (success) {
            return {
                success: true,
                transactionId: 'TXN_' + Date.now(),
                message: 'Donation processed successfully'
            };
        } else {
            throw new Error('Payment processing failed. Please try again.');
        }
    }

    // Show donation success
    function showDonationSuccess(data) {
        const modalBody = document.querySelector('#donationModal .modal-body');
        if (!modalBody) return;

        const successHtml = `
            <div class="donation-success">
                <div class="success-icon">
                    <i data-lucide="check-circle"></i>
                </div>
                <h3>Thank You for Your Donation!</h3>
                <div class="donation-summary">
                    <div class="summary-item">
                        <span class="label">Amount:</span>
                        <span class="value">$${data.amount.toFixed(2)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Frequency:</span>
                        <span class="value">${data.frequency.charAt(0).toUpperCase() + data.frequency.slice(1)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="label">Transaction ID:</span>
                        <span class="value">TXN_${Date.now()}</span>
                    </div>
                </div>
                <p class="success-message">
                    Your support helps us continue our vital work in building climate resilience across Eswatini.
                    ${data.frequency !== 'one-time' ? 'You will receive a confirmation email for each recurring donation.' : ''}
                </p>
                <div class="success-actions">
                    <button class="btn secondary" onclick="hideDonationModal()">Close</button>
                    <button class="btn primary" onclick="window.ClimateWatch.shareDonation('${data.amount}')">
                        <i data-lucide="share-2"></i>
                        Share Your Impact
                    </button>
                </div>
            </div>
        `;

        modalBody.innerHTML = successHtml;

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Show donation error
    function showDonationError(message) {
        const modalBody = document.querySelector('#donationModal .modal-body');
        if (!modalBody) return;

        const errorHtml = `
            <div class="donation-error">
                <div class="error-icon">
                    <i data-lucide="alert-circle"></i>
                </div>
                <h3>Donation Failed</h3>
                <p class="error-message">${message}</p>
                <div class="error-actions">
                    <button class="btn secondary" onclick="resetDonationForm()">Try Again</button>
                    <button class="btn primary" onclick="window.location.href='mailto:support@theclimatewatch.org'">
                        Contact Support
                    </button>
                </div>
            </div>
        `;

        modalBody.innerHTML = errorHtml;

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // Load donation stats
    function loadDonationStats() {
        // Simulate loading donation statistics
        const stats = {
            totalRaised: 125000,
            donorsCount: 1250,
            projectsFunded: 15,
            communitiesHelped: 25
        };

        // Update stats in the UI
        updateDonationStats(stats);
    }

    // Update donation stats display
    function updateDonationStats(stats) {
        const statElements = document.querySelectorAll('.donation-stats .stat-value');

        if (statElements.length >= 4) {
            statElements[0].textContent = '$' + stats.totalRaised.toLocaleString();
            statElements[1].textContent = stats.donorsCount.toLocaleString();
            statElements[2].textContent = stats.projectsFunded.toString();
            statElements[3].textContent = stats.communitiesHelped.toString();
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

    // Add donation styles
    function addDonationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Donation Modal Enhancements */
            .modal {
                display: none;
                position: fixed;
                z-index: 1000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                animation: fadeIn 0.3s ease;
            }

            .modal-content {
                background-color: white;
                margin: 5% auto;
                padding: 0;
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                animation: slideIn 0.3s ease;
                max-height: 90vh;
                overflow-y: auto;
            }

            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                background: linear-gradient(135deg, #16a34a, #15803d);
                color: white;
                border-radius: 12px 12px 0 0;
            }

            .modal-header h2 {
                margin: 0;
                font-size: 1.25rem;
            }

            .close {
                color: white;
                font-size: 28px;
                font-weight: bold;
                cursor: pointer;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s;
            }

            .close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .modal-body {
                padding: 1.5rem;
            }

            /* Donation Form Styles */
            .donation-form-section {
                margin-bottom: 2rem;
            }

            .donation-form-section h3 {
                margin-bottom: 1rem;
                color: #1a365d;
                font-size: 1.125rem;
            }

            .amount-selection {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .amount-btn, .custom-amount-btn {
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                font-weight: 500;
            }

            .amount-btn:hover, .custom-amount-btn:hover {
                border-color: #16a34a;
                background: rgba(22, 163, 74, 0.05);
            }

            .amount-btn.selected, .custom-amount-btn.selected {
                border-color: #16a34a;
                background: #16a34a;
                color: white;
            }

            .custom-amount-input {
                margin-top: 0.5rem;
                display: none;
            }

            .custom-amount-input input {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
            }

            .custom-amount-input input:focus {
                outline: none;
                border-color: #16a34a;
            }

            .frequency-selection {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .frequency-btn {
                flex: 1;
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
                font-weight: 500;
            }

            .frequency-btn:hover {
                border-color: #16a34a;
                background: rgba(22, 163, 74, 0.05);
            }

            .frequency-btn.selected {
                border-color: #16a34a;
                background: #16a34a;
                color: white;
            }

            .payment-section {
                display: none;
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e5e7eb;
            }

            .payment-section h4 {
                margin-bottom: 1rem;
                color: #1a365d;
            }

            .donor-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .donor-info input {
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
            }

            .donor-info input:focus {
                outline: none;
                border-color: #16a34a;
            }

            .payment-method {
                margin-bottom: 1rem;
            }

            .payment-method label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }

            .payment-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 0.5rem;
            }

            .payment-option {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .payment-option:hover {
                border-color: #16a34a;
                background: rgba(22, 163, 74, 0.05);
            }

            .payment-option.selected {
                border-color: #16a34a;
                background: #16a34a;
                color: white;
            }

            .payment-option input[type="radio"] {
                display: none;
            }

            .donation-options {
                margin-bottom: 1.5rem;
            }

            .donation-options label {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
                cursor: pointer;
                font-size: 0.875rem;
            }

            .donation-options input[type="checkbox"] {
                width: 18px;
                height: 18px;
                accent-color: #16a34a;
            }

            .donation-progress {
                width: 100%;
                height: 4px;
                background: rgba(22, 163, 74, 0.2);
                border-radius: 2px;
                margin: 1rem 0;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: #16a34a;
                transition: width 0.3s ease;
                width: 0%;
            }

            .step-indicators {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;
            }

            .step-indicator {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #e5e7eb;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.75rem;
                font-weight: 500;
                color: #6b7280;
                transition: all 0.2s;
            }

            .step-indicator.completed {
                background: #16a34a;
                color: white;
            }

            .donation-success, .donation-error {
                text-align: center;
                padding: 2rem;
            }

            .success-icon, .error-icon {
                width: 64px;
                height: 64px;
                margin: 0 auto 1rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .success-icon {
                background: rgba(16, 185, 129, 0.1);
                color: #10b981;
            }

            .error-icon {
                background: rgba(239, 68, 68, 0.1);
                color: #ef4444;
            }

            .success-icon i, .error-icon i {
                width: 32px;
                height: 32px;
            }

            .donation-summary {
                background: rgba(22, 163, 74, 0.05);
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0;
            }

            .summary-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 0.5rem;
                font-size: 0.875rem;
            }

            .summary-item:last-child {
                margin-bottom: 0;
            }

            .summary-item .label {
                color: #6b7280;
            }

            .summary-item .value {
                font-weight: 500;
                color: #1a365d;
            }

            .success-message, .error-message {
                margin: 1rem 0;
                line-height: 1.5;
            }

            .success-actions, .error-actions {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
                flex-wrap: wrap;
            }

            .field-error {
                color: #dc2626;
                font-size: 0.75rem;
                margin-top: 0.25rem;
                display: block;
            }

            .field-error-parent {
                position: relative;
            }

            .field-error-parent.field-error input {
                border-color: #dc2626;
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
                .modal-content {
                    width: 95%;
                    margin: 2rem auto;
                }

                .amount-selection {
                    grid-template-columns: repeat(3, 1fr);
                }

                .donor-info {
                    grid-template-columns: 1fr;
                }

                .payment-options {
                    grid-template-columns: 1fr;
                }

                .success-actions, .error-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize donations
    initDonations();

    // Export for global access
    window.DonationManager = {
        showModal: showDonationModal,
        hideModal: hideDonationModal,
        resetForm: resetDonationForm
    };
});
