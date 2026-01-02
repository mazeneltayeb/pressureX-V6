// "use client";
// import React, { useState } from "react";
// import { Form, Button, Container, Card } from "react-bootstrap";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const router = useRouter();
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();
//     if (password === "admin123") {
//       localStorage.setItem("isAdmin", "true");
//       router.push("/dashboard");
//     } else {
//       setError("كلمة المرور غير صحيحة");
      
//     }
//   };

// app/login/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Button, Container, Card } from "react-bootstrap";

export default function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })

    const data = await response.json()
    
    if (data.success) {
      localStorage.setItem('isAdmin', 'true')
      router.push('/dashboard')
    } else {
      setError('كلمة المرور غير صحيحة')
    }
  }

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "22rem" }} className="shadow">
        <Card.Body>
          <h3 className="text-center mb-4">تسجيل دخول الأدمن</h3>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>كلمة المرور</Form.Label>
              <Form.Control
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {error && <p className="text-danger text-center">{error}</p>}
            <Button variant="primary" type="submit" className="w-100">
              دخول
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}


