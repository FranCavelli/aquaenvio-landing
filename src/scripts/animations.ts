/**
 * Movimiento de la página.
 *
 * El momento animado del sitio es UNO: el agua que sube en el envase (vive en
 * Hero.astro). Acá sólo queda lo que hace falta para que el contenido no
 * aparezca de golpe y para que la banda del cuello del envase se vuelva sólida
 * cuando dejás atrás la etiqueta.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function start() {
  // Con "reducir movimiento" no se anima NADA: hay que mostrar todo a mano
  // porque el estado inicial (opacity 0) lo pone el CSS y un gsap.set() con
  // estilos inline le gana al @media del stylesheet.
  if (quieto) {
    gsap.set('[data-reveal], [data-reveal-item]', { opacity: 1, y: 0, clearProps: 'transform' });
    marcarNav();
    return;
  }

  // ───── Aparición del contenido ─────
  // Siempre .to() hacia visible desde un estado inicial explícito: con .from()
  // + ScrollTrigger las tarjetas quedan clavadas en invisible si el trigger no
  // llega a dispararse.
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });

  gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]');
    if (!items.length) return;
    gsap.set(group, { opacity: 1, y: 0 });
    gsap.set(items, { opacity: 0, y: 20 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'expo.out',
      stagger: 0.06,
      scrollTrigger: { trigger: group, start: 'top 95%' },
    });
  });

  marcarNav();
}

/**
 * La banda del cuello: arriba de todo es transparente sobre el plástico y,
 * apenas pasás el envase, se vuelve papel (una segunda etiqueta más finita).
 */
function marcarNav() {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('nav-papel', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
