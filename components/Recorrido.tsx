"use client";

import { useState, type ReactNode } from "react";
import { useDemo } from "@/lib/demo-store";
import {
  EMPRESA,
  ESTADOS,
  etiquetaEstado,
  fechaVisible,
  nombrePdf,
  puedeEditar,
  textoPdf,
  tramiteActivo,
  type Paso,
  type Tramite,
} from "@/lib/modelo";

type Nivel = "sabemos" | "suponemos" | "falta";

const SELLO: Record<Nivel, string> = {
  sabemos: "Lo sabemos",
  suponemos: "Lo suponemos",
  falta: "Nos falta",
};

const SELLO_CLASE: Record<Nivel, string> = {
  sabemos: "bg-okbg text-ok",
  suponemos: "bg-midbg text-mid",
  falta: "bg-badbg text-bad",
};

/** Baja un texto con el nombre que Helena le pondría al PDF. */
function descargar(nombre: string, contenido: string) {
  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}

function sello(nivel: Nivel) {
  return (
    <span className={`mr-2 inline-block px-1.5 py-0.5 text-[11px] ${SELLO_CLASE[nivel]}`}>
      {SELLO[nivel]}
    </span>
  );
}

function Marco({
  titulo,
  bajada,
  notas,
  extra,
  children,
}: {
  titulo: string;
  bajada: string;
  notas: { nivel: Nivel; texto: string }[];
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      {children}
      <aside className="border border-line bg-white p-4 lg:sticky lg:top-20">
        <h2 className="font-serif text-2xl leading-tight">{titulo}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{bajada}</p>
        <ul className="mt-4 space-y-3 text-sm leading-6">
          {notas.map((nota) => (
            <li key={nota.texto}>
              {sello(nota.nivel)}
              {nota.texto}
            </li>
          ))}
        </ul>
        {extra}
      </aside>
    </div>
  );
}

function pestana(activa: boolean) {
  return activa ? "btn-text is-on" : "btn-text";
}

function Pantalla({ titulo, children }: { titulo: string; children: ReactNode }) {
  const { ir, salir, state, abrirDocumentacion } = useDemo();
  const paso = state.paso;
  return (
    <section className="min-w-0 overflow-hidden border border-line bg-white">
      <header className="bg-header px-4 py-3 text-white">
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/60">Pantalla simulada</p>
        {state.logueado ? (
          <>
            <p className="mt-1 text-sm text-white/80">
              Sesión de {EMPRESA.razonSocial} · CUIT {EMPRESA.cuitVisible}
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
              <button
                type="button"
                className={pestana(["recibo", "arranque", "resumen", "sin-arancel"].includes(paso))}
                onClick={() => ir("recibo")}
              >
                Inicio
              </button>
              <button
                type="button"
                className={pestana(paso === "mis-datos")}
                onClick={() => ir("mis-datos")}
              >
                Mis datos
              </button>
              <button
                type="button"
                className={pestana(["tramites", "formulario", "declaracion", "enviar"].includes(paso))}
                onClick={() => ir("tramites")}
              >
                Mis trámites
              </button>
              <button
                type="button"
                className={pestana(paso === "documentacion")}
                onClick={() => abrirDocumentacion(state.activoId)}
              >
                Documentación
              </button>
              <button type="button" className="btn-text ml-auto" onClick={salir}>
                Salir
              </button>
            </div>
          </>
        ) : null}
      </header>
      <div className="border-b border-line bg-[#f7f5f1] px-4 py-2 text-sm font-medium">{titulo}</div>
      <div className="space-y-4 p-4">{children}</div>
    </section>
  );
}

function Cartel({ texto, tono = "error" }: { texto: string; tono?: "error" | "ok" | "aviso" }) {
  const clase =
    tono === "ok" ? "bg-okbg text-ok" : tono === "aviso" ? "bg-midbg text-mid" : "bg-badbg text-bad";
  return <p className={`px-3 py-2 text-sm leading-6 ${clase}`}>{texto}</p>;
}

function Campo({
  label,
  value,
  onChange,
  ayuda,
}: {
  label: string;
  value: string;
  onChange: (valor: string) => void;
  ayuda?: string;
}) {
  return (
    <label className="grid gap-1 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center sm:gap-3">
      <span className="text-sm text-muted">
        {label}
        {ayuda ? (
          <span
            title={ayuda}
            className="ml-1 inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-ok text-[10px] text-white"
          >
            ?
          </span>
        ) : null}
      </span>
      <input value={value} onChange={(evento) => onChange(evento.target.value)} />
    </label>
  );
}

function Login() {
  const { entrar } = useDemo();
  const [usuario, setUsuario] = useState("demo");
  const [clave, setClave] = useState("demo");
  const [cartel, setCartel] = useState<string | null>(null);

  return (
    <Marco
      titulo="Entrás con el usuario de pagos"
      bajada="Helena no te crea una cuenta nueva. Usa la misma identidad con la que la empresa le paga trámites a ANMAT."
      notas={[
        {
          nivel: "sabemos",
          texto: "El manual dice: usuario y clave de pago electrónico. De ahí salen la razón social y el CUIT.",
        },
        {
          nivel: "sabemos",
          texto: "Las dos personas que después firman (el representante legal y el director técnico) necesitan firma digital. Eso se tramita aparte.",
        },
        {
          nivel: "falta",
          texto: "No tenemos un usuario real. Acá entra cualquiera. Dejé demo / demo.",
        },
      ]}
    >
      <Pantalla titulo="Ingresar">
        {cartel ? <Cartel texto={cartel} /> : null}
        <label className="block text-sm">
          Usuario
          <input className="mt-1" value={usuario} onChange={(evento) => setUsuario(evento.target.value)} />
        </label>
        <label className="block text-sm">
          Clave
          <input
            className="mt-1"
            type="password"
            value={clave}
            onChange={(evento) => setClave(evento.target.value)}
          />
        </label>
        <button
          type="button"
          className="btn"
          onClick={() => setCartel(entrar(usuario, clave))}
        >
          Entrar
        </button>
        <p className="text-sm leading-6 text-muted">
          Al entrar, Helena ya sabe qué empresa sos. El paso que sigue pide el número del recibo: el ticket
          del pago que hiciste antes, en Pago electrónico. En esta demo el usuario es demo y la clave es demo.
        </p>
      </Pantalla>
    </Marco>
  );
}

function Recibo() {
  const { state, setReciboTipeado, validar, ir } = useDemo();
  const [cartel, setCartel] = useState<string | null>(null);
  const pruebas = [
    { numero: "1001", texto: "1001 · nacional, clase I o II. Es el camino de la demo." },
    { numero: "1002", texto: "1002 · importado, clase I o II." },
    { numero: "1003", texto: "1003 · ya se usó." },
    { numero: "1004", texto: "1004 · vencido." },
    { numero: "1005", texto: "1005 · clase III o IV. Existe, y esta demo no tiene esa pantalla." },
  ];

  return (
    <Marco
      titulo="El recibo dice qué puerta pagaste"
      bajada="No es un número de la empresa. Es el ticket de un pago ya hecho en Pago electrónico. Al pagar elegiste un código: por ejemplo, registrar un producto nacional de clase I o II."
      notas={[
        {
          nivel: "sabemos",
          texto: "Helena solo abre la puerta que dice el recibo. Uno de clase I o II no abre un clase IV. Tiene que estar pago, sin usar y sin vencer.",
        },
        {
          nivel: "sabemos",
          texto: "Más adelante, adentro del formulario, hay otro combo de clase. Ese no vuelve a cobrar: dice si este producto, dentro del grupo que ya pagaste, es I o II.",
        },
        {
          nivel: "sabemos",
          texto: "Reválida y la autorización de un análisis de poca cantidad no llevan este recibo. Esos caminos están en el botón de abajo, sin pantalla propia.",
        },
        {
          nivel: "falta",
          texto: "No conocemos la lista real de códigos de pago ni qué contesta el botón Validar contra ANMAT. Los números 1001 a 1005 son de esta demo.",
        },
      ]}
    >
      <Pantalla titulo="Ingresá el recibo">
        {cartel ? <Cartel texto={cartel} /> : null}
        <p className="text-sm leading-6">
          En Pago electrónico pagás un trámite concreto, no «entrar a Helena». El banco te deja un número de
          recibo. Ese número ya trae la decisión: alta, cambio o renovación; nacional o importado; y el grupo
          de riesgo, por ejemplo clase I-II.
        </p>
        <label className="block text-sm">
          Número de recibo
          <input
            className="mt-1"
            value={state.reciboTipeado}
            onChange={(evento) => setReciboTipeado(evento.target.value)}
          />
        </label>
        <p className="text-sm text-muted">Dejé 1001 escrito para que puedas validar y seguir. Los otros sirven para ver un rechazo.</p>
        <div className="flex flex-col items-start gap-2">
          {pruebas.map((prueba) => (
            <button
              key={prueba.numero}
              type="button"
              className={state.reciboTipeado === prueba.numero ? "btn" : "btn-sec"}
              onClick={() => {
                setReciboTipeado(prueba.numero);
                setCartel(null);
              }}
            >
              {prueba.texto}
            </button>
          ))}
        </div>
        <button type="button" className="btn" onClick={() => setCartel(validar())}>
          Validar recibo
        </button>
        <div className="border-t border-line pt-4">
          <p className="text-sm text-muted">Si el trámite no se paga, el manual muestra otro botón.</p>
          <button type="button" className="btn mt-2" onClick={() => ir("sin-arancel")}>
            Ingresar sin recibo
          </button>
        </div>
      </Pantalla>
    </Marco>
  );
}

function SinArancel() {
  const { ir } = useDemo();
  return (
    <Marco
      titulo="Hay trámites que no se pagan así"
      bajada="El manual nombra dos. No tenemos ni una foto de sus formularios, así que la demo se detiene acá a propósito."
      notas={[
        {
          nivel: "sabemos",
          texto: "Reválida: cada 5 años hay que renovar el permiso del producto. Si la pedís a tiempo, el permiso sigue mientras ANMAT mira. Si se vence, el producto se da de baja.",
        },
        {
          nivel: "sabemos",
          texto: "Aunque la reválida no lleve este recibo, piden un papel de que la empresa no debe la cuota de mantenimiento.",
        },
        {
          nivel: "sabemos",
          texto: "El otro camino es pedir autorización para traer, en poca cantidad, un análisis de laboratorio que todavía no está registrado. Sirve para investigación o un caso excepcional, no para venderlo.",
        },
        {
          nivel: "falta",
          texto: "Campos, botones y plazos de esas dos pantallas.",
        },
      ]}
    >
      <Pantalla titulo="Trámite sin recibo">
        <p className="text-sm leading-6">
          En Helena real, este botón abre la reválida o la autorización de un producto de diagnóstico de baja
          importación. Acá no inventamos ese formulario.
        </p>
        <button type="button" className="btn-sec" onClick={() => ir("recibo")}>
          Volver al recibo
        </button>
      </Pantalla>
    </Marco>
  );
}

function Arranque() {
  const { state, setEmailArranque, setCaptcha, comenzar, ir } = useDemo();
  const [cartel, setCartel] = useState<string | null>(null);
  const recibo = state.reciboValidado;

  return (
    <Marco
      titulo="Helena ya sabe qué pagaste"
      bajada="Confirmás el trámite, dejás un mail y pasás el captcha. El PDF que se genere después va a ese mail."
      notas={[
        {
          nivel: "sabemos",
          texto: "La ayuda verde del mail, en la foto, dice que ahí se envía el PDF del trámite.",
        },
        {
          nivel: "suponemos",
          texto: "Dejamos el combo trabado. El instructivo dice que el recibo solo habilita el trámite que pagaste. En la foto el combo se veía abierto.",
        },
        {
          nivel: "falta",
          texto: "El captcha real es el de Google o uno parecido. Acá es una casilla.",
        },
      ]}
    >
      <Pantalla titulo="Empezar la solicitud">
        {cartel ? <Cartel texto={cartel} /> : null}
        {!recibo ? (
          <button type="button" className="btn-sec" onClick={() => ir("recibo")}>
            Volvé a validar un recibo
          </button>
        ) : (
          <>
            <label className="grid gap-1 text-sm sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center">
              Trámite a realizar
              <input value={`${recibo.tipo} · ${recibo.origen}`} readOnly />
            </label>
            <Campo
              label="Email"
              value={state.emailArranque}
              onChange={setEmailArranque}
              ayuda="Ingrese su email para enviarle el PDF resultante de su trámite."
            />
            <p className="text-sm leading-6 text-muted">
              El mail y la casilla ya vienen listos para la demo. En Helena real el mail lo escribís vos y el
              captcha es el de Google.
            </p>
            <label className="flex items-center gap-2 text-sm">
              <input
                className="h-4 w-4"
                type="checkbox"
                checked={state.captcha}
                onChange={(evento) => setCaptcha(evento.target.checked)}
              />
              No soy un robot
            </label>
            <button type="button" className="btn" onClick={() => setCartel(comenzar())}>
              Comenzar
            </button>
          </>
        )}
      </Pantalla>
    </Marco>
  );
}

function Resumen() {
  const { state, continuarResumen, cancelarResumen } = useDemo();
  const recibo = state.reciboValidado;
  return (
    <Marco
      titulo="Último aviso antes de gastar el recibo"
      bajada="Si seguís, el recibo queda clavado a este trámite para siempre. Si cancelás, todavía no se gasta."
      notas={[
        {
          nivel: "sabemos",
          texto: "Al apretar Continuar nace el trámite en Borrador. Borrador significa que todavía no es un expediente: ANMAT no lo está mirando.",
        },
        {
          nivel: "sabemos",
          texto: "Para este registro hay dos papeles: el formulario y la declaración de conformidad. La declaración es el texto donde la empresa dice que el producto cumple las reglas.",
        },
        {
          nivel: "falta",
          texto: "Cada tipo de trámite tiene sus plantillas. De clase III y IV, de la renovación y de los análisis de laboratorio no vimos ninguna.",
        },
      ]}
    >
      <Pantalla titulo="Formularios a completar">
        <p className="text-sm">Trámite: {recibo ? `${recibo.tipo} (${recibo.origen})` : "sin recibo"}</p>
        <p className="bg-midbg px-3 py-2 text-sm text-mid">
          El formulario resultante se envía a {state.emailArranque || "el email cargado"}.
        </p>
        <ul className="list-disc pl-5 text-sm leading-7">
          <li>Formulario de registro, productos clase I-II</li>
          <li>Declaración de conformidad inicial, productos clase I-II</li>
        </ul>
        <p className="text-sm text-muted">
          Si los datos están bien, Continuar. Cancelar vuelve atrás y el recibo sigue libre.
        </p>
        <div className="flex gap-2">
          <button type="button" className="btn-sec" onClick={cancelarResumen}>
            Cancelar
          </button>
          <button type="button" className="btn" onClick={continuarResumen} disabled={!recibo}>
            Continuar
          </button>
        </div>
      </Pantalla>
    </Marco>
  );
}

function Filas({
  titulo,
  tabla,
}: {
  titulo: string;
  tabla: "rese" | "ensayos" | "laboratorios";
}) {
  const { state, setFila, addFila, removeFila } = useDemo();
  const activo = tramiteActivo(state);
  if (!activo) return null;
  const filas = activo.declaracion[tabla];
  return (
    <fieldset className="space-y-2 border border-line p-3">
      <legend className="px-1 text-sm">{titulo}</legend>
      {filas.map((fila, index) => (
        <div key={`${tabla}-${index}`} className="flex gap-2">
          <input
            value={fila.detalle}
            onChange={(evento) => setFila(tabla, index, evento.target.value)}
          />
          <button type="button" className="btn-sec" onClick={() => removeFila(tabla, index)}>
            Eliminar
          </button>
        </div>
      ))}
      <button type="button" className="btn-sec" onClick={() => addFila(tabla)}>
        Agregar fila
      </button>
    </fieldset>
  );
}

function FormularioPaso() {
  const { state, patchForm, seguirADeclaracion, ir } = useDemo();
  const [cartel, setCartel] = useState<string | null>(null);
  const activo = tramiteActivo(state);
  if (!activo) {
    return (
      <Pantalla titulo="Formulario">
        <button type="button" className="btn-sec" onClick={() => ir("tramites")}>
          Volver a mis trámites
        </button>
      </Pantalla>
    );
  }
  const f = activo.formulario;
  return (
    <Marco
      titulo="La ficha de quién presenta el producto"
      bajada="Pregunta quién es la empresa ante ANMAT y quién fabrica. En un importado, el fabricante suele ser la planta de afuera."
      notas={[
        {
          nivel: "sabemos",
          texto: "Estos campos se leen en la foto: actividad, legajo, razón social, dirección, teléfono, fax y email.",
        },
        {
          nivel: "sabemos",
          texto: "Si falta un obligatorio, no deja seguir y muestra un cartel. El fax vacío se guarda como «no aplica».",
        },
        {
          nivel: "suponemos",
          texto: "La foto mostraba «Fabricante» en el combo. Agregué «Importador» porque el sistema distingue origen. No vimos las otras opciones.",
        },
        {
          nivel: "suponemos",
          texto: "La lista de cuáles son obligatorios no está escrita. Marqué como obligatorios todos menos el fax.",
        },
      ]}
    >
      <Pantalla titulo={`Formulario de registro · trámite ${activo.id}`}>
        {cartel ? <Cartel texto={cartel} /> : null}
        <p className="bg-midbg px-3 py-2 text-sm leading-6 text-mid">
          Los campos ya vienen escritos para que puedas seguir sin tipear. Son datos de la demo. Los nombres
          de los campos son los que se leen en la foto del manual.
        </p>
        <p className="text-sm text-muted">Tipo de solicitud: {activo.tipo}</p>
        <label className="grid gap-1 text-sm sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center">
          Actividad
          <select value={f.actividad} onChange={(evento) => patchForm({ actividad: evento.target.value })}>
            <option>Fabricante</option>
            <option>Importador</option>
          </select>
        </label>
        <Campo label="Legajo ANMAT" value={f.legajo} onChange={(valor) => patchForm({ legajo: valor })} />
        <Campo label="Razón social" value={f.razonSocial} onChange={(valor) => patchForm({ razonSocial: valor })} />
        <Campo label="Dirección" value={f.direccion} onChange={(valor) => patchForm({ direccion: valor })} />
        <Campo label="Teléfono" value={f.telefono} onChange={(valor) => patchForm({ telefono: valor })} />
        <Campo label="Fax" value={f.fax} onChange={(valor) => patchForm({ fax: valor })} />
        <Campo label="Email" value={f.email} onChange={(valor) => patchForm({ email: valor })} />
        <button type="button" className="btn" onClick={() => setCartel(seguirADeclaracion())}>
          Continuar
        </button>
      </Pantalla>
    </Marco>
  );
}

function DeclaracionPaso() {
  const { state, patchDecl, cerrarFormularios } = useDemo();
  const [cartel, setCartel] = useState<string | null>(null);
  const activo = tramiteActivo(state);
  if (!activo) return null;
  const d = activo.declaracion;
  return (
    <Marco
      titulo="La declaración: qué producto es"
      bajada="Es el papel que describe el producto y donde la empresa jura que cumple las reglas de seguridad. ANMAT, si está de acuerdo, lo firma y eso queda como constancia."
      notas={[
        {
          nivel: "sabemos",
          texto: "Nombre, marca, código técnico UMDNS, modelos, composición, indicaciones, presentación, condición de venta, fabricante, lugares y número de PM se ven en la foto, aunque cortada.",
        },
        {
          nivel: "sabemos",
          texto: "Hay tres listas que se pueden agrandar: requisitos de seguridad, ensayos o riesgos, y laboratorios.",
        },
        {
          nivel: "suponemos",
          texto: "La condición de venta, por la norma, es una de tres: con receta, solo profesionales, o venta libre. No vimos las opciones del combo.",
        },
        {
          nivel: "falta",
          texto: "El número de PM lo propone la empresa con su legajo más un número de producto. No conocemos el control que hace Helena para que no se repita.",
        },
      ]}
    >
      <Pantalla titulo={`Declaración de conformidad · trámite ${activo.id}`}>
        {cartel ? <Cartel texto={cartel} /> : null}
        <p className="bg-midbg px-3 py-2 text-sm leading-6 text-mid">
          También está precargada: un andador de clase I, PM 500-1. Podés cambiar cualquier campo. El código
          14-393 es el que usan declaraciones públicas de andadores. El resto del texto es de ejemplo.
        </p>
        <label className="grid gap-1 text-sm sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center">
          Clase de riesgo
          <select value={d.clase} onChange={(evento) => patchDecl({ clase: evento.target.value })}>
            <option>Clase I</option>
            <option>Clase II</option>
          </select>
        </label>
        <p className="text-sm leading-6 text-muted">
          El recibo ya eligió el grupo: clase I o II, nacional o importado. Este combo no vuelve a pagar.
          Dice cuál de las dos es este producto. Clase II, en la disposición, pide papeles de más. La demo no
          cambia la lista de archivos según esta elección.
        </p>
        <Campo label="Número de revisión" value={d.revision} onChange={(valor) => patchDecl({ revision: valor })} />
        <Campo label="Nombre descriptivo" value={d.nombre} onChange={(valor) => patchDecl({ nombre: valor })} />
        <Campo label="Código y nombre técnico" value={d.umdns} onChange={(valor) => patchDecl({ umdns: valor })} />
        <Campo label="Marca" value={d.marca} onChange={(valor) => patchDecl({ marca: valor })} />
        <Campo
          label="Modelos"
          value={d.modelos}
          onChange={(valor) => patchDecl({ modelos: valor })}
          ayuda="En la foto, este campo era para clase II y equipos. Si no aplica, dejalo vacío."
        />
        <Campo
          label="Composición"
          value={d.composicion}
          onChange={(valor) => patchDecl({ composicion: valor })}
          ayuda="Había un ícono de ayuda. El texto no se lee en la foto."
        />
        <Campo label="Indicaciones" value={d.indicaciones} onChange={(valor) => patchDecl({ indicaciones: valor })} />
        <Campo label="Forma de presentación" value={d.presentacion} onChange={(valor) => patchDecl({ presentacion: valor })} />
        <label className="grid gap-1 text-sm sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center">
          Condición de venta
          <select value={d.condicion} onChange={(evento) => patchDecl({ condicion: evento.target.value })}>
            <option value="">Elegir</option>
            <option>Venta bajo prescripción</option>
            <option>Uso exclusivo de profesionales e instituciones</option>
            <option>Venta libre</option>
          </select>
        </label>
        <Campo label="Fabricante" value={d.fabricante} onChange={(valor) => patchDecl({ fabricante: valor })} />
        <Campo label="Lugares de elaboración" value={d.lugares} onChange={(valor) => patchDecl({ lugares: valor })} />
        <Campo
          label="Número de PM"
          value={d.numeroPm}
          onChange={(valor) => patchDecl({ numeroPm: valor })}
          ayuda="Ejemplo de formato visto en la biblioteca: 129-232. La demo no valida la fórmula."
        />
        <Filas titulo="Requisitos de seguridad y eficacia" tabla="rese" />
        <Filas titulo="Ensayos, validación o gestión de riesgo" tabla="ensayos" />
        <Filas titulo="Laboratorios de protocolo" tabla="laboratorios" />
        <button type="button" className="btn" onClick={() => setCartel(cerrarFormularios())}>
          Continuar
        </button>
      </Pantalla>
    </Marco>
  );
}

function FilaTramite({ tramite }: { tramite: Tramite }) {
  const { modificar, abrirEnvio, abrirDocumentacion, state } = useDemo();
  const editable = puedeEditar(tramite.estado);
  const forName = nombrePdf("for", tramite.id, tramite.fecha);
  const dcName = nombrePdf("dc", tramite.id, tramite.fecha);
  const activo = state.activoId === tramite.id;

  return (
    <li className={`border border-line p-3 text-sm ${activo ? "bg-info" : ""}`}>
      <p className="font-medium">
        {tramite.id} · {tramite.tipo} · {etiquetaEstado(tramite.estado)}
      </p>
      <p className="mt-1 text-muted">
        {tramite.origen} · {fechaVisible(tramite.fecha)} · recibo {tramite.recibo} · expediente {tramite.expediente}
      </p>
      <p className="mt-1">Comentarios: {tramite.comentarios || "—"}</p>
      <div className="mt-2 flex flex-col items-start gap-1">
        {tramite.formulariosCerrados ? (
          <>
            <button type="button" className="underline" onClick={() => descargar(forName, textoPdf(tramite, "formulario"))}>
              {forName}
            </button>
            <button type="button" className="underline" onClick={() => descargar(dcName, textoPdf(tramite, "declaracion"))}>
              {dcName}
            </button>
          </>
        ) : (
          <p className="text-muted">Los PDF aparecen cuando se cierra la confección.</p>
        )}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn-sec" onClick={() => abrirDocumentacion(tramite.id)}>
          Agregar documentación
        </button>
        <button type="button" className="btn-sec" disabled={!editable} onClick={() => modificar(tramite.id)}>
          Modificar datos
        </button>
        <button type="button" className="btn" disabled={!editable} onClick={() => abrirEnvio(tramite.id)}>
          Procesar / enviar
        </button>
      </div>
    </li>
  );
}

function Tramites() {
  const { state, setFiltro, observar, aprobar, rechazar, anular } = useDemo();
  const [nota, setNota] = useState("Falta el certificado de buenas prácticas vigente.");
  const [cartel, setCartel] = useState<string | null>(null);
  const activo = tramiteActivo(state);
  const visibles = state.tramites.filter(
    (tramite) => state.filtroEstado === "todos" || tramite.estado === state.filtroEstado,
  );

  return (
    <Marco
      titulo="Tu bandeja. Borrador todavía no cuenta."
      bajada="Cuando los formularios cierran, el trámite espera acá. ANMAT empieza a contar los días recién cuando lo enviás firmado."
      notas={[
        {
          nivel: "sabemos",
          texto: "Los estados son Borrador, Enviado, En revisión, Aprobado, Rechazado y Anulado. Enviado no se edita.",
        },
        {
          nivel: "sabemos",
          texto: "Si ANMAT observa, pasa a En revisión, escribe un comentario y hay que corregir y enviar de nuevo, otra vez con los PDF firmados.",
        },
        {
          nivel: "sabemos",
          texto: "Para clase I-II el plazo de evaluación es de 15 días hábiles. Mientras contestás una observación, el reloj se pausa.",
        },
        {
          nivel: "falta",
          texto: "La pantalla del empleado de ANMAT no está en el manual. Los botones de observar, aprobar y rechazar son de esta demo.",
        },
      ]}
      extra={
        <div className="mt-4 space-y-2 border-t border-line pt-3">
          <p className="text-sm font-medium">Botones que en la realidad usa ANMAT</p>
          <textarea className="text-sm" rows={3} value={nota} onChange={(evento) => setNota(evento.target.value)} />
          {cartel ? <Cartel texto={cartel} /> : null}
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-sec" onClick={() => setCartel(observar(nota))}>
              Observar
            </button>
            <button type="button" className="btn-sec" onClick={() => setCartel(aprobar())}>
              Aprobar
            </button>
            <button type="button" className="btn-sec" onClick={() => setCartel(rechazar(nota))}>
              Rechazar
            </button>
            <button type="button" className="btn-sec" onClick={() => setCartel(anular())}>
              Desistir
            </button>
          </div>
          <p className="text-xs leading-5 text-muted">
            Desistir es un estado real (Anulado). El botón no aparece en las fotos: lo puse acá para que se vea que el trámite muere.
          </p>
          {activo ? (
            <ol className="mt-2 space-y-1 text-xs leading-5 text-muted">
              {activo.historial.map((hito) => (
                <li key={hito.cuando + hito.texto}>
                  {fechaVisible(hito.cuando)} · {hito.texto}
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      }
    >
      <Pantalla titulo="Mis trámites">
        {state.aviso ? <Cartel texto={state.aviso} tono="ok" /> : null}
        <div className="bg-midbg px-3 py-2 text-sm leading-6 text-mid">
          Los 15 días hábiles empiezan cuando el trámite pasa a Enviado. Antes de eso hace falta adjuntar la
          habilitación de la empresa y el certificado de buenas prácticas. Si el producto es importado, también el
          certificado del país de origen.
        </div>
        <label className="flex items-center gap-2 text-sm">
          Estado
          <select
            className="max-w-48"
            value={state.filtroEstado}
            onChange={(evento) => setFiltro(evento.target.value)}
          >
            {ESTADOS.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.label}
              </option>
            ))}
          </select>
        </label>
        {visibles.length === 0 ? (
          <p className="text-sm text-muted">Todavía no hay trámites en este filtro.</p>
        ) : (
          <ul className="space-y-3">
            {visibles.map((tramite) => (
              <FilaTramite key={tramite.id} tramite={tramite} />
            ))}
          </ul>
        )}
      </Pantalla>
    </Marco>
  );
}

function Documentacion() {
  const { state, agregarDoc, borrarDoc, ir } = useDemo();
  const [descripcion, setDescripcion] = useState("");
  const [archivo, setArchivo] = useState("");
  const [destino, setDestino] = useState(state.activoId ? String(state.activoId) : "sin");
  const [cartel, setCartel] = useState<string | null>(null);

  return (
    <Marco
      titulo="Los papeles que acompañan el formulario"
      bajada="Helena no alcanza con la ficha. Hay que subir la habilitación de la planta, las buenas prácticas y, si viene de afuera, los papeles del país de origen."
      notas={[
        {
          nivel: "sabemos",
          texto: "Cada archivo tiene descripción, a qué trámite pertenece y fecha. Si lo dejás «sin asignar», el evaluador lo ve en todos tus trámites. Eso es para papeles de la empresa, no del producto.",
        },
        {
          nivel: "sabemos",
          texto: "La ley pide que firme el director técnico y el representante legal. El login de Helena, además, pide rótulo e instrucciones de los clase III-IV en un solo archivo con firma de puño y letra.",
        },
        {
          nivel: "falta",
          texto: "No vimos una lista cerrada de tipos de archivo. La pantalla deja escribir cualquier descripción. La demo tampoco revisa si el PDF está firmado de verdad.",
        },
      ]}
    >
      <Pantalla titulo="Mi documentación complementaria">
        {cartel ? <Cartel texto={cartel} /> : null}
        <label className="block text-sm">
          Descripción
          <input className="mt-1" value={descripcion} onChange={(evento) => setDescripcion(evento.target.value)} />
        </label>
        <label className="block text-sm">
          Trámite asociado
          <select className="mt-1" value={destino} onChange={(evento) => setDestino(evento.target.value)}>
            <option value="sin">Sin asignar</option>
            {state.tramites.map((tramite) => (
              <option key={tramite.id} value={tramite.id}>
                {tramite.id} · {tramite.tipo}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Nombre del archivo
          <input
            className="mt-1"
            value={archivo}
            placeholder="habilitacion-empresa.pdf"
            onChange={(evento) => setArchivo(evento.target.value)}
          />
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => {
              const error = agregarDoc(descripcion, destino === "sin" ? null : Number(destino), archivo);
              setCartel(error);
              if (!error) {
                setDescripcion("");
                setArchivo("");
              }
            }}
          >
            Grabar
          </button>
          <button type="button" className="btn-sec" onClick={() => ir("tramites")}>
            Volver
          </button>
        </div>
        <ul className="divide-y divide-line text-sm">
          {state.documentos.map((doc) => (
            <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span>
                {doc.descripcion} · {doc.archivo}
                <span className="block text-xs text-muted">
                  {doc.tramiteId === null ? "Sin asignar, se ve en todos" : `Trámite ${doc.tramiteId}`} ·{" "}
                  {fechaVisible(doc.fecha)}
                </span>
              </span>
              <button type="button" className="btn-sec" onClick={() => borrarDoc(doc.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </Pantalla>
    </Marco>
  );
}

function Enviar() {
  const { state, setNombreEnvio, enviar, ir } = useDemo();
  const [cartel, setCartel] = useState<string | null>(null);
  const activo = tramiteActivo(state);
  if (!activo) return null;
  const forName = nombrePdf("for", activo.id, activo.fecha);
  const dcName = nombrePdf("dc", activo.id, activo.fecha);

  return (
    <Marco
      titulo="Se firma afuera y se vuelve a subir"
      bajada="Helena arma el PDF. Dos personas de la empresa lo firman con otro programa, el firmador de ANMAT. Después se sube acá, con el mismo nombre."
      notas={[
        {
          nivel: "sabemos",
          texto: "El manual lo dice en este orden: descargar los PDF, firmarlos en el firmador de ANMAT y volver a subirlos con el mismo nombre. Grabar recién ahí pasa el trámite a Enviado.",
        },
        {
          nivel: "sabemos",
          texto: "El programa se puede bajar sin usuario de Helena. Para firmar hace falta el certificado de una persona, guardado en un token USB. El ingreso de Helena pide el firmador 2.0. La página de firma de 2025 indica XolidoSign.",
        },
        {
          nivel: "sabemos",
          texto: "Si bajás el archivo dos veces, el navegador le agrega (1). Para Helena eso es otro archivo y no lo acepta.",
        },
        {
          nivel: "falta",
          texto: "No abrimos el firmador, así que no vimos sus pantallas. Tampoco sabemos si Helena revisa que firmaron las dos personas o si solo mira el nombre. Esta demo solo compara el nombre.",
        },
      ]}
      extra={
        <div className="mt-4 space-y-2 border-t border-line pt-3">
          <p className="text-sm font-medium">Atajos para no salir de la demo</p>
          <p className="text-sm leading-6 text-muted">
            Estos botones no firman. Escriben en los casilleros el nombre del archivo, que es lo único que esta
            pantalla controla.
          </p>
          <button
            type="button"
            className="btn-sec w-full"
            onClick={() => {
              setNombreEnvio("formulario", forName);
              setNombreEnvio("declaracion", dcName);
            }}
          >
            Escribir los nombres, como si ya estuvieran firmados
          </button>
          <button
            type="button"
            className="btn-sec w-full"
            onClick={() => {
              setNombreEnvio("formulario", forName.replace(".pdf", " (1).pdf"));
              setNombreEnvio("declaracion", dcName);
            }}
          >
            Escribir un nombre con (1), para ver el rechazo
          </button>
        </div>
      }
    >
      <Pantalla titulo="Procesar / enviar trámite">
        {cartel ? <Cartel texto={cartel} /> : null}
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-6">
          <li>Helena ya armó dos PDF. Se descargan desde acá.</li>
          <li>
            Se firman afuera, en el firmador de ANMAT. Lo hacen el representante legal y el director técnico,
            cada uno con su certificado digital.
          </li>
          <li>Se vuelven a subir con el mismo nombre. Esta demo no recibe archivos: solo anota ese nombre.</li>
          <li>Grabar los presenta. El estado pasa a Enviado y empiezan a correr los días.</li>
        </ol>
        <p className="text-sm leading-6">
          El programa es público y no pide la clave de Helena. Lo que no es público es el certificado: lo tiene
          el representante legal o el director técnico, en un pendrive criptográfico, a su nombre. Sin eso el
          firmador abre y no puede sellar el PDF. Por eso esta demo no lo ejecuta.
        </p>
        <div className="flex flex-wrap gap-2 text-sm">
          <a className="btn-sec" href="https://www.argentina.gob.ar/anmat/firmadigital" target="_blank" rel="noreferrer">
            Qué es la firma digital
          </a>
          <a
            className="btn-sec"
            href="https://www.argentina.gob.ar/anmat/regulados/requisitos-nuevos-de-firma-digital-ar-anmat-2025"
            target="_blank"
            rel="noreferrer"
          >
            Cómo se pide el certificado
          </a>
          <a className="btn-sec" href="https://portal.anmat.gob.ar/firma_digital.html" target="_blank" rel="noreferrer">
            Videos del firmador
          </a>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            className="btn-sec"
            onClick={() => descargar(forName, textoPdf(activo, "formulario"))}
          >
            Descargar formulario
          </button>
          <button
            type="button"
            className="btn-sec"
            onClick={() => descargar(dcName, textoPdf(activo, "declaracion"))}
          >
            Descargar declaración
          </button>
        </div>
        <p className="text-sm leading-6 text-muted">
          Esas descargas son un texto de ejemplo, no el PDF de ANMAT. En la realidad, el archivo firmado se
          elige desde el disco. Acá alcanza con que el nombre coincida.
        </p>
        <label className="block text-sm">
          Nombre del formulario ya firmado ({forName})
          <input
            className="mt-1"
            value={state.nombresEnvio.formulario}
            onChange={(evento) => setNombreEnvio("formulario", evento.target.value)}
          />
        </label>
        <label className="block text-sm">
          Nombre de la declaración ya firmada ({dcName})
          <input
            className="mt-1"
            value={state.nombresEnvio.declaracion}
            onChange={(evento) => setNombreEnvio("declaracion", evento.target.value)}
          />
        </label>
        <div className="flex gap-2">
          <button type="button" className="btn" onClick={() => setCartel(enviar())}>
            Grabar
          </button>
          <button type="button" className="btn-sec" onClick={() => ir("tramites")}>
            Cancelar
          </button>
        </div>
      </Pantalla>
    </Marco>
  );
}

function MisDatos() {
  const { state, setEmails, ir } = useDemo();
  const [aviso, setAviso] = useState<string | null>(null);
  return (
    <Marco
      titulo="A quién le avisa Helena"
      bajada="La empresa y el CUIT vienen del sistema de pagos. Acá solo se agregan otros mails, separados por punto y coma, para enterarse cuando cambia el estado."
      notas={[
        {
          nivel: "sabemos",
          texto: "Cada cambio de estado manda un mail. La norma dice que, el día que todo pase a Trámites a Distancia, el aviso oficial va a ser por ahí. Mientras tanto, es este mail.",
        },
        {
          nivel: "sabemos",
          texto: "Una observación o un rechazo, además, pueden llegar por carta documento al domicilio que declaraste.",
        },
      ]}
    >
      <Pantalla titulo="Mis datos">
        {aviso ? <Cartel texto={aviso} tono="ok" /> : null}
        <dl className="grid gap-2 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="text-muted">Empresa</dt>
          <dd>{EMPRESA.razonSocial}</dd>
          <dt className="text-muted">CUIT</dt>
          <dd>{EMPRESA.cuitVisible}</dd>
        </dl>
        <label className="block text-sm">
          Emails de aviso
          <textarea className="mt-1" rows={3} value={state.emails} onChange={(evento) => setEmails(evento.target.value)} />
        </label>
        <div className="flex gap-2">
          <button type="button" className="btn" onClick={() => setAviso("Guardado en esta demo. No sale ningún mail.")}>
            Actualizar emails
          </button>
          <button type="button" className="btn-sec" onClick={() => ir("tramites")}>
            Cancelar
          </button>
        </div>
      </Pantalla>
    </Marco>
  );
}

const ETAPAS: { id: Paso; titulo: string; meta: string }[] = [
  { id: "recibo", titulo: "Recibo", meta: "Qué pagaste" },
  { id: "arranque", titulo: "Confirmar", meta: "Atar el recibo" },
  { id: "formulario", titulo: "La empresa", meta: "Quién presenta" },
  { id: "declaracion", titulo: "El producto", meta: "Qué se vende" },
  { id: "tramites", titulo: "Bandeja", meta: "El borrador" },
  { id: "documentacion", titulo: "Papeles", meta: "Habilitación y BPF" },
  { id: "enviar", titulo: "Presentar", meta: "Empiezan los días" },
];

/** Traduce la pantalla actual al número de etapa, para pintar el camino. */
function indiceEtapa(paso: Paso) {
  if (paso === "arranque" || paso === "resumen") return 1;
  if (paso === "formulario") return 2;
  if (paso === "declaracion") return 3;
  if (paso === "tramites" || paso === "mis-datos") return 4;
  if (paso === "documentacion") return 5;
  if (paso === "enviar") return 6;
  return 0;
}

/** Barra de pasos. Muestra en qué punto del pedido está la persona y a dónde puede volver. */
function Camino() {
  const { state, ir } = useDemo();
  const aqui = indiceEtapa(state.paso);
  const hayTramite = state.tramites.length > 0;
  const yaPresentado = state.tramites.some((tramite) => tramite.estado !== "borrador");
  const puedeReenviar = state.tramites.some(
    (tramite) => tramite.estado === "borrador" || tramite.estado === "en_revision",
  );
  const desvio =
    state.paso === "sin-arancel"
      ? "Este es un desvío. En Helena real abre la renovación o un permiso de poca cantidad. Esas pantallas no las tenemos."
      : state.paso === "mis-datos"
        ? "Este es un desvío. Acá solo se agregan mails de aviso. El pedido del producto sigue en la bandeja."
        : null;

  /** Una etapa futura no se abre. La ficha y el producto solo se recorren mientras se están llenando. */
  function abierta(id: Paso, index: number) {
    if (index > aqui && !(hayTramite && (id === "tramites" || id === "documentacion" || id === "enviar"))) {
      return false;
    }
    if (id === "arranque") return Boolean(state.reciboValidado) || hayTramite;
    if (id === "formulario" || id === "declaracion") {
      return state.paso === "formulario" || state.paso === "declaracion";
    }
    if (id === "enviar") return hayTramite && puedeReenviar;
    return true;
  }

  return (
    <div className="space-y-3">
      <p className="text-sm leading-6">
        Entraste como <strong className="font-medium">{EMPRESA.razonSocial}</strong>. El fin de este recorrido
        es dejar un pedido de registro clase I-II en estado Enviado, listo para que ANMAT lo mire.
      </p>
      <ol className="flex flex-wrap gap-2">
        {ETAPAS.map((etapa, index) => {
          const activa = index === aqui && state.paso !== "sin-arancel" && state.paso !== "mis-datos";
          const hecha =
            !activa &&
            (index < aqui ||
              (hayTramite && index <= 3 && aqui >= 4) ||
              (yaPresentado && !puedeReenviar && etapa.id === "enviar"));
          const puede = abierta(etapa.id, index);
          const clase = activa ? "etapa is-on w-full" : hecha ? "etapa is-done w-full" : "etapa w-full";
          return (
            <li key={etapa.id} className="flex min-w-[9.5rem] flex-1">
              <button type="button" className={clase} disabled={!puede} onClick={() => ir(etapa.id)}>
                <span className="etapa-num">{index + 1}</span>
                <span>
                  <span className="block text-sm font-medium">{etapa.titulo}</span>
                  <span className={`block text-xs ${activa ? "text-white/75" : "text-muted"}`}>{etapa.meta}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {desvio ? <p className="bg-midbg px-3 py-2 text-sm leading-6 text-mid">{desvio}</p> : null}
    </div>
  );
}

/** Recorre el único trámite del que tenemos pantallas: el registro clase I-II. */
export function Recorrido() {
  const { listo, state } = useDemo();
  if (!listo) return <p className="text-sm text-muted">Preparando el simulador…</p>;
  if (!state.logueado || state.paso === "login") return <Login />;

  let cuerpo: ReactNode;
  switch (state.paso) {
    case "recibo":
      cuerpo = <Recibo />;
      break;
    case "sin-arancel":
      cuerpo = <SinArancel />;
      break;
    case "arranque":
      cuerpo = <Arranque />;
      break;
    case "resumen":
      cuerpo = <Resumen />;
      break;
    case "formulario":
      cuerpo = <FormularioPaso />;
      break;
    case "declaracion":
      cuerpo = <DeclaracionPaso />;
      break;
    case "tramites":
      cuerpo = <Tramites />;
      break;
    case "documentacion":
      cuerpo = <Documentacion />;
      break;
    case "enviar":
      cuerpo = <Enviar />;
      break;
    case "mis-datos":
      cuerpo = <MisDatos />;
      break;
    default:
      cuerpo = <Recibo />;
  }

  return (
    <div className="space-y-4">
      <Camino />
      {cuerpo}
    </div>
  );
}
