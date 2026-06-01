const formLogin = document.getElementById('formLogin');
const mensaje = document.getElementById('mensaje');
const btnVolver = document.getElementById('btnVolver');

btnVolver.addEventListener('click', () => {
  window.location.href = '/';
});

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ usuario, password })
    });

    const data = await response.json();

    if (data.ok) {
      mensaje.innerHTML = `<p class="exito">${data.mensaje}</p>`;
      setTimeout(() => { window.location.href = '/'; }, 700);
    } else {
      mensaje.innerHTML = `<p class="error">${data.mensaje}</p>`;
    }
  } catch (error) {
    mensaje.innerHTML = '<p class="error">Error de conexión con el servidor.</p>';
  }
});
