const btnAgregar = document.getElementById('btnAgregar');
const btnCargar = document.getElementById('btnCargar');
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
const estadoSesion = document.getElementById('estadoSesion');
const tablaTicketsBody = document.getElementById('tablaTicketsBody');
const mensaje = document.getElementById('mensaje');

// -------------------------
// BOTONES PRINCIPALES
// -------------------------
btnAgregar.addEventListener('click', () => {
  window.location.href = 'ingresar.html';
});

btnCargar.addEventListener('click', cargarTickets);

btnLogin.addEventListener('click', () => {
  window.location.href = 'login.html';
});

btnLogout.addEventListener('click', cerrarSesion);

// -------------------------
// INIT
// -------------------------
document.addEventListener('DOMContentLoaded', async () => {
  await verificarSesion();
  await cargarTickets();
});

// -------------------------
// CLICK GLOBAL (EDITAR / ELIMINAR)
// -------------------------
document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-eliminar')) {
    await eliminarTicket(e.target.dataset.id);
  }

  if (e.target.classList.contains('btn-actualizar')) {
    window.location.href = `ingresar.html?id=${e.target.dataset.id}`;
  }
});

// -------------------------
// VERIFICAR SESIÓN
// -------------------------
async function verificarSesion() {
  try {
    const response = await fetch('/api/auth/perfil', {
      credentials: 'include'
    });

    const data = await response.json();

    if (data.ok) {
      estadoSesion.textContent = `Sesión activa: ${data.usuario}`;
      btnLogin.style.display = 'none';
      btnLogout.style.display = 'inline-block';
    } else {
      mostrarSesionInactiva();
    }
  } catch (error) {
    mostrarSesionInactiva();
  }
}

function mostrarSesionInactiva() {
  estadoSesion.textContent = 'Sin sesión activa.';
  btnLogin.style.display = 'inline-block';
  btnLogout.style.display = 'none';
}

// -------------------------
// CARGAR TICKETS
// -------------------------
async function cargarTickets() {
  mensaje.innerHTML = '';

  try {
    const response = await fetch('/api/tickets', {
      credentials: 'include'
    });

    const data = await response.json();

    if (!data.ok || data.data.length === 0) {
      tablaTicketsBody.innerHTML = `
        <tr>
          <td colspan="11">No hay tickets registrados.</td>
        </tr>
      `;
      return;
    }

    tablaTicketsBody.innerHTML = data.data.map(ticket => `
      <tr>
        <td>${ticket.id}</td>
        <td>${ticket.nombreSolicitante}</td>
        <td>${ticket.correo}</td>
        <td>${ticket.categoria}</td>
        <td>${ticket.descripcion}</td>
        <td>${ticket.impacto}</td>
        <td>${ticket.urgencia}</td>
        <td>${ticket.tiempoEstimado} ${ticket.tiempoEstimado == 1 ? 'hora' : 'horas'}</td>
        <td>${ticket.estado}</td>
        <td>${ticket.prioridad}</td>
        <td>${formatearFecha(ticket.fechaCreacion)}</td>
        <td>
          <button class="btn-accion btn-actualizar" data-id="${ticket.id}">
            Actualizar
          </button>
          <button class="btn-accion btn-eliminar btn-peligro" data-id="${ticket.id}">
            Eliminar
          </button>
        </td>
      </tr>
    `).join('');

  } catch (error) {
    tablaTicketsBody.innerHTML = `
      <tr>
        <td colspan="11">Error al cargar los tickets.</td>
      </tr>
    `;
  }
}

// -------------------------
// ELIMINAR TICKET
// -------------------------
async function eliminarTicket(id) {
  if (!confirm('¿Desea eliminar este ticket?')) return;

  try {
    const response = await fetch(`/api/tickets/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    const data = await response.json();

    if (data.ok) {
      mensaje.innerHTML = `<p class="exito">${data.mensaje}</p>`;
      await cargarTickets();
    } else {
      mensaje.innerHTML = `<p class="error">${data.mensaje}</p>`;

      if (response.status === 401) {
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1200);
      }
    }
  } catch (error) {
    mensaje.innerHTML = '<p class="error">Error al eliminar el ticket.</p>';
  }
}

// -------------------------
// CERRAR SESIÓN
// -------------------------
async function cerrarSesion() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });

    const data = await response.json();

    mensaje.innerHTML = `<p class="exito">${data.mensaje}</p>`;
    await verificarSesion();

  } catch (error) {
    mensaje.innerHTML = '<p class="error">Error al cerrar sesión.</p>';
  }
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);

  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();

  const horas = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}