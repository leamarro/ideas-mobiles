"use client";

import { useState, useCallback } from "react";
import { MessageCircle, Phone, Mail, Instagram, MapPin, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT_PLACEHOLDERS } from "@/lib/constants";

interface FormData {
  nombre: string;
  whatsapp: string;
  servicio: string;
  mensaje: string;
  imagen: File | null;
  website: string;
}

interface ContactoProps {
  whatsapp?: string;
  phone?: string;
  email?: string;
  instagram?: string;
  address?: string;
  showHeading?: boolean;
}

const inputClassName =
  "w-full rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-brand-red-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red-500/10";

const labelClassName = "mb-2 block text-sm font-medium text-zinc-700";

export function Contacto({
  whatsapp = CONTACT_PLACEHOLDERS.whatsapp,
  phone = CONTACT_PLACEHOLDERS.phone,
  email = CONTACT_PLACEHOLDERS.email,
  instagram = CONTACT_PLACEHOLDERS.instagram,
  address = CONTACT_PLACEHOLDERS.address,
  showHeading = true,
}: ContactoProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    whatsapp: "",
    servicio: "",
    mensaje: "",
    imagen: null,
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormError(null);
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setFormError("El archivo debe ser menor a 5MB");
          return;
        }
        const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!validTypes.includes(file.type)) {
          setFormError("Formato no permitido. Usá JPG, PNG, WebP o GIF");
          return;
        }
      }
      setFormError(null);
      setFormData((prev) => ({ ...prev, imagen: file }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setFormError(null);

      try {
        const payload = new FormData();
        payload.append("nombre", formData.nombre);
        payload.append("whatsapp", formData.whatsapp);
        payload.append("servicio", formData.servicio);
        payload.append("mensaje", formData.mensaje);
        payload.append("website", formData.website);
        if (formData.imagen) payload.append("imagen", formData.imagen);

        const response = await fetch("/api/contacto", { method: "POST", body: payload });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          setFormError(data.error || "No se pudo enviar el mensaje. Probá de nuevo.");
          return;
        }

        setSubmitted(true);
      } catch {
        setFormError("Error de conexión. Probá de nuevo.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  if (submitted) {
    return (
      <section id="contacto" className="bg-white py-20 md:py-28">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 shadow-lg">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-display text-3xl font-bold uppercase text-zinc-950">¡Gracias!</h2>
            <p className="mt-4 text-zinc-500">
              Tu mensaje fue enviado. Nos contactaremos a la brevedad.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm font-semibold text-brand-red-500 underline underline-offset-4 transition-colors hover:text-brand-red-600"
            >
              Enviar otro mensaje
            </button>
          </div>
        </Container>
      </section>
    );
  }

  const methods = [
    {
      label: "WhatsApp",
      value: whatsapp,
      href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
      external: true,
      icon: <MessageCircle className="h-5 w-5" />,
    },
    {
      label: "Teléfono",
      value: phone,
      href: `tel:${phone.replace(/\D/g, "")}`,
      external: false,
      icon: <Phone className="h-5 w-5" />,
    },
    {
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      external: false,
      icon: <Mail className="h-5 w-5" />,
    },
    {
      label: "Instagram",
      value: instagram,
      href: `https://instagram.com/${instagram.replace("@", "")}`,
      external: true,
      icon: <Instagram className="h-5 w-5" />,
    },
    {
      label: "Dirección",
      value: address,
      href: null,
      external: false,
      icon: <MapPin className="h-5 w-5" />,
    },
  ];

  return (
    <section id="contacto" className="bg-white py-20 md:py-28">
      <Container>
        {showHeading && (
          <SectionHeading
            eyebrow="Hablemos"
            title="Contacto"
            subtitle="Hacé tu consulta y nos ponemos en contacto"
          />
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h3 className="mb-5 font-display text-sm font-semibold uppercase tracking-wider text-zinc-900">
              Contactanos
            </h3>
            <div className="space-y-3">
              {methods.map((method) => {
                const cardClass =
                  "group flex items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition-all duration-200" +
                  (method.href
                    ? " hover:border-brand-red-200 hover:bg-white hover:shadow-soft"
                    : "");
                const content = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-brand-red-500 transition-all duration-200 group-hover:border-brand-red-500 group-hover:bg-brand-red-500 group-hover:text-white">
                      {method.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                        {method.label}
                      </span>
                      <span className="block truncate text-sm font-medium text-zinc-800">
                        {method.value}
                      </span>
                    </span>
                    {method.href && (
                      <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-zinc-300 transition-all duration-200 group-hover:translate-x-1 group-hover:text-brand-red-500" />
                    )}
                  </>
                );

                if (method.href) {
                  return (
                    <a
                      key={method.label}
                      href={method.href}
                      {...(method.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={cardClass}
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <div key={method.label} className={cardClass}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-card md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <div>
                <label htmlFor="nombre" className={labelClassName}>
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="whatsapp" className={labelClassName}>
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                  placeholder="+54 291 454 3333"
                />
              </div>
              <div>
                <label htmlFor="servicio" className={labelClassName}>
                  Servicio
                </label>
                <select
                  id="servicio"
                  name="servicio"
                  value={formData.servicio}
                  onChange={handleChange}
                  className={inputClassName}
                >
                  <option value="">Seleccioná un servicio</option>
                  <option value="carteleria">Cartelería Comercial</option>
                  <option value="corpóreas">Carteles y Letras Corpóreas</option>
                  <option value="vinilos">Ploteados en Vinilos</option>
                  <option value="vehicular">Gráfica Vehicular</option>
                  <option value="imprenta">Imprenta Digital</option>
                  <option value="senalizacion">Señalética</option>
                  <option value="otros">Otro</option>
                </select>
              </div>
              <div>
                <label htmlFor="mensaje" className={labelClassName}>
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  required
                  rows={4}
                  className={inputClassName + " resize-none"}
                  placeholder="Contanos tu proyecto..."
                />
              </div>
              <div>
                <label htmlFor="imagen" className={labelClassName}>
                  Adjuntar imagen (opcional)
                </label>
                <input
                  type="file"
                  id="imagen"
                  name="imagen"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                  className="w-full cursor-pointer text-sm text-zinc-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-700 hover:file:bg-zinc-200"
                />
                <p className="mt-1 text-xs text-zinc-400">
                  Máx. 5MB — JPG, PNG, WebP o GIF
                </p>
              </div>
              {formError && (
                <div
                  role="alert"
                  className="rounded-xl border border-brand-red-500/30 bg-brand-red-500/10 px-4 py-3 text-sm font-medium text-brand-red-600"
                >
                  {formError}
                </div>
              )}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar mensaje"}
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
