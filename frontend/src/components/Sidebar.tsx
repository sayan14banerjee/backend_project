'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/store/authStore'
import {
  Home,
  Flame,
  Clock,
  Heart,
  ListVideo,
  TrendingUp,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  requiresAuth?: boolean
}

export default function Sidebar() {
  const pathname = usePathname()
  const { isAuthenticated } = useAuth()

  const navItems: NavItem[] = [
    { label: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
    { label: 'Trending', href: '/trending', icon: <TrendingUp className="w-5 h-5" /> },
    { label: 'Watch Later', href: '/watch-later', icon: <Clock className="w-5 h-5" />, requiresAuth: true },
    { label: 'Liked Videos', href: '/liked', icon: <Heart className="w-5 h-5" />, requiresAuth: true },
    { label: 'Playlists', href: '/playlists', icon: <ListVideo className="w-5 h-5" />, requiresAuth: true },
  ]

  const filteredItems = navItems.filter(item => !item.requiresAuth || isAuthenticated)

  return (
    <>
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black/50 z-30 md:hidden" />

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-muted border-r border-border overflow-y-auto hidden md:flex flex-col">
        <nav className="flex-1 p-4 space-y-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent/20 text-accent'
                    : 'text-muted-foreground hover:bg-background hover:text-foreground'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            VideoHub © 2024
          </p>
        </div>
      </aside>
    </>
  )
}
