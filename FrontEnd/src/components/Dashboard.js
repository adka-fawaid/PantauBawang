import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';
import ChartCard from './ChartCard';
import { useSensorData, useSystemStatus } from '../hooks/useApiData';
import LoadingSpinner from './LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { data: sensorData, loading, error, lastUpdate } = useSensorData();
  const { alerts } = useSystemStatus();
  const [showTimerPopup, setShowTimerPopup] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [pumpMode, setPumpMode] = useState('off'); // 'off', 'auto', 'manual'
  const [pumpStatus, setPumpStatus] = useState('Mati'); // 'Mati', 'Hidup'
  const [countdown, setCountdown] = useState(0);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [notification, setNotification] = useState(null);

  // Function to show colored notifications
  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (isCountdownActive && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown => {
          if (countdown <= 1) {
            // Timer selesai
            setPumpMode('off');
            setPumpStatus('Mati');
            setIsCountdownActive(false);
            showNotification('Penyiraman manual telah selesai! Pompa dihentikan otomatis.', 'success');
            return 0;
          }
          return countdown - 1;
        });
      }, 1000);
    } else if (countdown === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isCountdownActive, countdown]);

  // Handler untuk kontrol pompa
  const handlePumpControl = (mode) => {
    if (mode === 'auto') {
      // Aktifkan mode otomatis
      setPumpMode('auto');
      setPumpStatus('Hidup');
      setCountdown(0);
      setIsCountdownActive(false);
      console.log('Mengaktifkan mode otomatis');
      showNotification('Mode otomatis diaktifkan! Sistem akan menyiram otomatis berdasarkan sensor kelembaban.', 'success');
    } else if (mode === 'manual') {
      // Tampilkan popup timer untuk siram manual
      setShowTimerPopup(true);
    }
  };

  // Handler untuk konfirmasi siram manual
  const handleManualWatering = () => {
    const timeInSeconds = timerMinutes * 60;
    setPumpMode('manual');
    setPumpStatus('Hidup');
    setCountdown(timeInSeconds);
    setIsCountdownActive(true);
    setShowTimerPopup(false);
    console.log(`Memulai siram manual selama ${timerMinutes} menit`);
    showNotification(`Siram manual dimulai selama ${timerMinutes} menit`, 'success');
  };

  // Handler untuk batal siram manual  
  const handleCancelManual = () => {
    setShowTimerPopup(false);
  };

  // Handler untuk menghentikan pompa
  const handleStopPump = () => {
    setPumpMode('off');
    setPumpStatus('Mati');
    setCountdown(0);
    setIsCountdownActive(false);
    showNotification('Pompa telah dihentikan! Penyiraman dibatalkan.', 'warning');
  };

  // Format waktu countdown
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Tampilkan loading spinner saat data sedang dimuat
  if (loading && !sensorData) {
    return (
      <div className="dashboard loading-container">
        <LoadingSpinner />
        <p>Mengambil data sensor...</p>
      </div>
    );
  }

  // Tampilkan error jika gagal mengambil data
  if (error && !sensorData) {
    return (
      <div className="dashboard error-container">
        <div className="error-message">
          <h3>⚠️ Gagal Mengambil Data</h3>
          <p>{error}</p>
          <p>Pastikan backend server berjalan di port 5000</p>
        </div>
      </div>
    );
  }

  // Buat metrics dari data sensor real
  const metrics = sensorData ? [
    {
      title: "Suhu",
      value: sensorData.temperature?.toFixed(1) || "0",
      unit: "°C",
      subtitle: "Suhu Lingkungan",
      color: "orange",
      trend: { color: "#f59e0b" }
    },
    {
      title: "Kelembaban Tanah",
      value: sensorData.soilMoisture?.toFixed(1) || "0",
      unit: "%",
      subtitle: "Kelembaban Tanah",
      color: "green",
      trend: { color: "#10b981" }
    },
    {
      title: "Kelembaban Udara",
      value: sensorData.humidity?.toFixed(1) || "0",
      unit: "%",
      subtitle: "Kelembaban Udara",
      color: "purple",
      trend: { color: "#8b5cf6" }
    },
    {
      title: "Status Pompa",
      value: pumpStatus === 'Hidup' ? "ON" : "OFF",
      unit: "",
      subtitle: pumpMode === 'off' ? 'Tidak Aktif' : pumpMode === 'auto' ? 'Mode Otomatis' : 'Mode Manual',
      color: pumpStatus === 'Hidup' ? "blue" : "gray",
      trend: { color: pumpStatus === 'Hidup' ? "#3b82f6" : "#6b7280" }
    }
  ] : [];



  return (
    <div className="dashboard">
      {/* Header dengan styling sesuai gambar */}
      <div className="dashboard-header-wrapper">
        <div className="dashboard-header">
          <div className="header-title">
            <h1>Monitoring</h1>
            <div className="header-time">
              Rabu, 12 November 2025 pukul 14:34
            </div>
          </div>
          <div className="header-actions">
            <div className="logout-icon" title="Logout">
              ⤷
            </div>
          </div>
        </div>
      </div>



      {/* Dynamic Notifications */}
      {notification && (
        <div className={`notification-banner ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-info-icon">
              {notification.type === 'success' ? '✅' : 
               notification.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="notification-text">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="alerts-section">
          {alerts.map((alert, index) => (
            <div key={index} className={`alert alert-${alert.type}`}>
              <span className="alert-icon">⚠️</span>
              <span className="alert-message">{alert.message}</span>
              <span className="alert-time">
                {new Date(alert.timestamp).toLocaleTimeString('id-ID')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Pump Control Section dengan styling sesuai gambar */}
      <div className="pump-control-section">


        
        <div className="pump-controls">
          <button 
            className={`pump-btn auto-btn ${pumpMode === 'auto' ? 'active' : ''}`}
            onClick={() => pumpMode === 'auto' ? handleStopPump() : handlePumpControl('auto')}
            disabled={pumpMode === 'manual' && isCountdownActive}
          >
            <span className="btn-icon">🤖</span>
            Mode Otomatis
          </button>
          
          <button 
            className={`pump-btn ${pumpMode === 'manual' && isCountdownActive ? 'manual-btn-stop' : 'manual-btn'} ${pumpMode === 'manual' ? 'active' : ''}`}
            onClick={() => {
              if (pumpMode === 'manual' && isCountdownActive) {
                handleStopPump();
              } else {
                handlePumpControl('manual');
              }
            }}
            disabled={pumpMode === 'auto'}
          >
            <span className="btn-icon">
              {pumpMode === 'manual' && isCountdownActive ? '⏹️' : '⏱️'}
            </span>
            <span className="btn-text">
              {pumpMode === 'manual' && isCountdownActive 
                ? `Hentikan Penyiraman (${formatTime(countdown)})` 
                : 'Mode Manual'
              }
            </span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      {/* Charts Section - Advanced Real-time Charts */}
      <div className="charts-section">
        <ChartCard
          title="Suhu Lingkungan"
          subtitle="Data suhu dalam 24 jam terakhir"
          dataType="temperature"
          color="#f59e0b"
          unit="°C"
          showRealTime={true}
          timeRange={24}
        />
        <ChartCard
          title="Kelembaban Tanah" 
          subtitle="Data kelembaban tanah dalam 24 jam terakhir"
          dataType="soilMoisture"
          color="#10b981"
          unit="%"
          showRealTime={true}
          timeRange={24}
        />
        <ChartCard
          title="Kelembaban Udara"
          subtitle="Data kelembaban udara dalam 24 jam terakhir"
          dataType="humidity"
          color="#8b5cf6"
          unit="%"
          showRealTime={true}
          timeRange={24}
        />
      </div>
      
      {/* Error indicator jika ada masalah tapi masih ada data lama */}
      {error && sensorData && (
        <div className="error-footer">
          <p>⚠️ {error} - Menampilkan data terakhir</p>
        </div>
      )}

      {/* Timer Popup untuk Siram Manual */}
      {showTimerPopup && (
        <div className="popup-overlay">
          <div className="timer-popup">
            <div className="popup-header">
              <h3>⏱️ Atur Waktu Siram Manual</h3>
            </div>
            
            <div className="popup-content">
              <p>Pilih durasi penyiraman manual:</p>
              
              <div className="timer-input">
                <label htmlFor="timer">Durasi (menit):</label>
                <input
                  type="number"
                  id="timer"
                  min="1"
                  max="60"
                  value={timerMinutes}
                  onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 1)}
                  className="timer-field"
                />
              </div>
              
              <div className="timer-presets">
                <span className="preset-label">Preset:</span>
                <button 
                  className="preset-btn"
                  onClick={() => setTimerMinutes(2)}
                >
                  2 min
                </button>
                <button 
                  className="preset-btn"
                  onClick={() => setTimerMinutes(5)}
                >
                  5 min
                </button>
                <button 
                  className="preset-btn"
                  onClick={() => setTimerMinutes(10)}
                >
                  10 min
                </button>
                <button 
                  className="preset-btn"
                  onClick={() => setTimerMinutes(15)}
                >
                  15 min
                </button>
              </div>
            </div>
            
            <div className="popup-actions">
              <button 
                className="popup-btn cancel-btn"
                onClick={handleCancelManual}
              >
                Batal
              </button>
              <button 
                className="popup-btn confirm-btn"
                onClick={handleManualWatering}
              >
                💧 Mulai Siram ({timerMinutes} menit)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;