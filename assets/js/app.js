/* ═══════════════════════════════════════════
   TAT Wallet — Application Logic (v1.2.0)
   ═══════════════════════════════════════════ */

// ═══════════════════════════════════════
// [بخش ۱] STATE
// ═══════════════════════════════════════

const state = {
  user: {
    id: null,
    name: null,
    userId: null,
    avatar: '👤',
    cardNumber: null,
    cvv: null,
    cardExpiry: null,
    balance: 0,
    rate: 100,
    profileLevel: 'basic',
    tier: 'bronze',
  },
  privacy: false,
  transactions: [],
  market: [
    { symbol: 'TAT', name: 'TAT', icon: '🪙', price: 100, change: 0.97, unit: 'تومان', type: 'tat' },
    { symbol: 'USDT', name: 'تتر', icon: '💵', price: 91500, change: 0.5, unit: 'تومان', type: 'crypto' },
    { symbol: 'GOLD18', name: 'طلای ۱۸ عیار', icon: '🥇', price: 2345000, change: 1.2, unit: 'تومان', type: 'gold' },
    { symbol: 'GOLD24', name: 'طلای ۲۴ عیار', icon: '🥇', price: 3127000, change: 1.3, unit: 'تومان', type: 'gold' },
    { symbol: 'OUNCE', name: 'اونس جهانی', icon: '💎', price: 2650, change: 0.8, unit: 'دلار', type: 'gold' },
  ],
  apps: [],
  notifications: [],
};

// ═══════════════════════════════════════
// [بخش ۲] SETTINGS
// ═══════════════════════════════════════

const settings = {
  fingerprint: false,
  twoFA: false,
  txNotify: true,
  priceNotify: true,
  rewardNotify: true,
  darkMode: true,
  language: 'fa',
  fontSize: 'medium',
};

// ═══════════════════════════════════════
// [بخش ۳] UTILS — توابع کمکی
// ═══════════════════════════════════════

function toFa(num) {
  const p = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return String(num).replace(/\d/g, d => p[d]);
}

function toPersianDigits(str) {
  if (!str) return '';
  const map = {
    '0':'۰','1':'۱','2':'۲','3':'۳','4':'۴',
    '5':'۵','6':'۶','7':'۷','8':'۸','9':'۹'
  };
  return String(str).replace(/[0-9]/g, d => map[d]);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
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

function formatTime(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const now = new Date();
  const diff = (now - d) / 1000;
  if (diff < 60) return 'همین الان';
  if (diff < 3600) return Math.floor(diff / 60) + ' دقیقه پیش';
  if (diff < 86400) return Math.floor(diff / 3600) + ' ساعت پیش';
  if (diff < 604800) return Math.floor(diff / 86400) + ' روز پیش';
  return d.toLocaleDateString('fa-IR');
}

function getTxIcon(type) {
  const icons = {
    transfer: '📤',
    invite_reward: '🎁',
    invite_reward_owner: '🎉',
    reward: '🎁',
    stake_interest: '📈',
    admin_credit: '💰',
    admin_debit: '📉',
    mint: '🪙',
    burn: '🔥',
  };
  return icons[type] || '💳';
}

// ═══════════════════════════════════════
// [بخش ۴] SVG COIN
// ═══════════════════════════════════════

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

// ═══════════════════════════════════════
// [بخش ۵] INIT — راه‌اندازی اولیه
// ═══════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
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
  
  renderMarket();
  initTabs();
  initFilters();
  loadSettings();
  
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
    
    const session = getSession();
    if (session && session.id) {
      Object.assign(state.user, session);
      document.getElementById('authPage').classList.remove('active');
      document.getElementById('mainApp').style.display = 'block';
      document.getElementById('nav').style.display = 'flex';
      updateUserUI();
      loadUserData();
    } else {
      document.getElementById('authPage').classList.add('active');
    }
  }, 2600);
});

// ═══════════════════════════════════════
// [بخش ۶] AUTH LOGIC
// ═══════════════════════════════════════

let pendingInviteCode = null;

function showInfo(key) {
  const el = document.getElementById('info-' + key);
  if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

async function verifyInviteCode() {
  const code = document.getElementById('inviteCodeInput').value.trim().toUpperCase();
  
  if (!code) { showToast('کد دعوت رو وارد کن ❌'); return; }
  if (!code.startsWith('TAT-')) { showToast('کد دعوت باید با TAT- شروع بشه ❌'); return; }
  
  pendingInviteCode = code;
  document.getElementById('authStep1').style.display = 'none';
  document.getElementById('authStep2').style.display = 'block';
  showToast('کد دعوت ثبت شد ✨');
}

async function completeRegistration() {
  const name = document.getElementById('regName').value.trim() || null;
  const phone = document.getElementById('regPhone').value.trim() || null;
  const email = document.getElementById('regEmail').value.trim() || null;
  const nationalId = document.getElementById('regNational').value.trim() || null;
  await performRegister(pendingInviteCode, name, phone, email, nationalId);
}

async function skipRegistrationInfo() {
  await performRegister(pendingInviteCode, null, null, null, null);
}

async function performRegister(inviteCode, name, phone, email, nationalId) {
  try {
    showToast('در حال ساخت حساب... ⏳');
    const result = await apiRegister(inviteCode, name, phone, email, nationalId);
    
    const user = {
      id: result.user.id,
      name: name || 'کاربر جدید',
      userId: result.user.userId,
      cardNumber: result.user.cardNumber,
      cvv: result.user.cvv,
      cardExpiry: result.user.cardExpiry,
      balance: result.user.balance,
      avatar: '👤',
      profileLevel: name ? 'semi' : 'basic',
      phone: phone,
      email: email,
    };
    saveSession(user);
    
    document.getElementById('authStep2').style.display = 'none';
    document.getElementById('authStep3').style.display = 'block';
    document.getElementById('newCardNumber').textContent = result.user.cardNumber;
    document.getElementById('newUserId').textContent = result.user.userId;
    document.getElementById('newReward').textContent = toFa(result.user.reward);
    
    Object.assign(state.user, user);
    if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
  } catch (error) {
    console.error(error);
    showToast(error.message || 'خطا در ثبت‌نام ❌');
  }
}

function enterApp() {
  document.getElementById('authPage').classList.remove('active');
  document.getElementById('mainApp').style.display = 'block';
  document.getElementById('nav').style.display = 'flex';
  updateUserUI();
  loadUserData();
  showToast('خوش اومدی ' + (state.user.name || 'دوست عزیز') + ' 🎉');
}

function showLogin() {
  document.getElementById('authStep1').style.display = 'none';
  document.getElementById('authLogin').style.display = 'block';
}

function showRegister() {
  document.getElementById('authLogin').style.display = 'none';
  document.getElementById('authStep1').style.display = 'block';
}

async function doLogin() {
  const input = document.getElementById('loginInput').value.trim();
  if (!input) { showToast('شماره موبایل یا آیدی رو وارد کن ❌'); return; }
  
  try {
    showToast('در حال ورود... ⏳');
    let phone = null, userId = null;
    if (input.startsWith('@')) userId = input;
    else phone = input;
    
    const result = await apiLogin(phone, null, userId);
    saveSession(result.user);
    Object.assign(state.user, result.user);
    
    document.getElementById('authPage').classList.remove('active');
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('nav').style.display = 'flex';
    
    updateUserUI();
    loadUserData();
    showToast('خوش اومدی ' + (state.user.name || 'دوست عزیز') + ' 🎉');
  } catch (error) {
    console.error(error);
    showToast(error.message || 'خطا در ورود ❌');
  }
}

function logout() {
  if (confirm('مطمئنی می‌خوای خارج بشی؟')) {
    clearSession();
    location.reload();
  }
}

// ═══════════════════════════════════════
// [بخش ۷] USER UI — نمایش اطلاعات کاربر
// ═══════════════════════════════════════

function updateUserUI() {
  const un = document.getElementById('userName');
  if (un) un.textContent = state.user.name || 'کاربر جدید';
  
  const pn = document.getElementById('profileName');
  if (pn) pn.textContent = state.user.name || 'کاربر جدید';
  const pi = document.getElementById('profileId');
  if (pi) pi.textContent = state.user.userId || '@user_xxx';
  const pa = document.getElementById('profileAvatar');
  if (pa) pa.textContent = state.user.avatar || '👤';
  
  const cn = document.getElementById('cardNumber');
  if (cn) cn.textContent = toPersianDigits(state.user.cardNumber || '۹۹۰۰ ۶۶۰۰ XXXX XXXX');
  
  const chb = document.getElementById('cardHolderBack');
  if (chb) chb.textContent = (state.user.name || 'USER').toUpperCase();
  
  const cv = document.getElementById('cardCVV');
  if (cv) cv.textContent = toFa(state.user.cvv || '۱۲۳');
  
  const bv = document.getElementById('balanceValue');
  if (bv) bv.textContent = toFa((state.user.balance || 0).toFixed(2)).replace('.', '٫');
  
  const bf = document.getElementById('balanceFiat');
  if (bf) bf.textContent = toFa(Math.floor((state.user.balance || 0) * 100)).replace(/\B(?=(\d{3})+(?!\d))/g, '٬') + ' تومان';
  
  const pq = document.getElementById('pqValTAT');
  if (pq) pq.textContent = toFa(Math.floor(state.user.balance || 0));
  
  const ha = document.getElementById('headerAvatar');
  if (ha) ha.textContent = state.user.avatar || '👤';
  
  const rcv = document.getElementById('receiveUserId');
  if (rcv) rcv.textContent = state.user.userId || '@user_xxx';
  const rcc = document.getElementById('receiveCardNumber');
  if (rcc) rcc.textContent = state.user.cardNumber || '۹۹۰۰ ۶۶۰۰ XXXX XXXX';
  
  const sfc = document.getElementById('sendFromCard');
  if (sfc) sfc.textContent = state.user.cardNumber || '۹۹۰۰ ۶۶۰۰ XXXX XXXX';
  const sfb = document.getElementById('sendFromBalance');
  if (sfb) sfb.textContent = 'موجودی: ' + toFa(Math.floor(state.user.balance || 0)) + ' TAT';
  
  const sfbal = document.getElementById('stakeFromBalance');
  if (sfbal) sfbal.textContent = toFa(Math.floor(state.user.balance || 0)) + ' TAT';
  
  const eid = document.getElementById('editUserId');
  if (eid) eid.value = state.user.userId || '@user_xxx';
  const en = document.getElementById('editName');
  if (en && state.user.name) en.value = state.user.name;
  const ep = document.getElementById('editPhone');
  if (ep && state.user.phone) ep.value = state.user.phone;
  const ee = document.getElementById('editEmail');
  if (ee && state.user.email) ee.value = state.user.email;
  
  const il = document.getElementById('inviteLink');
  if (il) il.textContent = 'https://tat.wallet/invite/' + (state.user.userId || 'xxx').replace('@', '');
}

async function loadUserData() {
  if (!state.user.id) return;
  try {
    const txs = await apiGetTransactions(state.user.id);
    state.transactions = txs.map(tx => ({
      id: tx.id,
      type: tx.type === 'transfer' ? (tx.from_user === state.user.id ? 'out' : 'in') : tx.type,
      title: tx.description || 'تراکنش',
      time: formatTime(tx.created_at),
      amount: tx.from_user === state.user.id ? -tx.amount : tx.amount,
      icon: getTxIcon(tx.type),
      raw: tx,
    }));
    renderRecentTxs();
    renderHistory();
    
    const notifs = await apiGetNotifications(state.user.id);
    state.notifications = notifs;
    renderNotifications();
    
    const prices = await apiGetPrices();
    if (prices && prices.length) {
      state.market = state.market.map(m => {
        const p = prices.find(x => x.symbol === m.symbol);
        return p ? { ...m, price: parseFloat(p.price), change: parseFloat(p.change_24h) } : m;
      });
      renderMarket();
    }
  } catch (e) {
    console.error('loadUserData error:', e);
  }
}

// ═══════════════════════════════════════
// [بخش ۸] NAVIGATION
// ═══════════════════════════════════════

function goTo(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.querySelector(`[data-page="${pageName}"]`);
  if (page) page.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navBtn = document.querySelector(`[data-nav="${pageName}"]`);
  if (navBtn) navBtn.classList.add('active');
  window.scrollTo(0, 0);
}

function flipCard() {
  document.getElementById('cardFlip').classList.toggle('flipped');
  if (navigator.vibrate) navigator.vibrate(15);
}

function togglePrivacy() {
  state.privacy = !state.privacy;
  document.getElementById('balanceMain').classList.toggle('hidden', state.privacy);
  document.getElementById('balanceFiatBox').classList.toggle('hidden', state.privacy);
  document.getElementById('eyeBtn').textContent = state.privacy ? '🙈' : '👁';
}

// ═══════════════════════════════════════
// [بخش ۹] RENDER — نمایش لیست‌ها
// ═══════════════════════════════════════

function renderRecentTxs() {
  const c = document.getElementById('recentTxs');
  if (!c) return;
  c.innerHTML = '';
  if (!state.transactions.length) {
    c.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-dim); font-size:12px;">هنوز تراکنشی نداری</div>';
    return;
  }
  state.transactions.slice(0, 3).forEach(tx => c.appendChild(createTxEl(tx)));
}

function renderHistory() {
  const c = document.getElementById('historyList');
  if (!c) return;
  c.innerHTML = '';
  if (!state.transactions.length) {
    c.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim); font-size:13px;">هنوز تراکنشی نداری</div>';
    return;
  }
  state.transactions.forEach(tx => c.appendChild(createTxEl(tx)));
}

function renderNotifications() {
  const c = document.getElementById('notificationsList');
  if (!c) return;
  c.innerHTML = '';
  if (!state.notifications.length) {
    c.innerHTML = '<div style="text-align:center; padding:40px; color:var(--text-dim); font-size:13px;">اعلانی نداری</div>';
    return;
  }
  state.notifications.forEach(n => {
    const d = document.createElement('div');
    d.className = 'tx';
    d.innerHTML = `
      <div class="tx-ico" style="background:rgba(0,184,148,0.15)">${n.icon || '🔔'}</div>
      <div class="tx-body">
        <div class="tx-title">${n.title}</div>
        <div class="tx-time">${n.message || ''}</div>
      </div>
      <div class="tx-time">${formatTime(n.created_at)}</div>
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

// ═══════════════════════════════════════
// [بخش ۱۰] MODALS
// ═══════════════════════════════════════

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

function showTxDetail(tx) {
  document.getElementById('txDetailIcon').textContent = tx.icon;
  const sign = tx.amount > 0 ? '+' : '−';
  document.getElementById('txDetailAmount').textContent = sign + toFa(Math.abs(tx.amount)) + ' TAT';
  document.getElementById('txDetailAmount').style.color = tx.amount > 0 ? 'var(--success)' : 'var(--danger)';
  document.getElementById('txDetailTitle').textContent = tx.title;
  openModal('tx');
}

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
  const hv = document.getElementById('assetHoldingValue');
  if (hv) hv.textContent = toFa(Math.floor(state.user.balance || 0)) + ' TAT';
  openModal('asset');
}

function showAppDetail(idx) {
  const a = state.apps[idx];
  if (!a) return;
  document.getElementById('appDetailIcon').textContent = a.icon;
  document.getElementById('appDetailName').textContent = a.name;
  openModal('app');
}

// ═══════════════════════════════════════
// [بخش ۱۱] SEND — ارسال TAT
// ═══════════════════════════════════════

function setAmount(v) {
  const i = document.getElementById('sendAmount');
  if (v === 'max') i.value = Math.floor(state.user.balance || 0);
  else i.value = v;
}

async function confirmSend() {
  const recipient = document.getElementById('sendRecipient').value.trim();
  const amount = parseFloat(document.getElementById('sendAmount').value);
  const note = document.getElementById('sendNote').value.trim() || null;
  
  if (!recipient) { showToast('آیدی گیرنده رو وارد کن ❌'); return; }
  if (!amount || amount <= 0) { showToast('مقدار معتبر وارد کن ❌'); return; }
  if (amount > state.user.balance) { showToast('موجودی کافی نیست ❌'); return; }
  
  // چک رمز دوم
  const hasPass = await checkSecondPassword();
  if (!hasPass) return;
  
  // ذخیره برای بعد
  pendingTransfer = { recipient, amount, note };
  
  // بستن مودال ارسال + باز کردن مودال رمز دوم
  closeModal();
  setTimeout(() => openSecondPassModal({ recipient, amount, note }), 300);
}

// ═══════════════════════════════════════
// [بخش ۱۲] BUY / SELL
// ═══════════════════════════════════════

function openBuyModal(type) {
  document.getElementById('buyModalTitle').textContent = type === 'buy' ? '🟢 خرید TAT' : '🔴 فروش TAT';
  openModal('buy');
}

function setBuyAmount(p) {
  const bal = Math.floor((state.user.balance || 0) * 100);
  document.getElementById('buyAmount').value = Math.floor(bal * p / 100);
}

function confirmBuy() {
  const a = parseFloat(document.getElementById('buyAmount').value);
  if (!a || a <= 0) { showToast('مقدار معتبر وارد کن ❌'); return; }
  closeModal();
  showToast('در نسخه بعدی فعال میشه 🚧');
}

// ═══════════════════════════════════════
// [بخش ۱۳] STAKE — سپرده‌گذاری
// ═══════════════════════════════════════

function openStakeModal(type, rate) {
  const labels = { flexible: 'انعطاف‌پذیر', '1m': '۱ ماهه', '3m': '۳ ماهه', '6m': '۶ ماهه' };
  document.getElementById('stakeTypeLabel').textContent = labels[type];
  document.getElementById('stakeRateLabel').textContent = toFa(rate) + '٪ سالانه';
  openModal('stake');
}

function setStakeAmount(p) {
  document.getElementById('stakeAmount').value = Math.floor((state.user.balance || 0) * p / 100);
}

function confirmStake() {
  const a = parseFloat(document.getElementById('stakeAmount').value);
  if (!a || a <= 0) { showToast('مقدار معتبر وارد کن ❌'); return; }
  closeModal();
  showToast('سپرده‌گذاری در نسخه بعدی 🚧');
}

// ═══════════════════════════════════════
// [بخش ۱۴] BANK ACCOUNTS — حساب‌های بانکی
// ═══════════════════════════════════════

let currentAccountForPDF = null;

async function openBankAccounts() {
  openModal('bank-accounts');
  await loadBankAccounts();
}

async function loadBankAccounts() {
  const container = document.getElementById('bankAccountsList');
  if (!container) return;
  
  container.innerHTML = '<div class="loading">در حال بارگذاری...</div>';

  try {
    const accounts = await apiGetBankAccounts(state.user.id);
    
    if (!accounts.length) {
      container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-dim);">هنوز حسابی نداری</div>';
      return;
    }

    container.innerHTML = accounts.map(acc => `
      <div class="bank-account-card ${acc.is_default ? 'default' : ''}">
        <div class="bank-account-header">
          <div class="bank-account-icon">
            ${acc.account_type === 'main' ? '🟢' : 
              acc.account_type === 'savings' ? '🟡' :
              acc.account_type === 'vip' ? '💎' : '🏦'}
          </div>
          <div class="bank-account-title">
            <div class="bank-account-name">
              ${acc.account_type === 'main' ? 'حساب اصلی' :
                acc.account_type === 'savings' ? 'حساب ذخیره' :
                acc.account_type === 'vip' ? 'حساب VIP' : 'حساب'}
            </div>
            <div class="bank-account-type">${acc.bank_name || 'TAT Bank'}</div>
          </div>
        </div>

        <div class="bank-account-rows">
          <div class="bank-account-row">
            <span class="label">شماره کارت:</span>
            <span class="value" onclick="copyText('${acc.card_number}')">
              ${acc.card_number}
            </span>
          </div>
          <div class="bank-account-row">
            <span class="label">شماره حساب:</span>
            <span class="value" onclick="copyText('${acc.account_number}')">
              ${acc.account_number}
            </span>
          </div>
          <div class="bank-account-row">
            <span class="label">شبا:</span>
            <span class="value" style="font-size:11px;" onclick="copyText('${acc.sheba_number}')">
              ${acc.sheba_number}
            </span>
          </div>
        </div>

        <div class="bank-account-actions">
          <button class="bank-account-btn" onclick="viewAccountDetails('${acc.id}')">
            👁 جزئیات
          </button>
          <button class="bank-account-btn" onclick="copyAccountAll('${acc.id}')">
            📋 کپی همه
          </button>
          ${!acc.is_default ? `
            <button class="bank-account-btn" onclick="setDefaultAccount('${acc.id}')">
              ⭐ پیش‌فرض
            </button>
          ` : ''}
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('loadBankAccounts error:', error);
    container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--danger);">خطا در بارگذاری</div>';
  }
}

async function viewAccountDetails(accountId) {
  try {
    const accounts = await apiGetBankAccounts(state.user.id);
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return;

    currentAccountForPDF = acc;

    document.getElementById('accountDetailsContent').innerHTML = `
      <div class="account-detail-row">
        <span class="label">نوع حساب:</span>
        <span class="value" style="direction:rtl;">
          ${acc.account_type === 'main' ? '🟢 حساب اصلی' :
            acc.account_type === 'savings' ? '🟡 حساب ذخیره' :
            acc.account_type === 'vip' ? '💎 حساب VIP' : '🏦 حساب'}
        </span>
      </div>
      <div class="account-detail-row">
        <span class="label">نام صاحب:</span>
        <span class="value" style="direction:rtl;">${acc.holder_name || '-'}</span>
      </div>
      <div class="account-detail-row">
        <span class="label">بانک:</span>
        <span class="value" style="direction:rtl;">${acc.bank_name || 'TAT Bank'}</span>
      </div>
      <div class="account-detail-row">
        <span class="label">شماره کارت:</span>
        <span class="value" onclick="copyText('${acc.card_number}')">${acc.card_number}</span>
      </div>
      <div class="account-detail-row">
        <span class="label">شماره حساب:</span>
        <span class="value" onclick="copyText('${acc.account_number}')">${acc.account_number}</span>
      </div>
      <div class="account-detail-row">
        <span class="label">شبا:</span>
        <span class="value" style="font-size:11px;" onclick="copyText('${acc.sheba_number}')">${acc.sheba_number}</span>
      </div>
      <div class="account-detail-row">
        <span class="label">CVV2:</span>
        <span class="value" onclick="copyText('${acc.cvv}')">${acc.cvv}</span>
      </div>
      <div class="account-detail-row">
        <span class="label">تاریخ انقضا:</span>
        <span class="value">${acc.card_expiry || '۱۲/۳۰'}</span>
      </div>
    `;

    closeModal();
    setTimeout(() => openModal('account-details'), 200);

  } catch (error) {
    console.error('viewAccountDetails error:', error);
    showToast('خطا در بارگذاری جزئیات');
  }
}

function copyAccountAll(accountId) {
  apiGetBankAccounts(state.user.id).then(accounts => {
    const acc = accounts.find(a => a.id === accountId);
    if (!acc) return;

    const text = `🏦 ${acc.bank_name || 'TAT Bank'}
👤 صاحب: ${acc.holder_name}
💳 شماره کارت: ${acc.card_number}
🔢 شماره حساب: ${acc.account_number}
🏛 شبا: ${acc.sheba_number}`;

    copyText(text);
  });
}

async function setDefaultAccount(accountId) {
  try {
    await supabase
      .from('bank_accounts')
      .update({ is_default: false })
      .eq('user_id', state.user.id);

    await supabase
      .from('bank_accounts')
      .update({ is_default: true })
      .eq('id', accountId);

    await supabase
      .from('users')
      .update({ default_account_id: accountId })
      .eq('id', state.user.id);

    showToast('حساب پیش‌فرض تغییر کرد ⭐');
    loadBankAccounts();

  } catch (error) {
    console.error('setDefaultAccount error:', error);
    showToast('خطا در تغییر پیش‌فرض');
  }
}

function openNewAccountModal() {
  closeModal();
  setTimeout(() => {
    document.getElementById('newAccountHolder').value = state.user.name || '';
    openModal('new-account');
  }, 200);
}

async function createNewAccount() {
  const holderName = document.getElementById('newAccountHolder').value.trim();
  const accountType = document.getElementById('newAccountType').value;

  if (!holderName) {
    showToast('نام صاحب حساب رو وارد کن ❌');
    return;
  }

  try {
    showToast('در حال ساخت حساب... ⏳');
    await apiCreateBankAccount(state.user.id, holderName, accountType);
    closeModal();
    showToast('حساب جدید ساخته شد ✅');
    setTimeout(() => {
      openModal('bank-accounts');
      loadBankAccounts();
    }, 200);

  } catch (error) {
    console.error('createNewAccount error:', error);
    showToast(error.message || 'خطا در ساخت حساب');
  }
}

function downloadAccountPDF() {
  if (!currentAccountForPDF) {
    showToast('اول یه حساب انتخاب کن');
    return;
  }

  const acc = currentAccountForPDF;
  
  const content = `
    <!DOCTYPE html>
    <html dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>کارت TAT</title>
      <style>
        body { font-family: Tahoma, sans-serif; padding: 40px; background: #f0f0f0; }
        .card {
          width: 500px;
          height: 300px;
          background: linear-gradient(135deg, #00B894, #006b54);
          border-radius: 20px;
          color: white;
          padding: 30px;
          box-sizing: border-box;
          position: relative;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          margin: 0 auto;
        }
        .card-logo { font-size: 24px; font-weight: bold; }
        .card-number { 
          font-size: 24px; 
          letter-spacing: 3px; 
          margin-top: 60px; 
          direction: ltr; 
          text-align: center;
        }
        .card-bottom {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
          font-size: 14px;
        }
        .card-bottom > div { text-align: center; }
        .card-label { font-size: 10px; opacity: 0.8; }
        .card-value { font-size: 14px; font-weight: bold; margin-top: 3px; }
        .extra-info {
          margin: 30px auto 0;
          max-width: 500px;
          background: white;
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .extra-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .extra-row:last-child { border-bottom: none; }
        .extra-row span:first-child { color: #666; }
        .extra-row span:last-child { font-weight: bold; direction: ltr; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="card-logo">تات</div>
        <div class="card-number">${acc.card_number}</div>
        <div class="card-bottom">
          <div>
            <div class="card-label">صاحب کارت</div>
            <div class="card-value">${acc.holder_name || '-'}</div>
          </div>
          <div>
            <div class="card-label">انقضا</div>
            <div class="card-value">${acc.card_expiry || '۱۲/۳۰'}</div>
          </div>
          <div>
            <div class="card-label">CVV2</div>
            <div class="card-value">${acc.cvv}</div>
          </div>
        </div>
      </div>

      <div class="extra-info">
        <div class="extra-row">
          <span>شماره حساب</span>
          <span>${acc.account_number}</span>
        </div>
        <div class="extra-row">
          <span>شماره شبا</span>
          <span>${acc.sheba_number}</span>
        </div>
        <div class="extra-row">
          <span>بانک</span>
          <span>${acc.bank_name || 'TAT Bank'}</span>
        </div>
      </div>

      <script>
        window.onload = () => {
          setTimeout(() => window.print(), 500);
        };
      <\/script>
    </body>
    </html>
  `;

  const w = window.open('', '_blank');
  w.document.write(content);
  w.document.close();
}

// ═══════════════════════════════════════
// [بخش ۱۵] SECOND PASSWORD — رمز دوم
// ═══════════════════════════════════════

let pendingTransfer = null;

async function checkSecondPassword() {
  try {
    const hasPass = await apiHasSecondPassword(state.user.id);
    
    if (!hasPass) {
      openModal('set-2pass');
      return false;
    }
    return true;
  } catch (error) {
    console.error('checkSecondPassword error:', error);
    return false;
  }
}

async function saveSecondPassword() {
  const pass = document.getElementById('newSecondPass').value.trim();
  const confirm = document.getElementById('confirmSecondPass').value.trim();

  if (pass.length !== 6 || !/^\d{6}$/.test(pass)) {
    showToast('رمز دوم باید ۶ رقم باشه ❌');
    return;
  }

  if (pass !== confirm) {
    showToast('رمز و تأییدش یکسان نیستن ❌');
    return;
  }

  try {
    showToast('در حال ذخیره... ⏳');
    await apiSetSecondPassword(state.user.id, pass);
    closeModal();
    showToast('رمز دوم با موفقیت ذخیره شد ✅');
    document.getElementById('newSecondPass').value = '';
    document.getElementById('confirmSecondPass').value = '';
  } catch (error) {
    console.error('saveSecondPassword error:', error);
    showToast(error.message || 'خطا در ذخیره');
  }
}

function openSecondPassModal(transferData) {
  pendingTransfer = transferData;
  
  document.getElementById('confirmTransferAmount').textContent = 
    toFa(transferData.amount) + ' TAT';
  document.getElementById('enterSecondPass').value = '';
  document.getElementById('secondPassError').textContent = '';
  
  openModal('enter-2pass');
  setTimeout(() => {
    document.getElementById('enterSecondPass').focus();
  }, 300);
}

async function confirmTransferWithPassword() {
  const pass = document.getElementById('enterSecondPass').value.trim();
  const errEl = document.getElementById('secondPassError');

  if (pass.length !== 6) {
    errEl.textContent = 'رمز دوم باید ۶ رقم باشه';
    return;
  }

  errEl.textContent = '';

  try {
    const result = await apiVerifySecondPassword(state.user.id, pass);

    if (!result.success) {
      errEl.textContent = result.error || 'رمز اشتباه است';
      if (result.locked_until) {
        showToast('حساب موقتاً قفل شد 🔒');
      }
      return;
    }

    closeModal();
    await executePendingTransfer();

  } catch (error) {
    console.error('confirmTransferWithPassword error:', error);
    errEl.textContent = 'خطا در تأیید رمز';
  }
}

async function executePendingTransfer() {
  if (!pendingTransfer) return;

  try {
    showToast('در حال انتقال... ⏳');
    
    const result = await apiTransfer(
      state.user.id,
      pendingTransfer.recipient,
      pendingTransfer.amount,
      pendingTransfer.note
    );
    
    state.user.balance = result.newBalance;
    saveSession(state.user);
    updateUserUI();
    
    showToast('انتقال انجام شد ✅');
    
    document.getElementById('sendRecipient').value = '';
    document.getElementById('sendAmount').value = '';
    document.getElementById('sendNote').value = '';
    
    pendingTransfer = null;
    
    await loadUserData();
    
  } catch (error) {
    console.error('executePendingTransfer error:', error);
    showToast(error.message || 'خطا در انتقال');
  }
}

// ═══════════════════════════════════════
// [بخش ۱۶] SETTINGS
// ═══════════════════════════════════════

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
}

function openSettingsModal(type) {
  const m = document.getElementById('modal-' + type);
  if (m) m.classList.add('show');
  if (navigator.vibrate) navigator.vibrate(10);
}

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

function toggleFingerprint(el) {
  settings.fingerprint = !settings.fingerprint;
  el.classList.toggle('active', settings.fingerprint);
  saveSettings();
  showToast(settings.fingerprint ? 'اثر انگشت فعال شد 👆' : 'اثر انگشت غیرفعال شد');
}

async function savePersonalInfo() {
  const name = document.getElementById('editName').value.trim();
  const phone = document.getElementById('editPhone').value.trim();
  const email = document.getElementById('editEmail').value.trim();
  
  if (!state.user.id) {
    showToast('ابتدا وارد حساب شو ❌');
    return;
  }
  
  if (!name && !phone && !email) {
    showToast('حداقل یه فیلد رو پر کن ❌');
    return;
  }
  
  try {
    showToast('در حال ذخیره... ⏳');
    
    const result = await apiUpdateProfile(
      state.user.id,
      name || null,
      phone || null,
      email || null,
      state.user.avatar
    );
    
    state.user.name = result.user.name;
    state.user.phone = result.user.phone;
    state.user.email = result.user.email;
    state.user.profileLevel = result.user.profileLevel;
    
    saveSession(state.user);
    updateUserUI();
    
    closeModal();
    showToast('اطلاعات در دیتابیس ذخیره شد ✅');
    
  } catch (error) {
    console.error('savePersonalInfo error:', error);
    showToast(error.message || 'خطا در ذخیره اطلاعات ❌');
  }
}

function copyInviteLink() {
  copyText(document.getElementById('inviteLink').textContent);
}

function copyMyActiveCode() {
  const code = document.getElementById('myActiveCode').textContent;
  if (code && code !== '-') copyText(code);
}

async function createNewInviteCode() {
  if (!state.user.id) {
    showToast('ابتدا وارد حساب شو ❌');
    return;
  }
  
  try {
    showToast('در حال ساخت کد... ⏳');
    const result = await apiCreateInviteCode(state.user.id, 'normal');
    document.getElementById('myActiveCode').textContent = result.code;
    showToast('کد ساخته شد ✅');
  } catch (e) {
    console.error('createNewInviteCode error:', e);
    showToast(e.message || 'خطا در ساخت کد');
  }
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

function switchReport(p, btn) {
  document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  showToast('گزارش ' + p + ' بارگذاری شد');
}

function downloadReport() {
  const csv = `تاریخ,نوع,مقدار,توضیحات\n`;
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'TAT-Report.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('گزارش دانلود شد 📥');
}

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

function toggleFaq(el) {
  el.classList.toggle('open');
  const i = el.querySelector('.faq-icon');
  i.textContent = el.classList.contains('open') ? '−' : '+';
}

function openTelegram() { 
  window.open('https://t.me/TATWalletSupport', '_blank'); 
}

function openEmail() { 
  window.location.href = 'mailto:support@tat.wallet'; 
}

function setFontSize(s, btn) {
  document.querySelectorAll('.font-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  settings.fontSize = s;
  saveSettings();
  applySettingsToUI();
  closeModal();
  showToast('اندازه فونت تغییر کرد 📏');
}

function toggleThemeSetting(el) {
  settings.darkMode = !settings.darkMode;
  el.classList.toggle('active', settings.darkMode);
  saveSettings();
  if (!settings.darkMode) {
    document.body.classList.add('light-mode');
    showToast('حالت روشن ☀️');
  } else {
    document.body.classList.remove('light-mode');
    showToast('حالت تاریک 🌙');
  }
}

function toggleSimple(el, key) {
  settings[key] = !settings[key];
  el.classList.toggle('active', settings[key]);
  saveSettings();
}

function copyMyUserId() {
  if (state.user.userId) copyText(state.user.userId);
}

function copyMyCard() {
  if (state.user.cardNumber) copyText(state.user.cardNumber);
}

// ═══════════════════════════════════════
// [بخش ۱۷] INIT TABS & FILTERS
// ═══════════════════════════════════════

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

// ↓↓↓ کدهای جدید همیشه اینجا اضافه میشن ↓↓↓
