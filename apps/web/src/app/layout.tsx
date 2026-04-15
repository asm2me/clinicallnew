import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { websiteSettings, seoKeywords } from '@/lib/site-data';

export const metadata: Metadata = {
  title: {
    default: websiteSettings.brandName,
    template: `%s | ${websiteSettings.brandName}`
  },
  description: websiteSettings.description,
  keywords: seoKeywords,
  metadataBase: new URL('https://clinicall.example'),
  openGraph: {
    title: websiteSettings.brandName,
    description: websiteSettings.description,
    url: 'https://clinicall.example',
    siteName: websiteSettings.brandName,
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}