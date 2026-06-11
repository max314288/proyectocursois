import { ShoppingBag, UtensilsCrossed, BookOpen, TrendingUp } from "lucide-react";

const stats = [
  { label: "Pedidos hoy",    value: "—", icon: ShoppingBag,    color: "#823b18" },
  { label: "Productos",      value: "—", icon: UtensilsCrossed,color: "#54651e" },
  { label: "Menús activos",  value: "—", icon: BookOpen,        color: "#b45309" },
  { label: "Ingresos hoy",   value: "—", icon: TrendingUp,      color: "#0369a1" },
];

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Dashboard</h1>
        <p className="text-[var(--color-muted)] mt-1">Resumen del día</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm"
          >
            <div
              className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: color + "18" }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <p className="text-2xl font-bold text-[var(--color-on-surface)]">{value}</p>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold text-[var(--color-on-surface)] mb-2">Actividad reciente</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Conecta el backend para ver pedidos y actividad en tiempo real.
        </p>
      </div>
    </div>
  );
}
