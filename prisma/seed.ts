import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/password";

const categories = [
  { name: "Todos", slug: "todos", order: 0 },
  { name: "Cartelería", slug: "carteleria", order: 1 },
  { name: "Corpóreas", slug: "corpóreas", order: 2 },
  { name: "Vinilos", slug: "vinilos", order: 3 },
  { name: "Vehicular", slug: "vehicular", order: 4 },
  { name: "Imprenta", slug: "imprenta", order: 5 },
  { name: "Señalética", slug: "senalizacion", order: 6 },
];

// Imágenes reales (fotos propias) para el arranque de una base nueva.
// En una base existente el seed NUNCA actualiza: solo crea lo que falta.
const services = [
  {
    title: "Carteles y Letras Corpóreas",
    description:
      "Diseños personalizados en Polifan o PVC espumado para comercios, eventos y decoración.",
    image: "/images/servicios/carteles-letras-corporeas.webp",
    category: "carteles-letras",
    order: 1,
  },
  {
    title: "Cartelería Comercial",
    description: "Marquesinas, carteles con lona frontal, gigantografías y banners.",
    image: "/images/servicios/carteleria-comercial.webp",
    category: "carteleria-comercial",
    order: 2,
  },
  {
    title: "Ploteados en Vinilos y Esmerilados",
    description: "Vinilos de corte e impresión para vidrieras, paredes y automóviles.",
    image: "/images/servicios/vinilos-esmerilados.webp",
    category: "vinilos-esmerilados",
    order: 3,
  },
  {
    title: "Gráfica Vehicular Publicitaria",
    description: "Trabajos para convertir vehículos en soportes de publicidad móvil.",
    image: "/images/servicios/grafica-vehicular.webp",
    category: "grafica-vehicular",
    order: 4,
  },
  {
    title: "Servicio de Imprenta Digital",
    description: "Stickers troquelados, tarjetas, folletos, carteles y cortes láser.",
    image: "/images/servicios/imprenta-digital.webp",
    category: "imprenta-digital",
    order: 5,
  },
  {
    title: "Señalética",
    description:
      "Señalización de seguridad e información para plantas, hospitales y espacios públicos.",
    image: "/images/servicios/senal-etica.webp",
    category: "senalizacion",
    order: 6,
  },
];

const portfolioItems = [
  { title: "Cartelería Comercial", image: "/images/trabajos/carteleria-comercial.webp", category: "carteleria", order: 1 },
  { title: "Letras Corpóreas", image: "/images/trabajos/letras-corporeas.webp", category: "corpóreas", order: 2 },
  { title: "Vinilos y Esmerilados", image: "/images/trabajos/vinilos-esmerilados.webp", category: "vinilos", order: 3 },
  { title: "Gráfica Vehicular", image: "/images/trabajos/grafica-vehicular.webp", category: "vehicular", order: 4 },
  { title: "Imprenta Digital", image: "/images/portfolio/portfolio-referencia-05.webp", category: "imprenta", order: 5 },
  { title: "Señalética", image: "/images/trabajos/senal-etica.webp", category: "senalizacion", order: 6 },
  { title: "Marquesinas", image: "/images/trabajos/marquesinas.webp", category: "carteleria", order: 7 },
  { title: "Diseño Editorial", image: "/images/portfolio/portfolio-referencia-08.webp", category: "imprenta", order: 8 },
  { title: "Banners", image: "/images/trabajos/banners.webp", category: "carteleria", order: 9 },
  { title: "Vinilo Automotriz", image: "/images/portfolio/portfolio-referencia-10.webp", category: "vinilos", order: 10 },
  { title: "Seguridad Industrial", image: "/images/portfolio/portfolio-referencia-11.webp", category: "senalizacion", order: 11 },
  { title: "Eventos", image: "/images/portfolio/portfolio-referencia-12.webp", category: "corpóreas", order: 12 },
];

const siteSettings = {
  id: "default",
  title: "Ideas Móviles",
  description: "Cartelería y comunicación visual profesional.",
  whatsapp: "+54 291 454 3333",
  phone: "+54 291 454 3333",
  email: "ideasmoviles@gmail.com",
  instagram: "@IDEASMOVILES",
  facebook: "IDEASMOVILES",
  address: "Dirección pendiente de confirmar",
  heroTitle: "IDEASMÓVILES",
  heroSubtitle: "Cartelería y comunicación visual profesional",
  heroText:
    "Diseño y producción de cartelería, señalética, vinilos y gráfica publicitaria. Convertimos tu idea en impacto visual.",
  heroButtonText: "Cotizar ahora",
  heroButtonLink: "/contacto",
};

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@ideas-moviles.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "IdeasMoviles2026";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "admin" },
    create: {
      email: adminEmail,
      name: "Administrador",
      passwordHash: hashPassword(adminPassword),
      role: "admin",
    },
  });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: { ...category, published: true },
    });
  }

  let createdServices = 0;
  for (const service of services) {
    const existing = await prisma.service.findFirst({ where: { title: service.title } });
    if (!existing) {
      await prisma.service.create({ data: { ...service, published: true } });
      createdServices += 1;
    }
  }

  let createdItems = 0;
  for (const item of portfolioItems) {
    const existing = await prisma.portfolioItem.findFirst({ where: { title: item.title } });
    if (!existing) {
      await prisma.portfolioItem.create({ data: { ...item, published: true } });
      createdItems += 1;
    }
  }

  const settingsExist = await prisma.siteSettings.findUnique({ where: { id: siteSettings.id } });
  if (!settingsExist) {
    await prisma.siteSettings.create({ data: siteSettings });
  }

  console.log(
    `Seed completado: admin=${adminEmail}, servicios creados=${createdServices}, trabajos creados=${createdItems}. ` +
      `Los registros existentes no se modifican.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
