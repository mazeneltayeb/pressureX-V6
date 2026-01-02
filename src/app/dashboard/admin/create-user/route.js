// app/api/admin/create-user/route.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request) {
  try {
    const { username, full_name, email, phone, store_address, password } = await request.json()

    console.log('Creating user with email:', email)

    // التحقق من البيانات المطلوبة
    if (!email || !password) {
      return Response.json({ 
        success: false, 
        error: 'البريد الإلكتروني وكلمة المرور مطلوبان' 
      }, { status: 400 })
    }

    let userId
    let userAction = 'created'

    try {
      // محاولة إنشاء مستخدم جديد
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: {
          username: username,
          full_name: full_name
        }
      })

      if (authError) {
        console.log('Auth creation error:', authError)
        
        // إذا كان المستخدم موجوداً، حاول الحصول عليه
        if (authError.message.includes('already exists') || authError.message.includes('already registered')) {
          const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
          if (listError) throw listError
          
          const existingUser = users.find(user => user.email === email)
          if (existingUser) {
            userId = existingUser.id
            userAction = 'updated_existing'
            
            // تحديث بيانات المستخدم
            await supabase.auth.admin.updateUserById(userId, {
              user_metadata: {
                username: username,
                full_name: full_name
              },
              password: password // تحديث كلمة المرور أيضاً
            })
          } else {
            throw new Error('البريد الإلكتروني مسجل ولكن لا يمكن العثور على المستخدم')
          }
        } else {
          throw authError
        }
      } else {
        userId = authData.user.id
      }
    } catch (authError) {
      console.log('Final auth error:', authError)
      throw new Error('خطأ في نظام المصادقة: ' + authError.message)
    }

    // إعداد بيانات الـ profile
    const profileData = {
      id: userId,
      username: username,
      full_name: full_name,
      email: email,
      phone: phone,
      store_address: store_address,
      updated_at: new Date().toISOString()
    }

    // التحقق من وجود الـ profile مسبقاً
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle() // استخدام maybeSingle بدلاً من single

    let profileResult

    if (existingProfile) {
      // تحديث profile موجود
      profileResult = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
    } else {
      // إضافة profile جديد
      profileData.created_at = new Date().toISOString()
      profileResult = await supabase
        .from('profiles')
        .insert([profileData])
    }

    if (profileResult.error) {
      console.log('Profile error:', profileResult.error)
      throw new Error('خطأ في حفظ بيانات المستخدم: ' + profileResult.error.message)
    }

    return Response.json({ 
      success: true, 
      user: { id: userId, email: email },
      action: userAction,
      message: userAction === 'created' ? 'تم إنشاء المستخدم بنجاح' : 'تم تحديث المستخدم الموجود'
    })

  } catch (error) {
    console.log('API Error:', error)
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 })
  }
}

