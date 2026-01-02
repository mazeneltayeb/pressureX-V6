// app/api/update-stock/route.js
import { NextResponse } from 'next/server';
import { supabase } from '/lib/supabaseClient';

export async function POST(request) {
  try {
    const { productId, quantity } = await request.json();
    
    if (!productId || !quantity) {
      return NextResponse.json(
        { error: 'بيانات غير كافية' },
        { status: 400 }
      );
    }

    // جلب المنتج الحالي
    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();

    if (fetchError) throw fetchError;

    // التحقق من الكمية المتاحة
    const currentStock = product.stock || 0;
    if (currentStock < quantity) {
      return NextResponse.json(
        { error: 'الكمية غير متوفرة' },
        { status: 400 }
      );
    }

    // تحديث المخزون
    const newStock = currentStock - quantity;
    const { error: updateError } = await supabase
      .from('products')
      .update({ 
        stock: newStock,
        status: newStock <= 0 ? 'out_of_stock' : 'active',
        updatedAt: new Date().toISOString()
      })
      .eq('id', productId);

    if (updateError) throw updateError;

    return NextResponse.json({
      success: true,
      newStock,
      message: 'تم تحديث المخزون بنجاح'
    });

  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}