import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './SwiperCarSlider.module.css';
import useTranslate from '@/hooks/useTranslate';

// استيراد الصور
import oneImage from './img/1.jpg';
import twoImage from './img/2.jpg';
import threeImage from './img/3.jpg';
import fourImage from './img/4.jpg';
import fiveImage from './img/5.jpg';
import sixImage from './img/6.jpg';
import sevenImage from './img/7.jpg';

const SwiperCustomers = ({ 
  slides = [],
  autoPlay = true,
  delay = 3000,
  showPagination = true,
  showNavigation = true,
  loop = true
}) => {
  const [isRTL, setIsRTL] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { t, lang } = useTranslate(null);
  
  // بيانات افتراضية
  const defaultSlides = [
    {
      id: 1,
      title:  t('cairo'),
      // description: t('cairo'),
      image: oneImage
    },
    {
      id: 2,
        title: t('giza'),
      // description: t('giza'),
      image: twoImage,
    },
    {
      id: 3,
       title:t('alexandria'),
      // description: t('alexandria'),
      image: threeImage
    },
    {
      id: 4,
      title: t('ismailia'),
      // description:t('ismailia'),
      image: fourImage
    },
    {
      id: 5,
        title: t('suez'),
      // description: t('suez'),
      image: fiveImage,
    },
    {
      id: 6,
        title:t('port_said'),
      // description:t('port_said'),
      image: sixImage
    },
    {
      id: 7,
         title: t('minya'),
      // description:t('minya'),
      image: sevenImage,
    }
 
  ];

  useEffect(() => {
    setMounted(true);
    
    // تحديد اتجاه اللغة
    const checkRTL = () => {
      const htmlDir = document.documentElement.dir;
      const lang = document.documentElement.lang;
      const isArabic = htmlDir === 'rtl' || lang === 'ar' || window.location.href.includes('ar');
      setIsRTL(isArabic);
    };
    
    // تحديد إذا كان موبايل
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkRTL();
    checkMobile();
    
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const slidesToShow = slides.length > 0 ? slides : defaultSlides;

  // لا تعرض شيئاً أثناء التحميل على السيرفر
  if (!mounted) {
    return (
      <div className="">
        <div className={styles.loadingPlaceholder}>
          {/* عرض عناصر تحميل مؤقتة */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.placeholderSlide}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div  style={{
                    textAlign:"center",
                    marginBottom:"50px"
                }}>
         <h1>{t("customerH1")}</h1>
                         <p className="text-center text-secondary">{t("customerP")}</p>

      </div>
               

      <Swiper
        dir={isRTL ? 'rtl' : 'ltr'}
        rtl={isRTL ? 'rtl' : 'ltr'} // تصحيح هنا - يجب أن تكون string
        slidesPerView={isMobile ? 2 : 4}
        spaceBetween={20}
        loop={loop}
        autoplay={autoPlay ? {
          delay: delay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        pagination={false}
        navigation={false}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className={styles.swiper}
        // إضافة خاصية لتهيئة Swiper بعد التحميل
        onSwiper={(swiper) => {
          // إعادة تحميل Swiper بعد التهيئة
          setTimeout(() => {
            swiper.update();
          }, 100);
        }}
      >
        {slidesToShow.map((slide) => (
          <SwiperSlide key={slide.id} className={styles.slide}>
            {/* <div className={styles.slideContent}>
              <div className={styles.imageWrapper}> */}
                <img 
                  src={slide.image?.src || slide.image || '/placeholder-car.jpg'} 
                  alt={slide.title}
                  className={styles.carImage}
                  loading="lazy"
                  width="300"
                  height="200"
                  onError={(e) => {
                    e.target.src = '/placeholder-car.jpg';
                  }}
                />
              {/* </div> */}
              <div className={styles.carInfo}  >
                <h3 className={styles.carTitle}>{slide.title}</h3>
                {/* <p className={styles.carDescription}>{slide.description}</p> */}
              </div>
            {/* // </div> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperCustomers;