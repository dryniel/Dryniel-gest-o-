
const screens=document.querySelectorAll('.screen');
const navButtons=document.querySelectorAll('.nav-btn');
const menuButtons=document.querySelectorAll('.menu-card');
const backButtons=document.querySelectorAll('.back-btn');
const backToBudgets=document.querySelectorAll('.back-to-budgets');

const budgetForm=document.getElementById('budgetForm');
const budgetList=document.getElementById('budgetList');
const budgetDetails=document.getElementById('budgetDetails');
const themeBtn=document.getElementById('themeBtn');
const addServiceBtn=document.getElementById('addServiceBtn');
const serviceList=document.getElementById('serviceList');
const serviceTemplate=document.getElementById('serviceTemplate');
const budgetTotal=document.getElementById('budgetTotal');
const serviceCount=document.getElementById('serviceCount');
const saveBudgetBtn=document.getElementById('saveBudgetBtn');

let budgets=JSON.parse(localStorage.getItem('dryniel_budgets'))||[];
let editingBudgetId=null;

function formatCurrency(value){
  return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(value)||0);
}

function formatDateBR(iso){
  if(!iso)return 'Data não informada';
  const [y,m,d]=iso.split('-');
  return `${d}/${m}/${y}`;
}

function escapeHtml(value=''){
  return String(value).replace(/[&<>"']/g,char=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'
  }[char]));
}

function showScreen(id){
  screens.forEach(s=>s.classList.remove('active'));
  const target=document.getElementById(id);
  if(target)target.classList.add('active');
  navButtons.forEach(b=>b.classList.toggle('active',b.dataset.screen===id));
  window.scrollTo({top:0,behavior:'smooth'});
}

function saveBudgets(){
  localStorage.setItem('dryniel_budgets',JSON.stringify(budgets));
}

function updateServiceNumbers(){
  [...serviceList.querySelectorAll('.service-item')].forEach((item,index)=>{
    item.querySelector('.service-number').textContent=index+1;
  });
  serviceCount.textContent=serviceList.querySelectorAll('.service-item').length;
}

function recalcAll(){
  let total=0;
  serviceList.querySelectorAll('.service-item').forEach(item=>{
    const qty=Number(item.querySelector('.item-quantity').value)||0;
    const unitPrice=Number(item.querySelector('.item-unit-price').value)||0;
    const lineTotal=qty*unitPrice;
    item.querySelector('.item-total').textContent=formatCurrency(lineTotal);
    total+=lineTotal;
  });
  budgetTotal.textContent=formatCurrency(total);
  updateServiceNumbers();
}

function addService(prefill={}){
  const fragment=serviceTemplate.content.cloneNode(true);
  const item=fragment.querySelector('.service-item');

  item.querySelector('.item-description').value=prefill.description||'';
  item.querySelector('.item-quantity').value=prefill.quantity ?? 1;
  item.querySelector('.item-unit').value=prefill.unit||'un.';
  item.querySelector('.item-unit-price').value=prefill.unitPrice ?? 0;
  item.querySelector('.item-notes').value=prefill.notes||'';

  item.querySelectorAll('input,select,textarea').forEach(el=>{
    el.addEventListener('input',recalcAll);
    el.addEventListener('change',recalcAll);
  });

  item.querySelector('.remove-service-btn').addEventListener('click',()=>{
    item.remove();
    if(serviceList.children.length===0)addService();
    recalcAll();
  });

  serviceList.appendChild(fragment);
  recalcAll();
}

function collectServices(){
  return [...serviceList.querySelectorAll('.service-item')].map(item=>{
    const quantity=Number(item.querySelector('.item-quantity').value)||0;
    const unitPrice=Number(item.querySelector('.item-unit-price').value)||0;
    return {
      description:item.querySelector('.item-description').value.trim(),
      quantity,
      unit:item.querySelector('.item-unit').value,
      unitPrice,
      total:quantity*unitPrice,
      notes:item.querySelector('.item-notes').value.trim()
    };
  });
}

function resetBudgetForm(){
  editingBudgetId=null;
  budgetForm.reset();
  saveBudgetBtn.textContent='Salvar orçamento';
  document.getElementById('validade').value='A definir';
  document.getElementById('dataOrcamento').valueAsDate=new Date();
  serviceList.innerHTML='';
  addService();
}

function renderBudgets(){
  budgetList.innerHTML='';
  if(!budgets.length){
    budgetList.innerHTML='<div class="empty-card">Nenhum orçamento salvo ainda.</div>';
    return;
  }

  budgets.slice().reverse().forEach(item=>{
    const card=document.createElement('article');
    card.className='budget-item';
    const serviceNames=item.services.map(s=>s.description).filter(Boolean).slice(0,2).join(' • ');
    const extra=item.services.length>2?` + ${item.services.length-2} serviço(s)`:'';
    card.innerHTML=`
      <h3>${escapeHtml(item.cliente)}</h3>
      <p>${escapeHtml(serviceNames || 'Sem descrição')}${escapeHtml(extra)}</p>
      <p>${escapeHtml(item.endereco || 'Endereço não informado')}</p>
      <span class="meta">${formatDateBR(item.data)} • ${item.services.length} serviço(s)</span>
      <span class="value">${formatCurrency(item.total)}</span>
      <div class="budget-actions">
        <button class="action-btn primary-action" data-action="open" data-id="${item.id}">Abrir</button>
        <button class="action-btn" data-action="edit" data-id="${item.id}">Editar</button>
        <button class="action-btn" data-action="pdf" data-id="${item.id}">PDF</button>
        <button class="action-btn danger-action" data-action="delete" data-id="${item.id}">Excluir</button>
      </div>
    `;
    budgetList.appendChild(card);
  });
}

function renderBudgetDetails(id){
  const item=budgets.find(b=>b.id===id);
  if(!item)return;

  budgetDetails.innerHTML=`
    <article class="details-card">
      <div class="details-header">
        <h3>${escapeHtml(item.cliente)}</h3>
        <p>${escapeHtml(item.endereco || 'Endereço não informado')}</p>
        <p>${formatDateBR(item.data)} • Validade: ${escapeHtml(item.validade || 'A definir')}</p>
      </div>
      <div class="details-body">
        ${item.services.map((s,i)=>`
          <div class="details-service">
            <h4>${String(i+1).padStart(2,'0')} • ${escapeHtml(s.description)}</h4>
            <p>${s.quantity} ${escapeHtml(s.unit)} × ${formatCurrency(s.unitPrice)}</p>
            ${s.notes?`<p>${escapeHtml(s.notes)}</p>`:''}
            <strong>${formatCurrency(s.total)}</strong>
          </div>
        `).join('')}
        ${item.observacoes?`<div class="details-service"><h4>Observações</h4><p>${escapeHtml(item.observacoes)}</p></div>`:''}
        <div class="details-total"><span>Total geral</span><strong>${formatCurrency(item.total)}</strong></div>
        <div class="details-actions">
          <button class="action-btn" onclick="editBudget(${item.id})">Editar</button>
          <button class="action-btn primary-action" onclick="generateBudgetPDF(${item.id})">Gerar PDF</button>
          <button class="action-btn danger-action" onclick="deleteBudget(${item.id})">Excluir</button>
        </div>
      </div>
    </article>
  `;
  showScreen('orcamento-detalhes');
}

function editBudget(id){
  const item=budgets.find(b=>b.id===id);
  if(!item)return;

  editingBudgetId=id;
  document.getElementById('cliente').value=item.cliente||'';
  document.getElementById('telefone').value=item.telefone||'';
  document.getElementById('endereco').value=item.endereco||'';
  document.getElementById('validade').value=item.validade||'A definir';
  document.getElementById('dataOrcamento').value=item.data||'';
  document.getElementById('observacoes').value=item.observacoes||'';
  serviceList.innerHTML='';
  item.services.forEach(s=>addService(s));
  saveBudgetBtn.textContent='Salvar alterações';
  showScreen('novo-orcamento');
}

function deleteBudget(id){
  const item=budgets.find(b=>b.id===id);
  if(!item)return;
  if(!confirm(`Excluir o orçamento de ${item.cliente}?`))return;
  budgets=budgets.filter(b=>b.id!==id);
  saveBudgets();
  renderBudgets();
  updateDashboard();
  showScreen('meus-orcamentos');
}

function generateBudgetPDF(id){
  const item=budgets.find(b=>b.id===id);
  if(!item)return;

  const servicesHtml=item.services.map((s,i)=>`
    <section class="service">
      <div class="service-title">${String(i+1).padStart(2,'0')} • ${escapeHtml(s.description).toUpperCase()}</div>
      <div class="service-body">
        <div>
          ${s.notes?`<p>${escapeHtml(s.notes)}</p>`:'<p>Serviço conforme descrição apresentada.</p>'}
        </div>
        <div class="service-price">
          <div>${s.quantity} ${escapeHtml(s.unit)} × ${formatCurrency(s.unitPrice)}</div>
          <strong>TOTAL: ${formatCurrency(s.total)}</strong>
        </div>
      </div>
    </section>
  `).join('');

  const printWindow=window.open('','_blank');
  if(!printWindow){
    alert('O navegador bloqueou a janela de impressão. Permita pop-ups para gerar o PDF.');
    return;
  }

  printWindow.document.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Orçamento Dryniel - ${escapeHtml(item.cliente)}</title>
<style>
@page{size:A4;margin:14mm}
*{box-sizing:border-box}
body{font-family:Arial,Helvetica,sans-serif;margin:0;color:#202020;background:#fff}
.page{max-width:794px;margin:auto;position:relative}
.watermark{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;z-index:-1;font-size:88px;font-weight:900;letter-spacing:8px;color:rgba(31,49,95,.035);transform:rotate(-24deg)}
.header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #233a78;padding-bottom:13px;margin-bottom:18px}
.title{font-size:29px;font-weight:900;color:#233a78}.company{font-size:11px;font-weight:800;letter-spacing:1px;margin-top:5px}
.logo-text{text-align:right;font-weight:900;font-size:24px;color:#233a78}.logo-sub{font-size:9px;letter-spacing:1px;color:#c79a45}
.info{display:grid;grid-template-columns:3fr 1fr;border:1px solid #d9d9d6;background:#f5f5f4;margin-bottom:16px}
.info>div{padding:10px 12px;border-bottom:1px solid #d9d9d6}.info>div:nth-child(odd){border-right:1px solid #d9d9d6}
.label{font-size:9px;font-weight:800}.value{font-size:10px;margin-top:4px}
.service{margin:0 0 10px}.service-title{background:#233a78;color:#fff;padding:8px 12px;font-size:12px;font-weight:900}
.service-body{display:grid;grid-template-columns:1fr 180px;border:1px solid #ddd;border-top:0;min-height:52px;padding:10px 12px;gap:15px;font-size:10px}
.service-body p{margin:0;line-height:1.4}.service-price{text-align:left;color:#666}.service-price strong{display:block;color:#333;margin-top:6px}
.subtotal{display:flex;justify-content:space-between;border:1px solid #233a78;padding:8px 12px;font-size:10px}
.total{display:flex;justify-content:space-between;background:#233a78;color:#fff;padding:13px 12px;font-size:17px;font-weight:900}
.notes{background:#f2f2f1;padding:12px;margin-top:10px;font-size:10px;line-height:1.4}.notes strong{display:block;margin-bottom:6px}
.footer{margin-top:22px;border-top:1px solid #ddd;padding-top:12px;display:flex;justify-content:space-between;font-size:9px}.footer strong{color:#233a78}
.print-hint{margin:15px 0;text-align:center}
.print-btn{border:0;background:#233a78;color:#fff;padding:12px 18px;border-radius:8px;font-weight:800}
@media print{.print-hint{display:none}.page{max-width:none}}
</style>
</head>
<body>
<div class="watermark">DRYNIEL</div>
<div class="print-hint"><button class="print-btn" onclick="window.print()">Salvar / Imprimir PDF</button></div>
<div class="page">
  <header class="header">
    <div><div class="title">ORÇAMENTO</div><div class="company">DRYNIEL CONSTRUÇÃO A SECO</div></div>
    <div><div class="logo-text">DRYNIEL</div><div class="logo-sub">CONSTRUÇÃO A SECO</div></div>
  </header>
  <div class="info">
    <div><div class="label">CLIENTE</div><div class="value">${escapeHtml(item.cliente)}</div></div>
    <div><div class="label">DATA</div><div class="value">${formatDateBR(item.data)}</div></div>
    <div><div class="label">ENDEREÇO DA OBRA</div><div class="value">${escapeHtml(item.endereco||'')}</div></div>
    <div><div class="label">VALIDADE</div><div class="value">${escapeHtml(item.validade||'A definir')}</div></div>
  </div>
  ${servicesHtml}
  <div class="subtotal"><span>SUBTOTAL</span><strong>${formatCurrency(item.total)}</strong></div>
  <div class="total"><span>TOTAL GERAL</span><span>${formatCurrency(item.total)}</span></div>
  ${item.observacoes?`<div class="notes"><strong>OBSERVAÇÕES</strong>${escapeHtml(item.observacoes)}</div>`:''}
  <footer class="footer"><strong>DRYNIEL CONSTRUÇÃO A SECO</strong><span>(11) 95832-5981 • Instagram: @dryniel.br</span></footer>
</div>
<script>setTimeout(()=>window.print(),400)<\/script>
</body>
</html>`);
  printWindow.document.close();
}

function updateDashboard(){
  const total=budgets.reduce((sum,item)=>sum+(Number(item.total)||0),0);
  document.getElementById('faturamento').textContent=formatCurrency(total);
  document.getElementById('orcamentos').textContent=budgets.length;
}

menuButtons.forEach(btn=>btn.addEventListener('click',()=>{
  if(btn.dataset.screen==='novo-orcamento')resetBudgetForm();
  showScreen(btn.dataset.screen);
}));
navButtons.forEach(btn=>btn.addEventListener('click',()=>showScreen(btn.dataset.screen)));
backButtons.forEach(btn=>btn.addEventListener('click',()=>showScreen('home')));
backToBudgets.forEach(btn=>btn.addEventListener('click',()=>showScreen('meus-orcamentos')));

budgetList.addEventListener('click',e=>{
  const button=e.target.closest('[data-action]');
  if(!button)return;
  const id=Number(button.dataset.id);
  const action=button.dataset.action;
  if(action==='open')renderBudgetDetails(id);
  if(action==='edit')editBudget(id);
  if(action==='pdf')generateBudgetPDF(id);
  if(action==='delete')deleteBudget(id);
});

addServiceBtn.addEventListener('click',()=>addService());

budgetForm.addEventListener('submit',e=>{
  e.preventDefault();

  const services=collectServices();
  const validServices=services.filter(s=>s.description && s.quantity>0);

  if(validServices.length===0){
    alert('Adicione pelo menos um serviço válido.');
    return;
  }

  const total=validServices.reduce((sum,s)=>sum+s.total,0);
  const existing=budgets.find(b=>b.id===editingBudgetId);

  const budget={
    id:editingBudgetId || Date.now(),
    cliente:document.getElementById('cliente').value.trim(),
    telefone:document.getElementById('telefone').value.trim(),
    endereco:document.getElementById('endereco').value.trim(),
    validade:document.getElementById('validade').value.trim()||'A definir',
    data:document.getElementById('dataOrcamento').value,
    services:validServices,
    observacoes:document.getElementById('observacoes').value.trim(),
    total,
    criadoEm:existing?.criadoEm || new Date().toISOString(),
    atualizadoEm:new Date().toISOString()
  };

  if(editingBudgetId){
    budgets=budgets.map(b=>b.id===editingBudgetId?budget:b);
  }else{
    budgets.push(budget);
  }

  saveBudgets();
  renderBudgets();
  updateDashboard();
  const wasEditing=Boolean(editingBudgetId);
  resetBudgetForm();
  alert(wasEditing?'Orçamento atualizado com sucesso.':'Orçamento salvo com sucesso.');
  showScreen('meus-orcamentos');
});

themeBtn.addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  const dark=document.body.classList.contains('dark');
  themeBtn.textContent=dark?'☀':'☾';
  localStorage.setItem('dryniel_theme',dark?'dark':'light');
});

if(localStorage.getItem('dryniel_theme')==='dark'){
  document.body.classList.add('dark');
  themeBtn.textContent='☀';
}

document.getElementById('dataOrcamento').valueAsDate=new Date();
addService();
renderBudgets();
updateDashboard();

window.editBudget=editBudget;
window.deleteBudget=deleteBudget;
window.generateBudgetPDF=generateBudgetPDF;
