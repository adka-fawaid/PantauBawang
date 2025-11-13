const express = require('express');
const router = express.Router();
const MockSensorData = require('../utils/mockSensorData');

// Initialize mock data generator
const mockData = new MockSensorData();

// GET /api/sensors - Mendapatkan data sensor terkini
router.get('/', (req, res) => {
  try {
    const data = mockData.getCurrentReading();
    res.json({
      success: true,
      data: data,
      message: 'Data sensor berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data sensor',
      error: error.message
    });
  }
});

// GET /api/sensors/history - Mendapatkan data historis
router.get('/history', (req, res) => {
  try {
    const hours = parseInt(req.query.hours) || 24;
    const data = mockData.getHistoricalData(hours);
    
    res.json({
      success: true,
      data: data,
      message: `Data historis ${hours} jam terakhir`,
      count: data.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data historis',
      error: error.message
    });
  }
});

// GET /api/sensors/status - Mendapatkan status sistem dan alerts
router.get('/status', (req, res) => {
  try {
    const currentData = mockData.getCurrentReading();
    const systemStatus = mockData.getSystemStatus();
    const alerts = mockData.getAlerts();
    
    res.json({
      success: true,
      currentData: currentData,
      systemStatus: systemStatus,
      alerts: alerts,
      message: 'Status sistem berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil status sistem',
      error: error.message
    });
  }
});

module.exports = router;
module.exports.mockData = mockData;