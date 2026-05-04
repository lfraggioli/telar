'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { MiniPreview } from './MiniPreview'
import { PatternSummary } from './PatternSummary'
import { ColorLegend } from './ColorLegend'

export function InfoPanel() {
  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-5 px-3 py-4">
        <MiniPreview />
        <Separator />
        <PatternSummary />
        <Separator />
        <ColorLegend />
      </div>
    </ScrollArea>
  )
}
