// import { createClient } from "@supabase/supabase-js";
// import { NextResponse } from "next/server";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// const supabase = createClient(supabaseUrl, supabaseKey);

// export async function POST(req, { params }) {
//   try {
//     const { id } = await params;
    
//     console.log(`⬇️ تحديث تحميلات الملف ID: ${id}`);
    
//     if (!id) {
//       return NextResponse.json(
//         { error: 'معرف الملف مطلوب' },
//         { status: 400 }
//       );
//     }

//     // 1. الحصول على عدد التحميلات الحالي
//     const { data: currentData, error: fetchError } = await supabase
//       .from('pdf_files')
//       .select('downloads_count')
//       .eq('id', id)
//       .single();

//     if (fetchError) {
//       console.error('Error fetching current downloads:', fetchError);
//       return NextResponse.json(
//         { error: 'فشل في جلب بيانات الملف' },
//         { status: 500 }
//       );
//     }

//     // 2. زيادة عدد التحميلات بمقدار 1
//     const newDownloadsCount = (currentData.downloads_count || 0) + 1;
    
//     const { data, error: updateError } = await supabase
//       .from('pdf_files')
//       .update({ 
//         downloads_count: newDownloadsCount,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', id)
//       .select('*');

//     if (updateError) {
//       console.error('Error updating downloads:', updateError);
//       return NextResponse.json(
//         { error: 'فشل في تحديث عدد التحميلات' },
//         { status: 500 }
//       );
//     }

//     console.log(`✅ تم تحديث تحميلات الملف ${id} إلى: ${newDownloadsCount}`);
    
//     // 3. إرجاع البيانات المحدثة
//     return NextResponse.json({
//       success: true,
//       downloads_count: newDownloadsCount,
//       file: data[0]
//     });

//   } catch (error) {
//     console.error('💥 خطأ في API:', error);
//     return NextResponse.json(
//       { error: 'حدث خطأ داخلي في الخادم' },
//       { status: 500 }
//     );
//   }
// }



import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    
    console.log(`⬇️ تحديث تحميلات الملف ID: ${id}`);
    
    if (!id) {
      return NextResponse.json(
        { error: 'معرف الملف مطلوب' },
        { status: 400 }
      );
    }

    // الحصول على بيانات المستخدم من الـ Auth header
    const authHeader = req.headers.get('authorization');
    let userId = null;
    let userEmail = null;
    let userName = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // يمكنك استخدام supabase.auth.getUser() للتحقق
      // لكن في هذا المثال سنستخدم بيانات من body
    }

    // الحصول على بيانات المستخدم من body
    const body = await req.json().catch(() => ({}));
    userId = body.userId;
    userEmail = body.userEmail;
    userName = body.userName;

    // 1. الحصول على عدد التحميلات الحالي
    const { data: currentData, error: fetchError } = await supabase
      .from('pdf_files')
      .select('downloads_count')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching current downloads:', fetchError);
      return NextResponse.json(
        { error: 'فشل في جلب بيانات الملف' },
        { status: 500 }
      );
    }

    // 2. زيادة عدد التحميلات بمقدار 1
    const newDownloadsCount = (currentData.downloads_count || 0) + 1;
    
    const { data: updatedPdf, error: updateError } = await supabase
      .from('pdf_files')
      .update({ 
        downloads_count: newDownloadsCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*');

    if (updateError) {
      console.error('Error updating downloads:', updateError);
      return NextResponse.json(
        { error: 'فشل في تحديث عدد التحميلات' },
        { status: 500 }
      );
    }

    // 3. حفظ سجل التحميل للمستخدم (إذا كان هناك بيانات مستخدم)
    if (userId) {
      const { error: downloadLogError } = await supabase
        .from('pdf_downloads')
        .insert([{
          pdf_id: id,
          user_id: userId,
          user_email: userEmail || 'غير معروف',
          user_name: userName || 'زائر',
          downloaded_at: new Date().toISOString(),
          user_ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'غير معروف',
          user_agent: req.headers.get('user-agent') || 'غير معروف'
        }]);

      if (downloadLogError) {
        console.error('Error logging download:', downloadLogError);
        // لا نوقف العملية إذا فشل التسجيل
      }
    }

    console.log(`✅ تم تحديث تحميلات الملف ${id} إلى: ${newDownloadsCount}`);
    
    // 4. إرجاع البيانات المحدثة
    return NextResponse.json({
      success: true,
      downloads_count: newDownloadsCount,
      file: updatedPdf[0]
    });

  } catch (error) {
    console.error('💥 خطأ في API:', error);
    return NextResponse.json(
      { error: 'حدث خطأ داخلي في الخادم' },
      { status: 500 }
    );
  }
}