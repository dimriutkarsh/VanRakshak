// Map handling JavaScript

// Global variables
let map;
let heatLayer;
let markers = [];
let currentMapData = [];
let selectedRegion = 'all';
let selectedDataType = 'temperature';
let selectedTimeRange = 'current';

// DOM elements
const regionSelect = document.getElementById('region-select');
const dataTypeSelect = document.getElementById('data-type');
const timeRangeSelect = document.getElementById('time-range');

// Initialize map when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    setupMapControls();
});

// Initialize the Leaflet map
function initMap() {
    // Check if map container exists
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;
    
    // Create map centered on India
    map = L.map('map').setView([20.5937, 78.9629], 5);
    
    // Add the base tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Add forest areas (simplified for demo)
    addForestAreas();
    
    // Load and display initial temperature data
    loadMapData();
    
    // Make highlightAlertArea function available globally for interop with main.js
    window.highlightAlertArea = highlightAlertArea;
}

// Add mock forest areas to the map
function addForestAreas() {
    const forestAreas = [
        // Northern forests
        { 
            name: "Himalayan Pine Forest",
            coordinates: [[33.5, 76.5], [30.5, 78.9], [28.7, 80.8], [32.2, 82.3]],
            region: "north"
        },
        { 
            name: "Northern Deciduous Forest",
            coordinates: [[29.5, 76.5], [27.5, 77.9], [26.7, 80.8], [28.2, 81.3]],
            region: "north"
        },
        
        // Central forests
        { 
            name: "Central Indian Forest",
            coordinates: [[22.5, 76.5], [21.5, 78.9], [20.7, 80.8], [23.2, 79.3]],
            region: "central"
        },
        { 
            name: "Satpura-Maikal Forest",
            coordinates: [[22.5, 80.5], [21.5, 82.9], [20.7, 83.8], [23.2, 82.3]],
            region: "central"
        },
        
        // Southern forests
        { 
            name: "Western Ghats Forest",
            coordinates: [[14.5, 74.5], [13.5, 75.9], [12.7, 75.8], [15.2, 74.3]],
            region: "south"
        },
        { 
            name: "Eastern Ghats Forest",
            coordinates: [[17.5, 82.5], [16.5, 81.9], [15.7, 80.8], [18.2, 83.3]],
            region: "south"
        }
    ];
    
    // Add each forest area to the map
    forestAreas.forEach(forest => {
        const polygon = L.polygon(forest.coordinates, {
            color: '#2E7D32',
            fillColor: '#4CAF50',
            fillOpacity: 0.3,
            weight: 2,
            dashArray: '5, 5',
            className: `forest-area ${forest.region}`
        }).addTo(map);
        
        polygon.bindPopup(`<div class="forest-popup">
            <h4>${forest.name}</h4>
            <p>Region: ${capitalizeFirstLetter(forest.region)}</p>
            <p>Area: ${(Math.random() * 1000 + 500).toFixed(2)} sq km</p>
        </div>`);
        
        // Store the forest data in the polygon object for later reference
        polygon.forestData = forest;
    });
}

// Load map data based on selected filters
function loadMapData() {
    // Clear existing data
    clearMapData();
    
    // Generate mock data
    currentMapData = generateMockData();
    
    // Apply filters
    const filteredData = filterMapData(currentMapData);
    
    // Display data on map
    displayMapData(filteredData);
}

// Generate mock temperature data for demonstration
function generateMockData() {
    const data = [];
    
    // Northern forest points
    for (let i = 0; i < 20; i++) {
        data.push({
            lat: 29 + (Math.random() * 4),
            lng: 76 + (Math.random() * 6),
            temperature: Math.floor(Math.random() * 20) + 15, // 15-35°C
            humidity: Math.floor(Math.random() * 40) + 30, // 30-70%
            wind: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
            region: 'north',
            forestName: Math.random() > 0.5 ? 'Himalayan Pine Forest' : 'Northern Deciduous Forest',
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in the last week
        });
    }
    
    // Central forest points
    for (let i = 0; i < 20; i++) {
        data.push({
            lat: 20 + (Math.random() * 3),
            lng: 76 + (Math.random() * 7),
            temperature: Math.floor(Math.random() * 25) + 20, // 20-45°C (hotter in central)
            humidity: Math.floor(Math.random() * 30) + 20, // 20-50% (drier)
            wind: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
            region: 'central',
            forestName: Math.random() > 0.5 ? 'Central Indian Forest' : 'Satpura-Maikal Forest',
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
    }
    
    // Southern forest points
    for (let i = 0; i < 20; i++) {
        data.push({
            lat: 12 + (Math.random() * 6),
            lng: 74 + (Math.random() * 9),
            temperature: Math.floor(Math.random() * 20) + 20, // 20-40°C
            humidity: Math.floor(Math.random() * 40) + 40, // 40-80% (more humid in south)
            wind: Math.floor(Math.random() * 15) + 5, // 5-20 km/h
            region: 'south',
            forestName: Math.random() > 0.5 ? 'Western Ghats Forest' : 'Eastern Ghats Forest',
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        });
    }
    
    // Add a few extreme hotspots for alerts (simulating potential fire areas)
    for (let i = 0; i < 5; i++) {
        const region = ['north', 'central', 'south'][Math.floor(Math.random() * 3)];
        let lat, lng, forestName;
        
        switch(region) {
            case 'north':
                lat = 29 + (Math.random() * 4);
                lng = 76 + (Math.random() * 6);
                forestName = Math.random() > 0.5 ? 'Himalayan Pine Forest' : 'Northern Deciduous Forest';
                break;
            case 'central':
                lat = 20 + (Math.random() * 3);
                lng = 76 + (Math.random() * 7);
                forestName = Math.random() > 0.5 ? 'Central Indian Forest' : 'Satpura-Maikal Forest';
                break;
            case 'south':
                lat = 12 + (Math.random() * 6);
                lng = 74 + (Math.random() * 9);
                forestName = Math.random() > 0.5 ? 'Western Ghats Forest' : 'Eastern Ghats Forest';
                break;
        }
        
        data.push({
            lat: lat,
            lng: lng,
            temperature: Math.floor(Math.random() * 10) + 45, // 45-55°C (very hot)
            humidity: Math.floor(Math.random() * 15) + 10, // 10-25% (very dry)
            wind: Math.floor(Math.random() * 20) + 10, // 10-30 km/h (windy)
            region: region,
            forestName: forestName,
            timestamp: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000), // More recent
            isHotspot: true
        });
    }
    
    return data;
}

// Filter map data based on selected options
function filterMapData(data) {
    let filtered = [...data];
    
    // Filter by region
    if (selectedRegion !== 'all') {
        filtered = filtered.filter(point => point.region === selectedRegion);
    }
    
    // Filter by time range
    const now = new Date();
    let timeThreshold;
    
    switch(selectedTimeRange) {
        case '24h':
            timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            filtered = filtered.filter(point => point.timestamp > timeThreshold);
            break;
        case 'week':
            timeThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(point => point.timestamp > timeThreshold);
            break;
        // 'current' shows all data for this demo
    }
    
    return filtered;
}

// Display filtered data on the map
function displayMapData(data) {
    // Create markers for each data point
    data.forEach(point => {
        // Determine marker color based on temperature
        let color, markerClass;
        
        if (selectedDataType === 'temperature') {
            if (point.temperature >= 45) {
                color = '#e74c3c'; // very hot (red)
                markerClass = 'temp-critical';
            } else if (point.temperature >= 35) {
                color = '#e67e22'; // hot (orange)
                markerClass = 'temp-danger';
            } else if (point.temperature >= 30) {
                color = '#f1c40f'; // warm (yellow)
                markerClass = 'temp-warning';
            } else {
                color = '#2ecc71'; // normal (green)
                markerClass = 'temp-normal';
            }
        } else if (selectedDataType === 'humidity') {
            if (point.humidity < 20) {
                color = '#e74c3c'; // very dry (red)
                markerClass = 'temp-critical';
            } else if (point.humidity < 30) {
                color = '#e67e22'; // dry (orange)
                markerClass = 'temp-danger';
            } else if (point.humidity < 50) {
                color = '#f1c40f'; // moderate (yellow)
                markerClass = 'temp-warning';
            } else {
                color = '#2ecc71'; // humid (green)
                markerClass = 'temp-normal';
            }
        } else if (selectedDataType === 'wind') {
            if (point.wind > 25) {
                color = '#e74c3c'; // very windy (red)
                markerClass = 'temp-critical';
            } else if (point.wind > 20) {
                color = '#e67e22'; // windy (orange)
                markerClass = 'temp-danger';
            } else if (point.wind > 15) {
                color = '#f1c40f'; // moderate (yellow)
                markerClass = 'temp-warning';
            } else {
                color = '#2ecc71'; // light (green)
                markerClass = 'temp-normal';
            }
        }
        
        // Create marker with custom icon
        const marker = L.circleMarker([point.lat, point.lng], {
            radius: point.isHotspot ? 10 : 6,
            fillColor: color,
            color: 'white',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
            className: point.isHotspot ? 'pulsing-marker' : ''
        }).addTo(map);
        
        // Create popup content
        let popupContent = `<div class="temp-popup">
            <h4>${point.forestName}</h4>
            <p>Region: ${capitalizeFirstLetter(point.region)}</p>`;
            
        // Add data based on what's being shown
        if (selectedDataType === 'temperature' || selectedDataType === 'all') {
            popupContent += `<p>Temperature: <span class="temp-value ${markerClass}">${point.temperature}°C</span></p>`;
        }
        
        if (selectedDataType === 'humidity' || selectedDataType === 'all') {
            popupContent += `<p>Humidity: ${point.humidity}%</p>`;
        }
        
        if (selectedDataType === 'wind' || selectedDataType === 'all') {
            popupContent += `<p>Wind Speed: ${point.wind} km/h</p>`;
        }
        
        popupContent += `<p>Last Updated: ${formatDate(point.timestamp)}</p>`;
        
        if (point.isHotspot) {
            popupContent += `<p class="temp-critical"><strong>Warning: Potential Fire Risk!</strong></p>`;
        }
        
        popupContent += `</div>`;
        
        marker.bindPopup(popupContent);
        
        // Add hover effect
        marker.on('mouseover', function() {
            this.openPopup();
        });
        
        // Store point data in the marker for later reference
        marker.pointData = point;
        
        // Add marker to the array for later management
        markers.push(marker);
    });
    
    // Add a CSS class for pulsing effect
    if (!document.getElementById('pulsing-marker-style')) {
        const style = document.createElement('style');
        style.id = 'pulsing-marker-style';
        style.textContent = `
            .pulsing-marker {
                animation: pulse-map 1.5s infinite;
            }
            @keyframes pulse-map {
                0% {
                    opacity: 1;
                    transform: scale(1);
                }
                50% {
                    opacity: 0.6;
                    transform: scale(1.4);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Clear existing map data
function clearMapData() {
    // Remove all markers
    markers.forEach(marker => {
        map.removeLayer(marker);
    });
    
    // Reset markers array
    markers = [];
    
    // Remove heat layer if it exists
    if (heatLayer) {
        map.removeLayer(heatLayer);
        heatLayer = null;
    }
}

// Set up map control event listeners
function setupMapControls() {
    if (regionSelect) {
        regionSelect.addEventListener('change', function() {
            selectedRegion = this.value;
            loadMapData();
        });
    }
    
    if (dataTypeSelect) {
        dataTypeSelect.addEventListener('change', function() {
            selectedDataType = this.value;
            loadMapData();
        });
    }
    
    if (timeRangeSelect) {
        timeRangeSelect.addEventListener('change', function() {
            selectedTimeRange = this.value;
            loadMapData();
        });
    }
}

// Highlight an alert area on the map
function highlightAlertArea() {
    // Find a hotspot to highlight (in a real app this would use the actual alert data)
    const hotspots = currentMapData.filter(point => point.isHotspot);
    
    if (hotspots.length > 0) {
        // Choose a random hotspot
        const hotspot = hotspots[Math.floor(Math.random() * hotspots.length)];
        
        // Center map on the hotspot
        map.setView([hotspot.lat, hotspot.lng], 10);
        
        // Find the marker
        const marker = markers.find(m => 
            m.pointData && 
            m.pointData.lat === hotspot.lat && 
            m.pointData.lng === hotspot.lng
        );
        
        if (marker) {
            // Open the popup
            marker.openPopup();
            
            // Add a highlight effect
            const highlightCircle = L.circle([hotspot.lat, hotspot.lng], {
                color: '#e74c3c',
                fillColor: '#e74c3c',
                fillOpacity: 0.2,
                radius: 20000, // 20km radius
                className: 'highlight-pulse'
            }).addTo(map);
            
            // Add a CSS class for the highlight pulse
            if (!document.getElementById('highlight-pulse-style')) {
                const style = document.createElement('style');
                style.id = 'highlight-pulse-style';
                style.textContent = `
                    .highlight-pulse {
                        animation: highlight-pulse 2s infinite;
                    }
                    @keyframes highlight-pulse {
                        0% {
                            opacity: 0.2;
                            stroke-width: 0;
                        }
                        50% {
                            opacity: 0.5;
                            stroke-width: 3;
                        }
                        100% {
                            opacity: 0.2;
                            stroke-width: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Remove the highlight after 10 seconds
            setTimeout(() => {
                map.removeLayer(highlightCircle);
            }, 10000);
        }
    }
}

// Helper function to capitalize the first letter of a string
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Format date for display
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}