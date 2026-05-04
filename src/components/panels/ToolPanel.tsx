'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ToolButtons } from './ToolButtons'
import { ColorPalette } from './ColorPalette'
import { GridSettings } from './GridSettings'

export function ToolPanel() {
  return (
    <ScrollArea className="flex-1">
      <Accordion
        defaultValue={['tools', 'palette', 'settings']}
        multiple
        className="px-3 py-2"
      >
        <AccordionItem value="tools">
          <AccordionTrigger className="py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
            Herramientas
          </AccordionTrigger>
          <AccordionContent>
            <ToolButtons />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="palette">
          <AccordionTrigger className="py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
            Colores
          </AccordionTrigger>
          <AccordionContent>
            <ColorPalette />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="settings" className="border-b-0">
          <AccordionTrigger className="py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:no-underline">
            Configuración
          </AccordionTrigger>
          <AccordionContent>
            <GridSettings />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </ScrollArea>
  )
}
