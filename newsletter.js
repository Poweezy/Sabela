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
      formMessage.style.color = 'red';
      emailInput.focus();
      return;
    }

    try {
      // Simulate form submission to a backend or email service
      // Replace this with actual API call if available
      await fakeSubmit(email);

      formMessage.textContent = 'Thank you for subscribing!';
      formMessage.style.color = 'green';
      form.reset();
    } catch (error) {
      formMessage.textContent = 'An error occurred. Please try again later.';
      formMessage.style.color = 'red';
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
