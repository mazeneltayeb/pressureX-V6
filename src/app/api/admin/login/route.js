import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { password } = await req.json();

    const realPassword = process.env.ADMIN_PASSWORD || "1234";

    if (!password || password !== realPassword) {
      return NextResponse.json({ ok: false, message: "كلمة السر خطأ" }, { status: 401 });
    }

    // نضع كوكي بسيطة HttpOnly لتحديد الجلسة (مدة 1 ساعة)
    const res = NextResponse.json({ ok: true });
    const maxAge = 60 * 60; // ثانية (1 ساعة)
    res.cookies.set({
      name: "admin-auth",
      value: "1", // قيمة بسيطة؛ في إنتاجيّة استبدلها بتوكن موقع/مرقم
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ ok: false, message: "خطأ بالخادم" }, { status: 500 });
  }
}
