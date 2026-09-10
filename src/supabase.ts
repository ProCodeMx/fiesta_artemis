import { createClient } from '@supabase/supabase-js'

// Reemplaza estos valores con las credenciales de tu proyecto en Supabase
const supabaseUrl = 'https://ycjyrdiycewfgxwsdtqk.supabase.co'
const supabaseKey = 'sb_publishable_V6PRNhZitpv3zTkqQpif3A_74uyWuLT'

export const supabase = createClient(supabaseUrl, supabaseKey)