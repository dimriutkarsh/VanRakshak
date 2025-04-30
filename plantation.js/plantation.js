// Plantation finder module for Vanrakshak

// Import data and functions from map.js
import { plantationSiteData, forestFireData, findNearestLocations } from './map.js';

// Set up plantation finder functionality
export function setupPlantationFinder() {
  // Set up distance slider
  setupDistanceSlider();
  
  // Set up find button
  setupFindButton();
}

// Set up distance slider functionality
function setupDistanceSlider() {
  const distanceSlider = document.getElementById('distance');
  const distanceValue = document.getElementById('distance-value');
  
  if (!distanceSlider || !distanceValue) return;
  
  // Update the value display when slider changes
  distanceSlider.addEventListener('input', () => {
    distanceValue.textContent = `${distanceSlider.value} km`;
  });
}

// Set up find button functionality
function setupFindButton() {
  const findButton = document.getElementById('find-plantation-sites');
  
  if (!findButton) return;
  
  findButton.addEventListener('click', () => {
    // Check if user location is available
    const hasUserLocation = window.userLocation ? true : false;
    
    if (!hasUserLocation) {
      // If user location is not available, ask user to use the map first
      const resultsContainer = document.getElementById('plantation-results');
      resultsContainer.innerHTML = `
        <div class="location-needed">
          <h3>Location Required</h3>
          <p>Please use the map to share your location first.</p>
          <a href="#map-section" class="btn btn-primary">Go to Map</a>
        </div>
      `;
      return;
    }
    
    // Get filter values
    const distance = parseInt(document.getElementById('distance').value, 10);
    const areaType = document.getElementById('area-type').value;
    
    // Filter plantation sites
    findPlantationSites(window.userLocation.lat, window.userLocation.lng, distance, areaType);
  });
  
  // Simulate a click for demonstration (in real scenario, this would be after user sets their location)
  setTimeout(() => {
    // Create dummy user location for demo purposes
    window.userLocation = {
      lat: 30.3165,
      lng: 78.0322
    };
    
    findButton.click();
  }, 1000);
}

// Find plantation sites based on filters
function findPlantationSites(lat, lng, maxDistance, areaType) {
  const resultsContainer = document.getElementById('plantation-results');
  if (!resultsContainer) return;
  
  // Filter sites by distance and type
  let filteredSites = plantationSiteData.map(site => ({
    ...site,
    distance: calculateDistance(lat, lng, site.location.lat, site.location.lng)
  })).filter(site => site.distance <= maxDistance);
  
  // Further filter by area type if specified
  if (areaType !== 'all') {
    filteredSites = filteredSites.filter(site => site.type === areaType);
  }
  
  // Sort by distance
  filteredSites.sort((a, b) => a.distance - b.distance);
  
  // Display results
  if (filteredSites.length === 0) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <h3>No Sites Found</h3>
        <p>No plantation sites match your criteria. Try adjusting your filters.</p>
      </div>
    `;
    return;
  }
  
  // Create results HTML
  let resultsHTML = `
    <h3>Found ${filteredSites.length} Plantation Sites</h3>
    <div class="site-cards">
  `;
  
  filteredSites.forEach(site => {
    resultsHTML += `
      <div class="site-card">
        <div class="site-header">
          <h4>${site.name}</h4>
          <span class="site-distance">${site.distance.toFixed(1)} km away</span>
        </div>
        <div class="site-body">
          <div class="site-type ${site.type}">
            ${formatSiteType(site.type)}
          </div>
          <div class="site-details">
            <div class="detail-item">
              <span class="detail-label">Area:</span>
              <span class="detail-value">${site.areaSize}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Accessibility:</span>
              <span class="detail-value">${site.accessibilityLevel}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Suitable Species:</span>
              <span class="detail-value">${site.suitableSpecies.join(', ')}</span>
            </div>
          </div>
          <p class="site-description">${site.description}</p>
        </div>
        <div class="site-footer">
          <button class="btn btn-outline btn-sm view-on-map" data-lat="${site.location.lat}" data-lng="${site.location.lng}">
            View on Map
          </button>
          <button class="btn btn-primary btn-sm get-directions">
            Get Directions
          </button>
        </div>
      </div>
    `;
  });
  
  resultsHTML += `
    </div>
  `;
  
  // Add styles
  resultsHTML += `
    <style>
      .site-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      
      .site-card {
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
      }
      
      .site-card:hover {
        transform: translateY(-5px);
      }
      
      .site-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #eee;
      }
      
      .site-header h4 {
        margin: 0;
        font-size: 1.1rem;
      }
      
      .site-distance {
        font-size: 0.8rem;
        color: var(--neutral);
        font-weight: 600;
      }
      
      .site-body {
        padding: 15px;
      }
      
      .site-type {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-bottom: 10px;
      }
      
      .site-type.fire-affected {
        background-color: rgba(230, 57, 70, 0.1);
        color: var(--fire-red);
      }
      
      .site-type.low-density {
        background-color: rgba(64, 145, 108, 0.1);
        color: var(--primary);
      }
      
      .site-type.deforested {
        background-color: rgba(247, 127, 0, 0.1);
        color: var(--fire-orange);
      }
      
      .site-details {
        margin-bottom: 10px;
      }
      
      .detail-item {
        margin-bottom: 5px;
        font-size: 0.9rem;
      }
      
      .detail-label {
        font-weight: 600;
        color: var(--neutral-dark);
      }
      
      .site-description {
        font-size: 0.9rem;
        color: var(--neutral);
        margin-bottom: 0;
      }
      
      .site-footer {
        display: flex;
        gap: 10px;
        padding: 15px;
        border-top: 1px solid #eee;
      }
      
      .btn-sm {
        padding: 6px 12px;
        font-size: 0.85rem;
      }
    </style>
  `;
  
  resultsContainer.innerHTML = resultsHTML;
  
  // Add event listeners to buttons
  resultsContainer.querySelectorAll('.view-on-map').forEach(button => {
    button.addEventListener('click', function() {
      const lat = parseFloat(this.getAttribute('data-lat'));
      const lng = parseFloat(this.getAttribute('data-lng'));
      
      // Scroll to map section
      document.querySelector('a[href="#map-section"]').click();
      
      // Set timeout to allow scroll to complete
      setTimeout(() => {
        // Get map reference and set view
        if (window.map) {
          window.map.setView([lat, lng], 13);
          
          // Find and open the marker popup
          window.plantationMarkers.forEach(marker => {
            const markerLat = marker.getLatLng().lat;
            const markerLng = marker.getLatLng().lng;
            
            if (Math.abs(markerLat - lat) < 0.001 && Math.abs(markerLng - lng) < 0.001) {
              marker.openPopup();
            }
          });
        }
      }, 500);
    });
  });
  
  // Add event listeners to get directions buttons
  resultsContainer.querySelectorAll('.get-directions').forEach(button => {
    button.addEventListener('click', function() {
      // Get the parent card
      const card = this.closest('.site-card');
      const siteHeader = card.querySelector('.site-header h4').textContent;
      const button = this;
      
      // Find site coordinates
      const lat = parseFloat(card.querySelector('.view-on-map').getAttribute('data-lat'));
      const lng = parseFloat(card.querySelector('.view-on-map').getAttribute('data-lng'));
      
      // Change button text
      button.textContent = 'Opening Maps...';
      
      // Create Google Maps URL
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      
      // Open in new tab
      setTimeout(() => {
        window.open(mapsUrl, '_blank');
        button.textContent = 'Get Directions';
      }, 500);
    });
  });
}

// Format site type for display
function formatSiteType(type) {
  switch(type) {
    case 'fire-affected':
      return 'Fire Affected';
    case 'low-density':
      return 'Low Density Forest';
    case 'deforested':
      return 'Deforested Land';
    default:
      return type;
  }
}

// Calculate distance between two coordinates in kilometers (using Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}