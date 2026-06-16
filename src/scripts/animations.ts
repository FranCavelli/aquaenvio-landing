/**
 * Animaciones globales con GSAP + ScrollTrigger:
 *  - Entrada del hero (stagger).
 *  - Reveal de secciones al hacer scroll.
 *  - Barra de navegación que cambia al scrollear.
 *  - Parallax de los blobs del hero.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function start() {
  // ───── Hero: entrada en cascada ─────
  const heroItems = gsap.utils.toArray<HTMLElement>('.hero-item');
  if (heroItems.length) {
    gsap.from(heroItems, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.1,
    });
  }
  const heroCards = gsap.utils.toArray<HTMLElement>('.hero-card');
  if (heroCards.length) {
    gsap.from(heroCards, {
      y: 16,
      opacity: 0,
      scale: 0.9,
      duration: 0.7,
      ease: 'back.out(1.6)',
      stagger: 0.15,
      delay: 0.7,
    });
  }

  // ───── Reveal simple (cualquier [data-reveal]) ─────
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });

  // ───── Reveal en grupo con stagger (grillas) ─────
  // Mismo patrón que el reveal simple: setear estado inicial y animar HACIA
  // visible con .to(). Evita el footgun de .from()+ScrollTrigger, que aplica
  // opacity:0 con immediateRender pero a veces no dispara el "play" y deja
  // las cards clavadas en invisible.
  gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>('[data-reveal-item]');
    if (!items.length) return;
    gsap.set(group, { opacity: 1, y: 0 }); // el grupo en sí no se oculta
    gsap.set(items, { opacity: 0, y: 28 });
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.08,
      // Dispara apenas la grilla asoma desde abajo (aparecen un momento antes
      // de scrollear encima).
      scrollTrigger: { trigger: group, start: 'top 95%' },
    });
  });

  // ───── Parallax de los blobs del hero ─────
  if (!reduced) {
    gsap.utils.toArray<HTMLElement>('[data-blob]').forEach((blob, i) => {
      gsap.to(blob, {
        yPercent: i % 2 === 0 ? 18 : -18,
        ease: 'none',
        scrollTrigger: {
          trigger: '#top',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    });
  }

  // ───── Nav: fondo sólido al scrollear ─────
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (nav) {
    const onScroll = () => {
      const scrolled = window.scrollY > 24;
      nav.classList.toggle('bg-aqua-900/90', scrolled);
      nav.classList.toggle('shadow-lg', scrolled);
      nav.classList.toggle('backdrop-blur', scrolled);
      nav.classList.toggle('py-2', scrolled);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
