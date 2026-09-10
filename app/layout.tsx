import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

/* ─────────────────────────────────────────────
   عدّل الحاجات دي بعد ما تجهّز الدومين والحساب
   ───────────────────────────────────────────── */
const SITE_URL = "https://example.com";        // ← دومين الموقع
const ADS_ID = "AW-XXXXXXXXXX";                // ← Google Ads ID
const CONV_FORM = `${ADS_ID}/XXXXXXXXXXXXXXXXXXX`;
const CONV_WA = `${ADS_ID}/XXXXXXXXXXXXXXXXXXX`;
const CONV_CALL = `${ADS_ID}/XXXXXXXXXXXXXXXXXXX`;

const AGENT_EN = "Grandeur Spaces";            // ← اسم شركتك زي ما هو في توثيق Google Ads
const AGENT_PHONE_INTL = "+20XXXXXXXXXX";
const AGENT_EMAIL = "info@example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ماونتن فيو 1.1 اكستنشن — التجمع الخامس | استلام فوري من 14.5 مليون",
  description:
    "المرحلة الثانية من ماونتن فيو 1.1 اكستنشن على طريق النصر بالتجمع الخامس: شقق 140 م² من 14.5 مليون، آي-فيلا من 23.5 مليون، تاون هاوس من 38 مليون، فيلات من 55 مليون. استلام فوري وتقسيط حتى 8 سنوات. أسعار استرشادية — عرض من وكيل مبيعات معتمد، لسنا الشركة المطوّرة.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "ماونتن فيو 1.1 اكستنشن — استلام فوري بالتجمع الخامس",
    description:
      "المرحلة الثانية بأسعار معلنة تبدأ من 14.5 مليون وتقسيط حتى 8 سنوات، بوحدات استلام فوري. اطلب آخر قائمة وحدات من وكيل مبيعات معتمد.",
    url: SITE_URL,
    siteName: AGENT_EN,
    locale: "ar_EG",
    type: "website",
  },
};

const JSONLD = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: AGENT_EN,
  url: SITE_URL,
  telephone: AGENT_PHONE_INTL,
  email: AGENT_EMAIL,
  address: { "@type": "PostalAddress", addressLocality: "القاهرة", addressCountry: "EG" },
  description:
    "وكيل مبيعات عقاري معتمد في مصر. لسنا شركة ماونتن فيو للتطوير العقاري ولا تابعين لها.",
  areaServed: "EG",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@400;600;700;800&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Archivo:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
        />
      </head>
      <body>
        {children}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent','default',{
            ad_storage:'denied', ad_user_data:'denied',
            ad_personalization:'denied', analytics_storage:'denied'
          });
          try { if (localStorage.getItem('mv_cookie_ok')) {
            gtag('consent','update',{
              ad_storage:'granted', ad_user_data:'granted',
              ad_personalization:'granted', analytics_storage:'granted'
            });
          } } catch(e) {}
          gtag('config','${ADS_ID}');

          function trackFormLead(){ gtag('event','conversion',{'send_to':'${CONV_FORM}'}); }
          function trackWhatsapp(){ gtag('event','conversion',{'send_to':'${CONV_WA}'}); }
          function trackCall(){ gtag('event','conversion',{'send_to':'${CONV_CALL}'}); }
        `}</Script>
      </body>
    </html>
  );
}
