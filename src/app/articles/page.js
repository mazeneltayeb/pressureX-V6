// "use client";
// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Card, Button } from "react-bootstrap";
// import AdSlot from "@/components/AdSlot";
// export default function ArticlesPage() {
//   const [articles, setArticles] = useState([]);


// useEffect(() => {
//   fetch("/api/articles")
//     .then((res) => res.json())
//     .then((data) => {
//       console.log("📚 كل المقالات:", data);
//       console.log("🖼️ coverImages:", data.map(a => ({ title: a.title, cover: a.coverImage })));
//       setArticles(data);
//     })
//     .catch((err) => console.error(err));
// }, []);
//   return (
//     <Container className="py-5">
//       <AdSlot width="90%" height="150px" label="إعلان منتصف الصفحة" />
//       <h1 className="text-center mb-4">📚 المقالات</h1>
//       <Row>
//   {articles.map((article) => (
//     <Col md={4} key={article.id} className="mb-4">
//       <Card className="shadow-sm h-100">
//         {/* ✅ صورة الغلاف */}
//         {article.coverImage && (
//           <Card.Img
//             variant="top"
//             src={article.coverImage}
//             style={{ height: "200px", objectFit: "cover" }}
//             alt={article.title}
//           />
//         )}
//         <Card.Body>
//           <Card.Title>{article.title}</Card.Title>
//           <Card.Text>
//             {/* نعرض أول 120 حرف بس */}
//             {article.sections?.[0]?.text?.slice(0, 120) || "لا يوجد محتوى"}
//           </Card.Text>
//           <Button variant="success" href={`/articles/${article.id}`}>
//             اقرأ المزيد
//           </Button>
//         </Card.Body>
//       </Card>
//     </Col>
//   ))}
// </Row>

//         <AdSlot width="80%" height="120px" label="إعلان أسفل الصفحة" />
//     </Container>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import AdSlot from "@/components/AdSlot";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);

  // جلب المقالات والفئات
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // جلب المقالات
        const articlesRes = await fetch("/api/articles");
        const articlesData = await articlesRes.json();
        setArticles(articlesData);
        setFilteredArticles(articlesData);

        // جلب فئات المقالات
        const categoriesRes = await fetch("/api/article-categories");
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // فلترة المقالات حسب الفئة
  useEffect(() => {
    if (selectedCategory === "الكل") {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter((article) => article.category === selectedCategory);
      setFilteredArticles(filtered);
    }
  }, [selectedCategory, articles]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">جار التحميل...</span>
        </div>
        <p className="mt-3">جارٍ تحميل المقالات...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <AdSlot width="90%" height="150px" label="إعلان منتصف الصفحة" />
      
      <h1 className="text-center mb-4">📚 المقالات</h1>

      {/* 🔹 فلترة الفئات */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="shadow-sm"
          >
            <option value="الكل">📂 كل المقالات</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {/* 🔹 مؤشر النتائج */}
      <div className="text-center mb-4">
        <p className="text-muted">
          {selectedCategory === "الكل" 
            ? `عرض ${filteredArticles.length} مقال`
            : `عرض ${filteredArticles.length} مقال في فئة "${selectedCategory}"`
          }
        </p>
      </div>

      {/* 🔹 شبكة المقالات */}
      <Row>
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
            <Col md={4} key={article.id} className="mb-4">
              <Card className="shadow-sm h-100 article-card">
                {/* صورة الغلاف */}
                {article.coverImage && (
                  <Card.Img
                    variant="top"
                    src={article.coverImage}
                    style={{ 
                      height: "200px", 
                      objectFit: "cover",
                      cursor: "pointer"
                    }}
                    alt={article.title}
                    onClick={() => window.location.href = `/articles/${article.id}`}
                  />
                )}
                
                <Card.Body className="d-flex flex-column">
                  {/* الفئة */}
                  {article.category && (
                    <div className="mb-2 ">   
                      <span className="badge bg-primary second-button">{article.category}</span>
                    </div>
                  )}
                  
                  <Card.Title className="flex-grow-1">{article.title}</Card.Title>
                  
                  <Card.Text className="text-muted flex-grow-1">
                    {article.sections?.[0]?.text?.slice(0, 120) || "لا يوجد محتوى..."}
                  </Card.Text>
                  
                  <Button 
                    variant="success " 
                    href={`/articles/${article.id}`}
                    className="mt-auto main-button"
                  >
                    اقرأ المزيد
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center py-5">
            <div className="alert alert-warning">
              <h4>📭 لا توجد مقالات</h4>
              <p>
                {selectedCategory === "الكل" 
                  ? "لا توجد مقالات متاحة حالياً"
                  : `لا توجد مقالات في فئة "${selectedCategory}"`
                }
              </p>
              {selectedCategory !== "الكل" && (
                <Button 
                  variant="outline-primary" 
                  onClick={() => setSelectedCategory("الكل")}
                >
                  عرض كل المقالات
                </Button>
              )}
            </div>
          </Col>
        )}
      </Row>

      <AdSlot width="80%" height="120px" label="إعلان أسفل الصفحة" />
    </Container>
  );
}