import type { Metadata, Viewport } from 'next';
import { Inter, Kantumruy_Pro } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/context/language-context';
import { Navbar } from '@/components/navbar';
import { InstallPwaBanner } from '@/components/install-pwa-banner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const kantumruyPro = Kantumruy_Pro({
  subsets: ['khmer', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-kantumruy',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MoEYS Academic & Student Support Platform (Grades 7–12)',
  description:
    'Official Cambodian MoEYS aligned learning platform with YouTube video lessons, Google Drive PDF handouts, and interactive 5-choice MCQs with instant step-by-step solutions for Grades 7 to 12. 100% Free Public Student Access.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MoEYS Hub',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="km" suppressHydrationWarning className={`${inter.variable} ${kantumruyPro.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <InstallPwaBanner />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
