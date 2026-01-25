/**
 * Tom Turner Portfolio - Main JavaScript
 * Handles animations, navigation, and interactivity
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroTitle = document.getElementById('heroTitle');
    const matrixRain = document.getElementById('matrixRain');
    const contactForm = document.getElementById('contactForm');
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    const skillBars = document.querySelectorAll('.skill-progress');
    const sections = document.querySelectorAll('.section');

    // ============================================
    // Configuration
    // ============================================
    const config = {
        typingSpeed: 80,
        typingDeleteSpeed: 40,
        typingPauseTime: 2000,
        roles: [
            'Cyber Officer, U.S. Air Force',
            'IT Operations',
            'Security Professional',
            'Team Leader',
            'Problem Solver'
        ]
    };

    // ============================================
    // Utility Functions
    // ============================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function isInViewport(element, offset = 0) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= 0
        );
    }

    // ============================================
    // Navigation
    // ============================================
    function initNavigation() {
        // Scroll behavior
        const handleScroll = debounce(() => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Update active nav link
            updateActiveNavLink();
        }, 10);

        window.addEventListener('scroll', handleScroll);

        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Smooth scroll for nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        const offsetTop = target.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ============================================
    // Typing Animation
    // ============================================
    function initTypingAnimation() {
        if (!heroTitle) return;

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentRole = '';

        function type() {
            currentRole = config.roles[roleIndex];

            if (isDeleting) {
                heroTitle.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
            } else {
                heroTitle.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? config.typingDeleteSpeed : config.typingSpeed;

            if (!isDeleting && charIndex === currentRole.length) {
                typeSpeed = config.typingPauseTime;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % config.roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing animation
        setTimeout(type, 1000);
    }

    // ============================================
    // Matrix Rain Effect
    // ============================================
    function initMatrixRain() {
        if (!matrixRain) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        matrixRain.appendChild(canvas);

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', debounce(resize, 100));

        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const charArray = chars.split('');
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * -100);
        }

        function draw() {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = charArray[Math.floor(Math.random() * charArray.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(char, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(draw, 50);
    }

    // ============================================
    // Stats Counter Animation
    // ============================================
    function initStatsCounter() {
        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    element.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            };

            updateCounter();
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    }

    // ============================================
    // Skills Bar Animation
    // ============================================
    function initSkillBars() {
        const animateSkillBar = (element) => {
            const progress = element.getAttribute('data-progress');
            element.style.width = `${progress}%`;
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => observer.observe(bar));
    }

    // ============================================
    // Scroll Reveal Animation
    // ============================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.timeline-item, .skill-category, .project-card, .education-card, .cert-card'
        );

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    // ============================================
    // Contact Form
    // ============================================
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;

            // Show loading state
            submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual endpoint)
            // For now, we'll just simulate a delay and show success
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success state
            submitBtn.innerHTML = '<span class="btn-text">Message Sent!</span>';
            submitBtn.style.background = '#27ca40';

            // Reset form
            contactForm.reset();

            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);

            // Note: In production, you would integrate with a service like:
            // - Formspree (https://formspree.io)
            // - Netlify Forms
            // - EmailJS
            // - Your own backend endpoint
        });
    }

    // ============================================
    // Current Year for Footer
    // ============================================
    function setCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // ============================================
    // Keyboard Navigation
    // ============================================
    function initKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            // ESC to close mobile menu
            if (e.key === 'Escape') {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ============================================
    // Initialize Everything
    // ============================================
    function init() {
        initNavigation();
        initTypingAnimation();
        initMatrixRain();
        initStatsCounter();
        initSkillBars();
        initScrollReveal();
        initContactForm();
        setCurrentYear();
        initKeyboardNav();

        // Log welcome message for devtools
        console.log('%c Welcome to Tom Turner\'s Portfolio! ',
            'background: #00ff41; color: #0a0a0f; font-size: 14px; font-weight: bold; padding: 10px;');
        console.log('%c Try pressing Ctrl + ` for a surprise... ',
            'color: #00d4ff; font-size: 12px;');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
