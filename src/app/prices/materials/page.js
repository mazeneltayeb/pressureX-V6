import { promises as fs } from "fs";
import path from "path";
import AdSlot from "@/components/AdSlot";

export default async function GoldPage() {
  const filePath = path.join(process.cwd(), "data", "materials.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  // تأكد إن البيانات فيها lastUpdate و prices
  const { lastUpdate, prices } = data;

  // تنسيق التاريخ بشكل جميل
  const formattedDate = new Date(lastUpdate).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container py-5">
        <AdSlot width="90%" height="150px" label="إعلان منتصف الصفحة" />
      
 <section className="container my-5">
  <h2 className="text-center mb-4 text-success">
    ⚙️ أسعار الخامات اليوم في مصر
  </h2>

  <p>
    تُعد <strong>الخامات الزراعية والعلفية</strong> من العناصر الأساسية في منظومة الإنتاج الحيواني والداجني،
    حيث يعتمد عليها المربون والمصنعون في تحديد التكلفة النهائية للمنتجات الغذائية.
    وتشمل أبرز الخامات <strong>الذرة الصفراء، فول الصويا، الردة، والنخالة</strong> وغيرها من المكونات
    التي تدخل في صناعة الأعلاف.
  </p>

  <p>
    تشهد <strong>أسعار الخامات اليوم</strong> تغيرات مستمرة نتيجة لعوامل متعددة مثل حركة الاستيراد،
    وأسعار الدولار، وتكاليف الشحن العالمية، مما يجعل متابعة الأسعار أمرًا ضروريًا
    للمزارعين وأصحاب المزارع والمصانع.
  </p>

  <p className="mb-0">
    في الجدول التالي نعرض <strong>آخر تحديث لأسعار الخامات في السوق المصري</strong> 
    وفقًا لأحدث بيانات بورصات الحبوب والأعلاف المحلية.
  </p>
</section>

      <p className="text-center text-muted">📅 {formattedDate}</p>

      <table className="table table-bordered text-center mt-4">
        <thead className="table-warning">
          <tr>
            <th>العيار</th>
            <th>السعر (جنيه مصري)</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(prices).map(([type, price], index) => (
            <tr key={index}>
              <td>{type}</td>
              <td>{price}</td>
            </tr>
          ))}
        </tbody>
      </table>
        <AdSlot width="90%" height="150px" label="إعلان منتصف الصفحة" />
      
    </div>
  );
}
