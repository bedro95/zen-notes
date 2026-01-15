import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zen Notis | Luxury Reminders",
  description: "A high-end notification system for focused individuals",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg", // ربط الأيقونة الزجاجية
    apple: "/icon.svg", // لضمان ظهورها على iPhone
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // يمنع التكبير العشوائي للمحافظة على مظهر التطبيق
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body 
        className={`${inter.className} bg-[#050505] antialiased`}
        style={{ margin: 0, padding: 0, overflowX: 'hidden' }}
      >
        {children}
      </body>
    </html>
  );
}
