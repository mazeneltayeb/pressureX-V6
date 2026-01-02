// "use client";
// import { Card , Button } from "react-bootstrap";

// const ProductCategories = () => {



//   return (
//     <section className="latest-articles-section p-3">
//       <div className="container">
//         <h2 className="text-center mb-4">فئات المنتجات</h2>
//         <div className="row">
//               <Card className=" col-md-4 mb-4 product-categories shadow-sm border-0 h-100">
//                 <Card.Img
//                   variant="top"
                  
//                   src={require('./img/Skoda.png')}
//                   alt=""
//                   style={{ height: "180px", objectFit: "cover" }}
//                 />
//                 <Card.Body>
//                   <Card.Title>اجزاء جسم السيارة</Card.Title>
//                   {/* <Card.Text>"article.description"</Card.Text> */}
//                   {/* <a href={article.link} className="btn btn-primary">
//                     اقرأ المزيد
//                   </a> */}
                
//                 </Card.Body>
//               </Card>
            
//              <div className="col-md-4 mb-4">
//               <Card className="article-card shadow-sm border-0 h-100">
//                 <Card.Img
//                   variant="top"
//                   src="https://via.placeholder.com/300x180"
//                   alt=""
//                   style={{ height: "180px", objectFit: "cover" }}
//                 />
//                 <Card.Body>
//                   <Card.Title>الاجزاء الكهربائية</Card.Title>
//                   <Card.Text>"article.description"</Card.Text>
//                   {/* <a href={article.link} className="btn btn-primary">
//                     اقرأ المزيد
//                   </a> */}
//                   <Button  className="main-button" >
//                   اقرأ المزيد
//                 </Button>
//                 </Card.Body>
//               </Card>
//             </div>
//               <div className="col-md-4 mb-4">
//               <Card className="article-card shadow-sm border-0 h-100">
//                 <Card.Img
//                   variant="top"
//                   src=""
//                   alt=""
//                   style={{ height: "180px", objectFit: "cover" }}
//                 />
//                 <Card.Body>
//                   <Card.Title>اجزاء الهيكل</Card.Title>
//                   <Card.Text>"article.description"</Card.Text>
//                   {/* <a href={article.link} className="btn btn-primary">
//                     اقرأ المزيد
//                   </a> */}
//                   <Button  className="main-button" >
//                   اقرأ المزيد
//                 </Button>
//                 </Card.Body>
//               </Card>
//             </div>
//               <div className="col-md-4 mb-4">
//               <Card className="article-card shadow-sm border-0 h-100">
//                 <Card.Img
//                   variant="top"
//                   src=""
//                   alt=""
//                   style={{ height: "180px", objectFit: "cover" }}
//                 />
//                 <Card.Body>
//                   <Card.Title>اجزاء المحرك</Card.Title>
//                   <Card.Text>"article.description"</Card.Text>
//                   {/* <a href={article.link} className="btn btn-primary">
//                     اقرأ المزيد
//                   </a> */}
//                   <Button  className="main-button" >
//                   اقرأ المزيد
//                 </Button>
//                 </Card.Body>
//               </Card>
//             </div>
        
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ProductCategories;

"use client";
import { Card, Button } from "react-bootstrap";
import BodyImage from './img/body.png';
import ChassisImage from './img/chassis.png';
import ElectricalImage from './img/electrical.png';
import EngineImage from './img/engine.png';
import useTranslate from '@/hooks/useTranslate';

const ProductCategories = () => {
  const { t, lang } = useTranslate(null);
  
  const categories = [
    {
      id: 1,
      title: t('CarBodyParts'),
      image: BodyImage, // تأكد من المسار
      description: "وصف فئة اجزاء جسم السيارة"
    },
    {
      id: 2,
      title: t('ElectricalParts'),
      image: ElectricalImage, // أضف الصورة
      description: "وصف الاجزاء الكهربائية"
    },
       {
      id: 3,
      title: t('ChassisParts'),
      image: ChassisImage, // أضف الصورة
      description: "وصف الاجزاء الكهربائية"
    },
          {
      id: 4,
      title: t('EngineParts'),
      image: EngineImage, // أضف الصورة
      description: "وصف الاجزاء الكهربائية"
    },
    // ... أضف بقية الفئات
  ];

  return (
    <section className="latest-articles-section p-3">
      <div className="container">
        <h2
        style={{
          fontSize: "6vh"
        }}
        className="text-center m-0 fw-bolder">{t('categoriesH1')}</h2>
        <p className="text-center text-secondary">{t('categoriesP')}</p>
        <div className="row">
          {categories.map((category) => (
            <div className="col-md-3 mb-4" key={category.id}>
              <Card className="article-card shadow-sm border-0 h-100">
                <Card.Img
                  variant="top"
                  src={category.image.src}
                  alt={category.title}
                  style={{ height: "225px", objectFit: "contain" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x180";
                  }}
                />
                <Card.Body>
                  <Card.Title className="text-center">{category.title}</Card.Title>
                  {/* <Card.Text>{category.description}</Card.Text> */}
                  {/* <Button className="main-button">
                    اقرأ المزيد
                  </Button> */}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;