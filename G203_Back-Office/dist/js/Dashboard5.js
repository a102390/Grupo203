// Cria o gráfico de auditorias por área (nome do local) para a data atual
document.addEventListener('DOMContentLoaded', function () {
  // Seleciona onde o gráfico será exibido
  let container = document.getElementById('dashboard-auditorias-area');
  if (!container) {
    // Cria o container se não existir
    container = document.createElement('div');
    container.id = 'dashboard-auditorias-area';
    // Adiciona no final da .container-fluid da dashboard
    const mainContainer = document.querySelector('.container-fluid .row');
    if (mainContainer) {
      // Adiciona como nova coluna
      const col = document.createElement('div');
      col.className = 'col-lg-6';
      col.appendChild(container);
      mainContainer.appendChild(col);
    } else {
      document.body.appendChild(container);
    }
  }

  // Pega auditorias do localStorage
  const auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
  // Data de hoje no formato YYYY-MM-DD
  const hoje = new Date().toISOString().slice(0, 10);

  // Conta auditorias por nomeLocal para a data de hoje
  const porArea = {};
  auditorias.forEach(auditoria => {
    if (auditoria.data === hoje) {
      const area = auditoria.nomeLocal || 'Sem Local';
      porArea[area] = (porArea[area] || 0) + 1;
    }
  });

  // Dados para o gráfico
  const areas = Object.keys(porArea);
  const quantidades = Object.values(porArea);

  // Se não houver dados, mostra mensagem
  if (areas.length === 0) {
    container.innerHTML = `
      <div class="card card-primary card-outline mb-4">
        <div class="card-header border-0">
          <h3 class="card-title">Auditorias por Área (Hoje)</h3>
        </div>
        <div class="card-body">
          <p class="text-center text-muted">Nenhuma auditoria marcada para hoje.</p>
        </div>
      </div>
    `;
    return;
  }

  // Cria o card e o div do gráfico
  container.innerHTML = `
    <div class="card card-primary card-outline mb-4">
      <div class="card-header border-0">
        <h3 class="card-title">Auditorias por Área (Hoje)</h3>
      </div>
      <div class="card-body">
        <div id="auditorias-area-chart"></div>
      </div>
    </div>
  `;

  

   // Cria o gráfico com ApexCharts (gráfico de barras horizontal)
  const options = {
    chart: {
      type: 'bar',
      height: 320,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          position: 'center'
        }
      }
    },
    series: [{
      name: 'Auditorias',
      data: quantidades
    }],
    xaxis: {
      title: { text: 'Nº de Auditorias' },
      min: 0,
      forceNiceScale: true
    },
    yaxis: {
      categories: areas,
      title: { text: 'Área (Local)' }
    },
    colors: ['#007bff'],
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        // Mostra apenas o nome do local no centro da barra
        return areas[opts.dataPointIndex];
      },
      style: {
        colors: ['#fff'],
        fontWeight: 600,
        fontSize: '14px'
      }
    },
    tooltip: {
      y: {
        formatter: function (val, opts) {
          // Mostra o nome do local e o número de auditorias no tooltip
          return `${areas[opts.dataPointIndex]}: ${val} auditoria(s)`;
        }
      }
    },
    title: { text: '' }
  };

  const chart = new ApexCharts(document.getElementById('auditorias-area-chart'), options);
  chart.render();

});