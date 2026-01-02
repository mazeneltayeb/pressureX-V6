import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 🟢 جلب كل الفئات
export async function GET() {
  try {
    const { data: categories, error } = await supabase
      .from("article_categories")
      .select("*")
      .order("name");

    if (error) throw error;

    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error("GET categories error:", error);
    return new Response(JSON.stringify([]), { status: 200 });
  }
}

// 🟢 إضافة فئة جديدة
export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name || name.trim() === "") {
      return new Response(JSON.stringify({ error: "Category name is required" }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("article_categories")
      .insert([{ name: name.trim() }])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify(data[0]), { status: 201 });
  } catch (error) {
    console.error("POST category error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

