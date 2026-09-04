
document.addEventListener("DOMContentLoaded", function () {

  // Função para mostrar uma seção da página
  function mostrarSecao(nome) {
    const secoes = document.querySelectorAll(
      "section, .page, .pagina, .screen, .tela"
    );

    let encontrou = false;

    secoes.forEach(function (secao) {
      const identificador =
        ((secao.id || "") + " " + (secao.className || ""))
          .toString()
          .toLowerCase();

      if (identificador.includes(nome.toLowerCase())) {
        secao.style.display = "";
        encontrou = true;
      } else {
        secao.style.display = "none";
      }
    });

    return encontrou;
  }

  // Procura todos os botões e links
  const botoes = document.querySelectorAll(
    "button, a, [role='button'], .btn, .button"
  );

  botoes.forEach(function (botao) {

    botao.addEventListener("click", function (event) {

      const texto =
        (botao.innerText ||
          botao.textContent ||
          botao.getAttribute("aria-label") ||
          "")
          .trim()
          .toLowerCase();

      // ORÇAMENTOS
      if (texto.includes("orçamento") ||
          texto.includes("orcamento")) {

        event.preventDefault();

        if (!mostrarSecao("orcamento")) {
          mostrarSecao("orçamento");
        }

        return;
      }

      // CLIENTES
      if (texto.includes("cliente")) {

        event.preventDefault();
        mostrarSecao("cliente");
        return;
      }

      // SERVIÇOS
      if (texto.includes("serviço") ||
          texto.includes("servico")) {

        event.preventDefault();

        if (!mostrarSecao("servico")) {
          mostrarSecao("serviço");
        }

        return;
      }

      // MATERIAIS
      if (texto.includes("material")) {

        event.preventDefault();
        mostrarSecao("material");
        return;
      }

      // CONFIGURAÇÕES
      if (texto.includes("configuração") ||
          texto.includes("configuracao")) {

        event.preventDefault();

        if (!mostrarSecao("configuracao")) {
          mostrarSecao("configuração");
        }

        return;
      }

      // VOLTAR / INÍCIO
      if (
        texto.includes("voltar") ||
        texto.includes("início") ||
        texto.includes("inicio")
      ) {

        event.preventDefault();

        if (!mostrarSecao("home")) {
          mostrarSecao("inicio");
        }

        return;
      }

    });

  });

  console.log("DRYNIEL: aplicativo carregado com sucesso.");

});
