'use client'

import { Paintbrush, Eraser, PaintBucket, Pipette, Undo2, Redo2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { usePatternStore, selectTool, selectCanUndo, selectCanRedo } from '@/stores/usePatternStore'
import { type Tool } from '@/lib/types'
import { cn } from '@/lib/utils'

const TOOLS: { id: Tool; icon: React.ElementType; label: string; shortcut: string }[] = [
  { id: 'paint', icon: Paintbrush, label: 'Pintar', shortcut: 'B' },
  { id: 'erase', icon: Eraser, label: 'Borrar', shortcut: 'E' },
  { id: 'fill', icon: PaintBucket, label: 'Rellenar', shortcut: 'G' },
  { id: 'eyedropper', icon: Pipette, label: 'Cuentagotas', shortcut: 'I' },
]

export function ToolButtons() {
  const tool = usePatternStore(selectTool)
  const canUndo = usePatternStore(selectCanUndo)
  const canRedo = usePatternStore(selectCanRedo)
  const { setTool, undo, redo } = usePatternStore()

  return (
    <div className="flex flex-col gap-2">
      {/* Main tools grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {TOOLS.map(({ id, icon: Icon, label, shortcut }) => (
          <Tooltip key={id}>
            <TooltipTrigger
              render={
                <Button
                  variant={tool === id ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    'flex h-10 flex-col gap-0.5 text-xs transition-all',
                    tool === id && 'ring-2 ring-primary/30'
                  )}
                  onClick={() => setTool(id)}
                />
              }
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] leading-none">{label}</span>
            </TooltipTrigger>
            <TooltipContent>
              {label}{' '}
              <kbd className="ml-1 rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
                {shortcut}
              </kbd>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* Undo / Redo */}
      <div className="flex gap-1.5">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-xs"
                disabled={!canUndo}
                onClick={undo}
              />
            }
          >
            <Undo2 className="h-3.5 w-3.5" />
            Deshacer
          </TooltipTrigger>
          <TooltipContent>
            Deshacer{' '}
            <kbd className="ml-1 rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
              Ctrl+Z
            </kbd>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-xs"
                disabled={!canRedo}
                onClick={redo}
              />
            }
          >
            <Redo2 className="h-3.5 w-3.5" />
            Rehacer
          </TooltipTrigger>
          <TooltipContent>
            Rehacer{' '}
            <kbd className="ml-1 rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
              Ctrl+Shift+Z
            </kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
