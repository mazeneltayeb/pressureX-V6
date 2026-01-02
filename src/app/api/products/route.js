

// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY // المفتاح السري
// );

// // 🟢 قراءة كل المنتجات
// export async function GET() {
//   try {
//     const { data: products, error } = await supabase.from("products").select("*");

//     if (error) throw error;

//     return new Response(JSON.stringify(products), { status: 200 });
//   } catch (error) {
//     console.error("GET error:", error);
//     return new Response(JSON.stringify([]), { status: 200 });
//   }
// }



// export async function POST(req) {
//   try {
//     const newProduct = await req.json();

//     const { data, error } = await supabase
//       .from("products")
//       .insert([
//         {
//           name: newProduct.name,
//           price: newProduct.price,
//           description: newProduct.description || "",
//           images: newProduct.images || [], // ← غير إلى array فارغ
//           video: newProduct.video || "",
//           youtube: newProduct.youtube || "",
//           article: newProduct.article || "",
//           category: newProduct.category || "",
//           number: newProduct.number || "",
//           stock: newProduct.stock || "",
//           image_url: newProduct.image_url || [], // ← غير إلى array فارغ
//         },
//       ])
//       .select();

//     if (error) throw error;

//     return new Response(JSON.stringify(data[0]), { status: 201 });
//   } catch (error) {
//     console.error("POST error:", error);
//     return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
//   }
// }



// export async function PUT(req) {
//   try {
//     const updated = await req.json();

//     if (!updated.id) {
//       return new Response(JSON.stringify({ error: "Missing product id" }), { status: 400 });
//     }

//     const { data, error } = await supabase
//       .from("products")
//       .update({
//         name: updated.name,
//         price: updated.price,
//         description: updated.description || "",
//         images: updated.images || [], // ← غير إلى array فارغ
//         video: updated.video || "",
//         youtube: updated.youtube || "",
//         article: updated.article || "",
//         category: updated.category || "",
//         number:updated.number || "",
//         stock:updated.stock || "",
//        image_url: updated.image_url || [], // ← غير إلى array فارغ
//          })
//       .eq("id", updated.id)
//       .select();

//     if (error) throw error;

//     return new Response(JSON.stringify(data[0]), { status: 200 });
//   } catch (error) {
//     console.error("PUT error:", error);
//     return new Response(JSON.stringify({ error: "Update failed" }), { status: 500 });
//   }
// }
// // 🔴 حذف منتج
// export async function DELETE(req) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return new Response(JSON.stringify({ error: "Missing product id" }), { status: 400 });
//     }

//     const { error } = await supabase.from("products").delete().eq("id", id);

//     if (error) throw error;

//     return new Response(JSON.stringify({ success: true }), { status: 200 });
//   } catch (error) {
//     console.error("DELETE error:", error);
//     return new Response(JSON.stringify({ error: "Delete failed" }), { status: 500 });
//   }
// }



// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY // المفتاح السري
// );

// // 🟢 قراءة كل المنتجات
// export async function GET() {
//   try {
//     const { data: products, error } = await supabase
//       .from("products")
//       .select("*")
//       .order('created_at', { ascending: false });

//     if (error) throw error;

//     return new Response(JSON.stringify(products || []), { status: 200 });
//   } catch (error) {
//     console.error("GET error:", error);
//     return new Response(JSON.stringify([]), { status: 200 });
//   }
// }

// export async function POST(req) {
//   try {
//     const newProduct = await req.json();
    
//     console.log('📥 بيانات جديدة:', newProduct);

//     // 🔥 التصحيح: image_url يكون string، images يكون array
//     const { data, error } = await supabase
//       .from("products")
//       .insert([
//         {
//           name: newProduct.name,
//           price: newProduct.price,
//           description: newProduct.description || "",
//           images: Array.isArray(newProduct.images) ? newProduct.images : [], // ✅ array
//           video: newProduct.video || "",
//           youtube: newProduct.youtube || "",
//           article: newProduct.article || "",
//           category: newProduct.category || "",
//           number: newProduct.number || null,
//           stock: newProduct.stock || 0,
//           status: newProduct.status || "active",
//           image_url: newProduct.image_url || "", // ✅ string
//           created_at: newProduct.createdAt || new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         },
//       ])
//       .select();

//     if (error) throw error;

//     console.log('✅ تم إضافة المنتج:', data[0]);
//     return new Response(JSON.stringify(data[0]), { status: 201 });
//   } catch (error) {
//     console.error("POST error:", error);
//     return new Response(
//       JSON.stringify({ error: error.message || "Server error" }), 
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(req) {
//   try {
//     const updated = await req.json();

//     if (!updated.id) {
//       return new Response(
//         JSON.stringify({ error: "Missing product id" }), 
//         { status: 400 }
//       );
//     }

//     console.log('📝 تحديث المنتج:', updated.id, updated);

//     // 🔥 التصحيح: image_url يكون string، images يكون array
//     const { data, error } = await supabase
//       .from("products")
//       .update({
//         name: updated.name,
//         price: updated.price,
//         description: updated.description || "",
//         images: Array.isArray(updated.images) ? updated.images : [], // ✅ array
//         video: updated.video || "",
//         youtube: updated.youtube || "",
//         article: updated.article || "",
//         category: updated.category || "",
//         number: updated.number || null,
//         stock: updated.stock || 0,
//         status: updated.status || "active",
//         image_url: updated.image_url || "", // ✅ string
//         updated_at: new Date().toISOString()
//       })
//       .eq("id", updated.id)
//       .select();

//     if (error) throw error;

//     console.log('✅ تم تحديث المنتج:', data[0]);
//     return new Response(JSON.stringify(data[0]), { status: 200 });
//   } catch (error) {
//     console.error("PUT error:", error);
//     return new Response(
//       JSON.stringify({ error: error.message || "Update failed" }), 
//       { status: 500 }
//     );
//   }
// }

// // 🔴 حذف منتج
// export async function DELETE(req) {
//   try {
//     const { id } = await req.json();

//     if (!id) {
//       return new Response(
//         JSON.stringify({ error: "Missing product id" }), 
//         { status: 400 }
//       );
//     }

//     console.log('🗑️ حذف المنتج:', id);

//     const { error } = await supabase
//       .from("products")
//       .delete()
//       .eq("id", id);

//     if (error) throw error;

//     console.log('✅ تم حذف المنتج:', id);
//     return new Response(JSON.stringify({ success: true, id }), { status: 200 });
//   } catch (error) {
//     console.error("DELETE error:", error);
//     return new Response(
//       JSON.stringify({ error: error.message || "Delete failed" }), 
//       { status: 500 }
//     );
//   }
// }

// app/api/products/route.js
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from 'cloudinary';

// تكوين Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// تكوين Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔥 دالة لاستخراج public_id من URL
function extractPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null;
  
  try {
    // مثال: https://res.cloudinary.com/cloudname/image/upload/v1234567890/products/image.jpg
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex !== -1) {
      // استخراج كل شيء بعد 'upload/'
      let publicId = urlParts.slice(uploadIndex + 1).join('/');
      
      // إزالة الإصدار إذا موجود (v1234567890/)
      publicId = publicId.replace(/^v\d+\//, '');
      
      // إزالة الامتداد (.jpg, .png, etc)
      publicId = publicId.replace(/\.[^/.]+$/, '');
      
      return publicId;
    }
  } catch (error) {
    console.error('❌ خطأ في استخراج public_id:', error);
  }
  return null;
}

// 🔥 دالة لحذف الصور من Cloudinary
async function deleteImagesFromCloudinary(product) {
  try {
    const deletedImages = [];
    const deletedPublicIds = [];
    
    console.log('🗑️ بدء حذف صور المنتج:', product.id);
    
    // 1. حذف الصورة الرئيسية (image_url)
    if (product.image_url) {
      const publicId = extractPublicIdFromUrl(product.image_url);
      if (publicId) {
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          if (result.result === 'ok') {
            deletedImages.push({
              type: 'main',
              publicId: publicId,
              url: product.image_url,
              success: true
            });
            deletedPublicIds.push(publicId);
            console.log(`✅ حذف الصورة الرئيسية: ${publicId}`);
          }
        } catch (error) {
          console.error('❌ فشل حذف الصورة الرئيسية:', error);
          deletedImages.push({
            type: 'main',
            url: product.image_url,
            error: error.message,
            success: false
          });
        }
      }
    }
    
    // 2. حذف الصور الإضافية (images array)
    if (product.images && Array.isArray(product.images)) {
      for (const imageUrl of product.images) {
        // تخطي إذا كانت نفس الصورة الرئيسية
        if (imageUrl === product.image_url) continue;
        
        const publicId = extractPublicIdFromUrl(imageUrl);
        if (publicId && !deletedPublicIds.includes(publicId)) {
          try {
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.result === 'ok') {
              deletedImages.push({
                type: 'gallery',
                publicId: publicId,
                url: imageUrl,
                success: true
              });
              deletedPublicIds.push(publicId);
              console.log(`✅ حذف صورة الجاليري: ${publicId}`);
            }
          } catch (error) {
            console.error('❌ فشل حذف صورة الجاليري:', error);
            deletedImages.push({
              type: 'gallery',
              url: imageUrl,
              error: error.message,
              success: false
            });
          }
        }
      }
    }
    
    return {
      total: deletedImages.length,
      successful: deletedImages.filter(img => img.success).length,
      failed: deletedImages.filter(img => !img.success).length,
      details: deletedImages
    };
    
  } catch (error) {
    console.error('💥 خطأ في حذف صور Cloudinary:', error);
    return {
      total: 0,
      successful: 0,
      failed: 0,
      error: error.message
    };
  }
}

// 🟢 قراءة كل المنتجات
export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(products || []), { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify([]), { status: 200 });
  }
}

export async function POST(req) {
  try {
    const newProduct = await req.json();
    
    console.log('📥 بيانات جديدة:', newProduct);

    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name: newProduct.name,
          price: newProduct.price,
          description: newProduct.description || "",
          images: Array.isArray(newProduct.images) ? newProduct.images : [],
          video: newProduct.video || "",
          youtube: newProduct.youtube || "",
          article: newProduct.article || "",
          category: newProduct.category || "",
          number: newProduct.number || null,
          stock: newProduct.stock || 0,
          status: newProduct.status || "active",
          image_url: newProduct.image_url || "",
          created_at: newProduct.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
      ])
      .select();

    if (error) throw error;

    console.log('✅ تم إضافة المنتج:', data[0]);
    return new Response(JSON.stringify(data[0]), { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Server error" }), 
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const updated = await req.json();

    if (!updated.id) {
      return new Response(
        JSON.stringify({ error: "Missing product id" }), 
        { status: 400 }
      );
    }

    console.log('📝 تحديث المنتج:', updated.id);

    const { data, error } = await supabase
      .from("products")
      .update({
        name: updated.name,
        price: updated.price,
        description: updated.description || "",
        images: Array.isArray(updated.images) ? updated.images : [],
        video: updated.video || "",
        youtube: updated.youtube || "",
        article: updated.article || "",
        category: updated.category || "",
        number: updated.number || null,
        stock: updated.stock || 0,
        status: updated.status || "active",
        image_url: updated.image_url || "",
        updated_at: new Date().toISOString()
      })
      .eq("id", updated.id)
      .select();

    if (error) throw error;

    console.log('✅ تم تحديث المنتج:', data[0]);
    return new Response(JSON.stringify(data[0]), { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Update failed" }), 
      { status: 500 }
    );
  }
}

// 🔴 حذف منتج مع الصور من Cloudinary
export async function DELETE(req) {
  try {
    const { id, deleteImages = true } = await req.json(); // ✅ إضافة خيار حذف الصور

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Missing product id" }), 
        { status: 400 }
      );
    }

    console.log('🗑️ بدء حذف المنتج:', id);

    // 1. أولاً: جلب بيانات المنتج قبل الحذف
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error('❌ فشل جلب بيانات المنتج:', fetchError);
      throw new Error("فشل في جلب بيانات المنتج");
    }

    console.log('📦 بيانات المنتج:', product.name);
    console.log('🖼️ الصور:', {
      main: product.image_url ? 'موجودة' : 'غير موجودة',
      gallery: product.images?.length || 0
    });

    let cloudinaryResult = null;
    
    // 2. حذف الصور من Cloudinary (إذا كان الخيار مفعل)
    if (deleteImages && product) {
      console.log('☁️ بدء حذف الصور من Cloudinary...');
      cloudinaryResult = await deleteImagesFromCloudinary(product);
      console.log('📊 نتيجة حذف Cloudinary:', cloudinaryResult);
    } else {
      console.log('⏭️ تخطي حذف الصور من Cloudinary');
    }

    // 3. حذف المنتج من Supabase
    console.log('🗄️ حذف المنتج من Supabase...');
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error('❌ فشل حذف المنتج:', deleteError);
      throw new Error("فشل في حذف المنتج من قاعدة البيانات");
    }

    console.log('✅ تم حذف المنتج بنجاح');

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: id,
        productName: product.name,
        cloudinary: cloudinaryResult,
        message: cloudinaryResult ? 
          `تم حذف المنتج "${product.name}" و ${cloudinaryResult.successful} صورة` : 
          `تم حذف المنتج "${product.name}" فقط (الصور باقية في Cloudinary)`
      }), 
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Delete failed" }), 
      { status: 500 }
    );
  }
}