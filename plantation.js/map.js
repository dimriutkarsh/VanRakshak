// Uttarakhand forest fire map implementation

// Forest fire data for Uttarakhand regions
const forestFireData = [
  {
    id: 1,
    name: "Nainital Forest Fire",
    location: { lat: 29.3803, lng: 79.4636 },
    severity: "severe",
    date: "2025-03-15",
    treesAffected: 5620,
    areaAffected: "3.8 sq km",
    status: "contained",
    description: "Severe forest fire affecting pine forests near Nainital lake area."
  },
  {
    id: 2,
    name: "Dehradun Forest Reserve",
    location: { lat: 30.3165, lng: 78.0322 },
    severity: "moderate",
    date: "2025-04-02",
    treesAffected: 2340,
    areaAffected: "1.5 sq km",
    status: "active",
    description: "Moderate fire spread in Dehradun forest reserve affecting local biodiversity."
  },
  {
    id: 3,
    name: "Rishikesh Forest Area",
    location: { lat: 30.1087, lng: 78.2932 },
    severity: "minor",
    date: "2025-03-28",
    treesAffected: 980,
    areaAffected: "0.7 sq km",
    status: "extinguished",
    description: "Minor fire in mixed forest area near Rishikesh. Fully extinguished."
  },
  {
    id: 4,
    name: "Mussoorie Hills",
    location: { lat: 30.4598, lng: 78.0644 },
    severity: "severe",
    date: "2025-04-10",
    treesAffected: 4780,
    areaAffected: "2.9 sq km",
    status: "contained",
    description: "Severe fire in oak and rhododendron forests in Mussoorie hills."
  },
  {
    id: 5,
    name: "Corbett National Park",
    location: { lat: 29.5300, lng: 78.7747 },
    severity: "moderate",
    date: "2025-04-05",
    treesAffected: 3120,
    areaAffected: "2.1 sq km",
    status: "active",
    description: "Fire affecting the buffer zone of Corbett National Park."
  },
  {
    id: 6,
    name: "Almora Forest",
    location: { lat: 29.5892, lng: 79.6467 },
    severity: "minor",
    date: "2025-03-20",
    treesAffected: 760,
    areaAffected: "0.5 sq km",
    status: "contained",
    description: "Small fire in pine forest areas of Almora district."
  },
  {
    id: 7,
    name: "Pithoragarh Border Forest",
    location: { lat: 29.5831, lng: 80.2181 },
    severity: "moderate",
    date: "2025-04-08",
    treesAffected: 2870,
    areaAffected: "1.8 sq km",
    status: "active",
    description: "Fire in mixed forest near Nepal border in Pithoragarh district."
  }
];

// Plantation suitable areas
const plantationSiteData = [
  {
    id: 101,
    name: "Nainital Plantation Zone",
    location: { lat: 29.3980, lng: 79.4736 },
    type: "fire-affected",
    areaSize: "2.5 sq km",
    suitableSpecies: ["Pine", "Oak", "Rhododendron"],
    accessibilityLevel: "Medium",
    description: "Area affected by past forest fires, now suitable for reforestation."
  },
  {
    id: 102,
    name: "Dehradun Valley",
    location: { lat: 30.3265, lng: 78.0422 },
    type: "low-density",
    areaSize: "3.2 sq km",
    suitableSpecies: ["Sal", "Teak", "Bamboo"],
    accessibilityLevel: "High",
    description: "Low density forest area with good accessibility for plantation drives."
  },
  {
    id: 103,
    name: "Rishikesh Riverside",
    location: { lat: 30.1187, lng: 78.3032 },
    type: "deforested",
    areaSize: "1.8 sq km",
    suitableSpecies: ["Sisham", "Khair", "Bamboo"],
    accessibilityLevel: "High",
    description: "Deforested area near river bank, excellent for riverside species plantation."
  },
  {
    id: 104,
    name: "Mussoorie Hillside",
    location: { lat: 30.4698, lng: 78.0744 },
    type: "fire-affected",
    areaSize: "2.1 sq km",
    suitableSpecies: ["Oak", "Deodar", "Rhododendron"],
    accessibilityLevel: "Low",
    description: "Fire-affected hillside area that needs reforestation with native species."
  },
  {
    id: 105,
    name: "Tehri Lake Border",
    location: { lat: 30.3784, lng: 78.4802 },
    type: "low-density",
    areaSize: "4.2 sq km",
    suitableSpecies: ["Pine", "Oak", "Local bushes"],
    accessibilityLevel: "Medium",
    description: "Low density forested area near Tehri lake, suitable for mixed plantation."
  }
];

// Map instance
let map = null;
let userMarker = null;
let fireMarkers = [];
let plantationMarkers = [];

// Initialize and set up the map
export function setupMap() {
  const mapElement = document.getElementById('fire-map');
  
  if (!mapElement) return;
  
  // Uttarakhand center coordinates
  const uttarakhandCenter = [30.0668, 79.0193];
  
  // Initialize the map
  map = L.map('fire-map').setView(uttarakhandCenter, 8);
  
  // Add the base tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  // Add map controls
  addMapControls();
  
  // Add forest fire markers
  addForestFireMarkers();
  
  // Add plantation site markers
  addPlantationSiteMarkers();
  
  // Set up search functionality
  setupSearch();
  
  // Set up location button
  document.getElementById('use-my-location').addEventListener('click', getUserLocation);
}

// Add custom map controls
function addMapControls() {
  // Create a custom control container
  const controlContainer = L.DomUtil.create('div', 'map-controls');
  
  // Add filter buttons
  const fireFilterBtn = createControlButton('Show Fires', 'active');
  fireFilterBtn.addEventListener('click', () => toggleMarkerLayer('fire'));
  
  const plantationFilterBtn = createControlButton('Show Plantation Sites');
  plantationFilterBtn.addEventListener('click', () => toggleMarkerLayer('plantation'));
  
  // Add buttons to container
  controlContainer.appendChild(fireFilterBtn);
  controlContainer.appendChild(plantationFilterBtn);
  
  // Add the custom control to the map
  const customControl = L.Control.extend({
    onAdd: function() {
      return controlContainer;
    }
  });
  
  map.addControl(new customControl({ position: 'topleft' }));
}

// Create a map control button
function createControlButton(text, className = '') {
  const button = L.DomUtil.create('button', 'map-control-button');
  if (className) button.classList.add(className);
  button.textContent = text;
  
  // Prevent map click events when clicking the button
  L.DomEvent.disableClickPropagation(button);
  
  return button;
}

// Toggle marker layers
function toggleMarkerLayer(layerType) {
  if (layerType === 'fire') {
    fireMarkers.forEach(marker => {
      if (marker.options.opacity === 1) {
        marker.setOpacity(0);
      } else {
        marker.setOpacity(1);
      }
    });
    
    const button = document.querySelector('.map-controls button:first-child');
    button.classList.toggle('active');
  } else if (layerType === 'plantation') {
    plantationMarkers.forEach(marker => {
      if (marker.options.opacity === 1) {
        marker.setOpacity(0);
      } else {
        marker.setOpacity(1);
      }
    });
    
    const button = document.querySelector('.map-controls button:nth-child(2)');
    button.classList.toggle('active');
  }
}

// Add forest fire markers to the map
function addForestFireMarkers() {
  forestFireData.forEach(fire => {
    // Create custom marker
    const customIcon = createCustomIcon(fire.severity + '-fire');
    
    // Create marker and add to map
    const marker = L.marker([fire.location.lat, fire.location.lng], {
      icon: customIcon,
      title: fire.name
    }).addTo(map);
    
    // Create popup content
    const popupContent = createFirePopupContent(fire);
    
    // Bind popup to marker
    marker.bindPopup(popupContent);
    
    // Store marker in the array
    fireMarkers.push(marker);
  });
}

// Add plantation site markers to the map
function addPlantationSiteMarkers() {
  plantationSiteData.forEach(site => {
    // Create custom marker
    let markerClass = 'plantation-site';
    if (site.type === 'low-density') markerClass = 'low-density';
    
    const customIcon = createCustomIcon(markerClass);
    
    // Create marker and add to map
    const marker = L.marker([site.location.lat, site.location.lng], {
      icon: customIcon,
      title: site.name,
      opacity: 0 // Initially hidden
    }).addTo(map);
    
    // Create popup content
    const popupContent = createPlantationPopupContent(site);
    
    // Bind popup to marker
    marker.bindPopup(popupContent);
    
    // Store marker in the array
    plantationMarkers.push(marker);
  });
}

// Create custom icon for markers
function createCustomIcon(className) {
  return L.divIcon({
    className: `custom-marker ${className}`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
}

// Create popup content for forest fire markers
function createFirePopupContent(fire) {
  let statusClass = '';
  switch(fire.status) {
    case 'active':
      statusClass = 'text-danger';
      break;
    case 'contained':
      statusClass = 'text-warning';
      break;
    case 'extinguished':
      statusClass = 'text-success';
      break;
  }
  
  return `
    <div class="fire-popup ${fire.severity}">
      <div class="popup-header">
        <h3>${fire.name}</h3>
      </div>
      <div class="popup-content">
        <div class="popup-stat">
          <span class="popup-stat-label">Status:</span>
          <span class="${statusClass}">${fire.status.toUpperCase()}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">Trees Affected:</span>
          <span>${fire.treesAffected.toLocaleString()}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">Area:</span>
          <span>${fire.areaAffected}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">Date Reported:</span>
          <span>${formatDate(fire.date)}</span>
        </div>
        <p>${fire.description}</p>
      </div>
      <div class="popup-footer">
        <button class="popup-action btn-secondary" onclick="window.location.href='#plantation'">Find Plantation Sites</button>
        <button class="popup-action btn-primary" onclick="window.location.href='#statistics'">View Statistics</button>
      </div>
    </div>
  `;
}

// Create popup content for plantation site markers
function createPlantationPopupContent(site) {
  return `
    <div class="plantation-popup">
      <div class="popup-header">
        <h3>${site.name}</h3>
      </div>
      <div class="popup-content">
        <div class="popup-stat">
          <span class="popup-stat-label">Type:</span>
          <span>${formatSiteType(site.type)}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">Area:</span>
          <span>${site.areaSize}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">Accessibility:</span>
          <span>${site.accessibilityLevel}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">Suitable Species:</span>
        </div>
        <p>${site.suitableSpecies.join(', ')}</p>
        <p>${site.description}</p>
      </div>
      <div class="popup-footer">
        <button class="popup-action btn-primary" onclick="window.location.href='#plantation'">Plantation Guide</button>
      </div>
    </div>
  `;
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

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Set up search functionality
function setupSearch() {
  const searchInput = document.getElementById('location-search');
  const searchBtn = document.getElementById('search-btn');
  
  if (!searchInput || !searchBtn) return;
  
  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query.length === 0) return;
    
    // Simple search - check if location name contains the query
    const allMarkers = [...fireMarkers, ...plantationMarkers];
    let found = false;
    
    allMarkers.forEach(marker => {
      if (marker.options.title.toLowerCase().includes(query.toLowerCase())) {
        marker.openPopup();
        map.setView(marker.getLatLng(), 12);
        found = true;
      }
    });
    
    if (!found) {
      alert('No locations found matching your search. Try a different keyword.');
    }
  });
  
  // Add enter key listener
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });
}

// Get user's location
function getUserLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      
      // Remove previous user marker if exists
      if (userMarker) {
        map.removeLayer(userMarker);
      }
      
      // Add marker at user's location
      userMarker = L.marker([latitude, longitude], {
        icon: L.divIcon({
          className: 'user-location-marker',
          html: '<div style="background-color: #1e88e5; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        })
      }).addTo(map);
      
      // Create a circle showing accuracy
      L.circle([latitude, longitude], {
        radius: 1000, // 1km radius
        color: '#1e88e5',
        fillColor: '#1e88e5',
        fillOpacity: 0.1
      }).addTo(map);
      
      // Center map on user's location
      map.setView([latitude, longitude], 12);
      
      // Find nearest sites and fires
      findNearestLocations(latitude, longitude);
    },
    () => {
      alert('Unable to retrieve your location. Please check your location permissions.');
    }
  );
}

// Find nearest fire and plantation locations
function findNearestLocations(lat, lng) {
  // Combine all locations
  const allLocations = [
    ...forestFireData.map(fire => ({
      ...fire,
      type: 'fire',
      distance: calculateDistance(lat, lng, fire.location.lat, fire.location.lng)
    })),
    ...plantationSiteData.map(site => ({
      ...site,
      type: 'plantation',
      distance: calculateDistance(lat, lng, site.location.lat, site.location.lng)
    }))
  ];
  
  // Sort by distance
  allLocations.sort((a, b) => a.distance - b.distance);
  
  // Take closest 3
  const nearest = allLocations.slice(0, 3);
  
  // Create popup content
  let popupContent = `
    <div class="user-location-popup">
      <h3>Your Location</h3>
      <p>Nearest points of interest:</p>
      <ul>
  `;
  
  nearest.forEach(location => {
    popupContent += `
      <li>
        <strong>${location.name}</strong> (${location.distance.toFixed(1)} km) - 
        ${location.type === 'fire' ? `${location.severity} fire` : `plantation site`}
      </li>
    `;
  });
  
  popupContent += `
      </ul>
      <p class="mt-2">
        <a href="#plantation" class="read-more">View Plantation Options</a>
      </p>
    </div>
  `;
  
  // Bind popup to user marker
  userMarker.bindPopup(popupContent).openPopup();
  
  // If we're in the plantation section, update the results
  updatePlantationResults(nearest.filter(loc => loc.type === 'plantation'));
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

// Update plantation results
function updatePlantationResults(sites) {
  const resultsContainer = document.getElementById('plantation-results');
  if (!resultsContainer) return;
  
  if (sites.length === 0) {
    resultsContainer.innerHTML = '<p class="placeholder-text">No plantation sites found nearby. Try increasing the distance.</p>';
    return;
  }
  
  let resultsHTML = `
    <h3>Nearby Plantation Sites</h3>
    <div class="plantation-site-list">
  `;
  
  sites.forEach(site => {
    resultsHTML += `
      <div class="plantation-site-card">
        <h4>${site.name}</h4>
        <div class="site-details">
          <p><strong>Distance:</strong> ${site.distance.toFixed(1)} km</p>
          <p><strong>Type:</strong> ${formatSiteType(site.type)}</p>
          <p><strong>Area:</strong> ${site.areaSize}</p>
          <p><strong>Accessibility:</strong> ${site.accessibilityLevel}</p>
          <p><strong>Suitable Species:</strong> ${site.suitableSpecies.join(', ')}</p>
          <p>${site.description}</p>
        </div>
        <button class="btn btn-primary btn-sm mt-3" onclick="showOnMap(${site.location.lat}, ${site.location.lng})">
          Show on Map
        </button>
      </div>
    `;
  });
  
  resultsHTML += `
    </div>
  `;
  
  resultsContainer.innerHTML = resultsHTML;
  
  // Add global function to show location on map
  window.showOnMap = function(lat, lng) {
    map.setView([lat, lng], 13);
    document.querySelector('a[href="#map-section"]').click();
  };
}

// Exports for access from other modules
export { forestFireData, plantationSiteData, findNearestLocations };