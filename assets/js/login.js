document.addEventListener('DOMContentLoaded', function() {
    const submit = document.getElementById('btn-submit');
    const form = document.getElementById('login-form');

    submit.addEventListener('click', function(event) {
        event.preventDefault();

        // Obtenha os dados dos campos do formulário
        const username = form.querySelector('#username').value;
        const password = form.querySelector('#password').value;

        // Converte os dados do formulário para JSON
        const jsonData = jsonFile(username, password);

        // Extrai os atributos de <form>
        const action = form.getAttribute('action');
        const method = form.getAttribute('method').toUpperCase(); // Garante que o método esteja em maiúsculas

        // Verifica se os campos obrigatórios estão preenchidos
        if (username && password && action && method) {
            makeRequest(action, jsonData, method).then(function(response) {
                if (response && response.status >= 400 && response.status <= 499) {
                    showModal('Acesso não autorizado');
                } else if (response && response.status >= 200 && response.status <= 299) {
                    response.json().then(data => {
                        // Armazena o token JWT no localStorage
                        localStorage.setItem('authToken', data.token);
                        showModal('Login bem-sucedido!');
                        // Redirecione para a próxima página ou faça algo com o token
                    });
                } else if (response && response.status >= 500 && response.status <= 599) {
                    showModal('Erro no servidor: ' + response.status);
                } else {
                    showModal('Erro desconhecido. Status code: ' + (response ? response.status : 'sem status'));
                }
            });
        } else {
            showModal("Preencha todos os campos.");
        }
    });
});

function jsonFile(username, password) {
    // Cria um objeto com dados
    const formData = {
        username: username,
        password: password
    };

    // Converte o objeto para uma string JSON
    return JSON.stringify(formData);
}

function makeRequest(url, data, method) {
    return fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    });
}

function showModal(message) {
    const modal = document.getElementById('custom-alert');
    const alertMessage = document.getElementById('alert-message');
    
    alertMessage.textContent = message;
    modal.style.display = 'flex'; // Mostrar modal

    // Ocultar o modal após 5 segundos
    setTimeout(() => {
        modal.style.display = 'none';
    }, 5000);
}
