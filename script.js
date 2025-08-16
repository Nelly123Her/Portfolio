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
    
    // Load blog posts from Django API
    populateBlogGrid();
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

// Initialize blog integration when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Populate blog grid with Django data
    populateBlogGrid();
});

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

// Django API Configuration
const DJANGO_API_BASE = 'http://127.0.0.1:8001/api';

// API Bridge Functions
async function fetchBlogPosts() {
    try {
        const response = await fetch(`${DJANGO_API_BASE}/posts/?status=published`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.results || data;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

async function fetchBlogPost(postId) {
    try {
        const response = await fetch(`${DJANGO_API_BASE}/posts/${postId}/`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

// Function to populate blog grid with Django data
async function populateBlogGrid() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) {
        console.log('Blog grid element not found');
        return;
    }

    try {
        console.log('Fetching blog posts from Django API...');
        const posts = await fetchBlogPosts();
        console.log('Fetched posts:', posts);
        
        if (posts.length === 0) {
            console.log('No posts found, keeping static content');
            // Keep existing static content if no posts from Django
            return;
        }

        console.log('Replacing static content with Django posts');
        // Clear existing content
        blogGrid.innerHTML = '';

        // Create blog cards from Django data
        posts.forEach(post => {
            const blogCard = createBlogCard(post);
            blogGrid.appendChild(blogCard);
        });
        
        console.log('Successfully populated blog grid with', posts.length, 'posts');
    } catch (error) {
        console.error('Error populating blog grid:', error);
        // Keep existing static content on error
    }
}

// Function to create blog card element
function createBlogCard(post) {
    const article = document.createElement('article');
    article.className = 'blog-card';
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long' 
        });
    };
    
    article.innerHTML = `
        <div class="blog-header">
            <div class="blog-category">${post.category_name || 'General'}</div>
            <div class="blog-date">${formatDate(post.published_at || post.created_at)}</div>
        </div>
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">
            ${post.excerpt || post.content.substring(0, 200) + '...'}
        </p>
        <div class="blog-tags">
            ${post.tag_names.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
        </div>
        <a href="#" class="blog-link" onclick="openDjangoBlogPost(${post.id})">
            Read More <i class="fas fa-arrow-right"></i>
        </a>
    `;
    
    return article;
}

// Function to open blog post from Django
async function openDjangoBlogPost(postId) {
    const post = await fetchBlogPost(postId);
    if (!post) {
        showNotification('Error loading blog post', 'error');
        return;
    }
    
    // Update modal with Django post data
    const modal = document.getElementById('blog-modal');
    const content = document.getElementById('blog-post-content');
    
    content.innerHTML = `
        <div class="blog-post-header">
            <div class="blog-post-category">${post.category_name || 'General'}</div>
            <h1 class="blog-post-title">${post.title}</h1>
            <div class="blog-post-meta">
                <span><i class="fas fa-calendar"></i>${new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                <span><i class="fas fa-clock"></i>${post.reading_time} min read</span>
                <span><i class="fas fa-user"></i>${post.author_name}</span>
                <span><i class="fas fa-eye"></i>${post.views} views</span>
            </div>
            <div class="blog-post-tags">
                ${post.tag_names.map(tag => `<span class="blog-post-tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="blog-post-content">
            ${formatBlogContent(post.content)}
        </div>
    `;
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Function to format blog content
function formatBlogContent(content) {
    // Basic HTML formatting - you can enhance this with a markdown parser if needed
    return content
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

// Blog Modal Functions
function openBlogPost(postId) {
    const modal = document.getElementById('blog-modal');
    const content = document.getElementById('blog-post-content');
    
    // Blog post content data (fallback for static content)
    const blogPosts = {
        'zero-trust': {
            category: 'DevOps',
            title: 'Implementing Zero-Trust Architecture in Multi-Cloud Environments',
            date: 'December 15, 2024',
            readTime: '12 min read',
            author: 'Nelly B. Hernández',
            tags: ['Security', 'Multi-Cloud', 'Zero-Trust', 'AWS', 'Azure', 'DevOps'],
            content: `
                <h2>Introduction</h2>
                <p>In today's rapidly evolving digital landscape, traditional perimeter-based security models are no longer sufficient to protect organizations from sophisticated cyber threats. The concept of "never trust, always verify" has become the cornerstone of modern cybersecurity strategies, particularly in multi-cloud environments where data and applications span across multiple cloud providers.</p>
                
                <p>Zero-Trust Architecture (ZTA) represents a paradigm shift from the traditional "castle and moat" security model to a more granular, identity-centric approach. This comprehensive guide explores the implementation of Zero-Trust principles across AWS and Azure infrastructures, providing practical insights and best practices for security professionals and DevOps engineers.</p>

                <h2>Understanding Zero-Trust Architecture</h2>
                <p>Zero-Trust Architecture is built on three core principles:</p>
                <ul>
                    <li><strong>Never Trust, Always Verify:</strong> Every user, device, and application must be authenticated and authorized before accessing resources</li>
                    <li><strong>Least Privilege Access:</strong> Users and systems should only have access to the minimum resources necessary to perform their functions</li>
                    <li><strong>Assume Breach:</strong> Design systems with the assumption that threats may already be present within the network</li>
                </ul>

                <blockquote>
                    "Zero Trust is not a single technology or solution, but rather a strategic approach to cybersecurity that centers around the belief that organizations should not automatically trust anything inside or outside its perimeters."
                </blockquote>

                <h2>Multi-Cloud Security Challenges</h2>
                <p>Implementing security across multiple cloud providers introduces unique challenges:</p>
                
                <h3>Identity and Access Management Complexity</h3>
                <p>Managing identities across AWS IAM, Azure Active Directory, and potentially other identity providers requires careful orchestration and consistent policy enforcement. Each cloud provider has its own identity model, making unified access control a significant challenge.</p>
                
                <h3>Network Segmentation Across Clouds</h3>
                <p>Traditional network perimeters become blurred in multi-cloud environments. Implementing consistent network segmentation policies across AWS VPCs and Azure VNets requires sophisticated networking strategies and careful planning.</p>
                
                <h3>Data Protection and Compliance</h3>
                <p>Ensuring data protection standards and regulatory compliance across different cloud environments requires comprehensive data classification, encryption strategies, and audit capabilities.</p>

                <h2>Implementation Strategy</h2>
                
                <h3>1. Identity-Centric Security Model</h3>
                <p>The foundation of Zero-Trust implementation begins with establishing a robust identity management system:</p>
                
                <pre><code># Example: AWS IAM Policy for Zero-Trust Access
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::ACCOUNT:user/USERNAME"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::secure-bucket/*",
      "Condition": {
        "IpAddress": {
          "aws:SourceIp": "203.0.113.0/24"
        },
        "DateGreaterThan": {
          "aws:CurrentTime": "2024-01-01T00:00:00Z"
        }
      }
    }
  ]
}</code></pre>

                <h3>2. Network Micro-Segmentation</h3>
                <p>Implement granular network controls using cloud-native security groups and network access control lists:</p>
                
                <ul>
                    <li><strong>AWS Security Groups:</strong> Configure stateful firewall rules at the instance level</li>
                    <li><strong>Azure Network Security Groups:</strong> Implement subnet and network interface level filtering</li>
                    <li><strong>Application-Level Segmentation:</strong> Use service mesh technologies like Istio for microservices communication</li>
                </ul>

                <h3>3. Continuous Monitoring and Analytics</h3>
                <p>Deploy comprehensive monitoring solutions across both cloud environments:</p>
                
                <pre><code># Example: CloudWatch Log Insights Query for Security Analysis
fields @timestamp, sourceIPAddress, eventName, userIdentity.type
| filter eventName like /Assume/
| stats count() by sourceIPAddress
| sort count desc
| limit 20</code></pre>

                <h2>Best Practices and Recommendations</h2>
                
                <h3>Multi-Factor Authentication (MFA)</h3>
                <p>Implement strong MFA across all cloud accounts and services. Use hardware security keys where possible and ensure backup authentication methods are available.</p>
                
                <h3>Privileged Access Management (PAM)</h3>
                <p>Deploy just-in-time access solutions and implement break-glass procedures for emergency access scenarios. Regular access reviews and automated de-provisioning are essential.</p>
                
                <h3>Data Encryption</h3>
                <p>Implement encryption at rest and in transit across all cloud services. Use cloud-native key management services (AWS KMS, Azure Key Vault) and maintain proper key rotation policies.</p>

                <h2>Tools and Technologies</h2>
                <p>Several tools can facilitate Zero-Trust implementation in multi-cloud environments:</p>
                
                <ul>
                    <li><strong>Identity Providers:</strong> Okta, Azure AD, AWS SSO</li>
                    <li><strong>Network Security:</strong> Palo Alto Prisma, Zscaler, AWS Network Firewall</li>
                    <li><strong>Monitoring:</strong> Splunk, Datadog, AWS CloudTrail, Azure Sentinel</li>
                    <li><strong>Compliance:</strong> AWS Config, Azure Policy, Cloud Security Posture Management tools</li>
                </ul>

                <h2>Conclusion</h2>
                <p>Implementing Zero-Trust Architecture in multi-cloud environments requires a comprehensive approach that addresses identity management, network segmentation, continuous monitoring, and data protection. While the complexity of managing security across multiple cloud providers presents challenges, the benefits of a well-implemented Zero-Trust model far outweigh the initial investment.</p>
                
                <p>Success in Zero-Trust implementation depends on careful planning, gradual rollout, and continuous improvement. Organizations should start with high-value assets and gradually expand the Zero-Trust model across their entire multi-cloud infrastructure.</p>
                
                <p>As cloud technologies continue to evolve, Zero-Trust principles will remain fundamental to maintaining robust security postures in increasingly complex and distributed environments.</p>
            `
        }
    };
    
    const post = blogPosts[postId];
    if (!post) return;
    
    // Populate modal content
    content.innerHTML = `
        <div class="blog-post-header">
            <div class="blog-post-category">${post.category}</div>
            <h1 class="blog-post-title">${post.title}</h1>
            <div class="blog-post-meta">
                <span><i class="fas fa-calendar"></i>${post.date}</span>
                <span><i class="fas fa-clock"></i>${post.readTime}</span>
                <span><i class="fas fa-user"></i>${post.author}</span>
            </div>
            <div class="blog-post-tags">
                ${post.tags.map(tag => `<span class="blog-post-tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="blog-post-content">
            ${post.content}
        </div>
    `;
    
    // Show modal with animation
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeBlogPost() {
    const modal = document.getElementById('blog-modal');
    
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal when clicking outside content
document.addEventListener('click', function(e) {
    const modal = document.getElementById('blog-modal');
    if (e.target === modal) {
        closeBlogPost();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('blog-modal');
        if (modal.classList.contains('active')) {
            closeBlogPost();
        }
    }
});