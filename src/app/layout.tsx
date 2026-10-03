import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { getSiteSettings } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.title;
  const defaultTitle = `${settings.title} | Cartelería y Comunicación Visual`;
  const description = settings.description;

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    openGraph: {
      type: "website",
      locale: "es-ES",
      siteName,
      title: defaultTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable}`} suppressHydrationWarning>
      <body className="bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}
