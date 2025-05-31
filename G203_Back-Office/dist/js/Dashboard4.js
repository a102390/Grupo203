document.addEventListener('DOMContentLoaded', function () {
  // Só executa na página de Gestão de Profissionais
  if (!window.location.pathname.includes('Dashboard.html')) return;

  // Cria o container do dashboard se não existir
  let dashboardDiv = document.getElementById('dashboard-profissionais-acao');
  if (!dashboardDiv) {
    dashboardDiv = document.createElement('div');
    dashboardDiv.id = 'dashboard-profissionais-acao';
    dashboardDiv.style.height = '320px';
    // Insere antes da lista de profissionais
    const cardBody = document.querySelector('.card-body');
    if (cardBody) {
      cardBody.insertBefore(dashboardDiv, cardBody.firstChild);
    }
  }

  // Função para traduzir o tipo para texto legível
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

  function gerarDashboardProfissionaisAcao() {
    const profissionaisIndisponiveis = JSON.parse(localStorage.getItem('profissionaisIndisponiveis')) || [];
    // Conta por tipo
    const contagem = {};
    profissionaisIndisponiveis.forEach(p => {
      // Se o tipo já está em texto, mantém, senão traduz
      const tipo = tipoParaTexto(p.tipo || p.tipoProfissional || p['Tipo'] || p['tipo-profissional'] || p);
      contagem[tipo] = (contagem[tipo] || 0) + 1;
    });

    const tipos = Object.keys(contagem);
    const valores = Object.values(contagem);

    // Destroi gráfico anterior se houver
    if (dashboardDiv._chart) {
      dashboardDiv._chart.destroy();
    }

    // Se não há dados, mostra mensagem
    if (tipos.length === 0) {
      dashboardDiv.innerHTML = '<div class="text-center text-secondary mt-5">Nenhum profissional em ação.</div>';
      return;
    } else {
      dashboardDiv.innerHTML = '';
    }

    const options = {
      chart: { type: 'bar', height: 320 },
      series: [{ name: 'Em Ação', data: valores }],
      xaxis: { categories: tipos },
      colors: ['#0d6efd'],
      dataLabels: { enabled: true },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        }
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return val + " profissional(is)";
          }
        }
      }
    };

    const chart = new ApexCharts(dashboardDiv, options);
    chart.render();
    dashboardDiv._chart = chart;
  }

  // Atualiza ao carregar e sempre que a lista mudar
  gerarDashboardProfissionaisAcao();

  // Observa mudanças na lista de profissionais para atualizar o gráfico
  const lista = document.getElementById('listaProfissionais');
  if (lista) {
    const observer = new MutationObserver(gerarDashboardProfissionaisAcao);
    observer.observe(lista, { childList: true, subtree: false });
  }
});