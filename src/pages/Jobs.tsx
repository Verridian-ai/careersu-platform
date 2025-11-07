import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
  Filter,
  Heart,
  ExternalLink,
  Building2,
  TrendingUp
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import type { Job } from '@/types'

const Jobs: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedType, setSelectedType] = useState<string>('all')

  // Mock jobs data
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'Remote',
      type: 'full-time',
      salary: { min: 100000, max: 150000, currency: 'USD' },
      description: 'Join our team to build amazing user interfaces...',
      requirements: ['React', 'TypeScript', '5+ years experience'],
      posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      matchScore: 95
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'StartupXYZ',
      location: 'San Francisco, CA',
      type: 'full-time',
      salary: { min: 120000, max: 180000, currency: 'USD' },
      description: 'Lead product strategy and roadmap...',
      requirements: ['Product Management', 'Agile', '3+ years experience'],
      posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      matchScore: 88
    },
    {
      id: '3',
      title: 'Full Stack Engineer',
      company: 'InnovateLab',
      location: 'Remote',
      type: 'contract',
      salary: { min: 80000, max: 120000, currency: 'USD' },
      description: 'Build and maintain web applications...',
      requirements: ['Node.js', 'React', 'MongoDB'],
      posted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      matchScore: 82
    },
    {
      id: '4',
      title: 'UX Designer',
      company: 'DesignHub',
      location: 'New York, NY',
      type: 'full-time',
      salary: { min: 90000, max: 130000, currency: 'USD' },
      description: 'Create beautiful and intuitive user experiences...',
      requirements: ['Figma', 'User Research', 'Prototyping'],
      posted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      matchScore: 75
    },
  ]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === 'all' || job.type === selectedType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full-time':
        return 'default'
      case 'part-time':
        return 'secondary'
      case 'contract':
        return 'warning'
      case 'remote':
        return 'success'
      default:
        return 'outline'
    }
  }

  const formatSalary = (salary: Job['salary']) => {
    if (!salary) return 'Not specified'
    return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="glass-nav sticky top-0 z-50 border-b">
        <div className="container-padding py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-responsive-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Job Opportunities
              </h1>
              <p className="text-responsive-sm text-muted-foreground mt-1">
                {filteredJobs.length} positions matched to your profile
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-padding section-padding">
        {/* Search and Filters - Mobile First */}
        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs, companies, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                glass
              />
            </div>

            {/* Filter Button - Mobile */}
            <Button
              variant="outline"
              className="sm:hidden w-full"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filter Chips - Always visible on desktop, toggle on mobile */}
          <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex gap-2 flex-wrap`}>
            <Button
              variant={selectedType === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('all')}
            >
              All Jobs
            </Button>
            <Button
              variant={selectedType === 'full-time' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('full-time')}
            >
              Full-time
            </Button>
            <Button
              variant={selectedType === 'part-time' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('part-time')}
            >
              Part-time
            </Button>
            <Button
              variant={selectedType === 'contract' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('contract')}
            >
              Contract
            </Button>
            <Button
              variant={selectedType === 'remote' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedType('remote')}
            >
              Remote
            </Button>
          </div>
        </div>

        {/* Jobs List - Mobile First */}
        <div className="space-y-4 sm:space-y-6">
          {filteredJobs.map((job, index) => (
            <Card
              key={job.id}
              glass
              className="animate-fade-in hover:shadow-lg transition-all"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    {/* Company Logo Placeholder */}
                    <div className="shrink-0 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
                      <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-lg sm:text-xl md:text-2xl">
                          {job.title}
                        </CardTitle>
                        {job.matchScore && (
                          <Badge variant="success" className="shrink-0">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {job.matchScore}% Match
                          </Badge>
                        )}
                      </div>

                      <CardDescription className="text-base sm:text-lg font-medium text-foreground mb-2">
                        {job.company}
                      </CardDescription>

                      {/* Job Details - Responsive Grid */}
                      <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          <Badge variant={getTypeColor(job.type) as any} className="capitalize">
                            {job.type.replace('-', ' ')}
                          </Badge>
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatSalary(job.salary)}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatRelativeTime(job.posted)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button - Desktop */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden sm:flex shrink-0"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Description */}
                <p className="text-sm sm:text-base text-muted-foreground line-clamp-2">
                  {job.description}
                </p>

                {/* Requirements */}
                <div>
                  <p className="text-sm font-medium mb-2">Requirements:</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requirements.map((req, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs sm:text-sm">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons - Mobile First */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                  <Button variant="primary" className="flex-1 touch-target">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Apply Now
                  </Button>
                  <Button variant="outline" className="flex-1 sm:flex-none touch-target">
                    View Details
                  </Button>
                  <Button variant="ghost" className="sm:hidden touch-target">
                    <Heart className="mr-2 h-4 w-4" />
                    Save Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <Card glass className="py-12 sm:py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="p-4 sm:p-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-4 sm:mb-6">
                <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-sm">
                {searchQuery
                  ? `No jobs match "${searchQuery}"`
                  : 'Try adjusting your filters to see more opportunities'}
              </p>
              <Button variant="primary" size="lg">
                <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Browse All Jobs
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <Card glass className="mt-6 sm:mt-8">
          <CardHeader>
            <CardTitle>Job Market Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {jobs.length}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Active Jobs</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {jobs.filter(j => j.type === 'remote').length}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Remote</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {jobs.filter(j => j.matchScore && j.matchScore >= 80).length}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">High Match</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                  {jobs.filter(j => {
                    const daysSince = (Date.now() - new Date(j.posted).getTime()) / (1000 * 60 * 60 * 24)
                    return daysSince <= 7
                  }).length}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">New This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Jobs
