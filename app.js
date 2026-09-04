// ======================================================
// DRYNIEL - APP.JS
// Versão limpa e segura
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("DRYNIEL: app.js carregado com sucesso.");

    // ==================================================
    // LOCALIZAR SEÇÕES
    // ==================================================

    function encontrarSecao(nome) {

        if (!nome) {
            return null;
        }

        // Primeiro tenta pelo ID exato
        let secao = document.getElementById(nome);

        if (secao) {
            return secao;
        }

        // Tenta algumas variações comuns
        const possibilidades = [
            nome,
            nome.toLowerCase(),
            "secao-" + nome,
            "tela-" + nome,
            nome + "-secao",
            nome + "-tela"
        ];

        for (const id of possibilidades) {

            secao = document.getElementById(id);

            if (secao) {
                return secao;
            }
        }

        return null;
    }


    // ==================================================
    // PEGAR TODAS AS SEÇÕES DO APLICATIVO
    // ==================================================

    function obterSecoes() {

        const seletores = [
            ".secao",
            ".tela",
            ".page",
            ".pagina",
            "[data-secao]"
        ];

        const elementos = [];

        seletores.forEach(function (seletor) {

            document.querySelectorAll(seletor).forEach(function (elemento) {

                if (!elementos.includes(elemento)) {
                    elementos.push(elemento);
                }

            });

        });

        return elementos;
    }


    // ==================================================
    // ESCONDER SEÇÕES
    // ==================================================

    function esconderSecoes() {

        const secoes = obterSecoes();

        secoes.forEach(function (secao) {
            secao.style.display = "none";
        });
    }


    // ==================================================
    // MOSTRAR UMA SEÇÃO
    // ==================================================

    function mostrarSecao(nome) {

        const secao = encontrarSecao(nome);

        if (!secao) {

            console.warn(
                'DRYNIEL
