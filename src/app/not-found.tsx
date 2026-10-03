export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-display font-bold text-6xl text-brand-red-500 mb-4">
          404
        </h1>
        <p className="text-brand-dark text-xl mb-8">
          Página no encontrada
        </p>
        <a
          href="/"
          className="inline-block bg-brand-black hover:bg-brand-dark text-white font-display font-semibold px-8 py-4 rounded-lg transition-colors uppercase"
        >
          Volver al inicio
        </a>
      </div>
    </main>
  );
}
