"use client";
import React from "react";

/**
 * AdSlot - مكوّن صغير لعرض مساحة إعلان.
 * استبدل المحتوى داخل الـ div بالتاج <ins class="adsbygoogle"...> الخاص بجوجل لما تكون جاهز.
 */
export default function AdSlot({ label = "مساحة إعلان (728x90)", height = "90px", maxWidth = "900px" }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
      <div
        id="ad-slot"
        style={{
          width: "100%",
          maxWidth,
          height,
          background: "#f8f9fa",
          borderRadius: 10,
          border: "1px dashed rgba(0,0,0,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#555",
          boxSizing: "border-box",
          padding: "6px",
        }}
      >
        {/* هنا تحط كود AdSense لاحقًا */}
        <div>{label}</div>
      </div>
    </div>
  );
}
