// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initAdminDashboard();
});

function initAdminDashboard() {
    setupAlertForm();
    setupTreeRequestForm();
    loadDashboardStats();
}

// Alert Form Handling
function setupAlertForm() {
    const alertForm = document.getElementById('alert-form');
    if (!alertForm) return;
    
    alertForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(alertForm);
        const alertData = {
            title: formData.get('title'),
            description: formData.get('description'),
            location: formData.get('location'),
            priority: formData.get('priority'),
            temperature: formData.get('temperature')
        };
        
        // In a real app, this would send to a backend
        console.log('Sending alert:', alertData);
        
        // Show success message
        showNotification('Alert has been sent successfully!', 'success');
        
        // Reset form
        alertForm.reset();
    });
}

// Tree Request Form Handling
function setupTreeRequestForm() {
    const treeForm = document.getElementById('tree-request-form');
    if (!treeForm) return;
    
    treeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(treeForm);
        const requestData = {
            location: formData.get('location'),
            trees: formData.get('trees'),
            type: formData.get('type'),
            date: formData.get('date')
        };
        
        // In a real app, this would send to a backend
        console.log('Tree planting request:', requestData);
        
        // Show success message
        showNotification('Your tree planting request has been submitted!', 'success');
        
        // Reset form
        treeForm.reset();
    });
}

// Load Dashboard Statistics
function loadDashboardStats() {
    // In a real app, this would fetch from a backend
    const mockStats = {
        totalAlerts: 156,
        activeAlerts: 12,
        treesLost: 2500,
        treesPlanted: 1800,
        pendingRequests: 45,
        completedRequests: 89
    };
    
    updateDashboardStats(mockStats);
}

// Update Dashboard Statistics
function updateDashboardStats(stats) {
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(`stat-${key}`);
        if (element) {
            element.textContent = stats[key].toLocaleString();
        }
    });
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}