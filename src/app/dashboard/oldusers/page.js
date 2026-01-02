// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// const supabase = createClient(supabaseUrl, supabaseServiceKey)

// async function getUsers() {
//   try {
//     const { data: profiles, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .order('created_at', { ascending: false })

//     if (error) {
//       console.error('Error fetching profiles:', error)
//       return []
//     }

//     return profiles || []
//   } catch (error) {
//     console.error('Error:', error)
//     return []
//   }
// }

// export default async function UsersPage() {
//   const users = await getUsers()

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6 text-right">قائمة المستخدمين</h1>
      
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="px-4 py-2 border text-right">الاسم الكامل</th>
//               <th className="px-4 py-2 border text-right">اسم المستخدم</th>
//               <th className="px-4 py-2 border text-right">البريد الإلكتروني</th>
//               <th className="px-4 py-2 border text-right">الهاتف</th>
//               <th className="px-4 py-2 border text-right">عنوان المتجر</th>
//               <th className="px-4 py-2 border text-right">تاريخ الإنشاء</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-2 border text-right">{user.full_name || '---'}</td>
//                 <td className="px-4 py-2 border text-right">{user.username || '---'}</td>
//                 <td className="px-4 py-2 border text-right">{user.email}</td>
//                 <td className="px-4 py-2 border text-right">{user.phone || '---'}</td>
//                 <td className="px-4 py-2 border text-right">{user.store_address || '---'}</td>
//                 <td className="px-4 py-2 border text-right">
//                   {user.created_at ? new Date(user.created_at).toLocaleDateString('ar-SA') : '---'}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         {users.length === 0 && (
//           <div className="text-center py-8 text-gray-500">لا توجد بيانات للمستخدمين</div>
//         )}
//       </div>
//     </div>
//   )
// }


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
  Modal
} from "react-bootstrap";

// في الداشبورد استخدم المفتاح العام فقط
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    full_name: "",
    username: "",
    email: "",
    phone: "",
    store_address: "",
      newPassword: ""
  });

  // 🟢 تحميل المستخدمين
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("فشل في تحميل المستخدمين");
      const data = await res.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error(err);
      setMessage("❌ حدث خطأ أثناء تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🟢 تحديث الفورم
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🟢 حذف مستخدم
  const deleteUser = async (userId) => {
    if (!confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return;
    
    try {
      setLoading(true);
      const res = await fetch("/api/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "فشل في الحذف");
      
      setMessage("🗑️ تم حذف المستخدم بنجاح");
      await fetchUsers();
    } catch (err) {
      console.error(err);
      setMessage("❌ حدث خطأ أثناء حذف المستخدم");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 فتح نموذج التعديل
  const editUser = (user) => {
    setFormData({
      id: user.id,
      full_name: user.full_name || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      store_address: user.store_address || ""
    });
    setShowEditModal(true);
  };

  // 🟢 حفظ التعديلات
  // const handleUpdate = async () => {
  //   if (!formData.full_name || !formData.email) {
  //     setMessage("⚠️ أدخل الاسم الكامل والبريد الإلكتروني");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
      
  //     const updates = {
  //       full_name: formData.full_name,
  //       username: formData.username,
  //       email: formData.email,
  //       phone: formData.phone,
  //       store_address: formData.store_address
  //     };

  //     const res = await fetch("/api/users", {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ 
  //         userId: formData.id, 
  //         updates 
  //       }),
  //     });

  //     const result = await res.json();

  //     if (!res.ok) throw new Error(result.error || "فشل في التعديل");

  //     setMessage("✅ تم تعديل بيانات المستخدم بنجاح");
  //     setShowEditModal(false);
  //     await fetchUsers();
  //   } catch (err) {
  //     console.error(err);
  //     setMessage("❌ حدث خطأ أثناء التعديل");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleUpdate = async () => {
  if (!formData.full_name || !formData.email) {
    setMessage("⚠️ أدخل الاسم الكامل والبريد الإلكتروني");
    return;
  }

  try {
    setLoading(true);
    
    const updates = {
      full_name: formData.full_name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      store_address: formData.store_address
    };

    const requestBody = {
      userId: formData.id, 
      updates 
    };

    // إذا كان في باسوورد جديد، أضفه
    if (formData.newPassword.trim() !== "") {
      requestBody.newPassword = formData.newPassword;
    }

    const res = await fetch("/api/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const result = await res.json();

    if (!res.ok) throw new Error(result.error || "فشل في التعديل");

    setMessage("✅ تم تعديل بيانات المستخدم بنجاح");
    setShowEditModal(false);
    // إعادة تعيين الباسوورد
    setFormData(prev => ({ ...prev, newPassword: "" }));
    await fetchUsers();
  } catch (err) {
    console.error(err);
    setMessage("❌ حدث خطأ أثناء التعديل");
  } finally {
    setLoading(false);
  }
};
  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">👥 لوحة إدارة المستخدمين</h2>

      {message && (
        <Alert 
          variant={message.includes("❌") ? "danger" : "success"} 
          onClose={() => setMessage("")} 
          dismissible
        >
          {message}
        </Alert>
      )}

      {/* جدول المستخدمين */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary text-center">
            <tr>
              <th>الاسم الكامل</th>
              <th>اسم المستخدم</th>
              <th>البريد الإلكتروني</th>
              <th>الهاتف</th>
              <th>عنوان المتجر</th>
              <th>تاريخ الإنشاء</th>
              <th>الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="align-middle text-center">
                <td>{user.full_name || '---'}</td>
                <td>{user.username || '---'}</td>
                <td>{user.email}</td>
                <td>{user.phone || '---'}</td>
                <td>{user.store_address || '---'}</td>
                <td>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('ar-SA') : '---'}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => editUser(user)}
                  >
                    ✏️ تعديل
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteUser(user.id)}
                  >
                    🗑️ حذف
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {filteredUsers.length === 0 && !loading && (
        <div className="text-center py-5 text-muted">
          <h5>لا توجد بيانات للمستخدمين</h5>
        </div>
      )}

      {/* مودال التعديل */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>✏️ تعديل بيانات المستخدم</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>الاسم الكامل</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="أدخل الاسم الكامل"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
  <Form.Group>
    <Form.Label>كلمة المرور الجديدة (اختياري)</Form.Label>
    <Form.Control
      type="password"
      name="newPassword"
      value={formData.newPassword}
      onChange={handleChange}
      placeholder="اتركه فارغاً إذا لم ترد التغيير"
    />
    <Form.Text className="text-muted">
      اترك الحقل فارغاً للحفاظ على كلمة المرور الحالية
    </Form.Text>
  </Form.Group>
</Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>اسم المستخدم</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="أدخل اسم المستخدم"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>البريد الإلكتروني</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="أدخل البريد الإلكتروني"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>الهاتف</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="أدخل رقم الهاتف"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>عنوان المتجر</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="store_address"
                    value={formData.store_address}
                    onChange={handleChange}
                    placeholder="أدخل عنوان المتجر"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            إلغاء
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "جارٍ الحفظ..." : "💾 حفظ التعديلات"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}