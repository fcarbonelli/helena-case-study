/**
 * Datos de la demo y reglas que el instructivo deja afirmar.
 * Todo lo que es un atajo del simulador está nombrado en la interfaz,
 * no escondido en estas funciones.
 */

export type Paso =
  | "login"
  | "recibo"
  | "sin-arancel"
  | "arranque"
  | "resumen"
  | "formulario"
  | "declaracion"
  | "tramites"
  | "documentacion"
  | "enviar"
  | "mis-datos";

export type Estado =
  | "borrador"
  | "enviado"
  | "en_revision"
  | "aprobado"
  | "rechazado"
  | "anulado";

export type Origen = "nacional" | "importado";

export type ReciboValido = {
  numero: string;
  tipo: string;
  origen: Origen;
  clase: string;
};

export type Formulario = {
  actividad: string;
  legajo: string;
  razonSocial: string;
  direccion: string;
  telefono: string;
  fax: string;
  email: string;
};

export type Fila = { detalle: string };

export type Declaracion = {
  clase: string;
  revision: string;
  nombre: string;
  umdns: string;
  marca: string;
  modelos: string;
  composicion: string;
  indicaciones: string;
  presentacion: string;
  condicion: string;
  fabricante: string;
  lugares: string;
  numeroPm: string;
  rese: Fila[];
  ensayos: Fila[];
  laboratorios: Fila[];
};

export type Documento = {
  id: number;
  descripcion: string;
  tramiteId: number | null;
  archivo: string;
  fecha: string;
};

export type Hito = { cuando: string; texto: string };

export type Tramite = {
  id: number;
  tipo: string;
  origen: Origen;
  clase: string;
  fecha: string;
  recibo: string;
  expediente: string;
  estado: Estado;
  comentarios: string;
  email: string;
  formulariosCerrados: boolean;
  formulario: Formulario;
  declaracion: Declaracion;
  historial: Hito[];
};

export type DemoState = {
  logueado: boolean;
  paso: Paso;
  emails: string;
  reciboTipeado: string;
  reciboValidado: ReciboValido | null;
  emailArranque: string;
  captcha: boolean;
  tramites: Tramite[];
  activoId: number | null;
  documentos: Documento[];
  recibosUsados: string[];
  siguienteId: number;
  siguienteDocId: number;
  filtroEstado: string;
  aviso: string;
  /** Nombres elegidos en la pantalla de envío. No son archivos reales. */
  nombresEnvio: { formulario: string; declaracion: string };
};

export const EMPRESA = {
  razonSocial: "Demo Salud SRL",
  cuit: "30712345678",
  cuitVisible: "30-71234567-8",
  email: "mesa@demosalud.example",
};

export const ESTADOS: { id: string; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "borrador", label: "Borrador" },
  { id: "enviado", label: "Enviado" },
  { id: "en_revision", label: "En revisión" },
  { id: "aprobado", label: "Aprobado" },
  { id: "rechazado", label: "Rechazado" },
  { id: "anulado", label: "Anulado" },
];

/** La empresa de la demo, antes de que alguien toque nada. */
export function estadoInicial(): DemoState {
  return {
    logueado: false,
    paso: "login",
    emails: EMPRESA.email,
    reciboTipeado: "1001",
    reciboValidado: null,
    emailArranque: EMPRESA.email,
    captcha: true,
    tramites: [],
    activoId: null,
    documentos: [],
    recibosUsados: [],
    siguienteId: 1,
    siguienteDocId: 1,
    filtroEstado: "todos",
    aviso: "",
    nombresEnvio: { formulario: "", declaracion: "" },
  };
}

export function etiquetaEstado(estado: Estado): string {
  return ESTADOS.find((item) => item.id === estado)?.label ?? estado;
}

/**
 * Recibos de juguete. En ANMAT el número lo da el sitio de pagos.
 * Acá cada número cuenta una de las reglas que el instructivo sí escribe.
 */
export function validarRecibo(
  numero: string,
  usados: string[],
): { ok: true; recibo: ReciboValido } | { ok: false; motivo: string } {
  const n = numero.trim();
  if (!n) return { ok: false, motivo: "vacio" };
  if (usados.includes(n) || n === "1003") return { ok: false, motivo: "usado" };
  if (n === "1004") return { ok: false, motivo: "vencido" };
  if (n === "1005") return { ok: false, motivo: "otro" };
  if (n === "1001") {
    return {
      ok: true,
      recibo: { numero: n, tipo: "Registro Clase I-II", origen: "nacional", clase: "I-II" },
    };
  }
  if (n === "1002") {
    return {
      ok: true,
      recibo: { numero: n, tipo: "Registro Clase I-II", origen: "importado", clase: "I-II" },
    };
  }
  return { ok: false, motivo: "inexistente" };
}

export function mensajeRecibo(motivo: string): string {
  switch (motivo) {
    case "vacio":
      return "Escribí el número de recibo.";
    case "usado":
      return "Ese recibo ya se usó. Sirve una sola vez y después no se puede cambiar.";
    case "vencido":
      return "Ese recibo está vencido. Tiene que estar pago y todavía vigente.";
    case "otro":
      return "Ese recibo pagaría un registro de clase III o IV. Ese trámite existe, pero no tenemos la pantalla, así que la demo no sigue por ahí.";
    default:
      return "Ese número no está entre los recibos de prueba. Probá 1001 o 1002.";
  }
}

/**
 * Ficha de la empresa, ya escrita, para recorrer la demo sin tipear.
 * Los nombres de los campos son los de la foto. Los valores son inventados.
 */
export function formularioVacio(origen: Origen): Formulario {
  return {
    actividad: origen === "importado" ? "Importador" : "Fabricante",
    legajo: "500",
    razonSocial: EMPRESA.razonSocial,
    direccion: "Av. Ejemplo 1234, Ciudad Autónoma de Buenos Aires",
    telefono: "011 5555-0101",
    fax: "",
    email: EMPRESA.email,
  };
}

/**
 * Declaración de un andador de clase I, precargada con el mismo fin.
 * El código UMDNS 14-393 es el que figura en declaraciones públicas de andadores.
 */
export function declaracionVacia(origen: Origen = "nacional"): Declaracion {
  const importado = origen === "importado";
  return {
    clase: "Clase I",
    revision: "1",
    nombre: "Andador plegable",
    umdns: "14-393 ANDADORES",
    marca: importado ? "HANGZHOU FUYANG" : "Demo Salud",
    modelos: "",
    composicion: "",
    indicaciones: "Ayuda para caminar a una persona con movilidad reducida.",
    presentacion: "Por unidad",
    condicion: "Venta libre",
    fabricante: importado ? "Hangzhou Fuyang Medical Equipment, China" : EMPRESA.razonSocial,
    lugares: importado
      ? "Zona industrial, Hangzhou, China"
      : "Av. Ejemplo 1234, Ciudad Autónoma de Buenos Aires",
    numeroPm: "500-1",
    rese: [{ detalle: "Requisitos esenciales de seguridad. Texto de ejemplo." }],
    ensayos: [{ detalle: "Ensayo de carga informado por el fabricante. Texto de ejemplo." }],
    laboratorios: [{ detalle: "Laboratorio de ejemplo." }],
  };
}

function falta(valor: string, nombre: string, lista: string[]) {
  if (!valor.trim()) lista.push(nombre);
}

/** El instructivo dice que hay campos obligatorios. La lista exacta no está escrita: esta es la que usa la demo. */
export function faltantesFormulario(formulario: Formulario): string[] {
  const lista: string[] = [];
  falta(formulario.actividad, "Actividad", lista);
  falta(formulario.legajo, "Legajo ANMAT", lista);
  falta(formulario.razonSocial, "Razón social", lista);
  falta(formulario.direccion, "Dirección", lista);
  falta(formulario.telefono, "Teléfono", lista);
  falta(formulario.email, "Email", lista);
  return lista;
}

export function faltantesDeclaracion(declaracion: Declaracion): string[] {
  const lista: string[] = [];
  falta(declaracion.revision, "Número de revisión", lista);
  falta(declaracion.nombre, "Nombre descriptivo", lista);
  falta(declaracion.umdns, "Código y nombre técnico", lista);
  falta(declaracion.marca, "Marca", lista);
  falta(declaracion.indicaciones, "Indicaciones", lista);
  falta(declaracion.presentacion, "Forma de presentación", lista);
  falta(declaracion.condicion, "Condición de venta", lista);
  falta(declaracion.fabricante, "Nombre del fabricante", lista);
  falta(declaracion.lugares, "Lugares de elaboración", lista);
  falta(declaracion.numeroPm, "Número de PM", lista);
  return lista;
}

function oVacio(valor: string): string {
  return valor.trim() ? valor.trim() : "no aplica";
}

/**
 * El instructivo dice que un campo no obligatorio, si queda en blanco,
 * se guarda como el texto "no aplica".
 */
export function aplicarNoAplica(tramite: Tramite): Tramite {
  const limpiar = (filas: Fila[]) => filas.filter((fila) => fila.detalle.trim());
  return {
    ...tramite,
    formulario: { ...tramite.formulario, fax: oVacio(tramite.formulario.fax) },
    declaracion: {
      ...tramite.declaracion,
      modelos: oVacio(tramite.declaracion.modelos),
      composicion: oVacio(tramite.declaracion.composicion),
      rese: limpiar(tramite.declaracion.rese),
      ensayos: limpiar(tramite.declaracion.ensayos),
      laboratorios: limpiar(tramite.declaracion.laboratorios),
    },
  };
}

/** Mismo patrón que la grilla del instructivo: for_1_30712345678_2026.pdf */
export function nombrePdf(prefijo: "for" | "dc", id: number, fechaIso: string): string {
  const anio = new Date(fechaIso).getFullYear();
  return `${prefijo}_${id}_${EMPRESA.cuit}_${anio}.pdf`;
}

export function ahora(): string {
  return new Date().toISOString();
}

export function fechaVisible(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function tramiteActivo(state: DemoState): Tramite | null {
  return state.tramites.find((tramite) => tramite.id === state.activoId) ?? null;
}

export function puedeEditar(estado: Estado): boolean {
  return estado === "borrador" || estado === "en_revision";
}

export function textoPdf(tramite: Tramite, cual: "formulario" | "declaracion"): string {
  const comun = [
    "DEMO DE ESTUDIO. Este archivo imita el PDF que Helena generaría.",
    "No es un certificado de ANMAT y no tiene firma digital.",
    `Trámite ${tramite.id}. ${tramite.tipo}. Origen ${tramite.origen}.`,
    `Expediente de la demo: ${tramite.expediente}.`,
    "",
  ];
  if (cual === "formulario") {
    const f = tramite.formulario;
    return [
      ...comun,
      "FORMULARIO DE REGISTRO",
      `Actividad: ${f.actividad}`,
      `Legajo: ${f.legajo}`,
      `Razón social: ${f.razonSocial}`,
      `Dirección: ${f.direccion}`,
      `Teléfono: ${f.telefono}`,
      `Fax: ${f.fax}`,
      `Email: ${f.email}`,
    ].join("\n");
  }
  const d = tramite.declaracion;
  const filas = (titulo: string, lista: Fila[]) =>
    lista.length ? lista.map((fila) => `- ${fila.detalle}`).join("\n") : "no aplica";
  return [
    ...comun,
    "DECLARACIÓN DE CONFORMIDAD",
    `Clase: ${d.clase}`,
    `Revisión: ${d.revision}`,
    `Nombre: ${d.nombre}`,
    `UMDNS: ${d.umdns}`,
    `Marca: ${d.marca}`,
    `Modelos: ${d.modelos}`,
    `Composición: ${d.composicion}`,
    `Indicaciones: ${d.indicaciones}`,
    `Presentación: ${d.presentacion}`,
    `Condición de venta: ${d.condicion}`,
    `Fabricante: ${d.fabricante}`,
    `Lugares: ${d.lugares}`,
    `Número de PM: ${d.numeroPm}`,
    "",
    "Requisitos esenciales",
    filas("rese", d.rese),
    "",
    "Ensayos o gestión de riesgo",
    filas("ensayos", d.ensayos),
    "",
    "Laboratorios",
    filas("laboratorios", d.laboratorios),
  ].join("\n");
}
