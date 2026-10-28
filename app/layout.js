import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import CartProvider from '@/components/CartProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#06100c',
};

export const metadata = {
  title: 'Rajeshwar Infotech – Computer Parts & Micro Components',
  description: 'Industrial and commercial supplier of certified computer hardware, laptop replacement parts, micro semiconductors, ICs and networking equipment.'
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
        <body className="min-h-screen flex flex-col bg-background text-foreground">
          <CartProvider>
            <Header />
            <main className="container mx-auto px-4 sm:px-6 flex-1">
              {children}
            </main>
            <Footer />
            <Toaster position="bottom-right" richColors />
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
