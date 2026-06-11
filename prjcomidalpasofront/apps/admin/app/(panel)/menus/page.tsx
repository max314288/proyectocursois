import { Plus } from "lucide-react";

export default function MenusPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Menús del día</h1>
          <p className="text-[var(--color-muted)] mt-1">Crea y publica los menús diarios</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-light)] transition-colors">
          <Plus size={16} />
          Nuevo menú
        </button>
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <p className="text-sm text-[var(--color-muted)]">
          Conecta el backend para gestionar los menús del día.
        </p>
      </div>
    </div>
  );
}
