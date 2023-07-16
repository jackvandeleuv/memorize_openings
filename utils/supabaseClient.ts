// utils/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL_MOCK!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_MOCK!
)
