// Konfigurasi API untuk koneksi ke backend
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    SENSORS: '/api/sensors',
    SENSORS_HISTORY: '/api/sensors/history',
    SENSORS_STATUS: '/api/sensors/status',
    PUMPS: '/api/pumps',
    PUMPS_CONTROL: '/api/pumps/control',
    PUMPS_AUTO_MODE: '/api/pumps/auto-mode'
  },
  POLLING_INTERVAL: 5000, // Update data setiap 5 detik
  TIMEOUT: 10000 // Timeout request 10 detik
};

// Helper function untuk membuat URL lengkap
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function untuk handle response
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Terjadi kesalahan pada server');
  }
  return response.json();
};

export default API_CONFIG;