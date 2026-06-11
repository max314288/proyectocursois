export default function ConfiguracionPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Configuración</h1>
        <p className="text-[var(--color-muted)] mt-1">Datos del negocio y preferencias</p>
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <p className="text-sm text-[var(--color-muted)]">
          Conecta el backend para gestionar la configuración del restaurante.
        </p>
      </div>
    </div>
  );
}
