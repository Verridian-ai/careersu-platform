import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Download,
  Edit,
  Trash2,
  Copy,
  Eye
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils'
import type { Document } from '@/types'

const Documents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'resume' | 'cover_letter' | 'portfolio'>('all')

  // Mock documents data
  const documents: Document[] = [
    {
      id: '1',
      title: 'Senior Developer Resume',
      type: 'resume',
      content: 'Resume content...',
      lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'final',
      userId: 'user1'
    },
    {
      id: '2',
      title: 'Cover Letter - TechCorp',
      type: 'cover_letter',
      content: 'Cover letter content...',
      lastModified: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      userId: 'user1'
    },
    {
      id: '3',
      title: 'Product Manager Resume',
      type: 'resume',
      content: 'Resume content...',
      lastModified: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'final',
      userId: 'user1'
    },
    {
      id: '4',
      title: 'Portfolio - Web Projects',
      type: 'portfolio',
      content: 'Portfolio content...',
      lastModified: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      userId: 'user1'
    },
  ]

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || doc.type === filterType
    return matchesSearch && matchesFilter
  })

  const getDocumentIcon = (type: string) => {
    return <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'final':
        return 'success'
      case 'draft':
        return 'warning'
      case 'archived':
        return 'secondary'
      default:
        return 'default'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="glass-nav sticky top-0 z-50 border-b">
        <div className="container-padding py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-responsive-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Documents
              </h1>
              <p className="text-responsive-sm text-muted-foreground mt-1">
                Manage your resumes, cover letters, and portfolios
              </p>
            </div>
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Create New
            </Button>
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
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                glass
              />
            </div>

            {/* Filter Button - Mobile */}
            <Button variant="outline" className="sm:hidden w-full">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Filter Chips - Desktop */}
          <div className="hidden sm:flex gap-2 flex-wrap">
            <Button
              variant={filterType === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All Documents
            </Button>
            <Button
              variant={filterType === 'resume' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('resume')}
            >
              Resumes
            </Button>
            <Button
              variant={filterType === 'cover_letter' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('cover_letter')}
            >
              Cover Letters
            </Button>
            <Button
              variant={filterType === 'portfolio' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilterType('portfolio')}
            >
              Portfolios
            </Button>
          </div>
        </div>

        {/* Documents Grid - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredDocuments.map((doc, index) => (
            <Card
              key={doc.id}
              glass
              className="animate-fade-in hover:scale-105 transition-all cursor-pointer group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="mt-1 p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 shrink-0">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">
                        {doc.title}
                      </CardTitle>
                      <CardDescription className="text-xs sm:text-sm mt-1">
                        {formatRelativeTime(doc.lastModified)}
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(doc.status) as any}>
                    {doc.status}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {doc.type.replace('_', ' ')}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">View</span>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm">Edit</span>
                  </Button>
                </div>

                {/* Secondary Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive">
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <Card glass className="py-12 sm:py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="p-4 sm:p-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 mb-4 sm:mb-6">
                <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">No documents found</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-sm">
                {searchQuery
                  ? `No documents match "${searchQuery}"`
                  : 'Create your first document to get started'}
              </p>
              <Button variant="primary" size="lg">
                <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Create Document
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Card */}
        <Card glass className="mt-6 sm:mt-8">
          <CardHeader>
            <CardTitle>Document Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {documents.length}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Total</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {documents.filter(d => d.status === 'final').length}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Final</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'draft').length}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Drafts</p>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                  {documents.filter(d => d.type === 'resume').length}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Resumes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Documents
