"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/servicios", label: "Servicios" },
  { href: "/admin/trabajos", label: "Trabajos" },
  { href: "/admin/mensajes", label: "Mensajes" },
  { href: "/admin/contacto", label: "Contacto" },
  { href: "/admin/config", label: "Configuración" },
];

interface AdminNavProps {
  user: { name: string; email: string };
}

export function AdminNav({ user }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded px-3 py-2 text-xs font-display font-semibold uppercase transition-colors",
            pathname.startsWith(link.href)
              ? "bg-brand-red-500 text-white"
              : "text-brand-grey-500 hover:bg-white/10 hover:text-white"
          )}
        >
          {link.label}
        </Link>
      ))}

      <div className="ml-4 flex items-center gap-3 border-l border-white/10 pl-4">
        <span className="hidden text-xs text-brand-grey-500 sm:block">{user.email}</span>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded bg-white/10 px-3 py-2 text-xs font-display font-semibold uppercase text-white transition-colors hover:bg-brand-red-500"
        >
          <LogOut className="h-3.5 w-3.5" />
          Salir
        </button>
      </div>
    </div>
  );
}
