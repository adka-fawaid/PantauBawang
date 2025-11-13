// Mock data generator untuk simulasi sensor IoT
// Data sensor: Suhu, Kelembapan Tanah, Kelembapan Udara

class MockSensorData {
  constructor() {
    this.lastUpdate = new Date();
    this.baseValues = {
      temperature: 28, // Suhu dasar (Celsius)
      soilMoisture: 65, // Kelembapan tanah dasar (%)
      airHumidity: 70   // Kelembapan udara dasar (%)
    };
    this.pumpStatus = false;
    this.autoMode = true;
  }

  // Generate realistic sensor readings
  generateReading() {
    const now = new Date();
    const hour = now.getHours();
    
    // Simulasi pola harian yang realistis
    const temperatureVariation = this.getTemperatureVariation(hour);
    const humidityVariation = this.getHumidityVariation(hour);
    
    // Generate data dengan variasi natural
    const temperature = this.baseValues.temperature + temperatureVariation + (Math.random() - 0.5) * 2;
    const airHumidity = this.baseValues.airHumidity + humidityVariation + (Math.random() - 0.5) * 5;
    
    // Kelembapan tanah dipengaruhi pompa
    let soilMoisture = this.baseValues.soilMoisture;
    if (this.pumpStatus) {
      soilMoisture += 10 + Math.random() * 5; // Naik saat pompa nyala
    } else {
      soilMoisture -= 0.5 + Math.random() * 2; // Turun perlahan
    }
    
    // Batas nilai realistis
    const clampedData = {
      temperature: Math.max(20, Math.min(40, temperature)),
      soilMoisture: Math.max(30, Math.min(90, soilMoisture)),
      airHumidity: Math.max(40, Math.min(95, airHumidity)),
      timestamp: now.toISOString(),
      pumpStatus: this.pumpStatus,
      autoMode: this.autoMode
    };
    
    // Update base values perlahan
    this.baseValues.soilMoisture = clampedData.soilMoisture;
    this.lastUpdate = now;
    
    return clampedData;
  }
  
  // Pola suhu harian (lebih panas siang, sejuk malam)
  getTemperatureVariation(hour) {
    if (hour >= 6 && hour <= 12) {
      return (hour - 6) * 1.5; // Naik di pagi
    } else if (hour > 12 && hour <= 18) {
      return 9 - (hour - 12) * 0.5; // Turun di sore
    } else {
      return -3 - Math.sin(hour * Math.PI / 12) * 2; // Sejuk malam
    }
  }
  
  // Pola kelembapan udara harian (tinggi pagi/malam, rendah siang)
  getHumidityVariation(hour) {
    if (hour >= 6 && hour <= 12) {
      return -10 + (hour - 6) * -1; // Turun di pagi
    } else if (hour > 12 && hour <= 18) {
      return -16 + (hour - 12) * 1; // Naik kembali sore
    } else {
      return Math.sin(hour * Math.PI / 12) * 5; // Tinggi malam
    }
  }
  
  // Kontrol pompa
  setPumpStatus(status) {
    this.pumpStatus = status;
    return {
      success: true,
      message: `Pompa ${status ? 'dinyalakan' : 'dimatikan'}`,
      pumpStatus: this.pumpStatus,
      timestamp: new Date().toISOString()
    };
  }
  
  // Auto mode toggle
  setAutoMode(auto) {
    this.autoMode = auto;
    return {
      success: true,
      message: `Mode ${auto ? 'otomatis' : 'manual'} diaktifkan`,
      autoMode: this.autoMode,
      timestamp: new Date().toISOString()
    };
  }
  
  // Generate historical data
  generateHistoricalData(hours = 24) {
    const data = [];
    const now = new Date();
    
    for (let i = hours; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const hour = timestamp.getHours();
      
      const tempVar = this.getTemperatureVariation(hour);
      const humVar = this.getHumidityVariation(hour);
      
      data.push({
        temperature: Math.round((this.baseValues.temperature + tempVar + (Math.random() - 0.5) * 1.5) * 10) / 10,
        soilMoisture: Math.round((this.baseValues.soilMoisture + (Math.random() - 0.5) * 5) * 10) / 10,
        airHumidity: Math.round((this.baseValues.airHumidity + humVar + (Math.random() - 0.5) * 3) * 10) / 10,
        timestamp: timestamp.toISOString()
      });
    }
    
    return data;
  }
  
  // Get status dan alerts
  getSystemStatus() {
    const currentData = this.generateReading();
    const alerts = [];
    
    // Generate alerts berdasarkan kondisi
    if (currentData.soilMoisture < 40) {
      alerts.push({
        type: 'warning',
        message: 'Kelembapan tanah rendah, pertimbangkan penyiraman',
        timestamp: new Date().toISOString()
      });
    }
    
    if (currentData.temperature > 35) {
      alerts.push({
        type: 'warning',
        message: 'Suhu tinggi terdeteksi',
        timestamp: new Date().toISOString()
      });
    }
    
    if (currentData.airHumidity < 50) {
      alerts.push({
        type: 'info',
        message: 'Kelembapan udara rendah',
        timestamp: new Date().toISOString()
      });
    }
    
    return {
      currentData,
      alerts,
      systemHealth: 'good',
      lastUpdate: new Date().toISOString()
    };
  }
}

module.exports = new MockSensorData();