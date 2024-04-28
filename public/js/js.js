var header = document.getElementById('header');
var navigationHeader = document.getElementById('navigation_header');
var content = document.getElementById('content');
var showSidebar = false;

function toggleSidebar() {
    showSidebar = !showSidebar;
    if (showSidebar) {
        navigationHeader.style.marginLeft = '-10vw';
        navigationHeader.style.animationName = 'showSidebar';
        content.style.filter = 'blur(2px)';
    } else {
        navigationHeader.style.marginLeft = '-100vw';
        navigationHeader.style.animationName = '';
        content.style.filter = '';
    }
}

function closeSidebar() {
    if (showSidebar) {
        showSidebar = true;
        toggleSidebar();
    }
}

window.addEventListener('resize', function(event) {
    if (window.innerWidth > 768 && showSidebar) {
        showSidebar = true;
        toggleSidebar();
    }
});
// ======================================================
// funções de abrir popup na página missão visão e valores 
// ======================================================
function openPopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    overlay.style.display = 'block';
    popup.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Impede que a página seja rolada enquanto o popup está aberto
  }
  
  // Função para fechar o popup
  function closePopup() {
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    overlay.style.display = 'none';
    popup.style.display = 'none';
    document.body.style.overflow = 'auto'; // Permite que a página seja rolada novamente quando o popup é fechado
  }


  function habilitarEdicao(campo, usuarioId) {
    const valorAtual = document.getElementById(campo).innerText;
    const novoValor = prompt(`Editar ${campo}: Para SEXO utiliza M ou F para outros Utilize O`, valorAtual);

    if (novoValor !== null && novoValor !== valorAtual) {
        const xhr = new XMLHttpRequest();
        let rota;

        switch (campo) {
            case 'nome':
              rota = 'atualizar-nome';
              break;
            case 'email':
              rota = 'atualizar-email';
              break;
            case 'dataNasc':
              rota = 'atualizar-data-nascimento';
              break;
            case 'sexo':
              rota = 'atualizar-sexo';
              break;
            case 'telefone':
              rota = 'atualizar-telefone';
              break;
            case 'senha':
              rota = 'atualizar-senha';
              break;
            default:
              alert('Campo inválido.');
              return;
          }

        xhr.open('POST', `/${rota}`);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
            if (xhr.status === 200) {
                document.getElementById(campo).innerText = novoValor;
            } else if (xhr.status === 409) {
                alert(`Erro ao atualizar ${campo}. O ${campo} já está em uso por outro usuário.`);
            } else {
                alert(`Erro ao atualizar ${campo}. Tente novamente mais tarde.`);
            }
        };

        xhr.send(JSON.stringify({ usuarioId: usuarioId, novoValor: novoValor }));
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const novaFotoElement = document.getElementById('novaFoto');
    const mensagemElement = document.getElementById('mensagem');

    if (novaFotoElement) {
        novaFotoElement.addEventListener('change', function() {
            const fileInput = this;

            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const formData = new FormData();
                formData.append('novaFoto', file);

                fetch('/atualizar-foto', {
                    method: 'POST',
                    body: formData,
                })
                .then(response => response.json())
                .then(data => {
                    // Limpa a mensagem de erro, se houver
                    mensagemElement.innerText = '';

                    if (data.success) {
                        // Exibe o alerta de sucesso
                        alert('Foto de perfil atualizada com sucesso!');
                        mensagemElement.style.color = 'green';
                        // Recarrega a página após 2 segundos
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else {
                        // Exibe o alerta de erro
                        alert('Erro ao atualizar a foto de perfil: ' + data.error);
                        mensagemElement.innerText = 'Erro ao atualizar a foto de perfil: ' + data.error;
                        mensagemElement.style.color = 'red';
                    }
                })
                .catch(error => {
                    // Exibe o alerta de erro em caso de falha na requisição
                    alert('Erro ao enviar a solicitação: ' + error.message);
                    console.error('Erro ao enviar a solicitação:', error);
                    console.error('Ocorreu um erro ao atualizar a foto de perfil.');
                    mensagemElement.innerText = 'Erro ao atualizar a foto de perfil. Por favor, tente novamente mais tarde.';
                    mensagemElement.style.color = 'red';
                });
            }
        });
    }

    var formulario = document.getElementById('formulario');
    var emailInput = document.getElementById('emailInput');

    if (formulario && emailInput) {
        formulario.addEventListener('submit', function(event) {
            event.preventDefault();
            var email = emailInput.value;

            // Envia a solicitação POST ao servidor
            fetch('/enviar-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'email=' + email
                })
                .then(function(response) {
                    return response.text();
                })
                .then(function(data) {
                    alert(data); // Mostra a resposta do servidor (mensagem de sucesso ou erro)
                })
                .catch(function(error) {
                    console.error(error);
                    alert('Erro ao enviar a solicitação.');
                });
        });
    } else {
        console.error('Form or email input element not found.');
    }

// ======================================================
// funções de abrir popup na página missão visão e valores 
// ======================================================

    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    const successParam = urlParams.get('success');

    if (errorParam === '1') {
        // Credenciais inválidas, mostrar alerta de erro
        showAlert('Nome de usuário ou senha incorretos. Por favor, tente novamente.', 'error');
    } else if (successParam === '1') {
        // Usuário acessou a página com sucesso, mostrar mensagem de boas-vindas
        showAlert('Bem-vindo de volta! Você acessou a página com sucesso.', 'success');
    }

    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${type}`;
        alertDiv.textContent = message;

        // Adicione o alerta à página
        const alertContainer = document.getElementById('alert-container');
        alertContainer.appendChild(alertDiv);

        // Remova o alerta após alguns segundos (opcional)
        setTimeout(() => {
            alertDiv.remove(); // Remova o alerta após 5 segundos
        }, 5000);
    }
// ======================================================
// verificar errors login q cadastro !
// ======================================================

// verificador de login / se e a primeira vez não mostrar se logar denovo já mostra a messagem.
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('loggedIn');
    if (isLoggedIn) {
        showAlert('Bem-vindo de volta! Você acessou a página com sucesso.', 'success');
        localStorage.removeItem('loggedIn'); // Limpe o indicador para que a mensagem não apareça novamente após o refresh da página.
    }
});



// ============================================
// funções comentarios nas denúncias existentes 
// ============================================
$('.comentarBtn').on('click', function() {
    const idDenuncia = $(this).data('denuncia-id');
    $('#idDenuncia').val(idDenuncia);

    // Faz uma solicitação AJAX para recuperar e exibir todos os comentários da denúncia específica
    $.ajax({
        url: `/comentarios/${idDenuncia}`,
        type: 'GET',
        dataType: 'json',
        success: function(comentarios) {
            // Limpa o contêiner de comentários
            $('#comentariosContainer').empty();

            // Adiciona todos os comentários ao contêiner
            comentarios.forEach(function(comentario, index) {
                const comentarioModificado = `<p class="comment">${index + 1}. <strong>${comentario.comentario.toUpperCase()}</strong></p>`;
                $('#comentariosContainer').append(comentarioModificado);
            });

            // Abre o modal
            $('#myModal').css('display', 'block');
        },
        error: function(error) {
            console.error('Erro ao recuperar comentários:', error);
        }
    });
});

// Ao enviar o formulário de comentário
$('#comentarioForm').on('submit', function(event) {
    event.preventDefault();
    const idDenuncia = $('#idDenuncia').val(); // Certifique-se de que o ID da denúncia seja obtido corretamente
    const comentario = $('#novoComentario').val();

    // Faz uma solicitação AJAX para enviar o novo comentário para o servidor
    $.ajax({
        url: `/comentarios/${idDenuncia}`, // Certifique-se de que a rota esteja correta
        type: 'POST',
        dataType: 'json',
        data: { comentario: comentario }, // Envia o texto do comentário
        success: function(novoComentario) {
            // Adiciona o novo comentário ao contêiner de comentários
            $('#comentariosContainer').append(`<p class="comment">${novoComentario.comentario.toUpperCase()}</p>`);

            // Limpa o campo de entrada de comentário
            $('#novoComentario').val('');
        },
        error: function(error) {
            console.error('Erro ao adicionar comentário:', error);
        }
    });
});

// Ao clicar no botão "Fechar" (x) ou fora do modal, fecha o modal
$('.close').on('click', function() {
    $('#myModal').css('display', 'none');
});

$(document).on('click', function(event) {
    const modal = $('#myModal');
    if (event.target === modal[0]) {
        modal.css('display', 'none');
    }
});
});

// ============================================
// funções comentarios nas denúncias existentes 
// ============================================

// ======================================================
// funções de ver todas as denúncias que estão no banco.
// ======================================================

document.addEventListener('DOMContentLoaded', function() {
    // Ação para tabela de denúncias
    fetch('/status-count')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao buscar dados: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        const denunciaCountElement = document.querySelector('.denuncia-count');
        const pendentesCountElement = document.querySelector('.pendentes-count');
        const solucionadosCountElement = document.querySelector('.solucionados-count');

        denunciaCountElement.textContent = data.find(item => item.acompanhamento === 'registrada').quantidade;
        pendentesCountElement.textContent = data.find(item => item.acompanhamento === 'em analise').quantidade;
        solucionadosCountElement.textContent = data.find(item => item.acompanhamento === 'resolvida').quantidade;
    })
    .catch(error => console.error(error));  // Captura erros durante a solicitação ou processamento JSON
});

// ======================================================
// Alertas De registro errors de cadastros .
// =====================================================
// Certifique-se de que este código está sendo executado após o carregamento da página
document.addEventListener('DOMContentLoaded', function () {
    // Obtenha a referência do formulário de registro
    const registroForm = document.getElementById('registroForm');

    // Verifique se o formulário de registro existe
    if (registroForm) {
        // Adicione um ouvinte de evento ao formulário de registro
        registroForm.addEventListener('submit', function (event) {
            // Previna o envio padrão do formulário
            event.preventDefault();

            // Obtenha os valores dos campos do formulário
            const nome = document.querySelector('input[name="nome"]').value;
            const email = document.querySelector('input[name="email"]').value;
            const senha = document.querySelector('input[name="senha"]').value;
            const confirmarSenha = document.querySelector('input[name="confirmarSenha"]').value;
            const data_nasc = document.querySelector('input[name="data_nasc"]').value;
            const sexo = document.querySelector('select[name="sexo"]').value;
            const telefone = document.querySelector('input[name="telefone"]').value;

            // Verifique se senha e confirmação de senha são iguais
            if (senha !== confirmarSenha) {
                alert('Senha e confirmação de senha não correspondem.');
                return;
            }

            // Enviar dados para o servidor
            enviarDadosParaServidor(nome, email, senha, confirmarSenha, data_nasc, sexo, telefone);
        });
    } else {
        console.error('Elemento #registroForm não encontrado.');
    }
});

// Função para enviar dados para o servidor
async function enviarDadosParaServidor(nome, email, senha, confirmarSenha, data_nasc, sexo, telefone) {
    try {
        const response = await fetch('/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha, confirmarSenha, data_nasc, sexo, telefone })
        });

        const data = await response.json();

        if (data.success) {
            alert('Registro bem-sucedido!');
            // Redirecione o usuário para a página 'index'
            window.location.href = '/index';
        } else {
            alert('Erro ao registrar: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao enviar requisição:', error);
        alert('Ocorreu um erro ao enviar a requisição.');
    }
}
// ======================================================
// Alertas De registro errors de cadastros .
// =====================================================



// ======================================================
// funções de ver todas as denúncias que estão no banco.
// ======================================================

document.addEventListener('DOMContentLoaded', function() {
    var denunciaForm = document.getElementById('denunciaForm');
    var errorMessage = document.getElementById('error-message');
    var descricaoError = document.getElementById('descricao-error');
    var cepError = document.getElementById('cep-error');
    var enderecoError = document.getElementById('endereco-error');
    var fotoError = document.getElementById('foto-error');

    if (denunciaForm) {
        var descricaoInput = denunciaForm.elements['descricao'];
        var cepInput = denunciaForm.elements['idEndereco'];
        var enderecoInput = denunciaForm.elements['endereco'];
        var fotoInput = denunciaForm.elements['foto'];

        denunciaForm.addEventListener('submit', function(event) {
            var descricao = descricaoInput.value;
            var cep = cepInput.value;
            var endereco = enderecoInput.value;
            var foto = fotoInput.value;

            var errorMessages = [];

            // Validação dos campos
            if (!descricao) {
                errorMessages.push('Campo Descrição é obrigatório.');
                if (descricaoError) {
                    descricaoError.textContent = 'Campo Descrição é obrigatório.';
                } else {
                    console.error('Elemento descricaoError não encontrado.');
                }
            } else {
                if (descricaoError) {
                    descricaoError.textContent = '';
                } else {
                    console.error('Elemento descricaoError não encontrado.');
                }
            }

            // Validação dos campos
                if (!cep) {
                    errorMessages.push('Campo CEP é obrigatório.');
                    if (cepError) {
                        cepError.textContent = 'Campo CEP é obrigatório.';
                    } else {
                        console.error('Elemento cepError não encontrado.');
                    }
                } else {
                    if (cepError) {
                        cepError.textContent = '';
                    } else {
                        console.error('Elemento cepError não encontrado.');
                    }
                }

                // Validação dos campos
                if (!endereco) {
                    errorMessages.push('Campo Endereço é obrigatório.');
                    if (enderecoError) {
                        enderecoError.textContent = 'Campo Endereço é obrigatório.';
                    } else {
                        console.error('Elemento enderecoError não encontrado.');
                    }
                } else {
                    if (enderecoError) {
                        enderecoError.textContent = '';
                    } else {
                        console.error('Elemento enderecoError não encontrado.');
                    }
                }

                // Validação dos campos
                if (!foto) {
                    errorMessages.push('Campo Foto é obrigatório.');
                    if (fotoError) {
                        fotoError.textContent = 'Campo Foto é obrigatório.';
                    } else {
                        console.error('Elemento fotoError não encontrado.');
                    }
                } else {
                    if (fotoError) {
                        fotoError.textContent = '';
                    } else {
                        console.error('Elemento fotoError não encontrado.');
                    }
                }
            // Impede o envio do formulário se houver erros
            if (errorMessages.length > 0) {
                event.preventDefault();

                // Mostra as mensagens de erro em vermelho
                errorMessage.textContent = errorMessages.join(' ');
                errorMessage.style.color = 'red'; // Define a cor do texto como vermelho
                errorMessage.style.display = 'block';

                // Esconde a mensagem de erro após 5 segundos
                setTimeout(function() {
                    errorMessage.style.display = 'none';
                    errorMessage.style.color = ''; // Remove a cor do texto após esconder a mensagem
                }, 5000);
            }
        });
    }
});