import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { defaultMeta, siteUrl } from '@/lib/seo';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: defaultMeta.title,
  description: defaultMeta.description,
  alternates: { canonical: '/' },
  openGraph: { title: defaultMeta.title, description: defaultMeta.description, url: siteUrl, siteName: 'IMI DESIGN', type: 'website' },
  twitter: { card: 'summary_large_image', title: defaultMeta.title, description: defaultMeta.description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>
    {process.env.NEXT_PUBLIC_GA4_ID && <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`} strategy="afterInteractive" />}
    <Header />{children}<Footer />
  </body></html>;
}
