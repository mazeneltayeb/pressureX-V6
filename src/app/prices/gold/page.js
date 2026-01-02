import { promises as fs } from "fs";
import path from "path";
import AdSlot from "@/components/AdSlot";
import { Container, Card, Spinner } from "react-bootstrap";

export default async function GoldPage() {
  const filePath = path.join(process.cwd(), "data", "gold.json");
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
      <h1 className="text-center mb-3 text-warning fw-bold">
        أسعار الذهب اليوم في مصر
      </h1>
        <AdSlot width="90%" height="150px" label="إعلان منتصف الصفحة" />
      <p className="text-center text-muted">📅 {formattedDate}</p>
         <Card className="shadow-sm p-3">
    
        <section className="container my-5">
  <h2 className="text-center mb-4 text-warning">
    🟡 أسباب ارتفاع وانخفاض أسعار الذهب وأهمية الاستثمار فيه
  </h2>

  <p>
    يُعتبر <strong>الذهب</strong> من أقدم وأهم المعادن الثمينة التي احتفظت بقيمتها على مرّ العصور.
    ومع أن الذهب يُعدّ استثمارًا آمنًا، فإن <strong>أسعاره تتأثر بالعديد من العوامل الاقتصادية والسياسية</strong>،
    مما يؤدي إلى ارتفاعها أو انخفاضها من وقتٍ لآخر.
  </p>
  <h3 className="mt-4 text-primary">💰  أهمية الاستثمار في الذهب</h3>
  <ul>
    <li><strong>حماية من التضخم وتقلبات الأسواق:</strong> الذهب يحافظ على قيمته في أوقات الأزمات.</li>
    <li><strong>تنويع المحفظة الاستثمارية:</strong> يقلل من المخاطر عند دمجه مع استثمارات أخرى.</li>
    <li><strong>سهولة التداول:</strong> يمكن شراء وبيع الذهب بسهولة في أي وقت ومن أي مكان.</li>
    <li><strong>استثمار طويل الأمد:</strong> الذهب يُعتبر مخزنًا موثوقًا للقيمة مع مرور الزمن.</li>
  </ul>
  <h3 className="mt-5 text-warning">🏅 أسعار الذهب اليوم في مصر </h3>

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
              <td>{type === "pound" ? "🪙 الجنيه الذهب" : type === "ounce" ? "🏆 أوقية الذهب" : `عيار ${type}`}</td>
              <td>{price}</td>
            </tr>
          ))}
        </tbody>
      </table>
              <AdSlot width="90%" height="150px" label="إعلان منتصف الصفحة" />

  <h4 className="mt-4 text-success">🧭 الخلاصة</h4>
  <p>
    يظل الذهب من أهم أدوات الاستثمار وأكثرها أمانًا، لكنه يحتاج إلى متابعة دائمة للعوامل الاقتصادية والسياسية التي تحرّك أسعاره.
    الاستثمار الذكي في الذهب يعني <strong>اختيار الوقت المناسب للشراء والبيع</strong> لتحقيق أفضل عائد ممكن.
  </p>
        </section>

      </Card>
  
    </div>
  );
}
