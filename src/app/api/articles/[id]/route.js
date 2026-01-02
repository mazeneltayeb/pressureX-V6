import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req, { params }) {
  try {
    const { id } = params;

    console.log("Fetching article with ID:", id);

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      return new Response(JSON.stringify({ error: "خطأ في قاعدة البيانات" }), { 
        status: 500 
      });
    }

    if (!data) {
      return new Response(JSON.stringify({ error: "المقال غير موجود" }), { 
        status: 404 
      });
    }

    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "خطأ في السيرفر" }), { 
      status: 500 
    });
  }
}