// app/layout.tsx
import Navbar from './components/NavBar';
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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
