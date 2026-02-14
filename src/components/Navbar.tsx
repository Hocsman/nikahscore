'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { Heart, Users, BarChart3, LogOut, User, Menu, X } from 'lucide-react'
import { NotificationBell } from '@/components/NotificationBell'

export function Navbar() {
  const { user, signOut } = useAuth()
  const { isAdmin } = useAdmin()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  const handleLogout = async () => {
    await signOut()
    // Rediriger vers la page d'accueil après déconnexion
    router.push('/')
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-pink-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                NikahScore
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/questionnaire"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/questionnaire')
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20'
              }`}
            >
              Questionnaire
            </Link>

            <Link
              href="/couple"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/couple')
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Questionnaire Couple</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin/analytics"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/analytics')
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <>
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:block">{user.firstName || user.name || user.email?.split('@')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Profil</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/couple" className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Mes Questionnaires Couple</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Se Déconnecter</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth?mode=login">Se Connecter</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth?mode=register">S'inscrire</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile: notification + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            {user && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/questionnaire"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/questionnaire')
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20'
              }`}
            >
              Questionnaire
            </Link>

            <Link
              href="/couple"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive('/couple')
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Questionnaire Couple</span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive('/admin/analytics')
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se Déconnecter</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Button variant="ghost" size="sm" asChild className="justify-start">
                  <Link href="/auth?mode=login" onClick={() => setMobileMenuOpen(false)}>Se Connecter</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth?mode=register" onClick={() => setMobileMenuOpen(false)}>S'inscrire</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
