import { type ColorPalette, type CraftConfig, type CraftType } from './types'

export const DEFAULT_ROWS = 20
export const DEFAULT_COLS = 20
export const MIN_GRID_SIZE = 5
export const MAX_GRID_SIZE = 100
export const MAX_HISTORY = 50

export const ZOOM_LEVELS = [50, 75, 100, 125, 150] as const

export const CRAFT_CONFIG: Record<CraftType, CraftConfig> = {
  crochet: {
    label: 'Crochet',
    aspectRatio: 1,
    icon: 'crochet',
  },
  knitting: {
    label: 'Dos Agujas',
    aspectRatio: 1.2,
    icon: 'knitting',
  },
  crossStitch: {
    label: 'Punto Cruz',
    aspectRatio: 1,
    icon: 'crossStitch',
  },
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Pasteles',
    colors: [
      '#F8C8DC', '#FADADD', '#F5E6CC', '#D4E2D4',
      '#BFD8D2', '#C3B1E1', '#F0E6CC', '#E8D5B7',
      '#FADBD8', '#D5DBDB', '#A9CCE3', '#F9E79F',
    ],
  },
  {
    name: 'Tierra',
    colors: [
      '#8B4513', '#A0522D', '#CD853F', '#DEB887',
      '#D2691E', '#BC8F8F', '#F4A460', '#DAA520',
      '#B8860B', '#556B2F', '#6B8E23', '#808000',
    ],
  },
  {
    name: 'Vibrantes',
    colors: [
      '#E74C3C', '#E67E22', '#F1C40F', '#2ECC71',
      '#1ABC9C', '#3498DB', '#9B59B6', '#E91E63',
      '#FF5722', '#00BCD4', '#8BC34A', '#FF9800',
    ],
  },
  {
    name: 'Neutros',
    colors: [
      '#FFFFFF', '#F5F5F5', '#E0E0E0', '#BDBDBD',
      '#9E9E9E', '#757575', '#616161', '#424242',
      '#F5F5DC', '#FAF0E6', '#FFFAF0', '#2C2C2C',
    ],
  },
]

export const DEFAULT_COLOR = '#C4756E'

// Canvas rendering constants
export const BASE_CELL_SIZE = 20   // px at 100% zoom
export const NUMBERS_WIDTH = 32    // px for row number column
export const NUMBERS_HEIGHT = 20   // px for col number row

// Canvas theme colors (must match globals.css warm palette)
export const CANVAS_COLORS = {
  background:   '#FFF8F2',
  emptyCell:    '#FFFBF5',
  numbersArea:  '#F0E6DB',
  numbersText:  '#96745A',
  gridLine:     'rgba(150,116,90,0.18)',
  guideLine:    'rgba(150,116,90,0.45)',
  hoverFill:    'rgba(196,117,110,0.22)',
  hoverStroke:  'rgba(196,117,110,0.7)',
} as const
