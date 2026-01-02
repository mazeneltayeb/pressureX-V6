

// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// export async function GET(req, { params }) {
//   const { id } = params;

//   const { data, error } = await supabase
//     .from("products")
//     .select("*")
//     .eq("id", id)
//     .single();

//   if (error || !data) {
//     console.error("GET Product Error:", error);
//     return new Response(JSON.stringify({ error: "المنتج غير موجود" }), { status: 404 });
//   }

//   return new Response(JSON.stringify(data), { status: 200 });
// }


// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY // استخدم service role key للأمان
// );

// export async function GET(req, { params }) {
//   try {
//     const { id } = params; // Next.js بيمرر params تلقائياً

//     console.log("Fetching product with ID:", id); // للت debugging

//     const { data, error } = await supabase
//       .from("products")
//       .select("*")
//       .eq("id", id)
//       .single();

//     if (error) {
//       console.error("Supabase Error:", error);
//       return new Response(JSON.stringify({ error: "خطأ في قاعدة البيانات" }), { 
//         status: 500 
//       });
//     }

//     if (!data) {
//       return new Response(JSON.stringify({ error: "المنتج غير موجود" }), { 
//         status: 404 
//       });
//     }

//     return new Response(JSON.stringify(data), { 
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });
//   } catch (error) {
//     console.error("API Error:", error);
//     return new Response(JSON.stringify({ error: "خطأ في السيرفر" }), { 
//       status: 500 
//     });
//   }
// }


import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req, { params }) {
  try {
    const { id } = params;

    console.log("🔍 جلب المنتج بالـ ID:", id);

    // تحقق إذا الـ ID رقم صحيح
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return new Response(JSON.stringify({ error: "معرف المنتج غير صحيح" }), { 
        status: 400 
      });
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("❌ خطأ في Supabase:", error);
      return new Response(JSON.stringify({ error: "خطأ في قاعدة البيانات" }), { 
        status: 500 
      });
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "المنتج غير موجود" }), { 
        status: 404 
      });
    }

    console.log("✅ تم جلب المنتج:", data.name);
    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("💥 خطأ في API:", error);
    return new Response(JSON.stringify({ error: "خطأ في السيرفر" }), { 
      status: 500 
    });
  }
}