'use client'

import { useState } from 'react'
import { AdminNav } from './admin-nav'
import { PageAccessGuard } from './page-access-guard'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminLayoutProps {
  children: React.ReactNode
  align?: 'left' | 'center'
}

export function AdminLayout({ children, align = 'center' }: AdminLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <PageAccessGuard>
      <div className="flex h-screen overflow-hidden bg-white">
      {/* Desktop Sidebar - hidden on mobile */}
      <div className="hidden lg:flex">
        <AdminNav />
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <AdminNav onNavigate={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <header className="lg:hidden flex items-center justify-between h-14 px-4 border-b bg-white sticky top-0 z-10 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center gap-2 focus-ring"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white font-bold text-xs">
              M
            </div>
            <span className="text-base font-semibold">MindGraphy</span>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 custom-scrollbar">
          <div className={cn(
            align === 'left' ? 'p-4 md:p-6 lg:p-8' : 'container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl',
            'animate-in fade-in slide-in-from-bottom duration-300'
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
    </PageAccessGuard>
  )
}
