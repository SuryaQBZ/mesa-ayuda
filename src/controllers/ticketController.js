const ticketService = require('../services/ticketService');

async function agregarTicket(req, res) {
  try {
    const nuevoTicket = await ticketService.crearTicket(req.body);

    res.status(201).json({
      ok: true,
      mensaje: 'Ticket registrado correctamente.',
      data: nuevoTicket
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      mensaje: error.message
    });
  }
}

async function listarTickets(req, res) {
  try {
    const tickets = await ticketService.listarTickets();

    res.status(200).json({
      ok: true,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error al listar tickets.'
    });
  }
}

async function obtenerTicketPorId(req, res) {
  try {
    const { id } = req.params;
    const ticket = await ticketService.obtenerTicketPorId(id);

    res.status(200).json({
      ok: true,
      data: ticket
    });
  } catch (error) {
    res.status(404).json({
      ok: false,
      mensaje: error.message
    });
  }
}

async function actualizarTicket(req, res) {
  try {
    const { id } = req.params;
    const ticketActualizado = await ticketService.actualizarTicket(id, req.body);

    res.status(200).json({
      ok: true,
      mensaje: 'Ticket actualizado correctamente.',
      data: ticketActualizado
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      mensaje: error.message
    });
  }
}

async function eliminarTicket(req, res) {
  try {
    const { id } = req.params;
    await ticketService.eliminarTicket(id);

    res.status(200).json({
      ok: true,
      mensaje: 'Ticket eliminado correctamente.'
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      mensaje: error.message
    });
  }
}

module.exports = {
  agregarTicket,
  listarTickets,
  obtenerTicketPorId,
  actualizarTicket,
  eliminarTicket
};
