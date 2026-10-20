/**
 * Filas copiadas de la biblioteca pública de Helena el 20/10/2026.
 * Los enlaces abren el PDF en el servidor de ANMAT. No los guardamos acá.
 * Consulta: nombre "Andador" en https://helena.anmat.gob.ar/Boletin/
 */
export type EjemploPublico = {
  tramite: string;
  fecha: string;
  empresa: string;
  nombre: string;
  marca: string;
  pm: string;
  expediente: string;
  /** PDF de la columna Dec/Cert. Es la declaración firmada. */
  pdf: string;
  /** Página a la que apunta el QR, si la decodificamos. */
  qr: string | null;
};

export const EJEMPLOS_PUBLICOS: EjemploPublico[] = [
  {
    tramite: "Registro Clase I-II",
    fecha: "02/09/2026",
    empresa: "TRINIDAD INSUMOS S.R.L.",
    nombre: "andadores",
    marca: "HANGZHOU FUYANG",
    pm: "2326-70",
    expediente: "1-0047-3110-006386-26-8",
    pdf: "https://helena.anmat.gob.ar/uploads/pdfs/dc_80819_30712305513_7302.pdf",
    qr: null,
  },
  {
    tramite: "Registro Clase I-II",
    fecha: "12/08/2026",
    empresa: "DROGUERIA DIMEC SRL",
    nombre: "ANDADORES",
    marca: "Foshan Dongfang",
    pm: "3115-5",
    expediente: "1-0047-3110-005188-26-8",
    pdf: "https://helena.anmat.gob.ar/uploads/pdfs/dc_79661_30634640874_4680.pdf",
    qr: "https://helena.anmat.gob.ar/Boletin/ProcesarQR.aspx?iID=79661&sRnd=64402A53-57A9-4FC6-A6BC-F2C8A9649D5B&Tipo=dc",
  },
  {
    tramite: "Modificación de Registro Clase I-II",
    fecha: "22/09/2026",
    empresa: "REHAB S.R.L.",
    nombre: "Andador",
    marca: "REHAB",
    pm: "2404-59",
    expediente: "1-0047-3110-006966-26-1",
    pdf: "https://helena.anmat.gob.ar/uploads/pdfs/dc_81382_30715141201_9251.pdf",
    qr: null,
  },
  {
    tramite: "Reválida de Registro I-II-III-IV",
    fecha: "13/10/2026",
    empresa: "SCHULZE RODOLFO ESTEBAN",
    nombre: "ANDADORES",
    marca: "MASSUAR",
    pm: "2247-5",
    expediente: "1-0047-3110-007663-26-0",
    pdf: "https://helena.anmat.gob.ar/uploads/pdfs/dj_82049_23233422029_8170.pdf",
    qr: null,
  },
];
