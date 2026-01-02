import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "materials.json");

// ✅ قراءة البيانات
export async function GET() {
  try {
    const fileData = fs.readFileSync(filePath, "utf8");
    const jsonData = JSON.parse(fileData);
    return NextResponse.json(jsonData);
  } catch (error) {
    return NextResponse.json({ error: "فشل تحميل البيانات" }, { status: 500 });
  }
}

// ✅ حفظ البيانات
export async function POST(request) {
  try {
    const newData = await request.json();
    newData.lastUpdate = new Date().toISOString();
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "فشل حفظ البيانات" }, { status: 500 });
  }
}
