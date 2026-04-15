import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Clinicall',
    template: '%s | Clinicall'
  },
  description: 'Premium SaaS marketing website for clinic software, subscriptions, and patient growth.',
  metadataBase: new URL('https://clinicall.example'),
  openGraph: {
    title: 'Clinicall',
    description: 'Premium SaaS marketing website for clinic software, subscriptions, and patient growth.',
    url: 'https://clinicall.example',
    siteName: 'Clinicall',
    type: 'website'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}