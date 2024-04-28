const nodemailer = require('nodemailer');
const nodemailerMock = require('nodemailer-mock');
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'denunciacerta',
  password: '941336@Mn',
  port: 5432,
});

function sendPasswordEmail(email, nomeUsuario, senha) {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: 'zeruela830@gmail.com',
      pass: 'gxrGy3BRJT9c18H7'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: 'naoresponda@hotmail.com',
    to: email,
    subject: 'Denúncia Certa Recuperar Senha',
    html: `
      <div style="text-align: center; font-family: Arial, sans-serif;">
        <h2 style="font-size: 24px; color: #333;">Aqui está, suas informações!</h2>
        <p style="font-size: 18px; color: #666; margin-bottom: 20px;">Usuário: ${nomeUsuario}</p>
        <p style="font-size: 18px; color: #666; margin-bottom: 20px;">Senha: ${senha}</p>
        <p style="font-size: 18px; color: #666; margin-bottom: 20px;">Deseja alterar seus dados? Entre em contato com nosso suporte.</p>
        <p style="font-size: 24px; color: #333;">Equipe Denúncia Certa</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendPasswordEmail,
  transporter: nodemailer.createTransport // Salva o transportador original
};

if (process.env.NODE_ENV === 'test') {
  nodemailerMock.mock.reset();
  nodemailer.createTransport = nodemailerMock.mock.createTransport;
}

app.post('/enviar-email', (req, res) => {
  const { email } = req.body;

  const sql = 'SELECT nome, senha FROM usuario WHERE email = $1';

  pool.query(sql, [email], (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).send('Erro ao buscar usuário no banco de dados.');
    } else if (result.rows.length > 0) {
      const nomeUsuario = result.rows[0].nome;
      const senha = result.rows[0].senha;

      sendPasswordEmail(email, nomeUsuario, senha)
        .then(() => {
          res.send('E-mail enviado com sucesso.');
        })
        .catch(error => {
          console.error(error);
          res.status(500).send('Erro ao enviar o e-mail.');
        });
    } else {
      res.status(404).send('Email não encontrado no banco de dados.');
    }
  });
});

module.exports = app;