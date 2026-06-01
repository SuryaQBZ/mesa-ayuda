const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const requireAuth = require('../middlewares/auth.middleware');

// Rutas públicas de lectura
router.get('/tickets', ticketController.listarTickets);
router.get('/tickets/:id', ticketController.obtenerTicketPorId);

// Rutas protegidas de escritura
router.post('/tickets', requireAuth, ticketController.agregarTicket);
router.put('/tickets/:id', requireAuth, ticketController.actualizarTicket);
router.delete('/tickets/:id', requireAuth, ticketController.eliminarTicket);

module.exports = router;