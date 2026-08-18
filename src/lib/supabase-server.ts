const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer the new Supabase secret key. Keep the old service-role variable as a
// backwards-compatible fallback for existing Vercel environments.
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export function supabaseServerConfig() {
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    return null;
  }

  return { url: SUPABASE_URL.replace(/\/$/, ''), key: SUPABASE_SECRET_KEY };
}

export function isSupabaseConfigured() {
  return Boolean(supabaseServerConfig());
}

export async function supabaseRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const config = supabaseServerConfig();
  if (!config) {
    throw new Error('Supabase is not configured. Add SUPABASE_URL and SUPABASE_SECRET_KEY to the server environment.');
  }

  const response = await fetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed (${response.status}): ${message}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
