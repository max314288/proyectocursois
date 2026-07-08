import type { Metadata } from "next";
import AuthInterceptor from "@/components/AuthInterceptor";
import "./globals.css";

export const metadata: Metadata = {
  title: "Admin — Comida al Paso",
  description: "Panel de administración",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <AuthInterceptor />
      </body>
    </html>
  );
}
