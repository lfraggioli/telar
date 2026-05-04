'use client'

import { useState, useEffect } from 'react'
import { Minus, Plus, Grid3X3 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { usePatternStore, selectZoom, selectShowGridLines, selectRows, selectCols } from '@/stores/usePatternStore'
import { ZOOM_LEVELS, MIN_GRID_SIZE, MAX_GRID_SIZE } from '@/lib/constants'

export function GridSettings() {
  const zoom = usePatternStore(selectZoom)
  const showGridLines = usePatternStore(selectShowGridLines)
  const rows = usePatternStore(selectRows)
  const cols = usePatternStore(selectCols)
  const { setZoom, setShowGridLines, resizeGrid } = usePatternStore()

  const [localRows, setLocalRows] = useState(String(rows))
  const [localCols, setLocalCols] = useState(String(cols))

  useEffect(() => { setLocalRows(String(rows)) }, [rows])
  useEffect(() => { setLocalCols(String(cols)) }, [cols])

  function commitRows() {
    const n = parseInt(localRows, 10)
    if (!isNaN(n)) resizeGrid(n, cols)
    else setLocalRows(String(rows))
  }

  function commitCols() {
    const n = parseInt(localCols, 10)
    if (!isNaN(n)) resizeGrid(rows, n)
    else setLocalCols(String(cols))
  }

  function stepZoom(dir: 1 | -1) {
    const idx = ZOOM_LEVELS.indexOf(zoom as typeof ZOOM_LEVELS[number])
    const next = ZOOM_LEVELS[idx + dir]
    if (next !== undefined) setZoom(next)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Dimensions */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Dimensiones
        </p>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-muted-foreground">Filas</label>
            <Input
              type="number"
              min={MIN_GRID_SIZE}
              max={MAX_GRID_SIZE}
              value={localRows}
              onChange={(e) => setLocalRows(e.target.value)}
              onBlur={commitRows}
              onKeyDown={(e) => e.key === 'Enter' && commitRows()}
              className="h-8 text-center text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-muted-foreground">Columnas</label>
            <Input
              type="number"
              min={MIN_GRID_SIZE}
              max={MAX_GRID_SIZE}
              value={localCols}
              onChange={(e) => setLocalCols(e.target.value)}
              onBlur={commitCols}
              onKeyDown={(e) => e.key === 'Enter' && commitCols()}
              className="h-8 text-center text-sm"
            />
          </div>
        </div>
      </div>

      {/* Grid lines toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-foreground/80">Líneas de grilla</span>
        </div>
        <Switch
          checked={showGridLines}
          onCheckedChange={setShowGridLines}
          size="sm"
          aria-label="Mostrar líneas de grilla"
        />
      </div>

      {/* Zoom */}
      <div className="flex flex-col gap-2">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Zoom
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={zoom <= ZOOM_LEVELS[0]}
            onClick={() => stepZoom(-1)}
            aria-label="Reducir zoom"
          >
            <Minus className="h-3 w-3" />
          </Button>

          <Slider
            min={50}
            max={150}
            value={[zoom]}
            onValueChange={(values) => {
              const v = Array.isArray(values) ? values[0] : values
              if (typeof v === 'number') setZoom(v)
            }}
            className="flex-1"
            aria-label="Zoom"
          />

          <Button
            variant="outline"
            size="icon-sm"
            disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
            onClick={() => stepZoom(1)}
            aria-label="Aumentar zoom"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Zoom level pills */}
        <div className="flex justify-between">
          {ZOOM_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setZoom(level)}
              className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-medium transition-colors ${
                zoom === level
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {level}%
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
