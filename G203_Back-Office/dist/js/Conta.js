// Atualiza o nome do usuário no menu
document.addEventListener('DOMContentLoaded', function () {
    const userName = localStorage.getItem('googleUserName');
    const userPicture = localStorage.getItem('googlePicture');
  
    if (userName) {
      const userElements = document.querySelectorAll('.user-menu span, .user-header p');
      userElements.forEach(element => {
        element.textContent = userName;
      });
    }

    
    if (userPicture) {
      // Seleciona todas as imagens do utilizador, incluindo a do user-header
      const userImages = document.querySelectorAll('.user-image, .rounded-circle.shadow, .user-header img');

      userImages.forEach(img => {
          img.src = userPicture;
      });
    }

  });
  
  // Adiciona funcionalidade ao botão de "Sign out"
  document.addEventListener('DOMContentLoaded', function () {
    const signOutBtn = document.getElementById('signOutBtn');
  
    if (signOutBtn) {
      signOutBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Evita o comportamento padrão do link
  
        // Limpa o localStorage
        localStorage.removeItem('googleUserName');
  
        // Redireciona para a página de login
        window.location.href = "../pages/Login.html";
      });
    }
  });