import Image from "next/image";
import { Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AccentText, RichText } from "@/components/ui/AccentText";
import { Reveal } from "@/components/ui/Reveal";
import { uploadImageProps } from "@/lib/upload-urls";

interface NosotrosProps {
  content: Record<string, string>;
  logo?: string;
  showHeading?: boolean;
}

export function Nosotros({
  content,
  logo = "/images/Firefly.png",
  showHeading = true,
}: NosotrosProps) {
  return (
    <section id="nosotros" className="bg-white py-20 md:py-28">
      <Container maxWidth="full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            {showHeading && (
              <SectionHeading
                eyebrow={content.nosotrosEyebrow}
                align="left"
                title={<AccentText text={content.nosotrosTitle} />}
              />
            )}
            <Reveal>
              <p className="mb-6 text-lg leading-relaxed text-zinc-600">
                <RichText text={content.nosotrosText} />
              </p>
              <blockquote className="relative rounded-2xl border-l-4 border-brand-red-500 bg-zinc-50 px-7 py-6">
                <p className="whitespace-pre-line font-display text-xl font-medium leading-snug text-zinc-800 md:text-2xl">
                  <RichText text={content.nosotrosSlogan} />
                </p>
              </blockquote>
            </Reveal>
          </div>

        <Reveal delay={120}>
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-white p-8 md:p-12">
            <div className="relative h-32 w-full max-w-[420px] md:h-40">
              <Image
                src={logo}
                alt="Ideas Móviles"
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-contain"
                {...uploadImageProps(logo)}
              />
            </div>
          </div>
        </Reveal>
        </div>
      </Container>
    </section>
  );
}
