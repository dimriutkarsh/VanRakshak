/**
 * Mock data for Uttarakhand Forest Fire Reports Dashboard
 */

// Mock forest fire reports data for Uttarakhand
const mockReportsData = [
  {
    id: 'FR-2025-001',
    date: '2025-03-15',
    location: 'Nainital Forest Division',
    coordinates: [29.3919, 79.4542],
    severity: 'High',
    status: 'Active',
    area: 350,
    description: 'Large wildfire in pine forest area with rapid spread rate.'
  },
  {
    id: 'FR-2025-002',
    date: '2025-03-12',
    location: 'Dehradun Forest Division',
    coordinates: [30.3165, 78.0322],
    severity: 'Medium',
    status: 'Monitoring',
    area: 180,
    description: 'Fire spotted in mixed forest region, containment efforts ongoing.'
  },
  {
    id: 'FR-2025-003',
    date: '2025-03-10',
    location: 'Mussoorie Forest Range',
    coordinates: [30.4598, 78.0644],
    severity: 'Low',
    status: 'Resolved',
    area: 50,
    description: 'Small fire caused by lightning strike, contained within 24 hours.'
  },
  {
    id: 'FR-2025-004',
    date: '2025-03-08',
    location: 'Rajaji National Park',
    coordinates: [30.0419, 78.2145],
    severity: 'High',
    status: 'Active',
    area: 420,
    description: 'Major fire affecting wildlife habitat, emergency response deployed.'
  },
  {
    id: 'FR-2025-005',
    date: '2025-03-05',
    location: 'Corbett Tiger Reserve',
    coordinates: [29.5300, 78.7747],
    severity: 'Medium',
    status: 'Monitoring',
    area: 120,
    description: 'Fire near buffer zone, being monitored closely.'
  },
  {
    id: 'FR-2025-006',
    date: '2025-03-03',
    location: 'Almora Forest Division',
    coordinates: [29.5892, 79.6467],
    severity: 'Low',
    status: 'Resolved',
    area: 85,
    description: 'Fire in chir pine forest, successfully contained.'
  },
  {
    id: 'FR-2025-007',
    date: '2025-03-01',
    location: 'Pithoragarh Forest Division',
    coordinates: [29.5831, 80.2181],
    severity: 'High',
    status: 'Resolved',
    area: 290,
    description: 'Forest fire that threatened local villages, now contained.'
  }
];

// Mock monthly fire trend data for Uttarakhand
const mockMonthlyTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Forest Fires',
      data: [5, 8, 12, 15, 20, 32, 45, 50, 35, 25, 15, 10],
      borderColor: '#EF4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.3,
      fill: true
    }
  ]
};

// Mock statistics data
const mockStatistics = {
  activeFires: 24,
  affectedArea: 1280,
  resolvedFires: 45,
  totalReports: 156,
  previousMonth: {
    activeFires: 21,
    affectedArea: 1320,
    resolvedFires: 38,
    totalReports: 138
  }
};

// Export the mock data
window.appData = {
  reports: mockReportsData,
  trends: {
    monthly: mockMonthlyTrendData
  },
  statistics: mockStatistics
};