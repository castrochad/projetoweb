const express = require('express');
const pool = require('./database');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const nomeUsuario = req.query.nome;
    const query = 'SELECT * FROM usuario WHERE nome = $1';
    const result = await pool.query(query, [nomeUsuario]);

    if (result.rows.length > 0) {
      const usuario = result.rows[0];

      if (usuario.permissao === 'adm') {
        const denunciasQuery = 'SELECT * FROM denuncia';
        const denunciasResult = await pool.query(denunciasQuery);
        const denuncias = denunciasResult.rows;

        res.render('usuario', { usuario, denuncias, isAdmin: true });
      } else {
        res.render('usuario', { usuario, isAdmin: false });
      }
    } else {
      res.redirect('deldenuncia');
    }
  } catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    res.status(500).send('Ocorreu um erro ao buscar informações do usuário.');
  }
});



module.exports = router;