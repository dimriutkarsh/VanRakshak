/**
 * Main JavaScript file for Forest Reports Dashboard
 */

// Initialize the dashboard
function initDashboard() {
  // Load theme preference
  window.appUtils.loadTheme();
  
  // Set up theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', window.appUtils.toggleTheme);
  }
  
  // Initialize date pickers
  initDatePickers();
  
  // Set up refresh data button
  const refreshBtn = document.getElementById('refresh-data');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      this.classList.add('refreshing');
      setTimeout(() => {
        this.classList.remove('refreshing');
        updateDashboardStats();
        // Refresh notification
        showNotification('Data refreshed successfully', 'success');
      }, 1000);
    });
  }
  
  // Update dashboard statistics
  updateDashboardStats();
  
  // Set up modals
  setupModals();
}

// Initialize date pickers
function initDatePickers() {
  const dateFrom = document.getElementById('date-from');
  const dateTo = document.getElementById('date-to');
  const applyDate = document.getElementById('apply-date');
  
  // Set default dates (last 30 days)
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  dateFrom.valueAsDate = thirtyDaysAgo;
  dateTo.valueAsDate = today;
  
  // Set up apply button
  if (applyDate) {
    applyDate.addEventListener('click', function() {
      if (dateFrom.value && dateTo.value) {
        showNotification('Date range applied', 'success');
        // In a real app, this would filter data by date
      } else {
        showNotification('Please select valid dates', 'error');
      }
    });
  }
}

// Update dashboard statistics
function updateDashboardStats() {
  const stats = window.appData.statistics;
  const prevStats = stats.previousMonth;
  
  // Update the statistics display
  document.getElementById('active-fires').textContent = stats.activeFires;
  document.getElementById('deforested-area').textContent = window.appUtils.formatArea(stats.deforestedArea);
  document.getElementById('risk-zones').textContent = stats.highRiskZones;
  document.getElementById('total-reports').textContent = stats.totalReports;
  
  // Calculate percentage changes
  const fireChange = calculatePercentageChange(stats.activeFires, prevStats.activeFires);
  const areaChange = calculatePercentageChange(stats.deforestedArea, prevStats.deforestedArea);
  const zonesChange = stats.highRiskZones - prevStats.highRiskZones;
  const reportsChange = stats.totalReports - prevStats.totalReports;
  
  // Update trend indicators
  updateTrendDisplay('active-fires', fireChange);
  updateTrendDisplay('deforested-area', areaChange, true); // invert is true (down is good)
  updateTrendDisplay('risk-zones', zonesChange, false, true); // isAbsolute is true
  updateTrendDisplay('total-reports', reportsChange, false, true); // isAbsolute is true
}

// Calculate percentage change
function calculatePercentageChange(current, previous) {
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
}

// Update trend display
function updateTrendDisplay(elementId, change, invert = false, isAbsolute = false) {
  const statElement = document.getElementById(elementId);
  if (!statElement) return;
  
  const trendElement = statElement.nextElementSibling;
  if (!trendElement) return;
  
  // Determine trend direction
  let isUp = change > 0;
  if (invert) isUp = !isUp;
  
  // Update class
  trendElement.classList.remove('up', 'down');
  trendElement.classList.add(isUp ? 'up' : 'down');
  
  // Update text
  if (isAbsolute) {
    trendElement.textContent = `${isUp ? '+' : ''}${change} from last month`;
  } else {
    trendElement.textContent = `${isUp ? '+' : ''}${Math.abs(change).toFixed(0)}% from last month`;
  }
}

// Set up modals
function setupModals() {
  // Event delegation for modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeModals = document.querySelectorAll('.modal.active');
      activeModals.forEach(modal => modal.classList.remove('active'));
    }
  });
}

// Show notification
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  let notificationContainer = document.querySelector('.notification-container');
  
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    document.body.appendChild(notificationContainer);
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${getNotificationIcon(type)}</span>
      <span class="notification-message">${message}</span>
    </div>
    <button class="notification-close">×</button>
  `;
  
  // Add to container
  notificationContainer.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Set up close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto dismiss after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Get icon for notification type
function getNotificationIcon(type) {
  switch (type) {
    case 'success': return '✅';
    case 'error': return '❌';
    case 'warning': return '⚠️';
    default: return 'ℹ️';
  }
}

// Add required CSS for notifications
function addNotificationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .notification {
      background-color: var(--color-surface);
      border-left: 4px solid var(--color-info-500);
      border-radius: var(--radius-md);
      box-shadow: 0 4px 12px var(--color-shadow);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 300px;
      max-width: 450px;
      transform: translateX(120%);
      opacity: 0;
      transition: transform 0.3s var(--ease-out), opacity 0.3s var(--ease-out);
    }
    
    .notification.show {
      transform: translateX(0);
      opacity: 1;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .notification-icon {
      font-size: 18px;
    }
    
    .notification-message {
      font-size: var(--font-size-sm);
    }
    
    .notification-close {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: var(--color-text-secondary);
      transition: color 0.2s var(--ease-out);
    }
    
    .notification-close:hover {
      color: var(--color-text-primary);
    }
    
    .notification-success {
      border-left-color: var(--color-primary-500);
    }
    
    .notification-error {
      border-left-color: var(--color-danger-500);
    }
    
    .notification-warning {
      border-left-color: var(--color-warning-500);
    }
  `;
  
  document.head.appendChild(style);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initDashboard();
  addNotificationStyles();
  
  // Add CSS for refresh animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    #refresh-data.refreshing .icon {
      display: inline-block;
      animation: spin 1s linear infinite;
    }
  `;
  document.head.appendChild(style);
});