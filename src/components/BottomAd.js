// "use client";
// import React, { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";

// export default function BottomAd() {
//   const [state, setState] = useState("open");
//   const [isRTL, setIsRTL] = useState(true);
//   const pathname = usePathname();

//   useEffect(() => {
//     setState("open");
//   }, [pathname]);

//   useEffect(() => {
//     try {
//       const dir = document?.documentElement?.dir || "rtl";
//       setIsRTL(dir.toLowerCase() === "rtl");
//     } catch (e) {
//       setIsRTL(true);
//     }
//   }, []);

//   const getTranslateY = () => (state === "open" ? "0%" : "80%");
//   const toggleState = () => setState((s) => (s === "open" ? "half" : "open"));

//   return (
//     <div
//       style={{
//         position: "fixed",
//         left: 0,
//         right: 0,
//         bottom: 0,
//         zIndex: 10000,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "flex-end",
//         pointerEvents: "none", // 🚫 الإعلان مش هيمنع الكلكات
//       }}
//     >
//       <div
//         style={{
//           width: "100%",
//           transform: `translateY(${getTranslateY()})`,
//           transition: "transform 420ms cubic-bezier(.2,.9,.2,1)",
//           boxShadow: "0 -6px 18px rgba(0,0,0,0.12)",
//           borderTop: "1px solid rgba(0,0,0,0.08)",
//           borderRadius: 10,
//           overflow: "hidden",
//           background: "transparent",
//           position: "relative",
//           pointerEvents: "auto", // ✅ الإعلانات نفسها والكود الداخلي يرجع يتفاعل
//         }}
//       >
//         {/* زر السهم */}
//         <button
//           onClick={toggleState}
//           style={{
//             position: "absolute",
//             top: "-16px",
//             left: isRTL ? "0px" : "auto",
//             right: isRTL ? "auto" : "0px",
//             width: "42px",
//             height: "42px",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "end",
//             borderRadius: "8px",
//             background: "#e9ecef",
//             border: "1px solid rgba(0, 0, 0, 0.08)",
//             boxShadow: "0 6px 14px rgba(0, 0, 0, 0.18)",
//             cursor: "pointer",
//             zIndex: 10001,
//             transform: "rotate(-90deg)",
//             pointerEvents: "auto", // ✅ يخلي الزر بس يقدر يستقبل كلكات
//           }}
//         >
//           <svg
//             width="28"
//             height="28"
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//             style={{
//               transform: state === "open" ? "rotate(90deg)" : "rotate(-90deg)",
//               transition: "transform 220ms ease",
//             }}
//           >
//             <path
//               d="M6 9 L12 15 L18 9"
//               stroke="#111"
//               strokeWidth="2.2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             />
//           </svg>
//         </button>

//         {/* محتوى الإعلان */}
//         <div
//           style={{
//             width: "100%",
//             background: "#e9ecef",
//             padding: 12,
//             borderRadius: 8,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: 36,
//           }}
//         >
//           <div
//             id="google-ad-slot"
//             style={{
//               width: "100%",
//               height: 90,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               borderRadius: 6,
//               background: "rgba(255,255,255,0.4)",
//               padding: "6px 10px",
//               textAlign: "center",
//             }}
//           >
//             <div style={{ fontSize: 14, color: "#111" }}>
//               📢 مساحة إعلان Google — ضع كود AdSense هنا
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
