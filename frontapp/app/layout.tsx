// app/layout.tsx
import Providers from './providers';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import './globals.css';

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
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}