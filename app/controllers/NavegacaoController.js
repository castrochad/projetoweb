function NavegacaoController() {
  function index(request, response) {
    return response.render("index", {
      title: "Página Inicial",
    });
  }

  function agradecimento(request, response) {
    return response.render("agradecimento", {
      title: "Página de agradecimento",
    });
  }

  function sobre(request, response) {
    return response.render("sobre", {
      title: "Sobre a empresa",
    });
  }

  function arquivodenuncia(request, response) {
    return response.render("arquivodenuncia", {
      title: "Página denúncias",
    });
  }

  function cadastro(request, response) {
    return response.render("cadastro", {
      title: "Página cadastro",
    });
  }
  function denuncia(request, response) {
    return response.render("denuncia", {
      title: "Página denuncia",
    });
  }

  function formulario(request, response) {
    return response.render("formulario", {
      title: "Página formulario",
    });
  }
  function recuperar(request, response) {
    return response.render("recuperar", {
      title: "Página recuperar",
    });
  }
  function senha(request, response) {
    return response.render("senha", {
      title: "Página senha",
    });
  }
  function registrar(request, response) {
    return response.render("registrar", {
      title: "Ops Algo Deu Errado",
    });
  }

  function status(request, response) {
    return response.render("status", {
      title: "Denúncias Registradas",
    });
  }

  function regras(request, response) {
    return response.render("regras", {
      title: "Denúncias Registradas",
    });
  }

  function denunciasPorMes(request, response) {
    return response.render("denunciasPorMes", {
      title: "Denúncias por mes",
    });
  }

  function getStatusText(request, response) {
    return response.render("getStatusText", {
      title: "Status Da denúncia",
    });
  }
  function getClassificacaoText(request, response) {
    return response.render("getClassificacaoText", {
      title: "Classificação da denúncia",
    });
  }
  function usuario(request, response) {
    return response.render("usuario", {
      title: "painel usuario",
    });
  }

  function perfil(request, response) {
    return response.render("perfil", {
      title: "painel usuario",
    });
  }
  function formatarData(request, response) {
    return response.render("formatarData", {
      title: "Atualizar dados",
    });
  }

  function regrasdenuncias(request, response) {
    return response.render("regrasdenuncias", {
      title: "Denúncia Certa - Dados",
    });
  }

  function nomeUsuario(request, response) {
    return response.render("nomeUsuario", {
      title: "Denúncia Certa - Dados",
    });
  }

  function deldenuncia(request, response) {
    return response.render("deldenuncia", {
      title: "Denúncia Certa - Dados",
    });
  }
  function autentication(request, response) {
    return response.render("autentication", {
      title: "Autenticação de Usuário",
    });
  }
  function notFound(request, response) {
    return response.render("404");
  }

  return {
    agradecimento,
    arquivodenuncia,
    cadastro,
    denuncia,
    formulario,
    recuperar,
    senha,
    sobre,
    index,
    registrar,
    regras,
    denunciasPorMes,
    getStatusText,
    getClassificacaoText,
    usuario,
    perfil,
    formatarData,
    regrasdenuncias,
    nomeUsuario,
    deldenuncia,
    autentication,
    notFound,
  };
}

module.exports = NavegacaoController();
