import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import "./globals.css";
const cairo = localFont({
  src: [
    {
      path: "../../public/fonts/cairo-400.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/cairo-500.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/cairo-600.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/cairo-700.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/cairo-800.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/cairo-900.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-cairo",
  display: "swap",
  preload: true,
});
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} | اختر شغفك`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "/",
    siteName: site.name,
    title: `${site.name} | اختر شغفك`,
    description: site.description,
    images: [
      {
        url: "/images/test-logo.jpg",
        width: 1310,
        height: 760,
        alt: "المسجد النبوي الشريف عند الغروب",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/images/medina.jpg"],
  },
  robots: { index: true, follow: true },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09275b",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body>{children}</body>
    </html>
  );
}
