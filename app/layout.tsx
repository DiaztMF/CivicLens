import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'LaporVibe - Aplikasi Pelaporan Fasilitas Publik',
  description: 'Laporkan kerusakan fasilitas umum dengan bantuan AI untuk lingkungan yang lebih baik.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={cn("antialiased", inter.variable, jetbrainsMono.variable)}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
