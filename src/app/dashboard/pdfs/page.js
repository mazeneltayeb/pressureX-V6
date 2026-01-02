


"use client";
import { useState, useEffect } from "react";
import {
  Container, Table, Button, Form,
  Row, Col, Spinner, Alert, Badge,
  ProgressBar, Modal, InputGroup
} from "react-bootstrap";
import { supabase } from '/lib/supabaseClient';
import { 
  FaFilePdf, FaTrash, FaEdit, FaUpload, 
  FaImage, FaPlus, FaList, FaTimes, FaSave,FaEye 
} from "react-icons/fa";

export default function DashboardPDFs() {
  const [pdfs, setPdfs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: null, // مهم للتعديل
    title: "",
    description: "",
    category: "",
    status: "active"
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  
  // حالات إدارة الفئات
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "" });

// داخل الكومبوننت، بعد fetchPDFs مباشرة:
const refreshPDFs = async () => {
  await fetchPDFs();
  showMessage("🔄 تم تحديث قائمة الملفات", "info");
};

  // تحميل البيانات الأولية
  useEffect(() => {
    fetchPDFs();
    fetchCategories();
  }, []);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pdf_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPdfs(data || []);
    } catch (err) {
      console.error('Error fetching PDFs:', err);
      showMessage(`❌ ${err.message}`, 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('pdf_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const showMessage = (text, type = 'info', timeout = 5000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), timeout);
  };

  // === إدارة الفئات ===
  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) {
      showMessage("⚠️ أدخل اسم الفئة", "warning");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pdf_categories')
        .insert([{ name: categoryForm.name.trim() }])
        .select();

      if (error) {
        if (error.code === '23505') {
          showMessage("⚠️ هذه الفئة موجودة بالفعل", "warning");
        } else {
          throw error;
        }
        return;
      }

      showMessage("✅ تم إضافة الفئة بنجاح", "success");
      setCategoryForm({ name: "" });
      setShowCategoryModal(false);
      await fetchCategories();
      
      if (data && data[0]) {
        setFormData({ ...formData, category: data[0].name });
      }
      
    } catch (error) {
      console.error('Error adding category:', error);
      showMessage(`❌ ${error.message}`, "danger");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفئة؟\n\nملاحظة: سيتم تعيين الملفات التابعة لهذه الفئة إلى 'عام'")) {
      return;
    }

    try {
      const categoryName = categories.find(c => c.id === id)?.name;
      
      // تحديث ملفات هذه الفئة
      if (categoryName) {
        const { error: updateError } = await supabase
          .from('pdf_files')
          .update({ category: "عام" })
          .eq('category', categoryName);

        if (updateError) console.error('Update error:', updateError);
      }

      // حذف الفئة
      const { error: deleteError } = await supabase
        .from('pdf_categories')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      showMessage("🗑️ تم حذف الفئة وتحديث الملفات", "success");
      await fetchCategories();
      await fetchPDFs();
      
      // إذا كانت الفئة المحذوفة هي المختارة حالياً
      if (categoryName === formData.category) {
        setFormData({ ...formData, category: "" });
      }
      
    } catch (error) {
      console.error('Error deleting category:', error);
      showMessage(`❌ ${error.message}`, "danger");
    }
  };

  // === رفع الملفات ===
  const uploadPDFToStorage = async (file, type = 'pdf') => {
    try {
      console.log(`⬆️ بدء رفع ${type}:`, file.name);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${type === 'pdf' ? 'pdfs' : 'thumbnails'}/${fileName}`;
      
      console.log('📁 مسار الرفع:', filePath);

      const { data, error } = await supabase.storage
        .from('pdf-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error(`❌ خطأ في رفع ${type}:`, error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('pdf-documents')
        .getPublicUrl(filePath);

      console.log(`✅ تم رفع ${type}:`, publicUrl);
      return publicUrl;
      
    } catch (error) {
      console.error(`💥 فشل رفع ${type}:`, error);
      throw new Error(`فشل رفع ${type}: ${error.message}`);
    }
  };

  // حفظ/تحديث PDF في قاعدة البيانات
  const savePDFToDatabase = async (pdfData, isUpdate = false) => {
    try {
      console.log('💾 حفظ في قاعدة البيانات:', pdfData);
      
      let query;
      
      if (isUpdate && pdfData.id) {
        // تحديث
        query = supabase
          .from('pdf_files')
          .update({
            title: pdfData.title,
            description: pdfData.description,
            category: pdfData.category,
            file_url: pdfData.file_url,
            thumbnail_url: pdfData.thumbnail_url,
            file_size: pdfData.file_size,
            file_type: pdfData.file_type,
            status: pdfData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', pdfData.id)
          .select();
      } else {
        // إضافة جديدة
        query = supabase
          .from('pdf_files')
          .insert([{
            title: pdfData.title,
            description: pdfData.description,
            category: pdfData.category,
            file_url: pdfData.file_url,
            thumbnail_url: pdfData.thumbnail_url,
            file_size: pdfData.file_size,
            file_type: pdfData.file_type,
            status: pdfData.status,
            downloads_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('❌ خطأ في قاعدة البيانات:', error);
        throw error;
      }
      
      console.log(`✅ تم ${isUpdate ? 'تحديث' : 'حفظ'}:`, data);
      return data[0];
      
    } catch (error) {
      console.error('💥 فشل الحفظ في قاعدة البيانات:', error);
      throw error;
    }
  };

  // دالة الرفع الرئيسية (إضافة/تعديل)
  const handleUpload = async () => {
    if (!formData.title.trim()) {
      showMessage("⚠️ أدخل عنوان الملف", "warning");
      return;
    }
    
    if (!formData.id && !pdfFile) {
      showMessage("⚠️ اختر ملف PDF", "warning");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);
      setMessage({ text: formData.id ? "جاري تحديث الملف..." : "جاري رفع الملف...", type: "info" });

      let pdfUrl = formData.file_url || "";
      let thumbnailUrl = formData.thumbnail_url || "";
      let finalCategory = formData.category;

      // التحقق من الفئة الجديدة إذا تم اختيارها
      if (formData.category === "new" && newCategoryName.trim()) {
        const { data: categoryData, error: categoryError } = await supabase
          .from('pdf_categories')
          .insert([{ name: newCategoryName.trim() }])
          .select();

        if (categoryError && categoryError.code !== '23505') {
          throw categoryError;
        }

        finalCategory = newCategoryName.trim();
        await fetchCategories();
      }

      // 1. رفع ملف PDF (إذا كان جديداً)
      if (!formData.id && pdfFile) {
        pdfUrl = await uploadPDFToStorage(pdfFile, 'pdf');
      }
      
      // 2. رفع الصورة المصغرة (إذا كانت جديدة)
      if (thumbnailFile) {
        thumbnailUrl = await uploadPDFToStorage(thumbnailFile, 'thumbnail');
      }

      // 3. إعداد بيانات الحفظ
      const pdfData = {
        id: formData.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: finalCategory || "عام",
        file_url: pdfUrl,
        thumbnail_url: thumbnailUrl || null,
        file_size: pdfFile ? pdfFile.size : formData.file_size,
        file_type: pdfFile ? pdfFile.type : formData.file_type,
        status: formData.status
      };

      // 4. الحفظ/التحديث في قاعدة البيانات
      const isUpdate = !!formData.id;
      await savePDFToDatabase(pdfData, isUpdate);
      
      // 5. تحديث الواجهة
      showMessage(`✅ تم ${isUpdate ? 'تحديث' : 'رفع'} "${formData.title}" بنجاح`, "success");
      
      // 6. إعادة تعيين النموذج
      resetForm();
      
      // 7. تحديث القائمة
      await fetchPDFs();
      
    } catch (error) {
      console.error('💥 خطأ كامل:', error);
      showMessage(`❌ ${error.message || "حدث خطأ أثناء الرفع"}`, "danger");
    } finally {
      setUploading(false);
    }
  };

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFormData({
      id: null,
      title: "",
      description: "",
      category: "",
      status: "active",
      file_url: "",
      thumbnail_url: "",
      file_size: 0,
      file_type: ""
    });
    setNewCategoryName("");
    setPdfFile(null);
    setThumbnailFile(null);
    setPreviewUrl("");
    setUploadProgress(0);
  };

  // تحديث عند تغيير اختيار الفئة
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, category: value });
    if (value !== "new") {
      setNewCategoryName("");
    }
  };

  // === حذف ملف ===
  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الملف؟")) return;
    
    try {
      setLoading(true);
      
      // حذف من قاعدة البيانات
      const { error: dbError } = await supabase
        .from('pdf_files')
        .delete()
        .eq('id', id);
      
      if (dbError) throw dbError;
      
      showMessage("🗑️ تم حذف الملف", "success");
      await fetchPDFs();
      
    } catch (error) {
      console.error('Delete error:', error);
      showMessage(`❌ ${error.message}`, "danger");
    } finally {
      setLoading(false);
    }
  };

  // === تعديل ملف ===
  const handleEdit = (pdf) => {
    console.log('تعديل الملف:', pdf);
    
    setFormData({
      id: pdf.id,
      title: pdf.title,
      description: pdf.description || "",
      category: pdf.category || "",
      status: pdf.status || "active",
      file_url: pdf.file_url || "",
      thumbnail_url: pdf.thumbnail_url || "",
      file_size: pdf.file_size || 0,
      file_type: pdf.file_type || "application/pdf"
    });
    
    setPdfFile(null);
    setThumbnailFile(null);
    setNewCategoryName("");
    setPreviewUrl(pdf.file_url || "");
    
    window.scrollTo({ top: 0, behavior: "smooth" });
    showMessage(`📝 تعديل الملف: ${pdf.title}`, "info");
  };

  // معاينة الملف المختار
  useEffect(() => {
    if (pdfFile) {
      const objectUrl = URL.createObjectURL(pdfFile);
      setPreviewUrl(objectUrl);
      
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [pdfFile]);

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">📊 لوحة إدارة ملفات PDF</h2>

      {/* رسائل النظام */}
      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ text: "", type: "" })} dismissible>
          {message.text}
        </Alert>
      )}

      {/* نموذج الرفع/التعديل */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaUpload className="me-2" />
            {formData.id ? "تعديل ملف" : "إضافة ملف جديد"}
            {formData.id && <Badge bg="warning" className="ms-2">ID: {formData.id}</Badge>}
          </h5>
          <div>
            <Button 
              variant="light" 
              size="sm"
              onClick={() => setShowCategoryModal(true)}
              className="me-2"
            >
              <FaList /> إدارة الفئات
            </Button>
            {formData.id && (
              <Button 
                variant="outline-light" 
                size="sm"
                onClick={resetForm}
              >
                ✖ إلغاء التعديل
              </Button>
            )}
          </div>
        </div>
        
        <div className="card-body">
          <Row className="g-3">
            {/* عنوان الملف */}
            <Col md={12}>
              <Form.Group>
                <Form.Label className="fw-bold">
                  عنوان الملف *
                  {formData.id && <Badge bg="info" className="ms-2">تعديل</Badge>}
                </Form.Label>
                <Form.Control
                  placeholder="مثال: دورة React للمبتدئين"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  disabled={uploading}
                />
              </Form.Group>
            </Col>

            {/* الوصف */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>الوصف</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="وصف مختصر عن الملف..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  disabled={uploading}
                />
              </Form.Group>
            </Col>

            {/* الفئة */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>الفئة</Form.Label>
                <div className="d-flex gap-2">
                  <Form.Select
                    value={formData.category}
                    onChange={handleCategoryChange}
                    disabled={uploading}
                    style={{ flex: 1 }}
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                    <option value="new">+ فئة جديدة</option>
                  </Form.Select>
                </div>
                
                {/* حقل الفئة الجديدة */}
                {formData.category === "new" && (
                  <div className="mt-2">
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="أدخل اسم الفئة الجديدة"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        disabled={uploading}
                      />
                      <Button 
                        variant="success"
                        onClick={() => {
                          if (newCategoryName.trim()) {
                            handleAddCategory(newCategoryName.trim());
                          }
                        }}
                      >
                        <FaPlus /> إضافة
                      </Button>
                    </InputGroup>
                  </div>
                )}
              </Form.Group>
            </Col>

            {/* اختيار ملف PDF (غير مطلوب للتعديل إذا لم يتغير) */}
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-bold">
                  <FaFilePdf className="me-2 text-danger" />
                  ملف PDF {!formData.id && "*"}
                  {formData.id && <small className="text-muted ms-2">(اختياري - اختر فقط إذا أردت تغيير الملف)</small>}
                </Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type === 'application/pdf') {
                      setPdfFile(file);
                    } else if (file) {
                      showMessage("⚠️ الرجاء اختيار ملف PDF صحيح", "warning");
                    }
                  }}
                  disabled={uploading}
                />
                {pdfFile ? (
                  <div className="mt-2">
                    <small className="text-success d-block">
                      ✓ ملف جديد: {pdfFile.name}
                    </small>
                    <small className="text-muted">
                      الحجم: {(pdfFile.size / (1024*1024)).toFixed(2)} ميجابايت
                    </small>
                  </div>
                ) : formData.file_url && (
                  <div className="mt-2">
                    <small className="text-info d-block">
                      📄 الملف الحالي: <a href={formData.file_url} target="_blank" rel="noopener noreferrer">عرض</a>
                    </small>
                    <small className="text-muted">
                      الحجم: {formData.file_size ? `${(formData.file_size / (1024*1024)).toFixed(2)} ميجابايت` : "غير معروف"}
                    </small>
                  </div>
                )}
              </Form.Group>
            </Col>

            {/* اختيار صورة الغلاف */}
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  <FaImage className="me-2 text-info" />
                  صورة الغلاف (اختياري)
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  disabled={uploading}
                />
                {thumbnailFile ? (
                  <small className="text-success d-block mt-2">
                    ✓ صورة جديدة: {thumbnailFile.name}
                  </small>
                ) : formData.thumbnail_url && (
                  <small className="text-info d-block mt-2">
                    🖼️ الصورة الحالية: <a href={formData.thumbnail_url} target="_blank" rel="noopener noreferrer">عرض</a>
                  </small>
                )}
              </Form.Group>
            </Col>

            {/* حالة الملف */}
            <Col md={4}>
              <Form.Group>
                <Form.Label>حالة الملف</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  disabled={uploading}
                >
                  <option value="active">نشط</option>
                  <option value="hidden">مخفي</option>
                  <option value="draft">مسودة</option>
                </Form.Select>
              </Form.Group>
            </Col>

            {/* معاينة PDF */}
            {(previewUrl || formData.file_url) && (
              <Col md={12}>
                <div className="border rounded p-3 bg-light">
                  <h6>معاينة الملف:</h6>
                  <iframe 
                    src={previewUrl || formData.file_url} 
                    style={{ width: '100%', height: '300px', border: 'none' }}
                    title="PDF Preview"
                  />
                </div>
              </Col>
            )}

            {/* زر الحفظ/التحديث */}
            <Col md={12}>
              <Button
                variant={formData.id ? "warning" : "success"}
                className="w-100 py-3"
                onClick={handleUpload}
                disabled={uploading || !formData.title || (!formData.id && !pdfFile)}
              >
                {uploading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {formData.id ? 'جاري التحديث...' : 'جاري الرفع...'}
                  </>
                ) : (
                  <>
                    {formData.id ? <FaSave /> : <FaUpload />}
                    {formData.id ? ' تحديث الملف' : ' رفع الملف'}
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* مودال إدارة الفئات */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FaList className="me-2" />
            إدارة الفئات
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* نموذج إضافة فئة جديدة */}
          <div className="mb-4 p-3 border rounded bg-light">
            <h6>إضافة فئة جديدة</h6>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="اسم الفئة الجديدة"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ name: e.target.value })}
              />
              <Button variant="success" onClick={handleAddCategory}>
                <FaPlus /> إضافة
              </Button>
            </InputGroup>
          </div>

          {/* قائمة الفئات الحالية */}
          <h6>الفئات الحالية ({categories.length})</h6>
          {categories.length === 0 ? (
            <Alert variant="info" className="text-center">
              <p className="mb-0">لا توجد فئات مضافة بعد</p>
            </Alert>
          ) : (
            <ul className="list-group">
              {categories.map((cat) => (
                <li 
                  key={cat.id} 
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    <Badge bg="info" className="me-2">
                      {cat.name}
                    </Badge>
                    <small className="text-muted">
                      {new Date(cat.created_at).toLocaleDateString('ar-SA')}
                    </small>
                  </span>
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDeleteCategory(cat.id)}
                    title="حذف الفئة"
                  >
                    <FaTimes />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            إغلاق
          </Button>
        </Modal.Footer>
      </Modal>
      


            {/*  عدد التحميلات  */}
<div className="d-flex justify-content-between align-items-center mb-3">
  <h4 className="mb-0">📚 الملفات المرفوعة ({pdfs.length})</h4>
  <div className="d-flex gap-2">
    <Button 
      variant="outline-primary" 
      size="sm"
      onClick={refreshPDFs}
      disabled={loading}
    >
      🔄 تحديث
    </Button>
    <Badge bg="info" className="me-2">
      {categories.length} فئة
    </Badge>
    <Badge bg="success">
      {pdfs.filter(p => p.status === 'active').length} نشط
    </Badge>
    <Badge bg="primary">
      ⬇️ {pdfs.reduce((sum, pdf) => sum + (pdf.downloads_count || 0), 0)} تحميل
    </Badge>
  </div>
</div>



      {/* قائمة الملفات */}
      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">📚 الملفات المرفوعة ({pdfs.length})</h4>
          <div>
            <Badge bg="info" className="me-2">
              {categories.length} فئة
            </Badge>
            <Badge bg="success">
              {pdfs.filter(p => p.status === 'active').length} نشط
            </Badge>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">جاري تحميل الملفات...</p>
          </div>
        ) : pdfs.length === 0 ? (
          <Alert variant="info">
            <h5>📭 لا توجد ملفات بعد</h5>
            <p className="mb-0">ابدأ برفع أول ملف PDF لديك</p>
          </Alert>
        ) : (
          <Table striped bordered hover responsive className="mt-3">
            <thead className="table-dark">
              <tr className="text-center">
                <th>#</th>
                <th>الملف</th>
                <th>الفئة</th>
                <th>الحجم</th>
                <th>الحالة</th>
                <th>التنزيلات</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {pdfs.map((pdf, index) => (
                <tr key={pdf.id} className="text-center align-middle">
                  <td>{index + 1}</td>
                  <td className="text-start">
                    <div className="d-flex align-items-center">
                      <FaFilePdf className="text-danger fs-4 me-2" />
                      <div>
                        <strong className="d-block">{pdf.title}</strong>
                        <small className="text-muted d-block">
                          {pdf.description || "لا يوجد وصف"}
                        </small>
                        {pdf.id === formData.id && (
                          <Badge bg="warning" className="mt-1">يتم التعديل</Badge>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info">
                      {pdf.category || "عام"}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg="secondary">
                      {pdf.file_size ? `${(pdf.file_size / (1024*1024)).toFixed(2)} م.ب` : "غير معروف"}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={
                      pdf.status === 'active' ? 'success' : 
                      pdf.status === 'hidden' ? 'secondary' : 'warning'
                    }>
                      {pdf.status === 'active' ? 'نشط' : 
                       pdf.status === 'hidden' ? 'مخفي' : 'مسودة'}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg="primary">
                      {pdf.downloads_count || 0} ⬇️
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Button 
                        variant="info" 
                        size="sm"
                        onClick={() => window.open(pdf.file_url, '_blank')}
                        title="معاينة"
                      >
                        <FaEye />
                      </Button>
                      <Button 
                        variant="warning" 
                        size="sm"
                        onClick={() => handleEdit(pdf)}
                        title="تعديل"
                      >
                        <FaEdit />
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(pdf.id)}
                        disabled={loading}
                        title="حذف"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
}
