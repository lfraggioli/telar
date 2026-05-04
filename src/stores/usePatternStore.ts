import { create } from 'zustand'
import { type Cell, type CraftType, type Tool, type HistoryEntry } from '@/lib/types'
import {
  DEFAULT_ROWS,
  DEFAULT_COLS,
  DEFAULT_COLOR,
  MAX_HISTORY,
  MAX_GRID_SIZE,
  MIN_GRID_SIZE,
} from '@/lib/constants'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createEmptyGrid(rows: number, cols: number): Cell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ color: null }))
  )
}

function cloneGrid(grid: Cell[][]): Cell[][] {
  return grid.map((row) => row.map((cell) => ({ ...cell })))
}

function addRecentColor(recentColors: string[], color: string): string[] {
  const filtered = recentColors.filter((c) => c !== color)
  return [color, ...filtered].slice(0, 8)
}

// ---------------------------------------------------------------------------
// BFS flood fill — iterative, no recursion (avoids stack overflow on large grids)
// ---------------------------------------------------------------------------

function floodFill(grid: Cell[][], row: number, col: number, newColor: string): Cell[][] {
  const rows = grid.length
  const cols = grid[0]?.length ?? 0
  const targetColor = grid[row]?.[col]?.color ?? null

  if (targetColor === newColor) return grid

  const next = cloneGrid(grid)
  const queue: [number, number][] = [[row, col]]
  const visited = new Set<number>()
  const key = (r: number, c: number) => r * MAX_GRID_SIZE + c

  visited.add(key(row, col))

  while (queue.length > 0) {
    const [r, c] = queue.shift()!
    next[r][c] = { ...next[r][c], color: newColor }

    const neighbors: [number, number][] = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ]

    for (const [nr, nc] of neighbors) {
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      if (visited.has(key(nr, nc))) continue
      if (next[nr][nc].color !== targetColor) continue

      visited.add(key(nr, nc))
      queue.push([nr, nc])
    }
  }

  return next
}

// ---------------------------------------------------------------------------
// State interface
// ---------------------------------------------------------------------------

export interface PatternState {
  grid: Cell[][]
  selectedColor: string
  tool: Tool
  craft: CraftType
  rows: number
  cols: number
  patternName: string
  zoom: number
  showGridLines: boolean
  history: HistoryEntry[]
  historyIndex: number
  recentColors: string[]
}

interface PatternActions {
  paintCell: (row: number, col: number) => void
  eraseCell: (row: number, col: number) => void
  fillArea: (row: number, col: number) => void
  eyedropper: (row: number, col: number) => void
  resizeGrid: (newRows: number, newCols: number) => void
  clearGrid: () => void
  undo: () => void
  redo: () => void
  changeCraft: (craft: CraftType) => void
  setTool: (tool: Tool) => void
  setColor: (color: string) => void
  setZoom: (zoom: number) => void
  setPatternName: (name: string) => void
  setShowGridLines: (show: boolean) => void
  loadPattern: (state: Partial<PatternState>) => void
}

// ---------------------------------------------------------------------------
// History helpers (used internally)
// ---------------------------------------------------------------------------

type FullState = PatternState & PatternActions

type StoreSet = (
  partial: Partial<FullState> | ((state: FullState) => Partial<FullState>),
  replace?: false
) => void

type StoreGet = () => FullState

function pushHistory(set: StoreSet, get: StoreGet, newGrid: Cell[][]) {
  const { history, historyIndex } = get()
  const entry: HistoryEntry = { grid: cloneGrid(newGrid), timestamp: Date.now() }

  // Trim forward history when a new action branches from a past state
  const trimmed = history.slice(0, historyIndex + 1)

  // Cap at MAX_HISTORY entries
  const next = [...trimmed, entry].slice(-MAX_HISTORY)

  set({ history: next, historyIndex: next.length - 1 })
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

const initialGrid = createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS)
const initialHistoryEntry: HistoryEntry = { grid: cloneGrid(initialGrid), timestamp: Date.now() }

export const usePatternStore = create<PatternState & PatternActions>()((set, get) => ({
  // --- state ---
  grid: initialGrid,
  selectedColor: DEFAULT_COLOR,
  tool: 'paint',
  craft: 'crochet',
  rows: DEFAULT_ROWS,
  cols: DEFAULT_COLS,
  patternName: 'Mi Patrón',
  zoom: 100,
  showGridLines: true,
  history: [initialHistoryEntry],
  historyIndex: 0,
  recentColors: [],

  // --- actions ---

  paintCell(row, col) {
    const { grid, selectedColor } = get()
    const current = grid[row]?.[col]
    if (!current || current.color === selectedColor) return

    const next = cloneGrid(grid)
    next[row][col] = { ...next[row][col], color: selectedColor }

    pushHistory(set, get, next)
    set((s) => ({
      grid: next,
      recentColors: addRecentColor(s.recentColors, selectedColor),
    }))
  },

  eraseCell(row, col) {
    const { grid } = get()
    const current = grid[row]?.[col]
    if (!current || current.color === null) return

    const next = cloneGrid(grid)
    next[row][col] = { ...next[row][col], color: null }

    pushHistory(set, get, next)
    set({ grid: next })
  },

  fillArea(row, col) {
    const { grid, selectedColor } = get()
    const next = floodFill(grid, row, col, selectedColor)
    if (next === grid) return

    pushHistory(set, get, next)
    set((s) => ({
      grid: next,
      recentColors: addRecentColor(s.recentColors, selectedColor),
    }))
  },

  eyedropper(row, col) {
    const { grid } = get()
    const color = grid[row]?.[col]?.color
    if (!color) return

    set((s) => ({
      selectedColor: color,
      tool: 'paint',
      recentColors: addRecentColor(s.recentColors, color),
    }))
  },

  resizeGrid(newRows, newCols) {
    const { grid } = get()
    const clampedRows = Math.min(Math.max(newRows, MIN_GRID_SIZE), MAX_GRID_SIZE)
    const clampedCols = Math.min(Math.max(newCols, MIN_GRID_SIZE), MAX_GRID_SIZE)

    const next: Cell[][] = Array.from({ length: clampedRows }, (_, r) =>
      Array.from({ length: clampedCols }, (_, c) => {
        const existing = grid[r]?.[c]
        return existing ? { ...existing } : { color: null }
      })
    )

    pushHistory(set, get, next)
    set({ grid: next, rows: clampedRows, cols: clampedCols })
  },

  clearGrid() {
    const { rows, cols } = get()
    const next = createEmptyGrid(rows, cols)
    pushHistory(set, get, next)
    set({ grid: next })
  },

  undo() {
    const { history, historyIndex } = get()
    if (historyIndex <= 0) return

    const newIndex = historyIndex - 1
    const entry = history[newIndex]
    const restoredGrid = cloneGrid(entry.grid)

    set({
      historyIndex: newIndex,
      grid: restoredGrid,
      rows: restoredGrid.length,
      cols: restoredGrid[0]?.length ?? 0,
    })
  },

  redo() {
    const { history, historyIndex } = get()
    if (historyIndex >= history.length - 1) return

    const newIndex = historyIndex + 1
    const entry = history[newIndex]
    const restoredGrid = cloneGrid(entry.grid)

    set({
      historyIndex: newIndex,
      grid: restoredGrid,
      rows: restoredGrid.length,
      cols: restoredGrid[0]?.length ?? 0,
    })
  },

  changeCraft(craft) {
    set({ craft })
  },

  setTool(tool) {
    set({ tool })
  },

  setColor(color) {
    set((s) => ({
      selectedColor: color,
      recentColors: addRecentColor(s.recentColors, color),
    }))
  },

  setZoom(zoom) {
    set({ zoom })
  },

  setPatternName(name) {
    set({ patternName: name })
  },

  setShowGridLines(show) {
    set({ showGridLines: show })
  },

  loadPattern(state) {
    const grid = state.grid ?? createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS)
    const entry: HistoryEntry = { grid: cloneGrid(grid), timestamp: Date.now() }
    set({
      ...state,
      grid,
      rows: grid.length,
      cols: grid[0]?.length ?? DEFAULT_COLS,
      history: [entry],
      historyIndex: 0,
    })
  },
}))

// ---------------------------------------------------------------------------
// Derived selectors (stable references — avoids unnecessary re-renders)
// ---------------------------------------------------------------------------

export const selectGrid = (s: PatternState) => s.grid
export const selectTool = (s: PatternState) => s.tool
export const selectColor = (s: PatternState) => s.selectedColor
export const selectCraft = (s: PatternState) => s.craft
export const selectZoom = (s: PatternState) => s.zoom
export const selectShowGridLines = (s: PatternState) => s.showGridLines
export const selectPatternName = (s: PatternState) => s.patternName
export const selectRows = (s: PatternState) => s.rows
export const selectCols = (s: PatternState) => s.cols
export const selectCanUndo = (s: PatternState) => s.historyIndex > 0
export const selectCanRedo = (s: PatternState & PatternActions) =>
  s.historyIndex < s.history.length - 1
export const selectRecentColors = (s: PatternState) => s.recentColors
