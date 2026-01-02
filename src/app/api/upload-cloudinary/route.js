
//src/app/api/upload/route.js
// import { NextResponse } from 'next/server';
// import { createClient } from '@supabase/supabase-js';

// // تعريف supabase داخل الـ API route
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('❌ بيانات Supabase غير موجودة في ملف .env.local');
// }

// const supabase = createClient(supabaseUrl, supabaseKey);

// export async function POST(req) {
//   try {
//     const formData = await req.formData();
//     const files = formData.getAll('images');
    
//     console.log(`📤 جاري رفع ${files.length} صورة`);

//     const uploadedUrls = [];
//     const errors = [];

//     for (const file of files) {
//       try {
//         // تحقق من الحجم (10MB)
//         if (file.size > 10 * 1024 * 1024) {
//           errors.push(`الملف ${file.name} كبير جداً (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
//           continue;
//         }

//         // تحقق من نوع الملف
//         const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
//         if (!allowedTypes.includes(file.type)) {
//           errors.push(`نوع الملف ${file.name} غير مسموح (${file.type})`);
//           continue;
//         }

//         // إنشاء اسم فريد للملف
//         const timestamp = Date.now();
//         const random = Math.random().toString(36).substring(7);
//         const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
//         const fileName = `products/${timestamp}_${random}_${safeName}`;
        
//         console.log(`⬆️ رفع: ${fileName}`);

//         // تحويل الملف إلى ArrayBuffer
//         const arrayBuffer = await file.arrayBuffer();
        
//         // رفع الملف إلى Supabase
//         const { error: uploadError } = await supabase.storage
//           .from('products')
//           .upload(fileName, arrayBuffer, {
//             contentType: file.type,
//             cacheControl: '3600'
//           });

//         if (uploadError) {
//           console.error(`❌ خطأ في الرفع:`, uploadError);
//           throw new Error(`فشل رفع ${file.name}: ${uploadError.message}`);
//         }

//         // الحصول على الرابط العام
//         const { data: urlData } = supabase.storage
//           .from('products')
//           .getPublicUrl(fileName);

//         uploadedUrls.push({
//           url: urlData.publicUrl,
//           name: file.name,
//           size: file.size,
//           type: file.type
//         });
        
//         console.log(`✅ تم رفع: ${file.name} → ${urlData.publicUrl}`);
        
//       } catch (fileError) {
//         console.error(`❌ فشل رفع ${file.name}:`, fileError);
//         errors.push(`فشل رفع ${file.name}: ${fileError.message}`);
//       }
//     }

//     // الرد المناسب حسب النتيجة
//     if (uploadedUrls.length === 0 && errors.length > 0) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: 'فشل رفع جميع الملفات',
//           errors: errors 
//         },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: `تم رفع ${uploadedUrls.length} من ${files.length} ملفات`,
//       uploadedUrls: uploadedUrls,
//       errors: errors.length > 0 ? errors : undefined
//     });
    
//   } catch (error) {
//     console.error('💥 خطأ في API الرفع:', error);
//     return NextResponse.json(
//       { 
//         success: false, 
//         message: 'حدث خطأ في الخادم',
//         error: process.env.NODE_ENV === 'development' ? error.message : undefined
//       },
//       { status: 500 }
//     );
//   }
// }

// // ⚠️ مهم: هذا السطر لازم يكون موجود
// export const config = {
//   api: {
//     bodyParser: false, // ضروري لمعالجة الملفات
//     sizeLimit: '20mb' // زيادة حجم الرفع إذا محتاج
//   },
// };


import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// تكوين Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images');
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    // const uploadPreset = formData.get('upload_preset') || 'ml_default'; // تأكد من إنشائه في Cloudinary
    
    console.log(`📤 جاري رفع ${files.length} صورة إلى Cloudinary`);

    const uploadedUrls = [];
    const errors = [];

    for (const file of files) {
      try {
        // تحقق من الحجم (10MB)
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`الملف ${file.name} كبير جداً (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
          continue;
        }

        // تحقق من نوع الملف
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
          errors.push(`نوع الملف ${file.name} غير مسموح (${file.type})`);
          continue;
        }

        // تحويل الملف إلى Base64
        const buffer = await file.arrayBuffer();
        const base64String = Buffer.from(buffer).toString('base64');
        const dataURI = `data:${file.type};base64,${base64String}`;
        
        console.log(`⬆️ رفع إلى Cloudinary: ${file.name}`);

        // رفع الملف إلى Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          upload_preset: uploadPreset,
          folder: 'products', // مجلد لحفظ الصور
          resource_type: 'auto',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' }, // تحديد أقصى حجم
            { quality: 'auto:good' }, // تحسين الجودة تلقائياً
            { fetch_format: 'auto' } // تنسيق تلقائي
          ]
        });

        uploadedUrls.push({
          url: result.secure_url,
          public_id: result.public_id,
          name: file.name,
          size: file.size,
          type: file.type,
          format: result.format,
          width: result.width,
          height: result.height
        });
        
        console.log(`✅ تم رفع إلى Cloudinary: ${file.name} → ${result.secure_url}`);
        
      } catch (fileError) {
        console.error(`❌ فشل رفع ${file.name} إلى Cloudinary:`, fileError);
        errors.push(`فشل رفع ${file.name}: ${fileError.message}`);
      }
    }

    // الرد المناسب حسب النتيجة
    if (uploadedUrls.length === 0 && errors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'فشل رفع جميع الملفات',
          errors: errors 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `تم رفع ${uploadedUrls.length} من ${files.length} ملفات إلى Cloudinary`,
      uploadedUrls: uploadedUrls,
      errors: errors.length > 0 ? errors : undefined
    });
    
  } catch (error) {
    console.error('💥 خطأ في API الرفع إلى Cloudinary:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'حدث خطأ في الخادم',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// ⚠️ مهم: هذا السطر لازم يكون موجود
export const config = {
  api: {
    bodyParser: false, // ضروري لمعالجة الملفات
    sizeLimit: '20mb'
  },
};


