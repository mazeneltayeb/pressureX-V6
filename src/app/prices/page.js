"use client";
import React from "react";
import Link from "next/link";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import AdSlot from "@/components/AdSlot";

export default function PricesIndex() {
  return (
    <Container className="py-5">
      <AdSlot label="🔸 إعلان أعلى صفحة الأسعار (ضع كود AdSense هنا)" />

      <h1 className="text-center mb-4">📊 صفحة الأسعار</h1>
      <p className="text-center text-muted mb-4">
        اختر القائمة الفرعية لمشاهدة أسعار الذهب، الصرف، بورصة الدواجن أو أسعار الخامات.
      </p>

      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>💰 أسعار الذهب</Card.Title>
              <Card.Text>جداول اسعار العيارات والجنيه الذهب محدثة.</Card.Text>
              <Button as={Link} href="/prices/gold" variant="success">عرض</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>💱 أسعار الصرف</Card.Title>
              <Card.Text>سعر الدولار، اليورو وغيرها.</Card.Text>
              <Button as={Link} href="/prices/exchange" variant="success">عرض</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>🐔 بورصة الدواجن</Card.Title>
              <Card.Text>سعر الدواجن بأنواعها (تُعدل من الداشبورد).</Card.Text>
              <Button as={Link} href="/prices/poultry" variant="success">عرض</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <Card.Title>🧱 أسعار الخامات</Card.Title>
              <Card.Text>أسعار المواد الخام والصناعية.</Card.Text>
              <Button as={Link} href="/prices/materials" variant="success">عرض</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <AdSlot label="🔹 إعلان أسفل صفحة الأسعار (ضع كود AdSense هنا)" />
    </Container>
  );
}
