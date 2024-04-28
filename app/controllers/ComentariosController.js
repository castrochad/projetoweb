const pool = require('./api/database');

// Rota para obter comentários de uma denúncia específica
async function getComentarios(req, res) {
  const idDenuncia = req.params.id_denuncia;

  try {
    // Consulta SQL para obter comentários da denúncia do banco de dados usando idDenuncia
    const result = await pool.query('SELECT * FROM comentarios WHERE id_denuncia = $1', [idDenuncia]);
    const comentarios = result.rows;

    res.json(comentarios);
  } catch (error) {
    console.error('Erro ao obter comentários:', error);
    res.status(500).json({ error: 'Erro ao obter comentários.' });
  }
}

// Rota para inserir um comentário em uma denúncia específica
async function inserirComentario (req, res) {
  const idDenuncia = req.params.id_denuncia;
  const { comentario } = req.body;
  const idUsuario = req.session.usuario.id; // Obtém o ID do usuário da sessão

  try {
    // Executa uma consulta SQL para inserir o comentário no banco de dados
    const result = await pool.query(
      'INSERT INTO comentarios (id_denuncia, id_usuario, comentario) VALUES ($1, $2, $3) RETURNING *',
      [idDenuncia, idUsuario, comentario]
    );

    // Retorna o comentário recém-inserido como JSON
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao inserir comentário:', error);
    res.status(500).json({ error: 'Erro ao inserir comentário.' });
  }
}

// Rota para obter a contagem de comentários de uma denúncia específica
async function countComentarios(req, res) {
  const idDenuncia = req.params.id_denuncia;

  try {
    // Consulta SQL para obter a contagem de comentários da denúncia do banco de dados usando idDenuncia
    const result = await pool.query('SELECT COUNT(*) FROM comentarios WHERE id_denuncia = $1', [idDenuncia]);
    const commentsCount = result.rows[0].count;

    res.json(commentsCount);
  } catch (error) {
    console.error('Erro ao obter contagem de comentários:', error);
    res.status(500).json({ error: 'Erro ao obter contagem de comentários.' });
  }
}


module.exports = {
  getComentarios,
  inserirComentario,
  countComentarios,
};