// DOM Elements
const header = document.getElementById('header');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const scrollTopBtn = document.getElementById('scroll-to-top');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

// Variables for scroll position tracking
let lastScrollTop = 0;
let scrollDirection = '';

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Initialize scroll animations
  if (!prefersReducedMotion) {
    initScrollAnimations();
    initCustomCursor();
  } else {
    // Hide custom cursor elements for users who prefer reduced motion
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorOutline) cursorOutline.style.display = 'none';
    
    // Show all elements that might be hidden for animations
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      element.style.opacity = 1;
    });
  }

  // Initialize form submission
  initContactForm();
  
  // Set initial skill bar width to 0
  document.querySelectorAll('.skill-progress').forEach(progress => {
    const width = progress.style.width;
    progress.style.width = '0';
    progress.dataset.width = width;
  });
});

// Setup event listeners
window.addEventListener('scroll', handleScroll);
if (menuToggle) menuToggle.addEventListener('click', toggleMobileMenu);
if (scrollTopBtn) scrollTopBtn.addEventListener('click', scrollToTop);
navLinks.forEach(link => link.addEventListener('click', handleNavLinkClick));

// Handle scroll events
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Determine scroll direction
  if (scrollTop > lastScrollTop && scrollTop > 70) {
    // Scrolling down
    if (scrollDirection !== 'down') {
      scrollDirection = 'down';
      header.classList.add('hidden');
    }
  } else {
    // Scrolling up
    if (scrollDirection !== 'up') {
      scrollDirection = 'up';
      header.classList.remove('hidden');
    }
  }
  
  // Add scrolled class to header
  if (scrollTop > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  // Show/hide scroll to top button
  if (scrollTop > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
  
  // Check for elements to animate on scroll
  if (!prefersReducedMotion) {
    checkScrollAnimations();
  }
  
  lastScrollTop = scrollTop;
}

// Toggle mobile menu
function toggleMobileMenu() {
  menuToggle.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.classList.toggle('menu-open');
}

// Close mobile menu when a link is clicked
function handleNavLinkClick() {
  menuToggle.classList.remove('active');
  mobileMenu.classList.remove('active');
  document.body.classList.remove('menu-open');
}

// Scroll to top of page
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? 'auto' : 'smooth'
  });
}

// Setup scroll animations
function initScrollAnimations() {
  // Get all elements that should animate on scroll
  const elements = document.querySelectorAll('.section-heading, .project-card, .about-image, .about-text, .contact-form, .contact-info, .resume-item, .skill-item');
  
  // Add animation classes
  elements.forEach((element, index) => {
    element.classList.add('animate-on-scroll');
    
    // Add specific animation type based on element
    if (element.classList.contains('project-card')) {
      element.classList.add('animate-fade-in');
    } else if (element.classList.contains('about-image')) {
      element.classList.add('animate-fade-right');
    } else if (element.classList.contains('about-text')) {
      element.classList.add('animate-fade-left');
    } else if (element.classList.contains('contact-form')) {
      element.classList.add('animate-fade-right');
    } else if (element.classList.contains('contact-info')) {
      element.classList.add('animate-fade-left');
    } else if (element.classList.contains('resume-item')) {
      element.classList.add('animate-fade-in');
      element.classList.add(`delay-${(index % 3) * 100}`);
    } else if (element.classList.contains('skill-item')) {
      element.classList.add('animate-fade-in');
      element.classList.add(`delay-${(index % 4) * 100}`);
    } else {
      element.classList.add('animate-fade-in');
    }
  });
  
  // Check for elements already in view on page load
  checkScrollAnimations();
}

// Check which elements should be animated
function checkScrollAnimations() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  const windowHeight = window.innerHeight;
  
  elements.forEach(element => {
    const rect = element.getBoundingClientRect();
    const elementVisible = 150;
    
    if (rect.top < windowHeight - elementVisible) {
      element.classList.add('animated');
      
      // Handle skill bars
      if (element.classList.contains('skill-item')) {
        const progress = element.querySelector('.skill-progress');
        if (progress && progress.dataset.width) {
          progress.style.width = progress.dataset.width;
        }
      }
    }
  });
}

// Initialize custom cursor
function initCustomCursor() {
  if (!cursorDot || !cursorOutline) return;
  
  // Only show custom cursor on desktop devices
  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
      // Show cursor elements once they've moved
      if (cursorDot.style.opacity === '0' || cursorDot.style.opacity === '') {
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
      }
      
      // Position cursor elements
      cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      
      // Add a slight delay to the outline for a nice effect
      setTimeout(() => {
        cursorOutline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }, 50);
    });
    
    // Handle hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .tech-item, input, textarea');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorDot.style.backgroundColor = 'var(--color-accent)';
        cursorOutline.style.borderColor = 'var(--color-accent)';
      });
      
      element.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorDot.style.backgroundColor = 'var(--color-primary)';
        cursorOutline.style.borderColor = 'var(--color-primary)';
      });
    });
  } else {
    // Hide custom cursor on mobile
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
  }
}

// Handle contact form submission
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Here you would normally send the form data to a server
    // For this example, we'll just show an alert
    alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
    
    // Reset form
    contactForm.reset();
  });
}

// Handle window resize for responsive features
window.addEventListener('resize', function() {
  if (!prefersReducedMotion && window.innerWidth <= 768) {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorOutline) cursorOutline.style.display = 'none';
  } else if (!prefersReducedMotion && window.innerWidth > 768) {
    if (cursorDot) cursorDot.style.display = 'block';
    if (cursorOutline) cursorOutline.style.display = 'block';
  }
});