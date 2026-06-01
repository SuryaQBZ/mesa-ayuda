function requireAuth(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({
      ok: false,
      mensaje: 'Acceso denegado. Debes iniciar sesión.'
    });
  }

  next();
}

module.exports = requireAuth;