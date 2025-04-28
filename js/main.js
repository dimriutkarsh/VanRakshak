// Main JavaScript file

// DOM Elements
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const header = document.getElementById('main-header');
const subscribeForm = document.getElementById('subscribe-form');
const alertPopup = document.getElementById('alert-popup');
const closeAlertBtn = document.getElementById('close-alert');
const viewOnMapBtn = document.getElementById('view-on-map-btn');
const dismissAlertBtn = document.getElementById('dismiss-alert-btn');
const viewMapBtn = document.querySelector('.hero-cta .primary');
const learnMoreBtn = document.querySelector('.hero-cta .secondary');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

// Main initialization function
function initApp() {
    setupEventListeners();
    setupScrollEffects();
    checkAndShowRandomAlert();
    
    // For testing purposes, show a welcome message
    console.log('VanRakshak Forest Fire Detection Platform initialized');
}

// Set up event listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Handle form submissions
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', handleSubscribe);
    }
    
    // Alert popup actions
    if (closeAlertBtn) {
        closeAlertBtn.addEventListener('click', closeAlertPopup);
    }
    
    if (viewOnMapBtn) {
        viewOnMapBtn.addEventListener('click', viewAlertOnMap);
    }
    
    if (dismissAlertBtn) {
        dismissAlertBtn.addEventListener('click', closeAlertPopup);
    }
    
    // Navigation buttons
    if (viewMapBtn) {
        viewMapBtn.addEventListener('click', scrollToMap);
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', scrollToAbout);
    }
    
    // Handle document clicks to close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navMenu && navMenu.classList.contains('active') && !event.target.closest('nav') && event.target !== menuToggle) {
            navMenu.classList.remove('active');
        }
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

// Handle subscription form submission
function handleSubscribe(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification('Thank you for subscribing! You will now receive forest fire alerts.');
        event.target.reset();
    }
}

// Show a notification message
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to the DOM
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Handle header style changes on scroll
function setupScrollEffects() {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Trigger initial check
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    }
}

// Simulate random fire alerts
function checkAndShowRandomAlert() {
    // Only show random alerts 30% of the time to avoid annoying the user
    if (Math.random() > 0.7) {
        setTimeout(() => {
            showFireAlert();
        }, 15000); // Show after 15 seconds
    }
}

// Show a fire alert popup
function showFireAlert() {
    // Update alert details
    const alertMessage = document.getElementById('alert-message');
    const alertLocation = document.getElementById('alert-location');
    const alertTime = document.getElementById('alert-time');
    const alertRisk = document.getElementById('alert-risk');
    
    // Sample data (in a real app, this would come from the backend)
    const alertData = getRandomAlertData();
    
    if (alertMessage) alertMessage.textContent = alertData.message;
    if (alertLocation) alertLocation.textContent = alertData.location;
    if (alertTime) alertTime.textContent = alertData.time;
    
    if (alertRisk) {
        alertRisk.textContent = alertData.risk;
        alertRisk.className = `detail-value ${alertData.riskClass}`;
    }
    
    // Show the popup
    if (alertPopup) {
        alertPopup.classList.add('active');
    }
}

// Close the alert popup
function closeAlertPopup() {
    if (alertPopup) {
        alertPopup.classList.remove('active');
    }
}

// Handle view on map button click
function viewAlertOnMap() {
    closeAlertPopup();
    scrollToMap();
    
    // Highlight the area on the map (this would be handled by the map.js file)
    if (window.highlightAlertArea) {
        window.highlightAlertArea();
    }
}

// Generate random alert data for demonstration
function getRandomAlertData() {
    const locations = [
        'Himalayan Pine Forest, Sector B',
        'Central Deciduous Forest, Zone C4',
        'Western Ghats Rainforest, Area G2',
        'Eastern Evergreen Forest, Region E'
    ];
    
    const temperatures = [38, 41, 43, 47, 52];
    const risks = ['Low', 'Medium', 'High'];
    const riskClasses = ['low-risk', 'medium-risk', 'high-risk'];
    
    const riskIndex = Math.floor(Math.random() * risks.length);
    const location = locations[Math.floor(Math.random() * locations.length)];
    const temp = temperatures[Math.floor(Math.random() * temperatures.length)];
    
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    
    return {
        message: `High temperature detected in forest area. Temperature: ${temp}°C`,
        location: location,
        time: formattedDate,
        risk: risks[riskIndex],
        riskClass: riskClasses[riskIndex]
    };
}

// Scroll to map section
function scrollToMap() {
    const mapSection = document.getElementById('map-section');
    if (mapSection) {
        mapSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Scroll to about section
function scrollToAbout() {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add a CSS class for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: white;
        color: var(--neutral-800);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transform: translateY(100px);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.success {
        border-left: 4px solid #2ecc71;
    }
    
    .notification.error {
        border-left: 4px solid #e74c3c;
    }
    
    .notification.warning {
        border-left: 4px solid #f39c12;
    }
`;
document.head.appendChild(style);