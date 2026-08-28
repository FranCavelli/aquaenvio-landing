/**
 * Genera los logos de las distribuidoras del carrusel "Confían en Aquaenvio"
 * (componente src/components/Logos.astro).
 *
 * Aguas del Parque y Alaska son clientes REALES; el resto son marcas de muestra
 * inventadas para el carrusel. Editar el array `logos` y volver a correr.
 * Cada logo se dibuja como SVG (marca + wordmark) y se exporta a PNG con
 * FONDO TRANSPARENTE, recortado al contenido y normalizado en altura.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Correr con: node scripts/logos.mjs
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images', 'logos');
mkdirSync(OUT, { recursive: true });

/* ───────────── Marcas (todas dibujadas en una caja de 100×100) ───────────── */

const DROP = 'M50 8C50 8 18 45 18 64a32 32 0 0 0 64 0C82 45 50 8 50 8Z';

const marcas = {
  // Gota partida en dos tonos (Aguas del Parque)
  gotaDuo: (a, b) => `
    <path d="${DROP}" fill="${a}"/>
    <path d="M50 8C50 8 18 45 18 64a32 32 0 0 0 32 32Z" fill="${b}"/>`,

  gota: (a) => `<path d="${DROP}" fill="${a}"/>`,

  gotaLinea: (a) => `<path d="${DROP}" fill="none" stroke="${a}" stroke-width="9"/>`,

  // Montaña nevada
  montana: (a, b) => `
    <path d="M4 86 36 30 56 62 72 36 96 86Z" fill="${a}"/>
    <path d="M36 30 25 50h22Z" fill="${b}"/>
    <path d="M72 36 63 52h18Z" fill="${b}"/>`,

  // Tres olas
  olas: (a, b) => `
    <path d="M6 38q12-14 24 0t24 0 24 0" fill="none" stroke="${a}" stroke-width="9" stroke-linecap="round"/>
    <path d="M6 58q12-14 24 0t24 0 24 0" fill="none" stroke="${b}" stroke-width="9" stroke-linecap="round"/>
    <path d="M6 78q12-14 24 0t24 0 24 0" fill="none" stroke="${a}" stroke-width="9" stroke-linecap="round"/>`,

  // Olas dentro de un círculo
  circuloOlas: (a, b) => `
    <circle cx="50" cy="50" r="44" fill="${a}"/>
    <path d="M12 52q10-12 20 0t20 0 20 0v34a44 44 0 0 1-60 0Z" fill="${b}" opacity=".95"/>`,

  // Camioncito de reparto
  camion: (a, b) => `
    <rect x="4" y="30" width="52" height="38" rx="6" fill="${a}"/>
    <path d="M58 42h18l16 16v10H58Z" fill="${b}"/>
    <circle cx="26" cy="76" r="11" fill="${a}"/><circle cx="26" cy="76" r="4.5" fill="#fff"/>
    <circle cx="72" cy="76" r="11" fill="${b}"/><circle cx="72" cy="76" r="4.5" fill="#fff"/>`,

  // Copo de nieve
  copo: (a, b) => {
    const brazos = [0, 60, 120].map((g) => `
      <g transform="rotate(${g} 50 50)">
        <path d="M50 8v84" stroke="${a}" stroke-width="9" stroke-linecap="round"/>
        <path d="M50 26 38 16M50 26l12-10M50 74 38 84M50 74l12 10" stroke="${b}" stroke-width="7" stroke-linecap="round" fill="none"/>
      </g>`).join('');
    return brazos;
  },

  // Gota con hoja
  gotaHoja: (a, b) => `
    <path d="${DROP}" fill="${a}"/>
    <path d="M50 82c0-18 8-30 22-36-2 20-9 31-22 36Z" fill="${b}"/>`,

  // Sol y gota
  solGota: (a, b) => `
    <circle cx="38" cy="36" r="19" fill="${b}"/>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((g) => `<path d="M38 6v9" stroke="${b}" stroke-width="7" stroke-linecap="round" transform="rotate(${g} 38 36)"/>`).join('')}
    <path d="${DROP}" fill="${a}" transform="translate(38 34) scale(.62)"/>`,

  // Ondas concéntricas
  ondas: (a, b) => `
    <circle cx="50" cy="50" r="9" fill="${a}"/>
    <path d="M50 24a26 26 0 0 1 0 52" fill="none" stroke="${b}" stroke-width="8" stroke-linecap="round"/>
    <path d="M50 8a42 42 0 0 1 0 84" fill="none" stroke="${a}" stroke-width="8" stroke-linecap="round"/>
    <path d="M50 76a26 26 0 0 1 0-52" fill="none" stroke="${b}" stroke-width="8" stroke-linecap="round" opacity=".45"/>`,

  // Tanque / aljibe (torre de agua)
  tanque: (a, b) => `
    <ellipse cx="50" cy="20" rx="28" ry="8" fill="${b}"/>
    <path d="M22 20h56v26c0 12-10 20-28 20s-28-8-28-20Z" fill="${a}"/>
    <path d="M34 62 24 94M66 62l10 32M30 80h40" fill="none" stroke="${a}" stroke-width="8" stroke-linecap="round"/>`,

  // Vaso servido
  fuente: (a, b) => `
    <path d="M24 14h52l-7 66c-.8 8-8 14-19 14s-18-6-19-14Z" fill="${a}"/>
    <path d="M29 46h42l-4 34c-.6 7-7 12-17 12s-16-5-17-12Z" fill="${b}"/>
    <path d="M50 2c0 0-8 10-8 15a8 8 0 0 0 16 0c0-5-8-15-8-15Z" fill="${b}"/>`,

  // Hexágono con gota calada
  hexagono: (a, b) => `
    <path d="M50 4 91 27v46L50 96 9 73V27Z" fill="${a}"/>
    <path d="${DROP}" fill="${b}" transform="translate(28 24) scale(.44)"/>`,

  // Valle con gota
  valle: (a, b) => `
    <path d="M50 6c0 0-16 20-16 30a16 16 0 0 0 32 0C66 26 50 6 50 6Z" fill="${b}"/>
    <path d="M2 92 30 52l18 24 16-20 32 36Z" fill="${a}"/>`,

  // Sierras
  sierras: (a, b) => `
    <path d="M4 84q22-40 44 0Z" fill="${b}"/>
    <path d="M32 84q26-52 64 0Z" fill="${a}"/>
    <path d="${DROP}" fill="${b}" transform="translate(58 2) scale(.34)"/>`,

  // Iceberg
  iceberg: (a, b) => `
    <path d="M50 8 84 52H16Z" fill="${a}"/>
    <path d="M16 60h68L60 94H40Z" fill="${b}"/>`,

  // Río
  rio: (a, b) => `
    <path d="M22 8c0 26 40 22 40 44S22 68 22 92" fill="none" stroke="${a}" stroke-width="16" stroke-linecap="round"/>
    <path d="M78 26c0 18-24 16-24 30" fill="none" stroke="${b}" stroke-width="9" stroke-linecap="round"/>`,

  // Bidón
  bidon: (a, b) => `
    <path d="M40 6h20v12H40Z" fill="${b}"/>
    <path d="M34 18h32c10 0 16 8 16 18v46c0 8-6 12-14 12H32c-8 0-14-4-14-12V36c0-10 6-18 16-18Z" fill="${a}"/>
    <path d="M22 56q14-12 28 0t28 0v26c0 6-4 10-12 10H34c-8 0-12-4-12-10Z" fill="${b}" opacity=".85"/>`,

  // Horizonte de la pampa con gota
  horizonte: (a, b) => `
    <path d="M8 74h84M18 88h64" stroke="${b}" stroke-width="8" stroke-linecap="round"/>
    <path d="${DROP}" fill="${a}" transform="translate(22 -4) scale(.58)"/>`,

  // Diamante con gota
  diamante: (a, b) => `
    <path d="M50 4 96 50 50 96 4 50Z" fill="${a}"/>
    <path d="${DROP}" fill="${b}" transform="translate(28 22) scale(.44)"/>`,

  // Manantial: agua brotando (loma + gotas que saltan)
  manantial: (a, b) => `
    <path d="M14 92a36 36 0 0 1 72 0Z" fill="${a}"/>
    <path d="M50 8c0 0-11 13-11 21a11 11 0 0 0 22 0c0-8-11-21-11-21Z" fill="${b}"/>
    <path d="M22 34c0 0-8 9-8 15a8 8 0 0 0 16 0c0-6-8-15-8-15Z" fill="${b}" opacity=".8"/>
    <path d="M78 34c0 0-8 9-8 15a8 8 0 0 0 16 0c0-6-8-15-8-15Z" fill="${b}" opacity=".8"/>`,

  // Ola sólida en cuadrado redondeado
  olaBloque: (a, b) => `
    <rect x="4" y="4" width="92" height="92" rx="24" fill="${a}"/>
    <path d="M4 56q14-16 28 0t28 0 28 0v16a24 24 0 0 1-24 24H28A24 24 0 0 1 4 72Z" fill="${b}"/>`,
};

/* ───────────────────────── Definición de cada logo ───────────────────────── */
// real: se marca solo para saber cuáles no son inventados.

const logos = [
  {
    slug: 'aguas-del-parque',
    real: true,
    marca: marcas.gotaDuo('#1d4ea8', '#4aa8d8'),
    linea1: { txt: 'aguas del parque', font: 'Candara', weight: 700, size: 62, fill: '#12466f', ls: -1 },
    linea2: { txt: 'AGUA DE MESA ENVASADA', font: 'Segoe UI', weight: 600, size: 20, fill: '#5b93b8', ls: 4.5 },
  },
  {
    slug: 'alaska',
    real: true,
    marca: marcas.montana('#1e6fb8', '#bfe3f7'),
    linea1: { txt: 'ALASKA', font: 'Bahnschrift', weight: 700, size: 68, fill: '#123a63', ls: 4 },
    linea2: { txt: 'AGUA PURA · BIDONES', font: 'Segoe UI', weight: 600, size: 19, fill: '#4d8fbf', ls: 4 },
  },
  {
    slug: 'cristal-andino',
    marca: marcas.diamante('#0e7490', '#e0f7ff'),
    linea1: { txt: 'Cristal Andino', font: 'Constantia', weight: 700, size: 60, fill: '#0b3d52', ls: -0.5 },
    linea2: { txt: 'AGUA DE MONTAÑA', font: 'Segoe UI', weight: 600, size: 19, fill: '#3f8ea3', ls: 4 },
  },
  {
    slug: 'manantial-sur',
    marca: marcas.manantial('#0f766e', '#34b3a0'),
    linea1: { txt: 'Manantial Sur', font: 'Segoe UI', weight: 700, size: 62, fill: '#0f4a45', ls: -1.5 },
  },
  {
    slug: 'agua-viva',
    marca: marcas.gotaHoja('#1e88c7', '#63b845'),
    linea1: { txt: 'AGUA VIVA', font: 'Century Gothic', weight: 700, size: 62, fill: '#1a5f8a', ls: 1 },
  },
  {
    slug: 'bidon-express',
    marca: marcas.camion('#f97316', '#0f4c81'),
    linea1: { txt: 'Bidón Express', font: 'Franklin Gothic Medium', weight: 400, size: 62, fill: '#0f4c81', ls: -0.5 },
    linea2: { txt: 'REPARTO A DOMICILIO', font: 'Segoe UI', weight: 600, size: 19, fill: '#f97316', ls: 4 },
  },
  {
    slug: 'nieve-azul',
    marca: marcas.copo('#2a7fd4', '#7ec4ee'),
    linea1: { txt: 'Nieve Azul', font: 'Corbel', weight: 700, size: 64, fill: '#1c4f86', ls: -0.5 },
  },
  {
    slug: 'la-vertiente',
    marca: marcas.circuloOlas('#0b3d63', '#38a3d1'),
    linea1: { txt: 'LA VERTIENTE', font: 'Bahnschrift', weight: 700, size: 58, fill: '#0b3d63', ls: 2.5 },
    linea2: { txt: 'DISTRIBUIDORA DE AGUA', font: 'Segoe UI', weight: 600, size: 18, fill: '#5b93b8', ls: 3.5 },
  },
  {
    slug: 'aguas-del-litoral',
    marca: marcas.olas('#0e7ea8', '#41bfd6'),
    linea1: { txt: 'Aguas del Litoral', font: 'Cambria', weight: 700, size: 52, fill: '#0d5a76', ls: -0.5 },
  },
  {
    slug: 'puro-norte',
    marca: marcas.solGota('#1876b8', '#f4a72c'),
    linea1: { txt: 'PURO NORTE', font: 'Segoe UI', weight: 700, size: 58, fill: '#1a4f7a', ls: 2 },
    linea2: { txt: 'AGUA Y SODA', font: 'Segoe UI', weight: 600, size: 19, fill: '#d18d1e', ls: 5 },
  },
  {
    slug: 'ondina',
    marca: marcas.ondas('#4f46e5', '#22a3e0'),
    linea1: { txt: 'ondina', font: 'Century Gothic', weight: 700, size: 70, fill: '#312e81', ls: 1 },
    linea2: { txt: 'AGUA PARA TU OFICINA', font: 'Segoe UI', weight: 600, size: 18, fill: '#6366f1', ls: 3.5 },
  },
  {
    slug: 'el-aljibe',
    marca: marcas.tanque('#155e75', '#8bbfd0'),
    linea1: { txt: 'El Aljibe', font: 'Book Antiqua', weight: 700, size: 64, fill: '#123e50', ls: 0 },
    linea2: { txt: 'AGUA ENVASADA DESDE 1998', font: 'Segoe UI', weight: 600, size: 17, fill: '#4d879b', ls: 3 },
  },
  {
    slug: 'fuente-clara',
    marca: marcas.fuente('#2563eb', '#7cc3f0'),
    linea1: { txt: 'Fuente Clara', font: 'Georgia', weight: 700, size: 60, fill: '#1e3a8a', ls: -0.5 },
  },
  {
    slug: 'agualina',
    marca: marcas.gota('#0891b2'),
    linea1: { txt: 'agualina', font: 'Segoe UI', weight: 300, size: 72, fill: '#0e5a70', ls: 2 },
    linea2: { txt: 'BIDONES · DISPENSERS', font: 'Segoe UI', weight: 600, size: 18, fill: '#38a0b8', ls: 4 },
  },
  {
    slug: 'aguas-pampa',
    marca: marcas.horizonte('#1d6fa5', '#86ae4a'),
    linea1: { txt: 'AGUAS PAMPA', font: 'Bahnschrift', weight: 700, size: 58, fill: '#1c4c6b', ls: 2 },
  },
  {
    slug: 'torrente',
    marca: marcas.olaBloque('#0b4f8a', '#5fc4f0'),
    linea1: { txt: 'TORRENTE', font: 'Arial Black', weight: 400, size: 58, fill: '#0b4f8a', ls: -1 },
  },
  {
    slug: 'hidropack',
    marca: marcas.hexagono('#0f4c81', '#7fd4f5'),
    linea1: { txt: 'HidroPack', font: 'Trebuchet MS', weight: 700, size: 62, fill: '#0f4c81', ls: -0.5 },
    linea2: { txt: 'AGUA PARA EMPRESAS', font: 'Segoe UI', weight: 600, size: 18, fill: '#4b8fb5', ls: 3.5 },
  },
  {
    slug: 'agua-del-valle',
    marca: marcas.valle('#166534', '#3fa7dd'),
    linea1: { txt: 'Agua del Valle', font: 'Candara', weight: 700, size: 62, fill: '#14532d', ls: -0.5 },
  },
  {
    slug: 'aguas-serranas',
    marca: marcas.sierras('#0d5f73', '#4fb3c9'),
    linea1: { txt: 'Aguas Serranas', font: 'Corbel', weight: 700, size: 60, fill: '#0d4a5a', ls: -0.5 },
  },
  {
    slug: 'glaciar',
    marca: marcas.iceberg('#39b5e8', '#0e6ba8'),
    linea1: { txt: 'GLACIAR', font: 'Bahnschrift', weight: 700, size: 70, fill: '#0e6ba8', ls: 6 },
  },
  {
    slug: 'rio-claro',
    marca: marcas.rio('#0ea5c4', '#93d8e8'),
    linea1: { txt: 'Río Claro', font: 'Constantia', weight: 700, size: 66, fill: '#0b5c73', ls: -0.5 },
    linea2: { txt: 'AGUA DE MESA', font: 'Segoe UI', weight: 600, size: 19, fill: '#3f9fb5', ls: 5 },
  },
  {
    slug: 'aquabid',
    marca: marcas.bidon('#1c7ed6', '#a5dbf7'),
    linea1: { txt: 'AquaBid', font: 'Segoe UI', weight: 700, size: 66, fill: '#14548f', ls: -1 },
    linea2: { txt: 'DISTRIBUIDORA', font: 'Segoe UI', weight: 600, size: 19, fill: '#4b9ed6', ls: 5 },
  },
];

/* ────────────────────────────── Armado del SVG ───────────────────────────── */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function texto(t, x, y) {
  return `<text x="${x}" y="${y}" font-family="${t.font}" font-size="${t.size}" font-weight="${t.weight}"
    letter-spacing="${t.ls ?? 0}" fill="${t.fill}" xml:space="preserve">${esc(t.txt)}</text>`;
}

function svgDe(logo) {
  const W = 1400;
  const H = 260;
  const x = 175; // arranque del texto (la marca ocupa 40..140)
  const cuerpo = logo.linea2
    ? texto(logo.linea1, x, 138) + texto(logo.linea2, x, 182)
    : texto(logo.linea1, x, 155);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <g transform="translate(30 68) scale(1.05)">${logo.marca}</g>
    ${cuerpo}
  </svg>`;
}

/* ──────────────────────────────── Render ─────────────────────────────────── */

const ALTO = 140; // alto final del PNG (se muestra a 28-56 px → nítido en retina)

for (const logo of logos) {
  const svg = svgDe(logo);
  const base = await sharp(Buffer.from(svg), { density: 300 }).png().toBuffer();
  const recortado = await sharp(base)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 0 })
    .toBuffer();
  const meta = await sharp(recortado).metadata();
  const destino = join(OUT, `${logo.slug}.png`);
  await sharp(recortado)
    .resize({ height: ALTO, fit: 'inside', withoutEnlargement: false })
    .extend({ top: 6, bottom: 6, left: 8, right: 8, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, palette: true, colors: 48, effort: 10, dither: 0.4 })
    .toFile(destino);
  const fin = await sharp(destino).metadata();
  console.log(`${logo.slug.padEnd(20)} ${meta.width}x${meta.height} → ${fin.width}x${fin.height}`);
}

console.log(`\n${logos.length} logos en ${OUT}`);
