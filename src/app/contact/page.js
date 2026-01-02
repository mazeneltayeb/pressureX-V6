"use client";
import React from "react";
import { Container, Form, Button } from "react-bootstrap";
import useTranslate from '@/hooks/useTranslate';
export default function Contact() {
  const { t, lang } = useTranslate(null);
  return (
    <Container className="py-5">
      <h1 className="text-center mb-4">{t('contact_h1')}</h1>
      <Form style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label>{t('contact_name')}</Form.Label>
          <Form.Control type="text" placeholder={t('contact_name_placeholder')} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>{t('contact_email')}</Form.Label>
          <Form.Control type="email" placeholder="example@email.com" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>{t('contact_phone_number')}</Form.Label>
          <Form.Control type="" placeholder="" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formMessage">
          <Form.Label>{t('contact_massege')}</Form.Label>
          <Form.Control as="textarea" rows={4} placeholder={t('contact_massege_placeholder')} />
        </Form.Group>

        <div className="text-center">
          <Button variant="success" type="submit">
           {t('contact_send_button')}
          </Button>
        </div>
      </Form>
    </Container>
  );
}
