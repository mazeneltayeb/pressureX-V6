// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '/lib/supabaseClient';

// export default function UsersManagement() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);
//   const [formData, setFormData] = useState({
//     username: '',
//     full_name: '',
//     email: '',
//     phone: '',
//     store_address: '',
//     password: ''
//   });
//   const [avatarFile, setAvatarFile] = useState(null);
//   const [avatarPreview, setAvatarPreview] = useState('');

//   // تحميل المستخدمين
//   const loadUsers = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setUsers(data || []);
//     } catch (error) {
//       console.error('Error loading users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   // فتح مودال الإضافة
//   const openAddModal = () => {
//     setEditingUser(null);
//     setFormData({
//       username: '',
//       full_name: '',
//       email: '',
//       phone: '',
//       store_address: '',
//       password: ''
//     });
//     setAvatarFile(null);
//     setAvatarPreview('');
//     setIsModalOpen(true);
//   };

//   // فتح مودال التعديل
//   const openEditModal = (user) => {
//     setEditingUser(user);
//     setFormData({
//       username: user.username || '',
//       full_name: user.full_name || '',
//       email: user.email || '',
//       phone: user.phone || '',
//       store_address: user.store_address || '',
//       password: ''
//     });
//     setAvatarPreview(user.avatar_url || '');
//     setIsModalOpen(true);
//   };

//   // معالجة تغيير الحقول
//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   // معالجة رفع الصورة
//   const handleAvatarChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setAvatarFile(file);
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setAvatarPreview(e.target?.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // رفع الصورة إلى Supabase Storage
//   const uploadAvatar = async (userId, file) => {
//     try {
//       const fileExt = file.name.split('.').pop();
//       const fileName = `${userId}.${fileExt}`;
//       const filePath = `avatars/${fileName}`;

//       const { error: uploadError } = await supabase.storage
//         .from('avatars')
//         .upload(filePath, file, { upsert: true });

//       if (uploadError) throw uploadError;

//       const { data: { publicUrl } } = supabase.storage
//         .from('avatars')
//         .getPublicUrl(filePath);

//       return publicUrl;
//     } catch (error) {
//       console.error('Error uploading avatar:', error);
//       throw error;
//     }
//   };

//   // حفظ المستخدم
//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       if (editingUser) {
//         // تحديث مستخدم موجود
//         const updateData = {
//           username: formData.username,
//           full_name: formData.full_name,
//           email: formData.email,
//           phone: formData.phone,
//           store_address: formData.store_address,
//           updated_at: new Date().toISOString()
//         };

//         let avatarUrl = editingUser.avatar_url;
//         if (avatarFile) {
//           avatarUrl = await uploadAvatar(editingUser.id, avatarFile);
//         }

//         const { error } = await supabase
//           .from('profiles')
//           .update({ ...updateData, avatar_url: avatarUrl })
//           .eq('id', editingUser.id);

//         if (error) throw error;
//       } else {
//         // إضافة مستخدم جديد
//         if (!formData.password) {
//           alert('يرجى إدخال كلمة المرور');
//           return;
//         }

//         // إنشاء مستخدم في Authentication
//         const { data: authData, error: authError } = await supabase.auth.signUp({
//           email: formData.email,
//           password: formData.password,
//           options: {
//             data: {
//               username: formData.username,
//               full_name: formData.full_name
//             }
//           }
//         });

//         if (authError) throw authError;

//         // إضافة البيانات في جدول profiles
//         const profileData = {
//           id: authData.user?.id,
//           username: formData.username,
//           full_name: formData.full_name,
//           email: formData.email,
//           phone: formData.phone,
//           store_address: formData.store_address
//         };

//         let avatarUrl = '';
//         if (avatarFile && authData.user) {
//           avatarUrl = await uploadAvatar(authData.user.id, avatarFile);
//         }

//         const { error: profileError } = await supabase
//           .from('profiles')
//           .insert([{ ...profileData, avatar_url: avatarUrl }]);

//         if (profileError) throw profileError;
//       }

//       setIsModalOpen(false);
//       loadUsers();
//       alert(editingUser ? 'تم تعديل المستخدم بنجاح' : 'تم إضافة المستخدم بنجاح');
//     } catch (error) {
//       console.error('Error saving user:', error);
//       alert('حدث خطأ في حفظ البيانات: ' + error.message);
//     }
//   };

//   // حذف المستخدم
//   const handleDelete = async (userId) => {
//     if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

//     try {
//       const { error } = await supabase
//         .from('profiles')
//         .delete()
//         .eq('id', userId);

//       if (error) throw error;

//       loadUsers();
//       alert('تم حذف المستخدم بنجاح');
//     } catch (error) {
//       console.error('Error deleting user:', error);
//       alert('حدث خطأ في حذف المستخدم');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* الهيدر */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة المستخدمين</h1>
//         <p className="text-gray-600">إضافة وتعديل وحذف المستخدمين</p>
//       </div>

//       {/* زر الإضافة */}
//       <button
//         onClick={openAddModal}
//         className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg mb-6 transition duration-200"
//       >
//         إضافة مستخدم جديد
//       </button>

//       {/* شبكة المستخدمين */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {users.map((user) => (
//           <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
//             {/* الصورة */}
//             {user.avatar_url ? (
//               <img
//                 src={user.avatar_url}
//                 alt={user.full_name}
//                 className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-blue-500"
//               />
//             ) : (
//               <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
//                 {user.full_name ? user.full_name.charAt(0) : 'U'}
//               </div>
//             )}

//             {/* المعلومات */}
//             <div className="text-center">
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                 {user.full_name || 'بدون اسم'}
//               </h3>
//               <p className="text-gray-600 mb-1">
//                 <span className="font-medium">اسم المستخدم:</span> {user.username || 'بدون'}
//               </p>
//               <p className="text-gray-600 mb-1">
//                 <span className="font-medium">البريد:</span> {user.email}
//               </p>
//               <p className="text-gray-600 mb-1">
//                 <span className="font-medium">التليفون:</span> {user.phone || 'غير مضبوط'}
//               </p>
//               <p className="text-gray-600 mb-4">
//                 <span className="font-medium">العنوان:</span> {user.store_address || 'غير مضبوط'}
//               </p>
//             </div>

//             {/* الأزرار */}
//             <div className="flex gap-2 justify-center">
//               <button
//                 onClick={() => openEditModal(user)}
//                 className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
//               >
//                 تعديل
//               </button>
//               <button
//                 onClick={() => handleDelete(user.id)}
//                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
//               >
//                 حذف
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* المودال */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg w-full max-w-md">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-2xl font-bold text-gray-800">
//                   {editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
//                 </h2>
//                 <button
//                   onClick={() => setIsModalOpen(false)}
//                   className="text-gray-500 hover:text-gray-700 text-2xl"
//                 >
//                   &times;
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* حقل الصورة */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     صورة المستخدم
//                   </label>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleAvatarChange}
//                     className="w-full border border-gray-300 rounded px-3 py-2"
//                   />
//                   {avatarPreview && (
//                     <img
//                       src={avatarPreview}
//                       alt="Preview"
//                       className="w-24 h-24 rounded-full object-cover mx-auto mt-2 border-2 border-gray-300"
//                     />
//                   )}
//                 </div>

//                 {/* الحقول */}
//                 {['username', 'full_name', 'email', 'phone', 'store_address'].map((field) => (
//                   <div key={field}>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {field === 'username' && 'اسم المستخدم'}
//                       {field === 'full_name' && 'الاسم الكامل'}
//                       {field === 'email' && 'البريد الإلكتروني'}
//                       {field === 'phone' && 'رقم التليفون'}
//                       {field === 'store_address' && 'عنوان المحل'}
//                     </label>
//                     <input
//                       type={field === 'email' ? 'email' : 'text'}
//                       name={field}
//                       value={formData[field]}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 ))}

//                 {/* كلمة المرور (للمستخدمين الجدد فقط) */}
//                 {!editingUser && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       كلمة المرور
//                     </label>
//                     <input
//                       type="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 )}

//                 <button
//                   type="submit"
//                   className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition duration-200"
//                 >
//                   {editingUser ? 'تحديث المستخدم' : 'إضافة المستخدم'}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }