"use client";

import { useState } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  Row,
  Col
} from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function Registration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    storeAddress: "",
    phone: "",
    email: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // 🟢 تحديث الفورم
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // مسح الخطأ عند التعديل
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  // 🟢 التحقق من البيانات
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    }
    
    if (!formData.storeAddress.trim()) {
      newErrors.storeAddress = "عنوان المحل مطلوب";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "رقم الهاتف مطلوب";
    } else if (!/^01[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "رقم الهاتف يجب أن يكون 11 رقماً ويبدأ بـ 01";
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🟢 إنشاء رسالة الواتساب وفتحها
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage("⚠️ يرجى تصحيح الأخطاء في النموذج");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // رقم الواتساب
      const whatsappNumber = "201002955430";
      
      // نص الرسالة مرتبة
      const messageText = `🎉 *طلب تسجيل مستخدم جديد*
      
👤 *الاسم:* ${formData.name}
🏪 *عنوان المحل:* ${formData.storeAddress}
📞 *الهاتف:* ${formData.phone}
📧 *البريد الإلكتروني:* ${formData.email || 'لم يتم إدخاله'}

📅 *التاريخ:* ${new Date().toLocaleDateString('ar-SA')}
⏰ *الوقت:* ${new Date().toLocaleTimeString('ar-SA')}

_يرجى التواصل مع العميل لتأكيد التسجيل_`;

      // ترميز الرسالة للـ URL
      const encodedMessage = encodeURIComponent(messageText);
      
      // رابط الواتساب
      const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // فتح الواتساب في نافذة جديدة
      window.open(whatsappLink, '_blank');
      
      // عرض رسالة نجاح
      setMessage("✅ تم فتح واتساب مع الرسالة جاهزة للإرسال");
      
      // إعادة تعيين النموذج بعد ثانيتين
      setTimeout(() => {
        setFormData({
          name: "",
          storeAddress: "",
          phone: "",
          email: ""
        });
        setMessage("");
      }, 3000);

    } catch (err) {
      console.error(err);
      setMessage("❌ حدث خطأ أثناء إعداد الرسالة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="justify-content-center w-100">
        <Col md={8} lg={6}>
          <Card className="shadow-lg border-0">
            <Card.Header className=" text-center py-4 registration-title">
              <h3 className="mb-1">📱 إرسال بيانات على الواتساب</h3>
              <p className="mb-0 opacity-75">املأ البيانات وسيتم فتح واتساب مع الرسالة جاهزة</p>
            </Card.Header>
            
            <Card.Body className="p-4">
              {message && (
                <Alert 
                  variant={message.includes("❌") ? "danger" : "success"} 
                  className="text-center"
                >
                  {message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* الاسم */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-dark">
                    👤 الاسم الكامل <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="أدخل الاسم الكامل"
                    isInvalid={!!errors.name}
                    className="py-2"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* عنوان المحل */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-dark">
                    🏪 عنوان المحل <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="storeAddress"
                    value={formData.storeAddress}
                    onChange={handleChange}
                    placeholder="أدخل عنوان المحل كاملاً"
                    isInvalid={!!errors.storeAddress}
                    className="py-2"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.storeAddress}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* رقم الهاتف */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-dark">
                    📞 رقم الهاتف <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="مثال: 01001111111"
                    isInvalid={!!errors.phone}
                    className="py-2"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    يجب أن يكون 11 رقماً ويبدأ بـ 01
                  </Form.Text>
                </Form.Group>

                {/* البريد الإلكتروني */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold text-dark">
                    📧 البريد الإلكتروني (اختياري)
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    isInvalid={!!errors.email}
                    className="py-2"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* زر الإرسال */}
                <div className="d-grid gap-3">
                  <Button
                    type="submit"
                    // variant="success"
                    size="lg"
                    disabled={loading}
                    className="py-3 fw-bold registration-title"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2 "
                        />
                        جاري فتح الواتساب...
                      </>
                    ) : (
                      <>
                        📤 ارسال الطلب 
                      </>
                    )}
                  </Button>

                  {/* <Button
                    type="button"
                    variant="outline-secondary"
                    size="lg"
                    onClick={() => router.push('/dashboard/oldusers')}
                    className="py-3"
                  >
                    ↩️ العودة لقائمة المستخدمين
                  </Button> */}
                </div>
              </Form>
            </Card.Body>
            
            <Card.Footer className="bg-light text-center py-3">
              <div className="d-flex justify-content-center align-items-center">
                <span className="me-2">💡</span>
                <small className="text-muted">
                  بعد الضغط على الزر سيتم فتح تطبيق الواتساب مع الرسالة جاهزة
                </small>
              </div>
            </Card.Footer>
          </Card>

          {/* تعليمات الاستخدام */}
          <Card className="mt-4 border-0 shadow-sm">
            <Card.Body className="p-3">
              <h5 className=" mb-3">📋 خطوات الاستخدام:</h5>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center fw-bold">
                    <div className="registration-title rounded-circle p-2 me-3 d-flex justify-content-center align-items-center ms-3"
                        style={{
                          width:"30px",
                          height:"30px"
                        }}
                    >1</div>
                    <div>
                      <h6 className="fw-bold mb-1">املأ البيانات</h6>
                      <p className="text-muted small mb-0">املأ جميع الحقول المطلوبة</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center fw-bold">
                    <div className="registration-title rounded-circle p-2 me-3 d-flex justify-content-center align-items-center ms-3"
                        style={{
                          width:"30px",
                          height:"30px"
                        }}
                    >
                      2</div>
                    <div>
                      <h6 className="fw-bold mb-1">اضغط على ارسال الطلب</h6>
                      <p className="text-muted small mb-0">  سيتم ارسال البيانات على الواتساب </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center fw-bold">
                    <div className="registration-title rounded-circle p-2 me-3 d-flex justify-content-center align-items-center ms-3"
                        style={{
                          width:"30px",
                          height:"30px"
                        }}
                    >
                      3</div>
                    <div>
                      <h6 className="fw-bold mb-1">راجع الرسالة</h6>
                      <p className="text-muted small mb-0">ستجد الرسالة مرتبة جاهزة</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <div className="d-flex align-items-center fw-bold my-1">
                    <div className="registration-title rounded-circle p-2 me-3 d-flex justify-content-center align-items-center ms-3"
                        style={{
                          width:"30px",
                          height:"30px"
                        }}
                    >
                      4</div>
                    <div>
                      <h6 className="fw-bold mb-1">سوف يتم انشاء حساب لك مجانا           </h6>
                      <p className="text-muted small mb-0">وسوف يتم التواصل معك من خلالنا     </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}