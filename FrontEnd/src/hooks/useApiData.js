// Custom hook untuk mengelola data sensor dan pompa
import { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import API_CONFIG from '../config/api';

export const useSensorData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getCurrentSensorData();
        
        if (response.success) {
          setData(response.data);
          setLastUpdate(new Date());
        } else {
          throw new Error(response.message || 'Gagal mengambil data sensor');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching sensor data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data pertama kali
    fetchSensorData();

    // Setup polling untuk update otomatis
    const interval = setInterval(fetchSensorData, API_CONFIG.POLLING_INTERVAL);

    // Cleanup interval saat component unmount
    return () => clearInterval(interval);
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getCurrentSensorData();
      
      if (response.success) {
        setData(response.data);
        setLastUpdate(new Date());
      } else {
        throw new Error(response.message || 'Gagal mengambil data sensor');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching sensor data:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    lastUpdate,
    refetch
  };
};

export const useSystemStatus = () => {
  const [status, setStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getSystemStatus();
        
        if (response.success) {
          setStatus(response.currentData);
          setAlerts(response.alerts || []);
        } else {
          throw new Error(response.message || 'Gagal mengambil status sistem');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching system status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, API_CONFIG.POLLING_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getSystemStatus();
      
      if (response.success) {
        setStatus(response.currentData);
        setAlerts(response.alerts || []);
      } else {
        throw new Error(response.message || 'Gagal mengambil status sistem');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching system status:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    alerts,
    loading,
    error,
    refetch
  };
};

export const usePumpControl = () => {
  const [pumpStatus, setPumpStatus] = useState(null);
  const [autoMode, setAutoMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPumpStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getPumpStatus();
      
      if (response.success) {
        setPumpStatus(response.data.pumpStatus);
        setAutoMode(response.data.autoMode);
      } else {
        throw new Error(response.message || 'Gagal mengambil status pompa');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching pump status:', err);
    } finally {
      setLoading(false);
    }
  };

  const controlPump = async (action) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.controlPump(action);
      
      if (response.success) {
        setPumpStatus(response.pumpStatus);
        return response;
      } else {
        throw new Error(response.message || 'Gagal mengontrol pompa');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error controlling pump:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleAutoMode = async (enabled) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.setAutoMode(enabled);
      
      if (response.success) {
        setAutoMode(response.autoMode);
        return response;
      } else {
        throw new Error(response.message || 'Gagal mengubah mode otomatis');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error toggling auto mode:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPumpStatus();
  }, []);

  return {
    pumpStatus,
    autoMode,
    loading,
    error,
    controlPump,
    toggleAutoMode,
    refetch: fetchPumpStatus
  };
};

export const useHistoricalData = (hours = 24) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiService.getHistoricalSensorData(hours);
        
        if (response.success) {
          setData(response.data || []);
        } else {
          throw new Error(response.message || 'Gagal mengambil data historis');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching historical data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data pertama kali
    fetchHistoricalData();
    
    // Setup polling untuk update otomatis setiap 30 detik (data historis tidak perlu sering-sering)
    const interval = setInterval(fetchHistoricalData, 30000);

    return () => clearInterval(interval);
  }, [hours]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getHistoricalSensorData(hours);
      
      if (response.success) {
        setData(response.data || []);
      } else {
        throw new Error(response.message || 'Gagal mengambil data historis');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching historical data:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};