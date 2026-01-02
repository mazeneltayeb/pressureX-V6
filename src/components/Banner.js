// "use client";
// import React from "react";
// import { Button, Container, Row, Col } from "react-bootstrap";

// const Banner = () => {
//   return (
//     <section
//       style={{
//         background: "linear-gradient(135deg, #f8d800, #f1a10a)",
//         padding: "80px 20px",
//         textAlign: "center",
//         color: "#333",
//         position: "relative",
//       }}
//     >
//       <Container>
//         <Row className="justify-content-center align-items-center">
//           <Col md={8}>
//             <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
//               أسعار اليوم بين يديك ⚡
//             </h1>
//             <p style={{ fontSize: "1.2rem", margin: "20px 0" }}>
//               تابع أحدث أسعار الذهب، العملات، والدواجن محدثة لحظة بلحظة.
//             </p>
//             <Button
//               variant="dark"
//               size="lg"
//               style={{
//                 borderRadius: "30px",
//                 padding: "10px 30px",
//                 fontWeight: "600",
//                 marginBottom: "40px",
//               }}
//             >
//               تصفح الأسعار الآن
//             </Button>

// {/* إعلان */}
// <div
//   style={{
//     backgroundColor: "#fff",
//     borderRadius: "10px",
//     padding: "20px",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//     maxWidth: "840px", // ✅ عرض متوسط
//     height: "180px", // ✅ ارتفاع متوسط
//     margin: "0 auto",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   }}
// >
//   <p style={{ margin: 0, color: "#555", fontSize: "1.1rem" }}>
//     📢 مساحة إعلان (840x180)
//   </p>
// </div>


//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };

// export default Banner;

//good

// "use client";
// import React from "react";
// import { Button, Container, Row, Col } from "react-bootstrap";
// const Banner = () => {
//   return (
//     <section
//       style={{
//         backgroundImage: "linear-gradient(rgba(248, 216, 0, 0.9), rgba(241, 161, 10, 0.9)), sru(components/img/banner.png)",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         padding: "80px 0",
//         color: "#333",
//         position: "relative",
//         borderRadius: "0 0 20px 20px",
//         boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
//         overflow: "hidden",
//       }}
//     >
//       <Container>
//         <Row className="justify-content-between align-items-center">
//           <Col lg={6} md={7} className="text-center text-md-start">
//             <h1 
//               style={{ 
//                 fontSize: "clamp(2.5rem, 5vw, 3.5rem)", 
//                 fontWeight: "bold",
//                 lineHeight: "1.3",
//                 marginBottom: "20px",
//                 color: "#222",
//               }}
//             >
//               أسعار اليوم بين يديك ⚡
//             </h1>
//             <p 
//               style={{ 
//                 fontSize: "clamp(1.2rem, 2vw, 1.4rem)", 
//                 margin: "25px 0",
//                 lineHeight: "1.7",
//                 color: "#444",
//               }}
//             >
//               تابع أحدث أسعار الذهب، العملات، والدواجن محدثة لحظة بلحظة.
//               جميع المعلومات المالية التي تحتاجها في مكان واحد.
//             </p>
            
//             <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
//               <Button
//                 variant="dark"
//                 size="lg"
//                 style={{
//                   borderRadius: "30px",
//                   padding: "12px 40px",
//                   fontWeight: "700",
//                   boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
//                 }}
//               >
//                 ابدأ الآن مجاناً
//               </Button>
//               <Button
//                 variant="outline-dark"
//                 size="lg"
//                 style={{
//                   borderRadius: "30px",
//                   padding: "12px 40px",
//                   fontWeight: "600",
//                   borderWidth: "2px",
//                 }}
//               >
//                 شاهد العرض
//               </Button>
//             </div>
//           </Col>
          
//           {/* إعلان بداخل البنر */}
//           <Col lg={4} md={5} className="mt-5 mt-md-0">
//             <div
//               style={{
//                 backgroundColor: "rgba(255, 255, 255, 0.95)",
//                 borderRadius: "15px",
//                 padding: "25px",
//                 boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
//                 height: "180px",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 textAlign: "center",
//                 border: "2px dashed #f1a10a",
//               }}
//             >
//               <p style={{ margin: 0, color: "#555", fontSize: "1.2rem", fontWeight: "600" }}>
//                 📢 مساحة إعلان
//               </p>
//               <p style={{ margin: "10px 0 0 0", color: "#777", fontSize: "0.9rem" }}>
//                 (840x180) - تصميم متجاوب
//               </p>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   );
// };
// export default Banner;


// "use client";
// import React from "react";
// import { Button, Container, Row, Col } from "react-bootstrap";
// // import bannerImg from "components/img/banner.jpg"
// import bannerImg from './img/banner.jpg';

// const Banner = () => {
//     console.log('مسار الصورة:', bannerImg); // للتأكد

//   return (
//     <section
//       style={{
//         position: "relative",
//         padding: "100px 0",
//         color: "#fff",
//         overflow: "hidden",
//         minHeight: "600px",
//         display: "flex",
//         alignItems: "center",
//         borderRadius: "0 0 25px 25px",
//         marginBottom: "30px",
//       }}
//     >
//       {/* صورة الخلفية */}
//       <img
//       src="url(https://e7.pngegg.com/pngimages/893/259/png-clipart-car-mercedes-benz-beachside-auto-parts-spare-part-vehicle-car-truck-automobile-repair-shop-thumbnail.png)"
//         alt="أسعار الذهب والعملات"
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           objectFit: "cover",
//           objectPosition: "center",
//           filter: "brightness(0.8)",
//           zIndex: 1,
//         }}
//         onError={(e) => {
//           // fallback إذا فشل تحميل الصورة
//           e.target.style.display = 'none';
//           e.target.parentElement.style.backgroundColor = '#f8d800';
//         }}
//       />
      
//       {/* طبقة تظليل متدرجة */}
//       <div
//         style={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           background: "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)",
//           zIndex: 2,
//         }}
//       />
      
//       {/* المحتوى */}
//       <Container style={{ position: "relative", zIndex: 3 }}>
//         <Row className="justify-content-start align-items-center">
//           <Col lg={8} md={9} sm={12}>
//             <div style={{ textAlign: "right" }}>
//               <h1 
//                 style={{ 
//                   fontSize: "clamp(2.5rem, 6vw, 4rem)", 
//                   fontWeight: "800",
//                   lineHeight: "1.2",
//                   marginBottom: "25px",
//                   textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
//                 }}
//               >
//                 <span style={{ color: "#f8d800" }}>⚡</span> أسعار اليوم بين يديك
//               </h1>
              
//               <p 
//                 style={{ 
//                   fontSize: "clamp(1.2rem, 3vw, 1.6rem)", 
//                   margin: "30px 0",
//                   lineHeight: "1.8",
//                   textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
//                   maxWidth: "600px",
//                 }}
//               >
//                 تابع أحدث أسعار الذهب، العملات، والدواجن محدثة لحظة بلحظة.
//                 كل ما تحتاجه من معلومات مالية في مكان واحد.
//               </p>
              
//               <div className="d-flex flex-wrap gap-4 justify-content-start mt-4">
//                 <Button
//                   variant="warning"
//                   size="lg"
//                   style={{
//                     borderRadius: "50px",
//                     padding: "15px 45px",
//                     fontWeight: "700",
//                     fontSize: "1.1rem",
//                     boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
//                     transition: "all 0.3s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.transform = "translateY(-3px)";
//                     e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.4)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.transform = "translateY(0)";
//                     e.target.style.boxShadow = "0 5px 20px rgba(0,0,0,0.3)";
//                   }}
//                 >
//                   تصفح الأسعار الآن
//                 </Button>
                
//                 <Button
//                   variant="outline-light"
//                   size="lg"
//                   style={{
//                     borderRadius: "50px",
//                     padding: "15px 45px",
//                     fontWeight: "600",
//                     fontSize: "1.1rem",
//                     borderWidth: "3px",
//                     transition: "all 0.3s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
//                     e.target.style.transform = "translateY(-3px)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = "transparent";
//                     e.target.style.transform = "translateY(0)";
//                   }}
//                 >
//                   <span style={{ marginLeft: "8px" }}>📊</span>
//                   شاهد التحليلات
//                 </Button>
//               </div>
              
//               {/* مؤشرات سريعة */}
//               <div className="mt-5 pt-4 d-flex flex-wrap gap-5 justify-content-start border-top border-light border-opacity-25">
//                 {[
//                   { icon: "💰", title: "أسعار الذهب", desc: "تحديث مباشر" },
//                   { icon: "💵", title: "العملات الأجنبية", desc: "جميع العملات" },
//                   { icon: "📈", title: "توقعات السوق", desc: "تحليلات دقيقة" },
//                   { icon: "🍗", title: "المنتجات الغذائية", desc: "أسعار يومية" },
//                 ].map((item, index) => (
//                   <div key={index} className="d-flex align-items-center">
//                     <div style={{ fontSize: "2.5rem", marginLeft: "15px" }}>
//                       {item.icon}
//                     </div>
//                     <div>
//                       <h5 style={{ fontWeight: "700", margin: 0 }}>{item.title}</h5>
//                       <p style={{ margin: 0, opacity: 0.9, fontSize: "0.9rem" }}>{item.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
      
//       {/* الإعلان في الأسفل */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: "40px",
//           left: "50%",
//           transform: "translateX(-50%)",
//           backgroundColor: "rgba(255, 255, 255, 0.95)",
//           borderRadius: "15px",
//           padding: "20px 40px",
//           boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
//           maxWidth: "90%",
//           width: "840px",
//           height: "100px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 3,
//           border: "3px solid #f8d800",
//         }}
//       >
//         <div className="text-center">
//           <p style={{ margin: 0, color: "#333", fontSize: "1.2rem", fontWeight: "700" }}>
//             📢 مساحة إعلانية - (840 × 100)
//           </p>
//           <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.9rem" }}>
//             للإعلان هنا تواصل معنا
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Banner;


// good banner

// "use client";
// import React from "react";
// import { Button, Container, Row, Col, Image } from "react-bootstrap";
// import bannerImg from './img/banner.jpg';
// import peugeot from 'components/img/PEUGEOT.png'
// import renault from 'components/img/RENAULT.png'
//  import skoda from  'components/img/Skoda.png'
//   import chevrolet from  'components/img/Chevrolet.png'

// const Banner = () => {
//   return (
//     <section
//       style={{
//         backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bannerImg.src})`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//         padding: "50px 0",
//         color: "#fff",
//         minHeight: "600px",
//         display: "flex",
//         alignItems: "center",
//         // borderRadius: "0 0 25px 25px",
//         // marginBottom: "30px",
//         position: "relative",
//         // height:"30vh"
//       }}
//     >
      
//       {/* المحتوى */}
//       <Container style={{ position: "relative", zIndex: 2 }}>
//         <Row className="justify-content-start align-items-center">
//           <Col lg={8} md={9} sm={12}>
//             <div style={{ textAlign: "right" }}>
//               <h1 
//                 style={{ 
//                   fontSize: "clamp(2.5rem, 6vw, 4rem)", 
//                   fontWeight: "800",
//                   lineHeight: "1.2",
//                   marginBottom: "25px",
//                   textShadow: "2px 2px 10px rgba(0,0,0,0.7)",
//                 }}
//               >
//                 <span style={{ color: "#f8d800" }}></span> كل اللي عربيتك محتاجاه هتلاقيه عندنا 
//               </h1>
              
//               <p 
//                 style={{ 
//                   fontSize: "clamp(1.2rem, 3vw, 1.6rem)", 
//                   margin: "30px 0",
//                   lineHeight: "1.8",
//                   textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
//                   maxWidth: "600px",
//                 }}
//               >
//                 جودة عالمية، وخدمة بمستوى يواكب المعايير الدولية،
// علشان نفضل دايماً الأختيار الأول لكبار الموردين والتجار حول العالم  
//               </p>
              
//               <div className="d-flex flex-wrap gap-4 justify-content-start mt-4 ">
//                 <Button
//                 className="main-color"
//                   href="/store"
//                   variant="warning"
//                   size="lg"
//                   style={{
//                     borderRadius: "50px",
//                     padding: "15px 45px",
//                     fontWeight: "700",
//                     fontSize: "1.1rem",
//                     boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
//                     transition: "all 0.3s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.transform = "translateY(-3px)";
//                     e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.4)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.transform = "translateY(0)";
//                     e.target.style.boxShadow = "0 5px 20px rgba(0,0,0,0.3)";
//                   }}
//                 >
//                   تصفح المنتجات
//                 </Button>
       
//                 {/* <Button
//                   variant="outline-light"
//                   size="lg"
//                   style={{
//                     borderRadius: "50px",
//                     padding: "15px 45px",
//                     fontWeight: "600",
//                     fontSize: "1.1rem",
//                     borderWidth: "3px",
//                     transition: "all 0.3s ease",
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
//                     e.target.style.transform = "translateY(-3px)";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = "transparent";
//                     e.target.style.transform = "translateY(0)";
//                   }}
//                 >
//                   <span style={{ marginLeft: "8px" }}>📊</span>
//                   شاهد التحليلات
//                 </Button> */}
//               </div>
              
//               {/* مؤشرات سريعة */}
//               {/* <div className="mt-5 pt-4 d-flex flex-wrap gap-5 justify-content-start border-top border-light border-opacity-25">
//                 {[
//                   { icon: "💰", title: "أسعار الذهب", desc: "تحديث مباشر" },
//                   { icon: "💵", title: "العملات الأجنبية", desc: "جميع العملات" },
//                   { icon: "📈", title: "توقعات السوق", desc: "تحليلات دقيقة" },
//                   { icon: "🍗", title: "المنتجات الغذائية", desc: "أسعار يومية" },
//                 ].map((item, index) => (
//                   <div key={index} className="d-flex align-items-center">
//                     <div style={{ fontSize: "2.5rem", marginLeft: "15px" }}>
//                       {item.icon}
//                     </div>
//                     <div>
//                       <h5 style={{ fontWeight: "700", margin: 0 }}>{item.title}</h5>
//                       <p style={{ margin: 0, opacity: 0.9, fontSize: "0.9rem" }}>{item.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div> */}
//               {/* <div className="">
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//               </div> */}
//             </div>
//           </Col>
//         </Row>
//          <div
//         style={{
//           // position: "absolute",
//           // bottom: "0px",
//           // left: "50%",
//           // transform: "translateX(-50%)",
//           // backgroundColor: "rgba(255, 255, 255, 0.95)",
//           // borderRadius: "15px",
//           // padding: "20px 40px",
//           // boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
//           // maxWidth: "90%",
//           // width: "840px",
//           marginTop:"50px",
//           // height: "100px",
//           flexWrap:"wrap",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-around",
//           zIndex: 3,
//           // border: "3px solid #f8d800",
//         }}
//       >
             
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={renault.src} width={75} height={75}  className=""/>
//                 <Image src={skoda.src} width={75} height={75}  className=""/>
//                 <Image src={chevrolet.src} width={75} height={75}  className=""/>
//                 {/* <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={peugeot.src} width={75} height={75}  className=""/> */}
              
//         {/* <div className="text-center">
//           <p style={{ margin: 0, color: "#333", fontSize: "1.2rem", fontWeight: "700" }}>
//             📢 مساحة إعلانية - (840 × 100)
//           </p>
//           <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.9rem" }}>
//             للإعلان هنا تواصل معنا
//           </p>
//         </div> */}
//       </div>
//       </Container>
      
//       {/* الإعلان في الأسفل */}
//       {/* <div
//         style={{
//           position: "absolute",
//           bottom: "0px",
//           left: "50%",
//           transform: "translateX(-50%)",
//           backgroundColor: "rgba(255, 255, 255, 0.95)",
//           borderRadius: "15px",
//           padding: "20px 40px",
//           boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
//           maxWidth: "90%",
//           width: "840px",
//           height: "100px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//           zIndex: 3,
//           // border: "3px solid #f8d800",
//         }}
//       >
             
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
//                 <Image src={peugeot.src} width={75} height={75}  className=""/>
              
//         <div className="text-center">
//           <p style={{ margin: 0, color: "#333", fontSize: "1.2rem", fontWeight: "700" }}>
//             📢 مساحة إعلانية - (840 × 100)
//           </p>
//           <p style={{ margin: "5px 0 0 0", color: "#666", fontSize: "0.9rem" }}>
//             للإعلان هنا تواصل معنا
//           </p>
//         </div>
//       </div> */}
//     </section>
//   );
// };

// export default Banner;




"use client";
import React from "react";
import { Button, Container, Row, Col, Image } from "react-bootstrap";
import bannerImg from './img/banner.jpg';
import peugeot from 'components/img/PEUGEOT.png'
import renault from 'components/img/RENAULT.png'
 import skoda from  'components/img/Skoda.png'
  import chevrolet from  'components/img/Chevrolet.png'

const Banner = () => {
  return (
    <section
    className="banner"
      style={{
        // backgroundImage: ` url(${bannerImg.src})`,
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
        // padding: "50px 0",
        // color: "#fff",
        // // minHeight: "600px",
        // display: "flex",
        // alignItems: "center",
        // borderRadius: "0 0 25px 25px",
        // marginBottom: "30px",
        // position: "relative",
        // height:"30vh"
      }}
    >
      
      {/* المحتوى */}
      {/* <Container style={{ position: "relative", zIndex: 2 }}>
        <Row className="justify-content-start align-items-center">
          <Col lg={8} md={9} sm={12}>
            <div style={{ textAlign: "right" }}> */}
         
             
              <img 
          
              src={bannerImg.src}
               >
              
              </img>
            
       
            
             
                          
            {/* </div>
          </Col>
        </Row>
        
      </Container>
       */}
   
    </section>
  );
};

export default Banner;

















