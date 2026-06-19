/**
 * Lógica de la calculadora de precio (misma fórmula que /cotizar de la app).
 * Ajustá TARIFAS acá si cambian los precios.
 */
import { gsap } from 'gsap';

const TARIFAS = {
  baseUsd: 3, // base del plan (USD/mes)
  porClienteUsd: 0.005, // USD/mes por cliente
  porUsuarioUsd: 1.0, // USD/mes por usuario
  margenPct: 50, // ganancia (%)
  dolarTipo: 'blue',
  minimoArs: 15999, // piso en ARS
};

const costoUsd = (clientes: number, usuarios: number) =>
  TARIFAS.baseUsd +
  Math.max(0, clientes) * TARIFAS.porClienteUsd +
  Math.max(0, usuarios) * TARIFAS.porUsuarioUsd;

const precioUsd = (clientes: number, usuarios: number) =>
  Math.ceil(costoUsd(clientes, usuarios) * (1 + TARIFAS.margenPct / 100));

const fmtArs = (n: number) =>
  '$ ' + Math.round(Number.isFinite(n) ? n : 0).toLocaleString('es-AR');
const fmtUsd = (n: number) =>
  'US$ ' + (Number.isFinite(n) ? n : 0).toLocaleString('en-US');

function init() {
  const $ = (id: string) => document.getElementById(id);
  const usuariosRange = $('calc-usuarios') as HTMLInputElement | null;
  const usuariosNum = $('calc-usuarios-num') as HTMLInputElement | null;
  const clientesRange = $('calc-clientes') as HTMLInputElement | null;
  const clientesNum = $('calc-clientes-num') as HTMLInputElement | null;
  const arsEl = $('calc-ars');
  const usdEl = $('calc-usd');
  const loadingEl = $('calc-loading');

  if (!usuariosRange || !clientesRange || !arsEl || !usdEl) return;

  let dolar: number | null = null;
  let shownArs = 0; // valor actual mostrado (para animar el conteo)

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, Number.isFinite(v) ? v : min));

  const getUsuarios = () => clamp(parseInt(usuariosRange.value) || 1, 1, 30);
  const getClientes = () => clamp(parseInt(clientesRange.value) || 0, 0, 3000);

  function render() {
    const usuarios = getUsuarios();
    const clientes = getClientes();
    const usd = precioUsd(clientes, usuarios);
    const ars = dolar != null ? Math.max(usd * dolar, TARIFAS.minimoArs) : null;

    usdEl!.textContent = fmtUsd(usd);

    if (ars == null) {
      arsEl!.textContent = '—';
      return;
    }
    if (loadingEl) loadingEl.style.display = 'none';

    // Animación de conteo del precio (GSAP).
    gsap.to(
      { v: shownArs },
      {
        v: ars,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate() {
          arsEl!.textContent = fmtArs(this.targets()[0].v);
        },
        onComplete() {
          shownArs = ars;
        },
      }
    );
    shownArs = ars;
  }

  // Sincroniza range ↔ number y recalcula.
  function bind(range: HTMLInputElement, num: HTMLInputElement | null, min: number, max: number) {
    range.addEventListener('input', () => {
      if (num) num.value = range.value;
      render();
    });
    num?.addEventListener('input', () => {
      const v = clamp(parseInt(num.value) || 0, min, max);
      range.value = String(v);
      render();
    });
    num?.addEventListener('blur', () => {
      const v = clamp(parseInt(num.value) || min, min, max);
      num.value = String(v);
      range.value = String(v);
      render();
    });
  }

  bind(usuariosRange, usuariosNum, 1, 30);
  bind(clientesRange, clientesNum, 0, 3000);

  // Cotización del dólar (mismo origen que la app).
  fetch('https://dolarapi.com/v1/dolares')
    .then((r) => r.json())
    .then((d: { casa: string; venta: number }[]) => {
      const v = Array.isArray(d) ? d.find((x) => x.casa === TARIFAS.dolarTipo)?.venta : null;
      if (v != null) {
        dolar = v;
        render();
      }
    })
    .catch(() => {
      // Sin cotización: mostramos el piso para no dejar "—".
      dolar = TARIFAS.minimoArs / precioUsd(getClientes(), getUsuarios());
      render();
    });

  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
