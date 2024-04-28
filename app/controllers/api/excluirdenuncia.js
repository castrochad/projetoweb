const express = require('express');
const pool = require('./database');
const router = express.Router();

router.post('/excluir-denuncia', async (req, res) => {
  const userId = req.locals.usuario.id;
  const denunciaId = req.body.denunciaId;
  let client;

  try {
    client = await pool.connect();
    await client.query('BEGIN');

    // Excluir os comentários relacionados à denúncia
    const deleteComentariosQuery = 'DELETE FROM comentarios WHERE id_denuncia = $1';
    await client.query(deleteComentariosQuery, [denunciaId]);

    // Excluir a denúncia
    const deleteDenunciaQuery = 'DELETE FROM denuncia WHERE id = $1';
    await client.query(deleteDenunciaQuery, [denunciaId]);

    // Commit da transação se todas as operações forem bem-sucedidas
    await client.query('COMMIT');

    res.redirect('/usuario?nome=' + req.locals.usuario.nome);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao excluir a denúncia:', error);
    res.status(500).send('Ocorreu um erro ao excluir a denúncia.');
  } finally {
    if (client) {
      client.release();
    }
  }
});

module.exports = router;