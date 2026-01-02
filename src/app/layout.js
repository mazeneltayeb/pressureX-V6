
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import NavigationBar from "@/components/Navbar";
// import BottomAd from "@/components/BottomAd";
import Footer from "@/components/Footer";
import ClientLayout from "./ClientLayout"; // ده هنضيفه بعد شوية







export const metadata = {
  title: "Pressure",
  description: "متجر متخصص في بيع قطع غيار السيارات جملة وقطاعي في مصر. نوفر قطع غيار أصلية لجميع الماركات مع شحن سريع لكل المحافظات.",
};

export default function RootLayout({ children }) {
  return (
    <html 
          lang="en" 
      dir="ltr"
      suppressHydrationWarning // إضافة هذه السطر
    >
      <body 
      style={{ margin: 0, padding: 0, fontFamily: "sans-serif" }}>
           

        <ClientLayout>
          <NavigationBar />
          {/* حسب ارتفاع الناف بار */}
            <div className="nav-bar-paddingTop" style={{ paddingTop: '73px' }}>     
          {children}
           </div>
          {/* <BottomAd /> */}
          <Footer />
        </ClientLayout>
       
      </body>
    </html>
  );
}
