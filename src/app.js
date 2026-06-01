const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');
const logger = require('./middlewares/logger.middleware');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'clave_secreta_demo',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: false // En producción con HTTPS debe cambiarse a true.
  }
}));

app.use(logger);
app.use(express.static('public'));

app.use('/api', authRoutes);
app.use('/api', ticketRoutes);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    mensaje: 'Ruta no encontrada.'
  });
});

app.use((error, req, res, next) => {
  console.error('[ERROR]', error);
  res.status(500).json({
    ok: false,
    mensaje: 'Error interno del servidor.'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});