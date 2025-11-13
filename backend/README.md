# PantauFarm Backend API

Backend API untuk sistem monitoring pertanian IoT dengan data dummy/mock untuk simulasi sensor.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start server (production)
npm start

# Start server dengan auto-reload (development)
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## 📡 API Endpoints

### Sensor Data

#### GET /api/sensors
Mengambil data sensor terkini (real-time)

**Response:**
```json
{
  "success": true,
  "data": {
    "temperature": 29.5,
    "soilMoisture": 67.2,
    "airHumidity": 72.8,
    "timestamp": "2025-11-13T10:30:00.000Z",
    "pumpStatus": false,
    "autoMode": true
  },
  "message": "Data sensor berhasil diambil"
}
```

#### GET /api/sensors/history?hours=24
Mengambil data historis sensor

**Query Parameters:**
- `hours` (optional): Jumlah jam data historis (default: 24)

#### GET /api/sensors/status
Mengambil status sistem dan alerts

**Response:**
```json
{
  "success": true,
  "currentData": {...},
  "alerts": [
    {
      "type": "warning",
      "message": "Kelembapan tanah rendah",
      "timestamp": "2025-11-13T10:30:00.000Z"
    }
  ],
  "systemHealth": "good",
  "lastUpdate": "2025-11-13T10:30:00.000Z"
}
```

### Pump Control

#### GET /api/pumps
Mengambil status pompa

#### POST /api/pumps/control
Mengontrol pompa (nyala/mati)

**Request Body:**
```json
{
  "action": "on" // atau "off"
}
```

#### POST /api/pumps/auto-mode
Toggle mode otomatis pompa

**Request Body:**
```json
{
  "enabled": true // atau false
}
```

## 📊 Data Sensor

Sistem mensimulasikan 3 sensor utama:

1. **Suhu (Temperature)** - Celsius (20-40°C)
2. **Kelembapan Tanah (Soil Moisture)** - Persentase (30-90%)
3. **Kelembapan Udara (Air Humidity)** - Persentase (40-95%)

### Simulasi Realistis

- **Pola Harian**: Suhu naik di siang hari, kelembapan udara tinggi di pagi/malam
- **Efek Pompa**: Kelembapan tanah naik saat pompa aktif
- **Variasi Natural**: Data berfluktuasi secara natural dengan noise
- **Alerts**: Sistem memberikan peringatan berdasarkan threshold

## 🔧 Development

### Struktur Project
```
backend/
├── server.js          # Main server file
├── data/
│   └── mockSensorData.js    # Mock data generator
├── routes/
│   ├── sensors.js     # Sensor endpoints
│   └── pumps.js       # Pump control endpoints
└── utils/             # Utilities (future use)
```

### Environment Variables
Buat file `.env` untuk konfigurasi:
```
PORT=5000
NODE_ENV=development
```

## 🌱 Future Integration

API ini dirancang untuk mudah diganti dengan sensor IoT sungguhan:

1. **Ganti MockSensorData** dengan connector ke hardware
2. **Update routes** untuk komunikasi dengan device
3. **Tambahkan database** untuk penyimpanan data
4. **Implementasi WebSocket** untuk real-time updates

## 📝 Testing

Test API menggunakan tools seperti Postman atau curl:

```bash
# Test sensor data
curl http://localhost:5000/api/sensors

# Test pump control
curl -X POST http://localhost:5000/api/pumps/control \
  -H "Content-Type: application/json" \
  -d '{"action": "on"}'
```