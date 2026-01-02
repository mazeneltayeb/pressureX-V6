// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const category = searchParams.get('category');
//     const status = searchParams.get('status') || 'active';

//     let query = supabase
//       .from('pdf_files')
//       .select('*')
//       .eq('status', status);

//     if (category && category !== 'الكل') {
//       query = query.eq('category', category);
//     }

//     const { data, error } = await query.order('created_at', { ascending: false });

//     if (error) throw error;

//     return new Response(JSON.stringify(data), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     });

//   } catch (error) {
//     console.error('Error:', error);
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500
//     });
//   }
// }

// export async function POST(req) {
//   try {
//     const body = await req.json();
    
//     const { data, error } = await supabase
//       .from('pdf_files')
//       .insert([{
//         title: body.title,
//         description: body.description,
//         category: body.category,
//         file_url: body.file_url,
//         thumbnail_url: body.thumbnail_url,
//         file_size: body.file_size,
//         file_type: body.file_type,
//         status: body.status || 'active'
//       }])
//       .select();

//     if (error) throw error;

//     return new Response(JSON.stringify({ success: true, data: data[0] }), {
//       status: 201
//     });

//   } catch (error) {
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500
//     });
//   }
// }


import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(req) {
  try {
    // التحقق من المصادقة
    const authHeader = req.headers.get('authorization');
    
    // إذا كان API مخصص للمسجلين فقط، يمكنك إضافة تحقق هنا
    // أو يمكنك استخدام middleware كما في الخطوة التالية
    
    let query = supabase
      .from('pdf_files')
      .select('*')
      .eq('status', 'active') // فقط الملفات النشطة
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في السيرفر' },
      { status: 500 }
    );
  }
}