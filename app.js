const $ = id => document.getElementById(id);

const STORAGE = {
  orcamentos: 'dryniel_orcamentos',
  obras: 'dryniel_obras',
  gastos: 'dryniel_gastos',
  diarias: 'dryniel_diarias',
  clientes: 'dryniel_clientes'
};

let orcamentos = carregar(STORAGE.orcamentos);
let obras = carregar(STORAGE.obras);
let gastos = carregar(STORAGE.gastos);
let diarias = carregar(STORAGE.diarias);
let clientes = carregar(STORAGE.clientes);


function carregar(chave) {
  try {
    return JSON.parse(localStorage.getItem(chave)) || [];
  } catch {
    return [];
  }
}


function salvar(chave, dados) {
  localStorage.setItem(chave, JSON.stringify(dados));
}


function moeda(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(Number(valor) || 0);
}


function escapar(texto = '') {
  return String(texto)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


function abrirTela(id) {

  document.querySelectorAll('.screen').forEach(tela => {
    tela.classList.remove('active');
  });

  const tela = $(id);

  if (tela) {
    tela.classList.add('active');
  }

  document.querySelectorAll('.bottom-nav button').forEach(botao => {
    botao.classList.toggle(
      'active',
      botao.dataset.go === id
    );
  });

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}


document.querySelectorAll('[data-go]').forEach(botao => {

  botao.addEventListener('click', () => {

    abrirTela(botao.dataset.go);

  });

});


function alternarFormulario(id) {

  const form = $(id);

  form.classList.toggle('hidden');

}


$('novoOrcBtn').addEventListener('click', () => {
  alternarFormulario('orcForm');
});


$('novaObraBtn').addEventListener('click', () => {
  alternarFormulario('obraForm');
});


$('novoGastoBtn').addEventListener('click', () => {

  $('gastoData').valueAsDate = new Date();

  alternarFormulario('gastoForm');

});


$('novaDiariaBtn').addEventListener('click', () => {

  $('diariaData').valueAsDate = new Date();

  alternarFormulario('diariaForm');

});


$('novoClienteBtn').addEventListener('click', () => {
  alternarFormulario('clienteForm');
});


$('orcForm').addEventListener('submit', evento => {

  evento.preventDefault();

  const quantidade =
    Number($('orcQtd').value) || 1;

  const valor =
    Number($('orcValor').value) || 0;

  const orçamento = {

    id: Date.now(),

    cliente:
      $('orcCliente').value.trim(),

    endereco:
      $('orcEndereco').value.trim(),

    descricao:
      $('orcDescricao').value.trim(),

    quantidade,

    valor,

    total:
      quantidade * valor,

    observacoes:
      $('orcObs').value.trim(),

    data:
      new Date().toISOString()

  };

  orcamentos.push(orçamento);

  salvar(
    STORAGE.orcamentos,
    orcamentos
  );

  evento.target.reset();

  $('orcQtd').value = 1;

  evento.target.classList.add('hidden');

  renderTudo();

});


$('obraForm').addEventListener('submit', evento => {

  evento.preventDefault();

  const obra = {

    id: Date.now(),

    nome:
      $('obraNome').value.trim(),

    cliente:
      $('obraCliente').value.trim(),

    endereco:
      $('obraEndereco').value.trim(),

    valor:
      Number($('obraValor').value) || 0

  };

  obras.push(obra);

  salvar(
    STORAGE.obras,
    obras
  );

  evento.target.reset();

  evento.target.classList.add('hidden');

  renderTudo();

});


$('gastoForm').addEventListener('submit', evento => {

  evento.preventDefault();

  const gasto = {

    id: Date.now(),

    categoria:
      $('gastoCategoria').value,

    obra:
      $('gastoObra').value.trim(),

    valor:
      Number($('gastoValor').value) || 0,

    data:
      $('gastoData').value,

    observacao:
      $('gastoObs').value.trim()

  };

  gastos.push(gasto);

  salvar(
    STORAGE.gastos,
    gastos
  );

  evento.target.reset();

  evento.target.classList.add('hidden');

  renderTudo();

});


$('diariaForm').addEventListener('submit', evento => {

  evento.preventDefault();

  const diaria = {

    id: Date.now(),

    nome:
      $('diariaNome').value.trim(),

    funcao:
      $('diariaFuncao').value.trim(),

    obra:
      $('diariaObra').value.trim(),

    valor:
      Number($('diariaValor').value) || 0,

    data:
      $('diariaData').value

  };

  diarias.push(diaria);

  salvar(
    STORAGE.diarias,
    diarias
  );

  evento.target.reset();

  evento.target.classList.add('hidden');

  renderTudo();

});


$('clienteForm').addEventListener('submit', evento => {

  evento.preventDefault();

  const cliente = {

    id: Date.now(),

    nome:
      $('clienteNome').value.trim(),

    telefone:
      $('clienteTelefone').value.trim(),

    endereco:
      $('clienteEndereco').value.trim()

  };

  clientes.push(cliente);

  salvar(
    STORAGE.clientes,
    clientes
  );

  evento.target.reset();

  evento.target.classList.add('hidden');

  renderTudo();

});


function excluir(tipo, id) {

  if (!confirm('Deseja realmente excluir este registro?')) {
    return;
  }

  if (tipo === 'orcamento') {

    orcamentos =
      orcamentos.filter(item => item.id !== id);

    salvar(
      STORAGE.orcamentos,
      orcamentos
    );

  }


  if (tipo === 'obra') {

    obras =
      obras.filter(item => item.id !== id);

    salvar(
      STORAGE.obras,
      obras
    );

  }


  if (tipo === 'gasto') {

    gastos =
      gastos.filter(item => item.id !== id);

    salvar(
      STORAGE.gastos,
      gastos
    );

  }


  if (tipo === 'diaria') {

    diarias =
      diarias.filter(item => item.id !== id);

    salvar(
      STORAGE.diarias,
      diarias
    );

  }


  if (tipo === 'cliente') {

    clientes =
      clientes.filter(item => item.id !== id);

    salvar(
      STORAGE.clientes,
      clientes
    );

  }

  renderTudo();

}


window.excluir = excluir;


function renderOrcamentos() {

  const lista = $('orcList');

  if (!orcamentos.length) {

    lista.innerHTML =
      '<div class="empty">Nenhum orçamento cadastrado.</div>';

    return;

  }

  lista.innerHTML = orcamentos
    .slice()
    .reverse()
    .map(item => `

      <div class="list-item">

        <div class="row">

          <div>

            <strong>
              ${escapar(item.cliente)}
            </strong>

            <div class="muted">
              ${escapar(item.descricao || 'Sem descrição')}
            </div>

            <div class="tag">
              Quantidade: ${item.quantidade}
            </div>

          </div>

          <div class="amount">
            ${moeda(item.total)}
          </div>

        </div>

        <p class="muted">
          ${escapar(item.endereco || '')}
        </p>

        <button
          class="danger"
          onclick="excluir('orcamento', ${item.id})"
        >
          Excluir
        </button>

      </div>

    `)
    .join('');

}


function renderObras() {

  const lista = $('obraList');

  if (!obras.length) {

    lista.innerHTML =
      '<div class="empty">Nenhuma obra cadastrada.</div>';

    return;

  }

  lista.innerHTML = obras
    .slice()
    .reverse()
    .map(item => `

      <div class="list-item">

        <div class="row">

          <div>

            <strong>
              ${escapar(item.nome)}
            </strong>

            <div class="muted">
              ${escapar(item.cliente)}
            </div>

          </div>

          <div class="amount">
            ${moeda(item.valor)}
          </div>

        </div>

        <p class="muted">
          ${escapar(item.endereco || '')}
        </p>

        <button
          class="danger"
          onclick="excluir('obra', ${item.id})"
        >
          Excluir
        </button>

      </div>

    `)
    .join('');

}


function renderGastos() {

  const lista = $('gastoList');

  if (!gastos.length) {

    lista.innerHTML =
      '<div class="empty">Nenhum gasto cadastrado.</div>';

    return;

  }

  lista.innerHTML = gastos
    .slice()
    .reverse()
    .map(item => `

      <div class="list-item">

        <div class="row">

          <div>

            <strong>
              ${escapar(item.categoria)}
            </strong>

            <div class="muted">
              ${escapar(item.obra || 'Sem obra')}
            </div>

          </div>

          <div class="amount">
            ${moeda(item.valor)}
          </div>

        </div>

        <div class="tag">
          ${escapar(item.data || '')}
        </div>

        <p class="muted">
          ${escapar(item.observacao || '')}
        </p>

        <button
          class="danger"
          onclick="excluir('gasto', ${item.id})"
        >
          Excluir
        </button>

      </div>

    `)
    .join('');

}


function renderDiarias() {

  const lista = $('diariaList');

  if (!diarias.length) {

    lista.innerHTML =
      '<div class="empty">Nenhuma diária cadastrada.</div>';

    return;

  }

  lista.innerHTML = diarias
    .slice()
    .reverse()
    .map(item => `

      <div class="list-item">

        <div class="row">

          <div>

            <strong>
              ${escapar(item.nome)}
            </strong>

            <div class="muted">
              ${escapar(item.funcao || '')}
            </div>

            <div class="muted">
              ${escapar(item.obra || '')}
            </div>

          </div>

          <div class="amount">
            ${moeda(item.valor)}
          </div>

        </div>

        <div class="tag">
          ${escapar(item.data || '')}
        </div>

        <br><br>

        <button
          class="danger"
          onclick="excluir('diaria', ${item.id})"
        >
          Excluir
        </button>

      </div>

    `)
    .join('');

}


function renderClientes() {

  const lista = $('clienteList');

  if (!clientes.length) {

    lista.innerHTML =
      '<div class="empty">Nenhum cliente cadastrado.</div>';

    return;

  }

  lista.innerHTML = clientes
    .slice()
    .reverse()
    .map(item => `

      <div class="list-item">

        <strong>
          ${escapar(item.nome)}
        </strong>

        <p class="muted">
          ${escapar(item.telefone || '')}
        </p>

        <p class="muted">
          ${escapar(item.endereco || '')}
        </p>

        <button
          class="danger"
          onclick="excluir('cliente', ${item.id})"
        >
          Excluir
        </button>

      </div>

    `)
    .join('');

}


function atualizarFinanceiro() {

  const faturamento = orcamentos.reduce(
    (total, item) =>
      total + Number(item.total || 0),
    0
  );

  const totalGastos = gastos.reduce(
    (total, item) =>
      total + Number(item.valor || 0),
    0
  );

  const totalDiarias = diarias.reduce(
    (total, item) =>
      total + Number(item.valor || 0),
    0
  );

  const resultado =
    faturamento -
    totalGastos -
    totalDiarias;


  $('fatTotal').textContent =
    moeda(faturamento);

  $('gastosTotal').textContent =
    moeda(totalGastos);

  $('diariasTotal').textContent =
    moeda(totalDiarias);

  $('lucroTotal').textContent =
    moeda(resultado);


  $('finEntradas').textContent =
    moeda(faturamento);

  $('finGastos').textContent =
    moeda(totalGastos);

  $('finDiarias').textContent =
    moeda(totalDiarias);

  $('finResultado').textContent =
    moeda(resultado);

}


function renderTudo() {

  renderOrcamentos();

  renderObras();

  renderGastos();

  renderDiarias();

  renderClientes();

  atualizarFinanceiro();

}


$('resetBtn').addEventListener('click', () => {

  const confirmar = confirm(
    'Apagar todos os dados cadastrados no aplicativo?'
  );

  if (!confirmar) {
    return;
  }

  Object.values(STORAGE).forEach(chave => {
    localStorage.removeItem(chave);
  });

  orcamentos = [];
  obras = [];
  gastos = [];
  diarias = [];
  clientes = [];

  renderTudo();

  abrirTela('inicio');

});


renderTudo();
