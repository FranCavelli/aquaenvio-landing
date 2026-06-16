# AquaEnvio — Landing

Landing moderna de AquaEnvio hecha con **Astro + Tailwind v4 + GSAP** y un
**modelo 3D** (gota de agua) con **Three.js**. Mantiene los colores de la app
(`#0a2e4d → #0a4a73`, acentos cyan/blue) e incluye la **calculadora de precio**
del `/cotizar`.

## Correr en local

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build de producción

```bash
npm run build      # genera /dist (estático, se sube a cualquier hosting)
npm run preview    # previsualiza el build
```

## Tus imágenes y video

- **Imágenes:** dejá los archivos en `public/images/` (ver `public/images/README.txt`
  para los nombres). Donde falte una imagen aparece el cartel “Poné tu imagen aquí”.
- **Video de introducción:** dejá `public/videos/intro.mp4` (ver
  `public/videos/README.txt`). Mientras no exista, se muestra el placeholder.

## Estructura

```
src/
  config.ts              # teléfono / WhatsApp
  layouts/Base.astro     # <head>, fuentes, carga de animaciones
  components/            # Nav, Hero, IntroVideo, Features, Gallery, Calculadora, CTA, Footer
  scripts/
    animations.ts        # GSAP + ScrollTrigger (reveals, hero, nav, parallax)
    droplet.ts           # modelo 3D de la gota (Three.js)
    calculator.ts        # lógica de la calculadora (fórmula = /cotizar)
  styles/global.css      # Tailwind + paleta de marca + slider
```

## Ajustes rápidos

- **Precios:** `src/scripts/calculator.ts` → objeto `TARIFAS`.
- **Contacto:** `src/config.ts`.
- **Colores de marca:** `src/styles/global.css` → bloque `@theme`.
- **Textos / módulos:** cada componente en `src/components/`.
