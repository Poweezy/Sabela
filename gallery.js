// Image Lightbox Gallery for The Climate Watch
// Provides lightbox functionality for resource images and gallery

document.addEventListener('DOMContentLoaded', function() {
    // Gallery configuration
    const GALLERY_CONFIG = {
        selectors: {
            images: '.kuleszo-resource-card img, .gallery-image, .lightbox-trigger',
            lightbox: '#lightboxModal',
            lightboxImg: '#lightboxImg',
            lightboxCaption: '#lightboxCaption',
            prevBtn: '.nav-btn.prev',
            nextBtn: '.nav-btn.next',
            closeBtn: '.lightbox-close'
        },
        images: [], // Will be populated dynamically
        currentIndex: 0,
        keyboardShortcuts: true
    };

    // Initialize gallery
    function initGallery() {
        // Collect all gallery images
        collectGalleryImages();

        // Setup click handlers
        setupImageClickHandlers();

        // Setup lightbox controls
        setupLightboxControls();

        // Setup keyboard navigation
        setupKeyboardNavigation();

        // Add gallery styles
        addGalleryStyles();

        console.log('Gallery initialized with', GALLERY_CONFIG.images.length, 'images');
    }

    // Collect all gallery images
    function collectGalleryImages() {
        const imageSelectors = GALLERY_CONFIG.selectors.images.split(', ');
        GALLERY_CONFIG.images = [];

        imageSelectors.forEach(selector => {
            const images = document.querySelectorAll(selector);
            images.forEach((img, index) => {
                GALLERY_CONFIG.images.push({
                    element: img,
                    src: img.src || img.dataset.src,
                    alt: img.alt || img.dataset.alt || 'Gallery image',
                    index: GALLERY_CONFIG.images.length
                });
            });
        });

        // Remove duplicates based on src
        GALLERY_CONFIG.images = GALLERY_CONFIG.images.filter((img, index, self) =>
            index === self.findIndex(i => i.src === img.src)
        );
    }

    // Setup click handlers for images
    function setupImageClickHandlers() {
        GALLERY_CONFIG.images.forEach(image => {
            image.element.addEventListener('click', function(e) {
                e.preventDefault();
                const clickedIndex = GALLERY_CONFIG.images.findIndex(img => img.element === this);
                openLightbox(clickedIndex);
            });

            // Add cursor pointer for better UX
            image.element.style.cursor = 'pointer';
            image.element.title = 'Click to enlarge';
        });
    }

    // Setup lightbox controls
    function setupLightboxControls() {
        const lightbox = document.querySelector(GALLERY_CONFIG.selectors.lightbox);
        if (!lightbox) return;

        // Close button
        const closeBtn = lightbox.querySelector(GALLERY_CONFIG.selectors.closeBtn);
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }

        // Previous button
        const prevBtn = lightbox.querySelector(GALLERY_CONFIG.selectors.prevBtn);
        if (prevBtn) {
            prevBtn.addEventListener('click', () => navigateLightbox(-1));
        }

        // Next button
        const nextBtn = lightbox.querySelector(GALLERY_CONFIG.selectors.nextBtn);
        if (nextBtn) {
            nextBtn.addEventListener('click', () => navigateLightbox(1));
        }

        // Overlay click to close
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Setup keyboard navigation
    function setupKeyboardNavigation() {
        if (!GALLERY_CONFIG.keyboardShortcuts) return;

        document.addEventListener('keydown', function(e) {
            const lightbox = document.querySelector(GALLERY_CONFIG.selectors.lightbox);
            if (lightbox && lightbox.style.display === 'block') {
                switch(e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        navigateLightbox(-1);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        navigateLightbox(1);
                        break;
                }
            }
        });
    }

    // Open lightbox
    function openLightbox(index = 0) {
        const lightbox = document.querySelector(GALLERY_CONFIG.selectors.lightbox);
        const lightboxImg = document.querySelector(GALLERY_CONFIG.selectors.lightboxImg);
        const lightboxCaption = document.querySelector(GALLERY_CONFIG.selectors.lightboxCaption);

        if (!lightbox || !lightboxImg || !lightboxCaption) {
            console.warn('Lightbox elements not found');
            return;
        }

        // Set current index
        GALLERY_CONFIG.currentIndex = Math.max(0, Math.min(index, GALLERY_CONFIG.images.length - 1));

        // Update image and caption
        const currentImage = GALLERY_CONFIG.images[GALLERY_CONFIG.currentIndex];
        lightboxImg.src = currentImage.src;
        lightboxImg.alt = currentImage.alt;
        lightboxCaption.textContent = currentImage.alt;

        // Show loading
        lightboxImg.style.display = 'none';
        lightbox.classList.add('loading');

        // Load image and show when ready
        lightboxImg.onload = function() {
            lightboxImg.style.display = 'block';
            lightbox.classList.remove('loading');
        };

        // Preload next and previous images
        preloadAdjacentImages();

        // Show lightbox
        lightbox.style.display = 'flex';
        lightbox.setAttribute('aria-hidden', 'false');

        // Focus management
        const firstFocusable = lightbox.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }

        // Trap focus in lightbox
        trapFocus(lightbox);

        // Track lightbox open
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lightbox_open', {
                event_category: 'engagement',
                event_label: 'gallery_image',
                value: 1
            });
        }
    }

    // Close lightbox
    function closeLightbox() {
        const lightbox = document.querySelector(GALLERY_CONFIG.selectors.lightbox);
        if (!lightbox) return;

        lightbox.style.display = 'none';
        lightbox.setAttribute('aria-hidden', 'true');
        lightbox.classList.remove('loading');

        // Return focus to triggering element
        const currentImage = GALLERY_CONFIG.images[GALLERY_CONFIG.currentIndex];
        if (currentImage && currentImage.element) {
            currentImage.element.focus();
        }
    }

    // Navigate lightbox
    function navigateLightbox(direction) {
        const newIndex = GALLERY_CONFIG.currentIndex + direction;
        if (newIndex >= 0 && newIndex < GALLERY_CONFIG.images.length) {
            openLightbox(newIndex);
        }
    }

    // Preload adjacent images
    function preloadAdjacentImages() {
        const prevIndex = GALLERY_CONFIG.currentIndex - 1;
        const nextIndex = GALLERY_CONFIG.currentIndex + 1;

        if (prevIndex >= 0) {
            const prevImg = new Image();
            prevImg.src = GALLERY_CONFIG.images[prevIndex].src;
        }

        if (nextIndex < GALLERY_CONFIG.images.length) {
            const nextImg = new Image();
            nextImg.src = GALLERY_CONFIG.images[nextIndex].src;
        }
    }

    // Trap focus within lightbox
    function trapFocus(lightbox) {
        const focusableElements = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) return;

        lightbox.addEventListener('keydown', function(e) {
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

    // Add gallery styles
    function addGalleryStyles() {
        const style = document.createElement('style');
        style.id = 'gallery-styles';
        style.textContent = `
            /* Lightbox Gallery Styles */
            #lightboxModal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(4px);
                z-index: 10000;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                box-sizing: border-box;
                animation: fadeIn 0.3s ease;
            }

            #lightboxModal[style*="display: flex"] {
                display: flex !important;
            }

            #lightboxModal.loading #lightboxImg {
                opacity: 0;
            }

            .lightbox-content {
                position: relative;
                width: 100%;
                max-width: 90vw;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .lightbox-image-container {
                position: relative;
                width: 100%;
                height: 70vh;
                max-height: 70vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #000;
                border-radius: 8px;
                overflow: hidden;
                margin-bottom: 1rem;
            }

            #lightboxImg {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                transition: opacity 0.3s ease;
                border-radius: 8px;
            }

            .lightbox-caption {
                color: white;
                background: rgba(0, 0, 0, 0.7);
                padding: 0.75rem 1rem;
                border-radius: 0 0 8px 8px;
                width: 100%;
                text-align: center;
                font-size: 0.875rem;
                line-height: 1.4;
            }

            /* Navigation Buttons */
            .nav-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: none;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
                z-index: 10001;
            }

            .nav-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: translateY(-50%) scale(1.1);
            }

            .nav-btn.prev {
                left: 1rem;
            }

            .nav-btn.next {
                right: 1rem;
            }

            .nav-btn:disabled {
                opacity: 0.3;
                cursor: not-allowed;
                transform: translateY(-50%) scale(0.9);
            }

            /* Close Button */
            .lightbox-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                font-size: 1.25rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                backdrop-filter: blur(10px);
                z-index: 10001;
            }

            .lightbox-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            /* Image Hover Effects */
            .kuleszo-resource-card img,
            .gallery-image,
            .lightbox-trigger {
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border-radius: 8px;
            }

            .kuleszo-resource-card img:hover,
            .gallery-image:hover,
            .lightbox-trigger:hover {
                transform: scale(1.02);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                z-index: 10;
            }

            /* Loading Spinner */
            .lightbox-loading {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }

            /* Animations */
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            /* Responsive */
            @media (max-width: 768px) {
                #lightboxModal {
                    padding: 1rem;
                }

                .lightbox-image-container {
                    height: 60vh;
                }

                .nav-btn {
                    width: 40px;
                    height: 40px;
                    font-size: 1.25rem;
                }

                .lightbox-close {
                    width: 36px;
                    height: 36px;
                    font-size: 1rem;
                }

                .lightbox-caption {
                    font-size: 0.75rem;
                    padding: 0.5rem 0.75rem;
                }
            }

            @media (max-width: 480px) {
                .lightbox-image-container {
                    height: 50vh;
                }

                .nav-btn {
                    left: 0.5rem;
                }

                .nav-btn.next {
                    right: 0.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize gallery
    initGallery();

    // Export for global access
    window.GalleryManager = {
        open: openLightbox,
        close: closeLightbox,
        next: () => navigateLightbox(1),
        prev: () => navigateLightbox(-1)
    };
});
