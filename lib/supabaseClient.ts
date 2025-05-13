import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vwcvocipzvyntbtidgpu.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseKey) {
    throw new Error('Missing SUPABASE_KEY environment variable')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase