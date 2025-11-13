class MockSensorData {
  constructor() {
    this.currentData = {
      temperature: 26.5,
      humidity: 65.2,
      soilMoisture: 45.8,
      timestamp: new Date()
    };
    
    this.pumpStatus = {
      isOn: false,
      autoMode: true,
      lastActivated: new Date(Date.now() - 3600000), // 1 hour ago
      totalRuntime: 0
    };
    
    this.historicalDataCache = [];
    this.alerts = [];
    
    // Generate initial historical data
    this.generateHistoricalData();
    
    // Start real-time data simulation
    this.startDataSimulation();
  }

  generateHistoricalData() {
    const now = new Date();
    const hoursToGenerate = 48; // 2 days of data
    
    for (let i = hoursToGenerate; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 15 * 60 * 1000)); // Every 15 minutes
      
      // Daily patterns - warmer during day, cooler at night
      const hour = timestamp.getHours();
      const dayFactor = Math.sin((hour - 6) * Math.PI / 12); // Peak at noon
      
      // Base temperature with daily variation
      const baseTemp = 26 + (dayFactor * 4) + (Math.random() - 0.5) * 2;
      
      // Humidity inversely related to temperature
      const baseHumidity = 70 - (dayFactor * 15) + (Math.random() - 0.5) * 10;
      
      // Soil moisture decreases over time, increases when pump runs
      const moistureDecay = Math.max(0, 80 - (i * 0.5) + (Math.random() - 0.5) * 5);
      
      const dataPoint = {
        temperature: Math.max(15, Math.min(40, baseTemp)),
        humidity: Math.max(30, Math.min(90, baseHumidity)),
        soilMoisture: Math.max(20, Math.min(85, moistureDecay)),
        timestamp: timestamp.toISOString()
      };
      
      this.historicalDataCache.push(dataPoint);
    }
    
    // Update current data to latest point
    const latest = this.historicalDataCache[this.historicalDataCache.length - 1];
    this.currentData = {
      ...latest,
      timestamp: new Date()
    };
  }

  startDataSimulation() {
    // Update data every 5 seconds
    setInterval(() => {
      this.updateCurrentData();
      this.checkAutoWatering();
    }, 5000);
    
    // Add new historical point every 15 minutes
    setInterval(() => {
      this.addHistoricalPoint();
    }, 15 * 60 * 1000);
  }

  updateCurrentData() {
    const now = new Date();
    const hour = now.getHours();
    const dayFactor = Math.sin((hour - 6) * Math.PI / 12);
    
    // Gradual changes to simulate real sensors
    this.currentData.temperature += (Math.random() - 0.5) * 0.5;
    this.currentData.humidity += (Math.random() - 0.5) * 1;
    this.currentData.soilMoisture += (Math.random() - 0.5) * 0.3;
    
    // Apply daily patterns
    this.currentData.temperature = Math.max(15, Math.min(40, 
      26 + (dayFactor * 4) + (Math.random() - 0.5) * 0.5));
    
    this.currentData.humidity = Math.max(30, Math.min(90,
      70 - (dayFactor * 15) + (Math.random() - 0.5) * 1));
    
    // Soil moisture decreases over time
    if (!this.pumpStatus.isOn) {
      this.currentData.soilMoisture = Math.max(20, this.currentData.soilMoisture - 0.02);
    } else {
      // Pump is on, increase soil moisture
      this.currentData.soilMoisture = Math.min(85, this.currentData.soilMoisture + 0.5);
    }
    
    this.currentData.timestamp = now;
    
    // Update alerts
    this.updateAlerts();
  }

  addHistoricalPoint() {
    const newPoint = {
      temperature: this.currentData.temperature,
      humidity: this.currentData.humidity,
      soilMoisture: this.currentData.soilMoisture,
      timestamp: new Date().toISOString()
    };
    
    this.historicalDataCache.push(newPoint);
    
    // Keep only last 48 hours (192 points at 15-min intervals)
    if (this.historicalDataCache.length > 192) {
      this.historicalDataCache = this.historicalDataCache.slice(-192);
    }
  }

  checkAutoWatering() {
    if (this.pumpStatus.autoMode && this.currentData.soilMoisture < 30) {
      if (!this.pumpStatus.isOn) {
        console.log('🤖 Auto-watering activated: Soil moisture low');
        this.controlPump('start');
      }
    } else if (this.pumpStatus.autoMode && this.currentData.soilMoisture > 70 && this.pumpStatus.isOn) {
      console.log('🤖 Auto-watering deactivated: Soil moisture sufficient');
      this.controlPump('stop');
    }
  }

  updateAlerts() {
    this.alerts = [];
    
    if (this.currentData.temperature > 35) {
      this.alerts.push({
        type: 'warning',
        message: 'Suhu terlalu tinggi',
        value: this.currentData.temperature,
        timestamp: new Date().toISOString()
      });
    }
    
    if (this.currentData.humidity < 40) {
      this.alerts.push({
        type: 'info',
        message: 'Kelembaban udara rendah',
        value: this.currentData.humidity,
        timestamp: new Date().toISOString()
      });
    }
    
    if (this.currentData.soilMoisture < 25) {
      this.alerts.push({
        type: 'critical',
        message: 'Kelembaban tanah sangat rendah',
        value: this.currentData.soilMoisture,
        timestamp: new Date().toISOString()
      });
    }
  }

  getCurrentReading() {
    return {
      temperature: Math.round(this.currentData.temperature * 10) / 10,
      humidity: Math.round(this.currentData.humidity * 10) / 10,
      soilMoisture: Math.round(this.currentData.soilMoisture * 10) / 10,
      timestamp: this.currentData.timestamp.toISOString()
    };
  }

  getHistoricalData(hours = 24) {
    const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
    
    return this.historicalDataCache
      .filter(point => new Date(point.timestamp) >= cutoffTime)
      .map(point => ({
        temperature: Math.round(point.temperature * 10) / 10,
        humidity: Math.round(point.humidity * 10) / 10,
        soilMoisture: Math.round(point.soilMoisture * 10) / 10,
        timestamp: point.timestamp
      }));
  }

  getSystemStatus() {
    return {
      operational: true,
      lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      sensorCount: 3,
      uptime: Math.floor(process.uptime()),
      memoryUsage: process.memoryUsage()
    };
  }

  getPumpStatus() {
    return {
      isOn: this.pumpStatus.isOn,
      autoMode: this.pumpStatus.autoMode,
      lastActivated: this.pumpStatus.lastActivated.toISOString(),
      totalRuntime: this.pumpStatus.totalRuntime
    };
  }

  controlPump(action) {
    const now = new Date();
    
    switch (action) {
      case 'start':
        if (!this.pumpStatus.isOn) {
          this.pumpStatus.isOn = true;
          this.pumpStatus.lastActivated = now;
          console.log('💧 Pump started');
        }
        break;
        
      case 'stop':
        if (this.pumpStatus.isOn) {
          this.pumpStatus.isOn = false;
          this.pumpStatus.totalRuntime += (now - this.pumpStatus.lastActivated) / 1000;
          console.log('💧 Pump stopped');
        }
        break;
        
      case 'toggle':
        this.controlPump(this.pumpStatus.isOn ? 'stop' : 'start');
        break;
    }
    
    return this.getPumpStatus();
  }

  setAutoMode(enabled) {
    this.pumpStatus.autoMode = enabled;
    console.log(`🤖 Auto mode ${enabled ? 'enabled' : 'disabled'}`);
    
    if (!enabled && this.pumpStatus.isOn) {
      // If auto mode is disabled and pump is on, keep it on but log it
      console.log('💧 Pump remains on in manual mode');
    }
    
    return this.getPumpStatus();
  }

  getAlerts() {
    return this.alerts;
  }
}

module.exports = MockSensorData;