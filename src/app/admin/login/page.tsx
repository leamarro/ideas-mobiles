"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nextPath = searchParams.get("next") || "/admin/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "No se pudo iniciar sesión");
        setLoading(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-display font-semibold text-brand-black mb-2 uppercase"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-brand-grey-50 border-2 border-brand-grey-200 rounded text-brand-black placeholder-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:border-brand-red-500"
          placeholder="admin@ideas-moviles.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-display font-semibold text-brand-black mb-2 uppercase"
        >
          Contraseña
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-brand-grey-50 border-2 border-brand-grey-200 rounded text-brand-black placeholder-brand-grey-400 focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:border-brand-red-500"
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="text-brand-red-500 text-sm font-medium" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-brand-black hover:bg-brand-dark text-white font-display font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:ring-offset-2 focus:ring-offset-white uppercase disabled:opacity-60"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Ingresando...
          </span>
        ) : (
          "Ingresar"
        )}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg border-2 border-brand-grey-200 p-8">
        <h1 className="font-display font-bold text-2xl mb-6 text-center text-brand-black uppercase">
          Iniciar Sesión
        </h1>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
        <p className="text-brand-dark text-xs text-center mt-4">
          Panel de administración de Ideas Móviles.
        </p>
      </div>
    </div>
  );
}
