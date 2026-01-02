import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'pdf';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'لم يتم تحديد ملف' },
        { status: 400 }
      );
    }

    // التحقق من نوع الملف
    const allowedTypes = {
      pdf: ['application/pdf'],
      thumbnail: ['image/jpeg', 'image/png', 'image/webp']
    };

    if (!allowedTypes[type]?.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `نوع الملف غير مسموح لـ ${type}` },
        { status: 400 }
      );
    }

    // التحقق من الحجم
    const maxSizes = {
      pdf: 50 * 1024 * 1024, // 50MB
      thumbnail: 5 * 1024 * 1024 // 5MB
    };

    if (file.size > maxSizes[type]) {
      return NextResponse.json(
        { success: false, message: `حجم الملف كبير جداً لـ ${type}` },
        { status: 400 }
      );
    }

    // إنشاء اسم فريد
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folder = type === 'pdf' ? 'pdfs' : 'thumbnails';
    const fileName = `${folder}/${timestamp}_${random}_${safeName}`;

    // تحويل الملف
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // الرفع إلى Supabase Storage
    const { data, error } = await supabase.storage
      .from('pdf-documents')
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`فشل الرفع: ${error.message}`);
    }

    // الحصول على الرابط العام
    const { data: urlData } = supabase.storage
      .from('pdf-documents')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      message: `تم رفع الملف بنجاح`,
      url: urlData.publicUrl,
      fileName: fileName,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('API error:', error);
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

export const config = {
  api: {
    bodyParser: false
  }
};