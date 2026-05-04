'use client'

import { usePatternStore } from '@/stores/usePatternStore'
import { useMemo } from 'react'

export function Footer() {
  const grid = usePatternStore((s) => s.grid)
  const rows = usePatternStore((s) => s.rows)
  const cols = usePatternStore((s) => s.cols)
  const craft = usePatternStore((s) => s.craft)

  const stats = useMemo(() => {
    let painted = 0
    const colorSet = new Set<string>()

    for (const row of grid) {
      for (const cell of row) {
        if (cell.color) {
          painted++
          colorSet.add(cell.color)
        }
      }
    }

    return {
      painted,
      empty: rows * cols - painted,
      total: rows * cols,
      colors: colorSet.size,
    }
  }, [grid, rows, cols])

  const craftLabel: Record<string, string> = {
    crochet: 'Crochet',
    knitting: 'Dos Agujas',
    crossStitch: 'Punto Cruz',
  }

  return (
    <footer className="flex h-8 shrink-0 items-center gap-4 border-t border-border bg-muted/30 px-4 text-xs text-muted-foreground">
      <span className="font-medium text-foreground/70">{craftLabel[craft]}</span>
      <span className="hidden sm:inline">·</span>
      <span className="hidden sm:inline">
        {rows} × {cols} pt
      </span>
      <span>·</span>
      <span>
        <span className="font-medium text-foreground/80">{stats.painted}</span> pintadas
      </span>
      <span>·</span>
      <span>
        <span className="font-medium text-foreground/80">{stats.empty}</span> vacías
      </span>
      <span>·</span>
      <span>
        <span className="font-medium text-foreground/80">{stats.colors}</span>{' '}
        {stats.colors === 1 ? 'color' : 'colores'}
      </span>

      {/* Progress bar */}
      <div className="ml-auto hidden w-32 items-center gap-2 sm:flex">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{
              width: stats.total > 0 ? `${(stats.painted / stats.total) * 100}%` : '0%',
            }}
          />
        </div>
        <span className="w-8 text-right tabular-nums">
          {stats.total > 0 ? Math.round((stats.painted / stats.total) * 100) : 0}%
        </span>
      </div>
    </footer>
  )
}
