// Função para registrar um perito
function registrarPerito(event) {
  event.preventDefault(); // Evita o comportamento padrão do formulário

  // Obter os valores dos campos do formulário
  const nome = document.getElementById('nome').value;
  const morada = document.getElementById('morada').value;
  const telemovel = document.getElementById('telemovel').value;
  const areaEspecialidade = document.getElementById('areaEspecialidade').value;
  const dataNascimento = document.getElementById('dataNascimento').value;
  const email = document.getElementById('exampleInputEmail1').value;

  // Criar um objeto para o perito
  const perito = {
    nome,
    morada,
    telemovel,
    areaEspecialidade,
    dataNascimento,
    email,
    emAuditoria: false
  };

  // Obter a lista de peritos do Local Storage
  let peritos = JSON.parse(localStorage.getItem('peritos')) || [];

  // Adicionar o novo perito à lista
  peritos.push(perito);

  // Salvar a lista atualizada no Local Storage
  localStorage.setItem('peritos', JSON.stringify(peritos));

  // Limpar o formulário
  document.querySelector('form').reset();

  // Exibir uma mensagem de sucesso
  alert('Perito registrado com sucesso!');
}

// Verificar se está na página RegistarPeritos.html e adicionar o evento ao formulário
if (window.location.pathname.includes('RegistarPeritos.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', registrarPerito);
    }
  });
}



  
function exibirPeritosGestao() {
  const peritos = JSON.parse(localStorage.getItem('peritos')) || [];
  const tabelaBody = document.querySelector('table tbody');
  if (!tabelaBody) return;
  tabelaBody.innerHTML = '';

  peritos.forEach((perito, index) => {
    const row = document.createElement('tr');
    row.classList.add('align-middle');
    row.innerHTML = `
      <td>${perito.nome}</td>
      <td>${perito.morada}</td>
      <td>${perito.dataNascimento}</td>
      <td>${perito.areaEspecialidade}</td>
      <td>${perito.email}</td>
      <td>${perito.telemovel}</td>
      <td>
        <button class="btn btn-danger btn-sm remover-perito" data-index="${index}">Remover</button>
        ${perito.emAuditoria ? `<button class="btn btn-primary btn-sm ms-2 retornar-perito" data-index="${index}">Retornar Perito</button>` : ''}
      </td>
    `;
    tabelaBody.appendChild(row);
  });

  document.querySelectorAll('.remover-perito').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      if (confirm('Tem a certeza que quer remover este perito?')) {
        removerPerito(index);
      }
    });
  });

  document.querySelectorAll('.retornar-perito').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      retornarPerito(index);
    });
  });
}

function retornarPerito(index) {
  let peritos = JSON.parse(localStorage.getItem('peritos')) || [];
  if (peritos[index]) {
    peritos[index].emAuditoria = false;
    localStorage.setItem('peritos', JSON.stringify(peritos));
    exibirPeritosGestao();
  }
}

function removerPerito(index) {
  let peritos = JSON.parse(localStorage.getItem('peritos')) || [];
  peritos.splice(index, 1); // Remove o perito do array
  localStorage.setItem('peritos', JSON.stringify(peritos)); // Atualiza o storage
  exibirPeritosGestao(); // Re-renderiza a tabela
}


// Chamar a função automaticamente se estiver na página GestaoPeritos.html
if (window.location.pathname.includes('GestaoPeritos.html')) {
  document.addEventListener('DOMContentLoaded', exibirPeritosGestao);
}






// Função para carregar os peritos no dropdown "Perito Associado" em CriarOcorrencia.html
function carregarPeritosParaCriarOcorrencia() {
  // Obter a lista de peritos do Local Storage
  const peritos = JSON.parse(localStorage.getItem('peritos')) || [];
  const peritoSelect = document.getElementById('perito');

  if (!peritoSelect) return; // Verifica se o elemento existe na página

  // Limpar opções existentes
  peritoSelect.innerHTML = '<option value="">Não atribuído</option>';

  // Adicionar opções dinamicamente
  peritos.forEach((perito, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${perito.nome} - ${perito.email}`;
    peritoSelect.appendChild(option);
  });
}

// Chamar a função automaticamente se estiver na página CriarOcorrencia.html
if (window.location.pathname.includes('CriarOcorrencia.html')) {
  document.addEventListener('DOMContentLoaded', carregarPeritosParaCriarOcorrencia);
}