// Constants untuk Dashboard

export const SENSOR_TYPES = {
  WATER_LEVEL: 'water_level',
  SOIL_MOISTURE: 'soil_moisture',
  AIR_HUMIDITY: 'air_humidity',
  TEMPERATURE: 'temperature'
};

export const METRIC_COLORS = {
  BLUE: 'blue',
  GREEN: 'green', 
  PURPLE: 'purple',
  ORANGE: 'orange'
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info'
};

export const MENU_ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'monitoring', icon: '📈', label: 'Monitoring' },
  { id: 'users', icon: '👥', label: 'Users' },
  { id: 'logout', icon: '🚪', label: 'Logout' }
];

export const DEFAULT_THRESHOLDS = {
  water_level: {
    optimal: 5,
    warning: 3,
    danger: 1
  },
  soil_moisture: {
    optimal: 60,
    warning: 40,
    danger: 20
  },
  air_humidity: {
    optimal: 70,
    warning: 50,
    danger: 30
  },
  temperature: {
    optimal: 25,
    warning: 30,
    danger: 35
  }
};

export const CHART_COLORS = {
  PRIMARY: '#6366f1',
  SECONDARY: '#10b981',
  ACCENT: '#f59e0b',
  DANGER: '#dc3545'
};

export const API_ENDPOINTS = {
  SENSORS: '/api/sensors',
  METRICS: '/api/metrics',
  NOTIFICATIONS: '/api/notifications',
  USERS: '/api/users'
};

export const REFRESH_INTERVALS = {
  REAL_TIME: 1000,      // 1 second
  FAST: 5000,           // 5 seconds  
  NORMAL: 30000,        // 30 seconds
  SLOW: 60000           // 1 minute
};