// Analytics Charts JavaScript

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCharts();
});

// Initialize all charts
function initCharts() {
    createTemperatureTrendChart();
    createAlertDistributionChart();
    createHotspotChart();
}

// Create the temperature trends chart
function createTemperatureTrendChart() {
    const ctx = document.getElementById('tempTrendChart');
    if (!ctx) return;
    
    // Generate dummy data for the past 7 days
    const dates = [];
    const northTemp = [];
    const centralTemp = [];
    const southTemp = [];
    
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        
        // Generate random temperatures with a realistic pattern
        northTemp.push(Math.floor(Math.random() * 5) + 25); // 25-30°C
        centralTemp.push(Math.floor(Math.random() * 7) + 30); // 30-37°C
        southTemp.push(Math.floor(Math.random() * 6) + 27); // 27-33°C
    }
    
    // Modify the last day to show an increase in temperature (for dramatic effect)
    northTemp[6] = Math.floor(Math.random() * 5) + 30; // 30-35°C
    centralTemp[6] = Math.floor(Math.random() * 5) + 35; // 35-40°C
    southTemp[6] = Math.floor(Math.random() * 5) + 32; // 32-37°C
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Northern Forests',
                    data: northTemp,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Central Forests',
                    data: centralTemp,
                    borderColor: '#e67e22',
                    backgroundColor: 'rgba(230, 126, 34, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Southern Forests',
                    data: southTemp,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        family: "'Inter', sans-serif",
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: "'Inter', sans-serif",
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '°C';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 20,
                    max: 45,
                    title: {
                        display: true,
                        text: 'Temperature (°C)',
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        }
                    },
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Create the alert distribution chart
function createAlertDistributionChart() {
    const ctx = document.getElementById('alertDistChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['High Priority', 'Medium Priority', 'Low Priority'],
            datasets: [{
                data: [3, 5, 4],
                backgroundColor: [
                    '#F44336', // red (high)
                    '#FF9800', // orange (medium)
                    '#FFC107'  // yellow (low)
                ],
                borderColor: 'white',
                borderWidth: 2,
                hoverOffset: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        family: "'Inter', sans-serif",
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: "'Inter', sans-serif",
                        size: 13
                    }
                }
            },
            cutout: '70%',
            radius: '90%'
        }
    });
}

// Create the regional hotspots chart
function createHotspotChart() {
    const ctx = document.getElementById('hotspotChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Northern', 'Central', 'Southern'],
            datasets: [{
                label: 'High Temperature Areas',
                data: [2, 5, 3],
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)', // blue (north)
                    'rgba(230, 126, 34, 0.7)', // orange (central)
                    'rgba(46, 204, 113, 0.7)'  // green (south)
                ],
                borderColor: [
                    '#3498db',
                    '#e67e22',
                    '#2ecc71'
                ],
                borderWidth: 1,
                borderRadius: 5,
                barThickness: 30,
                hoverBackgroundColor: [
                    'rgba(52, 152, 219, 0.9)',
                    'rgba(230, 126, 34, 0.9)',
                    'rgba(46, 204, 113, 0.9)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                        family: "'Inter', sans-serif",
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        family: "'Inter', sans-serif",
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return context.raw + ' hotspots detected';
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 8,
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    ticks: {
                        font: {
                            family: "'Inter', sans-serif",
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}