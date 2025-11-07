import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import { Home, ArrowLeft, Search } from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* 404 Animation */}
        <div className="mb-8 animate-fade-in">
          <div className="relative inline-block">
            <h1 className="text-9xl sm:text-[12rem] font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              404
            </h1>
            <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 -z-10"></div>
          </div>
        </div>

        {/* Message */}
        <div className="glass-card p-8 sm:p-12 rounded-2xl mb-8 animate-slide-up">
          <div className="mb-6">
            <Search className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-muted-foreground opacity-50" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
            Page Not Found
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Oops! The page you're looking for seems to have wandered off.
            Let's get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <Home className="mr-2 h-5 w-5" />
                Go Home
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>
        </div>

        {/* Helpful Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Link to="/dashboard" className="glass-card p-4 rounded-xl hover:scale-105 transition-transform">
            <p className="text-sm font-medium text-foreground">Dashboard</p>
          </Link>
          <Link to="/jobs" className="glass-card p-4 rounded-xl hover:scale-105 transition-transform">
            <p className="text-sm font-medium text-foreground">Jobs</p>
          </Link>
          <Link to="/documents" className="glass-card p-4 rounded-xl hover:scale-105 transition-transform">
            <p className="text-sm font-medium text-foreground">Documents</p>
          </Link>
          <Link to="/chat" className="glass-card p-4 rounded-xl hover:scale-105 transition-transform">
            <p className="text-sm font-medium text-foreground">Chat</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
