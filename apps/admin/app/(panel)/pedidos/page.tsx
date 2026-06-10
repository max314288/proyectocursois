export default function PedidosAdminPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Pedidos</h1>
        <p className="text-[var(--color-muted)] mt-1">Historial y seguimiento</p>
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <p className="text-sm text-[var(--color-muted)]">
          Conecta el backend para ver el historial de pedidos.
        </p>
      </div>
    </div>
  );
}
