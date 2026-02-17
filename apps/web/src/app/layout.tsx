import Navbar from '@/components/Navbar';
import AuthProvider from '@/context/AuthProvider';
import '@repo/ui/globals.css';
import type { Metadata } from 'next';
import { Afacad_Flux } from 'next/font/google';
import { Toaster } from '@repo/ui/components/ui/sonner';

export const metadata: Metadata = {
  title: 'ArqiTech — AI-Powered Architectural Visualization',
  description:
    'Transform your 2D floor plans into stunning 3D architectural visualizations with AI. Upload, render, and compare designs instantly with ArqiTech.',
};

export const inter = Afacad_Flux({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${inter.className} antialiased`}>
        <AuthProvider>
          <Navbar />
          <Toaster />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
