document.addEventListener('DOMContentLoaded', function () {
  const tabelaAuditorias = document.querySelector('.table.table-bordered tbody');
  let ocorrenciasConvertidas = JSON.parse(localStorage.getItem('ocorrenciasConvertidas')) || [];

  // Renderizar as ocorrências convertidas na tabela
  function renderizarAuditorias() {
    tabelaAuditorias.innerHTML = '';
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

  // Evento do botão "Criar Plano"
  tabelaAuditorias.addEventListener('click', function (event) {
    if (event.target.classList.contains('btn-criar-plano')) {
      const id = parseInt(event.target.getAttribute('data-id'), 10);
      localStorage.setItem('ocorrenciaPlanoId', id);
      window.location.href = 'PlanoDeAuditoria.html';
    }
  });

  renderizarAuditorias();
});