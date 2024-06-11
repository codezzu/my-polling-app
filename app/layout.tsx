import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Polling App',
  description: 'Create and participate in polls',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between">
            <Link href="/" className="text-white font-bold text-xl">
              Polling App
            </Link>
            <div className="flex space-x-4">
              <Link href="/register" className="text-white">
                Kayıt Ol
              </Link>
              <Link href="/login" className="text-white">
                Giriş Yap
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
