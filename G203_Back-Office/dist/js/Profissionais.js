document.addEventListener('DOMContentLoaded', function () {
  if (!window.location.pathname.includes('GestaoProfissionais.html')) return;

  const form = document.getElementById('formGestaoProfissionais');
  const tipoSelect = document.getElementById('tipo-profissional');
  const listaProfissionais = document.getElementById('listaProfissionais');

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

  function carregarProfissionais() {
    listaProfissionais.innerHTML = '';
    const profsDisp = JSON.parse(localStorage.getItem('profissionaisDisponiveis')) || [];
    const profsIndisp = JSON.parse(localStorage.getItem('profissionaisIndisponiveis')) || [];

    const todos = [
      ...profsDisp.map(p => ({ ...p, estado: 'Disponível' })),
      ...profsIndisp.map(p => ({ ...p, estado: 'Em Campo' }))
    ];

    todos.forEach(prof => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';

      const span = document.createElement('span');
      span.innerHTML = `
        <strong>${tipoParaTexto(prof.tipo)}</strong>
        <span class="badge ${prof.estado === 'Disponível' ? 'bg-success' : 'bg-warning text-dark'} ms-2">${prof.estado}</span>
      `;
      li.appendChild(span);

if (prof.estado === 'Disponível') {
  const btnOcupar = document.createElement('button');
  btnOcupar.className = 'btn btn-sm btn-warning ms-2';
  btnOcupar.textContent = 'Marcar como Ocupado';
  btnOcupar.onclick = () => marcarComoOcupado(prof.id);
  li.appendChild(btnOcupar);
}

if (prof.estado === 'Em Campo') {
  const btnDisponivel = document.createElement('button');
  btnDisponivel.className = 'btn btn-sm btn-success ms-2';
  btnDisponivel.textContent = 'Marcar como Disponível';
  btnDisponivel.onclick = () => marcarComoDisponivel(prof.id);
  li.appendChild(btnDisponivel);
}

// ✅ Botão remover aparece sempre
const btnRemover = document.createElement('button');
btnRemover.className = 'btn btn-sm btn-danger ms-2';
btnRemover.textContent = 'Remover';
btnRemover.onclick = () => removerProfissional(prof.id);
li.appendChild(btnRemover);


      listaProfissionais.appendChild(li);
    });
  }

  function guardarProfissional(e) {
    e.preventDefault();
    const tipo = tipoSelect.value;
    if (!tipo) {
      alert('Selecione o tipo de profissional!');
      return;
    }

    const profs = JSON.parse(localStorage.getItem('profissionaisDisponiveis')) || [];
    const novoProf = {
      id: crypto.randomUUID(), // ID único
      tipo
    };
    profs.push(novoProf);
    localStorage.setItem('profissionaisDisponiveis', JSON.stringify(profs));

    form.reset();
    carregarProfissionais();
  }

  function removerProfissional(id) {
    const profsDisp = JSON.parse(localStorage.getItem('profissionaisDisponiveis')) || [];
    const profsIndisp = JSON.parse(localStorage.getItem('profissionaisIndisponiveis')) || [];

    const novosDisp = profsDisp.filter(p => p.id !== id);
    const novosIndisp = profsIndisp.filter(p => p.id !== id);

    localStorage.setItem('profissionaisDisponiveis', JSON.stringify(novosDisp));
    localStorage.setItem('profissionaisIndisponiveis', JSON.stringify(novosIndisp));

    carregarProfissionais();
  }

  function marcarComoOcupado(id) {
    const disp = JSON.parse(localStorage.getItem('profissionaisDisponiveis')) || [];
    const indisp = JSON.parse(localStorage.getItem('profissionaisIndisponiveis')) || [];

    const prof = disp.find(p => p.id === id);
    if (!prof) return;

    const novosDisp = disp.filter(p => p.id !== id);
    indisp.push(prof);

    localStorage.setItem('profissionaisDisponiveis', JSON.stringify(novosDisp));
    localStorage.setItem('profissionaisIndisponiveis', JSON.stringify(indisp));

    carregarProfissionais();
  }

  function marcarComoDisponivel(id) {
    const disp = JSON.parse(localStorage.getItem('profissionaisDisponiveis')) || [];
    const indisp = JSON.parse(localStorage.getItem('profissionaisIndisponiveis')) || [];

    const prof = indisp.find(p => p.id === id);
    if (!prof) return;

    const novosIndisp = indisp.filter(p => p.id !== id);
    disp.push(prof);

    localStorage.setItem('profissionaisIndisponiveis', JSON.stringify(novosIndisp));
    localStorage.setItem('profissionaisDisponiveis', JSON.stringify(disp));

    carregarProfissionais();
  }

  form.addEventListener('submit', guardarProfissional);
  carregarProfissionais();
});
