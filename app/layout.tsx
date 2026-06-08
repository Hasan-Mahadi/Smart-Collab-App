import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartCollab - Project & Task Collaboration',
  description:
    'Production-ready SaaS project management platform for teams',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
