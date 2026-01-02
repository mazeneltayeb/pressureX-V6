// export const translations = {
//   ar: {
//     // Navigation
//     home: "الرئيسية",
//     about: "من نحن",
//     contact: "اتصل بنا",
//     Article:"المقالات",
//     Lists:"كسوفات",
//     Store:"متجر",
//     sign_in: "تسجيل الدخول",
//     sign_up: "إنشاء حساب",
    
//     // Messages
//     loading: "جاري التحميل...",
//     success: "تم بنجاح!",
//     error: "حدث خطأ"
//   },
  
//   en: {
//      // Navigation
//     home: "Home",
//     about: "About Us",
//     contact: "Contact",
//     sign_in: "Sign In",
//     sign_up: "Sign Up",
//     Article:"Articles",
//     Lists:"Lists",
//     Store:"Store",
//   },
  
//   fr: {
//      // Navigation
//     home: "Accueil",
//     about: "À propos",
//     contact: "Contact",
//     sign_in: "Se connecter",
//     sign_up: "S'inscrire",
//     Article:"Articles",
//     Lists:"Listes",
//     Store:"Magasin",
//   },
  
//   zh: {
//      // Navigation
//     home: "主页",
//     about: "关于我们",
//     contact: "联系我们",
//     sign_in: "登录",
//     sign_up: "注册",
//     sign_out:"",
//     Article:"文章",
//     Lists:"名单",
//     Store:"商店",
//   }
// };


// دالة للاستخدام خارج المكونات (مثل في utilities)
// export function translate(key, lang = 'ar') {
//   return translations[lang]?.[key] || translations.ar[key] || key;
// }

// دالة محسنة للترجمة
// export function t(key, lang = 'ar') {
//   const langTranslations = translations[lang];
  
//   if (!langTranslations) {
//     console.warn(`❌ Language "${lang}" not found, falling back to Arabic`);
//     return translations.ar[key] || key;
//   }
  
//   const translation = langTranslations[key];
  
//   if (!translation) {
//     console.warn(`❌ Translation for key "${key}" not found in language "${lang}"`);
//     return translations.ar[key] || key;
//   }
  
//   return translation;
// }

// // الحصول على اللغة الحالية
// export function getCurrentLanguage() {
//   if (typeof window !== 'undefined') {
//     return localStorage.getItem('app_language') || 'ar';
//   }
//   return 'ar';
// }

// دالة ذكية للترجمة
// export function t(key, lang = 'ar') {
//   // جرب اللغة المطلوبة
//   if (translations[lang] && translations[lang][key]) {
//     return translations[lang][key];
//   }
  
//   // جرب الإنجليزية كبديل
//   if (translations.en && translations.en[key]) {
//     console.warn(`⚠️ Translation for "${key}" not found in ${lang}, using English`);
//     return translations.en[key];
//   }
  
//   // جرب العربية كبديل أخير
//   if (translations.ar && translations.ar[key]) {
//     console.warn(`⚠️ Translation for "${key}" not found, using Arabic`);
//     return translations.ar[key];
//   }
  
//   // إذا مش موجود في أي لغة، أرجع المفتاح نفسه
//   console.error(`❌ Translation for "${key}" not found in any language`);
//   return key;
// }

// // دالة للحصول على معلومات اللغة
// export const languageInfo = {
//   ar: { name: "العربية", dir: "rtl", flag: "🇸🇦" },
//   en: { name: "English", dir: "ltr", flag: "🇬🇧" },
//   fr: { name: "Français", dir: "ltr", flag: "🇫🇷" },
//   zh: { name: "中文", dir: "ltr", flag: "🇨🇳" }
// };