import './globals.css';

import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';

import Footer from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import SplashScreen from '@/components/layout/splash-screen';
import { NavigationProvider } from '@/components/providers/navigation-provider';
import { StyleGlideProvider } from '@/components/providers/styleglide-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://torekull.se'),
  title: {
    default: 'TOREKULL - Interior Architecture and Design',
    template: '%s - TOREKULL',
  },
  description:
    'Award-winning Swedish and American interior architecture firm specializing in hotels, restaurants, bars and commercial spaces.',
  keywords: [
    'interior architecture',
    'interior design',
    'Stockholm',
    'restaurant design',
    'hotel design',
    'commercial interior',
    'Swedish design',
    'TOREKULL',
  ],
  authors: [{ name: 'TOREKULL Interior Architecture and Design & Partners AB' }],
  creator: 'TOREKULL',
  publisher: 'TOREKULL',
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: 'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/brand/Torekull_logo_new1.png',
        type: 'image/png',
      },
      {
        url: 'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/brand/logo_svg.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: 'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/brand/Torekull_logo_new1.png',
        sizes: '180x180',
      },
    ],
    shortcut: [
      {
        url: 'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/brand/Torekull_logo_new1.png',
      },
    ],
  },
  openGraph: {
    title: 'TOREKULL - Interior Architecture and Design',
    description:
      'Creative and innovative solutions within interior architecture, furniture and product design.',
    url: 'https://torekull.se',
    siteName: 'TOREKULL',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/3sixty-1.jpg',
        width: 1200,
        height: 630,
        alt: 'TOREKULL Interior Architecture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TOREKULL - Interior Architecture and Design',
    description:
      'Creative and innovative solutions within interior architecture, furniture and product design.',
    images: [
      'https://c1hxfnulg8jbz3wb.public.blob.vercel-storage.com/images/torekull/projects/3sixty-1.jpg',
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-screen flex-col antialiased',
          inter.variable,
          cormorant.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <NavigationProvider>
            <StyleGlideProvider />
            <SplashScreen />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </NavigationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

