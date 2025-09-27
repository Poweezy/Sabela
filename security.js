// Security utilities for input sanitization and CSRF protection
class SecurityUtils {
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        
        return input
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+=/gi, '') // Remove event handlers
            .trim();
    }
    
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && email.length <= 254;
    }
    
    static generateCSRFToken() {
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }
    
    static rateLimit(key, limit = 5, window = 60000) {
        const now = Date.now();
        const requests = JSON.parse(localStorage.getItem(`rl_${key}`) || '[]');
        
        // Clean old requests
        const validRequests = requests.filter(time => now - time < window);
        
        if (validRequests.length >= limit) {
            return false; // Rate limited
        }
        
        validRequests.push(now);
        localStorage.setItem(`rl_${key}`, JSON.stringify(validRequests));
        return true;
    }
}

// Apply security to all forms
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add CSRF token
        const csrfToken = SecurityUtils.generateCSRFToken();
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrf_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
        
        // Sanitize inputs on submit
        form.addEventListener('submit', function(e) {
            const formData = new FormData(form);
            let isValid = true;
            
            // Rate limiting check
            if (!SecurityUtils.rateLimit(form.id || 'form', 3, 300000)) {
                e.preventDefault();
                alert('Too many requests. Please wait before submitting again.');
                return;
            }
            
            // Sanitize and validate inputs
            for (let [key, value] of formData.entries()) {
                if (key === 'email' && !SecurityUtils.validateEmail(value)) {
                    isValid = false;
                    break;
                }
                
                if (typeof value === 'string') {
                    const sanitized = SecurityUtils.sanitizeInput(value);
                    form.querySelector(`[name="${key}"]`).value = sanitized;
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                alert('Please check your input and try again.');
            }
        });
    });
});