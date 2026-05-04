'use client'

import { useCallback, useRef, useState } from 'react'
import { usePatternStore } from '@/stores/usePatternStore'
import { CRAFT_CONFIG, BASE_CELL_SIZE, NUMBERS_WIDTH, NUMBERS_HEIGHT } from '@/lib/constants'

export interface HoverCell {
  row: number
  col: number
}

export interface GridInteractionHandlers {
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onContextMenu: (e: React.MouseEvent) => void
}

function getCellFromPoint(
  x: number,
  y: number,
  cellW: number,
  cellH: number,
  rows: number,
  cols: number
): HoverCell | null {
  const col = Math.floor((x - NUMBERS_WIDTH) / cellW)
  const row = Math.floor((y - NUMBERS_HEIGHT) / cellH)
  if (row < 0 || row >= rows || col < 0 || col >= cols) return null
  return { row, col }
}

export function useGridInteraction() {
  const tool     = usePatternStore((s) => s.tool)
  const zoom     = usePatternStore((s) => s.zoom)
  const craft    = usePatternStore((s) => s.craft)
  const rows     = usePatternStore((s) => s.rows)
  const cols     = usePatternStore((s) => s.cols)
  const paintCell  = usePatternStore((s) => s.paintCell)
  const eraseCell  = usePatternStore((s) => s.eraseCell)
  const fillArea   = usePatternStore((s) => s.fillArea)
  const eyedropper = usePatternStore((s) => s.eyedropper)

  const [hoverCell, setHoverCell] = useState<HoverCell | null>(null)

  const isDrawing  = useRef(false)
  // Track last painted cell to avoid redundant store calls during drag
  const lastPainted = useRef<string | null>(null)

  // Compute cell dimensions from current zoom + craft
  const getCellDims = useCallback(() => {
    const cellW = BASE_CELL_SIZE * (zoom / 100)
    const cellH = cellW * CRAFT_CONFIG[craft].aspectRatio
    return { cellW, cellH }
  }, [zoom, craft])

  const applyTool = useCallback(
    (row: number, col: number, isMouseDown = false) => {
      switch (tool) {
        case 'paint':
          paintCell(row, col)
          break
        case 'erase':
          eraseCell(row, col)
          break
        case 'fill':
          // fill only on initial click
          if (isMouseDown) fillArea(row, col)
          break
        case 'eyedropper':
          // eyedropper only on initial click
          if (isMouseDown) eyedropper(row, col)
          break
      }
    },
    [tool, paintCell, eraseCell, fillArea, eyedropper]
  )

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (e.button !== 0) return
      const rect = e.currentTarget.getBoundingClientRect()
      // Account for CSS scale vs canvas CSS size (canvas is not transformed — just sized)
      const scaleX = e.currentTarget.offsetWidth / e.currentTarget.clientWidth || 1
      const x = (e.clientX - rect.left) * scaleX
      const y = (e.clientY - rect.top) * scaleX
      const { cellW, cellH } = getCellDims()
      const cell = getCellFromPoint(x, y, cellW, cellH, rows, cols)
      if (!cell) return

      isDrawing.current = true
      lastPainted.current = null

      const key = `${cell.row},${cell.col}`
      lastPainted.current = key
      applyTool(cell.row, cell.col, true)
    },
    [getCellDims, rows, cols, applyTool]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const { cellW, cellH } = getCellDims()
      const cell = getCellFromPoint(x, y, cellW, cellH, rows, cols)

      setHoverCell(cell)

      if (!isDrawing.current || !cell) return

      const key = `${cell.row},${cell.col}`
      if (lastPainted.current === key) return
      lastPainted.current = key
      applyTool(cell.row, cell.col, false)
    },
    [getCellDims, rows, cols, applyTool]
  )

  const onMouseUp = useCallback(() => {
    isDrawing.current = false
    lastPainted.current = null
  }, [])

  const onMouseLeave = useCallback(() => {
    isDrawing.current = false
    lastPainted.current = null
    setHoverCell(null)
  }, [])

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
  }, [])

  return {
    hoverCell,
    handlers: { onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onContextMenu },
  }
}
