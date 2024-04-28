const express = require('express');
const pool = require('./database');

const arquivodenunciaRouter = express.Router();

arquivodenunciaRouter.get('/', async (req, res) => {
  try {
    const client = await pool.connect();

    // Consulta SQL para obter informações da denúncia com o nome do usuário e a foto
    const query = `
      SELECT d.*, u.nome AS nome_usuario, u.foto AS foto_usuario
      FROM denuncia d
      LEFT JOIN usuario u ON d.id_usuario = u.id
    `;

    const result = await client.query(query);
    const denuncias = result.rows;

    // Obtém o id do usuário logado a partir da sessão
    const id_usuario = req.session.usuario.id;

    // Renderiza o arquivo EJS com os dados das denúncias, informações do usuário e foto
    res.render('arquivodenuncia.ejs', { denuncias, id_usuario });
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar denúncias no banco de dados.');
  }
});

module.exports = arquivodenunciaRouter;