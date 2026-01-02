// import { createClient } from '@supabase/supabase-js'
// import { NextResponse } from 'next/server'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// const supabase = createClient(supabaseUrl, supabaseServiceKey)

// // GET - جلب جميع المستخدمين
// export async function GET() {
//   try {
//     const { data: profiles, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .order('created_at', { ascending: false })

//     if (error) {
//       console.error('Error fetching profiles:', error)
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 500 }
//       )
//     }

//     return NextResponse.json({ success: true, users: profiles || [] })
//   } catch (error) {
//     console.error('Error:', error)
//     return NextResponse.json(
//       { success: false, error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

// // POST - إنشاء مستخدم جديد
// export async function POST(request) {
//   try {
//     const userData = await request.json()

//     const { data, error } = await supabase
//       .from('profiles')
//       .insert([userData])
//       .select()

//     if (error) {
//       console.error('Error creating user:', error)
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 500 }
//       )
//     }

//     return NextResponse.json({ success: true, user: data[0] })
//   } catch (error) {
//     console.error('Error:', error)
//     return NextResponse.json(
//       { success: false, error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

// // PUT - تحديث مستخدم
// export async function PUT(request) {
//   try {
//     const { userId, updates } = await request.json()

//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: 'User ID is required' },
//         { status: 400 }
//       )
//     }

//     const { data, error } = await supabase
//       .from('profiles')
//       .update(updates)
//       .eq('id', userId)
//       .select()

//     if (error) {
//       console.error('Error updating user:', error)
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 500 }
//       )
//     }

//     return NextResponse.json({ success: true, user: data[0] })
//   } catch (error) {
//     console.error('Error:', error)
//     return NextResponse.json(
//       { success: false, error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

// // DELETE - حذف مستخدم
// export async function DELETE(request) {
//   try {
//     const { userId } = await request.json()

//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: 'User ID is required' },
//         { status: 400 }
//       )
//     }

//     const { error } = await supabase
//       .from('profiles')
//       .delete()
//       .eq('id', userId)

//     if (error) {
//       console.error('Error deleting user:', error)
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 500 }
//       )
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error('Error:', error)
//     return NextResponse.json(
//       { success: false, error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }


import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// GET - جلب جميع المستخدمين
export async function GET() {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching profiles:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(profiles || [])
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - حذف مستخدم
// export async function DELETE(request) {
//   try {
//     const { userId } = await request.json()

//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: 'User ID is required' },
//         { status: 400 }
//       )
//     }

//     const { error } = await supabase
//       .from('profiles')
//       .delete()
//       .eq('id', userId)

//     if (error) {
//       console.error('Error deleting user:', error)
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 500 }
//       )
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error('Error:', error)
//     return NextResponse.json(
//       { success: false, error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }
export async function DELETE(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // 1. أولاً نحذف من auth.users (المستخدم نهائياً)
    const { error: authError } = await supabase.auth.admin.deleteUser(
      userId,
      true // true = حذف نهائي
    );

    if (authError) {
      console.error('Error deleting user from auth:', authError);
      return NextResponse.json(
        { success: false, error: authError.message },
        { status: 500 }
      );
    }

    // 2. ثم نحذف من profiles (لو لسه موجود)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('Error deleting user profile:', profileError);
      // ممكن نكمل عادي لأن المستخدم انحذف من auth
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
// PUT - تحديث مستخدم
// export async function PUT(request) {
//   try {
//     const { userId, updates } = await request.json()

//     if (!userId) {
//       return NextResponse.json(
//         { success: false, error: 'User ID is required' },
//         { status: 400 }
//       )
//     }

//     const { data, error } = await supabase
//       .from('profiles')
//       .update(updates)
//       .eq('id', userId)
//       .select()

//     if (error) {
//       console.error('Error updating user:', error)
//       return NextResponse.json(
//         { success: false, error: error.message },
//         { status: 500 }
//       )
//     }

//     return NextResponse.json({ success: true, user: data[0] })
//   } catch (error) {
//     console.error('Error:', error)
//     return NextResponse.json(
//       { success: false, error: 'Internal server error' },
//       { status: 500 }
//     )
//   }
// }

export async function PUT(request) {
  try {
    const { userId, updates, newPassword } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // إذا كان في باسوورد جديد، نحدثه في auth
    if (newPassword) {
      const { error: authError } = await supabase.auth.admin.updateUserById(
        userId,
        { password: newPassword }
      );

      if (authError) {
        console.error('Error updating password:', authError);
        return NextResponse.json(
          { success: false, error: authError.message },
          { status: 500 }
        );
      }
    }

    // نحدث البيانات في profiles
    if (updates && Object.keys(updates).length > 0) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select();

      if (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}