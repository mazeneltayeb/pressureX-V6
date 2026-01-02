"use client";

import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Form,
  Row,
  Col,
  Spinner,
  Alert,
  Modal,
  ProgressBar,
  Badge,
  InputGroup,
  Card,
  Dropdown
} from "react-bootstrap";

// تكوين Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 🔥 دالة مساعدة لتحديد لون الـ stock
const getStockBadgeColor = (stock) => {
  if (stock <= 0) return 'bg-danger text-white';
  if (stock <= 10) return 'bg-warning text-dark';
  return 'bg-success text-white';
};

// 🔥 دالة مساعدة لعرض حالة المنتج
const getStatusBadge = (status, stock) => {
  if (status === 'active') {
    return stock <= 0 
      ? <Badge bg="warning" text="dark">🟡 غير متوفر</Badge>
      : <Badge bg="success">🟢 متاح</Badge>;
  }
  if (status === 'out_of_stock') {
    return <Badge bg="danger">🔴 غير متوفر</Badge>;
  }
  if (status === 'coming_soon') {
    return <Badge bg="info">🟡 قريباً</Badge>;
  }
  return <Badge bg="secondary">—</Badge>;
};

export default function DashboardProducts() {
  const [products, setProducts] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    price: "",
    number: "",
    description: "",
    image_url: "",
    images: [],
    video: "",
    youtube: "",
    article: "",
    category: "",
    status: "active",
    stock: 0
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [stockFilter, setStockFilter] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [deleteMode, setDeleteMode] = useState('product-only'); // 'product-only' أو 'with-images'

  // 🟢 تحميل الفئات
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data || []);
    } catch (error) {
      console.error("خطأ في تحميل الفئات:", error);
    }
  };

  // 🟢 تحميل المنتجات
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("فشل في تحميل المنتجات");
      const data = await res.json();
      setProducts(data || []);
      setFilteredProducts(data || []);
    } catch (err) {
      console.error(err);
      setMessage("❌ حدث خطأ أثناء تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // 🟢 فلترة حسب الفئة والمخزون والبحث
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "الكل") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (stockFilter !== "الكل") {
      switch (stockFilter) {
        case "متوفر":
          filtered = filtered.filter((p) => (p.stock || 0) > 0);
          break;
        case "غير متوفر":
          filtered = filtered.filter((p) => (p.stock || 0) <= 0);
          break;
        case "محدود":
          filtered = filtered.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
          break;
        case "كثير":
          filtered = filtered.filter((p) => (p.stock || 0) > 10);
          break;
      }
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((p) => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, products, stockFilter, searchQuery]);

  // 🟢 تحديث الفورم
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'stock') {
      const stockValue = parseInt(value) || 0;
      setFormData({ ...formData, [name]: Math.max(0, stockValue) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🟢 رفع صور متعددة
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      setMessage(`⚠️ أنواع الملفات غير مدعومة: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setMessage(`⚠️ الملفات التالية أكبر من 10MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }
    
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    const allPreviews = [...imagePreviews, ...newPreviews];
    const allFiles = [...imageFiles, ...files];
    
    setImagePreviews(allPreviews);
    setImageFiles(allFiles);
    
    setMessage(`✅ تم إضافة ${files.length} صورة للرفع على Cloudinary`);
  };

  // 🔥 دالة رفع الصور إلى Cloudinary
  const uploadImagesToCloudinary = async () => {
    if (imageFiles.length === 0) return [];
    
    setShowUploadModal(true);
    setUploadStatus("جاري ضغط الصور...");
    setUploadProgress(10);
    
    try {
      const formDataToSend = new FormData();
      
      imageFiles.forEach((file) => {
        formDataToSend.append('images', file);
      });
      
      formDataToSend.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
      
      setUploadStatus("جاري رفع الصور إلى Cloudinary...");
      setUploadProgress(30);
      
      const uploadRes = await fetch("/api/upload-cloudinary", {
        method: "POST",
        body: formDataToSend,
      });
      
      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.message || `خطأ في الرفع: ${uploadRes.status}`);
      }
      
      const result = await uploadRes.json();
      
      let uploadedUrls = [];
      
      if (result && result.uploadedUrls && Array.isArray(result.uploadedUrls)) {
        uploadedUrls = result.uploadedUrls.map(item => {
          if (typeof item === 'string') {
            return item;
          } else if (item && typeof item === 'object') {
            const url = item.url || item.secure_url;
            if (url && url.startsWith('http')) {
              return url;
            }
          }
          return null;
        }).filter(url => url !== null);
      }
      
      setUploadProgress(80);
      setUploadStatus(`تم رفع ${uploadedUrls.length} صورة إلى Cloudinary`);
      setUploadProgress(100);
      
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadProgress(0);
        setUploadStatus("");
      }, 1500);
      
      return uploadedUrls;
      
    } catch (error) {
      console.error("❌ خطأ في رفع الصور إلى Cloudinary:", error);
      
      setUploadStatus(`❌ ${error.message || "فشل في رفع الصور إلى Cloudinary"}`);
      setUploadProgress(0);
      
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadStatus("");
      }, 3000);
      
      return [];
    }
  };

  // 🔥 حفظ المنتج
  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      setMessage("⚠️ أدخل الاسم والسعر");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      let finalCategory = formData.category;

      if (!formData.category && newCategory.trim() !== "") {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newCategory }),
        });
        
        if (!res.ok) throw new Error("فشل في إضافة الفئة");
        
        const added = await res.json();
        finalCategory = added.name;
        await fetchCategories();
      }

      let cloudinaryImageUrls = [];
      
      if (formData.images && Array.isArray(formData.images)) {
        cloudinaryImageUrls = formData.images.filter(url => 
          typeof url === 'string' && url.startsWith('http')
        );
      }
      
      if (imageFiles.length > 0) {
        try {
          const newImageUrls = await uploadImagesToCloudinary();
          
          if (Array.isArray(newImageUrls) && newImageUrls.length > 0) {
            cloudinaryImageUrls = [...cloudinaryImageUrls, ...newImageUrls];
          }
        } catch (uploadError) {
          console.error("❌ خطأ في رفع الصور إلى Cloudinary:", uploadError);
        }
      }

      const mainImageUrl = cloudinaryImageUrls[0] || formData.image_url || "";
      
      const allImages = cloudinaryImageUrls.length > 0 ? cloudinaryImageUrls : 
                       (Array.isArray(formData.images) ? formData.images : []);

      let finalStatus = formData.status;
      const currentStock = formData.stock || 0;
      if (currentStock <= 0 && formData.status === 'active') {
        finalStatus = 'out_of_stock';
      } else if (currentStock > 0 && formData.status === 'out_of_stock') {
        finalStatus = 'active';
      }

      const productData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
        price: Number(formData.price),
        number: formData.number ? Number(formData.number) : null,
        category: finalCategory || "أخرى",
        image_url: mainImageUrl,
        images: allImages,
        video: formData.video?.trim() || "",
        youtube: formData.youtube?.trim() || "",
        article: formData.article?.trim() || "",
        status: finalStatus,
        stock: currentStock,
        createdAt: formData.id ? formData.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const method = formData.id ? "PUT" : "POST";
      const url = "/api/products" + (formData.id ? `?id=${formData.id}` : "");
      
      const res = await fetch(url, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`فشل في الحفظ: ${errorText}`);
      }

      const savedProduct = await res.json();
      
      setMessage(formData.id ? "✅ تم تعديل المنتج بنجاح" : "✅ تم إضافة المنتج بنجاح");
      
      setTimeout(() => {
        setFormData({
          id: null,
          name: "",
          price: "",
          number: "",
          description: "",
          image_url: "",
          images: [],
          video: "",
          youtube: "",
          article: "",
          category: "",
          status: "active",
          stock: 0
        });
        setImageFiles([]);
        setImagePreviews([]);
        setNewCategory("");
        setMessage("");
      }, 3000);
      
      await fetchProducts();
      
    } catch (err) {
      console.error("💥 خطأ:", err);
      setMessage(`❌ ${err.message || "حدث خطأ أثناء الحفظ"}`);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 حذف المنتج مع خيارات
  const deleteProduct = async (id, productName = '') => {
    setDeletingProductId(id);
    
    const shouldDeleteImages = deleteMode === 'with-images';
    
    try {
      setLoading(true);
      setMessage(shouldDeleteImages ? 
        `🗑️ جاري حذف المنتج "${productName}" مع جميع الصور...` : 
        `🗑️ جاري حذف المنتج "${productName}" فقط...`
      );

      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id, 
          deleteImages: shouldDeleteImages 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "فشل في الحذف");
      }

      const result = await res.json();
      
      if (result.cloudinary) {
        const cloudinaryInfo = result.cloudinary;
        setMessage(
          `✅ ${result.message}\n` +
          `☁️ Cloudinary: ${cloudinaryInfo.successful}/${cloudinaryInfo.total} صورة تم حذفها`
        );
      } else {
        setMessage(result.message);
      }

      setTimeout(() => {
        fetchProducts();
      }, 1000);

    } catch (err) {
      console.error(err);
      setMessage(`❌ ${err.message || "حدث خطأ أثناء الحذف"}`);
    } finally {
      setLoading(false);
      setDeletingProductId(null);
    }
  };

  // 🔥 تأكيد الحذف مع خيارات
  const confirmDelete = (productId, productName) => {
    const deleteOptions = {
      'product-only': {
        title: 'حذف المنتج فقط',
        message: `سيتم حذف المنتج "${productName}" من قاعدة البيانات فقط.\nالصور ستظل موجودة في Cloudinary.`,
        icon: '🗄️'
      },
      'with-images': {
        title: 'حذف المنتج مع الصور',
        message: `سيتم حذف المنتج "${productName}" من قاعدة البيانات وجميع صوره من Cloudinary.\nهذا الإجراء لا يمكن التراجع عنه!`,
        icon: '☁️🗑️'
      }
    };
    
    const option = deleteOptions[deleteMode];
    
    if (window.confirm(
      `${option.icon} ${option.title}\n\n${option.message}\n\nهل أنت متأكد؟`
    )) {
      deleteProduct(productId, productName);
    }
  };

  // 🟢 حذف صورة من المعاينة
  const removeImage = (index) => {
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    
    setImagePreviews(updatedPreviews);
    setImageFiles(updatedFiles);
    
    URL.revokeObjectURL(imagePreviews[index]);
  };

  // 🟢 تعديل المنتج
  const editProduct = (p) => {
    let productImages = [];
    
    if (p.image_url && p.image_url.startsWith('http')) {
      productImages.push(p.image_url);
    }
    
    if (p.images && Array.isArray(p.images)) {
      const additionalImages = p.images.filter(url => 
        typeof url === 'string' && url.startsWith('http') && url !== p.image_url
      );
      productImages = [...productImages, ...additionalImages];
    }
    
    setFormData({
      ...p,
      category: p.category || "",
      number: p.number || "",
      image_url: p.image_url || "",
      images: productImages,
      stock: p.stock || 0,
      status: p.status || "active"
    });
    
    setImagePreviews(productImages);
    setImageFiles([]);
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔥 تحديث المخزون
  const updateStock = async (productId, newStock) => {
    try {
      const stockValue = parseInt(newStock) || 0;
      
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          stock: stockValue,
          status: stockValue <= 0 ? 'out_of_stock' : 'active',
          updatedAt: new Date().toISOString()
        }),
      });

      if (!res.ok) throw new Error("فشل في تحديث المخزون");
      
      await fetchProducts();
      setMessage("✅ تم تحديث المخزون بنجاح");
      
    } catch (err) {
      console.error(err);
      setMessage("❌ حدث خطأ أثناء تحديث المخزون");
    }
  };

  // 🔥 زيادة أو نقصان المخزون
  const adjustStock = (productId, currentStock, adjustment) => {
    const newStock = Math.max(0, (currentStock || 0) + adjustment);
    updateStock(productId, newStock);
  };

  // 🔥 حذف جميع الصور المرفوعة
  const clearAllImages = () => {
    imagePreviews.forEach(url => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setImageFiles([]);
  };

  return (
    <Container className="py-5">
      {/* 🔥 العنوان والإحصائيات */}
      <div className="text-center mb-5">
        <h1 className="fw-bold mb-3">🛍️ لوحة إدارة المتجر</h1>
        <p className="text-muted">
          نظام متكامل لإدارة المنتجات مع تخزين الصور على Cloudinary والبيانات على Supabase
        </p>
        
        <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
          <Badge bg="primary" className="px-3 py-2 fs-6">
            ☁️ Cloudinary للصور
          </Badge>
          <Badge bg="success" className="px-3 py-2 fs-6">
            🗄️ Supabase للبيانات
          </Badge>
          <Badge bg="info" className="px-3 py-2 fs-6">
            ⚡ إدارة المخزون المباشرة
          </Badge>
        </div>
      </div>

      {/* 🔥 رسائل النظام */}
      {message && (
        <Alert 
          variant={message.includes("✅") ? "success" : "danger"} 
          onClose={() => setMessage("")} 
          dismissible
          className="mb-4"
        >
          <div className="d-flex align-items-center">
            {message.includes("✅") ? "✅" : "❌"}
            <span className="me-2" style={{ whiteSpace: 'pre-line' }}>{message}</span>
          </div>
        </Alert>
      )}

      {/* 🔹 مودال عرض حالة الرفع */}
      <Modal show={showUploadModal} onHide={() => {}} centered backdrop="static">
        <Modal.Header className="bg-primary text-white">
          <Modal.Title>📤 رفع الصور إلى Cloudinary</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center p-4">
            <div className="mb-4">
              <div className="position-relative d-inline-block">
                <Spinner animation="border" variant="primary" style={{ width: '80px', height: '80px' }} />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <span className="fs-4">☁️</span>
                </div>
              </div>
            </div>
            <h4 className="mb-3">{uploadStatus}</h4>
            <ProgressBar 
              now={uploadProgress} 
              label={`${uploadProgress}%`}
              animated 
              striped 
              variant="success"
              className="mb-3"
              style={{ height: '20px' }}
            />
          </div>
        </Modal.Body>
      </Modal>

      {/* 🔥 إعدادات الحذف */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-2">⚙️ إعدادات الحذف</h6>
              <p className="text-muted small mb-0">
                اختر طريقة الحذف الافتراضية للمنتجات
              </p>
            </div>
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" id="dropdown-delete-mode">
                {deleteMode === 'product-only' ? '🗄️ حذف المنتج فقط' : '☁️🗑️ حذف مع الصور'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item 
                  onClick={() => setDeleteMode('product-only')}
                  active={deleteMode === 'product-only'}
                >
                  🗄️ حذف المنتج فقط (الصور تبقى في Cloudinary)
                </Dropdown.Item>
                <Dropdown.Item 
                  onClick={() => setDeleteMode('with-images')}
                  active={deleteMode === 'with-images'}
                >
                  ☁️🗑️ حذف المنتج مع جميع الصور
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          
          <Alert variant={deleteMode === 'with-images' ? 'warning' : 'info'} className="mt-3">
            {deleteMode === 'product-only' ? (
              <>
                <strong>🗄️ وضع حذف المنتج فقط:</strong><br />
                • المنتج يحذف من قاعدة البيانات فقط<br />
                • الصور تبقى في Cloudinary (تستهلك مساحة)<br />
                • يمكنك تنظيف الصور اليتيمة لاحقاً
              </>
            ) : (
              <>
                <strong>☁️🗑️ وضع حذف المنتج مع الصور:</strong><br />
                • المنتج يحذف من قاعدة البيانات<br />
                • جميع صور المنتج تحذف من Cloudinary<br />
                • ⚠️ هذا الإجراء لا يمكن التراجع عنه!
              </>
            )}
          </Alert>
        </Card.Body>
      </Card>

      {/* 🔥 نموذج إضافة/تعديل المنتج */}
      <Card className="shadow-lg border-0 mb-5">
        <Card.Header className="bg-gradient-primary text-white py-3">
          <h4 className="mb-0">
            {formData.id ? "✏️ تعديل المنتج" : "➕ إضافة منتج جديد"}
          </h4>
        </Card.Header>
        <Card.Body className="p-4">
          <Form>
            <Row className="g-4">
              {/* 🔹 المعلومات الأساسية */}
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold text-primary">
                    اسم المنتج *
                  </Form.Label>
                  <Form.Control
                    placeholder="أدخل اسم المنتج"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-primary"
                  />
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label className="fw-bold text-primary">
                    السعر *
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number"
                      placeholder="السعر"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="border-primary"
                    />
                    <InputGroup.Text className="bg-primary text-white">
                      ج.م
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={2}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    الرقم
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="رقم المنتج"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    className="border-secondary"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    الفئة
                  </Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "new") {
                          setFormData({ ...formData, category: "" });
                        } else {
                          setFormData({ ...formData, category: value });
                        }
                      }}
                      className="border-primary"
                    >
                      <option value="">اختر الفئة</option>
                      {categories.map((cat) => (
                        <option key={cat.id || cat} value={cat.name || cat}>
                          {cat.name || cat}
                        </option>
                      ))}
                      <option value="new">+ إضافة فئة جديدة</option>
                    </Form.Select>
                    
                    {formData.category === "" && (
                      <Form.Control
                        type="text"
                        placeholder="فئة جديدة"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="border-success"
                      />
                    )}
                  </div>
                </Form.Group>
              </Col>

              {/* 🔹 المخزون والحالة */}
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-bold d-flex justify-content-between">
                    <span>المخزون</span>
                    <Badge 
                      bg={formData.stock <= 0 ? "danger" : formData.stock <= 10 ? "warning" : "success"}
                      className="fs-7"
                    >
                      {formData.stock <= 0 ? "🔴" : formData.stock <= 10 ? "🟡" : "🟢"}
                    </Badge>
                  </Form.Label>
                  <InputGroup>
                    <Button 
                      variant="outline-secondary"
                      onClick={() => handleChange({ target: { name: 'stock', value: Math.max(0, (formData.stock || 0) - 1) } })}
                    >
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="text-center fw-bold"
                    />
                    <Button 
                      variant="outline-secondary"
                      onClick={() => handleChange({ target: { name: 'stock', value: (formData.stock || 0) + 1 } })}
                    >
                      +
                    </Button>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    الحالة
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={(e) => {
                      const newStatus = e.target.value;
                      setFormData({ 
                        ...formData, 
                        status: newStatus,
                        stock: newStatus === 'out_of_stock' ? 0 : formData.stock
                      });
                    }}
                    className="border-primary"
                  >
                    <option value="active">🟢 متاح</option>
                    <option value="out_of_stock">🔴 غير متوفر</option>
                    <option value="coming_soon">🟡 قريباً</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    الوصف القصير
                  </Form.Label>
                  <Form.Control
                    placeholder="وصف مختصر للمنتج"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border-secondary"
                  />
                </Form.Group>
              </Col>

              {/* 🔹 المحتوى الإضافي */}
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    الوصف التفصيلي
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="وصف تفصيلي للمنتج"
                    name="article"
                    value={formData.article}
                    onChange={handleChange}
                    className="border-secondary"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    رابط يوتيوب
                  </Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="https://youtube.com/..."
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    className="border-secondary"
                  />
                </Form.Group>
              </Col>

              {/* 🔹 رفع الصور */}
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-bold d-flex justify-content-between align-items-center">
                    <span>
                      صور المنتج 
                      <Badge bg="primary" className="ms-2">
                        ☁️ Cloudinary
                      </Badge>
                    </span>
                    <span className="text-muted fs-6">
                      {imageFiles.length} صورة جاهزة للرفع
                    </span>
                  </Form.Label>
                  
                  <Card className="border border-primary">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="d-flex gap-2">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => document.getElementById('image-upload').click()}
                            className="d-flex align-items-center gap-1"
                          >
                            <span>☁️</span>
                            اختر صور للرفع
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={fetchProducts}
                            disabled={loading}
                          >
                            🔄 تحديث
                          </Button>
                        </div>
                        
                        {imageFiles.length > 0 && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={clearAllImages}
                          >
                            🗑️ مسح الكل
                          </Button>
                        )}
                      </div>
                      
                      <Form.Control
                        id="image-upload"
                        type="file"
                        accept="image/jpeg, image/jpg, image/png, image/webp"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      
                      {/* معاينة الصور */}
                      {imagePreviews.length > 0 && (
                        <div className="mt-4">
                          <h6 className="mb-3">
                            معاينة الصور (سترفع على Cloudinary):
                            <Badge bg="info" className="ms-2">
                              {imagePreviews.length} صورة
                            </Badge>
                          </h6>
                          <div className="row g-3">
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="col-6 col-md-3 col-lg-2">
                                <Card className="border">
                                  <Card.Body className="p-2">
                                    <div className="position-relative">
                                      <img 
                                        src={preview} 
                                        alt={`Preview ${index + 1}`}
                                        className="img-fluid rounded"
                                        style={{ 
                                          height: '100px',
                                          width: '100%',
                                          objectFit: 'cover'
                                        }}
                                      />
                                      <Badge 
                                        bg="primary" 
                                        className="position-absolute top-0 start-0 m-1"
                                      >
                                        {index + 1}
                                      </Badge>
                                      <Button
                                        variant="danger"
                                        size="sm"
                                        className="position-absolute top-0 end-0 m-1"
                                        style={{ width: '24px', height: '24px', padding: 0 }}
                                        onClick={() => removeImage(index)}
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Alert variant="info" className="mt-4">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <span className="fs-4">ℹ️</span>
                          </div>
                          <div>
                            <h6 className="mb-1">معلومات النظام:</h6>
                            <p className="mb-0 small">
                              • الصور ترفع على <strong className="text-primary">Cloudinary</strong> فقط ☁️<br />
                              • البيانات تخزن في <strong className="text-success">Supabase</strong> 🗄️<br />
                              • يمكنك اختيار حذف الصور من Cloudinary عند حذف المنتج
                            </p>
                          </div>
                        </div>
                      </Alert>
                    </Card.Body>
                  </Card>
                </Form.Group>
              </Col>

              {/* 🔹 أزرار الإجراءات */}
              <Col md={12}>
                <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
                  {formData.id && (
                    <Button
                      variant="outline-secondary"
                      onClick={() => {
                        setFormData({
                          id: null,
                          name: "",
                          price: "",
                          number: "",
                          description: "",
                          image_url: "",
                          images: [],
                          video: "",
                          youtube: "",
                          article: "",
                          category: "",
                          status: "active",
                          stock: 0
                        });
                        clearAllImages();
                        setNewCategory("");
                      }}
                      className="px-4"
                    >
                      إلغاء التعديل
                    </Button>
                  )}
                  <Button
                    variant={formData.id ? "warning" : "success"}
                    size="lg"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-5"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        جاري الحفظ...
                      </>
                    ) : formData.id ? (
                      <>
                        ✏️ حفظ التعديلات
                      </>
                    ) : (
                      <>
                        ☁️ رفع الصور + إضافة المنتج
                      </>
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* 🔥 أدوات الفلترة والبحث */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3} className="mb-2">
              <Form.Group>
                <Form.Label>البحث:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ابحث باسم أو وصف أو فئة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-primary"
                />
              </Form.Group>
            </Col>
            
            <Col md={3} className="mb-2">
              <Form.Group>
                <Form.Label>الفئة:</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border-primary"
                >
                  <option value="الكل">📂 جميع الفئات</option>
                  {categories.map((cat) => (
                    <option key={cat.id || cat} value={cat.name || cat}>
                      {cat.name || cat}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3} className="mb-2">
              <Form.Group>
                <Form.Label>المخزون:</Form.Label>
                <Form.Select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="border-primary"
                >
                  <option value="الكل">📊 جميع المخزون</option>
                  <option value="متوفر">🟢 متوفر</option>
                  <option value="غير متوفر">🔴 غير متوفر</option>
                  <option value="محدود">🟡 محدود (أقل من 10)</option>
                  <option value="كثير">🟢 كثير (أكثر من 10)</option>
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={3} className="text-md-end">
              <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-end">
                <Badge bg="dark" className="fs-6 p-2">
                  المنتجات: {filteredProducts.length}
                </Badge>
                <Badge bg="success" className="fs-6 p-2">
                  المخزون: {filteredProducts.reduce((sum, p) => sum + (p.stock || 0), 0)}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 🔥 جدول المنتجات */}
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-dark text-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📋 قائمة المنتجات</h5>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={fetchProducts}
                disabled={loading}
              >
                🔄 تحديث القائمة
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" size="lg" />
              <p className="mt-3">جارٍ تحميل المنتجات...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <span className="display-1">📭</span>
              </div>
              <h4>لا توجد منتجات</h4>
              <p className="text-muted mb-4">
                {searchQuery || selectedCategory !== "الكل" || stockFilter !== "الكل" 
                  ? "لم يتم العثور على منتجات تطابق معايير البحث"
                  : "لم يتم إضافة أي منتجات بعد"}
              </p>
              <div className="d-flex justify-content-center gap-2">
                <Button 
                  variant="primary" 
                  onClick={() => {
                    setSelectedCategory("الكل");
                    setStockFilter("الكل");
                    setSearchQuery("");
                  }}
                >
                  عرض جميع المنتجات
                </Button>
                <Button 
                  variant="success" 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  ➕ إضافة منتج جديد
                </Button>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th width="100">الصور</th>
                    <th>الاسم</th>
                    <th width="120">السعر</th>
                    <th width="100">الرقم</th>
                    <th width="150">الفئة</th>
                    <th width="150">المخزون</th>
                    <th width="120">الحالة</th>
                    <th width="220" className="text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    let productImages = [];
                    
                    if (p.image_url && p.image_url.startsWith('http')) {
                      productImages.push(p.image_url);
                    }
                    
                    if (p.images && Array.isArray(p.images)) {
                      const additionalImages = p.images.filter(url => 
                        typeof url === 'string' && url.startsWith('http') && url !== p.image_url
                      );
                      productImages = [...productImages, ...additionalImages];
                    }
                    
                    return (
                      <tr key={p.id} className="align-middle">
                        <td>
                          <div className="position-relative">
                            <img
                              src={productImages[0] || "https://via.placeholder.com/80?text=No+Image"}
                              alt={p.name}
                              className="rounded border"
                              style={{ 
                                width: "80px", 
                                height: "80px", 
                                objectFit: "cover" 
                              }}
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/80?text=Error";
                              }}
                            />
                            {productImages.length > 1 && (
                              <Badge 
                                bg="primary" 
                                className="position-absolute top-0 end-0 translate-middle"
                                title={`${productImages.length} صور`}
                              >
                                ☁️ +{productImages.length - 1}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong>{p.name}</strong>
                            {p.description && (
                              <p className="text-muted small mb-0 mt-1">
                                {p.description.slice(0, 60)}...
                              </p>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="fw-bold text-success">
                            {parseFloat(p.price || 0).toFixed(2)} ج.م
                          </span>
                        </td>
                        <td>
                          {p.number ? (
                            <Badge bg="secondary" className="fs-6">
                              #{p.number}
                            </Badge>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td>
                          <Badge bg="outline-primary" className="border text-dark">
                            {p.category || "—"}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <InputGroup size="sm" style={{ width: '120px' }}>
                              <Button 
                                variant="outline-secondary"
                                onClick={() => adjustStock(p.id, p.stock || 0, -1)}
                                disabled={loading}
                              >
                                -
                              </Button>
                              <Form.Control
                                type="number"
                                value={p.stock || 0}
                                onChange={(e) => updateStock(p.id, e.target.value)}
                                className="text-center fw-bold"
                                disabled={loading}
                              />
                              <Button 
                                variant="outline-secondary"
                                onClick={() => adjustStock(p.id, p.stock || 0, 1)}
                                disabled={loading}
                              >
                                +
                              </Button>
                            </InputGroup>
                            <div className={`px-2 py-1 rounded ms-2 fw-bold ${getStockBadgeColor(p.stock || 0)}`}>
                              {p.stock || 0}
                            </div>
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(p.status || 'active', p.stock || 0)}
                        </td>
                        <td className="text-center">
                          <div className="btn-group" role="group">
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => editProduct(p)}
                              title="تعديل"
                              disabled={loading || deletingProductId === p.id}
                            >
                              ✏️
                            </Button>
                            <Button
                              variant="outline-info"
                              size="sm"
                              href={`/store/${p.id}`}
                              target="_blank"
                              title="عرض"
                              disabled={loading}
                            >
                              👁️
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => adjustStock(p.id, p.stock || 0, 10)}
                              title="إضافة 10"
                              disabled={loading || deletingProductId === p.id}
                            >
                              +10
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => confirmDelete(p.id, p.name)}
                              title="حذف"
                              disabled={loading || deletingProductId === p.id}
                            >
                              {deletingProductId === p.id ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                '🗑️'
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* 🔥 إحصائيات المخزون */}
      <Row className="mt-4 g-3">
        <Col md={3}>
          <Card className="bg-success text-white border-0 shadow">
            <Card.Body className="text-center">
              <h5>🟢 متوفر</h5>
              <h2 className="my-3">
                {filteredProducts.filter(p => (p.stock || 0) > 0).length}
              </h2>
              <small>منتج</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="bg-danger text-white border-0 shadow">
            <Card.Body className="text-center">
              <h5>🔴 غير متوفر</h5>
              <h2 className="my-3">
                {filteredProducts.filter(p => (p.stock || 0) <= 0).length}
              </h2>
              <small>منتج</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="bg-warning text-dark border-0 shadow">
            <Card.Body className="text-center">
              <h5>🟡 محدود</h5>
              <h2 className="my-3">
                {filteredProducts.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length}
              </h2>
              <small>منتج</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="bg-info text-white border-0 shadow">
            <Card.Body className="text-center">
              <h5>
                <span className="me-2">☁️</span>
                صور Cloudinary
              </h5>
              <h2 className="my-3">
                {filteredProducts.filter(p => p.image_url).length}
              </h2>
              <small>منتج له صور</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 🔥 معلومات النظام */}
      <Card className="mt-4 border-0 shadow-sm">
        <Card.Body className="bg-light">
          <div className="text-center">
            <h6 className="mb-3">معلومات النظام</h6>
            <div className="d-flex flex-wrap justify-content-center gap-4">
              <div>
                <Badge bg="primary" className="p-2">
                  ☁️ Cloudinary
                </Badge>
                <p className="small mt-1 mb-0">تخزين الصور</p>
              </div>
              <div>
                <Badge bg="success" className="p-2">
                  🗄️ Supabase
                </Badge>
                <p className="small mt-1 mb-0">تخزين البيانات</p>
              </div>
              <div>
                <Badge bg="warning" className="p-2">
                  ⚠️ حذف ذكي
                </Badge>
                <p className="small mt-1 mb-0">حذف الصور مع المنتج</p>
              </div>
            </div>
          </div>
        </Card.Body>
        <Card.Footer className="text-center text-muted">
          <small>
            نظام إدارة المنتجات المتكامل | إصدار 2.0 | حذف ذكي للصور | {new Date().getFullYear()}
          </small>
        </Card.Footer>
      </Card>
    </Container>
  );
}
   




// "use client";

// import { createClient } from '@supabase/supabase-js';
// import { useState, useEffect } from "react";
// import {
//   Container,
//   Table,
//   Button,
//   Form,
//   Row,
//   Col,
//   Spinner,
//   Alert,
//   Modal,
//   ProgressBar,
//   Badge,
//   InputGroup,
//   Card
// } from "react-bootstrap";

// // تكوين Supabase
// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// );

// // 🔥 دالة مساعدة لتحديد لون الـ stock
// const getStockBadgeColor = (stock) => {
//   if (stock <= 0) return 'bg-danger text-white';
//   if (stock <= 10) return 'bg-warning text-dark';
//   return 'bg-success text-white';
// };

// // 🔥 دالة مساعدة لعرض حالة المنتج
// const getStatusBadge = (status, stock) => {
//   if (status === 'active') {
//     return stock <= 0 
//       ? <Badge bg="warning" text="dark">🟡 غير متوفر</Badge>
//       : <Badge bg="success">🟢 متاح</Badge>;
//   }
//   if (status === 'out_of_stock') {
//     return <Badge bg="danger">🔴 غير متوفر</Badge>;
//   }
//   if (status === 'coming_soon') {
//     return <Badge bg="info">🟡 قريباً</Badge>;
//   }
//   return <Badge bg="secondary">—</Badge>;
// };

// export default function DashboardProducts() {
//   const [products, setProducts] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("الكل");
//   const [formData, setFormData] = useState({
//     id: null,
//     name: "",
//     price: "",
//     number: "",
//     description: "",
//     image_url: "", // رابط الصورة الرئيسية من Cloudinary
//     images: [], // مصفوفة الصور الإضافية من Cloudinary
//     video: "",
//     youtube: "",
//     article: "",
//     category: "",
//     status: "active",
//     stock: 0
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [imageFiles, setImageFiles] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [newCategory, setNewCategory] = useState("");
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [showUploadModal, setShowUploadModal] = useState(false);
//   const [stockFilter, setStockFilter] = useState("الكل");
//   const [searchQuery, setSearchQuery] = useState("");

//   // 🟢 تحميل الفئات
//   const fetchCategories = async () => {
//     try {
//       const res = await fetch("/api/categories");
//       const data = await res.json();
//       setCategories(data || []);
//     } catch (error) {
//       console.error("خطأ في تحميل الفئات:", error);
//     }
//   };

//   // 🟢 تحميل المنتجات
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("/api/products");
//       if (!res.ok) throw new Error("فشل في تحميل المنتجات");
//       const data = await res.json();
//       setProducts(data || []);
//       setFilteredProducts(data || []);
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ حدث خطأ أثناء تحميل المنتجات");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//   }, []);

//   // 🟢 فلترة حسب الفئة والمخزون والبحث
//   useEffect(() => {
//     let filtered = products;

//     // الفلترة حسب الفئة
//     if (selectedCategory !== "الكل") {
//       filtered = filtered.filter((p) => p.category === selectedCategory);
//     }

//     // الفلترة حسب المخزون
//     if (stockFilter !== "الكل") {
//       switch (stockFilter) {
//         case "متوفر":
//           filtered = filtered.filter((p) => (p.stock || 0) > 0);
//           break;
//         case "غير متوفر":
//           filtered = filtered.filter((p) => (p.stock || 0) <= 0);
//           break;
//         case "محدود":
//           filtered = filtered.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
//           break;
//         case "كثير":
//           filtered = filtered.filter((p) => (p.stock || 0) > 10);
//           break;
//       }
//     }

//     // البحث حسب الاسم
//     if (searchQuery.trim() !== "") {
//       filtered = filtered.filter((p) => 
//         p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         p.category?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredProducts(filtered);
//   }, [selectedCategory, products, stockFilter, searchQuery]);

//   // 🟢 تحديث الفورم
//   const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === 'stock') {
//       const stockValue = parseInt(value) || 0;
//       setFormData({ ...formData, [name]: Math.max(0, stockValue) });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   // 🟢 رفع صور متعددة
//   const handleImageUpload = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;
    
//     // التحقق من أنواع الملفات المسموحة
//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//     const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
//     if (invalidFiles.length > 0) {
//       setMessage(`⚠️ أنواع الملفات غير مدعومة: ${invalidFiles.map(f => f.name).join(', ')}`);
//       return;
//     }
    
//     // التحقق من حجم الملفات (10MB)
//     const maxSize = 10 * 1024 * 1024;
//     const oversizedFiles = files.filter(file => file.size > maxSize);
    
//     if (oversizedFiles.length > 0) {
//       setMessage(`⚠️ الملفات التالية أكبر من 10MB: ${oversizedFiles.map(f => f.name).join(', ')}`);
//       return;
//     }
    
//     // إنشاء معاينات للصور
//     const newPreviews = files.map((file) => URL.createObjectURL(file));
//     const allPreviews = [...imagePreviews, ...newPreviews];
//     const allFiles = [...imageFiles, ...files];
    
//     setImagePreviews(allPreviews);
//     setImageFiles(allFiles);
    
//     setMessage(`✅ تم إضافة ${files.length} صورة للرفع على Cloudinary`);
//   };

//   // 🔥 دالة رفع الصور إلى Cloudinary
//   const uploadImagesToCloudinary = async () => {
//     if (imageFiles.length === 0) return [];
    
//     setShowUploadModal(true);
//     setUploadStatus("جاري ضغط الصور...");
//     setUploadProgress(10);
    
//     try {
//       const formDataToSend = new FormData();
      
//       imageFiles.forEach((file) => {
//         formDataToSend.append('images', file);
//       });
      
//       // ⚠️ إضافة upload_preset
//       formDataToSend.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
      
//       setUploadStatus("جاري رفع الصور إلى Cloudinary...");
//       setUploadProgress(30);
      
//       // استخدام API route لرفع الصور إلى Cloudinary
//       const uploadRes = await fetch("/api/upload-cloudinary", {
//         method: "POST",
//         body: formDataToSend,
//       });
      
//       if (!uploadRes.ok) {
//         const errorData = await uploadRes.json();
//         throw new Error(errorData.message || `خطأ في الرفع: ${uploadRes.status}`);
//       }
      
//       const result = await uploadRes.json();
//       console.log("📥 استجابة Cloudinary:", result);
      
//       let uploadedUrls = [];
      
//       if (result && result.uploadedUrls && Array.isArray(result.uploadedUrls)) {
//         uploadedUrls = result.uploadedUrls.map(item => {
//           if (typeof item === 'string') {
//             return item;
//           } else if (item && typeof item === 'object') {
//             const url = item.url || item.secure_url;
//             if (url && url.startsWith('http')) {
//               return url;
//             }
//           }
//           return null;
//         }).filter(url => url !== null);
//       }
      
//       console.log("🔗 روابط Cloudinary:", uploadedUrls);
      
//       setUploadProgress(80);
//       setUploadStatus(`تم رفع ${uploadedUrls.length} صورة إلى Cloudinary`);
//       setUploadProgress(100);
      
//       setTimeout(() => {
//         setShowUploadModal(false);
//         setUploadProgress(0);
//         setUploadStatus("");
//       }, 1500);
      
//       return uploadedUrls;
      
//     } catch (error) {
//       console.error("❌ خطأ في رفع الصور إلى Cloudinary:", error);
      
//       setUploadStatus(`❌ ${error.message || "فشل في رفع الصور إلى Cloudinary"}`);
//       setUploadProgress(0);
      
//       setTimeout(() => {
//         setShowUploadModal(false);
//         setUploadStatus("");
//       }, 3000);
      
//       return [];
//     }
//   };

//   // 🔥 حفظ المنتج
//   const handleSubmit = async () => {
//     if (!formData.name || !formData.price) {
//       setMessage("⚠️ أدخل الاسم والسعر");
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage("");

//       let finalCategory = formData.category;

//       // إضافة فئة جديدة إلى Supabase
//       if (!formData.category && newCategory.trim() !== "") {
//         const res = await fetch("/api/categories", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name: newCategory }),
//         });
        
//         if (!res.ok) throw new Error("فشل في إضافة الفئة");
        
//         const added = await res.json();
//         finalCategory = added.name;
//         await fetchCategories();
//       }

//       // 🔥 1. رفع الصور إلى Cloudinary (إذا كان هناك صور جديدة)
//       let cloudinaryImageUrls = [];
      
//       // معالجة الصور الحالية
//       if (formData.images && Array.isArray(formData.images)) {
//         cloudinaryImageUrls = formData.images.filter(url => 
//           typeof url === 'string' && url.startsWith('http')
//         );
//       }
      
//       // رفع الصور الجديدة إلى Cloudinary
//       if (imageFiles.length > 0) {
//         try {
//           const newImageUrls = await uploadImagesToCloudinary();
          
//           if (Array.isArray(newImageUrls) && newImageUrls.length > 0) {
//             cloudinaryImageUrls = [...cloudinaryImageUrls, ...newImageUrls];
//             console.log('🖼️ روابط Cloudinary بعد الرفع:', cloudinaryImageUrls);
//           }
//         } catch (uploadError) {
//           console.error("❌ خطأ في رفع الصور إلى Cloudinary:", uploadError);
//           // نستمر في الحفظ حتى لو فشل رفع الصور
//         }
//       }

//       // الصورة الرئيسية (الأولى)
//       const mainImageUrl = cloudinaryImageUrls[0] || formData.image_url || "";
      
//       // جميع الصور
//       const allImages = cloudinaryImageUrls.length > 0 ? cloudinaryImageUrls : 
//                        (Array.isArray(formData.images) ? formData.images : []);

//       // تحديث حالة المنتج بناءً على المخزون
//       let finalStatus = formData.status;
//       const currentStock = formData.stock || 0;
//       if (currentStock <= 0 && formData.status === 'active') {
//         finalStatus = 'out_of_stock';
//       } else if (currentStock > 0 && formData.status === 'out_of_stock') {
//         finalStatus = 'active';
//       }

//       // 🔥 2. حفظ بيانات المنتج في Supabase
//       const productData = {
//         ...formData,
//         name: formData.name.trim(),
//         description: formData.description?.trim() || "",
//         price: Number(formData.price),
//         number: formData.number ? Number(formData.number) : null,
//         category: finalCategory || "أخرى",
//         image_url: mainImageUrl, // رابط الصورة الرئيسية من Cloudinary
//         images: allImages, // جميع الصور من Cloudinary
//         video: formData.video?.trim() || "",
//         youtube: formData.youtube?.trim() || "",
//         article: formData.article?.trim() || "",
//         status: finalStatus,
//         stock: currentStock,
//         createdAt: formData.id ? formData.createdAt : new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//       };
      
//       console.log('📦 بيانات المنتج للرفع إلى Supabase:', productData);

//       // إرسال البيانات إلى Supabase
//       const method = formData.id ? "PUT" : "POST";
//       const url = "/api/products" + (formData.id ? `?id=${formData.id}` : "");
      
//       const res = await fetch(url, {
//         method: method,
//         headers: { 
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(productData),
//       });

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`فشل في الحفظ: ${errorText}`);
//       }

//       const savedProduct = await res.json();
      
//       setMessage(formData.id ? "✅ تم تعديل المنتج بنجاح" : "✅ تم إضافة المنتج بنجاح");
      
//       // إعادة تعيين النموذج
//       setTimeout(() => {
//         setFormData({
//           id: null,
//           name: "",
//           price: "",
//           number: "",
//           description: "",
//           image_url: "",
//           images: [],
//           video: "",
//           youtube: "",
//           article: "",
//           category: "",
//           status: "active",
//           stock: 0
//         });
//         setImageFiles([]);
//         setImagePreviews([]);
//         setNewCategory("");
//         setMessage("");
//       }, 3000);
      
//       await fetchProducts();
      
//     } catch (err) {
//       console.error("💥 خطأ:", err);
//       setMessage(`❌ ${err.message || "حدث خطأ أثناء الحفظ"}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 حذف المنتج
//   const deleteProduct = async (id) => {
//     if (!confirm("هل أنت متأكد من حذف المنتج؟")) return;
//     try {
//       setLoading(true);
//       const res = await fetch("/api/products", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       if (!res.ok) throw new Error("فشل في الحذف");
//       setMessage("🗑️ تم حذف المنتج");
//       await fetchProducts();
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ حدث خطأ أثناء الحذف");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🟢 حذف صورة من المعاينة
//   const removeImage = (index) => {
//     const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
//     const updatedFiles = imageFiles.filter((_, i) => i !== index);
    
//     setImagePreviews(updatedPreviews);
//     setImageFiles(updatedFiles);
    
//     URL.revokeObjectURL(imagePreviews[index]);
//   };

//   // 🟢 تعديل المنتج
//   const editProduct = (p) => {
//     // استخراج الصور من المنتج
//     let productImages = [];
    
//     if (p.image_url && p.image_url.startsWith('http')) {
//       productImages.push(p.image_url);
//     }
    
//     if (p.images && Array.isArray(p.images)) {
//       const additionalImages = p.images.filter(url => 
//         typeof url === 'string' && url.startsWith('http') && url !== p.image_url
//       );
//       productImages = [...productImages, ...additionalImages];
//     }
    
//     console.log('✏️ تحرير المنتج:', p);
//     console.log('🖼️ الصور من Cloudinary:', productImages);
    
//     setFormData({
//       ...p,
//       category: p.category || "",
//       number: p.number || "",
//       image_url: p.image_url || "",
//       images: productImages,
//       stock: p.stock || 0,
//       status: p.status || "active"
//     });
    
//     setImagePreviews(productImages);
//     setImageFiles([]);
    
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // 🔥 تحديث المخزون
//   const updateStock = async (productId, newStock) => {
//     try {
//       const stockValue = parseInt(newStock) || 0;
      
//       const res = await fetch("/api/products", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: productId,
//           stock: stockValue,
//           status: stockValue <= 0 ? 'out_of_stock' : 'active',
//           updatedAt: new Date().toISOString()
//         }),
//       });

//       if (!res.ok) throw new Error("فشل في تحديث المخزون");
      
//       await fetchProducts();
//       setMessage("✅ تم تحديث المخزون بنجاح");
      
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ حدث خطأ أثناء تحديث المخزون");
//     }
//   };

//   // 🔥 زيادة أو نقصان المخزون
//   const adjustStock = (productId, currentStock, adjustment) => {
//     const newStock = Math.max(0, (currentStock || 0) + adjustment);
//     updateStock(productId, newStock);
//   };

//   // 🔥 حذف جميع الصور المرفوعة
//   const clearAllImages = () => {
//     imagePreviews.forEach(url => URL.revokeObjectURL(url));
//     setImagePreviews([]);
//     setImageFiles([]);
//   };

//   return (
//     <Container className="py-5">
//       {/* 🔥 العنوان والإحصائيات */}
//       <div className="text-center mb-5">
//         <h1 className="fw-bold mb-3">🛍️ لوحة إدارة المتجر</h1>
//         <p className="text-muted">
//           نظام متكامل لإدارة المنتجات مع تخزين الصور على Cloudinary والبيانات على Supabase
//         </p>
        
//         <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
//           <Badge bg="primary" className="px-3 py-2 fs-6">
//             ☁️ Cloudinary للصور
//           </Badge>
//           <Badge bg="success" className="px-3 py-2 fs-6">
//             🗄️ Supabase للبيانات
//           </Badge>
//           <Badge bg="info" className="px-3 py-2 fs-6">
//             ⚡ إدارة المخزون المباشرة
//           </Badge>
//         </div>
//       </div>

//       {/* 🔥 رسائل النظام */}
//       {message && (
//         <Alert 
//           variant={message.includes("✅") ? "success" : "danger"} 
//           onClose={() => setMessage("")} 
//           dismissible
//           className="mb-4"
//         >
//           <div className="d-flex align-items-center">
//             {message.includes("✅") ? "✅" : "❌"}
//             <span className="me-2">{message}</span>
//           </div>
//         </Alert>
//       )}

//       {/* 🔹 مودال عرض حالة الرفع */}
//       <Modal show={showUploadModal} onHide={() => {}} centered backdrop="static">
//         <Modal.Header className="bg-primary text-white">
//           <Modal.Title>📤 رفع الصور إلى Cloudinary</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="text-center p-4">
//             <div className="mb-4">
//               <div className="position-relative d-inline-block">
//                 <Spinner animation="border" variant="primary" style={{ width: '80px', height: '80px' }} />
//                 <div className="position-absolute top-50 start-50 translate-middle">
//                   <span className="fs-4">☁️</span>
//                 </div>
//               </div>
//             </div>
//             <h4 className="mb-3">{uploadStatus}</h4>
//             <ProgressBar 
//               now={uploadProgress} 
//               label={`${uploadProgress}%`}
//               animated 
//               striped 
//               variant="success"
//               className="mb-3"
//               style={{ height: '20px' }}
//             />
//             <div className="mt-4">
//               <small className="text-muted">
//                 <div className="d-flex justify-content-center align-items-center gap-2">
//                   <span className="text-primary">☁️ Cloudinary</span>
//                   <span>←</span>
//                   <span className="text-success">📦 Supabase</span>
//                 </div>
//               </small>
//             </div>
//           </div>
//         </Modal.Body>
//       </Modal>

//       {/* 🔥 نموذج إضافة/تعديل المنتج */}
//       <Card className="shadow-lg border-0 mb-5">
//         <Card.Header className="bg-gradient-primary text-white py-3">
//           <h4 className="mb-0">
//             {formData.id ? "✏️ تعديل المنتج" : "➕ إضافة منتج جديد"}
//           </h4>
//         </Card.Header>
//         <Card.Body className="p-4">
//           <Form>
//             <Row className="g-4">
//               {/* 🔹 المعلومات الأساسية */}
//               <Col md={4}>
//                 <Form.Group>
//                   <Form.Label className="fw-bold text-primary">
//                     اسم المنتج *
//                   </Form.Label>
//                   <Form.Control
//                     placeholder="أدخل اسم المنتج"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                     className="border-primary"
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label className="fw-bold text-primary">
//                     السعر *
//                   </Form.Label>
//                   <InputGroup>
//                     <Form.Control
//                       type="number"
//                       placeholder="السعر"
//                       name="price"
//                       value={formData.price}
//                       onChange={handleChange}
//                       required
//                       min="0"
//                       step="0.01"
//                       className="border-primary"
//                     />
//                     <InputGroup.Text className="bg-primary text-white">
//                       ج.م
//                     </InputGroup.Text>
//                   </InputGroup>
//                 </Form.Group>
//               </Col>

//               <Col md={2}>
//                 <Form.Group>
//                   <Form.Label className="fw-bold">
//                     الرقم
//                   </Form.Label>
//                   <Form.Control
//                     type="number"
//                     placeholder="رقم المنتج"
//                     name="number"
//                     value={formData.number}
//                     onChange={handleChange}
//                     className="border-secondary"
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={4}>
//                 <Form.Group>
//                   <Form.Label className="fw-bold">
//                     الفئة
//                   </Form.Label>
//                   <div className="d-flex gap-2">
//                     <Form.Select
//                       name="category"
//                       value={formData.category}
//                       onChange={(e) => {
//                         const value = e.target.value;
//                         if (value === "new") {
//                           setFormData({ ...formData, category: "" });
//                         } else {
//                           setFormData({ ...formData, category: value });
//                         }
//                       }}
//                       className="border-primary"
//                     >
//                       <option value="">اختر الفئة</option>
//                       {categories.map((cat) => (
//                         <option key={cat.id || cat} value={cat.name || cat}>
//                           {cat.name || cat}
//                         </option>
//                       ))}
//                       <option value="new">+ إضافة فئة جديدة</option>
//                     </Form.Select>
                    
//                     {formData.category === "" && (
//                       <Form.Control
//                         type="text"
//                         placeholder="فئة جديدة"
//                         value={newCategory}
//                         onChange={(e) => setNewCategory(e.target.value)}
//                         className="border-success"
//                       />
//                     )}
//                   </div>
//                 </Form.Group>
//               </Col>

//               {/* 🔹 المخزون والحالة */}
//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label className="fw-bold d-flex justify-content-between">
//                     <span>المخزون</span>
//                     <Badge 
//                       bg={formData.stock <= 0 ? "danger" : formData.stock <= 10 ? "warning" : "success"}
//                       className="fs-7"
//                     >
//                       {formData.stock <= 0 ? "🔴" : formData.stock <= 10 ? "🟡" : "🟢"}
//                     </Badge>
//                   </Form.Label>
//                   <InputGroup>
//                     <Button 
//                       variant="outline-secondary"
//                       onClick={() => handleChange({ target: { name: 'stock', value: Math.max(0, (formData.stock || 0) - 1) } })}
//                     >
//                       -
//                     </Button>
//                     <Form.Control
//                       type="number"
//                       name="stock"
//                       value={formData.stock}
//                       onChange={handleChange}
//                       min="0"
//                       className="text-center fw-bold"
//                     />
//                     <Button 
//                       variant="outline-secondary"
//                       onClick={() => handleChange({ target: { name: 'stock', value: (formData.stock || 0) + 1 } })}
//                     >
//                       +
//                     </Button>
//                   </InputGroup>
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group>
//                   <Form.Label className="fw-bold">
//                     الحالة
//                   </Form.Label>
//                   <Form.Select
//                     name="status"
//                     value={formData.status}
//                     onChange={(e) => {
//                       const newStatus = e.target.value;
//                       setFormData({ 
//                         ...formData, 
//                         status: newStatus,
//                         stock: newStatus === 'out_of_stock' ? 0 : formData.stock
//                       });
//                     }}
//                     className="border-primary"
//                   >
//                     <option value="active">🟢 متاح</option>
//                     <option value="out_of_stock">🔴 غير متوفر</option>
//                     <option value="coming_soon">🟡 قريباً</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label className="fw-bold">
//                     الوصف القصير
//                   </Form.Label>
//                   <Form.Control
//                     placeholder="وصف مختصر للمنتج"
//                     name="description"
//                     value={formData.description}
//                     onChange={handleChange}
//                     className="border-secondary"
//                   />
//                 </Form.Group>
//               </Col>

//               {/* 🔹 المحتوى الإضافي */}
//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label className="fw-bold">
//                     الوصف التفصيلي
//                   </Form.Label>
//                   <Form.Control
//                     as="textarea"
//                     rows={3}
//                     placeholder="وصف تفصيلي للمنتج"
//                     name="article"
//                     value={formData.article}
//                     onChange={handleChange}
//                     className="border-secondary"
//                   />
//                 </Form.Group>
//               </Col>

//               <Col md={6}>
//                 <Form.Group>
//                   <Form.Label className="fw-bold">
//                     رابط يوتيوب
//                   </Form.Label>
//                   <Form.Control
//                     type="url"
//                     placeholder="https://youtube.com/..."
//                     name="youtube"
//                     value={formData.youtube}
//                     onChange={handleChange}
//                     className="border-secondary"
//                   />
//                 </Form.Group>
//               </Col>

//               {/* 🔹 رفع الصور */}
//               <Col md={12}>
//                 <Form.Group>
//                   <Form.Label className="fw-bold d-flex justify-content-between align-items-center">
//                     <span>
//                       صور المنتج 
//                       <Badge bg="primary" className="ms-2">
//                         ☁️ Cloudinary
//                       </Badge>
//                     </span>
//                     <span className="text-muted fs-6">
//                       {imageFiles.length} صورة جاهزة للرفع
//                     </span>
//                   </Form.Label>
                  
//                   <Card className="border border-primary">
//                     <Card.Body>
//                       <div className="d-flex justify-content-between align-items-center mb-4">
//                         <div className="d-flex gap-2">
//                           <Button
//                             variant="primary"
//                             size="sm"
//                             onClick={() => document.getElementById('image-upload').click()}
//                             className="d-flex align-items-center gap-1"
//                           >
//                             <span>☁️</span>
//                             اختر صور للرفع
//                           </Button>
//                           <Button
//                             variant="outline-info"
//                             size="sm"
//                             onClick={fetchProducts}
//                             disabled={loading}
//                           >
//                             🔄 تحديث
//                           </Button>
//                         </div>
                        
//                         {imageFiles.length > 0 && (
//                           <Button
//                             variant="outline-danger"
//                             size="sm"
//                             onClick={clearAllImages}
//                           >
//                             🗑️ مسح الكل
//                           </Button>
//                         )}
//                       </div>
                      
//                       <Form.Control
//                         id="image-upload"
//                         type="file"
//                         accept="image/jpeg, image/jpg, image/png, image/webp"
//                         multiple
//                         onChange={handleImageUpload}
//                         style={{ display: 'none' }}
//                       />
                      
//                       {/* معاينة الصور */}
//                       {imagePreviews.length > 0 && (
//                         <div className="mt-4">
//                           <h6 className="mb-3">
//                             معاينة الصور (سترفع على Cloudinary):
//                             <Badge bg="info" className="ms-2">
//                               {imagePreviews.length} صورة
//                             </Badge>
//                           </h6>
//                           <div className="row g-3">
//                             {imagePreviews.map((preview, index) => (
//                               <div key={index} className="col-6 col-md-3 col-lg-2">
//                                 <Card className="border">
//                                   <Card.Body className="p-2">
//                                     <div className="position-relative">
//                                       <img 
//                                         src={preview} 
//                                         alt={`Preview ${index + 1}`}
//                                         className="img-fluid rounded"
//                                         style={{ 
//                                           height: '100px',
//                                           width: '100%',
//                                           objectFit: 'cover'
//                                         }}
//                                       />
//                                       <Badge 
//                                         bg="primary" 
//                                         className="position-absolute top-0 start-0 m-1"
//                                       >
//                                         {index + 1}
//                                       </Badge>
//                                       <Button
//                                         variant="danger"
//                                         size="sm"
//                                         className="position-absolute top-0 end-0 m-1"
//                                         style={{ width: '24px', height: '24px', padding: 0 }}
//                                         onClick={() => removeImage(index)}
//                                       >
//                                         ×
//                                       </Button>
//                                     </div>
//                                   </Card.Body>
//                                 </Card>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       {/* معلومات النظام */}
//                       <Alert variant="info" className="mt-4">
//                         <div className="d-flex align-items-center">
//                           <div className="me-3">
//                             <span className="fs-4">ℹ️</span>
//                           </div>
//                           <div>
//                             <h6 className="mb-1">معلومات النظام:</h6>
//                             <p className="mb-0 small">
//                               • الصور ترفع على <strong className="text-primary">Cloudinary</strong> فقط ☁️<br />
//                               • البيانات تخزن في <strong className="text-success">Supabase</strong> 🗄️<br />
//                               • رابط الصورة يحفظ في حقل <code>image_url</code><br />
//                               • يمكن رفع عدة صور مرة واحدة
//                             </p>
//                           </div>
//                         </div>
//                       </Alert>
//                     </Card.Body>
//                   </Card>
//                 </Form.Group>
//               </Col>

//               {/* 🔹 أزرار الإجراءات */}
//               <Col md={12}>
//                 <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
//                   {formData.id && (
//                     <Button
//                       variant="outline-secondary"
//                       onClick={() => {
//                         setFormData({
//                           id: null,
//                           name: "",
//                           price: "",
//                           number: "",
//                           description: "",
//                           image_url: "",
//                           images: [],
//                           video: "",
//                           youtube: "",
//                           article: "",
//                           category: "",
//                           status: "active",
//                           stock: 0
//                         });
//                         clearAllImages();
//                         setNewCategory("");
//                       }}
//                       className="px-4"
//                     >
//                       إلغاء التعديل
//                     </Button>
//                   )}
//                   <Button
//                     variant={formData.id ? "warning" : "success"}
//                     size="lg"
//                     onClick={handleSubmit}
//                     disabled={loading}
//                     className="px-5"
//                   >
//                     {loading ? (
//                       <>
//                         <Spinner animation="border" size="sm" className="me-2" />
//                         جاري الحفظ...
//                       </>
//                     ) : formData.id ? (
//                       <>
//                         ✏️ حفظ التعديلات
//                       </>
//                     ) : (
//                       <>
//                         ☁️ رفع الصور + إضافة المنتج
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </Col>
//             </Row>
//           </Form>
//         </Card.Body>
//       </Card>

//       {/* 🔥 أدوات الفلترة والبحث */}
//       <Card className="shadow-sm border-0 mb-4">
//         <Card.Body>
//           <Row className="align-items-center">
//             <Col md={3} className="mb-2">
//               <Form.Group>
//                 <Form.Label>البحث:</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="ابحث باسم أو وصف أو فئة..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="border-primary"
//                 />
//               </Form.Group>
//             </Col>
            
//             <Col md={3} className="mb-2">
//               <Form.Group>
//                 <Form.Label>الفئة:</Form.Label>
//                 <Form.Select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="border-primary"
//                 >
//                   <option value="الكل">📂 جميع الفئات</option>
//                   {categories.map((cat) => (
//                     <option key={cat.id || cat} value={cat.name || cat}>
//                       {cat.name || cat}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>
            
//             <Col md={3} className="mb-2">
//               <Form.Group>
//                 <Form.Label>المخزون:</Form.Label>
//                 <Form.Select
//                   value={stockFilter}
//                   onChange={(e) => setStockFilter(e.target.value)}
//                   className="border-primary"
//                 >
//                   <option value="الكل">📊 جميع المخزون</option>
//                   <option value="متوفر">🟢 متوفر</option>
//                   <option value="غير متوفر">🔴 غير متوفر</option>
//                   <option value="محدود">🟡 محدود (أقل من 10)</option>
//                   <option value="كثير">🟢 كثير (أكثر من 10)</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
            
//             <Col md={3} className="text-md-end">
//               <div className="d-flex flex-column flex-md-row gap-2 justify-content-md-end">
//                 <Badge bg="dark" className="fs-6 p-2">
//                   المنتجات: {filteredProducts.length}
//                 </Badge>
//                 <Badge bg="success" className="fs-6 p-2">
//                   المخزون: {filteredProducts.reduce((sum, p) => sum + (p.stock || 0), 0)}
//                 </Badge>
//               </div>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* 🔥 جدول المنتجات */}
//       <Card className="shadow-lg border-0">
//         <Card.Header className="bg-dark text-white py-3">
//           <div className="d-flex justify-content-between align-items-center">
//             <h5 className="mb-0">📋 قائمة المنتجات</h5>
//             <div className="d-flex gap-2">
//               <Button 
//                 variant="outline-light" 
//                 size="sm"
//                 onClick={fetchProducts}
//                 disabled={loading}
//               >
//                 🔄 تحديث القائمة
//               </Button>
//             </div>
//           </div>
//         </Card.Header>
//         <Card.Body className="p-0">
//           {loading ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="primary" size="lg" />
//               <p className="mt-3">جارٍ تحميل المنتجات...</p>
//             </div>
//           ) : filteredProducts.length === 0 ? (
//             <div className="text-center py-5">
//               <div className="mb-4">
//                 <span className="display-1">📭</span>
//               </div>
//               <h4>لا توجد منتجات</h4>
//               <p className="text-muted mb-4">
//                 {searchQuery || selectedCategory !== "الكل" || stockFilter !== "الكل" 
//                   ? "لم يتم العثور على منتجات تطابق معايير البحث"
//                   : "لم يتم إضافة أي منتجات بعد"}
//               </p>
//               <div className="d-flex justify-content-center gap-2">
//                 <Button 
//                   variant="primary" 
//                   onClick={() => {
//                     setSelectedCategory("الكل");
//                     setStockFilter("الكل");
//                     setSearchQuery("");
//                   }}
//                 >
//                   عرض جميع المنتجات
//                 </Button>
//                 <Button 
//                   variant="success" 
//                   onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//                 >
//                   ➕ إضافة منتج جديد
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <Table hover className="mb-0">
//                 <thead className="table-dark">
//                   <tr>
//                     <th width="100">الصور</th>
//                     <th>الاسم</th>
//                     <th width="120">السعر</th>
//                     <th width="100">الرقم</th>
//                     <th width="150">الفئة</th>
//                     <th width="150">المخزون</th>
//                     <th width="120">الحالة</th>
//                     <th width="200" className="text-center">الإجراءات</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredProducts.map((p) => {
//                     // جمع الصور من المنتج
//                     let productImages = [];
                    
//                     if (p.image_url && p.image_url.startsWith('http')) {
//                       productImages.push(p.image_url);
//                     }
                    
//                     if (p.images && Array.isArray(p.images)) {
//                       const additionalImages = p.images.filter(url => 
//                         typeof url === 'string' && url.startsWith('http') && url !== p.image_url
//                       );
//                       productImages = [...productImages, ...additionalImages];
//                     }
                    
//                     return (
//                       <tr key={p.id} className="align-middle">
//                         <td>
//                           <div className="position-relative">
//                             <img
//                               src={productImages[0] || "https://via.placeholder.com/80?text=No+Image"}
//                               alt={p.name}
//                               className="rounded border"
//                               style={{ 
//                                 width: "80px", 
//                                 height: "80px", 
//                                 objectFit: "cover" 
//                               }}
//                               onError={(e) => {
//                                 e.target.src = "https://via.placeholder.com/80?text=Error";
//                               }}
//                             />
//                             {productImages.length > 1 && (
//                               <Badge 
//                                 bg="primary" 
//                                 className="position-absolute top-0 end-0 translate-middle"
//                                 title={`${productImages.length} صور`}
//                               >
//                                 ☁️ +{productImages.length - 1}
//                               </Badge>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           <div>
//                             <strong>{p.name}</strong>
//                             {p.description && (
//                               <p className="text-muted small mb-0 mt-1">
//                                 {p.description.slice(0, 60)}...
//                               </p>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           <span className="fw-bold text-success">
//                             {parseFloat(p.price || 0).toFixed(2)} ج.م
//                           </span>
//                         </td>
//                         <td>
//                           {p.number ? (
//                             <Badge bg="secondary" className="fs-6">
//                               #{p.number}
//                             </Badge>
//                           ) : (
//                             <span className="text-muted">—</span>
//                           )}
//                         </td>
//                         <td>
//                           <Badge bg="outline-primary" className="border text-dark">
//                             {p.category || "—"}
//                           </Badge>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <InputGroup size="sm" style={{ width: '120px' }}>
//                               <Button 
//                                 variant="outline-secondary"
//                                 onClick={() => adjustStock(p.id, p.stock || 0, -1)}
//                                 disabled={loading}
//                               >
//                                 -
//                               </Button>
//                               <Form.Control
//                                 type="number"
//                                 value={p.stock || 0}
//                                 onChange={(e) => updateStock(p.id, e.target.value)}
//                                 className="text-center fw-bold"
//                                 disabled={loading}
//                               />
//                               <Button 
//                                 variant="outline-secondary"
//                                 onClick={() => adjustStock(p.id, p.stock || 0, 1)}
//                                 disabled={loading}
//                               >
//                                 +
//                               </Button>
//                             </InputGroup>
//                             <div className={`px-2 py-1 rounded ms-2 fw-bold ${getStockBadgeColor(p.stock || 0)}`}>
//                               {p.stock || 0}
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           {getStatusBadge(p.status || 'active', p.stock || 0)}
//                         </td>
//                         <td className="text-center">
//                           <div className="btn-group" role="group">
//                             <Button
//                               variant="outline-warning"
//                               size="sm"
//                               onClick={() => editProduct(p)}
//                               title="تعديل"
//                               disabled={loading}
//                             >
//                               ✏️
//                             </Button>
//                             <Button
//                               variant="outline-info"
//                               size="sm"
//                               href={`/store/${p.id}`}
//                               target="_blank"
//                               title="عرض"
//                             >
//                               👁️
//                             </Button>
//                             <Button
//                               variant="outline-success"
//                               size="sm"
//                               onClick={() => adjustStock(p.id, p.stock || 0, 10)}
//                               title="إضافة 10"
//                               disabled={loading}
//                             >
//                               +10
//                             </Button>
//                             <Button
//                               variant="outline-danger"
//                               size="sm"
//                               onClick={() => deleteProduct(p.id)}
//                               title="حذف"
//                               disabled={loading}
//                             >
//                               🗑️
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </Table>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       {/* 🔥 إحصائيات المخزون */}
//       <Row className="mt-4 g-3">
//         <Col md={3}>
//           <Card className="bg-success text-white border-0 shadow">
//             <Card.Body className="text-center">
//               <h5>🟢 متوفر</h5>
//               <h2 className="my-3">
//                 {filteredProducts.filter(p => (p.stock || 0) > 0).length}
//               </h2>
//               <small>منتج</small>
//             </Card.Body>
//           </Card>
//         </Col>
        
//         <Col md={3}>
//           <Card className="bg-danger text-white border-0 shadow">
//             <Card.Body className="text-center">
//               <h5>🔴 غير متوفر</h5>
//               <h2 className="my-3">
//                 {filteredProducts.filter(p => (p.stock || 0) <= 0).length}
//               </h2>
//               <small>منتج</small>
//             </Card.Body>
//           </Card>
//         </Col>
        
//         <Col md={3}>
//           <Card className="bg-warning text-dark border-0 shadow">
//             <Card.Body className="text-center">
//               <h5>🟡 محدود</h5>
//               <h2 className="my-3">
//                 {filteredProducts.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length}
//               </h2>
//               <small>منتج</small>
//             </Card.Body>
//           </Card>
//         </Col>
        
//         <Col md={3}>
//           <Card className="bg-info text-white border-0 shadow">
//             <Card.Body className="text-center">
//               <h5>
//                 <span className="me-2">☁️</span>
//                 صور Cloudinary
//               </h5>
//               <h2 className="my-3">
//                 {filteredProducts.filter(p => p.image_url).length}
//               </h2>
//               <small>منتج له صور</small>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* 🔥 معلومات النظام */}
//       <Card className="mt-4 border-0 shadow-sm">
//         <Card.Body className="bg-light">
//           <div className="text-center">
//             <h6 className="mb-3">معلومات النظام</h6>
//             <div className="d-flex flex-wrap justify-content-center gap-4">
//               <div>
//                 <Badge bg="primary" className="p-2">
//                   ☁️ Cloudinary
//                 </Badge>
//                 <p className="small mt-1 mb-0">تخزين الصور فقط</p>
//               </div>
//               <div>
//                 <Badge bg="success" className="p-2">
//                   🗄️ Supabase
//                 </Badge>
//                 <p className="small mt-1 mb-0">تخزين جميع البيانات</p>
//               </div>
//               <div>
//                 <Badge bg="dark" className="p-2">
//                   ⚡ Next.js
//                 </Badge>
//                 <p className="small mt-1 mb-0">واجهة المستخدم</p>
//               </div>
//               <div>
//                 <Badge bg="info" className="p-2">
//                   🔄 Realtime
//                 </Badge>
//                 <p className="small mt-1 mb-0">تحديث فوري</p>
//               </div>
//             </div>
//           </div>
//         </Card.Body>
//         <Card.Footer className="text-center text-muted">
//           <small>
//             نظام إدارة المنتجات المتكامل | إصدار 2.0 | {new Date().getFullYear()}
//           </small>
//         </Card.Footer>
//       </Card>
//     </Container>
//   );
// }