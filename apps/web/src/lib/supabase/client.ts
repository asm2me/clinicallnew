import { createBrowserClient } from '@supabase/supabase-js';

type SupabaseBrowserClient = ReturnType<typeof createBrowserClient>;

let browserClient: SupabaseBrowserClient | undefined;

function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL. Add it to your environment to use Supabase in the browser.');
  }

  return url;
}

function getSupabaseAnonKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Add it to your environment to use Supabase in the browser.');
  }

  return key;
}

export function createSupabaseBrowserClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient();
  }

  return browserClient;
}