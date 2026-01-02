
"use client";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // التحقق من إذا المستخدم أدمن
    const loggedIn = localStorage.getItem("isAdmin");
    if (loggedIn !== "true") {
      router.push("dashboard/login"); // لو مش أدمن يروح صفحة الدخول
    } else {
      setIsAdmin(true);
    }
  }, [router]);

  if (!isAdmin) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>جارٍ التحقق من الصلاحية...</p>;
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">لوحة التحكم</h2>
      <Row className="g-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>الأسعار</Card.Title>
              <Button variant="primary" onClick={() => router.push("/dashboard/prices")}>
                إدارة الأسعار
              </Button>
            </Card.Body>
          </Card>
        </Col>
      
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>المقالات</Card.Title>
              <Button variant="primary" onClick={() => router.push("/dashboard/articles")}>
                إدارة المقالات
              </Button>
            </Card.Body>
          </Card>
        </Col>

         <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>تحليل PDFS </Card.Title>
              <Button variant="primary" onClick={() => router.push("/dashboard/analytics")}>
               اضغط هنا
              </Button>
            </Card.Body>
          </Card>
        </Col>

         <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>pdfs</Card.Title>
              <Button variant="primary" onClick={() => router.push("/dashboard/pdfs")}>
                اضغط هنا          
             </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>المتجر</Card.Title>
              <Button variant="primary" onClick={() => router.push("/dashboard/products")}>
                إدارة المتجر
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>الإعلانات</Card.Title>
              <Button variant="primary" onClick={() => router.push("/dashboard/ads")}>
                إدارة الإعلانات
              </Button>
            </Card.Body>
          </Card>
        </Col>

         <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>تسجيل عضو جديد</Card.Title>
              <Button variant="primary" onClick={() => router.push("/dashboard/users")}>
اضغط هنا              
             </Button>
            </Card.Body>
          </Card>
        </Col>
              <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title> الاعضاء</Card.Title>
              <Button variant="primary" onClick={() => router.push("/dashboard/oldusers")}>
اضغط هنا              
             </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-5">
        <Button variant="danger" onClick={() => {
          localStorage.removeItem("isAdmin");
          router.push("/dashboard/login");
        }}>
          تسجيل الخروج
        </Button>
      </div>
    </Container>
  );
}
