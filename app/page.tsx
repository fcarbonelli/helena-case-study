import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "La historia",
};

export default function Home() {
  return (
    <article className="mx-auto max-w-3xl">
      <p className="text-sm text-muted">Para entender el sistema antes de copiarlo</p>
      <h1 className="mt-2 font-serif text-4xl leading-tight">
        Helena es el mostrador donde una empresa le pide a ANMAT permiso para vender un producto médico.
      </h1>
      <p className="mt-4 text-lg leading-8 text-muted">
        ANMAT es la oficina nacional que controla medicamentos, alimentos y productos médicos. Un producto
        médico es una cosa que se usa en una persona por un motivo de salud y que no actúa como una pastilla:
        un andador, un termómetro, un análisis de sangre, un implante.
      </p>

      <section className="mt-10 grid gap-3 sm:grid-cols-3">
        <div className="border border-line bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Paso 1 · otro sistema</p>
          <h2 className="mt-1 font-serif text-xl">La empresa</h2>
          <p className="mt-2 text-sm leading-6">
            Primero el taller o el importador tiene que estar habilitado. Eso no se pide en Helena. Se pide en
            GHEMA, y para los de menos riesgo ahora también en THEMIS.
          </p>
        </div>
        <div className="border border-line bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Paso 2 · Helena</p>
          <h2 className="mt-1 font-serif text-xl">El producto</h2>
          <p className="mt-2 text-sm leading-6">
            Cada modelo se anota en un registro. Helena es la página para hacer ese pedido, adjuntar los papeles
            y seguir en qué estado está.
          </p>
        </div>
        <div className="border border-line bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-muted">Paso 3 · cinco años</p>
          <h2 className="mt-1 font-serif text-xl">Se puede vender</h2>
          <p className="mt-2 text-sm leading-6">
            Si ANMAT acepta, el producto queda autorizado cinco años. Después hay que renovar. Si cambia la
            marca, la planta o el rótulo, hay que avisarlo.
          </p>
        </div>
      </section>

      <h2 className="mt-12 font-serif text-3xl">Cómo llega alguien, antes de abrir Helena</h2>
      <p className="mt-3 leading-7">
        Helena no da de alta a la empresa. Cuando la persona entra, ANMAT ya la conoce. El camino, en orden,
        es este.
      </p>
      <ol className="mt-4 space-y-4 leading-7">
        <li>
          <strong className="font-medium">1. La empresa existe en AFIP.</strong> Tiene CUIT, estatuto y un
          domicilio. Eso es impositivo. Todavía no habilita a fabricar ni a importar un producto de salud.
        </li>
        <li>
          <strong className="font-medium">2. Pide usuario y clave de Pago electrónico.</strong> Manda un
          formulario firmado por el dueño, el apoderado o el responsable legal, más la constancia de AFIP. Se
          presenta en Informática de ANMAT o se manda escaneado a la mesa de ayuda. Esa clave abre varios
          sistemas del organismo. Helena usa esa misma clave. No crea otra cuenta.
        </li>
        <li>
          <strong className="font-medium">3. Se adhiere a Interbanking</strong> para poder pagar de verdad.
          En Pago electrónico arma un volante de pago. El banco lo cobra y queda un recibo. Ese número es el
          que después se tipea en Helena.
        </li>
        <li>
          <strong className="font-medium">4. La empresa se habilita para fabricar o importar.</strong> Para
          productos de menos riesgo (clases I y II, y análisis A y B) puede presentar una declaración jurada
          en THEMIS. El sistema le asigna un número de legajo. Igual tiene que poder mostrar que trabaja con
          buenas prácticas, y ANMAT puede ir a inspeccionar. Para riesgo alto el camino es la habilitación
          completa, en GHEMA, con inspección de la planta.
        </li>
        <li>
          <strong className="font-medium">5. Dos personas sacan firma digital</strong>, afuera de Helena: el
          representante legal y el director técnico. Firman con un programa aparte, el firmador de ANMAT.
        </li>
        <li>
          <strong className="font-medium">6. Recién ahí entran a Helena</strong>, con la clave de pagos, y
          piden autorización para un producto concreto.
        </li>
      </ol>

      <h2 className="mt-12 font-serif text-3xl">Qué hace Helena, y qué no hace</h2>
      <p className="mt-3 leading-7">
        Una disposición es una regla escrita por ANMAT. Helena no escribe esa regla. Helena es la ventanilla
        donde la empresa llena, con un formato fijo, el pedido que esa regla exige. El formato cambia según
        la clase del producto y según el pedido: alta, cambio, renovación o baja.
      </p>
      <p className="mt-3 leading-7">
        El registro es la lista oficial de productos que se pueden vender. Cada producto recibe un número,
        el PM. Helena arma el expediente de ese número: los datos, los PDF y los papeles adjuntos. Si ANMAT
        acepta, el papel queda en una biblioteca pública, con un código QR.
      </p>
      <p className="mt-3 leading-7">
        Reemplazar Helena, entonces, es reproducir esa ventanilla: qué dato y qué papel pide cada clase,
        en qué orden, y qué pasa con el trámite después. La lista de papeles está en los anexos de la
        disposición. La demo solo recorre el alta de clase I y II, que es el único camino del que tenemos
        fotos de pantalla.
      </p>

      <h2 className="mt-12 font-serif text-3xl">Por qué alguien entra a Helena</h2>
      <p className="mt-3 leading-7">
        La ley no deja circular libremente estos productos entre provincias, ni importarlos, sin estar en el
        registro. El hospital, la aduana o un inspector pueden pedir la constancia. Esa constancia es un PDF
        firmado por ANMAT, con un código QR. Helena es la máquina que arma el pedido de esa constancia.
      </p>
      <p className="mt-3 leading-7">
        Los perfumes y los productos de higiene personal van por otro mostrador de ANMAT. Helena atiende
        productos médicos. Algunas cosas que parecen de cosmética igual entran acá: lentes de contacto de
        fantasía, rellenos que se inyectan, equipos de láser o de liposucción.
      </p>

      <h2 className="mt-12 font-serif text-3xl">Quién hace qué</h2>
      <ul className="mt-3 space-y-3 leading-7">
        <li>
          <strong className="font-medium">La empresa</strong> carga los datos y sube los papeles. Entra con el
          mismo usuario con el que paga los aranceles, que son las tarifas de cada trámite.
        </li>
        <li>
          <strong className="font-medium">Dos personas firman</strong>, siempre las dos: el representante legal
          y el director técnico. La firma es digital y se hace con un programa aparte, el firmador de ANMAT.
          Helena no firma. Helena recibe el archivo ya firmado.
        </li>
        <li>
          <strong className="font-medium">Una persona de ANMAT</strong> lee el pedido, salvo en los productos
          más simples, donde alcanza con una declaración jurada y la constancia sale al recibirlo. Si algo no
          cierra, lo devuelve una vez para corregir. Si cierra, lo aprueba y pasa a una biblioteca pública.
        </li>
      </ul>

      <h2 className="mt-12 font-serif text-3xl">Las clases, sin números de ley</h2>
      <p className="mt-3 leading-7">
        ANMAT no mira un bajalengua con el mismo cuidado que un implante. A los productos médicos les pone una
        clase del I al IV. I es el riesgo más bajo. IV es el más alto. A los análisis de laboratorio, que se
        llaman IVD, les pone letras: A, B, C y D. Helena, por lo que dice el manual, registra las clases I a IV
        y los análisis A y B.
      </p>
      <p className="mt-3 leading-7">
        Cuanto más baja la clase, más corto es el camino. Hay un listado chico de clase I, cosas como andadores
        o sillas de ruedas manuales, que entra casi como una declaración jurada. El resto de la clase I y la
        clase II se revisan en unos 15 días hábiles. Las clases III y IV pueden tardar unos 110 días hábiles,
        porque ANMAT dicta una resolución y no alcanza con la declaración.
      </p>

      <section className="mt-12 border border-line bg-white p-5">
        <p className="text-xs uppercase tracking-wide text-mid">Propuesta</p>
        <h2 className="mt-1 font-serif text-3xl">Una sola ventanilla</h2>
        <p className="mt-3 leading-7">
          Helena es de ANMAT. La hizo su área de informática y vive en una dirección del organismo. Aun así
          es otra pantalla, al lado de la caja, al lado del sistema que habilita la empresa y al lado del
          que sirve para importar. El mismo dibujo se repite en medicamentos, alimentos y cosméticos: una
          caja compartida, y un escritorio distinto para cada rubro.
        </p>
        <p className="mt-3 leading-7">
          El salto se siente de más. Al pagar, la empresa ya eligió el trámite: alta, cambio o renovación;
          nacional o importado; grupo de riesgo. La caja podría abrir el formulario en el acto. Hoy entrega
          un número y manda a otra página a empezar de nuevo.
        </p>
        <p className="mt-3 leading-7">
          Una cuenta única de empresa ya tendría el CUIT, la razón social, el legajo, el domicilio y quiénes
          firman. Helena hoy hereda el CUIT y la razón social de la clave de Pago electrónico, y después
          vuelve a preguntar legajo, dirección y teléfono. La clave fiscal es la de AFIP. La clave que este
          circuito reutiliza es la de la caja de ANMAT.
        </p>
        <p className="mt-3 leading-7">
          Unificar saca el salto y la repetición de los datos de la empresa. El producto sigue siendo nuevo
          en cada pedido: nombre, marca, número de PM y los papeles de esa clase. Alguien de ANMAT sigue
          leyendo los de más riesgo. En 2019 la propia norma decía que la puerta de entrada iba a ser
          Trámites a Distancia. En 2020 eso no había ocurrido, y en 2026 la página oficial sigue listando
          Helena, GHEMA, THEMIS, BONITA y ARGOS como accesos separados.
        </p>
      </section>

      <h2 className="mt-12 font-serif text-3xl">Palabras que aparecieron en el informe</h2>
      <dl className="mt-4 divide-y divide-line border-y border-line">
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
          <dt className="font-medium">Captura</dt>
          <dd className="text-muted">Una foto de la pantalla, metida dentro del PDF del manual.</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
          <dt className="font-medium">Disposición</dt>
          <dd className="text-muted">Una regla que dicta ANMAT. Funciona como la norma de ese trámite.</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
          <dt className="font-medium">Artículo</dt>
          <dd className="text-muted">Un párrafo numerado de esa regla. «Artículo 9» es el párrafo 9, nada más.</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
          <dt className="font-medium">Arancel y recibo</dt>
          <dd className="text-muted">La tarifa del trámite, y el número que te dan al pagarla. Ese número se tipea en Helena.</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
          <dt className="font-medium">Legajo</dt>
          <dd className="text-muted">El número de expediente de la empresa. El del producto se arma a partir de ese.</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
          <dt className="font-medium">PM</dt>
          <dd className="text-muted">El número del producto en el registro. En la biblioteca se ve como 129-232.</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
          <dt className="font-medium">Borrador / Enviado</dt>
          <dd className="text-muted">Borrador es el pedido a medio hacer. Enviado es el momento en que ANMAT lo da por presentado.</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
          <dt className="font-medium">Reválida</dt>
          <dd className="text-muted">La renovación, cada cinco años.</dd>
        </div>
        <div className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr]">
          <dt className="font-medium">Biblioteca</dt>
          <dd className="text-muted">La lista pública de los productos ya aprobados. Se mira sin usuario.</dd>
        </div>
      </dl>

      <h2 className="mt-12 font-serif text-3xl">Qué hace la demo</h2>
      <p className="mt-3 leading-7">
        Recorre el único camino del que tenemos las pantallas: registrar un producto de clase I o II. Al lado
        de cada paso dice si eso está en el manual, si lo estamos suponiendo, o si directamente nos falta. Los
        otros trámites existen y están nombrados, pero la demo no inventa sus formularios.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/recorrido" className="btn">
          Entrar al mostrador
        </Link>
        <Link href="/faltantes" className="btn-sec">
          Ver qué no pudimos copiar
        </Link>
      </div>
    </article>
  );
}
