import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Sidebar } from '@/components/layout/Sidebar'
import { ToolPanel } from '@/components/panels/ToolPanel'
import { InfoPanel } from '@/components/panels/InfoPanel'
import { GridArea } from '@/components/editor/GridArea'
import { SupportBanner } from '@/components/ui/SupportBanner'
export default function Home() {
  return (
    <div className="flex h-full flex-col">
      <Header />

      <div className="flex min-h-0 flex-1">
        {/* Left sidebar — tools */}
        <Sidebar side="left" mobileTitle="Herramientas">
          <ToolPanel />
        </Sidebar>

        {/* Main grid area */}
        <main className="flex min-w-0 flex-1 flex-col bg-muted/20">
          <GridArea />
        </main>

        {/* Right sidebar — info & legend */}
        <Sidebar side="right" mobileTitle="Información">
          <InfoPanel />
        </Sidebar>
      </div>
      <SupportBanner variant="floating" cafecitoUser="lfraggdev" bmacUser="" />

      <Footer />
    </div>
  )
}
