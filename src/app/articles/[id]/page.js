// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { Container, Card, Spinner } from "react-bootstrap";

// export default function ArticlePage() {
//   const { id } = useParams();
//   const [article, setArticle] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // 📥 جلب المقال من ملف JSON عبر API
//   useEffect(() => {
//     const fetchArticle = async () => {
//       try {
//         const res = await fetch("/api/articles");
//         const text = await res.text();
//         const data = text ? JSON.parse(text) : [];
//         const found = data.find((a) => String(a.id) === String(id));
//         setArticle(found || null);
//       } catch (error) {
//         console.error("Error loading article:", error);
//         setArticle(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticle();
//   }, [id]);

//   if (loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" variant="success" />
//         <p className="mt-3">جارٍ تحميل المقال...</p>
//       </Container>
//     );
//   }

//   if (!article) {
//     return (
//       <Container className="py-5 text-center">
//         <h2>المقال غير موجود ❌</h2>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-5">
//       {/* 🟢 إعلان أعلى الصفحة */}
//       <div
//         style={{
//           backgroundColor: "#f8f9fa",
//           padding: "20px",
//           textAlign: "center",
//           borderRadius: "10px",
//           marginBottom: "30px",
//         }}
//       >
//         <p>📢 إعلان Google (728x90)</p>
//       </div>

//       {/* 📰 محتوى المقال */}
//       <Card className="shadow-sm p-3">
//         <Card.Title className="text-center mb-4">
//           <h2>{article.title}</h2>
//         </Card.Title>

//         {article.sections && article.sections.length > 0 ? (
//           article.sections.map((section, index) => (
//             <div key={index} className="mb-4">
//               {section.text && (
//                 <p
//                   style={{
//                     fontSize: "1.1rem",
//                     lineHeight: "1.8",
//                     textAlign: "justify",
//                     color: "#333",
//                   }}
//                 >
//                   {section.text}
//                 </p>
//               )}
//               {section.image && (
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "center",
//                     marginTop: "15px",
//                   }}
//                 >
//                   <img
//                     src={section.image}
//                     alt={`صورة ${index + 1}`}
//                     style={{
//                       maxWidth: "100%",
//                       borderRadius: "10px",
//                       objectFit: "contain",
//                     }}
//                   />
//                 </div>
//               )}
//             </div>
//           ))
//         ) : (
//           <p
//             style={{
//               fontSize: "1.1rem",
//               lineHeight: "1.8",
//               textAlign: "justify",
//               color: "#333",
//             }}
//           >
//             لا توجد أقسام لهذا المقال.
//           </p>
//         )}
//       </Card>

//       {/* 🟢 إعلان أسفل الصفحة */}
//       <div
//         style={{
//           backgroundColor: "#f8f9fa",
//           padding: "20px",
//           textAlign: "center",
//           borderRadius: "10px",
//           marginTop: "40px",
//         }}
//       >
//         <p>📢 مساحة إعلان (728x90)</p>
//       </div>
//     </Container>
//   );
// }

// "use client";
// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { Container, Card, Spinner, Alert } from "react-bootstrap";

// export default function ArticlePage() {
//   const { id } = useParams();
//   const [article, setArticle] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // 📥 جلب المقال المحدد مباشرة
//   useEffect(() => {
//     const fetchArticle = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/articles/${id}`);
        
//         if (!res.ok) {
//           if (res.status === 404) {
//             setError("المقال غير موجود");
//           } else {
//             setError("حدث خطأ أثناء تحميل المقال");
//           }
//           return;
//         }
        
//         const data = await res.json();
        
//         if (data.error) {
//           setError(data.error);
//         } else {
//           setArticle(data);
//         }
//       } catch (error) {
//         console.error("Error loading article:", error);
//         setError("حدث خطأ في الاتصال");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchArticle();
//     }
//   }, [id]);


"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Card, Spinner, Alert } from "react-bootstrap";

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/articles/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError("المقال غير موجود");
          } else {
            setError("حدث خطأ أثناء تحميل المقال");
          }
          return;
        }
        
        const data = await res.json();
        
        // 🔥 دي أهم سطر - شوف البيانات الفعلية
        // console.log("📄 المقال كامل:", data);
        // console.log("🖼️ coverImage:", data.coverImage);
        // console.log("📸 sections images:", data.sections?.map(s => s.image));
        console.log("📄 المقال كامل:", JSON.stringify(data, null, 2));
console.log("🖼️ coverImage:", data.coverImage);
console.log("📸 sections images:", data.sections?.map((s, i) => `Section ${i}: "${s.image}"`));
        if (data.error) {
          setError(data.error);
        } else {
          setArticle(data);
        }
      } catch (error) {
        console.error("Error loading article:", error);
        setError("حدث خطأ في الاتصال");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  // ... باقي الكود نفسه
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">جارٍ تحميل المقال...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h4>❌ {error}</h4>
        </Alert>
      </Container>
    );
  }

  if (!article) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <h4>المقال غير موجود</h4>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* 🟢 إعلان أعلى الصفحة */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <p>📢 إعلان Google (728x90)</p>
      </div>

      {/* 📰 محتوى المقال */}
      <Card className="shadow-sm p-4">
        {/* صورة الغلاف */}
        {article.coverImage && (
          <div className="text-center mb-4">
            <img
              src={article.coverImage}
              alt={`غلاف ${article.title}`}
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </div>
        )}

        <Card.Title className="text-center mb-4">
          <h1 style={{ color: "#2c5aa0" }}>{article.title}</h1>
        </Card.Title>

        {article.sections && article.sections.length > 0 ? (
          article.sections.map((section, index) => (
            <div key={index} className="mb-5">
              {/* نص القسم */}
              {section.text && (
                <p
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.8",
                    textAlign: "right",
                    color: "#333",
                    marginBottom: section.image ? "20px" : "0",
                  }}
                >
                  {section.text}
                </p>
              )}
              
              {/* صورة القسم */}
              {section.image && (
                <div className="text-center">
                  <img
                    src={section.image}
                    alt={`صورة ${index + 1}`}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "500px",
                      borderRadius: "10px",
                      objectFit: "contain",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                    onError={(e) => {
                      console.error("Image failed to load:", section.image);
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              {/* فاصل بين الأقسام */}
              {index < article.sections.length - 1 && (
                <hr style={{ margin: "30px 0", borderColor: "#eee" }} />
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-muted">
            لا توجد أقسام لهذا المقال.
          </p>
        )}
      </Card>

      {/* 🟢 إعلان أسفل الصفحة */}
      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          textAlign: "center",
          borderRadius: "10px",
          marginTop: "40px",
        }}
      >
        <p>📢 مساحة إعلان (728x90)</p>
      </div>
    </Container>
  );
}