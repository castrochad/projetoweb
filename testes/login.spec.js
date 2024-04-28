const { login } = require('./login');

describe('Testes para a função de login', () => {
  test('Deve autenticar um usuário com credenciais válidas', async () => {
    const req = {
      body: {
        nome: 'Walisson',
        senha: '941336'
      },
      session: {} // Objeto de sessão vazio, será preenchido pela função de login
    };
    const res = {
      redirect: jest.fn()
    };

    await login(req, res);

    // Verificar se o usuário está na sessão após a autenticação bem-sucedida
    expect(req.session.usuario).toBeDefined();
    expect(req.session.usuario.nome).toBe('Walisson');

    // Verificar se o redirecionamento ocorreu corretamente
    expect(res.redirect).toHaveBeenCalledWith('/usuario?nome=Walisson');
  });

  test('Deve redirecionar para a página de erro ao fornecer credenciais inválidas', async () => {
    const req = {
      body: {
        nome: 'usuario',
        senha: 'senhaerrada'
      },
      session: {} // Objeto de sessão vazio, não será preenchido nesta condição
    };
    const res = {
      redirect: jest.fn()
    };

    await login(req, res);

    // Verificar se o usuário não está na sessão após credenciais inválidas
    expect(req.session.usuario).toBeUndefined();

    // Verificar se o redirecionamento ocorreu corretamente para a página de erro de autenticação
    expect(res.redirect).toHaveBeenCalledWith('/autenticacao?erro=1');
  });
});