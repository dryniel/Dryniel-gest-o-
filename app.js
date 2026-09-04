document.addEventListener("DOMContentLoaded", () => {
  console.log("DRYNIEL Gestor iniciado");

  // =========================
  // BANCO DE DADOS LOCAL
  // =========================

  const dados = {
    orcamentos: JSON.parse(localStorage.getItem("dryniel_orcamentos")) || [],
    gastos: JSON.parse(localStorage.getItem("dryniel_gastos")) || [],
    diarias: JSON.parse(localStorage.getItem("dryniel_diarias")) || []
  };

  function salvarDados() {
    localStorage.setItem(
      "dryniel_orcamentos",
      JSON.stringify(dados.orcamentos)
    );

    localStorage.setItem(
      "dryniel_gastos",
      JSON.stringify(dados.gastos)
    );

    localStorage.setItem(
      "dryniel_diarias",
      JSON.stringify(dados.diarias)
    );
  }

  // =========================
  // FUNÇÕES AUXILIARES
  // =========================

  function dinheiro(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });
  }

  function textoElemento(elemento) {
    return (elemento.innerText || elemento.textContent || "")
      .trim()
      .toLowerCase();
  }

  function encontrarElemento(...seletores) {
    for (const seletor of seletores) {
      const elemento = document.querySelector(seletor);

      if (elemento) {
        return elemento;
      }
    }

    return null;
  }

  function mostrarSecao(nome) {
    const secoes = document.querySelectorAll(
      "section, .page, .pagina, .screen, .tela, [data-section]"
    );

    let encontrou = false;

    secoes.forEach(secao => {
      const identificador =
        `${secao.id} ${secao.className} ${secao.dataset.section || ""}`
          .toLowerCase();

      if (identificador.includes(nome)) {
        sec
