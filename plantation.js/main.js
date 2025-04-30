// Import modules
import { setupMap } from './map.js';
import { loadStatistics } from './statistics.js';
import { setupPlantationFinder } from './plantation.js';
import { setupNavigation } from './navigation.js';

// Initialize all modules when the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the interactive map
  setupMap();
  
  // Load and display statistics
  loadStatistics();
  
  // Setup plantation finder functionality
  setupPlantationFinder();
  
  // Setup navigation and mobile menu
  setupNavigation();
  
  // Set up scroll animations
  setupScrollAnimations();
});

// Set up scroll animations
function setupScrollAnimations() {
  const sections = document.querySelectorAll('section');
  
  // Options for the Intersection Observer
  const options = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // trigger when 10% of the element is visible
  };
  
  // Create an observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        
        // Add staggered animations to children
        const children = entry.target.querySelectorAll('.stat-card, .guide-card');
        children.forEach((child, index) => {
          child.classList.add(`fade-in-delay-${(index % 3) + 1}`);
        });
        
        // Unobserve after animating
        observer.unobserve(entry.target);
      }
    });
  }, options);
  
  // Observe each section
  sections.forEach(section => {
    observer.observe(section);
  });
}