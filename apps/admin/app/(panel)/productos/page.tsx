import { Plus } from "lucide-react";

export default function ProductosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Productos</h1>
          <p className="text-[var(--color-muted)] mt-1">Gestiona el catálogo</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-light)] transition-colors">
          <Plus size={16} />
          Nuevo producto
        </button>
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <p className="text-sm text-[var(--color-muted)]">
          Conecta el backend para listar y gestionar productos.
        </p>
      </div>
    </div>
  );
}
