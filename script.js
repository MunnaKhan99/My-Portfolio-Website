document.addEventListener('DOMContentLoaded', function() {
    // Hide preloader once content is loaded
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('hidden');
    }

    // Canvas Background Animation
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    let mouse = { x: undefined, y: undefined };
    let particles = [];

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse movement listener
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Particle constructor
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw particle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        // Update particle position and interaction
        update() {
            // Check if particle is still within canvas
            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.directionY = -this.directionY;
            }

            this.x += this.directionX;
            this.y += this.directionY;

            // Mouse interaction
            const distance = Math.sqrt(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2));
            if (distance < 100) { // If particle is close to mouse
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 10;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 10;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 10;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 10;
                }
            }
            this.draw();
        }
    }

    // Create particle array
    function init() {
        particles = [];
        const numberOfParticles = (canvas.width * canvas.height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            const size = (Math.random() * 5) + 1;
            const x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            const y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            const directionX = (Math.random() * 0.5) - 0.25;
            const directionY = (Math.random() * 0.5) - 0.25;
            const color = 'rgba(255, 255, 255, 0.5)'; // Subtle white for particles
            particles.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            for (let j = i; j < particles.length; j++) {
                const distance = Math.sqrt(Math.pow(particles[i].x - particles[j].x, 2) + Math.pow(particles[i].y - particles[j].y, 2));
                if (distance < 120) { // Draw lines between particles within 120px
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 239, 255, ${1 - (distance / 120)})`; // Line color with decreasing opacity
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    init();
    animate();

    // Existing JavaScript for typed text and scroll reveal (if any, ensure it's compatible)
    const typedTextElement = document.getElementById('typed-text');
    const phrases = ["Frontend Developer", "Software Engineer", "DevOps Enthusiast"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseBeforeDelete = 1500;
    const pauseBeforeType = 500;

    function type() {
        console.log('type() function called. Current phraseIndex:', phraseIndex, 'charIndex:', charIndex, 'isDeleting:', isDeleting);
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        console.log('Updated textContent:', typedTextElement.textContent);

        if (!isDeleting && charIndex === currentPhrase.length) {
            console.log('Phrase fully typed, setting isDeleting to true.');
            setTimeout(() => isDeleting = true, pauseBeforeDelete);
        } else if (isDeleting && charIndex === 0) {
            console.log('Phrase fully deleted, moving to next phrase.');
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(() => type(), pauseBeforeType);
            return;
        }

        const currentSpeed = isDeleting ? deletingSpeed : typingSpeed;
        setTimeout(type, currentSpeed);
    }

    // Start typing animation after name is typed
    const animatedNameElement = document.getElementById('animated-name');
    const nameToAnimate = "Munna Khan";
    let nameCharIndex = 0;

    function typeName() {
        if (nameCharIndex < nameToAnimate.length) {
            animatedNameElement.textContent += nameToAnimate.charAt(nameCharIndex);
            nameCharIndex++;
            setTimeout(typeName, 100); // Typing speed for name
        } else {
            console.log('Name fully typed, starting phrase typing.');
            // Start phrase typing after name is fully typed
            setTimeout(() => type(), 500); // Small delay before starting phrases
        }
    }

    typeName();

    // Scroll Reveal Animation for general elements
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    console.log('Scroll Reveal Elements found:', scrollRevealElements);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log('Observing entry:', entry.target.id, 'isIntersecting:', entry.isIntersecting);
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                console.log('Added active class to:', entry.target.id);
                // observer.unobserve(entry.target); // Keep observing if elements can go out of view and come back
            }
        });
    }, {
        threshold: 0.5
    });

    scrollRevealElements.forEach(element => {
        observer.observe(element);
    });

    // Active navigation link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav .nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - sectionHeight / 3) { // Adjust threshold as needed
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.href.includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            window.scrollTo({
                top: targetSection.offsetTop - document.querySelector('header').offsetHeight, // Adjust for fixed header
                behavior: 'smooth'
            });
            // Close mobile menu on link click
            if (navLinksContainer.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                navLinksContainer.classList.remove('active');
            }
        });
    });

    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburgerMenu && navLinksContainer) {
        hamburgerMenu.addEventListener('click', () => {
            hamburgerMenu.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            try {
                const formId = 'movwbwae';
                const formEndpoint = `https://formspree.io/f/${formId}`;

                const response = await fetch(formEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ name, email, message }),
                });

                if (response.ok) {
                    alert('Message sent successfully!');
                    contactForm.reset(); // Clear the form
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        alert('Error: ' + data.errors.map(error => error.message).join(', '));
                    } else {
                        alert('An error occurred while sending your message. Please try again later.');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while sending your message. Please try again later.');
            }
        });
    }
});