// DoorLah Website - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
        });
    });
    
    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
        
        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        if (window.pageYOffset > 50) {
            navbar.style.background = 'rgba(10, 22, 40, 0.98)';
            navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.background = 'rgba(10, 22, 40, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Newsletter Form Handler
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Basic email validation
            if (validateEmail(email)) {
                // Show success message
                showNotification('Thank you! We\'ll notify you when DoorLah launches.', 'success');
                emailInput.value = '';
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
    
    // Email Validation Function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Notification System
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">
                    ${type === 'success' ? '✓' : '⚠'}
                </span>
                <span class="notification-message">${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: ${type === 'success' ? '#10B981' : '#EF4444'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            font-family: 'Poppins', sans-serif;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }
    
    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards and sections
    const animatedElements = document.querySelectorAll(
        '.feature-card, .step-card, .performance-card, .community-type, .feature-detail'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
    
    // Parallax Effect for Gradient Blobs
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const blobs = document.querySelectorAll('.gradient-blob');
        
        blobs.forEach((blob, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = -(scrolled * speed);
            blob.style.transform = `translate(-50%, calc(-50% + ${yPos}px))`;
        });
    });
    
    // Add hover effect to store badges
    const storeBadges = document.querySelectorAll('.store-badge-wrapper');
    
    storeBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Feature Card Tilt Effect (Optional Enhancement)
    const featureCards = document.querySelectorAll('.feature-card, .performance-card, .community-type');
    
    featureCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
    
    // Dynamic year in footer
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
    }
    
    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-icon {
            font-size: 1.25rem;
            font-weight: bold;
        }
        
        .notification-message {
            font-size: 0.95rem;
        }
    `;
    document.head.appendChild(style);
    
    // Prevent form submission on social links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Social media links coming soon!', 'success');
        });
    });
    
    // Loading animation for images (exclude logos and UI images)
    const images = document.querySelectorAll('img:not(.logo):not(.footer-logo):not(.store-badge):not(.store-badge-large)');
    images.forEach(img => {
        // Set initial opacity
        img.style.opacity = '0';
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transition = 'opacity 0.5s ease-in';
        });
        
        // Handle already loaded images
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
    
    // Counter animation for performance stats
    function animateCounter(element, target, duration = 2000) {
        let current = 0;
        const increment = target / (duration / 16); // 60fps
        const isPercentage = element.textContent.includes('%');
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (isPercentage ? '%' : '');
        }, 16);
    }
    
    // Observe performance stats for counter animation
    const performanceStats = document.querySelectorAll('.performance-stat');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                const text = entry.target.textContent.trim();
                const number = parseInt(text);
                if (!isNaN(number)) {
                    entry.target.textContent = '0' + (text.includes('%') ? '%' : '');
                    animateCounter(entry.target, number);
                }
            }
        });
    }, { threshold: 0.5 });
    
    performanceStats.forEach(stat => {
        if (stat.textContent.trim().match(/^\d+%?$/)) {
            statsObserver.observe(stat);
        }
    });
    
    console.log('🏠 DoorLah website loaded successfully!');
});