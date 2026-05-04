# 🧶 Telar

Editor de patrones para tejido artesanal — crochet, dos agujas y punto cruz — que corre completamente en el navegador, sin backend ni cuenta requerida.

## ¿Qué es?

Telar es una aplicación web que permite diseñar patrones de colores en una grilla interactiva. Podés pintar celda por celda, usar relleno por área, elegir el tipo de tejido (que ajusta la proporción de las celdas), y exportar el resultado como imagen o PDF para imprimir o compartir.

## Funcionalidades

- **Herramientas de edición**: pincel, borrador, relleno tipo balde (flood fill BFS), cuentagotas
- **Tipos de tejido**: Crochet, Dos Agujas y Punto Cruz, cada uno con su relación de aspecto correcta
- **Grilla configurable**: entre 5×5 y 100×100 celdas, con zoom del 50% al 150%
- **Paletas de colores**: paletas predefinidas (pasteles, tierra, vibrantes, neutros) y colores recientes
- **Historial de deshacer/rehacer**: hasta 50 pasos
- **Exportación**:
  - PNG de alta resolución (2×) con leyenda de colores y numeración de filas/columnas
  - PDF imprimible con el mismo layout
  - Guardado y carga de proyectos en formato `.telar.json`
- **Sin instalación**: funciona 100% en el navegador

## Stack

- [Next.js 16](https://nextjs.org/) + React 19 (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Base UI](https://base-ui.com/) + componentes propios
- [Zustand v5](https://zustand-demo.pmnd.rs/) para estado global
- [jsPDF](https://github.com/parallax/jsPDF) para exportación PDF
- [Lucide React](https://lucide.dev/) para iconos

## Desarrollo local

```bash
npm install
npm run dev
