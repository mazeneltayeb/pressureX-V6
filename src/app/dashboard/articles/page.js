

// "use client";
// import React, { useState, useEffect } from "react";
// import { Button, Form, Modal, Table } from "react-bootstrap";
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// export default function ArticlesDashboard() {
//   const [articles, setArticles] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentId, setCurrentId] = useState(null);




// const initialArticle = {
//   title: "",
//   coverImage: null, // بتكون file بدل string
//   coverImagePreview: "", // علشان نعرض preview
//   sections: [{ text: "", image: null, imagePreview: "" }],
// };
// const [newArticle, setNewArticle] = useState(initialArticle);

//   // 📥 جلب المقالات من الـ API
//   useEffect(() => {
//     fetchArticles();
//   }, []);


//   const fetchArticles = async () => {
//   try {
//     const res = await fetch("/api/articles");
//     if (!res.ok) throw new Error("Fetch failed");
//     const text = await res.text();
//     const data = text ? JSON.parse(text) : [];
//     setArticles(data);
//   } catch (error) {
//     console.error("Error fetching articles:", error);
//     setArticles([]);
//   }
// };

// // رفع صورة الغلاف
// const handleCoverImageUpload = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     setNewArticle({
//       ...newArticle,
//       coverImage: file,
//       coverImagePreview: URL.createObjectURL(file)
//     });
//   }
// };

// // رفع صورة القسم
// const handleSectionImageUpload = (index, e) => {
//   const file = e.target.files[0];
//   if (file) {
//     const updatedSections = [...newArticle.sections];
//     updatedSections[index] = {
//       ...updatedSections[index],
//       image: file,
//       imagePreview: URL.createObjectURL(file)
//     };
//     setNewArticle({ ...newArticle, sections: updatedSections });
//   };
// }





//   // ➕ إضافة مقال جديد
// //   const handleAddArticle = async () => {
// //     if (!newArticle.title || newArticle.sections.every(s => !s.text && !s.image))
// //       return alert("اكمل البيانات يا طيب ❤️");

// // await fetch("/api/articles", {
// //   method: "POST",
// //   headers: { "Content-Type": "application/json" },
// //   body: JSON.stringify({
// //     title: newArticle.title.trim(),
// //     coverImage: newArticle.coverImage.trim(),
// //     sections: newArticle.sections.map((s) => ({
// //       text: s.text?.trim() || "",
// //       image: s.image?.trim() || "",
// //     })),
// //   }),
// // });


// //     await fetchArticles();
// //     closeModal();
// //   };

// const handleAddArticle = async () => {
//   if (!newArticle.title || newArticle.sections.every(s => !s.text && !s.image))
//     return alert("اكمل البيانات يا طيب ❤️");

//   try {
//     // رفع صورة الغلاف
//     let coverImageUrl = "";
//     if (newArticle.coverImage) {
//       const fileName = `articles/cover_${Date.now()}_${newArticle.coverImage.name}`;
//       const { error } = await supabase.storage
//         .from('articles')
//         .upload(fileName, newArticle.coverImage);
      
//       if (!error) {
//         const { data } = supabase.storage
//           .from('articles')
//           .getPublicUrl(fileName);
//         coverImageUrl = data.publicUrl;
//       }
//     }

//     // رفع صور الأقسام
//     const sectionsWithImages = await Promise.all(
//       newArticle.sections.map(async (section) => {
//         let imageUrl = "";
//         if (section.image) {
//           const fileName = `articles/section_${Date.now()}_${section.image.name}`;
//           const { error } = await supabase.storage
//             .from('articles')
//             .upload(fileName, section.image);
          
//           if (!error) {
//             const { data } = supabase.storage
//               .from('articles')
//               .getPublicUrl(fileName);
//             imageUrl = data.publicUrl;
//           }
//         }

//         return {
//           text: section.text?.trim() || "",
//           image: imageUrl
//         };
//       })
//     );

//     await fetch("/api/articles", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title: newArticle.title.trim(),
//         coverImage: coverImageUrl,
//         sections: sectionsWithImages,
//       }),
//     });

//     await fetchArticles();
//     closeModal();
//   } catch (error) {
//     console.error("Error uploading images:", error);
//     alert("حدث خطأ أثناء رفع الصور");
//   }
// };

//   // ✏️ تعديل مقال
//   const handleEditArticle = (article) => {
//     setIsEditing(true);
//     setCurrentId(article.id);
//     setNewArticle(article);
//     setShowModal(true);
//   };

//   const handleUpdateArticle = async () => {
//     await fetch("/api/articles", {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ ...newArticle, id: currentId }),
//     });

//     await fetchArticles();
//     closeModal();
//   };

//   // 🗑️ حذف مقال
//   const handleDelete = async (id) => {
//     if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
//       await fetch("/api/articles", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
//       await fetchArticles();
//     }
//   };

//   // 🧩 التعامل مع الأقسام داخل المقال
//   const handleSectionChange = (index, field, value) => {
//     const updatedSections = [...newArticle.sections];
//     updatedSections[index][field] = value;
//     setNewArticle({ ...newArticle, sections: updatedSections });
//   };

//   const addSection = () => {
//     setNewArticle({
//       ...newArticle,
//       sections: [...newArticle.sections, { text: "", image: "" }],
//     });
//   };

//   const removeSection = (index) => {
//     const updatedSections = newArticle.sections.filter((_, i) => i !== index);
//     setNewArticle({ ...newArticle, sections: updatedSections });
//   };
   

//   // ❌ غلق المودال
//   const closeModal = () => {
//     setShowModal(false);
//     setIsEditing(false);
//     setCurrentId(null);
//     // setNewArticle({ title: "", sections: [{ text: "", image: "" }] });
//     setNewArticle(initialArticle);

//   };

//   return (
//     <div className="container my-5">
//       <h2 className="text-center mb-4">📋 إدارة المقالات</h2>

//       <div className="d-flex justify-content-end mb-3">
//         <Button onClick={() => setShowModal(true)}>➕ إضافة مقال جديد</Button>
//       </div>

//       <Table bordered hover responsive className="shadow-sm">
//         <thead className="table-light">
//           <tr>
//             <th>العنوان</th>
//             <th>عدد الأقسام</th>
//             <th>تحكم</th>
//           </tr>
//         </thead>
//         <tbody>
//           {articles.map((a) => (
//             <tr key={a.id}>
//               <td>{a.title}</td>
//               <td>{a.sections.length}</td>
//               <td>
//                 <Button
//                   variant="warning"
//                   size="sm"
//                   className="me-2"
//                   onClick={() => handleEditArticle(a)}
//                 >
//                   تعديل
//                 </Button>
//                 <Button
//                   variant="danger"
//                   size="sm"
//                   onClick={() => handleDelete(a.id)}
//                 >
//                   حذف
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* 🪟 نافذة الإضافة / التعديل */}
//       <Modal show={showModal} onHide={closeModal} centered size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {isEditing ? "تعديل المقال" : "إضافة مقال جديد"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>العنوان</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newArticle.title}
//                 onChange={(e) =>
//                   setNewArticle({ ...newArticle, title: e.target.value })
//                 }
//               />
//             </Form.Group>
         
//             <Form.Group className="mb-3">
//   <Form.Label>صورة الغلاف</Form.Label>
//   <Form.Control
//     type="file"
//     accept="image/*"
//     onChange={handleCoverImageUpload}
//   />
//   {newArticle.coverImagePreview && (
//     <img 
//       src={newArticle.coverImagePreview} 
//       alt="Preview" 
//       style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px" }}
//     />
//   )}
// </Form.Group>

//             {newArticle.sections.map((section, index) => (
//               <div
//                 key={index}
//                 className="border rounded p-3 mb-3 bg-light position-relative"
//               >
//                 <h6>الجزء {index + 1}</h6>
//                 <Form.Group className="mb-2">
//                   <Form.Label>النص</Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={2}
//                     value={section.text}
//                     onChange={(e) =>
//                       handleSectionChange(index, "text", e.target.value)
//                     }
//                   />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//   <Form.Label>صورة القسم (اختياري)</Form.Label>
//   <Form.Control
//     type="file"
//     accept="image/*"
//     onChange={(e) => handleSectionImageUpload(index, e)}
//   />
//   {section.imagePreview && (
//     <img 
//       src={section.imagePreview} 
//       alt="Section preview" 
//       style={{ width: "80px", height: "80px", objectFit: "cover", marginTop: "5px" }}
//     />
//   )}
// </Form.Group>

//                 <Button
//                   variant="outline-danger"
//                   size="sm"
//                   onClick={() => removeSection(index)}
//                 >
//                   حذف هذا الجزء
//                 </Button>
//               </div>
//             ))}

//             <Button variant="secondary" onClick={addSection}>
//               ➕ إضافة جزء جديد
//             </Button>
//           </Form>
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={closeModal}>
//             إلغاء
//           </Button>
//           <Button
//             variant="primary"
//             onClick={isEditing ? handleUpdateArticle : handleAddArticle}
//           >
//             {isEditing ? "حفظ التعديلات" : "حفظ المقال"}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ArticlesDashboard() {
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [articleCategories, setArticleCategories] = useState([]);
const [newArticleCategory, setNewArticleCategory] = useState("");
const [selectedArticleCategory, setSelectedArticleCategory] = useState("الكل");
const [loading, setLoading] = useState(false); // ⬅️ أضف هذا السطر


  const initialArticle = {
title: "",
  coverImage: null,
  coverImagePreview: "",
  sections: [{ text: "", image: null, imagePreview: "" }], // ⬅️ ضل زي ما هو
  article_category: "", // ⬅️ الفئة بتكون للمقال كله

  };


  const [newArticle, setNewArticle] = useState(initialArticle);

  // 📥 جلب المقالات من الـ API
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/articles");
      if (!res.ok) throw new Error("Fetch failed");
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]);
    }
  };

  // 📥 جلب الفئات من الـ API
// const fetchCategories = async () => {
//   try {
//     const res = await fetch("/api/categories");
//     const data = await res.json();
//     setCategories(data);
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//   }
// };

// // استدعاء fetchCategories في useEffect
// useEffect(() => {
//   fetchArticles();
//   fetchCategories(); // ⬅️ أضف هذا
// }, []);


// 📥 جلب فئات المقالات
const fetchArticleCategories = async () => {
  try {
    const res = await fetch("/api/article-categories");
    const data = await res.json();
    setArticleCategories(data);
  } catch (error) {
    console.error("Error fetching article categories:", error);
  }
};

// استدعاء في useEffect
useEffect(() => {
  fetchArticles();
  fetchArticleCategories(); // ⬅️ هذا الجديد
}, []);
// 🎯 فلترة المقالات حسب الفئة
useEffect(() => {
  console.log("🔍 جاري فلترة المقالات...", {
    selectedCategory: selectedArticleCategory,
    totalArticles: articles.length,
    articles: articles.map(a => ({ title: a.title, category: a.category }))
  });

  if (selectedArticleCategory === "الكل") {
    setFilteredArticles(articles);
    console.log("✅ عرض كل المقالات");
  } else {
    const filtered = articles.filter((a) => a.category === selectedArticleCategory);
    setFilteredArticles(filtered);
    console.log(`✅ تم فلترة المقالات - ${filtered.length} مقال في فئة "${selectedArticleCategory}"`);
  }
}, [selectedArticleCategory, articles]);
// useEffect(() => {
//   if (selectedCategory === "الكل") {
//     setFilteredArticles(articles);
//   } else {
//     setFilteredArticles(articles.filter((a) => a.category === selectedCategory));
//   }
// }, [selectedCategory, articles]);
  // 📤 رفع صورة الغلاف
  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewArticle({
        ...newArticle,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file)
      });
    }
  };

  // 📤 رفع صورة القسم
  const handleSectionImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedSections = [...newArticle.sections];
      updatedSections[index] = {
        ...updatedSections[index],
        image: file,
        imagePreview: URL.createObjectURL(file)
      };
      setNewArticle({ ...newArticle, sections: updatedSections });
    }
  };

  // ➕ إضافة مقال جديد
  // const handleAddArticle = async () => {
  //   if (!newArticle.title || newArticle.sections.every(s => !s.text && !s.image))
  //     return alert("اكمل البيانات يا طيب ❤️");

  //   try {
  //     // رفع صورة الغلاف
  //     let coverImageUrl = "";
  //     if (newArticle.coverImage) {
  //       const fileName = `articles/cover_${Date.now()}_${newArticle.coverImage.name.replace(/\s/g, "_")}`;
  //       const { error } = await supabase.storage
  //         .from('articles')
  //         .upload(fileName, newArticle.coverImage);
        
  //       if (!error) {
  //         const { data } = supabase.storage
  //           .from('articles')
  //           .getPublicUrl(fileName);
  //         coverImageUrl = data.publicUrl;
  //       }
  //     }

  //     // رفع صور الأقسام
  //     const sectionsWithImages = await Promise.all(
  //       newArticle.sections.map(async (section) => {
  //         let imageUrl = "";
  //         if (section.image) {
  //           const fileName = `articles/section_${Date.now()}_${section.image.name.replace(/\s/g, "_")}`;
  //           const { error } = await supabase.storage
  //             .from('articles')
  //             .upload(fileName, section.image);
            
  //           if (!error) {
  //             const { data } = supabase.storage
  //               .from('articles')
  //               .getPublicUrl(fileName);
  //             imageUrl = data.publicUrl;
  //           }
  //         }

  //         return {
  //           text: section.text?.trim() || "",
  //           image: imageUrl
  //         };
  //       })
  //     );

  //     await fetch("/api/articles", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         title: newArticle.title.trim(),
  //         coverImage: coverImageUrl,
  //         sections: sectionsWithImages,
  //       }),
  //     });

  //     await fetchArticles();
  //     closeModal();
  //     alert("✅ تم إضافة المقال بنجاح");
  //   } catch (error) {
  //     console.error("Error uploading images:", error);
  //     alert("❌ حدث خطأ أثناء رفع الصور");
  //   }
  // };

//   const handleAddArticle = async () => {
//   if (!newArticle.title || newArticle.sections.every(s => !s.text && !s.image))
//     return alert("اكمل البيانات يا طيب ❤️");

//   try {
//     console.log("🚀 بدء رفع المقال...");

//     // رفع صورة الغلاف عبر API
//     let coverImageUrl = "";
//     if (newArticle.coverImage) {
//       console.log("📤 رفع صورة الغلاف عبر API...");
      
//       const formData = new FormData();
//       formData.append('images', newArticle.coverImage);
//       formData.append('type', 'cover');

//       const uploadRes = await fetch("/api/articles/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (uploadRes.ok) {
//         const urls = await uploadRes.json();
//         coverImageUrl = urls[0] || "";
//         console.log("✅ رابط الغلاف:", coverImageUrl);
//       } else {
//         console.error("❌ فشل رفع الغلاف");
//       }
//     }

//     // رفع صور الأقسام عبر API
//     const sectionsWithImages = [];
    
//     for (let i = 0; i < newArticle.sections.length; i++) {
//       const section = newArticle.sections[i];
//       let imageUrl = "";
      
//       if (section.image) {
//         console.log(`📤 رفع صورة القسم ${i+1} عبر API...`);
        
//         const formData = new FormData();
//         formData.append('images', section.image);
//         formData.append('type', 'section');

//         const uploadRes = await fetch("/api/articles/upload", {
//           method: "POST",
//           body: formData,
//         });

//         if (uploadRes.ok) {
//           const urls = await uploadRes.json();
//           imageUrl = urls[0] || "";
//           console.log(`✅ رابط القسم ${i+1}:`, imageUrl);
//         } else {
//           console.error(`❌ فشل رفع صورة القسم ${i+1}`);
//         }
//       }
      
//       sectionsWithImages.push({
//         text: section.text?.trim() || "",
//         image: imageUrl
//       });
//     }

//     console.log("📝 البيانات النهائية:", {
//       title: newArticle.title.trim(),
//       coverImage: coverImageUrl,
//       sections: sectionsWithImages
//     });

//     // إرسال البيانات للـ API الرئيسي
//     await fetch("/api/articles", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title: newArticle.title.trim(),
//         coverImage: coverImageUrl,
//         sections: sectionsWithImages,
//       }),
//     });

//     await fetchArticles();
//     closeModal();
//     alert("✅ تم إضافة المقال بنجاح");
//   } catch (error) {
//     console.error("💥 خطأ كلي:", error);
//     alert("❌ حدث خطأ أثناء رفع الصور");
//   }
// };

// const handleAddArticle = async () => {
//   if (!newArticle.title || newArticle.sections.every(s => !s.text && !s.image))
//     return alert("اكمل البيانات يا طيب ❤️");

//   try {
//     let finalCategory = newArticle.category;

//     // إضافة فئة جديدة إذا كانت فارغة
//     if (!newArticle.category && newCategory.trim() !== "") {
//       const res = await fetch("/api/categories", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: newCategory }),
//       });
//       const added = await res.json();
//       finalCategory = added.name;
//       await fetchCategories();
//     }

//     // ... باقي كود رفع الصور

//     // أرسل البيانات مع الفئة
//     await fetch("/api/articles", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title: newArticle.title.trim(),
//         coverImage: coverImageUrl,
//         sections: sectionsWithImages,
//         category: finalCategory || "عام", // ⬅️ أضف هذا
//       }),
//     });

//     // ... باقي الكود
//   } catch (error) {
//     console.error("💥 خطأ كلي:", error);
//     alert("❌ حدث خطأ أثناء رفع الصور");
//   }
// };

// const handleAddArticle = async () => {
//   if (!newArticle.title || newArticle.sections.every(s => !s.text && !s.image))
//     return alert("اكمل البيانات يا طيب ❤️");

//   try {
//     let finalCategory = newArticle.article_category;

//     // إضافة فئة جديدة إذا كانت فارغة
//     if (!newArticle.article_category && newArticleCategory.trim() !== "") {
//       const res = await fetch("/api/article-categories", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: newArticleCategory }),
//       });
//       const added = await res.json();
//       finalCategory = added.name;
//       await fetchArticleCategories();
//     }

//     // ... باقي كود رفع الصور

//     // أرسل البيانات مع الفئة
//     await fetch("/api/articles", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title: newArticle.title.trim(),
//         coverImage: coverImageUrl,
//         sections: sectionsWithImages,
//         category: finalCategory || "عام", // ⬅️ الفئة النهائية
//       }),
//     });

//     // ... باقي الكود
//   } catch (error) {
//     console.error("💥 خطأ كلي:", error);
//     alert("❌ حدث خطأ أثناء رفع الصور");
//   }
// };

// const handleAddArticle = async () => {
//   if (!newArticle.title || newArticle.sections.every(s => !s.text && !s.image))
//     return alert("اكمل البيانات يا طيب ❤️");

//   try {
//     console.log("🚀 بدء رفع المقال...");

//     let finalCategory = newArticle.article_category;

//     // إضافة فئة جديدة إذا كانت فارغة
//     if (!newArticle.article_category && newArticleCategory.trim() !== "") {
//       const res = await fetch("/api/article-categories", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: newArticleCategory }),
//       });
//       const added = await res.json();
//       finalCategory = added.name;
//       await fetchArticleCategories();
//     }

//     // 🔥 رفع صورة الغلاف عبر API
//     let coverImageUrl = ""; // ⬅️ هنا التعريف الصحيح
//     if (newArticle.coverImage) {
//       console.log("📤 رفع صورة الغلاف عبر API...");
      
//       const formData = new FormData();
//       formData.append('images', newArticle.coverImage);
//       formData.append('type', 'cover');

//       const uploadRes = await fetch("/api/articles/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (uploadRes.ok) {
//         const urls = await uploadRes.json();
//         coverImageUrl = urls[0] || "";
//         console.log("✅ رابط الغلاف:", coverImageUrl);
//       } else {
//         console.error("❌ فشل رفع الغلاف");
//       }
//     }

//     // 🔥 رفع صور الأقسام عبر API
//     const sectionsWithImages = [];
    
//     for (let i = 0; i < newArticle.sections.length; i++) {
//       const section = newArticle.sections[i];
//       let imageUrl = "";
      
//       if (section.image) {
//         console.log(`📤 رفع صورة القسم ${i+1} عبر API...`);
        
//         const formData = new FormData();
//         formData.append('images', section.image);
//         formData.append('type', 'section');

//         const uploadRes = await fetch("/api/articles/upload", {
//           method: "POST",
//           body: formData,
//         });

//         if (uploadRes.ok) {
//           const urls = await uploadRes.json();
//           imageUrl = urls[0] || "";
//           console.log(`✅ رابط القسم ${i+1}:`, imageUrl);
//         } else {
//           console.error(`❌ فشل رفع صورة القسم ${i+1}`);
//         }
//       }
      
//       sectionsWithImages.push({
//         text: section.text?.trim() || "",
//         image: imageUrl
//       });
//     }

//     console.log("📝 البيانات النهائية:", {
//       title: newArticle.title.trim(),
//       coverImage: coverImageUrl,
//       sections: sectionsWithImages,
//       category: finalCategory || "عام"
//     });

//     // إرسال البيانات للـ API الرئيسي
//     await fetch("/api/articles", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title: newArticle.title.trim(),
//         coverImage: coverImageUrl,
//         sections: sectionsWithImages,
//         category: finalCategory || "عام",
//       }),
//     });

//     await fetchArticles();
//     closeModal();
//     alert("✅ تم إضافة المقال بنجاح");
//   } catch (error) {
//     console.error("💥 خطأ كلي:", error);
//     alert("❌ حدث خطأ أثناء رفع الصور");
//   }
// };

const handleAddArticle = async () => {
  if (!newArticle.title || newArticle.sections.every(s => !s.text && !s.image))
    return alert("اكمل البيانات يا طيب ❤️");

  try {
    setLoading(true); // ⬅️ ابدأ التحميل
    
    console.log("🚀 بدء رفع المقال...");

    let finalCategory = newArticle.article_category;

    // إضافة فئة جديدة إذا كانت فارغة
    if (!newArticle.article_category && newArticleCategory.trim() !== "") {
      const res = await fetch("/api/article-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newArticleCategory }),
      });
      const added = await res.json();
      finalCategory = added.name;
      await fetchArticleCategories();
    }

    // رفع صورة الغلاف
    let coverImageUrl = "";
    if (newArticle.coverImage) {
      console.log("📤 رفع صورة الغلاف عبر API...");
      
      const formData = new FormData();
      formData.append('images', newArticle.coverImage);
      formData.append('type', 'cover');

      const uploadRes = await fetch("/api/articles/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const urls = await uploadRes.json();
        coverImageUrl = urls[0] || "";
      }
    }

    // رفع صور الأقسام
    const sectionsWithImages = [];
    for (let i = 0; i < newArticle.sections.length; i++) {
      const section = newArticle.sections[i];
      let imageUrl = "";
      
      if (section.image) {
        const formData = new FormData();
        formData.append('images', section.image);
        formData.append('type', 'section');

        const uploadRes = await fetch("/api/articles/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const urls = await uploadRes.json();
          imageUrl = urls[0] || "";
        }
      }
      
      sectionsWithImages.push({
        text: section.text?.trim() || "",
        image: imageUrl
      });
    }

    // إرسال البيانات
    await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newArticle.title.trim(),
        coverImage: coverImageUrl,
        sections: sectionsWithImages,
        category: finalCategory || "عام",
      }),
    });

    await fetchArticles();
    closeModal();
    alert("✅ تم إضافة المقال بنجاح");
    
  } catch (error) {
    console.error("💥 خطأ كلي:", error);
    alert("❌ حدث خطأ أثناء رفع الصور");
  } finally {
    setLoading(false); // ⬅️ أوقف التحميل في كل الأحوال
  }
};
  // ✏️ تعديل مقال
  // const handleEditArticle = (article) => {
  //   setIsEditing(true);
  //   setCurrentId(article.id);
  //   setNewArticle({
  //     ...article,
  //     coverImage: null,
  //     coverImagePreview: article.coverImage || "",
  //     sections: article.sections.map(section => ({
  //       ...section,
  //       image: null,
  //       imagePreview: section.image || ""
  //     }))
  //   });
  //   setShowModal(true);
  // };
const handleEditArticle = (article) => {
  setIsEditing(true);
  setCurrentId(article.id);
  setNewArticle({
    ...article,
    coverImage: null,
    coverImagePreview: article.coverImage || "",
    sections: article.sections.map(section => ({
      ...section,
      image: null,
      imagePreview: section.image || ""
    })),
    category: article.category || "" // ⬅️ تأكد من هذا
  });
  setShowModal(true);
};
  
  // 💾 تحديث المقال
  // const handleUpdateArticle = async () => {
  //   try {
  //     let coverImageUrl = newArticle.coverImagePreview;

  //     // إذا فيه صورة غلاف جديدة، ارفعها
  //     if (newArticle.coverImage && typeof newArticle.coverImage !== 'string') {
  //       const fileName = `articles/cover_${Date.now()}_${newArticle.coverImage.name.replace(/\s/g, "_")}`;
  //       const { error } = await supabase.storage
  //         .from('articles')
  //         .upload(fileName, newArticle.coverImage);
        
  //       if (!error) {
  //         const { data } = supabase.storage
  //           .from('articles')
  //           .getPublicUrl(fileName);
  //         coverImageUrl = data.publicUrl;
  //       }
  //     }

  //     // رفع صور الأقسام الجديدة
  //     const updatedSections = await Promise.all(
  //       newArticle.sections.map(async (section) => {
  //         let imageUrl = section.imagePreview;

  //         // إذا فيه صورة جديدة للقسم، ارفعها
  //         if (section.image && typeof section.image !== 'string') {
  //           const fileName = `articles/section_${Date.now()}_${section.image.name.replace(/\s/g, "_")}`;
  //           const { error } = await supabase.storage
  //             .from('articles')
  //             .upload(fileName, section.image);
            
  //           if (!error) {
  //             const { data } = supabase.storage
  //               .from('articles')
  //               .getPublicUrl(fileName);
  //             imageUrl = data.publicUrl;
  //           }
  //         }

  //         return {
  //           text: section.text?.trim() || "",
  //           image: imageUrl
  //         };
  //       })
  //     );

  //     await fetch("/api/articles", {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ 
  //         id: currentId,
  //         title: newArticle.title,
  //         coverImage: coverImageUrl,
  //         sections: updatedSections 
  //       }),
  //     });

  //     await fetchArticles();
  //     closeModal();
  //     alert("✅ تم تعديل المقال بنجاح");
  //   } catch (error) {
  //     console.error("Error updating article:", error);
  //     alert("❌ حدث خطأ أثناء التعديل");
  //   }
  // };
const handleUpdateArticle = async () => {
  try {
    setLoading(true); // ⬅️ ابدأ التحميل
    
    let coverImageUrl = newArticle.coverImagePreview;

    // إذا فيه صورة غلاف جديدة
    if (newArticle.coverImage && typeof newArticle.coverImage !== 'string') {
      const formData = new FormData();
      formData.append('images', newArticle.coverImage);
      formData.append('type', 'cover');

      const uploadRes = await fetch("/api/articles/upload", {
        method: "POST",
        body: formData,
      });

      if (uploadRes.ok) {
        const urls = await uploadRes.json();
        coverImageUrl = urls[0] || "";
      }
    }

    // رفع صور الأقسام الجديدة
    const updatedSections = [];
    for (let i = 0; i < newArticle.sections.length; i++) {
      const section = newArticle.sections[i];
      let imageUrl = section.imagePreview;

      // إذا فيه صورة جديدة للقسم
      if (section.image && typeof section.image !== 'string') {
        const formData = new FormData();
        formData.append('images', section.image);
        formData.append('type', 'section');

        const uploadRes = await fetch("/api/articles/upload", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const urls = await uploadRes.json();
          imageUrl = urls[0] || "";
        }
      }

      updatedSections.push({
        text: section.text?.trim() || "",
        image: imageUrl
      });
    }

    await fetch("/api/articles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: currentId,
        title: newArticle.title,
        coverImage: coverImageUrl,
        sections: updatedSections,
        category: newArticle.article_category || "عام"
      }),
    });

    await fetchArticles();
    closeModal();
    alert("✅ تم تعديل المقال بنجاح");
    
  } catch (error) {
    console.error("Error updating article:", error);
    alert("❌ حدث خطأ أثناء التعديل");
  } finally {
    setLoading(false); // ⬅️ أوقف التحميل
  }
};
  // 🗑️ حذف مقال
  // const handleDelete = async (id) => {
  //   if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
  //     await fetch("/api/articles", {
  //       method: "DELETE",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ id }),
  //     });
  //     await fetchArticles();
  //   }
  // };
const handleDelete = async (id) => {
  if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
    try {
      setLoading(true); // ⬅️ ابدأ التحميل
      
      await fetch("/api/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      
      await fetchArticles();
      alert("✅ تم حذف المقال بنجاح");
      
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("❌ حدث خطأ أثناء الحذف");
    } finally {
      setLoading(false); // ⬅️ أوقف التحميل
    }
  }
};
  // 🧩 التعامل مع الأقسام داخل المقال
  const handleSectionChange = (index, field, value) => {
    const updatedSections = [...newArticle.sections];
    updatedSections[index][field] = value;
    setNewArticle({ ...newArticle, sections: updatedSections });
  };

  const addSection = () => {
    setNewArticle({
      ...newArticle,
      sections: [...newArticle.sections, { text: "", image: null, imagePreview: "" }],
    });
  };

  const removeSection = (index) => {
    const updatedSections = newArticle.sections.filter((_, i) => i !== index);
    setNewArticle({ ...newArticle, sections: updatedSections });
  };

  // ❌ غلق المودال
  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setNewArticle(initialArticle);
  };

  return (
    
    <div className="container my-5">
      <h2 className="text-center mb-4">📋 إدارة المقالات</h2>

      {/* <div className="d-flex justify-content-end mb-3">
        <Button onClick={() => setShowModal(true)}>➕ إضافة مقال جديد</Button>
      </div> */}
 <div className="d-flex justify-content-end mb-3">
      <Button onClick={() => setShowModal(true)}>➕ إضافة مقال جديد</Button>
    </div>

    {/* 🔹 فلترة الفئات */}
    <div className="d-flex justify-content-between mb-3">
      <Form.Select
        style={{ width: "200px" }}
        value={selectedArticleCategory}
        onChange={(e) => setSelectedArticleCategory(e.target.value)}
      >
        <option value="الكل">كل المقالات</option>
        {articleCategories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </Form.Select>
    </div>

      {/* <Table bordered hover responsive className="shadow-sm">
        <thead className="table-light">
          <tr>
            <th>العنوان</th>
            <th>عدد الأقسام</th>
            <th>تحكم</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.sections.length}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditArticle(a)}
                >
                  تعديل
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(a.id)}
                >
                  حذف
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> */}
{/* <Table bordered hover responsive className="shadow-sm">
  <thead className="table-light">
    <tr>
      <th>العنوان</th>
      <th>الفئة</th> 
      <th>عدد الأقسام</th>
      <th>تحكم</th>
    </tr>
  </thead>
  <tbody>
    {filteredArticles.map((a) => (
      <tr key={a.id}>
        <td>{a.title}</td>
        <td>{a.category || "—"}</td> 
        <td>{a.sections.length}</td>
        <td>
          <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditArticle(a)}
                >
                  تعديل
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(a.id)}
                >
                  حذف
                </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table> */}
{/* جدول المقالات */}
<Table bordered hover responsive className="shadow-sm">
  <thead className="table-light">
    <tr>
      <th>العنوان</th>
      <th>الفئة</th>
      <th>عدد الأقسام</th>
      <th>تحكم</th>
    </tr>
  </thead>
  <tbody>
    {filteredArticles.map((a) => (
      <tr key={a.id}>
        <td>{a.title}</td>
        <td>{a.category || "—"}</td>
        <td>{a.sections.length}</td>
        <td>
          <Button
            variant="warning"
            size="sm"
            className="me-2"
            onClick={() => handleEditArticle(a)}
          >
            تعديل
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(a.id)}
          >
            حذف
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>
      {/* 🪟 نافذة الإضافة / التعديل */}
      {/* <Modal show={showModal} onHide={closeModal} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isEditing ? "تعديل المقال" : "إضافة مقال جديد"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>العنوان</Form.Label>
              <Form.Control
                type="text"
                value={newArticle.title}
                onChange={(e) =>
                  setNewArticle({ ...newArticle, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>صورة الغلاف</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
              />
              {newArticle.coverImagePreview && (
                <div className="mt-2">
                  <img 
                    src={newArticle.coverImagePreview} 
                    alt="Preview" 
                    style={{ 
                      width: "150px", 
                      height: "150px", 
                      objectFit: "cover", 
                      borderRadius: "8px",
                      border: "1px solid #ddd"
                    }}
                  />
                  <p className="text-muted small mt-1">معاينة صورة الغلاف</p>
                </div>
              )}
            </Form.Group>

            {newArticle.sections.map((section, index) => (
              <div
                key={index}
                className="border rounded p-3 mb-3 bg-light position-relative"
              >
                <h6>الجزء {index + 1}</h6>
                <Form.Group className="mb-2">
                  <Form.Label>النص</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={section.text}
                    onChange={(e) =>
                      handleSectionChange(index, "text", e.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>صورة القسم (اختياري)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSectionImageUpload(index, e)}
                  />
                  {section.imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={section.imagePreview} 
                        alt="Section preview" 
                        style={{ 
                          width: "120px", 
                          height: "120px", 
                          objectFit: "cover", 
                          borderRadius: "6px",
                          border: "1px solid #ddd"
                        }}
                      />
                      <p className="text-muted small mt-1">معاينة صورة القسم</p>
                    </div>
                  )}
                </Form.Group>
   

<Form.Group className="mb-3">
  <Form.Label>فئة المقال</Form.Label>
  <Form.Select
    value={newArticle.article_category}
    onChange={(e) => {
      const value = e.target.value;
      if (value === "new") {
        setNewArticle({ ...newArticle, article_category: "" });
      } else {
        setNewArticle({ ...newArticle, article_category: value });
      }
    }}
  >
    <option value="">اختر فئة المقال</option>
    {articleCategories.map((cat) => (
      <option key={cat.id} value={cat.name}>
        {cat.name}
      </option>
    ))}
    <option value="new">+ إضافة فئة جديدة</option>
  </Form.Select>

  {newArticle.article_category === "" && (
    <Form.Control
      type="text"
      placeholder="اكتب فئة جديدة للمقالات"
      className="mt-2"
      value={newArticleCategory}
      onChange={(e) => setNewArticleCategory(e.target.value)}
    />
  )}
</Form.Group>
                {newArticle.sections.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeSection(index)}
                  >
                    حذف هذا الجزء
                  </Button>
                )}
              </div>
            ))}

            <Button variant="outline-primary" onClick={addSection}>
              ➕ إضافة جزء جديد
            </Button>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            إلغاء
          </Button>
          <Button
            variant="primary"
            onClick={isEditing ? handleUpdateArticle : handleAddArticle}
          >
            {isEditing ? "حفظ التعديلات" : "حفظ المقال"}
          </Button>
        </Modal.Footer>
      </Modal> */}
{/* 🪟 نافذة الإضافة / التعديل */}
<Modal show={showModal} onHide={closeModal} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>
      {isEditing ? "✏️ تعديل المقال" : "➕ إضافة مقال جديد"}
    </Modal.Title>
  </Modal.Header>
  
  <Modal.Body>
    <Form>
      {/* 🔹 الفئة - للمقال كله */}
      <Form.Group className="mb-3">
        <Form.Label>فئة المقال</Form.Label>
        <Form.Select
          value={newArticle.article_category}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "new") {
              setNewArticle({ ...newArticle, article_category: "" });
            } else {
              setNewArticle({ ...newArticle, article_category: value });
            }
          }}
        >
          <option value="">اختر فئة المقال</option>
          {articleCategories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
          <option value="new">+ إضافة فئة جديدة</option>
        </Form.Select>

        {newArticle.article_category === "" && (
          <Form.Control
            type="text"
            placeholder="اكتب فئة جديدة للمقالات"
            className="mt-2"
            value={newArticleCategory}
            onChange={(e) => setNewArticleCategory(e.target.value)}
          />
        )}
      </Form.Group>

      {/* 🔹 العنوان */}
      <Form.Group className="mb-3">
        <Form.Label>عنوان المقال</Form.Label>
        <Form.Control
          type="text"
          value={newArticle.title}
          onChange={(e) =>
            setNewArticle({ ...newArticle, title: e.target.value })
          }
          placeholder="اكتب عنوان المقال..."
        />
      </Form.Group>

      {/* 🔹 صورة الغلاف */}
      <Form.Group className="mb-3">
        <Form.Label>صورة الغلاف</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleCoverImageUpload}
        />
        {newArticle.coverImagePreview && (
          <div className="mt-2">
            <img 
              src={newArticle.coverImagePreview} 
              alt="Preview" 
              style={{ 
                width: "150px", 
                height: "150px", 
                objectFit: "cover", 
                borderRadius: "8px" 
              }}
            />
            <p className="text-muted small mt-1">معاينة صورة الغلاف</p>
          </div>
        )}
      </Form.Group>

      {/* 🔹 أقسام المقال */}
      <h5 className="mb-3">أقسام المقال:</h5>
      {newArticle.sections.map((section, index) => (
        <div
          key={index}
          className="border rounded p-3 mb-3 bg-light position-relative"
        >
          <h6>الجزء {index + 1}</h6>
          
          {/* نص القسم */}
          <Form.Group className="mb-2">
            <Form.Label>النص</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={section.text}
              onChange={(e) =>
                handleSectionChange(index, "text", e.target.value)
              }
              placeholder="اكتب محتوى هذا الجزء..."
            />
          </Form.Group>

          {/* صورة القسم */}
          <Form.Group className="mb-2">
            <Form.Label>صورة القسم (اختياري)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => handleSectionImageUpload(index, e)}
            />
            {section.imagePreview && (
              <div className="mt-2">
                <img 
                  src={section.imagePreview} 
                  alt="Section preview" 
                  style={{ 
                    width: "120px", 
                    height: "120px", 
                    objectFit: "cover", 
                    borderRadius: "6px" 
                  }}
                />
                <p className="text-muted small mt-1">معاينة صورة القسم</p>
              </div>
            )}
          </Form.Group>

          {/* زر حذف القسم (إذا فيه أكثر من قسم) */}
          {newArticle.sections.length > 1 && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => removeSection(index)}
            >
              🗑️ حذف هذا الجزء
            </Button>
          )}
        </div>
      ))}

      {/* زر إضافة قسم جديد */}
      <Button variant="outline-primary" onClick={addSection}>
        ➕ إضافة جزء جديد
      </Button>
    </Form>
  </Modal.Body>

  {/* 🔹 أزرار الحفظ والإلغاء */}
  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>
      إلغاء
    </Button>
    <Button
      variant="primary"
      onClick={isEditing ? handleUpdateArticle : handleAddArticle}
      disabled={loading}
    >
      {loading ? "جارٍ الحفظ..." : (isEditing ? "💾 حفظ التعديلات" : "💾 حفظ المقال")}
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
}