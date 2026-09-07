const screens =
  document.querySelectorAll(".screen");

const navButtons =
  document.querySelectorAll(".nav-btn");

const menuButtons =
  document.querySelectorAll(".menu-card");

const themeBtn =
  document.getElementById("themeBtn");


const budgetForm =
  document.getElementById("budgetForm");

const budgetList =
  document.getElementById("budgetList");

const budgetDetails =
  document.getElementById("budgetDetails");

const serviceList =
  document.getElementById("serviceList");

const serviceTemplate =
  document.getElementById("serviceTemplate");

const addServiceBtn =
  document.getElementById("addServiceBtn");

const newBudgetBtn =
  document.getElementById("newBudgetBtn");

const budgetTotal =
  document.getElementById("budgetTotal");

const serviceCount =
  document.getElementById("serviceCount");

const clientName =
  document.getElementById("clientName");

const clientAddress =
  document.getElementById("clientAddress");

const budgetNotes =
  document.getElementById("budgetNotes");

const editingBudgetId =
  document.getElementById("editingBudgetId");


const workForm =
  document.getElementById("workForm");

const workList =
  document.getElementById("workList");

const workName =
  document.getElementById("workName");

const workClient =
  document.getElementById("workClient");

const workAddress =
  document.getElementById("workAddress");

const workNotes =
  document.getElementById("workNotes");

const editingWorkId =
  document.getElementById("editingWorkId");


const employeeForm =
  document.getElementById("employeeForm");

const employeeList =
  document.getElementById("employeeList");

const employeeName =
  document.getElementById("employeeName");

const employeeDailyRate =
  document.getElementById("employeeDailyRate");

const employeeDetailsTitle =
  document.getElementById("employeeDetailsTitle");


const dailyForm =
  document.getElementById("dailyForm");

const dailyDate =
  document.getElementById("dailyDate");

const dailyQuantity =
  document.getElementById("dailyQuantity");

const dailyNote =
  document.getElementById("dailyNote");

const dailyList =
  document.getElementById("dailyList");


const paymentForm =
  document.getElementById("paymentForm");

const paymentDate =
  document.getElementById("paymentDate");

const paymentAmount =
  document.getElementById("paymentAmount");

const paymentNote =
  document.getElementById("paymentNote");

const paymentList =
  document.getElementById("paymentList");


const employeeDaysTotal =
  document.getElementById("employeeDaysTotal");

const employeeGrossTotal =
  document.getElementById("employeeGrossTotal");

const employeePaidTotal =
  document.getElementById("employeePaidTotal");

const employeeBalance =
  document.getElementById("employeeBalance");


/* =========================
   DADOS
========================= */

let budgets =
  loadData("dryniel_budgets", []);

let works =
  loadData("dryniel_works", []);

let employees =
  loadData("dryniel_employees", []);

let currentEmployeeId = null;


/* =========================
   FUNÇÕES GERAIS
========================= */

function loadData(
  key,
  fallback
) {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(key)
      );

    return Array.isArray(saved)
      ? saved
      : fallback;

  } catch (error) {

    return fallback;

  }

}


function saveData(
  key,
  value
) {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

}


function makeId() {

  return (
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );

}


function formatCurrency(value) {

  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL"
    }
  ).format(
    Number(value) || 0
  );

}


function formatDate(dateString) {

  if (!dateString) {
    return "-";
  }

  const parts =
    dateString.split("-");

  if (parts.length !== 3) {
    return dateString;
  }

  return (
    parts[2] +
    "/" +
    parts[1] +
    "/" +
    parts[0]
  );

}


function escapeHtml(value) {

  const div =
    document.createElement("div");

  div.textContent =
    value == null
      ? ""
      : String(value);

  return div.innerHTML;

}


/* =========================
   NAVEGAÇÃO
========================= */

function showScreen(screenId) {

  screens.forEach(
    function(screen) {

      if (
        screen.id === screenId
      ) {

        screen.classList.add(
          "active"
        );

      } else {

        screen.classList.remove(
          "active"
        );

      }

    }
  );


  navButtons.forEach(
    function(button) {

      if (
        button.dataset.screen ===
        screenId
      ) {

        button.classList.add(
          "active"
        );

      } else {

        button.classList.remove(
          "active"
        );

      }

    }
  );


  window.scrollTo(0, 0);

}


navButtons.forEach(
  function(button) {

    button.addEventListener(
      "click",
      function() {

        showScreen(
          button.dataset.screen
        );

      }
    );

  }
);


menuButtons.forEach(
  function(button) {

    button.addEventListener(
      "click",
      function() {

        showScreen(
          button.dataset.screen
        );

      }
    );

  }
);


document
  .querySelectorAll(
    ".back-to-budgets"
  )
  .forEach(
    function(button) {

      button.addEventListener(
        "click",
        function() {

          showScreen(
            "budgetsScreen"
          );

        }
      );

    }
  );


document
  .querySelectorAll(
    ".back-to-employees"
  )
  .forEach(
    function(button) {

      button.addEventListener(
        "click",
        function() {

          showScreen(
            "employeesScreen"
          );

        }
      );

    }
  );


/* =========================
   TEMA
========================= */

const savedTheme =
  localStorage.getItem(
    "dryniel_theme"
  );


if (savedTheme === "dark") {

  document.body
    .classList
    .add("dark");

}


updateThemeButton();


themeBtn.addEventListener(
  "click",
  function() {

    document.body
      .classList
      .toggle("dark");


    const theme =
      document.body
        .classList
        .contains("dark")
        ? "dark"
        : "light";


    localStorage.setItem(
      "dryniel_theme",
      theme
    );


    updateThemeButton();

  }
);


function updateThemeButton() {

  themeBtn.textContent =
    document.body
      .classList
      .contains("dark")
      ? "☀"
      : "☾";

}


/* =========================
   SERVIÇOS DO ORÇAMENTO
========================= */

function addService(service) {

  if (!service) {

    service = {
      description: "",
      value: ""
    };

  }


  const fragment =
    serviceTemplate
      .content
      .cloneNode(true);


  const row =
    fragment.querySelector(
      ".service-row"
    );


  const descriptionInput =
    fragment.querySelector(
      ".service-description"
    );


  const valueInput =
    fragment.querySelector(
      ".service-value"
    );


  const removeButton =
    fragment.querySelector(
      ".remove-service"
    );


  descriptionInput.value =
    service.description || "";


  valueInput.value =
    service.value || "";


  descriptionInput
    .addEventListener(
      "input",
      updateBudgetSummary
    );


  valueInput
    .addEventListener(
      "input",
      updateBudgetSummary
    );


  removeButton
    .addEventListener(
      "click",
      function() {

        row.remove();

        if (
          serviceList.children.length ===
          0
        ) {

          addService();

        }

        updateBudgetSummary();

      }
    );


  serviceList.appendChild(
    fragment
  );


  updateBudgetSummary();

}


function getServicesFromForm() {

  const rows =
    serviceList.querySelectorAll(
      ".service-row"
    );


  const services = [];


  rows.forEach(
    function(row) {

      const description =
        row
          .querySelector(
            ".service-description"
          )
          .value
          .trim();


      const value =
        Number(
          row
            .querySelector(
              ".service-value"
            )
            .value
        ) || 0;


      if (
        description !== "" ||
        value > 0
      ) {

        services.push({
          description: description,
          value: value
        });

      }

    }
  );


  return services;

}


function updateBudgetSummary() {

  const services =
    getServicesFromForm();


  let total = 0;


  services.forEach(
    function(service) {

      total +=
        Number(service.value) || 0;

    }
  );


  serviceCount.textContent =
    services.length;


  budgetTotal.textContent =
    formatCurrency(total);

}


function resetBudgetForm() {

  budgetForm.reset();

  editingBudgetId.value = "";

  serviceList.innerHTML = "";

  addService();

  updateBudgetSummary();

}


addServiceBtn.addEventListener(
  "click",
  function() {

    addService();

  }
);


newBudgetBtn.addEventListener(
  "click",
  function() {

    resetBudgetForm();

    showScreen(
      "budgetsScreen"
    );

    clientName.focus();

  }
);


/* =========================
   SALVAR ORÇAMENTO
========================= */

budgetForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const services =
      getServicesFromForm();


    if (
      services.length === 0
    ) {

      alert(
        "Adicione pelo menos um serviço."
      );

      return;

    }


    let total = 0;


    services.forEach(
      function(service) {

        total +=
          Number(service.value) || 0;

      }
    );


    const id =
      editingBudgetId.value ||
      makeId();


    const budget = {

      id: id,

      clientName:
        clientName.value.trim(),

      clientAddress:
        clientAddress.value.trim(),

      notes:
        budgetNotes.value.trim(),

      services: services,

      total: total,

      updatedAt:
        new Date().toISOString()

    };


    const existingIndex =
      budgets.findIndex(
        function(item) {

          return item.id === id;

        }
      );


    if (
      existingIndex >= 0
    ) {

      budgets[existingIndex] =
        budget;

    } else {

      budgets.unshift(
        budget
      );

    }


    saveData(
      "dryniel_budgets",
      budgets
    );


    renderBudgets();

    resetBudgetForm();


    alert(
      "Orçamento salvo com sucesso."
    );

  }
);


/* =========================
   LISTAR ORÇAMENTOS
========================= */

function renderBudgets() {

  if (
    budgets.length === 0
  ) {

    budgetList.innerHTML =
      '<div class="empty-state">' +
      "Nenhum orçamento salvo." +
      "</div>";

    return;

  }


  let html = "";


  budgets.forEach(
    function(budget) {

      html +=

        '<article class="list-card">' +

        "<h4>" +
        escapeHtml(
          budget.clientName ||
          "Cliente sem nome"
        ) +
        "</h4>" +

        "<p>" +
        escapeHtml(
          budget.clientAddress ||
          "Sem endereço"
        ) +
        "</p>" +

        '<p class="value">' +
        formatCurrency(
          budget.total
        ) +
        "</p>" +

        '<div class="card-actions">' +

        '<button class="primary-btn" type="button" data-action="open-budget" data-id="' +
        budget.id +
        '">' +
        "Abrir" +
        "</button>" +

        '<button class="secondary-btn" type="button" data-action="edit-budget" data-id="' +
        budget.id +
        '">' +
        "Editar" +
        "</button>" +

        '<button class="secondary-btn" type="button" data-action="print-budget" data-id="' +
        budget.id +
        '">' +
        "PDF" +
        "</button>" +

        '<button class="danger-btn" type="button" data-action="delete-budget" data-id="' +
        budget.id +
        '">' +
        "Excluir" +
        "</button>" +

        "</div>" +

        "</article>";

    }
  );


  budgetList.innerHTML =
    html;

}


budgetList.addEventListener(
  "click",
  function(event) {

    const button =
      event.target.closest(
        "button[data-action]"
      );


    if (!button) {
      return;
    }


    const action =
      button.dataset.action;


    const id =
      button.dataset.id;


    if (
      action ===
      "open-budget"
    ) {

      openBudget(id);

    }


    if (
      action ===
      "edit-budget"
    ) {

      editBudget(id);

    }


    if (
      action ===
      "print-budget"
    ) {

      printBudget(id);

    }


    if (
      action ===
      "delete-budget"
    ) {

      deleteBudget(id);

    }

  }
);


/* =========================
   ABRIR ORÇAMENTO
========================= */

function openBudget(id) {

  const budget =
    budgets.find(
      function(item) {

        return item.id === id;

      }
    );


  if (!budget) {
    return;
  }


  let servicesHtml = "";


  budget.services.forEach(
    function(service) {

      servicesHtml +=

        "<tr>" +

        "<td>" +
        escapeHtml(
          service.description
        ) +
        "</td>" +

        "<td>" +
        formatCurrency(
          service.value
        ) +
        "</td>" +

        "</tr>";

    }
  );


  let notesHtml = "";


  if (budget.notes) {

    notesHtml =

      '<div class="detail-block">' +

      "<h3>Observações</h3>" +

      "<p>" +
      escapeHtml(
        budget.notes
      ) +
      "</p>" +

      "</div>";

  }


  budgetDetails.innerHTML =

    '<div class="detail-block">' +

    "<h3>Cliente</h3>" +

    "<p><strong>" +
    escapeHtml(
      budget.clientName || "-"
    ) +
    "</strong></p>" +

    "<p>" +
    escapeHtml(
      budget.clientAddress || "-"
    ) +
    "</p>" +

    "</div>" +


    '<div class="detail-block">' +

    "<h3>Serviços</h3>" +

    '<table class="detail-services">' +

    "<thead>" +

    "<tr>" +

    "<th>Descrição</th>" +

    "<th>Valor</th>" +

    "</tr>" +

    "</thead>" +

    "<tbody>" +

    servicesHtml +

    "</tbody>" +

    "</table>" +

    "</div>" +


    notesHtml +


    '<div class="detail-total">' +

    "<span>Total</span>" +

    "<span>" +
    formatCurrency(
      budget.total
    ) +
    "</span>" +

    "</div>" +


    '<div class="card-actions">' +

    '<button class="secondary-btn" type="button" id="detailEditBtn">' +
    "Editar" +
    "</button>" +

    '<button class="primary-btn" type="button" id="detailPrintBtn">' +
    "Gerar PDF" +
    "</button>" +

    "</div>";


  document
    .getElementById(
      "detailEditBtn"
    )
    .addEventListener(
      "click",
      function() {

        editBudget(id);

      }
    );


  document
    .getElementById(
      "detailPrintBtn"
    )
    .addEventListener(
      "click",
      function() {

        window.print();

      }
    );


  showScreen(
    "budgetDetailsScreen"
  );

}


/* =========================
   EDITAR ORÇAMENTO
========================= */

function editBudget(id) {

  const budget =
    budgets.find(
      function(item) {

        return item.id === id;

      }
    );


  if (!budget) {
    return;
  }


  editingBudgetId.value =
    budget.id;


  clientName.value =
    budget.clientName || "";


  clientAddress.value =
    budget.clientAddress || "";


  budgetNotes.value =
    budget.notes || "";


  serviceList.innerHTML = "";


  budget.services.forEach(
    function(service) {

      addService(service);

    }
  );


  updateBudgetSummary();


  showScreen(
    "budgetsScreen"
  );


  clientName.focus();

}


function printBudget(id) {

  openBudget(id);


  setTimeout(
    function() {

      window.print();

    },
    200
  );

}


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
      function(item) {

        return item.id !== id;

      }
    );


  saveData(
    "dryniel_budgets",
    budgets
  );


  renderBudgets();

}


/* =========================
   OBRAS
========================= */

workForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const id =
      editingWorkId.value ||
      makeId();


    const work = {

      id: id,

      name:
        workName.value.trim(),

      client:
        workClient.value.trim(),

      address:
        workAddress.value.trim(),

      notes:
        workNotes.value.trim()

    };


    const existingIndex =
      works.findIndex(
        function(item) {

          return item.id === id;

        }
      );


    if (
      existingIndex >= 0
    ) {

      works[existingIndex] =
        work;

    } else {

      works.unshift(
        work
      );

    }


    saveData(
      "dryniel_works",
      works
    );


    workForm.reset();

    editingWorkId.value = "";

    renderWorks();

  }
);


function renderWorks() {

  if (
    works.length === 0
  ) {

    workList.innerHTML =
      '<div class="empty-state">' +
      "Nenhuma obra cadastrada." +
      "</div>";

    return;

  }


  let html = "";


  works.forEach(
    function(work) {

      html +=

        '<article class="list-card">' +

        "<h4>" +
        escapeHtml(
          work.name
        ) +
        "</h4>" +

        "<p>" +
        escapeHtml(
          work.client ||
          "Sem cliente informado"
        ) +
        "</p>" +

        "<p>" +
        escapeHtml(
          work.address ||
          "Sem endereço informado"
        ) +
        "</p>" +

        '<div class="card-actions">' +

        '<button class="secondary-btn" type="button" data-action="edit-work" data-id="' +
        work.id +
        '">' +
        "Editar" +
        "</button>" +

        '<button class="danger-btn" type="button" data-action="delete-work" data-id="' +
        work.id +
        '">' +
        "Excluir" +
        "</button>" +

        "</div>" +

        "</article>";

    }
  );


  workList.innerHTML =
    html;

}


workList.addEventListener(
  "click",
  function(event) {

    const button =
      event.target.closest(
        "button[data-action]"
      );


    if (!button) {
      return;
    }


    const action =
      button.dataset.action;


    const id =
      button.dataset.id;


    const work =
      works.find(
        function(item) {

          return item.id === id;

        }
      );


    if (!work) {
      return;
    }


    if (
      action ===
      "edit-work"
    ) {

      editingWorkId.value =
        work.id;

      workName.value =
        work.name || "";

      workClient.value =
        work.client || "";

      workAddress.value =
        work.address || "";

      workNotes.value =
        work.notes || "";

      workName.focus();

    }


    if (
      action ===
      "delete-work"
    ) {

      const confirmed =
        confirm(
          "Deseja excluir esta obra?"
        );


      if (!confirmed) {
        return;
      }


      works =
        works.filter(
          function(item) {

            return item.id !== id;

          }
        );


      saveData(
        "dryniel_works",
        works
      );


      renderWorks();

    }

  }
);


/* =========================
   FUNCIONÁRIOS
========================= */

employeeForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    employees.unshift({

      id: makeId(),

      name:
        employeeName.value.trim(),

      dailyRate:
        Number(
          employeeDailyRate.value
        ) || 0,

      dailyEntries: [],

      payments: []

    });


    saveData(
      "dryniel_employees",
      employees
    );


    employeeForm.reset();

    renderEmployees();

  }
);


function calculateEmployeeTotals(
  employee
) {

  const entries =
    employee.dailyEntries || [];


  const payments =
    employee.payments || [];


  let days = 0;


  entries.forEach(
    function(entry) {

      days +=
        Number(
          entry.quantity
        ) || 0;

    }
  );


  const gross =
    days *
    (
      Number(
        employee.dailyRate
      ) || 0
    );


  let paid = 0;


  payments.forEach(
    function(payment) {

      paid +=
        Number(
          payment.amount
        ) || 0;

    }
  );


  return {

    days: days,

    gross: gross,

    paid: paid,

    balance:
      gross - paid

  };

}


function renderEmployees() {

  if (
    employees.length === 0
  ) {

    employeeList.innerHTML =
      '<div class="empty-state">' +
      "Nenhum funcionário cadastrado." +
      "</div>";

    return;

  }


  let html = "";


  employees.forEach(
    function(employee) {

      const totals =
        calculateEmployeeTotals(
          employee
        );


      html +=

        '<article class="list-card">' +

        "<h4>" +
        escapeHtml(
          employee.name
        ) +
        "</h4>" +

        "<p>Diária: " +
        formatCurrency(
          employee.dailyRate
        ) +
        "</p>" +

        '<p class="value">' +
        "Saldo: " +
        formatCurrency(
          totals.balance
        ) +
        "</p>" +

        '<div class="card-actions">' +

        '<button class="primary-btn" type="button" data-action="open-employee" data-id="' +
        employee.id +
        '">' +
        "Abrir página" +
        "</button>" +

        '<button class="danger-btn" type="button" data-action="delete-employee" data-id="' +
        employee.id +
        '">' +
        "Excluir" +
        "</button>" +

        "</div>" +

        "</article>";

    }
  );


  employeeList.innerHTML =
    html;

}


employeeList.addEventListener(
  "click",
  function(event) {

    const button =
      event.target.closest(
        "button[data-action]"
      );


    if (!button) {
      return;
    }


    const action =
      button.dataset.action;


    const id =
      button.dataset.id;


    if (
      action ===
      "open-employee"
    ) {

      openEmployee(id);

    }


    if (
      action ===
      "delete-employee"
    ) {

      const confirmed =
        confirm(
          "Deseja excluir este funcionário e todo o histórico dele?"
        );


      if (!confirmed) {
        return;
      }


      employees =
        employees.filter(
          function(employee) {

            return (
              employee.id !== id
            );

          }
        );


      saveData(
        "dryniel_employees",
        employees
      );


      renderEmployees();

    }

  }
);


/* =========================
   PÁGINA DO FUNCIONÁRIO
========================= */

function openEmployee(id) {

  const employee =
    employees.find(
      function(item) {

        return item.id === id;

      }
    );


  if (!employee) {
    return;
  }


  currentEmployeeId = id;


  employeeDetailsTitle.textContent =
    employee.name;


  setTodayDefaults();

  renderEmployeeDetails();


  showScreen(
    "employeeDetailsScreen"
  );

}


function setTodayDefaults() {

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);


  if (!dailyDate.value) {

    dailyDate.value =
      today;

  }


  if (!paymentDate.value) {

    paymentDate.value =
      today;

  }

}


/* =========================
   DIÁRIAS
========================= */

dailyForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const employee =
      employees.find(
        function(item) {

          return (
            item.id ===
            currentEmployeeId
          );

        }
      );


    if (!employee) {
      return;
    }


    if (
      !employee.dailyEntries
    ) {

      employee.dailyEntries = [];

    }


    employee.dailyEntries.unshift({

      id: makeId(),

      date:
        dailyDate.value,

      quantity:
        Number(
          dailyQuantity.value
        ) || 1,

      note:
        dailyNote.value.trim()

    });


    saveData(
      "dryniel_employees",
      employees
    );


    dailyForm.reset();

    dailyQuantity.value = "1";

    setTodayDefaults();

    renderEmployeeDetails();

    renderEmployees();

  }
);


/* =========================
   PAGAMENTOS
========================= */

paymentForm.addEventListener(
  "submit",
  function(event) {

    event.preventDefault();


    const employee =
      employees.find(
        function(item) {

          return (
            item.id ===
            currentEmployeeId
          );

        }
      );


    if (!employee) {
      return;
    }


    if (
      !employee.payments
    ) {

      employee.payments = [];

    }


    employee.payments.unshift({

      id: makeId(),

      date:
        paymentDate.value,

      amount:
        Number(
          paymentAmount.value
        ) || 0,

      note:
        paymentNote.value.trim()

    });


    saveData(
      "dryniel_employees",
      employees
    );


    paymentForm.reset();

    setTodayDefaults();

    renderEmployeeDetails();

    renderEmployees();

  }
);


/* =========================
   DETALHES DO FUNCIONÁRIO
========================= */

function renderEmployeeDetails() {

  const employee =
    employees.find(
      function(item) {

        return (
          item.id ===
          currentEmployeeId
        );

      }
    );


  if (!employee) {
    return;
  }


  const totals =
    calculateEmployeeTotals(
      employee
    );


  employeeDetailsTitle.textContent =
    employee.name;


  employeeDaysTotal.textContent =
    totals.days.toLocaleString(
      "pt-BR"
    );


  employeeGrossTotal.textContent =
    formatCurrency(
      totals.gross
    );


  employeePaidTotal.textContent =
    formatCurrency(
      totals.paid
    );


  employeeBalance.textContent =
    formatCurrency(
      totals.balance
    );


  const entries =
    employee.dailyEntries || [];


  const payments =
    employee.payments || [];


  if (
    entries.length === 0
  ) {

    dailyList.innerHTML =
      '<div class="empty-state">' +
      "Nenhuma diária registrada." +
      "</div>";

  } else {

    let dailyHtml = "";


    entries.forEach(
      function(entry) {

        const entryValue =
          Number(
            entry.quantity
          ) *
          Number(
            employee.dailyRate
          );


        dailyHtml +=

          '<article class="list-card">' +

          "<h4>" +
          formatDate(
            entry.date
          ) +
          " — " +
          entry.quantity +
          " diária(s)" +
          "</h4>" +

          "<p>" +
          (
            entry.note
              ? escapeHtml(
                  entry.note
                )
              : "Sem observação"
          ) +
          "</p>" +

          '<p class="value">' +
          formatCurrency(
            entryValue
          ) +
          "</p>" +

          '<div class="card-actions">' +

          '<button class="danger-btn" type="button" data-action="delete-daily" data-id="' +
          entry.id +
          '">' +
          "Excluir" +
          "</button>" +

          "</div>" +

          "</article>";

      }
    );


    dailyList.innerHTML =
      dailyHtml;

  }


  if (
    payments.length === 0
  ) {

    paymentList.innerHTML =
      '<div class="empty-state">' +
      "Nenhum pagamento registrado." +
      "</div>";

  } else {

    let paymentHtml = "";


    payments.forEach(
      function(payment) {

        paymentHtml +=

          '<article class="list-card">' +

          "<h4>" +
          formatDate(
            payment.date
          ) +
          "</h4>" +

          "<p>" +
          (
            payment.note
              ? escapeHtml(
                  payment.note
                )
              : "Sem observação"
          ) +
          "</p>" +

          '<p class="value">' +
          formatCurrency(
            payment.amount
          ) +
          "</p>" +

          '<div class="card-actions">' +

          '<button class="danger-btn" type="button" data-action="delete-payment" data-id="' +
          payment.id +
          '">' +
          "Excluir" +
          "</button>" +

          "</div>" +

          "</article>";

      }
    );


    paymentList.innerHTML =
      paymentHtml;

  }

}


/* =========================
   EXCLUIR DIÁRIA
========================= */

dailyList.addEventListener(
  "click",
  function(event) {

    const button =
      event.target.closest(
        'button[data-action="delete-daily"]'
      );


    if (!button) {
      return;
    }


    const employee =
      employees.find(
        function(item) {

          return (
            item.id ===
            currentEmployeeId
          );

        }
      );


    if (!employee) {
      return;
    }


    employee.dailyEntries =
      (
        employee.dailyEntries ||
        []
      ).filter(
        function(entry) {

          return (
            entry.id !==
            button.dataset.id
          );

        }
      );


    saveData(
      "dryniel_employees",
      employees
    );


    renderEmployeeDetails();

    renderEmployees();

  }
);


/* =========================
   EXCLUIR PAGAMENTO
========================= */

paymentList.addEventListener(
  "click",
  function(event) {

    const button =
      event.target.closest(
        'button[data-action="delete-payment"]'
      );


    if (!button) {
      return;
    }


    const employee =
      employees.find(
        function(item) {

          return (
            item.id ===
            currentEmployeeId
          );

        }
      );


    if (!employee) {
      return;
    }


    employee.payments =
      (
        employee.payments ||
        []
      ).filter(
        function(payment) {

          return (
            payment.id !==
            button.dataset.id
          );

        }
      );


    saveData(
      "dryniel_employees",
      employees
    );


    renderEmployeeDetails();

    renderEmployees();

  }
);


/* =========================
   INICIAR APP
========================= */

addService();

renderBudgets();

renderWorks();

renderEmployees();

showScreen("homeScreen");
