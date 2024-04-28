const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const pool = require('./app/controllers/api/database');
const session = require('express-session');


const authController = require('./app/controllers/api/loginUser'); // Import the authController
const registrarController = require('./app/controllers/api/registrar');
const statusCountRoutes = require('./app/controllers/api/statusCountRoutes'); // Importe as rotas do contador de status
const comentariosRoutes = require('./app/controllers/api/obtercomentario'); // Importe suas rotas de comentários
const arquivodenunciaRouter = require('./app/controllers/api/arquivodenuncia');
const excluirdenunciaRouter = require('./app/controllers/api/excluirdenuncia'); // Importe o arquivo de rotas de exclusão de denúncias
const usuarioRoutes = require('./app/controllers/api/usuarioRoutes');
const enviaremail = require('./app/controllers/api/smtp');

const webRouter = require("./routes/web");
const apiRouter = require("./routes/api");

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configurações de pasta
const public_path = "public";
const views_path = "views";

app.use(express.static(public_path));
app.set("view engine", "ejs");
app.set("views", [
    views_path
]);

app.use(session({
  secret: '941336@Mn',
  resave: false,
  saveUninitialized: true
}));


function autenticacaoMiddleware(req, res, next) {
  if (req.session.usuario) {
    // O usuário está autenticado, continue com a solicitação
    req.user = req.session.usuario; // Defina req.user com as informações do usuário
    next();
  } else {
    // O usuário não está autenticado, redirecione para a página de login
    res.redirect('/autentication');
  }
}

// Configurar o multer para o armazenamento de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/'); // Especifique o diretório onde deseja salvar os arquivos
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Obtenha a extensão original do arquivo
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Mantenha a extensão original do arquivo
  }
});

const upload = multer({ storage: storage });


// Lista de palavras proibidas
const palavrasProibidas = ['sefuder', 'caralho', 'fdp', 'paunocu'];

// Função para verificar se a descrição contém palavras proibidas
function contemPalavrasProibidas(descricao) {
  const descricaoLowerCase = descricao.toLowerCase(); // Converter a descrição para letras minúsculas
  return palavrasProibidas.some(palavra => descricaoLowerCase.includes(palavra));
}

app.post('/enviar-denuncia', autenticacaoMiddleware, upload.single('foto'), async (req, res) => {
  try {
    const idUsuario = req.session.usuario.id;
    // Obtenha os dados do formulário
    const descricao = req.body.descricao;
    const cep = req.body.idEndereco;
    const endereco = req.body.endereco;
    const nomeArquivo = req.file ? req.file.filename : null; // Verifica se um arquivo foi enviado
    const idStatus = 1; // Substitua isso pelo valor correto de id_status
    const idClassificacao = 1; // Substitua isso pelo valor correto de id_classificacao

    
    // Certifique-se de que a descrição seja preenchida, pois é um campo obrigatório
    if (!descricao) {
      res.redirect('/regrasdenuncias'); // Substitua 'pagina-de-agradecimento' pelo caminho da sua página de agradecimento
      return;
    }

    // Verifique se a descrição contém palavras proibidas
    if (contemPalavrasProibidas(descricao)) {
      res.redirect('/regras'); // Substitua 'pagina-de-agradecimento' pelo caminho da sua página de agradecimento
      return;
    }

    // Verifique se um arquivo foi anexado
    if (!nomeArquivo) {
      res.redirect('/regrasdenuncias'); // Substitua 'pagina-de-agradecimento' pelo caminho da sua página de agradecimento
      return;
    }

    // Construa um objeto com os campos opcionais que foram preenchidos
    const denunciaData = {
      descricao: descricao,
      foto: nomeArquivo,
      cep: cep,
      endereco: endereco,
      id_status: idStatus,
      id_usuario: idUsuario,
      id_classificacao: idClassificacao
    };

    // Finalmente, insira a denúncia com as informações necessárias
    const insertDenunciaQuery = 'INSERT INTO denuncia (descricao, cep, endereco, foto, id_status, id_usuario, id_classificacao) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    const insertDenunciaValues = [denunciaData.descricao, denunciaData.cep, denunciaData.endereco, denunciaData.foto, denunciaData.id_status, denunciaData.id_usuario, denunciaData.id_classificacao];

    await pool.query(insertDenunciaQuery, insertDenunciaValues);

    // Redirecione o usuário para a página de agradecimento após o envio bem-sucedido
    res.redirect('/arquivodenuncia'); // Substitua 'pagina-de-agradecimento' pelo caminho da sua página de agradecimento
  } catch (error) {
    console.error('Erro ao processar a denúncia:', error);
    res.status(500).send('Ocorreu um erro ao enviar a denúncia.');
  }
});


app.post('/atualizar-foto', autenticacaoMiddleware, upload.single('novaFoto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Nenhuma foto recebida.' });
    }

    const novaFotoNome = req.file.filename;

    // Certifique-se de que req.user.id está definido corretamente
    const usuarioId = req.user.id;

    const updateQuery = 'UPDATE usuario SET foto = $1 WHERE id = $2';
    const updateValues = [novaFotoNome, usuarioId];

    await pool.query(updateQuery, updateValues);

    res.status(200).json({ success: true, message: 'Foto de perfil atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar a foto de perfil:', error);

    // Responde com JSON em caso de erro
    res.status(500).json({ success: false, error: 'Erro ao atualizar a foto de perfil. Detalhes: ' + error.message });
  }
});

app.get('/foto-de-perfil/:nomeFoto', (req, res) => {
  const nomeFoto = req.params.nomeFoto;
  res.sendFile(path.join(__dirname, 'public', 'uploads', nomeFoto));
});



// Função para verificar se o nome já está em uso
async function verificarNomeExistente(novoNome) {
  const query = 'SELECT * FROM usuario WHERE nome = $1';
  const result = await pool.query(query, [novoNome]);
  return result.rows.length > 0;
}

// Função para verificar se o email já está em uso
async function verificarEmailExistente(novoEmail) {
  const query = 'SELECT * FROM usuario WHERE email = $1';
  const result = await pool.query(query, [novoEmail]);
  return result.rows.length > 0;
}

// Rota para atualizar o nome
app.post('/atualizar-nome', async (req, res) => {
  try {
    const { usuarioId, novoValor } = req.body;

    // Verificar se o novo nome já está em uso
    const nomeExistente = await verificarNomeExistente(novoValor);
    if (nomeExistente) {
      return res.status(400).send('Este nome já está em uso por outro usuário.');
    }

    const updateQuery = 'UPDATE usuario SET nome = $1 WHERE id = $2';
    await pool.query(updateQuery, [novoValor, usuarioId]);
    res.status(200).send('Nome atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar o nome:', error);
    res.status(500).send('Erro ao atualizar o nome. Por favor, tente novamente mais tarde.');
  }
});

// Rota para atualizar o email
app.post('/atualizar-email', async (req, res) => {
  try {
    const { usuarioId, novoValor } = req.body;

    // Verificar se o novo email já está em uso
    const emailExistente = await verificarEmailExistente(novoValor);
    if (emailExistente) {
      return res.status(400).send('Este email já está em uso por outro usuário.');
    }

    const updateQuery = 'UPDATE usuario SET email = $1 WHERE id = $2';
    await pool.query(updateQuery, [novoValor, usuarioId]);
    res.status(200).send('E-mail atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar o e-mail:', error);
    res.status(500).send('Erro ao atualizar o e-mail. Por favor, tente novamente mais tarde.');
  }
});

// Rota para atualizar a data de nascimento
app.post('/atualizar-data-nascimento', async (req, res) => {
  try {
    const { usuarioId, novoValor } = req.body;
    const updateQuery = 'UPDATE usuario SET data_nasc = $1 WHERE id = $2';
    await pool.query(updateQuery, [novoValor, usuarioId]);
    res.status(200).send('Data de nascimento atualizada com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar a data de nascimento:', error);
    res.status(500).send('Erro ao atualizar a data de nascimento. Por favor, tente novamente mais tarde.');
  }
});

// Rota para atualizar o sexo
app.post('/atualizar-sexo', async (req, res) => {
  try {
    const { usuarioId, novoValor } = req.body;
    const updateQuery = 'UPDATE usuario SET sexo = $1 WHERE id = $2';
    await pool.query(updateQuery, [novoValor, usuarioId]);
    res.status(200).send('Sexo atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar o sexo:', error);
    res.status(500).send('Erro ao atualizar o sexo. Por favor, tente novamente mais tarde.');
  }
});

// Rota para atualizar o telefone
app.post('/atualizar-telefone', async (req, res) => {
  try {
    const { usuarioId, novoValor } = req.body;
    const updateQuery = 'UPDATE usuario SET telefone = $1 WHERE id = $2';
    await pool.query(updateQuery, [novoValor, usuarioId]);
    res.status(200).send('Telefone atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar o telefone:', error);
    res.status(500).send('Erro ao atualizar o telefone. Por favor, tente novamente mais tarde.');
  }
});


// =========================================================================
// =========================================================================
// =========================================================================


// Exemplo de middleware de autenticação
app.use((req, res, next) => {
  // Verifique se o usuário está autenticado e defina req.locals.usuario conforme necessário
  req.locals = {}; // Inicialize req.locals se ainda não estiver definido
  req.locals.usuario = {
    id: 1, // Substitua pelo ID do usuário autenticado
    nome: 'Nome do Usuário', // Substitua pelo nome do usuário autenticado
    // Outras propriedades do usuário
  };
  next();
});



app.post('/enviar-email', enviaremail);
app.use('/usuario', autenticacaoMiddleware, usuarioRoutes);
app.use('/excluirdenuncia', autenticacaoMiddleware, excluirdenunciaRouter);
app.use('/arquivodenuncia', autenticacaoMiddleware, arquivodenunciaRouter);
app.use('/comentarios', comentariosRoutes);
app.use('/status-count', statusCountRoutes);
app.post('/login', authController.loginUser);
app.post('/registrar', (req, res) => {

  registrarController.cadastro(req, res, pool);
});






app.use('/api', apiRouter);
app.use('/', webRouter);

const PORT = 3001;

const server = app.listen(PORT, function() {
  console.log(`Servidor iniciado: http://localhost:${PORT}/`);
});

module.exports = server;