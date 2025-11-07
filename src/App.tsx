/**
 * Main Application Component
 *
 * Root component that sets up routing, error boundaries, and global providers.
 * Implements lazy loading for optimal performance and code splitting.
 *
 * Features:
 * - Lazy-loaded route components for better performance
 * - Global error boundary for graceful error handling
 * - Toast notifications for user feedback
 * - Suspense with loading fallback
 */

import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import { Toaster } from 'sonner'

// Eager load protected route wrapper
import ProtectedRoute from '@/components/ProtectedRoute'

// Lazy load all page components for code splitting
const LandingPage = lazy(() => import('@/pages/LandingPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'))
const SeekerDashboard = lazy(() => import('@/pages/SeekerDashboard'))
const DocumentsPage = lazy(() => import('@/pages/DocumentsPage'))
const DocumentEditor = lazy(() => import('@/pages/DocumentEditor'))
const JobsPage = lazy(() => import('@/pages/JobsPage'))
const JobDetails = lazy(() => import('@/pages/JobDetails'))
const Chat = lazy(() => import('@/pages/Chat'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))
const NotFound = lazy(() => import('@/pages/NotFound'))

/**
 * Loading fallback component displayed while lazy-loaded components load
 */
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}

/**
 * Main App Component
 */
function App() {
  return (
    <ErrorBoundary>
      {/* Toast notifications container with glassmorphism styling */}
      <Toaster
        position="top-right"
        expand={false}
        richColors
        closeButton
        toastOptions={{
          className: 'glass-card',
        }}
      />

      {/* Suspense boundary for lazy-loaded routes */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <SeekerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <DocumentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/new"
            element={
              <ProtectedRoute>
                <DocumentEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/:id"
            element={
              <ProtectedRoute>
                <DocumentEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <JobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* 404 Not Found */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
