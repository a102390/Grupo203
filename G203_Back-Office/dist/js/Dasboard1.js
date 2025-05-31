// Dashboard1.js - Gráfico de Ocorrências por Tipo/Mês usando ApexCharts e LocalStorage

document.addEventListener('DOMContentLoaded', function () {
  // Função para agrupar ocorrências por tipo e mês
  function agruparOcorrenciasPorTipoEMes(ocorrencias) {
    const agrupado = {};
    ocorrencias.forEach((o) => {
      if (!o.data) return;
      const dataObj = new Date(o.data);
      if (isNaN(dataObj)) return;
      const mes = `${dataObj.getFullYear()}-${String(dataObj.getMonth() + 1).padStart(2, '0')}`;
      if (!agrupado[o.tipo]) agrupado[o.tipo] = {};
      if (!agrupado[o.tipo][mes]) agrupado[o.tipo][mes] = 0;
      agrupado[o.tipo][mes]++;
    });
    return agrupado;
  }

  // Obter ocorrências do LocalStorage
  const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];

  // Agrupar por tipo e mês
  const agrupado = agruparOcorrenciasPorTipoEMes(ocorrencias);

  // Obter todos os meses presentes (ordenados)
  const mesesSet = new Set();
  Object.values(agrupado).forEach((porMes) => {
    Object.keys(porMes).forEach((mes) => mesesSet.add(mes));
  });
  const meses = Array.from(mesesSet).sort();

  // Montar séries para o gráfico
  const series = Object.keys(agrupado).map((tipo) => ({
    name: tipo || 'N/A',
    data: meses.map((mes) => agrupado[tipo][mes] || 0),
  }));

  // Se não houver dados, mostra uma série vazia
  if (series.length === 0) {
    series.push({ name: 'Sem Dados', data: [] });
  }

  // Opções do gráfico ApexCharts
  const options = {
    series: series,
    chart: {
      height: 200,
      type: 'line',
      toolbar: { show: false },
    },
    colors: ['#0d6efd', '#adb5bd', '#20c997', '#ffc107', '#dc3545'],
    stroke: { curve: 'smooth' },
    grid: {
      borderColor: '#e7e7e7',
      row: { colors: ['#f3f3f3', 'transparent'], opacity: 0.5 },
    },
    legend: { show: true },
    markers: { size: 3 },
    xaxis: {
      categories: meses,
      title: { text: 'Mês' },
    },
    yaxis: {
      title: { text: 'Ocorrências' },
      min: 0,
      forceNiceScale: true,
    },
  };

  // Renderizar o gráfico
  const chartDiv = document.querySelector('#visitors-chart');
  if (chartDiv) {
    chartDiv.innerHTML = ''; // Limpa caso já exista
    const chart = new ApexCharts(chartDiv, options);
    chart.render();
  }

  const ocorrenciasTotalSpan = document.querySelector('.fw-bold.fs-5');
  if (ocorrenciasTotalSpan) {
    ocorrenciasTotalSpan.textContent = ocorrencias.length;
  }
  
});