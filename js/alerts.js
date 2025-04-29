// Alerts handling JavaScript

// DOM Elements
const alertsList = document.getElementById('alerts-list');
const alertFilter = document.getElementById('alert-filter');
const alertSearch = document.getElementById('alert-search');

// Alerts data
let alerts = [];

// Initialize alerts when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    generateMockAlerts();
    setupAlertEvents();
    renderAlerts();
});

// Set up event listeners for alert controls
function setupAlertEvents() {
    if (alertFilter) {
        alertFilter.addEventListener('change', filterAlerts);
    }
    
    if (alertSearch) {
        alertSearch.addEventListener('input', filterAlerts);
    }
}

// Generate mock alerts for demonstration
function generateMockAlerts() {
    const mockAlerts = [
        {
            id: 1,
            title: 'Critical Temperature in Himalayan Pine Forest',
            description: 'Temperature exceeding 48°C detected in the northern sector of Himalayan Pine Forest.',
            temperature: 48,
            location: 'Himalayan Pine Forest, Sector B',
            coordinates: [31.2, 77.8],
            timestamp: new Date(Date.now() - 35 * 60000), // 35 minutes ago
            priority: 'high',
            status: 'active'
        },
        {
            id: 2,
            title: 'Temperature Spike in Western Ghats',
            description: 'Sudden increase in temperature detected in the western section of the Western Ghats Forest.',
            temperature: 42,
            location: 'Western Ghats Forest, Zone W3',
            coordinates: [14.1, 74.8],
            timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
            priority: 'medium',
            status: 'active'
        },
        {
            id: 3,
            title: 'Persistent High Temperature in Central Forest',
            description: 'Temperature consistently above normal levels in Central Indian Forest for the past 24 hours.',
            temperature: 39,
            location: 'Central Indian Forest, Area C2',
            coordinates: [22.1, 77.3],
            timestamp: new Date(Date.now() - 6 * 60 * 60000), // 6 hours ago
            priority: 'medium',
            status: 'active'
        },
        {
            id: 4,
            title: 'Temperature normal in Eastern Ghats',
            description: 'Unusual temperature pattern detected in the eastern section of the Eastern Ghats Forest.',
            temperature: 38,
            location: 'Eastern Ghats Forest, Section E4',
            coordinates: [17.2, 82.1],
            timestamp: new Date(Date.now() - 10 * 60 * 60000), // 10 hours ago
            priority: 'low',
            status: 'active'
        },
        {
            id: 5,
            title: 'Elevated Temperature in Satpura Range',
            description: 'Temperature moderately above seasonal average in Satpura-Maikal Forest.',
            temperature: 36,
            location: 'Satpura-Maikal Forest, Block S2',
            coordinates: [22.4, 81.7],
            timestamp: new Date(Date.now() - 14 * 60 * 60000), // 14 hours ago
            priority: 'low',
            status: 'active'
        },
        {
            id: 6,
            title: 'Temperature Normalized in Northern Region',
            description: 'Previously elevated temperature has returned to normal levels in Northern Deciduous Forest.',
            temperature: 29,
            location: 'Northern Deciduous Forest, Area N1',
            coordinates: [28.5, 77.2],
            timestamp: new Date(Date.now() - 18 * 60 * 60000), // 18 hours ago
            priority: 'low',
            status: 'resolved'
        }
    ];
    
    alerts = mockAlerts;
}

// Render alerts to the alerts list
function renderAlerts(filteredAlerts = null) {
    if (!alertsList) return;
    
    // Clear current alerts
    alertsList.innerHTML = '';
    
    // Use filtered alerts if provided, otherwise use all alerts
    const alertsToRender = filteredAlerts || alerts;
    
    // Check if there are any alerts to display
    if (alertsToRender.length === 0) {
        alertsList.innerHTML = `
            <div class="empty-alerts">
                <p>No alerts match your criteria.</p>
            </div>
        `;
        return;
    }
    
    // Render each alert
    alertsToRender.forEach(alert => {
        const alertElement = createAlertElement(alert);
        alertsList.appendChild(alertElement);
    });
    
    // Add event listeners to the alert buttons
    addAlertButtonListeners();
}

// Create a single alert element
function createAlertElement(alert) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert-item ${alert.priority}`;
    alertDiv.dataset.alertId = alert.id;
    
    // Format the timestamp
    const timeAgo = formatTimeAgo(alert.timestamp);
    
    alertDiv.innerHTML = `
        <div class="alert-icon">
            ${getAlertIcon(alert.priority)}
        </div>
        <div class="alert-content">
            <div class="alert-header">
                <h4 class="alert-title">${alert.title}</h4>
                <span class="alert-time">${timeAgo}</span>
            </div>
            <p class="alert-desc">${alert.description}</p>
            <div class="alert-meta">
                <div class="alert-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"></path><path d="M12 3v1.2"></path><path d="M12 19.8V21"></path><path d="M18.4 5.6l-.85.85"></path><path d="M6.45 17.55l-.85.85"></path><path d="M3 12h1.2"></path><path d="M19.8 12H21"></path><path d="M5.6 5.6l.85.85"></path><path d="M17.55 17.55l.85.85"></path></svg>
                    <span class="alert-temp">${alert.temperature}°C</span>
                </div>
                <div class="alert-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span>${alert.location}</span>
                </div>
            </div>
        </div>
        <div class="alert-actions">
            <button class="alert-view-btn" data-alert-id="${alert.id}">View on Map</button>
            ${alert.status === 'active' ? `<button class="alert-dismiss-btn" data-alert-id="${alert.id}">Dismiss</button>` : ''}
        </div>
    `;
    
    return alertDiv;
}

// Filter alerts based on user criteria
function filterAlerts() {
    if (!alertFilter || !alertSearch) return;
    
    const filterValue = alertFilter.value;
    const searchValue = alertSearch.value.toLowerCase();
    
    let filteredAlerts = [...alerts];
    
    // Filter by priority
    if (filterValue !== 'all') {
        filteredAlerts = filteredAlerts.filter(alert => alert.priority === filterValue);
    }
    
    // Filter by search term
    if (searchValue) {
        filteredAlerts = filteredAlerts.filter(alert => 
            alert.title.toLowerCase().includes(searchValue) ||
            alert.description.toLowerCase().includes(searchValue) ||
            alert.location.toLowerCase().includes(searchValue)
        );
    }
    
    // Render filtered alerts
    renderAlerts(filteredAlerts);
}

// Add event listeners to alert buttons
function addAlertButtonListeners() {
    // View on map buttons
    const viewButtons = document.querySelectorAll('.alert-view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const alertId = parseInt(this.dataset.alertId);
            viewAlertOnMap(alertId);
        });
    });
    
    // Dismiss buttons
    const dismissButtons = document.querySelectorAll('.alert-dismiss-btn');
    dismissButtons.forEach(button => {
        button.addEventListener('click', function() {
            const alertId = parseInt(this.dataset.alertId);
            dismissAlert(alertId);
        });
    });
}

// Handle view on map button click
function viewAlertOnMap(alertId) {
    const alert = alerts.find(a => a.id === alertId);
    
    if (alert && alert.coordinates) {
        // Scroll to map section
        const mapSection = document.getElementById('map-section');
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth' });
            
            // Wait for scroll to complete
            setTimeout(() => {
                // Use external map API if available
                if (window.map) {
                    window.map.setView(alert.coordinates, 10);
                    
                    // Create a temporary highlight
                    const highlightCircle = L.circle(alert.coordinates, {
                        color: '#e74c3c',
                        fillColor: '#e74c3c',
                        fillOpacity: 0.2,
                        radius: 20000, // 20km radius
                        className: 'highlight-pulse'
                    }).addTo(window.map);
                    
                    // Remove the highlight after 10 seconds
                    setTimeout(() => {
                        window.map.removeLayer(highlightCircle);
                    }, 10000);
                }
            }, 500);
        }
    }
}

// Handle dismiss button click
function dismissAlert(alertId) {
    // Find the alert
    const alert = alerts.find(a => a.id === alertId);
    
    if (alert) {
        // Mark as resolved
        alert.status = 'resolved';
        
        // Remove from DOM
        const alertElement = document.querySelector(`.alert-item[data-alert-id="${alertId}"]`);
        if (alertElement) {
            alertElement.classList.add('dismissing');
            
            // Add CSS for animation if not already added
            if (!document.getElementById('alert-dismiss-style')) {
                const style = document.createElement('style');
                style.id = 'alert-dismiss-style';
                style.textContent = `
                    .alert-item.dismissing {
                        animation: alert-dismiss 0.5s forwards;
                    }
                    
                    @keyframes alert-dismiss {
                        0% {
                            opacity: 1;
                            transform: translateX(0);
                        }
                        100% {
                            opacity: 0;
                            transform: translateX(100%);
                            height: 0;
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Remove after animation
            setTimeout(() => {
                alertElement.remove();
                
                // Show notification
                if (window.showNotification) {
                    window.showNotification(`Alert "${alert.title}" has been dismissed.`, 'success');
                }
            }, 500);
        }
    }
}

// Get SVG icon based on alert priority
function getAlertIcon(priority) {
    switch(priority) {
        case 'high':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path><path d="M12 8v4"></path><path d="M12 16h.01"></path></svg>`;
        case 'medium':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
        case 'low':
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        default:
            return `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    }
}

// Format time ago from timestamp
function formatTimeAgo(timestamp) {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
        return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
        return 'Just now';
    }
}
