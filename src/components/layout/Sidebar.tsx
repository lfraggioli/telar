'use client'

import { useState } from 'react'
import { PanelLeft, PanelRight, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface SidebarProps {
  side: 'left' | 'right'
  children: React.ReactNode
  mobileTitle: string
}

export function Sidebar({ side, children, mobileTitle }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const Icon = side === 'left' ? Settings2 : PanelRight

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden h-full shrink-0 flex-col border-border bg-sidebar lg:flex ${
          side === 'left' ? 'w-60 border-r' : 'w-52 border-l'
        }`}
      >
        {children}
      </aside>

      {/* Mobile sheet trigger */}
      <div
        className={`fixed bottom-4 z-40 lg:hidden ${side === 'left' ? 'left-4' : 'right-4'}`}
      >
        <Sheet open={open} onOpenChange={setOpen}>
          <Tooltip>
            <TooltipTrigger
              render={
                <SheetTrigger
                  render={
                    <Button
                      size="icon"
                      className="h-12 w-12 rounded-full shadow-lg"
                    />
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span className="sr-only">{mobileTitle}</span>
                </SheetTrigger>
              }
            />
            <TooltipContent side={side === 'left' ? 'right' : 'left'}>
              {mobileTitle}
            </TooltipContent>
          </Tooltip>

          <SheetContent side={side} className="w-72 overflow-y-auto p-0">
            <div className="flex h-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
