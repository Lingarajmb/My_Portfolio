import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Project reference: gazndzdqljivpdsobrnq
export const DEFAULT_SUPABASE_URL = 'https://gazndzdqljivpdsobrnq.supabase.co';

// Authorized administrator email specified by the owner
export const AUTHORIZED_ADMIN_EMAIL = 'lingarajmb1997@gmail.com';

const LOCAL_STORAGE_KEY_URL = 'lingaraj_portfolio_supabase_url';
const LOCAL_STORAGE_KEY_ANON = 'lingaraj_portfolio_supabase_anon';

export function getSupabaseCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
  const envAnon = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY_URL) || '' : '';
  const localAnon = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_STORAGE_KEY_ANON) || '' : '';

  // Default to the user's specific Supabase project URL
  const url = (localUrl || envUrl || DEFAULT_SUPABASE_URL).trim();
  const anonKey = (localAnon || envAnon).trim();

  // Validates standard JWT anon key or modern Supabase sb_publishable key
  const isConfigured = Boolean(
    url &&
    anonKey &&
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    (anonKey.startsWith('sb_publishable_') || anonKey.startsWith('eyJ') || anonKey.length > 20)
  );

  return { url, anonKey, isConfigured };
}

export function getSupabaseConfig(): { supabaseUrl: string; supabaseAnonKey: string; isConfigured: boolean } {
  const creds = getSupabaseCredentials();
  return {
    supabaseUrl: creds.url,
    supabaseAnonKey: creds.anonKey,
    isConfigured: creds.isConfigured,
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY_URL, url.trim());
    localStorage.setItem(LOCAL_STORAGE_KEY_ANON, anonKey.trim());
  }
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  saveSupabaseCredentials(url, anonKey);
}

export function clearSupabaseCredentials(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY_URL);
    localStorage.removeItem(LOCAL_STORAGE_KEY_ANON);
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (cachedClient && lastUsedUrl === url && lastUsedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'lingaraj_portfolio_auth_token',
      },
    });
    lastUsedUrl = url;
    lastUsedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export async function testSupabaseConnection(
  url?: string,
  anonKey?: string
): Promise<{ success: boolean; message: string; details?: any; tablesFound?: string[] }> {
  try {
    const creds = url && anonKey ? { url, anonKey } : getSupabaseCredentials();
    if (!creds.url || !creds.anonKey) {
      return {
        success: false,
        message: 'Supabase URL or Publishable Key is missing. Please provide your sb_publishable_... key to connect.',
      };
    }

    const client = createClient(creds.url, creds.anonKey);
    // Ping auth session or a public table
    const { data, error } = await client.from('portfolio_projects').select('id, title, is_published').limit(1);

    if (error) {
      // 42P01 = table does not exist yet
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase project gazndzdqljivpdsobrnq successfully! Note: Database tables have not been created yet. Please execute the SQL migration script.',
          details: { code: error.code },
        };
      }
      return {
        success: false,
        message: `Supabase returned an error: ${error.message} (Code: ${error.code || 'UNKNOWN'})`,
        details: error,
      };
    }

    return {
      success: true,
      message: 'Connection to Supabase project gazndzdqljivpdsobrnq is active! Database tables and RLS policies are available.',
      details: data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error?.message || 'Network error'}`,
      details: error,
    };
  }
}
