



// "use client";
// import { useState, useEffect } from "react";
// import { 
//   Container, 
//   Table, 
//   Button, 
//   Card, 
//   Row, 
//   Col, 
//   Alert, 
//   InputGroup, 
//   Form, 
//   Modal,
//   Badge
// } from "react-bootstrap";
// import { useRouter } from "next/navigation";
// import { supabase } from '/lib/supabaseClient'; // تأكد من مسار ملف supabase عندك

// export default function CartPage() {
//   const [cartItems, setCartItems] = useState([]);
//   const [showOrderForm, setShowOrderForm] = useState(false);
//   const [customerInfo, setCustomerInfo] = useState({
//     name: '',
//     phone: '',
//     address: '',
//     notes: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [orderSuccess, setOrderSuccess] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     // جلب محتويات السلة من localStorage
//     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     setCartItems(cart);
//   }, []);

//   const updateQuantity = (productId, newQuantity) => {
//     if (newQuantity < 1) return;
    
//     const updatedCart = cartItems.map(item =>
//       item.id === productId ? { ...item, quantity: newQuantity } : item
//     );
    
//     setCartItems(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//   };

//   const removeItem = (productId) => {
//     const updatedCart = cartItems.filter(item => item.id !== productId);
//     setCartItems(updatedCart);
//     localStorage.setItem('cart', JSON.stringify(updatedCart));
//   };

//   const clearCart = () => {
//     if (confirm("هل تريد تفريغ السلة بالكامل؟")) {
//       setCartItems([]);
//       localStorage.setItem('cart', '[]');
//     }
//   };

//   // الحسابات
//   const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
//   const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//   const sendWhatsAppOrder = () => {
//     if (cartItems.length === 0) {
//       alert("السلة فارغة! أضف بعض المنتجات أولاً.");
//       return;
//     }

//     // تحضير نص الطلب
//     const orderDetails = cartItems.map(item =>
//       `• ${item.name}  \n[${item.quantity} قطعة ] \n${item.price * item.quantity} ج.م`
//     ).join('\n');

//     const message = `🎯 طلب جديد\n\n${orderDetails}\n\n💰 الإجمالي: ${totalPrice} ج.م\n📦 عدد القطع: ${totalItems}`;

//     // ترميز الرسالة للواتساب
//     const encodedMessage = encodeURIComponent(message);
//     const phoneNumber = "201002955430"; // ⬅️ غير برقمك الحقيقي
    
//     window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
//   };

//   // دالة حفظ الطلب في Supabase
//   const saveOrderToSupabase = async () => {
//     try {
//       // تحقق من المعلومات
//       if (!customerInfo.name || !customerInfo.phone) {
//         alert('الرجاء إدخال الاسم ورقم الهاتف');
//         return null;
//       }

//       // احصل على معلومات المستخدم إذا كان مسجل دخول
//       const { data: { user } } = await supabase.auth.getUser();
      
//       // بيانات الطلب
//       const orderData = {
//         user_id: user?.id || null,
//         customer_name: customerInfo.name,
//         customer_phone: customerInfo.phone,
//         customer_address: customerInfo.address,
//         items: JSON.stringify(cartItems.map(item => ({
//           id: item.id,
//           name: item.name,
//           price: item.price,
//           quantity: item.quantity,
//           image_url: item.image_url || item.image,
//           stock: item.stock || 0 // نحفظ الـ stock الحالي
//         }))),
//         total_price: totalPrice,
//         total_items: totalItems,
//         status: 'pending',
//         notes: customerInfo.notes,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       };

//       // إرسال الطلب
//       const { data, error } = await supabase
//         .from('orders')
//         .insert([orderData])
//         .select()
//         .single();

//       if (error) {
//         console.error('Supabase error:', error);
//         throw error;
//       }
      
//       return data;
//     } catch (error) {
//       console.error('Error saving order:', error);
//       throw error;
//     }
//   };

//   // دالة إتمام الطلب
//   const completeOrder = async () => {
//     if (cartItems.length === 0) {
//       alert("السلة فارغة! أضف بعض المنتجات أولاً.");
//       return;
//     }

//     setIsSubmitting(true);
    
//     try {
//       // احفظ الطلب في قاعدة البيانات
//       const savedOrder = await saveOrderToSupabase();
      
//       if (!savedOrder) {
//         alert('حدث خطأ في حفظ الطلب');
//         setIsSubmitting(false);
//         return;
//       }

//       // أرسل على الواتساب
//       sendWhatsAppOrder();
      
//       // نظف السلة
//       setCartItems([]);
//       localStorage.setItem('cart', '[]');
      
//       // أغلق النموذج
//       setShowOrderForm(false);
//       setCustomerInfo({ name: '', phone: '', address: '', notes: '' });
      
//       // حفظ بيانات النجاح
//       setOrderSuccess({
//         orderId: savedOrder.id,
//         orderNumber: savedOrder.id.slice(0, 8),
//         customerName: customerInfo.name
//       });
      
//     } catch (error) {
//       alert('❌ حدث خطأ في إتمام الطلب. الرجاء المحاولة مرة أخرى.');
//       console.error('Order completion error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Check stock availability
//   const checkStockAvailability = () => {
//     const outOfStockItems = cartItems.filter(item => 
//       item.stock !== undefined && item.stock < item.quantity
//     );
    
//     if (outOfStockItems.length > 0) {
//       alert(`بعض المنتجات غير متوفرة بالكمية المطلوبة:\n${outOfStockItems.map(item => `- ${item.name} (المتوفر: ${item.stock})`).join('\n')}`);
//       return false;
//     }
//     return true;
//   };

//   const handleCheckout = () => {
//     if (!checkStockAvailability()) return;
//     setShowOrderForm(true);
//   };

//   // Reset order success
//   const resetOrderSuccess = () => {
//     setOrderSuccess(null);
//     router.push('/store');
//   };

//   // Modal for order form
//   const OrderFormModal = () => (
//     <Modal show={showOrderForm} onHide={() => !isSubmitting && setShowOrderForm(false)} centered>
//       <Modal.Header closeButton={!isSubmitting}>
//         <Modal.Title>✅ تأكيد الطلب</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {isSubmitting ? (
//           <div className="text-center py-4">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">جاري المعالجة...</span>
//             </div>
//             <p className="mt-3">جاري تأكيد طلبك...</p>
//           </div>
//         ) : (
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>الاسم الكامل *</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="أدخل اسمك"
//                 value={customerInfo.name}
//                 onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
//                 required
//                 disabled={isSubmitting}
//               />
//             </Form.Group>
            
//             <Form.Group className="mb-3">
//               <Form.Label>رقم الهاتف *</Form.Label>
//               <Form.Control
//                 type="tel"
//                 placeholder="01XXXXXXXXX"
//                 value={customerInfo.phone}
//                 onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
//                 required
//                 disabled={isSubmitting}
//               />
//             </Form.Group>
            
//             <Form.Group className="mb-3">
//               <Form.Label>العنوان</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="العنوان التفصيلي للتوصيل"
//                 value={customerInfo.address}
//                 onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
//                 disabled={isSubmitting}
//               />
//             </Form.Group>
            
//             <Form.Group className="mb-3">
//               <Form.Label>ملاحظات إضافية</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 placeholder="أي ملاحظات أو تعليمات خاصة"
//                 value={customerInfo.notes}
//                 onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
//                 disabled={isSubmitting}
//               />
//             </Form.Group>
            
//             <div className="alert alert-info">
//               <h6>📋 ملخص الطلب:</h6>
//               <div className="d-flex justify-content-between">
//                 <span>عدد المنتجات:</span>
//                 <strong>{cartItems.length}</strong>
//               </div>
//               <div className="d-flex justify-content-between">
//                 <span>إجمالي القطع:</span>
//                 <strong>{totalItems} قطعة</strong>
//               </div>
//               <div className="d-flex justify-content-between mt-2">
//                 <span>المبلغ الإجمالي:</span>
//                 <strong className="h5 text-success">{totalPrice} ج.م</strong>
//               </div>
//             </div>
//           </Form>
//         )}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button 
//           variant="secondary" 
//           onClick={() => setShowOrderForm(false)}
//           disabled={isSubmitting}
//         >
//           إلغاء
//         </Button>
//         <Button 
//           variant="success" 
//           onClick={completeOrder}
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? (
//             <>
//               <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//               جاري المعالجة...
//             </>
//           ) : '✅ تأكيد الطلب'}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );

//   // Success Modal
//   const SuccessModal = () => (
//     <Modal show={orderSuccess !== null} onHide={resetOrderSuccess} centered>
//       <Modal.Header closeButton>
//         <Modal.Title>🎉 تم تأكيد طلبك بنجاح!</Modal.Title>
//       </Modal.Header>
//       <Modal.Body className="text-center">
//         <div className="mb-4">
//           <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
//             <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
//             <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
//           </svg>
//         </div>
        
//         <h5 className="mb-3">شكراً {orderSuccess?.customerName}!</h5>
        
//         <Card className="mb-4">
//           <Card.Body>
//             <p><strong>رقم الطلب:</strong> #{orderSuccess?.orderNumber}</p>
//             <p><strong>المبلغ الإجمالي:</strong> {totalPrice} ج.م</p>
//             <p><strong>حالة الطلب:</strong> <Badge bg="warning">قيد الانتظار</Badge></p>
//           </Card.Body>
//         </Card>
        
//         <Alert variant="info">
//           <p className="mb-0">
//             سنقوم بالاتصال بك على الرقم {customerInfo.phone} لتأكيد الطلب وتحديد موعد التوصيل.
//           </p>
//         </Alert>
        
//         <p className="text-muted">
//           يمكنك متابعة حالة طلبك من صفحة "طلباتي" إذا كنت مسجلاً دخولاً.
//         </p>
//       </Modal.Body>
//       <Modal.Footer className="justify-content-center">
//         <Button variant="primary" onClick={resetOrderSuccess} className="px-5">
//           العودة للتسوق
//         </Button>
//         <Button variant="outline-success" onClick={sendWhatsAppOrder}>
//           📱 مراسلة الواتساب
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );

//   if (orderSuccess) {
//     return <SuccessModal />;
//   }

//   if (cartItems.length === 0 && !orderSuccess) {
//     return (
//       <Container className="py-5">
//         <div className="text-center">
//           <h2>🛒 سلة التسوق</h2>
//           <Alert variant="info" className="mt-4">
//             <div className="mb-3">
//               <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
//                 <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
//               </svg>
//             </div>
//             <h4>السلة فارغة</h4>
//             <p>لم تقم بإضافة أي منتجات إلى السلة بعد.</p>
//             <Button variant="primary" onClick={() => router.push('/store')}>
//               ابدأ التسوق الآن
//             </Button>
//           </Alert>
//         </div>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-5">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>🛒 سلة التسوق</h2>
//         <div className="d-flex gap-2">
//           <Button variant="outline-primary" onClick={() => router.push('/store')}>
//             ← العودة للمتجر
//           </Button>
//           <Button variant="outline-danger" onClick={clearCart}>
//             🗑️ تفريغ السلة
//           </Button>
//         </div>
//       </div>

//       <Row>
//         <Col lg={8}>
//           <Card className="shadow-sm mb-4">
//             <Card.Header className="bg-light">
//               <h5 className="mb-0">📋 المنتجات المختارة ({cartItems.length})</h5>
//             </Card.Header>
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table hover>
//                   <thead className="table-light">
//                     <tr>
//                       <th>الصورة</th>
//                       <th>المنتج</th>
//                       <th>السعر</th>
//                       <th>الكمية</th>
//                       <th>المخزون</th>
//                       <th>المجموع</th>
//                       <th>إجراءات</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {cartItems.map((item) => (
//                       <tr key={item.id}>
//                         <td>
//                           <img
//                             src={item.image_url || item.image || "https://via.placeholder.com/50"}
//                             alt={item.name}
//                             style={{ 
//                               width: "60px", 
//                               height: "60px", 
//                               objectFit: "cover", 
//                               borderRadius: "8px",
//                               border: "1px solid #dee2e6"
//                             }}
//                             className="img-thumbnail"
//                           />
//                         </td>
//                         <td>
//                           <div>
//                             <strong>{item.name}</strong>
//                             {item.description && (
//                               <small className="d-block text-muted mt-1">
//                                 {item.description.length > 50 
//                                   ? `${item.description.substring(0, 50)}...` 
//                                   : item.description}
//                               </small>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           <strong>{item.price} ج.م</strong>
//                         </td>
//                         <td>
//                           <InputGroup style={{ width: "140px" }}>
//                             <Button
//                               variant="outline-secondary"
//                               size="sm"
//                               onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                               disabled={item.quantity <= 1}
//                             >
//                               -
//                             </Button>
//                             <Form.Control
//                               type="number"
//                               value={item.quantity}
//                               onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
//                               min="1"
//                               max={item.stock || 99}
//                               className="text-center"
//                               style={{ backgroundColor: '#f8f9fa' }}
//                             />
//                             <Button
//                               variant="outline-secondary"
//                               size="sm"
//                               onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                               disabled={item.stock !== undefined && item.quantity >= item.stock}
//                             >
//                               +
//                             </Button>
//                           </InputGroup>
//                         </td>
//                         <td>
//                           {item.stock !== undefined ? (
//                             item.quantity > item.stock ? (
//                               <Badge bg="danger">غير كافي</Badge>
//                             ) : item.stock < 10 ? (
//                               <Badge bg="warning">أقل من {item.stock}</Badge>
//                             ) : (
//                               <Badge bg="success">متوفر</Badge>
//                             )
//                           ) : (
//                             <Badge bg="secondary">غير محدد</Badge>
//                           )}
//                         </td>
//                         <td>
//                           <strong className="text-success">
//                             {item.price * item.quantity} ج.م
//                           </strong>
//                         </td>
//                         <td>
//                           <Button
//                             variant="outline-danger"
//                             size="sm"
//                             onClick={() => removeItem(item.id)}
//                             title="حذف المنتج"
//                           >
//                             🗑️ حذف
//                           </Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         <Col lg={4}>
//           <Card className="shadow-sm sticky-top" style={{ top: "100px" }}>
//             <Card.Header className="bg-light">
//               <h5 className="mb-0">💰 ملخص الطلب</h5>
//             </Card.Header>
//             <Card.Body>
//               <div className="mb-4">
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>عدد المنتجات:</span>
//                   <strong>{cartItems.length}</strong>
//                 </div>
//                 <div className="d-flex justify-content-between mb-2">
//                   <span>إجمالي القطع:</span>
//                   <strong>{totalItems} قطعة</strong>
//                 </div>
//                 <div className="d-flex justify-content-between mb-3 pt-2 border-top">
//                   <span className="h5">المبلغ الإجمالي:</span>
//                   <strong className="h4 text-success">{totalPrice} ج.م</strong>
//                 </div>
//               </div>
              
//               <div className="d-grid gap-3">
//                 <Button 
//                   variant="success" 
//                   size="lg" 
//                   className="py-3"
//                   onClick={handleCheckout}
//                   disabled={cartItems.length === 0}
//                 >
//                   <span className="d-flex align-items-center justify-content-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-lock me-2" viewBox="0 0 16 16">
//                       <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
//                     </svg>
//                     إتمام الطلب
//                   </span>
//                 </Button>
                
//                 <Button 
//                   variant="outline-success" 
//                   size="lg"
//                   className="py-3"
//                   onClick={sendWhatsAppOrder}
//                   disabled={cartItems.length === 0}
//                 >
//                   <span className="d-flex align-items-center justify-content-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp me-2" viewBox="0 0 16 16">
//                       <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
//                     </svg>
//                     إرسال للواتساب فقط
//                   </span>
//                 </Button>
                
//                 <Button 
//                   variant="outline-primary" 
//                   className="py-3"
//                   onClick={() => router.push('/store')}
//                 >
//                   <span className="d-flex align-items-center justify-content-center">
//                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle me-2" viewBox="0 0 16 16">
//                       <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
//                       <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
//                     </svg>
//                     متابعة التسوق
//                   </span>
//                 </Button>
//               </div>
              
//               <div className="mt-4 pt-3 border-top">
//                 <Alert variant="light" className="mb-0">
//                   <small className="d-block mb-1">🔒 معلومات الدفع:</small>
//                   <small className="text-muted">
//                     الدفع عند الاستلام فقط. لن يتم خصم أي مبلغ من حسابك مسبقاً.
//                   </small>
//                 </Alert>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Order Form Modal */}
//       <OrderFormModal />
      
//       {/* Order Success Modal (will be shown after order completion) */}
//       {orderSuccess && <SuccessModal />}
//     </Container>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import { 
  Container, 
  Table, 
  Button, 
  Card, 
  Row, 
  Col, 
  Alert, 
  InputGroup, 
  Form, 
  Modal,
  Badge,
  Spinner
} from "react-bootstrap";
import { useRouter } from "next/navigation";
import { supabase } from '/lib/supabaseClient'; // تأكد من مسار ملف supabase عندك

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // جلب محتويات السلة من localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    
    // جلب بيانات المستخدم إذا كان مسجل دخول
    fetchUserProfile();
  }, []);

  // دالة لجلب بيانات المستخدم من جدول profiles
  const fetchUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      
      // جلب بيانات المستخدم الحالي
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // جلب بيانات الـ profile من جدول profiles
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, email, phone, store_address')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        } else if (profile) {
          setUserProfile({
            name: profile.full_name || '',
            phone: profile.phone || '',
            address: profile.store_address || '',
            email: profile.email || ''
          });
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    if (confirm("هل تريد تفريغ السلة بالكامل؟")) {
      setCartItems([]);
      localStorage.setItem('cart', '[]');
    }
  };

  // الحسابات
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // دالة إرسال الطلب للواتساب
  const sendWhatsAppOrder = (customerName = "عميل", customerPhone = "") => {
    if (cartItems.length === 0) {
      alert("السلة فارغة! أضف بعض المنتجات أولاً.");
      return false;
    }

    // تحضير نص الطلب مع معلومات العميل
    const orderDetails = cartItems.map(item =>
      `📦 ${item.name}\n   الكمية: ${item.quantity} قطعة\n   السعر: ${item.price * item.quantity} ج.م`
    ).join('\n\n');

    const message = `🎯 *طلب جديد*\n
👤 *معلومات العميل:*\nالاسم: ${customerName}\nالهاتف: ${customerPhone}\n
🛒 *المنتجات:*\n${orderDetails}\n
💰 *الإجمالي:* ${totalPrice} ج.م\n📦 *عدد القطع:* ${totalItems}\n
🕒 *التاريخ:* ${new Date().toLocaleString('ar-EG')}`;

    // ترميز الرسالة للواتساب
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "201002955430"; // ⬅️ غير برقمك الحقيقي
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    return true;
  };

  // دالة حفظ الطلب في Supabase
  const saveOrderToSupabase = async () => {
    try {
      // احصل على معلومات المستخدم إذا كان مسجل دخول
      const { data: { user } } = await supabase.auth.getUser();
      
      // استخدام بيانات المستخدم من الـ profile إذا كان مسجل دخول
      const customerData = userProfile ? {
        name: userProfile.name,
        phone: userProfile.phone,
        address: userProfile.address
      } : {
        name: "عميل",
        phone: "غير محدد",
        address: "غير محدد"
      };

      // بيانات الطلب
      // const orderData = {
      //   user_id: user?.id || null,
      //   customer_name: customerData.name,
      //   customer_phone: customerData.phone,
      //   customer_address: customerData.address,
      //   items: JSON.stringify(cartItems.map(item => ({
      //     id: item.id,
      //     name: item.name,
      //     price: item.price,
      //     quantity: item.quantity,
      //     image_url: item.image_url || item.image,
      //     stock: item.stock || 0
      //   }))),
      //   total_price: totalPrice,
      //   total_items: totalItems,
      //   status: 'pending',
      //   notes: `طلب من ${user ? 'مستخدم مسجل' : 'زائر'}`,
      //   created_at: new Date().toISOString(),
      //   updated_at: new Date().toISOString()
      // };



          const orderData = {
      user_id: user?.id || null,
      customer_name: customerData.name,
      customer_phone: customerData.phone,
      customer_address: customerData.address,
      items: JSON.stringify(cartItems.map(item => ({
        id: item.id, // تأكد إن ده الـ ID الصحيح من جدول الـ products
        product_id: item.id, // حقل إضافي للبحث السهل
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image_url: item.image_url || item.image,
        stock: item.stock || 0
      }))),
      total_price: totalPrice,
      total_items: totalItems,
      status: 'pending',
      notes: customerData.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
      // إرسال الطلب
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return {
        order: data,
        customerData
      };
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };

  // دالة إتمام الطلب (وتجمع كل العمليات معاً)
  const completeOrder = async () => {
    if (cartItems.length === 0) {
      alert("السلة فارغة! أضف بعض المنتجات أولاً.");
      return;
    }

    // تحقق من المخزون
    if (!checkStockAvailability()) return;

    setIsSubmitting(true);
    
    try {
      // 1. احفظ الطلب في قاعدة البيانات
      const { order: savedOrder, customerData } = await saveOrderToSupabase();
      
      if (!savedOrder) {
        alert('حدث خطأ في حفظ الطلب');
        setIsSubmitting(false);
        return;
      }

      // 2. أرسل على الواتساب مع معلومات العميل
      const whatsappSent = sendWhatsAppOrder(customerData.name, customerData.phone);
      
      if (!whatsappSent) {
        console.warn('فشل إرسال الطلب للواتساب، لكن تم حفظه في قاعدة البيانات');
      }

      // 3. نظف السلة
      setCartItems([]);
      localStorage.setItem('cart', '[]');
      
      // 4. حفظ بيانات النجاح
      setOrderSuccess({
        orderId: savedOrder.id,
        orderNumber: savedOrder.id.slice(0, 8),
        customerName: customerData.name,
        customerPhone: customerData.phone,
        totalPrice: totalPrice
      });
      
    } catch (error) {
      console.error('Order completion error:', error);
      alert('❌ حدث خطأ في إتمام الطلب. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // تحقق من توفر المخزون
  const checkStockAvailability = () => {
    const outOfStockItems = cartItems.filter(item => 
      item.stock !== undefined && item.stock < item.quantity
    );
    
    if (outOfStockItems.length > 0) {
      alert(`بعض المنتجات غير متوفرة بالكمية المطلوبة:\n${outOfStockItems.map(item => `- ${item.name} (المتوفر: ${item.stock})`).join('\n')}`);
      return false;
    }
    return true;
  };

  // إعادة تعيين حالة النجاح
  const resetOrderSuccess = () => {
    setOrderSuccess(null);
    router.push('/store');
  };

  // زر إرسال للواتساب فقط (بدون حفظ في قاعدة البيانات)
  const sendWhatsAppOnly = () => {
    const customerData = userProfile ? {
      name: userProfile.name,
      phone: userProfile.phone
    } : {
      name: "عميل",
      phone: "غير محدد"
    };
    
    sendWhatsAppOrder(customerData.name, customerData.phone);
  };

  // Modal للطلب الناجح
  const SuccessModal = () => (
    <Modal show={orderSuccess !== null} onHide={resetOrderSuccess} centered>
      <Modal.Header closeButton>
        <Modal.Title>🎉 تم تأكيد طلبك بنجاح!</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="green" className="bi bi-check-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
          </svg>
        </div>
        
        <h5 className="mb-3">شكراً {orderSuccess?.customerName}!</h5>
        
        <Card className="mb-4">
          <Card.Body>
            <p><strong>📝 رقم الطلب:</strong> #{orderSuccess?.orderNumber}</p>
            <p><strong>💰 المبلغ الإجمالي:</strong> {orderSuccess?.totalPrice} ج.م</p>
            <p><strong>📞 رقم الهاتف:</strong> {orderSuccess?.customerPhone}</p>
            <p><strong>📊 حالة الطلب:</strong> <Badge bg="warning">قيد الانتظار</Badge></p>
          </Card.Body>
        </Card>
        
        <Alert variant="info">
          <p className="mb-0">
            ✅ تم حفظ طلبك في قاعدة البيانات.<br/>
            📱 تم إرسال الطلب للواتساب.<br/>
            📞 سنقوم بالاتصال بك قريباً.
          </p>
        </Alert>
        
        <p className="text-muted mt-3">
          يمكنك متابعة حالة طلبك من لوحة التحكم إذا كنت مسجلاً دخولاً.
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary" onClick={resetOrderSuccess} className="px-5">
          العودة للتسوق
        </Button>
        <Button 
          variant="outline-success" 
          onClick={() => {
            const customerData = userProfile ? {
              name: userProfile.name,
              phone: userProfile.phone
            } : {
              name: orderSuccess?.customerName,
              phone: orderSuccess?.customerPhone
            };
            sendWhatsAppOrder(customerData.name, customerData.phone);
          }}
        >
          📱 إعادة إرسال للواتساب
        </Button>
      </Modal.Footer>
    </Modal>
  );

  if (orderSuccess) {
    return <SuccessModal />;
  }

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <h2>🛒 سلة التسوق</h2>
          <Alert variant="info" className="mt-4">
            <div className="mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </div>
            <h4>السلة فارغة</h4>
            <p>لم تقم بإضافة أي منتجات إلى السلة بعد.</p>
            <Button variant="primary" onClick={() => router.push('/store')}>
              ابدأ التسوق الآن
            </Button>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🛒 سلة التسوق</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={() => router.push('/store')}>
            ← العودة للمتجر
          </Button>
          <Button variant="outline-danger" onClick={clearCart}>
            🗑️ تفريغ السلة
          </Button>
        </div>
      </div>

      {/* معلومات المستخدم إذا كان مسجل دخول */}
      {userProfile && (
        <Alert variant="info" className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>👤 {userProfile.name}</strong>
              <div className="text-muted">
                📞 {userProfile.phone} | 📍 {userProfile.address || 'لا يوجد عنوان'}
              </div>
              <small>سيتم استخدام بياناتك الشخصية لإتمام الطلب</small>
            </div>
            <Badge bg="success">مسجل دخول</Badge>
          </div>
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <h5 className="mb-0">📋 المنتجات المختارة ({cartItems.length})</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table hover>
                  <thead className="table-light">
                    <tr>
                      <th>الصورة</th>
                      <th>المنتج</th>
                      <th>السعر</th>
                      <th>الكمية</th>
                      <th>المخزون</th>
                      <th>المجموع</th>
                      <th>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={item.image_url || item.image || "https://via.placeholder.com/50"}
                            alt={item.name}
                            style={{ 
                              width: "60px", 
                              height: "60px", 
                              objectFit: "cover", 
                              borderRadius: "8px",
                              border: "1px solid #dee2e6"
                            }}
                            className="img-thumbnail"
                          />
                        </td>
                        <td>
                          <div>
                            <strong>{item.name}</strong>
                            {item.description && (
                              <small className="d-block text-muted mt-1">
                                {item.description.length > 50 
                                  ? `${item.description.substring(0, 50)}...` 
                                  : item.description}
                              </small>
                            )}
                          </div>
                        </td>
                        <td>
                          <strong>{item.price} ج.م</strong>
                        </td>
                        <td>
                          <InputGroup style={{ width: "140px" }}>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <Form.Control
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              min="1"
                              max={item.stock || 99}
                              className="text-center"
                              style={{ backgroundColor: '#f8f9fa' }}
                            />
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.stock !== undefined && item.quantity >= item.stock}
                            >
                              +
                            </Button>
                          </InputGroup>
                        </td>
                        <td>
                          {item.stock !== undefined ? (
                            item.quantity > item.stock ? (
                              <Badge bg="danger">غير كافي</Badge>
                            ) : item.stock < 10 ? (
                              <Badge bg="warning">أقل من {item.stock}</Badge>
                            ) : (
                              <Badge bg="success">متوفر</Badge>
                            )
                          ) : (
                            <Badge bg="secondary">غير محدد</Badge>
                          )}
                        </td>
                        <td>
                          <strong className="text-success">
                            {item.price * item.quantity} ج.م
                          </strong>
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            title="حذف المنتج"
                          >
                            🗑️ حذف
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: "100px" }}>
            <Card.Header className="bg-light">
              <h5 className="mb-0">💰 ملخص الطلب</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span>عدد المنتجات:</span>
                  <strong>{cartItems.length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>إجمالي القطع:</span>
                  <strong>{totalItems} قطعة</strong>
                </div>
                <div className="d-flex justify-content-between mb-3 pt-2 border-top">
                  <span className="h5">المبلغ الإجمالي:</span>
                  <strong className="h4 text-success">{totalPrice} ج.م</strong>
                </div>
              </div>
              
              <div className="d-grid gap-3">
                <Button 
                  variant="success" 
                  size="lg" 
                  className="py-3"
                  onClick={completeOrder}
                  disabled={cartItems.length === 0 || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" className="me-2" />
                      جاري إتمام الطلب...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle me-2" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                      </svg>
                      إتمام الطلب
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline-success" 
                  size="lg"
                  className="py-3"
                  onClick={sendWhatsAppOnly}
                  disabled={cartItems.length === 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp me-2" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                  إرسال للواتساب فقط
                </Button>
                
                <Button 
                  variant="outline-primary" 
                  className="py-3"
                  onClick={() => router.push('/store')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-circle me-2" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                  </svg>
                  متابعة التسوق
                </Button>
              </div>
              
              <div className="mt-4 pt-3 border-top">
                <Alert variant="light" className="mb-0">
                  <small className="d-block mb-1">ℹ️ معلومات الطلب:</small>
                  <small className="text-muted">
                    {userProfile 
                      ? "سيتم استخدام بياناتك المسجلة لإتمام الطلب." 
                      : "يمكنك تسجيل الدخول لحفظ بياناتك لتسريع الطلبات القادمة."}
                  </small>
                  <br />
                  <small className="text-muted">
                    الدفع عند الاستلام فقط. لن يتم خصم أي مبلغ من حسابك مسبقاً.
                  </small>
                </Alert>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order Success Modal */}
      {orderSuccess && <SuccessModal />}
    </Container>
  );
}