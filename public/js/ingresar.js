const formTicket = document.getElementById('formTicket');
const mensaje = document.getElementById('mensaje');
const btnVolver = document.getElementById('btnVolver');
const tituloFormulario = document.getElementById('tituloFormulario');
const btnGuardar = document.getElementById('btnGuardar');

const parametros = new URLSearchParams(window.location.search);
const ticketId = parametros.get('id');
const modoEdicion = ticketId !== null;

// volver al listado
btnVolver.addEventListener('click', () => {
  window.location.href = '/';
});

document.addEventListener('DOMContentLoaded', async () => {
  await verificarAcceso();

  if (modoEdicion) {
    tituloFormulario.textContent = 'Actualizar Ticket';
    btnGuardar.textContent = 'Actualizar';
    await cargarTicketParaEditar(ticketId);
  }
});

// -------------------------
// VERIFICAR SESIÓN
// -------------------------
async function verificarAcceso() {
  try {
    const response = await fetch('/api/auth/perfil', {
      credentials: 'include'
    });

    const data = await response.json();

    if (!data.ok) {
      mensaje.innerHTML = `<p class="error">${data.mensaje}</p>`;
      formTicket.style.display = 'none';

      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1200);
    }
  } catch (error) {
    mensaje.innerHTML = '<p class="error">No se pudo validar la sesión.</p>';
    formTicket.style.display = 'none';
  }
}

// -------------------------
// SUBMIT FORM
// -------------------------
formTicket.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombreSolicitante = document.getElementById('nombreSolicitante').value.trim();
  const correo = document.getElementById('correo').value.trim();
  const categoria = document.getElementById('categoria').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const impacto = document.getElementById('impacto').value.trim();
  const urgencia = document.getElementById('urgencia').value.trim();
  const tiempoEstimado = document.getElementById('tiempoEstimado').value.trim();
  const estado = document.getElementById('estado').value.trim();

  if (!nombreSolicitante || !correo || !categoria || !descripcion || !impacto || !urgencia) {
    mensaje.innerHTML = '<p class="error">Campos obligatorios incompletos.</p>';
    return;
  }

  const payload = {
    nombreSolicitante,
    correo,
    categoria,
    descripcion,
    impacto,
    urgencia,
    tiempoEstimado,
    estado: estado || 'pendiente'
  };

  const url = modoEdicion
    ? `/api/tickets/${ticketId}`
    : '/api/tickets';

  const metodo = modoEdicion ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.ok) {
      mensaje.innerHTML = `<p class="exito">${data.mensaje}</p>`;

      if (!modoEdicion) formTicket.reset();

      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      mensaje.innerHTML = `<p class="error">${data.mensaje}</p>`;

      if (response.status === 401) {
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
      }
    }
  } catch (error) {
    mensaje.innerHTML = '<p class="error">Error de conexión con el servidor.</p>';
  }
});

// -------------------------
// CARGAR TICKET PARA EDITAR
// -------------------------
async function cargarTicketParaEditar(id) {
  try {
    const response = await fetch(`/api/tickets/${id}`, {
      credentials: 'include'
    });

    const data = await response.json();

    if (!data.ok) {
      mensaje.innerHTML = `<p class="error">${data.mensaje}</p>`;
      formTicket.style.display = 'none';
      return;
    }

    const t = data.data;

    document.getElementById('nombreSolicitante').value = t.nombreSolicitante;
    document.getElementById('correo').value = t.correo;
    document.getElementById('categoria').value = t.categoria;
    document.getElementById('descripcion').value = t.descripcion;
    document.getElementById('impacto').value = t.impacto;
    document.getElementById('urgencia').value = t.urgencia;
    document.getElementById('tiempoEstimado').value = t.tiempoEstimado;
    document.getElementById('estado').value = t.estado;
    document.getElementById('prioridad').value = t.prioridad;

  } catch (error) {
    mensaje.innerHTML = '<p class="error">Error al cargar el ticket.</p>';
    formTicket.style.display = 'none';
  }
}