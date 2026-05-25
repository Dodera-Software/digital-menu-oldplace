// Client helper for the server-side admin API (/api/admin).
// The browser never holds the service-role key or admin password — it only
// holds a short-lived token returned after a successful login.
import supabase from './supabase';

const TOKEN_KEY = 'admin_token';

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem('admin_authenticated');
}

async function post(payload) {
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.ok === false) {
    if (res.status === 401 && payload.action !== 'login') clearSession();
    throw new Error(json.error || `Request failed (${res.status})`);
  }
  return json;
}

export async function adminLogin(email, password) {
  const { token } = await post({ action: 'login', email, password });
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem('admin_authenticated', 'true');
  return token;
}

// Authenticated write call. Returns the `data` field (may be undefined).
export async function adminCall(action, payload = {}) {
  const json = await post({ action, token: getToken(), ...payload });
  return json.data;
}

// Upload an image: ask the server for a signed upload URL, then upload the file
// straight to storage. Returns the public URL.
export async function adminUploadImage(file) {
  const ext = file.name.split('.').pop();
  const { path, token, publicUrl } = await post({ action: 'signUpload', token: getToken(), ext });
  const { error } = await supabase.storage.from('images').uploadToSignedUrl(path, token, file);
  if (error) throw error;
  return publicUrl;
}
