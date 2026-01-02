




"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Container, 
  Row, 
  Col, 
  Carousel, 
  Spinner, 
  Alert, 
  Button,
  Modal,
  InputGroup,
  Form 
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { supabase } from "/lib/supabaseClient";

// كومبوننت إضافة للسلة
function AddToCartModal({ product, show, onHide, user }) {
  const [quantity, setQuantity] = useState(1);

  const addToCart = () => {
    if (!user) {
      alert("⚠️ يرجى تسجيل الدخول لإضافة المنتجات إلى السلة");
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    alert(`✅ تم إضافة ${quantity} من ${product.name} إلى السلة`);
    onHide();
    setQuantity(1);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>إضافة إلى السلة</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <img 
            src={product.images?.[0] || "https://via.placeholder.com/100"} 
            alt={product.name}
            style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
          />
          <h6 className="mt-2">{product.name}</h6>
          <p className="text-success h5">{product.price} ج.م</p>
        </div>

        <Form.Group>
          <Form.Label>الكمية المطلوبة</Form.Label>
          <InputGroup>
            <Button 
              variant="outline-secondary"
              onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
            >
              -
            </Button>
            <Form.Control
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="text-center"
            />
            <Button 
              variant="outline-secondary"
              onClick={() => setQuantity(prev => prev + 1)}
            >
              +
            </Button>
          </InputGroup>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          إلغاء
        </Button>
        <Button variant="success" onClick={addToCart}>
          🛒 إضافة إلى السلة
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);

  useEffect(() => {
    // التحقق من حالة المستخدم
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setLoadingAuth(false);
      }
    }

    checkAuth();

    // الاستماع لتغيرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        
        // إذا تم تسجيل الدخول، نحدث الصفحة تلقائياً
        if (event === 'SIGNED_IN') {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        
        if (!res.ok) {
          throw new Error("فشل في جلب المنتج");
        }
        
        const data = await res.json();
        
        if (data.error) {
          setError(data.error);
        } else {
          setProduct(data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("حدث خطأ أثناء تحميل المنتج");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("watch?v=")) return url.replace("watch?v=", "embed/");
    if (url.includes("youtu.be/")) {
      const v = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${v}`;
    }
    return url;
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("⚠️ يرجى تسجيل الدخول لإضافة المنتجات إلى السلة");
      router.push("/auth/signin");
      return;
    }
    setShowCartModal(true);
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("⚠️ يرجى تسجيل الدخول لشراء المنتجات");
      router.push("/login");
      return;
    }
    // إضافة مباشرة للسلة ثم التوجيه للدفع
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    router.push("/checkout");
  };
 const handleSignin = async () => {
    try {
        // حفظ الصفحة الحالية قبل تسجيل الخروج
        sessionStorage.setItem("prevPage", window.location.href);
        
        await supabase.auth.signOut();
        setUser(null);
        
   
        
    } catch (error) {
        console.error('Error signing out:', error);
    }
};
  if (loading || loadingAuth) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">جاري تحميل المنتج...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">المنتج غير موجود</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* رسالة للمستخدمين غير المسجلين */}
      {!user && (
        <Alert variant="warning" className="text-center mb-4">
          <strong>🔒 ملاحظة:</strong> سجل الدخول لرؤية سعر المنتج وإمكانية الطلب
        </Alert>
      )}

      {/* رسالة ترحيب للمستخدمين المسجلين */}
      {user && (
        <Alert variant="success" className="text-center mb-4">
          <strong>🎉 أهلاً بعودتك!</strong> يمكنك الآن رؤية الأسعار وإضافة المنتجات إلى السلة
        </Alert>
      )}

      <Row>
        <Col md={6}>
          {/* معرض الصور */}
          {product.images && product.images.length > 0 ? (
            <Carousel>
              {product.images.map((img, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={img}
                    alt={`${product.name} - صورة ${index + 1}`}
                    style={{ height: "400px", objectFit: "cover" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <div className="text-center py-5 border rounded">
              <p>لا توجد صور للمنتج</p>
            </div>
          )}
        </Col>

        <Col md={6}>
          <h1>{product.name}</h1>
          
          {/* الفئة */}
          <div className="mt-4 d-flex gap-3 flex-wrap">
            {user ? (
              <>
                <Button variant="success" size="lg" onClick={handleAddToCart}>
                  🛒 أضف إلى السلة
                </Button>
                <Button variant="primary" size="lg" onClick={handleBuyNow}>
                  💳 اطلب الآن
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="warning" 
                  size="lg"
                  
                  onClick={() => router.push("/auth/signin")|| handleSignin}
                >
                  🔓 سجل الدخول للشراء
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  onClick={() => router.push("/registration")}
                >
                  📝 إنشاء حساب جديد
                </Button>
              </>
            )}
          </div>
          {product.category && (
            <div className="mb-3">
              <span className="badge bg-primary">{product.category}</span>
            </div>
          )}
          
          {/* عرض السعر فقط للمستخدمين المسجلين */}
          {user ? (
            <div>
              <h3 className="text-success">{Number(product.price).toLocaleString()} ج.م</h3>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-muted">
                  <del>{Number(product.originalPrice).toLocaleString()} ج.م</del>
                  <span className="text-danger ms-2">
                    وفر {Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-warning">🔒 سجل الدخول لرؤية السعر</h3>
              <p className="text-muted">سعر خاص للأعضاء المسجلين فقط</p>
            </div>
          )}
          
          <div className="my-4">
            <h5>الوصف:</h5>
            <p>{product.description || "لا يوجد وصف"}</p>
          </div>

          {product.article && (
            <div className="my-4">
              <h5>التفاصيل:</h5>
              <p>{product.article}</p>
            </div>
          )}

          {getEmbedUrl(product.youtube) && (
            <div className="my-4">
              <h5>فيديو:</h5>
              <iframe
                width="100%"
                height="315"
                src={getEmbedUrl(product.youtube)}
                title="فيديو المنتج"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* أزرار الإجراء - تختلف حسب حالة المستخدم */}
          {/* <div className="mt-4 d-flex gap-3 flex-wrap">
            {user ? (
              <>
                <Button variant="success" size="lg" onClick={handleAddToCart}>
                  🛒 أضف إلى السلة
                </Button>
                <Button variant="primary" size="lg" onClick={handleBuyNow}>
                  💳 اطلب الآن
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="warning" 
                  size="lg"
                  
                  onClick={() => router.push("/auth/signin")|| handleSignin}
                >
                  🔓 سجل الدخول للشراء
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  onClick={() => router.push("/registration")}
                >
                  📝 إنشاء حساب جديد
                </Button>
              </>
            )}
          </div> */}

          {/* معلومات إضافية للمستخدمين المسجلين */}
          {user && (
            <div className="mt-4 p-3 bg-light rounded">
              <h6>مميزات العضوية:</h6>
              <ul className="mb-0">
                <li>أسعار خاصة للأعضاء</li>
                <li>تتبع الطلبات</li>
                <li>عروض حصرية</li>
                <li>دعم فني متميز</li>
              </ul>
            </div>
          )}
        </Col>
      </Row>

      {/* مودال إضافة للسلة */}
      {user && (
        <AddToCartModal 
          product={product}
          show={showCartModal}
          onHide={() => setShowCartModal(false)}
          user={user}
        />
      )}
    </Container>
  );
}