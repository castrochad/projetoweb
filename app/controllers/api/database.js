const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // Altere para o endereço IP ou o nome do host do seu servidor de banco de dados
  database: 'denunciacerta', // Altere para o nome do seu banco de dados
  password: '941336@Mn', // Altere para a sua senha do banco de dados
  port: 5432, // Porta padrão do PostgreSQL
});

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


module.exports = pool;