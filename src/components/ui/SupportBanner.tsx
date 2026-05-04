'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Coffee, Heart, X, ExternalLink } from 'lucide-react'

interface SupportBannerProps {
  variant: 'inline' | 'floating'
  cafecitoUser: string
  bmacUser: string
}

function DonateButton({
  href,
  icon,
  label,
  className,
}: {
  href: string
  icon: React.ReactNode
  label: string
  className: string
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-shadow hover:shadow-md ${className}`}
    >
      {icon}
      {label}
      <ExternalLink className="h-3 w-3 opacity-60" />
    </motion.a>
  )
}

function BannerContent({
  cafecitoUser,
  onDismiss,
  compact = false,
}: {
  cafecitoUser: string
  onDismiss: () => void
  compact?: boolean
}) {
  return (
    <div className="relative flex flex-col gap-3">
      <button
        onClick={onDismiss}
        className="absolute right-0 top-0 rounded-lg p-1 text-warm-600 transition-colors hover:bg-warm-100 hover:text-warm-800"
        aria-label="Cerrar"
      >
        <X className="h-3.5 w-3.5" />
      </button>

      <div className="pr-6">
        <p className="font-heading text-base font-semibold text-warm-900">
          ¿Te gusta Telar? ☕
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-warm-700">
          Es un proyecto independiente y tu apoyo ayuda a seguir mejorándolo.
        </p>
      </div>

      <div className={`flex gap-2 ${compact ? 'flex-col' : 'flex-wrap'}`}>
        <DonateButton
          href={`https://cafecito.app/${cafecitoUser}`}
          icon={<Coffee className="h-3.5 w-3.5" />}
          label="Invitame un cafecito"
          className="bg-[#6F3E28] text-[#FFF8F2] hover:bg-[#5C3220]"
        />
      </div>
    </div>
  )
}

export function SupportBanner({ variant, cafecitoUser, bmacUser }: SupportBannerProps) {
  const [dismissed, setDismissed] = useState(false)
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  if (dismissed && variant === 'inline') return null

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="rounded-2xl border border-warm-200 bg-warm-50 p-4 shadow-sm"
      >
        <BannerContent
          cafecitoUser={cafecitoUser}
          onDismiss={() => setDismissed(true)}
        />
      </motion.div>
    )
  }

  return (
    <div ref={popoverRef} className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && !dismissed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            style={{ transformOrigin: 'bottom right' }}
            className="w-64 rounded-2xl border border-warm-200 bg-warm-50 p-4 shadow-xl"
          >
            <BannerContent
              cafecitoUser={cafecitoUser}
              onDismiss={() => {
                setDismissed(true)
                setOpen(false)
              }}
              compact
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!dismissed && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.6 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#6F3E28] text-[#FFF8F2] shadow-lg transition-shadow hover:shadow-xl"
          aria-label="Apoyar el proyecto"
        >
          <Heart className="h-4 w-4" fill="currentColor" />
        </motion.button>
      )}
    </div>
  )
}
