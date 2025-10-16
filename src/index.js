const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'API Manual Pós-Obras - v1.0.0', 
    status: 'online',
    endpoints: {
      auth: '/api/auth',
      properties: '/api/properties',
      maintenances: '/api/maintenances',
      documents: '/api/documents',
      pathologies: '/api/pathologies',
      notifications: '/api/notifications'
    }
  });
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/properties', require('./routes/property.routes'));
app.use('/api/maintenances', require('./routes/maintenance.routes'));
app.use('/api/documents', require('./routes/document.routes'));
app.use('/api/pathologies', require('./routes/pathology.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado!' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

