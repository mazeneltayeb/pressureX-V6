"use client";
import { useState } from "react";
import { Button, Form, Modal, InputGroup } from "react-bootstrap";

export default function AddToCartButton({ product }) {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const addToCart = () => {
    // جلب السلة الحالية من localStorage
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // التحقق إذا المنتج موجود بالفعل
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
      // تحديث الكمية إذا المنتج موجود
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      // إضافة منتج جديد
      currentCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || "",
        quantity: quantity
      });
    }
    
    // حفظ في localStorage
    localStorage.setItem('cart', JSON.stringify(currentCart));
    
    // إظهار تأكيد
    alert(`✅ تم إضافة ${quantity} من ${product.name} إلى السلة`);
    setShowModal(false);
    setQuantity(1);
  };

  return (
    <>
      <Button 
        variant="success" 
        className="w-100"
        onClick={() => setShowModal(true)}
      >
        🛒 اطلب الآن
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>إضافة إلى السلة</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-3">
            <img 
              src={product.images?.[0] || "https://via.placeholder.com/100"} 
              alt={product.name}
              style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }}
            />
            <h6 className="mt-2">{product.name}</h6>
            <p className="text-success h5">{product.price} ج.م</p>
          </div>

          <Form.Group>
            <Form.Label>الكمية المطلوبة</Form.Label>
            <InputGroup>
              <Button 
                variant="outline-secondary"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                -
              </Button>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="text-center"
              />
              <Button 
                variant="outline-secondary"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </Button>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            إلغاء
          </Button>
          <Button variant="success" onClick={addToCart}>
            🛒 إضافة إلى السلة
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}