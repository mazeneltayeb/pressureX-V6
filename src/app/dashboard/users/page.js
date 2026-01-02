// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '/lib/supabaseClient'; // أو المسار الصحيح عندك

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
//   const [error, setError] = useState('');

//   // تحميل المستخدمين
//   const loadUsers = async () => {
//     try {
//       console.log('جاري تحميل المستخدمين...');
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) {
//         console.error('Supabase error:', error);
//         throw error;
//       }
      
//       console.log('تم تحميل المستخدمين:', data);
//       setUsers(data || []);
//     } catch (error) {
//       console.error('Error loading users:', error);
//       setError('فشل في تحميل المستخدمين: ' + error.message);
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
//     setError('');
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
//     setError('');
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
//       // التحقق من حجم الصورة
//       if (file.size > 5 * 1024 * 1024) { // 5MB
//         setError('حجم الصورة يجب أن يكون أقل من 5MB');
//         return;
//       }
      
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
//       console.log('جاري رفع الصورة...', userId);
      
//       const fileExt = file.name.split('.').pop();
//       const fileName = `${userId}.${fileExt}`;
//       const filePath = `avatars/${fileName}`;

//       // رفع الملف
//       const { error: uploadError } = await supabase.storage
//         .from('avatars')
//         .upload(filePath, file, { 
//           upsert: true,
//           cacheControl: '3600'
//         });

//       if (uploadError) {
//         console.error('Upload error:', uploadError);
//         throw uploadError;
//       }

//       // الحصول على رابط الصورة
//       const { data: { publicUrl } } = supabase.storage
//         .from('avatars')
//         .getPublicUrl(filePath);

//       console.log('تم رفع الصورة:', publicUrl);
//       return publicUrl;

//     } catch (error) {
//       console.error('Error uploading avatar:', error);
      
//       // إذا كان الخطأ بسبب عدم وجود bucket، حاول تنشئه
//       if (error.message?.includes('bucket') || error.message?.includes('Bucket')) {
//         setError('مساحة التخزين غير موجودة. يرجى إنشاء bucket باسم "avatars" في Supabase Storage.');
//       }
      
//       throw error;
//     }
//   };

//   // حفظ المستخدم
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     try {
//       console.log('جاري حفظ المستخدم...', editingUser ? 'تعديل' : 'إضافة');

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
//           console.log('جاري تحديث الصورة...');
//           avatarUrl = await uploadAvatar(editingUser.id, avatarFile);
//         }

//         const { error } = await supabase
//           .from('profiles')
//           .update({ ...updateData, avatar_url: avatarUrl })
//           .eq('id', editingUser.id);

//         if (error) throw error;
        
//         console.log('تم تحديث المستخدم بنجاح');

//       } else {
//         // إضافة مستخدم جديد
//         if (!formData.password) {
//           setError('يرجى إدخال كلمة المرور');
//           return;
//         }

//         if (formData.password.length < 6) {
//           setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
//           return;
//         }

//         console.log('جاري إنشاء مستخدم جديد...');

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

//         if (authError) {
//           console.error('Auth error:', authError);
//           throw authError;
//         }

//         if (!authData.user) {
//           throw new Error('فشل في إنشاء المستخدم');
//         }

//         console.log('تم إنشاء المستخدم في Auth:', authData.user.id);

//         // إضافة البيانات في جدول profiles
//         const profileData = {
//           id: authData.user.id,
//           username: formData.username,
//           full_name: formData.full_name,
//           email: formData.email,
//           phone: formData.phone,
//           store_address: formData.store_address
//         };

//         let avatarUrl = '';
//         if (avatarFile) {
//           console.log('جاري رفع صورة المستخدم الجديد...');
//           avatarUrl = await uploadAvatar(authData.user.id, avatarFile);
//         }

//         const { error: profileError } = await supabase
//           .from('profiles')
//           .insert([{ ...profileData, avatar_url: avatarUrl }]);

//         if (profileError) {
//           console.error('Profile error:', profileError);
          
//           // إذا فشل إضافة الـ profile، احذف المستخدم من Auth
//           await supabase.auth.admin.deleteUser(authData.user.id);
//           throw profileError;
//         }

//         console.log('تم إضافة المستخدم في Profiles بنجاح');
//       }

//       setIsModalOpen(false);
//       loadUsers();
//       alert(editingUser ? 'تم تعديل المستخدم بنجاح' : 'تم إضافة المستخدم بنجاح');
      
//     } catch (error) {
//       console.error('Error saving user:', error);
//       setError('حدث خطأ في حفظ البيانات: ' + error.message);
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
//       setError('حدث خطأ في حذف المستخدم: ' + error.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//         <p className="mr-3">جاري التحميل...</p>
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

//       {/* عرض الأخطاء */}
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//           {error}
//         </div>
//       )}

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
//           <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
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

//               {error && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//                   {error}
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* حقل الصورة */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     صورة المستخدم (اختياري)
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
//                   <p className="text-xs text-gray-500 mt-1">الحجم الأقصى: 5MB</p>
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
//                       required={field !== 'phone' && field !== 'store_address'}
//                       className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 ))}

//                 {/* كلمة المرور (للمستخدمين الجدد فقط) */}
//                 {!editingUser && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       كلمة المرور *
//                     </label>
//                     <input
//                       type="password"
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       required
//                       minLength="6"
//                       placeholder="6 أحرف على الأقل"
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




'use client';

import { useState, useEffect } from 'react';
import { supabase } from '/lib/supabaseClient';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    phone: '',
    store_address: '',
    password: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  // تحميل المستخدمين
  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.log('Error loading users:', error);
      setError('فشل في تحميل المستخدمين: ' + error.message);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    loadUsers();
  }, []);



  // فتح مودال الإضافة
  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      full_name: '',
      email: '',
      phone: '',
      store_address: '',
      password: ''
    });
    setAvatarFile(null);
    setAvatarPreview('');
    setError('');
    setIsModalOpen(true);
  };

  // فتح مودال التعديل
  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username || '',
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      store_address: user.store_address || '',
      password: ''
    });
    setAvatarPreview(user.avatar_url || '');
    setError('');
    setIsModalOpen(true);
  };

  // معالجة تغيير الحقول
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // معالجة رفع الصورة
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 5MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // رفع الصورة إلى Supabase Storage
  const uploadAvatar = async (userId, file) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.log('Error uploading avatar:', error);
      throw error;
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSubmitLoading(true);
  
  try {
    if (editingUser) {
      // تحديث مستخدم موجود - استخدم الكود الأصلي
      const updateData = {
        username: formData.username,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        store_address: formData.store_address,
        updated_at: new Date().toISOString()
      };

      let avatarUrl = editingUser.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(editingUser.id, avatarFile);
      }

      const { error } = await supabase
        .from('profiles')
        .update({ ...updateData, avatar_url: avatarUrl })
        .eq('id', editingUser.id);

      if (error) throw error;
      
      alert('تم تعديل المستخدم بنجاح');
      setIsModalOpen(false);
      loadUsers();

    } else {
      // ✅ الحل الآمن: استخدم API Route للمستخدمين الجدد
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      // رفع الصورة إذا كانت موجودة
      if (avatarFile && result.user) {
        try {
          const avatarUrl = await uploadAvatar(result.user.id, avatarFile);
          await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('id', result.user.id);
        } catch (avatarError) {
          console.log('Error uploading avatar:', avatarError);
        }
      }

      alert(result.action === 'updated' 
        ? 'تم تحديث بيانات المستخدم بنجاح!' 
        : 'تم إنشاء المستخدم بنجاح!');
      
      setIsModalOpen(false);
      loadUsers();
    }
    
  } catch (error) {
    console.log('Error saving user:', error);
    setError('حدث خطأ: ' + error.message);
  } finally {
    setSubmitLoading(false);
  }
};


  // حذف المستخدم
  const handleDelete = async (userId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      loadUsers();
      alert('تم حذف المستخدم بنجاح');
    } catch (error) {
      console.log('Error deleting user:', error);
      setError('حدث خطأ في حذف المستخدم: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mr-3">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* الهيدر */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة المستخدمين</h1>
        <p className="text-gray-600">إضافة وتعديل وحذف المستخدمين</p>
      </div>

      {/* عرض الأخطاء */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* زر الإضافة */}
      <button
        onClick={openAddModal}
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg mb-6 transition duration-200"
      >
        إضافة مستخدم جديد
      </button>

      {/* شبكة المستخدمين */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
            {/* الصورة */}
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-blue-500"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                {user.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
            )}

            {/* المعلومات */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {user.full_name || 'بدون اسم'}
              </h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">البريد:</span> {user.email}
              </p>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">التليفون:</span> {user.phone || 'غير مضبوط'}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium">العنوان:</span> {user.store_address || 'غير مضبوط'}
              </p>
            </div>

            {/* الأزرار */}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => openEditModal(user)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && !error && (
        <div className="text-center py-8">
          <p className="text-gray-500">لا يوجد مستخدمين حتى الآن</p>
        </div>
      )}

      {/* المودال */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingUser ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* حقل الصورة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    صورة المستخدم (اختياري)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {avatarPreview && (
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-24 h-24 rounded-full object-cover mx-auto mt-2 border-2 border-gray-300"
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">الحجم الأقصى: 5MB</p>
                </div>

                {/* الحقول */}
                {['username', 'full_name', 'email', 'phone', 'store_address'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field === 'username' && 'اسم المستخدم'}
                      {field === 'full_name' && 'الاسم الكامل'}
                      {field === 'email' && 'البريد الإلكتروني *'}
                      {field === 'phone' && 'رقم التليفون'}
                      {field === 'store_address' && 'عنوان المحل'}
                    </label>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      required={field === 'email' || field === 'full_name'}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

                {/* كلمة المرور (للمستخدمين الجدد فقط) */}
                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      كلمة المرور *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength="6"
                      placeholder="6 أحرف على الأقل"
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white py-3 rounded-lg transition duration-200"
                >
                  {submitLoading ? 'جاري الحفظ...' : (editingUser ? 'تحديث المستخدم' : 'إضافة المستخدم')}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}