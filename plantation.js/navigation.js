// Navigation module for Vanrakshak

// Setup navigation and mobile menu functionality
export function setupNavigation() {
  // Mobile menu toggle
  setupMobileMenu();
  
  // Smooth scrolling for navigation links
  setupSmoothScrolling();
  
  // Active link highlighting
  setupActiveLinks();
}

// Setup mobile menu toggle
function setupMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (!menuToggle || !mainNav) return;
  
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mainNav.classList.contains('active') && 
        !mainNav.contains(e.target) && 
        !menuToggle.contains(e.target)) {
      mainNav.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  });
  
  // Close menu when link is clicked
  const navLinks = mainNav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;
      
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

// Setup active link highlighting
function setupActiveLinks() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.main-nav a');
  
  // Add scroll event listener
  window.addEventListener('scroll', () => {
    let current = '';
    const headerHeight = document.querySelector('.header').offsetHeight;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;
      
      if (window.pageYOffset >= sectionTop) {
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
  
  // Check active section on page load
  setTimeout(() => {
    window.dispatchEvent(new Event('scroll'));
  }, 500);
}

// Header scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  
  if (window.scrollY > 50) {
    header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    header.style.background = 'rgba(255, 255, 255, 0.98)';
  } else {
    header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
    header.style.background = 'rgba(255, 255, 255, 0.95)';
  }
});