function login(req, res) {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Usuario y contraseña son obligatorios.'
    });
  }

  // Credenciales de demostración para la actividad.
  // En producción deben almacenarse de forma segura y la contraseña debe ir cifrada/hasheada.
  if (usuario !== 'admin' || password !== '1234') {
    return res.status(401).json({
      ok: false,
      mensaje: 'Credenciales incorrectas.'
    });
  }

  req.session.usuario = usuario;

  console.log(`[AUTH] Login exitoso para usuario: ${usuario}`);

  return res.status(200).json({
    ok: true,
    mensaje: 'Login exitoso.',
    usuario
  });
}

function logout(req, res) {
  const usuario = req.session?.usuario;

  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al cerrar la sesión.'
      });
    }

    res.clearCookie('connect.sid');
    console.log(`[AUTH] Sesión cerrada para usuario: ${usuario || 'desconocido'}`);

    return res.status(200).json({
      ok: true,
      mensaje: 'Sesión cerrada correctamente.'
    });
  });
}

function perfil(req, res) {
  return res.status(200).json({
    ok: true,
    mensaje: 'Acceso permitido. Sesión activa.',
    usuario: req.session.usuario
  });
}

module.exports = {
  login,
  logout,
  perfil
};
