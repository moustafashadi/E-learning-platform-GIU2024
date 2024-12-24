"use client";
// app/layout.tsx
import Providers from './providers';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import './globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <ToastContainer />
      </body>
    </html>
  );
}