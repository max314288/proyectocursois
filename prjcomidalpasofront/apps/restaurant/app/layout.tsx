import type { Metadata } from "next";
import AuthInterceptor from "@/components/AuthInterceptor";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cocina — Comida al Paso",
  description: "Vista de cocina y pedidos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[var(--color-surface)] text-[var(--color-on-surface)]">
        {children}
        <AuthInterceptor />
      </body>
    </html>
  );
}
