/* =========================
   ELEMENTOS PRINCIPAIS
========================= */

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".nav-btn");
const menuButtons = document.querySelectorAll(".menu-card");

const themeBtn = document.getElementById("themeBtn");


/* =========================
   ORÇAMENTOS
========================= */

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


/* =========================
   OBRAS
========================= */

const workForm = document.getElementById("workForm");
const workList = document.getElementById("workList");

const workName = document.getElementById("workName");
const workClient = document.getElementById("workClient");
const workAddress = document.getElementById("workAddress");
const workStatus = document.getElementById("workStatus");


/* =========================
   FUNCIONÁRIOS
========================= */

const employeeForm = document.getElementById("employeeForm");
const employeeList = document.getElementById("employeeList");

const employeeName = document.getElementById("employeeName");
const employeeDailyRate =
  document.getElementById("employeeDailyRate");

const employeeDetailsName =
  document.getElementById("employeeDetailsName");

const employeeTotalDays =
  document.getElementById("employeeTotalDays");

const employeeTotalValue =
  document.getElementById("employeeTotalValue");

const employeePaidValue =
  document.getElementById("employeePaidValue");

const employeeBalanceValue =
  document.getElementById("employeeBalanceValue");

const employeeHistory =
  document.getElementById("employeeHistory");

const backEmployeesBtn =
  document.getElementById("backEmployeesBtn");


/* =========================
   DIÁRIAS
========================= */

const dailyForm = document.getElementById("dailyForm");
const dailyDate = document.getElementById("dailyDate");
const dailyQuantity =
  document.getElementById("dailyQuantity");
const dailyNote = document.getElementById("dailyNote");


/* =========================
   PAGAMENTOS
========================= */

const paymentForm =
  document.getElementById("paymentForm");

const paymentDate =
  document.getElementById("paymentDate");

const paymentValue =
  document.getElementById("paymentValue");


/* =========================
   DADOS SALVOS
========================= */

let budgets =
  JSON.parse(localStorage.getItem("dryniel_budgets")) || [];

let works =
  JSON.parse(localStorage.getItem("dryniel_works")) || [];

let employees =
  JSON.parse(localStorage.getItem("dryniel_employees")) || [];

let editingBudgetId = null;
let selectedEmployeeId = null;


/* =========================
   FUNÇÕES AUXILIARES
========================= */

function generateId() {
  return Date.now() + Math.floor(Math.random() * 100000);
}


function formatCurrency(value) {

  const number = Number(value) || 0;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(number);
}


function formatDate(date) {

  if (!date) return "";

  const parts = date.split("-");

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


function escapeHTML(value) {

  const div = document.createElement("div");

  div.textContent = value ?? "";

  return div.innerHTML;
}


function saveBudgets() {
  localStorage.setItem(
    "dryniel_budgets",
    JSON.stringify(budgets)
  );
}


function saveWorks() {
  localStorage.setItem(
    "dryniel_works",
    JSON.stringify(works)
  );
}


function saveEmployees() {
  localStorage.setItem(
    "dryniel_employees",
    JSON.stringify(employees)
  );
}


/* =========================
   NAVEGAÇÃO
========================= */

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


menuButtons.forEach(button => {

  button.addEventListener("click", () => {

    showScreen(button.dataset.screen);

  });

});


navButtons.forEach(button => {

  button.addEventListener("click", () => {

    showScreen(button.dataset.screen);

  });

});


backEmployeesBtn.addEventListener("click", () => {

  selectedEmployeeId = null;

  showScreen("employeesScreen");

  renderEmployees();

});


/* =========================
   TEMA
========================= */

const savedTheme =
  localStorage.getItem("dryniel_theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
}


themeBtn.addEventListener("click", () => {

  document.body.classList.toggle("dark-theme");

  const dark =
    document.body.classList.contains("dark-theme");

  localStorage.setItem(
    "dryniel_theme",
    dark ? "dark" : "light"
  );

});


/* =========================
   ORÇAMENTOS
========================= */

function addService(service = null) {

  const fragment =
    serviceTemplate.content.cloneNode(true);

  const item =
    fragment.querySelector(".service-item");

  const description =
    item.querySelector(".service-description");

  const quantity =
    item.querySelector(".service-quantity");

  const price =
    item.querySelector(".service-price");

  const removeBtn =
    item.querySelector(".remove-service-btn");


  if (service) {

    description.value =
      service.description || "";

    quantity.value =
      service.quantity ?? 1;

    price.value =
      service.price ?? 0;

  }


  description.addEventListener(
    "input",
    updateBudgetSummary
  );

  quantity.addEventListener(
    "input",
    updateBudgetSummary
  );

  price.addEventListener(
    "input",
    updateBudgetSummary
  );


  removeBtn.addEventListener("click", () => {

    item.remove();

    updateServiceTitles();
    updateBudgetSummary();

  });


  serviceList.appendChild(fragment);

  updateServiceTitles();
  updateBudgetSummary();
}


function updateServiceTitles() {

  const items =
    serviceList.querySelectorAll(".service-item");

  items.forEach((item, index) => {

    const title =
      item.querySelector(".service-title");

    title.textContent =
      `Serviço ${index + 1}`;

  });

}


function updateBudgetSummary() {

  const items =
    serviceList.querySelectorAll(".service-item");

  let total = 0;


  items.forEach(item => {

    const quantity =
      Number(
        item.querySelector(".service-quantity").value
      ) || 0;

    const price =
      Number(
        item.querySelector(".service-price").value
      ) || 0;

    const subtotal =
      quantity * price;

    total += subtotal;


    const subtotalElement =
      item.querySelector(
        ".service-subtotal strong"
      );

    subtotalElement.textContent =
      formatCurrency(subtotal);

  });


  serviceCount.textContent =
    items.length;

  budgetTotal.textContent =
    formatCurrency(total);
}


function getServicesFromForm() {

  const items =
    serviceList.querySelectorAll(".service-item");

  return Array.from(items).map(item => {

    return {

      description:
        item.querySelector(
          ".service-description"
        ).value.trim(),

      quantity:
        Number(
          item.querySelector(
            ".service-quantity"
          ).value
        ) || 0,

      price:
        Number(
          item.querySelector(
            ".service-price"
          ).value
        ) || 0

    };

  });

}


function calculateBudgetTotal(services) {

  return services.reduce(
    (total, service) => {

      return total +
        (
          (Number(service.quantity) || 0) *
          (Number(service.price) || 0)
        );

    },
    0
  );

}


function resetBudgetForm() {

  editingBudgetId = null;

  budgetForm.reset();

  serviceList.innerHTML = "";

  budgetDetails.innerHTML = "";

  addService();

  updateBudgetSummary();

  const saveButton =
    document.getElementById("saveBudgetBtn");

  saveButton.textContent =
    "Salvar orçamento";
}


newBudgetBtn.addEventListener("click", () => {

  resetBudgetForm();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});


addServiceBtn.addEventListener("click", () => {

  addService();

});


budgetForm.addEventListener("submit", event => {

  event.preventDefault();


  const services =
    getServicesFromForm();


  if (!clientName.value.trim()) {

    alert("Digite o nome do cliente.");

    clientName.focus();

    return;
  }


  if (services.length === 0) {

    alert(
      "Adicione pelo menos um serviço ao orçamento."
    );

    return;
  }


  const invalidService =
    services.some(service =>
      !service.description
    );


  if (invalidService) {

    alert(
      "Preencha a descrição de todos os serviços."
    );

    return;
  }


  const budget = {

    id:
      editingBudgetId ||
      generateId(),

    client:
      clientName.value.trim(),

    address:
      clientAddress.value.trim(),

    notes:
      budgetNotes.value.trim(),

    services,

    total:
      calculateBudgetTotal(services),

    date:
      new Date().toISOString()

  };


  if (editingBudgetId) {

    const index =
      budgets.findIndex(
        item =>
          item.id === editingBudgetId
      );

    if (index !== -1) {

      budget.date =
        budgets[index].date ||
        budget.date;

      budgets[index] = budget;

    }

  } else {

    budgets.unshift(budget);

  }


  saveBudgets();
  renderBudgets();
  resetBudgetForm();

  alert("Orçamento salvo com sucesso.");

});


function renderBudgets() {

  budgetList.innerHTML = "";


  if (budgets.length === 0) {

    budgetList.innerHTML =
      `<p class="empty-message">
        Nenhum orçamento salvo.
      </p>`;

    return;
  }


  budgets.forEach(budget => {

    const item =
      document.createElement("div");

    item.className = "list-item";


    item.innerHTML = `

      <div class="list-item-header">

        <div>

          <div class="list-item-title">
            ${escapeHTML(budget.client)}
          </div>

          <div class="list-item-subtitle">
            ${
              budget.address
                ? escapeHTML(budget.address)
                : "Endereço não informado"
            }
          </div>

        </div>

        <div class="list-item-value">
          ${formatCurrency(budget.total)}
        </div>

      </div>


      <div class="list-actions">

        <button
          class="secondary-btn view-budget"
          type="button"
        >
          Ver
        </button>

        <button
          class="secondary-btn edit-budget"
          type="button"
        >
          Editar
        </button>

        <button
          class="danger-btn delete-budget"
          type="button"
        >
          Excluir
        </button>

      </div>

    `;


    item
      .querySelector(".view-budget")
      .addEventListener(
        "click",
        () => showBudgetDetails(budget.id)
      );


    item
      .querySelector(".edit-budget")
      .addEventListener(
        "click",
        () => editBudget(budget.id)
      );


    item
      .querySelector(".delete-budget")
      .addEventListener(
        "click",
        () => deleteBudget(budget.id)
      );


    budgetList.appendChild(item);

  });

}


function showBudgetDetails(id) {

  const budget =
    budgets.find(item => item.id === id);

  if (!budget) return;


  const servicesHTML =
    budget.services.map(
      (service, index) => {

        const subtotal =
          (Number(service.quantity) || 0) *
          (Number(service.price) || 0);

        return `

          <div class="details-service">

            <strong>
              Serviço ${index + 1}
            </strong>

            <p>
              ${escapeHTML(service.description)}
            </p>

            <p>
              ${service.quantity}
              ×
              ${formatCurrency(service.price)}
              =
              <strong>
                ${formatCurrency(subtotal)}
              </strong>
            </p>

          </div>

        `;

      }
    ).join("");


  budgetDetails.innerHTML = `

    <div class="details-card">

      <h3>
        Orçamento - ${escapeHTML(budget.client)}
      </h3>

      <p>
        <strong>Cliente:</strong>
        ${escapeHTML(budget.client)}
      </p>

      <p>
        <strong>Endereço:</strong>
        ${
          budget.address
            ? escapeHTML(budget.address)
            : "Não informado"
        }
      </p>

      ${servicesHTML}

      ${
        budget.notes
          ? `
            <p>
              <strong>Observações:</strong><br>
              ${escapeHTML(budget.notes)}
            </p>
          `
          : ""
      }

      <div class="details-total">

        <span>Total</span>

        <span>
          ${formatCurrency(budget.total)}
        </span>

      </div>

    </div>

  `;


  budgetDetails.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}


function editBudget(id) {

  const budget =
    budgets.find(item => item.id === id);

  if (!budget) return;


  editingBudgetId = id;

  clientName.value =
    budget.client || "";

  clientAddress.value =
    budget.address || "";

  budgetNotes.value =
    budget.notes || "";


  serviceList.innerHTML = "";


  budget.services.forEach(service => {

    addService(service);

  });


  document.getElementById(
    "saveBudgetBtn"
  ).textContent =
    "Atualizar orçamento";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


function deleteBudget(id) {

  const confirmed =
    confirm(
      "Deseja realmente excluir este orçamento?"
    );

  if (!confirmed) return;


  budgets =
    budgets.filter(
      item => item.id !== id
    );


  saveBudgets();
  renderBudgets();

  budgetDetails.innerHTML = "";

}


/* =========================
   OBRAS
========================= */

workForm.addEventListener("submit", event => {

  event.preventDefault();


  const work = {

    id: generateId(),

    name:
      workName.value.trim(),

    client:
      workClient.value.trim(),

    address:
      workAddress.value.trim(),

    status:
      workStatus.value,

    date:
      new Date().toISOString()

  };


  works.unshift(work);

  saveWorks();

  workForm.reset();

  renderWorks();

});


function renderWorks() {

  workList.innerHTML = "";


  if (works.length === 0) {

    workList.innerHTML =
      `<p class="empty-message">
        Nenhuma obra cadastrada.
      </p>`;

    return;
  }


  works.forEach(work => {

    const item =
      document.createElement("div");

    item.className = "list-item";


    item.innerHTML = `

      <div class="list-item-title">
        ${escapeHTML(work.name)}
      </div>

      <div class="list-item-subtitle">

        ${
          work.client
            ? "Cliente: " +
              escapeHTML(work.client)
            : "Cliente não informado"
        }

      </div>

      ${
        work.address
          ? `
            <div class="list-item-subtitle">
              ${escapeHTML(work.address)}
            </div>
          `
          : ""
      }

      <span class="status-badge">
        ${escapeHTML(work.status)}
      </span>


      <div class="list-actions">

        <button
          class="danger-btn delete-work"
          type="button"
        >
          Excluir
        </button>

      </div>

    `;


    item
      .querySelector(".delete-work")
      .addEventListener(
        "click",
        () => deleteWork(work.id)
      );


    workList.appendChild(item);

  });

}


function deleteWork(id) {

  const confirmed =
    confirm(
      "Deseja excluir esta obra?"
    );

  if (!confirmed) return;


  works =
    works.filter(
      work => work.id !== id
    );


  saveWorks();
  renderWorks();

}


/* =========================
   FUNCIONÁRIOS
========================= */

employeeForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const employee = {

      id: generateId(),

      name:
        employeeName.value.trim(),

      dailyRate:
        Number(employeeDailyRate.value) || 0,

      dailies: [],

      payments: []

    };


    employees.push(employee);

    saveEmployees();

    employeeForm.reset();

    renderEmployees();

  }
);


function renderEmployees() {

  employeeList.innerHTML = "";


  if (employees.length === 0) {

    employeeList.innerHTML =
      `<p class="empty-message">
        Nenhum funcionário cadastrado.
      </p>`;

    return;
  }


  employees.forEach(employee => {

    const totalDays =
      employee.dailies.reduce(
        (total, daily) =>
          total +
          (Number(daily.quantity) || 0),
        0
      );


    const totalValue =
      totalDays *
      (Number(employee.dailyRate) || 0);


    const paid =
      employee.payments.reduce(
        (total, payment) =>
          total +
          (Number(payment.value) || 0),
        0
      );


    const balance =
      totalValue - paid;


    const item =
      document.createElement("div");

    item.className = "list-item";


    item.innerHTML = `

      <div class="list-item-header">

        <div>

          <div class="list-item-title">
            ${escapeHTML(employee.name)}
          </div>

          <div class="list-item-subtitle">
            Diária:
            ${formatCurrency(employee.dailyRate)}
          </div>

          <div class="list-item-subtitle">
            ${totalDays} diária(s)
          </div>

        </div>

        <div class="list-item-value">
          ${formatCurrency(balance)}
        </div>

      </div>


      <div class="list-actions">

        <button
          class="primary-btn open-employee"
          type="button"
        >
          Abrir
        </button>

        <button
          class="danger-btn delete-employee"
          type="button"
        >
          Excluir
        </button>

      </div>

    `;


    item
      .querySelector(".open-employee")
      .addEventListener(
        "click",
        () => openEmployee(employee.id)
      );


    item
      .querySelector(".delete-employee")
      .addEventListener(
        "click",
        () => deleteEmployee(employee.id)
      );


    employeeList.appendChild(item);

  });

}


function openEmployee(id) {

  selectedEmployeeId = id;

  renderEmployeeDetails();

  showScreen("employeeDetailsScreen");

}


function getSelectedEmployee() {

  return employees.find(
    employee =>
      employee.id === selectedEmployeeId
  );

}


function deleteEmployee(id) {

  const employee =
    employees.find(
      item => item.id === id
    );


  if (!employee) return;


  const confirmed =
    confirm(
      `Deseja excluir o funcionário ${employee.name} e todo o histórico dele?`
    );

  if (!confirmed) return;


  employees =
    employees.filter(
      item => item.id !== id
    );


  saveEmployees();
  renderEmployees();

}


/* =========================
   DIÁRIAS
========================= */

dailyForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const employee =
      getSelectedEmployee();

    if (!employee) return;


    employee.dailies.push({

      id: generateId(),

      date:
        dailyDate.value,

      quantity:
        Number(dailyQuantity.value) || 1,

      note:
        dailyNote.value.trim()

    });


    saveEmployees();

    dailyForm.reset();

    dailyQuantity.value = 1;

    setDefaultDates();

    renderEmployeeDetails();

  }
);


/* =========================
   PAGAMENTOS
========================= */

paymentForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();


    const employee =
      getSelectedEmployee();

    if (!employee) return;


    employee.payments.push({

      id: generateId(),

      date:
        paymentDate.value,

      value:
        Number(paymentValue.value) || 0

    });


    saveEmployees();

    paymentForm.reset();

    setDefaultDates();

    renderEmployeeDetails();

  }
);


/* =========================
   DETALHES DO FUNCIONÁRIO
========================= */

function renderEmployeeDetails() {

  const employee =
    getSelectedEmployee();

  if (!employee) return;


  employee.dailies =
    employee.dailies || [];

  employee.payments =
    employee.payments || [];


  const totalDays =
    employee.dailies.reduce(
      (total, daily) =>
        total +
        (Number(daily.quantity) || 0),
      0
    );


  const totalValue =
    totalDays *
    (Number(employee.dailyRate) || 0);


  const paid =
    employee.payments.reduce(
      (total, payment) =>
        total +
        (Number(payment.value) || 0),
      0
    );


  const balance =
    totalValue - paid;


  employeeDetailsName.textContent =
    employee.name;


  employeeTotalDays.textContent =
    totalDays;


  employeeTotalValue.textContent =
    formatCurrency(totalValue);


  employeePaidValue.textContent =
    formatCurrency(paid);


  employeeBalanceValue.textContent =
    formatCurrency(balance);


  renderEmployeeHistory(employee);

}


/* =========================
   HISTÓRICO FUNCIONÁRIO
========================= */

function renderEmployeeHistory(employee) {

  employeeHistory.innerHTML = "";


  const events = [];


  employee.dailies.forEach(daily => {

    events.push({

      type: "daily",

      id: daily.id,

      date: daily.date,

      quantity:
        Number(daily.quantity) || 0,

      note:
        daily.note || ""

    });

  });


  employee.payments.forEach(payment => {

    events.push({

      type: "payment",

      id: payment.id,

      date: payment.date,

      value:
        Number(payment.value) || 0

    });

  });


  events.sort(
    (a, b) =>
      String(b.date).localeCompare(
        String(a.date)
      )
  );


  if (events.length === 0) {

    employeeHistory.innerHTML =
      `<p class="empty-message">
        Nenhuma diária ou pagamento registrado.
      </p>`;

    return;
  }


  events.forEach(event => {

    const item =
      document.createElement("div");


    if (event.type === "daily") {

      const value =
        event.quantity *
        (Number(employee.dailyRate) || 0);


      item.className =
        "history-item";


      item.innerHTML = `

        <strong>
          ${event.quantity} diária(s)
          — ${formatCurrency(value)}
        </strong>

        <small>
          ${formatDate(event.date)}
        </small>

        ${
          event.note
            ? `
              <small>
                ${escapeHTML(event.note)}
              </small>
            `
            : ""
        }

        <div class="list-actions">

          <button
            class="danger-btn delete-history"
            type="button"
          >
            Excluir
          </button>

        </div>

      `;


      item
        .querySelector(".delete-history")
        .addEventListener(
          "click",
          () => deleteDaily(event.id)
        );

    } else {

      item.className =
        "history-item payment";


      item.innerHTML = `

        <strong>
          Pagamento:
          ${formatCurrency(event.value)}
        </strong>

        <small>
          ${formatDate(event.date)}
        </small>

        <div class="list-actions">

          <button
            class="danger-btn delete-history"
            type="button"
          >
            Excluir
          </button>

        </div>

      `;


      item
        .querySelector(".delete-history")
        .addEventListener(
          "click",
          () => deletePayment(event.id)
        );

    }


    employeeHistory.appendChild(item);

  });

}


function deleteDaily(id) {

  const employee =
    getSelectedEmployee();

  if (!employee) return;


  const confirmed =
    confirm(
      "Deseja excluir esta diária?"
    );

  if (!confirmed) return;


  employee.dailies =
    employee.dailies.filter(
      daily => daily.id !== id
    );


  saveEmployees();
  renderEmployeeDetails();
  renderEmployees();

}


function deletePayment(id) {

  const employee =
    getSelectedEmployee();

  if (!employee) return;


  const confirmed =
    confirm(
      "Deseja excluir este pagamento?"
    );

  if (!confirmed) return;


  employee.payments =
    employee.payments.filter(
      payment => payment.id !== id
    );


  saveEmployees();
  renderEmployeeDetails();
  renderEmployees();

}


/* =========================
   DATAS PADRÃO
========================= */

function getToday() {

  const today = new Date();

  const year =
    today.getFullYear();

  const month =
    String(
      today.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      today.getDate()
    ).padStart(2, "0");


  return `${year}-${month}-${day}`;
}


function setDefaultDates() {

  const today =
    getToday();


  if (!dailyDate.value) {
    dailyDate.value = today;
  }


  if (!paymentDate.value) {
    paymentDate.value = today;
  }

}


/* =========================
   INICIALIZAÇÃO
========================= */

function initializeApp() {

  showScreen("homeScreen");

  renderBudgets();

  renderWorks();

  renderEmployees();

  serviceList.innerHTML = "";

  addService();

  setDefaultDates();

}


initializeApp();
