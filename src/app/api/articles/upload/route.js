import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images');
    const type = formData.get('type'); // 'cover' أو 'section'
    
    console.log(`📤 رفع ${files.length} صورة من نوع: ${type}`);

    const uploadedUrls = [];

    for (const file of files) {
      const fileName = `${type}_${Date.now()}_${file.name.replace(/\s/g, "_")}`;
      
      console.log(`🔄 رفع: ${fileName}`);
      
      const { error: uploadError } = await supabase.storage
        .from("articles")
        .upload(fileName, file);

      if (uploadError) {
        console.error("❌ خطأ الرفع:", uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from("articles")
        .getPublicUrl(fileName);

      uploadedUrls.push(data.publicUrl);
      console.log(`✅ تم الرفع: ${data.publicUrl}`);
    }

    return new Response(JSON.stringify(uploadedUrls), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("💥 Upload API error:", error);
    return new Response(JSON.stringify({ error: "Upload failed" }), { 
      status: 500 
    });
  }
}