// Form Validation and Submission Handler for The Climate Watch
// Handles all forms on the website with validation, submission, and user feedback

document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const FORM_CONFIG = {
        volunteerForm: {
            endpoint: '/api/volunteer-signup',
            successMessage: 'Thank you for your interest in volunteering! We\'ll be in touch soon.',
            fields: {
                'first-name': { required: true, minLength: 2, pattern: /^[a-zA-Z\s]+$/ },
                'last-name': { required: true, minLength: 2, pattern: /^[a-zA-Z\s]+$/ },
                'email': { required: true, type: 'email' },
                'phone': { required: false, pattern: /^[\+]?[0-9\-\s\(\)]{10,}$/ },
                'skills': { required: true },
                'availability': { required: true },
                'experience': { required: false },
                'motivation': { required: true, minLength: 10 }
            }
        },
        newsletterForm: {
            endpoint: '/api/newsletter-signup',
            successMessage: 'Welcome to our newsletter! Stay updated with our latest climate action initiatives.',
            fields: {
                'newsletter-email': { required: true, type: 'email' },
                'newsletter-frequency': { required: true }
            }
        },
        contactForm: {
            endpoint: '/api/contact',
            successMessage: 'Thank you for your message! We\'ll get back to you within 24 hours.',
            fields: {
                'contact-name': { required: true, minLength: 2 },
                'contact-email': { required: true, type: 'email' },
                'contact-subject': { required: true },
                'contact-message': { required: true, minLength: 10 }
            }
        },
        quizForm: {
            endpoint: '/api/quiz-submit',
            successMessage: 'Quiz submitted successfully! Check your results below.',
            fields: {
                'quiz-answers': { required: true }
            }
        }
    };

    // Initialize all forms
    function initForms() {
        Object.keys(FORM_CONFIG).forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                setupFormValidation(form, FORM_CONFIG[formId]);
            }
        });

        // Initialize file upload if present
        initFileUpload();

        // Add form styles
        addFormStyles();
    }

    // Setup form validation and submission
    function setupFormValidation(form, config) {
        const submitBtn = form.querySelector('button[type="submit"], .submit-btn, .calculate-btn');
        const messageDiv = form.querySelector('.form-message');

        // Real-time validation
        form.addEventListener('input', function(e) {
            const field = e.target;
            if (field.name && config.fields[field.name]) {
                validateField(field, config.fields[field.name]);
            }
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (validateForm(form, config)) {
                submitForm(form, config, submitBtn, messageDiv);
            } else {
                showMessage(messageDiv, 'Please correct the errors above and try again.', 'error');
            }
        });

        // Initialize form state
        updateSubmitButton(form, submitBtn, config);
    }

    // Validate individual field
    function validateField(field, rules) {
        const value = field.value.trim();
        const fieldGroup = field.closest('.kuleszo-input-group, .kuleszo-select-group, .input-group');
        let isValid = true;
        let errorMessage = '';

        // Remove existing error messages
        const existingError = fieldGroup.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        else if (rules.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Pattern validation
        else if (rules.pattern && value && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid value';
        }

        // Min length validation
        else if (rules.minLength && value && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Minimum ${rules.minLength} characters required`;
        }

        // Max length validation
        else if (rules.maxLength && value && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `Maximum ${rules.maxLength} characters allowed`;
        }

        // Update field appearance
        fieldGroup.classList.toggle('field-error', !isValid);
        fieldGroup.classList.toggle('field-valid', isValid && value);

        // Show error message
        if (!isValid && errorMessage) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errorMessage;
            fieldGroup.appendChild(errorDiv);
        }

        return isValid;
    }

    // Validate entire form
    function validateForm(form, config) {
        let isValid = true;

        Object.keys(config.fields).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const fieldValid = validateField(field, config.fields[fieldName]);
                if (!fieldValid) {
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    // Submit form
    async function submitForm(form, config, submitBtn, messageDiv) {
        const originalText = submitBtn.innerHTML;
        const formData = new FormData(form);

        // Show loading state
        submitBtn.innerHTML = '<i data-lucide="loader"></i> Submitting...';
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');

        try {
            // Simulate API call (replace with actual API endpoint)
            const response = await simulateApiCall(formData, config.endpoint);

            if (response.success) {
                showMessage(messageDiv, config.successMessage, 'success');
                form.reset();

                // Reset field states
                form.querySelectorAll('.field-error, .field-valid').forEach(el => {
                    el.classList.remove('field-error', 'field-valid');
                });

                // Track successful submission
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit', {
                        event_category: 'engagement',
                        event_label: form.id
                    });
                }

                // Special handling for calculator form
                if (form.id === 'calculatorForm') {
                    // Trigger calculation
                    if (typeof CarbonCalculator !== 'undefined') {
                        CarbonCalculator.calculate();
                    }
                }

            } else {
                throw new Error(response.message || 'Submission failed');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showMessage(messageDiv, error.message || 'An error occurred. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('btn-loading');

            // Initialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    // Simulate API call (replace with actual implementation)
    async function simulateApiCall(formData, endpoint) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate success/failure randomly (90% success rate)
        const success = Math.random() > 0.1;

        if (success) {
            return {
                success: true,
                message: 'Form submitted successfully'
            };
        } else {
            throw new Error('Server error. Please try again later.');
        }
    }

    // Show message to user
    function showMessage(messageDiv, message, type) {
        if (!messageDiv) return;

        messageDiv.textContent = message;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';

        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }

        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Update submit button state
    function updateSubmitButton(form, submitBtn, config) {
        if (!submitBtn) return;

        const checkFormValidity = () => {
            const isValid = validateForm(form, config);
            submitBtn.disabled = !isValid;
            submitBtn.classList.toggle('btn-disabled', !isValid);
        };

        // Check initially and on form changes
        form.addEventListener('input', checkFormValidity);
        form.addEventListener('change', checkFormValidity);
        checkFormValidity();
    }

    // Initialize file upload functionality
    function initFileUpload() {
        const fileInputs = document.querySelectorAll('input[type="file"]');

        fileInputs.forEach(input => {
            const fileGroup = input.closest('.kuleszo-input-group');
            if (!fileGroup) return;

            input.addEventListener('change', function(e) {
                const files = Array.from(e.target.files);
                const maxSize = 5 * 1024 * 1024; // 5MB
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];

                let isValid = true;
                let errorMessage = '';

                // Check file count
                if (files.length > 3) {
                    isValid = false;
                    errorMessage = 'Maximum 3 files allowed';
                }

                // Check file sizes and types
                files.forEach(file => {
                    if (file.size > maxSize) {
                        isValid = false;
                        errorMessage = 'Each file must be less than 5MB';
                    }
                    if (!allowedTypes.includes(file.type)) {
                        isValid = false;
                        errorMessage = 'Only images (JPG, PNG, GIF) and PDF files are allowed';
                    }
                });

                // Update UI
                fileGroup.classList.toggle('field-error', !isValid);
                fileGroup.classList.toggle('field-valid', isValid && files.length > 0);

                // Remove existing error
                const existingError = fileGroup.querySelector('.field-error');
                if (existingError) {
                    existingError.remove();
                }

                // Show error message
                if (!isValid && errorMessage) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'field-error';
                    errorDiv.textContent = errorMessage;
                    fileGroup.appendChild(errorDiv);
                }

                // Show file names
                updateFileList(fileGroup, files);
            });
        });
    }

    // Update file list display
    function updateFileList(fileGroup, files) {
        const existingList = fileGroup.querySelector('.file-list');
        if (existingList) {
            existingList.remove();
        }

        if (files.length > 0) {
            const fileList = document.createElement('div');
            fileList.className = 'file-list';

            files.forEach(file => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                fileItem.innerHTML = `
                    <i data-lucide="file"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">(${formatFileSize(file.size)})</span>
                `;
                fileList.appendChild(fileItem);
            });

            fileGroup.appendChild(fileList);

            // Initialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Add form enhancement styles
    function addFormStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .kuleszo-input-group, .kuleszo-select-group {
                position: relative;
                margin-bottom: 1.5rem;
            }

            .kuleszo-input-group input, .kuleszo-input-group textarea,
            .kuleszo-select-group select {
                width: 100%;
                padding: 0.75rem 1rem;
                border: 2px solid rgba(22, 163, 74, 0.2);
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                font-size: 1rem;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }

            .kuleszo-input-group input:focus, .kuleszo-input-group textarea:focus,
            .kuleszo-select-group select:focus {
                outline: none;
                border-color: #16a34a;
                box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
                transform: translateY(-1px);
            }

            .kuleszo-input-group textarea {
                resize: vertical;
                min-height: 100px;
            }

            .field-error input, .field-error textarea, .field-error select {
                border-color: #dc2626;
                box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
            }

            .field-valid input, .field-valid textarea, .field-valid select {
                border-color: #16a34a;
                box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
            }

            .field-error {
                color: #dc2626;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.25rem;
            }

            .field-error::before {
                content: '⚠️';
                font-size: 0.75rem;
            }

            .form-message {
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                font-weight: 500;
                display: none;
            }

            .form-message.success {
                background: rgba(16, 185, 129, 0.1);
                color: #065f46;
                border: 1px solid rgba(16, 185, 129, 0.2);
            }

            .form-message.error {
                background: rgba(220, 38, 38, 0.1);
                color: #991b1b;
                border: 1px solid rgba(220, 38, 38, 0.2);
            }

            .btn-loading {
                opacity: 0.7;
                cursor: not-allowed;
                position: relative;
            }

            .btn-loading i {
                animation: spin 1s linear infinite;
            }

            .btn-disabled {
                opacity: 0.5;
                cursor: not-allowed;
                pointer-events: none;
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            .file-list {
                margin-top: 0.5rem;
            }

            .file-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;
                background: rgba(22, 163, 74, 0.05);
                border-radius: 4px;
                margin-bottom: 0.25rem;
                font-size: 0.875rem;
            }

            .file-item i {
                color: #16a34a;
                width: 16px;
                height: 16px;
            }

            .file-name {
                flex: 1;
                font-weight: 500;
            }

            .file-size {
                color: #6b7280;
                font-size: 0.75rem;
            }

            /* Enhanced form buttons */
            .kuleszo-form button[type="submit"],
            .submit-btn, .calculate-btn {
                background: linear-gradient(135deg, #16a34a, #15803d);
                color: white;
                border: none;
                padding: 0.875rem 2rem;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
            }

            .kuleszo-form button[type="submit"]:hover,
            .submit-btn:hover, .calculate-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(22, 163, 74, 0.4);
            }

            .kuleszo-form button[type="submit"]:active,
            .submit-btn:active, .calculate-btn:active {
                transform: translateY(0);
            }

            /* Form progress indicator */
            .form-progress {
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

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .kuleszo-form-row {
                    flex-direction: column;
                }

                .kuleszo-input-group, .kuleszo-select-group {
                    width: 100%;
                }

                .kuleszo-form button[type="submit"],
                .submit-btn, .calculate-btn {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize forms when DOM is ready
    initForms();

    // Export for global access
    window.FormHandler = {
        validateField: validateField,
        validateForm: validateForm,
        showMessage: showMessage
    };
});
