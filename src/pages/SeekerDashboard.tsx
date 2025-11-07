import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import {
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Clock,
  Target,
  Zap,
  BookOpen,
  Star,
  Calendar
} from 'lucide-react'

const SeekerDashboard: React.FC = () => {
  const quickActions = [
    {
      icon: FileText,
      title: 'Create Resume',
      description: 'Start a new document',
      link: '/documents/new',
      color: 'bg-blue-500',
    },
    {
      icon: Briefcase,
      title: 'Browse Jobs',
      description: 'Find opportunities',
      link: '/jobs',
      color: 'bg-green-500',
    },
    {
      icon: MessageSquare,
      title: 'Ask AI',
      description: 'Get career advice',
      link: '/chat',
      color: 'bg-purple-500',
    },
  ]

  const stats = [
    {
      label: 'Applications',
      value: '12',
      change: '+3 this week',
      icon: Target,
      color: 'text-blue-600',
    },
    {
      label: 'Interviews',
      value: '5',
      change: '+2 scheduled',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      label: 'Profile Views',
      value: '48',
      change: '+12 today',
      icon: TrendingUp,
      color: 'text-purple-600',
    },
  ]

  const recentActivity = [
    {
      type: 'application',
      title: 'Applied to Senior Developer at TechCorp',
      time: '2 hours ago',
      icon: Briefcase,
    },
    {
      type: 'document',
      title: 'Updated Resume - Tech Focus',
      time: '5 hours ago',
      icon: FileText,
    },
    {
      type: 'match',
      title: 'New job match: Product Manager',
      time: '1 day ago',
      icon: Star,
    },
  ]

  const recommendations = [
    {
      title: 'Complete Your Profile',
      description: 'Add your skills and experience to get better job matches',
      progress: 75,
      action: 'Continue',
    },
    {
      title: 'Optimize Your Resume',
      description: 'Use AI suggestions to improve your resume',
      progress: 60,
      action: 'Optimize',
    },
  ]

  const matchedJobs = [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $180k',
      match: 95,
      posted: '2 days ago',
    },
    {
      title: 'Product Manager',
      company: 'InnovateLabs',
      location: 'Remote',
      salary: '$100k - $150k',
      match: 88,
      posted: '1 week ago',
    },
    {
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      salary: '$90k - $140k',
      match: 82,
      posted: '3 days ago',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation isAuthenticated={true} userType="seeker" />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-responsive-2xl font-bold text-foreground mb-2">
              Welcome back, Demo User!
            </h1>
            <p className="text-responsive-base text-muted-foreground">
              Here's your career progress overview
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <Card key={index} glass hover>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-responsive-sm text-muted-foreground mb-1">
                          {stat.label}
                        </p>
                        <h3 className="text-responsive-2xl font-bold text-foreground mb-1">
                          {stat.value}
                        </h3>
                        <p className="text-responsive-xs text-secondary font-medium">
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-lg bg-white/50`}>
                        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column - Quick Actions & Activity */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div>
                <h2 className="text-responsive-xl font-semibold text-foreground mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Link key={index} to={action.link}>
                        <Card glass hover className="h-full group cursor-pointer">
                          <CardContent className="p-4 sm:p-6">
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg ${action.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                            >
                              <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                            </div>
                            <h3 className="text-responsive-base font-semibold text-foreground mb-1">
                              {action.title}
                            </h3>
                            <p className="text-responsive-sm text-muted-foreground">
                              {action.description}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Matched Jobs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-responsive-xl font-semibold text-foreground">
                    Top Job Matches
                  </h2>
                  <Link to="/jobs">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {matchedJobs.map((job, index) => (
                    <Card key={index} glass hover>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base sm:text-lg mb-1">
                              {job.title}
                            </CardTitle>
                            <CardDescription>{job.company}</CardDescription>
                          </div>
                          <div className="flex flex-col items-end ml-4">
                            <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs sm:text-sm font-semibold mb-2">
                              {job.match}% Match
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-responsive-sm text-muted-foreground">
                          <div className="flex items-center space-x-2">
                            <Target className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>{job.posted}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                          <Button size="sm" className="flex-1">
                            Apply Now
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Learn More
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Recent Activity & Recommendations */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card glass>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => {
                      const Icon = activity.icon
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="p-2 rounded-lg bg-white/50 flex-shrink-0">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-responsive-sm text-foreground font-medium break-words">
                              {activity.title}
                            </p>
                            <p className="text-responsive-xs text-muted-foreground mt-1">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" fullWidth>
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>

              {/* Recommendations */}
              <Card glass>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>Improve your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="p-3 sm:p-4 rounded-lg bg-white/50">
                        <h4 className="text-responsive-sm font-semibold text-foreground mb-2">
                          {rec.title}
                        </h4>
                        <p className="text-responsive-xs text-muted-foreground mb-3">
                          {rec.description}
                        </p>
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{rec.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-bg-blue rounded-full transition-all"
                              style={{ width: `${rec.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" fullWidth>
                          {rec.action}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card glass className="bg-gradient-bg-blue text-white">
                <CardContent className="p-4 sm:p-6">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4" />
                  <h3 className="text-responsive-lg font-semibold mb-2">
                    Career Tip of the Day
                  </h3>
                  <p className="text-responsive-sm opacity-90">
                    Tailor your resume for each job application to increase your chances of
                    getting noticed by recruiters.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeekerDashboard
