"use client";

import React, { useEffect, useState } from "react";
import { Container, Table, Button, Form } from "react-bootstrap";

export default function GoldAdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newRow, setNewRow] = useState({ type: "", prices: "" });

  // ✅ تحميل البيانات من API
  useEffect(() => {
    fetch("/api/prices/poultry")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ✅ حفظ التغييرات في السيرفر
  const saveData = async (updatedData) => {
    await fetch("/api/prices/poultry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    setData(updatedData);
  };

  // ✅ تحديث سعر
  const handlePriceChange = (key, value) => {
    const updated = { ...data, prices: { ...data.prices, [key]: value } };
    saveData(updated);
  };

  // ✅ حذف صف
  const handleDelete = (key) => {
    const updated = { ...data };
    delete updated.prices[key];
    saveData(updated);
  };

  // ✅ إضافة صف جديد
  const handleAddRow = () => {
    if (!newRow.type || !newRow.prices) return alert("اكتب العيار والسعر يا طيب ❤️");
    const updated = {
      ...data,
      prices: { ...data.prices, [newRow.type]: newRow.prices },
    };
    saveData(updated);
    setNewRow({ type: "", prices: "" });
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
          {Object.entries(data.prices || {}).map(([type, prices], i) => (
            <tr key={i}>
              <td>{type}</td>
              <td>
                <Form.Control
                  type="number"
                  value={prices}
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
                value={newRow.price}
                onChange={(e) => setNewRow({ ...newRow, prices: e.target.value })}
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
