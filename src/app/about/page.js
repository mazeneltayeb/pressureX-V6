"use client";
import React from "react";
import { Container } from "react-bootstrap";
import useTranslate from '@/hooks/useTranslate';

export default function About() {
    const { t, lang } = useTranslate(null);
  
  return (
    <Container className="py-5">
      <h1  className="text-center mb-4">{t("about_us_h1")}</h1>
      <p className="text-center" style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>
        {t("about_us_text_page")}
      </p>
      

    </Container>
  );
}
