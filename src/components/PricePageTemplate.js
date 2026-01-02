// "use client";
// import React from "react";
// import { Container, Table, Card } from "react-bootstrap";

// export default function PricePageTemplate({ title, data }) {
//   const { intro, prices } = data;

//   const today = new Date();
//   const formattedDate = today.toLocaleDateString("ar-EG", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   return (
//     <Container className="py-5">
//       <h1 className="text-center mb-3 text-warning fw-bold">{title}</h1>
//       <p className="text-center text-muted">📅 {formattedDate}</p>

//       <Card className="p-4 shadow-sm mb-4">
//         <p style={{ lineHeight: "1.8", fontSize: "1.1rem", color: "#333" }}>
//           {intro}
//         </p>
//       </Card>

//       <Card className="shadow-sm">
//         <Table bordered hover responsive className="mb-0 text-center">
//           <thead className="table-warning">
//             <tr>
//               <th>العنصر</th>
//               <th>السعر</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.entries(prices).map(([key, value]) => (
//               <tr key={key}>
//                 <td>{key}</td>
//                 <td>{value}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Card>

//       <div
//         style={{
//           backgroundColor: "#f8f9fa",
//           padding: "20px",
//           textAlign: "center",
//           borderRadius: "10px",
//           marginTop: "40px",
//         }}
//       >
//         <p>🔸 مساحة إعلان (728x90)</p>
//       </div>
//     </Container>
//   );
// }
