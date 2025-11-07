import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  MessageSquare,
  User,
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationProps {
  userName?: string
  userRole?: 'job_seeker' | 'coach'
}

const Navigation: React.FC<NavigationProps> = ({
  userName = 'John Doe',
  userRole = 'job_seeker'
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/documents', label: 'Documents', icon: FileText },
    { path: '/jobs', label: 'Jobs', icon: Briefcase },
    { path: '/chat', label: 'AI Chat', icon: MessageSquare },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex glass-nav fixed top-0 left-0 right-0 z-50 border-b">
        <div className="container-padding mx-auto">
          <div className="flex items-center justify-between h-16 xl:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 xl:h-10 xl:w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg xl:text-xl">C</span>
              </div>
              <span className="text-lg xl:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CareerSU
              </span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive(item.path) ? 'primary' : 'ghost'}
                      className={cn(
                        'gap-2',
                        isActive(item.path) && 'shadow-md'
                      )}
                    >
                      <Icon className="h-4 w-4 xl:h-5 xl:w-5" />
                      <span className="hidden xl:inline">{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden xl:flex flex-col items-end">
                <span className="text-sm font-medium">{userName}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {userRole.replace('_', ' ')}
                </span>
              </div>
              <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 font-semibold">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4 xl:h-5 xl:w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden glass-nav fixed top-0 left-0 right-0 z-50 border-b">
        <div className="container-padding">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-base sm:text-lg">C</span>
              </div>
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CareerSU
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="touch-target"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-14 sm:top-16 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="glass-modal rounded-t-none border-t p-4 sm:p-6 space-y-2 animate-slide-down">
              {/* User Info */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-white/50 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 font-semibold">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm sm:text-base">{userName}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground capitalize">
                    {userRole.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Nav Items */}
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive(item.path) ? 'primary' : 'ghost'}
                      className="w-full justify-start gap-3 touch-target"
                      size="lg"
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}

              {/* Logout */}
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 touch-target text-destructive"
                size="lg"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-14 sm:h-16 lg:h-16 xl:h-20" />
    </>
  )
}

export default Navigation
