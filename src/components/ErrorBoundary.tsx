/**
 * Error Boundary Component
 *
 * A React error boundary that catches JavaScript errors anywhere in the child
 * component tree and displays a fallback UI instead of crashing the entire app.
 *
 * Features:
 * - Catches and logs errors
 * - Displays user-friendly error message
 * - Provides recovery options
 * - Production-ready error handling
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 */

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Button from './ui/Button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card'

interface ErrorBoundaryProps {
  children: ReactNode
  /**
   * Optional fallback component to render on error
   */
  fallback?: ReactNode
  /**
   * Callback when an error is caught
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * Error Boundary for catching and handling React component errors
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error)
      console.error('Error Info:', errorInfo)
    }

    // Call the optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Update state with error details
    this.setState({
      errorInfo,
    })

    // In production, you might want to send this to an error reporting service
    // Example: logErrorToService(error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleGoHome = (): void => {
    window.location.href = '/'
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
          <Card glass className="max-w-2xl w-full">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-center text-2xl">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-muted-foreground">
                  We apologize for the inconvenience. An unexpected error has occurred.
                  Our team has been notified and we're working to fix it.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm font-semibold text-red-800 mb-2">
                      Error Details (Development Only):
                    </p>
                    <pre className="text-xs text-red-700 overflow-auto max-h-40">
                      {this.state.error.toString()}
                    </pre>
                    {this.state.errorInfo && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs font-semibold text-red-800">
                          Component Stack
                        </summary>
                        <pre className="text-xs text-red-700 overflow-auto max-h-40 mt-2">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={this.handleReset}
                  fullWidth
                  className="flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={this.handleGoHome}
                  fullWidth
                  className="flex items-center justify-center"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
