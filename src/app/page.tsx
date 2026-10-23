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
import { getPortfolioCategories, getPortfolioItems, getServices, getSiteSettings } from "@/lib/data";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [services, portfolioItems, portfolioCategories, settings] = await Promise.all([
    getServices(),
    getPortfolioItems(),
    getPortfolioCategories(),
    getSiteSettings(),
  ]);

  const content = getContent(settings.content);

  return (
    <>
      <Header content={content} />
      <main>
        <Hero
          subtitle={settings.heroSubtitle}
          text={settings.heroText}
          buttonText={settings.heroButtonText}
          buttonLink={settings.heroButtonLink}
          secondaryButton={content.heroSecondary}
          images={settings.heroImages}
        />
        <Servicios services={services} content={content} />
        <Portfolio items={portfolioItems} categories={portfolioCategories} content={content} />
        <Nosotros content={content} logo={settings.logo || "/images/logo.png"} />
        <Proceso content={content} />
        <CTA content={content} whatsapp={settings.whatsapp} />
        <Contacto
          content={content}
          whatsapp={settings.whatsapp}
          phone={settings.phone}
          email={settings.email}
          instagram={settings.instagram}
          facebook={settings.facebook}
          address={settings.address}
        />
      </main>
      <Footer settings={settings} content={content} />
      <WhatsAppButton whatsapp={settings.whatsapp} />
    </>
  );
}
