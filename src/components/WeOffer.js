"use client";
import { Card, Button } from "react-bootstrap";
// import ShowRoom from './img/showroom.jpg';
// import Trank from './img/trank.png';
// import List from './img/list.jpg';
import { FaTruck } from "react-icons/fa6";
import { LiaClipboardListSolid } from "react-icons/lia";
import { BiSolidOffer } from "react-icons/bi";
import useTranslate from '@/hooks/useTranslate';



// import ElectricalImage from './img/electrical.png';
// import EngineImage from './img/engine.png';
const WeOffer = () => {
  const { t, lang } = useTranslate(null);
  
  const categories = [
    {
      id: 1,
      title: t('show_room_title'),
      number:50,
      // image: ShowRoom, // تأكد من المسار
      description:t('show_room_description'),
       icon: 'Show Room',
    },
    {
      id: 2,
      title: t('delivery_we_offer_title'),
        number:20,
      // image: Trank, // أضف الصورة
      description: t('delivery_we_offer_description'),
       icon: <FaTruck />
    },
       {
      id: 3,
      title: t('list_we_offer_title'),
        number:30 ,
      // image: List, // أضف الصورة
      description: t('list_we_offer_description'),
       icon: <LiaClipboardListSolid />

    },
          {
      id: 4,
      title:t('price_we_offer_title'),
        number:10,
      // image: Trank, // أضف الصورة
      description: t('price_we_offer_description'),
      icon: <BiSolidOffer />
    },
    // ... أضف بقية الفئات
    
  ];

  return (
    <section className="latest-articles-section p-3">
      <div className="">
        <h1
        
        className="text-center mb-4">{t('we_offer_h1')}</h1>
                <p className="text-center text-secondary">{t('we_offer_p')}</p>

        <div className="row" style={{
          display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
        }}>
          {categories.map((category) => (
            <div className="col-md-3 mb-4" key={category.id} style={{minWidth:"250px" , maxWidth:"350px" ,height:"275px"}}>
              <Card className="numbers-card shadow-sm border-0 h-100 ">
                {/* <Card.Img
                  variant="top"
                  src={category.image.src}
                  alt={category.title}
                  style={{ height: "225px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/300x180";
                  }}
                /> */}
                    <div
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
                {/* <FaTruck  /> */}
                  </div>
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
                <Card.Body>
                  <Card.Title className="text-center">{category.title}</Card.Title>
                  <Card.Text className="text-center text-secondary"
                  >{category.description}</Card.Text>
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

export default WeOffer;