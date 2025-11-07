import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import {
  FileText,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react'

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: 'Smart Document Editor',
      description: 'Create and edit resumes with AI-powered formatting and optimization',
    },
    {
      icon: Briefcase,
      title: 'Job Matching',
      description: 'AI-driven job recommendations based on your skills and preferences',
    },
    {
      icon: MessageSquare,
      title: 'AI Career Chat',
      description: 'Get instant career advice and guidance 24/7',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Monitor your application success and career growth',
    },
    {
      icon: Users,
      title: 'Coach Collaboration',
      description: 'Connect with career coaches for personalized guidance',
    },
    {
      icon: Zap,
      title: 'Quick Applications',
      description: 'One-click application process with tailored resumes',
    },
  ]

  const benefits = [
    'AI-powered resume optimization',
    'Access to thousands of job opportunities',
    'Personalized career recommendations',
    'Real-time progress analytics',
    'Professional resume templates',
    'Expert career coaching',
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      content: 'CareerSU helped me land my dream job in just 3 weeks! The AI recommendations were spot-on.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Manager',
      content: 'The document editor is incredibly intuitive. I created a professional resume in minutes.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Analyst',
      content: 'The coaching features and AI chat are game-changers. Highly recommend!',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation isAuthenticated={false} />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-responsive-3xl font-bold text-foreground mb-4 sm:mb-6">
                Transform Your Career Journey with{' '}
                <span className="bg-gradient-bg-blue bg-clip-text text-transparent">
                  AI-Powered Tools
                </span>
              </h1>
              <p className="text-responsive-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
                CareerSU combines advanced document editing, AI-powered job matching, and
                collaborative coaching tools to accelerate your career success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="glass" size="lg" className="w-full sm:w-auto">
                    Try Demo
                  </Button>
                </Link>
              </div>

              {/* Demo Account Info */}
              <div className="mt-6 sm:mt-8 p-4 sm:p-6 glass-card rounded-lg inline-block">
                <p className="text-responsive-sm text-muted-foreground mb-2 font-medium">
                  Quick Demo Access:
                </p>
                <p className="text-responsive-xs text-foreground">
                  <strong>Job Seeker:</strong> demo@careersu.com / demo123
                </p>
                <p className="text-responsive-xs text-foreground">
                  <strong>Career Coach:</strong> coach@careersu.com / coach123
                </p>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative animate-slide-up">
              <Card glass hover className="p-6 sm:p-8">
                <div className="space-y-4">
                  <div className="h-3 bg-gradient-bg-blue rounded w-3/4"></div>
                  <div className="h-3 bg-gradient-bg-green rounded w-1/2"></div>
                  <div className="h-3 bg-gradient-bg rounded w-5/6"></div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="glass-light p-4 rounded-lg">
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-primary mb-2" />
                      <p className="text-responsive-xs font-semibold">95% Success Rate</p>
                    </div>
                    <div className="glass-light p-4 rounded-lg">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-secondary mb-2" />
                      <p className="text-responsive-xs font-semibold">10K+ Users</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 glass-strong p-3 sm:p-4 rounded-full shadow-glass-lg hidden sm:block">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 fill-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding bg-white/50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-responsive-2xl font-bold text-foreground mb-4">
              Everything You Need for Career Success
            </h2>
            <p className="text-responsive-base text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed to streamline your job search and accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} glass hover className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardHeader>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-bg-blue flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-responsive-2xl font-bold text-foreground mb-4 sm:mb-6">
                Why Choose CareerSU?
              </h2>
              <p className="text-responsive-base text-muted-foreground mb-6 sm:mb-8">
                Join thousands of successful job seekers who have transformed their careers with our platform
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-secondary flex-shrink-0 mt-1" />
                    <span className="text-responsive-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Card glass className="p-6 sm:p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-bg-blue"></div>
                  <div>
                    <h4 className="text-responsive-base font-semibold">For Job Seekers</h4>
                    <p className="text-responsive-xs text-muted-foreground">Accelerate your job search</p>
                  </div>
                </div>
                <p className="text-responsive-sm text-muted-foreground">
                  Create professional resumes, discover perfect job matches, and get AI-powered career guidance
                </p>
              </Card>

              <Card glass className="p-6 sm:p-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-bg-green"></div>
                  <div>
                    <h4 className="text-responsive-base font-semibold">For Career Coaches</h4>
                    <p className="text-responsive-xs text-muted-foreground">Empower your clients</p>
                  </div>
                </div>
                <p className="text-responsive-sm text-muted-foreground">
                  Manage clients efficiently, track progress, and provide expert guidance with powerful tools
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white/50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-responsive-2xl font-bold text-foreground mb-4">
              Loved by Professionals
            </h2>
            <p className="text-responsive-base text-muted-foreground max-w-3xl mx-auto">
              See what our users have to say about their experience with CareerSU
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} glass hover>
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <CardTitle className="text-base sm:text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-responsive-sm text-muted-foreground italic">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto container-padding">
          <Card glass className="text-center p-8 sm:p-12">
            <h2 className="text-responsive-2xl font-bold text-foreground mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-responsive-base text-muted-foreground mb-6 sm:mb-8">
              Join thousands of professionals who are accelerating their career success with CareerSU
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Today
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Try Demo Account
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 sm:py-12">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center">
            <p className="text-responsive-sm mb-2">
              Made with ❤️ by the Verridian AI Team
            </p>
            <p className="text-responsive-xs text-muted">
              © 2025 CareerSU. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
