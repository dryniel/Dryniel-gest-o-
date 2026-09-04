document.addEventListener("DOMContentLoaded", function () {

  console.log("DRYNIEL: aplicativo carregado corretamente");

  // =====================================================
  // FUNÇÕES AUXILIARES
  // =====================================================

  function normalizarTexto(texto) {
    return (texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // Possíveis nomes usados no HTML para cada tela
  const secoes = {
    inicio: [
      "inicio",
      "home"
    ],

    clientes: [
      "clientes",
      "cliente"
    ],

    orcamentos: [
      "orcamentos",
      "orcamento"
    ],

    material: [
      "material",
      "materiais"
    ],

    configuracao: [
      "configuracao",
      "configuracoes"
    ]
  };


  // =====================================================
  // LOCALIZAR UMA SEÇÃO
  // =====================================================

  function encontrarSecao(nome) {

    nome = normalizarTexto(nome);

    const nomesPossiveis = secoes[nome] || [nome];

    for (const id of nomesPossiveis) {

      const elemento = document.getElementById(id);

      if (elemento) {
        return elemento;
      }

    }

    return null;
  }


  // =====================================================
  // ESCONDER TODAS AS TELAS
  // =====================================================

  function esconderSecoes() {

    const ids = new Set();

    Object.values(secoes).forEach(lista => {
      lista.forEach(id => ids.add(id));
    });

    ids.forEach(id => {

      const elemento = document.getElementById(id);

      if (elemento) {
        elemento.style.display = "none";
      }

    });

  }


  // =====================================================
  // MOSTRAR UMA TELA
  // =====================================================

  function mostrarSecao(nome) {

    nome = normalizarTexto(nome);

    const destino = encontrarSecao(nome);

    if (!destino) {

      console.warn(
        "DRYNIEL: seção não encontrada:",
        nome
      );

      return false;
    }

    esconderSecoes();

    destino.style.display = "";

    if (
      getComputedStyle(destino).display === "none"
    ) {
      destino.style.display = "block";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    return true;
  }


  // Deixa a função disponível globalmente
  window.mostrarSecao = mostrarSecao;


  // =====================================================
  // DESCOBRIR O TEXTO DO BOTÃO
  // =====================================================

  function textoDoElemento(elemento) {

    const texto =
      elemento.innerText ||
      elemento.textContent ||
      elemento.getAttribute("aria-label") ||
      elemento.getAttribute("title") ||
      "";

    return normalizarTexto(texto);
  }


  // =====================================================
  // CLIQUES NOS BOTÕES
  // =====================================================

  document.addEventListener("click", function (event) {

    const botao = event.target.closest(
      "button, a, [role='button'], .btn, .botao, .menu-item"
    );

    if (!botao) {
      return;
    }


    // ---------------------------------------------
    // DATA-SECTION
    // ---------------------------------------------

    const dataSection =
      botao.dataset.section ||
      botao.dataset.secao ||
      botao.dataset.target;

    if (dataSection) {

      const alvo = normalizarTexto(
        dataSection.replace("#", "")
      );

      if (mostrarSecao(alvo)) {
        event.preventDefault();
        return;
      }

    }


    // ---------------------------------------------
    // HREF
    // ---------------------------------------------

    const href = botao.getAttribute("href");

    if (
      href &&
      href.startsWith("#") &&
      href.length > 1
    ) {

      const alvo = normalizarTexto(
        href.substring(1)
      );

      if (mostrarSecao(alvo)) {
        event.preventDefault();
        return;
      }

    }


    // ---------------------------------------------
    // TEXTO DO BOTÃO
    // ---------------------------------------------

    const texto = textoDoElemento(botao);


    // INÍCIO
    if (
      texto.includes("inicio") ||
      texto.includes("home") ||
      texto.includes("voltar")
    ) {

      event.preventDefault();

      mostrarSecao("inicio");

      return;
    }


    // CLIENTES
    if (
      texto.includes("cliente")
    ) {

      event.preventDefault();

      mostrarSecao("clientes");

      return;
    }


    // ORÇAMENTOS
    if (
      texto.includes("orcamento")
    ) {

      event.preventDefault();

      mostrarSecao("orcamentos");

      return;
    }


    // MATERIAL / MATERIAIS
    if (
      texto.includes("material")
    ) {

      event.preventDefault();

      mostrarSecao("material");

      return;
    }


    // CONFIGURAÇÕES
    if (
      texto.includes("configuracao") ||
      texto.includes("configuracoes")
    ) {

      event.preventDefault();

      mostrarSecao("configuracao");

      return;
    }

  });


  // =====================================================
  // TELA INICIAL
  // =====================================================

  const inicio = encontrarSecao("inicio");

  if (inicio) {

    esconderSecoes();

    inicio.style.display = "";

    if (
      getComputedStyle(inicio).display === "none"
    ) {
      inicio.style.display = "block";
    }

  } else {

    console.warn(
      "DRYNIEL: tela inicial não encontrada."
    );

  }

});
