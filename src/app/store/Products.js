"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  Badge, 
  Modal, 
  InputGroup,
  Spinner,
  Alert,
  Pagination 
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from '/lib/supabaseClient';



// export const metadata = {
//   title: "قطع غيار سيارات أصلية | منتجات جملة وقطاعي في مصر",
// description:"تسوق قطع غيار سيارات أصلية في مصر بأسعار مميزة. منتجات جملة وقطاعي لجميع الموديلات مع شحن سريع لكل المحافظات",
// };

// 🔥 متغيرات كاش خارجية
let cachedProducts = null;
let cachedCategories = null;
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 دقائق كاش

// 🔥 دالة لتحديد حالة المنتج بناءً على المخزون والحالة
const getProductStatus = (product) => {
  const stock = product.stock || 0;
  const status = product.status || 'active';
  
  // إذا الحالة out_of_stock أو المخزون 0
  if (status === 'out_of_stock' || stock <= 0) {
    return {
      available: false,
      badgeColor: "danger",
      badgeText: "غير متوفر",
      badgeIcon: "⛔",
      buttonVariant: "secondary",
      buttonText: "غير متوفر",
      disabled: true
    };
  }
  
  // إذا الحالة coming_soon
  if (status === 'coming_soon') {
    return {
      available: false,
      badgeColor: "warning",
      badgeText: "قريباً",
      badgeIcon: "🟡",
      buttonVariant: "warning",
      buttonText: "قريباً",
      disabled: true
    };
  }
  
  // إذا الحالة active والمخزون متوفر
  if (stock > 0) {
    // إذا المخزون محدود
    if (stock <= 10) {
      return {
        available: true,
        badgeColor: "warning",
        badgeText: `${stock} متبقي`,
        badgeIcon: "🟡",
        buttonVariant: "success",
        buttonText: "أضف إلى السلة",
        disabled: false,
        limited: true
      };
    }
    
    // إذا المخزون كافي
    return {
      available: true,
      badgeColor: "success",
      badgeText: "متوفر",
      badgeIcon: "🟢",
      buttonVariant: "success",
      buttonText: "أضف إلى السلة",
      disabled: false
    };
  }
  
  // الحالة الافتراضية
  return {
    available: false,
    badgeColor: "secondary",
    badgeText: "—",
    badgeIcon: "",
    buttonVariant: "secondary",
    buttonText: "—",
    disabled: true
  };
};

// 🔥 كومبوننت إضافة للسلة مع React.memo - معدل
const AddToCartButton = React.memo(function AddToCartButton({ product, isLoggedIn }) {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  
  // تحديد حالة المنتج
  const productStatus = getProductStatus(product);

  const addToCart = useCallback(() => {
    if (!isLoggedIn) {
      alert("⚠️ يرجى تسجيل الدخول لإضافة المنتجات إلى السلة");
      router.push("/auth/signin");
      return;
    }

    // التحقق من توفر المنتج
    if (!productStatus.available) {
      alert(`⚠️ ${productStatus.badgeText}`);
      return;
    }

    // التحقق من الكمية المتاحة
    const currentStock = product.stock || 0;
    if (quantity > currentStock) {
      alert(`⚠️ الكمية المتاحة فقط ${currentStock} قطعة`);
      return;
    }

    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      const newQuantity = currentCart[existingItemIndex].quantity + quantity;
      if (newQuantity > currentStock) {
        alert(`⚠️ الكمية المتاحة فقط ${currentStock} قطعة`);
        return;
      }
      currentCart[existingItemIndex].quantity = newQuantity;
    } else {
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        quantity: quantity,
        stock: product.stock // حفظ المخزون للتحقق لاحقاً
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    alert(`✅ تم إضافة ${quantity} من ${product.name} إلى السلة`);
    setShowModal(false);
    setQuantity(1);
  }, [isLoggedIn, product, quantity, router, productStatus]);

  const handleAddToCartClick = useCallback(() => {
    if (!isLoggedIn) {
      alert("⚠️ يرجى تسجيل الدخول لإضافة المنتجات إلى السلة");
      router.push("auth/signin");
      return;
    }
    
    // التحقق من توفر المنتج قبل فتح المودال
    if (!productStatus.available) {
      alert(`⚠️ ${productStatus.badgeText}`);
      return;
    }
    
    setShowModal(true);
  }, [isLoggedIn, router, productStatus]);

  return (
    <>
      <Button 
      style={{color:"black",opacity:"1", border:"0", borderRadius:"0"}} 
        variant={productStatus.buttonVariant}
        className={`w-100 main-button ${!productStatus.available ? 'disabled-btn' : ''}`}
        onClick={handleAddToCartClick}
        disabled={productStatus.disabled || !isLoggedIn}
      >
        {productStatus.buttonIcon && <span className="me-1">{productStatus.buttonIcon}</span>}
        {isLoggedIn ? productStatus.buttonText : "سجل الدخول للطلب"}
      </Button>

      {isLoggedIn && productStatus.available && (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>إضافة إلى السلة</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center mb-3">
              <img 
                src={product.images?.[0] || "https://via.placeholder.com/100"} 
                alt={product.name}
                style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
                loading="lazy"
              />
              <h6 className="mt-2">{product.name}</h6>
              <div className="d-flex justify-content-center align-items-center gap-2 mt-1">
                <p className="text-success h5 mb-0">{product.price} ج.م</p>
                <Badge bg={productStatus.badgeColor} className="ms-2 ">
                  {productStatus.badgeIcon} {productStatus.badgeText}
                </Badge>
              </div>
            </div>

            <Form.Group>
              <Form.Label>
                الكمية المطلوبة {productStatus.limited && `(المتبقي: ${product.stock})`}
              </Form.Label>
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
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value) || 1;
                    const maxQuantity = product.stock || 1;
                    setQuantity(Math.max(1, Math.min(newQuantity, maxQuantity)));
                  }}
                  min="1"
                  max={product.stock || 1}
                  className="text-center"
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => {
                    const maxQuantity = product.stock || 1;
                    setQuantity(prev => Math.min(prev + 1, maxQuantity));
                  }}
                >
                  +
                </Button>
              </InputGroup>
              {productStatus.limited && (
                <Form.Text className="text-warning">
                  ⚠️ الكمية محدودة، فقط {product.stock} متبقية
                </Form.Text>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              إلغاء
            </Button>
            <Button variant="success" onClick={addToCart}>
              🛒 إضافة إلى السلة
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
});

// 🔥 كومبوننت Pagination منفصل
function StorePagination({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }
  
  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination className="mb-0">
        <Pagination.First 
          onClick={() => onPageChange(1)} 
          disabled={currentPage === 1}
        />
        <Pagination.Prev 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
        />
        
        {pages}
        
        <Pagination.Next 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
        />
        <Pagination.Last 
          onClick={() => onPageChange(totalPages)} 
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
}

export default function StorePage() {
  // 🔥 States الأساسية
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchNumber, setSearchNumber] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [availabilityFilter, setAvailabilityFilter] = useState("الكل"); // ⬅️ فلتر جديد
  
  // 🔥 States للـ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  const router = useRouter();

  // 🔥 1. التحقق من حالة تسجيل الدخول
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setIsLoggedIn(!!session);
          setAuthChecked(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        if (isMounted) {
          setIsLoggedIn(false);
          setAuthChecked(true);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (isMounted) {
          setIsLoggedIn(!!session);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // 🔥 2. جلب البيانات مع الكاش
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      const now = Date.now();
      
      if (cachedProducts && cachedCategories && cacheTimestamp && 
          (now - cacheTimestamp) < CACHE_DURATION) {
        if (isMounted) {
          setProducts(cachedProducts);
          setCategories(cachedCategories);
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) setLoading(true);
        
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/categories")
        ]);
        
        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('فشل في جلب البيانات');
        }
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        cachedProducts = productsData;
        cachedCategories = categoriesData;
        cacheTimestamp = now;
        
        if (isMounted) {
          setProducts(productsData);
          setCategories(categoriesData);
          setLoading(false);
        }
        
      } catch (error) {
        console.error("❌ خطأ في جلب البيانات:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 🔥 3. فلترة وترتيب المنتجات باستخدام useMemo
  const filteredProducts = useMemo(() => {
    if (products.length === 0) return [];
    
    let filtered = [...products];

    // البحث بالرقم
    if (searchNumber.trim() !== "") {
      filtered = filtered.filter((product) => {
        const productNumber = product.number?.toString() || "";
        return productNumber.includes(searchNumber);
      });
    }

    // الفلترة حسب الفئة
    if (selectedCategory !== "الكل") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // الفلترة حسب التوفر
    if (availabilityFilter !== "الكل") {
      switch (availabilityFilter) {
        case "متوفر":
          filtered = filtered.filter((product) => {
            const status = getProductStatus(product);
            return status.available;
          });
          break;
        case "غير متوفر":
          filtered = filtered.filter((product) => {
            const status = getProductStatus(product);
            return !status.available;
          });
          break;
        case "محدود":
          filtered = filtered.filter((product) => {
            const stock = product.stock || 0;
            const status = product.status || 'active';
            return stock > 0 && stock <= 10 && status !== 'out_of_stock';
          });
          break;
        case "قريباً":
          filtered = filtered.filter((product) => product.status === 'coming_soon');
          break;
      }
    }

    // الترتيب
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => b.id - a.id);
    } else if (sortBy === "stock-high") {
      filtered.sort((a, b) => (b.stock || 0) - (a.stock || 0));
    } else if (sortBy === "stock-low") {
      filtered.sort((a, b) => (a.stock || 0) - (b.stock || 0));
    }

    return filtered;
  }, [products, searchNumber, selectedCategory, sortBy, availabilityFilter]);

  // 🔥 4. حساب المنتجات المعروضة
  const currentProducts = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // 🔥 5. إعادة تعيين الصفحة عند تغيير الفلاتر
  useEffect(() => {
    setCurrentPage(1);
  }, [searchNumber, selectedCategory, sortBy, availabilityFilter]);

  // 🔥 6. دوال المعالجة
  const handleSignin = useCallback(async () => {
    try {
      sessionStorage.setItem("prevPage", window.location.href);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchNumber("");
  }, []);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      
      const timestamp = Date.now();
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`/api/products?t=${timestamp}`),
        fetch(`/api/categories?t=${timestamp}`)
      ]);
      
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      
      cachedProducts = productsData;
      cachedCategories = categoriesData;
      cacheTimestamp = timestamp;
      
      setProducts(productsData);
      setCategories(categoriesData);
      
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleItemsPerPageChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []);

  // 🔥 7. إحصائيات المنتجات
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const availableProducts = products.filter(p => getProductStatus(p).available).length;
    const outOfStockProducts = products.filter(p => !getProductStatus(p).available).length;
    const limitedProducts = products.filter(p => {
      const stock = p.stock || 0;
      return stock > 0 && stock <= 10 && (p.status || 'active') !== 'out_of_stock';
    }).length;
    
    return {
      totalProducts,
      availableProducts,
      outOfStockProducts,
      limitedProducts,
      availablePercentage: totalProducts > 0 ? Math.round((availableProducts / totalProducts) * 100) : 0
    };
  }, [products]);

  // 🔥 8. عرض حالة التحميل
  if (loading && products.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="success" />
        <p className="mt-3">جارٍ تحميل المتجر...</p>
      </Container>
    );
  }

  // 🔥 9. حساب إحصائيات العرض
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const showingFrom = (currentPage - 1) * itemsPerPage + 1;
  const showingTo = Math.min(currentPage * itemsPerPage, filteredProducts.length);
  const totalItems = filteredProducts.length;

  return (
    <Container className="py-4 px-md-0">
      <h1 className="text-center mb-4">منتجات قطع غيار السيارات</h1>

      {/* 🔹 إحصائيات سريعة */}
      {/* <div className="row mb-4">
        <div className="col-md-3 mb-2">
          <div className="card bg-light border">
            <div className="card-body text-center p-2">
              <h6 className="mb-1">📊 إجمالي المنتجات</h6>
              <h4 className="mb-0">{stats.totalProducts}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="card bg-success text-white border">
            <div className="card-body text-center p-2">
              <h6 className="mb-1">🟢 متوفر</h6>
              <h4 className="mb-0">{stats.availableProducts}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="card bg-danger text-white border">
            <div className="card-body text-center p-2">
              <h6 className="mb-1">🔴 غير متوفر</h6>
              <h4 className="mb-0">{stats.outOfStockProducts}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="card bg-warning text-dark border">
            <div className="card-body text-center p-2">
              <h6 className="mb-1">🟡 محدود</h6>
              <h4 className="mb-0">{stats.limitedProducts}</h4>
            </div>
          </div>
        </div>
      </div> */}

      {/* 🔹 أزرار التحكم */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={refreshData}
            disabled={loading}
            title="تحديث البيانات"
          >
            🔄 تحديث
          </Button>
        </div>
        
        {/* <div className="text-muted small">
          {stats.availablePercentage}% من المنتجات متوفرة
        </div> */}
      </div>

      {/* 🔹 تنبيهات حالة المصادقة */}
      {authChecked && !isLoggedIn && (
        <Alert variant="warning" className="text-center mb-4">
          <strong>🔒 للاطلاع على الأسعار وإتمام الطلبات</strong>
          <br />
          يرجى <a href="/auth/signin" className="alert-link">تسجيل الدخول</a> أو <a href="/register" className="alert-link">إنشاء حساب جديد</a>
        </Alert>
      )}

      {authChecked && isLoggedIn && (
        <Alert variant="success" className="text-center mb-4">
          <strong>🎉 أهلاً بعودتك!</strong>
          <br />
          يمكنك الآن رؤية الأسعار وإضافة المنتجات إلى السلة
        </Alert>
      )}

      {/* 🔹 أدوات البحث والفلترة */}
      {/* d-none */}
      <div className=" d-none row justify-content-between mb-4">
        {/* البحث بالرقم */}
        <div className="col-lg-2 col-md-6 mb-3">
           <Form.Text className="text-muted">
            ابحث بالرقم
          </Form.Text>
          <InputGroup className="shadow-sm">
            <Form.Control
              type="number"
              placeholder="🔍Part Number"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
            />
            {searchNumber && (
              <Button 
                variant="outline-secondary" 
                onClick={clearSearch}
                title="مسح البحث"
              >
                ✕
              </Button>
            )}
          </InputGroup>
         
        </div>

        {/* فلترة الفئة */}
        <div className="col-lg-2 col-md-6 mb-3">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="shadow-sm"
          >
            <option value="الكل">📂 كل الفئات</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Form.Select>
          <Form.Text className="text-muted">
            الفئة
          </Form.Text>
        </div>

        {/* فلترة التوفر */}
        <div className="col-lg-2 col-md-6 mb-3">
          <Form.Select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="shadow-sm"
          >
            <option value="الكل">📊 كل الحالات</option>
            <option value="متوفر">🟢 متوفر فقط</option>
            <option value="غير متوفر">🔴 غير متوفر</option>
            <option value="محدود">🟡 كميات محدودة</option>
            <option value="قريباً">🟡 قريباً</option>
          </Form.Select>
          <Form.Text className="text-muted">
            حالة التوفر
          </Form.Text>
        </div>

        {/* ترتيب المنتجات */}
        <div className="col-lg-3 col-md-6 mb-3">
          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="shadow-sm"
          >
            <option value="newest">🆕 الأحدث أولاً</option>
            <option value="price-low">💰 السعر: من الأقل</option>
            <option value="price-high">💰 السعر: من الأعلى</option>
            <option value="stock-high">📦 المخزون: من الأعلى</option>
            <option value="stock-low">📦 المخزون: من الأقل</option>
          </Form.Select>
          <Form.Text className="text-muted">
            ترتيب المنتجات
          </Form.Text>
        </div>

        {/* عدد العناصر في الصفحة */}
        <div className="col-lg-2 col-md-6 mb-3">
          <Form.Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="shadow-sm"
          >
            <option value={12}>📄 12 منتج</option>
            <option value={20}>📄 20 منتج</option>
            <option value={40}>📄 40 منتج</option>
            <option value={60}>📄 60 منتج</option>
          </Form.Select>
          <Form.Text className="text-muted">
            لكل صفحة
          </Form.Text>
        </div>
      </div>
        {/*  */}
           {/* 🔹 مؤشر النتائج */}
      <div className="text-center mb-4">
        <Alert variant="light" className="d-inline-block">
          <strong>
            {searchNumber ? (
              <>
                🔍 عرض {showingFrom}-{showingTo} من {totalItems} منتج يطابق الرقم "
                <span className="text-primary">{searchNumber}</span>"
                {selectedCategory !== "الكل" && ` في فئة "${selectedCategory}"`}
                {availabilityFilter !== "الكل" && ` [${availabilityFilter}]`}
              </>
            ) : (
              `📊 عرض ${showingFrom}-${showingTo} من ${totalItems} منتج`
            )}
          </strong>
          {(searchNumber || selectedCategory !== "الكل" || availabilityFilter !== "الكل") && (
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => {
                clearSearch();
                setSelectedCategory("الكل");
                setAvailabilityFilter("الكل");
              }}
              className="me-2"
            >
              (عرض الكل)
            </Button>
          )}
        </Alert>
      </div>
 {/* 🔹 أدوات البحث والفلترة */}
        <div className="row mb-4" >
          {/* البحث بالرقم - يبقى في الأعلى */}
          <div className="col-12 mb-3"
           style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
          }}>
            <Form.Text className="text-muted">
              ابحث بالرقم
            </Form.Text>
            <InputGroup style={{
              maxWidth: "500px",
              minWidth: "275px",
            }} className="shadow-sm">
              <Form.Control
                type="number"
                placeholder="🔍Part Number"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
              />
              {searchNumber && (
                <Button 
                  variant="outline-secondary" 
                  onClick={clearSearch}
                  title="مسح البحث"
                >
                  ✕
                </Button>
              )}
            </InputGroup>
          </div>

          {/* الأربع عناصر في صف واحد مع سكرول أفقي */}
          <div className="col-12 text-center" >
            <h6 className="text-muted">للمزيد من حلول البحث</h6>
            <div className="d-flex flex-nowrap overflow-auto pb-2 gap-2 justify-content-md-center" style={{ scrollbarWidth: 'thin' }}>
              
              {/* فلترة الفئة */}
              <div className="flex-shrink-0" style={{ minWidth: '100px' }}>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="shadow-sm"
                >
                  <option value="الكل">📂 كل الفئات</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  الفئة
                </Form.Text>
              </div>

              {/* فلترة التوفر */}
              <div className="flex-shrink-0" style={{ minWidth: '100px' }}>
                <Form.Select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="shadow-sm"
                >
                  <option value="الكل">📊 كل الحالات</option>
                  <option value="متوفر">🟢 متوفر فقط</option>
                  <option value="غير متوفر">🔴 غير متوفر</option>
                  <option value="محدود">🟡 كميات محدودة</option>
                  <option value="قريباً">🟡 قريباً</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  حالة التوفر
                </Form.Text>
              </div>

              {/* ترتيب المنتجات */}
              <div className="flex-shrink-0" style={{ minWidth: '100px' }}>
                <Form.Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="shadow-sm"
                >
                  <option value="newest">🆕 الأحدث أولاً</option>
                  <option value="price-low">💰 السعر: من الأقل</option>
                  <option value="price-high">💰 السعر: من الأعلى</option>
                  <option value="stock-high">📦 المخزون: من الأعلى</option>
                  <option value="stock-low">📦 المخزون: من الأقل</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  ترتيب المنتجات
                </Form.Text>
              </div>

              {/* عدد العناصر في الصفحة */}
              <div className="flex-shrink-0" style={{ minWidth: '100px' }}>
                <Form.Select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="shadow-sm"
                >
                  <option value={12}>📄 12 منتج</option>
                  <option value={20}>📄 20 منتج</option>
                  <option value={40}>📄 40 منتج</option>
                  <option value={60}>📄 60 منتج</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  لكل صفحة
                </Form.Text>
              </div>
            </div>
          </div>
        </div>

      {/* 🔹 شبكة المنتجات */}
      <Row >
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => {
            const productStatus = getProductStatus(product);
            
            return (
              <Col style={{maxWidth:" 50%", maxHeight:"250px"}} xl={3} lg={4} md={6} sm={6} key={product.id} className="mb-4">
                <Card className={`shadow-sm h-100 product-card ${!productStatus.available ? 'out-of-stock-card' : ''}`}>
                  {/* صورة المنتج مع overlay إذا غير متوفر */}
                  {product.images && product.images[0] && (
                    <div className="position-relative">
                      <Card.Img
                        variant="top"
                        src={product.images[0]}
                        alt={product.name}
                        loading="lazy"
                        style={{ 
                          height: "130px", 
                          objectFit: "contain",
                          cursor: "pointer",
                          filter: !productStatus.available ? 'grayscale(30%)' : 'none',
                          opacity: !productStatus.available ? 0.8 : 1
                        }}
                        onClick={() => window.location.href = `/store/${product.id}`}
                      />
                      {/* مؤشر عدد الصور */}
                      {product.images.length > 1 && (
                        <Badge 
                          bg="dark" 
                          className="position-absolute top-0 end-0 m-2"
                        >
                          +{product.images.length - 1}
                        </Badge>
                        
                        
                      )}
                      {/* Overlay إذا غير متوفر */}
                      {!productStatus.available && (
                        <div 
                           className=" d-none position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                          <Badge  bg={productStatus.badgeColor} className="fs-6 p-2">
                            {productStatus.badgeIcon} {productStatus.badgeText}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Card.Body className="d-flex flex-column p-0">
                    {/* الفئة والرقم */}
                    {/* <div className="mb-2 d-flex justify-content-between align-items-center">
                      <div>
                        {product.category && (
                          <Badge bg="outline-primary" text="dark" className="border me-1">
                            {product.category}
                          </Badge>
                        )}
                        {product.number && (
                          <Badge bg="secondary">
                            #{product.number}
                          </Badge>
                        )}
                      </div> */}
                      
                      {/* مؤشر الحالة */}
                      
                      {/* <Badge bg={productStatus.badgeColor} pill>
                        {productStatus.badgeIcon} {productStatus.badgeText}
                      </Badge> */}
                      
                    {/* </div> */}
                    
                    {/* اسم المنتج */}
                    <Card.Title 
                      className="flex-grow-1 mb-2 d-flex justify-content-center align-items-center" 
                      style={{ fontSize: "1.1rem", minHeight: "3rem" }}
                    >
                      {product.name}
                    </Card.Title>
                    
                    {/* وصف قصير */}
                    {/* <Card.Text 
                      className="text-muted mb-3" 
                      style={{ fontSize: "0.9rem", minHeight: "2.5rem" }}
                    >
                      {product.description?.slice(0, 70) || "لا يوجد وصف..."}
                      {product.description && product.description.length > 70 && "..."}
                    </Card.Text> */}
                    
                    {/* السعر وأزرار التحكم */}
                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top">
                      {authChecked && isLoggedIn ? (
                        <div>
                          <span className="h5 text-success mb-0">
                            {product.price} ج.م
                          </span>
                          {product.oldPrice && (
                            <small className="text-muted text-decoration-line-through ms-2">
                              {product.oldPrice} ج.م
                            </small>
                          )}
                        </div>
                      ) : (
                        <span className="h5 text-warning mb-0">
                          🔒 سجل الدخول
                        </span>
                      )}
                      
                      {/* <Button 
                        variant="dark"
                        size="sm"
                        href={`/store/${product.id}`}
                        className="px-3 fw-bold"
                      >
                        التفاصيل
                      </Button> */}
                    </div>

                    {/* زر إضافة للسلة */}
                    <div className="mt-3" >
                      <AddToCartButton product={product} isLoggedIn={isLoggedIn} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col className="text-center py-5">
            <Alert variant="warning" className="shadow">
              <h4 className="mb-3">📭 لا توجد منتجات</h4>
              <p className="mb-3">
                {searchNumber ? (
                  `لا توجد منتجات تطابق الرقم "${searchNumber}"`
                ) : selectedCategory !== "الكل" ? (
                  `لا توجد منتجات في فئة "${selectedCategory}"`
                ) : availabilityFilter !== "الكل" ? (
                  `لا توجد منتجات بحالة "${availabilityFilter}"`
                ) : (
                  "لا توجد منتجات متاحة حالياً"
                )}
              </p>
              {(searchNumber || selectedCategory !== "الكل" || availabilityFilter !== "الكل") && (
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    clearSearch();
                    setSelectedCategory("الكل");
                    setAvailabilityFilter("الكل");
                  }}
                  className="me-2"
                >
                  عرض كل المنتجات
                </Button>
              )}
              <Button 
                variant="outline-secondary" 
                onClick={refreshData}
              >
                🔄 تحديث
              </Button>
            </Alert>
          </Col>
        )}
      </Row>

      {/* 🔹 Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <StorePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          
          {/* معلومات الصفحة */}
          <div className="text-center mt-3 text-muted">
            <small>
              الصفحة {currentPage} من {totalPages} | 
              إجمالي المنتجات: {totalItems} | 
              عرض {itemsPerPage} منتج/صفحة
            </small>
          </div>
        </div>
      )}

      {/* 🔹 إعلان أسفل الصفحة */}
      <div className="text-center mt-5 p-4 bg-light rounded shadow-sm">
        <h5 className="mb-3">🚀 تسوق الآن واحصل على أفضل العروض!</h5>
        <p className="text-muted mb-4">تشكيلة واسعة من المنتجات بأسعار منافسة</p>
        
        {authChecked && isLoggedIn ? (
          <div>
            <Button variant="success" href="/cart" className="me-2 mb-2">
              🛒 عرض سلة التسوق
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={() => supabase.auth.signOut()}
              className="mb-2"
            >
              🚪 تسجيل الخروج
            </Button>
          </div>
        ) : (
          <div>
            <Button 
              onClick={handleSignin} 
              variant="success" 
              href="/auth/signin" 
              className="me-2 mb-2"
            >
              🔓 تسجيل الدخول
            </Button>
            <Button 
              variant="outline-primary" 
              href="/registration"
              className="mb-2"
            >
              📝 إنشاء حساب
            </Button>
          </div>
        )}
        
        {/* معلومات إضافية */}
        <div className="mt-3 pt-3 border-top">
          <small className="text-muted">
            ⚡ تحميل سريع | 🔒 آمن | 📞 دعم فني 24/7 | 📊 {stats.availablePercentage}% من المنتجات متوفرة
          </small>
        </div>
      </div>

      {/* 🔹 CSS إضافي */}
      <style jsx>{`
        .product-card {
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .out-of-stock-card {
          opacity: 0.9;
        }
        .out-of-stock-card:hover {
          transform: none;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important;
        }
        .main-button {
          font-weight: 600;
          transition: all 0.3s;
        }
        .main-button:hover:not(:disabled) {
          transform: scale(1.02);
        }
        .disabled-btn {
        
          opacity: 0.6;
          cursor: not-allowed;
        }
        
      `}</style>
    </Container>
  );
}