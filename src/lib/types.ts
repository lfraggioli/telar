export type CraftType = 'crochet' | 'knitting' | 'crossStitch'

export type Tool = 'paint' | 'erase' | 'fill' | 'eyedropper' | 'select'

export interface Cell {
  color: string | null
  symbol?: string
}

export interface Pattern {
  name: string
  craft: CraftType
  rows: number
  cols: number
  grid: Cell[][]
  createdAt: string
  palette: string[]
}

export interface HistoryEntry {
  grid: Cell[][]
  timestamp: number
}

export interface ColorPalette {
  name: string
  colors: string[]
}

export interface CraftConfig {
  label: string
  aspectRatio: number
  icon: string
}
