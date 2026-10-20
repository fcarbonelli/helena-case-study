import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Qué falta",
};

const GRUPOS = [
  {
    titulo: "La demo sí recorre esto",
    items: [
      "Entrar, con un usuario de mentira en lugar del de pagos.",
      "Un recibo que habilita el registro de clase I o II, y recibos que fallan porque ya se usaron, vencieron o serían de otra clase.",
      "El mail, el captcha simplificado y el resumen que gasta el recibo.",
      "El formulario y la declaración con los campos que se alcanzan a leer en las fotos.",
      "La bandeja, los seis estados, los PDF con el nombre del manual y el rechazo si ese nombre cambia.",
      "Papeles de un trámite o de toda la empresa.",
      "Una observación, una aprobación y un rechazo, hechos con botones que en la realidad usa un empleado de ANMAT.",
    ],
  },
  {
    titulo: "Existe, y no lo dibujamos porque no tenemos la pantalla",
    items: [
      "Registro y modificaciones de clase III y IV. El detalle de por qué no hay formulario está más abajo.",
      "La modificación rápida de clase III y IV: solo nombre, presentación, marca, planta del importado, esterilización, rótulo o vida útil.",
      "La declaración jurada de los productos más simples del listado, como andadores o sillas de ruedas manuales.",
      "La reválida de los cinco años.",
      "Los análisis de laboratorio clase A y B.",
      "La autorización para traer poca cantidad de un análisis que todavía no está registrado.",
      "La transferencia de un producto de una empresa a otra. En 2020 ANMAT dijo que eso se hace en Trámites a Distancia, no en Helena.",
      "La cancelación del registro.",
    ],
  },
  {
    titulo: "Pasa afuera de Helena",
    items: [
      "Pagar el arancel y obtener el recibo.",
      "Habilitar la empresa y sacar el certificado de buenas prácticas.",
      "Conseguir el certificado de firma. El programa se baja sin clave de Helena; el pendrive de la persona, no. Los enlaces están en Presentar.",
      "El QR del trámite que aprueba esta demo. En la biblioteca hay uno real, de un andador ya publicado.",
      "Las inspecciones, que pueden llegar después de aprobado.",
      "Importar el producto ya registrado, que va por otro sistema, BONITA.",
      "Avisar un problema en el mercado, que va por otro sistema, ARGOS.",
    ],
  },
  {
    titulo: "Qué habría que conseguir para acercar la copia",
    items: [
      "Un PDF en blanco de cada tipo de trámite, o una pasada con un usuario de prueba.",
      "Un recibo real, aunque esté vencido, para ver qué contesta el botón de validar.",
      "Saber si Helena controla la firma por dentro o si eso lo mira una persona.",
      "La regla exacta del número de producto y el momento en que aparece el expediente largo.",
      "Confirmar si el combo de trámites de 2026 sigue igual o si alguna parte ya se mudó a Trámites a Distancia.",
    ],
  },
];

export default function Faltantes() {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="font-serif text-4xl">Qué copia esta demo, y qué deja afuera</h1>
      <p className="mt-3 leading-7 text-muted">
        El alta de un producto de clase I o II, el único camino del que tenemos las pantallas, queda recorrido
        de punta a punta. El resto está nombrado acá, con el hueco a la vista.
      </p>
      <div className="mt-8 space-y-8">
        {GRUPOS.map((grupo) => (
          <section key={grupo.titulo}>
            <h2 className="font-serif text-2xl">{grupo.titulo}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7">
              {grupo.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="mt-10 border border-line bg-white p-5">
        <h2 className="font-serif text-2xl">Clase III y IV: qué sabemos y qué no</h2>
        <p className="mt-3 leading-7">
          Helena también registra esas clases. El manual lo dice, y la biblioteca pública las muestra todos
          los días. No están en el simulador porque no vimos la pantalla.
        </p>
        <p className="mt-3 leading-7">
          Lo que sí está escrito, en el anexo IV de la Disposición 9688, es la lista de papeles. Para un
          producto nacional: recibo, formulario, buenas prácticas, rótulo, instrucciones de uso, informe
          técnico, ensayos originales e informe de riesgos. Si es importado se suman el certificado del país
          de origen, la carta de representación, la carta de compromiso y el historial de comercialización.
          El alta inicial tarda unos 110 días hábiles y cierra con una resolución. En el ingreso de Helena
          piden, además, el rótulo y las instrucciones en un solo archivo firmado de puño y letra.
        </p>
        <p className="mt-3 leading-7">
          El anexo nombra «formulario de registro» y no dice qué campos tiene. Las fotos del manual son del
          alta de clase I y II. Copiar esos campos y llamarlo clase III sería inventar la interfaz.
        </p>
        <p className="mt-3 leading-7">
          La biblioteca pública, consultada el 20 de octubre de 2026, muestra el papel ya publicado. No
          muestra la pantalla donde la empresa cargó los datos. En un alta nueva de clase III-IV la columna
          de la declaración viene vacía. El PDF de la otra columna, en los dos que abrimos, es el proyecto de
          rótulo junto con las instrucciones de uso. La última hoja es la carátula de firmas del expediente y
          dice «Rótulo e instrucciones de uso». Uno es el tomógrafo de EURO SWISS (PM 1440-201) y el otro el
          kit de gastrostomía de PHARMASSIST (PM 2314-32). Ahí se leen el nombre, el fabricante, el
          importador, el director técnico, el número de PM, los modelos y los datos de lote. Confirma el
          rótulo. No es el formulario.
        </p>
        <p className="mt-3 leading-7">
          En una modificación de clase III-IV sí hay certificado. El del stent coronario de MERIL (PM 3054-2,
          trámite 81122) se llama certificado de autorización de modificación. Pone el dato anterior al lado
          del dato nuevo. En ese caso cambiaron la marca, los modelos y el rótulo. Cita las disposiciones
          64/25 y 9688/19, y pide verificarlo con el código QR. Es el resultado de la revisión, no la
          pantalla donde la empresa pidió el cambio.
        </p>
        <p className="mt-3 leading-7">
          La reválida usa una puerta que se llama I-II-III-IV y publica una declaración jurada. La que
          abrimos, la banda odontológica de VECA (PM 1779-27), dice clase de riesgo I. No sirve de modelo de
          clase III. Sí muestra los datos que ANMAT imprime en esa declaración: nombre, código UMDNS, marca,
          clase, indicaciones, modelos, vida útil, condición de uso, materia prima de origen biológico,
          presentación, esterilización, fabricante y lugar de elaboración. Varios de esos renglones ya están
          en la declaración de clase I-II del mostrador. Vida útil, esterilización y materia prima biológica
          no estaban en la foto del manual. Usarlos para dibujar el alta de clase III seguiría siendo una
          suposición.
        </p>
        <ul className="mt-4 space-y-2 leading-7">
          <li>
            <a
              className="underline"
              href="https://helena.anmat.gob.ar/uploads/pdfs/IF-2026-82780370-APN-INPM%20ANMAT.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Rótulo e instrucciones del tomógrafo
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://helena.anmat.gob.ar/uploads/pdfs/IF-2026-87953538-APN-INPM%20ANMAT.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Rótulo e instrucciones del kit de gastrostomía
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://helena.anmat.gob.ar/uploads/pdfs/crt_81122_30718267567_16591.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Certificado de modificación del stent
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://helena.anmat.gob.ar/uploads/pdfs/dj_60747_30708020229_2722.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Declaración jurada de reválida de la banda odontológica
            </a>
          </li>
        </ul>
        <p className="mt-3 leading-7">
          Para dibujar el formulario de clase III o IV haría falta una foto de esa pantalla, un PDF en blanco
          generado por Helena, o una pasada con un usuario de prueba. Con eso se verían los campos, cuáles
          son obligatorios y si además del formulario hay una declaración. Mientras tanto, lo que se puede
          afirmar es la lista de papeles del anexo y el contenido de estos PDF públicos.
        </p>
      </section>
      <section className="mt-10 border border-line bg-white p-5">
        <h2 className="font-serif text-2xl">Dónde cerraría el caso</h2>
        <p className="mt-3 leading-7">
          Para estudiar el alta de clase I-II, el material alcanza: la llegada de la empresa, el recibo, los
          campos de la foto, la firma afuera, los estados y un papel público con QR. La biblioteca de clase
          III y IV muestra el rótulo publicado y, en las modificaciones, el certificado. El formulario de
          carga sigue sin verse, así que no lo dibujaría.
        </p>
      </section>
      <Link href="/recorrido" className="btn mt-8">
        Volver al mostrador
      </Link>
    </article>
  );
}
