// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initTypingAnimation();
    initContactForm();
    initSmoothScrolling();
    initScrollProgress();
    initParallaxEffects();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Special animations for specific elements
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillTags(entry.target);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    animateProjectCard(entry.target);
                }
                
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target);
                }
                
                // Special handling for stat cards with staggered animation
                if (entry.target.classList.contains('stat-card')) {
                    const statCards = document.querySelectorAll('.stat-card');
                    statCards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate');
                        }, index * 200);
                    });
                }
                
                // Special handling for timeline items with staggered animation
                if (entry.target.classList.contains('timeline-item')) {
                    const timelineItems = document.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate');
                        }, index * 300);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.skill-category, .project-card, .timeline-item, .stat-item, .contact-info, .contact-form, .blog-card, .stat-card'
    );
    
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
    
    // Counter animation for statistics
    function animateStatCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (target === 70 ? '%' : target === 99.9 ? '%' : '+');
                clearInterval(timer);
            } else {
                if (target === 99.9) {
                    element.textContent = start.toFixed(1) + '%';
                } else if (target === 70) {
                    element.textContent = Math.floor(start) + '%';
                } else {
                    element.textContent = Math.floor(start) + '+';
                }
            }
        }, 16);
    }
    
    // Trigger counter animations when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-info h3');
                const targets = [50, 70, 99.9, 25];
                
                statNumbers.forEach((stat, index) => {
                    setTimeout(() => {
                        animateStatCounter(stat, targets[index], 2000);
                    }, index * 200);
                });
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const experienceStats = document.querySelector('.experience-stats');
    if (experienceStats) {
        statsObserver.observe(experienceStats);
    }
}

// Animate skill tags
function animateSkillTags(skillCategory) {
    const tags = skillCategory.querySelectorAll('.skill-tag');
    tags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.animation = 'fadeInUp 0.5s ease-out forwards';
            tag.style.animationDelay = `${index * 0.1}s`;
        }, 200);
    });
}

// Animate project cards
function animateProjectCard(card) {
    card.style.animation = 'fadeInUp 0.6s ease-out forwards';
    
    const techTags = card.querySelectorAll('.project-tech span');
    techTags.forEach((tag, index) => {
        setTimeout(() => {
            tag.style.transform = 'scale(1.05)';
            setTimeout(() => {
                tag.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

// Animate counters
function animateCounter(statItem) {
    const numberElement = statItem.querySelector('.stat-number');
    const finalNumber = numberElement.textContent;
    
    // Extract numeric value
    const numericValue = parseFloat(finalNumber.replace(/[^0-9.]/g, ''));
    const suffix = finalNumber.replace(/[0-9.]/g, '');
    
    if (!isNaN(numericValue)) {
        let currentNumber = 0;
        const increment = numericValue / 50;
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= numericValue) {
                currentNumber = numericValue;
                clearInterval(timer);
            }
            
            if (suffix.includes('%')) {
                numberElement.textContent = currentNumber.toFixed(2) + '%';
            } else if (suffix.includes('+')) {
                numberElement.textContent = Math.floor(currentNumber) + '+';
            } else {
                numberElement.textContent = currentNumber.toFixed(2) + suffix;
            }
        }, 50);
    }
}

// Typing animation for terminal
function initTypingAnimation() {
    const commands = [
        'kubectl get pods --all-namespaces',
        'docker ps -a',
        'terraform plan',
        'ansible-playbook deploy.yml',
        'prometheus --config.file=prometheus.yml',
        'helm install app ./chart'
    ];
    
    const commandElement = document.querySelector('.typing-animation');
    let commandIndex = 0;
    
    function typeCommand() {
        const currentCommand = commands[commandIndex];
        let charIndex = 0;
        
        commandElement.textContent = '';
        
        const typeInterval = setInterval(() => {
            if (charIndex < currentCommand.length) {
                commandElement.textContent += currentCommand.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                setTimeout(() => {
                    commandIndex = (commandIndex + 1) % commands.length;
                    typeCommand();
                }, 2000);
            }
        }, 100);
    }
    
    // Start typing animation after a delay
    setTimeout(typeCommand, 1000);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    // Character counter for message textarea
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const currentLength = this.value.length;
            const maxLength = 1000;
            charCount.textContent = currentLength;
            
            if (currentLength > maxLength) {
                charCount.style.color = '#ff6b6b';
                this.style.borderColor = '#ff6b6b';
            } else if (currentLength > maxLength * 0.8) {
                charCount.style.color = '#ffd93d';
                this.style.borderColor = '#ffd93d';
            } else {
                charCount.style.color = 'inherit';
                this.style.borderColor = '';
            }
        });
    }
    
    // Enhanced form validation and submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const subject = formData.get('subject')?.trim();
            const message = formData.get('message')?.trim();
            const company = formData.get('company')?.trim();
            const projectType = formData.get('project-type');
            
            // Clear previous error states
            this.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            
            let hasErrors = false;
            
            // Validation
            if (!name || name.length < 2) {
                showFieldError('name', 'Please enter a valid name (at least 2 characters)');
                hasErrors = true;
            }
            
            if (!email) {
                showFieldError('email', 'Email is required');
                hasErrors = true;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showFieldError('email', 'Please enter a valid email address');
                    hasErrors = true;
                }
            }
            
            if (!subject || subject.length < 5) {
                showFieldError('subject', 'Please enter a subject (at least 5 characters)');
                hasErrors = true;
            }
            
            if (!message || message.length < 20) {
                showFieldError('message', 'Please enter a detailed message (at least 20 characters)');
                hasErrors = true;
            }
            
            if (message && message.length > 1000) {
                showFieldError('message', 'Message is too long (maximum 1000 characters)');
                hasErrors = true;
            }
            
            if (hasErrors) {
                return;
            }
            
            // Simulate form submission with enhanced feedback
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            // Create success message
            setTimeout(() => {
                // Show success message
                showSuccessMessage(name);
                
                // Reset form
                this.reset();
                if (charCount) charCount.textContent = '0';
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
            }, 2000);
        });
    }
    
    // Helper function to show field errors
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (field) {
            const formGroup = field.closest('.form-group');
            formGroup.classList.add('error');
            
            // Remove existing error message
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Add new error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = '#ff6b6b';
            errorDiv.style.fontSize = '0.85rem';
            errorDiv.style.marginTop = '5px';
            formGroup.appendChild(errorDiv);
            
            // Focus on the field
            field.focus();
        }
    }
    
    // Helper function to show success message
    function showSuccessMessage(name) {
        // Create success notification
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h4>Message Sent Successfully!</h4>
                <p>Thank you, ${name}! I've received your message and will get back to you within 24 hours.</p>
            </div>
        `;
        
        // Style the notification
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4caf50, #45a049);
            color: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
        `;
        
        const successContent = successDiv.querySelector('.success-content');
        successContent.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 10px;
        `;
        
        const icon = successDiv.querySelector('i');
        icon.style.fontSize = '2rem';
        
        const heading = successDiv.querySelector('h4');
        heading.style.margin = '0';
        heading.style.fontSize = '1.2rem';
        
        const paragraph = successDiv.querySelector('p');
        paragraph.style.margin = '0';
        paragraph.style.fontSize = '0.95rem';
        paragraph.style.opacity = '0.9';
        
        document.body.appendChild(successDiv);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 500);
        }, 5000);
    }
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
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
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .form-group.error input,
        .form-group.error textarea,
        .form-group.error select {
            border: 2px solid #ff6b6b !important;
            background: rgba(255, 107, 107, 0.1) !important;
        }
    `;
    document.head.appendChild(style);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00d4ff' : type === 'error' ? '#ff5f57' : '#ffbd2e'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        font-size: 1rem;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.nav-menu');
                const hamburger = document.querySelector('.hamburger');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });
}

// Scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00d4ff, #0099cc);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Parallax effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.hero::before');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Utility function to debounce scroll events
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

// Add scroll event listener with debouncing
window.addEventListener('scroll', debounce(function() {
    // Additional scroll-based animations can be added here
}, 10));

// Add resize event listener
window.addEventListener('resize', function() {
    // Handle responsive adjustments
    const heroContainer = document.querySelector('.hero-container');
    if (window.innerWidth <= 768) {
        heroContainer.style.gridTemplateColumns = '1fr';
    } else {
        heroContainer.style.gridTemplateColumns = '1fr 1fr';
    }
});

// Add loading animation
window.addEventListener('load', function() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('loaded');
        }, index * 100);
    });
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Close any open notifications
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }
});

// Add focus management for accessibility
function initAccessibility() {
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #00d4ff';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
}

// Initialize accessibility features
initAccessibility();

// Add performance monitoring
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
}

logPerformance();