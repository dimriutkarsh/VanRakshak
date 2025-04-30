// Statistics module for Vanrakshak

// Import forest fire data from map.js
import { forestFireData, plantationSiteData } from './map.js';

// Load and display statistics
export function loadStatistics() {
  // Update summary statistics
  updateSummaryStats();
  
  // Set up region selector
  setupRegionSelector();
  
  // Create initial chart
  createRegionChart('all');
}

// Update the summary statistics in the statistics section
function updateSummaryStats() {
  // Calculate total trees affected
  const totalTreesAffected = forestFireData.reduce((sum, fire) => sum + fire.treesAffected, 0);
  document.getElementById('trees-affected').textContent = totalTreesAffected.toLocaleString();
  
  // Count active fires
  const activeFires = forestFireData.filter(fire => fire.status === 'active').length;
  document.getElementById('active-fires').textContent = activeFires.toString();
  
  // Count affected areas
  document.getElementById('affected-areas').textContent = forestFireData.length.toString();
  
  // Count plantation sites
  document.getElementById('plantation-sites').textContent = plantationSiteData.length.toString();
}

// Set up region selector
function setupRegionSelector() {
  const regionSelect = document.getElementById('region-select');
  if (!regionSelect) return;
  
  regionSelect.addEventListener('change', (e) => {
    const selectedRegion = e.target.value;
    createRegionChart(selectedRegion);
    updateRegionDetails(selectedRegion);
  });
}

// Create chart for region
function createRegionChart(region) {
  const chartContainer = document.getElementById('region-chart');
  if (!chartContainer) return;
  
  // Filter data based on region
  let filteredData = forestFireData;
  if (region !== 'all') {
    filteredData = forestFireData.filter(fire => 
      fire.name.toLowerCase().includes(region.toLowerCase())
    );
  }
  
  // Create a simple bar chart using DOM elements
  // In a real app, you might use a library like Chart.js
  let chartHTML = `
    <div class="chart-title">Forest Fire Impact by Severity</div>
    <div class="chart-container">
  `;
  
  // Calculate data for chart
  const severityCounts = {
    severe: filteredData.filter(fire => fire.severity === 'severe').length,
    moderate: filteredData.filter(fire => fire.severity === 'moderate').length,
    minor: filteredData.filter(fire => fire.severity === 'minor').length
  };
  
  const maxCount = Math.max(...Object.values(severityCounts));
  const barHeight = 200; // max height in pixels
  
  // Create bars
  chartHTML += `
    <div class="chart-bars">
      <div class="chart-bar">
        <div class="bar-value">${severityCounts.severe}</div>
        <div class="bar severe-fire" style="height: ${severityCounts.severe / maxCount * barHeight}px"></div>
        <div class="bar-label">Severe</div>
      </div>
      <div class="chart-bar">
        <div class="bar-value">${severityCounts.moderate}</div>
        <div class="bar moderate-fire" style="height: ${severityCounts.moderate / maxCount * barHeight}px"></div>
        <div class="bar-label">Moderate</div>
      </div>
      <div class="chart-bar">
        <div class="bar-value">${severityCounts.minor}</div>
        <div class="bar minor-fire" style="height: ${severityCounts.minor / maxCount * barHeight}px"></div>
        <div class="bar-label">Minor</div>
      </div>
    </div>
  `;
  
  chartHTML += `
    </div>
    <style>
      .chart-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
      
      .chart-title {
        text-align: center;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .chart-bars {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        height: ${barHeight}px;
      }
      
      .chart-bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 60px;
      }
      
      .bar {
        width: 40px;
        border-radius: 4px 4px 0 0;
        transition: height 0.5s ease;
      }
      
      .bar-value {
        margin-bottom: 5px;
      }
      
      .bar-label {
        margin-top: 5px;
        font-size: 0.8rem;
      }
      
      .severe-fire {
        background-color: var(--fire-red);
      }
      
      .moderate-fire {
        background-color: var(--fire-orange);
      }
      
      .minor-fire {
        background-color: var(--fire-yellow);
      }
    </style>
  `;
  
  chartContainer.innerHTML = chartHTML;
  
  // Update region details
  updateRegionDetails(region);
}

// Update region details
function updateRegionDetails(region) {
  const detailContainer = document.getElementById('region-detail');
  if (!detailContainer) return;
  
  // Filter data based on region
  let filteredData = forestFireData;
  let regionName = 'All Regions';
  
  if (region !== 'all') {
    filteredData = forestFireData.filter(fire => 
      fire.name.toLowerCase().includes(region.toLowerCase())
    );
    regionName = region.charAt(0).toUpperCase() + region.slice(1);
  }
  
  // Calculate statistics
  const totalFires = filteredData.length;
  const totalTreesAffected = filteredData.reduce((sum, fire) => sum + fire.treesAffected, 0);
  const activeFires = filteredData.filter(fire => fire.status === 'active').length;
  
  let detailHTML = `
    <h4>${regionName} Statistics</h4>
    <div class="detail-stats">
      <div class="detail-stat">
        <div class="detail-stat-value">${totalFires}</div>
        <div class="detail-stat-label">Total Fires</div>
      </div>
      <div class="detail-stat">
        <div class="detail-stat-value">${totalTreesAffected.toLocaleString()}</div>
        <div class="detail-stat-label">Trees Affected</div>
      </div>
      <div class="detail-stat">
        <div class="detail-stat-value">${activeFires}</div>
        <div class="detail-stat-label">Active Fires</div>
      </div>
    </div>
  `;
  
  // Add plantation info if available
  const plantationSites = plantationSiteData.filter(site => 
    site.name.toLowerCase().includes(region.toLowerCase())
  );
  
  if (plantationSites.length > 0 || region === 'all') {
    detailHTML += `
      <h4>Plantation Options</h4>
      <p>There are ${region === 'all' ? plantationSiteData.length : plantationSites.length} plantation sites available in this region.</p>
      <a href="#plantation" class="btn btn-sm btn-secondary">View Plantation Sites</a>
    `;
  }
  
  detailContainer.innerHTML = detailHTML;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .detail-stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    
    .detail-stat {
      text-align: center;
    }
    
    .detail-stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary);
    }
    
    .detail-stat-label {
      font-size: 0.8rem;
      color: var(--neutral);
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
  `;
  
  detailContainer.appendChild(style);
}