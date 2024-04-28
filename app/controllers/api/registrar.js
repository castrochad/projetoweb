// Rota para processar o registro
async function cadastro(req, res, pool) {
    try {
      const { nome, email, senha, confirmarSenha, data_nasc, sexo, telefone } = req.body;

      // Verificar se senha e confirmação de senha são iguais
      if (senha !== confirmarSenha) {
          return res.status(400).json({ success: false, message: 'Senha e confirmação de senha não correspondem.' });
      }

      // Verificar se o nome de usuário já existe na tabela de usuário
      const userQuery = 'SELECT * FROM usuario WHERE nome = $1';
      const userResult = await pool.query(userQuery, [nome]);

      if (userResult.rows.length > 0) {
          return res.status(400).json({ success: false, message: 'Nome de usuário já existe.' });
      }

      // Verificar se o e-mail já existe na tabela de usuário
      const emailQuery = 'SELECT * FROM usuario WHERE email = $1';
      const emailResult = await pool.query(emailQuery, [email]);

      if (emailResult.rows.length > 0) {
          return res.status(400).json({ success: false, message: 'Email já cadastrado.' });
      }

      // Se não houver duplicatas, insira o novo registro
      const insertQuery = 'INSERT INTO usuario (permissao, nome, email, senha, data_nasc, sexo, telefone) VALUES ($1, $2, $3, $4, $5, $6, $7)';
      const insertValues = ['padrao', nome, email, senha, data_nasc, sexo, telefone];

      await pool.query(insertQuery, insertValues);

      // Se o registro for bem-sucedido, retorne uma resposta JSON indicando sucesso
      res.status(200).json({ success: true, nomeUsuario: nome });
  } catch (error) {
      console.error('Erro ao registrar:', error);
      res.status(500).json({ success: false, message: 'Ocorreu um erro ao registrar.' });
  }
}

module.exports = {
  cadastro,
};