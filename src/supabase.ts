import { createClient } from '@supabase/supabase-js'

// Reemplaza estos valores con las credenciales de tu proyecto en Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)