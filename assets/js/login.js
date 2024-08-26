document.addEventListener('DOMContentLoaded', function() {
    const submit = document.getElementById('btn-submit');
    const form = document.getElementById('login-form');

    submit.addEventListener('click', function(event) {
        event.preventDefault();

        const username = form.querySelector('#username').value;
        const password = form.querySelector('#password').value;
        const jsonData = jsonFile(username, password);

        const action = form.getAttribute('action');
        const method = form.getAttribute('method').toUpperCase();

        console.log('username:', username);
        console.log('password:', password);
        console.log('action:', action);
        console.log('method:', method);
        console.log('jsonData:', jsonData);

        if (username && password && action && method) {
            makeRequest(action, jsonData, method).then(function(response) {
                console.log('response:', response);
                
                if (response && response.status >= 400 && response.status <= 499) {
                    showModal('Acesso não autorizado');
                } else if (response && response.status >= 200 && response.status <= 299) {
                    response.json().then(data => {
                        localStorage.setItem('authToken', data.token);
                        showModal('Login bem-sucedido!');
                        console.log("login bem sucedido!");
                    });
                } else if (response && response.status >= 500 && response.status <= 599) {
                    showModal('Erro no servidor: ' + response.status);
                } else {
                    showModal('Erro desconhecido. Status code: ' + (response ? response.status : 'sem status'));
                }
            }).catch(error => {
                console.error('Erro na requisição:', error);
            });
        } else {
            showModal("Preencha todos os campos.");
        }
    });
});

function jsonFile(username, password) {
    const formData = {
        username: username,
        password: password
    };
    return JSON.stringify(formData);
}

function makeRequest(url, data, method) {
    console.log('Making request to:', url);
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
