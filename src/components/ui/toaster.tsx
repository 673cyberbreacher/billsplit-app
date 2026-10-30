'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: 'group glass-strong border-glass-border px-4 py-3 rounded-xl shadow-lg',
          description: 'text-sm text-muted-foreground',
          actionButton: 'btn-gradient-secondary text-sm px-3 py-1.5',
          cancelButton: 'text-sm text-muted-foreground hover:text-foreground',
          closeButton: 'text-muted-foreground hover:text-foreground',
        },
      }}
    />
  )
}