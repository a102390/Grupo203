// Script para carregar auditorias do localStorage e popular a tabela
document.addEventListener('DOMContentLoaded', function() {
    // Carregar as auditorias do localStorage
    let auditorias = [];
    try {
      const auditoriasData = localStorage.getItem('auditorias');
      if (auditoriasData) {
        auditorias = JSON.parse(auditoriasData);
      }
    } catch (error) {
      console.error('Erro ao carregar auditorias do localStorage:', error);
    }
  
    // Selecionar o corpo da tabela
    const tableBody = document.querySelector('.table tbody');
    
    // Limpar a tabela atual
    tableBody.innerHTML = '';
  
    // Verificar se existem auditorias para exibir
    if (auditorias && auditorias.length > 0) {
      // Adicionar cada auditoria à tabela
      auditorias.forEach((auditoria, index) => {
        const row = document.createElement('tr');
        row.className = 'align-middle';
        
        // Formatar a data para exibição (se estiver no formato ISO)
        let dataFormatada = auditoria.data;
        try {
          if (auditoria.data && auditoria.data.includes('-')) {
            const data = new Date(auditoria.data);
            dataFormatada = data.toLocaleDateString('pt-PT');
          }
        } catch (error) {
          console.error('Erro ao formatar data:', error);
        }
        
        // Criar conteúdo da linha
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${auditoria.tipoAuditoria || 'Não especificado'}</td>
          <td>${auditoria.descricao || 'Não especificado'}</td>
          <td>${dataFormatada || 'Não especificado'}</td>
          <td>
            <button class="btn btn-info btn-flat float-end me-2" onclick="visualizarDetalhes(${index})">Ver Detalhes</button>
            <button class="btn btn-default btn-flat float-end me-2" onclick="exportarPDF(${index})">Exportar PDF</button>
          </td>
        `;
        
        tableBody.appendChild(row);
      });
    } else {
      // Se não houver auditorias, exibir mensagem
      const row = document.createElement('tr');
      row.className = 'align-middle';
      row.innerHTML = `
        <td colspan="5" class="text-center">Nenhuma auditoria encontrada. Os dados serão exibidos aqui quando disponíveis.</td>
      `;
      tableBody.appendChild(row);
    }
  });
// Função para converter o tipo de profissional para texto legível
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
  
  // Funções para manipulação de dados (podem ser implementadas conforme necessário)
  function visualizarDetalhes(index) {
    try {
      const auditoriasData = localStorage.getItem('auditorias');
      if (auditoriasData) {
        const auditorias = JSON.parse(auditoriasData);
        const auditoria = auditorias[index];

        // Obter profissionaisDisponiveis da auditoria (se existirem)
        let profissionaisHtml = 'Nenhum';
        if (auditoria.profissionaisDisponiveis && auditoria.profissionaisDisponiveis.length > 0) {
        profissionaisHtml = auditoria.profissionaisDisponiveis
          .map(p => `${p}`)
          .join('<br>');
        }
              // Mapeamento de prioridade
        const prioridadeLabels = {
          "1": "Muito Baixo",
          "2": "Baixo",
          "3": "Médio",
          "4": "Alto",
          "5": "Muito Alto"
        };
        const prioridadeTexto = prioridadeLabels[auditoria.prioridade] || auditoria.prioridade || 'Não especificado';

        // Criar modal para exibir detalhes
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'detalhesModal';
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('aria-labelledby', 'detalhesModalLabel');
        modal.setAttribute('aria-hidden', 'true');

        // Formatar peritos e materiais para exibição
        let peritosHtml = 'Nenhum';
        if (auditoria.peritos && auditoria.peritos.length > 0) {
          peritosHtml = auditoria.peritos.join('<br>');
        }

        let materiaisHtml = 'Nenhum';
        if (auditoria.materiais && auditoria.materiais.length > 0) {
          materiaisHtml = auditoria.materiais.join('<br>');
        }

        modal.innerHTML = `
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="detalhesModalLabel">Detalhes da Auditoria: ${auditoria.nome || 'Sem nome'}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="row">
                  <div class="col-md-6">
                    <p><strong>Origem:</strong> ${auditoria.origem || 'Não especificado'}</p>
                    <p><strong>Descrição:</strong> ${auditoria.descricao || 'Não especificado'}</p>
                    <p><strong>Tipo:</strong> ${auditoria.tipoAuditoria || 'Não especificado'}</p>
                    <p><strong>Prioridade:</strong> ${prioridadeTexto}</p>
                    <p><strong>Data:</strong> ${auditoria.data || 'Não especificado'}</p>
                    <p><strong>Local:</strong> ${auditoria.nomeLocal || 'Não especificado'}</p>
                    <p><strong>Duração Estimada:</strong> ${auditoria.duracaoEstimada || 'Não especificado'} minutos</p>
                  </div>
                  <div class="col-md-6">
                    <p><strong>Latitude:</strong> ${auditoria.latitude || 'Não especificado'}</p>
                    <p><strong>Longitude:</strong> ${auditoria.longitude || 'Não especificado'}</p>
                    <p><strong>Estado:</strong> ${auditoria.estado || 'Não especificado'}</p>
                    <p><strong>Data de Criação:</strong> ${new Date(auditoria.dataCriacao).toLocaleString('pt-PT') || 'Não especificado'}</p>
                    <div>
                      <p><strong>Peritos:</strong></p>
                      <div class="ms-2">${peritosHtml}</div>
                    </div>
                    <div>
                      <p><strong>Materiais:</strong></p>
                      <div class="ms-2">${materiaisHtml}</div>
                    </div>
                    <div>
                      <p><strong>Profissionais Disponíveis:</strong></p>
                      <div class="ms-2">${profissionaisHtml}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
              </div>
            </div>
          </div>
        `;

        // Remover modal existente se houver
        const existingModal = document.getElementById('detalhesModal');
        if (existingModal) {
          existingModal.remove();
        }

        // Adicionar o modal ao body
        document.body.appendChild(modal);

        // Inicializar e mostrar o modal
        const modalInstance = new bootstrap.Modal(document.getElementById('detalhesModal'));
        modalInstance.show();
      }
    } catch (error) {
      console.error('Erro ao exibir detalhes:', error);
      alert('Erro ao exibir detalhes da auditoria.');
    }
  }
  
  function exportarPDF(index) {
    try {
      const auditoriasData = localStorage.getItem('auditorias');
      if (auditoriasData) {
        const auditorias = JSON.parse(auditoriasData);
        const auditoria = auditorias[index];
        
        // Verificar se as bibliotecas necessárias estão carregadas
        if (typeof jspdf === 'undefined' || typeof jspdf.jsPDF === 'undefined') {
          // Carregar as bibliotecas dinamicamente se não estiverem disponíveis
          loadJsPdfLibraries(function() {
            generatePdf(auditoria);
          });
        } else {
          // Se as bibliotecas já estiverem carregadas, gerar o PDF diretamente
          generatePdf(auditoria);
        }
      }
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar auditoria para PDF.');
    }
  }
  
  // Função para carregar as bibliotecas jsPDF e jspdf-autotable dinamicamente
  function loadJsPdfLibraries(callback) {
    // Carregar jsPDF
    const jsPdfScript = document.createElement('script');
    jsPdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    jsPdfScript.onload = function() {
      console.log('jsPDF carregado');
      
      // Após carregar jsPDF, carregar autotable
      const autoTableScript = document.createElement('script');
      autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
      autoTableScript.onload = function() {
        console.log('jsPDF-AutoTable carregado');
        // Chamar o callback quando ambas as bibliotecas estiverem carregadas
        if (typeof callback === 'function') callback();
      };
      document.head.appendChild(autoTableScript);
    };
    document.head.appendChild(jsPdfScript);
  }
  
  // Função para gerar o PDF com as informações da auditoria
  function generatePdf(auditoria) {
    // Criar novo documento PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Definir propriedades do documento
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

        // Mapeamento de prioridade
    const prioridadeLabels = {
      "1": "Muito Baixo",
      "2": "Baixo",
      "3": "Médio",
      "4": "Alto",
      "5": "Muito Alto"
    };
    const prioridadeTexto = prioridadeLabels[auditoria.prioridade] || auditoria.prioridade || 'Não especificado';

    
    // Adicionar cabeçalho
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Auditoria', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 10;
    
    // Adicionar detalhes da auditoria
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Auditoria: ${auditoria.nome || 'Sem nome'}`, margin, yPosition += 10);
    
    // Adicionar data e hora de geração
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const dataHoje = new Date().toLocaleString('pt-PT');
    doc.text(`Relatório gerado em: ${dataHoje}`, pageWidth - margin, yPosition, { align: 'right' });
    yPosition += 10;
    
    // Tabela de informações gerais
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Informações Gerais', margin, yPosition += 10);
    
    // Definir dados para a tabela geral
    const infoGeralHeaders = [['Campo', 'Valor']];
    const infoGeralData = [
      ['Origem', auditoria.origem || 'Não especificado'],
      ['Descrição', auditoria.descricao || 'Não especificado'],
      ['Tipo', auditoria.tipoAuditoria || 'Não especificado'],
      ['Prioridade', prioridadeTexto],
      ['Data', auditoria.data || 'Não especificado'],
      ['Local', auditoria.nomeLocal || 'Não especificado'],
      ['Duração Estimada', `${auditoria.duracaoEstimada || 'Não especificado'} minutos`],
      ['Latitude', auditoria.latitude || 'Não especificado'],
      ['Longitude', auditoria.longitude || 'Não especificado'],
      ['Estado', auditoria.estado || 'Não especificado'],
      ['Data de Criação', new Date(auditoria.dataCriacao).toLocaleString('pt-PT') || 'Não especificado']
    ];
    
    // Adicionar tabela de informações gerais
    doc.autoTable({
      startY: yPosition += 5,
      head: infoGeralHeaders,
      body: infoGeralData,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [66, 66, 66] },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });
    
    // Atualizar a posição Y após a tabela
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Verificar se é necessário adicionar nova página para a tabela de peritos
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }
    
    // Tabela de peritos
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Peritos', margin, yPosition);
    
    // Definir dados para a tabela de peritos
    const peritosHeaders = [['Perito']];
    let peritosData = [];
    
    if (auditoria.peritos && auditoria.peritos.length > 0) {
      peritosData = auditoria.peritos.map(perito => [perito]);
    } else {
      peritosData = [['Nenhum perito associado']];
    }
    
    // Adicionar tabela de peritos
    doc.autoTable({
      startY: yPosition += 5,
      head: peritosHeaders,
      body: peritosData,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [66, 66, 66] }
    });
    
    // Atualizar a posição Y após a tabela
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Verificar se é necessário adicionar nova página para a tabela de materiais
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }
    
    // Tabela de materiais
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Materiais', margin, yPosition);
    
    // Definir dados para a tabela de materiais
    const materiaisHeaders = [['Material']];
    let materiaisData = [];
    
    if (auditoria.materiais && auditoria.materiais.length > 0) {
      materiaisData = auditoria.materiais.map(material => [material]);
    } else {
      materiaisData = [['Nenhum material associado']];
    }
    
    // Adicionar tabela de materiais
    doc.autoTable({
      startY: yPosition += 5,
      head: materiaisHeaders,
      body: materiaisData,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [66, 66, 66] }
    });
    
    yPosition = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : yPosition + 10;

    // Verificar se é necessário adicionar nova página
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Profissionais Disponíveis', margin, yPosition);

    // Preparar dados dos profissionais disponíveis
    const profissionaisHeaders = [['Tipo']];
    let profissionaisData = [];

    if (auditoria.profissionaisDisponiveis && auditoria.profissionaisDisponiveis.length > 0) {
        profissionaisData = auditoria.profissionaisDisponiveis.map(p => [p]);
    } else {
      profissionaisData = [['Nenhum profissional disponível']];
    }

    doc.autoTable({
      startY: yPosition + 5,
      head: profissionaisHeaders,
      body: profissionaisData,
      margin: { left: margin, right: margin },
      headStyles: { fillColor: [66, 66, 66] }
    });
    // Adicionar rodapé
    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Página ${i} de ${totalPaginas}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.text('Eyes Everywhere - Sistema de Auditoria', margin, pageHeight - 10);
    }
    
    // Salvar o PDF
    doc.save(`auditoria_${auditoria.nome || index}_${new Date().toISOString().split('T')[0]}.pdf`);
  }