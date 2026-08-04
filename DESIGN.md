# Design

El mundo visual de este sitio es **el envase**: un bidón de 20 litros de
policarbonato azul a contraluz, con su etiqueta de papel pegada, su precinto
amarillo y su letra legal. No es una metáfora decorativa — es el sistema: cada
decisión de color, tipografía y composición sale de ese objeto.

**La tesis:** la página ES el envase. Por eso rechaza el hero centrado con un
mockup flotando y las tres tarjetas con ícono. Acá el contenido vive
serigrafiado sobre el plástico o impreso en la etiqueta, nunca en cards.

Semilla de la dirección: `e0888601` (queda en el comentario de contrato, primer
hijo del `<body>` en `src/layouts/Base.astro`).

## Los dos materiales

Hay dos, y sólo dos. Todo el sitio alterna entre ellos.

**Plástico** — el fondo azul profundo. Ahí van los titulares grandes en blanco
serigrafiado, las burbujas que suben y las gotas de condensación. Es donde el
sitio grita.

**Etiqueta** — papel frío casi blanco (`.etiqueta`), esquinas redondeadas y
sombra blanda y difusa. Ahí va todo lo que hay que leer de verdad: la ficha, el
contenido, la tabla comparativa, el panel del plan.

## Color

Estrategia: **empapado**. El azul no es un acento, es la superficie.

| Token | Valor | Para qué |
|---|---|---|
| `--color-pc-950…100` | `#02101F` → `#C9E9FB` | El policarbonato, del fondo del envase a la luz que lo atraviesa |
| `--color-label-50…300` | `#FFFFFF` → `#C7D6E3` | El papel de la etiqueta. **Frío, nunca crema** |
| `--color-ink` / `--color-inksoft` | `#08121C` / `#40566B` | La tinta legal |
| `--color-luz` | `#9BDDFA` | La luz del agua: lo poco que resalta |

**No entra ni un color de afuera del envase.** La acción no tiene color propio:
**es el otro material**. Sobre el plástico azul, el botón es un óvalo de papel
blanco con tinta negra (`.precinto`); sobre la etiqueta blanca se da vuelta y es
tinta con letra blanca (`.precinto-tinta`). Cuando el header se vuelve papel, su
botón se invierte solo. Si aparece un color nuevo para "resaltar" algo, está mal:
lo que resalta es el contraste entre los dos materiales.

**Nada tiene esquina viva.** Paneles en `--radius-panel` (1,75rem), piezas
chicas en `--radius-pieza`, botones en píldora, sombras difusas y bajas. Es el
mismo redondeo que la app: un envase es curvo y el software también.

Es claro y saturado a propósito: esto se lee en un celular, parado al lado del
camión, con sol pleno. Cualquier texto chico va como mínimo en `/85`; por debajo
de eso no se lee afuera. (Fue un hallazgo real de revisión: había textos en
`/55`–`/70` que daban 2,7:1.)

## Tipografía

**Archivo variable, una sola familia, tres anchos.** Es la disciplina real del
packaging: la marca va ancha y pesada, la letra legal angosta y chica, y nada
más entra en el envase.

| Clase | Ejes | Uso |
|---|---|---|
| `.t-marca` | `wdth 115`, `wght 800`, tracking `-0.032em` | Titulares y cifras grandes |
| (cuerpo) | `wdth 100` | Texto corrido, medida 46–54ch |
| `.t-legal` | `wdth 84`, `wght 600`, tracking `0.14em`, versalitas | Etiquetas, pies, nav, botones |
| `.t-dato` | `wght 700`, cifras tabulares | Números y nombres de dato |

`.serigrafia` agrega la mordida de luz que tiene la tinta blanca apoyada sobre
un plástico curvo. Sólo sobre el azul.

Gotcha: el peso se pide **sólo** por `font-variation-settings` y el body tiene
`font-synthesis-weight: none`. Si Google Fonts no carga, toda la jerarquía cae a
peso 400 del sistema, sin negrita sintética que la salve.

## Composición

- La primera pantalla es el bidón, no un encabezado. `src/components/Bidon.astro`
  lo dibuja entero (tapa, precinto, cuello, hombro cónico, cuerpo acanalado, su
  etiqueta impresa y el "20 L" grabado) con el agua adentro sobre un `clipPath`.
- Los módulos **no** son tarjetas: son la lista de contenido de una etiqueta,
  apretada, con renglones (`.rayado`).
- El precio **no** es una tabla de planes: es el panel de información del
  envase, con su filete grueso arriba y "Porción: 1 distribuidora".
- Las capturas de la app van grandes, una por fila. En el celular se acercan
  (`acercarEnCelular` en `VideoTile`) porque son pantallas de 1440 px y a 350 px
  la letra de la app queda en 5 px y no prueba nada.

## Movimiento

**Un solo momento animado: el agua sube.** El scroll escribe `--nivel` (0 → 1)
sobre `.envase` y el SVG hace el resto. Alrededor, burbujas lentas y tenues
(`Burbujas.astro`) que son lo que hace que el azul se lea como agua y no como un
fondo azul cualquiera.

Todo lo demás es una aparición sobria al entrar en pantalla (`expo.out`, 22 px).

Reglas que no se rompen:

- El hero **no** lleva `data-reveal`. Es el elemento más grande de la primera
  pantalla: si arranca en `opacity: 0` esperando a GSAP, en un celular barato la
  página se ve vacía hasta que carga el script — y si el script falla, para
  siempre.
- Con `prefers-reduced-motion`, `animations.ts` corta antes de animar y muestra
  todo a mano. Hace falta hacerlo con `gsap.set`: el `@media` del stylesheet no
  le gana a un estilo inline.
- El scroll suave del nav está animado a mano con `requestAnimationFrame`. El
  nativo se anula justamente cuando el sistema pide menos movimiento.

## Gotchas

- **`overflow-x: hidden` va en `html` Y en `body`.** Con sólo `body`, un hijo
  más ancho que la pantalla ensancha el documento entero y los elementos
  `fixed` se dimensionan contra eso: la barra de arriba se estiraba a 687 px en
  un celular de 390 y el botón de acción quedaba fuera de pantalla.
- Cualquier hijo de grilla que pueda recibir texto largo necesita `min-w-0`.
  Una dirección web sin espacios (`tu-empresa.aquaenvio.com`) empujaba la
  columna y `overflow-hidden` se comía las letras en silencio.
- **Los enlaces internos llevan barra final.** GitHub Pages responde 301 sin
  ella y Google deja de indexar. Las páginas nuevas se suman **a mano** a
  `public/sitemap.xml`.
- `public/images/og.jpg` se regenera del hero real con Playwright (1200×630).
  Si cambia el diseño, hay que volver a generarla o el preview de WhatsApp
  muestra la landing vieja.

## Lo que este mundo no hace

Sin colores de acento traídos de afuera del envase. Sin degradados en el texto.
Sin vidrio esmerilado de adorno. Sin sombras duras sin blur. Sin emojis como
íconos. Sin bordes de color de 4 px al costado de una card. Sin numeritos
01/02/03 salvo que el orden sea información. Sin antetítulos arriba de un
titular: el titular se banca solo.
