'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/authStore'
import { Menu, Upload, LogOut, User, Search } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      router.push('/auth/login')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-b from-muted to-background/80 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-full px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent-hover rounded-lg flex items-center justify-center">
              <span className="text-background font-bold text-lg">VH</span>
            </div>
            <span className="text-xl font-bold hidden sm:inline text-foreground group-hover:text-accent transition-colors">
              VideoHub
            </span>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full px-4 py-2 bg-muted text-foreground rounded-lg border border-border focus:border-accent focus:outline-none"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/upload"
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent-hover transition-colors font-medium"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Upload</span>
                </Link>

                {/* User menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="w-10 h-10 rounded-full bg-muted border-2 border-border hover:border-accent transition-colors overflow-hidden"
                  >
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </button>

                  {showMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-muted border border-border rounded-lg shadow-lg">
                      <div className="p-4 border-b border-border">
                        <p className="font-semibold text-foreground text-sm">{user?.fullName}</p>
                        <p className="text-muted-foreground text-xs">@{user?.username}</p>
                      </div>
                      <Link
                        href={`/channel/${user?._id}`}
                        className="block px-4 py-2 text-foreground hover:bg-background transition-colors text-sm"
                        onClick={() => setShowMenu(false)}
                      >
                        My Channel
                      </Link>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-foreground hover:bg-background transition-colors text-sm"
                        onClick={() => setShowMenu(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout()
                          setShowMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-background transition-colors text-sm flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-accent hover:text-accent-hover transition-colors font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-accent text-background rounded-lg hover:bg-accent-hover transition-colors font-medium text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 hover:bg-muted rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
