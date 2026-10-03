import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
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

export const metadata: Metadata = {
  title: {
    default: "Ideas Móviles | Cartelería y Comunicación Visual",
    template: "%s | Ideas Móviles",
  },
  description: "Ideas Móviles - Diseño y producción de cartelería, señalética, vinilos y gráfica publicitaria.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "es-ES",
    siteName: "Ideas Móviles",
    title: "Ideas Móviles | Cartelería y Comunicación Visual",
    description: "Diseño y producción de cartelería, señalética, vinilos y gráfica publicitaria.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ideas Móviles",
    description: "Cartelería y comunicación visual profesional.",
  },
};

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
