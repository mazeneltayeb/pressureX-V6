"use client";
import React from "react";
import { Table, Card } from "react-bootstrap";

const PricesSection = () => {
  return (
    <section className="prices-section py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-5">📊 أحدث الأسعار اليوم</h2>


        <div className="row g-4">
          {/* 🟡 أسعار الذهب */}
          <div className="col-md-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="mb-3 text-center text-warning">
                  أسعار الذهب اليوم
                </Card.Title>
                <Table bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>العيار</th>
                      <th>السعر (جنيه)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>عيار 24</td>
                      <td>3200</td>
                    </tr>
                    <tr>
                      <td>عيار 21</td>
                      <td>2800</td>
                    </tr>
                    <tr>
                      <td>عيار 18</td>
                      <td>2400</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>

          {/* 💵 أسعار الصرف */}
          <div className="col-md-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="mb-3 text-center text-success">
                  أسعار الصرف
                </Card.Title>
                <Table bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>العملة</th>
                      <th>سعر الشراء</th>
                      <th>سعر البيع</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>الدولار</td>
                      <td>48.60</td>
                      <td>48.90</td>
                    </tr>
                    <tr>
                      <td>اليورو</td>
                      <td>52.00</td>
                      <td>52.40</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>

          {/* 🐔 بورصة الدواجن */}
          <div className="col-md-4">
            <Card className="h-100 shadow-sm border-0">
              <Card.Body>
                <Card.Title className="mb-3 text-center text-danger">
                  بورصة الدواجن
                </Card.Title>
                <Table bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th>النوع</th>
                      <th>السعر (جنيه)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>دواجن بيضاء</td>
                      <td>85</td>
                    </tr>
                    <tr>
                      <td>بلدي</td>
                      <td>100</td>
                    </tr>
                    <tr>
                      <td>أمهات</td>
                      <td>70</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricesSection;
