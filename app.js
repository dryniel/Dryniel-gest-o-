const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".nav-btn");
const menuButtons = document.querySelectorAll(".menu-card");

const budgetForm = document.getElementById("budgetForm");
const budgetList = document.getElementById("budgetList");
const budgetDetails = document.getElementById("budgetDetails");

const serviceList = document.getElementById("serviceList");
const serviceTemplate = document.getElementById("serviceTemplate");

const addServiceBtn = document.getElementById("addServiceBtn");
const newBudgetBtn = document.getElementById("newBudgetBtn");
const themeBtn = document.getElementById("themeBtn");

const budgetTotal = document.getElementById("budgetTotal");
const serviceCount = document.getElementById("serviceCount");

const clientName = document.getElementById("clientName");
const clientAddress = document.getElementById("clientAddress");
const budgetNotes = document.getElementById("budgetNotes");

let budgets =
  JSON.parse(localStorage.getItem("dryniel_budgets")) || [];


/* =========================
   FORMATAÇÃO
========================= */

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value) || 0);
}


/* =========================
   NAVEGAÇÃO
========================= */

function showScreen(screenId) {

  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const target = document.getElementById(screenId);

  if (target) {
    target.classList.add("active");
  }

  navButtons.forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.screen === screenId
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


menuButtons.forEach(button => {

  button.addEventListener("click", () => {

    const screenId = button.dataset.screen;

    showScreen(screenId);

  });

});


navButtons.forEach(button => {

  button.addEventListener("click", () => {

    const screenId = button.dataset.screen;

    showScreen(screenId);

  });

});


document
  .querySelectorAll(".back-to-budgets")
  .forEach(button => {

    button.addEventListener("click", () => {

      showScreen("budgetsScreen");

    });

  });


/* =========================
   TEMA
========================= */

const savedTheme =
  localStorage.getItem("dryniel_theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}


if (themeBtn) {

  themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const theme =
      document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem(
      "dryniel_theme",
      theme
    );

  });

}


/* =========================
   SERVIÇOS
========================= */

function addService(data = {}) {

  const fragment =
    serviceTemplate.content.cloneNode(true);

  const serviceItem =
    fragment.querySelector(".service-item");

  const description =
    fragment.querySelector(".service-description");

  const quantity =
    fragment.querySelector(".service-quantity");

  const value =
    fragment.querySelector(".service-value");

  const removeButton =
    fragment.querySelector(".remove-service-btn");


  description.value =
    data.description || "";

  quantity.value =
    data.quantity || 1;

  value.value =
    data.value || "";


  quantity.addEventListener(
    "input",
    calculateBudget
  );

  value.addEventListener(
    "input",
    calculateBudget
  );


  removeButton.addEventListener(
    "click",
    () => {

      serviceItem.remove();

      updateServiceNumbers();

      calculateBudget();

    }
  );


  serviceList.appendChild(fragment);

  updateServiceNumbers();

  calculateBudget();
}


/* =========================
   NUMERAÇÃO DOS SERVIÇOS
========================= */

function updateServiceNumbers() {

  const services =
    serviceList.querySelectorAll(
      ".service-item"
    );

  services.forEach(
    (service, index) => {

      const title =
        service.querySelector(
          ".service-number"
        );

      title.textContent =
        "Serviço " + (index + 1);

    }
  );

}


/* =========================
   CÁLCULO DO ORÇAMENTO
========================= */

function calculateBudget() {

  const services =
    serviceList.querySelectorAll(
      ".service-item"
    );

  let total = 0;

  services.forEach(service => {

    const quantity =
      Number(
        service.querySelector(
          ".service-quantity"
        ).value
      ) || 0;

    const value =
      Number(
        service.querySelector(
          ".service-value"
        ).value
      ) || 0;

    const subtotal =
      quantity * value;

    total += subtotal;

    const subtotalElement =
      service.querySelector(
        ".service-subtotal-value"
      );

    subtotalElement.textContent =
      formatCurrency(subtotal);

  });


  serviceCount.textContent =
    services.length;

  budgetTotal.textContent =
    formatCurrency(total);

}


/* =========================
   BOTÃO ADICIONAR SERVIÇO
========================= */

if (addServiceBtn) {

  addServiceBtn.addEventListener(
    "click",
    () => {

      addService();

    }
  );

}


/* =========================
   NOVO ORÇAMENTO
========================= */

function clearBudgetForm() {

  budgetForm.reset();

  serviceList.innerHTML = "";

  addService();

  calculateBudget();
}


if (newBudgetBtn) {

  newBudgetBtn.addEventListener(
    "click",
    () => {

      clearBudgetForm();

      showScreen("budgetsScreen");

      clientName.focus();

    }
  );

}


/* =========================
   SALVAR ORÇAMENTO
========================= */

budgetForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const name =
      clientName.value.trim();

    const address =
      clientAddress.value.trim();

    const notes =
      budgetNotes.value.trim();


    if (!name) {

      alert(
        "Informe o nome do cliente."
      );

      clientName.focus();

      return;

    }


    const serviceElements =
      serviceList.querySelectorAll(
        ".service-item"
      );


    if (serviceElements.length === 0) {

      alert(
        "Adicione pelo menos um serviço."
      );

      return;

    }


    const services = [];

    let total = 0;


    serviceElements.forEach(service => {

      const description =
        service
          .querySelector(
            ".service-description"
          )
          .value
          .trim();

      const quantity =
        Number(
          service.querySelector(
            ".service-quantity"
          ).value
        ) || 0;

      const value =
        Number(
          service.querySelector(
            ".service-value"
          ).value
        ) || 0;

      const subtotal =
        quantity * value;


      if (description) {

        services.push({
          description,
          quantity,
          value,
          subtotal
        });

        total += subtotal;

      }

    });


    if (services.length === 0) {

      alert(
        "Preencha pelo menos um serviço."
      );

      return;

    }


    const budget = {

      id: Date.now(),

      client: name,

      address,

      notes,

      services,

      total,

      createdAt:
        new Date().toISOString()

    };


    budgets.unshift(budget);


    localStorage.setItem(
      "dryniel_budgets",
      JSON.stringify(budgets)
    );


    renderBudgets();

    clearBudgetForm();


    alert(
      "Orçamento salvo com sucesso!"
    );

  }
);


/* =========================
   MOSTRAR ORÇAMENTOS
========================= */

function renderBudgets() {

  budgetList.innerHTML = "";


  if (budgets.length === 0) {

    budgetList.innerHTML = `
      <div class="card">
        <p>Nenhum orçamento salvo.</p>
      </div>
    `;

    return;

  }


  budgets.forEach(budget => {

    const card =
      document.createElement("div");

    card.className =
      "budget-card";


    const serviceQuantity =
      Array.isArray(budget.services)
        ? budget.services.length
        : 1;


    card.innerHTML = `

      <h3>${escapeHTML(
        budget.client || "Cliente"
      )}</h3>

      ${
        budget.address
          ? `<p>${escapeHTML(
              budget.address
            )}</p>`
          : ""
      }

      <p>
        ${serviceQuantity}
        ${
          serviceQuantity === 1
            ? "serviço"
            : "serviços"
        }
      </p>

      <div class="budget-card-total">
        ${formatCurrency(
          getBudgetTotal(budget)
        )}
      </div>

      <div class="budget-actions">

        <button
          class="view-budget-btn"
          type="button"
        >
          Ver detalhes
        </button>

        <button
          class="delete-budget-btn"
          type="button"
        >
          Excluir
        </button>

      </div>
    `;


    card
      .querySelector(
        ".view-budget-btn"
      )
      .addEventListener(
        "click",
        () => {

          showBudgetDetails(
            budget.id
          );

        }
      );


    card
      .querySelector(
        ".delete-budget-btn"
      )
      .addEventListener(
        "click",
        () => {

          deleteBudget(
            budget.id
          );

        }
      );


    budgetList.appendChild(card);

  });

}


/* =========================
   TOTAL COMPATÍVEL COM
   ORÇAMENTOS ANTIGOS
========================= */

function getBudgetTotal(budget) {

  if (
    typeof budget.total === "number"
  ) {
    return budget.total;
  }


  if (
    Array.isArray(budget.services)
  ) {

    return budget.services.reduce(
      (sum, service) => {

        const quantity =
          Number(
            service.quantity
          ) || 0;

        const value =
          Number(
            service.value
          ) || 0;

        return (
          sum +
          quantity * value
        );

      },
      0
    );

  }


  return (
    Number(budget.value) || 0
  );

}


/* =========================
   DETALHES DO ORÇAMENTO
========================= */

function showBudgetDetails(id) {

  const budget =
    budgets.find(
      item => item.id === id
    );


  if (!budget) {
    return;
  }


  let servicesHTML = "";


  if (
    Array.isArray(budget.services)
  ) {

    budget.services.forEach(
      (service, index) => {

        const subtotal =
          Number(
            service.subtotal
          ) ||
          (
            Number(service.quantity) *
            Number(service.value)
          );


        servicesHTML += `

          <div class="detail-service">

            <strong>
              Serviço ${index + 1}
            </strong>

            <p>
              ${escapeHTML(
                service.description
              )}
            </p>

            <p>
              Quantidade:
              ${service.quantity}
            </p>

            <p>
              Valor unitário:
              ${formatCurrency(
                service.value
              )}
            </p>

            <p>
              <strong>
                Subtotal:
                ${formatCurrency(
                  subtotal
                )}
              </strong>
            </p>

          </div>

        `;

      }
    );

  } else {

    servicesHTML = `

      <div class="detail-service">

        <p>
          ${escapeHTML(
            budget.description || ""
          )}
        </p>

        <p>
          Quantidade:
          ${budget.quantity || 1}
        </p>

      </div>

    `;

  }


  budgetDetails.innerHTML = `

    <div class="card">

      <h2>
        ${escapeHTML(
          budget.client || "Cliente"
        )}
      </h2>

      ${
        budget.address
          ? `
            <p>
              ${escapeHTML(
                budget.address
              )}
            </p>
          `
          : ""
      }

      ${servicesHTML}

      ${
        budget.notes
          ? `
            <div class="detail-service">

              <strong>
                Observações
              </strong>

              <p>
                ${escapeHTML(
                  budget.notes
                )}
              </p>

            </div>
          `
          : ""
      }

      <div class="detail-total">

        <span>Total</span>

        <span>
          ${formatCurrency(
            getBudgetTotal(budget)
          )}
        </span>

      </div>

    </div>

  `;


  showScreen(
    "budgetDetailsScreen"
  );

}


/* =========================
   EXCLUIR ORÇAMENTO
========================= */

function deleteBudget(id) {

  const confirmed =
    confirm(
      "Deseja excluir este orçamento?"
    );


  if (!confirmed) {
    return;
  }


  budgets =
    budgets.filter(
      budget =>
        budget.id !== id
    );


  localStorage.setItem(
    "dryniel_budgets",
    JSON.stringify(budgets)
  );


  renderBudgets();

}


/* =========================
   SEGURANÇA DO TEXTO
========================= */

function escapeHTML(text) {

  const div =
    document.createElement("div");

  div.textContent =
    text == null
      ? ""
      : String(text);

  return div.innerHTML;

}


/* =========================
   INICIALIZAÇÃO
========================= */

renderBudgets();

clearBudgetForm();
