/**
 * Fuera de Argentina, la landing muestra los precios en dólares, desde US$10
 * (Francisco, 05/11/2026), y habla en neutro en vez de con voseo (11/11/2026,
 * ver scripts/neutro.ts). Lo usan todas las páginas (los dos layouts).
 *
 * - El país lo dice Cloudflare en /cdn-cgi/trace (`loc=AR`); se guarda en la
 *   sesión para no volver a preguntar en cada página.
 * - Si no se sabe el país, o es un buscador, se queda en pesos: el mercado es
 *   Argentina y Google no tiene que indexar la landing en dólares.
 * - En el HTML va el texto en pesos y, en `data-usd`, el de dólares. Si el
 *   visitante es de afuera se cambia uno por otro y `<html>` queda con
 *   `data-moneda="usd"` (para lo que se tenga que esconder por CSS).
 */
import { pasarANeutro } from './neutro';

export const PISO_USD = 10;

const CLAVE = 'aqua-pais';
const BUSCADOR = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview|lighthouse/i;

let promesa: Promise<boolean> | null = null;

/** true si el visitante está fuera de Argentina (y no es un buscador). */
export function enDolares(): Promise<boolean> {
  if (promesa) return promesa;
  promesa = (async () => {
    if (BUSCADOR.test(navigator.userAgent)) return false;
    let pais: string | null = null;
    // Para ver la landing como de afuera: aquaenvio.com/?pais=CL (?pais=AR vuelve).
    const forzado = new URLSearchParams(location.search).get('pais');
    if (forzado && /^[A-Za-z]{2}$/.test(forzado)) {
      try { sessionStorage.setItem(CLAVE, forzado.toUpperCase()); } catch { /* sin storage */ }
    }
    try { pais = sessionStorage.getItem(CLAVE); } catch { /* sin storage */ }
    if (pais === null && forzado) pais = forzado.toUpperCase();
    if (pais === null) {
      try {
        const t = await (await fetch('/cdn-cgi/trace')).text();
        pais = (t.match(/^loc=([A-Z0-9]{2})$/m) || [])[1] || '';
      } catch {
        pais = '';
      }
      try { sessionStorage.setItem(CLAVE, pais); } catch { /* sin storage */ }
    }
    return /^[A-Z]{2}$/.test(pais) && pais !== 'AR' && pais !== 'XX';
  })();
  return promesa;
}

export const dolares = (n: number) => 'US$' + Math.ceil(n).toLocaleString('es-AR');

enDolares().then((si) => {
  if (!si) return;
  document.documentElement.dataset.moneda = 'usd';
  document.title = document.title.replace(/ en pesos\b/, ' en dólares'); // la pestaña de /precio
  document.querySelectorAll<HTMLElement>('[data-usd]').forEach((el) => {
    el.textContent = el.getAttribute('data-usd');
  });
  pasarANeutro();
});
