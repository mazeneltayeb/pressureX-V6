"use client";

import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";

export default function GoldAdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRow, setNewRow] = useState({ type: "", rates: "" });

  // ✅ تحميل البيانات من API
  useEffect(() => {
    fetch("/api/prices/currency")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ حفظ التغييرات في السيرفر
  const saveData = async (updatedData) => {
    await fetch("/api/prices/currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    setData(updatedData);
  };

  // ✅ تحديث سعر
  const handlePriceChange = (key, value) => {
    const updated = { ...data, rates: { ...data.rates, [key]: value } };
    saveData(updated);
  };

  // ✅ حذف صف
  const handleDelete = (key) => {
    const updated = { ...data };
    delete updated.rates[key];
    saveData(updated);
  };

  // ✅ إضافة صف جديد
  const handleAddRow = () => {
    if (!newRow.type || !newRow.rates) return alert("اكتب العيار والسعر يا طيب ❤️");
    const updated = {
      ...data,
      rates: { ...data.rates, [newRow.type]: newRow.rates },
    };
    saveData(updated);
    setNewRow({ type: "", rates: "" });
  };

  if (loading) return <p className="text-center mt-5">جارٍ التحميل...</p>;
  if (!data) return <p className="text-center text-danger">حدث خطأ في تحميل البيانات</p>;

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">⚙️ تعديل أسعار الذهب</h2>

      <Table bordered hover responsive>
        <thead className="table-warning">
          <tr>
            <th>العيار</th>
            <th>السعر (جنيه)</th>
            <th>تحكم</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.rates || {}).map(([type, rates], i) => (
            <tr key={i}>
              <td>{type}</td>
              <td>
                <Form.Control
                  type="number"
                  value={rates}
                  onChange={(e) => handlePriceChange(type, e.target.value)}
                />
              </td>
              <td>
                <Button variant="danger" size="sm" onClick={() => handleDelete(type)}>
                  حذف
                </Button>
              </td>
            </tr>
          ))}

          <tr className="bg-light">
            <td>
              <Form.Control
                placeholder="عيار جديد مثل 22"
                value={newRow.type}
                onChange={(e) => setNewRow({ ...newRow, type: e.target.value })}
              />
            </td>
            <td>
              <Form.Control
                placeholder="السعر"
                type="number"
                value={newRow.rates}
                onChange={(e) => setNewRow({ ...newRow, rates: e.target.value })}
              />
            </td>
            <td>
              <Button variant="success" size="sm" onClick={handleAddRow}>
                ➕ إضافة
              </Button>
            </td>
          </tr>
        </tbody>
      </Table>

      <p className="text-muted text-center mt-3">
        آخر تحديث: {new Date(data.lastUpdate).toLocaleString("ar-EG")}
      </p>
    </Container>
  );
}
