import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Playfair_Display, Geist_Mono, Monoton } from 'next/font/google'
import { TooltipProvider } from '@/components/ui/tooltip'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-plus-jakarta',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

const monoton = Monoton({
  variable: '--font-monoton',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Telar — Editor de Patrones de Tejido',
  description:
    'Creá, editá y exportá patrones de tejido de forma visual e intuitiva. Crochet, dos agujas y punto cruz.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakarta.variable} ${playfair.variable} ${geistMono.variable} ${monoton.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex h-full flex-col overflow-hidden">
        <TooltipProvider delay={400}>{children}</TooltipProvider>
      </body>
    </html>
  )
}
