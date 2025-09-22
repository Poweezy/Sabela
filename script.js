const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        if (nav.classList.contains('nav-active')) {
            navLinks.forEach((link, index) => {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`;
            });
        } else {
            navLinks.forEach((link, index) => {
                link.style.animation = '';
            });
        }

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

const smoothScroll = () => {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = e.target.getAttribute('href');
            document.querySelector(id).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

const scrollAnimation = () => {
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

const animateCounters = () => {
    const counters = document.querySelectorAll('[data-count]');
    const speed = 200; // The lower the slower

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-count');
                        const count = +counter.innerText.replace('+', '');

                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc) + '+';
                            setTimeout(updateCount, 1);
                        } else {
                            counter.innerText = target + '+';
                        }
                    };

                    updateCount();
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    const impactSection = document.querySelector('#our-impact');
    if (impactSection) {
        observer.observe(impactSection);
    }
}

const fetchWeather = async () => {
    // IMPORTANT: Replace "YOUR_API_KEY" with your actual WeatherAPI.com API key.
    // Keeping API keys in client-side code is a security risk.
    // For production environments, it's recommended to fetch weather data via a backend service.
    const apiKey = 'YOUR_API_KEY';
    const regions = ['Hhohho', 'Lubombo', 'Manzini', 'Shiselweni'];
    const weatherGrid = document.querySelector('.weather-grid');

    // Clear existing static weather cards
    weatherGrid.innerHTML = '';

    for (const region of regions) {
        try {
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${region}`);
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            const data = await response.json();

            const weatherCard = document.createElement('div');
            weatherCard.classList.add('weather-card');

            weatherCard.innerHTML = `
                <div class="weather-icon">
                    <img src="${data.current.condition.icon}" alt="${data.current.condition.text}">
                </div>
                <h3>${data.location.name}</h3>
                <p class="temperature">${data.current.temp_c}°C</p>
                <p>${data.current.condition.text}</p>
            `;
            weatherGrid.appendChild(weatherCard);
        } catch (error) {
            console.error(`Could not fetch weather for ${region}:`, error);
            // Optionally, display an error message in the card
            const errorCard = document.createElement('div');
            errorCard.classList.add('weather-card');
            errorCard.innerHTML = `
                <h3>${region}</h3>
                <p>Could not load weather data.</p>
            `;
            weatherGrid.appendChild(errorCard);
        }
    }
};

navSlide();
smoothScroll();
scrollAnimation();
animateCounters();
fetchWeather();
