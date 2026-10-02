/* ═══════════════════════════════════════════
   TAT Wallet — Supabase Client (v1.2.0)
   ═══════════════════════════════════════════ */

// ═══════════════════════════════════════
// [بخش ۱] CONFIG
// ═══════════════════════════════════════

const SUPABASE_URL = 'https://lvujgergogwodfskkqrh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2dWpnZXJnb2d3b2Rmc2trcXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDYwNTEsImV4cCI6MjEwNTMyMjA1MX0.W1OPbhAaBbtJrfgir3Nez4iP8tBWShXv7wFYkYGNKrY';

var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ═══════════════════════════════════════
// [بخش ۲] AUTH
// ═══════════════════════════════════════

async function apiRegister(inviteCode, name, phone, email, nationalId) {
  const { data, error } = await supabase.functions.invoke('register', {
    body: { inviteCode, name, phone, email, nationalId }
  });
  if (error) throw new Error(error.message || 'خطا در ثبت‌نام');
  if (data.error) throw new Error(data.error);
  return data;
}

async function apiLogin(phone, email, userId) {
  const { data, error } = await supabase.functions.invoke('login', {
    body: { phone, email, userId }
  });
  if (error) throw new Error(error.message || 'خطا در ورود');
  if (data.error) throw new Error(data.error);
  return data;
}

// ═══════════════════════════════════════
// [بخش ۳] UPDATE PROFILE
// ═══════════════════════════════════════

async function apiUpdateProfile(userId, name, phone, email, avatar) {
  const { data, error } = await supabase.functions.invoke('update-profile', {
    body: { userId, name, phone, email, avatar }
  });
  if (error) throw new Error(error.message || 'خطا در بروزرسانی');
  if (data.error) throw new Error(data.error);
  return data;
}

// ═══════════════════════════════════════
// [بخش ۴] INVITE CODES
// ═══════════════════════════════════════

async function apiCreateInviteCode(userId, type = 'normal', message = null) {
  const { data, error } = await supabase.functions.invoke('create-invite-code', {
    body: { userId, type, message }
  });
  if (error) throw new Error(error.message);
  if (data.error) throw new Error(data.error);
  return data.code;
}

async function apiGetMyInviteCodes() {
  const { data, error } = await supabase
    .from('invite_codes')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function apiGetInviteStats(userId) {
  const { data, error } = await supabase
    .from('invite_stats')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || { total_invited: 0, total_reward: 0, active_codes: 0 };
}

// ═══════════════════════════════════════
// [بخش ۵] TRANSACTIONS
// ═══════════════════════════════════════

async function apiTransfer(userId, recipient, amount, note) {
  const { data, error } = await supabase.functions.invoke('transfer', {
    body: { fromUserId: userId, recipient, amount, note }
  });
  if (error) throw new Error(error.message);
  if (data.error) throw new Error(data.error);
  return data;
}

async function apiGetTransactions(userId, limit = 50) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .or(`from_user.eq.${userId},to_user.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

// ═══════════════════════════════════════
// [بخش ۶] PRICES
// ═══════════════════════════════════════

async function apiGetPrices() {
  const { data, error } = await supabase
    .from('prices')
    .select('*')
    .eq('is_active', true);
  if (error) throw error;
  return data || [];
}

// ═══════════════════════════════════════
// [بخش ۷] NOTIFICATIONS
// ═══════════════════════════════════════

async function apiGetNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return data || [];
}

// ═══════════════════════════════════════
// [بخش ۸] BANK ACCOUNTS
// ═══════════════════════════════════════

async function apiGetBankAccounts(userId) {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('is_default', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function apiCreateBankAccount(userId, holderName, accountType) {
  const { data, error } = await supabase.functions.invoke('create-bank-account', {
    body: { userId, holderName, accountType }
  });
  if (error) throw new Error(error.message);
  if (data.error) throw new Error(data.error);
  return data.account;
}

// ═══════════════════════════════════════
// [بخش ۹] SECOND PASSWORD
// ═══════════════════════════════════════

async function apiSetSecondPassword(userId, password) {
  const { data, error } = await supabase.rpc('set_second_password', {
    p_user_id: userId,
    p_password: password
  });
  if (error) throw error;
  return data;
}

async function apiVerifySecondPassword(userId, password) {
  const { data, error } = await supabase.rpc('verify_second_password', {
    p_user_id: userId,
    p_password: password
  });
  if (error) throw error;
  return data;
}

async function apiHasSecondPassword(userId) {
  const { data, error } = await supabase
    .from('user_security')
    .select('second_password_hash')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return !!(data && data.second_password_hash);
}

// ═══════════════════════════════════════
// [بخش ۱۰] SESSION (Local)
// ═══════════════════════════════════════

function getSession() {
  try {
    const data = localStorage.getItem('tat_user');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function saveSession(user) {
  localStorage.setItem('tat_user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('tat_user');
}

// ↓↓↓ کدهای جدید همیشه اینجا اضافه میشن ↓↓↓
