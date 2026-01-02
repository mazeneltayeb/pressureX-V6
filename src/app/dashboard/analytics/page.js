// "use client";
// import { useState, useEffect } from "react";
// import { 
//   Container, Row, Col, Card, Table, 
//   Spinner, Alert, Badge, Button 
// } from "react-bootstrap";
// import { supabase } from '/lib/supabaseClient';
// import { 
//   FaFilePdf, FaDownload, FaChartLine, 
//   FaUsers, FaCalendar, FaArrowUp 
// } from "react-icons/fa";

// export default function AnalyticsPage() {
//   const [stats, setStats] = useState({
//     totalPDFs: 0,
//     totalDownloads: 0,
//     activePDFs: 0,
//     totalCategories: 0,
//     topPDFs: [],
//     dailyDownloads: []
//   });
//   const [loading, setLoading] = useState(true);
//   const [period, setPeriod] = useState('all'); // all, week, month

//   useEffect(() => {
//     fetchAnalytics();
//   }, [period]);

//   const fetchAnalytics = async () => {
//     try {
//       setLoading(true);

//       // 1. جلب جميع الملفات
//       const { data: pdfs, error: pdfsError } = await supabase
//         .from('pdf_files')
//         .select('*')
//         .order('downloads_count', { ascending: false });

//       if (pdfsError) throw pdfsError;

//       // 2. جلب الفئات
//       const { data: categories, error: catsError } = await supabase
//         .from('pdf_categories')
//         .select('*');

//       if (catsError) throw catsError;

//       // 3. حساب الإحصائيات
//       const totalDownloads = pdfs.reduce((sum, pdf) => sum + (pdf.downloads_count || 0), 0);
//       const activePDFs = pdfs.filter(p => p.status === 'active').length;
      
//       // 4. الملفات الأكثر تحميلاً (أعلى 5)
//       const topPDFs = [...pdfs]
//         .sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0))
//         .slice(0, 5);

//       setStats({
//         totalPDFs: pdfs.length,
//         totalDownloads,
//         activePDFs,
//         totalCategories: categories.length,
//         topPDFs,
//         dailyDownloads: calculateDailyStats(pdfs)
//       });

//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateDailyStats = (pdfs) => {
//     // تنظيم التحميلات حسب اليوم
//     const downloadsByDate = {};
    
//     pdfs.forEach(pdf => {
//       const date = new Date(pdf.updated_at).toLocaleDateString('ar-SA');
//       if (!downloadsByDate[date]) {
//         downloadsByDate[date] = 0;
//       }
//       downloadsByDate[date] += (pdf.downloads_count || 0);
//     });

//     return Object.entries(downloadsByDate)
//       .map(([date, count]) => ({ date, count }))
//       .sort((a, b) => new Date(b.date) - new Date(a.date))
//       .slice(0, 7); // آخر 7 أيام
//   };

//   if (loading) {
//     return (
//       <Container className="py-5 text-center">
//         <Spinner animation="border" variant="primary" />
//         <p className="mt-3">جارٍ تحميل الإحصائيات...</p>
//       </Container>
//     );
//   }

//   return (
//     <Container className="py-5">
//       <h2 className="text-center mb-4">📊 إحصائيات المكتبة</h2>

//       {/* بطاقات الإحصائيات */}
//       <Row className="mb-4">
//         <Col md={3} sm={6} className="mb-3">
//           <Card className="text-center shadow-sm border-primary">
//             <Card.Body>
//               <FaFilePdf className="text-primary fs-1 mb-3" />
//               <Card.Title>{stats.totalPDFs}</Card.Title>
//               <Card.Text className="text-muted">إجمالي الملفات</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
        
//         <Col md={3} sm={6} className="mb-3">
//           <Card className="text-center shadow-sm border-success">
//             <Card.Body>
//               <FaDownload className="text-success fs-1 mb-3" />
//               <Card.Title>{stats.totalDownloads}</Card.Title>
//               <Card.Text className="text-muted">إجمالي التحميلات</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
        
//         <Col md={3} sm={6} className="mb-3">
//           <Card className="text-center shadow-sm border-info">
//             <Card.Body>
//               <FaUsers className="text-info fs-1 mb-3" />
//               <Card.Title>{stats.activePDFs}</Card.Title>
//               <Card.Text className="text-muted">الملفات النشطة</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
        
//         <Col md={3} sm={6} className="mb-3">
//           <Card className="text-center shadow-sm border-warning">
//             <Card.Body>
//               <FaChartLine className="text-warning fs-1 mb-3" />
//               <Card.Title>{stats.totalCategories}</Card.Title>
//               <Card.Text className="text-muted">عدد الفئات</Card.Text>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* الملفات الأكثر تحميلاً */}
//       <Card className="mb-4 shadow-sm">
//         <Card.Header className="bg-primary text-white">
//           <h5 className="mb-0">
//             <FaArrowUp className="me-2" />
//             الملفات الأكثر تحميلاً
//           </h5>
//         </Card.Header>
//         <Card.Body>
//           <Table striped hover responsive>
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>اسم الملف</th>
//                 <th>الفئة</th>
//                 <th>عدد التحميلات</th>
//                 <th>تاريخ الإضافة</th>
//               </tr>
//             </thead>
//             <tbody>
//               {stats.topPDFs.map((pdf, index) => (
//                 <tr key={pdf.id}>
//                   <td>
//                     <Badge bg={index === 0 ? 'danger' : index === 1 ? 'warning' : 'info'}>
//                       {index + 1}
//                     </Badge>
//                   </td>
//                   <td>
//                     <strong>{pdf.title}</strong>
//                     <br />
//                     <small className="text-muted">{pdf.description?.slice(0, 50)}</small>
//                   </td>
//                   <td>
//                     <Badge bg="secondary">{pdf.category || 'عام'}</Badge>
//                   </td>
//                   <td>
//                     <Badge bg="success" className="fs-6">
//                       {pdf.downloads_count || 0}
//                     </Badge>
//                   </td>
//                   <td>
//                     {new Date(pdf.created_at).toLocaleDateString('ar-SA')}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>

//       {/* إحصائيات التحميلات اليومية */}
//       <Card className="shadow-sm">
//         <Card.Header className="bg-info text-white">
//           <h5 className="mb-0">
//             <FaCalendar className="me-2" />
//             التحميلات في آخر 7 أيام
//           </h5>
//         </Card.Header>
//         <Card.Body>
//           <Row>
//             {stats.dailyDownloads.map((day, index) => (
//               <Col key={index} md={2} sm={4} xs={6} className="mb-3">
//                 <div className="text-center p-3 border rounded bg-light">
//                   <div className="fs-4 fw-bold text-primary">{day.count}</div>
//                   <div className="text-muted small">{day.date}</div>
//                 </div>
//               </Col>
//             ))}
//           </Row>
//         </Card.Body>
//       </Card>
//     </Container>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import { 
  Container, Row, Col, Card, Table, 
  Spinner, Alert, Badge, Button, Modal,
  Tab, Tabs
} from "react-bootstrap";
import { supabase } from '/lib/supabaseClient';
import { 
  FaFilePdf, FaDownload, FaChartLine, 
  FaUsers, FaCalendar, FaArrowUp, 
  FaUser, FaEye, FaHistory, FaList, FaSync
} from "react-icons/fa";

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalPDFs: 0,
    totalDownloads: 0,
    activePDFs: 0,
    totalCategories: 0,
    topPDFs: [],
    dailyDownloads: [],
    recentDownloads: [],
    topUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [pdfUsers, setPdfUsers] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // 1. جلب جميع الملفات
      const { data: pdfs, error: pdfsError } = await supabase
        .from('pdf_files')
        .select('*')
        .order('downloads_count', { ascending: false });

      if (pdfsError) throw pdfsError;

      // 2. جلب الفئات
      const { data: categories, error: catsError } = await supabase
        .from('pdf_categories')
        .select('*');

      if (catsError) throw catsError;

      // 3. جلب سجلات التحميلات الحديثة
      const { data: downloads, error: downloadsError } = await supabase
        .from('pdf_downloads')
        .select(`
          id,
          user_id,
          user_email,
          user_name,
          downloaded_at,
          user_ip,
          user_agent,
          pdf_files (
            title,
            category
          )
        `)
        .order('downloaded_at', { ascending: false })
        .limit(50);

      if (downloadsError) {
        console.warn('Could not fetch downloads:', downloadsError);
      }

      // 4. جلب أكثر المستخدمين تحميلاً باستخدام تجميع محلي
      let topUsers = [];
      if (downloads && downloads.length > 0) {
        const userMap = {};
        
        downloads.forEach(download => {
          if (download.user_id) {
            const key = download.user_id;
            if (!userMap[key]) {
              userMap[key] = {
                user_id: download.user_id,
                user_email: download.user_email,
                user_name: download.user_name || 'مستخدم',
                download_count: 0,
                last_downloaded_at: download.downloaded_at
              };
            }
            userMap[key].download_count++;
            
            // تحديث آخر وقت تحميل
            const currentTime = new Date(download.downloaded_at);
            const lastTime = new Date(userMap[key].last_downloaded_at || 0);
            if (currentTime > lastTime) {
              userMap[key].last_downloaded_at = download.downloaded_at;
            }
          }
        });
        
        topUsers = Object.values(userMap)
          .sort((a, b) => b.download_count - a.download_count)
          .slice(0, 10);
      }

      // 5. حساب الإحصائيات
      const totalDownloads = pdfs.reduce((sum, pdf) => sum + (pdf.downloads_count || 0), 0);
      const activePDFs = pdfs.filter(p => p.status === 'active').length;
      
      // 6. الملفات الأكثر تحميلاً (أعلى 10)
      const topPDFs = [...pdfs]
        .sort((a, b) => (b.downloads_count || 0) - (a.downloads_count || 0))
        .slice(0, 10);

      // 7. الإحصائيات اليومية
      const dailyDownloads = await calculateDailyStats();

      setStats({
        totalPDFs: pdfs.length,
        totalDownloads,
        activePDFs,
        totalCategories: categories.length,
        topPDFs,
        dailyDownloads,
        recentDownloads: downloads || [],
        topUsers
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // دالة لجلب المستخدمين الذين حملوا ملف محدد
  const fetchPDFUsers = async (pdfId) => {
    try {
      const { data, error } = await supabase
        .from('pdf_downloads')
        .select('*')
        .eq('pdf_id', pdfId)
        .order('downloaded_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      
      setPdfUsers(data || []);
      setSelectedPDF(pdfId);
      setShowUserModal(true);
      
    } catch (error) {
      console.error('Error fetching PDF users:', error);
    }
  };

  // حساب الإحصائيات اليومية
  const calculateDailyStats = async () => {
    try {
      // محاولة استخدام RPC إذا كان موجوداً
      try {
        const { data, error } = await supabase.rpc(
          'get_daily_stats',
          { days_count: 7 }
        );
        
        if (!error && data) {
          return data.map(item => ({
            date: new Date(item.download_date).toLocaleDateString('ar-SA'),
            count: item.download_count
          }));
        }
      } catch (rpcError) {
        console.warn('RPC not available, using manual calculation:', rpcError);
      }
      
      // الطريقة اليدوية
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: recentDownloads, error } = await supabase
        .from('pdf_downloads')
        .select('downloaded_at')
        .gte('downloaded_at', sevenDaysAgo.toISOString());
      
      if (error) {
        console.error('Error fetching daily downloads:', error);
        return [];
      }
      
      const downloadsByDate = {};
      recentDownloads?.forEach(download => {
        const date = new Date(download.downloaded_at).toLocaleDateString('ar-SA');
        downloadsByDate[date] = (downloadsByDate[date] || 0) + 1;
      });
      
      // ملء الأيام الفارغة
      const result = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('ar-SA');
        result.push({
          date: dateStr,
          count: downloadsByDate[dateStr] || 0
        });
      }
      
      return result;
      
    } catch (error) {
      console.error('Error calculating daily stats:', error);
      return [];
    }
  };

  // تنسيق الوقت
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'غير معروف';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
    if (diffHours < 24) return `قبل ${diffHours} ساعة`;
    if (diffDays < 7) return `قبل ${diffDays} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  // الحصول على اسم الملف من تحميل
  const getPDFTitle = (download) => {
    if (download.pdf_files && download.pdf_files.title) {
      return download.pdf_files.title;
    }
    return 'ملف غير معروف';
  };

  // الحصول على فئة الملف من تحميل
  const getPDFCategory = (download) => {
    if (download.pdf_files && download.pdf_files.category) {
      return download.pdf_files.category;
    }
    return 'عام';
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">جارٍ تحميل الإحصائيات...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">📊 إحصائيات المكتبة</h2>
        <Button 
          variant="primary" 
          onClick={fetchAnalytics}
          disabled={loading}
        >
          <FaSync className={loading ? "fa-spin" : ""} /> 
          {loading ? ' جاري التحديث...' : ' تحديث'}
        </Button>
      </div>

      {/* بطاقات الإحصائيات */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm border-primary">
            <Card.Body>
              <FaFilePdf className="text-primary fs-1 mb-3" />
              <Card.Title>{stats.totalPDFs}</Card.Title>
              <Card.Text className="text-muted">إجمالي الملفات</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm border-success">
            <Card.Body>
              <FaDownload className="text-success fs-1 mb-3" />
              <Card.Title>{stats.totalDownloads}</Card.Title>
              <Card.Text className="text-muted">إجمالي التحميلات</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm border-info">
            <Card.Body>
              <FaUsers className="text-info fs-1 mb-3" />
              <Card.Title>{stats.activePDFs}</Card.Title>
              <Card.Text className="text-muted">ملفات نشطة</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-3">
          <Card className="text-center shadow-sm border-warning">
            <Card.Body>
              <FaChartLine className="text-warning fs-1 mb-3" />
              <Card.Title>{stats.totalCategories}</Card.Title>
              <Card.Text className="text-muted">عدد الفئات</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs للتبويب */}
      <Tabs defaultActiveKey="top-pdfs" className="mb-4">
        
        {/* تبويب: الملفات الأكثر تحميلاً */}
        <Tab eventKey="top-pdfs" title={
          <span><FaArrowUp /> الأكثر تحميلاً</span>
        }>
          <Card className="shadow-sm mt-3">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaArrowUp className="me-2" />
                الملفات الأكثر تحميلاً
              </h5>
              <Badge bg="light" text="dark">
                {stats.topPDFs.length} ملف
              </Badge>
            </Card.Header>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>اسم الملف</th>
                    <th>الفئة</th>
                    <th>عدد التحميلات</th>
                    <th>المستخدمون</th>
                    <th>آخر تحديث</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.topPDFs.map((pdf, index) => (
                    <tr key={pdf.id}>
                      <td>
                        <Badge bg={
                          index === 0 ? 'danger' : 
                          index === 1 ? 'warning' : 
                          index === 2 ? 'info' : 'secondary'
                        }>
                          {index + 1}
                        </Badge>
                      </td>
                      <td>
                        <strong>{pdf.title}</strong>
                        <br />
                        <small className="text-muted">
                          {pdf.description?.slice(0, 50) || 'لا يوجد وصف'}
                        </small>
                      </td>
                      <td>
                        <Badge bg="secondary">{pdf.category || 'عام'}</Badge>
                      </td>
                      <td>
                        <Badge bg="success" className="fs-6">
                          {pdf.downloads_count || 0}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          onClick={() => fetchPDFUsers(pdf.id)}
                          disabled={!(pdf.downloads_count > 0)}
                          title={pdf.downloads_count > 0 ? `عرض ${pdf.downloads_count} مستخدم` : 'لا توجد تحميلات'}
                        >
                          <FaEye /> {pdf.downloads_count > 0 ? `عرض (${pdf.downloads_count})` : 'لا يوجد'}
                        </Button>
                      </td>
                      <td>
                        <small className="text-muted">
                          {formatTimeAgo(pdf.updated_at)}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* تبويب: المستخدمون النشطون */}
        <Tab eventKey="top-users" title={
          <span><FaUsers /> المستخدمون</span>
        }>
          <Card className="shadow-sm mt-3">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <FaUsers className="me-2" />
                أكثر المستخدمين نشاطاً
              </h5>
            </Card.Header>
            <Card.Body>
              {stats.topUsers.length > 0 ? (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>المستخدم</th>
                      <th>البريد الإلكتروني</th>
                      <th>عدد التحميلات</th>
                      <th>آخر نشاط</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topUsers.map((user, index) => (
                      <tr key={user.user_id || index}>
                        <td>
                          <Badge bg={
                            index === 0 ? 'danger' : 
                            index === 1 ? 'warning' : 
                            index === 2 ? 'info' : 'secondary'
                          }>
                            {index + 1}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-primary" />
                            <div>
                              <strong>{user.user_name}</strong>
                              {user.user_id && (
                                <br />
                              )}
                              {user.user_id && (
                                <small className="text-muted">
                                  ID: {user.user_id.substring(0, 8)}...
                                </small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <code>{user.user_email || 'غير معروف'}</code>
                        </td>
                        <td>
                          <Badge bg="success" className="fs-6">
                            {user.download_count}
                          </Badge>
                        </td>
                        <td>
                          <small className="text-muted">
                            {formatTimeAgo(user.last_downloaded_at)}
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  <FaList className="me-2" />
                  لا توجد بيانات عن المستخدمين بعد
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* تبويب: التحميلات الحديثة */}
        <Tab eventKey="recent-downloads" title={
          <span><FaHistory /> حديثة</span>
        }>
          <Card className="shadow-sm mt-3">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <FaHistory className="me-2" />
                التحميلات الحديثة
              </h5>
            </Card.Header>
            <Card.Body>
              {stats.recentDownloads.length > 0 ? (
                <div className="table-responsive">
                  <Table striped hover>
                    <thead>
                      <tr>
                        <th>المستخدم</th>
                        <th>الملف</th>
                        <th>الفئة</th>
                        <th>الوقت</th>
                        <th>IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentDownloads.map((download) => (
                        <tr key={download.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaUser className="me-2 text-primary" />
                              <div>
                                <strong>{download.user_name || download.user_email?.split('@')[0] || 'مستخدم'}</strong>
                                <br />
                                <small className="text-muted">
                                  {download.user_email || 'غير معروف'}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <strong>{getPDFTitle(download)}</strong>
                          </td>
                          <td>
                            <Badge bg="secondary">
                              {getPDFCategory(download)}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex flex-column">
                              <small className="text-success">
                                {formatTimeAgo(download.downloaded_at)}
                              </small>
                              <small className="text-muted">
                                {download.downloaded_at ? 
                                  new Date(download.downloaded_at).toLocaleTimeString('ar-SA') : 
                                  'غير معروف'
                                }
                              </small>
                            </div>
                          </td>
                          <td>
                            <Badge bg="dark">
                              {download.user_ip || 'غير معروف'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <Alert variant="info">
                  <FaHistory className="me-2" />
                  لا توجد تحميلات حديثة
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* إحصائيات التحميلات اليومية */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-warning text-white">
          <h5 className="mb-0">
            <FaCalendar className="me-2" />
            التحميلات في آخر 7 أيام
          </h5>
        </Card.Header>
        <Card.Body>
          <Row>
            {stats.dailyDownloads.map((day, index) => (
              <Col key={index} md={2} sm={4} xs={6} className="mb-3">
                <div className="text-center p-3 border rounded bg-light">
                  <div className="fs-4 fw-bold text-primary">{day.count}</div>
                  <div className="text-muted small">{day.date}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* مودال عرض مستخدمي ملف معين */}
      <Modal 
        show={showUserModal} 
        onHide={() => setShowUserModal(false)}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>
            <FaUsers className="me-2" />
            المستخدمون الذين حملوا هذا الملف
            {selectedPDF && (
              <Badge bg="light" text="dark" className="ms-2">
                {pdfUsers.length} مستخدم
              </Badge>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfUsers.length > 0 ? (
            <>
              <Alert variant="info">
                إجمالي {pdfUsers.length} مستخدم حملوا هذا الملف
              </Alert>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>المستخدم</th>
                      <th>البريد</th>
                      <th>وقت التحميل</th>
                      <th>IP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pdfUsers.map((user, index) => (
                      <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaUser className="me-2 text-primary" />
                            <div>
                              <strong>{user.user_name || 'مستخدم'}</strong>
                              {user.user_id && (
                                <br />
                              )}
                              {user.user_id && (
                                <small className="text-muted">
                                  ID: {user.user_id.substring(0, 8)}...
                                </small>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <code>{user.user_email || 'غير معروف'}</code>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <small className="text-success">
                              {formatTimeAgo(user.downloaded_at)}
                            </small>
                            <small className="text-muted">
                              {user.downloaded_at ? 
                                new Date(user.downloaded_at).toLocaleString('ar-SA') : 
                                'غير معروف'
                              }
                            </small>
                          </div>
                        </td>
                        <td>
                          <Badge bg="secondary">{user.user_ip || 'غير معروف'}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </>
          ) : (
            <Alert variant="warning">
              لا يوجد مستخدمين سجلوا تحميل هذا الملف بعد
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            إغلاق
          </Button>
          {pdfUsers.length > 0 && (
            <Button variant="primary" onClick={() => {
              // تصدير البيانات
              const csvContent = "data:text/csv;charset=utf-8," 
                + ["المستخدم,البريد,وقت التحميل,IP"].join(",") + "\n"
                + pdfUsers.map(u => 
                  `"${u.user_name || 'مستخدم'}","${u.user_email || ''}","${u.downloaded_at || ''}","${u.user_ip || ''}"`
                ).join("\n");
              
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `users_pdf_${selectedPDF}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}>
              📥 تصدير CSV
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}