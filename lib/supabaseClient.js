// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// if (typeof window !== 'undefined' && localStorage.getItem('supabase_active')) {
//   console.log('🚫 يوجد اتصال نشط بالفعل');
//   // أعد التوجيه أو اعرض رسالة
// }
// localStorage.setItem('supabase_active', 'true');
// window.addEventListener('beforeunload', () => localStorage.removeItem('supabase_active'))


import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
