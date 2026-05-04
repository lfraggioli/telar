'use client'

import { useEffect } from 'react'
import { PatternCanvas } from './PatternCanvas'
import { usePatternStore } from '@/stores/usePatternStore'
import { ZOOM_LEVELS } from '@/lib/constants'

export function GridArea() {
  const tool          = usePatternStore((s) => s.tool)
  const zoom          = usePatternStore((s) => s.zoom)
  const grid          = usePatternStore((s) => s.grid)
  const rows          = usePatternStore((s) => s.rows)
  const cols          = usePatternStore((s) => s.cols)
  const { setTool, undo, redo, setZoom } = usePatternStore()

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) return

      const ctrl = e.ctrlKey || e.metaKey

      if (ctrl && e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault(); redo(); return
      }
      if (ctrl && e.key.toLowerCase() === 'z') {
        e.preventDefault(); undo(); return
      }

      if (!ctrl) {
        switch (e.key.toLowerCase()) {
          case 'b': setTool('paint');      break
          case 'e': setTool('erase');      break
          case 'g': setTool('fill');       break
          case 'i': setTool('eyedropper'); break
          case '+':
          case '=': {
            const idx = ZOOM_LEVELS.indexOf(zoom as (typeof ZOOM_LEVELS)[number])
            if (idx < ZOOM_LEVELS.length - 1) setZoom(ZOOM_LEVELS[idx + 1])
            break
          }
          case '-': {
            const idx = ZOOM_LEVELS.indexOf(zoom as (typeof ZOOM_LEVELS)[number])
            if (idx > 0) setZoom(ZOOM_LEVELS[idx - 1])
            break
          }
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [tool, zoom, setTool, undo, redo, setZoom])

  const isEmpty = grid.every((row) => row.every((cell) => !cell.color))

  return (
    <div className="relative flex flex-1 overflow-auto bg-muted/20">
      <div className="m-auto p-8">
        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <span className="text-5xl opacity-30">🧶</span>
            <p className="text-sm font-medium text-muted-foreground/60">
              Empezá a crear tu patrón
            </p>
            <p className="text-xs text-muted-foreground/40">
              {rows} × {cols} · seleccioná un color y hacé click
            </p>
          </div>
        )}
        <PatternCanvas />
      </div>
    </div>
  )
}
