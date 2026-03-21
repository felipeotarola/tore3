import { createClient } from '@supabase/supabase-js'

const readEnv = (key) => import.meta.env[key]

const supabaseUrl =
  readEnv('VITE_SUPABASE_URL') || readEnv('NEXT_PUBLIC_SUPABASE_URL') || ''

const supabaseAnonKey =
  readEnv('VITE_SUPABASE_ANON_KEY') ||
  readEnv('VITE_SUPABASE_PUBLISHABLE_KEY') ||
  readEnv('NEXT_PUBLIC_ANON_KEY') ||
  readEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') ||
  ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null

export const supabaseBucket =
  readEnv('VITE_SUPABASE_STORAGE_BUCKET') ||
  readEnv('NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET') ||
  'site-media'

const allowedEditorList =
  readEnv('VITE_EDITOR_EMAILS') || readEnv('NEXT_PUBLIC_EDITOR_EMAILS') || ''

export const allowedEditorEmails = allowedEditorList
  .split(',')
  .map((entry) => entry.trim().toLowerCase())
  .filter(Boolean)
