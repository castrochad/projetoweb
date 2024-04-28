const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/:nomeFoto', (req, res) => {
  const nomeFoto = req.params.nomeFoto;
  res.sendFile(path.join(__dirname, 'public', 'uploads', nomeFoto));
});

module.exports = router;