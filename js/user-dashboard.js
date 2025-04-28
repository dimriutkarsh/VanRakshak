// User Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initUserDashboard();
});

function initUserDashboard() {
    const user = checkAuthStatus();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Update user name
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = user.name;
    }

    loadRecentAlerts();
    loadUserContributions();
}

function loadRecentAlerts() {
    const alertsContainer = document.getElementById('recent-alerts');
    if (!alertsContainer) return;

    // Mock alerts data
    const alerts = [
        {
            title: 'High Temperature Alert',
            location: 'Himalayan Pine Forest',
            temperature: '42°C',
            time: '2 hours ago',
            priority: 'high'
        },
        {
            title: 'Temperature Warning',
            location: 'Western Ghats',
            temperature: '38°C',
            time: '4 hours ago',
            priority: 'medium'
        },
        {
            title: 'Monitoring Notice',
            location: 'Central Forest',
            temperature: '35°C',
            time: '6 hours ago',
            priority: 'low'
        }
    ];

    alertsContainer.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.priority}">
            <div class="alert-header">
                <h4>${alert.title}</h4>
                <span class="alert-time">${alert.time}</span>
            </div>
            <div class="alert-details">
                <span class="location">${alert.location}</span>
                <span class="temperature">${alert.temperature}</span>
            </div>
        </div>
    `).join('');
}

function loadUserContributions() {
    const contributionsContainer = document.getElementById('user-contributions');
    if (!contributionsContainer) return;

    // Mock contributions data
    const contributions = [
        {
            type: 'Tree Planting',
            details: '5 Trees in Himalayan Region',
            date: 'May 15, 2025',
            status: 'completed'
        },
        {
            type: 'Donation',
            details: '₹1,000 for Forest Recovery',
            date: 'May 10, 2025',
            status: 'completed'
        },
        {
            type: 'Tree Planting',
            details: '7 Trees in Western Ghats',
            date: 'May 5, 2025',
            status: 'pending'
        }
    ];

    contributionsContainer.innerHTML = contributions.map(contribution => `
        <div class="contribution-item">
            <div class="contribution-header">
                <h4>${contribution.type}</h4>
                <span class="status ${contribution.status}">${contribution.status}</span>
            </div>
            <div class="contribution-details">
                <p>${contribution.details}</p>
                <span class="date">${contribution.date}</span>
            </div>
        </div>
    `).join('');
}