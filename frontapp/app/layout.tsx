// app/layout.tsx
import Navbar from './components/NavBar';
import Footer from './components/Footer'; // Import the Footer component
import './globals.css'; // Import global styles

export const metadata = {
  title: 'My E-Learning Platform',
  description: 'An e-learning platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div>
        
        <Navbar />
        </div>
        
        {children}
        <Footer /> {/* Add the Footer here */}
      </body>
    </html>
  );
}
