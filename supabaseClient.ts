import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    // eslint-disable-next-line no-console
    console.warn('Supabase env is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export { supabase };


