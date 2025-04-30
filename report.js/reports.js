/**
 * Reports handling for Forest Reports Dashboard
 */

// Global variables
let currentReports = [];
let filteredReports = [];
let currentPage = 1;
let reportsPerPage = 10;
let currentSortField = 'date';
let currentSortDirection = 'desc';

// Initialize the reports table
function initReportsTable() {
  // Store all reports
  currentReports = window.appData.reports;
  filteredReports = [...currentReports];
  
  // Render the table
  renderReportsTable();
  
  // Set up event listeners
  setupTableFilters();
  setupTableSorting();
  setupTablePagination();
  setupTableSearch();
  setupExportButton();
}

// Render the reports table
function renderReportsTable() {
  const tableBody = document.getElementById('reports-table-body');
  if (!tableBody) return;
  
  // Clear the table
  tableBody.innerHTML = '';
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
  const startIndex = (currentPage - 1) * reportsPerPage;
  const endIndex = startIndex + reportsPerPage;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);
  
  // Update pagination UI
  document.getElementById('current-page').textContent = currentPage;
  document.getElementById('total-pages').textContent = totalPages;
  document.getElementById('prev-page').disabled = currentPage === 1;
  document.getElementById('next-page').disabled = currentPage === totalPages;
  
  // If no reports found
  if (paginatedReports.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="7" class="text-center py-4">No reports found matching your criteria.</td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }
  
  // Add rows for each report
  paginatedReports.forEach(report => {
    const row = document.createElement('tr');
    
    const severityClass = window.appUtils.getSeverityClass(report.severity);
    const statusClass = window.appUtils.getStatusClass(report.status);
    
    row.innerHTML = `
      <td>${report.id}</td>
      <td>${window.appUtils.formatDate(report.date)}</td>
      <td>${report.type}</td>
      <td>${report.location}</td>
      <td class="${severityClass}">${report.severity}</td>
      <td><span class="status-pill ${statusClass}">${report.status}</span></td>
      <td>
        <button class="action-btn view-btn" data-report-id="${report.id}">View</button>
      </td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Add event listeners to view buttons
  const viewButtons = document.querySelectorAll('.action-btn.view-btn');
  viewButtons.forEach(button => {
    button.addEventListener('click', function() {
      const reportId = this.getAttribute('data-report-id');
      const report = currentReports.find(r => r.id === reportId);
      if (report) {
        showReportDetails(report);
      }
    });
  });
}

// Set up table filters
function setupTableFilters() {
  const typeFilter = document.getElementById('filter-type');
  const severityFilter = document.getElementById('filter-severity');
  const statusFilter = document.getElementById('filter-status');
  
  const applyFilters = () => {
    filteredReports = currentReports.filter(report => {
      const typeMatch = typeFilter.value === 'all' || report.type.toLowerCase() === typeFilter.value.toLowerCase();
      const severityMatch = severityFilter.value === 'all' || report.severity.toLowerCase() === severityFilter.value.toLowerCase();
      const statusMatch = statusFilter.value === 'all' || report.status.toLowerCase() === statusFilter.value.toLowerCase();
      
      return typeMatch && severityMatch && statusMatch;
    });
    
    // Reset to first page and re-sort
    currentPage = 1;
    sortReports(currentSortField, currentSortDirection);
  };
  
  // Add event listeners
  typeFilter.addEventListener('change', applyFilters);
  severityFilter.addEventListener('change', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
}

// Set up table sorting
function setupTableSorting() {
  const sortableHeaders = document.querySelectorAll('.sortable');
  
  sortableHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const field = this.getAttribute('data-sort');
      
      // Toggle direction if same field, otherwise default to ascending
      const direction = field === currentSortField && currentSortDirection === 'asc' ? 'desc' : 'asc';
      
      // Update sort indicators
      sortableHeaders.forEach(h => {
        h.querySelector('.sort-icon').textContent = '⇅';
      });
      this.querySelector('.sort-icon').textContent = direction === 'asc' ? '↑' : '↓';
      
      // Sort the data
      sortReports(field, direction);
    });
  });
  
  // Set initial sort
  sortReports('date', 'desc');
  document.querySelector('[data-sort="date"]').querySelector('.sort-icon').textContent = '↓';
}

// Sort the reports
function sortReports(field, direction) {
  currentSortField = field;
  currentSortDirection = direction;
  
  filteredReports = window.appUtils.sortByProperty(filteredReports, field, direction);
  renderReportsTable();
}

// Set up table pagination
function setupTablePagination() {
  const prevPage = document.getElementById('prev-page');
  const nextPage = document.getElementById('next-page');
  
  prevPage.addEventListener('click', function() {
    if (currentPage > 1) {
      currentPage--;
      renderReportsTable();
    }
  });
  
  nextPage.addEventListener('click', function() {
    const totalPages = Math.ceil(filteredReports.length / reportsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderReportsTable();
    }
  });
}

// Set up table search
function setupTableSearch() {
  const searchInput = document.getElementById('search-reports');
  
  const handleSearch = window.appUtils.debounce(function() {
    const searchQuery = searchInput.value.trim().toLowerCase();
    
    if (searchQuery === '') {
      // Reset to filtered state without search
      filteredReports = currentReports.filter(report => {
        const typeFilter = document.getElementById('filter-type').value;
        const severityFilter = document.getElementById('filter-severity').value;
        const statusFilter = document.getElementById('filter-status').value;
        
        const typeMatch = typeFilter === 'all' || report.type.toLowerCase() === typeFilter.toLowerCase();
        const severityMatch = severityFilter === 'all' || report.severity.toLowerCase() === severityFilter.toLowerCase();
        const statusMatch = statusFilter === 'all' || report.status.toLowerCase() === statusFilter.toLowerCase();
        
        return typeMatch && severityMatch && statusMatch;
      });
    } else {
      // Apply search to currently filtered reports
      filteredReports = window.appUtils.searchFilter(
        filteredReports,
        searchQuery,
        ['id', 'location', 'description', 'type', 'status', 'severity']
      );
    }
    
    // Reset to first page and render
    currentPage = 1;
    sortReports(currentSortField, currentSortDirection);
  }, 300);
  
  searchInput.addEventListener('input', handleSearch);
}

// Show report details in modal
function showReportDetails(report) {
  const modal = document.getElementById('report-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('report-details-content');
  
  modalTitle.textContent = `Report: ${report.id}`;
  
  modalContent.innerHTML = `
    <div class="detail-section">
      <h3 class="detail-title">General Information</h3>
      <div class="detail-row">
        <div class="detail-label">Type:</div>
        <div class="detail-value">${report.type}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Date Reported:</div>
        <div class="detail-value">${window.appUtils.formatDate(report.date)}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Status:</div>
        <div class="detail-value"><span class="status-pill ${window.appUtils.getStatusClass(report.status)}">${report.status}</span></div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Severity:</div>
        <div class="detail-value ${window.appUtils.getSeverityClass(report.severity)}">${report.severity}</div>
      </div>
    </div>
    
    <div class="detail-section">
      <h3 class="detail-title">Location Details</h3>
      <div class="detail-row">
        <div class="detail-label">Area:</div>
        <div class="detail-value">${report.location}</div>
      </div>
      <div class="detail-row">
        <div class="detail-label">Coordinates:</div>
        <div class="detail-value">${report.coordinates[0]}, ${report.coordinates[1]}</div>
      </div>
      ${report.area ? `
      <div class="detail-row">
        <div class="detail-label">Affected Area:</div>
        <div class="detail-value">${window.appUtils.formatArea(report.area)}</div>
      </div>
      ` : ''}
    </div>
    
    <div class="detail-section">
      <h3 class="detail-title">Description</h3>
      <p>${report.description}</p>
    </div>
    
    <div class="detail-section">
      <h3 class="detail-title">Timeline</h3>
      <div class="timeline">
        <div class="timeline-item">
          <div class="timeline-date">${window.appUtils.formatDate(report.date)}</div>
          <div class="timeline-content">Initial report filed</div>
        </div>
        ${report.status !== 'Active' ? `
        <div class="timeline-item">
          <div class="timeline-date">${window.appUtils.formatDate(new Date(new Date(report.date).getTime() + 24*60*60*1000))}</div>
          <div class="timeline-content">Response team dispatched</div>
        </div>
        ` : ''}
        ${report.status === 'Resolved' ? `
        <div class="timeline-item">
          <div class="timeline-date">${window.appUtils.formatDate(new Date(new Date(report.date).getTime() + 5*24*60*60*1000))}</div>
          <div class="timeline-content">Issue resolved</div>
        </div>
        ` : ''}
      </div>
    </div>
  `;
  
  // Show the modal
  modal.classList.add('active');
  
  // Set up close button
  const closeButtons = modal.querySelectorAll('.modal-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      modal.classList.remove('active');
    });
  });
  
  // Close when clicking outside the modal content
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// Set up export button
function setupExportButton() {
  const exportBtn = document.getElementById('export-reports');
  const exportModal = document.getElementById('export-modal');
  const confirmExportBtn = document.getElementById('confirm-export');
  
  // Set up the export button
  exportBtn.addEventListener('click', function() {
    exportModal.classList.add('active');
  });
  
  // Set up close buttons
  const closeButtons = exportModal.querySelectorAll('.modal-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      exportModal.classList.remove('active');
    });
  });
  
  // Close when clicking outside
  exportModal.addEventListener('click', function(e) {
    if (e.target === exportModal) {
      exportModal.classList.remove('active');
    }
  });
  
  // Set up confirm export button
  confirmExportBtn.addEventListener('click', function() {
    // Get export format
    const formatEl = document.querySelector('input[name="export-format"]:checked');
    const format = formatEl ? formatEl.value : 'pdf';
    
    // Get data selection
    const dataSelection = [];
    document.querySelectorAll('input[name="export-data"]:checked').forEach(input => {
      dataSelection.push(input.value);
    });
    
    // Simulate export (in a real app, this would trigger a backend process)
    alert(`Exporting ${dataSelection.join(', ')} data in ${format.toUpperCase()} format`);
    
    // Close the modal
    exportModal.classList.remove('active');
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initReportsTable();
});

// Make showReportDetails available globally
window.showReportDetails = showReportDetails;