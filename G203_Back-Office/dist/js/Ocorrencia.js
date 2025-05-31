// Função para salvar a ocorrência no Local Storage
function salvarOcorrencia(event) {
  event.preventDefault(); // Previne o comportamento padrão do formulário

  // Obter os valores dos campos do formulário
  const tipo = document.getElementById('tipo').value.trim();
  const descricao = document.getElementById('descricao').value.trim();
  const data = document.getElementById('data').value;
  const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;
  const anexos = document.getElementById('anexos').files;

  // Verificar se os campos obrigatórios estão preenchidos
  if (!descricao || !data || !latitude || !longitude) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Obter a lista de ocorrências do Local Storage
  let ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];

  // Determinar o próximo ID
  const ultimoId = ocorrencias.length > 0 ? Math.max(...ocorrencias.map(o => o.id)) : 0;
  const novoId = ultimoId + 1;

  // Criar um objeto para a ocorrência
  const ocorrencia = {
    id: novoId, // Atribuir o próximo ID sequencial
    tipo,
    descricao,
    data,
    latitude,
    longitude,
    anexos: Array.from(anexos).map((file) => file.name), // Salvar apenas os nomes dos arquivos
    imagem: null
  };
  if (anexos.length > 0) {
    const file = anexos[0];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        ocorrencia.imagem = e.target.result;
        // Adicionar a nova ocorrência à lista
        ocorrencias.push(ocorrencia);
        // Salvar a lista atualizada no Local Storage
        localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));
        alert('Ocorrência salva com sucesso!');
        document.querySelector('form').reset();
      };
      reader.readAsDataURL(file);
      return; // Aguarda o FileReader terminar antes de continuar
    }
  }
  // Adicionar a nova ocorrência à lista
  ocorrencias.push(ocorrencia);

  // Salvar a lista atualizada no Local Storage
  localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));

  // Exibir uma mensagem de sucesso
  alert('Ocorrência salva com sucesso!');

  // Limpar o formulário
  document.querySelector('form').reset();
}

// Adicionar o evento de submit ao formulário apenas na página CriarOcorrencia.html
if (window.location.pathname.includes('CriarOcorrencia.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', salvarOcorrencia);
    }
  });
}






if (window.location.pathname.includes('ListaOcorrencias.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const tabelaOcorrencias = document.querySelector('.table.table-bordered tbody');

    // Obter as ocorrências do Local Storage
    let ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];

    // Função para renderizar as ocorrências na tabela
    function renderizarOcorrencias() {
      tabelaOcorrencias.innerHTML = ''; // Limpar a tabela

      ocorrencias.forEach((ocorrencia) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${ocorrencia.id}</td>
          <td>${ocorrencia.tipo || 'N/A'}</td>
          <td>${ocorrencia.descricao}</td>
          <td>Pendente</td>
          <td>
            <button class="btn btn-info btn-ver" data-id="${ocorrencia.id}">Ver Informações</button>
            <button class="btn btn-success btn-aprovar" data-id="${ocorrencia.id}">Aprovar</button>
            <button class="btn btn-danger btn-rejeitar" data-id="${ocorrencia.id}">Rejeitar</button>
            <button class="btn btn-warning btn-solicitar" data-id="${ocorrencia.id}">Solicitar Informações</button>
          </td>
        `;
        tabelaOcorrencias.appendChild(tr);
      });
    }

    // Função para aprovar uma ocorrência
    function aprovarOcorrencia(id) {
      const ocorrenciaIndex = ocorrencias.findIndex((o) => o.id === id);
      if (ocorrenciaIndex === -1) return;

      const ocorrencia = ocorrencias[ocorrenciaIndex];

      // Obter as ocorrências aprovadas do Local Storage
      const ocorrenciasAprovadas = JSON.parse(localStorage.getItem('ocorrenciasAprovadas')) || [];

      // Adicionar a ocorrência aprovada
      ocorrenciasAprovadas.push(ocorrencia);

      // Salvar no Local Storage
      localStorage.setItem('ocorrenciasAprovadas', JSON.stringify(ocorrenciasAprovadas));

      // Remover a ocorrência da lista de ocorrências
      ocorrencias.splice(ocorrenciaIndex, 1);
      localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));

      // Exibir mensagem de sucesso
      alert(`Ocorrência ${id} aprovada com sucesso!`);

      // Atualizar a tabela
      renderizarOcorrencias();
    }

    // Função para rejeitar uma ocorrência
    function rejeitarOcorrencia(id) {
      const ocorrenciaIndex = ocorrencias.findIndex((o) => o.id === id);
      if (ocorrenciaIndex === -1) return;

      // Remover a ocorrência da lista de ocorrências
      ocorrencias.splice(ocorrenciaIndex, 1);
      localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));

      // Exibir mensagem de sucesso
      alert(`Ocorrência ${id} rejeitada com sucesso!`);

      // Atualizar a tabela
      renderizarOcorrencias();
    }

    // Adicionar evento de clique nos botões de aprovar e rejeitar
    tabelaOcorrencias.addEventListener('click', (event) => {
      const id = parseInt(event.target.getAttribute('data-id'), 10);

      if (event.target.classList.contains('btn-aprovar')) {
        aprovarOcorrencia(id);
      } else if (event.target.classList.contains('btn-rejeitar')) {
        rejeitarOcorrencia(id);
      } else if (event.target.classList.contains('btn-ver')) {
        const ocorrencia = ocorrencias.find(o => o.id === id);
        if (!ocorrencia) return;
        let info = `
          <strong>ID:</strong> ${ocorrencia.id}<br>
          <strong>Tipo:</strong> ${ocorrencia.tipo || 'N/A'}<br>
          <strong>Descrição:</strong> ${ocorrencia.descricao}<br>
          <strong>Data:</strong> ${ocorrencia.data}<br>
          <strong>Latitude:</strong> ${ocorrencia.latitude}<br>
          <strong>Longitude:</strong> ${ocorrencia.longitude}<br>
        `;
        if (ocorrencia.imagem) {
          info += `<strong>Imagem:</strong><br><img src="${ocorrencia.imagem}" alt="Imagem da Ocorrência" style="max-width:300px;max-height:200px;"><br>`;
        }
        // Exibe as informações num modal simples (ou alert se preferir)
        const modal = document.createElement('div');
        modal.innerHTML = `
          <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;">
            <div style="background:#222;padding:24px;border-radius:8px;max-width:90vw;max-height:90vh;overflow:auto;color:#fff;">
              <h4>Informações da Ocorrência</h4>
              <div style="margin-bottom:16px;">${info}</div>
              <button id="fecharModalInfo" class="btn btn-secondary">Fechar</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('fecharModalInfo').onclick = () => modal.remove();
      } else if (event.target.classList.contains('btn-solicitar')) {
        const ocorrencia = ocorrencias.find(o => o.id === id);
        if (!ocorrencia || !ocorrencia.email) {
          alert('Esta ocorrência não tem email associado.');
          return;
        }
        // Mensagem padrão
        const subject = encodeURIComponent('Solicitação de Mais Informações sobre a Ocorrência #' + ocorrencia.id);
        const body = encodeURIComponent(
          `Caro(a),\n\n` +
          `Estamos a analisar a sua ocorrência com os seguintes dados:\n\n` +
          `ID: ${ocorrencia.id}\n` +
          `Tipo: ${ocorrencia.tipo}\n` +
          `Descrição: ${ocorrencia.descricao}\n` +
          `Data: ${ocorrencia.data}\n` +
          `Endereço: ${ocorrencia.endereco || ''}\n\n` +
          `Para melhor esclarecimento, solicitamos que nos envie mais informações ou detalhes relevantes.\n\n` +
          `Obrigado.`
        );
        // Abre o cliente de email do utilizador
        window.location.href = `mailto:${ocorrencia.email}?subject=${subject}&body=${body}`;
      }
    });

    // Renderizar as ocorrências ao carregar a página
    renderizarOcorrencias();
  });
}








if (window.location.pathname.includes('ListaOcorrencias.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const tabelaOcorrenciasAprovadas = document.querySelector('.table.table-bordered-1 tbody');

    // Obter as ocorrências aprovadas do Local Storage
    let ocorrenciasAprovadas = JSON.parse(localStorage.getItem('ocorrenciasAprovadas')) || [];

    // Função para renderizar as ocorrências aprovadas na tabela
    function renderizarOcorrenciasAprovadas() {
      tabelaOcorrenciasAprovadas.innerHTML = ''; // Limpar a tabela

      ocorrenciasAprovadas.forEach((ocorrencia) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${ocorrencia.id}</td>
          <td>${ocorrencia.tipo || 'N/A'}</td>
          <td>${ocorrencia.descricao}</td>
          <td>Aprovada</td>
          <td>
            <button class="btn btn-primary btn-converter" data-id="${ocorrencia.id}">Converter para Auditoria</button>
          </td>
        `;
        tabelaOcorrenciasAprovadas.appendChild(tr);
      });
    }

    // Função para converter uma ocorrência para auditoria
    function converterParaAuditoria(id) {
      const ocorrenciaIndex = ocorrenciasAprovadas.findIndex((o) => o.id === id);
      if (ocorrenciaIndex === -1) return;

      const ocorrencia = ocorrenciasAprovadas[ocorrenciaIndex];

      // Obter as ocorrências convertidas para auditoria do Local Storage
      const ocorrenciasConvertidas = JSON.parse(localStorage.getItem('ocorrenciasConvertidas')) || [];

      // Adicionar a ocorrência convertida
      ocorrenciasConvertidas.push(ocorrencia);

      // Salvar no Local Storage
      localStorage.setItem('ocorrenciasConvertidas', JSON.stringify(ocorrenciasConvertidas));

      // Remover a ocorrência da lista de aprovadas
      ocorrenciasAprovadas.splice(ocorrenciaIndex, 1);
      localStorage.setItem('ocorrenciasAprovadas', JSON.stringify(ocorrenciasAprovadas));

      // Exibir mensagem de sucesso
      alert(`Ocorrência ${id} convertida para auditoria com sucesso!`);

      // Atualizar a tabela
      renderizarOcorrenciasAprovadas();
    }

    // Adicionar evento de clique no botão de converter para auditoria
    tabelaOcorrenciasAprovadas.addEventListener('click', (event) => {
      const id = parseInt(event.target.getAttribute('data-id'), 10);

      if (event.target.classList.contains('btn-converter')) {
        converterParaAuditoria(id);
      }
    });

    // Renderizar as ocorrências aprovadas ao carregar a página
    renderizarOcorrenciasAprovadas();
  });
}






if (window.location.pathname.includes('PedidosAuditoria.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    const tabelaAuditorias = document.querySelector('.table.table-bordered tbody');

    // Obter as ocorrências convertidas para auditoria do Local Storage
    let ocorrenciasConvertidas = JSON.parse(localStorage.getItem('ocorrenciasConvertidas')) || [];

    // Função para renderizar as ocorrências convertidas na tabela
    function renderizarAuditorias() {
      tabelaAuditorias.innerHTML = ''; // Limpar a tabela

      ocorrenciasConvertidas.forEach((ocorrencia) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${ocorrencia.id}</td>
          <td>${ocorrencia.descricao}</td>
          <td>${ocorrencia.tipo || 'N/A'}</td>
          <td>${ocorrencia.data}</td>
          <td>
            <button class="btn btn-default btn-flat float-end me-2 btn-criar-plano" data-id="${ocorrencia.id}">Criar Plano</button>
          </td>
        `;
        tabelaAuditorias.appendChild(tr);
      });
    }

    // Função para criar um plano (exemplo de ação ao clicar no botão)
    function criarPlano(id) {
      const ocorrencia = ocorrenciasConvertidas.find((o) => o.id === id);
      if (!ocorrencia) return;

      // Exibir mensagem de sucesso (ou redirecionar para outra página)
      alert(`Plano criado para a ocorrência ${id}!`);
    }

    // Adicionar evento de clique no botão "Criar Plano"
    tabelaAuditorias.addEventListener('click', (event) => {
      if (event.target.classList.contains('btn-criar-plano')) {
        const id = parseInt(event.target.getAttribute('data-id'), 10);
        criarPlano(id);
      }
    });

    // Renderizar as auditorias ao carregar a página
    renderizarAuditorias();
  });
}