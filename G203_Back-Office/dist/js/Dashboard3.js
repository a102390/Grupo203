// Gráfico de Materiais em Utilização (quantidade em auditoria por material)

document.addEventListener('DOMContentLoaded', function () {
  // Cria o card se não existir
  let chartCard = document.getElementById('materiais-em-utilizacao-card');
  if (!chartCard) {
    chartCard = document.createElement('div');
    chartCard.className = 'card mb-4';
    chartCard.id = 'materiais-em-utilizacao-card';
    chartCard.innerHTML = `
      <div class="card-header border-0">
        <div class="d-flex justify-content-between">
          <h3 class="card-title">Materiais em Utilização</h3>
        </div>
      </div>
      <div class="card-body">
        <div id="materiais-em-utilizacao-chart" style="min-height:320px;"></div>
        <div class="d-flex flex-row justify-content-end mt-3">
          <span class="me-2">
            <i class="bi bi-square-fill text-warning"></i> Em Auditoria
          </span>
        </div>
      </div>
    `;
    // Insere o card antes do dashboard-materiais
    const dashboardMateriais = document.getElementById('dashboard-materiais');
    if (dashboardMateriais) {
      dashboardMateriais.parentNode.insertBefore(chartCard, dashboardMateriais);
    } else {
      // fallback: adiciona ao body
      document.body.appendChild(chartCard);
    }
  }

  // Função para renderizar o gráfico
  function renderChart() {
    const materiais = JSON.parse(localStorage.getItem('materiais')) || [];
    // Filtra apenas materiais com emAuditoria > 0
    const emUso = materiais.filter(m => (m.emAuditoria ?? 0) > 0);

    const nomes = emUso.map(m => m.nome);
    const quantidades = emUso.map(m => m.emAuditoria);

    const chartContainer = document.getElementById('materiais-em-utilizacao-chart');
    if (!chartContainer) return;

    // Destroi gráfico anterior se existir
    if (window.materiaisUtilizacaoChart) {
      window.materiaisUtilizacaoChart.destroy();
    }

    if (emUso.length === 0) {
      chartContainer.innerHTML = `<div class="alert alert-info">Nenhum material em utilização.</div>`;
      return;
    }

    // Cria o gráfico de barras horizontais
    const options = {
      series: [{
        name: 'Em Auditoria',
        data: quantidades
      }],
      chart: {
        type: 'bar',
        height: 320,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 6,
          barHeight: '60%',
        }
      },
      colors: ['#ffc107'],
      dataLabels: {
        enabled: true,
        style: { fontSize: '14px', fontWeight: 'bold' }
      },
      xaxis: {
        categories: nomes,
        title: { text: 'Quantidade' },
        labels: { style: { fontSize: '14px' } }
      },
      yaxis: {
        labels: { style: { fontSize: '14px' } }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: '#fff' }
      },
      grid: {
        borderColor: '#444',
        row: { colors: ['#222', 'transparent'], opacity: 0.1 }
      },
      tooltip: {
        y: { formatter: val => `${val} em auditoria` }
      }
    };

    window.materiaisUtilizacaoChart = new ApexCharts(chartContainer, options);
    window.materiaisUtilizacaoChart.render();
  }

  renderChart();

  // Atualiza gráfico se houver alteração nos materiais em outra aba
  window.addEventListener('storage', function (e) {
    if (e.key === 'materiais') renderChart();
  });
});