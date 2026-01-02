

// "use client";
// import { useState, useEffect, useRef } from "react";
// import { 
//   Container, 
//   Table, 
//   Button, 
//   Badge, 
//   Modal, 
//   Alert, 
//   Card, 
//   Dropdown,
//   Row,
//   Col,
//   Spinner,
//   Form
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { useRouter } from "next/navigation";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [error, setError] = useState(null);
//   const [printOrder, setPrintOrder] = useState(null);
//   const printRef = useRef();
//   const router = useRouter();

//   useEffect(() => {
//     // التحقق من إذا المستخدم أدمن
//     const loggedIn = localStorage.getItem("isAdmin");
//     if (loggedIn !== "true") {
//       router.push("/dashboard/login");
//     } else {
//       setIsAdmin(true);
//       fetchOrders();
//     }
//   }, [router]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const { data, error: ordersError } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (ordersError) throw ordersError;
//       setOrders(data || []);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError(`خطأ في جلب الطلبات: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("isAdmin");
//     router.push("/dashboard/login");
//   };

//   // دالة لتحديث المخزون عند تأكيد الطلب
//   const updateProductStock = async (orderId, items) => {
//     try {
//       console.log("📦 Updating stock for order:", orderId);
      
//       for (const item of items) {
//         // جلب المخزون الحالي للمنتج
//         const { data: product, error: productError } = await supabase
//           .from('products')
//           .select('stock')
//           .eq('id', item.id)
//           .single();
        
//         if (productError) {
//           console.error(`Error fetching product ${item.id}:`, productError);
//           continue;
//         }
        
//         // حساب المخزون الجديد
//         const newStock = (product.stock || 0) - item.quantity;
        
//         // تحديث المخزون
//         const { error: updateError } = await supabase
//           .from('products')
//           .update({ 
//             stock: newStock >= 0 ? newStock : 0,
//             updated_at: new Date().toISOString()
//           })
//           .eq('id', item.id);
        
//         if (updateError) {
//           console.error(`Error updating stock for product ${item.id}:`, updateError);
//         } else {
//           console.log(`✅ Updated stock for ${item.name}: ${product.stock} → ${newStock}`);
//         }
//       }
//     } catch (error) {
//       console.error("Error in updateProductStock:", error);
//     }
//   };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       // جلب الطلب الحالي
//       const currentOrder = orders.find(o => o.id === orderId);
//       if (!currentOrder) {
//         alert('الطلب غير موجود');
//         return;
//       }

//       const updateData = { 
//         status, 
//         updated_at: new Date().toISOString() 
//       };

//       // إذا كانت الحالة الجديدة هي confirmed وكانت القديمة ليست confirmed
//       if (status === 'confirmed' && currentOrder.status !== 'confirmed') {
//         const items = JSON.parse(currentOrder.items || '[]');
//         await updateProductStock(orderId, items);
//       }

//       const { error } = await supabase
//         .from('orders')
//         .update(updateData)
//         .eq('id', orderId);

//       if (error) throw error;
      
//       fetchOrders();
//       alert(`✅ تم تحديث حالة الطلب إلى "${getStatusText(status)}"`);
//     } catch (error) {
//       console.error('Error updating order:', error);
//       alert(`❌ حدث خطأ: ${error.message}`);
//     }
//   };

//   const getStatusText = (status) => {
//     const statusMap = {
//       pending: 'قيد الانتظار',
//       confirmed: 'تم التأكيد',
//       processing: 'قيد التجهيز',
//       shipped: 'تم الشحن',
//       delivered: 'تم التسليم',
//       cancelled: 'ملغي'
//     };
//     return statusMap[status] || status;
//   };

//   const viewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowModal(true);
//   };

//   const deleteOrder = async (orderId) => {
//     if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
//     try {
//       const { error } = await supabase
//         .from('orders')
//         .delete()
//         .eq('id', orderId);

//       if (error) throw error;
      
//       fetchOrders();
//       alert('✅ تم حذف الطلب بنجاح');
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       alert(`❌ حدث خطأ: ${error.message}`);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statuses = {
//       pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
//       confirmed: { variant: 'success', text: '✅ تم التأكيد' },
//       processing: { variant: 'info', text: '🔄 قيد التجهيز' },
//       shipped: { variant: 'primary', text: '🚚 تم الشحن' },
//       delivered: { variant: 'success', text: '🎉 تم التسليم' },
//       cancelled: { variant: 'danger', text: '❌ ملغي' }
//     };
    
//     const statusInfo = statuses[status] || { variant: 'secondary', text: status };
//     return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
//   };

//   const preparePrint = (order) => {
//     setPrintOrder(order);
//     setTimeout(() => {
//       window.print();
//     }, 100);
//   };

//   const PrintInvoice = () => {
//     if (!printOrder) return null;
    
//     const items = JSON.parse(printOrder.items || '[]');
//     const orderDate = new Date(printOrder.created_at).toLocaleString('ar-EG');
    
//     return (
//       <div className="d-none d-print-block" ref={printRef}>
//         <style>
//           {`
//             @media print {
//               body * {
//                 visibility: hidden;
//               }
//               #print-section, #print-section * {
//                 visibility: visible;
//               }
//               #print-section {
//                 position: absolute;
//                 left: 0;
//                 top: 0;
//                 width: 100%;
//                 font-family: 'Arial', sans-serif;
//               }
//             }
//           `}
//         </style>
        
//         <div id="print-section" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//           {/* Header */}
//           <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
//             <h1 style={{ margin: 0, color: '#2c3e50' }}>فاتورة طلب</h1>
//             <h3 style={{ margin: '10px 0', color: '#3498db' }}>متجرك الإلكتروني</h3>
//             <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
//               📞 الهاتف: 01234567890 | 📧 البريد: store@example.com
//             </p>
//           </div>
          
//           {/* Order Info */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
//             <div>
//               <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات الطلب:</h4>
//               <p style={{ margin: '5px 0' }}><strong>رقم الطلب:</strong> #{printOrder.id.slice(0, 8)}</p>
//               <p style={{ margin: '5px 0' }}><strong>تاريخ الطلب:</strong> {orderDate}</p>
//               <p style={{ margin: '5px 0' }}><strong>حالة الطلب:</strong> {getStatusText(printOrder.status)}</p>
//             </div>
            
//             <div style={{ textAlign: 'right' }}>
//               <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات العميل:</h4>
//               <p style={{ margin: '5px 0' }}><strong>الاسم:</strong> {printOrder.customer_name || 'زائر'}</p>
//               <p style={{ margin: '5px 0' }}><strong>الهاتف:</strong> {printOrder.customer_phone || 'غير محدد'}</p>
//               <p style={{ margin: '5px 0' }}><strong>العنوان:</strong> {printOrder.customer_address || 'غير محدد'}</p>
//             </div>
//           </div>
          
//           {/* Products Table */}
//           <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>المنتجات:</h4>
//           <table style={{ 
//             width: '100%', 
//             borderCollapse: 'collapse', 
//             marginBottom: '30px',
//             border: '1px solid #ddd'
//           }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f8f9fa' }}>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>#</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>المنتج</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>السعر</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>الكمية</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>المجموع</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, index) => (
//                 <tr key={index}>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{index + 1}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>{item.name}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.price} ج.م</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
//                     {item.price * item.quantity} ج.م
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {/* Summary */}
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between',
//             marginTop: '30px',
//             paddingTop: '20px',
//             borderTop: '2px dashed #ddd'
//           }}>
//             <div>
//               <h4 style={{ color: '#2c3e50' }}>ملاحظات:</h4>
//               <p style={{ color: '#7f8c8d' }}>{printOrder.notes || 'لا توجد ملاحظات'}</p>
//             </div>
            
//             <div style={{ textAlign: 'left' }}>
//               <div style={{ marginBottom: '10px' }}>
//                 <span style={{ display: 'inline-block', width: '150px' }}>عدد القطع:</span>
//                 <strong>{printOrder.total_items || 0}</strong>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <span style={{ display: 'inline-block', width: '150px' }}>الإجمالي:</span>
//                 <strong style={{ fontSize: '18px', color: '#27ae60' }}>{printOrder.total_price || 0} ج.م</strong>
//               </div>
//             </div>
//           </div>
          
//           {/* Footer */}
//           <div style={{ 
//             marginTop: '50px', 
//             textAlign: 'center', 
//             paddingTop: '20px',
//             borderTop: '2px solid #333',
//             color: '#7f8c8d'
//           }}>
//             <p>شكراً لتعاملكم معنا</p>
//             <p>للاستفسار: 01234567890 | www.yourstore.com</p>
//             <p style={{ fontSize: '12px', marginTop: '20px' }}>
//               تاريخ الطباعة: {new Date().toLocaleString('ar-EG')}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // إحصائيات
//   const stats = {
//     total: orders.length,
//     pending: orders.filter(o => o.status === 'pending').length,
//     confirmed: orders.filter(o => o.status === 'confirmed').length,
//     revenue: orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
//   };

//   if (!isAdmin) {
//     return (
//       <Container className="py-5">
//         <div className="text-center">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">جارٍ التحميل...</span>
//           </Spinner>
//           <p className="mt-2">جارٍ التحقق من الصلاحية...</p>
//         </div>
//       </Container>
//     );
//   }

//   if (loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">جاري التحميل...</span>
//         </Spinner>
//         <p className="mt-2">جاري تحميل الطلبات...</p>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <PrintInvoice />
      
//       <Container className="py-4">
//         {/* Header */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h2>📋 لوحة إدارة الطلبات</h2>
//             <p className="text-muted">مرحباً بك في لوحة التحكم</p>
//           </div>
//           <div className="d-flex gap-2">
//             <Button variant="outline-primary" onClick={fetchOrders}>
//               🔄 تحديث
//             </Button>
//             <Button variant="outline-danger" onClick={handleLogout}>
//               🚪 تسجيل خروج
//             </Button>
//           </div>
//         </div>

//         {/* رسائل الخطأ */}
//         {error && (
//           <Alert variant="danger" className="mb-4">
//             <Alert.Heading>⚠️ خطأ</Alert.Heading>
//             <p>{error}</p>
//             <hr />
//             <div className="d-flex justify-content-end">
//               <Button variant="outline-danger" onClick={() => setError(null)}>
//                 إغلاق
//               </Button>
//             </div>
//           </Alert>
//         )}

//         {/* إحصائيات */}
//         <Row className="mb-4">
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>🕒 قيد الانتظار</Card.Title>
//                 <h3 className={stats.pending > 0 ? 'text-warning' : 'text-muted'}>
//                   {stats.pending}
//                 </h3>
//                 <small className="text-muted">طلبات تحتاج مراجعة</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>✅ مؤكدة</Card.Title>
//                 <h3 className="text-success">{stats.confirmed}</h3>
//                 <small className="text-muted">طلبات تم تأكيدها</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>💰 إجمالي المبيعات</Card.Title>
//                 <h3 className="text-primary">{stats.revenue} ج.م</h3>
//                 <small className="text-muted">قيمة الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>📦 كل الطلبات</Card.Title>
//                 <h3 className="text-info">{stats.total}</h3>
//                 <small className="text-muted">إجمالي الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* جدول الطلبات */}
//         {orders.length > 0 ? (
//           <Card className="shadow-sm">
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table hover className="align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th>#</th>
//                       <th>العميل</th>
//                       <th>التاريخ</th>
//                       <th>المبلغ</th>
//                       <th>القطع</th>
//                       <th>الحالة</th>
//                       <th>الإجراءات</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((order, index) => (
//                       <tr key={order.id}>
//                         <td>
//                           <strong>#{order.id?.slice(0, 8) || 'N/A'}</strong>
//                           <br />
//                           <small className="text-muted">{index + 1}</small>
//                         </td>
//                         <td>
//                           <div>
//                             <strong>{order.customer_name || 'زائر'}</strong>
//                             <br />
//                             <small>{order.customer_phone || 'لا يوجد'}</small>
//                           </div>
//                         </td>
//                         <td>
//                           {order.created_at ? (
//                             <>
//                               {new Date(order.created_at).toLocaleDateString('ar-EG')}
//                               <br />
//                               <small>{new Date(order.created_at).toLocaleTimeString('ar-EG')}</small>
//                             </>
//                           ) : 'غير محدد'}
//                         </td>
//                         <td>
//                           <strong className="text-success">{order.total_price || 0} ج.م</strong>
//                         </td>
//                         <td>
//                           <Badge bg="info">{order.total_items || 0}</Badge>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center gap-2">
//                             {getStatusBadge(order.status || 'pending')}
//                             <Dropdown>
//                               <Dropdown.Toggle variant="outline-secondary" size="sm" id="status-dropdown">
//                                 تغيير
//                               </Dropdown.Toggle>
//                               <Dropdown.Menu>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'pending')}>
//                                   قيد الانتظار
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'confirmed')}>
//                                   تأكيد
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'processing')}>
//                                   تجهيز
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'shipped')}>
//                                   شحن
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'delivered')}>
//                                   تسليم
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'cancelled')}>
//                                   إلغاء
//                                 </Dropdown.Item>
//                               </Dropdown.Menu>
//                             </Dropdown>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="d-flex gap-2 flex-wrap">
//                             <Button 
//                               size="sm" 
//                               variant={order.status === 'confirmed' ? 'success' : 'outline-success'}
//                               onClick={() => updateOrderStatus(order.id, 'confirmed')}
//                               disabled={order.status === 'confirmed'}
//                             >
//                               {order.status === 'confirmed' ? '✅ مؤكد' : 'تأكيد'}
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-info" 
//                               onClick={() => viewOrderDetails(order)}
//                             >
//                               عرض
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-primary" 
//                               onClick={() => preparePrint(order)}
//                             >
//                               🖨️ طباعة
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-danger" 
//                               onClick={() => deleteOrder(order.id)}
//                             >
//                               حذف
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         ) : (
//           <Card className="shadow-sm">
//             <Card.Body className="text-center py-5">
//               <div className="mb-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#6c757d" className="bi bi-inbox" viewBox="0 0 16 16">
//                   <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
//                 </svg>
//               </div>
//               <h5>لا توجد طلبات</h5>
//               <p className="text-muted mb-0">لم يتم تسجيل أي طلبات حتى الآن</p>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Modal للتفاصيل */}
//         <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//           <Modal.Header closeButton>
//             <Modal.Title>
//               تفاصيل الطلب #{selectedOrder?.id?.slice(0, 8) || 'N/A'}
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedOrder && (
//               <div>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <h5>👤 معلومات العميل:</h5>
//                     <p><strong>الاسم:</strong> {selectedOrder.customer_name || 'زائر'}</p>
//                     <p><strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}</p>
//                     <p><strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}</p>
//                   </Col>
//                   <Col md={6}>
//                     <h5>📄 معلومات الطلب:</h5>
//                     <p><strong>التاريخ:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                     <p><strong>الحالة:</strong> {getStatusBadge(selectedOrder.status || 'pending')}</p>
//                     <p><strong>آخر تحديث:</strong> {selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                   </Col>
//                 </Row>

//                 <hr />

//                 <h5>🛒 المنتجات:</h5>
//                 {selectedOrder.items ? (
//                   <Table responsive bordered className="mt-3">
//                     <thead className="table-light">
//                       <tr>
//                         <th>#</th>
//                         <th>المنتج</th>
//                         <th>السعر</th>
//                         <th>الكمية</th>
//                         <th>المجموع</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {JSON.parse(selectedOrder.items).map((item, index) => (
//                         <tr key={index}>
//                           <td>{index + 1}</td>
//                           <td>{item.name || 'منتج غير محدد'}</td>
//                           <td>{item.price || 0} ج.م</td>
//                           <td>{item.quantity || 0}</td>
//                           <td>{(item.price || 0) * (item.quantity || 0)} ج.م</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 ) : (
//                   <Alert variant="warning">لا توجد معلومات عن المنتجات</Alert>
//                 )}

//                 <div className="text-end mt-3">
//                   <h5>📊 ملخص:</h5>
//                   <p><strong>عدد القطع:</strong> {selectedOrder.total_items || 0}</p>
//                   <p><strong>الإجمالي:</strong> {selectedOrder.total_price || 0} ج.م</p>
//                 </div>

//                 {selectedOrder.notes && (
//                   <>
//                     <hr />
//                     <h5>📝 ملاحظات:</h5>
//                     <p>{selectedOrder.notes}</p>
//                   </>
//                 )}

//                 {/* أزرار إضافية في المودال */}
//                 <div className="d-flex gap-2 mt-4 pt-3 border-top">
//                   <Button 
//                     variant={selectedOrder.status === 'confirmed' ? 'success' : 'outline-success'}
//                     onClick={() => {
//                       updateOrderStatus(selectedOrder.id, 'confirmed');
//                       setShowModal(false);
//                     }}
//                     disabled={selectedOrder.status === 'confirmed'}
//                   >
//                     {selectedOrder.status === 'confirmed' ? '✅ تم التأكيد' : 'تأكيد الطلب'}
//                   </Button>
//                   <Button 
//                     variant="outline-primary" 
//                     onClick={() => {
//                       setShowModal(false);
//                       preparePrint(selectedOrder);
//                     }}
//                   >
//                     🖨️ طباعة الفاتورة
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               إغلاق
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     </>
//   );
// }


// "use client";
// import { useState, useEffect, useRef } from "react";
// import { 
//   Container, 
//   Table, 
//   Button, 
//   Badge, 
//   Modal, 
//   Alert, 
//   Card, 
//   Dropdown,
//   Row,
//   Col,
//   Spinner,
//   Form
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { useRouter } from "next/navigation";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [error, setError] = useState(null);
//   const [printOrder, setPrintOrder] = useState(null);
//   const [updatingStatus, setUpdatingStatus] = useState({});
//   const printRef = useRef();
//   const router = useRouter();

//   useEffect(() => {
//     // التحقق من إذا المستخدم أدمن
//     const loggedIn = localStorage.getItem("isAdmin");
//     if (loggedIn !== "true") {
//       router.push("/dashboard/login");
//     } else {
//       setIsAdmin(true);
//       fetchOrders();
//     }
//   }, [router]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const { data, error: ordersError } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (ordersError) throw ordersError;
//       setOrders(data || []);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError(`خطأ في جلب الطلبات: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("isAdmin");
//     router.push("/dashboard/login");
//   };

//   // دالة مساعدة لتحويل أي قيمة لـ UUID صحيح
//   const parseProductId = (id) => {
//     if (!id) {
//       console.warn("Product ID is null or undefined");
//       return null;
//     }
    
//     // إذا كان ID رقم، حوله لسلسلة
//     if (typeof id === 'number') {
//       return id.toString();
//     }
    
//     // إذا كان UUID بدون شرطات، أضفهم
//     if (typeof id === 'string') {
//       // تنظيف الـ ID من أي مسافات
//       const cleanId = id.trim();
      
//       // إذا كان طوله 32 حرف (UUID بدون شرطات)
//       if (cleanId.length === 32 && !cleanId.includes('-')) {
//         const uuidPattern = /^[0-9a-f]{32}$/i;
//         if (uuidPattern.test(cleanId)) {
//           return `${cleanId.slice(0, 8)}-${cleanId.slice(8, 12)}-${cleanId.slice(12, 16)}-${cleanId.slice(16, 20)}-${cleanId.slice(20, 32)}`;
//         }
//       }
      
//       // إذا كان ID موجود في جدول products، استخدمه كما هو
//       return cleanId;
//     }
    
//     console.warn("Invalid product ID type:", typeof id, id);
//     return null;
//   };


//   // دالة لتحديث المخزون عند تأكيد الطلب
// //   const updateProductStock = async (orderId, items) => {
// //     try {
// //       console.log("📦 Starting stock update for order:", orderId);
// //       console.log("Items to update:", items);
      
// //       const stockUpdates = [];
      
// //       for (const item of items) {
// //         // تحقق من وجود الـ ID
// //         if (!item.id) {
// //           console.error("❌ Item missing ID:", item);
// //           continue;
// //         }
        
// //         // تحويل الـ ID لصيغة صحيحة
// //         const productId = parseProductId(item.id);
// //         if (!productId) {
// //           console.error("❌ Invalid product ID:", item.id);
// //           continue;
// //         }
        
// //         console.log(`🔍 Processing product: ${productId} (${item.name})`);
        
// //         try {
// //           // جلب المخزون الحالي للمنتج باستخدام eq أو ilike للبحث المرن
// //           const { data: product, error: productError } = await supabase
// //             .from('products')
// //             .select('id, name, stock')
// //             .or(`id.eq.${productId},id.ilike.%${productId}%`)
// //             .maybeSingle();
          
// //           if (productError) {
// //             console.error(`❌ Error fetching product ${productId}:`, productError);
// //             continue;
// //           }
          
// //           if (!product) {
// //             console.warn(`⚠️ Product not found: ${productId}`);
// //             // حاول البحث بالاسم
// //             const { data: productByName } = await supabase
// //               .from('products')
// //               .select('id, name, stock')
// //               .ilike('name', `%${item.name}%`)
// //               .maybeSingle();
            
// //             if (productByName) {
// //               console.log(`✅ Found product by name: ${productByName.name}`);
// //               stockUpdates.push({
// //                 id: productByName.id,
// //                 name: productByName.name,
// //                 oldStock: productByName.stock || 0,
// //                 newStock: (productByName.stock || 0) - item.quantity,
// //                 quantity: item.quantity
// //               });
// //             } else {
// //               console.warn(`⚠️ Product not found by ID or name: ${item.name}`);
// //             }
// //             continue;
// //           }
          
// //           console.log(`✅ Found product: ${product.name}, Stock: ${product.stock}`);
          
// //           stockUpdates.push({
// //             id: product.id,
// //             name: product.name,
// //             oldStock: product.stock || 0,
// //             newStock: (product.stock || 0) - item.quantity,
// //             quantity: item.quantity
// //           });
          
// //         } catch (fetchError) {
// //           console.error(`❌ Error processing product ${productId}:`, fetchError);
// //           continue;
// //         }
// //       }
      
// //       // تحديث المخزون لكل المنتجات
// //       for (const update of stockUpdates) {
// //         if (update.newStock < 0) {
// //           console.warn(`⚠️ Stock would be negative for ${update.name}, setting to 0`);
// //           update.newStock = 0;
// //         }
        
// //         try {
// //           const { error: updateError } = await supabase
// //             .from('products')
// //             .update({ 
// //               stock: update.newStock,
// //               updated_at: new Date().toISOString()
// //             })
// //             .eq('id', update.id);
          
// //           if (updateError) {
// //             console.error(`❌ Error updating stock for ${update.name}:`, updateError);
// //           } else {
// //             console.log(`✅ Updated ${update.name}: ${update.oldStock} → ${update.newStock}`);
// //           }
// //         } catch (updateError) {
// //           console.error(`❌ Exception updating ${update.name}:`, updateError);
// //         }
// //       }
      
// //       console.log("✅ Stock update completed successfully");
// //       return stockUpdates;
      
// //     } catch (error) {
// //       console.error("💥 Error in updateProductStock:", error);
// //       throw error;
// //     }
// //   };


// // دالة لتحديث المخزون عند تأكيد الطلب
// const updateProductStock = async (orderId, items) => {
//   try {
//     console.log("📦 Starting stock update for order:", orderId);
//     console.log("Items to update:", items);
    
//     const stockUpdates = [];
    
//     // Strategy 1: البحث بـ ID مباشرة
//     for (const item of items) {
//       if (!item.id) {
//         console.error("❌ Item missing ID:", item);
//         continue;
//       }
      
//       console.log(`🔍 Searching for product ID: ${item.id} (${item.name})`);
      
//       // محاولة البحث بأكثر من طريقة
//       let product = null;
      
//       // الطريقة 1: البحث بالـ ID المباشر
//       const { data: byId, error: idError } = await supabase
//         .from('products')
//         .select('id, name, stock, number') // أضف column number
//         .eq('id', item.id)
//         .maybeSingle();
      
//       if (!idError && byId) {
//         product = byId;
//         console.log(`✅ Found by direct ID: ${product.name}`);
//       } else {
//         // الطريقة 2: البحث بـ column "number" إذا كان موجود
//         const { data: byNumber, error: numberError } = await supabase
//           .from('products')
//           .select('id, name, stock, number')
//           .eq('number', item.id.toString())
//           .maybeSingle();
        
//         if (!numberError && byNumber) {
//           product = byNumber;
//           console.log(`✅ Found by number field: ${product.name}`);
//         } else {
//           // الطريقة 3: البحث بالاسم
//           const { data: byName, error: nameError } = await supabase
//             .from('products')
//             .select('id, name, stock')
//             .ilike('name', `%${item.name}%`)
//             .maybeSingle();
          
//           if (!nameError && byName) {
//             product = byName;
//             console.log(`✅ Found by name: ${product.name}`);
//           }
//         }
//       }
      
//       if (!product) {
//         console.warn(`⚠️ Product not found: ID=${item.id}, Name=${item.name}`);
//         continue;
//       }
      
//       // تأكد من وجود مخزون
//       const currentStock = product.stock || 0;
//       const newStock = currentStock - item.quantity;
      
//       stockUpdates.push({
//         id: product.id,
//         name: product.name,
//         oldStock: currentStock,
//         newStock: newStock >= 0 ? newStock : 0,
//         quantity: item.quantity,
//         productNumber: product.number
//       });
//     }
    
//     // تحديث المخزون
//     for (const update of stockUpdates) {
//       try {
//         const { error: updateError } = await supabase
//           .from('products')
//           .update({ 
//             stock: update.newStock,
//             updated_at: new Date().toISOString()
//           })
//           .eq('id', update.id);
        
//         if (updateError) {
//           console.error(`❌ Error updating stock for ${update.name}:`, updateError);
//         } else {
//           console.log(`✅ Updated ${update.name} (${update.productNumber}): ${update.oldStock} → ${update.newStock}`);
          
//           // تسجيل تحديث المخزون في جدول منفصل (اختياري)
//           await supabase
//             .from('stock_logs')
//             .insert({
//               product_id: update.id,
//               product_name: update.name,
//               order_id: orderId,
//               old_stock: update.oldStock,
//               new_stock: update.newStock,
//               quantity: update.quantity,
//               change_type: 'order_confirmation',
//               created_at: new Date().toISOString()
//             });
//         }
//       } catch (updateError) {
//         console.error(`❌ Exception updating ${update.name}:`, updateError);
//       }
//     }
    
//     console.log(`✅ Stock update completed: ${stockUpdates.length} products updated`);
//     return stockUpdates;
    
//   } catch (error) {
//     console.error("💥 Error in updateProductStock:", error);
//     throw error;
//   }
// };


// // دالة لفحص وتصحيح بيانات الطلبات
// const debugOrderItems = async () => {
//   console.log("🔍 Debugging all orders...");
  
//   for (const order of orders) {
//     console.log(`\n📋 Order: ${order.id.slice(0, 8)} - ${order.customer_name}`);
    
//     try {
//       const items = JSON.parse(order.items || '[]');
//       console.log(`Items count: ${items.length}`);
      
//       for (const item of items) {
//         console.log(`  Product: ${item.name} | ID: ${item.id} | Type: ${typeof item.id}`);
        
//         // محاولة البحث عن المنتج في قاعدة البيانات
//         const { data: product } = await supabase
//           .from('products')
//           .select('id, name, stock, number')
//           .or(`id.eq.${item.id},number.eq.${item.id}`)
//           .maybeSingle();
        
//         if (product) {
//           console.log(`  ✅ Found in DB: ID=${product.id}, Number=${product.number}, Stock=${product.stock}`);
//         } else {
//           console.log(`  ❌ Not found in DB with ID/number: ${item.id}`);
//         }
//       }
//     } catch (error) {
//       console.error(`  ❌ Error parsing items: ${error.message}`);
//     }
//   }
// };

// // أضف زر للتصحيح في الـ UI
// <Button 
//   variant="outline-warning" 
//   size="sm" 
//   onClick={debugOrderItems}
//   className="mb-3"
// >
//   🐞 تصحيح بيانات المنتجات
// </Button>

// // دالة لإصلاح الطلبات القديمة
// const fixOldOrders = async () => {
//   if (!confirm('هل تريد إصلاح بيانات الطلبات القديمة؟')) return;
  
//   try {
//     console.log("🛠️ Fixing old orders...");
    
//     for (const order of orders) {
//       if (order.status === 'pending') continue;
      
//       try {
//         const items = JSON.parse(order.items || '[]');
//         const updatedItems = [];
//         let anyFixed = false;
        
//         for (const item of items) {
//           // إذا كان الـ ID رقم، حاول تجد المنتج
//           if (typeof item.id === 'number' || /^\d+$/.test(item.id)) {
//             const productId = item.id.toString();
            
//             // البحث في الـ products
//             const { data: product } = await supabase
//               .from('products')
//               .select('id, name')
//               .or(`number.eq.${productId},id.eq.${productId}`)
//               .maybeSingle();
            
//             if (product) {
//               console.log(`✅ Fixed item: ${item.name} (${item.id} → ${product.id})`);
//               updatedItems.push({
//                 ...item,
//                 id: product.id,
//                 original_id: item.id // حفظ الـ ID الأصلي
//               });
//               anyFixed = true;
//             } else {
//               updatedItems.push(item);
//             }
//           } else {
//             updatedItems.push(item);
//           }
//         }
        
//         // إذا تم إصلاح أي منتج، تحديث الطلب
//         if (anyFixed) {
//           const { error } = await supabase
//             .from('orders')
//             .update({
//               items: JSON.stringify(updatedItems),
//               updated_at: new Date().toISOString()
//             })
//             .eq('id', order.id);
          
//           if (!error) {
//             console.log(`✅ Updated order ${order.id.slice(0, 8)}`);
//           }
//         }
//       } catch (error) {
//         console.error(`❌ Error fixing order ${order.id}:`, error);
//       }
//     }
    
//     alert('✅ تم إصلاح الطلبات القديمة');
//     fetchOrders();
//   } catch (error) {
//     console.error('Error in fixOldOrders:', error);
//     alert('❌ حدث خطأ في الإصلاح');
//   }
// };

//   const updateOrderStatus = async (orderId, status) => {
//     try {
//       setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      
//       // جلب الطلب الحالي
//       const currentOrder = orders.find(o => o.id === orderId);
//       if (!currentOrder) {
//         alert('الطلب غير موجود');
//         return;
//       }

//       console.log(`🔄 Updating order ${orderId} to status: ${status}`);
      
//       // إذا كانت الحالة الجديدة هي confirmed وكانت القديمة ليست confirmed
//       if (status === 'confirmed' && currentOrder.status !== 'confirmed') {
//         console.log("🛒 Processing stock update...");
        
//         try {
//           // محاولة تحليل الـ items
//           let items = [];
//           try {
//             items = JSON.parse(currentOrder.items || '[]');
//             console.log("Parsed items:", items);
//           } catch (parseError) {
//             console.error("❌ Error parsing items:", parseError);
//             // حاول معالجة الـ items كـ string مباشرة
//             if (typeof currentOrder.items === 'string') {
//               items = [{
//                 id: 'default',
//                 name: 'منتج',
//                 quantity: currentOrder.total_items || 1,
//                 price: currentOrder.total_price || 0
//               }];
//             }
//           }
          
//           // تحديث المخزون
//           const stockResult = await updateProductStock(orderId, items);
//           console.log("Stock update result:", stockResult);
//         } catch (stockError) {
//           console.error("❌ Stock update failed:", stockError);
//           // أكمل مع تحديث حالة الطلب حتى لو فشل تحديث المخزون
//         }
//       }

//       const updateData = { 
//         status, 
//         updated_at: new Date().toISOString() 
//       };

//       console.log("📝 Updating order data:", updateData);
      
//       const { error } = await supabase
//         .from('orders')
//         .update(updateData)
//         .eq('id', orderId);

//       if (error) {
//         console.error("❌ Supabase update error:", error);
//         throw error;
//       }
      
//       // تحديث الـ state محلياً
//       setOrders(prev => prev.map(order => 
//         order.id === orderId ? { ...order, ...updateData } : order
//       ));
      
//       alert(`✅ تم تحديث حالة الطلب إلى "${getStatusText(status)}"`);
      
//     } catch (error) {
//       console.error('❌ Error updating order:', error);
//       alert(`❌ حدث خطأ: ${error.message}`);
//     } finally {
//       setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
//     }
//   };

//   const getStatusText = (status) => {
//     const statusMap = {
//       pending: 'قيد الانتظار',
//       confirmed: 'تم التأكيد',
//       processing: 'قيد التجهيز',
//       shipped: 'تم الشحن',
//       delivered: 'تم التسليم',
//       cancelled: 'ملغي'
//     };
//     return statusMap[status] || status;
//   };

//   const viewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowModal(true);
//   };

//   const deleteOrder = async (orderId) => {
//     if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
//     try {
//       const { error } = await supabase
//         .from('orders')
//         .delete()
//         .eq('id', orderId);

//       if (error) throw error;
      
//       fetchOrders();
//       alert('✅ تم حذف الطلب بنجاح');
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       alert(`❌ حدث خطأ: ${error.message}`);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statuses = {
//       pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
//       confirmed: { variant: 'success', text: '✅ تم التأكيد' },
//       processing: { variant: 'info', text: '🔄 قيد التجهيز' },
//       shipped: { variant: 'primary', text: '🚚 تم الشحن' },
//       delivered: { variant: 'success', text: '🎉 تم التسليم' },
//       cancelled: { variant: 'danger', text: '❌ ملغي' }
//     };
    
//     const statusInfo = statuses[status] || { variant: 'secondary', text: status };
//     return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
//   };

//   const preparePrint = (order) => {
//     setPrintOrder(order);
//     setTimeout(() => {
//       window.print();
//     }, 100);
//   };

//   // ... (PrintInvoice component يبقى زي ما هو) ...

//   // إحصائيات
//   const stats = {
//     total: orders.length,
//     pending: orders.filter(o => o.status === 'pending').length,
//     confirmed: orders.filter(o => o.status === 'confirmed').length,
//     revenue: orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
//   };

//   if (!isAdmin) {
//     return (
//       <Container className="py-5">
//         <div className="text-center">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">جارٍ التحميل...</span>
//           </Spinner>
//           <p className="mt-2">جارٍ التحقق من الصلاحية...</p>
//         </div>
//       </Container>
//     );
//   }

//   if (loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">جاري التحميل...</span>
//         </Spinner>
//         <p className="mt-2">جاري تحميل الطلبات...</p>
//       </Container>
//     );
//   }

//   return (
//     <>
//       {/* PrintInvoice component يضاف هنا */}
      
//       <Container className="py-4">
//         {/* Header */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h2>📋 لوحة إدارة الطلبات</h2>
//             <p className="text-muted">مرحباً بك في لوحة التحكم</p>
//           </div>
//           <div className="d-flex gap-2">
//             <Button variant="outline-primary" onClick={fetchOrders}>
//               🔄 تحديث
//             </Button>
//             <Button variant="outline-danger" onClick={handleLogout}>
//               🚪 تسجيل خروج
//             </Button>
//           </div>
//         </div>

//         {/* Debug Panel - للتصحيح فقط */}
//         <details className="mb-4">
//           <summary className="btn btn-sm btn-outline-info">🔧 معلومات تصحيح</summary>
//           <Card className="mt-2">
//             <Card.Body>
//               <pre style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
//                 {JSON.stringify({
//                   ordersCount: orders.length,
//                   sampleOrder: orders[0],
//                   updatingStatus
//                 }, null, 2)}
//               </pre>
//             </Card.Body>
//           </Card>
//         </details>

//         {/* إحصائيات */}
//         <Row className="mb-4">
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>🕒 قيد الانتظار</Card.Title>
//                 <h3 className={stats.pending > 0 ? 'text-warning' : 'text-muted'}>
//                   {stats.pending}
//                 </h3>
//                 <small className="text-muted">طلبات تحتاج مراجعة</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>✅ مؤكدة</Card.Title>
//                 <h3 className="text-success">{stats.confirmed}</h3>
//                 <small className="text-muted">طلبات تم تأكيدها</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>💰 إجمالي المبيعات</Card.Title>
//                 <h3 className="text-primary">{stats.revenue} ج.م</h3>
//                 <small className="text-muted">قيمة الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>📦 كل الطلبات</Card.Title>
//                 <h3 className="text-info">{stats.total}</h3>
//                 <small className="text-muted">إجمالي الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* جدول الطلبات */}
//         {orders.length > 0 ? (
//           <Card className="shadow-sm">
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table hover className="align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th>#</th>
//                       <th>العميل</th>
//                       <th>التاريخ</th>
//                       <th>المبلغ</th>
//                       <th>القطع</th>
//                       <th>الحالة</th>
//                       <th>الإجراءات</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((order, index) => (
//                       <tr key={order.id}>
//                         <td>
//                           <strong>#{order.id?.slice(0, 8) || 'N/A'}</strong>
//                           <br />
//                           <small className="text-muted">{index + 1}</small>
//                         </td>
//                         <td>
//                           <div>
//                             <strong>{order.customer_name || 'زائر'}</strong>
//                             <br />
//                             <small>{order.customer_phone || 'لا يوجد'}</small>
//                           </div>
//                         </td>
//                         <td>
//                           {order.created_at ? (
//                             <>
//                               {new Date(order.created_at).toLocaleDateString('ar-EG')}
//                               <br />
//                               <small>{new Date(order.created_at).toLocaleTimeString('ar-EG')}</small>
//                             </>
//                           ) : 'غير محدد'}
//                         </td>
//                         <td>
//                           <strong className="text-success">{order.total_price || 0} ج.م</strong>
//                         </td>
//                         <td>
//                           <Badge bg="info">{order.total_items || 0}</Badge>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center gap-2">
//                             {getStatusBadge(order.status || 'pending')}
//                             <Dropdown>
//                               <Dropdown.Toggle variant="outline-secondary" size="sm" id="status-dropdown">
//                                 تغيير
//                               </Dropdown.Toggle>
//                               <Dropdown.Menu>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'pending')}>
//                                   قيد الانتظار
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'confirmed')}>
//                                   تأكيد
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'processing')}>
//                                   تجهيز
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'shipped')}>
//                                   شحن
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'delivered')}>
//                                   تسليم
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'cancelled')}>
//                                   إلغاء
//                                 </Dropdown.Item>
//                               </Dropdown.Menu>
//                             </Dropdown>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="d-flex gap-2 flex-wrap">
//                             <Button 
//                               size="sm" 
//                               variant={order.status === 'confirmed' ? 'success' : 'outline-success'}
//                               onClick={() => updateOrderStatus(order.id, 'confirmed')}
//                               disabled={order.status === 'confirmed' || updatingStatus[order.id]}
//                             >
//                               {updatingStatus[order.id] ? (
//                                 <Spinner size="sm" animation="border" />
//                               ) : order.status === 'confirmed' ? (
//                                 '✅ مؤكد'
//                               ) : (
//                                 'تأكيد'
//                               )}
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-info" 
//                               onClick={() => viewOrderDetails(order)}
//                             >
//                               عرض
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-primary" 
//                               onClick={() => preparePrint(order)}
//                             >
//                               🖨️ طباعة
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-danger" 
//                               onClick={() => deleteOrder(order.id)}
//                             >
//                               حذف
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         ) : (
//           <Card className="shadow-sm">
//             <Card.Body className="text-center py-5">
//               <div className="mb-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#6c757d" className="bi bi-inbox" viewBox="0 0 16 16">
//                   <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
//                 </svg>
//               </div>
//               <h5>لا توجد طلبات</h5>
//               <p className="text-muted mb-0">لم يتم تسجيل أي طلبات حتى الآن</p>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Modal للتفاصيل */}
//         <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//           <Modal.Header closeButton>
//             <Modal.Title>
//               تفاصيل الطلب #{selectedOrder?.id?.slice(0, 8) || 'N/A'}
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedOrder && (
//               <div>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <h5>👤 معلومات العميل:</h5>
//                     <p><strong>الاسم:</strong> {selectedOrder.customer_name || 'زائر'}</p>
//                     <p><strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}</p>
//                     <p><strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}</p>
//                   </Col>
//                   <Col md={6}>
//                     <h5>📄 معلومات الطلب:</h5>
//                     <p><strong>التاريخ:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                     <p><strong>الحالة:</strong> {getStatusBadge(selectedOrder.status || 'pending')}</p>
//                     <p><strong>آخر تحديث:</strong> {selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                   </Col>
//                 </Row>

//                 <hr />

//                 <h5>🛒 المنتجات:</h5>
//                 {selectedOrder.items ? (
//                   <>
//                     <Table responsive bordered className="mt-3">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>المنتج</th>
//                           <th>السعر</th>
//                           <th>الكمية</th>
//                           <th>المجموع</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(() => {
//                           try {
//                             const items = JSON.parse(selectedOrder.items);
//                             return items.map((item, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.name || 'منتج غير محدد'}</td>
//                                 <td>{item.price || 0} ج.م</td>
//                                 <td>{item.quantity || 0}</td>
//                                 <td>{(item.price || 0) * (item.quantity || 0)} ج.م</td>
//                               </tr>
//                             ));
//                           } catch (error) {
//                             return (
//                               <tr>
//                                 <td colSpan="5" className="text-center text-danger">
//                                   ❌ خطأ في تحليل المنتجات: {error.message}
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         })()}
//                       </tbody>
//                     </Table>
//                     <div className="text-muted small mt-2">
//                       <strong>ملاحظة:</strong> تحقق من كونسول المتصفح لمزيد من التفاصيل
//                     </div>
//                   </>
//                 ) : (
//                   <Alert variant="warning">لا توجد معلومات عن المنتجات</Alert>
//                 )}

//                 <div className="text-end mt-3">
//                   <h5>📊 ملخص:</h5>
//                   <p><strong>عدد القطع:</strong> {selectedOrder.total_items || 0}</p>
//                   <p><strong>الإجمالي:</strong> {selectedOrder.total_price || 0} ج.م</p>
//                 </div>

//                 {selectedOrder.notes && (
//                   <>
//                     <hr />
//                     <h5>📝 ملاحظات:</h5>
//                     <p>{selectedOrder.notes}</p>
//                   </>
//                 )}

//                 {/* Debug Info */}
//                 <details className="mt-3">
//                   <summary className="btn btn-sm btn-outline-secondary">🔍 معلومات تصحيح</summary>
//                   <Card className="mt-2">
//                     <Card.Body>
//                       <pre style={{ fontSize: '10px', maxHeight: '150px', overflow: 'auto' }}>
//                         {JSON.stringify({
//                           orderId: selectedOrder.id,
//                           status: selectedOrder.status,
//                           items: selectedOrder.items,
//                           parsedItems: selectedOrder.items ? JSON.parse(selectedOrder.items) : null
//                         }, null, 2)}
//                       </pre>
//                     </Card.Body>
//                   </Card>
//                 </details>

//                 {/* أزرار إضافية في المودال */}
//                 <div className="d-flex gap-2 mt-4 pt-3 border-top">
//                   <Button 
//                     variant={selectedOrder.status === 'confirmed' ? 'success' : 'outline-success'}
//                     onClick={() => {
//                       updateOrderStatus(selectedOrder.id, 'confirmed');
//                       setShowModal(false);
//                     }}
//                     disabled={selectedOrder.status === 'confirmed' || updatingStatus[selectedOrder.id]}
//                   >
//                     {updatingStatus[selectedOrder.id] ? (
//                       <>
//                         <Spinner size="sm" animation="border" className="me-2" />
//                         جاري التحديث...
//                       </>
//                     ) : selectedOrder.status === 'confirmed' ? (
//                       '✅ تم التأكيد'
//                     ) : (
//                       'تأكيد الطلب'
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               إغلاق
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     </>
//   );
// }





// "use client";
// import { useState, useEffect, useRef } from "react";
// import { 
//   Container, 
//   Table, 
//   Button, 
//   Badge, 
//   Modal, 
//   Alert, 
//   Card, 
//   Dropdown,
//   Row,
//   Col,
//   Spinner
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { useRouter } from "next/navigation";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [error, setError] = useState(null);
//   const [printOrder, setPrintOrder] = useState(null);
//   const [updatingStatus, setUpdatingStatus] = useState({});
//   const printRef = useRef();
//   const router = useRouter();

//   useEffect(() => {
//     // التحقق من إذا المستخدم أدمن
//     const loggedIn = localStorage.getItem("isAdmin");
//     if (loggedIn !== "true") {
//       router.push("/dashboard/login");
//     } else {
//       setIsAdmin(true);
//       fetchOrders();
//     }
//   }, [router]);

//   useEffect(() => {
//     if (!isAdmin) return;
    
//     // إعداد real-time subscription
//     const channel = supabase
//       .channel('orders-realtime')
//       .on(
//         'postgres_changes',
//         {
//           event: '*',
//           schema: 'public',
//           table: 'orders'
//         },
//         (payload) => {
//           console.log('🔔 Real-time update:', payload);
          
//           if (payload.eventType === 'UPDATE') {
//             setOrders(prev => prev.map(order => 
//               order.id === payload.new.id ? { ...order, ...payload.new } : order
//             ));
//           } else if (payload.eventType === 'INSERT') {
//             setOrders(prev => [payload.new, ...prev]);
//           } else if (payload.eventType === 'DELETE') {
//             setOrders(prev => prev.filter(order => order.id !== payload.old.id));
//           }
//         }
//       )
//       .subscribe();
    
//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [isAdmin]);

//   useEffect(() => {
//     if (!isAdmin || orders.length === 0) return;
    
//     // Auto-refresh كل 30 ثانية
//     const intervalId = setInterval(() => {
//       console.log("🔄 Auto-refreshing orders...");
//       fetchOrders();
//     }, 30000);
    
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [isAdmin, orders.length]);

//   useEffect(() => {
//     if (!isAdmin) return;
    
//     // إضافة listener للـ visibility change
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') {
//         console.log("👀 Tab became visible, refreshing...");
//         fetchOrders();
//       }
//     };
    
//     document.addEventListener('visibilitychange', handleVisibilityChange);
    
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [isAdmin]);

//   useEffect(() => {
//     if (orders.length > 0) {
//       console.log("📊 Orders loaded, checking data integrity...");
      
//       // فحص بيانات العملاء
//       const ordersWithMissingData = orders.filter(order => 
//         !order.customer_name || !order.customer_phone
//       );
      
//       if (ordersWithMissingData.length > 0) {
//         console.warn(`⚠️ ${ordersWithMissingData.length} orders missing customer data`);
//         ordersWithMissingData.forEach(order => {
//           console.log(`   Order ${order.id?.slice(0, 8)}:`, {
//             customer_name: order.customer_name,
//             customer_phone: order.customer_phone
//           });
//         });
//       }
//     }
//   }, [orders]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const { data, error: ordersError } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (ordersError) throw ordersError;
//       setOrders(data || []);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//       setError(`خطأ في جلب الطلبات: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("isAdmin");
//     router.push("/dashboard/login");
//   };

//   // دالة لفحص قاعدة البيانات بالكامل
//   const debugDatabase = async () => {
//     try {
//       console.log("🔍 Starting comprehensive database debug...");
      
//       // 1. تحقق من جداول قاعدة البيانات
//       console.log("\n📊 1. Checking database tables...");
      
//       // جلب أسماء الجداول
//       const { data: tables, error: tablesError } = await supabase
//         .from('information_schema.tables')
//         .select('table_name')
//         .eq('table_schema', 'public');
      
//       if (tablesError) {
//         console.error("❌ Error fetching tables:", tablesError);
//       } else {
//         console.log("✅ Available tables:", tables?.map(t => t.table_name) || []);
//       }
      
//       // 2. تحقق من جدول الـ products
//       console.log("\n📦 2. Checking products table...");
      
//       // أولا: حاول تجدول products
//       const { data: allProducts, error: productsError } = await supabase
//         .from('products')
//         .select('*')
//         .limit(10);
      
//       if (productsError) {
//         console.error("❌ Error fetching products:", productsError);
//       } else if (!allProducts || allProducts.length === 0) {
//         console.warn("⚠️ Products table is empty or doesn't exist");
        
//         // تحقق من هيكل الجدول حتى لو كان فاضي
//         const { data: columns, error: columnsError } = await supabase
//           .from('information_schema.columns')
//           .select('column_name, data_type')
//           .eq('table_name', 'products')
//           .eq('table_schema', 'public');
        
//         if (columnsError) {
//           console.error("❌ Error fetching columns:", columnsError);
//         } else {
//           console.log("📝 Products table structure:", columns);
//         }
//       } else {
//         console.log(`✅ Found ${allProducts.length} products`);
//         console.log("📋 Sample products:", allProducts);
        
//         // عرض الـ columns المتاحة
//         if (allProducts.length > 0) {
//           console.log("📝 Available columns:", Object.keys(allProducts[0]));
//         }
//       }
      
//       // 3. تحقق من جدول الـ orders
//       console.log("\n📋 3. Checking orders table...");
      
//       const { data: allOrders, error: ordersError } = await supabase
//         .from('orders')
//         .select('*')
//         .limit(5);
      
//       if (ordersError) {
//         console.error("❌ Error fetching orders:", ordersError);
//       } else if (!allOrders || allOrders.length === 0) {
//         console.warn("⚠️ Orders table is empty");
//       } else {
//         console.log(`✅ Found ${allOrders.length} orders`);
        
//         // تحليل بيانات طلب واحد
//         const sampleOrder = allOrders[0];
//         console.log("\n📄 Sample order details:");
//         console.log("   ID:", sampleOrder.id);
//         console.log("   Customer Name:", sampleOrder.customer_name);
//         console.log("   Customer Phone:", sampleOrder.customer_phone);
//         console.log("   Status:", sampleOrder.status);
//         console.log("   Items JSON:", sampleOrder.items ? "Exists" : "Missing");
        
//         if (sampleOrder.items) {
//           try {
//             const items = JSON.parse(sampleOrder.items);
//             console.log("   Parsed Items:", items);
//             console.log("   Items count:", items.length);
            
//             if (items.length > 0) {
//               console.log("   First item:", items[0]);
//             }
//           } catch (e) {
//             console.error("   ❌ Error parsing items:", e.message);
//           }
//         }
//       }
      
//       // 4. تحقق من جدول الـ profiles
//       console.log("\n👤 4. Checking profiles table...");
      
//       const { data: profiles, error: profilesError } = await supabase
//         .from('profiles')
//         .select('*')
//         .limit(5);
      
//       if (profilesError) {
//         console.error("❌ Error fetching profiles:", profilesError);
//       } else if (!profiles || profiles.length === 0) {
//         console.warn("⚠️ Profiles table is empty");
//       } else {
//         console.log(`✅ Found ${profiles.length} profiles`);
//         console.log("📋 Sample profile:", profiles[0]);
//       }
      
//       console.log("\n🔧 5. Checking environment...");
//       console.log("   Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing");
//       console.log("   Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing");
      
//       // 6. فحص البيانات الحالية في الـ state
//       console.log("\n📱 6. Checking current state...");
//       console.log("   Orders in state:", orders.length);
//       console.log("   Is Admin:", isAdmin);
//       console.log("   Loading:", loading);
      
//       if (orders.length > 0) {
//         console.log("   First order in state:", {
//           id: orders[0].id,
//           customer_name: orders[0].customer_name,
//           customer_phone: orders[0].customer_phone,
//           status: orders[0].status
//         });
//       }
      
//       alert('✅ تم فحص قاعدة البيانات، راجع الـ console للتفاصيل');
      
//     } catch (error) {
//       console.error("💥 Error in debugDatabase:", error);
//       alert('❌ حدث خطأ في فحص قاعدة البيانات');
//     }
//   };

//   // دالة لتحديث المخزون عند تأكيد الطلب
//   const updateProductStock = async (orderId, items) => {
//     try {
//       console.log("📦 Starting stock update for order:", orderId);
//       console.log("📝 Items received:", items);
      
//       // إذا ما لقيناش products في قاعدة البيانات، نعمل حل مؤقت
//       const { data: productsCheck, error: checkError } = await supabase
//         .from('products')
//         .select('count')
//         .limit(1);
      
//       if (checkError || !productsCheck) {
//         console.warn("⚠️ Cannot access products table, using fallback method");
//         return {
//           stockUpdates: [],
//           successfulUpdates: 0,
//           failedUpdates: items.length,
//           error: "Products table not accessible"
//         };
//       }
      
//       const stockUpdates = [];
      
//       for (const item of items) {
//         if (!item.id) {
//           console.warn(`⚠️ Item ${item.name} has no ID`);
//           continue;
//         }
        
//         const itemId = item.id.toString();
//         console.log(`🔍 Looking for product: ${item.name} (ID: ${itemId})`);
        
//         // محاولة البحث بكل الطرق
//         let product = null;
//         let searchMethod = '';
        
//         // 1. البحث بالـ number أولاً (هذا هو الأهم)
//         const { data: byNumber } = await supabase
//           .from('products')
//           .select('*')
//           .eq('number', itemId)
//           .maybeSingle();
        
//         if (byNumber) {
//           product = byNumber;
//           searchMethod = 'number';
//         } else {
//           // 2. البحث بالاسم
//           const { data: byName } = await supabase
//             .from('products')
//             .select('*')
//             .ilike('name', `%${item.name}%`)
//             .maybeSingle();
          
//           if (byName) {
//             product = byName;
//             searchMethod = 'name';
//           } else {
//             // 3. البحث بأي حقل يحتوي على الرقم
//             const { data: byAny } = await supabase
//               .from('products')
//               .select('*')
//               .or(`number.ilike.%${itemId}%,name.ilike.%${itemId}%`)
//               .maybeSingle();
            
//             if (byAny) {
//               product = byAny;
//               searchMethod = 'any';
//             }
//           }
//         }
        
//         if (product) {
//           console.log(`✅ Found product via ${searchMethod}:`, product.name);
          
//           const oldStock = product.stock || 0;
//           const newStock = Math.max(oldStock - item.quantity, 0);
          
//           stockUpdates.push({
//             id: product.id,
//             name: product.name,
//             oldStock,
//             newStock,
//             quantity: item.quantity,
//             searchMethod
//           });
//         } else {
//           console.warn(`❌ Product not found: ${item.name} (ID: ${itemId})`);
          
//           // إذا مش موجود، نجيب كل الـ products عشان نشوف وش موجود
//           const { data: allProducts } = await supabase
//             .from('products')
//             .select('id, name, number, stock')
//             .limit(10);
          
//           console.log(`   Available products (first 10):`, allProducts);
//         }
//       }
      
//       // تحديث المخزون
//       let successfulUpdates = 0;
      
//       for (const update of stockUpdates) {
//         try {
//           const { error: updateError } = await supabase
//             .from('products')
//             .update({
//               stock: update.newStock,
//               updated_at: new Date().toISOString()
//             })
//             .eq('id', update.id);
          
//           if (updateError) {
//             console.error(`❌ Error updating ${update.name}:`, updateError);
//           } else {
//             console.log(`✅ Updated ${update.name}: ${update.oldStock} → ${update.newStock}`);
//             successfulUpdates++;
//           }
//         } catch (error) {
//           console.error(`❌ Exception updating ${update.name}:`, error);
//         }
//       }
      
//       console.log(`📊 Stock update complete: ${successfulUpdates}/${items.length} items updated`);
      
//       return {
//         stockUpdates,
//         successfulUpdates,
//         failedUpdates: items.length - successfulUpdates
//       };
      
//     } catch (error) {
//       console.error("💥 Error in updateProductStock:", error);
//       return {
//         stockUpdates: [],
//         successfulUpdates: 0,
//         failedUpdates: items.length,
//         error: error.message
//       };
//     }
//   };

// //   const updateOrderStatus = async (orderId, status) => {
// //     try {
// //       setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      
// //       const currentOrder = orders.find(o => o.id === orderId);
// //       if (!currentOrder) {
// //         alert('الطلب غير موجود');
// //         return;
// //       }

// //       console.log(`🔄 Updating order ${orderId} from ${currentOrder.status} to ${status}`);
      
// //       // إذا كان التأكيد، قم بفحص البيانات أولاً
// //       if (status === 'confirmed' && currentOrder.status !== 'confirmed') {
// //         console.log("🔍 Debugging order before confirmation...");
        
// //         // فحص بيانات الطلب
// //         console.log("Order data:", currentOrder);
// //         if (currentOrder.items) {
// //           try {
// //             const items = JSON.parse(currentOrder.items);
// //             console.log("Parsed items:", items);
// //           } catch (e) {
// //             console.error("Error parsing items:", e);
// //           }
// //         }
// //       }
      
// //       const updateData = { 
// //         status, 
// //         updated_at: new Date().toISOString() 
// //       };

// //       // تحديث المخزون أولاً إذا كان التأكيد
// //       if (status === 'confirmed' && currentOrder.status !== 'confirmed') {
// //         try {
// //           let items = [];
// //           try {
// //             items = JSON.parse(currentOrder.items || '[]');
// //           } catch (parseError) {
// //             console.error("❌ Error parsing items:", parseError);
// //           }
          
// //           if (items.length > 0) {
// //             console.log("🛒 Starting stock update...");
// //             const stockResult = await updateProductStock(orderId, items);
// //             console.log("📊 Stock update result:", stockResult);
            
// //             if (stockResult.failedUpdates > 0) {
// //               console.warn(`⚠️ ${stockResult.failedUpdates} products failed to update`);
// //             }
// //           } else {
// //             console.warn("⚠️ No items found in order");
// //           }
// //         } catch (stockError) {
// //           console.error("❌ Stock update failed:", stockError);
// //           // نكمل حتى لو فشل تحديث المخزون
// //         }
// //       }

// //       // تحديث قاعدة البيانات
// //       const { data, error } = await supabase
// //         .from('orders')
// //         .update(updateData)
// //         .eq('id', orderId)
// //         .select();

// //       if (error) {
// //         console.error("❌ Supabase update error:", error);
// //         throw error;
// //       }
      
// //       if (data && data.length > 0) {
// //         setOrders(prev => prev.map(order => 
// //           order.id === orderId ? { ...order, ...data[0] } : order
// //         ));
        
// //         alert(`✅ تم تحديث حالة الطلب إلى "${getStatusText(status)}"`);
// //       } else {
// //         await fetchOrders();
// //         alert(`✅ تم تحديث حالة الطلب إلى "${getStatusText(status)}"`);
// //       }
      
// //     } catch (error) {
// //       console.error('❌ Error updating order:', error);
// //       alert(`❌ حدث خطأ: ${error.message}`);
// //       fetchOrders();
// //     } finally {
// //       setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
// //     }
// //   };


// const updateOrderStatus = async (orderId, newStatus) => {
//   try {
//     console.log(`🔄 Attempting to update order ${orderId} to status: ${newStatus}`);
    
//     // 1. تحديث حالة الطلب بدون .select() أولاً
//     const { data: updateData, error: updateError } = await supabase
//       .from('orders')
//       .update({ 
//         status: newStatus,
//         updated_at: new Date().toISOString()
//       })
//       .eq('id', orderId);

//     if (updateError) {
//       console.error("❌ Supabase update error details:", updateError);
//       throw updateError;
//     }

//     console.log("✅ Update successful, fetching updated data...");

//     // 2. جلب البيانات المحدثة بشكل منفصل
//     const { data: fetchedData, error: fetchError } = await supabase
//       .from('orders')
//       .select('*')
//       .eq('id', orderId)
//       .single();

//     if (fetchError) {
//       console.error("❌ Error fetching updated order:", fetchError);
//       // يمكنك إرجاع البيانات الأصلية إذا كان جلب البيانات المحدثة فشل
//       return { id: orderId, status: newStatus };
//     }

//     console.log("✅ Fetched updated order:", fetchedData);
//     return fetchedData;
    
//   } catch (error) {
//     console.error('❌ Error updating order:', error);
    
//     // عرض رسالة مناسبة للمستخدم
//     let userMessage = 'حدث خطأ أثناء تحديث حالة الطلب';
    
//     if (error.code === '22023') {
//       userMessage = 'خطأ في تنسيق البيانات المرسلة';
//     } else if (error.code === '42501') {
//       userMessage = 'ليس لديك صلاحية لتحديث هذا الطلب';
//     } else if (error.message.includes('cannot extract elements from a scalar')) {
//       userMessage = 'خطأ في استجابة الخادم: تنسيق البيانات غير صحيح';
//     }
    
//     alert(`❌ ${userMessage}`);
//     throw error;
//   }
// };

//   const getStatusText = (status) => {
//     const statusMap = {
//       pending: 'قيد الانتظار',
//       confirmed: 'تم التأكيد',
//       processing: 'قيد التجهيز',
//       shipped: 'تم الشحن',
//       delivered: 'تم التسليم',
//       cancelled: 'ملغي'
//     };
//     return statusMap[status] || status;
//   };

//   const viewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowModal(true);
//   };

//   const deleteOrder = async (orderId) => {
//     if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
//     try {
//       const { error } = await supabase
//         .from('orders')
//         .delete()
//         .eq('id', orderId);

//       if (error) throw error;
      
//       // تحديث الـ state محلياً
//       setOrders(prev => prev.filter(order => order.id !== orderId));
//       alert('✅ تم حذف الطلب بنجاح');
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       alert(`❌ حدث خطأ: ${error.message}`);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statuses = {
//       pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
//       confirmed: { variant: 'success', text: '✅ تم التأكيد' },
//       processing: { variant: 'info', text: '🔄 قيد التجهيز' },
//       shipped: { variant: 'primary', text: '🚚 تم الشحن' },
//       delivered: { variant: 'success', text: '🎉 تم التسليم' },
//       cancelled: { variant: 'danger', text: '❌ ملغي' }
//     };
    
//     const statusInfo = statuses[status] || { variant: 'secondary', text: status };
//     return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
//   };

//   const preparePrint = (order) => {
//     setPrintOrder(order);
//     setTimeout(() => {
//       window.print();
//     }, 100);
//   };

//   const PrintInvoice = () => {
//     if (!printOrder) return null;
    
//     const items = JSON.parse(printOrder.items || '[]');
//     const orderDate = new Date(printOrder.created_at).toLocaleString('ar-EG');
    
//     return (
//       <div className="d-none d-print-block" ref={printRef}>
//         <style>
//           {`
//             @media print {
//               body * {
//                 visibility: hidden;
//               }
//               #print-section, #print-section * {
//                 visibility: visible;
//               }
//               #print-section {
//                 position: absolute;
//                 left: 0;
//                 top: 0;
//                 width: 100%;
//                 font-family: 'Arial', sans-serif;
//               }
//             }
//           `}
//         </style>
        
//         <div id="print-section" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//           {/* Header */}
//           <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
//             <h1 style={{ margin: 0, color: '#2c3e50' }}>فاتورة طلب</h1>
//             <h3 style={{ margin: '10px 0', color: '#3498db' }}>متجرك الإلكتروني</h3>
//             <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
//               📞 الهاتف: 01234567890 | 📧 البريد: store@example.com
//             </p>
//           </div>
          
//           {/* Order Info */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
//             <div>
//               <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات الطلب:</h4>
//               <p style={{ margin: '5px 0' }}><strong>رقم الطلب:</strong> #{printOrder.id.slice(0, 8)}</p>
//               <p style={{ margin: '5px 0' }}><strong>تاريخ الطلب:</strong> {orderDate}</p>
//               <p style={{ margin: '5px 0' }}><strong>حالة الطلب:</strong> {getStatusText(printOrder.status)}</p>
//             </div>
            
//             <div style={{ textAlign: 'right' }}>
//               <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات العميل:</h4>
//               <p style={{ margin: '5px 0' }}><strong>الاسم:</strong> {printOrder.customer_name || 'زائر'}</p>
//               <p style={{ margin: '5px 0' }}><strong>الهاتف:</strong> {printOrder.customer_phone || 'غير محدد'}</p>
//               <p style={{ margin: '5px 0' }}><strong>العنوان:</strong> {printOrder.customer_address || 'غير محدد'}</p>
//             </div>
//           </div>
          
//           {/* Products Table */}
//           <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>المنتجات:</h4>
//           <table style={{ 
//             width: '100%', 
//             borderCollapse: 'collapse', 
//             marginBottom: '30px',
//             border: '1px solid #ddd'
//           }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f8f9fa' }}>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>#</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>المنتج</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>السعر</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>الكمية</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>المجموع</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, index) => (
//                 <tr key={index}>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{index + 1}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>{item.name}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.price} ج.م</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
//                     {item.price * item.quantity} ج.م
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {/* Summary */}
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between',
//             marginTop: '30px',
//             paddingTop: '20px',
//             borderTop: '2px dashed #ddd'
//           }}>
//             <div>
//               <h4 style={{ color: '#2c3e50' }}>ملاحظات:</h4>
//               <p style={{ color: '#7f8c8d' }}>{printOrder.notes || 'لا توجد ملاحظات'}</p>
//             </div>
            
//             <div style={{ textAlign: 'left' }}>
//               <div style={{ marginBottom: '10px' }}>
//                 <span style={{ display: 'inline-block', width: '150px' }}>عدد القطع:</span>
//                 <strong>{printOrder.total_items || 0}</strong>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <span style={{ display: 'inline-block', width: '150px' }}>الإجمالي:</span>
//                 <strong style={{ fontSize: '18px', color: '#27ae60' }}>{printOrder.total_price || 0} ج.م</strong>
//               </div>
//             </div>
//           </div>
          
//           {/* Footer */}
//           <div style={{ 
//             marginTop: '50px', 
//             textAlign: 'center', 
//             paddingTop: '20px',
//             borderTop: '2px solid #333',
//             color: '#7f8c8d'
//           }}>
//             <p>شكراً لتعاملكم معنا</p>
//             <p>للاستفسار: 01234567890 | www.yourstore.com</p>
//             <p style={{ fontSize: '12px', marginTop: '20px' }}>
//               تاريخ الطباعة: {new Date().toLocaleString('ar-EG')}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const checkDataSync = async () => {
//     console.log("🔍 Checking data sync...");
    
//     try {
//       const { data: freshData, error } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (error) {
//         console.error("❌ Error fetching fresh data:", error);
//         return;
//       }
      
//       console.log(`📊 Fresh data: ${freshData.length} orders`);
//       console.log(`📊 Current state: ${orders.length} orders`);
      
//       if (JSON.stringify(freshData.map(o => o.id).sort()) !== JSON.stringify(orders.map(o => o.id).sort())) {
//         console.log("⚠️ Data mismatch detected! Syncing...");
//         setOrders(freshData);
//         alert('✅ تم مزامنة البيانات مع السيرفر');
//       } else {
//         console.log("✅ Data is in sync");
//         alert('✅ البيانات متزامنة مع السيرفر');
//       }
      
//     } catch (error) {
//       console.error("❌ Error in checkDataSync:", error);
//       alert('❌ حدث خطأ في المزامنة');
//     }
//   };

//   const fixCustomerDisplay = () => {
//     console.log("👤 Checking customer data display...");
    
//     if (orders.length === 0) {
//       console.log("No orders to check");
//       return;
//     }
    
//     console.log("\n📋 All orders customer data:");
//     orders.forEach((order, index) => {
//       console.log(`\nOrder ${index + 1}:`);
//       console.log("  ID:", order.id?.slice(0, 8));
//       console.log("  Customer Name:", order.customer_name || "❌ Missing");
//       console.log("  Customer Phone:", order.customer_phone || "❌ Missing");
//       console.log("  Status:", order.status);
      
//       // تحقق من البيانات الكاملة
//       if (!order.customer_name || !order.customer_phone) {
//         console.log("  ⚠️ Missing customer data!");
//         console.log("  Full order data:", order);
//       }
//     });
    
//     alert('✅ تم فحص بيانات العملاء، راجع الـ console');
//   };

//   const createFallbackProducts = async () => {
//     try {
//       if (!confirm('هل تريد إنشاء منتجات تجريبية؟')) return;
      
//       const sampleProducts = [
//         {
//           name: 'تجريبي 1',
//           price: 100,
//           stock: 50,
//           number: '72',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         },
//         {
//           name: 'تجريبي 2',
//           price: 200,
//           stock: 30,
//           number: '43',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         },
//         {
//           name: 'تجريبي 3',
//           price: 150,
//           stock: 20,
//           number: '55',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         }
//       ];
      
//       const { error } = await supabase
//         .from('products')
//         .insert(sampleProducts);
      
//       if (error) {
//         console.error("❌ Error creating products:", error);
//         alert('❌ حدث خطأ في إنشاء المنتجات');
//       } else {
//         console.log("✅ Created sample products");
//         alert('✅ تم إنشاء منتجات تجريبية بنجاح');
//       }
//     } catch (error) {
//       console.error("💥 Error in createFallbackProducts:", error);
//     }
//   };

//   // إحصائيات
//   const stats = {
//     total: orders.length,
//     pending: orders.filter(o => o.status === 'pending').length,
//     confirmed: orders.filter(o => o.status === 'confirmed').length,
//     revenue: orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
//   };

//   if (!isAdmin) {
//     return (
//       <Container className="py-5">
//         <div className="text-center">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">جارٍ التحميل...</span>
//           </Spinner>
//           <p className="mt-2">جارٍ التحقق من الصلاحية...</p>
//         </div>
//       </Container>
//     );
//   }

//   if (loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">جاري التحميل...</span>
//         </Spinner>
//         <p className="mt-2">جاري تحميل الطلبات...</p>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <PrintInvoice />
      
//       <Container className="py-4">
//         {/* Header */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h2>📋 لوحة إدارة الطلبات</h2>
//             <p className="text-muted">مرحباً بك في لوحة التحكم</p>
//           </div>
//           <div className="d-flex gap-2">
//             <Button 
//               variant="outline-primary" 
//               onClick={fetchOrders}
//               title="تحديث البيانات من السيرفر"
//             >
//               🔄 تحديث
//             </Button>
//             <Button 
//               variant="outline-info" 
//               onClick={debugDatabase}
//               title="فحص قاعدة البيانات بالكامل"
//             >
//               🐛 فحص DB
//             </Button>
//             <Button 
//               variant="outline-warning" 
//               onClick={fixCustomerDisplay}
//               size="sm"
//             >
//               👤 فحص بيانات
//             </Button>
//             <Button 
//               variant="outline-success" 
//               onClick={createFallbackProducts}
//               size="sm"
//             >
//               ➕ منتجات تجريبية
//             </Button>
//             <Button variant="outline-danger" onClick={handleLogout}>
//               🚪 خروج
//             </Button>
//           </div>
//         </div>

//         {/* Visual Indicators */}
//         <div className="d-flex align-items-center gap-3 mb-3">
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-success rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">مؤكد</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-warning rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">قيد الانتظار</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-danger rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">ملغي</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-info rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">قيد التجهيز</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-primary rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">تم الشحن</small>
//           </div>
//         </div>

//         {/* رسائل الخطأ */}
//         {error && (
//           <Alert variant="danger" className="mb-4">
//             <Alert.Heading>⚠️ خطأ</Alert.Heading>
//             <p>{error}</p>
//             <hr />
//             <div className="d-flex justify-content-end">
//               <Button variant="outline-danger" onClick={() => setError(null)}>
//                 إغلاق
//               </Button>
//             </div>
//           </Alert>
//         )}

//         {/* إحصائيات */}
//         <Row className="mb-4">
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>🕒 قيد الانتظار</Card.Title>
//                 <h3 className={stats.pending > 0 ? 'text-warning' : 'text-muted'}>
//                   {stats.pending}
//                 </h3>
//                 <small className="text-muted">طلبات تحتاج مراجعة</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>✅ مؤكدة</Card.Title>
//                 <h3 className="text-success">{stats.confirmed}</h3>
//                 <small className="text-muted">طلبات تم تأكيدها</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>💰 إجمالي المبيعات</Card.Title>
//                 <h3 className="text-primary">{stats.revenue} ج.م</h3>
//                 <small className="text-muted">قيمة الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>📦 كل الطلبات</Card.Title>
//                 <h3 className="text-info">{stats.total}</h3>
//                 <small className="text-muted">إجمالي الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* جدول الطلبات */}
//         {orders.length > 0 ? (
//           <Card className="shadow-sm">
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table hover className="align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th>#</th>
//                       <th>العميل</th>
//                       <th>التاريخ</th>
//                       <th>المبلغ</th>
//                       <th>القطع</th>
//                       <th>الحالة</th>
//                       <th>الإجراءات</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((order, index) => (
//                       <tr key={order.id}>
//                         <td>
//                           <strong>#{order.id?.slice(0, 8) || 'N/A'}</strong>
//                           <br />
//                           <small className="text-muted">{index + 1}</small>
//                         </td>
//                         <td>
//                           <div>
//                             <strong className={order.customer_name ? '' : 'text-danger'}>
//                               {order.customer_name || '❌ بدون اسم'}
//                             </strong>
//                             <br />
//                             <small className={order.customer_phone ? 'text-muted' : 'text-danger'}>
//                               {order.customer_phone || '❌ بدون هاتف'}
//                             </small>
//                             {order.customer_address && (
//                               <>
//                                 <br />
//                                 <small className="text-muted">
//                                   📍 {order.customer_address}
//                                 </small>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           {order.created_at ? (
//                             <>
//                               {new Date(order.created_at).toLocaleDateString('ar-EG')}
//                               <br />
//                               <small>{new Date(order.created_at).toLocaleTimeString('ar-EG')}</small>
//                             </>
//                           ) : 'غير محدد'}
//                         </td>
//                         <td>
//                           <strong className="text-success">{order.total_price || 0} ج.م</strong>
//                         </td>
//                         <td>
//                           <Badge bg="info">{order.total_items || 0}</Badge>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center gap-2">
//                             {getStatusBadge(order.status || 'pending')}
//                             <Dropdown>
//                               <Dropdown.Toggle variant="outline-secondary" size="sm" id="status-dropdown">
//                                 تغيير
//                               </Dropdown.Toggle>
//                               <Dropdown.Menu>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'pending')}>
//                                   قيد الانتظار
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'confirmed')}>
//                                   تأكيد
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'processing')}>
//                                   تجهيز
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'shipped')}>
//                                   شحن
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'delivered')}>
//                                   تسليم
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'cancelled')}>
//                                   إلغاء
//                                 </Dropdown.Item>
//                               </Dropdown.Menu>
//                             </Dropdown>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="d-flex gap-2 flex-wrap">
//                             <Button 
//                               size="sm" 
//                               variant={order.status === 'confirmed' ? 'success' : 'outline-success'}
//                               onClick={async () => {
//                                 if (order.status === 'confirmed') {
//                                   alert('الطلب مؤكد بالفعل!');
//                                   return;
//                                 }
                                
//                                 if (!confirm(`هل تريد تأكيد الطلب #${order.id.slice(0, 8)}؟`)) return;
                                
//                                 await updateOrderStatus(order.id, 'confirmed');
//                               }}
//                               disabled={updatingStatus[order.id]}
//                             >
//                               {updatingStatus[order.id] ? (
//                                 <Spinner size="sm" animation="border" />
//                               ) : order.status === 'confirmed' ? (
//                                 <>
//                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle me-1" viewBox="0 0 16 16">
//                                     <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
//                                     <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
//                                   </svg>
//                                   مؤكد
//                                 </>
//                               ) : (
//                                 'تأكيد'
//                               )}
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-info" 
//                               onClick={() => viewOrderDetails(order)}
//                             >
//                               عرض
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-primary" 
//                               onClick={() => preparePrint(order)}
//                             >
//                               🖨️ طباعة
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-danger" 
//                               onClick={() => deleteOrder(order.id)}
//                             >
//                               حذف
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         ) : (
//           <Card className="shadow-sm">
//             <Card.Body className="text-center py-5">
//               <div className="mb-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#6c757d" className="bi bi-inbox" viewBox="0 0 16 16">
//                   <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
//                 </svg>
//               </div>
//               <h5>لا توجد طلبات</h5>
//               <p className="text-muted mb-0">لم يتم تسجيل أي طلبات حتى الآن</p>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Modal للتفاصيل */}
//         <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//           <Modal.Header closeButton>
//             <Modal.Title>
//               تفاصيل الطلب #{selectedOrder?.id?.slice(0, 8) || 'N/A'}
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedOrder && (
//               <div>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <h5>👤 معلومات العميل:</h5>
//                     <p><strong>الاسم:</strong> {selectedOrder.customer_name || 'زائر'}</p>
//                     <p><strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}</p>
//                     <p><strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}</p>
//                   </Col>
//                   <Col md={6}>
//                     <h5>📄 معلومات الطلب:</h5>
//                     <p><strong>التاريخ:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                     <p><strong>الحالة:</strong> {getStatusBadge(selectedOrder.status || 'pending')}</p>
//                     <p><strong>آخر تحديث:</strong> {selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                   </Col>
//                 </Row>

//                 <hr />

//                 <h5>🛒 المنتجات:</h5>
//                 {selectedOrder.items ? (
//                   <>
//                     <Table responsive bordered className="mt-3">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>المنتج</th>
//                           <th>السعر</th>
//                           <th>الكمية</th>
//                           <th>المجموع</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(() => {
//                           try {
//                             const items = JSON.parse(selectedOrder.items);
//                             return items.map((item, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.name || 'منتج غير محدد'}</td>
//                                 <td>{item.price || 0} ج.م</td>
//                                 <td>{item.quantity || 0}</td>
//                                 <td>{(item.price || 0) * (item.quantity || 0)} ج.م</td>
//                               </tr>
//                             ));
//                           } catch (error) {
//                             return (
//                               <tr>
//                                 <td colSpan="5" className="text-center text-danger">
//                                   ❌ خطأ في تحليل المنتجات: {error.message}
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         })()}
//                       </tbody>
//                     </Table>
//                   </>
//                 ) : (
//                   <Alert variant="warning">لا توجد معلومات عن المنتجات</Alert>
//                 )}

//                 <div className="text-end mt-3">
//                   <h5>📊 ملخص:</h5>
//                   <p><strong>عدد القطع:</strong> {selectedOrder.total_items || 0}</p>
//                   <p><strong>الإجمالي:</strong> {selectedOrder.total_price || 0} ج.م</p>
//                 </div>

//                 {selectedOrder.notes && (
//                   <>
//                     <hr />
//                     <h5>📝 ملاحظات:</h5>
//                     <p>{selectedOrder.notes}</p>
//                   </>
//                 )}

//                 {/* أزرار إضافية في المودال */}
//                 <div className="d-flex gap-2 mt-4 pt-3 border-top">
//                   <Button 
//                     variant={selectedOrder.status === 'confirmed' ? 'success' : 'outline-success'}
//                     onClick={() => {
//                       updateOrderStatus(selectedOrder.id, 'confirmed');
//                       setShowModal(false);
//                     }}
//                     disabled={selectedOrder.status === 'confirmed' || updatingStatus[selectedOrder.id]}
//                   >
//                     {updatingStatus[selectedOrder.id] ? (
//                       <>
//                         <Spinner size="sm" animation="border" className="me-2" />
//                         جاري التحديث...
//                       </>
//                     ) : selectedOrder.status === 'confirmed' ? (
//                       '✅ تم التأكيد'
//                     ) : (
//                       'تأكيد الطلب'
//                     )}
//                   </Button>
//                   <Button 
//                     variant="outline-primary" 
//                     onClick={() => {
//                       setShowModal(false);
//                       preparePrint(selectedOrder);
//                     }}
//                   >
//                     🖨️ طباعة الفاتورة
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               إغلاق
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     </>
//   );
// }







// "use client";
// import { useState, useEffect, useRef } from "react";
// import { 
//   Container, 
//   Table, 
//   Button, 
//   Badge, 
//   Modal, 
//   Alert, 
//   Card, 
//   Dropdown,
//   Row,
//   Col,
//   Spinner
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { useRouter } from "next/navigation";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [error, setError] = useState(null);
//   const [printOrder, setPrintOrder] = useState(null);
//   const [updatingStatus, setUpdatingStatus] = useState({});
//   const printRef = useRef();
//   const router = useRouter();

//   useEffect(() => {
//     // التحقق من إذا المستخدم أدمن
//     const loggedIn = localStorage.getItem("isAdmin");
//     if (loggedIn !== "true") {
//       router.push("/dashboard/login");
//     } else {
//       setIsAdmin(true);
//       fetchOrders();
//     }
//   }, [router]);

//   useEffect(() => {
//     if (!isAdmin) return;
    
//     // إعداد real-time subscription
//     try {
//       const channel = supabase
//         .channel('orders-realtime')
//         .on(
//           'postgres_changes',
//           {
//             event: '*',
//             schema: 'public',
//             table: 'orders'
//           },
//           (payload) => {
//             console.log('🔔 Real-time update:', payload.eventType);
            
//             if (payload.eventType === 'UPDATE') {
//               setOrders(prev => prev.map(order => 
//                 order.id === payload.new.id ? { ...order, ...payload.new } : order
//               ));
//             } else if (payload.eventType === 'INSERT') {
//               setOrders(prev => [payload.new, ...prev]);
//             } else if (payload.eventType === 'DELETE') {
//               setOrders(prev => prev.filter(order => order.id !== payload.old.id));
//             }
//           }
//         )
//         .subscribe();
      
//       return () => {
//         supabase.removeChannel(channel);
//       };
//     } catch (error) {
//       console.error("❌ Error setting up real-time:", error);
//     }
//   }, [isAdmin]);

//   useEffect(() => {
//     if (!isAdmin || orders.length === 0) return;
    
//     // Auto-refresh كل 30 ثانية
//     const intervalId = setInterval(() => {
//       console.log("🔄 Auto-refreshing orders...");
//       fetchOrders();
//     }, 30000);
    
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [isAdmin, orders.length]);

//   useEffect(() => {
//     if (!isAdmin) return;
    
//     // إضافة listener للـ visibility change
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') {
//         console.log("👀 Tab became visible, refreshing...");
//         fetchOrders();
//       }
//     };
    
//     document.addEventListener('visibilitychange', handleVisibilityChange);
    
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [isAdmin]);

//   useEffect(() => {
//     if (orders.length > 0) {
//       console.log("📊 Orders loaded, checking data integrity...");
      
//       // فحص بيانات العملاء
//       const ordersWithMissingData = orders.filter(order => 
//         !order.customer_name || !order.customer_phone
//       );
      
//       if (ordersWithMissingData.length > 0) {
//         console.warn(`⚠️ ${ordersWithMissingData.length} orders missing customer data`);
//         ordersWithMissingData.forEach(order => {
//           console.log(`   Order ${order.id?.slice(0, 8)}:`, {
//             customer_name: order.customer_name,
//             customer_phone: order.customer_phone
//           });
//         });
//       }
//     }
//   }, [orders]);

//   const fetchOrders = async (forceSync = false) => {
//     try {
//       setLoading(true);
//       console.log("🔄 Fetching orders from Supabase...");
      
//       const { data, error: ordersError } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (ordersError) {
//         console.error("❌ Error fetching orders:", ordersError);
//         throw ordersError;
//       }

//       console.log(`✅ Fetched ${data?.length || 0} orders`);
      
//       // إذا كان forceSync، تحديث مباشرة
//       if (forceSync) {
//         setOrders(data || []);
//       } else {
//         // دمج البيانات الجديدة مع الحالية مع الحفاظ على التحديثات المحلية
//         setOrders(prev => {
//           const prevMap = new Map(prev.map(order => [order.id, order]));
//           const newOrders = (data || []).map(newOrder => {
//             const existingOrder = prevMap.get(newOrder.id);
//             // احتفظ بالتحديثات المحلية إذا كانت أحدث
//             if (existingOrder && existingOrder.updated_at > newOrder.updated_at) {
//               return existingOrder;
//             }
//             return newOrder;
//           });
//           return newOrders;
//         });
//       }
      
//       setError(null);
      
//     } catch (error) {
//       console.error("❌ Error in fetchOrders:", error);
//       setError(`خطأ في جلب الطلبات: ${error.message}`);
      
//       // عرض تفاصيل الخطأ
//       if (error.code === 'PGRST116') {
//         alert('❌ خطأ في استعلام قاعدة البيانات: الطلب غير موجود');
//       } else if (error.code === '42501') {
//         alert('❌ ليس لديك صلاحية للوصول إلى الطلبات');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("isAdmin");
//     router.push("/dashboard/login");
//   };

//   // دالة لفحص قاعدة البيانات بالكامل
//   const debugDatabase = async () => {
//     try {
//       console.log("🔍 Starting comprehensive database debug...");
      
//       // 1. تحقق من جداول قاعدة البيانات
//       console.log("\n📊 1. Checking database tables...");
      
//       // جلب أسماء الجداول
//       const { data: tables, error: tablesError } = await supabase
//         .from('information_schema.tables')
//         .select('table_name')
//         .eq('table_schema', 'public');
      
//       if (tablesError) {
//         console.error("❌ Error fetching tables:", tablesError);
//       } else {
//         console.log("✅ Available tables:", tables?.map(t => t.table_name) || []);
//       }
      
//       // 2. تحقق من جدول الـ products
//       console.log("\n📦 2. Checking products table...");
      
//       // أولا: حاول تجدول products
//       const { data: allProducts, error: productsError } = await supabase
//         .from('products')
//         .select('*')
//         .limit(10);
      
//       if (productsError) {
//         console.error("❌ Error fetching products:", productsError);
//       } else if (!allProducts || allProducts.length === 0) {
//         console.warn("⚠️ Products table is empty or doesn't exist");
        
//         // تحقق من هيكل الجدول حتى لو كان فاضي
//         const { data: columns, error: columnsError } = await supabase
//           .from('information_schema.columns')
//           .select('column_name, data_type')
//           .eq('table_name', 'products')
//           .eq('table_schema', 'public');
        
//         if (columnsError) {
//           console.error("❌ Error fetching columns:", columnsError);
//         } else {
//           console.log("📝 Products table structure:", columns);
//         }
//       } else {
//         console.log(`✅ Found ${allProducts.length} products`);
//         console.log("📋 Sample products:", allProducts);
        
//         // عرض الـ columns المتاحة
//         if (allProducts.length > 0) {
//           console.log("📝 Available columns:", Object.keys(allProducts[0]));
//         }
//       }
      
//       // 3. تحقق من جدول الـ orders
//       console.log("\n📋 3. Checking orders table...");
      
//       const { data: allOrders, error: ordersError } = await supabase
//         .from('orders')
//         .select('*')
//         .limit(5);
      
//       if (ordersError) {
//         console.error("❌ Error fetching orders:", ordersError);
//       } else if (!allOrders || allOrders.length === 0) {
//         console.warn("⚠️ Orders table is empty");
//       } else {
//         console.log(`✅ Found ${allOrders.length} orders`);
        
//         // تحليل بيانات طلب واحد
//         const sampleOrder = allOrders[0];
//         console.log("\n📄 Sample order details:");
//         console.log("   ID:", sampleOrder.id);
//         console.log("   Customer Name:", sampleOrder.customer_name);
//         console.log("   Customer Phone:", sampleOrder.customer_phone);
//         console.log("   Status:", sampleOrder.status);
//         console.log("   Items JSON:", sampleOrder.items ? "Exists" : "Missing");
        
//         if (sampleOrder.items) {
//           try {
//             const items = JSON.parse(sampleOrder.items);
//             console.log("   Parsed Items:", items);
//             console.log("   Items count:", items.length);
            
//             if (items.length > 0) {
//               console.log("   First item:", items[0]);
//             }
//           } catch (e) {
//             console.error("   ❌ Error parsing items:", e.message);
//           }
//         }
//       }
      
//       // 4. تحقق من جدول الـ profiles
//       console.log("\n👤 4. Checking profiles table...");
      
//       const { data: profiles, error: profilesError } = await supabase
//         .from('profiles')
//         .select('*')
//         .limit(5);
      
//       if (profilesError) {
//         console.error("❌ Error fetching profiles:", profilesError);
//       } else if (!profiles || profiles.length === 0) {
//         console.warn("⚠️ Profiles table is empty");
//       } else {
//         console.log(`✅ Found ${profiles.length} profiles`);
//         console.log("📋 Sample profile:", profiles[0]);
//       }
      
//       console.log("\n🔧 5. Checking environment...");
//       console.log("   Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing");
//       console.log("   Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing");
      
//       // 6. فحص البيانات الحالية في الـ state
//       console.log("\n📱 6. Checking current state...");
//       console.log("   Orders in state:", orders.length);
//       console.log("   Is Admin:", isAdmin);
//       console.log("   Loading:", loading);
      
//       if (orders.length > 0) {
//         console.log("   First order in state:", {
//           id: orders[0].id,
//           customer_name: orders[0].customer_name,
//           customer_phone: orders[0].customer_phone,
//           status: orders[0].status
//         });
//       }
      
//       alert('✅ تم فحص قاعدة البيانات، راجع الـ console للتفاصيل');
      
//     } catch (error) {
//       console.error("💥 Error in debugDatabase:", error);
//       alert('❌ حدث خطأ في فحص قاعدة البيانات');
//     }
//   };

//   // دالة لتحديث المخزون عند تأكيد الطلب
//   const updateProductStock = async (orderId, items) => {
//     try {
//       console.log("📦 Starting stock update for order:", orderId);
//       console.log("📝 Items received:", items);
      
//       // إذا ما لقيناش products في قاعدة البيانات، نعمل حل مؤقت
//       const { data: productsCheck, error: checkError } = await supabase
//         .from('products')
//         .select('count')
//         .limit(1);
      
//       if (checkError || !productsCheck) {
//         console.warn("⚠️ Cannot access products table, using fallback method");
//         return {
//           stockUpdates: [],
//           successfulUpdates: 0,
//           failedUpdates: items.length,
//           error: "Products table not accessible"
//         };
//       }
      
//       const stockUpdates = [];
      
//       for (const item of items) {
//         if (!item.id) {
//           console.warn(`⚠️ Item ${item.name} has no ID`);
//           continue;
//         }
        
//         const itemId = item.id.toString();
//         console.log(`🔍 Looking for product: ${item.name} (ID: ${itemId})`);
        
//         // محاولة البحث بكل الطرق
//         let product = null;
//         let searchMethod = '';
        
//         // 1. البحث بالـ number أولاً (هذا هو الأهم)
//         const { data: byNumber } = await supabase
//           .from('products')
//           .select('*')
//           .eq('number', itemId)
//           .maybeSingle();
        
//         if (byNumber) {
//           product = byNumber;
//           searchMethod = 'number';
//         } else {
//           // 2. البحث بالاسم
//           const { data: byName } = await supabase
//             .from('products')
//             .select('*')
//             .ilike('name', `%${item.name}%`)
//             .maybeSingle();
          
//           if (byName) {
//             product = byName;
//             searchMethod = 'name';
//           } else {
//             // 3. البحث بأي حقل يحتوي على الرقم
//             const { data: byAny } = await supabase
//               .from('products')
//               .select('*')
//               .or(`number.ilike.%${itemId}%,name.ilike.%${itemId}%`)
//               .maybeSingle();
            
//             if (byAny) {
//               product = byAny;
//               searchMethod = 'any';
//             }
//           }
//         }
        
//         if (product) {
//           console.log(`✅ Found product via ${searchMethod}:`, product.name);
          
//           const oldStock = product.stock || 0;
//           const newStock = Math.max(oldStock - item.quantity, 0);
          
//           stockUpdates.push({
//             id: product.id,
//             name: product.name,
//             oldStock,
//             newStock,
//             quantity: item.quantity,
//             searchMethod
//           });
//         } else {
//           console.warn(`❌ Product not found: ${item.name} (ID: ${itemId})`);
          
//           // إذا مش موجود، نجيب كل الـ products عشان نشوف وش موجود
//           const { data: allProducts } = await supabase
//             .from('products')
//             .select('id, name, number, stock')
//             .limit(10);
          
//           console.log(`   Available products (first 10):`, allProducts);
//         }
//       }
      
//       // تحديث المخزون
//       let successfulUpdates = 0;
      
//       for (const update of stockUpdates) {
//         try {
//           const { error: updateError } = await supabase
//             .from('products')
//             .update({
//               stock: update.newStock,
//               updated_at: new Date().toISOString()
//             })
//             .eq('id', update.id);
          
//           if (updateError) {
//             console.error(`❌ Error updating ${update.name}:`, updateError);
//           } else {
//             console.log(`✅ Updated ${update.name}: ${update.oldStock} → ${update.newStock}`);
//             successfulUpdates++;
//           }
//         } catch (error) {
//           console.error(`❌ Exception updating ${update.name}:`, error);
//         }
//       }
      
//       console.log(`📊 Stock update complete: ${successfulUpdates}/${items.length} items updated`);
      
//       return {
//         stockUpdates,
//         successfulUpdates,
//         failedUpdates: items.length - successfulUpdates
//       };
      
//     } catch (error) {
//       console.error("💥 Error in updateProductStock:", error);
//       return {
//         stockUpdates: [],
//         successfulUpdates: 0,
//         failedUpdates: items.length,
//         error: error.message
//       };
//     }
//   };

// const simpleUpdateOrderStatus = async (orderId, newStatus) => {
//   setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
  
//   const currentOrder = orders.find(o => o.id === orderId);
//   if (!currentOrder) {
//     alert('الطلب غير موجود');
//     setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
//     return;
//   }
  
//   // 1. تحديث الواجهة
//   setOrders(prev => prev.map(order => 
//     order.id === orderId 
//       ? { 
//           ...order, 
//           status: newStatus,
//           updated_at: new Date().toISOString() 
//         }
//       : order
//   ));
  
//   // 2. تحديث المخزون
//   if (newStatus === 'confirmed' && currentOrder.status !== 'confirmed') {
//     try {
//       const items = currentOrder.items ? JSON.parse(currentOrder.items) : [];
//       if (items.length > 0) {
//         updateProductStock(orderId, items);
//       }
//     } catch (e) {}
//   }
  
//   // 3. تحديث قاعدة البيانات في الخلفية (بدون انتظار)
//   setTimeout(async () => {
//     try {
//       await supabase
//         .from('orders')
//         .update({ status: newStatus })
//         .eq('id', orderId);
      
//       console.log("✅ Background sync successful");
//     } catch (error) {
//       console.log("⚠️ Background sync failed (local update successful)");
//     }
//   }, 0);
  
//   alert(`✅ تم تحديث حالة الطلب إلى "${getStatusText(newStatus)}"`);
//   setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
// };


//   // الدالة الرئيسية لتحديث حالة الطلب مع إعادة المحاولة
//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      
//       console.log(`🚀 Updating order ${orderId.slice(0, 8)} → ${newStatus}`);
      
//       const currentOrder = orders.find(o => o.id === orderId);
//       if (!currentOrder) {
//         alert('الطلب غير موجود');
//         setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
//         return;
//       }
      
//       // 1. تحديث فوري للواجهة
//       const updatedOrder = {
//         ...currentOrder,
//         status: newStatus,
//         updated_at: new Date().toISOString(),
//         _localUpdate: true // علامة أن التحديث محلي
//       };
      
//       setOrders(prev => prev.map(order => 
//         order.id === orderId ? updatedOrder : order
//       ));
      
//       // 2. تحديث المخزون إذا كان تأكيد
//       if (newStatus === 'confirmed' && currentOrder.status !== 'confirmed') {
//         try {
//           const items = currentOrder.items ? JSON.parse(currentOrder.items) : [];
//           if (items.length > 0) {
//             // تحديث المخزون بدون انتظار
//             simpleUpdateOrderStatus(orderId, items)
//               .then(result => {
//                 console.log("📦 Stock update completed:", result);
//               })
//               .catch(err => {
//                 console.error("❌ Stock update error:", err);
//               });
//           }
//         } catch (e) {
//           console.error("❌ Error processing items:", e);
//         }
//       }
      
//       // 3. تحديث قاعدة البيانات مع إعادة المحاولة
//       let retryCount = 0;
//       const maxRetries = 3;
//       let updateSuccessful = false;
      
//       const attemptDatabaseUpdate = async () => {
//         try {
//           console.log(`🔄 Attempting database update (${retryCount + 1}/${maxRetries})...`);
          
//           const { error } = await supabase
//             .from('orders')
//             .update({ 
//               status: newStatus,
//               updated_at: new Date().toISOString()
//             })
//             .eq('id', orderId);

//           if (error) {
//             console.warn(`⚠️ Update attempt ${retryCount + 1} failed:`, error);
//             retryCount++;
            
//             if (retryCount < maxRetries) {
//               // إعادة المحاولة بعد تأخير متزايد
//               const delay = 1000 * retryCount; // 1s, 2s, 3s
//               console.log(`⏳ Retrying in ${delay}ms...`);
//               setTimeout(attemptDatabaseUpdate, delay);
//               return;
//             }
            
//             console.error("❌ All update attempts failed");
//             // نترك التحديث محلياً مع علامة
//             alert(`⚠️ تم تحديث الحالة محلياً، ولكن هناك مشكلة في المزامنة مع السيرفر`);
//           } else {
//             console.log("✅ Database update successful!");
//             updateSuccessful = true;
            
//             // إزالة العلامة المحلية
//             setOrders(prev => prev.map(order => 
//               order.id === orderId 
//                 ? { ...order, _localUpdate: false }
//                 : order
//             ));
            
//             alert(`✅ تم تحديث حالة الطلب إلى "${getStatusText(newStatus)}"`);
//           }
//         } catch (err) {
//           console.error("❌ Exception in database update:", err);
//           if (retryCount < maxRetries - 1) {
//             retryCount++;
//             setTimeout(attemptDatabaseUpdate, 1000 * retryCount);
//           }
//         }
//       };
      
//       // بدء محاولة التحديث
//       attemptDatabaseUpdate();
      
//       // إظهار رسالة نجاح فورية
//       setTimeout(() => {
//         if (!updateSuccessful) {
//           alert(`✅ تم تحديث الحالة محلياً إلى "${getStatusText(newStatus)}"`);
//         }
//       }, 500);
      
//     } catch (error) {
//       console.error("❌ Unexpected error in updateOrderStatus:", error);
//       alert("⚠️ حدث خطأ غير متوقع");
//     } finally {
//       // تعطيل حالة التحميل بعد تأخير
//       setTimeout(() => {
//         setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
//       }, 1000);
//     }
//   };

//   // دالة للتحقق من حالة الطلب في قاعدة البيانات
//   const verifyOrderStatus = async (orderId) => {
//     try {
//       console.log(`🔍 Verifying order ${orderId.slice(0, 8)} status...`);
      
//       const { data, error } = await supabase
//         .from('orders')
//         .select('status, updated_at')
//         .eq('id', orderId)
//         .maybeSingle();
      
//       if (error) {
//         console.error("❌ Verification error:", error);
//         return null;
//       }
      
//       console.log(`📊 Current status in DB: ${data?.status}`);
      
//       // المقارنة مع الحالة المحلية
//       const localOrder = orders.find(o => o.id === orderId);
//       if (localOrder && data) {
//         if (localOrder.status !== data.status) {
//           console.warn(`⚠️ Status mismatch! Local: ${localOrder.status}, DB: ${data.status}`);
//           alert(`⚠️ هناك تباين في الحالة!\nالمحلية: ${getStatusText(localOrder.status)}\nقاعدة البيانات: ${getStatusText(data.status)}`);
//         } else {
//           console.log("✅ Status matches!");
//         }
//       }
      
//       return data;
      
//     } catch (error) {
//       console.error("❌ Error in verification:", error);
//       return null;
//     }
//   };

//   // دالة لفرض المزامنة
//   const forceSyncOrders = async () => {
//     if (confirm('هل تريد فرض مزامنة البيانات مع السيرفر؟\nسيتم استبدال جميع البيانات المحلية بالبيانات من السيرفر.')) {
//       await fetchOrders(true);
//       alert('✅ تم مزامنة البيانات مع السيرفر');
//     }
//   };

//   const getStatusText = (status) => {
//     const statusMap = {
//       pending: 'قيد الانتظار',
//       confirmed: 'تم التأكيد',
//       processing: 'قيد التجهيز',
//       shipped: 'تم الشحن',
//       delivered: 'تم التسليم',
//       cancelled: 'ملغي'
//     };
//     return statusMap[status] || status;
//   };

//   const viewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowModal(true);
//   };

//   const deleteOrder = async (orderId) => {
//     if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
//     try {
//       const { error } = await supabase
//         .from('orders')
//         .delete()
//         .eq('id', orderId);

//       if (error) throw error;
      
//       // تحديث الـ state محلياً
//       setOrders(prev => prev.filter(order => order.id !== orderId));
//       alert('✅ تم حذف الطلب بنجاح');
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       alert(`❌ حدث خطأ: ${error.message}`);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statuses = {
//       pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
//       confirmed: { variant: 'success', text: '✅ تم التأكيد' },
//       processing: { variant: 'info', text: '🔄 قيد التجهيز' },
//       shipped: { variant: 'primary', text: '🚚 تم الشحن' },
//       delivered: { variant: 'success', text: '🎉 تم التسليم' },
//       cancelled: { variant: 'danger', text: '❌ ملغي' }
//     };
    
//     const statusInfo = statuses[status] || { variant: 'secondary', text: status };
//     return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
//   };

//   const preparePrint = (order) => {
//     setPrintOrder(order);
//     setTimeout(() => {
//       window.print();
//     }, 100);
//   };

//   const PrintInvoice = () => {
//     if (!printOrder) return null;
    
//     const items = JSON.parse(printOrder.items || '[]');
//     const orderDate = new Date(printOrder.created_at).toLocaleString('ar-EG');
    
//     return (
//       <div className="d-none d-print-block" ref={printRef}>
//         <style>
//           {`
//             @media print {
//               body * {
//                 visibility: hidden;
//               }
//               #print-section, #print-section * {
//                 visibility: visible;
//               }
//               #print-section {
//                 position: absolute;
//                 left: 0;
//                 top: 0;
//                 width: 100%;
//                 font-family: 'Arial', sans-serif;
//               }
//             }
//           `}
//         </style>
        
//         <div id="print-section" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//           {/* Header */}
//           <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
//             <h1 style={{ margin: 0, color: '#2c3e50' }}>فاتورة طلب</h1>
//             <h3 style={{ margin: '10px 0', color: '#3498db' }}>متجرك الإلكتروني</h3>
//             <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
//               📞 الهاتف: 01234567890 | 📧 البريد: store@example.com
//             </p>
//           </div>
          
//           {/* Order Info */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
//             <div>
//               <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات الطلب:</h4>
//               <p style={{ margin: '5px 0' }}><strong>رقم الطلب:</strong> #{printOrder.id.slice(0, 8)}</p>
//               <p style={{ margin: '5px 0' }}><strong>تاريخ الطلب:</strong> {orderDate}</p>
//               <p style={{ margin: '5px 0' }}><strong>حالة الطلب:</strong> {getStatusText(printOrder.status)}</p>
//             </div>
            
//             <div style={{ textAlign: 'right' }}>
//               <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات العميل:</h4>
//               <p style={{ margin: '5px 0' }}><strong>الاسم:</strong> {printOrder.customer_name || 'زائر'}</p>
//               <p style={{ margin: '5px 0' }}><strong>الهاتف:</strong> {printOrder.customer_phone || 'غير محدد'}</p>
//               <p style={{ margin: '5px 0' }}><strong>العنوان:</strong> {printOrder.customer_address || 'غير محدد'}</p>
//             </div>
//           </div>
          
//           {/* Products Table */}
//           <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>المنتجات:</h4>
//           <table style={{ 
//             width: '100%', 
//             borderCollapse: 'collapse', 
//             marginBottom: '30px',
//             border: '1px solid #ddd'
//           }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f8f9fa' }}>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>#</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>المنتج</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>السعر</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>الكمية</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>المجموع</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, index) => (
//                 <tr key={index}>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{index + 1}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>{item.name}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.price} ج.م</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
//                     {item.price * item.quantity} ج.م
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {/* Summary */}
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between',
//             marginTop: '30px',
//             paddingTop: '20px',
//             borderTop: '2px dashed #ddd'
//           }}>
//             <div>
//               <h4 style={{ color: '#2c3e50' }}>ملاحظات:</h4>
//               <p style={{ color: '#7f8c8d' }}>{printOrder.notes || 'لا توجد ملاحظات'}</p>
//             </div>
            
//             <div style={{ textAlign: 'left' }}>
//               <div style={{ marginBottom: '10px' }}>
//                 <span style={{ display: 'inline-block', width: '150px' }}>عدد القطع:</span>
//                 <strong>{printOrder.total_items || 0}</strong>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <span style={{ display: 'inline-block', width: '150px' }}>الإجمالي:</span>
//                 <strong style={{ fontSize: '18px', color: '#27ae60' }}>{printOrder.total_price || 0} ج.م</strong>
//               </div>
//             </div>
//           </div>
          
//           {/* Footer */}
//           <div style={{ 
//             marginTop: '50px', 
//             textAlign: 'center', 
//             paddingTop: '20px',
//             borderTop: '2px solid #333',
//             color: '#7f8c8d'
//           }}>
//             <p>شكراً لتعاملكم معنا</p>
//             <p>للاستفسار: 01234567890 | www.yourstore.com</p>
//             <p style={{ fontSize: '12px', marginTop: '20px' }}>
//               تاريخ الطباعة: {new Date().toLocaleString('ar-EG')}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const checkDataSync = async () => {
//     console.log("🔍 Checking data sync...");
    
//     try {
//       const { data: freshData, error } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (error) {
//         console.error("❌ Error fetching fresh data:", error);
//         return;
//       }
      
//       console.log(`📊 Fresh data: ${freshData.length} orders`);
//       console.log(`📊 Current state: ${orders.length} orders`);
      
//       // التحقق من الاختلافات
//       const localIds = orders.map(o => o.id).sort();
//       const freshIds = freshData.map(o => o.id).sort();
      
//       if (JSON.stringify(localIds) !== JSON.stringify(freshIds)) {
//         console.log("⚠️ Order count mismatch detected!");
//       }
      
//       // التحقق من حالة كل طلب
//       const mismatches = [];
//       orders.forEach(localOrder => {
//         const freshOrder = freshData.find(o => o.id === localOrder.id);
//         if (freshOrder && localOrder.status !== freshOrder.status) {
//           mismatches.push({
//             id: localOrder.id,
//             localStatus: localOrder.status,
//             freshStatus: freshOrder.status
//           });
//         }
//       });
      
//       if (mismatches.length > 0) {
//         console.log(`⚠️ Found ${mismatches.length} status mismatches:`, mismatches);
//         alert(`⚠️ تم اكتشاف ${mismatches.length} طلب بحالة غير متطابقة مع السيرفر`);
//       } else {
//         console.log("✅ All orders are in sync");
//         alert('✅ البيانات متزامنة مع السيرفر');
//       }
      
//     } catch (error) {
//       console.error("❌ Error in checkDataSync:", error);
//       alert('❌ حدث خطأ في المزامنة');
//     }
//   };

//   const fixCustomerDisplay = () => {
//     console.log("👤 Checking customer data display...");
    
//     if (orders.length === 0) {
//       console.log("No orders to check");
//       return;
//     }
    
//     console.log("\n📋 All orders customer data:");
//     orders.forEach((order, index) => {
//       console.log(`\nOrder ${index + 1}:`);
//       console.log("  ID:", order.id?.slice(0, 8));
//       console.log("  Customer Name:", order.customer_name || "❌ Missing");
//       console.log("  Customer Phone:", order.customer_phone || "❌ Missing");
//       console.log("  Status:", order.status);
//       console.log("  Local Update:", order._localUpdate ? "Yes" : "No");
      
//       // تحقق من البيانات الكاملة
//       if (!order.customer_name || !order.customer_phone) {
//         console.log("  ⚠️ Missing customer data!");
//       }
//     });
    
//     alert('✅ تم فحص بيانات العملاء، راجع الـ console');
//   };

//   const createFallbackProducts = async () => {
//     try {
//       if (!confirm('هل تريد إنشاء منتجات تجريبية؟')) return;
      
//       const sampleProducts = [
//         {
//           name: 'تجريبي 1',
//           price: 100,
//           stock: 50,
//           number: '72',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         },
//         {
//           name: 'تجريبي 2',
//           price: 200,
//           stock: 30,
//           number: '43',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         },
//         {
//           name: 'تجريبي 3',
//           price: 150,
//           stock: 20,
//           number: '55',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         }
//       ];
      
//       const { error } = await supabase
//         .from('products')
//         .insert(sampleProducts);
      
//       if (error) {
//         console.error("❌ Error creating products:", error);
//         alert('❌ حدث خطأ في إنشاء المنتجات');
//       } else {
//         console.log("✅ Created sample products");
//         alert('✅ تم إنشاء منتجات تجريبية بنجاح');
//       }
//     } catch (error) {
//       console.error("💥 Error in createFallbackProducts:", error);
//     }
//   };

//   // إحصائيات
//   const stats = {
//     total: orders.length,
//     pending: orders.filter(o => o.status === 'pending').length,
//     confirmed: orders.filter(o => o.status === 'confirmed').length,
//     revenue: orders.reduce((sum, order) => sum + (order.total_price || 0), 0),
//     localUpdates: orders.filter(o => o._localUpdate).length
//   };

//   if (!isAdmin) {
//     return (
//       <Container className="py-5">
//         <div className="text-center">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">جارٍ التحميل...</span>
//           </Spinner>
//           <p className="mt-2">جارٍ التحقق من الصلاحية...</p>
//         </div>
//       </Container>
//     );
//   }

//   if (loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">جاري التحميل...</span>
//         </Spinner>
//         <p className="mt-2">جاري تحميل الطلبات...</p>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <PrintInvoice />
      
//       <Container className="py-4">
//         {/* Header */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h2>📋 لوحة إدارة الطلبات</h2>
//             <p className="text-muted">مرحباً بك في لوحة التحكم</p>
//             {stats.localUpdates > 0 && (
//               <Badge bg="warning" className="ms-2">
//                 ⚠️ {stats.localUpdates} تحديث محلي
//               </Badge>
//             )}
//           </div>
//           <div className="d-flex gap-2">
//             <Button 
//               variant="outline-primary" 
//               onClick={() => fetchOrders()}
//               title="تحديث البيانات من السيرفر"
//             >
//               🔄 تحديث
//             </Button>
//             <Button 
//               variant="outline-info" 
//               onClick={debugDatabase}
//               title="فحص قاعدة البيانات بالكامل"
//             >
//               🐛 فحص DB
//             </Button>
//             <Button 
//               variant="outline-warning" 
//               onClick={fixCustomerDisplay}
//               size="sm"
//             >
//               👤 فحص بيانات
//             </Button>
//             <Button 
//               variant="outline-success" 
//               onClick={createFallbackProducts}
//               size="sm"
//             >
//               ➕ منتجات تجريبية
//             </Button>
//             <Button 
//               variant="outline-secondary" 
//               onClick={checkDataSync}
//               size="sm"
//             >
//               🔍 فحص المزامنة
//             </Button>
//             <Button 
//               variant="outline-danger" 
//               onClick={forceSyncOrders}
//               size="sm"
//             >
//               ⚡ فرض المزامنة
//             </Button>
//             <Button variant="outline-danger" onClick={handleLogout}>
//               🚪 خروج
//             </Button>
//           </div>
//         </div>

//         {/* Visual Indicators */}
//         <div className="d-flex align-items-center gap-3 mb-3">
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-success rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">مؤكد</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-warning rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">قيد الانتظار</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-danger rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">ملغي</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-info rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">قيد التجهيز</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-primary rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">تم الشحن</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-warning rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">تحديث محلي</small>
//           </div>
//         </div>

//         {/* رسائل الخطأ */}
//         {error && (
//           <Alert variant="danger" className="mb-4">
//             <Alert.Heading>⚠️ خطأ</Alert.Heading>
//             <p>{error}</p>
//             <hr />
//             <div className="d-flex justify-content-end">
//               <Button variant="outline-danger" onClick={() => setError(null)}>
//                 إغلاق
//               </Button>
//             </div>
//           </Alert>
//         )}

//         {/* إحصائيات */}
//         <Row className="mb-4">
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>🕒 قيد الانتظار</Card.Title>
//                 <h3 className={stats.pending > 0 ? 'text-warning' : 'text-muted'}>
//                   {stats.pending}
//                 </h3>
//                 <small className="text-muted">طلبات تحتاج مراجعة</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>✅ مؤكدة</Card.Title>
//                 <h3 className="text-success">{stats.confirmed}</h3>
//                 <small className="text-muted">طلبات تم تأكيدها</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>💰 إجمالي المبيعات</Card.Title>
//                 <h3 className="text-primary">{stats.revenue} ج.م</h3>
//                 <small className="text-muted">قيمة الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>📦 كل الطلبات</Card.Title>
//                 <h3 className="text-info">{stats.total}</h3>
//                 {stats.localUpdates > 0 && (
//                   <Badge bg="warning" className="mt-1">
//                     {stats.localUpdates} تحديث محلي
//                   </Badge>
//                 )}
//                 <small className="text-muted">إجمالي الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* جدول الطلبات */}
//         {orders.length > 0 ? (
//           <Card className="shadow-sm">
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table hover className="align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th>#</th>
//                       <th>العميل</th>
//                       <th>التاريخ</th>
//                       <th>المبلغ</th>
//                       <th>القطع</th>
//                       <th>الحالة</th>
//                       <th>الإجراءات</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((order, index) => (
//                       <tr key={order.id} className={order._localUpdate ? 'table-warning' : ''}>
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <strong>#{order.id?.slice(0, 8) || 'N/A'}</strong>
//                             {order._localUpdate && (
//                               <Badge bg="warning" className="ms-2" size="sm">
//                                 محلي
//                               </Badge>
//                             )}
//                           </div>
//                           <small className="text-muted">{index + 1}</small>
//                         </td>
//                         <td>
//                           <div>
//                             <strong className={order.customer_name ? '' : 'text-danger'}>
//                               {order.customer_name || '❌ بدون اسم'}
//                             </strong>
//                             <br />
//                             <small className={order.customer_phone ? 'text-muted' : 'text-danger'}>
//                               {order.customer_phone || '❌ بدون هاتف'}
//                             </small>
//                             {order.customer_address && (
//                               <>
//                                 <br />
//                                 <small className="text-muted">
//                                   📍 {order.customer_address}
//                                 </small>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           {order.created_at ? (
//                             <>
//                               {new Date(order.created_at).toLocaleDateString('ar-EG')}
//                               <br />
//                               <small>{new Date(order.created_at).toLocaleTimeString('ar-EG')}</small>
//                             </>
//                           ) : 'غير محدد'}
//                         </td>
//                         <td>
//                           <strong className="text-success">{order.total_price || 0} ج.م</strong>
//                         </td>
//                         <td>
//                           <Badge bg="info">{order.total_items || 0}</Badge>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center gap-2">
//                             {getStatusBadge(order.status || 'pending')}
//                             <Dropdown>
//                               <Dropdown.Toggle variant="outline-secondary" size="sm" id="status-dropdown">
//                                 تغيير
//                               </Dropdown.Toggle>
//                               <Dropdown.Menu>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'pending')}>
//                                   قيد الانتظار
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'confirmed')}>
//                                   تأكيد
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'processing')}>
//                                   تجهيز
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'shipped')}>
//                                   شحن
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'delivered')}>
//                                   تسليم
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'cancelled')}>
//                                   إلغاء
//                                 </Dropdown.Item>
//                               </Dropdown.Menu>
//                             </Dropdown>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="d-flex gap-2 flex-wrap">
//                             <Button 
//                               size="sm" 
//                               variant={order.status === 'confirmed' ? 'success' : 'outline-success'}
//                               onClick={async () => {
//                                 if (order.status === 'confirmed') {
//                                   alert('الطلب مؤكد بالفعل!');
//                                   return;
//                                 }
                                
//                                 if (!confirm(`هل تريد تأكيد الطلب #${order.id.slice(0, 8)}؟`)) return;
                                
//                                 await updateOrderStatus(order.id, 'confirmed');
//                               }}
//                               disabled={updatingStatus[order.id]}
//                             >
//                               {updatingStatus[order.id] ? (
//                                 <>
//                                   <Spinner size="sm" animation="border" className="me-1" />
//                                   تحديث...
//                                 </>
//                               ) : order.status === 'confirmed' ? (
//                                 <>
//                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle me-1" viewBox="0 0 16 16">
//                                     <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
//                                     <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
//                                   </svg>
//                                   مؤكد
//                                 </>
//                               ) : (
//                                 'تأكيد'
//                               )}
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-info" 
//                               onClick={() => viewOrderDetails(order)}
//                             >
//                               عرض
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-primary" 
//                               onClick={() => preparePrint(order)}
//                             >
//                               🖨️ طباعة
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-secondary" 
//                               onClick={() => verifyOrderStatus(order.id)}
//                               title="التحقق من حالة الطلب في قاعدة البيانات"
//                             >
//                               🔍 تحقق
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-danger" 
//                               onClick={() => deleteOrder(order.id)}
//                             >
//                               حذف
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         ) : (
//           <Card className="shadow-sm">
//             <Card.Body className="text-center py-5">
//               <div className="mb-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#6c757d" className="bi bi-inbox" viewBox="0 0 16 16">
//                   <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
//                 </svg>
//               </div>
//               <h5>لا توجد طلبات</h5>
//               <p className="text-muted mb-0">لم يتم تسجيل أي طلبات حتى الآن</p>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Modal للتفاصيل */}
//         <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//           <Modal.Header closeButton>
//             <Modal.Title>
//               تفاصيل الطلب #{selectedOrder?.id?.slice(0, 8) || 'N/A'}
//               {selectedOrder?._localUpdate && (
//                 <Badge bg="warning" className="ms-2">
//                   تحديث محلي
//                 </Badge>
//               )}
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedOrder && (
//               <div>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <h5>👤 معلومات العميل:</h5>
//                     <p><strong>الاسم:</strong> {selectedOrder.customer_name || 'زائر'}</p>
//                     <p><strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}</p>
//                     <p><strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}</p>
//                   </Col>
//                   <Col md={6}>
//                     <h5>📄 معلومات الطلب:</h5>
//                     <p><strong>التاريخ:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                     <p><strong>الحالة:</strong> {getStatusBadge(selectedOrder.status || 'pending')}</p>
//                     <p><strong>آخر تحديث:</strong> {selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                     {selectedOrder._localUpdate && (
//                       <p><strong>💡 ملاحظة:</strong> هذا التحديث محلي ولم تتم مزامنته مع السيرفر بعد</p>
//                     )}
//                   </Col>
//                 </Row>

//                 <hr />

//                 <h5>🛒 المنتجات:</h5>
//                 {selectedOrder.items ? (
//                   <>
//                     <Table responsive bordered className="mt-3">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>المنتج</th>
//                           <th>السعر</th>
//                           <th>الكمية</th>
//                           <th>المجموع</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(() => {
//                           try {
//                             const items = JSON.parse(selectedOrder.items);
//                             return items.map((item, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.name || 'منتج غير محدد'}</td>
//                                 <td>{item.price || 0} ج.م</td>
//                                 <td>{item.quantity || 0}</td>
//                                 <td>{(item.price || 0) * (item.quantity || 0)} ج.م</td>
//                               </tr>
//                             ));
//                           } catch (error) {
//                             return (
//                               <tr>
//                                 <td colSpan="5" className="text-center text-danger">
//                                   ❌ خطأ في تحليل المنتجات: {error.message}
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         })()}
//                       </tbody>
//                     </Table>
//                   </>
//                 ) : (
//                   <Alert variant="warning">لا توجد معلومات عن المنتجات</Alert>
//                 )}

//                 <div className="text-end mt-3">
//                   <h5>📊 ملخص:</h5>
//                   <p><strong>عدد القطع:</strong> {selectedOrder.total_items || 0}</p>
//                   <p><strong>الإجمالي:</strong> {selectedOrder.total_price || 0} ج.م</p>
//                 </div>

//                 {selectedOrder.notes && (
//                   <>
//                     <hr />
//                     <h5>📝 ملاحظات:</h5>
//                     <p>{selectedOrder.notes}</p>
//                   </>
//                 )}

//                 {/* أزرار إضافية في المودال */}
//                 <div className="d-flex gap-2 mt-4 pt-3 border-top">
//                   <Button 
//                     variant={selectedOrder.status === 'confirmed' ? 'success' : 'outline-success'}
//                     onClick={() => {
//                       updateOrderStatus(selectedOrder.id, 'confirmed');
//                       setShowModal(false);
//                     }}
//                     disabled={selectedOrder.status === 'confirmed' || updatingStatus[selectedOrder.id]}
//                   >
//                     {updatingStatus[selectedOrder.id] ? (
//                       <>
//                         <Spinner size="sm" animation="border" className="me-2" />
//                         جاري التحديث...
//                       </>
//                     ) : selectedOrder.status === 'confirmed' ? (
//                       '✅ تم التأكيد'
//                     ) : (
//                       'تأكيد الطلب'
//                     )}
//                   </Button>
//                   <Button 
//                     variant="outline-primary" 
//                     onClick={() => {
//                       setShowModal(false);
//                       preparePrint(selectedOrder);
//                     }}
//                   >
//                     🖨️ طباعة الفاتورة
//                   </Button>
//                   <Button 
//                     variant="outline-secondary" 
//                     onClick={() => {
//                       verifyOrderStatus(selectedOrder.id);
//                     }}
//                   >
//                     🔍 التحقق من المزامنة
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               إغلاق
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     </>
//   );
// }



// "use client";
// import { useState, useEffect, useRef } from "react";
// import { 
//   Container, 
//   Table, 
//   Button, 
//   Badge, 
//   Modal, 
//   Alert, 
//   Card, 
//   Dropdown,
//   Row,
//   Col,
//   Spinner
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { useRouter } from "next/navigation";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [error, setError] = useState(null);
//   const [printOrder, setPrintOrder] = useState(null);
//   const [updatingStatus, setUpdatingStatus] = useState({});
//   const printRef = useRef();
//   const router = useRouter();

//   useEffect(() => {
//     // التحقق من إذا المستخدم أدمن
//     const loggedIn = localStorage.getItem("isAdmin");
//     if (loggedIn !== "true") {
//       router.push("/dashboard/login");
//     } else {
//       setIsAdmin(true);
//       fetchOrders();
//     }
//   }, [router]);

//   useEffect(() => {
//     if (!isAdmin) return;
    
//     // إعداد real-time subscription
//     try {
//       const channel = supabase
//         .channel('orders-realtime')
//         .on(
//           'postgres_changes',
//           {
//             event: '*',
//             schema: 'public',
//             table: 'orders'
//           },
//           (payload) => {
//             console.log('🔔 Real-time update:', payload.eventType);
            
//             if (payload.eventType === 'UPDATE') {
//               setOrders(prev => prev.map(order => 
//                 order.id === payload.new.id ? { ...order, ...payload.new } : order
//               ));
//             } else if (payload.eventType === 'INSERT') {
//               setOrders(prev => [payload.new, ...prev]);
//             } else if (payload.eventType === 'DELETE') {
//               setOrders(prev => prev.filter(order => order.id !== payload.old.id));
//             }
//           }
//         )
//         .subscribe();
      
//       return () => {
//         supabase.removeChannel(channel);
//       };
//     } catch (error) {
//       console.error("❌ Error setting up real-time:", error);
//     }
//   }, [isAdmin]);

//   useEffect(() => {
//     if (!isAdmin || orders.length === 0) return;
    
//     // Auto-refresh كل 30 ثانية
//     const intervalId = setInterval(() => {
//       console.log("🔄 Auto-refreshing orders...");
//       fetchOrders();
//     }, 30000);
    
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [isAdmin, orders.length]);

//   useEffect(() => {
//     if (!isAdmin) return;
    
//     // إضافة listener للـ visibility change
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') {
//         console.log("👀 Tab became visible, refreshing...");
//         fetchOrders();
//       }
//     };
    
//     document.addEventListener('visibilitychange', handleVisibilityChange);
    
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [isAdmin]);

//   useEffect(() => {
//     if (orders.length > 0) {
//       console.log("📊 Orders loaded, checking data integrity...");
      
//       // فحص بيانات العملاء
//       const ordersWithMissingData = orders.filter(order => 
//         !order.customer_name || !order.customer_phone
//       );
      
//       if (ordersWithMissingData.length > 0) {
//         console.warn(`⚠️ ${ordersWithMissingData.length} orders missing customer data`);
//         ordersWithMissingData.forEach(order => {
//           console.log(`   Order ${order.id?.slice(0, 8)}:`, {
//             customer_name: order.customer_name,
//             customer_phone: order.customer_phone
//           });
//         });
//       }
//     }
//   }, [orders]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       console.log("🔄 Fetching orders from Supabase...");
      
//       const { data, error: ordersError } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (ordersError) {
//         console.error("❌ Error fetching orders:", ordersError);
//         throw ordersError;
//       }

//       console.log(`✅ Fetched ${data?.length || 0} orders`);
//       setOrders(data || []);
//       setError(null);
      
//     } catch (error) {
//       console.error("❌ Error in fetchOrders:", error);
//       setError(`خطأ في جلب الطلبات: ${error.message}`);
      
//       // عرض تفاصيل الخطأ
//       if (error.code === 'PGRST116') {
//         alert('❌ خطأ في استعلام قاعدة البيانات: الطلب غير موجود');
//       } else if (error.code === '42501') {
//         alert('❌ ليس لديك صلاحية للوصول إلى الطلبات');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("isAdmin");
//     router.push("/dashboard/login");
//   };

//   // دالة لفحص قاعدة البيانات بالكامل
//   const debugDatabase = async () => {
//     try {
//       console.log("🔍 Starting comprehensive database debug...");
      
//       // 1. تحقق من جداول قاعدة البيانات
//       console.log("\n📊 1. Checking database tables...");
      
//       // جلب أسماء الجداول
//       const { data: tables, error: tablesError } = await supabase
//         .from('information_schema.tables')
//         .select('table_name')
//         .eq('table_schema', 'public');
      
//       if (tablesError) {
//         console.error("❌ Error fetching tables:", tablesError);
//       } else {
//         console.log("✅ Available tables:", tables?.map(t => t.table_name) || []);
//       }
      
//       // 2. تحقق من جدول الـ products
//       console.log("\n📦 2. Checking products table...");
      
//       // أولا: حاول تجدول products
//       const { data: allProducts, error: productsError } = await supabase
//         .from('products')
//         .select('*')
//         .limit(10);
      
//       if (productsError) {
//         console.error("❌ Error fetching products:", productsError);
//       } else if (!allProducts || allProducts.length === 0) {
//         console.warn("⚠️ Products table is empty or doesn't exist");
        
//         // تحقق من هيكل الجدول حتى لو كان فاضي
//         const { data: columns, error: columnsError } = await supabase
//           .from('information_schema.columns')
//           .select('column_name, data_type')
//           .eq('table_name', 'products')
//           .eq('table_schema', 'public');
        
//         if (columnsError) {
//           console.error("❌ Error fetching columns:", columnsError);
//         } else {
//           console.log("📝 Products table structure:", columns);
//         }
//       } else {
//         console.log(`✅ Found ${allProducts.length} products`);
//         console.log("📋 Sample products:", allProducts);
        
//         // عرض الـ columns المتاحة
//         if (allProducts.length > 0) {
//           console.log("📝 Available columns:", Object.keys(allProducts[0]));
//         }
//       }
      
//       // 3. تحقق من جدول الـ orders
//       console.log("\n📋 3. Checking orders table...");
      
//       const { data: allOrders, error: ordersError } = await supabase
//         .from('orders')
//         .select('*')
//         .limit(5);
      
//       if (ordersError) {
//         console.error("❌ Error fetching orders:", ordersError);
//       } else if (!allOrders || allOrders.length === 0) {
//         console.warn("⚠️ Orders table is empty");
//       } else {
//         console.log(`✅ Found ${allOrders.length} orders`);
        
//         // تحليل بيانات طلب واحد
//         const sampleOrder = allOrders[0];
//         console.log("\n📄 Sample order details:");
//         console.log("   ID:", sampleOrder.id);
//         console.log("   Customer Name:", sampleOrder.customer_name);
//         console.log("   Customer Phone:", sampleOrder.customer_phone);
//         console.log("   Status:", sampleOrder.status);
//         console.log("   Items JSON:", sampleOrder.items ? "Exists" : "Missing");
        
//         if (sampleOrder.items) {
//           try {
//             const items = JSON.parse(sampleOrder.items);
//             console.log("   Parsed Items:", items);
//             console.log("   Items count:", items.length);
            
//             if (items.length > 0) {
//               console.log("   First item:", items[0]);
//             }
//           } catch (e) {
//             console.error("   ❌ Error parsing items:", e.message);
//           }
//         }
//       }
      
//       // 4. تحقق من جدول الـ profiles
//       console.log("\n👤 4. Checking profiles table...");
      
//       const { data: profiles, error: profilesError } = await supabase
//         .from('profiles')
//         .select('*')
//         .limit(5);
      
//       if (profilesError) {
//         console.error("❌ Error fetching profiles:", profilesError);
//       } else if (!profiles || profiles.length === 0) {
//         console.warn("⚠️ Profiles table is empty");
//       } else {
//         console.log(`✅ Found ${profiles.length} profiles`);
//         console.log("📋 Sample profile:", profiles[0]);
//       }
      
//       console.log("\n🔧 5. Checking environment...");
//       console.log("   Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing");
//       console.log("   Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing");
      
//       // 6. فحص البيانات الحالية في الـ state
//       console.log("\n📱 6. Checking current state...");
//       console.log("   Orders in state:", orders.length);
//       console.log("   Is Admin:", isAdmin);
//       console.log("   Loading:", loading);
      
//       if (orders.length > 0) {
//         console.log("   First order in state:", {
//           id: orders[0].id,
//           customer_name: orders[0].customer_name,
//           customer_phone: orders[0].customer_phone,
//           status: orders[0].status
//         });
//       }
      
//       alert('✅ تم فحص قاعدة البيانات، راجع الـ console للتفاصيل');
      
//     } catch (error) {
//       console.error("💥 Error in debugDatabase:", error);
//       alert('❌ حدث خطأ في فحص قاعدة البيانات');
//     }
//   };

//   // دالة لتحديث المخزون عند تأكيد الطلب
//   const updateProductStock = async (orderId, items) => {
//     try {
//       console.log("📦 Starting stock update for order:", orderId);
//       console.log("📝 Items received:", items);
      
//       // إذا ما لقيناش products في قاعدة البيانات، نعمل حل مؤقت
//       const { data: productsCheck, error: checkError } = await supabase
//         .from('products')
//         .select('count')
//         .limit(1);
      
//       if (checkError || !productsCheck) {
//         console.warn("⚠️ Cannot access products table, using fallback method");
//         return {
//           stockUpdates: [],
//           successfulUpdates: 0,
//           failedUpdates: items.length,
//           error: "Products table not accessible"
//         };
//       }
      
//       const stockUpdates = [];
      
//       for (const item of items) {
//         if (!item.id) {
//           console.warn(`⚠️ Item ${item.name} has no ID`);
//           continue;
//         }
        
//         const itemId = item.id.toString();
//         console.log(`🔍 Looking for product: ${item.name} (ID: ${itemId})`);
        
//         // محاولة البحث بكل الطرق
//         let product = null;
//         let searchMethod = '';
        
//         // 1. البحث بالـ number أولاً (هذا هو الأهم)
//         const { data: byNumber } = await supabase
//           .from('products')
//           .select('*')
//           .eq('number', itemId)
//           .maybeSingle();
        
//         if (byNumber) {
//           product = byNumber;
//           searchMethod = 'number';
//         } else {
//           // 2. البحث بالاسم
//           const { data: byName } = await supabase
//             .from('products')
//             .select('*')
//             .ilike('name', `%${item.name}%`)
//             .maybeSingle();
          
//           if (byName) {
//             product = byName;
//             searchMethod = 'name';
//           } else {
//             // 3. البحث بأي حقل يحتوي على الرقم
//             const { data: byAny } = await supabase
//               .from('products')
//               .select('*')
//               .or(`number.ilike.%${itemId}%,name.ilike.%${itemId}%`)
//               .maybeSingle();
            
//             if (byAny) {
//               product = byAny;
//               searchMethod = 'any';
//             }
//           }
//         }
        
//         if (product) {
//           console.log(`✅ Found product via ${searchMethod}:`, product.name);
          
//           const oldStock = product.stock || 0;
//           const newStock = Math.max(oldStock - item.quantity, 0);
          
//           stockUpdates.push({
//             id: product.id,
//             name: product.name,
//             oldStock,
//             newStock,
//             quantity: item.quantity,
//             searchMethod
//           });
//         } else {
//           console.warn(`❌ Product not found: ${item.name} (ID: ${itemId})`);
          
//           // إذا مش موجود، نجيب كل الـ products عشان نشوف وش موجود
//           const { data: allProducts } = await supabase
//             .from('products')
//             .select('id, name, number, stock')
//             .limit(10);
          
//           console.log(`   Available products (first 10):`, allProducts);
//         }
//       }
      
//       // تحديث المخزون
//       let successfulUpdates = 0;
      
//       for (const update of stockUpdates) {
//         try {
//           const { error: updateError } = await supabase
//             .from('products')
//             .update({
//               stock: update.newStock,
//               updated_at: new Date().toISOString()
//             })
//             .eq('id', update.id);
          
//           if (updateError) {
//             console.error(`❌ Error updating ${update.name}:`, updateError);
//           } else {
//             console.log(`✅ Updated ${update.name}: ${update.oldStock} → ${update.newStock}`);
//             successfulUpdates++;
//           }
//         } catch (error) {
//           console.error(`❌ Exception updating ${update.name}:`, error);
//         }
//       }
      
//       console.log(`📊 Stock update complete: ${successfulUpdates}/${items.length} items updated`);
      
//       return {
//         stockUpdates,
//         successfulUpdates,
//         failedUpdates: items.length - successfulUpdates
//       };
      
//     } catch (error) {
//       console.error("💥 Error in updateProductStock:", error);
//       return {
//         stockUpdates: [],
//         successfulUpdates: 0,
//         failedUpdates: items.length,
//         error: error.message
//       };
//     }
//   };

//   // الدالة الرئيسية لتحديث حالة الطلب (المصححة)
// //   const updateOrderStatus = async (orderId, newStatus) => {
// //     try {
// //       setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
      
// //       console.log(`🔄 Attempting to update order ${orderId} to status: ${newStatus}`);
      
// //       // الحصول على الطلب الحالي
// //       const currentOrder = orders.find(o => o.id === orderId);
// //       if (!currentOrder) {
// //         alert('الطلب غير موجود');
// //         setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
// //         return;
// //       }

// //       // إذا كان التأكيد، تحديث المخزون أولاً
// //       if (newStatus === 'confirmed' && currentOrder.status !== 'confirmed') {
// //         console.log("🔍 Confirming order, checking stock...");
        
// //         try {
// //           let items = [];
// //           if (currentOrder.items) {
// //             try {
// //               items = JSON.parse(currentOrder.items);
// //             } catch (parseError) {
// //               console.error("❌ Error parsing items:", parseError);
// //             }
// //           }
          
// //           if (items.length > 0) {
// //             console.log(`📦 Updating stock for ${items.length} items...`);
// //             const stockResult = await updateProductStock(orderId, items);
// //             console.log("📊 Stock update result:", stockResult);
// //           }
// //         } catch (stockError) {
// //           console.error("❌ Stock update failed, continuing anyway:", stockError);
// //         }
// //       }

// //       // تحديث حالة الطلب في Supabase (بدون .select())
// //       const { error: updateError } = await supabase
// //         .from('orders')
// //         .update({ 
// //           status: newStatus,
// //           updated_at: new Date().toISOString()
// //         })
// //         .eq('id', orderId);

// //       if (updateError) {
// //         console.error("❌ Supabase update error details:", {
// //           code: updateError.code,
// //           message: updateError.message,
// //           details: updateError.details
// //         });
// //         throw updateError;
// //       }

// //       console.log("✅ Update successful!");

// //       // تحديث الـ state محلياً مباشرة
// //       setOrders(prev => prev.map(order => 
// //         order.id === orderId 
// //           ? { 
// //               ...order, 
// //               status: newStatus, 
// //               updated_at: new Date().toISOString() 
// //             }
// //           : order
// //       ));
      
// //       // إظهار رسالة النجاح
// //       alert(`✅ تم تحديث حالة الطلب إلى "${getStatusText(newStatus)}"`);

// //     } catch (error) {
// //       console.error('❌ Error updating order:', {
// //         name: error.name,
// //         message: error.message,
// //         code: error.code
// //       });
      
// //       let userMessage = 'حدث خطأ أثناء تحديث حالة الطلب';
      
// //       if (error.code === '22023') {
// //         userMessage = 'خطأ في تنسيق البيانات المرسلة إلى قاعدة البيانات';
// //       } else if (error.code === '42501') {
// //         userMessage = 'ليس لديك صلاحية لتحديث هذا الطلب';
// //       } else if (error.message.includes('cannot extract elements from a scalar')) {
// //         userMessage = 'خطأ في استجابة قاعدة البيانات، يرجى المحاولة مرة أخرى';
// //       }
      
// //       alert(`❌ ${userMessage}`);
      
// //       // إعادة جلب البيانات للتأكد من المزامنة
// //       fetchOrders();
      
// //     } finally {
// //       setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
// //     }
// //   };

// // const updateOrderStatus = async (orderId, newStatus) => {
// //   try {
// //     setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
    
// //     console.log(`🔄 Attempting to update order ${orderId} to status: ${newStatus}`);
    
// //     // الحصول على الطلب الحالي
// //     const currentOrder = orders.find(o => o.id === orderId);
// //     if (!currentOrder) {
// //       alert('الطلب غير موجود');
// //       setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
// //       return;
// //     }

// //     // إذا كان التأكيد، تحديث المخزون أولاً
// //     if (newStatus === 'confirmed' && currentOrder.status !== 'confirmed') {
// //       console.log("🔍 Confirming order, checking stock...");
      
// //       try {
// //         let items = [];
// //         if (currentOrder.items) {
// //           try {
// //             items = JSON.parse(currentOrder.items);
// //           } catch (parseError) {
// //             console.error("❌ Error parsing items:", parseError);
// //           }
// //         }
        
// //         if (items.length > 0) {
// //           console.log(`📦 Updating stock for ${items.length} items...`);
// //           const stockResult = await updateProductStock(orderId, items);
// //           console.log("📊 Stock update result:", stockResult);
// //         }
// //       } catch (stockError) {
// //         console.error("❌ Stock update failed, continuing anyway:", stockError);
// //       }
// //     }

// //     // تحديث حالة الطلب في Supabase - الطريقة البسيطة
// //     const { error: updateError } = await supabase
// //       .from('orders')
// //       .update({ 
// //         status: newStatus,
// //         updated_at: new Date().toISOString()
// //       })
// //       .eq('id', orderId);

// //     if (updateError) {
// //       // عرض الخطأ بشكل مفصل
// //       console.error("❌ Supabase update error:", updateError);
// //       console.error("❌ Error code:", updateError.code);
// //       console.error("❌ Error message:", updateError.message);
// //       console.error("❌ Error details:", updateError.details);
      
// //       throw new Error(updateError.message || 'فشل تحديث حالة الطلب');
// //     }

// //     console.log("✅ Update successful!");

// //     // تحديث الـ state محلياً مباشرة
// //     setOrders(prev => prev.map(order => 
// //       order.id === orderId 
// //         ? { 
// //             ...order, 
// //             status: newStatus, 
// //             updated_at: new Date().toISOString() 
// //           }
// //         : order
// //     ));
    
// //     // إظهار رسالة النجاح
// //     alert(`✅ تم تحديث حالة الطلب إلى "${getStatusText(newStatus)}"`);

// //   } catch (error) {
// //     console.error('❌ Error updating order:', error);
    
// //     let userMessage = 'حدث خطأ أثناء تحديث حالة الطلب';
    
// //     if (error.message.includes('cannot extract elements from a scalar')) {
// //       userMessage = 'خطأ في استجابة قاعدة البيانات - ربما هناك مشكلة في بنية الجدول';
// //     } else if (error.message.includes('permission denied')) {
// //       userMessage = 'ليس لديك صلاحية لتحديث هذا الطلب';
// //     } else if (error.code === '42501') {
// //       userMessage = 'خطأ في الصلاحيات، يرجى التحقق من سياسات الأمان';
// //     }
    
// //     alert(`❌ ${userMessage}`);
    
// //     // إعادة جلب البيانات للتأكد من المزامنة
// //     fetchOrders();
    
// //   } finally {
// //     setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
// //   }
// // };


// const quickUpdateOrderStatus = async (orderId, newStatus) => {
//   // تحديث فوري للواجهة
//   setOrders(prev => prev.map(order => 
//     order.id === orderId 
//       ? { ...order, status: newStatus }
//       : order
//   ));
  
//   // تحديث المخزون إذا كان تأكيد
//   if (newStatus === 'confirmed') {
//     const order = orders.find(o => o.id === orderId);
//     if (order && order.items) {
//       try {
//         const items = JSON.parse(order.items);
//         if (items.length > 0) {
//           updateProductStock(orderId, items);
//         }
//       } catch (e) {}
//     }
//   }
  
//   // تحديث قاعدة البيانات في الخلفية
//   supabase
//     .from('orders')
//     .update({ status: newStatus })
//     .eq('id', orderId)
//     .then(({ error }) => {
//       if (error) {
//         console.warn("⚠️ Sync issue:", error);
//       }
//     });
  
//   alert(`✅ تم تحديث الحالة`);
// };

//   // دالة لاختبار تحديث الطلب مباشرة
//   const testDirectUpdate = async (orderId) => {
//     try {
//       console.log(`🧪 Testing direct update for order: ${orderId}`);
      
//       // الطريقة 1: تحديث مباشر بدون select
//       const { error: simpleUpdateError } = await supabase
//         .from('orders')
//         .update({ 
//           status: 'pending',
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', orderId);

//       if (simpleUpdateError) {
//         console.error("❌ Simple update failed:", simpleUpdateError);
//       } else {
//         console.log("✅ Simple update successful");
//       }

//       // الطريقة 2: جلب البيانات بعد التحديث
//       const { data: fetchedData, error: fetchError } = await supabase
//         .from('orders')
//         .select('id, status, updated_at')
//         .eq('id', orderId)
//         .maybeSingle(); // استخدم maybeSingle بدلاً من single

//       if (fetchError) {
//         console.error("❌ Fetch after update failed:", fetchError);
//       } else {
//         console.log("✅ Fetched after update:", fetchedData);
//       }

//       return { simpleUpdateError, fetchedData };
      
//     } catch (error) {
//       console.error("💥 Test failed:", error);
//       throw error;
//     }
//   };

//   // دالة بديلة آمنة للتحديث
//   const safeUpdateOrderStatus = async (orderId, newStatus) => {
//     try {
//       // 1. تحديث بسيط بدون إرجاع بيانات
//       const { error } = await supabase
//         .from('orders')
//         .update({ 
//           status: newStatus,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', orderId);

//       if (error) throw error;

//       // 2. تحديث الـ state مباشرة
//       setOrders(prev => prev.map(order => 
//         order.id === orderId 
//           ? { ...order, status: newStatus }
//           : order
//       ));

//       alert(`✅ تم تحديث الحالة إلى ${getStatusText(newStatus)}`);
      
//     } catch (error) {
//       console.error("❌ Error in safe update:", error);
//       alert('❌ حدث خطأ، سيتم تحديث البيانات...');
      
//       // 3. إعادة جلب البيانات
//       await fetchOrders();
//     }
//   };

//   const getStatusText = (status) => {
//     const statusMap = {
//       pending: 'قيد الانتظار',
//       confirmed: 'تم التأكيد',
//       processing: 'قيد التجهيز',
//       shipped: 'تم الشحن',
//       delivered: 'تم التسليم',
//       cancelled: 'ملغي'
//     };
//     return statusMap[status] || status;
//   };

//   const viewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowModal(true);
//   };

//   const deleteOrder = async (orderId) => {
//     if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
//     try {
//       const { error } = await supabase
//         .from('orders')
//         .delete()
//         .eq('id', orderId);

//       if (error) throw error;
      
//       // تحديث الـ state محلياً
//       setOrders(prev => prev.filter(order => order.id !== orderId));
//       alert('✅ تم حذف الطلب بنجاح');
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       alert(`❌ حدث خطأ: ${error.message}`);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statuses = {
//       pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
//       confirmed: { variant: 'success', text: '✅ تم التأكيد' },
//       processing: { variant: 'info', text: '🔄 قيد التجهيز' },
//       shipped: { variant: 'primary', text: '🚚 تم الشحن' },
//       delivered: { variant: 'success', text: '🎉 تم التسليم' },
//       cancelled: { variant: 'danger', text: '❌ ملغي' }
//     };
    
//     const statusInfo = statuses[status] || { variant: 'secondary', text: status };
//     return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
//   };

//   const preparePrint = (order) => {
//     setPrintOrder(order);
//     setTimeout(() => {
//       window.print();
//     }, 100);
//   };

//   const PrintInvoice = () => {
//     if (!printOrder) return null;
    
//     const items = JSON.parse(printOrder.items || '[]');
//     const orderDate = new Date(printOrder.created_at).toLocaleString('ar-EG');
    
//     return (
//       <div className="d-none d-print-block" ref={printRef}>
//         <style>
//           {`
//             @media print {
//               body * {
//                 visibility: hidden;
//               }
//               #print-section, #print-section * {
//                 visibility: visible;
//               }
//               #print-section {
//                 position: absolute;
//                 left: 0;
//                 top: 0;
//                 width: 100%;
//                 font-family: 'Arial', sans-serif;
//               }
//             }
//           `}
//         </style>
        
//         <div id="print-section" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//           {/* Header */}
//           <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
//             <h1 style={{ margin: 0, color: '#2c3e50' }}>فاتورة طلب</h1>
//             <h3 style={{ margin: '10px 0', color: '#3498db' }}>متجرك الإلكتروني</h3>
//             <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
//               📞 الهاتف: 01234567890 | 📧 البريد: store@example.com
//             </p>
//           </div>
          
//           {/* Order Info */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
//             <div>
//               <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات الطلب:</h4>
//               <p style={{ margin: '5px 0' }}><strong>رقم الطلب:</strong> #{printOrder.id.slice(0, 8)}</p>
//               <p style={{ margin: '5px 0' }}><strong>تاريخ الطلب:</strong> {orderDate}</p>
//               <p style={{ margin: '5px 0' }}><strong>حالة الطلب:</strong> {getStatusText(printOrder.status)}</p>
//             </div>
            
//             <div style={{ textAlign: 'right' }}>
//               <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات العميل:</h4>
//               <p style={{ margin: '5px 0' }}><strong>الاسم:</strong> {printOrder.customer_name || 'زائر'}</p>
//               <p style={{ margin: '5px 0' }}><strong>الهاتف:</strong> {printOrder.customer_phone || 'غير محدد'}</p>
//               <p style={{ margin: '5px 0' }}><strong>العنوان:</strong> {printOrder.customer_address || 'غير محدد'}</p>
//             </div>
//           </div>
          
//           {/* Products Table */}
//           <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>المنتجات:</h4>
//           <table style={{ 
//             width: '100%', 
//             borderCollapse: 'collapse', 
//             marginBottom: '30px',
//             border: '1px solid #ddd'
//           }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f8f9fa' }}>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>#</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>المنتج</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>السعر</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>الكمية</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>المجموع</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, index) => (
//                 <tr key={index}>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{index + 1}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>{item.name}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.price} ج.م</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
//                     {item.price * item.quantity} ج.م
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {/* Summary */}
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between',
//             marginTop: '30px',
//             paddingTop: '20px',
//             borderTop: '2px dashed #ddd'
//           }}>
//             <div>
//               <h4 style={{ color: '#2c3e50' }}>ملاحظات:</h4>
//               <p style={{ color: '#7f8c8d' }}>{printOrder.notes || 'لا توجد ملاحظات'}</p>
//             </div>
            
//             <div style={{ textAlign: 'left' }}>
//               <div style={{ marginBottom: '10px' }}>
//                 <span style={{ display: 'inline-block', width: '150px' }}>عدد القطع:</span>
//                 <strong>{printOrder.total_items || 0}</strong>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <span style={{ display: 'inline-block', width: '150px' }}>الإجمالي:</span>
//                 <strong style={{ fontSize: '18px', color: '#27ae60' }}>{printOrder.total_price || 0} ج.م</strong>
//               </div>
//             </div>
//           </div>
          
//           {/* Footer */}
//           <div style={{ 
//             marginTop: '50px', 
//             textAlign: 'center', 
//             paddingTop: '20px',
//             borderTop: '2px solid #333',
//             color: '#7f8c8d'
//           }}>
//             <p>شكراً لتعاملكم معنا</p>
//             <p>للاستفسار: 01234567890 | www.yourstore.com</p>
//             <p style={{ fontSize: '12px', marginTop: '20px' }}>
//               تاريخ الطباعة: {new Date().toLocaleString('ar-EG')}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const checkDataSync = async () => {
//     console.log("🔍 Checking data sync...");
    
//     try {
//       const { data: freshData, error } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (error) {
//         console.error("❌ Error fetching fresh data:", error);
//         return;
//       }
      
//       console.log(`📊 Fresh data: ${freshData.length} orders`);
//       console.log(`📊 Current state: ${orders.length} orders`);
      
//       if (JSON.stringify(freshData.map(o => o.id).sort()) !== JSON.stringify(orders.map(o => o.id).sort())) {
//         console.log("⚠️ Data mismatch detected! Syncing...");
//         setOrders(freshData);
//         alert('✅ تم مزامنة البيانات مع السيرفر');
//       } else {
//         console.log("✅ Data is in sync");
//         alert('✅ البيانات متزامنة مع السيرفر');
//       }
      
//     } catch (error) {
//       console.error("❌ Error in checkDataSync:", error);
//       alert('❌ حدث خطأ في المزامنة');
//     }
//   };

//   const fixCustomerDisplay = () => {
//     console.log("👤 Checking customer data display...");
    
//     if (orders.length === 0) {
//       console.log("No orders to check");
//       return;
//     }
    
//     console.log("\n📋 All orders customer data:");
//     orders.forEach((order, index) => {
//       console.log(`\nOrder ${index + 1}:`);
//       console.log("  ID:", order.id?.slice(0, 8));
//       console.log("  Customer Name:", order.customer_name || "❌ Missing");
//       console.log("  Customer Phone:", order.customer_phone || "❌ Missing");
//       console.log("  Status:", order.status);
      
//       // تحقق من البيانات الكاملة
//       if (!order.customer_name || !order.customer_phone) {
//         console.log("  ⚠️ Missing customer data!");
//         console.log("  Full order data:", order);
//       }
//     });
    
//     alert('✅ تم فحص بيانات العملاء، راجع الـ console');
//   };

//   const createFallbackProducts = async () => {
//     try {
//       if (!confirm('هل تريد إنشاء منتجات تجريبية؟')) return;
      
//       const sampleProducts = [
//         {
//           name: 'تجريبي 1',
//           price: 100,
//           stock: 50,
//           number: '72',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         },
//         {
//           name: 'تجريبي 2',
//           price: 200,
//           stock: 30,
//           number: '43',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         },
//         {
//           name: 'تجريبي 3',
//           price: 150,
//           stock: 20,
//           number: '55',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         }
//       ];
      
//       const { error } = await supabase
//         .from('products')
//         .insert(sampleProducts);
      
//       if (error) {
//         console.error("❌ Error creating products:", error);
//         alert('❌ حدث خطأ في إنشاء المنتجات');
//       } else {
//         console.log("✅ Created sample products");
//         alert('✅ تم إنشاء منتجات تجريبية بنجاح');
//       }
//     } catch (error) {
//       console.error("💥 Error in createFallbackProducts:", error);
//     }
//   };

//   // إحصائيات
//   const stats = {
//     total: orders.length,
//     pending: orders.filter(o => o.status === 'pending').length,
//     confirmed: orders.filter(o => o.status === 'confirmed').length,
//     revenue: orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
//   };

//   if (!isAdmin) {
//     return (
//       <Container className="py-5">
//         <div className="text-center">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">جارٍ التحميل...</span>
//           </Spinner>
//           <p className="mt-2">جارٍ التحقق من الصلاحية...</p>
//         </div>
//       </Container>
//     );
//   }

//   if (loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">جاري التحميل...</span>
//         </Spinner>
//         <p className="mt-2">جاري تحميل الطلبات...</p>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <PrintInvoice />
      
//       <Container className="py-4">
//         {/* Header */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h2>📋 لوحة إدارة الطلبات</h2>
//             <p className="text-muted">مرحباً بك في لوحة التحكم</p>
//           </div>
//           <div className="d-flex gap-2">
//             <Button 
//               variant="outline-primary" 
//               onClick={fetchOrders}
//               title="تحديث البيانات من السيرفر"
//             >
//               🔄 تحديث
//             </Button>
//             <Button 
//               variant="outline-info" 
//               onClick={debugDatabase}
//               title="فحص قاعدة البيانات بالكامل"
//             >
//               🐛 فحص DB
//             </Button>
//             <Button 
//               variant="outline-warning" 
//               onClick={fixCustomerDisplay}
//               size="sm"
//             >
//               👤 فحص بيانات
//             </Button>
//             <Button 
//               variant="outline-success" 
//               onClick={createFallbackProducts}
//               size="sm"
//             >
//               ➕ منتجات تجريبية
//             </Button>
//             <Button 
//               variant="outline-secondary" 
//               onClick={() => {
//                 if (orders.length > 0) {
//                   testDirectUpdate(orders[0].id);
//                 } else {
//                   alert('لا توجد طلبات للاختبار');
//                 }
//               }}
//               size="sm"
//             >
//               🧪 اختبار تحديث
//             </Button>
//             <Button variant="outline-danger" onClick={handleLogout}>
//               🚪 خروج
//             </Button>
//           </div>
//         </div>

//         {/* Visual Indicators */}
//         <div className="d-flex align-items-center gap-3 mb-3">
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-success rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">مؤكد</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-warning rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">قيد الانتظار</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-danger rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">ملغي</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-info rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">قيد التجهيز</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-primary rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">تم الشحن</small>
//           </div>
//         </div>

//         {/* رسائل الخطأ */}
//         {error && (
//           <Alert variant="danger" className="mb-4">
//             <Alert.Heading>⚠️ خطأ</Alert.Heading>
//             <p>{error}</p>
//             <hr />
//             <div className="d-flex justify-content-end">
//               <Button variant="outline-danger" onClick={() => setError(null)}>
//                 إغلاق
//               </Button>
//             </div>
//           </Alert>
//         )}

//         {/* إحصائيات */}
//         <Row className="mb-4">
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>🕒 قيد الانتظار</Card.Title>
//                 <h3 className={stats.pending > 0 ? 'text-warning' : 'text-muted'}>
//                   {stats.pending}
//                 </h3>
//                 <small className="text-muted">طلبات تحتاج مراجعة</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>✅ مؤكدة</Card.Title>
//                 <h3 className="text-success">{stats.confirmed}</h3>
//                 <small className="text-muted">طلبات تم تأكيدها</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>💰 إجمالي المبيعات</Card.Title>
//                 <h3 className="text-primary">{stats.revenue} ج.م</h3>
//                 <small className="text-muted">قيمة الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>📦 كل الطلبات</Card.Title>
//                 <h3 className="text-info">{stats.total}</h3>
//                 <small className="text-muted">إجمالي الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* جدول الطلبات */}
//         {orders.length > 0 ? (
//           <Card className="shadow-sm">
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table hover className="align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th>#</th>
//                       <th>العميل</th>
//                       <th>التاريخ</th>
//                       <th>المبلغ</th>
//                       <th>القطع</th>
//                       <th>الحالة</th>
//                       <th>الإجراءات</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((order, index) => (
//                       <tr key={order.id}>
//                         <td>
//                           <strong>#{order.id?.slice(0, 8) || 'N/A'}</strong>
//                           <br />
//                           <small className="text-muted">{index + 1}</small>
//                         </td>
//                         <td>
//                           <div>
//                             <strong className={order.customer_name ? '' : 'text-danger'}>
//                               {order.customer_name || '❌ بدون اسم'}
//                             </strong>
//                             <br />
//                             <small className={order.customer_phone ? 'text-muted' : 'text-danger'}>
//                               {order.customer_phone || '❌ بدون هاتف'}
//                             </small>
//                             {order.customer_address && (
//                               <>
//                                 <br />
//                                 <small className="text-muted">
//                                   📍 {order.customer_address}
//                                 </small>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           {order.created_at ? (
//                             <>
//                               {new Date(order.created_at).toLocaleDateString('ar-EG')}
//                               <br />
//                               <small>{new Date(order.created_at).toLocaleTimeString('ar-EG')}</small>
//                             </>
//                           ) : 'غير محدد'}
//                         </td>
//                         <td>
//                           <strong className="text-success">{order.total_price || 0} ج.م</strong>
//                         </td>
//                         <td>
//                           <Badge bg="info">{order.total_items || 0}</Badge>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center gap-2">
//                             {getStatusBadge(order.status || 'pending')}
//                             <Dropdown>
//                               <Dropdown.Toggle variant="outline-secondary" size="sm" id="status-dropdown">
//                                 تغيير
//                               </Dropdown.Toggle>
//                               <Dropdown.Menu>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'pending')}>
//                                   قيد الانتظار
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'confirmed')}>
//                                   تأكيد
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'processing')}>
//                                   تجهيز
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'shipped')}>
//                                   شحن
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'delivered')}>
//                                   تسليم
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'cancelled')}>
//                                   إلغاء
//                                 </Dropdown.Item>
//                               </Dropdown.Menu>
//                             </Dropdown>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="d-flex gap-2 flex-wrap">
//                             {/* <Button 
//                               size="sm" 
//                               variant={order.status === 'confirmed' ? 'success' : 'outline-success'}
//                               onClick={async () => {
//                                 if (order.status === 'confirmed') {
//                                   alert('الطلب مؤكد بالفعل!');
//                                   return;
//                                 }
                                
//                                 if (!confirm(`هل تريد تأكيد الطلب #${order.id.slice(0, 8)}؟`)) return;
                                
//                                 await updateOrderStatus(order.id, 'confirmed');
//                               }}
//                               disabled={updatingStatus[order.id]}
//                             >
//                               {updatingStatus[order.id] ? (
//                                 <Spinner size="sm" animation="border" />
//                               ) : order.status === 'confirmed' ? (
//                                 <>
//                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle me-1" viewBox="0 0 16 16">
//                                     <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
//                                     <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
//                                   </svg>
//                                   مؤكد
//                                 </>
//                               ) : (
//                                 'تأكيد'
//                               )}
//                             </Button> */}
//                             <Button 
//   size="sm" 
//   variant={order.status === 'confirmed' ? 'success' : 'outline-success'}
//   onClick={async () => {
//     if (order.status === 'confirmed') {
//       alert('الطلب مؤكد بالفعل!');
//       return;
//     }
    
//     if (!confirm(`هل تريد تأكيد الطلب #${order.id.slice(0, 8)}؟`)) return;
    
//     await quickUpdateOrderStatus(order.id, 'confirmed');
//   }}
//   disabled={updatingStatus[order.id]}
// >
//   {updatingStatus[order.id] ? (
//     <Spinner size="sm" animation="border" />
//   ) : order.status === 'confirmed' ? (
//     <>
//       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle me-1" viewBox="0 0 16 16">
//         <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
//         <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
//       </svg>
//       مؤكد
//     </>
//   ) : (
//     'تأكيد'
//   )}
// </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-info" 
//                               onClick={() => viewOrderDetails(order)}
//                             >
//                               عرض
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-primary" 
//                               onClick={() => preparePrint(order)}
//                             >
//                               🖨️ طباعة
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-danger" 
//                               onClick={() => deleteOrder(order.id)}
//                             >
//                               حذف
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         ) : (
//           <Card className="shadow-sm">
//             <Card.Body className="text-center py-5">
//               <div className="mb-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#6c757d" className="bi bi-inbox" viewBox="0 0 16 16">
//                   <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
//                 </svg>
//               </div>
//               <h5>لا توجد طلبات</h5>
//               <p className="text-muted mb-0">لم يتم تسجيل أي طلبات حتى الآن</p>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Modal للتفاصيل */}
//         <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//           <Modal.Header closeButton>
//             <Modal.Title>
//               تفاصيل الطلب #{selectedOrder?.id?.slice(0, 8) || 'N/A'}
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedOrder && (
//               <div>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <h5>👤 معلومات العميل:</h5>
//                     <p><strong>الاسم:</strong> {selectedOrder.customer_name || 'زائر'}</p>
//                     <p><strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}</p>
//                     <p><strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}</p>
//                   </Col>
//                   <Col md={6}>
//                     <h5>📄 معلومات الطلب:</h5>
//                     <p><strong>التاريخ:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                     <p><strong>الحالة:</strong> {getStatusBadge(selectedOrder.status || 'pending')}</p>
//                     <p><strong>آخر تحديث:</strong> {selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                   </Col>
//                 </Row>

//                 <hr />

//                 <h5>🛒 المنتجات:</h5>
//                 {selectedOrder.items ? (
//                   <>
//                     <Table responsive bordered className="mt-3">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>المنتج</th>
//                           <th>السعر</th>
//                           <th>الكمية</th>
//                           <th>المجموع</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(() => {
//                           try {
//                             const items = JSON.parse(selectedOrder.items);
//                             return items.map((item, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.name || 'منتج غير محدد'}</td>
//                                 <td>{item.price || 0} ج.م</td>
//                                 <td>{item.quantity || 0}</td>
//                                 <td>{(item.price || 0) * (item.quantity || 0)} ج.م</td>
//                               </tr>
//                             ));
//                           } catch (error) {
//                             return (
//                               <tr>
//                                 <td colSpan="5" className="text-center text-danger">
//                                   ❌ خطأ في تحليل المنتجات: {error.message}
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         })()}
//                       </tbody>
//                     </Table>
//                   </>
//                 ) : (
//                   <Alert variant="warning">لا توجد معلومات عن المنتجات</Alert>
//                 )}

//                 <div className="text-end mt-3">
//                   <h5>📊 ملخص:</h5>
//                   <p><strong>عدد القطع:</strong> {selectedOrder.total_items || 0}</p>
//                   <p><strong>الإجمالي:</strong> {selectedOrder.total_price || 0} ج.م</p>
//                 </div>

//                 {selectedOrder.notes && (
//                   <>
//                     <hr />
//                     <h5>📝 ملاحظات:</h5>
//                     <p>{selectedOrder.notes}</p>
//                   </>
//                 )}

//                 {/* أزرار إضافية في المودال */}
//                 <div className="d-flex gap-2 mt-4 pt-3 border-top">
//                   <Button 
//                     variant={selectedOrder.status === 'confirmed' ? 'success' : 'outline-success'}
//                     onClick={() => {
//                       quickUpdateOrderStatus(selectedOrder.id, 'confirmed');
//                       setShowModal(false);
//                     }}
//                     disabled={selectedOrder.status === 'confirmed' || updatingStatus[selectedOrder.id]}
//                   >
//                     {updatingStatus[selectedOrder.id] ? (
//                       <>
//                         <Spinner size="sm" animation="border" className="me-2" />
//                         جاري التحديث...
//                       </>
//                     ) : selectedOrder.status === 'confirmed' ? (
//                       '✅ تم التأكيد'
//                     ) : (
//                       'تأكيد الطلب'
//                     )}
//                   </Button>
//                   <Button 
//                     variant="outline-primary" 
//                     onClick={() => {
//                       setShowModal(false);
//                       preparePrint(selectedOrder);
//                     }}
//                   >
//                     🖨️ طباعة الفاتورة
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               إغلاق
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     </>
//   );
// }





//////Very good///////////////////////////////////////////////////////////////////////////////////////////////////////////

// "use client";
// import { useState, useEffect, useRef } from "react";
// import { 
//   Container, 
//   Table, 
//   Button, 
//   Badge, 
//   Modal, 
//   Alert, 
//   Card, 
//   Dropdown,
//   Row,
//   Col,
//   Spinner
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { useRouter } from "next/navigation";

// export default function AdminOrdersPage() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [error, setError] = useState(null);
//   const [printOrder, setPrintOrder] = useState(null);
//   const [updatingStatus, setUpdatingStatus] = useState({});
//   const printRef = useRef();
//   const router = useRouter();

//   useEffect(() => {
//     // التحقق من إذا المستخدم أدمن
//     const loggedIn = localStorage.getItem("isAdmin");
//     if (loggedIn !== "true") {
//       router.push("/dashboard/login");
//     } else {
//       setIsAdmin(true);
//       fetchOrders();
//     }
//   }, [router]);

//   useEffect(() => {
//     if (!isAdmin) return;
    
//     // إعداد real-time subscription
//     try {
//       const channel = supabase
//         .channel('orders-realtime')
//         .on(
//           'postgres_changes',
//           {
//             event: '*',
//             schema: 'public',
//             table: 'orders'
//           },
//           (payload) => {
//             console.log('🔔 Real-time update:', payload.eventType);
            
//             if (payload.eventType === 'UPDATE') {
//               setOrders(prev => prev.map(order => 
//                 order.id === payload.new.id ? { ...order, ...payload.new } : order
//               ));
//             } else if (payload.eventType === 'INSERT') {
//               setOrders(prev => [payload.new, ...prev]);
//             } else if (payload.eventType === 'DELETE') {
//               setOrders(prev => prev.filter(order => order.id !== payload.old.id));
//             }
//           }
//         )
//         .subscribe();
      
//       return () => {
//         supabase.removeChannel(channel);
//       };
//     } catch (error) {
//       console.error("❌ Error setting up real-time:", error);
//     }
//   }, [isAdmin]);

//   useEffect(() => {
//     if (!isAdmin || orders.length === 0) return;
    
//     // Auto-refresh كل 30 ثانية
//     const intervalId = setInterval(() => {
//       console.log("🔄 Auto-refreshing orders...");
//       fetchOrders();
//     }, 30000);
    
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [isAdmin, orders.length]);

//   useEffect(() => {
//     if (!isAdmin) return;
    
//     // إضافة listener للـ visibility change
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === 'visible') {
//         console.log("👀 Tab became visible, refreshing...");
//         fetchOrders();
//       }
//     };
    
//     document.addEventListener('visibilitychange', handleVisibilityChange);
    
//     return () => {
//       document.removeEventListener('visibilitychange', handleVisibilityChange);
//     };
//   }, [isAdmin]);

//   useEffect(() => {
//     if (orders.length > 0) {
//       console.log("📊 Orders loaded, checking data integrity...");
      
//       // فحص بيانات العملاء
//       const ordersWithMissingData = orders.filter(order => 
//         !order.customer_name || !order.customer_phone
//       );
      
//       if (ordersWithMissingData.length > 0) {
//         console.warn(`⚠️ ${ordersWithMissingData.length} orders missing customer data`);
//         ordersWithMissingData.forEach(order => {
//           console.log(`   Order ${order.id?.slice(0, 8)}:`, {
//             customer_name: order.customer_name,
//             customer_phone: order.customer_phone
//           });
//         });
//       }
//     }
//   }, [orders]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       console.log("🔄 Fetching orders from Supabase...");
      
//       const { data, error: ordersError } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (ordersError) {
//         console.error("❌ Error fetching orders:", ordersError);
//         throw ordersError;
//       }

//       console.log(`✅ Fetched ${data?.length || 0} orders`);
//       setOrders(data || []);
//       setError(null);
      
//     } catch (error) {
//       console.error("❌ Error in fetchOrders:", error);
//       setError(`خطأ في جلب الطلبات: ${error.message}`);
      
//       // عرض تفاصيل الخطأ
//       if (error.code === 'PGRST116') {
//         alert('❌ خطأ في استعلام قاعدة البيانات: الطلب غير موجود');
//       } else if (error.code === '42501') {
//         alert('❌ ليس لديك صلاحية للوصول إلى الطلبات');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("isAdmin");
//     router.push("/dashboard/login");
//   };

//   // دالة لفحص قاعدة البيانات بالكامل
//   const debugDatabase = async () => {
//     try {
//       console.log("🔍 Starting comprehensive database debug...");
      
//       // 1. تحقق من جداول قاعدة البيانات
//       console.log("\n📊 1. Checking database tables...");
      
//       // جلب أسماء الجداول
//       const { data: tables, error: tablesError } = await supabase
//         .from('information_schema.tables')
//         .select('table_name')
//         .eq('table_schema', 'public');
      
//       if (tablesError) {
//         console.error("❌ Error fetching tables:", tablesError);
//       } else {
//         console.log("✅ Available tables:", tables?.map(t => t.table_name) || []);
//       }
      
//       // 2. تحقق من جدول الـ products
//       console.log("\n📦 2. Checking products table...");
      
//       // أولا: حاول تجدول products
//       const { data: allProducts, error: productsError } = await supabase
//         .from('products')
//         .select('*')
//         .limit(10);
      
//       if (productsError) {
//         console.error("❌ Error fetching products:", productsError);
//       } else if (!allProducts || allProducts.length === 0) {
//         console.warn("⚠️ Products table is empty or doesn't exist");
        
//         // تحقق من هيكل الجدول حتى لو كان فاضي
//         const { data: columns, error: columnsError } = await supabase
//           .from('information_schema.columns')
//           .select('column_name, data_type')
//           .eq('table_name', 'products')
//           .eq('table_schema', 'public');
        
//         if (columnsError) {
//           console.error("❌ Error fetching columns:", columnsError);
//         } else {
//           console.log("📝 Products table structure:", columns);
//         }
//       } else {
//         console.log(`✅ Found ${allProducts.length} products`);
//         console.log("📋 Sample products:", allProducts);
        
//         // عرض الـ columns المتاحة
//         if (allProducts.length > 0) {
//           console.log("📝 Available columns:", Object.keys(allProducts[0]));
//         }
//       }
      
//       // 3. تحقق من جدول الـ orders
//       console.log("\n📋 3. Checking orders table...");
      
//       const { data: allOrders, error: ordersError } = await supabase
//         .from('orders')
//         .select('*')
//         .limit(5);
      
//       if (ordersError) {
//         console.error("❌ Error fetching orders:", ordersError);
//       } else if (!allOrders || allOrders.length === 0) {
//         console.warn("⚠️ Orders table is empty");
//       } else {
//         console.log(`✅ Found ${allOrders.length} orders`);
        
//         // تحليل بيانات طلب واحد
//         const sampleOrder = allOrders[0];
//         console.log("\n📄 Sample order details:");
//         console.log("   ID:", sampleOrder.id);
//         console.log("   Customer Name:", sampleOrder.customer_name);
//         console.log("   Customer Phone:", sampleOrder.customer_phone);
//         console.log("   Status:", sampleOrder.status);
//         console.log("   Items JSON:", sampleOrder.items ? "Exists" : "Missing");
        
//         if (sampleOrder.items) {
//           try {
//             const items = JSON.parse(sampleOrder.items);
//             console.log("   Parsed Items:", items);
//             console.log("   Items count:", items.length);
            
//             if (items.length > 0) {
//               console.log("   First item:", items[0]);
//             }
//           } catch (e) {
//             console.error("   ❌ Error parsing items:", e.message);
//           }
//         }
//       }
      
//       // 4. تحقق من جدول الـ profiles
//       console.log("\n👤 4. Checking profiles table...");
      
//       const { data: profiles, error: profilesError } = await supabase
//         .from('profiles')
//         .select('*')
//         .limit(5);
      
//       if (profilesError) {
//         console.error("❌ Error fetching profiles:", profilesError);
//       } else if (!profiles || profiles.length === 0) {
//         console.warn("⚠️ Profiles table is empty");
//       } else {
//         console.log(`✅ Found ${profiles.length} profiles`);
//         console.log("📋 Sample profile:", profiles[0]);
//       }
      
//       console.log("\n🔧 5. Checking environment...");
//       console.log("   Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing");
//       console.log("   Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing");
      
//       // 6. فحص البيانات الحالية في الـ state
//       console.log("\n📱 6. Checking current state...");
//       console.log("   Orders in state:", orders.length);
//       console.log("   Is Admin:", isAdmin);
//       console.log("   Loading:", loading);
      
//       if (orders.length > 0) {
//         console.log("   First order in state:", {
//           id: orders[0].id,
//           customer_name: orders[0].customer_name,
//           customer_phone: orders[0].customer_phone,
//           status: orders[0].status
//         });
//       }
      
//       alert('✅ تم فحص قاعدة البيانات، راجع الـ console للتفاصيل');
      
//     } catch (error) {
//       console.error("💥 Error in debugDatabase:", error);
//       alert('❌ حدث خطأ في فحص قاعدة البيانات');
//     }
//   };

//   // دالة لتحديث المخزون عند تأكيد الطلب
//   const updateProductStock = async (orderId, items) => {
//     try {
//       console.log("📦 Starting stock update for order:", orderId);
//       console.log("📝 Items received:", items);
      
//       // إذا ما لقيناش products في قاعدة البيانات، نعمل حل مؤقت
//       const { data: productsCheck, error: checkError } = await supabase
//         .from('products')
//         .select('count')
//         .limit(1);
      
//       if (checkError || !productsCheck) {
//         console.warn("⚠️ Cannot access products table, using fallback method");
//         return {
//           stockUpdates: [],
//           successfulUpdates: 0,
//           failedUpdates: items.length,
//           error: "Products table not accessible"
//         };
//       }
      
//       const stockUpdates = [];
      
//       for (const item of items) {
//         if (!item.id) {
//           console.warn(`⚠️ Item ${item.name} has no ID`);
//           continue;
//         }
        
//         const itemId = item.id.toString();
//         console.log(`🔍 Looking for product: ${item.name} (ID: ${itemId})`);
        
//         // محاولة البحث بكل الطرق
//         let product = null;
//         let searchMethod = '';
        
//         // 1. البحث بالـ number أولاً (هذا هو الأهم)
//         const { data: byNumber } = await supabase
//           .from('products')
//           .select('*')
//           .eq('number', itemId)
//           .maybeSingle();
        
//         if (byNumber) {
//           product = byNumber;
//           searchMethod = 'number';
//         } else {
//           // 2. البحث بالاسم
//           const { data: byName } = await supabase
//             .from('products')
//             .select('*')
//             .ilike('name', `%${item.name}%`)
//             .maybeSingle();
          
//           if (byName) {
//             product = byName;
//             searchMethod = 'name';
//           } else {
//             // 3. البحث بأي حقل يحتوي على الرقم
//             const { data: byAny } = await supabase
//               .from('products')
//               .select('*')
//               .or(`number.ilike.%${itemId}%,name.ilike.%${itemId}%`)
//               .maybeSingle();
            
//             if (byAny) {
//               product = byAny;
//               searchMethod = 'any';
//             }
//           }
//         }
        
//         if (product) {
//           console.log(`✅ Found product via ${searchMethod}:`, product.name);
          
//           const oldStock = product.stock || 0;
//           const newStock = Math.max(oldStock - item.quantity, 0);
          
//           stockUpdates.push({
//             id: product.id,
//             name: product.name,
//             oldStock,
//             newStock,
//             quantity: item.quantity,
//             searchMethod
//           });
//         } else {
//           console.warn(`❌ Product not found: ${item.name} (ID: ${itemId})`);
          
//           // إذا مش موجود، نجيب كل الـ products عشان نشوف وش موجود
//           const { data: allProducts } = await supabase
//             .from('products')
//             .select('id, name, number, stock')
//             .limit(10);
          
//           console.log(`   Available products (first 10):`, allProducts);
//         }
//       }
      
//       // تحديث المخزون
//       let successfulUpdates = 0;
      
//       for (const update of stockUpdates) {
//         try {
//           const { error: updateError } = await supabase
//             .from('products')
//             .update({
//               stock: update.newStock,
//               updated_at: new Date().toISOString()
//             })
//             .eq('id', update.id);
          
//           if (updateError) {
//             console.error(`❌ Error updating ${update.name}:`, updateError);
//           } else {
//             console.log(`✅ Updated ${update.name}: ${update.oldStock} → ${update.newStock}`);
//             successfulUpdates++;
//           }
//         } catch (error) {
//           console.error(`❌ Exception updating ${update.name}:`, error);
//         }
//       }
      
//       console.log(`📊 Stock update complete: ${successfulUpdates}/${items.length} items updated`);
      
//       return {
//         stockUpdates,
//         successfulUpdates,
//         failedUpdates: items.length - successfulUpdates
//       };
      
//     } catch (error) {
//       console.error("💥 Error in updateProductStock:", error);
//       return {
//         stockUpdates: [],
//         successfulUpdates: 0,
//         failedUpdates: items.length,
//         error: error.message
//       };
//     }
//   };

  

// const quickUpdateOrderStatus = async (orderId, newStatus) => {
//   // تحديث فوري للواجهة
//   setOrders(prev => prev.map(order => 
//     order.id === orderId 
//       ? { ...order, status: newStatus }
//       : order
//   ));
  
//   // تحديث المخزون إذا كان تأكيد
//   if (newStatus === 'confirmed') {
//     const order = orders.find(o => o.id === orderId);
//     if (order && order.items) {
//       try {
//         const items = JSON.parse(order.items);
//         if (items.length > 0) {
//           updateProductStock(orderId, items);
//         }
//       } catch (e) {}
//     }
//   }
  
//   // تحديث قاعدة البيانات في الخلفية
//   supabase
//     .from('orders')
//     .update({ status: newStatus })
//     .eq('id', orderId)
//     .then(({ error }) => {
//       if (error) {
//         console.warn("⚠️ Sync issue:", error);
//       }
//     });
  
//   alert(`✅ تم تحديث الحالة`);
// };

//   // دالة لاختبار تحديث الطلب مباشرة
//   const testDirectUpdate = async (orderId) => {
//     try {
//       console.log(`🧪 Testing direct update for order: ${orderId}`);
      
//       // الطريقة 1: تحديث مباشر بدون select
//       const { error: simpleUpdateError } = await supabase
//         .from('orders')
//         .update({ 
//           status: 'pending',
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', orderId);

//       if (simpleUpdateError) {
//         console.error("❌ Simple update failed:", simpleUpdateError);
//       } else {
//         console.log("✅ Simple update successful");
//       }

//       // الطريقة 2: جلب البيانات بعد التحديث
//       const { data: fetchedData, error: fetchError } = await supabase
//         .from('orders')
//         .select('id, status, updated_at')
//         .eq('id', orderId)
//         .maybeSingle(); // استخدم maybeSingle بدلاً من single

//       if (fetchError) {
//         console.error("❌ Fetch after update failed:", fetchError);
//       } else {
//         console.log("✅ Fetched after update:", fetchedData);
//       }

//       return { simpleUpdateError, fetchedData };
      
//     } catch (error) {
//       console.error("💥 Test failed:", error);
//       throw error;
//     }
//   };

//   // دالة بديلة آمنة للتحديث
//   const safeUpdateOrderStatus = async (orderId, newStatus) => {
//     try {
//       // 1. تحديث بسيط بدون إرجاع بيانات
//       const { error } = await supabase
//         .from('orders')
//         .update({ 
//           status: newStatus,
//           updated_at: new Date().toISOString()
//         })
//         .eq('id', orderId);

//       if (error) throw error;

//       // 2. تحديث الـ state مباشرة
//       setOrders(prev => prev.map(order => 
//         order.id === orderId 
//           ? { ...order, status: newStatus }
//           : order
//       ));

//       alert(`✅ تم تحديث الحالة إلى ${getStatusText(newStatus)}`);
      
//     } catch (error) {
//       console.error("❌ Error in safe update:", error);
//       alert('❌ حدث خطأ، سيتم تحديث البيانات...');
      
//       // 3. إعادة جلب البيانات
//       await fetchOrders();
//     }
//   };

//   const getStatusText = (status) => {
//     const statusMap = {
//       pending: 'قيد الانتظار',
//       confirmed: 'تم التأكيد',
//       processing: 'قيد التجهيز',
//       shipped: 'تم الشحن',
//       delivered: 'تم التسليم',
//       cancelled: 'ملغي'
//     };
//     return statusMap[status] || status;
//   };

//   const viewOrderDetails = (order) => {
//     setSelectedOrder(order);
//     setShowModal(true);
//   };

//   const deleteOrder = async (orderId) => {
//     if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
//     try {
//       const { error } = await supabase
//         .from('orders')
//         .delete()
//         .eq('id', orderId);

//       if (error) throw error;
      
//       // تحديث الـ state محلياً
//       setOrders(prev => prev.filter(order => order.id !== orderId));
//       alert('✅ تم حذف الطلب بنجاح');
//     } catch (error) {
//       console.error('Error deleting order:', error);
//       alert(`❌ حدث خطأ: ${error.message}`);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statuses = {
//       pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
//       confirmed: { variant: 'success', text: '✅ تم التأكيد' },
//       processing: { variant: 'info', text: '🔄 قيد التجهيز' },
//       shipped: { variant: 'primary', text: '🚚 تم الشحن' },
//       delivered: { variant: 'success', text: '🎉 تم التسليم' },
//       cancelled: { variant: 'danger', text: '❌ ملغي' }
//     };
    
//     const statusInfo = statuses[status] || { variant: 'secondary', text: status };
//     return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
//   };

//   const preparePrint = (order) => {
//     setPrintOrder(order);
//     setTimeout(() => {
//       window.print();
//     }, 100);
//   };

//   const PrintInvoice = () => {
//     if (!printOrder) return null;
    
//     const items = JSON.parse(printOrder.items || '[]');
//     const orderDate = new Date(printOrder.created_at).toLocaleString('ar-EG');
    
//     return (
//       <div className="d-none d-print-block" ref={printRef}>
//         <style>
//           {`
//             @media print {
//               body * {
//                 visibility: hidden;
//               }
//               #print-section, #print-section * {
//                 visibility: visible;
//               }
//               #print-section {
//                 position: absolute;
//                 left: 0;
//                 top: 0;
//                 width: 100%;
//                 font-family: 'Arial', sans-serif;
//               }
//             }
//           `}
//         </style>
        
//         <div id="print-section" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//           {/* Header */}
//           <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
//             <h1 style={{ margin: 0, color: '#2c3e50' }}>فاتورة طلب</h1>
//             <h3 style={{ margin: '10px 0', color: '#3498db' }}>متجرك الإلكتروني</h3>
//             <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
//               📞 الهاتف: 01234567890 | 📧 البريد: store@example.com
//             </p>
//           </div>
          
//           {/* Order Info */}
//           <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
//             <div>
//               <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات الطلب:</h4>
//               <p style={{ margin: '5px 0' }}><strong>رقم الطلب:</strong> #{printOrder.id.slice(0, 8)}</p>
//               <p style={{ margin: '5px 0' }}><strong>تاريخ الطلب:</strong> {orderDate}</p>
//               <p style={{ margin: '5px 0' }}><strong>حالة الطلب:</strong> {getStatusText(printOrder.status)}</p>
//             </div>
            
//             <div style={{ textAlign: 'right' }}>
//               <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات العميل:</h4>
//               <p style={{ margin: '5px 0' }}><strong>الاسم:</strong> {printOrder.customer_name || 'زائر'}</p>
//               <p style={{ margin: '5px 0' }}><strong>الهاتف:</strong> {printOrder.customer_phone || 'غير محدد'}</p>
//               <p style={{ margin: '5px 0' }}><strong>العنوان:</strong> {printOrder.customer_address || 'غير محدد'}</p>
//             </div>
//           </div>
          
//           {/* Products Table */}
//           <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>المنتجات:</h4>
//           <table style={{ 
//             width: '100%', 
//             borderCollapse: 'collapse', 
//             marginBottom: '30px',
//             border: '1px solid #ddd'
//           }}>
//             <thead>
//               <tr style={{ backgroundColor: '#f8f9fa' }}>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>#</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>المنتج</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>السعر</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>الكمية</th>
//                 <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>المجموع</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, index) => (
//                 <tr key={index}>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{index + 1}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>{item.name}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.price} ج.م</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
//                   <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
//                     {item.price * item.quantity} ج.م
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
          
//           {/* Summary */}
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between',
//             marginTop: '30px',
//             paddingTop: '20px',
//             borderTop: '2px dashed #ddd'
//           }}>
//             <div>
//               <h4 style={{ color: '#2c3e50' }}>ملاحظات:</h4>
//               <p style={{ color: '#7f8c8d' }}>{printOrder.notes || 'لا توجد ملاحظات'}</p>
//             </div>
            
//             <div style={{ textAlign: 'left' }}>
//               <div style={{ marginBottom: '10px' }}>
//                 <span style={{ display: 'inline-block', width: '150px' }}>عدد القطع:</span>
//                 <strong>{printOrder.total_items || 0}</strong>
//               </div>
//               <div style={{ marginBottom: '10px' }}>
//                 <span style={{ display: 'inline-block', width: '150px' }}>الإجمالي:</span>
//                 <strong style={{ fontSize: '18px', color: '#27ae60' }}>{printOrder.total_price || 0} ج.م</strong>
//               </div>
//             </div>
//           </div>
          
//           {/* Footer */}
//           <div style={{ 
//             marginTop: '50px', 
//             textAlign: 'center', 
//             paddingTop: '20px',
//             borderTop: '2px solid #333',
//             color: '#7f8c8d'
//           }}>
//             <p>شكراً لتعاملكم معنا</p>
//             <p>للاستفسار: 01234567890 | www.yourstore.com</p>
//             <p style={{ fontSize: '12px', marginTop: '20px' }}>
//               تاريخ الطباعة: {new Date().toLocaleString('ar-EG')}
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const checkDataSync = async () => {
//     console.log("🔍 Checking data sync...");
    
//     try {
//       const { data: freshData, error } = await supabase
//         .from('orders')
//         .select('*')
//         .order('created_at', { ascending: false });
      
//       if (error) {
//         console.error("❌ Error fetching fresh data:", error);
//         return;
//       }
      
//       console.log(`📊 Fresh data: ${freshData.length} orders`);
//       console.log(`📊 Current state: ${orders.length} orders`);
      
//       if (JSON.stringify(freshData.map(o => o.id).sort()) !== JSON.stringify(orders.map(o => o.id).sort())) {
//         console.log("⚠️ Data mismatch detected! Syncing...");
//         setOrders(freshData);
//         alert('✅ تم مزامنة البيانات مع السيرفر');
//       } else {
//         console.log("✅ Data is in sync");
//         alert('✅ البيانات متزامنة مع السيرفر');
//       }
      
//     } catch (error) {
//       console.error("❌ Error in checkDataSync:", error);
//       alert('❌ حدث خطأ في المزامنة');
//     }
//   };

//   const fixCustomerDisplay = () => {
//     console.log("👤 Checking customer data display...");
    
//     if (orders.length === 0) {
//       console.log("No orders to check");
//       return;
//     }
    
//     console.log("\n📋 All orders customer data:");
//     orders.forEach((order, index) => {
//       console.log(`\nOrder ${index + 1}:`);
//       console.log("  ID:", order.id?.slice(0, 8));
//       console.log("  Customer Name:", order.customer_name || "❌ Missing");
//       console.log("  Customer Phone:", order.customer_phone || "❌ Missing");
//       console.log("  Status:", order.status);
      
//       // تحقق من البيانات الكاملة
//       if (!order.customer_name || !order.customer_phone) {
//         console.log("  ⚠️ Missing customer data!");
//         console.log("  Full order data:", order);
//       }
//     });
    
//     alert('✅ تم فحص بيانات العملاء، راجع الـ console');
//   };

//   const createFallbackProducts = async () => {
//     try {
//       if (!confirm('هل تريد إنشاء منتجات تجريبية؟')) return;
      
//       const sampleProducts = [
//         {
//           name: 'تجريبي 1',
//           price: 100,
//           stock: 50,
//           number: '72',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         },
//         {
//           name: 'تجريبي 2',
//           price: 200,
//           stock: 30,
//           number: '43',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         },
//         {
//           name: 'تجريبي 3',
//           price: 150,
//           stock: 20,
//           number: '55',
//           description: 'منتج تجريبي',
//           category: 'تجريبي',
//           image_url: 'https://via.placeholder.com/150',
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString()
//         }
//       ];
      
//       const { error } = await supabase
//         .from('products')
//         .insert(sampleProducts);
      
//       if (error) {
//         console.error("❌ Error creating products:", error);
//         alert('❌ حدث خطأ في إنشاء المنتجات');
//       } else {
//         console.log("✅ Created sample products");
//         alert('✅ تم إنشاء منتجات تجريبية بنجاح');
//       }
//     } catch (error) {
//       console.error("💥 Error in createFallbackProducts:", error);
//     }
//   };

//   // إحصائيات
//   const stats = {
//     total: orders.length,
//     pending: orders.filter(o => o.status === 'pending').length,
//     confirmed: orders.filter(o => o.status === 'confirmed').length,
//     revenue: orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
//   };

//   if (!isAdmin) {
//     return (
//       <Container className="py-5">
//         <div className="text-center">
//           <Spinner animation="border" role="status">
//             <span className="visually-hidden">جارٍ التحميل...</span>
//           </Spinner>
//           <p className="mt-2">جارٍ التحقق من الصلاحية...</p>
//         </div>
//       </Container>
//     );
//   }

//   if (loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" role="status">
//           <span className="visually-hidden">جاري التحميل...</span>
//         </Spinner>
//         <p className="mt-2">جاري تحميل الطلبات...</p>
//       </Container>
//     );
//   }

//   return (
//     <>
//       <PrintInvoice />
      
//       <Container className="py-4">
//         {/* Header */}
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <div>
//             <h2>📋 لوحة إدارة الطلبات</h2>
//             <p className="text-muted">مرحباً بك في لوحة التحكم</p>
//           </div>
//           <div className="d-flex gap-2">
//             <Button 
//               variant="outline-primary" 
//               onClick={fetchOrders}
//               title="تحديث البيانات من السيرفر"
//             >
//               🔄 تحديث
//             </Button>
//             <Button 
//               variant="outline-info" 
//               onClick={debugDatabase}
//               title="فحص قاعدة البيانات بالكامل"
//             >
//               🐛 فحص DB
//             </Button>
//             <Button 
//               variant="outline-warning" 
//               onClick={fixCustomerDisplay}
//               size="sm"
//             >
//               👤 فحص بيانات
//             </Button>
//             <Button 
//               variant="outline-success" 
//               onClick={createFallbackProducts}
//               size="sm"
//             >
//               ➕ منتجات تجريبية
//             </Button>
//             <Button 
//               variant="outline-secondary" 
//               onClick={() => {
//                 if (orders.length > 0) {
//                   testDirectUpdate(orders[0].id);
//                 } else {
//                   alert('لا توجد طلبات للاختبار');
//                 }
//               }}
//               size="sm"
//             >
//               🧪 اختبار تحديث
//             </Button>
//             <Button variant="outline-danger" onClick={handleLogout}>
//               🚪 خروج
//             </Button>
//           </div>
//         </div>

//         {/* Visual Indicators */}
//         <div className="d-flex align-items-center gap-3 mb-3">
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-success rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">مؤكد</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-warning rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">قيد الانتظار</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-danger rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">ملغي</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-info rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">قيد التجهيز</small>
//           </div>
//           <div className="d-flex align-items-center gap-1">
//             <div className="bg-primary rounded-circle" style={{ width: '10px', height: '10px' }}></div>
//             <small className="text-muted">تم الشحن</small>
//           </div>
//         </div>

//         {/* رسائل الخطأ */}
//         {error && (
//           <Alert variant="danger" className="mb-4">
//             <Alert.Heading>⚠️ خطأ</Alert.Heading>
//             <p>{error}</p>
//             <hr />
//             <div className="d-flex justify-content-end">
//               <Button variant="outline-danger" onClick={() => setError(null)}>
//                 إغلاق
//               </Button>
//             </div>
//           </Alert>
//         )}

//         {/* إحصائيات */}
//         <Row className="mb-4">
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>🕒 قيد الانتظار</Card.Title>
//                 <h3 className={stats.pending > 0 ? 'text-warning' : 'text-muted'}>
//                   {stats.pending}
//                 </h3>
//                 <small className="text-muted">طلبات تحتاج مراجعة</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>✅ مؤكدة</Card.Title>
//                 <h3 className="text-success">{stats.confirmed}</h3>
//                 <small className="text-muted">طلبات تم تأكيدها</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>💰 إجمالي المبيعات</Card.Title>
//                 <h3 className="text-primary">{stats.revenue} ج.م</h3>
//                 <small className="text-muted">قيمة الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col md={3}>
//             <Card className="text-center">
//               <Card.Body>
//                 <Card.Title>📦 كل الطلبات</Card.Title>
//                 <h3 className="text-info">{stats.total}</h3>
//                 <small className="text-muted">إجمالي الطلبات</small>
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//         {/* جدول الطلبات */}
//         {orders.length > 0 ? (
//           <Card className="shadow-sm">
//             <Card.Body>
//               <div className="table-responsive">
//                 <Table hover className="align-middle">
//                   <thead className="table-light">
//                     <tr>
//                       <th>#</th>
//                       <th>العميل</th>
//                       <th>التاريخ</th>
//                       <th>المبلغ</th>
//                       <th>القطع</th>
//                       <th>الحالة</th>
//                       <th>الإجراءات</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((order, index) => (
//                       <tr key={order.id}>
//                         <td>
//                           <strong>#{order.id?.slice(0, 8) || 'N/A'}</strong>
//                           <br />
//                           <small className="text-muted">{index + 1}</small>
//                         </td>
//                         <td>
//                           <div>
//                             <strong className={order.customer_name ? '' : 'text-danger'}>
//                               {order.customer_name || '❌ بدون اسم'}
//                             </strong>
//                             <br />
//                             <small className={order.customer_phone ? 'text-muted' : 'text-danger'}>
//                               {order.customer_phone || '❌ بدون هاتف'}
//                             </small>
//                             {order.customer_address && (
//                               <>
//                                 <br />
//                                 <small className="text-muted">
//                                   📍 {order.customer_address}
//                                 </small>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                         <td>
//                           {order.created_at ? (
//                             <>
//                               {new Date(order.created_at).toLocaleDateString('ar-EG')}
//                               <br />
//                               <small>{new Date(order.created_at).toLocaleTimeString('ar-EG')}</small>
//                             </>
//                           ) : 'غير محدد'}
//                         </td>
//                         <td>
//                           <strong className="text-success">{order.total_price || 0} ج.م</strong>
//                         </td>
//                         <td>
//                           <Badge bg="info">{order.total_items || 0}</Badge>
//                         </td>
//                         <td>
//                           <div className="d-flex align-items-center gap-2">
//                             {getStatusBadge(order.status || 'pending')}
//                             <Dropdown>
//                               <Dropdown.Toggle variant="outline-secondary" size="sm" id="status-dropdown">
//                                 تغيير
//                               </Dropdown.Toggle>
//                               <Dropdown.Menu>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'pending')}>
//                                   قيد الانتظار
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'confirmed')}>
//                                   تأكيد
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'processing')}>
//                                   تجهيز
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'shipped')}>
//                                   شحن
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'delivered')}>
//                                   تسليم
//                                 </Dropdown.Item>
//                                 <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'cancelled')}>
//                                   إلغاء
//                                 </Dropdown.Item>
//                               </Dropdown.Menu>
//                             </Dropdown>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="d-flex gap-2 flex-wrap">
//                             {/* <Button 
//                               size="sm" 
//                               variant={order.status === 'confirmed' ? 'success' : 'outline-success'}
//                               onClick={async () => {
//                                 if (order.status === 'confirmed') {
//                                   alert('الطلب مؤكد بالفعل!');
//                                   return;
//                                 }
                                
//                                 if (!confirm(`هل تريد تأكيد الطلب #${order.id.slice(0, 8)}؟`)) return;
                                
//                                 await updateOrderStatus(order.id, 'confirmed');
//                               }}
//                               disabled={updatingStatus[order.id]}
//                             >
//                               {updatingStatus[order.id] ? (
//                                 <Spinner size="sm" animation="border" />
//                               ) : order.status === 'confirmed' ? (
//                                 <>
//                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle me-1" viewBox="0 0 16 16">
//                                     <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
//                                     <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
//                                   </svg>
//                                   مؤكد
//                                 </>
//                               ) : (
//                                 'تأكيد'
//                               )}
//                             </Button> */}
//                             <Button 
//   size="sm" 
//   variant={order.status === 'confirmed' ? 'success' : 'outline-success'}
//   onClick={async () => {
//     if (order.status === 'confirmed') {
//       alert('الطلب مؤكد بالفعل!');
//       return;
//     }
    
//     if (!confirm(`هل تريد تأكيد الطلب #${order.id.slice(0, 8)}؟`)) return;
    
//     await quickUpdateOrderStatus(order.id, 'confirmed');
//   }}
//   disabled={updatingStatus[order.id]}
// >
//   {updatingStatus[order.id] ? (
//     <Spinner size="sm" animation="border" />
//   ) : order.status === 'confirmed' ? (
//     <>
//       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle me-1" viewBox="0 0 16 16">
//         <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
//         <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
//       </svg>
//       مؤكد
//     </>
//   ) : (
//     'تأكيد'
//   )}
// </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-info" 
//                               onClick={() => viewOrderDetails(order)}
//                             >
//                               عرض
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-primary" 
//                               onClick={() => preparePrint(order)}
//                             >
//                               🖨️ طباعة
//                             </Button>
//                             <Button 
//                               size="sm" 
//                               variant="outline-danger" 
//                               onClick={() => deleteOrder(order.id)}
//                             >
//                               حذف
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card.Body>
//           </Card>
//         ) : (
//           <Card className="shadow-sm">
//             <Card.Body className="text-center py-5">
//               <div className="mb-3">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#6c757d" className="bi bi-inbox" viewBox="0 0 16 16">
//                   <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
//                 </svg>
//               </div>
//               <h5>لا توجد طلبات</h5>
//               <p className="text-muted mb-0">لم يتم تسجيل أي طلبات حتى الآن</p>
//             </Card.Body>
//           </Card>
//         )}

//         {/* Modal للتفاصيل */}
//         <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
//           <Modal.Header closeButton>
//             <Modal.Title>
//               تفاصيل الطلب #{selectedOrder?.id?.slice(0, 8) || 'N/A'}
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             {selectedOrder && (
//               <div>
//                 <Row className="mb-3">
//                   <Col md={6}>
//                     <h5>👤 معلومات العميل:</h5>
//                     <p><strong>الاسم:</strong> {selectedOrder.customer_name || 'زائر'}</p>
//                     <p><strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}</p>
//                     <p><strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}</p>
//                   </Col>
//                   <Col md={6}>
//                     <h5>📄 معلومات الطلب:</h5>
//                     <p><strong>التاريخ:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                     <p><strong>الحالة:</strong> {getStatusBadge(selectedOrder.status || 'pending')}</p>
//                     <p><strong>آخر تحديث:</strong> {selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
//                   </Col>
//                 </Row>

//                 <hr />

//                 <h5>🛒 المنتجات:</h5>
//                 {selectedOrder.items ? (
//                   <>
//                     <Table responsive bordered className="mt-3">
//                       <thead className="table-light">
//                         <tr>
//                           <th>#</th>
//                           <th>المنتج</th>
//                           <th>السعر</th>
//                           <th>الكمية</th>
//                           <th>المجموع</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(() => {
//                           try {
//                             const items = JSON.parse(selectedOrder.items);
//                             return items.map((item, index) => (
//                               <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{item.name || 'منتج غير محدد'}</td>
//                                 <td>{item.price || 0} ج.م</td>
//                                 <td>{item.quantity || 0}</td>
//                                 <td>{(item.price || 0) * (item.quantity || 0)} ج.م</td>
//                               </tr>
//                             ));
//                           } catch (error) {
//                             return (
//                               <tr>
//                                 <td colSpan="5" className="text-center text-danger">
//                                   ❌ خطأ في تحليل المنتجات: {error.message}
//                                 </td>
//                               </tr>
//                             );
//                           }
//                         })()}
//                       </tbody>
//                     </Table>
//                   </>
//                 ) : (
//                   <Alert variant="warning">لا توجد معلومات عن المنتجات</Alert>
//                 )}

//                 <div className="text-end mt-3">
//                   <h5>📊 ملخص:</h5>
//                   <p><strong>عدد القطع:</strong> {selectedOrder.total_items || 0}</p>
//                   <p><strong>الإجمالي:</strong> {selectedOrder.total_price || 0} ج.م</p>
//                 </div>

//                 {selectedOrder.notes && (
//                   <>
//                     <hr />
//                     <h5>📝 ملاحظات:</h5>
//                     <p>{selectedOrder.notes}</p>
//                   </>
//                 )}

//                 {/* أزرار إضافية في المودال */}
//                 <div className="d-flex gap-2 mt-4 pt-3 border-top">
//                   <Button 
//                     variant={selectedOrder.status === 'confirmed' ? 'success' : 'outline-success'}
//                     onClick={() => {
//                       quickUpdateOrderStatus(selectedOrder.id, 'confirmed');
//                       setShowModal(false);
//                     }}
//                     disabled={selectedOrder.status === 'confirmed' || updatingStatus[selectedOrder.id]}
//                   >
//                     {updatingStatus[selectedOrder.id] ? (
//                       <>
//                         <Spinner size="sm" animation="border" className="me-2" />
//                         جاري التحديث...
//                       </>
//                     ) : selectedOrder.status === 'confirmed' ? (
//                       '✅ تم التأكيد'
//                     ) : (
//                       'تأكيد الطلب'
//                     )}
//                   </Button>
//                   <Button 
//                     variant="outline-primary" 
//                     onClick={() => {
//                       setShowModal(false);
//                       preparePrint(selectedOrder);
//                     }}
//                   >
//                     🖨️ طباعة الفاتورة
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={() => setShowModal(false)}>
//               إغلاق
//             </Button>
//           </Modal.Footer>
//         </Modal>
//       </Container>
//     </>
//   );
// }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////



"use client";
import { useState, useEffect, useRef } from "react";
import { 
  Container, 
  Table, 
  Button, 
  Badge, 
  Modal, 
  Alert, 
  Card, 
  Dropdown,
  Row,
  Col,
  Spinner
} from "react-bootstrap";
import { supabase } from '/lib/supabaseClient';
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const printRef = useRef();
  const router = useRouter();

  useEffect(() => {
    // التحقق من إذا المستخدم أدمن
    const loggedIn = localStorage.getItem("isAdmin");
    if (loggedIn !== "true") {
      router.push("/dashboard/login");
    } else {
      setIsAdmin(true);
      fetchOrders();
    }
  }, [router]);

  useEffect(() => {
    if (!isAdmin) return;
    
    // إعداد real-time subscription
    try {
      const channel = supabase
        .channel('orders-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'orders'
          },
          (payload) => {
            console.log('🔔 Real-time update:', payload.eventType);
            
            if (payload.eventType === 'UPDATE') {
              setOrders(prev => prev.map(order => 
                order.id === payload.new.id ? { ...order, ...payload.new } : order
              ));
            } else if (payload.eventType === 'INSERT') {
              setOrders(prev => [payload.new, ...prev]);
            } else if (payload.eventType === 'DELETE') {
              setOrders(prev => prev.filter(order => order.id !== payload.old.id));
            }
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error("❌ Error setting up real-time:", error);
    }
  }, [isAdmin]);

//   useEffect(() => {
//     if (!isAdmin || orders.length === 0) return;
    
//     // Auto-refresh كل 30 ثانية
    
//     const intervalId = setInterval(() => {
//       console.log("🔄 Auto-refreshing orders...");
//       fetchOrders();
//     }, 30000);
    
//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [isAdmin, orders.length]);

  useEffect(() => {
    if (!isAdmin) return;
    
    // إضافة listener للـ visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("👀 Tab became visible, refreshing...");
        fetchOrders();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAdmin]);

  useEffect(() => {
    if (orders.length > 0) {
      console.log("📊 Orders loaded, checking data integrity...");
      
      // فحص بيانات العملاء
      const ordersWithMissingData = orders.filter(order => 
        !order.customer_name || !order.customer_phone
      );
      
      if (ordersWithMissingData.length > 0) {
        console.warn(`⚠️ ${ordersWithMissingData.length} orders missing customer data`);
        ordersWithMissingData.forEach(order => {
          console.log(`   Order ${order.id?.slice(0, 8)}:`, {
            customer_name: order.customer_name,
            customer_phone: order.customer_phone
          });
        });
      }
    }
  }, [orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching orders from Supabase...");
      
      const { data, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error("❌ Error fetching orders:", ordersError);
        throw ordersError;
      }

      console.log(`✅ Fetched ${data?.length || 0} orders`);
      setOrders(data || []);
      setError(null);
      
    } catch (error) {
      console.error("❌ Error in fetchOrders:", error);
      setError(`خطأ في جلب الطلبات: ${error.message}`);
      
      // عرض تفاصيل الخطأ
      if (error.code === 'PGRST116') {
        alert('❌ خطأ في استعلام قاعدة البيانات: الطلب غير موجود');
      } else if (error.code === '42501') {
        alert('❌ ليس لديك صلاحية للوصول إلى الطلبات');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/dashboard/login");
  };

  // دالة لفحص قاعدة البيانات بالكامل
  const debugDatabase = async () => {
    try {
      console.log("🔍 Starting comprehensive database debug...");
      
      // 1. تحقق من جداول قاعدة البيانات
      console.log("\n📊 1. Checking database tables...");
      
      // جلب أسماء الجداول
      const { data: tables, error: tablesError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tablesError) {
        console.error("❌ Error fetching tables:", tablesError);
      } else {
        console.log("✅ Available tables:", tables?.map(t => t.table_name) || []);
      }
      
      // 2. تحقق من جدول الـ products
      console.log("\n📦 2. Checking products table...");
      
      // أولا: حاول تجدول products
      const { data: allProducts, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(10);
      
      if (productsError) {
        console.error("❌ Error fetching products:", productsError);
      } else if (!allProducts || allProducts.length === 0) {
        console.warn("⚠️ Products table is empty or doesn't exist");
        
        // تحقق من هيكل الجدول حتى لو كان فاضي
        const { data: columns, error: columnsError } = await supabase
          .from('information_schema.columns')
          .select('column_name, data_type')
          .eq('table_name', 'products')
          .eq('table_schema', 'public');
        
        if (columnsError) {
          console.error("❌ Error fetching columns:", columnsError);
        } else {
          console.log("📝 Products table structure:", columns);
        }
      } else {
        console.log(`✅ Found ${allProducts.length} products`);
        console.log("📋 Sample products:", allProducts);
        
        // عرض الـ columns المتاحة
        if (allProducts.length > 0) {
          console.log("📝 Available columns:", Object.keys(allProducts[0]));
        }
      }
      
      // 3. تحقق من جدول الـ orders
      console.log("\n📋 3. Checking orders table...");
      
      const { data: allOrders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .limit(5);
      
      if (ordersError) {
        console.error("❌ Error fetching orders:", ordersError);
      } else if (!allOrders || allOrders.length === 0) {
        console.warn("⚠️ Orders table is empty");
      } else {
        console.log(`✅ Found ${allOrders.length} orders`);
        
        // تحليل بيانات طلب واحد
        const sampleOrder = allOrders[0];
        console.log("\n📄 Sample order details:");
        console.log("   ID:", sampleOrder.id);
        console.log("   Customer Name:", sampleOrder.customer_name);
        console.log("   Customer Phone:", sampleOrder.customer_phone);
        console.log("   Status:", sampleOrder.status);
        console.log("   Items JSON:", sampleOrder.items ? "Exists" : "Missing");
        
        if (sampleOrder.items) {
          try {
            const items = JSON.parse(sampleOrder.items);
            console.log("   Parsed Items:", items);
            console.log("   Items count:", items.length);
            
            if (items.length > 0) {
              console.log("   First item:", items[0]);
            }
          } catch (e) {
            console.error("   ❌ Error parsing items:", e.message);
          }
        }
      }
      
      // 4. تحقق من جدول الـ profiles
      console.log("\n👤 4. Checking profiles table...");
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      
      if (profilesError) {
        console.error("❌ Error fetching profiles:", profilesError);
      } else if (!profiles || profiles.length === 0) {
        console.warn("⚠️ Profiles table is empty");
      } else {
        console.log(`✅ Found ${profiles.length} profiles`);
        console.log("📋 Sample profile:", profiles[0]);
      }
      
      console.log("\n🔧 5. Checking environment...");
      console.log("   Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing");
      console.log("   Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing");
      
      // 6. فحص البيانات الحالية في الـ state
      console.log("\n📱 6. Checking current state...");
      console.log("   Orders in state:", orders.length);
      console.log("   Is Admin:", isAdmin);
      console.log("   Loading:", loading);
      
      if (orders.length > 0) {
        console.log("   First order in state:", {
          id: orders[0].id,
          customer_name: orders[0].customer_name,
          customer_phone: orders[0].customer_phone,
          status: orders[0].status
        });
      }
      
      alert('✅ تم فحص قاعدة البيانات، راجع الـ console للتفاصيل');
      
    } catch (error) {
      console.error("💥 Error in debugDatabase:", error);
      alert('❌ حدث خطأ في فحص قاعدة البيانات');
    }
  };

  // دالة لتحديث المخزون عند تأكيد الطلب
  const updateProductStock = async (orderId, items) => {
    try {
      console.log("📦 Starting stock update for order:", orderId);
      console.log("📝 Items received:", items);
      
      // إذا ما لقيناش products في قاعدة البيانات، نعمل حل مؤقت
      const { data: productsCheck, error: checkError } = await supabase
        .from('products')
        .select('count')
        .limit(1);
      
      if (checkError || !productsCheck) {
        console.warn("⚠️ Cannot access products table, using fallback method");
        return {
          stockUpdates: [],
          successfulUpdates: 0,
          failedUpdates: items.length,
          error: "Products table not accessible"
        };
      }
      
      const stockUpdates = [];
      
      for (const item of items) {
        if (!item.id) {
          console.warn(`⚠️ Item ${item.name} has no ID`);
          continue;
        }
        
        const itemId = item.id.toString();
        console.log(`🔍 Looking for product: ${item.name} (ID: ${itemId})`);
        
        // محاولة البحث بكل الطرق
        let product = null;
        let searchMethod = '';
        
        // 1. البحث بالـ number أولاً (هذا هو الأهم)
        const { data: byNumber } = await supabase
          .from('products')
          .select('*')
          .eq('number', itemId)
          .maybeSingle();
        
        if (byNumber) {
          product = byNumber;
          searchMethod = 'number';
        } else {
          // 2. البحث بالاسم
          const { data: byName } = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${item.name}%`)
            .maybeSingle();
          
          if (byName) {
            product = byName;
            searchMethod = 'name';
          } else {
            // 3. البحث بأي حقل يحتوي على الرقم
            const { data: byAny } = await supabase
              .from('products')
              .select('*')
              .or(`number.ilike.%${itemId}%,name.ilike.%${itemId}%`)
              .maybeSingle();
            
            if (byAny) {
              product = byAny;
              searchMethod = 'any';
            }
          }
        }
        
        if (product) {
          console.log(`✅ Found product via ${searchMethod}:`, product.name);
          
          const oldStock = product.stock || 0;
          const newStock = Math.max(oldStock - item.quantity, 0);
          
          stockUpdates.push({
            id: product.id,
            name: product.name,
            oldStock,
            newStock,
            quantity: item.quantity,
            searchMethod
          });
        } else {
          console.warn(`❌ Product not found: ${item.name} (ID: ${itemId})`);
          
          // إذا مش موجود، نجيب كل الـ products عشان نشوف وش موجود
          const { data: allProducts } = await supabase
            .from('products')
            .select('id, name, number, stock')
            .limit(10);
          
          console.log(`   Available products (first 10):`, allProducts);
        }
      }
      
      // تحديث المخزون
      let successfulUpdates = 0;
      
      for (const update of stockUpdates) {
        try {
          const { error: updateError } = await supabase
            .from('products')
            .update({
              stock: update.newStock,
              updated_at: new Date().toISOString()
            })
            .eq('id', update.id);
          
          if (updateError) {
            console.error(`❌ Error updating ${update.name}:`, updateError);
          } else {
            console.log(`✅ Updated ${update.name}: ${update.oldStock} → ${update.newStock}`);
            successfulUpdates++;
          }
        } catch (error) {
          console.error(`❌ Exception updating ${update.name}:`, error);
        }
      }
      
      console.log(`📊 Stock update complete: ${successfulUpdates}/${items.length} items updated`);
      
      return {
        stockUpdates,
        successfulUpdates,
        failedUpdates: items.length - successfulUpdates
      };
      
    } catch (error) {
      console.error("💥 Error in updateProductStock:", error);
      return {
        stockUpdates: [],
        successfulUpdates: 0,
        failedUpdates: items.length,
        error: error.message
      };
    }
// console.log('Updating order:', orderId, newStatus);

};

  

// const quickUpdateOrderStatus = async (orderId, newStatus) => {
//   // تحديث فوري للواجهة
//   setOrders(prev => prev.map(order => 
//     order.id === orderId 
//       ? { ...order, status: newStatus }
//       : order
//   ));
  
//   // تحديث المخزون إذا كان تأكيد
//   if (newStatus === 'confirmed') {
//     const order = orders.find(o => o.id === orderId);
//     if (order && order.items) {
//       try {
//         const items = JSON.parse(order.items);
//         if (items.length > 0) {
//           updateProductStock(orderId, items);
//         }
//       } catch (e) {}
//     }
//   }
  
//   // تحديث قاعدة البيانات في الخلفية
//   supabase
//     .from('orders')
//     .update({ status: newStatus })
//     .eq('id', orderId)
//     .then(({ error }) => {
//       if (error) {
//         console.warn("⚠️ Sync issue:", error);
//       }
//     });
  
//   alert(`✅ تم تحديث الحالة`);
// };
const updateOrderStatus = async (orderId, newStatus) => {
  setUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
  
  try {
    // تحديث قاعدة البيانات أولاً
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (error) throw error;

    // تحديث الـ state
    setOrders(prev => {
      const updatedOrders = prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      );
      
      // تحديث المخزون إذا كان تأكيد
      if (newStatus === 'confirmed') {
        const order = updatedOrders.find(o => o.id === orderId);
        if (order?.items) {
          try {
            const items = JSON.parse(order.items);
            if (items.length > 0) {
              updateProductStock(orderId, items);
            }
          } catch (e) {
            console.error("❌ Error parsing items:", e);
          }
        }
      }
      
      return updatedOrders;
    });
    
    alert(`✅ تم تحديث الحالة إلى ${getStatusText(newStatus)}`);
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    alert(`❌ حدث خطأ: ${error.message}`);
    
    // إعادة جلب البيانات للتأكد من المزامنة
    fetchOrders();
  } finally {
    setUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
  }
};
  // دالة لاختبار تحديث الطلب مباشرة
  const testDirectUpdate = async (orderId) => {
    try {
      console.log(`🧪 Testing direct update for order: ${orderId}`);
      
      // الطريقة 1: تحديث مباشر بدون select
      const { error: simpleUpdateError } = await supabase
        .from('orders')
        .update({ 
          status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (simpleUpdateError) {
        console.error("❌ Simple update failed:", simpleUpdateError);
      } else {
        console.log("✅ Simple update successful");
      }

      // الطريقة 2: جلب البيانات بعد التحديث
      const { data: fetchedData, error: fetchError } = await supabase
        .from('orders')
        .select('id, status, updated_at')
        .eq('id', orderId)
        .maybeSingle(); // استخدم maybeSingle بدلاً من single

      if (fetchError) {
        console.error("❌ Fetch after update failed:", fetchError);
      } else {
        console.log("✅ Fetched after update:", fetchedData);
      }

      return { simpleUpdateError, fetchedData };
      
    } catch (error) {
      console.error("💥 Test failed:", error);
      throw error;
    }
  };

  // دالة بديلة آمنة للتحديث
  const safeUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // 1. تحديث بسيط بدون إرجاع بيانات
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // 2. تحديث الـ state مباشرة
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));

      alert(`✅ تم تحديث الحالة إلى ${getStatusText(newStatus)}`);
      
    } catch (error) {
      console.error("❌ Error in safe update:", error);
      alert('❌ حدث خطأ، سيتم تحديث البيانات...');
      
      // 3. إعادة جلب البيانات
      await fetchOrders();
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'قيد الانتظار',
      confirmed: 'تم التأكيد',
      processing: 'قيد التجهيز',
      shipped: 'تم الشحن',
      delivered: 'تم التسليم',
      cancelled: 'ملغي'
    };
    return statusMap[status] || status;
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) throw error;
      
      // تحديث الـ state محلياً
      setOrders(prev => prev.filter(order => order.id !== orderId));
      alert('✅ تم حذف الطلب بنجاح');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert(`❌ حدث خطأ: ${error.message}`);
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      pending: { variant: 'warning', text: '🕒 قيد الانتظار' },
      confirmed: { variant: 'success', text: '✅ تم التأكيد' },
      processing: { variant: 'info', text: '🔄 قيد التجهيز' },
      shipped: { variant: 'primary', text: '🚚 تم الشحن' },
      delivered: { variant: 'success', text: '🎉 تم التسليم' },
      cancelled: { variant: 'danger', text: '❌ ملغي' }
    };
    
    const statusInfo = statuses[status] || { variant: 'secondary', text: status };
    return <Badge bg={statusInfo.variant}>{statusInfo.text}</Badge>;
  };

  const preparePrint = (order) => {
    setPrintOrder(order);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const PrintInvoice = () => {
    if (!printOrder) return null;
    
    const items = JSON.parse(printOrder.items || '[]');
    const orderDate = new Date(printOrder.created_at).toLocaleString('ar-EG');
    
    return (
      <div className="d-none d-print-block" ref={printRef}>
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #print-section, #print-section * {
                visibility: visible;
              }
              #print-section {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                font-family: 'Arial', sans-serif;
              }
            }
          `}
        </style>
        
        <div id="print-section" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #333', paddingBottom: '20px' }}>
            <h1 style={{ margin: 0, color: '#2c3e50' }}>فاتورة طلب</h1>
            <h3 style={{ margin: '10px 0', color: '#3498db' }}>متجرك الإلكتروني</h3>
            <p style={{ margin: '5px 0', color: '#7f8c8d' }}>
              📞 الهاتف: 01234567890 | 📧 البريد: store@example.com
            </p>
          </div>
          
          {/* Order Info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
            <div>
              <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات الطلب:</h4>
              <p style={{ margin: '5px 0' }}><strong>رقم الطلب:</strong> #{printOrder.id.slice(0, 8)}</p>
              <p style={{ margin: '5px 0' }}><strong>تاريخ الطلب:</strong> {orderDate}</p>
              <p style={{ margin: '5px 0' }}><strong>حالة الطلب:</strong> {getStatusText(printOrder.status)}</p>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>معلومات العميل:</h4>
              <p style={{ margin: '5px 0' }}><strong>الاسم:</strong> {printOrder.customer_name || 'زائر'}</p>
              <p style={{ margin: '5px 0' }}><strong>الهاتف:</strong> {printOrder.customer_phone || 'غير محدد'}</p>
              <p style={{ margin: '5px 0' }}><strong>العنوان:</strong> {printOrder.customer_address || 'غير محدد'}</p>
            </div>
          </div>
          
          {/* Products Table */}
          <h4 style={{ marginBottom: '15px', color: '#2c3e50' }}>المنتجات:</h4>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginBottom: '30px',
            border: '1px solid #ddd'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>#</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>المنتج</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>السعر</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>الكمية</th>
                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>المجموع</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>{item.name}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.price} ج.م</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                    {item.price * item.quantity} ج.م
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Summary */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '2px dashed #ddd'
          }}>
            <div>
              <h4 style={{ color: '#2c3e50' }}>ملاحظات:</h4>
              <p style={{ color: '#7f8c8d' }}>{printOrder.notes || 'لا توجد ملاحظات'}</p>
            </div>
            
            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '150px' }}>عدد القطع:</span>
                <strong>{printOrder.total_items || 0}</strong>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <span style={{ display: 'inline-block', width: '150px' }}>الإجمالي:</span>
                <strong style={{ fontSize: '18px', color: '#27ae60' }}>{printOrder.total_price || 0} ج.م</strong>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div style={{ 
            marginTop: '50px', 
            textAlign: 'center', 
            paddingTop: '20px',
            borderTop: '2px solid #333',
            color: '#7f8c8d'
          }}>
            <p>شكراً لتعاملكم معنا</p>
            <p>للاستفسار: 01234567890 | www.yourstore.com</p>
            <p style={{ fontSize: '12px', marginTop: '20px' }}>
              تاريخ الطباعة: {new Date().toLocaleString('ar-EG')}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const checkDataSync = async () => {
    console.log("🔍 Checking data sync...");
    
    try {
      const { data: freshData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("❌ Error fetching fresh data:", error);
        return;
      }
      
      console.log(`📊 Fresh data: ${freshData.length} orders`);
      console.log(`📊 Current state: ${orders.length} orders`);
      
      if (JSON.stringify(freshData.map(o => o.id).sort()) !== JSON.stringify(orders.map(o => o.id).sort())) {
        console.log("⚠️ Data mismatch detected! Syncing...");
        setOrders(freshData);
        alert('✅ تم مزامنة البيانات مع السيرفر');
      } else {
        console.log("✅ Data is in sync");
        alert('✅ البيانات متزامنة مع السيرفر');
      }
      
    } catch (error) {
      console.error("❌ Error in checkDataSync:", error);
      alert('❌ حدث خطأ في المزامنة');
    }
  };

  const fixCustomerDisplay = () => {
    console.log("👤 Checking customer data display...");
    
    if (orders.length === 0) {
      console.log("No orders to check");
      return;
    }
    
    console.log("\n📋 All orders customer data:");
    orders.forEach((order, index) => {
      console.log(`\nOrder ${index + 1}:`);
      console.log("  ID:", order.id?.slice(0, 8));
      console.log("  Customer Name:", order.customer_name || "❌ Missing");
      console.log("  Customer Phone:", order.customer_phone || "❌ Missing");
      console.log("  Status:", order.status);
      
      // تحقق من البيانات الكاملة
      if (!order.customer_name || !order.customer_phone) {
        console.log("  ⚠️ Missing customer data!");
        console.log("  Full order data:", order);
      }
    });
    
    alert('✅ تم فحص بيانات العملاء، راجع الـ console');
  };

  const createFallbackProducts = async () => {
    try {
      if (!confirm('هل تريد إنشاء منتجات تجريبية؟')) return;
      
      const sampleProducts = [
        {
          name: 'تجريبي 1',
          price: 100,
          stock: 50,
          number: '72',
          description: 'منتج تجريبي',
          category: 'تجريبي',
          image_url: 'https://via.placeholder.com/150',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          name: 'تجريبي 2',
          price: 200,
          stock: 30,
          number: '43',
          description: 'منتج تجريبي',
          category: 'تجريبي',
          image_url: 'https://via.placeholder.com/150',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          name: 'تجريبي 3',
          price: 150,
          stock: 20,
          number: '55',
          description: 'منتج تجريبي',
          category: 'تجريبي',
          image_url: 'https://via.placeholder.com/150',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      const { error } = await supabase
        .from('products')
        .insert(sampleProducts);
      
      if (error) {
        console.error("❌ Error creating products:", error);
        alert('❌ حدث خطأ في إنشاء المنتجات');
      } else {
        console.log("✅ Created sample products");
        alert('✅ تم إنشاء منتجات تجريبية بنجاح');
      }
    } catch (error) {
      console.error("💥 Error in createFallbackProducts:", error);
    }
  };

  // إحصائيات
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    revenue: orders.reduce((sum, order) => sum + (order.total_price || 0), 0)
  };

  if (!isAdmin) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">جارٍ التحميل...</span>
          </Spinner>
          <p className="mt-2">جارٍ التحقق من الصلاحية...</p>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
        <p className="mt-2">جاري تحميل الطلبات...</p>
      </Container>
    );
  }

  return (
    <>
      <PrintInvoice />
      
      <Container className="py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>📋 لوحة إدارة الطلبات</h2>
            <p className="text-muted">مرحباً بك في لوحة التحكم</p>
          </div>
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              onClick={fetchOrders}
              title="تحديث البيانات من السيرفر"
            >
              🔄 تحديث
            </Button>
            <Button 
              variant="outline-info" 
              onClick={debugDatabase}
              title="فحص قاعدة البيانات بالكامل"
            >
              🐛 فحص DB
            </Button>
            <Button 
              variant="outline-warning" 
              onClick={fixCustomerDisplay}
              size="sm"
            >
              👤 فحص بيانات
            </Button>
            <Button 
              variant="outline-success" 
              onClick={createFallbackProducts}
              size="sm"
            >
              ➕ منتجات تجريبية
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={() => {
                if (orders.length > 0) {
                  testDirectUpdate(orders[0].id);
                } else {
                  alert('لا توجد طلبات للاختبار');
                }
              }}
              size="sm"
            >
              🧪 اختبار تحديث
            </Button>
            <Button variant="outline-danger" onClick={handleLogout}>
              🚪 خروج
            </Button>
          </div>
        </div>

        {/* Visual Indicators */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className="d-flex align-items-center gap-1">
            <div className="bg-success rounded-circle" style={{ width: '10px', height: '10px' }}></div>
            <small className="text-muted">مؤكد</small>
          </div>
          <div className="d-flex align-items-center gap-1">
            <div className="bg-warning rounded-circle" style={{ width: '10px', height: '10px' }}></div>
            <small className="text-muted">قيد الانتظار</small>
          </div>
          <div className="d-flex align-items-center gap-1">
            <div className="bg-danger rounded-circle" style={{ width: '10px', height: '10px' }}></div>
            <small className="text-muted">ملغي</small>
          </div>
          <div className="d-flex align-items-center gap-1">
            <div className="bg-info rounded-circle" style={{ width: '10px', height: '10px' }}></div>
            <small className="text-muted">قيد التجهيز</small>
          </div>
          <div className="d-flex align-items-center gap-1">
            <div className="bg-primary rounded-circle" style={{ width: '10px', height: '10px' }}></div>
            <small className="text-muted">تم الشحن</small>
          </div>
        </div>

        {/* رسائل الخطأ */}
        {error && (
          <Alert variant="danger" className="mb-4">
            <Alert.Heading>⚠️ خطأ</Alert.Heading>
            <p>{error}</p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button variant="outline-danger" onClick={() => setError(null)}>
                إغلاق
              </Button>
            </div>
          </Alert>
        )}

        {/* إحصائيات */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>🕒 قيد الانتظار</Card.Title>
                <h3 className={stats.pending > 0 ? 'text-warning' : 'text-muted'}>
                  {stats.pending}
                </h3>
                <small className="text-muted">طلبات تحتاج مراجعة</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>✅ مؤكدة</Card.Title>
                <h3 className="text-success">{stats.confirmed}</h3>
                <small className="text-muted">طلبات تم تأكيدها</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>💰 إجمالي المبيعات</Card.Title>
                <h3 className="text-primary">{stats.revenue} ج.م</h3>
                <small className="text-muted">قيمة الطلبات</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <Card.Title>📦 كل الطلبات</Card.Title>
                <h3 className="text-info">{stats.total}</h3>
                <small className="text-muted">إجمالي الطلبات</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* جدول الطلبات */}
        {orders.length > 0 ? (
          <Card className="shadow-sm">
            <Card.Body>
              <div className="table-responsive">
                <Table hover className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>العميل</th>
                      <th>التاريخ</th>
                      <th>المبلغ</th>
                      <th>القطع</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id?.slice(0, 8) || 'N/A'}</strong>
                          <br />
                          <small className="text-muted">{index + 1}</small>
                        </td>
                        <td>
                          <div>
                            <strong className={order.customer_name ? '' : 'text-danger'}>
                              {order.customer_name || '❌ بدون اسم'}
                            </strong>
                            <br />
                            <small className={order.customer_phone ? 'text-muted' : 'text-danger'}>
                              {order.customer_phone || '❌ بدون هاتف'}
                            </small>
                            {order.customer_address && (
                              <>
                                <br />
                                <small className="text-muted">
                                  📍 {order.customer_address}
                                </small>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          {order.created_at ? (
                            <>
                              {new Date(order.created_at).toLocaleDateString('ar-EG')}
                              <br />
                              <small>{new Date(order.created_at).toLocaleTimeString('ar-EG')}</small>
                            </>
                          ) : 'غير محدد'}
                        </td>
                        <td>
                          <strong className="text-success">{order.total_price || 0} ج.م</strong>
                        </td>
                        <td>
                          <Badge bg="info">{order.total_items || 0}</Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            {getStatusBadge(order.status || 'pending')}
                            <Dropdown>
                              <Dropdown.Toggle variant="outline-secondary" size="sm" id="status-dropdown">
                                تغيير
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'pending')}>
                                  قيد الانتظار
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                                  تأكيد
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'processing')}>
                                  تجهيز
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'shipped')}>
                                  شحن
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'delivered')}>
                                  تسليم
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                                  إلغاء
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-2 flex-wrap">
                            {/* <Button 
                              size="sm" 
                              variant={order.status === 'confirmed' ? 'success' : 'outline-success'}
                              onClick={async () => {
                                if (order.status === 'confirmed') {
                                  alert('الطلب مؤكد بالفعل!');
                                  return;
                                }
                                
                                if (!confirm(`هل تريد تأكيد الطلب #${order.id.slice(0, 8)}؟`)) return;
                                
                                await updateOrderStatus(order.id, 'confirmed');
                              }}
                              disabled={updatingStatus[order.id]}
                            >
                              {updatingStatus[order.id] ? (
                                <Spinner size="sm" animation="border" />
                              ) : order.status === 'confirmed' ? (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle me-1" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                                  </svg>
                                  مؤكد
                                </>
                              ) : (
                                'تأكيد'
                              )}
                            </Button> */}
                            <Button 
  size="sm" 
  variant={order.status === 'confirmed' ? 'success' : 'outline-success'}
  onClick={async () => {
    if (order.status === 'confirmed') {
      alert('الطلب مؤكد بالفعل!');
      return;
    }
    
    if (!confirm(`هل تريد تأكيد الطلب #${order.id.slice(0, 8)}؟`)) return;
    
    await updateOrderStatus(order.id, 'confirmed');
  }}
  disabled={updatingStatus[order.id]}
>
  {updatingStatus[order.id] ? (
    <Spinner size="sm" animation="border" />
  ) : order.status === 'confirmed' ? (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle me-1" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
      </svg>
      مؤكد
    </>
  ) : (
    'تأكيد'
  )}
</Button>
                            <Button 
                              size="sm" 
                              variant="outline-info" 
                              onClick={() => viewOrderDetails(order)}
                            >
                              عرض
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-primary" 
                              onClick={() => preparePrint(order)}
                            >
                              🖨️ طباعة
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-danger" 
                              onClick={() => deleteOrder(order.id)}
                            >
                              حذف
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <Card.Body className="text-center py-5">
              <div className="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="#6c757d" className="bi bi-inbox" viewBox="0 0 16 16">
                  <path d="M4.98 4a.5.5 0 0 0-.39.188L1.54 8H6a.5.5 0 0 1 .5.5 1.5 1.5 0 1 0 3 0A.5.5 0 0 1 10 8h4.46l-3.05-3.812A.5.5 0 0 0 11.02 4H4.98zm9.954 5H10.45a2.5 2.5 0 0 1-4.9 0H1.066l.32 2.562a.5.5 0 0 0 .497.438h12.234a.5.5 0 0 0 .496-.438L14.933 9zM3.809 3.563A1.5 1.5 0 0 1 4.981 3h6.038a1.5 1.5 0 0 1 1.172.563l3.7 4.625a.5.5 0 0 1 .105.374l-.39 3.124A1.5 1.5 0 0 1 14.117 13H1.883a1.5 1.5 0 0 1-1.489-1.314l-.39-3.124a.5.5 0 0 1 .106-.374l3.7-4.625z"/>
                </svg>
              </div>
              <h5>لا توجد طلبات</h5>
              <p className="text-muted mb-0">لم يتم تسجيل أي طلبات حتى الآن</p>
            </Card.Body>
          </Card>
        )}

        {/* Modal للتفاصيل */}
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              تفاصيل الطلب #{selectedOrder?.id?.slice(0, 8) || 'N/A'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedOrder && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <h5>👤 معلومات العميل:</h5>
                    <p><strong>الاسم:</strong> {selectedOrder.customer_name || 'زائر'}</p>
                    <p><strong>الهاتف:</strong> {selectedOrder.customer_phone || 'غير محدد'}</p>
                    <p><strong>العنوان:</strong> {selectedOrder.customer_address || 'غير محدد'}</p>
                  </Col>
                  <Col md={6}>
                    <h5>📄 معلومات الطلب:</h5>
                    <p><strong>التاريخ:</strong> {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
                    <p><strong>الحالة:</strong> {getStatusBadge(selectedOrder.status || 'pending')}</p>
                    <p><strong>آخر تحديث:</strong> {selectedOrder.updated_at ? new Date(selectedOrder.updated_at).toLocaleString('ar-EG') : 'غير محدد'}</p>
                  </Col>
                </Row>

                <hr />

                <h5>🛒 المنتجات:</h5>
                {selectedOrder.items ? (
                  <>
                    <Table responsive bordered className="mt-3">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>المنتج</th>
                          <th>السعر</th>
                          <th>الكمية</th>
                          <th>المجموع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          try {
                            const items = JSON.parse(selectedOrder.items);
                            return items.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name || 'منتج غير محدد'}</td>
                                <td>{item.price || 0} ج.م</td>
                                <td>{item.quantity || 0}</td>
                                <td>{(item.price || 0) * (item.quantity || 0)} ج.م</td>
                              </tr>
                            ));
                          } catch (error) {
                            return (
                              <tr>
                                <td colSpan="5" className="text-center text-danger">
                                  ❌ خطأ في تحليل المنتجات: {error.message}
                                </td>
                              </tr>
                            );
                          }
                        })()}
                      </tbody>
                    </Table>
                  </>
                ) : (
                  <Alert variant="warning">لا توجد معلومات عن المنتجات</Alert>
                )}

                <div className="text-end mt-3">
                  <h5>📊 ملخص:</h5>
                  <p><strong>عدد القطع:</strong> {selectedOrder.total_items || 0}</p>
                  <p><strong>الإجمالي:</strong> {selectedOrder.total_price || 0} ج.م</p>
                </div>

                {selectedOrder.notes && (
                  <>
                    <hr />
                    <h5>📝 ملاحظات:</h5>
                    <p>{selectedOrder.notes}</p>
                  </>
                )}

                {/* أزرار إضافية في المودال */}
                <div className="d-flex gap-2 mt-4 pt-3 border-top">
                  <Button 
                    variant={selectedOrder.status === 'confirmed' ? 'success' : 'outline-success'}
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, 'confirmed');
                      setShowModal(false);
                    }}
                    disabled={selectedOrder.status === 'confirmed' || updatingStatus[selectedOrder.id]}
                  >
                    {updatingStatus[selectedOrder.id] ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        جاري التحديث...
                      </>
                    ) : selectedOrder.status === 'confirmed' ? (
                      '✅ تم التأكيد'
                    ) : (
                      'تأكيد الطلب'
                    )}
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => {
                      setShowModal(false);
                      preparePrint(selectedOrder);
                    }}
                  >
                    🖨️ طباعة الفاتورة
                  </Button>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              إغلاق
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////



