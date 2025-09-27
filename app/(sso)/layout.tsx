import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.scss';
import { CgLock } from 'react-icons/cg';
import Image from 'next/image';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Acstane Identity Portal',
  description: 'Authentication and Identity Management at Acstane',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex items-center justify-center p-4`}
      >
        <div className="auth-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <div className="flex justify-center mb-2">
              <div className="flex items-center space-x-2">
                <Image
                  src="/light_purple_violet_full_transparent.svg"
                  width={64}
                  height={64}
                  alt="Acstane Logo"
                />
              </div>
            </div>
            {children}
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 flex items-center">
                <CgLock className="w-3 h-3 mr-2" />
                Secure connection
              </span>
              <span className="text-xs text-gray-500">Acstane Identity</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
