"use client";
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function PricesDashboard() {
  const router = useRouter();

  const pricePages = [
    { title: "💰 أسعار الذهب", path: "/dashboard/prices/gold" },
    { title: "💵 أسعار الصرف", path: "/dashboard/prices/currency" },
    { title: "🐔 بورصة الدواجن", path: "/dashboard/prices/poultry" },
    { title: "🌾 أسعار الأعلاف", path: "/dashboard/prices/feeds" },
    { title: "🌾  اسعار الخامات", path: "/dashboard/prices/materials" },
  ];

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">📊 إدارة الأسعار</h2>
      <Row className="g-4">
        {pricePages.map((page, index) => (
          <Col key={index} md={3}>
            <Card className="text-center shadow-sm">
              <Card.Body>
                <Card.Title>{page.title}</Card.Title>
                <Button variant="primary" onClick={() => router.push(page.path)}>
                  تعديل الأسعار
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
