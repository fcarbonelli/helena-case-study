"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ahora,
  aplicarNoAplica,
  declaracionVacia,
  estadoInicial,
  faltantesDeclaracion,
  faltantesFormulario,
  formularioVacio,
  mensajeRecibo,
  nombrePdf,
  tramiteActivo,
  validarRecibo,
  type Declaracion,
  type DemoState,
  type Fila,
  type Formulario,
  type Paso,
  type Tramite,
} from "./modelo";

const CLAVE = "helena-demo-v1";

type Tabla = "rese" | "ensayos" | "laboratorios";

type DemoApi = {
  listo: boolean;
  state: DemoState;
  ir: (paso: Paso) => void;
  entrar: (usuario: string, clave: string) => string | null;
  salir: () => void;
  setReciboTipeado: (valor: string) => void;
  validar: () => string | null;
  setEmailArranque: (valor: string) => void;
  setCaptcha: (valor: boolean) => void;
  comenzar: () => string | null;
  continuarResumen: () => void;
  cancelarResumen: () => void;
  patchForm: (patch: Partial<Formulario>) => void;
  patchDecl: (patch: Partial<Declaracion>) => void;
  setFila: (tabla: Tabla, index: number, detalle: string) => void;
  addFila: (tabla: Tabla) => void;
  removeFila: (tabla: Tabla, index: number) => void;
  seguirADeclaracion: () => string | null;
  cerrarFormularios: () => string | null;
  modificar: (id: number) => void;
  abrirEnvio: (id: number) => void;
  abrirDocumentacion: (id: number | null) => void;
  setFiltro: (valor: string) => void;
  agregarDoc: (descripcion: string, tramiteId: number | null, archivo: string) => string | null;
  borrarDoc: (id: number) => void;
  setNombreEnvio: (cual: "formulario" | "declaracion", valor: string) => void;
  enviar: () => string | null;
  observar: (comentario: string) => string | null;
  aprobar: () => string | null;
  rechazar: (comentario: string) => string | null;
  anular: () => string | null;
  setEmails: (valor: string) => void;
  reiniciar: () => void;
};

const Contexto = createContext<DemoApi | null>(null);

function conActivo(state: DemoState, receta: (tramite: Tramite) => Tramite): DemoState {
  return {
    ...state,
    tramites: state.tramites.map((tramite) =>
      tramite.id === state.activoId ? receta(tramite) : tramite,
    ),
  };
}

/** Guarda el recorrido en la pestaña del navegador para que un refresh no borre el trámite. */
export function Proveedor({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(estadoInicial);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    const guardado = sessionStorage.getItem(CLAVE);
    if (guardado) {
      try {
        const parsed = JSON.parse(guardado) as DemoState;
        if (parsed && Array.isArray(parsed.tramites)) setState(parsed);
      } catch {
        sessionStorage.removeItem(CLAVE);
      }
    }
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    sessionStorage.setItem(CLAVE, JSON.stringify(state));
  }, [state, listo]);

  const api: DemoApi = {
    listo,
    state,
    ir: (paso) => setState((actual) => ({ ...actual, paso, aviso: "" })),
    entrar: (usuario, clave) => {
      if (!usuario.trim() || !clave.trim()) return "Completá usuario y clave.";
      setState((actual) => ({ ...actual, logueado: true, paso: "recibo", aviso: "" }));
      return null;
    },
    salir: () =>
      setState((actual) => ({
        ...actual,
        logueado: false,
        paso: "login",
        aviso: "",
      })),
    setReciboTipeado: (valor) => setState((actual) => ({ ...actual, reciboTipeado: valor })),
    validar: () => {
      const resultado = validarRecibo(state.reciboTipeado, state.recibosUsados);
      if (!resultado.ok) return mensajeRecibo(resultado.motivo);
      setState((actual) => ({
        ...actual,
        reciboValidado: resultado.recibo,
        paso: "arranque",
        aviso: "",
      }));
      return null;
    },
    setEmailArranque: (valor) => setState((actual) => ({ ...actual, emailArranque: valor })),
    setCaptcha: (valor) => setState((actual) => ({ ...actual, captcha: valor })),
    comenzar: () => {
      if (!state.emailArranque.includes("@")) return "El email necesita un @.";
      if (!state.captcha) return "Marcá la casilla. En el sistema real ahí hay un captcha.";
      setState((actual) => ({ ...actual, paso: "resumen", aviso: "" }));
      return null;
    },
    continuarResumen: () =>
      setState((actual) => {
        const recibo = actual.reciboValidado;
        if (!recibo) return actual;
        const id = actual.siguienteId;
        const tramite: Tramite = {
          id,
          tipo: recibo.tipo,
          origen: recibo.origen,
          clase: recibo.clase,
          fecha: ahora(),
          recibo: recibo.numero,
          expediente: String(id).padStart(8, "0"),
          estado: "borrador",
          comentarios: "",
          email: actual.emailArranque,
          formulariosCerrados: false,
          formulario: formularioVacio(recibo.origen),
          declaracion: declaracionVacia(recibo.origen),
          historial: [{ cuando: ahora(), texto: "Se creó el borrador y el recibo quedó usado." }],
        };
        return {
          ...actual,
          tramites: [tramite, ...actual.tramites],
          activoId: id,
          siguienteId: id + 1,
          recibosUsados: [...actual.recibosUsados, recibo.numero],
          reciboValidado: null,
          reciboTipeado: "",
          captcha: false,
          paso: "formulario",
          aviso: "",
        };
      }),
    cancelarResumen: () => setState((actual) => ({ ...actual, paso: "recibo", aviso: "" })),
    patchForm: (patch) =>
      setState((actual) =>
        conActivo(actual, (tramite) => ({
          ...tramite,
          formulario: { ...tramite.formulario, ...patch },
        })),
      ),
    patchDecl: (patch) =>
      setState((actual) =>
        conActivo(actual, (tramite) => ({
          ...tramite,
          declaracion: { ...tramite.declaracion, ...patch },
        })),
      ),
    setFila: (tabla, index, detalle) =>
      setState((actual) =>
        conActivo(actual, (tramite) => {
          const filas = tramite.declaracion[tabla].map((fila, i) =>
            i === index ? { detalle } : fila,
          );
          return { ...tramite, declaracion: { ...tramite.declaracion, [tabla]: filas } };
        }),
      ),
    addFila: (tabla) =>
      setState((actual) =>
        conActivo(actual, (tramite) => ({
          ...tramite,
          declaracion: {
            ...tramite.declaracion,
            [tabla]: [...tramite.declaracion[tabla], { detalle: "" } satisfies Fila],
          },
        })),
      ),
    removeFila: (tabla, index) =>
      setState((actual) =>
        conActivo(actual, (tramite) => ({
          ...tramite,
          declaracion: {
            ...tramite.declaracion,
            [tabla]: tramite.declaracion[tabla].filter((_, i) => i !== index),
          },
        })),
      ),
    seguirADeclaracion: () => {
      const activo = tramiteActivo(state);
      if (!activo) return "No hay un trámite abierto.";
      const faltan = faltantesFormulario(activo.formulario);
      if (faltan.length) return `Completá este campo: ${faltan.join(", ")}.`;
      setState((actual) => ({
        ...conActivo(actual, (tramite) => ({
          ...tramite,
          formulario: { ...tramite.formulario, fax: tramite.formulario.fax.trim() || "no aplica" },
        })),
        paso: "declaracion",
        aviso: "",
      }));
      return null;
    },
    cerrarFormularios: () => {
      const activo = tramiteActivo(state);
      if (!activo) return "No hay un trámite abierto.";
      const faltan = faltantesDeclaracion(activo.declaracion);
      if (faltan.length) return `Completá este campo: ${faltan.join(", ")}.`;
      setState((actual) => ({
        ...conActivo(actual, (tramite) =>
          aplicarNoAplica({
            ...tramite,
            formulariosCerrados: true,
            historial: [
              ...tramite.historial,
              { cuando: ahora(), texto: "Se cerró la confección de los formularios." },
            ],
          }),
        ),
        paso: "tramites",
        aviso: "Se ha finalizado la confección de los formularios correctamente.",
      }));
      return null;
    },
    modificar: (id) =>
      setState((actual) => ({
        ...actual,
        activoId: id,
        paso: "formulario",
        aviso: "",
        tramites: actual.tramites.map((tramite) =>
          tramite.id === id ? { ...tramite, formulariosCerrados: false } : tramite,
        ),
      })),
    abrirEnvio: (id) =>
      setState((actual) => ({
        ...actual,
        activoId: id,
        paso: "enviar",
        aviso: "",
        nombresEnvio: { formulario: "", declaracion: "" },
      })),
    abrirDocumentacion: (id) =>
      setState((actual) => ({
        ...actual,
        activoId: id ?? actual.activoId,
        paso: "documentacion",
        aviso: "",
      })),
    setFiltro: (valor) => setState((actual) => ({ ...actual, filtroEstado: valor })),
    agregarDoc: (descripcion, tramiteId, archivo) => {
      if (!descripcion.trim() || !archivo.trim()) {
        return "Hace falta una descripción y un nombre de archivo.";
      }
      setState((actual) => ({
        ...actual,
        siguienteDocId: actual.siguienteDocId + 1,
        documentos: [
          {
            id: actual.siguienteDocId,
            descripcion: descripcion.trim(),
            tramiteId,
            archivo: archivo.trim(),
            fecha: ahora(),
          },
          ...actual.documentos,
        ],
        aviso: "",
      }));
      return null;
    },
    borrarDoc: (id) =>
      setState((actual) => ({
        ...actual,
        documentos: actual.documentos.filter((doc) => doc.id !== id),
      })),
    setNombreEnvio: (cual, valor) =>
      setState((actual) => ({
        ...actual,
        nombresEnvio: { ...actual.nombresEnvio, [cual]: valor },
      })),
    enviar: () => {
      const activo = tramiteActivo(state);
      if (!activo) return "No hay un trámite abierto.";
      if (!activo.formulariosCerrados) {
        return "Primero tenés que terminar los formularios y ver el cartel de finalización.";
      }
      if (activo.estado !== "borrador" && activo.estado !== "en_revision") {
        return "En este estado el trámite ya no se envía.";
      }
      const esperadoFor = nombrePdf("for", activo.id, activo.fecha);
      const esperadoDc = nombrePdf("dc", activo.id, activo.fecha);
      if (state.nombresEnvio.formulario !== esperadoFor || state.nombresEnvio.declaracion !== esperadoDc) {
        return `El nombre no coincide. Helena espera ${esperadoFor} y ${esperadoDc}. Si el archivo dice (1), no sirve.`;
      }
      setState((actual) => ({
        ...conActivo(actual, (tramite) => ({
          ...tramite,
          estado: "enviado",
          comentarios: "",
          historial: [
            ...tramite.historial,
            { cuando: ahora(), texto: "La empresa envió los PDF con el nombre correcto. Empieza el plazo." },
          ],
        })),
        paso: "tramites",
        nombresEnvio: { formulario: "", declaracion: "" },
        aviso: "El trámite pasó a Enviado. Desde ahora corre el plazo y no se puede modificar.",
      }));
      return null;
    },
    observar: (comentario) => {
      const activo = tramiteActivo(state);
      if (!activo || activo.estado !== "enviado") {
        return "Solo se puede observar un trámite que está Enviado.";
      }
      if (!comentario.trim()) return "Escribí qué le observa ANMAT, así se ve en la columna Comentarios.";
      setState((actual) => ({
        ...conActivo(actual, (tramite) => ({
          ...tramite,
          estado: "en_revision",
          comentarios: comentario.trim(),
          historial: [...tramite.historial, { cuando: ahora(), texto: `Observación: ${comentario.trim()}` }],
        })),
        paso: "tramites",
        aviso: "El evaluador devolvió el trámite. El reloj de los 15 días queda pausado mientras contestás.",
      }));
      return null;
    },
    aprobar: () => {
      const activo = tramiteActivo(state);
      if (!activo || activo.estado !== "enviado") {
        return "Solo se aprueba un trámite Enviado. Si está en revisión, primero hay que contestarlo y enviarlo de nuevo.";
      }
      setState((actual) => ({
        ...conActivo(actual, (tramite) => ({
          ...tramite,
          estado: "aprobado",
          comentarios: "",
          historial: [
            ...tramite.historial,
            { cuando: ahora(), texto: "Aprobado en la demo. En la realidad, ANMAT firma el PDF y lo publica." },
          ],
        })),
        paso: "tramites",
        aviso: "Aprobado. Ya aparece en la biblioteca de esta demo. El QR real no existe acá.",
      }));
      return null;
    },
    rechazar: (comentario) => {
      const activo = tramiteActivo(state);
      if (!activo || (activo.estado !== "enviado" && activo.estado !== "en_revision")) {
        return "Solo se rechaza un trámite que ANMAT todavía está mirando.";
      }
      setState((actual) => ({
        ...conActivo(actual, (tramite) => ({
          ...tramite,
          estado: "rechazado",
          comentarios: comentario.trim() || "No cumple los requisitos.",
          historial: [...tramite.historial, { cuando: ahora(), texto: "Rechazado. Este número de trámite no se reutiliza." }],
        })),
        paso: "tramites",
        aviso: "Rechazado. El instructivo dice que ese trámite no puede volver a usarse.",
      }));
      return null;
    },
    anular: () => {
      const activo = tramiteActivo(state);
      if (!activo || activo.estado === "aprobado" || activo.estado === "rechazado" || activo.estado === "anulado") {
        return "Este trámite ya terminó y no se puede desistir.";
      }
      setState((actual) => ({
        ...conActivo(actual, (tramite) => ({
          ...tramite,
          estado: "anulado",
          historial: [...tramite.historial, { cuando: ahora(), texto: "La empresa desistió. El trámite queda anulado." }],
        })),
        paso: "tramites",
        aviso: "Anulado. Es el desistimiento. Tampoco se reutiliza.",
      }));
      return null;
    },
    setEmails: (valor) => setState((actual) => ({ ...actual, emails: valor })),
    reiniciar: () => {
      sessionStorage.removeItem(CLAVE);
      setState(estadoInicial());
    },
  };

  return <Contexto.Provider value={api}>{children}</Contexto.Provider>;
}

export function useDemo(): DemoApi {
  const api = useContext(Contexto);
  if (!api) throw new Error("useDemo tiene que usarse dentro del proveedor");
  return api;
}
