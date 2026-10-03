import { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { AdminNav } from "./nav";

export const metadata: Metadata = {
  title: "Admin | Ideas Móviles",
  description: "Panel de administración de Ideas Móviles.",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-brand-grey-50">
      <nav className="bg-brand-black border-b border-brand-grey-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap items-center justify-between gap-3">
          <Link
            href={session ? "/admin/dashboard" : "/admin/login"}
            className="text-white font-display font-bold"
          >
            IDEAS<span className="text-brand-red-500">MÓVILES</span> Admin
          </Link>

          {session ? (
            <AdminNav user={{ name: session.name, email: session.email }} />
          ) : (
            <a
              href="/"
              className="text-brand-grey-500 hover:text-brand-black transition-colors text-sm"
            >
              ← Volver al sitio
            </a>
          )}
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}
