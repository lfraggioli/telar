'use client'

import { useRef } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  usePatternStore,
  selectColor,
  selectRecentColors,
} from '@/stores/usePatternStore'
import { COLOR_PALETTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function ColorPalette() {
  const selectedColor = usePatternStore(selectColor)
  const recentColors = usePatternStore(selectRecentColors)
  const { setColor } = usePatternStore()
  const pickerRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col gap-3">
      {/* Active color indicator */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => pickerRef.current?.click()}
          className="h-9 w-9 shrink-0 rounded-lg border-2 border-white shadow-md ring-1 ring-border transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          style={{ backgroundColor: selectedColor }}
          aria-label="Color activo — click para abrir selector"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Color activo
          </p>
          <p className="font-mono text-sm font-semibold tracking-wide text-foreground">
            {selectedColor.toUpperCase()}
          </p>
        </div>
        <input
          ref={pickerRef}
          type="color"
          value={selectedColor}
          onChange={(e) => setColor(e.target.value)}
          className="sr-only"
          aria-label="Selector de color personalizado"
        />
      </div>

      {/* Palette tabs */}
      <Tabs defaultValue={COLOR_PALETTES[0].name} className="gap-1.5">
        <TabsList className="h-7 w-full">
          {COLOR_PALETTES.map((palette) => (
            <TabsTrigger
              key={palette.name}
              value={palette.name}
              className="flex-1 px-1 text-[10px]"
            >
              {palette.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {COLOR_PALETTES.map((palette) => (
          <TabsContent key={palette.name} value={palette.name} className="mt-0">
            <div className="grid grid-cols-6 gap-1.5 pt-1">
              {palette.colors.map((color) => (
                <Tooltip key={color}>
                  <TooltipTrigger
                    render={
                      <button
                        onClick={() => setColor(color)}
                        className={cn(
                          'h-7 w-7 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          selectedColor === color
                            ? 'border-foreground shadow-md scale-110'
                            : 'border-background shadow-sm'
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={color}
                      />
                    }
                  />
                  <TooltipContent>
                    <span className="font-mono text-xs">{color.toUpperCase()}</span>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Recent colors */}
      {recentColors.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Recientes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {recentColors.map((color) => (
              <Tooltip key={color}>
                <TooltipTrigger
                  render={
                    <button
                      onClick={() => setColor(color)}
                      className={cn(
                        'h-6 w-6 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                        selectedColor === color
                          ? 'border-foreground scale-110'
                          : 'border-background'
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={color}
                    />
                  }
                />
                <TooltipContent>
                  <span className="font-mono text-xs">{color.toUpperCase()}</span>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
