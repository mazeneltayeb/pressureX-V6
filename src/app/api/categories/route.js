import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);





// 🟢 GET — قراءة الفئات
export async function GET() {
  try {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) throw error;

    return Response.json(data, { status: 200 });
  } catch (err) {
    console.error("GET CATEGORIES:", err);
    return Response.json([], { status: 200 });
  }
  
}

// 🟢 POST — إضافة فئة جديدة
export async function POST(req) {
  try {
    const { name } = await req.json();

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name }])
      .select()
      .single();

    if (error) throw error;

    return Response.json(data, { status: 201 });
  } catch (err) {
    console.error("POST CATEGORY:", err);
    return Response.json({ error: "Failed to add category" }, { status: 500 });
  }
}
