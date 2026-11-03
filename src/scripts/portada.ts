// @ts-nocheck
// Aquaenvio · propuesta 6: aparecer al scroll, videos que se prenden al verse,
// botón fijo en el celular y la calculadora de precio (misma fórmula que la landing).
// Portada: aparecer al scroll, videos que se prenden al verse, botón fijo en el celular,
// formulario de contacto, calculadora y el video «sellado». Ver src/pages/index.astro.
(() => {
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches && !document.documentElement.classList.contains('mov');

  // Aparecer al hacer scroll
  const revs = document.querySelectorAll('.revela');
  if (quieto || !('IntersectionObserver' in window)) {
    revs.forEach((el) => el.classList.add('visto'));
  } else {
    const io = new IntersectionObserver((ents) => {
      ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revs.forEach((el) => io.observe(el));
  }

  // Videos de las funciones: se reproducen solo cuando están en pantalla
  const vids = document.querySelectorAll('video[data-auto]');
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else { v.pause(); }
      });
    }, { threshold: 0.35 });
    vids.forEach((v) => vio.observe(v));
  }

  // Botón fijo de WhatsApp (celular): se esconde cuando ya hay un botón a la vista
  const fijo = document.querySelector('.wa-fijo');
  const tapan = [document.getElementById('hero-cta'), document.getElementById('cierre-cta')].filter(Boolean);
  if (fijo && 'IntersectionObserver' in window) {
    const vis = new Set();
    const fio = new IntersectionObserver((ents) => {
      ents.forEach((e) => (e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)));
      if (vis.size) fijo.setAttribute('data-oculto', ''); else fijo.removeAttribute('data-oculto');
    });
    tapan.forEach((el) => fio.observe(el));
  }

  // Formulario de contacto: arma el mensaje con lo que completaron y abre
  // WhatsApp (o el mail). No se manda nada a ningún servidor.
  const form = document.getElementById('cierre-cta');
  if (form && form.tagName === 'FORM') {
    let via = 'wa';
    form.querySelectorAll('button[data-via]').forEach((b) => b.addEventListener('click', () => { via = b.dataset.via; }));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (n) => (form.elements[n].value || '').trim();
      const lineas = ['Hola, quiero información de Aquaenvio.'];
      const quien = [v('nombre') && `Soy ${v('nombre')}`, v('empresa') && `de ${v('empresa')}`].filter(Boolean).join(', ');
      if (quien) lineas.push(quien + (v('localidad') ? ` (${v('localidad')})` : '') + '.');
      else if (v('localidad')) lineas.push(`Estoy en ${v('localidad')}.`);
      if (v('clientes')) lineas.push(`Clientes: ${v('clientes').toLowerCase()}.`);
      if (v('repartidores')) lineas.push(`Repartidores: ${v('repartidores').toLowerCase()}.`);
      if (v('hoy')) lineas.push(`Hoy uso: ${v('hoy').toLowerCase()}.`);
      if (v('mensaje')) lineas.push(v('mensaje'));
      const texto = lineas.join('\n');
      const url = via === 'mail'
        ? `mailto:francavelli2@gmail.com?subject=${encodeURIComponent('Quiero información de Aquaenvio')}&body=${encodeURIComponent(texto)}`
        : `https://wa.me/5491128065517?text=${encodeURIComponent(texto)}`;
      if (via === 'mail') location.href = url; else window.open(url, '_blank', 'noopener');
    });
  }

  // Calculadora
  const $ = (id) => document.getElementById(id);
  const uIn = $('c-usuarios'), cIn = $('c-clientes');
  if (!uIn || !cIn) return;
  const PISO = 15999;
  const pesos = (n) => '$' + Math.ceil(n).toLocaleString('es-AR');
  let blue = null;

  function calcular() {
    const u = +uIn.value, c = +cIn.value;
    $('v-usuarios').textContent = u;
    $('v-clientes').textContent = c.toLocaleString('es-AR');
    if (!blue) {
      $('t-precio').textContent = 'desde ' + pesos(PISO);
      $('t-bonif').textContent = 'Los 2 primeros meses, bonificados al costo.';
      return;
    }
    const costo = 3 + 0.005 * c + 1 * u;
    const precio = Math.ceil(costo * 1.5);
    const ars = Math.max(precio * blue, PISO);
    const bonif = Math.max(costo * blue, PISO);
    $('t-precio').textContent = pesos(ars);
    $('t-bonif').textContent = bonif < ars
      ? `Los 2 primeros meses: ${pesos(bonif)} por mes, al costo.`
      : 'Es el precio mínimo.';
  }

  uIn.addEventListener('input', calcular);
  cIn.addEventListener('input', calcular);
  calcular();

  fetch('https://dolarapi.com/v1/dolares')
    .then((r) => r.json())
    .then((lista) => {
      const b = Array.isArray(lista) && lista.find((d) => d.casa === 'blue');
      if (b && b.venta > 0) { blue = +b.venta; calcular(); }
    })
    .catch(() => {});
})();

// Video «sellado»: al tocar el play se sacan el botón, aparecen los controles y arranca.
(() => {
  const v = document.getElementById('video45'), b = document.getElementById('video45-play');
  if (!v || !b) return;
  b.addEventListener('click', () => { v.controls = true; b.closest('.video45__marco').classList.add('sonando'); v.play().catch(() => {}); v.focus(); });
  // Al terminar: «¿Te gustó?» con el botón de WhatsApp (y la opción de verlo de nuevo).
  const fin = document.getElementById('video45-fin'), otra = document.getElementById('video45-otra');
  if (!fin || !otra) return;
  v.addEventListener('ended', () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    v.controls = false; fin.hidden = false;
    fin.querySelector('a')?.focus({ preventScroll: true });
  });
  v.addEventListener('play', () => { fin.hidden = true; });
  otra.addEventListener('click', () => { fin.hidden = true; v.controls = true; v.currentTime = 0; v.play().catch(() => {}); v.focus(); });
})();

// Scroll suave al tocar los links del menú (y cualquier link a una sección), aunque el
// sistema tenga las animaciones apagadas: lo pidió Fran para ir de sección en sección.
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"], a[href^="/#"]') as HTMLAnchorElement | null;
  if (!a) return;
  const id = (a.getAttribute('href') || '').replace(/^\/?#/, '');
  const el = id ? document.getElementById(id) : null;
  if (!el) return;
  e.preventDefault();
  irSuave(el.getBoundingClientRect().top + window.scrollY - 84);
  history.replaceState(null, '', '#' + id);
});

// El navegador no anima el scroll si el sistema pide «movimiento reducido» (la PC de Fran):
// por eso el desplazamiento se hace a mano, cuadro por cuadro, con una curva suave.
let animando = 0;
function irSuave(destino) {
  const raiz = document.documentElement;
  const desde = window.scrollY, delta = destino - desde;
  if (Math.abs(delta) < 2) return;
  const dur = Math.min(1100, Math.max(450, Math.abs(delta) * 0.35));
  const t0 = performance.now(), id = ++animando;
  raiz.style.scrollBehavior = 'auto';
  const paso = (t) => {
    if (id !== animando) return;
    const k = Math.min(1, (t - t0) / dur);
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    window.scrollTo(0, desde + delta * e);
    if (k < 1) requestAnimationFrame(paso); else raiz.style.scrollBehavior = '';
  };
  requestAnimationFrame(paso);
}
// Si la persona mueve la rueda o toca la pantalla, deja de animar.
['wheel', 'touchstart', 'keydown'].forEach((ev) => window.addEventListener(ev, () => { animando++; document.documentElement.style.scrollBehavior = ''; }, { passive: true }));
