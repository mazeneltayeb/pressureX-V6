// app/language-store.js
// هذا الملف يحفظ حالة اللغة لجميع المكونات

'use client';

let currentLanguage = 'en';
let listeners = [];

// الترجمة لكامل الموقع
const siteTranslations = {
   ar: {
    // Navigation
    home: "الرئيسية",
    about: "من نحن",
    contact: "اتصل بنا",
    Article:"المقالات",
    Lists:"كسوفات",
    Store:"متجر",
    sign_in: "تسجيل الدخول",
    sign_up: "إنشاء حساب",
    sign_out:"تسجيل الخروج",
    
    /////start home//////
    //vedio
    //
      abouttext:"في بريشر نوفر للتجار والموزعين قطع غيار سيارات عالية الجودة مستوردة مباشرة من مصانع معتمدة في الصين، لتضمن استمرارية التوريد، وثبات الجودة، وزيادة ثقة عملائك. نعمل بأسعار تنافسية ومعايير صارمة تواكب متطلبات السوق المصري، مع التزام كامل بالدعم والتعاون طويل الأمد. كما نقدم منتجات موثوقة تلبي احتياجات المستخدم النهائي وتضمن أداءً يعتمد عليه على المدى الطويل تواصل معنا وابدأ شراكة قائمة على الجودة والاعتمادية.",
    //  button
    button_more:"تواصل معنا",
    //

    // categorie
    categoriesH1:"فئات المنتجات",
    categoriesP:"في بريشر، نحرص على توفير كافة قطع الغيار لمختلف أجزاء السيارة، بمعايير جودة لا تقبل المساومة.",
    CarBodyParts:"اجزاء جسم السيارة",
    ElectricalParts:"الاجزاء الكهربائية",
    ChassisParts:"اجزاء الهيكل",
    EngineParts:"اجزاء المحرك",
    //

    //Clients//
    customerH1:"عملائنا حول مصر",
    customerP:"نمتلك قاعدة عملاء قوية تمتد عبر جميع محافظات مصر، تعكس ثقة السوق في خدماتنا.",
    ShopName:"",
    Name_of_the_province:"",
    //
   // egyptGovernorates
      cairo: "القاهرة",
      giza: "الجيزة",
      alexandria: "الإسكندرية",
      dakahlia: "الدقهلية",
      red_sea: "البحر الأحمر",
      beheira: "البحيرة",
      fayoum: "الفيوم",
      gharbia: "الغربية",
      ismailia: "الإسماعيلية",
      menofia: "المنوفية",
      minya: "المنيا",
      qalyubia: "القليوبية",
      new_valley: "الوادي الجديد",
      suez: "السويس",
      aswan: "أسوان",
      assiut: "أسيوط",
      beni_suef: "بني سويف",
      port_said: "بورسعيد",
      damietta: "دمياط",
      sharqia: "الشرقية",
      south_sinai: "جنوب سيناء",
      kafr_el_sheikh: "كفر الشيخ",
      matrouh: "مطروح",
      luxor: "الأقصر",
      qena: "قنا",
      north_sinai: "شمال سيناء",
      sohag: "سوهاج",
    //
     
        //WeOffer//
    we_offer_h1:"مميزات شركتنا في قطع غيار السيارات",
    we_offer_p:"نسعى لنكون شريكك الأول في مصر، من خلال الجودة ، الانتشار الواسع، والتسعير التنافسي",
                  // //show room
    show_room_title:"أول غرفة عرض لقطع غيار في مصر",
    show_room_description:"تعاين قطع الغيار الأصلية قبل الشراء في مساحة عرضنا المميزة",
    show_room:"Show Room",
     
                   ////Delivery
    delivery_we_offer_title: "توصيل لكل مصر",
    delivery_we_offer_description:"نصل إليك أينما كنت، توصيل سريع وموثوق",
                     ////list
    list_we_offer_title: "تشكيلة ضخمة",
    list_we_offer_description:"كشوفاتنا الشاملة تضم أكبر تشكيلة قطع غيار محدثة باستمرار",
                  ////price
    price_we_offer_title: "سعر لا يُقارن",
    price_we_offer_description:"أفضل سعر في السوق، مع ضمان الجودة",
    //end WeOffer//

    //Companies
     companies_h1:"شركاؤنا من كبرى مصنعي قطع غيار السيارات عالمياً",
    companies_p:"نقدم لكم فقط قطع غيار أصلية ومعتمدة من أشهر العلامات التجارية في العالم، لضمان الجودة والأداء الأمثل لمركباتكم.",
   //end Companies

    ///Footer
    Browse:"تصفح معنا", 
    //end Footer
    /////end home/////

    //Contact//
    contact_h1:"اتصل بنا",
    contact_name:"الاسم الكامل",
    contact_name_placeholder:"اكتب اسمك هنا",
    contact_email:"البريد الإلكتروني",
    contact_email_placeholder:"",
    contact_phone_number:"رقم الهاتف",
    contact_massege:"الرسالة",
    contact_massege_placeholder:"اكتب رسالتك هنا...",
    contact_send_button:"ارسل",
    //end Contact//
    //about us//
    about_us_text_page:"في بريشر نوفّر للتجار والموزعين قطع غيار سيارات عالية الجودة يتم استيرادها مباشرة من مصانع معتمدة في الصين، بما يضمن استمرارية التوريد وثبات الجودة وتعزيز ثقة عملائك في منتجاتك. نعتمد على معايير جودة صارمة وأسعار تنافسية تلائم متطلبات السوق المصري، مع التزام كامل بالدعم الفني والتعاون طويل الأمد لضمان نمو أعمال شركائنا. كما نقدم قطع غيار موثوقة تلبي احتياجات المستخدم النهائي وتحقق أداءً قويًا وعمرًا افتراضيًا أطول، لتكون بريشر خيارك الأمثل في سوق قطع غيار السيارات في مصر.",
     about_us_h1:"مورد قطع غيار السيارات في مصر",
    //end about us//
    // Messages
    loading: "جاري التحميل...",
    success: "تم بنجاح!",
    error: "حدث خطأ"
  },
  
  en: {
     // Navigation
    home: "Home",
    about: "About Us",
    contact: "Contact",
    Article:"Articles",
    Lists:"Lists",
    Store:"Store",
    sign_in: "Sign In",
    sign_up: "Sign Up",
    sign_out:"Sign out",

    ///////start home//////
    //vedio
    abouttext:"At Pressure, we supply traders and distributors with high-quality automotive spare parts imported directly from certified factories in China, ensuring consistent supply, stable quality, and increased trust from your customers. We operate with competitive pricing and strict quality standards that meet the demands of the Egyptian market, alongside a strong commitment to long-term support and cooperation. We also provide reliable products that meet end-user needs and deliver dependable performance over time,Contact us and start a partnership built on quality and reliability.",
    //button
    button_more:"Read more",

    // categorie
    categoriesH1:"Product Categories",
    categoriesP:"At Pressure, we are keen to provide all spare parts for various parts of the car, with uncompromising quality standards.",
    CarBodyParts:"Car Body Parts",
    ElectricalParts:"Electrical Parts",
    ChassisParts:"Chassis Parts",
    EngineParts:"Engine Parts",

      //Clients//
    customerH1:"Our clients around the Egyptian",
    customerP:"We have a strong customer base that extends across all governorates of Egypt, reflecting the market's confidence in our services.",
    ShopName:"",
    Name_of_the_province:"",
    //
     // egyptGovernorates
      cairo: "Cairo",
      giza: "Giza",
      alexandria: "Alexandria",
      dakahlia: "Dakahlia",
      red_sea: "Red Sea",
      beheira: "Beheira",
      fayoum: "Fayoum",
      gharbia: "Gharbia",
      ismailia: "Ismailia",
      menofia: "Menofia",
      minya: "Minya",
      qalyubia: "Qalyubia",
      new_valley: "New Valley",
      suez: "Suez",
      aswan: "Aswan",
      assiut: "Assiut",
      beni_suef: "Beni Suef",
      port_said: "Port Said",
      damietta: "Damietta",
      sharqia: "Sharqia",
      south_sinai: "South Sinai",
      kafr_el_sheikh: "Kafr El Sheikh",
      matrouh: "Matrouh",
      luxor: "Luxor",
      qena: "Qena",
      north_sinai: "North Sinai",
      sohag: "Sohag",
    //

      //WeOffer//
    we_offer_h1:"Our Advantages In Auto Spare Parts",
    we_offer_p:"We aim to be your first partner in Egypt, through quality, wide availability, and competitive pricing",
                  // //show room
    show_room_title:"The first auto parts showroom in Egypt",
    show_room_description:"Examine original spare parts before purchasing in our special display space",
    show_room:"Show Room",
     
                   ////Delivery
    delivery_we_offer_title: "Delivery Across Egypt",
    delivery_we_offer_description: "We reach you wherever you are, fast and reliable delivery",
                     ////list
    list_we_offer_title: "Huge Collection",
    list_we_offer_description:"Our comprehensive catalogs include the largest continuously updated spare parts collection",
                  ////price
    price_we_offer_title: "Unbeatable Price",
    price_we_offer_description:"Best price in the market, with quality guarantee",
    //end WeOffer//

//Companies//
    companies_h1:"Our partners from the world's leading auto parts manufacturers",
    companies_p:"We provide only original and certified spare parts from the most famous global brands, ensuring quality and optimal performance for your vehicles.",
    //end Companies//

      ///Footer
    Browse:"Browse with us", 
    //end Footer
    ///////end home//////

    contact_h1: "Contact Us",
contact_name: "Full Name",
contact_name_placeholder: "Enter your name here",
contact_email: "Email Address",
contact_email_placeholder: "",
contact_phone_number: "Phone Number",
contact_massege: "Message",
contact_massege_placeholder: "Write your message here...",
contact_send_button: "Send",


 //about us//
    about_us_text_page:"imported directly from certified manufacturers in China. Our solutions ensure consistent supply, stable product quality, and enhanced customer trust, helping you strengthen your position in the Egyptian automotive spare parts market. We operate with competitive wholesale pricing and strict quality control standards that meet market demands, alongside a full commitment to long-term support and strategic cooperation. In addition, we provide reliable auto parts designed to meet end-user needs, delivering dependable performance, durability, and safety over the long term.",
     about_us_h1:"Automotive Spare Parts Supplier in Egypt",
    //end about us//
  },
  
  fr: {
     // Navigation
    home: "Accueil",
    about: "À propos",
    contact: "Contact",
    Article:"Articles",
    Lists:"Listes",
    Store:"Magasin",
    sign_in: "Se connecter",
    sign_up: "S'inscrire",
    sign_out:"Déconnectez-vous",


///////start home///////

     //vedio//
     abouttext:"Chez Pressure, nous fournissons aux commerçants et distributeurs des pièces détachées automobiles de haute qualité, importées directement de manufactures certifiées en Chine, garantissant une continuité d’approvisionnement, une qualité constante et une confiance accrue de vos clients. Nous proposons des prix compétitifs et respectons des normes strictes répondant aux exigences du marché égyptien, avec un engagement total en matière de support et de collaboration à long terme. Nous offrons également des produits fiables répondant aux besoins de l’utilisateur final et assurant des performances durables Contactez-nous et commencez un partenariat fondé sur la qualité et la fiabilité.",
    //end vedio //

    //button//
    button_more:"En savoir plus",
    //end button//

    //categories//
      categoriesH1:"Catégories de produits",
      categoriesP:"Chez Pressure, nous tenons à fournir toutes les pièces de rechange pour les différentes parties de la voiture, avec des normes de qualité sans compromis.",
      CarBodyParts:"Pièces de Carrosserie",
      ElectricalParts:"Pièces Électriques",
      ChassisParts:"Pièces de Châssis",
      EngineParts:"Pièces de Moteur",

    //end categories//
    //Clients//
    customerH1:"Nos clients autour de l'Égyptien",
    customerP:"Nous avons une solide clientèle qui s'étend dans tous les gouvernorats d'Égypte, reflétant la confiance du marché dans nos services.",
    ShopName:"",
    Name_of_the_province:"",
    //end Clients//

    // egyptGovernorates
      cairo: "Cairo",
      giza: "Giza",
      alexandria: "Alexandria",
      dakahlia: "Dakahlia",
      red_sea: "Red Sea",
      beheira: "Beheira",
      fayoum: "Fayoum",
      gharbia: "Gharbia",
      ismailia: "Ismailia",
      menofia: "Menofia",
      minya: "Minya",
      qalyubia: "Qalyubia",
      new_valley: "New Valley",
      suez: "Suez",
      aswan: "Aswan",
      assiut: "Assiut",
      beni_suef: "Beni Suef",
      port_said: "Port Said",
      damietta: "Damietta",
      sharqia: "Sharqia",
      south_sinai: "South Sinai",
      kafr_el_sheikh: "Kafr El Sheikh",
      matrouh: "Matrouh",
      luxor: "Luxor",
      qena: "Qena",
      north_sinai: "North Sinai",
      sohag: "Sohag",

        //WeOffer//
    we_offer_h1:"Nos atouts dans les pièces détachées automobiles",
    we_offer_p:"Nous visons à être votre premier partenaire en Égypte, grâce à la qualité, une large disponibilité et des prix compétitifs",
                  // //show room
    show_room_title:"Le premier showroom de pièces détachées en Égypte",
    show_room_description: "Examinez les pièces détachées originales avant l'achat dans notre espace d'exposition unique",
    show_room:"Show Room",
     
                   ////Delivery
    delivery_we_offer_title: "Livraison dans tout l'Égypte",
    delivery_we_offer_description:"Nous vous livrons où que vous soyez, livraison rapide et fiable",
                     ////list
    list_we_offer_title: "Une vaste collection",
    list_we_offer_description:"Nos catalogues complets comprennent la plus grande collection de pièces détachées mise à jour en continu",
                  ////price
    price_we_offer_title:"Prix imbattable",
    price_we_offer_description:"Meilleur prix du marché, avec garantie de qualité",
    //end WeOffer//

        //Companies//
    companies_h1:"Nos partenaires parmi les principaux fabricants de pièces détachées automobiles au monde",
    companies_p:"Nous proposons uniquement des pièces détachées originales et certifiées des marques mondiales les plus célèbres, garantissant qualité et performance optimale pour vos véhicules.",

    //end Companies//

    
      ///Footer
    Browse:"Naviguez avec nous", 
    //end Footer
    ///////end home////////
    contact_h1: "Contactez-nous",
contact_name: "Nom complet",
contact_name_placeholder: "Entrez votre nom ici",
contact_email: "Adresse e-mail",
contact_email_placeholder: "",
contact_phone_number: "Numéro de téléphone",
contact_massege: "Message",
contact_massege_placeholder: "Écrivez votre message ici...",
contact_send_button: "Envoyer",


 //about us//
    about_us_text_page:"automobiles haut de gamme, importées directement de fabricants certifiés en Chine. Nos solutions garantissent une continuité d’approvisionnement, une qualité constante et une confiance renforcée de vos clients, vous permettant de consolider votre position sur le marché égyptien des pièces automobiles. Nous proposons des prix de gros compétitifs et appliquons des normes strictes de contrôle qualité, tout en nous engageant pleinement dans un support professionnel et une collaboration à long terme. Par ailleurs, nous offrons des pièces fiables répondant aux besoins de l’utilisateur final et assurant des performances durables, sûres et efficaces.",
   about_us_h1:"Fournisseur de pièces détachées automobiles en Égypte"
    //end about us//
  

  },
  
  zh: {
     // Navigation
    home: "主页",
    about: "关于我们",
    contact: "联系我们",
    Article:"文章",
    Lists:"名单",
    Store:"商店",
    sign_in: "登录",
    sign_up: "注册",
    sign_out:"签出和签出",

    /////////start home/////// 

     //vedio
     abouttext:"我们是一家埃及公司，我们为贸易商和分销商提供高品质汽车零配件，直接从中国认证工厂进口，确保稳定供货、品质一致，并提升客户对您的信任。我们以具有竞争力的价格和严格的质量标准运营，全面满足埃及市场的需求，并致力于长期支持与合作。同时，我们也为终端用户提供可靠的产品，确保持久稳定的性能表现 联系我们，开启以质量与可靠性为基础的合作伙伴关系。",

    //  button
    button_more:"阅读更多",

     //categories
    categoriesH1:"产品类别",
    categoriesP:"在压力下，我们热衷于为汽车的各个部件提供所有备件，具有不妥协的质量标准。",
    CarBodyParts:"汽车车身零件",
    ElectricalParts:"电气零件",
    ChassisParts:"底盘零件",
    EngineParts:"发动机零件",

      //Clients//
    customerH1:"我们的客户遍布埃及",
    customerP:"我们拥有强大的客户基础，遍及埃及各省，反映了市场对我们服务的信心。",
    ShopName:"",
    Name_of_the_province:"",
    //
       // egyptGovernorates
      cairo: "Cairo",
      giza: "Giza",
      alexandria: "Alexandria",
      dakahlia: "Dakahlia",
      red_sea: "Red Sea",
      beheira: "Beheira",
      fayoum: "Fayoum",
      gharbia: "Gharbia",
      ismailia: "Ismailia",
      menofia: "Menofia",
      minya: "Minya",
      qalyubia: "Qalyubia",
      new_valley: "New Valley",
      suez: "Suez",
      aswan: "Aswan",
      assiut: "Assiut",
      beni_suef: "Beni Suef",
      port_said: "Port Said",
      damietta: "Damietta",
      sharqia: "Sharqia",
      south_sinai: "South Sinai",
      kafr_el_sheikh: "Kafr El Sheikh",
      matrouh: "Matrouh",
      luxor: "Luxor",
      qena: "Qena",
      north_sinai: "North Sinai",
      sohag: "Sohag",

      //WeOffer//
    we_offer_h1: "我们在汽车零件方面的优势",
    we_offer_p:"我们致力于成为您在埃及的首选合作伙伴，通过品质、广泛的覆盖和具有竞争力的价格",
                  // //show room
    show_room_title:"埃及首个汽车零件展厅",
    show_room_description:"在我们的特色展区查看原装零件后再购买",
    show_room:"Show Room",
     
                   ////Delivery
    delivery_we_offer_title: "埃及全境配送",
    delivery_we_offer_description:"无论您身在何处，我们提供快速可靠的配送",
                     ////list
    list_we_offer_title: "丰富的系列",
    list_we_offer_description:"我们的完整目录包含持续更新的最大零件系列",
                  ////price
    price_we_offer_title: "无可比拟的价格",
    price_we_offer_description:"市场上最优惠的价格，保证质量",

        //Companies//
    companies_h1:"我们的合作伙伴来自全球领先的汽车零件制造商",
    companies_p:"我们仅提供来自全球知名品牌的原装认证零件，确保您的车辆获得最佳质量和性能。",
    //end Companies//

    //end WeOffer//
      ///Footer
    Browse:"与我们一起浏览", 
    //end Footer
    ///////end home///////
    contact_h1: "联系我们",
contact_name: "全名",
contact_name_placeholder: "在此输入您的姓名",
contact_email: "电子邮箱",
contact_email_placeholder: "",
contact_phone_number: "电话号码",
contact_massege: "留言",
contact_massege_placeholder: "在此填写您的留言...",
contact_send_button:  "发送",


 //about us//
    about_us_text_page:"在 Pressure，我们专注于为贸易商和分销商提供高品质汽车零配件，所有产品均直接从中国认证制造工厂进口。我们的供应体系确保稳定供货、品质一致，并有效提升客户对您的信任，助力您在埃及汽车零配件市场中稳步发展。我们以具有竞争力的批发价格运营，并严格执行质量控制标准，同时致力于长期支持与战略合作。此外，我们还为终端用户提供可靠耐用的汽车配件，确保长期稳定的性能、安全性和使用价值。",
    about_us_h1:"埃及汽车零配件供应商"
    //end about us//
  }
};

// دالة للحصول على الترجمة
export function t(key) {
  return siteTranslations[currentLanguage]?.[key] || key;
}

// الحصول على اللغة الحالية
export function getCurrentLanguage() {
  return currentLanguage;
}

// تغيير اللغة لجميع المكونات
export function changeSiteLanguage(newLang) {
  console.log(`🌍 تغيير اللغة للموقع كله: ${newLang}`);
  
  // تحديث اللغة الحالية
  currentLanguage = newLang;
  
  // حفظ في localStorage
  localStorage.setItem('site-language', newLang);
  
  // تحديث HTML
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  
  // إعلام جميع المكونات المشتركة
  listeners.forEach(listener => listener(newLang));
}

// الاشتراك في تغييرات اللغة
export function onLanguageChange(callback) {
  listeners.push(callback);
  
  // دالة لإلغاء الاشتراك
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
}

// تحميل اللغة المحفوظة عند بدء التطبيق
if (typeof window !== 'undefined') {
  const savedLang = localStorage.getItem('site-language') || 'ar';
  currentLanguage = savedLang;
  document.documentElement.lang = savedLang;
  document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
}