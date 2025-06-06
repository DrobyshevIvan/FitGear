// import { Layout, Menu } from "antd";
// import "./globals.css";
// import { Content, Footer, Header } from "antd/es/layout/layout";
// import { AuthProvider } from './contexts/AuthContext';
// import Link from "next/link";

// const items = [
//   {key: "home", label: <Link href={"/"}>Home</Link>},
//   {key: "books", label: <Link href={"/announcements"}>Announcements</Link>}
// ];

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <Layout style={{minHeight: "100vh" }}>
//           <Header>
//             <Menu 
//               theme="dark"
//               mode="horizontal" 
//               items = {items} 
//               style={{flex:1, minWidth: 0}}
//             />
//           </Header>
//           <Content style={{padding: "0 48px"}}>{children}</Content>
//           <Footer style={{textAlign: "center"}}>
//             Fitgear ©2021 Created by Fitgear Team
//           </Footer>
//         </Layout>
//       </body>
//     </html>
//   );
// }

'use client';

import { Layout, Menu, Button } from "antd";
import "./globals.css";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Link from "next/link";
import { AuthProvider } from './contexts/AuthContext';
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';

// Динамический импорт компонента заголовка с отключенной предварительной отрисовкой
const AppHeaderWithAuth = dynamic(
  () => import('./components/AppHeader').then((mod) => mod.AppHeader),
  { ssr: false } // Важно: отключаем серверный рендеринг
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout style={{minHeight: "100vh" }}>
            <AppHeaderWithAuth />
            <Content style={{padding: "0 48px"}}>{children}</Content>
            <Footer style={{textAlign: "center"}}>
              Fitgear ©2021 Created by Fitgear Team
            </Footer>
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}