'use client'

import { useMemo } from 'react'
import { usePatternStore } from '@/stores/usePatternStore'

interface ColorEntry {
  color: string
  count: number
  pct: number
}

export function ColorLegend() {
  const grid = usePatternStore((s) => s.grid)
  const rows = usePatternStore((s) => s.rows)
  const cols = usePatternStore((s) => s.cols)

  const legend: ColorEntry[] = useMemo(() => {
    const map = new Map<string, number>()
    for (const row of grid) {
      for (const cell of row) {
        if (cell.color) {
          map.set(cell.color, (map.get(cell.color) ?? 0) + 1)
        }
      }
    }
    const total = rows * cols
    return Array.from(map.entries())
      .map(([color, count]) => ({ color, count, pct: (count / total) * 100 }))
      .sort((a, b) => b.count - a.count)
  }, [grid, rows, cols])

  if (legend.length === 0) {
    return (
      <div className="flex flex-col gap-1.5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Colores usados
        </p>
        <p className="text-xs text-muted-foreground/60 italic">Ninguno todavía</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Colores usados
        </p>
        <span className="text-[10px] text-muted-foreground">{legend.length}</span>
      </div>

      <div className="flex flex-col gap-1">
        {legend.map(({ color, count, pct }) => (
          <div key={color} className="flex items-center gap-2">
            {/* Color swatch */}
            <span
              className="h-4 w-4 shrink-0 rounded-[3px] border border-black/10 shadow-sm"
              style={{ backgroundColor: color }}
            />

            {/* Hex */}
            <span className="min-w-0 flex-1 font-mono text-[10px] text-foreground/80 uppercase truncate">
              {color}
            </span>

            {/* Count + % */}
            <div className="flex shrink-0 flex-col items-end">
              <span className="font-mono text-[10px] font-medium tabular-nums leading-none">
                {count.toLocaleString()}
              </span>
              <span className="text-[9px] tabular-nums text-muted-foreground leading-none">
                {pct.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
