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

// ================== SETTINGS STATE ==================
const settings = {
  fingerprint: false,
  twoFA: false,
  txNotify: true,
  priceNotify: true,
  rewardNotify: true,
  darkMode: true,
  language: 'fa',
  fontSize: 'medium',
  inviteCount: 0,
  inviteReward: 0,
};

// ================== SVG COIN ==================
function getCoinSVG(size = 40, options = {}) {
  const { vip = false } = options;
  const edgeColors = vip 
    ? ['#FFE08A', '#F5B942', '#FFE08A', '#D89B2E', '#FFE08A']
    : ['#FFD966', '#F5B942', '#FFD966', '#D89B2E', '#FFD966'];
  const textColor = vip ? '#FFE08A' : '#ffffff';
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
      <ellipse cx="75" cy="65" rx="45" ry="35" fill="url(#shine_${id})" opacity="0.8"/>
      ${vip ? `<text x="100" y="72" font-size="14" fill="${textColor}" text-anchor="middle">♛</text>` : ''}
      <text x="100" y="${vip ? 112 : 108}" font-family="Cinzel, serif" font-size="${size < 60 ? 55 : 38}" font-weight="900" fill="${textColor}" text-anchor="middle" letter-spacing="3">TAT</text>
      ${size >= 60 ? `
        <line x1="72" y1="${vip ? 126 : 122}" x2="128" y2="${vip ? 126 : 122}" stroke="${vip ? '#FFE08A' : 'rgba(253,203,110,0.9)'}" stroke-width="1.5" stroke-linecap="round"/>
        <text x="100" y="${vip ? 142 : 138}" font-family="Cinzel, serif" font-size="13" font-weight="700" fill="${textColor}" text-anchor="middle" letter-spacing="3">2025</text>
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
  // Coins
  const splashCoin = document.getElementById('splashCoin');
  if (splashCoin) splashCoin.innerHTML = getCoinSVG(120);
  
  const authCoin = document.getElementById('authCoin');
  if (authCoin) authCoin.innerHTML = getCoinSVG(80);
  
  const cardCoinFront = document.getElementById('cardCoinFront');
  if (cardCoinFront) cardCoinFront.innerHTML = getMiniCoinSVG(40);
  
  const balanceCoin = document.getElementById('balanceCoin');
  if (balanceCoin) balanceCoin.innerHTML = getMiniCoinSVG(44);
  
  const pqCoinTAT = document.getElementById('pqCoinTAT');
  if (pqCoinTAT) pqCoinTAT.innerHTML = getMiniCoinSVG(28);
  
  // Init
  renderRecentTxs();
  renderMarket();
  renderAssets();
  renderApps();
  renderHistory();
  renderNotifications();
  initTabs();
  initFilters();
  loadSettings();
  loadPersonalInfo();
  
  // Splash
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
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
  if (page) page.classList.add('active');
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
  const c = document.getElementById('recentTxs');
  if (!c) return;
  c.innerHTML = '';
  state.transactions.slice(0, 3).forEach(tx => c.appendChild(createTxEl(tx)));
}

function renderHistory() {
  const c = document.getElementById('historyList');
  if (!c) return;
  c.innerHTML = '';
  state.transactions.forEach(tx => c.appendChild(createTxEl(tx)));
}

function renderNotifications() {
  const c = document.getElementById('notificationsList');
  if (!c) return;
  c.innerHTML = '';
  state.notifications.forEach(n => {
    const d = document.createElement('div');
    d.className = 'tx';
    d.innerHTML = `
      <div class="tx-ico" style="background:${n.color}">${n.icon}</div>
      <div class="tx-body">
        <div class="tx-title">${n.title}</div>
        <div class="tx-time">${n.desc}</div>
      </div>
      <div class="tx-time">${n.time}</div>
    `;
    c.appendChild(d);
  });
}

function createTxEl(tx) {
  const d = document.createElement('div');
  d.className = 'tx';
  d.onclick = () => showTxDetail(tx);
  const sign = tx.amount > 0 ? '+' : '−';
  const cls = tx.amount > 0 ? 'in' : 'out';
  d.innerHTML = `
    <div class="tx-ico ${tx.type}">${tx.icon}</div>
    <div class="tx-body">
      <div class="tx-title">${tx.title}</div>
      <div class="tx-time">${tx.time}</div>
    </div>
    <div class="tx-amt ${cls}">${sign}${toFa(Math.abs(tx.amount))}</div>
  `;
  return d;
}

function renderMarket(filter = 'all') {
  const c = document.getElementById('marketList');
  if (!c) return;
  c.innerHTML = '';
  let items = state.market;
  if (filter === 'crypto') items = items.filter(x => x.type === 'crypto');
  if (filter === 'gold') items = items.filter(x => x.type === 'gold');
  
  items.forEach(a => {
    const d = document.createElement('div');
    d.className = 'market-item';
    d.onclick = () => showAssetDetail(a.symbol);
    const cls = a.change >= 0 ? 'up' : 'down';
    const sign = a.change >= 0 ? '↑' : '↓';
    const price = toFa(a.price.toLocaleString()) + ' ' + a.unit;
    const iconHTML = a.symbol === 'TAT' 
      ? `<div class="market-coin">${getMiniCoinSVG(44)}</div>`
      : `<div class="market-icon">${a.icon}</div>`;
    d.innerHTML = `
      ${iconHTML}
      <div class="market-body">
        <div class="market-name">${a.name}</div>
        <div class="market-symbol">${a.symbol}</div>
      </div>
      <div class="market-price">
        <div class="market-price-val">${price}</div>
        <div class="market-price-change ${cls}">${sign} ${toFa(a.change)}٪</div>
      </div>
    `;
    c.appendChild(d);
  });
}

function renderAssets() {
  const c = document.getElementById('assetList');
  if (!c) return;
  c.innerHTML = '';
  const assets = [
    { symbol: 'TAT', name: 'TAT', icon: '🪙', amount: '۱٬۲۵۰', value: '۱۲۵٬۰۰۰', percent: 10, color: '#00B894' },
    { symbol: 'USDT', name: 'تتر', icon: '💵', amount: '۵', value: '۴۵۷٬۵۰۰', percent: 73, color: '#FDCB6E' },
    { symbol: 'GOLD18', name: 'طلای ۱۸ عیار', icon: '🥇', amount: '۰٫۱ گرم', value: '۲۳۴٬۵۰۰', percent: 17, color: '#6C5CE7' },
  ];
  assets.forEach(a => {
    const d = document.createElement('div');
    d.className = 'asset-item';
    d.onclick = () => showAssetDetail(a.symbol);
    const iconHTML = a.symbol === 'TAT' 
      ? `<div class="market-coin">${getMiniCoinSVG(40)}</div>`
      : `<div class="asset-icon" style="background:${a.color}22">${a.icon}</div>`;
    d.innerHTML = `
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
    c.appendChild(d);
  });
}

function renderApps() {
  const c = document.getElementById('appsList');
  if (!c) return;
  c.innerHTML = '';
  state.apps.forEach((app, idx) => {
    const d = document.createElement('div');
    d.className = 'app-card';
    d.onclick = () => showAppDetail(idx);
    d.innerHTML = `
      <div class="app-icon" style="background:rgba(0,184,148,0.15)">${app.icon}</div>
      <div class="app-body">
        <div class="app-name">${app.name}</div>
        <div class="app-meta">آخرین فعالیت: ${app.last}</div>
        <div class="app-stats"><span>واریز: ${toFa(app.in)}</span><span>برداشت: ${toFa(app.out)}</span></div>
      </div>
      <div class="app-balance">${toFa(app.balance)}</div>
    `;
    c.appendChild(d);
  });
}

// ================== MODALS ==================
function openModal(type) {
  const m = document.getElementById('modal-' + type);
  if (m) m.classList.add('show');
}
function closeModal() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
}
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) closeModal();
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
  const a = state.market.find(x => x.symbol === symbol);
  if (!a) return;
  document.getElementById('assetDetailName').textContent = a.name;
  document.getElementById('assetDetailPrice').textContent = toFa(a.price.toLocaleString()) + ' ' + a.unit;
  const ch = document.getElementById('assetDetailChange');
  ch.textContent = (a.change >= 0 ? '↑ ' : '↓ ') + toFa(a.change) + '٪';
  ch.className = 'asset-detail-change ' + (a.change >= 0 ? 'up' : 'down');
  const coinEl = document.getElementById('assetDetailCoin');
  if (symbol === 'TAT') {
    coinEl.innerHTML = getCoinSVG(100);
  } else {
    const color = symbol === 'USDT' ? '#FDCB6E' : '#6C5CE7';
    coinEl.innerHTML = `<div style="width:100px;height:100px;border-radius:50%;background:${color}22;display:flex;align-items:center;justify-content:center;font-size:50px;">${a.icon}</div>`;
  }
  openModal('asset');
}

// ================== APP DETAIL ==================
function showAppDetail(idx) {
  const a = state.apps[idx];
  if (!a) return;
  document.getElementById('appDetailIcon').textContent = a.icon;
  document.getElementById('appDetailName').textContent = a.name;
  openModal('app');
}

// ================== SEND ==================
function setAmount(v) {
  const i = document.getElementById('sendAmount');
  if (v === 'max') i.value = state.user.balance;
  else i.value = v;
}
function confirmSend() {
  const a = parseFloat(document.getElementById('sendAmount').value);
  if (!a || a <= 0) { showToast('مقدار معتبر وارد کن ❌'); return; }
  if (a > state.user.balance) { showToast('موجودی کافی نیست ❌'); return; }
  state.user.balance -= a;
  updateBalance();
  closeModal();
  showToast('ارسال شد ✅');
  document.getElementById('sendAmount').value = '';
}

// ================== BUY ==================
function openBuyModal(type) {
  document.getElementById('buyModalTitle').textContent = type === 'buy' ? '🟢 خرید TAT' : '🔴 فروش TAT';
  openModal('buy');
}
function setBuyAmount(p) {
  document.getElementById('buyAmount').value = Math.floor(1250000 * p / 100);
}
function confirmBuy() {
  const a = parseFloat(document.getElementById('buyAmount').value);
  if (!a || a <= 0) { showToast('مقدار معتبر وارد کن ❌'); return; }
  closeModal();
  showToast('معامله انجام شد ✅');
}

// ================== STAKE ==================
function openStakeModal(type, rate) {
  const labels = { flexible: 'انعطاف‌پذیر', '1m': '۱ ماهه', '3m': '۳ ماهه', '6m': '۶ ماهه' };
  document.getElementById('stakeTypeLabel').textContent = labels[type];
  document.getElementById('stakeRateLabel').textContent = toFa(rate) + '٪ سالانه';
  openModal('stake');
}
function setStakeAmount(p) {
  document.getElementById('stakeAmount').value = Math.floor(state.user.balance * p / 100);
}
function confirmStake() {
  const a = parseFloat(document.getElementById('stakeAmount').value);
  if (!a || a <= 0) { showToast('مقدار معتبر وارد کن ❌'); return; }
  closeModal();
  showToast('سپرده‌گذاری انجام شد ✅');
}

// ================== BALANCE ==================
function updateBalance() {
  document.getElementById('balanceValue').textContent = toFa(state.user.balance.toFixed(2)).replace('.', '٫');
}

// ================== TABS & FILTERS ==================
function initTabs() {
  document.querySelectorAll('.chart-tab').forEach(t => {
    t.addEventListener('click', function() {
      this.parentElement.querySelectorAll('.chart-tab').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
    });
  });
}
function initFilters() {
  document.querySelectorAll('.filter-chip').forEach(c => {
    c.addEventListener('click', function() {
      this.parentElement.querySelectorAll('.filter-chip').forEach(x => x.classList.remove('active'));
      this.classList.add('active');
      const f = this.dataset.filter;
      const page = this.closest('.page')?.dataset.page;
      if (page === 'market') renderMarket(f);
    });
  });
  
  const ms = document.getElementById('marketSearch');
  if (ms) {
    ms.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const c = document.getElementById('marketList');
      c.innerHTML = '';
      state.market.filter(a => a.name.toLowerCase().includes(q) || a.symbol.toLowerCase().includes(q)).forEach(a => {
        const d = document.createElement('div');
        d.className = 'market-item';
        d.onclick = () => showAssetDetail(a.symbol);
        const cls = a.change >= 0 ? 'up' : 'down';
        const sign = a.change >= 0 ? '↑' : '↓';
        const price = toFa(a.price.toLocaleString()) + ' ' + a.unit;
        const iconHTML = a.symbol === 'TAT' 
          ? `<div class="market-coin">${getMiniCoinSVG(44)}</div>`
          : `<div class="market-icon">${a.icon}</div>`;
        d.innerHTML = `
          ${iconHTML}
          <div class="market-body">
            <div class="market-name">${a.name}</div>
            <div class="market-symbol">${a.symbol}</div>
          </div>
          <div class="market-price">
            <div class="market-price-val">${price}</div>
            <div class="market-price-change ${cls}">${sign} ${toFa(a.change)}٪</div>
          </div>
        `;
        c.appendChild(d);
      });
    });
  }
}

// ================== UTILS ==================
function toFa(num) {
  const p = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(num).replace(/\d/g, d => p[d]);
}
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2200);
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

// ═══════════════════════════════════════════
// SETTINGS LOGIC
// ═══════════════════════════════════════════

function loadSettings() {
  const s = localStorage.getItem('tat_settings');
  if (s) Object.assign(settings, JSON.parse(s));
  applySettingsToUI();
}

function saveSettings() {
  localStorage.setItem('tat_settings', JSON.stringify(settings));
}

function applySettingsToUI() {
  const fp = document.getElementById('toggleFingerprint');
  const tfa = document.getElementById('toggle2FA');
  const txn = document.getElementById('toggleTxNotify');
  const pn = document.getElementById('togglePriceNotify');
  const rn = document.getElementById('toggleRewardNotify');
  const th = document.getElementById('toggleTheme');
  
  if (fp) fp.classList.toggle('active', settings.fingerprint);
  if (tfa) tfa.classList.toggle('active', settings.twoFA);
  if (txn) txn.classList.toggle('active', settings.txNotify);
  if (pn) pn.classList.toggle('active', settings.priceNotify);
  if (rn) rn.classList.toggle('active', settings.rewardNotify);
  if (th) th.classList.toggle('active', settings.darkMode);
  
  const lb = document.getElementById('langBadge');
  if (lb) {
    const langs = { fa: 'فارسی', en: 'English', ar: 'العربية' };
    lb.textContent = langs[settings.language] + ' ›';
  }
  
  const fb = document.getElementById('fontBadge');
  if (fb) {
    const fonts = { small: 'کوچیک', medium: 'متوسط', large: 'بزرگ' };
    fb.textContent = fonts[settings.fontSize] + ' ›';
  }
  
  document.documentElement.style.fontSize = 
    settings.fontSize === 'small' ? '14px' :
    settings.fontSize === 'large' ? '18px' : '16px';
  
  const ic = document.getElementById('inviteCount');
  const ir = document.getElementById('inviteReward');
  if (ic) ic.textContent = toFa(settings.inviteCount);
  if (ir) ir.textContent = toFa(settings.inviteReward);
}

function loadPersonalInfo() {
  const pi = localStorage.getItem('tat_personal_info');
  if (pi) {
    const info = JSON.parse(pi);
    if (info.name) {
      state.user.name = info.name;
      const un = document.getElementById('userName');
      if (un) un.textContent = info.name;
      const pn = document.getElementById('profileName');
      if (pn) pn.textContent = info.name;
      const ch = document.getElementById('cardHolder');
      if (ch) ch.textContent = info.name.toUpperCase();
      const chb = document.getElementById('cardHolderBack');
      if (chb) chb.textContent = info.name.toUpperCase();
    }
    const ep = document.getElementById('editPhone');
    if (ep && info.phone) ep.value = info.phone;
    const ee = document.getElementById('editEmail');
    if (ee && info.email) ee.value = info.email;
    const en = document.getElementById('editName');
    if (en && info.name) en.value = info.name;
  }
}

function openSettingsModal(type) {
  const m = document.getElementById('modal-' + type);
  if (m) m.classList.add('show');
  if (navigator.vibrate) navigator.vibrate(10);
}

// Change Password
function savePassword() {
  const o = document.getElementById('oldPassword').value;
  const n = document.getElementById('newPassword').value;
  const c = document.getElementById('confirmPassword').value;
  if (!o || !n || !c) { showToast('همه فیلدها رو پر کن ❌'); return; }
  if (n.length < 6) { showToast('رمز جدید حداقل ۶ کاراکتر باشه ❌'); return; }
  if (n !== c) { showToast('رمز جدید و تأییدش یکسان نیستن ❌'); return; }
  localStorage.setItem('tat_password', btoa(n));
  closeModal();
  showToast('رمز عبور با موفقیت تغییر کرد ✅');
  document.getElementById('oldPassword').value = '';
  document.getElementById('newPassword').value = '';
  document.getElementById('confirmPassword').value = '';
  document.getElementById('passwordStrength').innerHTML = '';
}

document.addEventListener('input', (e) => {
  if (e.target.id === 'newPassword') {
    const val = e.target.value;
    const s = document.getElementById('passwordStrength');
    if (!s) return;
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    const levels = [
      { t: 'خیلی ضعیف', c: '#ff4757', w: '20%' },
      { t: 'ضعیف', c: '#ff6b6b', w: '40%' },
      { t: 'متوسط', c: '#FDCB6E', w: '60%' },
      { t: 'خوب', c: '#00d97e', w: '80%' },
      { t: 'عالی', c: '#00B894', w: '100%' },
    ];
    const l = levels[Math.min(score, 4)];
    s.innerHTML = `<div style="height:4px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden; margin-top:8px;"><div style="height:100%; width:${l.w}; background:${l.c}; transition:0.3s;"></div></div><div style="font-size:11px; color:${l.c}; margin-top:4px;">${l.t}</div>`;
  }
});

// 2FA
function toggle2FA(el) {
  if (!settings.twoFA) openSettingsModal('2fa');
  else {
    if (confirm('2FA رو غیرفعال کنم؟')) {
      settings.twoFA = false;
      el.classList.remove('active');
      saveSettings();
      showToast('2FA غیرفعال شد 🔓');
    }
  }
}

function activate2FA() {
  const c = document.getElementById('twoFACode').value;
  if (c.length !== 6) { showToast('کد ۶ رقمی رو کامل وارد کن ❌'); return; }
  settings.twoFA = true;
  saveSettings();
  applySettingsToUI();
  closeModal();
  showToast('2FA فعال شد ✅');
  document.getElementById('twoFACode').value = '';
}

// Fingerprint
function toggleFingerprint(el) {
  settings.fingerprint = !settings.fingerprint;
  el.classList.toggle('active', settings.fingerprint);
  saveSettings();
  showToast(settings.fingerprint ? 'اثر انگشت فعال شد 👆' : 'اثر انگشت غیرفعال شد');
}

// Personal Info
function savePersonalInfo() {
  const name = document.getElementById('editName').value.trim();
  const phone = document.getElementById('editPhone').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  if (!name) { showToast('نام نمی‌تونه خالی باشه ❌'); return; }
  localStorage.setItem('tat_personal_info', JSON.stringify({ name, phone, email }));
  state.user.name = name;
  document.getElementById('userName').textContent = name;
  document.getElementById('profileName').textContent = name;
  const ch = document.getElementById('cardHolder');
  if (ch) ch.textContent = name.toUpperCase();
  const chb = document.getElementById('cardHolderBack');
  if (chb) chb.textContent = name.toUpperCase();
  closeModal();
  showToast('اطلاعات ذخیره شد ✅');
}

// Invite
function copyInviteLink() {
  copyText(document.getElementById('inviteLink').textContent);
}
function shareTelegram() {
  const l = document.getElementById('inviteLink').textContent;
  window.open('https://t.me/share/url?url=' + encodeURIComponent(l) + '&text=' + encodeURIComponent('با TAT Wallet آشنا شو! 🪙'), '_blank');
}
function shareWhatsApp() {
  const l = document.getElementById('inviteLink').textContent;
  window.open('https://wa.me/?text=' + encodeURIComponent('با TAT Wallet آشنا شو! 🪙 ' + l), '_blank');
}
function shareMore() {
  const l = document.getElementById('inviteLink').textContent;
  if (navigator.share) navigator.share({ title: 'TAT Wallet', text: 'با TAT Wallet آشنا شو! 🪙', url: l });
  else copyText(l);
}

// Reports
function switchReport(p, btn) {
  document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const data = {
    week: { in: '+۵۰۰', out: '−۲۰۰', stake: '+۱۲', total: '+۲۸۸' },
    month: { in: '+۲٬۵۰۰', out: '−۸۵۰', stake: '+۱۲۵', total: '+۱٬۷۷۵' },
    year: { in: '+۳۰٬۰۰۰', out: '−۱۰٬۲۰۰', stake: '+۱٬۵۰۰', total: '+۲۰٬۸۰۰' },
  };
  const d = data[p];
  const rows = document.querySelectorAll('#modal-reports .report-row');
  if (rows.length >= 4) {
    rows[0].querySelector('span:last-child').textContent = d.in + ' TAT';
    rows[1].querySelector('span:last-child').textContent = d.out + ' TAT';
    rows[2].querySelector('span:last-child').textContent = d.stake + ' TAT';
    rows[3].querySelector('span:last-child').textContent = d.total + ' TAT';
  }
}

function downloadReport() {
  const csv = `تاریخ,نوع,مقدار,توضیحات\n۱۴۰۵/۰۱/۰۱,واریز,+۵۰۰,افزایش موجودی\n۱۴۰۵/۰۱/۰۲,جایزه,+۵۰,Space Run\n۱۴۰۵/۰۱/۰۳,برداشت,−۱۰۰,ارسال به سارا\n۱۴۰۵/۰۱/۰۵,سود,+۱۲,سود سپرده روزانه`;
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'TAT-Report.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('گزارش دانلود شد 📥');
}

// Language
function setLanguage(lang, btn) {
  document.querySelectorAll('.lang-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  settings.language = lang;
  saveSettings();
  applySettingsToUI();
  const names = { fa: 'فارسی', en: 'English', ar: 'العربية' };
  closeModal();
  showToast('زبان به ' + names[lang] + ' تغییر کرد 🌐');
}

// FAQ
function toggleFaq(el) {
  el.classList.toggle('open');
  const i = el.querySelector('.faq-icon');
  i.textContent = el.classList.contains('open') ? '−' : '+';
}

// Support
function openChat() { showToast('چت زنده به‌زودی باز می‌شه 💬'); }
function openTelegram() { window.open('https://t.me/TATWalletSupport', '_blank'); }
function openEmail() { window.location.href = 'mailto:support@tat.wallet'; }

function sendTicket() {
  const s = document.getElementById('ticketSubject').value;
  const m = document.getElementById('ticketMessage').value.trim();
  if (!m) { showToast('توضیحات رو بنویس ❌'); return; }
  const tickets = JSON.parse(localStorage.getItem('tat_tickets') || '[]');
  tickets.push({ id: 'TKT-' + Date.now(), subject: s, message: m, date: new Date().toISOString(), status: 'open' });
  localStorage.setItem('tat_tickets', JSON.stringify(tickets));
  document.getElementById('ticketMessage').value = '';
  closeModal();
  showToast('تیکت با موفقیت ارسال شد ✅');
}

// Devices
function removeDevice(btn) {
  if (confirm('این دستگاه رو حذف کنم؟')) {
    btn.closest('.device-item').remove();
    showToast('دستگاه حذف شد ✅');
  }
}
function removeAllDevices() {
  if (confirm('از همه دستگاه‌ها خارج بشم؟')) {
    document.querySelectorAll('.device-item:not(.current)').forEach(d => d.remove());
    showToast('از همه دستگاه‌ها خارج شدی ✅');
  }
}

// Font Size
function setFontSize(s, btn) {
  document.querySelectorAll('.font-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  settings.fontSize = s;
  saveSettings();
  applySettingsToUI();
  closeModal();
  showToast('اندازه فونت تغییر کرد 📏');
}

// Theme
function toggleThemeSetting(el) {
  settings.darkMode = !settings.darkMode;
  el.classList.toggle('active', settings.darkMode);
  saveSettings();
  if (!settings.darkMode) {
    document.body.classList.add('light-mode');
    showToast('حالت روشن ☀️');
  } else {
    document.body.classList.remove('light-mode');
    showToast('حالت تیره 🌙');
  }
}

// Simple Toggles
function toggleSimple(el, key) {
  settings[key] = !settings[key];
  el.classList.toggle('active', settings[key]);
  saveSettings();
}
