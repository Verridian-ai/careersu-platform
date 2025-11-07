import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Calendar,
  Target,
  Award,
  Clock
} from 'lucide-react'

interface DashboardProps {
  userRole?: 'job_seeker' | 'coach'
}

const Dashboard: React.FC<DashboardProps> = ({ userRole = 'job_seeker' }) => {
  // Mock data
  const stats = {
    totalApplications: 24,
    interviews: 8,
    offers: 2,
    responseRate: 68
  }

  const recentActivity = [
    { id: 1, type: 'application', title: 'Applied to Senior Developer at TechCorp', time: '2 hours ago' },
    { id: 2, type: 'interview', title: 'Interview scheduled with StartupXYZ', time: '1 day ago' },
    { id: 3, type: 'document', title: 'Updated resume for Product Manager role', time: '2 days ago' },
  ]

  const upcomingTasks = [
    { id: 1, task: 'Interview with TechCorp', date: 'Tomorrow, 2:00 PM', priority: 'high' },
    { id: 2, task: 'Follow up on ABC Company application', date: 'In 2 days', priority: 'medium' },
    { id: 3, task: 'Update portfolio with latest projects', date: 'This week', priority: 'low' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="glass-nav sticky top-0 z-50 border-b">
        <div className="container-padding py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-responsive-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-responsive-sm text-muted-foreground mt-1">
                Welcome back! Here's your career progress
              </p>
            </div>
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Create New Document
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-padding section-padding">
        {/* Stats Grid - Mobile First */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card glass className="animate-fade-in hover:scale-105 transition-transform">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {stats.totalApplications}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Total submitted</p>
            </CardContent>
          </Card>

          <Card glass className="animate-fade-in hover:scale-105 transition-transform" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                Interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                {stats.interviews}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled</p>
            </CardContent>
          </Card>

          <Card glass className="animate-fade-in hover:scale-105 transition-transform" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                Offers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                {stats.offers}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Received</p>
            </CardContent>
          </Card>

          <Card glass className="animate-fade-in hover:scale-105 transition-transform" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                Response Rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                {stats.responseRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Activity - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <Card glass className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest career actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start gap-3 mb-2 sm:mb-0">
                        <div className="mt-1">
                          {activity.type === 'application' && <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />}
                          {activity.type === 'interview' && <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />}
                          {activity.type === 'document' && <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-medium truncate">
                            {activity.title}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card glass className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks to boost your career</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button variant="outline" className="justify-start h-auto py-4" size="lg">
                    <FileText className="mr-2 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Create Resume</div>
                      <div className="text-xs text-muted-foreground">AI-powered editor</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4" size="lg">
                    <Briefcase className="mr-2 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Browse Jobs</div>
                      <div className="text-xs text-muted-foreground">Find opportunities</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4" size="lg">
                    <MessageSquare className="mr-2 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">AI Career Chat</div>
                      <div className="text-xs text-muted-foreground">Get advice</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-4" size="lg">
                    <Target className="mr-2 h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Set Goals</div>
                      <div className="text-xs text-muted-foreground">Track progress</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Tasks - Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            <Card glass className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 sm:h-6 sm:w-6" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>Things to focus on</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="p-3 sm:p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm sm:text-base font-medium flex-1 pr-2">
                          {task.task}
                        </h4>
                        <Badge
                          variant={
                            task.priority === 'high' ? 'destructive' :
                            task.priority === 'medium' ? 'warning' :
                            'secondary'
                          }
                          className="shrink-0"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {task.date}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
