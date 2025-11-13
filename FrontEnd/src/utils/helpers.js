// Utility functions untuk Dashboard

export const formatDateTime = (date) => {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const generateMockData = (length = 10, min = 0, max = 100) => {
  return Array.from({ length }, () => 
    Math.floor(Math.random() * (max - min + 1)) + min
  );
};

export const getMetricColor = (type) => {
  const colorMap = {
    water: '#3b82f6',      // blue
    soil: '#10b981',       // green  
    humidity: '#8b5cf6',   // purple
    temperature: '#f59e0b'  // orange
  };
  return colorMap[type] || '#6b7280';
};

export const formatMetricValue = (value, unit) => {
  if (typeof value !== 'number') return value;
  
  switch (unit) {
    case '°C':
      return `${value.toFixed(1)}°C`;
    case '%':
      return `${Math.round(value)}%`;
    case 'CM':
      return `${value} CM`;
    default:
      return `${value} ${unit}`;
  }
};

export const validateSensorData = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  const requiredFields = ['value', 'unit', 'timestamp'];
  return requiredFields.every(field => data.hasOwnProperty(field));
};

export const getStatusFromValue = (value, thresholds) => {
  if (!thresholds) return 'normal';
  
  if (value >= thresholds.danger) return 'danger';
  if (value >= thresholds.warning) return 'warning';
  if (value >= thresholds.optimal) return 'optimal';
  return 'low';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};