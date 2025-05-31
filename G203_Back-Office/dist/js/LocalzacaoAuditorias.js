// Função para registrar uma localização
function registrarLocalizacao(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário
  
    // Obter os valores dos campos do formulário
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    
    // Criar um objeto para a localização
    const localizacao = {
      latitude,
      longitude
    };
  
    // Obter a lista de localizações do Local Storage
    let localizacoes = JSON.parse(localStorage.getItem('localizacoesAuditorias')) || [];
  
    // Adicionar a nova localização à lista
    localizacoes.push(localizacao);
  
    // Salvar a lista atualizada no Local Storage
    localStorage.setItem('localizacoesAuditorias', JSON.stringify(localizacoes));
  
    // Limpar o formulário
    document.querySelector('form').reset();
  
    // Exibir uma mensagem de sucesso
    alert('Localização registrada com sucesso!');
  }
  
  // Verificar se está na página LocalizacaoAuditorias.html e adicionar o evento ao formulário
  if (window.location.pathname.includes('LocalizacaoAuditorias.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('form');
      if (form) {
        form.addEventListener('submit', registrarLocalizacao);
      }
    });
  }
  