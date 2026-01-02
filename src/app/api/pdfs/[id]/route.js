// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// export async function GET(req, { params }) {
//   try {
//     const { id } = await params;

//     const { data, error } = await supabase
//       .from('pdf_files')
//       .select('*')
//       .eq('id', id)
//       .single();

//     if (error) throw error;

//     if (!data) {
//       return new Response(JSON.stringify({ error: 'الملف غير موجود' }), {
//         status: 404
//       });
//     }

//     return new Response(JSON.stringify(data), {
//       status: 200
//     });

//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500
//     });
//   }
// }

// export async function PUT(req, { params }) {
//   try {
//     const { id } = await params;
//     const body = await req.json();

//     const { data, error } = await supabase
//       .from('pdf_files')
//       .update(body)
//       .eq('id', id)
//       .select();

//     if (error) throw error;

//     return new Response(JSON.stringify({ success: true, data: data[0] }), {
//       status: 200
//     });

//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500
//     });
//   }
// }

// export async function DELETE(req, { params }) {
//   try {
//     const { id } = await params;

//     const { error } = await supabase
//       .from('pdf_files')
//       .delete()
//       .eq('id', id);

//     if (error) throw error;

//     return new Response(JSON.stringify({ success: true }), {
//       status: 200
//     });

//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500
//     });
//   }
// }


import { createClient } from "@supabase/supabase-js";

// 🔍 تحقق من وجود المفاتيح
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔑 Supabase URL:', supabaseUrl ? '✅ موجود' : '❌ مفقود');
console.log('🔑 Service Role Key:', supabaseKey ? '✅ موجود' : '❌ مفقود');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ متغيرات البيئة مفقودة!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    console.log('📨 POST /api/pdfs - بدء الاستلام');
    
    const body = await req.json();
    console.log('📦 البيانات المستلمة:', body);
    
    // التحقق من البيانات المطلوبة
    if (!body.title || !body.file_url) {
      console.error('❌ بيانات ناقصة:', { title: body.title, file_url: body.file_url });
      return new Response(
        JSON.stringify({ error: 'العنوان ورابط الملف مطلوبان' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // إضافة بيانات إضافية
    const pdfData = {
      title: body.title,
      description: body.description || '',
      category: body.category || 'عام',
      file_url: body.file_url,
      thumbnail_url: body.thumbnail_url || '',
      file_size: body.file_size || 0,
      file_type: body.file_type || 'application/pdf',
      status: body.status || 'active',
      downloads_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('💾 بيانات الحفظ:', pdfData);
    
    // محاولة الحفظ في قاعدة البيانات
    const { data, error } = await supabase
      .from('pdf_files')
      .insert([pdfData])
      .select();
    
    if (error) {
      console.error('❌ خطأ Supabase:', error);
      return new Response(
        JSON.stringify({ 
          error: 'خطأ في قاعدة البيانات',
          details: error.message,
          code: error.code 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('✅ تم الحفظ بنجاح:', data);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'تم إنشاء الملف بنجاح',
        data: data[0] 
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('💥 خطأ غير متوقع في POST:', error);
    return new Response(
      JSON.stringify({ 
        error: 'خطأ داخلي في الخادم',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}