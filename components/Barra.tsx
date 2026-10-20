"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemo } from "@/lib/demo-store";

const LINKS = [
  { href: "/", label: "La historia" },
  { href: "/recorrido", label: "El mostrador" },
  { href: "/biblioteca", label: "Biblioteca" },
  { href: "/faltantes", label: "Qué falta" },
];

/** Navegación del sitio de estudio, separada de la pantalla que imita a Helena. */
export function Barra() {
  const pathname = usePathname();
  const { reiniciar } = useDemo();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
        <p className="font-serif text-lg text-ink">Helena, en criollo</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {LINKS.map((link) => {
            const activo = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={activo ? "site-link is-on" : "site-link"}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button type="button" className="btn-sec ml-auto text-sm" onClick={reiniciar}>
          Empezar de cero
        </button>
      </div>
    </header>
  );
}
