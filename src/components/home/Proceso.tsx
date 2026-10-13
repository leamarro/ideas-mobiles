import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AccentText } from "@/components/ui/AccentText";
import { Reveal } from "@/components/ui/Reveal";

interface ProcesoProps {
  content: Record<string, string>;
  showHeading?: boolean;
}

export function Proceso({ content, showHeading = true }: ProcesoProps) {
  const steps = [
    {
      number: "01",
      title: content.processStep1Title,
      description: content.processStep1Text,
    },
    {
      number: "02",
      title: content.processStep2Title,
      description: content.processStep2Text,
    },
    {
      number: "03",
      title: content.processStep3Title,
      description: content.processStep3Text,
    },
    {
      number: "04",
      title: content.processStep4Title,
      description: content.processStep4Text,
    },
  ];

  return (
    <section id="proceso" className="bg-zinc-50 py-20 md:py-28">
      <Container maxWidth="full">
        {showHeading && (
          <SectionHeading
            eyebrow={content.procesoEyebrow}
            title={<AccentText text={content.procesoTitle} />}
            subtitle={content.procesoSubtitle}
          />
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 80} className="relative h-full">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-card">
                <span
                  className="pointer-events-none absolute -right-1 -top-4 font-display text-7xl font-bold text-zinc-100 select-none transition-colors duration-300 group-hover:text-brand-red-100"
                  aria-hidden="true"
                >
                  {step.number}
                </span>
                <div className="relative">
                  <span className="inline-flex items-center rounded-full bg-brand-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-brand-red-600">
                    Paso {step.number}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold uppercase text-heading">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <span
                  className="absolute -right-6 top-1/2 z-10 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-soft lg:flex"
                  aria-hidden="true"
                >
                  <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </Reveal>
          ))}
        </div>

      </Container>
    </section>
  );
}
