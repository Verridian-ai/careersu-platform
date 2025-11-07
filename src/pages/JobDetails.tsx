import React, { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/badge'
import { Modal, ModalHeader, ModalTitle, ModalBody } from '@/components/ui/modal'
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Building2,
  Users,
  Calendar,
  CheckCircle,
  Send
} from 'lucide-react'

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isSaved, setIsSaved] = useState(false)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<string>('')

  // Mock job data - in a real app, this would be fetched based on the ID
  const job = {
    id: id || '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $180k',
    type: 'Full-time',
    remote: true,
    posted: '2 days ago',
    match: 95,
    description: `We are seeking a talented Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies.

This role offers an exciting opportunity to work on cutting-edge projects that impact millions of users worldwide. You'll collaborate with cross-functional teams and contribute to architectural decisions.`,
    responsibilities: [
      'Design and develop scalable web applications',
      'Lead technical discussions and code reviews',
      'Mentor junior developers',
      'Collaborate with product and design teams',
      'Optimize application performance and reliability',
      'Participate in agile development processes'
    ],
    requirements: [
      '5+ years of software development experience',
      'Strong proficiency in React, TypeScript, and Node.js',
      'Experience with cloud platforms (AWS, Azure, or GCP)',
      'Solid understanding of software design patterns',
      'Excellent problem-solving and communication skills',
      'Bachelor\'s degree in Computer Science or equivalent'
    ],
    niceToHave: [
      'Experience with microservices architecture',
      'Knowledge of DevOps practices and CI/CD',
      'Contributions to open-source projects',
      'Experience leading technical teams'
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      '401(k) matching',
      'Remote work flexibility',
      'Learning and development budget',
      'Home office stipend'
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker', 'Kubernetes'],
    companyInfo: {
      name: 'TechCorp Inc.',
      size: '500-1000 employees',
      industry: 'Technology',
      founded: '2015',
      description: 'TechCorp is a leading technology company building innovative solutions for the modern workplace.'
    }
  }

  const myDocuments = [
    { id: '1', title: 'Senior Developer Resume', type: 'Resume' },
    { id: '2', title: 'Cover Letter - TechCorp', type: 'Cover Letter' },
    { id: '3', title: 'Product Manager Resume', type: 'Resume' }
  ]

  const handleApply = () => {
    setShowApplicationModal(true)
  }

  const handleSubmitApplication = () => {
    if (!selectedDocument) {
      alert('Please select a document')
      return
    }
    // Submit application logic here
    setShowApplicationModal(false)
    alert('Application submitted successfully!')
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation isAuthenticated={true} userType="seeker" />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-5xl mx-auto container-padding">
          {/* Back Button */}
          <button
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </button>

          {/* Job Header */}
          <Card glass className="mb-6 sm:mb-8 animate-fade-in">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl sm:text-3xl mb-2">
                        {job.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2 text-muted-foreground mb-3">
                        <span className="text-lg font-medium">{job.company}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        {job.remote && (
                          <>
                            <span>•</span>
                            <Badge variant="glass" className="bg-green-100 text-green-700">
                              Remote
                            </Badge>
                          </>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill, index) => (
                          <Badge key={index} variant="glass">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>Posted {job.posted}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                        {job.match}% Match
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex lg:flex-col gap-3 lg:w-48">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleApply}
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIsSaved(!isSaved)}
                    className="flex-1 lg:flex-none"
                  >
                    <Bookmark
                      className={`mr-2 h-5 w-5 ${isSaved ? 'fill-current' : ''}`}
                    />
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="flex-1 lg:flex-none"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Description */}
              <Card glass className="animate-slide-up">
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm sm:prose-base max-w-none">
                  <p className="text-muted-foreground whitespace-pre-line">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              <Card glass className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.responsibilities.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card glass className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.requirements.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Nice to Have */}
              <Card glass className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <CardHeader>
                  <CardTitle>Nice to Have</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.niceToHave.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0"></div>
                        <span className="text-sm sm:text-base text-muted-foreground">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card glass className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {job.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/50"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Company Info */}
              <Card glass className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <CardHeader>
                  <CardTitle>About {job.companyInfo.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {job.companyInfo.description}
                  </p>
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{job.companyInfo.size}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{job.companyInfo.industry}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Founded {job.companyInfo.founded}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              <Card glass className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
                <CardHeader>
                  <CardTitle>Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: 'Full Stack Developer', company: 'StartupXYZ', match: 88 },
                    { title: 'Frontend Engineer', company: 'DesignCo', match: 82 },
                    { title: 'Backend Developer', company: 'DataTech', match: 78 }
                  ].map((similarJob, index) => (
                    <Link
                      key={index}
                      to={`/jobs/${index + 2}`}
                      className="block p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                    >
                      <h4 className="font-semibold text-sm mb-1">{similarJob.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {similarJob.company}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="glass" className="text-xs">
                          {similarJob.match}% Match
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <Modal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          size="lg"
        >
          <ModalHeader onClose={() => setShowApplicationModal(false)}>
            <ModalTitle>Apply for this position</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {job.title} at {job.company}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select a resume or cover letter to submit with your application
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Select Document</label>
                <div className="space-y-2">
                  {myDocuments.map((doc) => (
                    <label
                      key={doc.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        selectedDocument === doc.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="document"
                        value={doc.id}
                        checked={selectedDocument === doc.id}
                        onChange={(e) => setSelectedDocument(e.target.value)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-sm">{doc.title}</p>
                        <p className="text-xs text-muted-foreground">{doc.type}</p>
                      </div>
                    </label>
                  ))}
                </div>
                <Link
                  to="/documents/new"
                  className="text-sm text-blue-600 hover:text-blue-700 inline-block"
                >
                  + Create new document
                </Link>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowApplicationModal(false)}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmitApplication}
                  fullWidth
                >
                  Submit Application
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}
    </div>
  )
}

export default JobDetails
