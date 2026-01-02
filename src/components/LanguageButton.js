// components/LanguageButton.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { getCurrentLanguage, changeSiteLanguage, onLanguageChange } from '@/app/language-store';

// export default function LanguageButton() {
//   const [lang, setLang] = useState(getCurrentLanguage());
  
//   // الاستماع لتغييرات اللغة
//   useEffect(() => {
//     const unsubscribe = onLanguageChange((newLang) => {
//       setLang(newLang);
//     });
    
//     return unsubscribe;
//   }, []);
  
//   const languages = [
//     { code: 'ar', name: 'العربية', flag: '🇸🇦' },
//     { code: 'en', name: 'English', flag: '🇬🇧' },
//     { code: 'fr', name: 'Français', flag: '🇫🇷' },
//     { code: 'zh', name: '中文', flag: '🇨🇳' }
//   ];
  
//   return (
//     <div style={{
//       display: 'flex',
//       gap: '8px',
//       background: '#f8f9fa',
//       padding: '10px',
//       borderRadius: '8px',
//       border: '1px solid #dee2e6'
//     }}>
//       {languages.map((l) => (
//         <button
//           key={l.code}
//           onClick={() => changeSiteLanguage(l.code)}
//           style={{
//             padding: '8px 12px',
//             background: lang === l.code ? '#0070f3' : 'white',
//             color: lang === l.code ? 'white' : '#333',
//             border: `1px solid ${lang === l.code ? '#0070f3' : '#ddd'}`,
//             borderRadius: '5px',
//             cursor: 'pointer',
//             fontSize: '14px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '6px',
//             transition: 'all 0.2s'
//           }}
//         >
//           <span>{l.flag}</span>
//           <span>{l.name}</span>
//         </button>
//       ))}
//     </div>
//   );
// }

///Very GOOD
// components/LanguageButton.jsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { getCurrentLanguage, changeSiteLanguage, onLanguageChange } from '@/app/language-store';

// export default function LanguageButton() {
//   const [lang, setLang] = useState(getCurrentLanguage());
//   const [isOpen, setIsOpen] = useState(false);
  
//   // الاستماع لتغييرات اللغة
//   useEffect(() => {
//     const unsubscribe = onLanguageChange((newLang) => {
//       setLang(newLang);
//     });
    
//     return unsubscribe;
//   }, []);
  
//   const languages = [
//     { code: 'ar', name: 'العربية', flag: '🇸🇦' },
//     { code: 'en', name: 'English', flag: '🇬🇧' },
//     { code: 'fr', name: 'Français', flag: '🇫🇷' },
//     { code: 'zh', name: '中文', flag: '🇨🇳' }
//   ];
  
//   const currentLang = languages.find(l => l.code === lang) || languages[0];
  
//   return (
//     <div style={{ position: 'relative' }}>
//       {/* زر التحديد الرئيسي */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           padding: '10px 16px',
//           background: 'white',
//           color: '#333',
//           border: '1px solid #dee2e6',
//           borderRadius: '8px',
//           cursor: 'pointer',
//           fontSize: '14px',
//           minWidth: '140px',
//           justifyContent: 'space-between',
//           transition: 'all 0.2s'
//         }}
//       >
//         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//           <span style={{ fontSize: '18px' }}>{currentLang.flag}</span>
//           <span>{currentLang.name}</span>
//         </div>
//         <span style={{ fontSize: '12px' }}>{isOpen ? '▲' : '▼'}</span>
//       </button>
      
//       {/* القائمة المنسدلة */}
//       {isOpen && (
//         <>
//           {/* overlay لإغلاق القائمة عند النقر خارجها */}
//           <div 
//             style={{
//               position: 'fixed',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 999
//             }}
//             onClick={() => setIsOpen(false)}
//           />
          
//           <div style={{
//             position: 'absolute',
//             top: 'calc(100% + 8px)',
//             left: 0,
//             right: 0,
//             background: 'white',
//             border: '1px solid #dee2e6',
//             borderRadius: '8px',
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//             zIndex: 1000,
//             overflow: 'hidden'
//           }}>
//             {languages.map((l) => (
//               <button
//                 key={l.code}
//                 onClick={() => {
//                   changeSiteLanguage(l.code);
//                   setIsOpen(false);
//                 }}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '12px',
//                   padding: '12px 16px',
//                   width: '100%',
//                   background: lang === l.code ? '#f8f9fa' : 'white',
//                   color: '#333',
//                   border: 'none',
//                   borderBottom: '1px solid #f0f0f0',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   transition: 'all 0.2s',
//                   textAlign: 'left'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = '#f8f9fa';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = lang === l.code ? '#f8f9fa' : 'white';
//                 }}
//               >
//                 <span style={{ fontSize: '18px' }}>{l.flag}</span>
//                 <span>{l.name}</span>
//                 {lang === l.code && (
//                   <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#0070f3' }}>✓</span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


// components/LanguageButton.jsx
'use client';

import { useState, useEffect } from 'react';
import { getCurrentLanguage, changeSiteLanguage, onLanguageChange } from '@/app/language-store';

export default function LanguageButton() {
  const [lang, setLang] = useState(getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onLanguageChange((newLang) => {
      setLang(newLang);
    });
    
    return unsubscribe;
  }, []);
  
  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇪🇬' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
  ];
  
  const currentLang = languages.find(l => l.code === lang) || languages[0];
  
  return (

//      <div style={{ position: 'relative' }}>
//     <button
//       onClick={() => setIsOpen(!isOpen)}
//       style={{
//         display: 'flex',
//         alignItems: 'center',
//         gap: '6px',
//         padding: '4px 8px',
//         background: 'white',
//         border: '1px solid #ddd',
//         borderRadius: '16px',
//         cursor: 'pointer',
//         fontSize: '12px',
//         transition: 'all 0.2s'
//       }}
//     >
//       <div style={{
//         width: '20px',
//         height: '20px',
//         borderRadius: '50%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         fontSize: '14px'
//       }}>
//         {currentLang.flag}
//       </div>
//       <span>{currentLang.name}</span>
//         <span style={{ 
//          fontSize: '10px', 
//           color: '#666',
//           marginLeft: '4px'
//         }}>
//          ▼
//       </span>
//     </button>
    
//     {isOpen && (
//       <div style={{
//         position: 'absolute',
//         top: '100%',
//         left: 0,
//         background: 'white',
//         border: '1px solid #ddd',
//         borderRadius: '8px',
//         boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//         zIndex: 100,
//         maxHeight: '200px',
//         overflowY: 'auto',
//         minWidth: '150px'
//       }}>
//         {languages.map((l) => (
//           <button
//             key={l.code}
//             onClick={() => {
//               changeSiteLanguage(l.code);
//               setIsOpen(false);
//             }}
//             style={{
//               display: 'flex',
//               alignItems: 'center',
//               gap: '10px',
//               padding: '8px 12px',
//               width: '100%',
//               background: lang === l.code ? '#f0f0f0' : 'white',
//               border: 'none',
//               cursor: 'pointer',
//               fontSize: '13px'
//             }}
//           >
//             <div style={{
//               width: '20px',
//               height: '20px',
//               borderRadius: '50%',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '14px'
//             }}>
//               {l.flag}
//             </div>
//             <span>{l.name}</span>
//           </button>
//         ))}
//       </div>
//     )}
//   </div>
    <div style={{ 
      position: 'relative',
      width: 'fit-content'
    }}>
      {/* زر التحديد المصغر */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          // padding: '6px 12px',
          padding: '3px 3px',
          // background: '#FFEA03',
          background:"transparent",
          color: '#333',
          // border: '1px solid #e0e0e0',
          border:"0",
          // borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '14px',
          minWidth: 'auto',
          transition: 'all 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          background: '#f8f9fa',
          border: '1px solid #e0e0e0'
        }}>
          {currentLang.flag}
        </div>
        {/* <span style={{ fontSize: '13px', fontWeight: '500' }}>
          {currentLang.name}
        </span> */}
        <span style={{ 
          fontSize: '8px', 
          color: '#666',
          marginLeft: '4px'
        }}>
          ▼
        </span>
      </button>
      
      {/* القائمة المنسدلة مع إمكانية التمرير */}
      {isOpen && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
            onClick={() => setIsOpen(false)}
          />
          
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
            zIndex: 1000,
            overflow: 'hidden',
            minWidth: '145px',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  changeSiteLanguage(l.code);
                  setIsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  width: '100%',
                  background: lang === l.code ? '#f0f7ff' : 'white',
                  color: lang === l.code ? '#0066ff' : '#333',
                  border: 'none',
                  borderBottom: '1px solid #f5f5f5',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = lang === l.code ? '#f0f7ff' : '#f9f9f9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = lang === l.code ? '#f0f7ff' : 'white';
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  background: '#f8f9fa',
                  border: '1px solid #e8e8e8',
                  flexShrink: 0
                }}>
                  {l.flag}
                </div>
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: lang === l.code ? '600' : '400'
                }}>
                  {l.name}
                </span>
                {lang === l.code && (
                  <span style={{ 
                    marginLeft: 'auto', 
                    fontSize: '14px', 
                    color: '#0066ff',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </span>
                )}
              </button>
            ))}
            
            {/* مؤشر التمرير */}
            {/* <div style={{
              textAlign: 'center',
              padding: '8px',
              fontSize: '11px',
              color: '#999',
              background: '#fafafa',
              borderTop: '1px solid #f0f0f0'
            }}>
              ↓ Scroll for more languages
            </div> */}
          </div>
        </>
      )}
    </div>
  );
}

// components/LanguageButton.jsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { getCurrentLanguage, changeSiteLanguage, onLanguageChange } from '@/app/language-store';

// export default function LanguageButton() {
//   const [lang, setLang] = useState(getCurrentLanguage());
//   const [isOpen, setIsOpen] = useState(false);
//   const [dropdownDirection, setDropdownDirection] = useState('right');
//   const buttonRef = useRef(null);
  
//   useEffect(() => {
//     const unsubscribe = onLanguageChange((newLang) => {
//       setLang(newLang);
//     });
    
//     return unsubscribe;
//   }, []);
  
//   const languages = [
//     { code: 'ar', name: 'العربية', flag: '🇪🇬' },
//     { code: 'en', name: 'English', flag: '🇺🇸' },
//     { code: 'fr', name: 'Français', flag: '🇫🇷' },
//     { code: 'zh', name: '中文', flag: '🇨🇳' },
  
//   ];
  
//   const currentLang = languages.find(l => l.code === lang) || languages[0];
  
//   // تحديد اتجاه الـ dropdown بناءً على المساحة المتاحة
//   const handleDropdownOpen = () => {
//     if (buttonRef.current) {
//       const buttonRect = buttonRef.current.getBoundingClientRect();
//       const spaceOnRight = window.innerWidth - buttonRect.right;
//       const spaceOnLeft = buttonRect.left;
      
//       // إذا المساحة على اليمين أقل من 200px، نفتح على اليسار
//       setDropdownDirection(spaceOnRight < 200 ? 'left' : 'right');
//     }
//     setIsOpen(!isOpen);
//   };
  
//   return (
//     <div style={{ 
//       position: 'relative',
//       display: 'inline-block'
//     }}>
//       {/* زر التحديد المصغر */}
//       <button
//         ref={buttonRef}
//         onClick={handleDropdownOpen}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//           padding: '6px 12px',
//           background: 'white',
//           color: '#333',
//           border: '1px solid #e0e0e0',
//           borderRadius: '20px',
//           cursor: 'pointer',
//           fontSize: '14px',
//           minWidth: 'auto',
//           transition: 'all 0.2s',
//           boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//           whiteSpace: 'nowrap'
//         }}
//       >
//         <div style={{
//           width: '24px',
//           height: '24px',
//           borderRadius: '50%',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           fontSize: '16px',
//           background: '#f8f9fa',
//           border: '1px solid #e0e0e0',
//           flexShrink: 0
//         }}>
//           {currentLang.flag}
//         </div>
//         <span style={{ 
//           fontSize: '13px', 
//           fontWeight: '500',
//           display: { xs: 'none', sm: 'block' } // يختفي على الشاشات الصغيرة
//         }}>
//           {currentLang.name}
//         </span>
//         <span style={{ 
//           fontSize: '10px', 
//           color: '#666',
//           marginLeft: '4px'
//         }}>
//           ▼
//         </span>
//       </button>
      
//       {/* القائمة المنسدلة - تفتح على الجانب المناسب */}
//       {isOpen && (
//         <>
//           <div 
//             style={{
//               position: 'fixed',
//               top: 0,
//               left: 0,
//               right: 0,
//               bottom: 0,
//               zIndex: 999
//             }}
//             onClick={() => setIsOpen(false)}
//           />
          
//           <div 
//             style={{
//               position: 'absolute',
//               top: '50%',
//               [dropdownDirection === 'right' ? 'left' : 'right']: 'calc(100% + 8px)',
//               transform: 'translateY(-50%)',
//               background: 'white',
//               border: '1px solid #e0e0e0',
//               borderRadius: '12px',
//               boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
//               zIndex: 1000,
//               overflow: 'hidden',
//               minWidth: '180px',
//               maxHeight: '300px',
//               overflowY: 'auto'
//             }}
//           >
//             {languages.map((l) => (
//               <button
//                 key={l.code}
//                 onClick={() => {
//                   changeSiteLanguage(l.code);
//                   setIsOpen(false);
//                 }}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '12px',
//                   padding: '10px 14px',
//                   width: '100%',
//                   background: lang === l.code ? '#f0f7ff' : 'white',
//                   color: lang === l.code ? '#0066ff' : '#333',
//                   border: 'none',
//                   borderBottom: '1px solid #f5f5f5',
//                   cursor: 'pointer',
//                   fontSize: '14px',
//                   transition: 'all 0.2s',
//                   textAlign: 'left'
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = lang === l.code ? '#f0f7ff' : '#f9f9f9';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = lang === l.code ? '#f0f7ff' : 'white';
//                 }}
//               >
//                 <div style={{
//                   width: '28px',
//                   height: '28px',
//                   borderRadius: '50%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: '16px',
//                   background: '#f8f9fa',
//                   border: '1px solid #e8e8e8',
//                   flexShrink: 0
//                 }}>
//                   {l.flag}
//                 </div>
//                 <span style={{ 
//                   fontSize: '14px',
//                   fontWeight: lang === l.code ? '600' : '400',
//                   whiteSpace: 'nowrap'
//                 }}>
//                   {l.name}
//                 </span>
//                 {lang === l.code && (
//                   <span style={{ 
//                     marginLeft: 'auto', 
//                     fontSize: '14px', 
//                     color: '#0066ff',
//                     fontWeight: 'bold'
//                   }}>
//                     ✓
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


// components/LanguageButton.jsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { getCurrentLanguage, changeSiteLanguage, onLanguageChange } from '@/app/language-store';

// export default function LanguageButton() {
//   const [lang, setLang] = useState(getCurrentLanguage());
//   const [isOpen, setIsOpen] = useState(false);
//   const containerRef = useRef(null);
//   const dropdownRef = useRef(null);
  
//   useEffect(() => {
//     const unsubscribe = onLanguageChange((newLang) => {
//       setLang(newLang);
//     });
    
//     // إغلاق الdropdown عند النقر خارج
//     const handleClickOutside = (event) => {
//       if (containerRef.current && 
//           !containerRef.current.contains(event.target) &&
//           dropdownRef.current && 
//           !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
    
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       unsubscribe();
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);
  
//   const languages = [
//     { code: 'ar', name: 'العربية', flag: '🇪🇬' },
//     { code: 'en', name: 'English', flag: '🇺🇸' },
//     { code: 'fr', name: 'Français', flag: '🇫🇷' },
//     { code: 'zh', name: '中文', flag: '🇨🇳' },
//     { code: 'es', name: 'Español', flag: '🇪🇸' }
//   ];
  
//   const currentLang = languages.find(l => l.code === lang) || languages[0];
  
//   return (
//     <div ref={containerRef} style={{ 
//       position: 'relative',
//       display: 'inline-block'
//     }}>
//       {/* زر اللغة الحالي - صغير الحجم */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: '6px',
//           padding: '5px 10px',
//           background: '#ffffff',
//           border: '1px solid #d1d5db',
//           borderRadius: '20px',
//           cursor: 'pointer',
//           fontSize: '12px',
//           color: '#374151',
//           minWidth: 'auto',
//           boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
//           transition: 'all 0.2s'
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.borderColor = '#9ca3af';
//           e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.borderColor = '#d1d5db';
//           e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
//         }}
//       >
//         <div style={{
//           width: '22px',
//           height: '22px',
//           borderRadius: '50%',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           fontSize: '14px',
//           background: '#f9fafb',
//           border: '1px solid #e5e7eb'
//         }}>
//           {currentLang.flag}
//         </div>
//         <span style={{ fontSize: '12px', fontWeight: '500' }}>
//           {currentLang.name}
//         </span>
//         <svg 
//           width="12" 
//           height="12" 
//           viewBox="0 0 24 24" 
//           fill="none" 
//           stroke="currentColor" 
//           strokeWidth="2"
//           style={{ 
//             marginLeft: '2px',
//             transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
//             transition: 'transform 0.2s'
//           }}
//         >
//           <path d="M6 9l6 6 6-6" />
//         </svg>
//       </button>
      
//       {/* القائمة المنسدلة - تفتح بجانب الزر */}
//       {isOpen && (
//         <div 
//           ref={dropdownRef}
//           style={{
//             position: 'absolute',
//             top: 0,
//             left: '100%',
//             marginLeft: '8px',
//             background: '#ffffff',
//             border: '1px solid #e5e7eb',
//             borderRadius: '10px',
//             boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
//             zIndex: 1000,
//             minWidth: '170px',
//             maxHeight: '280px',
//             overflowY: 'auto',
//             animation: 'slideIn 0.15s ease-out'
//           }}
//         >
//           {/* Header */}
//           <div style={{
//             padding: '10px 14px',
//             borderBottom: '1px solid #f3f4f6',
//             fontSize: '12px',
//             color: '#6b7280',
//             fontWeight: '600',
//             backgroundColor: '#f9fafb'
//           }}>
//             Select Language
//           </div>
          
//           {/* Language List */}
//           <div style={{ maxHeight: '230px', overflowY: 'auto' }}>
//             {languages.map((l) => (
//               <button
//                 key={l.code}
//                 onClick={() => {
//                   changeSiteLanguage(l.code);
//                   setIsOpen(false);
//                 }}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '10px',
//                   padding: '10px 14px',
//                   width: '100%',
//                   background: lang === l.code ? '#eff6ff' : 'transparent',
//                   border: 'none',
//                   borderBottom: '1px solid #f3f4f6',
//                   cursor: 'pointer',
//                   fontSize: '13px',
//                   color: lang === l.code ? '#1d4ed8' : '#374151',
//                   transition: 'all 0.15s'
//                 }}
//                 onMouseEnter={(e) => {
//                   if (lang !== l.code) {
//                     e.currentTarget.style.background = '#f9fafb';
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (lang !== l.code) {
//                     e.currentTarget.style.background = 'transparent';
//                   }
//                 }}
//               >
//                 <div style={{
//                   width: '24px',
//                   height: '24px',
//                   borderRadius: '50%',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   fontSize: '15px',
//                   background: '#f3f4f6',
//                   border: lang === l.code ? '2px solid #3b82f6' : '1px solid #e5e7eb'
//                 }}>
//                   {l.flag}
//                 </div>
//                 <span style={{ 
//                   fontSize: '13px',
//                   fontWeight: lang === l.code ? '600' : '400',
//                   textAlign: 'left',
//                   flex: 1
//                 }}>
//                   {l.name}
//                 </span>
//                 {lang === l.code && (
//                   <svg 
//                     width="16" 
//                     height="16" 
//                     viewBox="0 0 24 24" 
//                     fill="none" 
//                     stroke="currentColor" 
//                     strokeWidth="3"
//                     style={{ color: '#3b82f6' }}
//                   >
//                     <path d="M20 6L9 17l-5-5" />
//                   </svg>
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
      
//       <style jsx>{`
//         @keyframes slideIn {
//           from {
//             opacity: 0;
//             transform: translateX(-5px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }
        
//         /* Scrollbar styling */
//         div::-webkit-scrollbar {
//           width: 6px;
//         }
        
//         div::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 10px;
//         }
        
//         div::-webkit-scrollbar-thumb {
//           background: #c1c1c1;
//           border-radius: 10px;
//         }
        
//         div::-webkit-scrollbar-thumb:hover {
//           background: #a8a8a8;
//         }
//       `}</style>
//     </div>
//   );
// }