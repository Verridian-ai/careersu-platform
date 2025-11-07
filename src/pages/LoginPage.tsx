import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { LogIn, Mail, Lock, Eye, EyeOff, UserCheck, Briefcase } from 'lucide-react'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = { email: '', password: '' }
    let isValid = true

    if (!formData.email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Simulate login - in real app, this would call an API
      console.log('Login attempt:', formData)
      navigate('/dashboard')
    }
  }

  const handleDemoLogin = (type: 'seeker' | 'coach') => {
    const demoCredentials = {
      seeker: { email: 'demo@careersu.com', password: 'demo123' },
      coach: { email: 'coach@careersu.com', password: 'coach123' },
    }
    setFormData(demoCredentials[type])
    // Simulate login
    setTimeout(() => navigate('/dashboard'), 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation isAuthenticated={false} />

      <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Login Form */}
            <div className="order-2 lg:order-1">
              <Card glass className="p-6 sm:p-8 max-w-md mx-auto lg:mx-0">
                <CardHeader>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-bg-blue flex items-center justify-center mb-4">
                    <LogIn className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <CardTitle>Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to your CareerSU account to continue your career journey
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                      <Input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={errors.email}
                        className="pl-11"
                        glass
                      />
                    </div>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password}
                        className="pl-11 pr-11"
                        glass
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors touch-target"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-responsive-xs text-foreground">Remember me</span>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-responsive-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <Button type="submit" size="lg" fullWidth>
                      Sign In
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </form>

                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white/80 text-muted-foreground">
                          Don't have an account?
                        </span>
                      </div>
                    </div>

                    <Link to="/signup" className="block mt-4">
                      <Button variant="outline" size="md" fullWidth>
                        Create Account
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Demo Accounts & Info */}
            <div className="order-1 lg:order-2 space-y-4 sm:space-y-6">
              <div className="text-center lg:text-left">
                <h1 className="text-responsive-2xl font-bold text-foreground mb-3 sm:mb-4">
                  Access Your Career Dashboard
                </h1>
                <p className="text-responsive-base text-muted-foreground">
                  Try our platform with demo accounts or sign in with your credentials
                </p>
              </div>

              {/* Demo Account Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                <Card
                  glass
                  hover
                  onClick={() => handleDemoLogin('seeker')}
                  className="cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-bg-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                        <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg">Job Seeker Demo</CardTitle>
                        <p className="text-responsive-xs text-muted-foreground">
                          Click to try
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-responsive-sm">
                        <strong>Email:</strong> demo@careersu.com
                      </p>
                      <p className="text-responsive-sm">
                        <strong>Password:</strong> demo123
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  glass
                  hover
                  onClick={() => handleDemoLogin('coach')}
                  className="cursor-pointer group"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-bg-green flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg">Career Coach Demo</CardTitle>
                        <p className="text-responsive-xs text-muted-foreground">
                          Click to try
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-responsive-sm">
                        <strong>Email:</strong> coach@careersu.com
                      </p>
                      <p className="text-responsive-sm">
                        <strong>Password:</strong> coach123
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Info Card */}
              <Card glass className="hidden lg:block">
                <CardContent className="p-6">
                  <h3 className="text-responsive-lg font-semibold mb-4">Why CareerSU?</h3>
                  <ul className="space-y-3">
                    {[
                      'AI-powered resume optimization',
                      'Smart job matching algorithm',
                      '24/7 career guidance chatbot',
                      'Professional coaching support',
                    ].map((item, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="text-responsive-sm text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Missing imports
import { ArrowRight, CheckCircle } from 'lucide-react'

export default LoginPage
