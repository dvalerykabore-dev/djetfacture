import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DJETFACTURE — Facturation & Gestion financière OHADA',
  description: 'SaaS de facturation pour entrepreneurs africains. Conforme OHADA, calcul TVA automatique, gestion multi-devises FCFA.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen bg-canvas text-slate-900 selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
