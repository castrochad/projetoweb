const request = require('supertest');
const app = require('../server');

describe('Testes para a rota de registro', () => {
  test('Deve adicionar um novo usuário com dados válidos', async () => {
    const response = await request(app)
      .post('/registrar')
      .send({
        nome: 'Novo Usuário',
        email: 'novo_usuario@hotmail.com',
        senha: 'senha123',
        confirmarSenha: 'senha123',
        data_nasc: '1990-01-01',
        sexo: 'M',
        telefone: '123456789'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  test('Deve retornar erro ao tentar adicionar um usuário já existente', async () => {
    const response = await request(app)
      .post('/registrar')
      .send({
        nome: 'João Silva',
        email: 'wallyson2013@hotmail.com',
        senha: 'senha123',
        confirmarSenha: 'senha123',
        data_nasc: '1985-01-01',
        sexo: 'F',
        telefone: '987654321'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Nome de usuário já existe.');
  });
});