// Função para registrar uma auditoria
function registrarAuditoria(event) {
    event.preventDefault(); // Evita o comportamento padrão do formulário
    
    // Obter os valores dos campos do formulário
    const nome = document.getElementById('nome').value;
    
    // Obter o valor do radio button selecionado (origem)
    const origemRadios = document.getElementsByName('origem');
    let origem = '';
    for (const radio of origemRadios) {
      if (radio.checked) {
        origem = radio.value;
        break;
      }
    }
    
    const descricao = document.getElementById('descricao').value;
    const tipoAuditoria = document.getElementById('tipoAuditoria').value;
    const prioridade = document.getElementById('prioridade').value;
    const data = document.getElementById('data').value;
    const nomeLocal = document.getElementById('nomeLocal').value;
    const duracaoEstimada = document.getElementById('duracaoEstimada').value;
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    
    const peritosLista = document.getElementById('listaPeritos');
    const peritos = [];
    const emailPeritos = [];
    for (const item of peritosLista.children) {
      peritos.push(item.textContent);
      // Buscar o email do perito pelo nome (ajuste conforme o formato do item.textContent)
      const nomePerito = item.textContent.split(' (')[0];
      const peritosStorage = JSON.parse(localStorage.getItem('peritos')) || [];
      const peritoObj = peritosStorage.find(p => p.nome === nomePerito);
      if (peritoObj && peritoObj.email) {
        emailPeritos.push(peritoObj.email);
      }
    }
    
    // Obter os materiais selecionados
    const materiaisLista = document.getElementById('listaMateriais');
    const materiais = [];
    for (const item of materiaisLista.children) {
      materiais.push(item.textContent);
    }
function tipoParaTexto(tipo) {
  switch (tipo) {
    case 'fiscal': return 'Fiscal de Trânsito';
    case 'tecnico-transportes': return 'Técnico de Transportes Públicos';
    case 'engenheiro-mobilidade': return 'Engenheiro de Mobilidade Urbana';
    case 'tecnico-sinalizacao': return 'Técnico de Sinalização e Segurança Viária';
    case 'auditor-infraestrutura': return 'Auditor de Infraestruturas de Transporte';
    case 'consultor-acessibilidade': return 'Consultor em Acessibilidade Urbana';
    default: return tipo;
  }
}

// Obter apenas os tipos dos profissionais disponíveis
const profissionaisDisponiveisRaw = JSON.parse(localStorage.getItem('profissionaisDisponiveis')) || [];
const profissionaisDisponiveis = profissionaisDisponiveisRaw.map(p => tipoParaTexto(p.tipo));

    // Validar campos obrigatórios
    if (!nome || !descricao || !tipoAuditoria || !data || !nomeLocal || !latitude || !longitude) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    let auditoriasId = JSON.parse(localStorage.getItem('auditorias')) || [];
    let novoId = 1;
    if (auditoriasId.length > 0) {
      // Procura o maior id já existente
      const ids = auditoriasId.map(a => a.id || 0);
      novoId = Math.max(...ids) + 1;
    }
    // Criar um objeto para a auditoria
    const auditoria = {
      id: novoId,
      nome,
      origem,
      descricao,
      tipoAuditoria,
      prioridade,
      data,
      nomeLocal,
      duracaoEstimada,
      latitude,
      longitude,
      peritos,
      emailPeritos,
      materiais,
      profissionaisDisponiveis, // <-- Adiciona a lista dos profissionaisDisponiveis
      dataCriacao: new Date().toISOString(),
      estado: 'Pendente'
    };
    
    // Obter a lista de auditorias do Local Storage
    let auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
    
    // Adicionar a nova auditoria à lista
    auditorias.push(auditoria);
    
    // Salvar a lista atualizada no Local Storage
    localStorage.setItem('auditorias', JSON.stringify(auditorias));
    
    // Limpar o formulário
    document.querySelector('form').reset();
    
    // Limpar as listas de peritos e materiais
    document.getElementById('listaPeritos').innerHTML = '';
    document.getElementById('listaMateriais').innerHTML = '';
    
    // Remover o marcador do mapa
    if (window.currentMarker) {
      window.mapInstance.removeLayer(window.currentMarker);
      window.currentMarker = null;
    }
    
    alert('Auditoria registrada com sucesso!');
  }
  
  // Verificar se está na página PlanoDeAuditoria.html e adicionar o evento ao formulário
  if (window.location.pathname.includes('PlanoDeAuditoria.html')) {
    document.addEventListener('DOMContentLoaded', () => {
      const form = document.querySelector('form');
      if (form) {
        form.addEventListener('submit', registrarAuditoria);
      }
    });
  }