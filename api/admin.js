import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

// Server-only admin API. Holds the service-role key and admin password in
// environment variables that are NEVER shipped to the browser (no VITE_ prefix).
// The public site can only READ (RLS); every write goes through here after the
// caller proves they know the admin password and gets a short-lived token.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || '';
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12h

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const b64url = (buf) =>
  Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function signToken(exp) {
  const payload = b64url(JSON.stringify({ exp }));
  const sig = b64url(crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest());
  return `${payload}.${sig}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  const expected = b64url(crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

const ok = (res, data) => res.status(200).json({ ok: true, ...data });
const fail = (res, code, error) => res.status(code).json({ ok: false, error });

export default async function handler(req, res) {
  if (req.method !== 'POST') return fail(res, 405, 'Method not allowed');
  if (!SERVICE_KEY || !TOKEN_SECRET || !ADMIN_PASSWORD) {
    return fail(res, 500, 'Server not configured');
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { action } = body;

  // --- Login: exchange password for a short-lived token ---
  if (action === 'login') {
    const email = String(body.email || '').toLowerCase();
    const password = String(body.password || '');
    const emailOk = email === ADMIN_EMAIL;
    // constant-time-ish password compare
    const pwBuf = Buffer.from(password);
    const expBuf = Buffer.from(ADMIN_PASSWORD);
    const pwOk = pwBuf.length === expBuf.length && crypto.timingSafeEqual(pwBuf, expBuf);
    if (!emailOk || !pwOk) return fail(res, 401, 'Invalid email or password.');
    return ok(res, { token: signToken(Date.now() + TOKEN_TTL_MS) });
  }

  // --- Everything else requires a valid token ---
  const token = body.token || (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!verifyToken(token)) return fail(res, 401, 'Not authorized. Please log in again.');

  try {
    switch (action) {
      case 'saveCafeDetails': {
        // Single row, id = 1. Upsert so first save also works.
        const d = body.payload || {};
        const row = {
          id: 1,
          name: d.name ?? null,
          logoUrl: d.logoUrl ?? null,
          address: d.address ?? null,
          phone: d.phone ?? null,
          slogan: d.slogan ?? null,
          hours: Array.isArray(d.hours) ? d.hours : [],
        };
        const { data, error } = await admin.from('cafeDetails').upsert(row).select().single();
        if (error) throw error;
        return ok(res, { data });
      }

      case 'addCategory': {
        const { data, error } = await admin
          .from('categories')
          .insert([{ name: body.name, icon: body.icon || 'Utensils' }])
          .select()
          .single();
        if (error) throw error;
        return ok(res, { data });
      }

      case 'updateCategory': {
        const { error } = await admin
          .from('categories')
          .update({ name: body.name, icon: body.icon || 'Utensils' })
          .eq('id', body.id);
        if (error) throw error;
        return ok(res, {});
      }

      case 'deleteCategory': {
        const { error } = await admin.from('categories').delete().eq('id', body.id);
        if (error) throw error;
        return ok(res, {});
      }

      case 'addItem': {
        const { data, error } = await admin
          .from('menuItems')
          .insert([body.item])
          .select()
          .single();
        if (error) throw error;
        return ok(res, { data });
      }

      case 'updateItem': {
        const { error } = await admin.from('menuItems').update(body.item).eq('id', body.id);
        if (error) throw error;
        return ok(res, {});
      }

      case 'deleteItem': {
        const { error } = await admin.from('menuItems').delete().eq('id', body.id);
        if (error) throw error;
        return ok(res, {});
      }

      case 'signUpload': {
        // Mint a one-time signed upload URL so the browser can upload directly
        // to storage without any write access of its own.
        const ext = String(body.ext || 'bin').replace(/[^a-z0-9]/gi, '').slice(0, 8) || 'bin';
        const path = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
        const { data, error } = await admin.storage.from('images').createSignedUploadUrl(path);
        if (error) throw error;
        const { data: pub } = admin.storage.from('images').getPublicUrl(path);
        return ok(res, { path: data.path, token: data.token, publicUrl: pub.publicUrl });
      }

      default:
        return fail(res, 400, `Unknown action: ${action}`);
    }
  } catch (e) {
    return fail(res, 500, e.message || 'Server error');
  }
}
