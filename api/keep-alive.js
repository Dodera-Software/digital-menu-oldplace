import { createClient } from '@supabase/supabase-js';

// Vercel Cron pings this endpoint on a schedule (see vercel.json) so the
// Supabase project keeps registering activity and is not paused for being idle.
export default async function handler(req, res) {
  // When CRON_SECRET is set in Vercel, cron invocations include it as a bearer
  // token. Reject anything else so the endpoint isn't a free public query.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  );

  // Lightweight read just to register activity against the project.
  // Uses a publicly-readable table (anon has no access to `settings`).
  const { error } = await supabase.from('categories').select('id').limit(1);

  if (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true, ts: new Date().toISOString() });
}
