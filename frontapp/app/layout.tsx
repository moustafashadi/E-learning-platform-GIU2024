"use client";
// app/layout.tsx
import Navbar from './components/NavBar';
import Footer from './components/Footer'; // Import the Footer component
import './globals.css'; // Import global styles
import store from './store';
import { Provider } from 'react-redux';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Provider store={store}>
        <Navbar />
        {children}
        </Provider>
      </body>
    </html>
  );
}
