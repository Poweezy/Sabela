document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('newsletterForm');
  const emailInput = document.getElementById('newsletterEmail');
  const formMessage = form.querySelector('.form-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.textContent = '';
    formMessage.style.color = '';

    const email = emailInput.value.trim();

    if (!validateEmail(email)) {
      formMessage.textContent = 'Please enter a valid email address.';
      formMessage.classList.add('error', 'show');
      emailInput.focus();
      return;
    }

    try {
      // Simulate form submission to a backend or email service
      // Replace this with actual API call if available
      await fakeSubmit(email);

      formMessage.textContent = 'Thank you for subscribing!';
      formMessage.classList.add('success', 'show');
      form.reset();

      // Hide the success message after 5 seconds
      setTimeout(() => {
        formMessage.classList.remove('show');
      }, 5000);
    } catch (error) {
      formMessage.textContent = 'An error occurred. Please try again later.';
      formMessage.classList.add('error', 'show');
    }
  });

  function validateEmail(email) {
    // Basic email regex validation
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function fakeSubmit(email) {
    // Simulate async submission with a promise
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
});
