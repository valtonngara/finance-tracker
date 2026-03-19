/* ============================================
   VAULT — Financial Tracker App Logic
   ============================================ */

// ---- DATA ----
const CATEGORIES = {
  Housing: { emoji: '🏠', color: '#4A90D9' },
  Food: { emoji: '🍕', color: '#E8913A' },
  Transport: { emoji: '🚗', color: '#9B59B6' },
  Shopping: { emoji: '🛍️', color: '#E84393' },
  Entertainment: { emoji: '🎬', color: '#00B894' },
  Healthcare: { emoji: '💊', color: '#D94444' },
  Salary: { emoji: '💰', color: '#0A7558' },
  Freelance: { emoji: '💻', color: '#2ECC71' },
  Utilities: { emoji: '⚡', color: '#F39C12' },
  Other: { emoji: '📦', color: '#95A5A6' }
};

let transactions = [
  { id: 1, name: 'Monthly Salary', category: 'Salary', type: 'income', amount: 8500, date: '2026-03-01' },
  { id: 2, name: 'Freelance Project', category: 'Freelance', type: 'income', amount: 3980, date: '2026-03-05' },
  { id: 3, name: 'Rent Payment', category: 'Housing', type: 'expense', amount: 2200, date: '2026-03-01' },
  { id: 4, name: 'Grocery Shopping', category: 'Food', type: 'expense', amount: 340, date: '2026-03-03' },
  { id: 5, name: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 145, date: '2026-03-04' },
  { id: 6, name: 'Gas Station', category: 'Transport', type: 'expense', amount: 65, date: '2026-03-06' },
  { id: 7, name: 'Netflix & Spotify', category: 'Entertainment', type: 'expense', amount: 28, date: '2026-03-07' },
  { id: 8, name: 'New Headphones', category: 'Shopping', type: 'expense', amount: 189, date: '2026-03-08' },
  { id: 9, name: 'Doctor Visit', category: 'Healthcare', type: 'expense', amount: 120, date: '2026-03-09' },
  { id: 10, name: 'Restaurant Dinner', category: 'Food', type: 'expense', amount: 85, date: '2026-03-10' },
  { id: 11, name: 'Online Course', category: 'Other', type: 'expense', amount: 49, date: '2026-03-11' },
  { id: 12, name: 'Uber Rides', category: 'Transport', type: 'expense', amount: 42, date: '2026-03-12' },
  { id: 13, name: 'Clothing Store', category: 'Shopping', type: 'expense', amount: 275, date: '2026-03-13' },
  { id: 14, name: 'Water Bill', category: 'Utilities', type: 'expense', amount: 38, date: '2026-03-02' },
  { id: 15, name: 'Movie Tickets', category: 'Entertainment', type: 'expense', amount: 32, date: '2026-03-14' },
];

let budgets = [
  { id: 1, category: 'Housing', limit: 2500, spent: 2200 },
  { id: 2, category: 'Food', limit: 600, spent: 425 },
  { id: 3, category: 'Transport', limit: 200, spent: 107 },
  { id: 4, category: 'Shopping', limit: 400, spent: 464 },
  { id: 5, category: 'Entertainment', limit: 150, spent: 60 },
  { id: 6, category: 'Utilities', limit: 250, spent: 183 },
];

let goals = [
  { id: 1, name: 'Emergency Fund', target: 15000, saved: 11200, deadline: '2026-06-30', emoji: '🛡️' },
  { id: 2, name: 'Vacation to Japan', target: 5000, saved: 2750, deadline: '2026-09-15', emoji: '✈️' },
  { id: 3, name: 'New Car Down Payment', target: 8000, saved: 3200, deadline: '2026-12-31', emoji: '🚘' },
  { id: 4, name: 'Home Office Setup', target: 2000, saved: 1850, deadline: '2026-04-30', emoji: '🖥️' },
];

const monthlyData = [
  { month: 'Oct', income: 10200, expenses: 7800 },
  { month: 'Nov', income: 11000, expenses: 8200 },
  { month: 'Dec', income: 13500, expenses: 9100 },
  { month: 'Jan', income: 10800, expenses: 7400 },
  { month: 'Feb', income: 11100, expenses: 7600 },
  { month: 'Mar', income: 12480, expenses: 8240 },
];

let nextId = 20;

// ---- AUTH ----
function showAuthForm(form) {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  const el = document.getElementById(form === 'login' ? 'login-form' : form === 'register' ? 'register-form' : form === 'forgot' ? 'forgot-form' : 'auth-success');
  if (el) el.classList.add('active');
}

function handleLogin(e) {
  e.preventDefault();
  const btn = e.target.closest('form').querySelector('.btn-primary');
  btn.textContent = 'Signing in...';
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    btn.textContent = 'Sign In';
    btn.disabled = false;
    initApp();
    showNotification('Welcome back, John!', 'success');
  }, 800);
}

function handleRegister(e) {
  e.preventDefault();
  const btn = e.target.closest('form').querySelector('.btn-primary');
  btn.textContent = 'Creating account...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Create Account';
    btn.disabled = false;
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    initApp();
    showNotification('Account created successfully!', 'success');
  }, 1000);
}

function handleForgot(e) {
  e.preventDefault();
  const btn = e.target.closest('form').querySelector('.btn-primary');
  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Send Reset Link';
    btn.disabled = false;
    showAuthForm('success');
  }, 1000);
}

function handleLogout() {
  document.getElementById('app-container').classList.add('hidden');
  document.getElementById('auth-container').classList.remove('hidden');
  showAuthForm('login');
}

function togglePassword(btn) {
  const input = btn.parentElement.querySelector('input');
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ---- NAVIGATION ----
function navigateTo(page, navEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  if (navEl) navEl.classList.add('active');
  if (page === 'analytics') setTimeout(drawAnalyticsCharts, 50);
  if (page === 'dashboard') setTimeout(drawDashboardCharts, 50);
  // close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  html.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  // redraw charts with new colors
  setTimeout(() => {
    drawDashboardCharts();
    drawGoalRings();
    const activePage = document.querySelector('.page.active');
    if (activePage && activePage.id === 'page-analytics') drawAnalyticsCharts();
  }, 50);
}

// ---- NOTIFICATIONS ----
function showNotification(message, type = 'success') {
  const container = document.getElementById('notifications');
  const icons = { success: '✓', warning: '⚠', error: '✕' };
  const notif = document.createElement('div');
  notif.className = `notification ${type}`;
  notif.innerHTML = `<strong>${icons[type]}</strong> ${message}`;
  container.appendChild(notif);
  setTimeout(() => notif.remove(), 4000);
}

// ---- INIT ----
function initApp() {
  renderRecentTransactions();
  renderTransactions();
  renderBudgets();
  renderGoals();
  renderTopCategories();
  setTimeout(drawDashboardCharts, 100);
  setTimeout(drawGoalRings, 100);

  // budget warnings
  budgets.forEach(b => {
    const pct = (b.spent / b.limit) * 100;
    if (pct > 100) {
      setTimeout(() => showNotification(`${CATEGORIES[b.category].emoji} ${b.category} budget exceeded!`, 'warning'), 1500);
    }
  });
}

// ---- RENDER TRANSACTIONS ----
function renderRecentTransactions() {
  const container = document.getElementById('recent-transactions');
  const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  container.innerHTML = recent.map(t => transactionHTML(t, true)).join('');
}

function renderTransactions() {
  const container = document.getElementById('transactions-list');
  const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  container.innerHTML = sorted.map(t => transactionHTML(t, false)).join('');
}

function transactionHTML(t, mini) {
  const cat = CATEGORIES[t.category] || CATEGORIES.Other;
  const sign = t.type === 'income' ? '+' : '-';
  const cls = t.type === 'income' ? 'income' : 'expense';
  const actions = mini ? '' : `
    <div class="txn-actions">
      <button class="txn-btn" onclick="editTransaction(${t.id})" title="Edit">✎</button>
      <button class="txn-btn delete" onclick="deleteTransaction(${t.id})" title="Delete">✕</button>
    </div>`;
  return `<div class="transaction-item" data-id="${t.id}">
    <div class="txn-icon ${cls}-icon">${cat.emoji}</div>
    <div class="txn-details">
      <div class="txn-name">${t.name}</div>
      <div class="txn-meta">${t.category} · ${formatDate(t.date)}</div>
    </div>
    <div class="txn-amount ${cls}">${sign}$${t.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</div>
    ${actions}
  </div>`;
}

function formatDate(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function filterTransactions() {
  const search = document.querySelector('.search-box input').value.toLowerCase();
  const selects = document.querySelectorAll('.filter-select');
  const catFilter = selects[0]?.value || '';
  const typeFilter = selects[1]?.value || '';

  let filtered = [...transactions];
  if (search) filtered = filtered.filter(t => t.name.toLowerCase().includes(search) || t.category.toLowerCase().includes(search));
  if (catFilter) filtered = filtered.filter(t => t.category === catFilter);
  if (typeFilter) filtered = filtered.filter(t => t.type === typeFilter);

  const container = document.getElementById('transactions-list');
  const sorted = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  container.innerHTML = sorted.map(t => transactionHTML(t, false)).join('');
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  renderTransactions();
  renderRecentTransactions();
  showNotification('Transaction deleted', 'success');
}

function editTransaction(id) {
  const t = transactions.find(x => x.id === id);
  if (!t) return;
  openTransactionModal(t);
}

// ---- MODALS ----
function openTransactionModal(existing) {
  const isEdit = !!existing;
  document.getElementById('modal-title').textContent = isEdit ? 'Edit Transaction' : 'Add Transaction';
  const catOptions = Object.keys(CATEGORIES).map(c => `<option ${existing && existing.category === c ? 'selected' : ''}>${c}</option>`).join('');
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveTransaction(event, ${isEdit ? existing.id : 'null'})">
      <div class="form-group"><label>Name</label><input type="text" id="m-name" value="${isEdit ? existing.name : ''}" required></div>
      <div class="form-group"><label>Amount</label><input type="number" id="m-amount" step="0.01" value="${isEdit ? existing.amount : ''}" required></div>
      <div class="form-group"><label>Type</label>
        <select id="m-type"><option value="expense" ${isEdit && existing.type==='expense'?'selected':''}>Expense</option><option value="income" ${isEdit && existing.type==='income'?'selected':''}>Income</option></select></div>
      <div class="form-group"><label>Category</label><select id="m-cat">${catOptions}</select></div>
      <div class="form-group"><label>Date</label><input type="date" id="m-date" value="${isEdit ? existing.date : new Date().toISOString().split('T')[0]}" required></div>
      <button type="submit" class="btn-primary btn-sm">${isEdit ? 'Update' : 'Add'} Transaction</button>
    </form>`;
  document.getElementById('modal-overlay').classList.add('active');
}

function saveTransaction(e, editId) {
  e.preventDefault();
  const data = {
    id: editId || nextId++,
    name: document.getElementById('m-name').value,
    amount: parseFloat(document.getElementById('m-amount').value),
    type: document.getElementById('m-type').value,
    category: document.getElementById('m-cat').value,
    date: document.getElementById('m-date').value,
  };
  if (editId) {
    const idx = transactions.findIndex(t => t.id === editId);
    if (idx !== -1) transactions[idx] = data;
  } else {
    transactions.push(data);
  }
  closeModal();
  renderTransactions();
  renderRecentTransactions();
  showNotification(editId ? 'Transaction updated' : 'Transaction added', 'success');
}

function openBudgetModal(existing) {
  const isEdit = !!existing;
  document.getElementById('modal-title').textContent = isEdit ? 'Edit Budget' : 'Add Budget';
  const catOptions = Object.keys(CATEGORIES).map(c => `<option ${existing && existing.category === c ? 'selected' : ''}>${c}</option>`).join('');
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveBudget(event, ${isEdit ? existing.id : 'null'})">
      <div class="form-group"><label>Category</label><select id="m-bcat">${catOptions}</select></div>
      <div class="form-group"><label>Monthly Limit</label><input type="number" id="m-blimit" step="0.01" value="${isEdit ? existing.limit : ''}" required></div>
      <button type="submit" class="btn-primary btn-sm">${isEdit ? 'Update' : 'Add'} Budget</button>
    </form>`;
  document.getElementById('modal-overlay').classList.add('active');
}

function saveBudget(e, editId) {
  e.preventDefault();
  const data = {
    id: editId || nextId++,
    category: document.getElementById('m-bcat').value,
    limit: parseFloat(document.getElementById('m-blimit').value),
    spent: editId ? budgets.find(b => b.id === editId)?.spent || 0 : 0,
  };
  if (editId) {
    const idx = budgets.findIndex(b => b.id === editId);
    if (idx !== -1) budgets[idx] = data;
  } else {
    budgets.push(data);
  }
  closeModal();
  renderBudgets();
  showNotification(editId ? 'Budget updated' : 'Budget added', 'success');
}

function openGoalModal(existing) {
  const isEdit = !!existing;
  document.getElementById('modal-title').textContent = isEdit ? 'Edit Goal' : 'Add Goal';
  document.getElementById('modal-body').innerHTML = `
    <form onsubmit="saveGoal(event, ${isEdit ? existing.id : 'null'})">
      <div class="form-group"><label>Goal Name</label><input type="text" id="m-gname" value="${isEdit ? existing.name : ''}" required></div>
      <div class="form-group"><label>Target Amount</label><input type="number" id="m-gtarget" step="0.01" value="${isEdit ? existing.target : ''}" required></div>
      <div class="form-group"><label>Saved So Far</label><input type="number" id="m-gsaved" step="0.01" value="${isEdit ? existing.saved : '0'}" required></div>
      <div class="form-group"><label>Deadline</label><input type="date" id="m-gdeadline" value="${isEdit ? existing.deadline : ''}" required></div>
      <button type="submit" class="btn-primary btn-sm">${isEdit ? 'Update' : 'Add'} Goal</button>
    </form>`;
  document.getElementById('modal-overlay').classList.add('active');
}

function saveGoal(e, editId) {
  e.preventDefault();
  const emojis = ['🎯', '💎', '🏆', '⭐', '🚀', '🌟'];
  const data = {
    id: editId || nextId++,
    name: document.getElementById('m-gname').value,
    target: parseFloat(document.getElementById('m-gtarget').value),
    saved: parseFloat(document.getElementById('m-gsaved').value),
    deadline: document.getElementById('m-gdeadline').value,
    emoji: editId ? goals.find(g => g.id === editId)?.emoji || '🎯' : emojis[Math.floor(Math.random() * emojis.length)],
  };
  if (editId) {
    const idx = goals.findIndex(g => g.id === editId);
    if (idx !== -1) goals[idx] = data;
  } else {
    goals.push(data);
  }
  closeModal();
  renderGoals();
  setTimeout(drawGoalRings, 50);
  showNotification(editId ? 'Goal updated' : 'Goal added', 'success');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
}

// ---- RENDER BUDGETS ----
function renderBudgets() {
  const container = document.getElementById('budgets-grid');
  container.innerHTML = budgets.map((b, i) => {
    const cat = CATEGORIES[b.category] || CATEGORIES.Other;
    const pct = Math.min((b.spent / b.limit) * 100, 100);
    const overPct = (b.spent / b.limit) * 100;
    const barClass = overPct > 100 ? 'danger' : overPct > 75 ? 'warning' : '';
    return `<div class="budget-card" style="--delay:${i}">
      <div class="budget-header">
        <div class="budget-category"><span class="budget-emoji">${cat.emoji}</span><span class="budget-name">${b.category}</span></div>
        <span class="budget-period">Monthly</span>
      </div>
      <div class="budget-amounts">
        <span class="budget-spent">$${b.spent.toLocaleString()}</span>
        <span class="budget-limit">of $${b.limit.toLocaleString()}</span>
      </div>
      <div class="budget-bar"><div class="budget-fill ${barClass}" style="width:${pct}%"></div></div>
      <div class="budget-percent" style="color: ${overPct > 100 ? 'var(--accent-red)' : overPct > 75 ? 'var(--accent-gold)' : 'var(--text-secondary)' }">${Math.round(overPct)}% used${overPct > 100 ? ' — Over budget!' : ''}</div>
    </div>`;
  }).join('');
}

// ---- RENDER GOALS ----
function renderGoals() {
  const container = document.getElementById('goals-grid');
  container.innerHTML = goals.map((g, i) => {
    const pct = Math.round((g.saved / g.target) * 100);
    return `<div class="goal-card" style="--delay:${i}">
      <div class="goal-ring"><canvas id="goal-ring-${g.id}" width="240" height="240"></canvas><div class="goal-ring-text">${pct}%</div></div>
      <div class="goal-name">${g.emoji} ${g.name}</div>
      <div class="goal-amounts">$${g.saved.toLocaleString()} of $${g.target.toLocaleString()}</div>
      <div class="goal-deadline">Due ${formatDate(g.deadline)}</div>
    </div>`;
  }).join('');
}

function drawGoalRings() {
  const green = getComputedStyle(document.documentElement).getPropertyValue('--accent-green').trim();
  const border = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
  goals.forEach(g => {
    const canvas = document.getElementById('goal-ring-' + g.id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 240;
    const cx = size / 2, cy = size / 2, r = 90, lw = 12;
    ctx.clearRect(0, 0, size, size);
    // bg ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = border;
    ctx.lineWidth = lw;
    ctx.stroke();
    // progress ring
    const pct = Math.min(g.saved / g.target, 1);
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + pct * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, startAngle, endAngle);
    ctx.strokeStyle = green;
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.stroke();
  });
}

// ---- RENDER ANALYTICS ----
function renderTopCategories() {
  const expensesByCategory = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
  });
  const sorted = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;
  const container = document.getElementById('top-categories');
  container.innerHTML = sorted.map(([cat, amount]) => {
    const c = CATEGORIES[cat] || CATEGORIES.Other;
    const pct = (amount / max) * 100;
    return `<div class="top-cat-item">
      <span class="top-cat-emoji">${c.emoji}</span>
      <span class="top-cat-name">${cat}</span>
      <div class="top-cat-bar-wrap"><div class="top-cat-bar" style="width:${pct}%;background:${c.color}"></div></div>
      <span class="top-cat-amount">$${amount.toLocaleString()}</span>
    </div>`;
  }).join('');
}

// ---- CHARTS ----
function getChartColors() {
  const s = getComputedStyle(document.documentElement);
  return {
    green: s.getPropertyValue('--accent-green').trim(),
    red: s.getPropertyValue('--accent-red').trim(),
    gold: s.getPropertyValue('--accent-gold').trim(),
    text: s.getPropertyValue('--text-secondary').trim(),
    textLight: s.getPropertyValue('--text-tertiary').trim(),
    border: s.getPropertyValue('--border').trim(),
    bg: s.getPropertyValue('--bg-card').trim(),
  };
}

function drawDashboardCharts() {
  drawLineChart();
  drawPieChart();
}

function drawLineChart() {
  const canvas = document.getElementById('chart-line');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 50 || rect.height < 50) return;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const w = rect.width, h = rect.height;
  const c = getChartColors();
  ctx.clearRect(0, 0, w, h);

  const pad = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const allVals = monthlyData.flatMap(d => [d.income, d.expenses]);
  const maxVal = Math.ceil(Math.max(...allVals) / 2000) * 2000;

  // grid lines
  ctx.strokeStyle = c.border;
  ctx.lineWidth = 1;
  ctx.font = '11px Plus Jakarta Sans';
  ctx.fillStyle = c.textLight;
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillText('$' + ((maxVal - (maxVal / 4) * i) / 1000).toFixed(0) + 'k', pad.left - 8, y + 4);
  }

  // month labels
  ctx.textAlign = 'center';
  ctx.fillStyle = c.text;
  const points = monthlyData.map((d, i) => ({
    x: pad.left + (chartW / (monthlyData.length - 1)) * i,
    income: pad.top + chartH - (d.income / maxVal) * chartH,
    expense: pad.top + chartH - (d.expenses / maxVal) * chartH,
  }));
  monthlyData.forEach((d, i) => {
    ctx.fillText(d.month, points[i].x, h - pad.bottom + 24);
  });

  // draw smooth lines
  function drawSmoothLine(pts, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const cpx = (pts[i - 1].x + pts[i].x) / 2;
      ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, cpx, (pts[i - 1].y + pts[i].y) / 2);
    }
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();

    // gradient fill
    ctx.lineTo(pts[pts.length - 1].x, pad.top + chartH);
    ctx.lineTo(pts[0].x, pad.top + chartH);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
    grad.addColorStop(0, color + '20');
    grad.addColorStop(1, color + '02');
    ctx.fillStyle = grad;
    ctx.fill();

    // dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = c.bg;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  drawSmoothLine(points.map(p => ({ x: p.x, y: p.income })), c.green);
  drawSmoothLine(points.map(p => ({ x: p.x, y: p.expense })), c.red);
}

function drawPieChart() {
  const canvas = document.getElementById('chart-pie');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 50 || rect.height < 50) return;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const w = rect.width, h = rect.height;
  ctx.clearRect(0, 0, w, h);

  const expensesByCategory = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
  });
  const data = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
  const total = data.reduce((s, [, v]) => s + v, 0);

  const cx = w / 2, cy = h / 2 - 10;
  const outerR = Math.max(Math.min(w, h) / 2 - 20, 10);
  const innerR = outerR * 0.55;

  let startAngle = -Math.PI / 2;
  data.forEach(([cat, val]) => {
    const slice = (val / total) * Math.PI * 2;
    const color = (CATEGORIES[cat] || CATEGORIES.Other).color;
    ctx.beginPath();
    ctx.moveTo(cx + innerR * Math.cos(startAngle), cy + innerR * Math.sin(startAngle));
    ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
    ctx.arc(cx, cy, innerR, startAngle + slice, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    startAngle += slice;
  });

  // center text
  ctx.fillStyle = getChartColors().text;
  ctx.font = '600 12px Plus Jakarta Sans';
  ctx.textAlign = 'center';
  ctx.fillText('TOTAL', cx, cy - 6);
  ctx.font = '24px DM Serif Display';
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
  ctx.fillText('$' + total.toLocaleString(), cx, cy + 22);

  // legend
  const legendEl = document.getElementById('pie-legend');
  legendEl.innerHTML = data.map(([cat, val]) => {
    const c = (CATEGORIES[cat] || CATEGORIES.Other).color;
    const pct = Math.round((val / total) * 100);
    return `<div class="pie-legend-item"><span class="pie-legend-color" style="background:${c}"></span>${cat} ${pct}%</div>`;
  }).join('');
}

function drawAnalyticsCharts() {
  drawBarChart();
  drawSavingsChart();
}

function drawBarChart() {
  const canvas = document.getElementById('chart-bar');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const w = rect.width, h = rect.height;
  const c = getChartColors();
  ctx.clearRect(0, 0, w, h);

  const pad = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const maxVal = Math.ceil(Math.max(...monthlyData.map(d => d.income)) / 2000) * 2000;

  // grid
  ctx.font = '11px Plus Jakarta Sans';
  ctx.fillStyle = c.textLight;
  ctx.textAlign = 'right';
  ctx.strokeStyle = c.border;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillText('$' + ((maxVal - (maxVal / 4) * i) / 1000).toFixed(0) + 'k', pad.left - 8, y + 4);
  }

  const barGroupW = chartW / monthlyData.length;
  const barW = barGroupW * 0.28;
  const gap = 4;

  monthlyData.forEach((d, i) => {
    const gx = pad.left + barGroupW * i + barGroupW / 2;
    const incomeH = (d.income / maxVal) * chartH;
    const expenseH = (d.expenses / maxVal) * chartH;

    // income bar
    roundedRect(ctx, gx - barW - gap / 2, pad.top + chartH - incomeH, barW, incomeH, 4);
    ctx.fillStyle = c.green;
    ctx.fill();

    // expense bar
    roundedRect(ctx, gx + gap / 2, pad.top + chartH - expenseH, barW, expenseH, 4);
    ctx.fillStyle = c.red;
    ctx.fill();

    // label
    ctx.fillStyle = c.text;
    ctx.textAlign = 'center';
    ctx.font = '11px Plus Jakarta Sans';
    ctx.fillText(d.month, gx, h - pad.bottom + 24);
  });
}

function drawSavingsChart() {
  const canvas = document.getElementById('chart-savings');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const w = rect.width, h = rect.height;
  const c = getChartColors();
  ctx.clearRect(0, 0, w, h);

  const pad = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const savings = monthlyData.map(d => d.income - d.expenses);
  const maxVal = Math.ceil(Math.max(...savings) / 1000) * 1000;

  // grid
  ctx.font = '11px Plus Jakarta Sans';
  ctx.strokeStyle = c.border;
  ctx.lineWidth = 1;
  ctx.fillStyle = c.textLight;
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillText('$' + ((maxVal - (maxVal / 4) * i) / 1000).toFixed(1) + 'k', pad.left - 8, y + 4);
  }

  const points = savings.map((s, i) => ({
    x: pad.left + (chartW / (savings.length - 1)) * i,
    y: pad.top + chartH - (s / maxVal) * chartH,
  }));

  // area fill
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2;
    ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, cpx, (points[i - 1].y + points[i].y) / 2);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.lineTo(points[points.length - 1].x, pad.top + chartH);
  ctx.lineTo(points[0].x, pad.top + chartH);
  ctx.closePath();
  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
  grad.addColorStop(0, c.green + '30');
  grad.addColorStop(1, c.green + '05');
  ctx.fillStyle = grad;
  ctx.fill();

  // line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const cpx = (points[i - 1].x + points[i].x) / 2;
    ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, cpx, (points[i - 1].y + points[i].y) / 2);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);
  ctx.strokeStyle = c.green;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // dots + labels
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = c.bg;
    ctx.fill();
    ctx.strokeStyle = c.green;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = c.text;
    ctx.textAlign = 'center';
    ctx.font = '11px Plus Jakarta Sans';
    ctx.fillText(monthlyData[i].month, p.x, h - pad.bottom + 24);
  });
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function exportReport() {
  showNotification('Exporting report as PDF...', 'success');
  setTimeout(() => showNotification('Report downloaded!', 'success'), 1500);
}

function updateAnalytics() {
  showNotification('Analytics period updated', 'success');
}

// password strength meter
document.addEventListener('input', (e) => {
  if (e.target.closest('#register-form .password-field')) {
    const val = e.target.value;
    const bar = document.querySelector('.pw-bar');
    let strength = 0;
    if (val.length >= 4) strength += 25;
    if (val.length >= 8) strength += 25;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength += 25;
    if (/[^a-zA-Z0-9]/.test(val)) strength += 25;
    bar.style.width = strength + '%';
    bar.style.background = strength <= 25 ? 'var(--accent-red)' : strength <= 50 ? 'var(--accent-gold)' : 'var(--accent-green)';
  }
});

// close modal on Escape
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// resize charts
window.addEventListener('resize', () => {
  const activePage = document.querySelector('.page.active');
  if (activePage?.id === 'page-dashboard') drawDashboardCharts();
  if (activePage?.id === 'page-analytics') drawAnalyticsCharts();
});
