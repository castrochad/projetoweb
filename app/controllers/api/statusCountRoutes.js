const express = require('express');
const { Pool } = require('pg');
const router = express.Router();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'denunciacerta',
  password: '941336@Mn',
  port: 5432,
});

router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT s.acompanhamento, COUNT(*) as quantidade
      FROM STATUS s
      LEFT JOIN DENUNCIA d ON s.id = d.id_status
      GROUP BY s.acompanhamento
    `;
    const statusCountData = await pool.query(query);
    const statusCountRows = statusCountData.rows;

    res.json(statusCountRows);
  } catch (error) {
    console.error('Erro ao contar status de denúncias:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao contar status de denúncias.' });
  }
});

module.exports = router;