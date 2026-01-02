import { promises as fs } from "fs";
import path from "path";
import AdSlot from "@/components/AdSlot";

export default async function GoldPage() {
  const filePath = path.join(process.cwd(), "data", "feeds.json");
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
    🌾 أسعار الأعلاف اليوم في مصر
  </h2>

  <p>
    تُعد <strong>الأعلاف</strong> من أهم العوامل المؤثرة في قطاع الثروة الحيوانية والداجنة،
    حيث تمثل النسبة الأكبر من تكاليف الإنتاج، مما يجعل متابعة
    <strong>أسعار الأعلاف اليوم</strong> أمرًا ضروريًا لكل مربي ومزارع.
  </p>

  <p>
    تتأثر <strong>أسعار العلف</strong> بعدة عوامل رئيسية مثل أسعار الخامات الأساسية
    (الذرة، فول الصويا، الردة)، بالإضافة إلى أسعار النقل والطاقة، وحالة السوق المحلية
    والعالمية. كما تؤدي التغيرات في سعر الدولار أو حركة الاستيراد إلى
    تقلبات واضحة في أسعار الأعلاف.
  </p>

  <p>
    يهتم المربون بمتابعة <strong>بورصة الأعلاف اليومية</strong> لتحديد أنسب توقيت للشراء
    أو البيع، وضبط التكلفة الإنتاجية بما يضمن تحقيق أفضل عائد ممكن.
  </p>

  <p className="mb-0">
    في الجدول التالي نعرض <strong>آخر تحديث لأسعار الأعلاف في السوق المصري</strong>
    وفقًا لبيانات البورصات المحلية والمصانع الكبرى.
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
