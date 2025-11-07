import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react'

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Full Stack Developer',
    bio: 'Passionate software engineer with 8+ years of experience building scalable web applications.',
  })

  const skills = ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker']
  const experience = [
    {
      id: 1,
      title: 'Senior Developer',
      company: 'TechCorp',
      period: '2020 - Present',
      description: 'Leading frontend development team'
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      period: '2018 - 2020',
      description: 'Built and maintained web applications'
    },
  ]

  const education = [
    {
      id: 1,
      degree: 'Master of Computer Science',
      school: 'Stanford University',
      year: '2018'
    },
    {
      id: 2,
      degree: 'Bachelor of Science in CS',
      school: 'UC Berkeley',
      year: '2016'
    },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="glass-nav sticky top-0 z-50 border-b">
        <div className="container-padding py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-responsive-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-responsive-sm text-muted-foreground mt-1">
                Manage your personal information and career details
              </p>
            </div>
            {!isEditing ? (
              <Button variant="primary" size="lg" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                <Edit className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="lg" onClick={handleCancel} className="flex-1 sm:flex-none">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button variant="primary" size="lg" onClick={handleSave} className="flex-1 sm:flex-none">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-padding section-padding">
        {/* Profile Header Card */}
        <Card glass className="mb-6 sm:mb-8 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {/* Avatar */}
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 lg:h-32 lg:w-32 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left w-full">
                {isEditing ? (
                  <div className="space-y-3 sm:space-y-4">
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your Name"
                      glass
                    />
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Your Title"
                      glass
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">{formData.name}</h2>
                    <p className="text-base sm:text-lg text-muted-foreground mb-4">{formData.title}</p>
                  </>
                )}

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mt-4">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.phone}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{formData.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* About Me */}
            <Card glass className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 sm:h-6 sm:w-6" />
                  About Me
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full min-h-[120px] p-3 sm:p-4 rounded-lg glass-card border border-input text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-sm sm:text-base text-muted-foreground">{formData.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card glass className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />
                    Work Experience
                  </CardTitle>
                  {isEditing && (
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative pl-6 sm:pl-8 border-l-2 border-blue-200">
                      <div className="absolute left-0 top-0 -translate-x-1/2 h-4 w-4 rounded-full bg-blue-600 border-2 border-white"></div>
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base sm:text-lg">{exp.title}</h4>
                          <p className="text-sm sm:text-base text-muted-foreground">{exp.company}</p>
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="sm" className="shrink-0 self-start">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {exp.period}
                      </div>
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card glass className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                    Education
                  </CardTitle>
                  {isEditing && (
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-3 sm:p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm sm:text-base">{edu.degree}</h4>
                          <p className="text-xs sm:text-sm text-muted-foreground">{edu.school}</p>
                          <p className="text-xs text-muted-foreground mt-1">{edu.year}</p>
                        </div>
                        {isEditing && (
                          <Button variant="ghost" size="sm" className="shrink-0">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            {/* Skills */}
            <Card glass className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6" />
                    Skills
                  </CardTitle>
                  {isEditing && (
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="glass"
                      className="text-xs sm:text-sm hover:scale-105 transition-transform"
                    >
                      {skill}
                      {isEditing && (
                        <X className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive" />
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card glass className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>Profile Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Profile Views</span>
                    <span className="text-lg font-bold text-blue-600">127</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Applications</span>
                    <span className="text-lg font-bold text-purple-600">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Connections</span>
                    <span className="text-lg font-bold text-green-600">89</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
