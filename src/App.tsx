
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import SeekerDashboard from '@/pages/SeekerDashboard'
import DocumentsPage from '@/pages/DocumentsPage'
import JobsPage from '@/pages/JobsPage'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<LoginPage />} />

      {/* Authenticated Routes - Part 1 Pages */}
      <Route path="/dashboard" element={<SeekerDashboard />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/jobs" element={<JobsPage />} />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
