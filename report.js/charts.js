/**
 * Chart handling for Forest Reports Dashboard
 */

// Initialize the fire trend chart
function initFireTrendChart() {
  const ctx = document.getElementById('fire-trend-chart').getContext('2d');
  
  // Create the chart with default monthly data
  window.fireChart = new Chart(ctx, {
    type: 'line',
    data: window.appData.trends.monthly,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            boxWidth: 15,
            usePointStyle: true,
            font: {
              family: getComputedStyle(document.body).fontFamily,
              size: 12
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          titleColor: '#111827',
          bodyColor: '#4B5563',
          borderColor: '#E5E7EB',
          borderWidth: 1,
          padding: 10,
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          cornerRadius: 4,
          titleFont: {
            family: getComputedStyle(document.body).fontFamily,
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            family: getComputedStyle(document.body).fontFamily,
            size: 12
          },
          callbacks: {
            labelPointStyle: function(context) {
              return {
                pointStyle: 'circle',
                rotation: 0
              };
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: getComputedStyle(document.body).fontFamily,
              size: 12
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(229, 231, 235, 0.5)'
          },
          ticks: {
            font: {
              family: getComputedStyle(document.body).fontFamily,
              size: 12
            },
            callback: function(value) {
              return value;
            }
          }
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      hover: {
        mode: 'index',
        intersect: false
      },
      elements: {
        line: {
          tension: 0.3
        },
        point: {
          radius: 2,
          hoverRadius: 5
        }
      }
    }
  });
  
  // Set up the chart view selector
  const viewSelector = document.getElementById('chart-view-selector');
  if (viewSelector) {
    viewSelector.addEventListener('change', updateChartView);
  }
  
  // Watch for theme changes to update chart
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'class') {
        updateChartTheme();
      }
    });
  });
  
  observer.observe(document.body, { attributes: true });
  
  // Initial theme setup
  updateChartTheme();
}

// Update chart based on time period selection
function updateChartView() {
  const viewType = document.getElementById('chart-view-selector').value;
  let chartData;
  
  switch (viewType) {
    case 'monthly':
      chartData = window.appData.trends.monthly;
      break;
    case 'quarterly':
      chartData = window.appData.trends.quarterly;
      break;
    case 'yearly':
      chartData = window.appData.trends.yearly;
      break;
    default:
      chartData = window.appData.trends.monthly;
  }
  
  // Update chart data
  window.fireChart.data = chartData;
  window.fireChart.update();
}

// Update chart colors based on current theme
function updateChartTheme() {
  if (!window.fireChart) return;
  
  const isDarkTheme = document.body.classList.contains('dark-theme');
  
  // Get computed styles
  const textColor = getComputedStyle(document.body).getPropertyValue('--color-text-primary');
  const gridColor = getComputedStyle(document.body).getPropertyValue('--color-border');
  
  // Update chart options for theme
  window.fireChart.options.scales.x.ticks.color = textColor;
  window.fireChart.options.scales.y.ticks.color = textColor;
  window.fireChart.options.scales.y.grid.color = isDarkTheme ? 'rgba(75, 85, 99, 0.3)' : 'rgba(229, 231, 235, 0.5)';
  
  // Update tooltip styles
  window.fireChart.options.plugins.tooltip.backgroundColor = isDarkTheme ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)';
  window.fireChart.options.plugins.tooltip.titleColor = isDarkTheme ? '#F9FAFB' : '#111827';
  window.fireChart.options.plugins.tooltip.bodyColor = isDarkTheme ? '#D1D5DB' : '#4B5563';
  window.fireChart.options.plugins.tooltip.borderColor = isDarkTheme ? '#4B5563' : '#E5E7EB';
  
  // Update legend styles
  window.fireChart.options.plugins.legend.labels.color = textColor;
  
  window.fireChart.update();
}

// Register chart download functionality
function registerChartDownload() {
  const downloadBtn = document.querySelector('.chart-panel .btn-icon');
  
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
      // Convert chart to base64 image
      const chartCanvas = document.getElementById('fire-trend-chart');
      const imageURL = chartCanvas.toDataURL('image/png');
      
      // Create download link
      const a = document.createElement('a');
      a.href = imageURL;
      a.download = `forest-fire-trend-${document.getElementById('chart-view-selector').value}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}

// Initialize chart
document.addEventListener('DOMContentLoaded', function() {
  initFireTrendChart();
  registerChartDownload();
});