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

  // Videos del hero: arrancan recién cuando la página terminó de cargar, así lo
  // primero que se pinta es la imagen de portada (liviana) y no 2 MB de video. En
  // el celular el del panel baja en una versión chica (data-src-cel).
  const heroes = document.querySelectorAll('video[data-hero]');
  const arrancarHero = () => heroes.forEach((v) => {
    v.src = v.dataset.srcCel && window.innerWidth < 760 ? v.dataset.srcCel : v.dataset.src;
    v.preload = 'auto';
    v.addEventListener('playing', () => v.classList.add('andando'), { once: true });
    v.play().catch(() => {});
  });
  if (document.readyState === 'complete') setTimeout(arrancarHero, 400);
  else window.addEventListener('load', () => setTimeout(arrancarHero, 400), { once: true });

  // Videos de las funciones: se reproducen solo cuando están en pantalla
  const vids = document.querySelectorAll('video[data-auto]');
  if ('IntersectionObserver' in window) {
    const vio = new IntersectionObserver((ents) => {
      ents.forEach((e) => {
        const v = e.target;
        if (e.isIntersecting) {
          // Los que traen data-src (el panel) eligen la versión chica en el celular.
          if (v.dataset.src && !v.getAttribute('src')) v.src = v.dataset.srcCel && window.innerWidth < 760 ? v.dataset.srcCel : v.dataset.src;
          v.preload = 'auto'; v.play().catch(() => {});
        } else { v.pause(); }
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
  const PISO_USD = 10;
  const pesos = (n) => '$' + Math.ceil(n).toLocaleString('es-AR');
  const dolares = (n) => 'US$' + Math.ceil(n).toLocaleString('es-AR');
  let blue = null;
  // Fuera de Argentina los precios van en dólares, desde US$10 (Francisco,
  // 05/11/2026). El país lo dice Cloudflare (/cdn-cgi/trace, `loc=`); si no se
  // sabe, o es un buscador (que no indexe la landing en dólares), quedan en pesos.
  let enDolares = false;

  function calcular() {
    const u = +uIn.value, c = +cIn.value;
    $('v-usuarios').textContent = u;
    $('v-clientes').textContent = c.toLocaleString('es-AR');
    if (enDolares) {
      const costo = 3 + 0.005 * c + 1 * u;
      const usd = Math.max(Math.ceil(costo * 1.5), PISO_USD);
      const bonif = Math.max(costo, PISO_USD);
      $('t-precio').textContent = dolares(usd);
      $('t-bonif').textContent = Math.ceil(bonif) < usd
        ? `Los 2 primeros meses: ${dolares(bonif)} por mes, al costo.`
        : 'Es el precio mínimo.';
      return;
    }
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

  const pasarADolares = () => {
    enDolares = true;
    document.querySelectorAll('[data-usd]').forEach((el) => { el.textContent = el.getAttribute('data-usd'); });
    calcular();
  };
  const esBuscador = /bot|crawl|spider|slurp|facebookexternalhit|whatsapp|preview/i.test(navigator.userAgent);
  const guardado = (() => { try { return sessionStorage.getItem('aqua-pais'); } catch { return null; } })();
  const conPais = (pais) => { if (/^[A-Z]{2}$/.test(pais) && pais !== 'AR' && pais !== 'XX') pasarADolares(); };
  if (!esBuscador) {
    if (guardado !== null) conPais(guardado);
    else fetch('/cdn-cgi/trace')
      .then((r) => r.text())
      .then((t) => {
        const pais = (t.match(/^loc=([A-Z0-9]{2})$/m) || [])[1] || '';
        try { sessionStorage.setItem('aqua-pais', pais); } catch { /* sin storage */ }
        conPais(pais);
      })
      .catch(() => {});
  }

  fetch('https://dolarapi.com/v1/dolares')
    .then((r) => r.json())
    .then((lista) => {
      const b = Array.isArray(lista) && lista.find((d) => d.casa === 'blue');
      if (b && b.venta > 0) { blue = +b.venta; calcular(); }
    })
    .catch(() => {});
})();

// Video «sellado»: al tocar el play se saca el botón y arranca con NUESTRA barra
// (play/pausa, tiempo, avance, sonido y pantalla completa), no la del navegador.
(() => {
  const v = document.getElementById('video45') as HTMLVideoElement | null;
  const b = document.getElementById('video45-play');
  const barra = document.getElementById('video45-barra');
  const marco = v?.closest('.video45__marco') as HTMLElement | null;
  if (!v || !b || !barra || !marco) return;
  const fin = document.getElementById('video45-fin'), otra = document.getElementById('video45-otra');
  const btnPlay = barra.querySelector<HTMLButtonElement>('[data-accion="play"]')!;
  const btnSonido = barra.querySelector<HTMLButtonElement>('[data-accion="sonido"]')!;
  const btnPantalla = barra.querySelector<HTMLButtonElement>('[data-accion="pantalla"]')!;
  const avance = barra.querySelector<HTMLInputElement>('.video45__avance')!;
  const tActual = barra.querySelector('[data-t="actual"]')!, tTotal = barra.querySelector('[data-t="total"]')!;
  const mmss = (s: number) => { s = Math.max(0, Math.floor(s || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  let arrastrando = false;

  const pintar = () => {
    const d = v.duration || 0;
    if (!arrastrando && d) avance.value = String(Math.round((v.currentTime / d) * 1000));
    avance.style.setProperty('--p', `${(+avance.value / 10).toFixed(2)}%`);
    avance.setAttribute('aria-valuetext', `${mmss(v.currentTime)} de ${mmss(d)}`);
    tActual.textContent = mmss(v.currentTime);
    if (d) tTotal.textContent = mmss(d);
  };
  const estado = () => {
    marco.classList.toggle('pausado', v.paused);
    btnPlay.setAttribute('aria-label', v.paused ? 'Reproducir' : 'Pausar');
    marco.classList.toggle('mudo', v.muted);
    btnSonido.setAttribute('aria-label', v.muted ? 'Activar el sonido' : 'Silenciar');
  };

  // La barra se esconde sola a los 2,5 s mientras se reproduce; vuelve al mover el mouse o tocar.
  let reloj = 0;
  const mostrar = () => {
    marco.classList.remove('quieto');
    clearTimeout(reloj);
    reloj = window.setTimeout(() => { if (!v.paused && !arrastrando) marco.classList.add('quieto'); }, 2500);
  };

  const arrancar = (desdeCero = false) => {
    marco.classList.add('sonando');
    barra.hidden = false;
    if (fin) fin.hidden = true;
    if (desdeCero) v.currentTime = 0;
    v.play().catch(() => {});
    mostrar();
    btnPlay.focus({ preventScroll: true });
  };
  const alternar = () => { if (v.paused) v.play().catch(() => {}); else v.pause(); mostrar(); };

  b.addEventListener('click', () => arrancar());
  btnPlay.addEventListener('click', alternar);
  // Volumen (en compu: en el iPhone el volumen es el de los botones del teléfono).
  const volumen = barra.querySelector<HTMLInputElement>('.video45__volumen');
  const pintarVolumen = () => {
    if (!volumen) return;
    const n = v.muted ? 0 : Math.round(v.volume * 100);
    volumen.value = String(n);
    volumen.style.setProperty('--p', `${n}%`);
    volumen.setAttribute('aria-valuetext', v.muted ? 'Silenciado' : `${n} %`);
  };
  const ponerVolumen = (n: number) => {
    n = Math.min(100, Math.max(0, n));
    v.volume = n / 100;
    v.muted = n === 0;
    pintarVolumen(); estado(); mostrar();
  };
  volumen?.addEventListener('input', () => ponerVolumen(+volumen.value));
  // Al sacar el silencio con el volumen en cero, vuelve a un volumen que se oiga.
  btnSonido.addEventListener('click', () => {
    if (v.muted && v.volume === 0) v.volume = 0.6;
    v.muted = !v.muted;
    pintarVolumen(); estado(); mostrar();
  });

  // Pantalla completa del marco entero (así la barra sigue siendo la nuestra).
  // En el iPhone no existe para un <div>: ahí se abre la del video, con la del sistema.
  const enGrande = () => document.fullscreenElement === marco;
  btnPantalla.addEventListener('click', () => {
    if (enGrande()) { document.exitFullscreen().catch(() => {}); return; }
    if (marco.requestFullscreen) marco.requestFullscreen().catch(() => {});
    else (v as HTMLVideoElement & { webkitEnterFullscreen?: () => void }).webkitEnterFullscreen?.();
    mostrar();
  });
  document.addEventListener('fullscreenchange', () => {
    marco.classList.toggle('grande', enGrande());
    btnPantalla.setAttribute('aria-label', enGrande() ? 'Salir de pantalla completa' : 'Pantalla completa');
  });

  // Tocar el video: con el mouse pausa/sigue; en el celular, si la barra estaba
  // escondida, el primer toque solo la muestra (como en cualquier reproductor).
  v.addEventListener('pointerup', (e) => {
    if (!marco.classList.contains('sonando')) return;
    if (e.pointerType !== 'mouse' && marco.classList.contains('quieto')) { mostrar(); return; }
    alternar();
  });
  marco.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') mostrar(); });
  barra.addEventListener('focusin', mostrar);

  // El avance: se puede arrastrar o usar con las flechas del teclado.
  avance.addEventListener('pointerdown', () => { arrastrando = true; });
  avance.addEventListener('input', () => {
    if (v.duration) v.currentTime = (+avance.value / 1000) * v.duration;
    pintar(); mostrar();
  });
  avance.addEventListener('change', () => { arrastrando = false; mostrar(); });
  window.addEventListener('pointerup', () => { arrastrando = false; });

  // Espacio y K pausan; M silencia; F pantalla completa (con el foco en el video o la barra).
  marco.addEventListener('keydown', (e) => {
    if (!marco.classList.contains('sonando') || (e.target as HTMLElement).tagName === 'A') return;
    const k = e.key.toLowerCase();
    if ((k === ' ' && e.target !== avance && (e.target as HTMLElement).tagName !== 'BUTTON') || k === 'k') { e.preventDefault(); alternar(); }
    else if (k === 'm') btnSonido.click();
    else if ((k === 'arrowup' || k === 'arrowdown') && e.target !== avance && e.target !== volumen) {
      e.preventDefault();
      ponerVolumen((v.muted ? 0 : Math.round(v.volume * 100)) + (k === 'arrowup' ? 10 : -10));
    }
    else if (k === 'f') btnPantalla.click();
  });

  v.addEventListener('timeupdate', pintar);
  v.addEventListener('loadedmetadata', pintar);
  v.addEventListener('play', () => { if (fin) fin.hidden = true; estado(); mostrar(); });
  v.addEventListener('pause', () => { estado(); marco.classList.remove('quieto'); });
  v.addEventListener('volumechange', () => { estado(); pintarVolumen(); });

  // Al terminar: «¿Te gustó?» con el botón de WhatsApp (y la opción de verlo de nuevo).
  v.addEventListener('ended', () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    barra.hidden = true;
    if (fin) { fin.hidden = false; fin.querySelector('a')?.focus({ preventScroll: true }); }
  });
  otra?.addEventListener('click', () => arrancar(true));
  estado(); pintar(); pintarVolumen();
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
