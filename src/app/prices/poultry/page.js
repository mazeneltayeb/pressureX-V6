import { promises as fs } from "fs";
import path from "path";
import AdSlot from "@/components/AdSlot";

export default async function GoldPage() {
  const filePath = path.join(process.cwd(), "data", "poultry.json");
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
  <h2 className="text-center mb-4 text-danger">
    🐔 متابعة بورصة الدواجن اليوم في مصر
  </h2>

  <p>
    تُعد <strong>بورصة الدواجن</strong> من أهم المؤشرات الاقتصادية اليومية التي
    تهم شريحة كبيرة من المواطنين في مصر، نظرًا لكون <strong>أسعار الدواجن</strong>
    تؤثر بشكل مباشر على أسعار السلع الغذائية في السوق المحلي.
  </p>

  <p>
    تشهد <strong>أسعار الفراخ</strong> تذبذبًا مستمرًا نتيجة لتغيرات العرض والطلب،
    وأسعار الأعلاف، وتكاليف النقل، بالإضافة إلى العوامل المناخية التي تؤثر
    على الإنتاج. لذلك، يهتم التجار والمستهلكون بمتابعة
    <strong>سعر الفراخ اليوم في البورصة</strong> لمعرفة أحدث التحديثات لحظة بلحظة.
  </p>

  <p>
    وتعد <strong>البورصة الرئيسية للدواجن</strong> المرجع الأول لتحديد السعر العادل
    في المزارع والمحلات، حيث يتم تحديث الأسعار بشكل يومي
    لتواكب حركة السوق المحلية والعالمية.
  </p>

  <p className="mb-0">
    فيما يلي نعرض <strong>أسعار الدواجن اليوم في مصر</strong> وفقًا لآخر تحديث من بورصة الدواجن الرئيسية والمزارع.
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
