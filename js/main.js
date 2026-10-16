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
    const radarScope = document.getElementById('radarScope');
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
    // Radar Scope Effect
    // ============================================
    function initRadarScope() {
        if (!radarScope) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        radarScope.appendChild(canvas);

        const green = '62, 230, 122';
        const steel = '127, 178, 217';
        const sweepSpeed = (Math.PI * 2) / 6000; // one rotation every 6 seconds
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let width = 0;
        let height = 0;
        let cx = 0;
        let cy = 0;
        let radius = 0;
        let contacts = [];

        function resize() {
            const dpr = window.devicePixelRatio || 1;
            width = radarScope.clientWidth;
            height = radarScope.clientHeight;
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            cx = width / 2;
            cy = height / 2;
            // On narrow screens let the scope spill past the sides so it shows around the card
            radius = width < 700 ? height * 0.4 : Math.min(width, height) * 0.46;
        }

        // Contacts are stored in polar form so they survive a resize
        function createContact() {
            return {
                angle: Math.random() * Math.PI * 2,
                range: 0.2 + Math.random() * 0.75,
                drift: (Math.random() - 0.5) * 0.00004,
                heading: (Math.random() - 0.5) * 0.00002
            };
        }

        for (let i = 0; i < 7; i++) {
            contacts.push(createContact());
        }

        function drawScope() {
            ctx.lineWidth = 1;

            // Range rings
            for (let i = 1; i <= 4; i++) {
                ctx.strokeStyle = `rgba(${steel}, ${i === 4 ? 0.35 : 0.18})`;
                ctx.beginPath();
                ctx.arc(cx, cy, (radius * i) / 4, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Crosshair and diagonals
            ctx.strokeStyle = `rgba(${steel}, 0.12)`;
            ctx.beginPath();
            for (let i = 0; i < 4; i++) {
                const a = (i * Math.PI) / 4;
                ctx.moveTo(cx - Math.cos(a) * radius, cy - Math.sin(a) * radius);
                ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
            }
            ctx.stroke();

            // Bearing ticks around the outer ring
            ctx.strokeStyle = `rgba(${steel}, 0.3)`;
            ctx.beginPath();
            for (let deg = 0; deg < 360; deg += 5) {
                const a = (deg * Math.PI) / 180;
                const inner = radius - (deg % 30 === 0 ? 12 : 5);
                ctx.moveTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
                ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius);
            }
            ctx.stroke();
        }

        function drawSweep(angle) {
            // Fading trail behind the sweep line
            const trail = Math.PI / 2.5;
            const steps = 40;
            for (let i = 0; i < steps; i++) {
                const a0 = angle - (trail * (i + 1)) / steps;
                const a1 = angle - (trail * i) / steps;
                ctx.fillStyle = `rgba(${green}, ${0.16 * (1 - i / steps)})`;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, radius, a0, a1 + 0.002);
                ctx.closePath();
                ctx.fill();
            }

            // Leading edge
            ctx.strokeStyle = `rgba(${green}, 0.8)`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
            ctx.stroke();
        }

        function drawContacts(angle, dt) {
            const full = Math.PI * 2;
            contacts.forEach(contact => {
                contact.angle += contact.drift * dt;
                contact.range += contact.heading * dt;
                if (contact.range < 0.15 || contact.range > 0.95) {
                    Object.assign(contact, createContact());
                }

                // Brightest just after the sweep passes, then fades out
                const since = (((angle - contact.angle) % full) + full) % full;
                const strength = Math.max(0, 1 - since / (full * 0.85));
                if (strength <= 0) return;

                const x = cx + Math.cos(contact.angle) * contact.range * radius;
                const y = cy + Math.sin(contact.angle) * contact.range * radius;

                ctx.fillStyle = `rgba(${green}, ${0.12 * strength})`;
                ctx.beginPath();
                ctx.arc(x, y, 9, 0, full);
                ctx.fill();

                ctx.fillStyle = `rgba(${green}, ${0.9 * strength})`;
                ctx.beginPath();
                ctx.arc(x, y, 2.5, 0, full);
                ctx.fill();
            });
        }

        function render(angle, dt) {
            ctx.clearRect(0, 0, width, height);
            drawScope();
            drawSweep(angle);
            drawContacts(angle, dt);
        }

        resize();
        window.addEventListener('resize', debounce(() => {
            resize();
            if (reduceMotion) render(-Math.PI / 4, 0);
        }, 100));

        // Respect reduced-motion settings with a still frame
        if (reduceMotion) {
            render(-Math.PI / 4, 0);
            return;
        }

        // Only animate while the hero is on screen
        let visible = true;
        let last = performance.now();
        let angle = -Math.PI / 2;

        function frame(now) {
            const dt = Math.min(now - last, 100);
            last = now;
            angle = (angle + sweepSpeed * dt) % (Math.PI * 2);
            render(angle, dt);
            if (visible) requestAnimationFrame(frame);
        }

        new IntersectionObserver(entries => {
            const wasVisible = visible;
            visible = entries[0].isIntersecting;
            if (visible && !wasVisible) {
                last = performance.now();
                requestAnimationFrame(frame);
            }
        }).observe(radarScope);

        requestAnimationFrame(frame);
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

            // Send the form to Web3Forms, which emails it on
            let sent = false;
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: new FormData(contactForm)
                });
                const result = await response.json();
                sent = response.ok && result.success;
            } catch (error) {
                sent = false;
            }

            if (sent) {
                // Show success state
                submitBtn.innerHTML = '<span class="btn-text">Message Sent!</span>';
                submitBtn.style.background = '#27ca40';
                contactForm.reset();
            } else {
                // Show error state, keeping what the visitor typed
                submitBtn.innerHTML = '<span class="btn-text">Failed - please try again</span>';
                submitBtn.style.background = '#ff5f56';
            }

            // Reset button after delay
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 4000);
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
        initRadarScope();
        initStatsCounter();
        initSkillBars();
        initScrollReveal();
        initContactForm();
        setCurrentYear();
        initKeyboardNav();

        // Log welcome message for devtools
        console.log('%c Welcome to Tom Turner\'s Portfolio! ',
            'background: #3ee67a; color: #0a1120; font-size: 14px; font-weight: bold; padding: 10px;');
        console.log('%c Try pressing Ctrl + ` for a surprise... ',
            'color: #7fb2d9; font-size: 12px;');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
