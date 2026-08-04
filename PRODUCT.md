# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Dueño de una **distribuidora de agua en bidones chica** (1 a 3 camiones), en
Argentina. Hoy lleva el reparto en un cuaderno o una planilla: quién le debe,
qué envases prestó, a quién le toca hoy. No es una persona técnica y decide con
el celular en la mano, muchas veces arriba del camión o al cierre del día.

Usuarios secundarios dentro del producto (no son a quienes les vende la
landing): **repartidores** (registran la venta en la calle, a veces sin señal),
**encargado de depósito** (carga y descarga del camión) y **administrador**.

## Product Purpose

Aquaenvio reemplaza el cuaderno del reparto: ordena el recorrido del día,
registra la venta y el cobro en el momento, lleva la cuenta corriente y los
envases prestados de cada cliente, y le muestra al dueño qué se vendió y qué se
cobró sin tener que sumar nada. Éxito = el dueño deja de reconstruir el día a la
noche y sabe, en el momento, cuánto entró y quién le debe.

## Positioning

No es un ERP genérico adaptado: está hecho sobre el reparto de bidones, con lo
que ese negocio tiene y ningún software general modela — **envases en comodato**
(cuántos bidones tiene prestados cada cliente y desde cuándo), **precio por
cliente**, **orden del recorrido**, **frecuencia de visita** (cada X semanas) y
**carga y cierre del camión**.

Lo que ningún competidor cercano puede copiar sin rehacer su producto: el
circuito entero cierra solo, desde que el cliente pide hasta que la venta queda
registrada — **página pública de pedidos por empresa** (el cliente pide y paga
con Mercado Pago desde el celular), el pedido cae en la app, se le asigna
repartidor y la venta y la factura salen del mismo lugar.

## Operating Context

- La venta se carga **en la calle**, con una mano, a veces **sin señal** (queda
  offline y se sincroniza al volver la conexión).
- El día tiene un ritmo fijo: cargar el camión → hacer el recorrido → cerrar.
- El cobro es mayormente en efectivo, con cuenta corriente y saldo acumulado;
  también transferencia y **QR de Mercado Pago con las claves de cada empresa**.
- Los envases se prestan y vuelven: el bidón es del negocio, no del cliente.
- El dueño mira el resumen del día desde el celular, no desde una computadora.

## Capabilities and Constraints

Módulos confirmados y en producción: Repartos y reparto operativo · Clientes
(cuenta corriente, precios por cliente, frecuencia de visita) · Productos ·
Ventas · Pedidos · Carga y descarga · Caja y gastos · **Facturación AFIP/ARCA
real** (CAE y PDF con QR) · Dashboard · Mapa en vivo de clientes y repartidores
· Usuarios y roles · Revendedores · **Página pública de pedidos por empresa**
(`tu-empresa.aquaenvio.com`, con pago por Mercado Pago) · **IA**: análisis del
recorrido y copiloto por voz durante el reparto · Notificaciones push.

Constraints: multiempresa con módulos y roles por empresa; se entra desde el
navegador o se instala como app (PWA), **sin instalación ni permanencia**;
precio en ARS con piso de $15.999/mes, los 2 primeros meses al costo y la
primera semana gratis.

Terminología del rubro que la copy debe usar bien: bidón, envase, comodato,
reparto, recorrido, cuenta corriente, saldo, planilla.

## Brand Commitments

- Nombre escrito **Aquaenvio** (así, no "AquaEnvio") en todo texto visible.
- El logo es la **gota** de `lucide-droplets`.
- Contacto: **solo WhatsApp y mail** (`src/config.ts`). Sin teléfono para llamar.
- Dominio y canonical: `https://aquaenvio.com`, con barra final.
- Voz: directa, en argentino, de laburo. Sin jerga de software ni promesas de
  transformación digital.
- **Ninguna mención de IA en los commits.**

## Evidence on Hand

Real y disponible:
- **Videos de la app funcionando** (`public/videos/`, con pósters JPG), grabados
  de producción sobre una empresa demo. Es la prueba más fuerte que hay.
- Calculadora de precio con la fórmula real (`src/scripts/calculator.ts`).
- Página `/comparativa` contra competidores.

**No existe y no se puede inventar:** testimonios, logos de clientes, cantidad
de empresas o de usuarios, premios, prensa, casos de éxito. El usuario decidió
mostrar **capacidad del producto sin nombrar clientes**: cualquier número que
aparezca tiene que salir del producto o de la fórmula de precio, nunca de una
métrica de adopción inventada.

## Product Principles

1. **El cuaderno es el rival, no otro software.** La comparación honesta es
   contra papel y planillas; ahí se gana.
2. **Mostrar el producto real.** Antes que describir una función, mostrarla
   andando: los videos pesan más que cualquier adjetivo.
3. **Del rubro, no genérico.** Envases, comodato, recorrido y frecuencia son la
   prueba de que está hecho para este negocio.
4. **Sin fricción para entrar.** Sin instalación, sin permanencia, semana gratis:
   la landing nunca pide más compromiso del que hay.
5. **Nada inventado.** Ni un número, ni un cliente, ni una promesa que el
   producto no cumpla hoy.

## Accessibility & Inclusion

Se lee mayormente en **celular**, muchas veces a la intemperie: contraste alto y
texto grande importan más que la densidad. Respetar `prefers-reduced-motion` (el
sitio usa GSAP y ya tuvo un problema con el smooth scroll por eso).
