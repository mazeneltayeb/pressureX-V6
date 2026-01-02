// components/SlickSlider.jsx
import React, { useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './SlickSlider.module.css';

// استيراد جميع الصور المحلية
import SkodaImage from './img/Skoda.png';
import PEUGEOTImage from './img/PEUGEOT.png';
import ChevroletImage from './img/Chevrolet.png';
import RENAULTImage from './img/RENAULT.png';


const SlickSlider = ({ 
  slides = [], 
  autoPlay = true, 
  autoPlaySpeed = 3000,
  showDots = true,
  showArrows = true,
  infinite = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // بيانات افتراضية للصور المحلية
  const defaultSlides = [
    {
      id: 1,
      title: "سكودا",
      image: SkodaImage,
      description: "سيارة سكودا فاخرة"
    },
    {
      id: 2,
      title: "تويوتا",
      image: ChevroletImage,
      description: "سيارة تويوتا موثوقة"
    },
    {
      id: 3,
      title: "مرسيدس",
      image: PEUGEOTImage,
      description: "سيارة مرسيدس فاخرة"
    },
    {
      id: 4,
      title: "بي إم دبليو",
      image: RENAULTImage,
      description: "سيارة بي إم دبليو رياضية"
    },
    {
      id: 5,
      title: "هيونداي",
      image: SkodaImage,
      description: "سيارة هيونداي اقتصادية"
    },
    {
      id: 6,
      title: "كيا",
      image: RENAULTImage,
      description: "سيارة كيا حديثة"
    },
    {
      id: 7,
      title: "نيسان",
      image: PEUGEOTImage,
      description: "سيارة نيسان عملية"
    },
    {
      id: 8,
      title: "شيفروليه",
      image: ChevroletImage,
      description: "سيارة شيفروليه أمريكية"
    }
  ];

  // إعدادات Slick الأساسية
  const settings = {
    dots: showDots,
    arrows: showArrows,
    infinite: infinite,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: autoPlay,
    autoplaySpeed: autoPlaySpeed,
    pauseOnHover: true,
    cssEase: "linear",
    draggable: true,
    swipe: true,
    touchMove: true,
    variableWidth: false, // تأكد أنها false
    beforeChange: () => setIsDragging(true),
    afterChange: () => setIsDragging(false),
    
    // إعدادات الاستجابة للشاشات المختلفة
    responsive: [
        
      {
       

        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
           variableWidth: false,
        }
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
           variableWidth: false,
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
           variableWidth: false,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
           variableWidth: false
        }
      }
    ]
  };

  const slidesToShow = slides.length > 0 ? slides : defaultSlides;

  return (
    <div className={styles.sliderContainer}>
      {/* <h2 className={styles.sliderTitle}>معرض السيارات</h2>
      <p className={styles.sliderDescription}>
        تصفح تشكيلة سياراتنا المميزة - 5 سيارات في الصفحة الكبيرة
      </p> */}
      
      <div className={styles.sliderWrapper}>
        <Slider {...settings}>
          {slidesToShow.map((slide) => (
            // الصورة هي العنصر الرئيسي مباشرة
            <div key={slide.id} className={styles.slideItem }>
              <img 
                src={slide.image.src || slide.image} 
                alt={slide.title} 
                className={styles.slideImage}
                title={slide.title}
                loading="lazy"
              />
            </div>
          ))}
        </Slider>
      </div>
      
      {/* <div className={styles.sliderControls}>
        <div className={styles.controlsInfo}>
          <span className={styles.controlBadge}>
            <span className={styles.controlIcon}>🖱️</span>
            اسحب للتحريك يدوياً
          </span>
          <span className={styles.controlBadge}>
            <span className={styles.controlIcon}>⏱️</span>
            التحرك التلقائي كل {autoPlaySpeed/1000} ثواني
          </span>
          <span className={styles.controlBadge}>
            <span className={styles.controlIcon}>📱</span>
            متجاوب مع جميع الشاشات
          </span>
        </div>
      </div> */}
    </div>
  );
};

export default SlickSlider;


