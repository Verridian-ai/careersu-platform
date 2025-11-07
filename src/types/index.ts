export interface User {
  id: string
  email: string
  name: string
  role: 'job_seeker' | 'coach'
  avatar?: string
  createdAt: string
}

export interface Document {
  id: string
  title: string
  type: 'resume' | 'cover_letter' | 'portfolio'
  content: string
  lastModified: string
  status: 'draft' | 'final' | 'archived'
  userId: string
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  salary?: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  posted: string
  matchScore?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Application {
  id: string
  jobId: string
  userId: string
  status: 'pending' | 'interview' | 'offer' | 'rejected'
  appliedAt: string
  updatedAt: string
}

export interface Stats {
  totalApplications: number
  interviews: number
  offers: number
  responseRate: number
}
