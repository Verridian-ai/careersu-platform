import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import {
  Save,
  Download,
  ArrowLeft,
  FileText,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type,
  Sparkles
} from 'lucide-react'

type DocumentType = 'resume' | 'cover_letter' | 'portfolio'

const DocumentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNewDocument = !id || id === 'new'

  const [title, setTitle] = useState('Untitled Document')
  const [documentType, setDocumentType] = useState<DocumentType>('resume')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showTemplateSelector, setShowTemplateSelector] = useState(isNewDocument)

  const templates = [
    {
      id: 'professional',
      name: 'Professional Resume',
      description: 'Clean and modern design for any industry',
      type: 'resume' as DocumentType,
      content: `JOHN DOE
john.doe@email.com | (555) 123-4567 | San Francisco, CA

PROFESSIONAL SUMMARY
Results-driven professional with 5+ years of experience in software development. Proven track record of delivering high-quality solutions and leading cross-functional teams.

EXPERIENCE

Senior Software Engineer | TechCorp Inc. | 2020 - Present
• Led development of core features serving 1M+ users
• Improved application performance by 40%
• Mentored team of 5 junior developers

Software Engineer | StartupXYZ | 2018 - 2020
• Built and maintained web applications using React and Node.js
• Collaborated with product team to define technical requirements
• Implemented CI/CD pipelines reducing deployment time by 60%

EDUCATION

Bachelor of Science in Computer Science
University of California, Berkeley | 2018

SKILLS

Programming: JavaScript, TypeScript, Python, Java
Frameworks: React, Node.js, Express, Django
Tools: Git, Docker, AWS, Jenkins`
    },
    {
      id: 'creative',
      name: 'Creative Resume',
      description: 'Stand out with a unique design',
      type: 'resume' as DocumentType,
      content: `✨ JANE SMITH ✨
Designer & Creative Professional

📧 jane.smith@email.com | 📱 (555) 987-6543
🌐 portfolio.com | 📍 New York, NY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ABOUT ME
Passionate creative professional with expertise in UI/UX design and brand development. I bring ideas to life through thoughtful design and user-centered solutions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

EXPERIENCE

🎨 Senior UI/UX Designer | DesignCo | 2021 - Present
   ▸ Lead design projects from concept to launch
   ▸ Created design systems used across 20+ products
   ▸ Increased user engagement by 50%

🎨 Product Designer | Creative Agency | 2019 - 2021
   ▸ Designed mobile and web applications
   ▸ Conducted user research and usability testing
   ▸ Collaborated with developers for pixel-perfect implementation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SKILLS

Design: Figma, Sketch, Adobe Creative Suite
Prototyping: InVision, Principle, Framer
Development: HTML, CSS, JavaScript basics`
    },
    {
      id: 'tech',
      name: 'Tech Resume',
      description: 'Optimized for developers and engineers',
      type: 'resume' as DocumentType,
      content: `# ALEX JOHNSON
Full Stack Developer

📧 alex.johnson@email.com | 💻 github.com/alexj | 🔗 linkedin.com/in/alexj
📍 Seattle, WA | 📱 (555) 456-7890

## TECHNICAL SKILLS

**Languages:** JavaScript/TypeScript, Python, Java, Go, SQL
**Frontend:** React, Vue.js, Next.js, Tailwind CSS, Redux
**Backend:** Node.js, Express, Django, FastAPI, GraphQL
**Database:** PostgreSQL, MongoDB, Redis, Elasticsearch
**DevOps:** Docker, Kubernetes, AWS, CI/CD, Terraform
**Tools:** Git, VS Code, Postman, Jira, Figma

## PROFESSIONAL EXPERIENCE

### Senior Full Stack Engineer | CloudTech Solutions
*2021 - Present | Remote*

- Architected and built microservices handling 10M+ requests/day
- Reduced API response time by 65% through optimization
- Led migration from monolith to microservices architecture
- Implemented real-time features using WebSockets
- Tech Stack: React, Node.js, PostgreSQL, Redis, AWS

### Software Engineer | DataFlow Inc.
*2019 - 2021 | San Francisco, CA*

- Developed data visualization dashboards using React and D3.js
- Built RESTful APIs serving 100K+ daily active users
- Implemented automated testing increasing code coverage to 85%
- Collaborated with ML team to integrate predictive models
- Tech Stack: React, Python, Django, PostgreSQL, Docker

## EDUCATION

**M.S. Computer Science** | Stanford University | 2019
**B.S. Computer Engineering** | MIT | 2017

## PROJECTS

**Open Source Contributor** | React Ecosystem
- Contributed to popular libraries with 50K+ stars
- Fixed critical bugs and improved documentation

**Personal Project** | DevTools Dashboard
- Built developer productivity tool with 5K+ users
- Tech: TypeScript, React, Electron, Node.js`
    },
    {
      id: 'cover-letter',
      name: 'Professional Cover Letter',
      description: 'Perfect template for job applications',
      type: 'cover_letter' as DocumentType,
      content: `[Your Name]
[Your Address]
[City, State ZIP Code]
[Your Email]
[Your Phone Number]
[Date]

[Hiring Manager's Name]
[Company Name]
[Company Address]
[City, State ZIP Code]

Dear [Hiring Manager's Name],

I am writing to express my strong interest in the [Position Title] position at [Company Name]. With my background in [your field/industry] and proven track record of [key achievement], I am confident I would be a valuable addition to your team.

In my current role at [Current Company], I have successfully [describe relevant accomplishment]. This experience has equipped me with [relevant skills] that directly align with the requirements of this position. I am particularly drawn to [Company Name] because of [specific reason related to company's mission, values, or projects].

Key highlights of my qualifications include:
• [First key qualification or achievement]
• [Second key qualification or achievement]
• [Third key qualification or achievement]

I am excited about the opportunity to bring my expertise in [relevant skills] to [Company Name] and contribute to [specific goal or project]. I am particularly impressed by [something specific about the company], and I believe my experience in [relevant area] would enable me to make meaningful contributions from day one.

Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experiences align with your team's needs. I am available for an interview at your convenience and can be reached at [phone number] or [email].

Sincerely,

[Your Name]`
    }
  ]

  useEffect(() => {
    if (!isNewDocument && id) {
      // In a real app, fetch the document by ID
      // For now, load mock data
      setTitle('Senior Developer Resume')
      setDocumentType('resume')
      setContent(templates[0].content)
      setLastSaved(new Date())
      setShowTemplateSelector(false)
    }
  }, [id, isNewDocument])

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setTitle(template.name)
    setDocumentType(template.type)
    setContent(template.content)
    setShowTemplateSelector(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLastSaved(new Date())
    setIsSaving(false)
  }

  const handleExportPDF = () => {
    // In a real app, this would generate and download a PDF
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFormatText = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = selectedText
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'underline':
        formattedText = `__${selectedText}__`
        break
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)
  }

  const handleAIOptimize = () => {
    alert('AI optimization coming soon! This will analyze and improve your document.')
  }

  if (showTemplateSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation isAuthenticated={true} userType="seeker" />

        <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
          <div className="max-w-6xl mx-auto container-padding">
            <button
              onClick={() => navigate('/documents')}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documents
            </button>

            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Choose a Template
              </h1>
              <p className="text-muted-foreground">
                Start with a professionally designed template or create from scratch
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  glass
                  hover
                  className="cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-1">
                          {template.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {template.description}
                        </p>
                        <div className="bg-white/50 rounded-lg p-4 font-mono text-xs overflow-hidden max-h-32">
                          <pre className="whitespace-pre-wrap">
                            {template.content.substring(0, 200)}...
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card glass className="p-6">
              <button
                onClick={() => {
                  setContent('')
                  setShowTemplateSelector(false)
                }}
                className="w-full text-center py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-colors"
              >
                <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium">Start from Blank Document</p>
                <p className="text-sm text-muted-foreground">
                  Create your own document from scratch
                </p>
              </button>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation isAuthenticated={true} userType="seeker" />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto container-padding">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/documents')}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Documents
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex-1">
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl font-bold border-none bg-transparent p-0 focus:ring-0"
                  placeholder="Document Title"
                />
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                    className="bg-transparent border-none focus:ring-0 p-0"
                  >
                    <option value="resume">Resume</option>
                    <option value="cover_letter">Cover Letter</option>
                    <option value="portfolio">Portfolio</option>
                  </select>
                  {lastSaved && (
                    <span>
                      Last saved: {lastSaved.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleAIOptimize}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Optimize
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleExportPDF}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <Card glass className="mb-6">
            <div className="p-3">
              <div className="flex flex-wrap gap-2">
                <div className="flex gap-1 border-r pr-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatText('bold')}
                    title="Bold"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatText('italic')}
                    title="Italic"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFormatText('underline')}
                    title="Underline"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-1 border-r pr-2">
                  <Button variant="ghost" size="sm" title="Align Left">
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Align Center">
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Align Right">
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-1 border-r pr-2">
                  <Button variant="ghost" size="sm" title="Bullet List">
                    <List className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Numbered List">
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-1 border-r pr-2">
                  <Button variant="ghost" size="sm" title="Undo">
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" title="Redo">
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" title="Font Size">
                    <Type className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Editor */}
          <Card glass className="min-h-[600px]">
            <div className="p-8">
              <textarea
                id="content-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[500px] bg-transparent border-none focus:ring-0 resize-none font-mono text-sm leading-relaxed"
                placeholder="Start typing your document here..."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default DocumentEditor
