const ticketModel = require('../models/ticketModel');

/* -------------------------
   VALIDACIONES AUXILIARES
--------------------------*/

function validarEmail(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function validarImpacto(valor) {
  return ['bajo', 'medio', 'alto'].includes(valor);
}

function validarUrgencia(valor) {
  return ['baja', 'media', 'alta'].includes(valor);
}

function validarEstado(valor) {
  return ['pendiente', 'en proceso', 'resuelto'].includes(valor);
}

function validarCampos(ticket) {
  const {
    nombreSolicitante,
    correo,
    categoria,
    descripcion,
    impacto,
    urgencia,
    estado
  } = ticket;

  if (
    !nombreSolicitante ||
    !correo ||
    !categoria ||
    !descripcion ||
    !impacto ||
    !urgencia ||
    !estado
  ) {
    throw new Error('Campos obligatorios incompletos.');
  }

  if (!validarEmail(correo)) {
    throw new Error('Formato de correo inválido.');
  }

  if (!validarImpacto(impacto)) {
    throw new Error('Valor de impacto inválido.');
  }

  if (!validarUrgencia(urgencia)) {
    throw new Error('Valor de urgencia inválido.');
  }

  if (!validarEstado(estado)) {
    throw new Error('Valor de estado inválido');
  }
}

/* -------------------------
   CÁLCULO DE PRIORIDAD
--------------------------*/

function calcularPrioridad(ticket) {
  let puntaje = 0;

  // impacto
  if (ticket.impacto === 'bajo') puntaje += 1;
  if (ticket.impacto === 'medio') puntaje += 2;
  if (ticket.impacto === 'alto') puntaje += 3;

  // urgencia
  if (ticket.urgencia === 'baja') puntaje += 1;
  if (ticket.urgencia === 'media') puntaje += 2;
  if (ticket.urgencia === 'alta') puntaje += 3;

  // bonus categoría
  if (
    ticket.categoria?.toLowerCase() === 'red' ||
    ticket.categoria?.toLowerCase() === 'cuenta'
  ) {
    puntaje += 1;
  }

  // bonus tiempo
  if (Number(ticket.tiempoEstimado) > 4) {
    puntaje += 1;
  }

  if (puntaje <= 3) return 'baja';
  if (puntaje <= 5) return 'media';
  if (puntaje === 6) return 'alta';
  return 'crítica';
}

/* -------------------------
   SERVICIOS CRUD
--------------------------*/

async function crearTicket(ticket) {
  validarCampos(ticket);

  const prioridad = calcularPrioridad(ticket);

  const nuevoTicket = {
    ...ticket,
    prioridad,
    estado: ticket.estado || 'pendiente'
  };

  const result = await ticketModel.insertarTicket(nuevoTicket);
  return result;
}

async function listarTickets() {
  return await ticketModel.obtenerTodosLosTickets();
}

async function obtenerTicketPorId(id) {
  const ticket = await ticketModel.buscarPorId(id);

  if (!ticket) {
    throw new Error('Ticket no encontrado');
  }

  return ticket;
}

async function actualizarTicket(id, ticket) {
  const existente = await ticketModel.buscarPorId(id);

  if (!existente) {
    throw new Error('Ticket no encontrado');
  }

  validarCampos(ticket);

  const prioridad = calcularPrioridad(ticket);

  const actualizado = {
    ...ticket,
    prioridad
  };

  await ticketModel.actualizarTicket(id, actualizado);

  return actualizado;
}

async function eliminarTicket(id) {
  const existente = await ticketModel.buscarPorId(id);

  if (!existente) {
    throw new Error('Ticket no encontrado');
  }

  return await ticketModel.eliminarTicket(id);
}

module.exports = {
  crearTicket,
  listarTickets,
  obtenerTicketPorId,
  actualizarTicket,
  eliminarTicket
};