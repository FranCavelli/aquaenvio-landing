/**
 * Modelo 3D del hero: 3 gotas de agua (vidrio/agua, material físico con
 * transmisión) que caen en bucle, con leve balanceo y desvanecido en los
 * extremos. Three.js, sin assets externos (entorno generado por código).
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function initDroplet(canvas: HTMLCanvasElement) {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const parent = canvas.parentElement ?? canvas;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 6.6);

  const group = new THREE.Group();
  scene.add(group);

  // ───── Geometría: gota — fondo REDONDEADO (hemisferio) y punta arriba ─────
  const points: THREE.Vector2[] = [];
  const R = 0.95; // radio del bulbo (grande → bien redondo abajo)
  const cy = -0.25; // ecuador de la gota (el bulbo redondo ocupa la mayor parte)
  const topY = 1.0; // punta de arriba (cortita)
  const tipExp = 2.0; // >1 → punta redondeada/suave (no picuda)
  // Mitad inferior: hemisferio (redondo abajo, no en punta).
  const NB = 22;
  for (let i = 0; i <= NB; i++) {
    const a = -Math.PI / 2 + (Math.PI / 2) * (i / NB); // -90° → 0°
    points.push(new THREE.Vector2(Math.max(R * Math.cos(a), 0.001), cy + R * Math.sin(a)));
  }
  // Mitad superior: afina suave hasta la punta.
  const NT = 26;
  for (let i = 1; i <= NT; i++) {
    const s = i / NT;
    const y = cy + (topY - cy) * s;
    const r = R * Math.pow(1 - s, 1.45);
    points.push(new THREE.Vector2(Math.max(r, 0.001), y));
  }
  const geometry = new THREE.LatheGeometry(points, 80);
  geometry.computeVertexNormals();

  function makeMaterial() {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#dff6ff'),
      metalness: 0,
      roughness: 0.04,
      transmission: 1,
      thickness: 1.2,
      ior: 1.33,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      attenuationColor: new THREE.Color('#1f9fd6'),
      attenuationDistance: 2.2,
      envMapIntensity: 1.2,
      transparent: true,
    });
  }

  // 3 gotas con tamaño / posición / velocidad distintas.
  const defs = [
    { x: -1.35, z: 0.0, size: 0.55, speed: 0.18, offset: 0.0 },
    { x: 0.35, z: 0.45, size: 0.8, speed: 0.135, offset: 0.45 },
    { x: 1.45, z: -0.3, size: 0.46, speed: 0.22, offset: 0.78 },
  ];
  const drops = defs.map((d) => {
    const mat = makeMaterial();
    const mesh = new THREE.Mesh(geometry, mat);
    mesh.scale.setScalar(d.size);
    mesh.position.set(d.x, 0, d.z);
    group.add(mesh);
    return { ...d, mesh, mat };
  });

  const TOP = 2.7;
  const BOTTOM = -2.7;
  const SPAN = TOP - BOTTOM;

  // Luces de acento (cyan / blanco).
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x67e8f9, 2.0);
  rim.position.set(-4, -2, -3);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  function resize() {
    const w = parent.clientWidth || 1;
    const h = parent.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(parent);

  let targetX = 0;
  let targetY = 0;
  if (!prefersReduced) {
    window.addEventListener('pointermove', (e) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.3;
    });
  }

  let visible = true;
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => (visible = en.isIntersecting)),
    { threshold: 0.01 }
  );
  io.observe(canvas);

  let raf = 0;
  const clock = new THREE.Clock();
  function loop() {
    raf = requestAnimationFrame(loop);
    if (!visible) return;
    const t = clock.getElapsedTime();

    group.rotation.x += (targetY - group.rotation.x) * 0.04;
    group.rotation.y += (targetX - group.rotation.y) * 0.04;

    for (const d of drops) {
      if (prefersReduced) {
        d.mesh.position.set(d.x, 0, d.z);
        d.mat.opacity = 1;
        continue;
      }
      // Progreso de caída 0→1 (arriba → abajo), en bucle.
      const p = (((t * d.speed + d.offset) % 1) + 1) % 1;
      const y = TOP - p * SPAN;
      d.mesh.position.set(d.x + Math.sin(t * 1.2 + d.offset * 6) * 0.06, y, d.z);
      d.mesh.rotation.y = t * 0.3 + d.offset * 6;
      // Desvanecido suave al entrar (arriba) y salir (abajo).
      let op = 1;
      if (p < 0.08) op = p / 0.08;
      else if (p > 0.86) op = (1 - p) / 0.14;
      d.mat.opacity = op;
    }
    renderer.render(scene, camera);
  }
  loop();

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      drops.forEach((d) => d.mat.dispose());
      pmrem.dispose();
      renderer.dispose();
    });
  }
}
