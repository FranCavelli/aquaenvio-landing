# Aquaenvio â€” Landing

Landing moderna de Aquaenvio hecha con **Astro + Tailwind v4 + GSAP** y un
**modelo 3D** (gota de agua) con **Three.js**. Mantiene los colores de la app
(`#0a2e4d â†’ #0a4a73`, acentos cyan/blue) e incluye la **calculadora de precio**
del `/cotizar`.

## Correr en local

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build de producciÃ³n

```bash
npm run build      # genera /dist (estÃ¡tico, se sube a cualquier hosting)
npm run preview    # previsualiza el build
```

## Tus imÃ¡genes y video

- **ImÃ¡genes:** dejÃ¡ los archivos en `public/images/` (ver `public/images/README.txt`
  para los nombres). Donde falte una imagen aparece el cartel â€œPonÃ© tu imagen aquÃ­â€.
- **Video de introducciÃ³n:** dejÃ¡ `public/videos/intro.mp4` (ver
  `public/videos/README.txt`). Mientras no exista, se muestra el placeholder.

## Estructura

```
src/
  config.ts              # telÃ©fono / WhatsApp
  layouts/Base.astro     # <head>, fuentes, carga de animaciones
  components/            # Nav, Hero, IntroVideo, Features, Gallery, Calculadora, CTA, Footer
  scripts/
    animations.ts        # GSAP + ScrollTrigger (reveals, hero, nav, parallax)
    droplet.ts           # modelo 3D de la gota (Three.js)
    calculator.ts        # lÃ³gica de la calculadora (fÃ³rmula = /cotizar)
  styles/global.css      # Tailwind + paleta de marca + slider
```

## Ajustes rÃ¡pidos

- **Precios:** `src/scripts/calculator.ts` â†’ objeto `TARIFAS`.
- **Contacto:** `src/config.ts`.
- **Colores de marca:** `src/styles/global.css` â†’ bloque `@theme`.
- **Textos / mÃ³dulos:** cada componente en `src/components/`.
