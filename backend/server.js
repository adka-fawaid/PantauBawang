const express = require('express');
const cors = require('cors');
const sensorRoutes = require('./routes/sensors');
const pumpRoutes = require('./routes/pumps');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sensors', sensorRoutes);
app.use('/api/pumps', pumpRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'PantauFarm API Server',
    version: '1.0.0',
    endpoints: {
      sensors: '/api/sensors',
      pumps: '/api/pumps'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🌱 PantauFarm API Server running on port ${PORT}`);
  console.log(`📊 Sensor data available at: http://localhost:${PORT}/api/sensors`);
  console.log(`💧 Pump control available at: http://localhost:${PORT}/api/pumps`);
});