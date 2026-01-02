// // components/SwiperCarSlider.jsx
// import React, { useEffect, useState } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Autoplay, Pagination, Navigation, Grid } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import 'swiper/css/navigation';
// import 'swiper/css/grid';
//     import styles from './SwiperCarSlider.module.css';

// // استيراد الصور
// import SkodaImage from './img/Skoda.png';
// import PEUGEOTImage from './img/PEUGEOT.png';
// import ChevroletImage from './img/Chevrolet.png';
// import RENAULTImage from './img/RENAULT.png';

// const SwiperCarSlider = ({ 
//   slides = [],
//   autoPlay = true,
//   delay = 3000,
//   showPagination = true,
//   showNavigation = true,
//   loop = true
// }) => {
//   const [isRTL, setIsRTL] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
  
//   // بيانات افتراضية
//   const defaultSlides = [
//     {
//       id: 1,
//       title: "سكودا",
//       image: SkodaImage,
//       description: "سيارة سكودا فاخرة"
//     },
//     {
//       id: 2,
//       title: "تويوتا",
//       image: ChevroletImage,
//       description: "سيارة تويوتا موثوقة"
//     },
//     {
//       id: 3,
//       title: "مرسيدس",
//       image: PEUGEOTImage,
//       description: "سيارة مرسيدس فاخرة"
//     },
//     {
//       id: 4,
//       title: "بي إم دبليو",
//       image: RENAULTImage,
//       description: "سيارة بي إم دبليو رياضية"
//     },
//     {
//       id: 5,
//       title: "هيونداي",
//       image: SkodaImage,
//       description: "سيارة هيونداي اقتصادية"
//     },
//     {
//       id: 6,
//       title: "كيا",
//       image: RENAULTImage,
//       description: "سيارة كيا حديثة"
//     },
//     {
//       id: 7,
//       title: "نيسان",
//       image: PEUGEOTImage,
//       description: "سيارة نيسان عملية"
//     },
//     {
//       id: 8,
//       title: "شيفروليه",
//       image: ChevroletImage,
//       description: "سيارة شيفروليه أمريكية"
//     }
//   ];

//   useEffect(() => {
//     // تحديد اتجاه اللغة
//     setIsRTL(document.documentElement.dir === 'rtl' || window.location.href.includes('ar'));
    
//     // تحديد إذا كان موبايل
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   const slidesToShow = slides.length > 0 ? slides : defaultSlides;

//   return (
//     <div className={styles.container}>
//       <Swiper
//         dir={isRTL ? 'rtl' : 'ltr'}
//         rtl={isRTL}
//         slidesPerView={isMobile ? 2 : 4}
//         spaceBetween={20}
//         loop={loop}
//         autoplay={autoPlay ? {
//           delay: delay,
//           disableOnInteraction: false,
//           pauseOnMouseEnter: true,
//         } : false}
//         pagination={showPagination ? {
//           clickable: true,
//           dynamicBullets: true,
//         } : false}
//         navigation={showNavigation && !isMobile}
//         breakpoints={{
//           320: {
//             slidesPerView: 2,
//             spaceBetween: 10,
//           },
//           480: {
//             slidesPerView: 2,
//             spaceBetween: 10,
//           },
//           640: {
//             slidesPerView: 2,
//             spaceBetween: 15,
//           },
//           768: {
//             slidesPerView: 3,
//             spaceBetween: 15,
//           },
//           1024: {
//             slidesPerView: 3,
//             spaceBetween: 20,
//           },
//           1200: {
//             slidesPerView: 4,
//             spaceBetween: 20,
//           },
//         }}
//         modules={[Autoplay, Pagination, Navigation]}
//         className={styles.swiper}
//       >
//         {slidesToShow.map((slide) => (
//           <SwiperSlide key={slide.id} className={styles.slide}>
//             <div className={styles.slideContent}>
//               <div className={styles.imageWrapper}>
//                 <img 
//                   src={slide.image?.src || slide.image} 
//                   alt={slide.title}
//                   className={styles.carImage}
//                   loading="lazy"
//                 />
//               </div>
//               {/* <div className={styles.carInfo}>
//                 <h3 className={styles.carTitle}>{slide.title}</h3>
//                 <p className={styles.carDescription}>{slide.description}</p>
//               </div> */}
//             </div>
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </div>
//   );
// };

// export default SwiperCarSlider;

// components/SwiperCarSlider.jsx
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import styles from './SwiperCarSlider.module.css';

// استيراد الصور
import SkodaImage from './img/Skoda.png';
import PEUGEOTImage from './img/PEUGEOT.png';
import ChevroletImage from './img/Chevrolet.png';
import RENAULTImage from './img/RENAULT.png';

const SwiperCarSlider = ({ 
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
  
  // بيانات افتراضية
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
      <div className={styles.container}>
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
            <div className={styles.slideContent}>
              <div className={styles.imageWrapper}>
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
              </div>
              {/* <div className={styles.carInfo}>
                <h3 className={styles.carTitle}>{slide.title}</h3>
                <p className={styles.carDescription}>{slide.description}</p>
              </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperCarSlider;