/* ═══════════════════════════════════════════
   TAT Wallet — Application Logic
   ═══════════════════════════════════════════ */

// ================== STATE ==================
const state = {
  user: {
    name: 'علی احمدی',
    userId: '@ali_7x3k',
    avatar: '👤',
    cardNumber: '۹۹۰۰ ۶۰۳۷ ۱۲۳۴ ۵۶۷۸',
    balance: 1250,
    rate: 100,
  },
  privacy: false,
  transactions: [
    { id: 1, type: 'reward', title: 'جایزه Space Run', time: '۱۰ دقیقه پیش', amount: 50, icon: '🎁' },
    { id: 2, type: 'out', title: 'ارسال به سارا', time: '۲ ساعت پیش', amount: -100, icon: '📤' },
    { id: 3, type: 'in', title: 'افزایش موجودی', time: 'دیروز', amount: 500, icon: '💳' },
    { id: 4, type: 'stake', title: 'سود سپرده روزانه', time: 'دیروز', amount: 12, icon: '📈' },
    { id: 5, type: 'game', title: 'خرید در Puzzle', time: '۳ روز پیش', amount: -75, icon: '🎮' },
  ],
  market: [
    { symbol: 'TAT', name: 'TAT', icon: '🪙', price: 100, change: 0.97, unit: 'تومان', type: 'tat' },
    { symbol: 'USDT', name: 'تتر', icon: '💵', price: 91500, change: 0.5, unit: 'تومان', type: 'crypto' },
    { symbol: 'GOLD18', name: 'طلای ۱۸ عیار', icon: '🥇', price: 2345000, change: 1.2, unit: 'تومان', type: 'gold' },
    { symbol: 'GOLD24', name: 'طلای ۲۴ عیار', icon: '🥇', price: 3127000, change: 1.3, unit: 'تومان', type: 'gold' },
    { symbol: 'OUNCE', name: 'اونس جهانی', icon: '💎', price: 2650, change: 0.8, unit: 'دلار', type: 'gold' },
  ],
  apps: [
    { icon: '🚀', name: 'Space Run', balance: 250, in: 500, out: 250, last: '۱۰ دقیقه پیش' },
    { icon: '🧩', name: 'Puzzle Master', balance: 100, in: 300, out: 200, last: '۲ ساعت پیش' },
    { icon: '📋', name: 'Daily Task', balance: 500, in: 1000, out: 500, last: 'دیروز' },
  ],
  notifications: [
    { icon: '🎁', title: 'جایزه Space Run', desc: '۵۰ TAT دریافت کردی', time: '۱۰ دقیقه پیش', color: 'rgba(0,217,126,0.15)' },
    { icon: '📈', title: 'قیمت تتر افزایش یافت', desc: '+۰٫۵٪ در ۲۴ ساعت گذشته', time: '۱ ساعت پیش', color: 'rgba(253,203,110,0.15)' },
    { icon: '💰', title: 'سود سپرده واریز شد', desc: '+۱۲ TAT به موجودی اضافه شد', time: 'دیروز', color: 'rgba(108,92,231,0.15)' },
  ],
};

// ================== SVG COIN ==================
function getCoinSVG(size = 40, options = {}) {
  const { vip = false, flipped = false } = options;
  
  const edgeColors = vip 
    ? ['#FFE08A', '#F5B942', '#FFE08A', '#D89B2E', '#FFE08A']
    : ['#FFD966', '#F5B942', '#FFD966', '#D89B2E', '#FFD966'];
  
  const textColor = vip ? '#FFE08A' : '#ffffff';
  const symbol = vip ? '♛' : '✦';
  
  const id = 'coin_' + Math.random().toString(36).substr(2, 9);
  
  return `
    <svg viewBox="0 0 200 200" width="${size}" height="${size}" style="display:block;">
      <defs>
        <linearGradient id="edge_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${edgeColors[0]}"/>
          <stop offset="25%" stop-color="${edgeColors[1]}"/>
          <stop offset="50%" stop-color="${edgeColors[2]}"/>
          <stop offset="75%" stop-color="${edgeColors[3]}"/>
          <stop offset="100%" stop-color="${edgeColors[4]}"/>
        </linearGradient>
        <radialGradient id="body_${id}" cx="35%" cy="30%">
          <stop offset="0%" stop-color="#3FE0B8"/>
          <stop offset="35%" stop-color="#00C99A"/>
          <stop offset="70%" stop-color="#008F6C"/>
          <stop offset="100%" stop-color="#005A44"/>
        </radialGradient>
        <radialGradient id="shine_${id}" cx="30%" cy="25%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.7)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="195" rx="70" ry="6" fill="rgba(0,0,0,0.5)"/>
      <circle cx="100" cy="100" r="96" fill="url(#edge_${id})"/>
      <circle cx="100" cy="100" r="89" fill="url(#edge_${id})" opacity="0.95"/>
      <circle cx="100" cy="100" r="82" fill="url(#body_${id})"/>
      <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <circle cx="100" cy="100" r="76" fill="none" stroke="rgba(253,203,110,0.5)" stroke-width="0.8"/>
      <circle cx="100" cy="100" r="72" fill="none" stroke="rgba(253,203,110,0.25)" stroke-width="0.5"/>
      <ellipse cx="75" cy="65" rx="45" ry="35" fill="url(#shine_${id})" opacity="0.8"/>
      
      ${vip ? `<text x="100" y="72" font-size="14" fill="${textColor}" text-anchor="middle">${symbol}</text>` : ''}
      
      <text x="100" y="${vip ? 112 : 108}" 
            font-family="Cinzel, serif" 
            font-size="${size < 60 ? 55 : 38}" 
            font-weight="900" 
            fill="${textColor}" 
            text-anchor="middle"
            letter-spacing="3">TAT</text>
      
      ${size >= 60 ? `
        <line x1="72" y1="${vip ? 126 : 122}" x2="128" y2="${vip ? 126 : 122}" stroke="${vip ? '#FFE08A' : 'rgba(253,203,110,0.9)'}" stroke-width="1.5" stroke-linecap="round"/>
        <text x="100" y="${vip ? 142 : 138}" 
              font-family="Cinzel, serif" 
              font-size="13" 
              font-weight="700" 
              fill="${textColor}" 
              text-anchor="middle"
              letter-spacing="3">2025</text>
      ` : ''}
      
      ${size >= 80 ? `
        <text x="55" y="60" font-size="10" fill="rgba(253,203,110,0.9)" text-anchor="middle">✦</text>
        <text x="145" y="60" font-size="10" fill="rgba(253,203,110,0.9)" text-anchor="middle">✦</text>
        <text x="55" y="155" font-size="10" fill="rgba(253,203,110,0.9)" text-anchor="middle">✦</text>
        <text x="145" y="155" font-size="10" fill="rgba(253,203,110,0.9)" text-anchor="middle">✦</text>
      ` : ''}
    </svg>
  `;
}

function getMiniCoinSVG(size = 40) {
  const id = 'mini_' + Math.random().toString(36).substr(2, 9);
  return `
    <svg viewBox="0 0 200 200" width="${size}" height="${size}" style="display:block;">
      <defs>
        <linearGradient id="e_${id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFD966"/>
          <stop offset="50%" stop-color="#D89B2E"/>
          <stop offset="100%" stop-color="#FFD966"/>
        </linearGradient>
        <radialGradient id="b_${id}" cx="35%" cy="30%">
          <stop offset="0%" stop-color="#3FE0B8"/>
          <stop offset="70%" stop-color="#008F6C"/>
          <stop offset="100%" stop-color="#005A44"/>
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="95" fill="url(#e_${id})"/>
      <circle cx="100" cy="100" r="82" fill="url(#b_${id})"/>
      <text x="100" y="${size < 40 ? 120 : 115}" font-family="Cinzel" font-size="${size < 40 ? 60 : 45}" font-weight="900" fill="#fff" text-anchor="middle">T</text>
    </svg>
  `;
}

// ================== INIT ==================
document.addEventListener('DOMContentLoaded', () => {
  // Splash Coin
  const splashCoin = document.getElementById('splashCoin');
  if (splashCoin) splashCoin.innerHTML = getCoinSVG(120);
  
  // Auth Coin
  const authCoin = document.getElementById('authCoin');
  if (authCoin) authCoin.innerHTML = getCoinSVG(80);
  
  // Card Coin
  const cardCoinFront = document.getElementById('cardCoinFront');
  if (cardCoinFront) cardCoinFront.innerHTML = getMiniCoinSVG(40);
  
  // Balance Coin
  const balanceCoin = document.getElementById('balanceCoin');
  if (balanceCoin) balanceCoin.innerHTML = getMiniCoinSVG(44);
  
  // PQ Coin TAT
  const pqCoinTAT = document.getElementById('pqCoinTAT');
  if (pqCoinTAT) pqCoinTAT.innerHTML = getMiniCoinSVG(28);
  
  // Asset Detail Coin (modal)
  const assetDetailCoin = document.getElementById('assetDetailCoin');
  if (assetDetailCoin) assetDetailCoin.innerHTML = getCoinSVG(100);
  
  // Init lists
  renderRecentTxs();
  renderMarket();
  renderAssets();
  renderApps();
  renderHistory();
  renderNotifications();
  
  // Init charts/tabs/filters
  initTabs();
  initFilters();
  
  // Splash timeout
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
    
    // Check login
    const loggedIn = localStorage.getItem('tat_logged_in');
    if (loggedIn) {
      document.getElementById('authPage').classList.remove('active');
      document.getElementById('mainApp').style.display = 'block';
      document.getElementById('nav').style.display = 'flex';
    } else {
      document.getElementById('authPage').classList.add('active');
    }
  }, 2600);
});

// ================== LOGIN ==================
function login() {
  const phone = document.getElementById('phoneInput').value.trim();
  if (phone.length < 10) { showToast('شماره موبایل معتبر وارد کن ❌'); return; }
  localStorage.setItem('tat_logged_in', 'true');
  document.getElementById('authPage').classList.remove('active');
  document.getElementById('mainApp').style.display = 'block';
  document.getElementById('nav').style.display = 'flex';
  showToast('خوش اومدی ' + state.user.name + ' 🎉');
}

// ================== NAVIGATION ==================
function goTo(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.querySelector(`[data-page="${pageName}"]`);
  if (page) {
    page.classList.add('active');
    // Show/hide nav based on page
    if (pageName === 'auth') {
      document.getElementById('nav').style.display = 'none';
    } else {
      document.getElementById('nav').style.display = 'flex';
    }
  }

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navBtn = document.querySelector(`[data-nav="${pageName}"]`);
  if (navBtn) navBtn.classList.add('active');

  window.scrollTo(0, 0);
}

// ================== CARD FLIP ==================
function flipCard() {
  document.getElementById('cardFlip').classList.toggle('flipped');
  if (navigator.vibrate) navigator.vibrate(15);
}

// ================== PRIVACY ==================
function togglePrivacy() {
  state.privacy = !state.privacy;
  document.getElementById('balanceMain').classList.toggle('hidden', state.privacy);
  document.getElementById('balanceFiatBox').classList.toggle('hidden', state.privacy);
  document.getElementById('eyeBtn').textContent = state.privacy ? '🙈' : '👁';
}

// ================== RENDER ==================
function renderRecentTxs() {
  const container = document.getElementById('recentTxs');
  if (!container) return;
  container.innerHTML = '';
  state.transactions.slice(0, 3).forEach(tx => container.appendChild(createTxEl(tx)));
}

function renderHistory() {
  const container = document.getElementById('historyList');
  if (!container) return;
  container.innerHTML = '';
  state.transactions.forEach(tx => container.appendChild(createTxEl(tx)));
}

function renderNotifications() {
  const container = document.getElementById('notificationsList');
  if (!container) return;
  container.innerHTML = '';
  state.notifications.forEach(n => {
    const div = document.createElement('div');
    div.className = 'tx';
    div.innerHTML = `
      <div class="tx-ico" style="background:${n.color}">${n.icon}</div>
      <div class="tx-body">
        <div class="tx-title">${n.title}</div>
        <div class="tx-time">${n.desc}</div>
      </div>
      <div class="tx-time">${n.time}</div>
    `;
    container.appendChild(div);
  });
}

function createTxEl(tx) {
  const div = document.createElement('div');
  div.className = 'tx';
  div.onclick = () => showTxDetail(tx);
  const sign = tx.amount > 0 ? '+' : '−';
  const colorClass = tx.amount > 0 ? 'in' : 'out';
  const amountText = sign + toFa(Math.abs(tx.amount));

  div.innerHTML = `
    <div class="tx-ico ${tx.type}">${tx.icon}</div>
    <div class="tx-body">
      <div class="tx-title">${tx.title}</div>
      <div class="tx-time">${tx.time}</div>
    </div>
    <div class="tx-amt ${colorClass}">${amountText}</div>
  `;
  return div;
}

function renderMarket(filter = 'all') {
  const container = document.getElementById('marketList');
  if (!container) return;
  container.innerHTML = '';
  
  let items = state.market;
  if (filter === 'crypto') items = items.filter(x => x.type === 'crypto');
  if (filter === 'gold') items = items.filter(x => x.type === 'gold');
  
  items.forEach(asset => {
    const div = document.createElement('div');
    div.className = 'market-item';
    div.onclick = () => showAssetDetail(asset.symbol);
    
    const changeClass = asset.change >= 0 ? 'up' : 'down';
    const changeSign = asset.change >= 0 ? '↑' : '↓';
    const priceFormatted = toFa(asset.price.toLocaleString()) + ' ' + asset.unit;
    
    const iconHTML = asset.symbol === 'TAT' 
      ? `<div class="market-coin">${getMiniCoinSVG(44)}</div>`
      : `<div class="market-icon">${asset.icon}</div>`;

    div.innerHTML = `
      ${iconHTML}
      <div class="market-body">
        <div class="market-name">${asset.name}</div>
        <div class="market-symbol">${asset.symbol}</div>
      </div>
      <div class="market-price">
        <div class="market-price-val">${priceFormatted}</div>
        <div class="market-price-change ${changeClass}">${changeSign} ${toFa(asset.change)}٪</div>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderAssets() {
  const container = document.getElementById('assetList');
  if (!container) return;
  container.innerHTML = '';
  
  const assets = [
    { symbol: 'TAT', name: 'TAT', icon: '🪙', amount: '۱٬۲۵۰', value: '۱۲۵٬۰۰۰', percent: 10, color: '#00B894' },
    { symbol: 'USDT', name: 'تتر', icon: '💵', amount: '۵', value: '۴۵۷٬۵۰۰', percent: 73, color: '#FDCB6E' },
    { symbol: 'GOLD18', name: 'طلای ۱۸ عیار', icon: '🥇', amount: '۰٫۱ گرم', value: '۲۳۴٬۵۰۰', percent: 17, color: '#6C5CE7' },
  ];
  
  assets.forEach(a => {
    const div = document.createElement('div');
    div.className = 'asset-item';
    div.onclick = () => showAssetDetail(a.symbol);
    
    const iconHTML = a.symbol === 'TAT' 
      ? `<div class="market-coin">${getMiniCoinSVG(40)}</div>`
      : `<div class="asset-icon" style="background:${a.color}22">${a.icon}</div>`;
    
    div.innerHTML = `
      <div class="asset-top">
        ${iconHTML}
        <div class="asset-info">
          <div class="asset-name">${a.name}</div>
          <div class="asset-symbol">${a.symbol}</div>
        </div>
        <div>
          <div class="asset-amount">${a.amount}</div>
          <div class="asset-value">${a.value} تومان</div>
        </div>
      </div>
      <div class="asset-bar"><div class="asset-bar-fill" style="width:${a.percent}%; background:${a.color};"></div></div>
    `;
    container.appendChild(div);
  });
}

function renderApps() {
  const container = document.getElementById('appsList');
  if (!container) return;
  container.innerHTML = '';
  
  state.apps.forEach((app, idx) => {
    const div = document.createElement('div');
    div.className = 'app-card';
    div.onclick = () => showAppDetail(idx);
    div.innerHTML = `
      <div class="app-icon" style="background:rgba(0,184,148,0.15)">${app.icon}</div>
      <div class="app-body">
        <div class="app-name">${app.name}</div>
        <div class="app-meta">آخرین فعالیت: ${app.last}</div>
        <div class="app-stats"><span>واریز: ${toFa(app.in)}</span><span>برداشت: ${toFa(app.out)}</span></div>
      </div>
      <div class="app-balance">${toFa(app.balance)}</div>
    `;
    container.appendChild(div);
  });
}

// ================== MODALS ==================
function openModal(type) {
  const modal = document.getElementById('modal-' + type);
  if (modal) modal.classList.add('show');
}

function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
}

document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) closeModal(); });
});

// ================== TX DETAIL ==================
function showTxDetail(tx) {
  document.getElementById('txDetailIcon').textContent = tx.icon;
  const sign = tx.amount > 0 ? '+' : '−';
  document.getElementById('txDetailAmount').textContent = sign + toFa(Math.abs(tx.amount));
  document.getElementById('txDetailAmount').style.color = tx.amount > 0 ? 'var(--success)' : 'var(--danger)';
  document.getElementById('txDetailTitle').textContent = tx.title;
  openModal('tx');
}

// ================== ASSET DETAIL ==================
function showAssetDetail(symbol) {
  const asset = state.market.find(a => a.symbol === symbol);
  if (!asset) return;
  
  document.getElementById('assetDetailName').textContent = asset.name;
  document.getElementById('assetDetailPrice').textContent = toFa(asset.price.toLocaleString()) + ' ' + asset.unit;
  
  const change = document.getElementById('assetDetailChange');
  change.textContent = (asset.change >= 0 ? '↑ ' : '↓ ') + toFa(asset.change) + '٪';
  change.className = 'asset-detail-change ' + (asset.change >= 0 ? 'up' : 'down');
  
  const coinEl = document.getElementById('assetDetailCoin');
  if (symbol === 'TAT') {
    coinEl.innerHTML = getCoinSVG(100);
  } else {
    coinEl.innerHTML = `<div style="width:100px;height:100px;border-radius:50%;background:${getAssetColor(symbol)}22;display:flex;align-items:center;justify-content:center;font-size:50px;">${asset.icon}</div>`;
  }
  
  openModal('asset');
}

function getAssetColor(symbol) {
  if (symbol === 'USDT') return '#FDCB6E';
  if (symbol === 'GOLD18' || symbol === 'GOLD24') return '#6C5CE7';
  return '#00B894';
}

// ================== APP DETAIL ==================
function showAppDetail(idx) {
  const app = state.apps[idx];
  if (!app) return;
  
  document.getElementById('appDetailIcon').textContent = app.icon;
  document.getElementById('appDetailName').textContent = app.name;
  
  openModal('app');
}

// ================== SEND ==================
function setAmount(val) {
  const input = document.getElementById('sendAmount');
  if (val === 'max') input.value = state.user.balance;
  else input.value = val;
}

function confirmSend() {
  const amount = parseFloat(document.getElementById('sendAmount').value);
  if (!amount || amount <= 0) { showToast('مقدار معتبر وارد کن ❌'); return; }
  if (amount > state.user.balance) { showToast('موجودی کافی نیست ❌'); return; }
  state.user.balance -= amount;
  updateBalance();
  closeModal();
  showToast('ارسال شد ✅');
  document.getElementById('sendAmount').value = '';
}

// ================== BUY/SELL ==================
function openBuyModal(type) {
  const title = document.getElementById('buyModalTitle');
  title.textContent = type === 'buy' ? '🟢 خرید TAT' : '🔴 فروش TAT';
  openModal('buy');
}

function setBuyAmount(percent) {
  const input = document.getElementById('buyAmount');
  const total = 1250000;
  input.value = Math.floor(total * percent / 100);
}

function confirmBuy() {
  const amount = parseFloat(document.getElementById('buyAmount').value);
  if (!amount || amount <= 0) { showToast('مقدار معتبر وارد کن ❌'); return; }
  closeModal();
  showToast('معامله انجام شد ✅');
}

// ================== STAKE ==================
function openStakeModal(type, rate) {
  const labels = {
    'flexible': 'انعطاف‌پذیر',
    '1m': '۱ ماهه',
    '3m': '۳ ماهه',
    '6m': '۶ ماهه'
  };
  document.getElementById('stakeTypeLabel').textContent = labels[type] || type;
  document.getElementById('stakeRateLabel').textContent = toFa(rate) + '٪ سالانه';
  openModal('stake');
}

function setStakeAmount(percent) {
  const input = document.getElementById('stakeAmount');
  input.value = Math.floor(state.user.balance * percent / 100);
}

function confirmStake() {
  const amount = parseFloat(document.getElementById('stakeAmount').value);
  if (!amount || amount <= 0) { showToast('مقدار معتبر وارد کن ❌'); return; }
  closeModal();
  showToast('سپرده‌گذاری انجام شد ✅');
}

// ================== BALANCE ==================
function updateBalance() {
  document.getElementById('balanceValue').textContent = toFa(state.user.balance.toFixed(2)).replace('.', '٫');
}

// ================== TOGGLE ==================
function toggleSwitch(el) {
  el.classList.toggle('active');
}

// ================== TABS & FILTERS ==================
function initTabs() {
  document.querySelectorAll('.chart-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      this.parentElement.querySelectorAll('.chart-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function initFilters() {
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', function() {
      this.parentElement.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
      const filter = this.dataset.filter;
      const page = this.closest('.page').dataset.page;
      
      if (page === 'market') renderMarket(filter);
    });
  });
  
  // Market search
  const marketSearch = document.getElementById('marketSearch');
  if (marketSearch) {
    marketSearch.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const container = document.getElementById('marketList');
      if (!container) return;
      container.innerHTML = '';
      
      state.market.filter(a => 
        a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)
      ).forEach(asset => {
        const div = document.createElement('div');
        div.className = 'market-item';
        div.onclick = () => showAssetDetail(asset.symbol);
        const changeClass = asset.change >= 0 ? 'up' : 'down';
        const changeSign = asset.change >= 0 ? '↑' : '↓';
        const priceFormatted = toFa(asset.price.toLocaleString()) + ' ' + asset.unit;
        const iconHTML = asset.symbol === 'TAT' 
          ? `<div class="market-coin">${getMiniCoinSVG(44)}</div>`
          : `<div class="market-icon">${asset.icon}</div>`;
        div.innerHTML = `
          ${iconHTML}
          <div class="market-body">
            <div class="market-name">${asset.name}</div>
            <div class="market-symbol">${asset.symbol}</div>
          </div>
          <div class="market-price">
            <div class="market-price-val">${priceFormatted}</div>
            <div class="market-price-change ${changeClass}">${changeSign} ${toFa(asset.change)}٪</div>
          </div>
        `;
        container.appendChild(div);
      });
    });
  }
}

// ================== UTILS ==================
function toFa(num) {
  const persian = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(num).replace(/\d/g, d => persian[d]);
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('کپی شد 📋'));
  } else {
    showToast('کپی شد 📋');
  }
}

function logout() {
  if (confirm('مطمئنی می‌خوای خارج بشی؟')) {
    localStorage.removeItem('tat_logged_in');
    location.reload();
  }
}

// Register
if ('serviceWorker' in navigator) {
  // PWA optional
}