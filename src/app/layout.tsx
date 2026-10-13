import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { getSiteSettings } from "@/lib/data";
import { getContent } from "@/lib/content";
import { getTheme, themeCssText } from "@/lib/theme";
import { BackToTop } from "@/components/layout/BackToTop";
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
  const content = getContent(settings.content);
  const siteName = settings.title;
  const defaultTitle = `${settings.title} | Cartelería y Comunicación Visual`;
  const description = settings.description;
  const favicon = settings.favicon;
  const ogImage = content.ogImage || settings.logo || undefined;

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },
    description,
    ...(favicon ? { icons: { icon: favicon } } : {}),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    openGraph: {
      type: "website",
      locale: "es-ES",
      siteName,
      title: defaultTitle,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const theme = getTheme(settings.theme);
  const themeCss = themeCssText(theme);

  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable}`} suppressHydrationWarning>
      <body className="bg-background text-body antialiased">
        <style
          id="site-theme"
          dangerouslySetInnerHTML={{ __html: themeCss }}
        />
        {children}
        <BackToTop />
      </body>
    </html>
  );
}
