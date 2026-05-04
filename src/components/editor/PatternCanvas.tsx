'use client'

import { useEffect, useRef } from 'react'
import { usePatternStore } from '@/stores/usePatternStore'
import { useGridInteraction } from '@/hooks/useGridInteraction'
import {
  CRAFT_CONFIG,
  BASE_CELL_SIZE,
  NUMBERS_WIDTH,
  NUMBERS_HEIGHT,
  CANVAS_COLORS,
} from '@/lib/constants'
import { type Tool } from '@/lib/types'

const CURSOR_MAP: Record<Tool, string> = {
  paint:      'crosshair',
  erase:      'cell',
  fill:       'crosshair',
  eyedropper: 'copy',
  select:     'default',
}

function drawCanvas(
  canvas: HTMLCanvasElement,
  grid: ReturnType<typeof usePatternStore.getState>['grid'],
  rows: number,
  cols: number,
  zoom: number,
  craft: ReturnType<typeof usePatternStore.getState>['craft'],
  showGridLines: boolean,
  hoverCell: { row: number; col: number } | null
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const dpr   = window.devicePixelRatio || 1
  const cellW = BASE_CELL_SIZE * (zoom / 100)
  const cellH = cellW * CRAFT_CONFIG[craft].aspectRatio
  const NW    = NUMBERS_WIDTH
  const NH    = NUMBERS_HEIGHT

  const cssW = NW + cols * cellW
  const cssH = NH + rows * cellH

  // Resize canvas (resets context transform)
  const pixW = Math.round(cssW * dpr)
  const pixH = Math.round(cssH * dpr)
  if (canvas.width !== pixW || canvas.height !== pixH) {
    canvas.width  = pixW
    canvas.height = pixH
  }
  canvas.style.width  = `${cssW}px`
  canvas.style.height = `${cssH}px`

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  // ── Background ──────────────────────────────────────────────────────────────
  ctx.fillStyle = CANVAS_COLORS.background
  ctx.fillRect(0, 0, cssW, cssH)

  // Numbers background strip
  ctx.fillStyle = CANVAS_COLORS.numbersArea
  ctx.fillRect(cols * cellW, 0, NW,   cssH) // right strip
  ctx.fillRect(0,            0, cssW, NH)   // top strip
  ctx.fillRect(cols * cellW, 0, NW,   NH)   // corner

  // ── Cells ───────────────────────────────────────────────────────────────────
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x    = c * cellW
      const y    = NH + r * cellH
      const color = grid[r]?.[c]?.color ?? null

      ctx.fillStyle = color ?? CANVAS_COLORS.emptyCell
      ctx.fillRect(x, y, cellW, cellH)
    }
  }

  // ── Grid lines ──────────────────────────────────────────────────────────────
  if (showGridLines) {
    // Vertical
    for (let c = 0; c <= cols; c++) {
      const x      = c * cellW
      const isGuide = c % 10 === 0
      ctx.strokeStyle = isGuide ? CANVAS_COLORS.guideLine : CANVAS_COLORS.gridLine
      ctx.lineWidth   = isGuide ? 1 : 0.5
      ctx.beginPath()
      ctx.moveTo(x, NH)
      ctx.lineTo(x, NH + rows * cellH)
      ctx.stroke()
    }
    // Horizontal
    for (let r = 0; r <= rows; r++) {
      const y      = NH + r * cellH
      const isGuide = r % 10 === 0
      ctx.strokeStyle = isGuide ? CANVAS_COLORS.guideLine : CANVAS_COLORS.gridLine
      ctx.lineWidth   = isGuide ? 1 : 0.5
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(cols * cellW, y)
      ctx.stroke()
    }
  }

  // ── Number labels ────────────────────────────────────────────────────────────
  const fontSize = Math.max(8, Math.min(11, cellH * 0.55))
  ctx.fillStyle    = CANVAS_COLORS.numbersText
  ctx.font         = `${fontSize}px ui-monospace, monospace`
  ctx.textBaseline = 'middle'

  // Row numbers (right, every 5, ascending from bottom)
  ctx.textAlign = 'left'
  for (let r = 0; r < rows; r++) {
    const label = rows - r
    if (label === 1 || label % 5 === 0) {
      ctx.fillText(String(label), cols * cellW + 4, NH + r * cellH + cellH / 2)
    }
  }

  // Col numbers (top, every 5)
  ctx.textAlign = 'center'
  for (let c = 0; c < cols; c++) {
    if (c === 0 || (c + 1) % 5 === 0) {
      ctx.fillText(String(c + 1), c * cellW + cellW / 2, NH / 2)
    }
  }

  // ── Hover highlight ──────────────────────────────────────────────────────────
  if (hoverCell) {
    const x = hoverCell.col * cellW
    const y = NH + hoverCell.row * cellH
    ctx.fillStyle   = CANVAS_COLORS.hoverFill
    ctx.fillRect(x, y, cellW, cellH)
    ctx.strokeStyle = CANVAS_COLORS.hoverStroke
    ctx.lineWidth   = 1.5
    ctx.strokeRect(x + 0.75, y + 0.75, cellW - 1.5, cellH - 1.5)
  }
}

export function PatternCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  const grid          = usePatternStore((s) => s.grid)
  const rows          = usePatternStore((s) => s.rows)
  const cols          = usePatternStore((s) => s.cols)
  const zoom          = usePatternStore((s) => s.zoom)
  const craft         = usePatternStore((s) => s.craft)
  const showGridLines = usePatternStore((s) => s.showGridLines)
  const tool          = usePatternStore((s) => s.tool)

  const { hoverCell, handlers } = useGridInteraction()

  // Batch redraws with rAF
  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (canvasRef.current) {
        drawCanvas(
          canvasRef.current,
          grid, rows, cols, zoom, craft, showGridLines, hoverCell
        )
      }
    })
    return () => cancelAnimationFrame(rafRef.current)
  }, [grid, rows, cols, zoom, craft, showGridLines, hoverCell])

  return (
    <canvas
      ref={canvasRef}
      style={{ cursor: CURSOR_MAP[tool] }}
      className="block touch-none select-none rounded-sm shadow-md ring-1 ring-border/50"
      {...handlers}
    />
  )
}
