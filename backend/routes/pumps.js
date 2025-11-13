const express = require('express');
const router = express.Router();
const MockSensorData = require('../utils/mockSensorData');

// Initialize mock data generator (should be shared instance)
let mockData;
try {
  // Try to get the same instance from sensors route
  mockData = require('./sensors').mockData;
} catch {
  // If not available, create new instance
  mockData = new MockSensorData();
}

// GET /api/pumps - Mendapatkan status pompa
router.get('/', (req, res) => {
  try {
    const pumpStatus = mockData.getPumpStatus();
    res.json({
      success: true,
      data: pumpStatus,
      message: 'Status pompa berhasil diambil'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil status pompa',
      error: error.message
    });
  }
});

// POST /api/pumps/control - Mengontrol pompa (nyala/mati)
router.post('/control', (req, res) => {
  try {
    const { action } = req.body; // 'start', 'stop', atau 'toggle'
    
    if (!action || !['start', 'stop', 'toggle', 'on', 'off'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action harus berupa "start", "stop", "toggle", "on", atau "off"'
      });
    }
    
    // Convert old format to new format
    let normalizedAction = action;
    if (action === 'on') normalizedAction = 'start';
    if (action === 'off') normalizedAction = 'stop';
    
    const result = mockData.controlPump(normalizedAction);
    
    res.json({
      success: true,
      data: result,
      message: `Pompa berhasil ${result.isOn ? 'dinyalakan' : 'dimatikan'}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengontrol pompa',
      error: error.message
    });
  }
});

// POST /api/pumps/auto-mode - Toggle mode otomatis
router.post('/auto-mode', (req, res) => {
  try {
    const { enabled } = req.body; // true atau false
    
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Parameter "enabled" harus berupa boolean'
      });
    }
    
    const result = mockData.setAutoMode(enabled);
    
    res.json({
      success: true,
      data: result,
      message: `Mode ${enabled ? 'otomatis' : 'manual'} berhasil diaktifkan`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengubah mode pompa',
      error: error.message
    });
  }
});

module.exports = router;