/* =========================================================
   DRYNIEL - CONSTRUÇÃO A SECO
   APP.JS COMPLETO
========================================================= */


/* =========================================================
   ELEMENTOS PRINCIPAIS
========================================================= */

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".nav-btn");
const menuButtons = document.querySelectorAll(".menu-card");

const themeBtn = document.getElementById("themeBtn");


/* =========================================================
   ORÇAMENTOS
========================================================= */

const budgetForm = document.getElementById("budgetForm");
const budgetList = document.getElementById("budgetList");
const budgetDetails = document.getElementById("budgetDetails");

const serviceList = document.getElementById("serviceList");
const serviceTemplate = document.getElementById("serviceTemplate");

const addServiceBtn = document.getElementById("addServiceBtn");
const newBudgetBtn = document.getElementById("newBudgetBtn");

const budgetTotal = document.getElementById("budgetTotal");
const serviceCount = document.getElementById("serviceCount");

const clientName = document.getElementById("clientName");
const clientAddress = document.getElementById("clientAddress");
const budgetNotes = document.getElementById("budgetNotes");


/* =========================================================
   OBRAS
========================================================= */

const workForm = document.getElementById("workForm");
const workList = document.getElementById("workList");

const workName = document.getElementById("workName");
const workAddress = document.getElementById("workAddress");
const workClient = document.getElementById("workClient");
const workNotes = document.getElementById("workNotes");


/* =========================================================
   FUNCIONÁRIOS
========================================================= */

const employeeForm = document.getElementById("employeeForm");
const employeeList = document.getElementById("employeeList");

const employeeName = document.getElementById("employeeName");
const employeePhone = document.getElementById("employeePhone");
const employeeDailyRate = document.getElementById("employeeDailyRate");

const employeeDetails = document.getElementById("employeeDetails");


/* =========================================================
   DADOS SALVOS
========================================================= */

let budgets =
  JSON.parse(localStorage.getItem("dryniel_budgets")) || [];

let works =
  JSON.parse(localStorage.getItem("dryniel_works")) || [];

let employees =
  JSON.parse(localStorage.getItem("dryniel_employees")) || [];

let currentEmployeeId = null;


/* =========================================================
   FORMATAÇÃO
========================================================= */

function formatCurrency(value) {

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value) || 0);

}


function formatDate(dateString) {

  if (!dateString) {
    return "";
  }

  const date = new Date(dateString + "T12:00:00");

  return date.toLocaleDateString("pt-BR");

}


/* =========================================================
   SEGURANÇA DO TEXTO
========================================================= */

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent =
    text == null
      ? ""
      : String(text);

  return div.innerHTML;

}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

function showScreen(screenId) {

  screens.forEach(screen => {
    screen.classList.remove("active");
  });

  const target =
    document.getElementById(screenId);

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


/* =========================================================
   MENU PRINCIPAL
========================================================= */

menuButtons.forEach(button => {

  button.addEventListener("click", () => {

    const screenId =
      button.dataset.screen;

    if (screenId) {
      showScreen(screenId);
    }

  });

});


/* =========================================================
   MENU INFERIOR
========================================================= */

navButtons.forEach(button => {

  button.addEventListener("click", () => {

    const screenId =
      button.dataset.screen;

    if (screenId) {
      showScreen(screenId);
    }

  });

});


/* =========================================================
   BOTÕES VOLTAR
========================================================= */

document
  .querySelectorAll("[data-back-screen]")
  .forEach(button => {

    button.addEventListener("click", () => {

      const screen =
        button.dataset.backScreen;

      if (screen) {
        showScreen(screen);
      }

    });

  });


document
  .querySelectorAll(".back-to-budgets")
  .forEach(button => {

    button.addEventListener("click", () => {

      showScreen("budgetsScreen");

    });

  });


document
  .querySelectorAll(".back-to-employees")
  .forEach(button => {

    button.addEventListener("click", () => {

      showScreen("employeesScreen");

    });

  });


/* =========================================================
   TEMA CLARO / ESCURO
========================================================= */

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


/* =========================================================
   ORÇAMENTOS
========================================================= */


/* =========================================================
   ADICIONAR SERVIÇO
========================================================= */

function addService(data = {}) {

  if (!serviceTemplate || !serviceList) {
    return;
  }

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


  if (description) {
    description.value =
      data.description || "";
  }

  if (quantity) {
    quantity.value =
      data.quantity || 1;
  }

  if (value) {
    value.value =
      data.value || "";
  }


  if (quantity) {

    quantity.addEventListener(
      "input",
      calculateBudget
    );

  }


  if (value) {

    value.addEventListener(
      "input",
      calculateBudget
    );

  }


  if (removeButton) {

    removeButton.addEventListener(
      "click",
      () => {

        if (serviceItem) {
          serviceItem.remove();
        }

        updateServiceNumbers();

        calculateBudget();

      }
    );

  }


  serviceList.appendChild(fragment);

  updateServiceNumbers();

  calculateBudget();

}


/* =========================================================
   NUMERAÇÃO DOS SERVIÇOS
========================================================= */

function updateServiceNumbers() {

  if (!serviceList) {
    return;
  }

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

      if (title) {

        title.textContent =
          "Serviço " + (index + 1);

      }

    }
  );

}


/* =========================================================
   CÁLCULO DO ORÇAMENTO
========================================================= */

function calculateBudget() {

  if (!serviceList) {
    return;
  }

  const services =
    serviceList.querySelectorAll(
      ".service-item"
    );

  let total = 0;


  services.forEach(service => {

    const quantityField =
      service.querySelector(
        ".service-quantity"
      );

    const valueField =
      service.querySelector(
        ".service-value"
      );


    const quantity =
      Number(
        quantityField?.value
      ) || 0;

    const value =
      Number(
        valueField?.value
      ) || 0;


    const subtotal =
      quantity * value;

    total += subtotal;


    const subtotalElement =
      service.querySelector(
        ".service-subtotal-value"
      );


    if (subtotalElement) {

      subtotalElement.textContent =
        formatCurrency(subtotal);

    }

  });


  if (serviceCount) {

    serviceCount.textContent =
      services.length;

  }


  if (budgetTotal) {

    budgetTotal.textContent =
      formatCurrency(total);

  }

}


/* =========================================================
   BOTÃO ADICIONAR SERVIÇO
========================================================= */

if (addServiceBtn) {

  addServiceBtn.addEventListener(
    "click",
    () => {

      addService();

    }
  );

}


/* =========================================================
   LIMPAR ORÇAMENTO
========================================================= */

function clearBudgetForm() {

  if (budgetForm) {
    budgetForm.reset();
  }

  if (serviceList) {

    serviceList.innerHTML = "";

    addService();

  }

  calculateBudget();

}


/* =========================================================
   NOVO ORÇAMENTO
========================================================= */

if (newBudgetBtn) {

  newBudgetBtn.addEventListener(
    "click",
    () => {

      clearBudgetForm();

      showScreen("budgetsScreen");

      if (clientName) {
        clientName.focus();
      }

    }
  );

}


/* =========================================================
   SALVAR ORÇAMENTO
========================================================= */

if (budgetForm) {

  budgetForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        clientName
          ? clientName.value.trim()
          : "";

      const address =
        clientAddress
          ? clientAddress.value.trim()
          : "";

      const notes =
        budgetNotes
          ? budgetNotes.value.trim()
          : "";


      if (!name) {

        alert(
          "Informe o nome do cliente."
        );

        if (clientName) {
          clientName.focus();
        }

        return;

      }


      const serviceElements =
        serviceList
          ? serviceList.querySelectorAll(
              ".service-item"
            )
          : [];


      if (
        serviceElements.length === 0
      ) {

        alert(
          "Adicione pelo menos um serviço."
        );

        return;

      }


      const services = [];

      let total = 0;


      serviceElements.forEach(
        service => {

          const descriptionField =
            service.querySelector(
              ".service-description"
            );

          const quantityField =
            service.querySelector(
              ".service-quantity"
            );

          const valueField =
            service.querySelector(
              ".service-value"
            );


          const description =
            descriptionField
              ? descriptionField.value.trim()
              : "";


          const quantity =
            Number(
              quantityField?.value
            ) || 0;


          const value =
            Number(
              valueField?.value
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

        }
      );


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


      saveBudgets();

      renderBudgets();

      clearBudgetForm();


      alert(
        "Orçamento salvo com sucesso!"
      );

    }
  );

}


/* =========================================================
   SALVAR NO CELULAR
========================================================= */

function saveBudgets() {

  localStorage.setItem(
    "dryniel_budgets",
    JSON.stringify(budgets)
  );

}


/* =========================================================
   TOTAL DO ORÇAMENTO
========================================================= */

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


/* =========================================================
   LISTA DE ORÇAMENTOS
========================================================= */

function renderBudgets() {

  if (!budgetList) {
    return;
  }


  budgetList.innerHTML = "";


  if (budgets.length === 0) {

    budgetList.innerHTML = `

      <div class="card">

        <p>
          Nenhum orçamento salvo.
        </p>

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

      <h3>
        ${escapeHTML(
          budget.client || "Cliente"
        )}
      </h3>

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


    const viewButton =
      card.querySelector(
        ".view-budget-btn"
      );


    if (viewButton) {

      viewButton.addEventListener(
        "click",
        () => {

          showBudgetDetails(
            budget.id
          );

        }
      );

    }


    const deleteButton =
      card.querySelector(
        ".delete-budget-btn"
      );


    if (deleteButton) {

      deleteButton.addEventListener(
        "click",
        () => {

          deleteBudget(
            budget.id
          );

        }
      );

    }


    budgetList.appendChild(card);

  });

}


/* =========================================================
   DETALHES DO ORÇAMENTO
========================================================= */

function showBudgetDetails(id) {

  const budget =
    budgets.find(
      item => item.id === id
    );


  if (!budget || !budgetDetails) {
    return;
  }


  let servicesHTML = "";


  if (
    Array.isArray(budget.services)
  ) {

    budget.services.forEach(
      (service, index) => {

        const subtotal =
          Number(service.subtotal) ||
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
              ${escapeHTML(
                service.quantity
              )}
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

        <span>
          Total
        </span>

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


/* =========================================================
   EXCLUIR ORÇAMENTO
========================================================= */

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


  saveBudgets();

  renderBudgets();

}


/* =========================================================
   OBRAS
========================================================= */

function saveWorks() {

  localStorage.setItem(
    "dryniel_works",
    JSON.stringify(works)
  );

}


/* =========================================================
   CADASTRAR OBRA
========================================================= */

if (workForm) {

  workForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        workName
          ? workName.value.trim()
          : "";


      if (!name) {

        alert(
          "Informe o nome da obra."
        );

        return;

      }


      const work = {

        id: Date.now(),

        name,

        client:
          workClient
            ? workClient.value.trim()
            : "",

        address:
          workAddress
            ? workAddress.value.trim()
            : "",

        notes:
          workNotes
            ? workNotes.value.trim()
            : "",

        createdAt:
          new Date().toISOString()

      };


      works.unshift(work);

      saveWorks();

      renderWorks();

      workForm.reset();


      alert(
        "Obra cadastrada com sucesso!"
      );

    }
  );

}


/* =========================================================
   MOSTRAR OBRAS
========================================================= */

function renderWorks() {

  if (!workList) {
    return;
  }


  workList.innerHTML = "";


  if (works.length === 0) {

    workList.innerHTML = `

      <div class="card">

        <p>
          Nenhuma obra cadastrada.
        </p>

      </div>

    `;

    return;

  }


  works.forEach(work => {

    const card =
      document.createElement("div");

    card.className =
      "work-card card";


    card.innerHTML = `

      <h3>
        ${escapeHTML(
          work.name
        )}
      </h3>

      ${
        work.client
          ? `
            <p>
              Cliente:
              ${escapeHTML(
                work.client
              )}
            </p>
          `
          : ""
      }

      ${
        work.address
          ? `
            <p>
              ${escapeHTML(
                work.address
              )}
            </p>
          `
          : ""
      }

      ${
        work.notes
          ? `
            <p>
              ${escapeHTML(
                work.notes
              )}
            </p>
          `
          : ""
      }

      <button
        type="button"
        class="delete-work-btn"
      >
        Excluir obra
      </button>

    `;


    const deleteButton =
      card.querySelector(
        ".delete-work-btn"
      );


    deleteButton.addEventListener(
      "click",
      () => {

        const confirmed =
          confirm(
            "Deseja excluir esta obra?"
          );


        if (!confirmed) {
          return;
        }


        works =
          works.filter(
            item =>
              item.id !== work.id
          );


        saveWorks();

        renderWorks();

      }
    );


    workList.appendChild(card);

  });

}


/* =========================================================
   FUNCIONÁRIOS
========================================================= */

function saveEmployees() {

  localStorage.setItem(
    "dryniel_employees",
    JSON.stringify(employees)
  );

}


/* =========================================================
   CADASTRAR FUNCIONÁRIO
========================================================= */

if (employeeForm) {

  employeeForm.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =
        employeeName
          ? employeeName.value.trim()
          : "";


      const phone =
        employeePhone
          ? employeePhone.value.trim()
          : "";


      const dailyRate =
        Number(
          employeeDailyRate?.value
        ) || 0;


      if (!name) {

        alert(
          "Informe o nome do funcionário."
        );

        if (employeeName) {
          employeeName.focus();
        }

        return;

      }


      if (dailyRate <= 0) {

        alert(
          "Informe o valor da diária."
        );

        return;

      }


      const employee = {

        id: Date.now(),

        name,

        phone,

        dailyRate,

        days: [],

        createdAt:
          new Date().toISOString()

      };


      employees.unshift(employee);


      saveEmployees();

      renderEmployees();

      employeeForm.reset();


      alert(
        "Funcionário cadastrado com sucesso!"
      );

    }
  );

}


/* =========================================================
   TOTAL DO FUNCIONÁRIO
========================================================= */

function getEmployeeTotal(employee) {

  if (!employee) {
    return 0;
  }


  if (!Array.isArray(employee.days)) {
    return 0;
  }


  return employee.days.reduce(
    (total, day) => {

      const value =
        Number(day.value) ||
        Number(employee.dailyRate) ||
        0;


      return total + value;

    },
    0
  );

}


/* =========================================================
   LISTAR FUNCIONÁRIOS
========================================================= */

function renderEmployees() {

  if (!employeeList) {
    return;
  }


  employeeList.innerHTML = "";


  if (employees.length === 0) {

    employeeList.innerHTML = `

      <div class="card">

        <p>
          Nenhum funcionário cadastrado.
        </p>

      </div>

    `;

    return;

  }


  employees.forEach(employee => {

    if (!Array.isArray(employee.days)) {
      employee.days = [];
    }


    const total =
      getEmployeeTotal(employee);


    const card =
      document.createElement("div");

    card.className =
      "employee-card card";


    card.innerHTML = `

      <h3>
        ${escapeHTML(
          employee.name
        )}
      </h3>

      ${
        employee.phone
          ? `
            <p>
              ${escapeHTML(
                employee.phone
              )}
            </p>
          `
          : ""
      }

      <p>
        Valor da diária:
        <strong>
          ${formatCurrency(
            employee.dailyRate
          )}
        </strong>
      </p>

      <p>
        Diárias lançadas:
        <strong>
          ${employee.days.length}
        </strong>
      </p>

      <div class="employee-total">

        Total:

        <strong>
          ${formatCurrency(total)}
        </strong>

      </div>

      <div class="budget-actions">

        <button
          type="button"
          class="open-employee-btn"
        >
          Abrir funcionário
        </button>

        <button
          type="button"
          class="delete-employee-btn"
        >
          Excluir
        </button>

      </div>

    `;


    const openButton =
      card.querySelector(
        ".open-employee-btn"
      );


    openButton.addEventListener(
      "click",
      () => {

        openEmployee(
          employee.id
        );

      }
    );


    const deleteButton =
      card.querySelector(
        ".delete-employee-btn"
      );


    deleteButton.addEventListener(
      "click",
      () => {

        deleteEmployee(
          employee.id
        );

      }
    );


    employeeList.appendChild(card);

  });

}


/* =========================================================
   ABRIR PÁGINA DO FUNCIONÁRIO
========================================================= */

function openEmployee(id) {

  currentEmployeeId = id;

  renderEmployeeDetails();

  showScreen(
    "employeeDetailsScreen"
  );

}


/* =========================================================
   DETALHES DO FUNCIONÁRIO
========================================================= */

function renderEmployeeDetails() {

  if (!employeeDetails) {
    return;
  }


  const employee =
    employees.find(
      item =>
        item.id === currentEmployeeId
    );


  if (!employee) {
    return;
  }


  if (!Array.isArray(employee.days)) {
    employee.days = [];
  }


  const total =
    getEmployeeTotal(employee);


  let daysHTML = "";


  if (employee.days.length === 0) {

    daysHTML = `

      <div class="card">

        <p>
          Nenhuma diária lançada.
        </p>

      </div>

    `;

  } else {

    employee.days
      .slice()
      .reverse()
      .forEach(day => {

        daysHTML += `

          <div class="daily-item">

            <div>

              <strong>
                ${formatDate(
                  day.date
                )}
              </strong>

              ${
                day.work
                  ? `
                    <p>
                      Obra:
                      ${escapeHTML(
                        day.work
                      )}
                    </p>
                  `
                  : ""
              }

              ${
                day.notes
                  ? `
                    <p>
                      ${escapeHTML(
                        day.notes
                      )}
                    </p>
                  `
                  : ""
              }

            </div>

            <div>

              <strong>
                ${formatCurrency(
                  day.value
                )}
              </strong>

              <button
                type="button"
                class="delete-day-btn"
                data-day-id="${day.id}"
              >
                Excluir
              </button>

            </div>

          </div>

        `;

      });

  }


  employeeDetails.innerHTML = `

    <div class="card employee-profile">

      <h2>
        ${escapeHTML(
          employee.name
        )}
      </h2>

      ${
        employee.phone
          ? `
            <p>
              Telefone:
              ${escapeHTML(
                employee.phone
              )}
            </p>
          `
          : ""
      }

      <p>

        Valor da diária:

        <strong>
          ${formatCurrency(
            employee.dailyRate
          )}
        </strong>

      </p>

      <p>

        Total de diárias:

        <strong>
          ${employee.days.length}
        </strong>

      </p>

      <div class="detail-total">

        <span>
          Total acumulado
        </span>

        <span>
          ${formatCurrency(total)}
        </span>

      </div>

    </div>


    <div class="card">

      <h3>
        Adicionar diária
      </h3>

      <form id="dailyForm">

        <label>
          Data
        </label>

        <input
          id="dailyDate"
          type="date"
          required
        >


        <label>
          Obra / Local
        </label>

        <input
          id="dailyWork"
          type="text"
          placeholder="Ex.: Obra João"
        >


        <label>
          Valor da diária
        </label>

        <input
          id="dailyValue"
          type="number"
          min="0"
          step="0.01"
          value="${employee.dailyRate}"
        >


        <label>
          Observações
        </label>

        <textarea
          id="dailyNotes"
          placeholder="Observações da diária"
        ></textarea>


        <button
          type="submit"
          class="primary-btn"
        >
          Adicionar diária
        </button>

      </form>

    </div>


    <div class="daily-history">

      <h3>
        Histórico de diárias
      </h3>

      ${daysHTML}

    </div>

  `;


  const dailyDate =
    document.getElementById(
      "dailyDate"
    );


  if (dailyDate) {

    dailyDate.value =
      new Date()
        .toISOString()
        .split("T")[0];

  }


  const dailyForm =
    document.getElementById(
      "dailyForm"
    );


  if (dailyForm) {

    dailyForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        addDailyEntry();

      }
    );

  }


  employeeDetails
    .querySelectorAll(
      ".delete-day-btn"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            Number(
              button.dataset.dayId
            );

          deleteDailyEntry(id);

        }
      );

    });

}


/* =========================================================
   ADICIONAR DIÁRIA
========================================================= */

function addDailyEntry() {

  const employee =
    employees.find(
      item =>
        item.id === currentEmployeeId
    );


  if (!employee) {
    return;
  }


  const dateField =
    document.getElementById(
      "dailyDate"
    );

  const workField =
    document.getElementById(
      "dailyWork"
    );

  const valueField =
    document.getElementById(
      "dailyValue"
    );

  const notesField =
    document.getElementById(
      "dailyNotes"
    );


  const date =
    dateField?.value || "";

  const work =
    workField?.value.trim() || "";

  const value =
    Number(
      valueField?.value
    ) ||
    Number(employee.dailyRate) ||
    0;

  const notes =
    notesField?.value.trim() || "";


  if (!date) {

    alert(
      "Informe a data da diária."
    );

    return;

  }


  if (!Array.isArray(employee.days)) {
    employee.days = [];
  }


  employee.days.push({

    id: Date.now(),

    date,

    work,

    value,

    notes

  });


  saveEmployees();

  renderEmployees();

  renderEmployeeDetails();

}


/* =========================================================
   EXCLUIR DIÁRIA
========================================================= */

function deleteDailyEntry(dayId) {

  const employee =
    employees.find(
      item =>
        item.id === currentEmployeeId
    );


  if (!employee) {
    return;
  }


  const confirmed =
    confirm(
      "Deseja excluir esta diária?"
    );


  if (!confirmed) {
    return;
  }


  employee.days =
    employee.days.filter(
      day =>
        day.id !== dayId
    );


  saveEmployees();

  renderEmployees();

  renderEmployeeDetails();

}


/* =========================================================
   EXCLUIR FUNCIONÁRIO
========================================================= */

function deleteEmployee(id) {

  const employee =
    employees.find(
      item =>
        item.id === id
    );


  if (!employee) {
    return;
  }


  const confirmed =
    confirm(
      `Deseja excluir o funcionário ${employee.name}?`
    );


  if (!confirmed) {
    return;
  }


  employees =
    employees.filter(
      item =>
        item.id !== id
    );


  saveEmployees();

  renderEmployees();

}


/* =========================================================
   COMPATIBILIDADE COM FUNCIONÁRIOS ANTIGOS
========================================================= */

employees =
  employees.map(employee => {

    return {

      ...employee,

      dailyRate:
        Number(
          employee.dailyRate ||
          employee.value ||
          0
        ),

      days:
        Array.isArray(employee.days)
          ? employee.days
          : []

    };

  });


saveEmployees();


/* =========================================================
   INICIALIZAÇÃO DO APLICATIVO
========================================================= */

renderBudgets();

renderWorks();

renderEmployees();


if (
  serviceList &&
  serviceTemplate &&
  serviceList.children.length === 0
) {

  addService();

}


calculateBudget();


/* =========================================================
   FIM
========================================================= */
