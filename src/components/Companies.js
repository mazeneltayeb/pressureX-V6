"use client";
import { Card, Button } from "react-bootstrap";

// import { FaTruck } from "react-icons/fa6";
// import { LiaClipboardListSolid } from "react-icons/lia";
// import { BiSolidOffer } from "react-icons/bi";

import CrtImg from "./img/ctr.png"
import Bosch from "./img/bosch.png"
import Dayco from "./img/dayco.png"
import Mrw from "./img/mrw.png"
import Nipparts from "./img/nipparts.png"
import useTranslate from '@/hooks/useTranslate';

const Companies = () => {
const { t, lang } = useTranslate(null);
  const categories = [
    {
      id: 1,
      title:"شعار شركة بوش لقطع غيار السيارات - Crt",
      number:50,
      image: CrtImg, // تأكد من المسار
      description: "هتقدر تعاين كل قطعة بنفسك وتشوف جودتها على الطبيعة",
      //  icon: "Show Room",
    },
    {
      id: 2,
      title: "شعار شركة بوش لقطع غيار السيارات - Bosch Auto Parts",
        number:20,
      image: Bosch, // أضف الصورة
      description: "عربيتنا مغطية جميع انحاء الجمهورية",
      //  icon: <FaTruck />
    },
       {
      id: 3,
      title: "شعار شركة بوش لقطع غيار السيارات - Dayco",
        number:30 ,
      image: Dayco, // أضف الصورة
      description: "اكبر تشكيلة قطع غيار في مصر بتتحديث شهريا",
      //  icon: <LiaClipboardListSolid />

    },
          {
      id: 4,
      title:"شعار شركة بوش لقطع غيار السيارات - Mrw",
        number:10,
      image: Mrw, // أضف الصورة
      description: "ارخص الاسعار واعلى جودة في السوق المصري وافضل الخصومات",
      // icon: <BiSolidOffer />
    },
       {
      id: 5,
      title:"شعار شركة بوش لقطع غيار السيارات - Nipparts",
        number:10,
      image: Nipparts, // أضف الصورة
      description: "ارخص الاسعار واعلى جودة في السوق المصري وافضل الخصومات",
      // icon: <BiSolidOffer />
    },
    // ... أضف بقية الفئات
  ];

  return (
    <section className="latest-articles-section p-3">
      <div className="">
        <h1
        
        className="text-center mb-2">{t('companies_h1')}</h1>
                <p className="text-center text-secondary mb-4"> {t('companies_p')}</p>

        <div className="row"
         style={{
             display: "flex",
             justifyContent: "space-evenly",
             alignItems: "center",
              }}>
          {categories.map((category) => (
            <div className="col-md-2   mb-4" key={category.id} 
            style={{  
                      minWidth:"225px",
                      maxWidth:"250px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center", 
                       }}>
              <Card className="numbers-card shadow border-0 " 
                     style={{ 
                    height: "127px",
                     width:"127px",
                      objectFit: "contain",
                      borderRadius:"50%",
                      display:"flex",
                      justifyContent:"center",
                      alignItems:"center"
                   }}
              
              >
                <Card.Img
                  variant="top"
                  src={category.image.src}
                  alt={category.title}
               
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x180";
                  }}
                />
                    {/* <div
                  variant="top"
                 className="d-flex justify-content-center align-items-center we-offer-icon"
                  alt={category.title}
                  style={{ height: "225px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x180";
                  }}
                >
                  {category.icon}
             
                  </div> */}
                {/* <div
                
                 style={{ height: "225px" ,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "6rem",
                          fontWeight: "bold",
                          color: "#ffea03",
                        }}
                >
                 {category.number}
                </div> */}
                {/* <Card.Body>
                  <Card.Title className="text-center">{category.title}</Card.Title>
                  <Card.Text className="text-center text-secondary"
                  >{category.description}</Card.Text>
                </Card.Body> */}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Companies;