import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navigation from '@/components/layout/Navigation'
import Button from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Download,
  Copy,
  Star,
  Clock,
  Calendar,
  Filter
} from 'lucide-react'

const DocumentsPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'resumes' | 'cover-letters'>('all')

  const documents = [
    {
      id: 1,
      title: 'Senior Developer Resume',
      type: 'Resume',
      lastModified: '2 hours ago',
      createdDate: 'Jan 15, 2025',
      status: 'Published',
      starred: true,
    },
    {
      id: 2,
      title: 'Cover Letter - TechCorp',
      type: 'Cover Letter',
      lastModified: '1 day ago',
      createdDate: 'Jan 14, 2025',
      status: 'Draft',
      starred: false,
    },
    {
      id: 3,
      title: 'Product Manager Resume',
      type: 'Resume',
      lastModified: '3 days ago',
      createdDate: 'Jan 12, 2025',
      status: 'Published',
      starred: true,
    },
    {
      id: 4,
      title: 'General Cover Letter',
      type: 'Cover Letter',
      lastModified: '1 week ago',
      createdDate: 'Jan 8, 2025',
      status: 'Published',
      starred: false,
    },
    {
      id: 5,
      title: 'Frontend Developer Resume',
      type: 'Resume',
      lastModified: '2 weeks ago',
      createdDate: 'Dec 30, 2024',
      status: 'Archived',
      starred: false,
    },
  ]

  const templates = [
    {
      name: 'Professional Resume',
      description: 'Clean and modern design',
      icon: FileText,
    },
    {
      name: 'Creative Resume',
      description: 'Stand out with style',
      icon: FileText,
    },
    {
      name: 'Tech Resume',
      description: 'Perfect for developers',
      icon: FileText,
    },
  ]

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'resumes' && doc.type === 'Resume') ||
      (filterType === 'cover-letters' && doc.type === 'Cover Letter')
    return matchesSearch && matchesFilter
  })

  const handleEdit = (docId: number) => {
    navigate(`/documents/${docId}`)
  }

  const handleExport = (doc: typeof documents[0]) => {
    // Simulate PDF export
    const blob = new Blob([`${doc.title}\n\nType: ${doc.type}\nCreated: ${doc.createdDate}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = (docId: number) => {
    // In a real app, this would duplicate the document
    alert(`Document ${docId} has been duplicated!`)
  }

  const handleTemplateSelect = (templateName: string) => {
    navigate(`/documents/new?template=${encodeURIComponent(templateName)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation isAuthenticated={true} userType="seeker" />

      <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto container-padding">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-responsive-2xl font-bold text-foreground mb-2">
                  My Documents
                </h1>
                <p className="text-responsive-base text-muted-foreground">
                  Create and manage your resumes and cover letters
                </p>
              </div>
              <Link to="/documents/new">
                <Button size="lg" className="w-full sm:w-auto">
                  <Plus className="w-5 h-5 mr-2" />
                  New Document
                </Button>
              </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11"
                  glass
                />
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                <Button
                  variant={filterType === 'all' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setFilterType('all')}
                  className="whitespace-nowrap"
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'resumes' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setFilterType('resumes')}
                  className="whitespace-nowrap"
                >
                  Resumes
                </Button>
                <Button
                  variant={filterType === 'cover-letters' ? 'primary' : 'outline'}
                  size="md"
                  onClick={() => setFilterType('cover-letters')}
                  className="whitespace-nowrap"
                >
                  Cover Letters
                </Button>
              </div>
            </div>
          </div>

          {/* Templates Section */}
          <div className="mb-8">
            <h2 className="text-responsive-xl font-semibold text-foreground mb-4">
              Start from Template
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template, index) => {
                const Icon = template.icon
                return (
                  <Card
                    key={index}
                    glass
                    hover
                    className="cursor-pointer group"
                    onClick={() => handleTemplateSelect(template.name)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-bg-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-responsive-base font-semibold text-foreground mb-1">
                            {template.name}
                          </h3>
                          <p className="text-responsive-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Documents Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-responsive-xl font-semibold text-foreground">
                Recent Documents ({filteredDocuments.length})
              </h2>
            </div>

            {filteredDocuments.length === 0 ? (
              <Card glass className="text-center p-8 sm:p-12">
                <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-responsive-lg font-semibold text-foreground mb-2">
                  No documents found
                </h3>
                <p className="text-responsive-sm text-muted-foreground mb-6">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Create your first document to get started'}
                </p>
                <Link to="/documents/new">
                  <Button size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Document
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} glass hover>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className="text-base sm:text-lg">
                              {doc.title}
                            </CardTitle>
                            {doc.starred && (
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          <CardDescription>{doc.type}</CardDescription>
                        </div>
                        <button className="p-2 hover:bg-accent rounded-lg transition-colors touch-target">
                          <MoreVertical className="w-5 h-5 text-muted-foreground" />
                        </button>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-2 text-responsive-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>Modified {doc.lastModified}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Created {doc.createdDate}</span>
                        </div>
                        <div className="pt-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              doc.status === 'Published'
                                ? 'bg-green-100 text-green-700'
                                : doc.status === 'Draft'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <div className="grid grid-cols-3 gap-2 w-full">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-col h-auto py-2"
                          onClick={() => handleEdit(doc.id)}
                        >
                          <Edit className="w-4 h-4 mb-1" />
                          <span className="text-xs">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-col h-auto py-2"
                          onClick={() => handleExport(doc)}
                        >
                          <Download className="w-4 h-4 mb-1" />
                          <span className="text-xs">Export</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-col h-auto py-2"
                          onClick={() => handleCopy(doc.id)}
                        >
                          <Copy className="w-4 h-4 mb-1" />
                          <span className="text-xs">Copy</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentsPage
