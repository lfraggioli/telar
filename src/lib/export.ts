import { type PatternState } from '@/stores/usePatternStore'
import { CRAFT_CONFIG, CANVAS_COLORS } from '@/lib/constants'

// ---------------------------------------------------------------------------
// Export canvas constants
// ---------------------------------------------------------------------------

const EXPORT_CELL  = 24        // cell size in px (pre-scale)
const MARGIN       = 36
const TITLE_H      = 68
const NUMBERS_W    = 36
const NUMBERS_H    = 24
const LEGEND_ROW_H = 22
const LEGEND_COLS  = 3
const FOOTER_H     = 44
const SCALE        = 2         // 2× for high-resolution PNG

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sanitizeName(name: string): string {
  return (name || 'patron')
    .trim()
    .replace(/[^\w\s\u00C0-\u017E-]/g, '')
    .replace(/\s+/g, '-')
    || 'patron'
}

// ---------------------------------------------------------------------------
// Build the export canvas (shared between PNG and PDF)
// ---------------------------------------------------------------------------

function buildExportCanvas(state: PatternState): HTMLCanvasElement {
  const { grid, rows, cols, patternName, craft } = state
  const cellW = EXPORT_CELL
  const cellH = EXPORT_CELL * CRAFT_CONFIG[craft].aspectRatio

  // Collect color usage
  const colorMap = new Map<string, number>()
  for (const row of grid) {
    for (const cell of row) {
      if (cell.color) colorMap.set(cell.color, (colorMap.get(cell.color) ?? 0) + 1)
    }
  }
  const colorEntries = Array.from(colorMap.entries())
    .map(([color, count]) => ({ color, count, pct: (count / (rows * cols)) * 100 }))
    .sort((a, b) => b.count - a.count)

  const legendRows = Math.ceil(colorEntries.length / LEGEND_COLS)
  const legendH = colorEntries.length > 0 ? legendRows * LEGEND_ROW_H + 40 : 0

  const gridW   = NUMBERS_W + cols * cellW
  const gridH   = NUMBERS_H + rows * cellH
  const cssW    = MARGIN * 2 + gridW
  const cssH    = MARGIN + TITLE_H + gridH + legendH + FOOTER_H + MARGIN

  const canvas  = document.createElement('canvas')
  canvas.width  = Math.round(cssW * SCALE)
  canvas.height = Math.round(cssH * SCALE)
  canvas.style.width  = `${cssW}px`
  canvas.style.height = `${cssH}px`

  const ctx = canvas.getContext('2d')!
  ctx.scale(SCALE, SCALE)

  // ── Background ──────────────────────────────────────────────────────────────
  ctx.fillStyle = '#FFF8F2'
  ctx.fillRect(0, 0, cssW, cssH)

  let y = MARGIN

  // ── Title ───────────────────────────────────────────────────────────────────
  ctx.fillStyle = '#C4756E'
  ctx.font = 'bold 20px Georgia, serif'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(`🧶  ${patternName || 'Patrón'}`, MARGIN, y + 24)

  ctx.fillStyle = '#96745A'
  ctx.font = '12px Arial, sans-serif'
  ctx.fillText(
    `${CRAFT_CONFIG[craft].label}  ·  ${rows} × ${cols} puntos  ·  ${new Date().toLocaleDateString('es-AR')}`,
    MARGIN, y + 48
  )

  y += TITLE_H

  // ── Cells ───────────────────────────────────────────────────────────────────
  // Numbers area background
  ctx.fillStyle = CANVAS_COLORS.numbersArea
  ctx.fillRect(MARGIN, y, NUMBERS_W, gridH)
  ctx.fillRect(MARGIN + NUMBERS_W, y, cols * cellW, NUMBERS_H)
  ctx.fillRect(MARGIN, y, NUMBERS_W, NUMBERS_H)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx    = MARGIN + NUMBERS_W + c * cellW
      const cy    = y + NUMBERS_H + r * cellH
      const color = grid[r]?.[c]?.color ?? null
      ctx.fillStyle = color ?? CANVAS_COLORS.emptyCell
      ctx.fillRect(cx, cy, cellW, cellH)
    }
  }

  // ── Grid lines ──────────────────────────────────────────────────────────────
  for (let c = 0; c <= cols; c++) {
    const cx      = MARGIN + NUMBERS_W + c * cellW
    const isGuide = c % 10 === 0
    ctx.strokeStyle = isGuide ? CANVAS_COLORS.guideLine : CANVAS_COLORS.gridLine
    ctx.lineWidth   = isGuide ? 1 : 0.5
    ctx.beginPath()
    ctx.moveTo(cx, y + NUMBERS_H)
    ctx.lineTo(cx, y + NUMBERS_H + rows * cellH)
    ctx.stroke()
  }
  for (let r = 0; r <= rows; r++) {
    const ry      = y + NUMBERS_H + r * cellH
    const isGuide = r % 10 === 0
    ctx.strokeStyle = isGuide ? CANVAS_COLORS.guideLine : CANVAS_COLORS.gridLine
    ctx.lineWidth   = isGuide ? 1 : 0.5
    ctx.beginPath()
    ctx.moveTo(MARGIN + NUMBERS_W, ry)
    ctx.lineTo(MARGIN + NUMBERS_W + cols * cellW, ry)
    ctx.stroke()
  }

  // ── Numbers ──────────────────────────────────────────────────────────────────
  ctx.fillStyle    = CANVAS_COLORS.numbersText
  ctx.font         = '9px Courier New, monospace'
  ctx.textBaseline = 'middle'
  ctx.textAlign    = 'right'
  for (let r = 0; r < rows; r++) {
    if (r === 0 || (r + 1) % 5 === 0) {
      ctx.fillText(String(r + 1), MARGIN + NUMBERS_W - 4, y + NUMBERS_H + r * cellH + cellH / 2)
    }
  }
  ctx.textAlign = 'center'
  for (let c = 0; c < cols; c++) {
    if (c === 0 || (c + 1) % 5 === 0) {
      ctx.fillText(String(c + 1), MARGIN + NUMBERS_W + c * cellW + cellW / 2, y + NUMBERS_H / 2)
    }
  }

  y += gridH

  // ── Legend ──────────────────────────────────────────────────────────────────
  if (colorEntries.length > 0) {
    y += 18
    ctx.fillStyle    = '#3D2C2E'
    ctx.font         = 'bold 11px Arial, sans-serif'
    ctx.textAlign    = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText('Leyenda de colores', MARGIN, y + 8)
    y += 20

    const colWidth = (cssW - MARGIN * 2) / LEGEND_COLS
    colorEntries.forEach(({ color, count, pct }, i) => {
      const col  = i % LEGEND_COLS
      const row  = Math.floor(i / LEGEND_COLS)
      const lx   = MARGIN + col * colWidth
      const ly   = y + row * LEGEND_ROW_H

      // Swatch
      ctx.fillStyle = color
      ctx.fillRect(lx, ly, 14, 14)
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'
      ctx.lineWidth = 0.5
      ctx.strokeRect(lx, ly, 14, 14)

      // Text
      ctx.fillStyle    = '#3D2C2E'
      ctx.font         = '9px Courier New, monospace'
      ctx.textBaseline = 'middle'
      ctx.fillText(color.toUpperCase(), lx + 18, ly + 5)

      ctx.fillStyle = '#96745A'
      ctx.font      = '8px Arial, sans-serif'
      ctx.fillText(`${count.toLocaleString()} (${pct.toFixed(1)}%)`, lx + 18, ly + 12)
    })
  }

  // ── Footer ──────────────────────────────────────────────────────────────────
  const fy = cssH - MARGIN - 16
  ctx.strokeStyle = CANVAS_COLORS.gridLine
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(MARGIN, fy - 8)
  ctx.lineTo(cssW - MARGIN, fy - 8)
  ctx.stroke()

  ctx.fillStyle    = '#96745A'
  ctx.font         = '9px Arial, sans-serif'
  ctx.textAlign    = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText('Creado con Telar — editor-de-patrones.app', MARGIN, fy)
  ctx.textAlign = 'right'
  ctx.fillText(new Date().toLocaleDateString('es-AR'), cssW - MARGIN, fy)

  return canvas
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function exportToPNG(state: PatternState): void {
  const canvas = buildExportCanvas(state)
  const url    = canvas.toDataURL('image/png')
  const a      = document.createElement('a')
  a.href       = url
  a.download   = `${sanitizeName(state.patternName)}.png`
  a.click()
}

export async function exportToPDF(state: PatternState): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const canvas = buildExportCanvas(state)

  // cssW/H = canvas pixel size / SCALE
  const cssW = canvas.width  / SCALE
  const cssH = canvas.height / SCALE
  const orientation = cssW >= cssH ? 'landscape' : 'portrait'

  // 1px at 96dpi = 0.264583mm
  const mmW = cssW * 0.264583
  const mmH = cssH * 0.264583

  const pdf = new jsPDF({ orientation, unit: 'mm', format: [mmW, mmH] })
  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, mmW, mmH)
  pdf.save(`${sanitizeName(state.patternName)}.pdf`)
}

export function savePatternJSON(state: PatternState): void {
  const payload = {
    version:   1,
    name:      state.patternName,
    craft:     state.craft,
    rows:      state.rows,
    cols:      state.cols,
    grid:      state.grid,
    palette:   state.recentColors,
    createdAt: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${sanitizeName(state.patternName)}.telar.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export function loadPatternFromFile(file: File): Promise<Partial<PatternState>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (!data.grid || !data.rows || !data.cols) {
          throw new Error('Formato de archivo no válido')
        }
        resolve({
          patternName:  data.name      ?? 'Patrón importado',
          craft:        data.craft     ?? 'crochet',
          rows:         data.rows,
          cols:         data.cols,
          grid:         data.grid,
          recentColors: data.palette   ?? [],
        })
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Archivo inválido'))
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsText(file)
  })
}
