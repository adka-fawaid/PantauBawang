// Service untuk berinteraksi dengan backend API
import API_CONFIG, { getApiUrl, handleApiResponse } from '../config/api';

class ApiService {
  
  // **SENSOR DATA SERVICES**
  
  // Mengambil data sensor terkini
  async getCurrentSensorData() {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SENSORS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: API_CONFIG.TIMEOUT
      });
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching current sensor data:', error);
      throw new Error('Gagal mengambil data sensor terkini');
    }
  }
  
  // Mengambil data historis sensor
  async getHistoricalSensorData(hours = 24) {
    try {
      const url = `${getApiUrl(API_CONFIG.ENDPOINTS.SENSORS_HISTORY)}?hours=${hours}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: API_CONFIG.TIMEOUT
      });
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching historical sensor data:', error);
      throw new Error('Gagal mengambil data historis sensor');
    }
  }
  
  // Mengambil status sistem dan alerts
  async getSystemStatus() {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.SENSORS_STATUS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: API_CONFIG.TIMEOUT
      });
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching system status:', error);
      throw new Error('Gagal mengambil status sistem');
    }
  }
  
  // **PUMP CONTROL SERVICES**
  
  // Mengambil status pompa
  async getPumpStatus() {
    try {
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PUMPS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: API_CONFIG.TIMEOUT
      });
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error fetching pump status:', error);
      throw new Error('Gagal mengambil status pompa');
    }
  }
  
  // Kontrol pompa (nyala/mati)
  async controlPump(action) {
    try {
      if (!['start', 'stop', 'toggle', 'on', 'off'].includes(action)) {
        throw new Error('Action harus berupa "start", "stop", "toggle", "on", atau "off"');
      }
      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PUMPS_CONTROL), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
        timeout: API_CONFIG.TIMEOUT
      });
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error controlling pump:', error);
      throw new Error('Gagal mengontrol pompa');
    }
  }
  
  // Toggle mode otomatis pompa
  async setAutoMode(enabled) {
    try {
      if (typeof enabled !== 'boolean') {
        throw new Error('Parameter enabled harus berupa boolean');
      }
      
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PUMPS_AUTO_MODE), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
        timeout: API_CONFIG.TIMEOUT
      });
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Error setting auto mode:', error);
      throw new Error('Gagal mengubah mode otomatis');
    }
  }
  
  // **UTILITY METHODS**
  
  // Test koneksi ke server
  async testConnection() {
    try {
      const response = await fetch(getApiUrl('/'), {
        method: 'GET',
        timeout: 5000
      });
      
      return await handleApiResponse(response);
    } catch (error) {
      console.error('Connection test failed:', error);
      throw new Error('Tidak dapat terhubung ke server');
    }
  }
}

// Export singleton instance
export default new ApiService();