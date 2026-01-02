import { promises as fs } from "fs";
import path from "path";
import AdSlot from "@/components/AdSlot";

export default async function GoldPage() {
  const filePath = path.join(process.cwd(), "data", "currency.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(jsonData);

  // تأكد إن البيانات فيها lastUpdate و prices
  const { lastUpdate, rates } = data;

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
  <h2 className="text-center mb-4 text-primary">
    💱 متابعة أسعار صرف العملات اليوم
  </h2>

  <p>
    تشهد <strong>أسعار صرف العملات</strong> تغيرات يومية متأثرة بعدة عوامل
    اقتصادية محلية وعالمية، مثل معدلات التضخم، وحركة التجارة الدولية، والسياسات النقدية
    التي تتبعها البنوك المركزية. ويهتم المستثمرون والمتعاملون في الأسواق
    بمتابعة <strong>أسعار الدولار واليورو والجنيه الإسترليني</strong> وغيرها من العملات
    لمعرفة الاتجاهات الاقتصادية واتخاذ قرارات مالية دقيقة.
  </p>

  <p>
    كما تؤثر أسعار الصرف بشكل مباشر على قيمة الواردات والصادرات،
    وأسعار السلع في الأسواق المحلية، مما يجعل متابعة
    <strong>سعر العملة اليوم</strong> أمرًا ضروريًا لكل من يهتم بالاستثمار
    أو بالسفر أو بالتجارة الخارجية.
  </p>

  <p className="mb-0">
    في الجدول التالي نعرض <strong>أسعار العملات اليوم مقابل الجنيه المصري</strong>
    وفقًا لآخر تحديث من الأسواق والبنوك المحلية.
  </p>
</section>

      <h1 className="text-center mb-3 text-warning fw-bold">
        أسعار الصرف اليوم في مصر
      </h1>
      <p className="text-center text-muted">📅 {formattedDate}</p>

      <table className="table table-bordered text-center mt-4">
        <thead className="table-warning">
          <tr>
            <th>العيار</th>
            <th>السعر (جنيه مصري)</th>
          </tr>
        </thead>
         <tbody>
          {Object.entries(data.rates).map(([currency, rate], index) => (
            <tr key={index}>
              <td>
                {currency === "USD"
                  ? "🇺🇸 الدولار الأمريكي"
                  : currency === "EUR"
                  ? "🇪🇺 اليورو"
                  : currency === "SAR"
                  ? "🇸🇦 الريال السعودي"
                  : currency === "GBP"
                  ? "🇬🇧 الجنيه الإسترليني"
                  : currency}
              </td>
              <td>{rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
        <AdSlot width="90%" height="150px" label="إعلان منتصف الصفحة" />
      
    </div>
  );
}
