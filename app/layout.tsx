import type { Metadata } from 'next';
import { Providers } from './providers';

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
