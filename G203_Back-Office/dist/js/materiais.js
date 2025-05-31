document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formGestaoMateriais');
  const listaMateriais = document.getElementById('listaMateriais');

  function carregarMateriais() {
    listaMateriais.innerHTML = '';
    const materiais = JSON.parse(localStorage.getItem('materiais')) || [];

    materiais.forEach((material, index) => {
      // Inicialização retrocompatível
      if (material.quantidadeTotal === undefined) {
        material.quantidadeTotal = parseInt(material.quantidade) || 0;
        material.quantidadeDisponivel = material.quantidadeTotal;
        material.emAuditoria = 0;
      }

      const listItem = document.createElement('li');
      listItem.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap';
      listItem.innerHTML = `
        <div>
          <strong>${material.nome}</strong> (${material.tipo})<br>
          Disponível: <span class="badge bg-success">${material.quantidadeDisponivel}</span>
          ${material.emAuditoria > 0 ? `| <span class="badge bg-warning">Em auditoria: ${material.emAuditoria}</span>` : ''}
        </div>
      `;

      // Botão de retornar material se estiver em auditoria
      if (material.emAuditoria > 0) {
        const returnBtn = document.createElement('button');
        returnBtn.className = 'btn btn-primary btn-sm ms-2';
        returnBtn.textContent = 'Retornar Material';
        returnBtn.onclick = function () {
          // Retorna todo o material em auditoria para disponível
          material.quantidadeDisponivel += material.emAuditoria;
          material.emAuditoria = 0;
          materiais[index] = material;
          localStorage.setItem('materiais', JSON.stringify(materiais));
          carregarMateriais();
        };
        listItem.appendChild(returnBtn);
      }

      // Botão de remoção
      const removeButton = document.createElement('button');
      removeButton.className = 'btn btn-danger btn-sm ms-2';
      removeButton.textContent = 'Remover';
      removeButton.onclick = function () {
        materiais.splice(index, 1);
        localStorage.setItem('materiais', JSON.stringify(materiais));
        carregarMateriais();
      };
      listItem.appendChild(removeButton);

      listaMateriais.appendChild(listItem);
    });
  }

  // Carregar materiais ao carregar a página
  carregarMateriais();

  // Salvar material no localStorage ao enviar o formulário
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('nome-material').value;
      const tipo = document.getElementById('tipo').value;
      const descricao = document.getElementById('descricao').value;
      const quantidade = parseInt(document.getElementById('quantidade').value);

      const material = {
        nome,
        tipo,
        descricao,
        quantidadeTotal: quantidade,
        quantidadeDisponivel: quantidade,
        emAuditoria: 0
      };

      const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
      materiais.push(material);
      localStorage.setItem('materiais', JSON.stringify(materiais));

      alert('Material guardado com sucesso!');
      form.reset();
      carregarMateriais();
    });
  }
});