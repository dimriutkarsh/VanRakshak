/**
 * Utility functions for Forest Reports Dashboard
 */

// Format date to display in a readable format
function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// Format number with thousands separators
function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

// Format area with proper unit (ha, sq km)
function formatArea(area) {
  if (area < 1000) {
    return `${area} ha`;
  } else {
    return `${(area / 1000).toFixed(2)} sq km`;
  }
}

// Generate a unique ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Debounce function to limit how often a function can be called
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Filter array of objects based on search query across multiple properties
function searchFilter(array, query, properties) {
  if (!query || query.trim() === '') return array;
  
  const lowerQuery = query.toLowerCase().trim();
  
  return array.filter(item => {
    return properties.some(prop => {
      const value = item[prop];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerQuery);
    });
  });
}

// Sort array of objects by a property
function sortByProperty(array, property, direction = 'asc') {
  return [...array].sort((a, b) => {
    let valueA = a[property];
    let valueB = b[property];
    
    // Handle strings (case-insensitive)
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    
    // Handle dates
    if (property === 'date') {
      valueA = new Date(valueA).getTime();
      valueB = new Date(valueB).getTime();
    }
    
    if (direction === 'asc') {
      return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    } else {
      return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
    }
  });
}

// Get severity class for styling
function getSeverityClass(severity) {
  const severityMap = {
    'high': 'severity-high',
    'medium': 'severity-medium',
    'low': 'severity-low'
  };
  
  return severityMap[severity.toLowerCase()] || '';
}

// Get status class for styling
function getStatusClass(status) {
  const statusMap = {
    'active': 'status-active',
    'resolved': 'status-resolved',
    'monitoring': 'status-monitoring'
  };
  
  return statusMap[status.toLowerCase()] || '';
}

// Toggle theme between light and dark
function toggleTheme() {
  const body = document.body;
  
  if (body.classList.contains('dark-theme')) {
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  } else {
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  }
}

// Load theme from localStorage
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
}

// Format file size
function formatFileSize(bytes) {
  if (bytes < 1024) {
    return bytes + ' bytes';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

// Initialize tooltips
function initTooltips() {
  const tooltipElements = document.querySelectorAll('[title]');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', showTooltip);
    element.addEventListener('mouseleave', hideTooltip);
  });
}

function showTooltip(e) {
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.textContent = this.getAttribute('title');
  
  document.body.appendChild(tooltip);
  
  const rect = this.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  
  tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
  tooltip.style.top = `${rect.top - tooltipRect.height - 10}px`;
  
  this.setAttribute('data-tooltip-id', Date.now());
  tooltip.setAttribute('data-tooltip-for', this.getAttribute('data-tooltip-id'));
}

function hideTooltip() {
  const tooltipId = this.getAttribute('data-tooltip-id');
  if (!tooltipId) return;
  
  const tooltip = document.querySelector(`[data-tooltip-for="${tooltipId}"]`);
  if (tooltip) {
    tooltip.remove();
  }
}

// Export functions
window.appUtils = {
  formatDate,
  formatNumber,
  formatArea,
  generateId,
  debounce,
  searchFilter,
  sortByProperty,
  getSeverityClass,
  getStatusClass,
  toggleTheme,
  loadTheme,
  formatFileSize,
  initTooltips
};