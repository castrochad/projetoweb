const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'denunciacerta',
  password: '941336@Mn',
  port: 5432, // Porta padrão do PostgreSQL
});
async function login(req, res) {
  const { nome, senha } = req.body;
  const session = req.session; // Obtenha o objeto de sessão diretamente do req

  try {
    const query = 'SELECT * FROM usuario WHERE nome = $1 AND senha = $2';
    const values = [nome, senha];
    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      // Autenticação bem-sucedida, armazene informações do usuário na sessão
      session.usuario = result.rows[0];
      res.redirect(`/usuario?nome=${nome}`);
    } else {
      // Credenciais inválidas, redirecione para a página de login com uma mensagem de erro
      res.redirect('/autenticacao?erro=1');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.redirect('/cadastro?erro=2');
  }
}
module.exports = pool;
module.exports = { login };