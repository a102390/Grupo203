// Gera o gráfico de Auditorias Realizadas com dados reais do localStorage

document.addEventListener('DOMContentLoaded', function () {
  // Só corre se existir o elemento do gráfico
  const chartEl = document.querySelector('#sales-chart');
  if (!chartEl) return;

  // Obter auditorias do localStorage
  const auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];

  // Contar auditorias por ano
  const now = new Date();
  const thisYear = now.getFullYear();
  const lastYear = thisYear - 1;

  let countThisYear = 0;
  let countLastYear = 0;

  auditorias.forEach(auditoria => {
    // Suporta datas no formato YYYY-MM-DD
    const auditYear = new Date(auditoria.data).getFullYear();
    if (auditYear === thisYear) countThisYear++;
    if (auditYear === lastYear) countLastYear++;
  });

  // Configuração do gráfico
  const sales_chart_options = {
    series: [
      {
        name: 'Auditorias',
        data: [countLastYear, countThisYear],
      },
    ],
    chart: {
      type: 'bar',
      height: 200,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    legend: {
      show: false,
    },
    colors: ['#adb5bd', '#0d6efd'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [lastYear.toString(), thisYear.toString()],
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' auditorias';
        },
      },
    },
  };

  // Renderizar gráfico
  const sales_chart = new ApexCharts(chartEl, sales_chart_options);
  sales_chart.render();
});