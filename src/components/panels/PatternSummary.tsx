'use client'

import { useMemo } from 'react'
import { usePatternStore } from '@/stores/usePatternStore'
import { CRAFT_CONFIG } from '@/lib/constants'

export function PatternSummary() {
  const patternName = usePatternStore((s) => s.patternName)
  const craft       = usePatternStore((s) => s.craft)
  const rows        = usePatternStore((s) => s.rows)
  const cols        = usePatternStore((s) => s.cols)
  const grid        = usePatternStore((s) => s.grid)

  const stats = useMemo(() => {
    let painted = 0
    for (const row of grid) {
      for (const cell of row) {
        if (cell.color) painted++
      }
    }
    const total = rows * cols
    return { painted, empty: total - painted, total }
  }, [grid, rows, cols])

  const pct = stats.total > 0 ? (stats.painted / stats.total) * 100 : 0

  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        Patrón
      </p>

      {/* Name */}
      <p className="truncate text-sm font-semibold text-foreground leading-tight" title={patternName}>
        {patternName || 'Sin nombre'}
      </p>

      {/* Craft + dimensions */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span>{CRAFT_CONFIG[craft].label}</span>
        <span className="text-border">·</span>
        <span className="font-medium text-foreground/70">{rows} × {cols}</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="flex flex-col rounded-lg bg-muted/40 px-2.5 py-2">
          <span className="text-[10px] text-muted-foreground">Total</span>
          <span className="font-mono text-sm font-semibold tabular-nums">
            {stats.total.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col rounded-lg bg-primary/8 px-2.5 py-2">
          <span className="text-[10px] text-muted-foreground">Pintadas</span>
          <span className="font-mono text-sm font-semibold tabular-nums text-primary">
            {stats.painted.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>Completado</span>
          <span className="font-medium tabular-nums">{Math.round(pct)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
