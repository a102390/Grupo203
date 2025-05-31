document.addEventListener('DOMContentLoaded', function () {
  google.accounts.id.initialize({
    client_id: '872327475930-lkter6krmeh53tiup93ulun9suhli311.apps.googleusercontent.com', // Substitua pelo seu ID do cliente
    callback: handleCredentialResponse,
  });

  google.accounts.id.renderButton(
    document.getElementById('googleLoginBtn'), // ID do botão
    { theme: 'outline', size: 'large' } // Configurações do botão
  );

  google.accounts.id.prompt(); // Exibe o prompt de login automaticamente
});

function handleCredentialResponse(response) {
  // Decodifica o token JWT para obter informações do perfil do usuário
  const decodedToken = parseJwt(response.credential);
  console.log("Encoded JWT ID token: " + response.credential);
  console.log("Decoded JWT ID token:", decodedToken);

  // Extrai o nome do usuário
  const userName = decodedToken.name;
  const userPicture = decodedToken.picture;

  // Salva o nome do usuário no localStorage
  localStorage.setItem('googleUserName', userName);
  localStorage.setItem('googlePicture', userPicture);

  // Exibe uma mensagem de sucesso
  alert('Login efetuado com sucesso como: ' + userName);

  // Redireciona para outra página (exemplo)
  window.location.href = "../pages/Dashboard.html";
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}