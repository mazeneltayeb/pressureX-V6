"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";

export default function ClientLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 800); // وقت التحميل التجريبي
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (loading) {
    return (
      <div className="global-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return <>{children}</>;
}
