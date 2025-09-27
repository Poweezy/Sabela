document.addEventListener('DOMContentLoaded', () => {
  const shareButtons = document.querySelectorAll('.share-btn');

  shareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const platform = button.dataset.platform;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      const text = encodeURIComponent('Check out this amazing environmental initiative!');

      let shareUrl = '';

      switch (platform) {
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case 'whatsapp':
          shareUrl = `https://wa.me/?text=${text}%20${url}`;
          break;
        case 'email':
          shareUrl = `mailto:?subject=${title}&body=${text}%20${url}`;
          break;
        default:
          return;
      }

      // Open share dialog in a popup window
      const width = 600;
      const height = 400;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;

      window.open(
        shareUrl,
        'share-dialog',
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );

      // Track share event (if analytics is available)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'share', {
          method: platform,
          content_type: 'page',
          item_id: window.location.pathname
        });
      }
    });
  });

  // Copy link functionality
  const copyLinkBtn = document.querySelector('.copy-link-btn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showCopyFeedback(copyLinkBtn, 'Copied!');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyFeedback(copyLinkBtn, 'Copied!');
      }
    });
  }

  // Handle resource share buttons
  const resourceShareButtons = document.querySelectorAll('.share-resource-btn');
  resourceShareButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();

      const title = button.dataset.title || document.title;
      const url = button.dataset.url || window.location.href;
      const text = encodeURIComponent(`Check out: ${title}`);

      // Create a temporary share modal
      const modal = document.createElement('div');
      modal.className = 'share-modal';
      modal.innerHTML = `
        <div class="share-modal-content">
          <div class="share-modal-header">
            <h3>Share "${title}"</h3>
            <button class="share-modal-close">&times;</button>
          </div>
          <div class="share-modal-body">
            <div class="share-options-grid">
              <button class="share-option" data-platform="facebook" data-url="${url}" data-text="${text}">
                <i class="fab fa-facebook-f"></i>
                <span>Facebook</span>
              </button>
              <button class="share-option" data-platform="twitter" data-url="${url}" data-text="${text}">
                <i class="fab fa-twitter"></i>
                <span>Twitter</span>
              </button>
              <button class="share-option" data-platform="linkedin" data-url="${url}" data-text="${text}">
                <i class="fab fa-linkedin-in"></i>
                <span>LinkedIn</span>
              </button>
              <button class="share-option" data-platform="whatsapp" data-url="${url}" data-text="${text}">
                <i class="fab fa-whatsapp"></i>
                <span>WhatsApp</span>
              </button>
              <button class="share-option" data-platform="email" data-url="${url}" data-text="${text}" data-title="${encodeURIComponent(title)}">
                <i class="fas fa-envelope"></i>
                <span>Email</span>
              </button>
              <button class="share-option copy-link-option" data-url="${url}">
                <i class="fas fa-link"></i>
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Handle modal close
      const closeBtn = modal.querySelector('.share-modal-close');
      closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
      });

      // Handle share options
      const shareOptions = modal.querySelectorAll('.share-option');
      shareOptions.forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          const platform = option.dataset.platform;
          const optionUrl = option.dataset.url;
          const optionText = option.dataset.text;
          const optionTitle = option.dataset.title;

          if (platform === 'copy-link-option') {
            // Handle copy link
            navigator.clipboard.writeText(optionUrl).then(() => {
              showCopyFeedback(option, 'Copied!');
            }).catch(() => {
              // Fallback
              const textArea = document.createElement('textarea');
              textArea.value = optionUrl;
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
              showCopyFeedback(option, 'Copied!');
            });
            return;
          }

          let shareUrl = '';

          switch (platform) {
            case 'facebook':
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(optionUrl)}`;
              break;
            case 'twitter':
              shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(optionUrl)}&text=${optionText}`;
              break;
            case 'linkedin':
              shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(optionUrl)}`;
              break;
            case 'whatsapp':
              shareUrl = `https://wa.me/?text=${optionText}%20${encodeURIComponent(optionUrl)}`;
              break;
            case 'email':
              shareUrl = `mailto:?subject=${optionTitle}&body=${optionText}%20${encodeURIComponent(optionUrl)}`;
              break;
            default:
              return;
          }

          // Open share dialog
          const width = 600;
          const height = 400;
          const left = (window.innerWidth - width) / 2;
          const top = (window.innerHeight - height) / 2;

          window.open(
            shareUrl,
            'share-dialog',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
          );

          document.body.removeChild(modal);

          // Track share event
          if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
              method: platform,
              content_type: 'resource',
              item_id: title
            });
          }
        });
      });

      // Close modal when clicking outside
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      });
    });
  });

  function showCopyFeedback(button, message) {
    const originalText = button.innerHTML;
    button.innerHTML = `<i class="fas fa-check"></i> ${message}`;
    button.classList.add('copied');

    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove('copied');
    }, 2000);
  }

  // --- Donation Sharing ---
  const donationShareBtn = document.querySelector('.donation-share-btn');
  if (donationShareBtn) {
    donationShareBtn.addEventListener('click', () => {
      const donationAmount = donationShareBtn.dataset.amount || 'a generous';
      const cause = donationShareBtn.dataset.cause || 'the cause';
      handleDonationShare(donationAmount, cause);
    });
  }

  function handleDonationShare(amount, cause) {
    const text = encodeURIComponent(`I just donated ${amount} to support ${cause}! Join me in making a difference.`);
    const url = encodeURIComponent(window.location.href);
    const title = "Support Our Cause";

    const modal = createShareModal(title, url, text);
    document.body.appendChild(modal);
    setupModalHandlers(modal, 'donation', cause);
  }

  // --- Social Proof ---
  async function fetchSocialProof() {
    // In a real app, you'd fetch this from your server/API
    const mockApiData = {
      shares: 1234,
      followers: 5678,
      donations: 89,
    };
    return mockApiData;
  }

  async function displaySocialProof() {
    const socialProofContainer = document.querySelector('.social-proof-container');
    if (!socialProofContainer) return;

    try {
      const data = await fetchSocialProof();
      socialProofContainer.innerHTML = `
        <div class="social-proof-item">
          <i class="fas fa-share-alt"></i>
          <span>${data.shares.toLocaleString()} Shares</span>
        </div>
        <div class="social-proof-item">
          <i class="fas fa-users"></i>
          <span>${data.followers.toLocaleString()} Supporters</span>
        </div>
        <div class="social-proof-item">
          <i class="fas fa-heart"></i>
          <span>${data.donations.toLocaleString()} Donations</span>
        </div>
      `;
    } catch (error) {
      console.error('Failed to load social proof:', error);
      socialProofContainer.innerHTML = '<p>Join thousands of others in supporting our cause!</p>';
    }
  }

  // --- Generic Modal Creation and Handlers ---
  function createShareModal(title, url, text) {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
      <div class="share-modal-content">
        <div class="share-modal-header">
          <h3>${title}</h3>
          <button class="share-modal-close">&times;</button>
        </div>
        <div class="share-modal-body">
          <div class="share-options-grid">
            <button class="share-option" data-platform="facebook" data-url="${url}" data-text="${text}">
              <i class="fab fa-facebook-f"></i> <span>Facebook</span>
            </button>
            <button class="share-option" data-platform="twitter" data-url="${url}" data-text="${text}">
              <i class="fab fa-twitter"></i> <span>Twitter</span>
            </button>
            <button class="share-option" data-platform="linkedin" data-url="${url}" data-text="${text}">
              <i class="fab fa-linkedin-in"></i> <span>LinkedIn</span>
            </button>
            <button class="share-option" data-platform="whatsapp" data-url="${url}" data-text="${text}">
              <i class="fab fa-whatsapp"></i> <span>WhatsApp</span>
            </button>
            <button class="share-option" data-platform="email" data-url="${url}" data-text="${text}" data-title="${encodeURIComponent(title)}">
              <i class="fas fa-envelope"></i> <span>Email</span>
            </button>
            <button class="share-option copy-link-option" data-url="${url}">
              <i class="fas fa-link"></i> <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  function setupModalHandlers(modal, shareType, itemId) {
    const closeBtn = modal.querySelector('.share-modal-close');
    closeBtn.addEventListener('click', () => document.body.removeChild(modal));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });

    const shareOptions = modal.querySelectorAll('.share-option');
    shareOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const platform = option.dataset.platform;
        const url = option.dataset.url;
        const text = option.dataset.text;
        const title = option.dataset.title;

        if (platform === 'copy-link-option') {
          navigator.clipboard.writeText(url).then(() => {
            showCopyFeedback(option, 'Copied!');
          }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showCopyFeedback(option, 'Copied!');
          });
          return;
        }

        let shareUrl = '';
        switch (platform) {
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${text}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
          case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`;
            break;
          case 'email':
            shareUrl = `mailto:?subject=${title}&body=${text}%20${encodeURIComponent(url)}`;
            break;
        }

        if (shareUrl) {
          const width = 600, height = 400;
          const left = (window.innerWidth - width) / 2;
          const top = (window.innerHeight - height) / 2;
          window.open(shareUrl, 'share-dialog', `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`);
        }

        document.body.removeChild(modal);

        if (typeof gtag !== 'undefined') {
          gtag('event', 'share', {
            method: platform,
            content_type: shareType,
            item_id: itemId
          });
        }
      });
    });
  }

  // Initialize features
  displaySocialProof();
});
