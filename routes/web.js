const express = require("express");
const router = express.Router();

const NavegacaoController = require("../app/controllers/NavegacaoController");

router.get('/', NavegacaoController.index);
router.get('/index', NavegacaoController.index);
router.get('/agradecimento', NavegacaoController.agradecimento);
router.get('/arquivodenuncia', NavegacaoController.arquivodenuncia);
router.get('/cadastro', NavegacaoController.cadastro);
router.get('/denuncia', NavegacaoController.denuncia);
router.get('/formulario', NavegacaoController.formulario);
router.get('/recuperar', NavegacaoController.recuperar);
router.get('/senha', NavegacaoController.senha);
router.get('/sobre', NavegacaoController.sobre);
router.get('/registrar', NavegacaoController.registrar);
router.get('/regras', NavegacaoController.regras);
router.get('/denunciasPorMes', NavegacaoController.denunciasPorMes);
router.get('/getStatusText', NavegacaoController.getStatusText);
router.get('/getClassificacaoText', NavegacaoController.getClassificacaoText);
router.get('/usuario', NavegacaoController.usuario);
router.get('/perfil', NavegacaoController.perfil);
router.get('/formatarData', NavegacaoController.formatarData);
router.get('/regrasdenuncias', NavegacaoController.regrasdenuncias);
router.get('/nomeUsuario', NavegacaoController.nomeUsuario);
router.get('/deldenuncia', NavegacaoController.deldenuncia);
router.get('/autentication', NavegacaoController.autentication);


router.get('*', function notFound(request, response) {
    return response.render("404");
});


module.exports = router;