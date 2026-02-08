document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const scrollTopButton = document.querySelector('.scroll-top');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    if (scrollTopButton) {
        window.addEventListener('scroll', () => {
            scrollTopButton.classList.toggle('visible', window.scrollY > 260);
        });

        scrollTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') {
                return;
            }
            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-in');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        revealElements.forEach((element) => observer.observe(element));
    }

    const yearSpan = document.querySelector('.footer-year');
    if (yearSpan) {
        yearSpan.textContent = String(new Date().getFullYear());
    }
});