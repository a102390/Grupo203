document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([0, 0], 2);
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  
    let marker;
  
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;
  
      document.getElementById('latitude').value = lat.toFixed(6);
      document.getElementById('longitude').value = lng.toFixed(6);
  
      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng).addTo(map);
      }
    });
    
    if (window.location.pathname.includes('LocalizacaoAuditorias.html')) {
      // Carregar auditorias do localStorage
      const auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
      
     // Adicionar um marcador para cada auditoria existente
      auditorias.forEach(function(auditoria) {
        if (auditoria.latitude && auditoria.longitude) {
          const lat = parseFloat(auditoria.latitude);
          const lng = parseFloat(auditoria.longitude);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            const locationMarker = L.marker([lat, lng]).addTo(map);
            
            // Adicionar popup com informações da auditoria
            if (auditoria.nome) {
              // Formatar peritos
              let peritosHtml = 'Nenhum';
              if (auditoria.peritos && auditoria.peritos.length > 0) {
                peritosHtml = auditoria.peritos.join('<br>');
              }
              
              // Formatar materiais
              let materiaisHtml = 'Nenhum';
              if (auditoria.materiais && auditoria.materiais.length > 0) {
                materiaisHtml = auditoria.materiais.join('<br>');
              }
              
              locationMarker.bindPopup(
                `<strong>${auditoria.nome}</strong><br>` +
                `Origem: ${auditoria.origem || 'Não especificado'}<br>` + 
                `Descrição: ${auditoria.descricao || 'Não especificado'}<br>` + 
                `Tipo: ${auditoria.tipoAuditoria || 'Não especificado'}<br>` + 
                `Data: ${auditoria.data || 'Não especificado'}<br>` + 
                `Local: ${auditoria.nomeLocal || 'Não especificado'}<br>` + 
                `Duração: ${auditoria.duracaoEstimada || 'Não especificado'}<br>` + 
                `Latitude: ${auditoria.latitude || 'Não especificado'}<br>` + 
                `Longitude: ${auditoria.longitude || 'Não especificado'}<br>` + 
                `Peritos: <br>${peritosHtml}<br>` + 
                `Materiais: <br>${materiaisHtml}<br>` + 
                `Data criação: ${auditoria.dataCriacao || 'Não especificado'}<br>` + 
                `Estado: ${auditoria.estado || 'Não especificado'}`
              );
            }
          }
        }
      });
    }
    // 
  });