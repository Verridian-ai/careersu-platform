/**
 * Test Utilities
 *
 * Custom render functions and utilities for testing React components.
 * Provides common wrappers and helper functions.
 */

import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

/**
 * Custom render function that wraps components with common providers
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /**
   * Initial route for the router
   */
  initialRoute?: string
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { initialRoute = '/', ...renderOptions } = options || {}

  // Set up initial route
  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute)
  }

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'job_seeker' as const,
  createdAt: '2025-01-01T00:00:00Z',
}

/**
 * Mock document data for testing
 */
export const mockDocument = {
  id: '1',
  title: 'Test Resume',
  type: 'resume' as const,
  content: 'Test content',
  lastModified: '2025-01-01T00:00:00Z',
  status: 'draft' as const,
  userId: '1',
}

/**
 * Mock job data for testing
 */
export const mockJob = {
  id: '1',
  title: 'Software Engineer',
  company: 'Test Company',
  location: 'Remote',
  type: 'full-time' as const,
  description: 'Test job description',
  requirements: ['React', 'TypeScript'],
  posted: '2025-01-01T00:00:00Z',
  matchScore: 85,
}

/**
 * Wait for a condition to be true
 */
export async function waitForCondition(
  condition: () => boolean,
  timeout = 1000
): Promise<void> {
  const startTime = Date.now()
  while (!condition()) {
    if (Date.now() - startTime > timeout) {
      throw new Error('Timeout waiting for condition')
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
}

/**
 * Create a mock file for file upload testing
 */
export function createMockFile(
  name = 'test.pdf',
  size = 1024,
  type = 'application/pdf'
): File {
  const blob = new Blob(['test content'], { type })
  return new File([blob], name, { type })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { customRender as render }
