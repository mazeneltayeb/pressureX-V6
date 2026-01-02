

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // المفتاح السري من إعدادات Supabase
);



// 🟢 قراءة كل المقالات
export async function GET() {
  try {
    const { data: articles, error } = await supabase.from("articles").select("*");

    if (error) throw error;

    return new Response(JSON.stringify(articles), { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify([]), { status: 200 });
  }
}

// 🟢 إضافة مقال جديد
// export async function POST(req) {
//   try {
//     const newArticle = await req.json();

//     if (!newArticle.title || !Array.isArray(newArticle.sections)) {
//       return new Response(JSON.stringify({ error: "Invalid article format" }), {
//         status: 400,
//       });
//     }

//     const { data, error } = await supabase
//       .from("articles")
//       .insert([
//         {
//           title: newArticle.title,
//           sections: newArticle.sections,
//           coverImage: newArticle.coverImage || "",
//         },
//       ])
//       .select();

//     if (error) throw error;

//     return new Response(JSON.stringify(data[0]), { status: 201 });
//   } catch (error) {
//     console.error("POST error:", error);
//     return new Response(JSON.stringify({ error: "Server error" }), {
//       status: 500,
//     });
//   }
// }
export async function POST(req) {
  try {
    const newArticle = await req.json();

    if (!newArticle.title || !Array.isArray(newArticle.sections)) {
      return new Response(JSON.stringify({ error: "Invalid article format" }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("articles")
      .insert([
        {
          title: newArticle.title,
          sections: newArticle.sections,
          coverImage: newArticle.coverImage || "",
          category: newArticle.category || "عام", // ⬅️ أضف هذا
        },
      ])
      .select();

    if (error) throw error;

    return new Response(JSON.stringify(data[0]), { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
// 🟡 تعديل مقال
// export async function PUT(req) {
//   try {
//     const updated = await req.json();

//     if (!updated.id) {
//       return new Response(JSON.stringify({ error: "Missing article id" }), {
//         status: 400,
//       });
//     }

//     const { data, error } = await supabase
//       .from("articles")
//       .update({
//         title: updated.title,
//         sections: updated.sections,
//         coverImage: updated.coverImage || "",
//       })
//       .eq("id", updated.id)
//       .select();

//     if (error) throw error;

//     return new Response(JSON.stringify(data[0]), { status: 200 });
//   } catch (error) {
//     console.error("PUT error:", error);
//     return new Response(JSON.stringify({ error: "Update failed" }), {
//       status: 500,
//     });
//   }
// }
export async function PUT(req) {
  try {
    const updated = await req.json();

    if (!updated.id) {
      return new Response(JSON.stringify({ error: "Missing article id" }), {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("articles")
      .update({
        title: updated.title,
        sections: updated.sections,
        coverImage: updated.coverImage || "",
        category: updated.category || "عام", // ⬅️ أضف هذا
      })
      .eq("id", updated.id)
      .select();

    if (error) throw error;

    return new Response(JSON.stringify(data[0]), { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ error: "Update failed" }), {
      status: 500,
    });
  }
}
// 🔴 حذف مقال
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing article id" }), {
        status: 400,
      });
    }

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      status: 500,
    });
  }
}

