import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Conquest Test Chat App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-svh flex-col">{children}</body>
    </html>
  );
}
