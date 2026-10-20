"use client";

import { useMemo, useState } from "react";
import { useDemo } from "@/lib/demo-store";
import { EJEMPLOS_PUBLICOS } from "@/lib/ejemplos-publicos";
import { EMPRESA, fechaVisible } from "@/lib/modelo";

/** La biblioteca real es pública. Acá se ven papeles reales y lo que apruebes en la demo. */
export default function Biblioteca() {
  const { state, listo } = useDemo();
  const [empresa, setEmpresa] = useState("");
  const [pm, setPm] = useState("");
  const [nombre, setNombre] = useState("");

  const propios = useMemo(
    () =>
      state.tramites
        .filter((tramite) => tramite.estado === "aprobado")
        .map((tramite) => ({
          tramite: tramite.tipo,
          fecha: fechaVisible(tramite.fecha),
          empresa: EMPRESA.razonSocial,
          nombre: tramite.declaracion.nombre || "sin nombre",
          pm: tramite.declaracion.numeroPm || "sin PM",
          expediente: tramite.expediente,
        })),
    [state.tramites],
  );

  const contiene = (valor: string, filtro: string) =>
    valor.toLowerCase().includes(filtro.trim().toLowerCase());

  const ejemplos = EJEMPLOS_PUBLICOS.filter(
    (fila) => contiene(fila.empresa, empresa) && contiene(fila.pm, pm) && contiene(fila.nombre, nombre),
  );

  return (
    <article>
      <h1 className="font-serif text-4xl">La biblioteca pública</h1>
      <p className="mt-3 max-w-3xl leading-7 text-muted">
        Cualquiera mira los productos ya aprobados, sin usuario. La lista de abajo son cuatro trámites reales,
        buscados el 20 de octubre de 2026 con la palabra «Andador». El enlace abre el PDF en el sitio de ANMAT.
      </p>

      <div className="mt-6 grid gap-3 border border-line bg-white p-4 sm:grid-cols-3">
        <label className="text-sm">
          Empresa
          <input className="mt-1" value={empresa} onChange={(evento) => setEmpresa(evento.target.value)} />
        </label>
        <label className="text-sm">
          PM
          <input className="mt-1" value={pm} onChange={(evento) => setPm(evento.target.value)} />
        </label>
        <label className="text-sm">
          Nombre
          <input className="mt-1" value={nombre} onChange={(evento) => setNombre(evento.target.value)} />
        </label>
      </div>

      <h2 className="mt-8 font-serif text-2xl">Papeles reales</h2>
      <ul className="mt-3 space-y-3">
        {ejemplos.map((fila) => (
          <li key={fila.expediente} className="border border-line bg-white p-4 text-sm leading-6">
            <p className="font-medium">
              {fila.nombre} · PM {fila.pm}
            </p>
            <p className="text-muted">
              {fila.tramite} · {fila.fecha} · {fila.empresa}
            </p>
            <p className="text-muted">
              Marca {fila.marca} · expediente {fila.expediente}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a className="btn" href={fila.pdf} target="_blank" rel="noreferrer">
                Abrir el PDF en ANMAT
              </a>
              {fila.qr ? (
                <a className="btn-sec" href={fila.qr} target="_blank" rel="noreferrer">
                  Abrir lo que dice el QR
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
      {ejemplos.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Ningún ejemplo público coincide con ese filtro.</p>
      ) : null}

      <div className="mt-4 max-w-3xl space-y-3 text-sm leading-6 text-muted">
        <p>
          El PDF de un clase I o II se llama declaración de conformidad. En la última hoja dice que solo vale
          si el código QR se puede verificar. El QR del andador de Droguería Dimec apunta a una página de
          Helena: si el código es el verdadero, ANMAT devuelve ese mismo PDF. Si el código está mal, la página
          dice «No se encuentra el trámite seleccionado».
        </p>
        <p>
          En la grilla real hay otra columna, Disposición. En los clase III y IV esa columna suele ser el
          archivo, y la de la declaración viene vacía, porque ahí ANMAT dicta una resolución. Abrí uno de esos
          archivos y era el proyecto de rótulo, no la resolución. Por eso esta lista se queda en clase I y II,
          donde el PDF sí es el papel de aprobación.
        </p>
      </div>

      <h2 className="mt-10 font-serif text-2xl">Lo que apruebes en esta demo</h2>
      <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
        Estos renglones viven solo en tu navegador. El expediente corto, 00000001, es de la demo. El público
        es el largo, como los de arriba.
      </p>
      {!listo ? <p className="mt-4 text-sm text-muted">Cargando…</p> : null}
      {propios.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Todavía no aprobaste ningún trámite en el mostrador.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {propios.map((fila) => (
            <li key={`${fila.pm}-${fila.nombre}`} className="border border-line bg-white p-4 text-sm leading-6">
              <p className="font-medium">
                {fila.nombre} · PM {fila.pm}
                <span className="ml-2 bg-okbg px-1.5 py-0.5 text-[11px] text-ok">de esta demo</span>
              </p>
              <p className="text-muted">
                {fila.tramite} · {fila.fecha} · {fila.empresa} · expediente {fila.expediente}
              </p>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
