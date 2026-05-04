'use client'

import { useRef } from 'react'
import { Download, FileDown, Trash2, Save, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePatternStore, selectCraft, selectPatternName } from '@/stores/usePatternStore'
import { type CraftType } from '@/lib/types'
import { CRAFT_CONFIG } from '@/lib/constants'
import {
  exportToPNG,
  exportToPDF,
  savePatternJSON,
  loadPatternFromFile,
} from '@/lib/export'

export function Header() {
  const craft       = usePatternStore(selectCraft)
  const patternName = usePatternStore(selectPatternName)
  const { changeCraft, setPatternName, clearGrid, loadPattern } = usePatternStore()

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExportPNG() {
    exportToPNG(usePatternStore.getState())
  }

  async function handleExportPDF() {
    await exportToPDF(usePatternStore.getState())
  }

  function handleSaveJSON() {
    savePatternJSON(usePatternStore.getState())
  }

  async function handleLoadJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const state = await loadPatternFromFile(file)
      loadPattern(state)
    } catch {
      alert('No se pudo cargar el archivo. Verificá que sea un archivo .telar.json válido.')
    } finally {
      // Reset input so the same file can be loaded again
      e.target.value = ''
    }
  }

  return (
    <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Logo */}
      <div className="flex items-center gap-2 select-none">
        <span className="text-xl leading-none">🧶</span>
        <span className="font-heading text-xl font-bold tracking-tight text-primary">
          Telar
        </span>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Craft type selector */}
      <Tabs
        value={craft}
        onValueChange={(v) => changeCraft(v as CraftType)}
        className="hidden sm:flex"
      >
        <TabsList className="h-8">
          {(Object.entries(CRAFT_CONFIG) as [CraftType, (typeof CRAFT_CONFIG)[CraftType]][]).map(
            ([key, cfg]) => (
              <TabsTrigger key={key} value={key} className="px-3 text-xs">
                {cfg.label}
              </TabsTrigger>
            )
          )}
        </TabsList>
      </Tabs>

      <Separator orientation="vertical" className="hidden h-6 sm:block" />

      {/* Pattern name */}
      <Input
        value={patternName}
        onChange={(e) => setPatternName(e.target.value)}
        className="h-8 w-36 border-transparent bg-transparent px-2 text-sm font-medium shadow-none hover:border-border focus:border-border focus-visible:ring-0 lg:w-48"
        placeholder="Nombre del patrón"
      />

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Export PNG */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-1.5 text-xs sm:flex"
                onClick={handleExportPNG}
              />
            }
          >
            <Download className="h-3.5 w-3.5" />
            PNG
          </TooltipTrigger>
          <TooltipContent>Exportar imagen PNG de alta resolución</TooltipContent>
        </Tooltip>

        {/* Export PDF */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="hidden gap-1.5 text-xs sm:flex"
                onClick={handleExportPDF}
              />
            }
          >
            <FileDown className="h-3.5 w-3.5" />
            PDF
          </TooltipTrigger>
          <TooltipContent>Exportar PDF imprimible</TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        {/* Save JSON */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="hidden gap-1.5 text-xs sm:flex"
                onClick={handleSaveJSON}
              />
            }
          >
            <Save className="h-3.5 w-3.5" />
            Guardar
          </TooltipTrigger>
          <TooltipContent>Guardar proyecto como .telar.json</TooltipContent>
        </Tooltip>

        {/* Load JSON */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="hidden gap-1.5 text-xs sm:flex"
                onClick={() => fileInputRef.current?.click()}
              />
            }
          >
            <FolderOpen className="h-3.5 w-3.5" />
            Abrir
          </TooltipTrigger>
          <TooltipContent>Cargar proyecto desde .telar.json</TooltipContent>
        </Tooltip>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.telar.json"
          className="sr-only"
          onChange={handleLoadJSON}
        />

        <Separator orientation="vertical" className="h-6" />

        {/* Clear grid */}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-muted-foreground hover:text-destructive"
                onClick={() => {
                  if (confirm('¿Limpiar toda la grilla? Esta acción se puede deshacer.')) {
                    clearGrid()
                  }
                }}
              />
            }
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Limpiar</span>
          </TooltipTrigger>
          <TooltipContent>Limpiar toda la grilla</TooltipContent>
        </Tooltip>
      </div>
    </header>
  )
}
