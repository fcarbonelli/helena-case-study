import type { Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import { Barra } from "@/components/Barra";
import { Proveedor } from "@/lib/demo-store";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const serif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Demo Helena",
    template: "%s · Demo Helena",
  },
  description:
    "Simulador de estudio del sistema Helena de ANMAT. Recorre el trámite documentado y marca lo que todavía no sabemos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geist.variable} ${serif.variable} antialiased`}>
        <Proveedor>
          <Barra />
          <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        </Proveedor>
      </body>
    </html>
  );
}
