'use client'

import { useEffect, useRef } from 'react'
import { usePatternStore } from '@/stores/usePatternStore'
import { CRAFT_CONFIG, CANVAS_COLORS } from '@/lib/constants'

const PREVIEW_MAX = 160   // max CSS px width/height of the preview

export function MiniPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  const grid  = usePatternStore((s) => s.grid)
  const rows  = usePatternStore((s) => s.rows)
  const cols  = usePatternStore((s) => s.cols)
  const craft = usePatternStore((s) => s.craft)

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const aspect = CRAFT_CONFIG[craft].aspectRatio
      // Fit inside PREVIEW_MAX × PREVIEW_MAX
      const rawCellW = PREVIEW_MAX / cols
      const rawCellH = (PREVIEW_MAX / rows) / aspect
      const cellSize = Math.min(rawCellW, rawCellH, 8)  // cap at 8px per cell
      const cellW    = cellSize
      const cellH    = cellSize * aspect

      const cssW = Math.round(cols * cellW)
      const cssH = Math.round(rows * cellH)
      const dpr  = window.devicePixelRatio || 1

      if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
        canvas.width  = Math.round(cssW * dpr)
        canvas.height = Math.round(cssH * dpr)
      }
      canvas.style.width  = `${cssW}px`
      canvas.style.height = `${cssH}px`

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = CANVAS_COLORS.emptyCell
      ctx.fillRect(0, 0, cssW, cssH)

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const color = grid[r]?.[c]?.color
          if (!color) continue
          ctx.fillStyle = color
          ctx.fillRect(
            Math.round(c * cellW),
            Math.round(r * cellH),
            Math.ceil(cellW),
            Math.ceil(cellH)
          )
        }
      }
    })

    return () => cancelAnimationFrame(rafRef.current)
  }, [grid, rows, cols, craft])

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Vista previa
      </p>
      <div className="flex justify-center rounded-lg border border-border bg-muted/30 p-2">
        <canvas
          ref={canvasRef}
          className="block rounded shadow-sm ring-1 ring-border/40"
        />
      </div>
    </div>
  )
}
