# PantauFarm Frontend Integration Guide

Dokumentasi integrasi frontend dengan backend API untuk sistem monitoring pertanian IoT.

## 🚀 Quick Start

1. **Pastikan Backend Berjalan**
   ```bash
   # Di folder backend
   cd backend
   npm run dev
   ```
   Backend akan berjalan di `http://localhost:5000`

2. **Jalankan Frontend**
   ```bash
   # Di folder FrontEnd
   npm start
   ```
   Frontend akan berjalan di `http://localhost:3000`

## 📊 Fitur Data Real-Time

### Data Sensor yang Ditampilkan
- **Suhu** - Suhu lingkungan dalam Celsius (°C)
- **Kelembaban Tanah** - Persentase kelembaban tanah (%)  
- **Kelembaban Udara** - Persentase kelembaban udara (%)
- **Status Pompa** - Status pompa (ON/OFF) dan mode (Manual/Otomatis)

### Auto-Update
- Data sensor diperbarui setiap **5 detik** secara otomatis
- Indikator koneksi menunjukkan status real-time
- Timestamp menampilkan waktu update terakhir

## 🔧 Cara Penggunaan API

### 1. Import Hooks
```javascript
import { useSensorData, useSystemStatus, usePumpControl } from '../hooks/useApiData';
```

### 2. Gunakan di Component
```javascript
const Dashboard = () => {
  const { data: sensorData, loading, error, lastUpdate } = useSensorData();
  const { alerts } = useSystemStatus();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>Suhu: {sensorData.temperature}°C</h2>
      <h2>Kelembaban Tanah: {sensorData.soilMoisture}%</h2>
      <h2>Kelembaban Udara: {sensorData.airHumidity}%</h2>
    </div>
  );
};
```

### 3. Kontrol Pompa
```javascript
const PumpControl = () => {
  const { pumpStatus, autoMode, controlPump, toggleAutoMode } = usePumpControl();
  
  const handlePumpToggle = async () => {
    try {
      await controlPump(pumpStatus ? 'off' : 'on');
      alert('Pompa berhasil diubah!');
    } catch (error) {
      alert('Gagal mengubah pompa: ' + error.message);
    }
  };
  
  return (
    <div>
      <button onClick={handlePumpToggle}>
        {pumpStatus ? 'Matikan' : 'Nyalakan'} Pompa
      </button>
    </div>
  );
};
```

## 📁 Struktur File API

```
src/
├── config/
│   └── api.js              # Konfigurasi API endpoints
├── services/
│   └── apiService.js       # Service untuk berkomunikasi dengan backend
├── hooks/
│   └── useApiData.js       # Custom hooks untuk state management
└── components/
    └── Dashboard.js        # Contoh penggunaan real data
```

## 🛠️ Konfigurasi

### Environment Variables
Buat file `.env` di root folder FrontEnd:
```
REACT_APP_API_URL=http://localhost:5000
```

### API Configuration
Edit `src/config/api.js` untuk menyesuaikan:
```javascript
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  POLLING_INTERVAL: 5000, // Update setiap 5 detik
  TIMEOUT: 10000 // Timeout 10 detik
};
```

## 🔍 Debugging

### Jika Data Tidak Muncul
1. **Cek Console Browser** - Lihat error di Developer Tools
2. **Cek Backend** - Pastikan server backend berjalan di port 5000
3. **Test API Manual** - Buka `http://localhost:5000/api/sensors` di browser
4. **Cek Network Tab** - Lihat apakah request API berhasil

### Status Indikator
- 🟢 **Hijau (Terhubung)** - Data berhasil diambil dari backend
- 🔴 **Merah (Tidak Terhubung)** - Gagal mengambil data dari backend

## 📈 Data Flow

```
Backend Mock API → Frontend Service → Custom Hooks → React Components → UI
```

1. **Backend** menggenerate data sensor dummy yang realistis
2. **apiService** mengambil data melalui HTTP requests
3. **useApiData hooks** mengelola state dan auto-refresh
4. **Components** menampilkan data di UI
5. **Auto-refresh** setiap 5 detik untuk simulasi real-time

## 🚀 Next Steps

### Untuk Integrasi IoT Sungguhan:
1. **Ganti Backend API** dengan endpoint sensor IoT asli
2. **Update apiService** sesuai format data IoT
3. **Tambahkan WebSocket** untuk real-time updates yang lebih cepat
4. **Implementasi Database** untuk penyimpanan historical data

### Fitur Tambahan yang Bisa Ditambahkan:
- **Historical Charts** dengan data 24 jam terakhir  
- **Pump Control Panel** untuk kontrol pompa manual
- **Alert System** dengan notifikasi push
- **Data Export** untuk analisis lebih lanjut

## 💡 Tips Development

- Data dummy dirancang **realistis** dengan pola harian
- **Error handling** sudah diimplementasi di semua level
- **Loading states** untuk UX yang baik
- **Responsive design** support mobile dan desktop
- **TypeScript ready** - mudah upgrade ke TypeScript

Sekarang frontend Anda sudah terintegrasi dengan backend API dan menampilkan data sensor IoT yang realistis! 🌱