import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import PhoneNormalizer from "./components/PhoneNormalizer";
import GalleryLinkFixer from "./components/GalleryLinkFixer";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Custom Food Trailers & Mobile Kitchens in Nevada | All Custom Trailers",
  description: "Custom food trailers and mobile kitchens built in Nevada. Fully custom layouts, commercial equipment and financing options for your next business.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} ${mono.variable}`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4S6FH3LEB6"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4S6FH3LEB6');
          `}
        </Script>
        <LanguageProvider>
          <PhoneNormalizer />
          <GalleryLinkFixer />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
