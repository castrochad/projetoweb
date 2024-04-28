function autenticacaoMiddleware(req, res, next) {
  if (req.session.usuario) {
    // O usuário está autenticado, continue com a solicitação
    req.user = req.session.usuario; // Defina req.user com as informações do usuário
    next();
  } else {
    // O usuário não está autenticado, redirecione para a página de login
    res.redirect('/autenticacao');
  }
}

module.exports = autenticacaoMiddleware;