/* ═══════════════════════════════════════════
   TAT Wallet — Supabase Client
   ═══════════════════════════════════════════ */

const SUPABASE_URL = 'https://lvujgergogwodfskkqrh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2dWpnZXJnb2d3b2Rmc2trcXJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3NDYwNTEsImV4cCI6MjEwNTMyMjA1MX0.W1OPbhAaBbtJrfgir3Nez4iP8tBWShXv7wFYkYGNKrY';

var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ═══ Auth ═══
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

// ═══ Invite Codes ═══
async function apiCreateInviteCode(type = 'normal', message = null) {
  const { data, error } = await supabase.functions.invoke('create-invite-code', {
    body: { type, message }
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
  return data;
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

// ═══ Transactions ═══
async function apiTransfer(recipient, amount, note) {
  const { data, error } = await supabase.functions.invoke('transfer', {
    body: { recipient, amount, note }
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

// ═══ Prices ═══
async function apiGetPrices() {
  const { data, error } = await supabase
    .from('prices')
    .select('*')
    .eq('is_active', true);
  if (error) throw error;
  return data || [];
}

// ═══ Notifications ═══
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

