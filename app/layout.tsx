import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';

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

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => <Providers>{children}</Providers>;

export default RootLayout;
