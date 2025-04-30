/**
 * VanRakshak Contribute Page JavaScript
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the tree request form
    initTreeRequestForm();
    
    // Set default value for number of trees
    const treesInput = document.getElementById('number-of-trees');
    if (treesInput) {
      treesInput.value = '10';
    }
  });
  
  /**
   * Initialize the tree request form
   */
  function initTreeRequestForm() {
    const form = document.getElementById('tree-request-form');
    
    if (form) {
      // Add form submission handler
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Validate form
        if (validateForm()) {
          // Show success message
          showNotification('Your tree planting request has been submitted successfully! 🌱', 'success');
          
          // Reset form after submission
          setTimeout(() => {
            form.reset();
            const treesInput = document.getElementById('number-of-trees');
            if (treesInput) {
              treesInput.value = '10';
            }
          }, 2000);
        } else {
          // Show error message
          showNotification('Please fill in all required fields correctly.', 'error');
        }
      });
      
      // Add date input validation
      const dateInput = document.getElementById('planting-date');
      if (dateInput) {
        // Set minimum date to today
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        dateInput.min = formattedDate;
        
        // Set a default date (2 weeks from now)
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(today.getDate() + 14);
        const formattedDefaultDate = twoWeeksLater.toISOString().split('T')[0];
        dateInput.value = formattedDefaultDate;
      }
    }
  }
  
  /**
   * Show notification message
   */
  function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
      existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.className = 'notification-content';
    messageContainer.textContent = message;
    
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'notification-progress';
    
    // Add elements to notification
    notification.appendChild(messageContainer);
    notification.appendChild(progressBar);
    
    // Add to document
    document.body.appendChild(notification);
    
    // Start progress bar animation
    requestAnimationFrame(() => {
      progressBar.style.transition = 'transform 5s linear';
      progressBar.style.transform = 'scaleX(0)';
    });
    
    // Remove notification after delay
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }
  
  /**
   * Validate the form
   */
  function validateForm() {
    let isValid = true;
    const location = document.getElementById('planting-location');
    const trees = document.getElementById('number-of-trees');
    const treeType = document.getElementById('tree-type');
    const date = document.getElementById('planting-date');
    
    // Reset previous error states
    removeErrorState(location);
    removeErrorState(trees);
    removeErrorState(treeType);
    removeErrorState(date);
    
    // Validate location
    if (!location.value) {
      addErrorState(location, 'Please select a planting location');
      isValid = false;
    }
    
    // Validate number of trees
    if (!trees.value || trees.value < 1 || trees.value > 1000) {
      addErrorState(trees, 'Please enter a number between 1 and 1000');
      isValid = false;
    }
    
    // Validate tree type
    if (!treeType.value) {
      addErrorState(treeType, 'Please select a tree type');
      isValid = false;
    }
    
    // Validate date
    if (!date.value) {
      addErrorState(date, 'Please select a valid planting date');
      isValid = false;
    }
    
    return isValid;
  }
  
  /**
   * Add error state to an input
   */
  function addErrorState(element, message) {
    const formGroup = element.closest('.form-group');
    formGroup.classList.add('error');
    
    // Add error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    formGroup.appendChild(errorMessage);
  }
  
  /**
   * Remove error state from an input
   */
  function removeErrorState(element) {
    const formGroup = element.closest('.form-group');
    formGroup.classList.remove('error');
    
    // Remove any existing error messages
    const errorMessage = formGroup.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  /**
 * VanRakshak Animations JavaScript
 */

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize hover animations
    initHoverAnimations();
  });
  
  /**
   * Initialize scroll-based animations
   */
  function initScrollAnimations() {
    // Elements to animate on scroll
    const elements = document.querySelectorAll('.contribution-card, .contribution-option, .tree-request-form, .section-header');
    
    // Create IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation class based on element type
          if (entry.target.classList.contains('contribution-card')) {
            entry.target.style.animation = 'slideInUp 0.6s forwards';
          } else if (entry.target.classList.contains('contribution-option')) {
            entry.target.style.animation = 'fadeIn 0.8s forwards';
          } else if (entry.target.classList.contains('tree-request-form')) {
            entry.target.style.animation = 'slideInUp 0.8s forwards';
          } else if (entry.target.classList.contains('section-header')) {
            entry.target.style.animation = 'fadeIn 0.8s forwards';
          }
          
          // Stop observing after animation
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,  // Trigger when 10% of the element is visible
      rootMargin: '0px 0px -50px 0px'  // Trigger slightly before element comes into view
    });
    
    // Observe all elements
    elements.forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
    
    // Animate stats with delay
    const stats = document.querySelectorAll('.contribution-value');
    stats.forEach((stat, index) => {
      stat.style.opacity = '0';
      setTimeout(() => {
        stat.style.animation = 'fadeIn 0.5s forwards';
        stat.style.opacity = '1';
      }, 500 + (index * 200)); // Stagger the animations
    });
    
    // Animate form elements with delay
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
      group.style.opacity = '0';
      setTimeout(() => {
        group.style.animation = 'slideInUp 0.5s forwards';
        group.style.opacity = '1';
      }, 800 + (index * 100)); // Stagger the animations
    });
  }
  
  /**
   * Initialize hover animations and interactive elements
   */
  function initHoverAnimations() {
    // Add subtle leaf animation to buttons on hover
    const buttons = document.querySelectorAll('.cta-button');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        // Create and append leaves
        for (let i = 0; i < 3; i++) {
          createLeaf(button);
        }
      });
    });
    
    // Add ripple effect to form elements
    const formInputs = document.querySelectorAll('input, select');
    
    formInputs.forEach(input => {
      input.addEventListener('focus', function() {
        addRippleEffect(this);
      });
    });
  }
  
  /**
   * Create a decorative leaf element
   */
  function createLeaf(parent) {
    const leaf = document.createElement('span');
    leaf.className = 'decorative-leaf';
    
    // Random positioning
    const size = Math.random() * 10 + 5; // 5-15px
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const rotation = Math.random() * 360;
    const duration = Math.random() * 1 + 1; // 1-2s
    
    // Style the leaf
    leaf.style.position = 'absolute';
    leaf.style.width = `${size}px`;
    leaf.style.height = `${size}px`;
    leaf.style.backgroundColor = 'rgba(76, 175, 80, 0.3)';
    leaf.style.borderRadius = '50% 0 50% 50%';
    leaf.style.transform = `rotate(${rotation}deg)`;
    leaf.style.left = `${posX}%`;
    leaf.style.top = `${posY}%`;
    leaf.style.opacity = '0';
    leaf.style.zIndex = '0';
    
    // Add to parent
    parent.style.position = 'relative';
    parent.style.overflow = 'hidden';
    parent.appendChild(leaf);
    
    // Animate the leaf
    setTimeout(() => {
      leaf.style.transition = `all ${duration}s ease-out`;
      leaf.style.opacity = '0.5';
      leaf.style.transform = `rotate(${rotation + 20}deg) translate(10px, -20px)`;
      
      // Remove leaf after animation
      setTimeout(() => {
        leaf.style.opacity = '0';
        setTimeout(() => leaf.remove(), 300);
      }, duration * 1000);
    }, 10);
  }
  
  /**
   * Add ripple effect to form elements
   */
  function addRippleEffect(element) {
    const ripple = document.createElement('span');
    ripple.className = 'input-ripple';
    
    // Style the ripple
    ripple.style.position = 'absolute';
    ripple.style.width = '5px';
    ripple.style.height = '5px';
    ripple.style.background = 'rgba(44, 94, 26, 0.2)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(1)';
    ripple.style.opacity = '1';
    
    // Position at bottom of input
    ripple.style.bottom = '0';
    ripple.style.left = '50%';
    
    // Add to parent
    const parent = element.parentNode;
    parent.style.position = 'relative';
    parent.style.overflow = 'hidden';
    parent.appendChild(ripple);
    
    // Animate the ripple
    setTimeout(() => {
      ripple.style.transition = 'all 0.6s ease-out';
      ripple.style.transform = 'scale(100)';
      ripple.style.opacity = '0';
      
      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    }, 10);
  }