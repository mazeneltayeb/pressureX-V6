
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request) {
  try {
    // يمكنك إضافة تحقق من الصلاحيات هنا
    // const { user } = await supabase.auth.getUser()
    // if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching profiles:', error)
      return NextResponse.json(
        { success: false, error: 'خطأ في جلب بيانات المستخدمين' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      users: profiles || [],
      count: profiles?.length || 0
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم' },
      { status: 500 }
    )
  }
}