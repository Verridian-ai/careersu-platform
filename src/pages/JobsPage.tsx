import React, { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import {
  Briefcase,
  Search,
  MapPin,
  DollarSign,
  Clock,
  Bookmark,
  Building2,
  Filter,
  ChevronDown
} from 'lucide-react'

const JobsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $180k',
      type: 'Full-time',
      remote: true,
      posted: '2 days ago',
      match: 95,
      saved: true,
      description: 'Build scalable web applications using React and Node.js',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'InnovateLabs',
      location: 'Remote',
      salary: '$100k - $150k',
      type: 'Full-time',
      remote: true,
      posted: '1 week ago',
      match: 88,
      saved: false,
      description: 'Lead product strategy and development for our SaaS platform',
      skills: ['Product Strategy', 'Agile', 'Analytics', 'Leadership'],
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      salary: '$90k - $140k',
      type: 'Full-time',
      remote: false,
      posted: '3 days ago',
      match: 82,
      saved: true,
      description: 'Work on both frontend and backend of our e-commerce platform',
      skills: ['JavaScript', 'Python', 'React', 'Django'],
    },
    {
      id: 4,
      title: 'UX Designer',
      company: 'DesignCo',
      location: 'Austin, TX',
      salary: '$80k - $120k',
      type: 'Full-time',
      remote: true,
      posted: '5 days ago',
      match: 75,
      saved: false,
      description: 'Create beautiful and intuitive user experiences',
      skills: ['Figma', 'UI/UX', 'User Research', 'Prototyping'],
    },
    {
      id: 5,
      title: 'Data Scientist',
      company: 'DataTech AI',
      location: 'Boston, MA',
      salary: '$110k - $160k',
      type: 'Full-time',
      remote: true,
      posted: '1 week ago',
      match: 78,
      saved: false,
      description: 'Analyze complex datasets and build ML models',
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'CloudOps Inc.',
      location: 'Seattle, WA',
      salary: '$105k - $155k',
      type: 'Full-time',
      remote: false,
      posted: '4 days ago',
      match: 80,
      saved: true,
      description: 'Manage cloud infrastructure and CI/CD pipelines',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    },
  ]

  // const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation isAuthenticated={true} userType="seeker" />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-responsive-2xl font-bold text-foreground mb-2">
              Job Opportunities
            </h1>
            <p className="text-responsive-base text-muted-foreground">
              Discover your next career opportunity with AI-powered matching
            </p>
          </div>

          {/* Search Bar */}
          <Card glass className="mb-6 sm:mb-8">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
                <div className="lg:col-span-5 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Input
                    type="text"
                    placeholder="Job title, keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11"
                    glass
                  />
                </div>
                <div className="lg:col-span-4 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                  <Input
                    type="text"
                    placeholder="Location..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="pl-11"
                    glass
                  />
                </div>
                <div className="lg:col-span-3 flex gap-2">
                  <Button size="md" fullWidth className="lg:col-span-2">
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setShowFilters(!showFilters)}
                    className="touch-target"
                  >
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t animate-slide-down">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-responsive-sm font-medium mb-2">
                        Job Type
                      </label>
                      <select className="w-full rounded-lg px-4 py-3 border border-input bg-background text-responsive-sm touch-target">
                        <option>All Types</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-responsive-sm font-medium mb-2">
                        Experience Level
                      </label>
                      <select className="w-full rounded-lg px-4 py-3 border border-input bg-background text-responsive-sm touch-target">
                        <option>All Levels</option>
                        <option>Entry Level</option>
                        <option>Mid Level</option>
                        <option>Senior Level</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-responsive-sm font-medium mb-2">
                        Salary Range
                      </label>
                      <select className="w-full rounded-lg px-4 py-3 border border-input bg-background text-responsive-sm touch-target">
                        <option>Any Salary</option>
                        <option>$50k - $80k</option>
                        <option>$80k - $120k</option>
                        <option>$120k+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-responsive-sm font-medium mb-2">
                        Remote
                      </label>
                      <select className="w-full rounded-lg px-4 py-3 border border-input bg-background text-responsive-sm touch-target">
                        <option>All</option>
                        <option>Remote Only</option>
                        <option>On-site</option>
                        <option>Hybrid</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            <Card glass>
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="text-responsive-2xl font-bold text-foreground">
                  {jobs.length}
                </h3>
                <p className="text-responsive-sm text-muted-foreground">Jobs Found</p>
              </CardContent>
            </Card>
            <Card glass>
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="text-responsive-2xl font-bold text-foreground">
                  {jobs.filter((j) => j.saved).length}
                </h3>
                <p className="text-responsive-sm text-muted-foreground">Saved Jobs</p>
              </CardContent>
            </Card>
            <Card glass>
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="text-responsive-2xl font-bold text-foreground">
                  {Math.max(...jobs.map((j) => j.match))}%
                </h3>
                <p className="text-responsive-sm text-muted-foreground">Top Match</p>
              </CardContent>
            </Card>
            <Card glass>
              <CardContent className="p-4 sm:p-6 text-center">
                <h3 className="text-responsive-2xl font-bold text-foreground">12</h3>
                <p className="text-responsive-sm text-muted-foreground">Applications</p>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="space-y-4 sm:space-y-6">
            {jobs.map((job) => (
              <Card key={job.id} glass hover>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg sm:text-xl">{job.title}</CardTitle>
                        <div className="flex items-center space-x-2 ml-4">
                          <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm font-semibold whitespace-nowrap">
                            {job.match}% Match
                          </div>
                          <button className="p-2 hover:bg-accent rounded-lg transition-colors touch-target">
                            <Bookmark
                              className={`w-5 h-5 ${
                                job.saved
                                  ? 'fill-primary text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-responsive-sm text-muted-foreground mb-3">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <p className="text-responsive-sm text-muted-foreground mb-4">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-responsive-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-responsive-sm">
                      <DollarSign className="w-4 h-4 text-secondary" />
                      <span className="text-foreground">{job.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-responsive-sm">
                      <Briefcase className="w-4 h-4 text-accent" />
                      <span className="text-foreground">{job.type}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-responsive-sm">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{job.posted}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-white/50 text-foreground text-xs sm:text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <Button size="md" className="flex-1">
                      Apply Now
                    </Button>
                    <Button variant="outline" size="md" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg">
              Load More Jobs
              <ChevronDown className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobsPage
