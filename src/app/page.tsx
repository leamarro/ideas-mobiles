import { Hero } from "@/components/home/Hero";
import { Servicios } from "@/components/home/Servicios";
import { Portfolio } from "@/components/home/Portfolio";
import { Nosotros } from "@/components/home/Nosotros";
import { Proceso } from "@/components/home/Proceso";
import { CTA } from "@/components/home/CTA";
import { Contacto } from "@/components/home/Contacto";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getPortfolioItems, getServices, getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [services, portfolioItems, settings] = await Promise.all([
    getServices(),
    getPortfolioItems(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero
          subtitle={settings.heroSubtitle}
          text={settings.heroText}
          buttonText={settings.heroButtonText}
          buttonLink={settings.heroButtonLink}
        />
        <Servicios services={services} />
        <Portfolio items={portfolioItems} />
        <Nosotros logo={settings.logo || "/images/logo.png"} />
        <Proceso />
        <CTA />
        <Contacto
          whatsapp={settings.whatsapp}
          phone={settings.phone}
          email={settings.email}
          instagram={settings.instagram}
          facebook={settings.facebook}
          address={settings.address}
        />
      </main>
      <Footer settings={settings} />
      <WhatsAppButton whatsapp={settings.whatsapp} />
    </>
  );
}
