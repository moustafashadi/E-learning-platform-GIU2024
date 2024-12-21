"use client";
// app/layout.tsx
import Providers from './providers';
import Navbar from './chat/components/NavBar';
import Footer from './chat/components/Footer';
import './globals.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}