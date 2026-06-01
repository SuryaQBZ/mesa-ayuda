const pool = require('../config/db');

async function insertarTicket(ticket) {
  const sql = `
    INSERT INTO tickets (nombreSolicitante, correo, categoria, descripcion, impacto, urgencia, tiempoEstimado, estado, prioridad)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    ticket.nombreSolicitante,
    ticket.correo,
    ticket.categoria,
    ticket.descripcion,
    ticket.impacto,
    ticket.urgencia,
    ticket.tiempoEstimado,
    ticket.estado,
    ticket.prioridad
  ];

  const [result] = await pool.execute(sql, values);
  return result;
}

async function obtenerTodosLosTickets() {
  const sql = `
    SELECT id, nombreSolicitante, correo, categoria, descripcion, impacto, urgencia, tiempoEstimado, estado, prioridad, fechaCreacion
    FROM tickets
    ORDER BY id DESC
  `;

  const [rows] = await pool.execute(sql);
  return rows;
}

async function buscarPorId(id) {
  const sql = `
    SELECT id, nombreSolicitante, correo, categoria, descripcion, impacto, urgencia, tiempoEstimado, estado, prioridad, fechaCreacion
    FROM tickets
    WHERE id = ?
  `;

  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
}

async function actualizarTicket(id, ticket) {
  const sql = `
    UPDATE tickets
    SET nombreSolicitante = ?, correo = ?, categoria = ?, descripcion = ?, impacto = ?, urgencia = ?, tiempoEstimado = ?, estado = ?, prioridad = ?
    WHERE id = ?
  `;

  const values = [
    ticket.nombreSolicitante,
    ticket.correo,
    ticket.categoria,
    ticket.descripcion,
    ticket.impacto,
    ticket.urgencia,
    ticket.tiempoEstimado,
    ticket.estado,
    ticket.prioridad,
    id
  ];

  const [result] = await pool.execute(sql, values);
  return result;
}

async function eliminarTicket(id) {
  const sql = 'DELETE FROM tickets WHERE id = ?';
  const [result] = await pool.execute(sql, [id]);
  return result;
}

module.exports = {
  insertarTicket,
  obtenerTodosLosTickets,
  buscarPorId,
  actualizarTicket,
  eliminarTicket
};
