/**
 * Map handling for Uttarakhand Forest Fire Reports Dashboard
 */

// Initialize the map
function initMap() {
  // Create the map instance centered on Uttarakhand
  const map = L.map('map-container').setView([30.0668, 79.0193], 7);
  
  // Add the base map layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);
  
  // Store the map instance globally
  window.forestMap = map;
  
  // Add markers for reports
  addReportMarkers(map);
  
  // Add Uttarakhand boundary (simplified polygon)
  const uttarakhandBoundary = [
    [30.2937, 77.9329],
    [30.3752, 78.9629],
    [30.4469, 79.6533],
    [30.7999, 80.1999],
    [30.9469, 79.3999],
    [30.4159, 78.3999],
    [30.2937, 77.9329]
  ];
  
  L.polygon(uttarakhandBoundary, {
    color: '#047857',
    fillColor: '#047857',
    fillOpacity: 0.1,
    weight: 2
  }).addTo(map);
}

// Add markers for the reports
function addReportMarkers(map) {
  // Clear existing markers
  if (window.markersLayer) {
    map.removeLayer(window.markersLayer);
  }
  
  // Create new markers layer
  window.markersLayer = L.layerGroup().addTo(map);
  
  // Add markers for each report
  window.appData.reports.forEach(report => {
    const markerColor = getMarkerColor(report.severity);
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
    
    const marker = L.marker(report.coordinates, { icon: icon }).addTo(window.markersLayer);
    
    // Add popup with report information
    marker.bindPopup(`
      <div class="map-popup">
        <h3>Fire Report: ${report.id}</h3>
        <p><strong>Date:</strong> ${window.appUtils.formatDate(report.date)}</p>
        <p><strong>Location:</strong> ${report.location}</p>
        <p><strong>Severity:</strong> ${report.severity}</p>
        <p><strong>Status:</strong> ${report.status}</p>
        ${report.area ? `<p><strong>Area Affected:</strong> ${window.appUtils.formatArea(report.area)}</p>` : ''}
        <button class="popup-view-btn" data-report-id="${report.id}">View Details</button>
      </div>
    `);
    
    // Add click handler for the popup view button
    marker.on('popupopen', function() {
      const btn = document.querySelector(`.popup-view-btn[data-report-id="${report.id}"]`);
      if (btn) {
        btn.addEventListener('click', function() {
          const reportData = window.appData.reports.find(r => r.id === report.id);
          showReportDetails(reportData);
        });
      }
    });
    
    // Add circles for active fires
    if (report.status === 'Active') {
      const radius = Math.sqrt(report.area) * 100; // Scale radius based on area
      L.circle(report.coordinates, {
        color: '#EF4444',
        fillColor: '#EF4444',
        fillOpacity: 0.2,
        weight: 1,
        radius: radius
      }).addTo(window.markersLayer);
    }
  });
}

// Get marker color based on severity
function getMarkerColor(severity) {
  switch (severity.toLowerCase()) {
    case 'high': return '#DC2626';
    case 'medium': return '#F59E0B';
    case 'low': return '#F97316';
    default: return '#6B7280';
  }
}

// Initialize map on page load
document.addEventListener('DOMContentLoaded', function() {
  initMap();
});