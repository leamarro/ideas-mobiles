"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { CONTACT_PLACEHOLDERS } from "@/lib/constants";

export function WhatsAppButton({ whatsapp = CONTACT_PLACEHOLDERS.whatsapp }: { whatsapp?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappNumber = whatsapp.replace(/\D/g, "");
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola, quisiera consultar sobre nuestros servicios.")}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-white ${
        isVisible
          ? "animate-pulse-ring opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 pointer-events-none"
      }`}
      aria-label="Contactar por WhatsApp"
      title="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
