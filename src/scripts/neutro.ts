/**
 * Fuera de Argentina, la landing habla en neutro: «tú» en vez de «vos» y sin
 * argentinismos (Francisco, 11/11/2026). El HTML queda en rioplatense —es lo
 * que ve Google y el mercado es Argentina— y esto lo cambia en el navegador.
 *
 * Es un diccionario de palabras enteras, no reglas: el voseo no se pasa a «tú»
 * con una regla («pedís» → «pides», «movés» → «mueves», «poné» → «pon»).
 * Si se agrega texto nuevo con voseo, sumarlo acá. Las formas que son iguales
 * en las dos (subjuntivo: «quieras», «trabajes») no hacen falta.
 */

// Frases primero (dependen de la palabra de al lado).
const FRASES: [string, string][] = [
  ['con vos', 'contigo'],
  ['a vos', 'a ti'],
  ['de vos', 'de ti'],
  ['para vos', 'para ti'],
  ['por vos', 'por ti'],
  ['la plata', 'el dinero'],
  ['con el mate', 'con un café'],
];

const PALABRAS: Record<string, string> = {
  vos: 'tú',
  plata: 'dinero',

  // Presente
  aceptás: 'aceptas', atendés: 'atiendes', cargás: 'cargas', cobrás: 'cobras',
  comprás: 'compras', conectás: 'conectas', confirmás: 'confirmas', contratás: 'contratas',
  creás: 'creas', crecés: 'creces', distribuís: 'distribuyes', empezás: 'empiezas',
  entrás: 'entras', escribís: 'escribes', fabricás: 'fabricas', hacés: 'haces',
  llenás: 'llenas', llevás: 'llevas', mandás: 'mandas', mirás: 'miras',
  movés: 'mueves', necesitás: 'necesitas', operás: 'operas', pagás: 'pagas',
  pasás: 'pasas', pedís: 'pides', podés: 'puedes', preferís: 'prefieres',
  prendés: 'prendes', querés: 'quieres', registrás: 'registras', repartís: 'repartes',
  sabés: 'sabes', seguís: 'sigues', sospechás: 'sospechas', subís: 'subes',
  tenés: 'tienes', terminás: 'terminas', tomás: 'tomas', trabajás: 'trabajas',
  usás: 'usas', vendés: 'vendes', vinculás: 'vinculas', decís: 'dices',
  sos: 'eres', andás: 'andas', ponés: 'pones', elegís: 'eliges', recibís: 'recibes',

  // Imperativo
  ajustá: 'ajusta', calculá: 'calcula', cobrá: 'cobra', completá: 'completa',
  conocé: 'conoce', dejá: 'deja', elegí: 'elige', empezá: 'empieza',
  escribí: 'escribe', mirá: 'mira', ordená: 'ordena', pagá: 'paga',
  pasá: 'pasa', pedí: 'pide', poné: 'pon', preguntá: 'pregunta',
  priorizá: 'prioriza', probá: 'prueba', recibí: 'recibe', registrá: 'registra',
  sumá: 'suma', tocá: 'toca', sabé: 'sabe', fijate: 'fíjate', andá: 've',
  vení: 'ven', contá: 'cuenta', descargá: 'descarga', instalá: 'instala',
  hablá: 'habla', escribinos: 'escríbenos', avisame: 'avísame', avisanos: 'avísanos',
  probalo: 'pruébalo', probala: 'pruébala', descargala: 'descárgala', descargalo: 'descárgalo',
  bajate: 'descarga', bajala: 'descárgala', pasanos: 'pásanos', dejanos: 'déjanos',
  miralo: 'míralo', mirala: 'mírala', contanos: 'cuéntanos', decinos: 'dinos',
  pedile: 'pídele', mandanos: 'mándanos', llamanos: 'llámanos', sumate: 'súmate',
};

const L = '\\p{L}';
const escapar = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const claves = [...FRASES.map(([a]) => a), ...Object.keys(PALABRAS)]
  .sort((a, b) => b.length - a.length)
  .map((k) => escapar(k).replace(/ /g, '\\s+'));
const PATRON = new RegExp(`(?<![${L}])(?:${claves.join('|')})(?![${L}])`, 'giu');
const MAPA = new Map<string, string>([...FRASES, ...Object.entries(PALABRAS)]);

/** Respeta mayúsculas: «Vos» → «Tú», «PODÉS» → «PUEDES». */
function comoEl(original: string, nuevo: string): string {
  if (original.length > 1 && original === original.toUpperCase()) return nuevo.toUpperCase();
  if (original[0] !== original[0].toLowerCase()) return nuevo[0].toUpperCase() + nuevo.slice(1);
  return nuevo;
}

/** Pasa un texto de rioplatense a neutro. */
export function neutro(texto: string): string {
  return texto.replace(PATRON, (m) => {
    const nuevo = MAPA.get(m.toLowerCase().replace(/\s+/g, ' '));
    return nuevo === undefined ? m : comoEl(m, nuevo);
  });
}

const SALTEAR = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE']);
const ATRIBUTOS = ['alt', 'title', 'placeholder', 'aria-label', 'data-usd'];

function nodoTexto(n: Text) {
  const p = n.parentElement;
  if (!p || SALTEAR.has(p.tagName)) return;
  const t = n.data;
  const nuevo = neutro(t);
  if (nuevo !== t) n.data = nuevo;
}

function elemento(el: Element) {
  for (const a of ATRIBUTOS) {
    const v = el.getAttribute(a);
    if (v) {
      const nuevo = neutro(v);
      if (nuevo !== v) el.setAttribute(a, nuevo);
    }
  }
}

function recorrer(raiz: Node) {
  if (raiz.nodeType === Node.TEXT_NODE) return nodoTexto(raiz as Text);
  if (raiz.nodeType !== Node.ELEMENT_NODE) return;
  const el = raiz as Element;
  if (SALTEAR.has(el.tagName)) return;
  elemento(el);
  el.querySelectorAll(ATRIBUTOS.map((a) => `[${a}]`).join(',')).forEach(elemento);
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) nodoTexto(n as Text);
}

/** Pasa la página a neutro y sigue haciéndolo con lo que se agregue después. */
export function pasarANeutro() {
  document.documentElement.lang = 'es';
  document.title = neutro(document.title);
  recorrer(document.body);
  // Textos que pone el JS más tarde (formularios, calculadora, etc.).
  new MutationObserver((cambios) => {
    for (const c of cambios) {
      if (c.type === 'characterData') nodoTexto(c.target as Text);
      else if (c.type === 'attributes') elemento(c.target as Element);
      else c.addedNodes.forEach(recorrer);
    }
  }).observe(document.body, {
    subtree: true, childList: true, characterData: true,
    attributes: true, attributeFilter: ATRIBUTOS,
  });
}
