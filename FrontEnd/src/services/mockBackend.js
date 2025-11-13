const express = require('express');
const cors = require('cors');

// Import mock data generator
const MockSensorData = require('./mockSensorData');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize mock data generator
const mockData = new MockSensorData();

// Routes
// Get current sensor data
app.get('/api/sensor/current', (req, res) => {
  try {
    const currentData = mockData.getCurrentReading();
    res.json({
      success: true,
      data: currentData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data sensor',
      error: error.message
    });
  }
});

// Get historical sensor data
app.get('/api/sensor/history/:hours?', (req, res) => {
  try {
    const hours = parseInt(req.params.hours) || 24;
    const historicalData = mockData.getHistoricalData(hours);
    
    res.json({
      success: true,
      data: historicalData,
      count: historicalData.length,
      timeRange: `${hours} jam terakhir`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data historis',
      error: error.message
    });
  }
});

// Get system status
app.get('/api/system/status', (req, res) => {
  try {
    const currentData = mockData.getCurrentReading();
    const systemStatus = mockData.getSystemStatus();
    
    res.json({
      success: true,
      currentData: currentData,
      systemStatus: systemStatus,
      alerts: mockData.getAlerts(),
      lastUpdate: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil status sistem',
      error: error.message
    });
  }
});

// Get pump status
app.get('/api/pump/status', (req, res) => {
  try {
    const pumpStatus = mockData.getPumpStatus();
    
    res.json({
      success: true,
      data: {
        pumpStatus: pumpStatus.isOn,
        autoMode: pumpStatus.autoMode,
        lastActivated: pumpStatus.lastActivated,
        totalRuntime: pumpStatus.totalRuntime
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil status pompa',
      error: error.message
    });
  }
});

// Control pump
app.post('/api/pump/control', (req, res) => {
  try {
    const { action } = req.body;
    
    if (!['start', 'stop', 'toggle'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action tidak valid. Gunakan: start, stop, atau toggle'
      });
    }
    
    const result = mockData.controlPump(action);
    
    res.json({
      success: true,
      message: `Pompa berhasil ${action === 'start' ? 'dinyalakan' : action === 'stop' ? 'dimatikan' : 'diubah'}`,
      pumpStatus: result.isOn,
      autoMode: result.autoMode
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengontrol pompa',
      error: error.message
    });
  }
});

// Set auto mode
app.post('/api/pump/auto-mode', (req, res) => {
  try {
    const { enabled } = req.body;
    
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Parameter enabled harus berupa boolean'
      });
    }
    
    const result = mockData.setAutoMode(enabled);
    
    res.json({
      success: true,
      message: `Mode otomatis ${enabled ? 'diaktifkan' : 'dinonaktifkan'}`,
      autoMode: result.autoMode,
      pumpStatus: result.isOn
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengubah mode otomatis',
      error: error.message
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Mock API Server berjalan dengan baik',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server',
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Mock API Server berjalan di http://localhost:${PORT}`);
  console.log('📊 Endpoints tersedia:');
  console.log('  GET  /api/sensor/current');
  console.log('  GET  /api/sensor/history/:hours');
  console.log('  GET  /api/system/status');
  console.log('  GET  /api/pump/status');
  console.log('  POST /api/pump/control');
  console.log('  POST /api/pump/auto-mode');
  console.log('  GET  /api/health');
  console.log('');
  console.log('✨ Mock data generator aktif dan menghasilkan data realistis');
});