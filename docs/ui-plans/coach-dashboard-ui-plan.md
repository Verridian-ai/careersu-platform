# Career Coach Dashboard - Comprehensive UI Plan

## Document Information
- **Version**: 1.0.0
- **Last Updated**: 2025-11-07
- **Platform**: CareerSU - AI-Powered Career Success Platform
- **Tech Stack**: React 18.3.1, TypeScript, Vite, Tailwind CSS, Radix UI, Lucide Icons, Recharts

---

## Table of Contents

1. [Screen Inventory](#1-screen-inventory)
2. [Component Breakdown](#2-component-breakdown)
3. [Detailed Component Specifications](#3-detailed-component-specifications)
4. [User Flows](#4-user-flows)
5. [Data Requirements](#5-data-requirements)
6. [File Structure](#6-file-structure)
7. [Responsive Design Strategy](#7-responsive-design-strategy)
8. [Accessibility Considerations](#8-accessibility-considerations)

---

## 1. Screen Inventory

### 1.1 Primary Screens

| Screen Name | Route | Purpose | Priority |
|------------|-------|---------|----------|
| Coach Dashboard Overview | `/coach/dashboard` | Main landing page with key metrics and quick actions | P0 |
| Client List View | `/coach/clients` | Browse and search all clients | P0 |
| Client Detail View | `/coach/clients/:clientId` | Detailed view of individual client | P0 |
| Document Review | `/coach/clients/:clientId/documents/:docId` | Review and comment on client documents | P0 |
| Analytics & Reports | `/coach/analytics` | Performance metrics and insights | P1 |
| Resource Library | `/coach/resources` | Templates, guides, and coaching materials | P1 |
| Communication Hub | `/coach/messages` | Centralized messaging with clients | P1 |
| Calendar & Scheduling | `/coach/calendar` | Schedule and manage coaching sessions | P1 |
| Coach Profile | `/coach/profile` | Manage coach profile and settings | P2 |
| Client Progress Tracker | `/coach/clients/:clientId/progress` | Detailed client progress analytics | P1 |

### 1.2 Modal & Overlay Screens

| Component | Trigger | Purpose |
|-----------|---------|---------|
| Add New Client | Button on client list | Onboard new client |
| Schedule Session | Calendar or client detail | Book coaching session |
| Quick Message | Various locations | Send quick message to client |
| Document Comment | Document review page | Add inline comments |
| Goal Setting | Client detail page | Set client goals and milestones |
| Resource Share | Resource library | Share resource with client |
| Bulk Actions | Client list | Perform actions on multiple clients |
| Export Report | Analytics page | Export analytics data |

---

## 2. Component Breakdown

### 2.1 Layout Components

#### CoachDashboardLayout
**Purpose**: Main layout wrapper for all coach screens

**Structure**:
```
┌─────────────────────────────────────────────┐
│           Top Navigation Bar                 │
├──────┬──────────────────────────────────────┤
│      │                                       │
│ Side │        Main Content Area             │
│ bar  │                                       │
│      │                                       │
└──────┴──────────────────────────────────────┘
```

**Key Features**:
- Persistent side navigation
- Collapsible sidebar for more screen space
- Responsive: sidebar converts to drawer on mobile
- Breadcrumb navigation in header
- Global search in top bar
- Notification bell with badge
- Coach profile dropdown

---

### 2.2 Dashboard Components

#### DashboardStatsGrid
**Purpose**: Display key performance indicators

**Metrics Cards**:
1. **Active Clients**
   - Current number
   - Change from last month
   - Icon: Users
   
2. **Success Rate**
   - Percentage of clients landing jobs
   - Trend indicator
   - Icon: TrendingUp
   
3. **Pending Reviews**
   - Number of documents awaiting review
   - Urgency indicator
   - Icon: FileText
   
4. **Session This Week**
   - Scheduled coaching sessions
   - Upcoming count
   - Icon: Calendar

**Visual Design**:
- Card-based layout
- 4-column grid on desktop
- 2-column on tablet
- 1-column on mobile
- Color-coded borders based on metric type
- Hover effect: subtle elevation increase
- Click action: navigate to detailed view

#### RecentActivityFeed
**Purpose**: Show recent client activities and updates

**Activity Types**:
- Document submitted for review
- Job application submitted
- Interview scheduled
- Goal completed
- Message received
- Session completed

**Visual Design**:
- Timeline-style layout
- Avatar + activity description
- Timestamp (relative, e.g., "2 hours ago")
- Quick action buttons (View, Reply, Archive)
- Infinite scroll with load more
- Empty state with illustration

#### UpcomingSessionsWidget
**Purpose**: Display next 5 coaching sessions

**Data Displayed**:
- Client name and avatar
- Session type (Initial, Follow-up, Document Review)
- Date and time
- Duration
- Meeting link (if virtual)
- Quick actions: Join, Reschedule, Cancel

**Visual Design**:
- Compact list view
- Time-ordered
- Color-coded by session type
- CTA button: "View Full Calendar"
- Hover: show more details in tooltip

#### QuickActionsPanel
**Purpose**: Fast access to common tasks

**Actions**:
1. Add New Client
2. Schedule Session
3. Create Resource
4. Send Message
5. Review Documents
6. Generate Report

**Visual Design**:
- Grid of action cards
- Icon + label
- Subtle hover animation
- Keyboard shortcuts displayed on hover

---

### 2.3 Client Management Components

#### ClientListTable
**Purpose**: Comprehensive view of all clients

**Columns**:
1. Client Name (Avatar + Name)
2. Status (Active, Inactive, Pending)
3. Progress (Visual progress bar)
4. Last Activity (Date/time)
5. Next Session (Date/time or "Not scheduled")
6. Success Metrics (Applications sent, Interviews, Offers)
7. Actions (Quick menu)

**Features**:
- **Sorting**: All columns sortable
- **Filtering**: 
  - Status (Active, Inactive, Pending)
  - Progress level (0-25%, 26-50%, 51-75%, 76-100%)
  - Last activity date range
  - Tags/categories
- **Search**: Real-time search across name, email, company
- **Bulk Actions**: Select multiple clients for bulk operations
- **Pagination**: 25/50/100 per page options
- **View Modes**: Table view, Card view, Kanban view

**Visual Design**:
- Alternating row colors
- Sticky header on scroll
- Row hover: highlight with actions visible
- Status badges with colors
- Responsive: converts to cards on mobile

#### ClientCard
**Purpose**: Card view representation of client

**Content**:
- Client photo (large)
- Name and title
- Current company/target
- Status badge
- Key metrics (mini charts)
- Last interaction timestamp
- Quick action buttons

**Visual Design**:
- Card with hover elevation
- 3-column grid on desktop
- 2-column on tablet
- 1-column on mobile
- Color accent based on status

#### ClientKanbanBoard
**Purpose**: Visual pipeline of client progress

**Columns**:
1. New Clients
2. Active - Early Stage
3. Active - Job Search
4. Active - Interviewing
5. Placed/Succeeded
6. On Hold

**Features**:
- Drag-and-drop between columns
- Client cards show key info
- Column counts and progress metrics
- Filter and search within board
- Collapsible columns

**Visual Design**:
- Horizontal scrollable columns
- Color-coded column headers
- Card shadows and hover effects
- Smooth drag animations

#### ClientDetailHeader
**Purpose**: Overview of individual client

**Sections**:
1. **Client Info**
   - Large avatar
   - Name, title, location
   - Contact info (email, phone)
   - LinkedIn profile link
   - Edit button
   
2. **Quick Stats**
   - Days as client
   - Total sessions
   - Documents reviewed
   - Job applications
   - Response rate
   
3. **Progress Overview**
   - Overall progress bar
   - Current phase
   - Goals completed
   - Next milestone

4. **Actions**
   - Schedule Session
   - Send Message
   - Add Note
   - View History
   - More options (...)

**Visual Design**:
- Full-width banner section
- Gradient background
- White text/icons
- Glass-morphism effect for stats cards
- Sticky on scroll (compact version)

#### ClientTabNavigation
**Purpose**: Navigate between client detail sections

**Tabs**:
1. Overview (Default)
2. Documents
3. Progress & Goals
4. Applications
5. Notes & History
6. Resources Shared

**Visual Design**:
- Underline active tab
- Icon + label on desktop
- Icon only on mobile
- Smooth transition animations
- Sticky below header

#### ClientProgressTracker
**Purpose**: Detailed view of client's career journey

**Sections**:

1. **Goal Timeline**
   - Visual timeline of set goals
   - Completed, in-progress, upcoming
   - Milestone markers
   - Add goal button

2. **Skills Development**
   - Skill bars with progress
   - Before/after comparison
   - Target skills highlighted
   - Add skill button

3. **Application Metrics**
   - Applications sent (count + trend)
   - Response rate (percentage)
   - Interview conversions
   - Offer rate
   - Interactive charts (Recharts)

4. **Document Versions**
   - Resume versions timeline
   - Improvement scores
   - Version comparison view
   - Latest version highlighted

5. **Session Notes**
   - Chronological list of coaching sessions
   - Notes and action items
   - Outcomes and follow-ups
   - Searchable and filterable

**Visual Design**:
- Mixed layout: cards + timeline + charts
- Color-coded progress indicators
- Interactive charts with tooltips
- Collapsible sections
- Print-friendly option

---

### 2.4 Document Review Components

#### DocumentReviewSidebar
**Purpose**: Document list and metadata

**Content**:
- Document thumbnail
- Title and type
- Submission date
- Status (Pending, In Review, Reviewed, Approved)
- Version number
- Download button
- Compare versions button

**Visual Design**:
- Fixed sidebar (left or right)
- Scrollable list
- Active document highlighted
- Quick filter buttons
- Responsive: drawer on mobile

#### DocumentViewerPanel
**Purpose**: Display document for review

**Features**:
- PDF/DOCX preview
- Zoom controls (fit, 100%, 150%, 200%)
- Page navigation
- Download original
- Print option
- Full-screen mode

**Visual Design**:
- Clean white background
- Document centered
- Floating toolbar
- Responsive scaling

#### CommentPanel
**Purpose**: Add and view comments on documents

**Features**:
- **Inline Comments**: Click to add comment at specific location
- **General Comments**: Overall feedback
- **Suggested Changes**: Track-changes style
- **Comment Thread**: Reply to comments
- **Mentions**: @mention client
- **Status**: Mark as resolved

**Comment Structure**:
```
[Avatar] Coach Name
"This section needs more quantifiable achievements..."
[Reply] [Edit] [Resolve]
└── [Client Avatar] Client Reply
    "Thanks, I'll add metrics from my Q3 project"
    [Reply] [Edit]
```

**Visual Design**:
- Right sidebar or overlay
- Color-coded by type (feedback, suggestion, question)
- Unresolved comments highlighted
- Timestamp on each comment
- Rich text formatting for comments

#### DocumentComparisonView
**Purpose**: Side-by-side comparison of document versions

**Layout**:
```
┌────────────────┬────────────────┐
│   Version 1    │   Version 2    │
│   (Original)   │   (Updated)    │
│                │                │
│   [Document]   │   [Document]   │
│                │                │
└────────────────┴────────────────┘
    Diff Summary Below
```

**Features**:
- Synchronized scrolling
- Highlight differences
- Version selector dropdowns
- Change summary (additions, deletions, modifications)
- Export comparison report

---

### 2.5 Analytics & Reporting Components

#### AnalyticsDashboard
**Purpose**: High-level performance metrics

**Widgets**:

1. **Coach Performance Scorecard**
   - Client satisfaction rating
   - Average time to placement
   - Session completion rate
   - Response time to messages

2. **Client Success Metrics**
   - Total clients placed
   - Average salary increase
   - Interview conversion rate
   - Application response rate

3. **Time Distribution Chart**
   - Pie chart of time spent on activities
   - Categories: Sessions, Document Review, Planning, Admin
   - Interactive: click to drill down

4. **Client Progress Over Time**
   - Line chart showing client advancement
   - Multiple clients on same chart
   - Adjustable date range
   - Export to CSV

5. **Success Pipeline Funnel**
   - Funnel chart: Onboarded → Active → Interviewing → Placed
   - Conversion rates between stages
   - Click to see clients in each stage

6. **Document Review Turnaround**
   - Bar chart of average review time
   - Target line vs. actual
   - Breakdown by document type

**Visual Design**:
- Card-based dashboard
- Responsive grid layout
- Interactive charts (Recharts)
- Date range selector at top
- Export/print options
- Custom report builder button

#### CustomReportBuilder
**Purpose**: Create custom analytics reports

**Features**:
- **Select Metrics**: Checkboxes for available metrics
- **Date Range**: Custom date picker
- **Clients Filter**: Select specific clients or all
- **Grouping**: By month, week, client, document type
- **Chart Types**: Line, Bar, Pie, Table
- **Schedule**: Set up recurring reports
- **Export**: PDF, CSV, Excel

**Visual Design**:
- Multi-step wizard
- Preview panel on right
- Drag-and-drop metric builder
- Save as template option

#### ClientComparisonTool
**Purpose**: Compare metrics across multiple clients

**Features**:
- Select 2-5 clients
- Choose comparison metrics
- Side-by-side bar charts
- Radar chart for multi-metric comparison
- Highlight best/worst performers
- Export comparison report

---

### 2.6 Resource Library Components

#### ResourceLibraryGrid
**Purpose**: Browse and manage coaching resources

**Categories**:
1. Resume Templates
2. Cover Letter Templates
3. Interview Guides
4. Industry Reports
5. Career Planning Tools
6. Skill Development Resources
7. Job Search Strategies
8. Salary Negotiation Guides

**Features**:
- **View Modes**: Grid, List, Filtered
- **Search**: Full-text search
- **Filters**: Category, Type, Date added, Most used
- **Tags**: Multi-tag filtering
- **Sorting**: Name, Date, Popularity, Rating
- **Preview**: Quick preview modal
- **Actions**: Share with client, Download, Edit, Delete

**Visual Design**:
- Card grid with thumbnails
- Hover: preview overlay
- Color-coded by category
- Star rating display
- Usage count badge

#### ResourceCard
**Purpose**: Display individual resource

**Content**:
- Thumbnail/icon
- Title
- Description (truncated)
- Category badge
- File type icon
- File size
- Date added
- Usage count
- Star rating
- Quick actions: View, Share, Download

**Visual Design**:
- Consistent card size
- Hover elevation
- Favorite star (toggle)
- Share button with dropdown

#### ResourceDetailView
**Purpose**: Full resource information

**Sections**:
1. **Header**
   - Large preview/icon
   - Title and description
   - Download button
   - Share with clients button
   - Edit/delete (if owner)

2. **Details**
   - Category and tags
   - Author
   - Created/updated dates
   - File info (type, size)
   - Version history

3. **Usage Stats**
   - Times shared
   - Client feedback
   - Effectiveness rating

4. **Related Resources**
   - Suggested similar resources
   - "Clients who used this also used..."

5. **Comments/Notes**
   - Private notes about resource
   - Tips for using with clients

**Visual Design**:
- Modal or dedicated page
- Sidebar with details
- Main content area for preview
- Tabbed sections for organization

#### ResourceUploadWizard
**Purpose**: Add new resources to library

**Steps**:
1. **Upload File**
   - Drag-and-drop area
   - File browser
   - Supported formats list

2. **Add Details**
   - Title (auto-populated from filename)
   - Description (rich text)
   - Category selection
   - Tags (multi-select with autocomplete)

3. **Set Permissions**
   - Who can access (all clients, specific clients, private)
   - Allow client downloads
   - Track usage

4. **Preview & Confirm**
   - Review all details
   - Preview how it will appear
   - Submit button

**Visual Design**:
- Step indicator at top
- Previous/Next navigation
- Save as draft option
- Cancel with confirmation

---

### 2.7 Communication Components

#### MessageList
**Purpose**: Display conversations with clients

**Layout**:
```
┌─────────────────┬──────────────────────────┐
│                 │                          │
│  Conversation   │     Message Thread       │
│     List        │                          │
│                 │                          │
│  [Client 1]     │  [Message bubbles]       │
│  [Client 2]     │                          │
│  [Client 3]     │  [Compose area]          │
│                 │                          │
└─────────────────┴──────────────────────────┘
```

**Conversation List Features**:
- Client avatar and name
- Last message preview
- Timestamp
- Unread badge
- Pin important conversations
- Archive/delete conversation
- Search conversations

**Message Thread Features**:
- Chronological message bubbles
- Coach messages aligned right (blue)
- Client messages aligned left (gray)
- Timestamps
- Read receipts
- Typing indicator
- Attachment support
- Link previews
- Emoji picker
- Quick replies/templates

**Visual Design**:
- WhatsApp/Slack style interface
- Smooth scrolling
- Auto-scroll to latest message
- Message grouping by date
- Responsive: list becomes drawer on mobile

#### ComposerBox
**Purpose**: Compose new messages

**Features**:
- Rich text formatting (bold, italic, lists)
- Mention client with @
- Attach files (documents, images)
- Emoji picker
- Save as template
- Schedule send
- Read receipt request
- Character counter
- Auto-save drafts

**Visual Design**:
- Expandable text area
- Toolbar on top
- Attachment area below
- Send button (primary color)
- Keyboard shortcuts hint

#### MessageTemplates
**Purpose**: Quick message templates

**Template Types**:
1. Session Reminder
2. Document Received Confirmation
3. Review Completed
4. Encouragement/Motivation
5. Check-in Request
6. Session Notes Summary
7. Resource Recommendation
8. Milestone Celebration

**Features**:
- Template library sidebar
- Preview before send
- Customize template variables
- Create custom templates
- Share templates with other coaches

#### NotificationCenter
**Purpose**: Manage all notifications

**Notification Types**:
- New message from client
- Document submitted
- Session reminder
- Client milestone reached
- Overdue review
- System announcements

**Features**:
- Dropdown from bell icon
- Mark as read/unread
- Mark all as read
- Filter by type
- Notification settings
- In-app vs. email preferences

**Visual Design**:
- Dropdown panel (max height with scroll)
- Unread notifications highlighted
- Icon + message + timestamp
- Click to navigate to related item
- Empty state when no notifications

---

### 2.8 Calendar & Scheduling Components

#### CalendarView
**Purpose**: Manage coaching sessions

**View Modes**:
1. **Month View**: Overview of all sessions
2. **Week View**: Detailed weekly schedule
3. **Day View**: Hour-by-hour timeline
4. **Agenda View**: List of upcoming sessions

**Features**:
- Click date/time to create session
- Drag to reschedule
- Color-coded by session type
- Client avatars on events
- Filter by client
- Sync with external calendars (Google, Outlook)
- Recurring sessions
- Time zone support

**Visual Design**:
- Clean calendar grid
- Hover: show session details
- Today highlighted
- Past sessions grayed out
- Loading states for async operations

#### SessionScheduler
**Purpose**: Book new coaching session

**Form Fields**:
1. **Client**: Searchable dropdown
2. **Session Type**: Dropdown (Initial, Follow-up, Document Review, Strategy, Other)
3. **Date**: Date picker
4. **Time**: Time picker with duration
5. **Duration**: 30/60/90 minutes
6. **Location**: Virtual (link) or In-person (address)
7. **Notes**: Agenda or preparation notes
8. **Reminders**: Email reminders (1 day, 1 hour before)

**Features**:
- Check client availability
- Suggest best times (AI-powered)
- Send calendar invite
- Add to coach's calendar
- Create session prep checklist

**Visual Design**:
- Modal dialog
- Step-by-step form
- Availability indicator
- Confirm button only enabled when valid
- Loading state while creating

#### SessionDetailPanel
**Purpose**: View/edit session details

**Sections**:
1. **Session Info**
   - Client name and photo
   - Session type badge
   - Date, time, duration
   - Meeting link (if virtual)
   - Location (if in-person)

2. **Agenda**
   - Topics to cover
   - Checklist of items
   - Add/edit items

3. **Preparation**
   - Documents to review
   - Previous session notes
   - Client's recent activity

4. **Actions**
   - Join Session (if virtual)
   - Get Directions (if in-person)
   - Reschedule
   - Cancel
   - Add to calendar
   - Share agenda with client

5. **Post-Session**
   - Add session notes
   - Action items for client
   - Schedule follow-up
   - Mark complete

**Visual Design**:
- Side panel or modal
- Tabbed sections
- CTA buttons prominent
- Auto-save notes

#### AvailabilitySettings
**Purpose**: Set coach availability

**Features**:
- Weekly schedule grid
- Set available hours per day
- Block out time
- Set buffer between sessions
- Vacation/time off calendar
- Time zone settings
- Share availability link

**Visual Design**:
- Interactive grid
- Toggle hours on/off
- Color-coded: available, booked, blocked
- Save/cancel buttons

---

### 2.9 Shared UI Components

#### StatCard
**Purpose**: Display single metric

**Props**:
- title: string
- value: number | string
- change: number (percentage)
- changeType: 'increase' | 'decrease'
- icon: LucideIcon
- color: string

**Visual Design**:
- Card with icon in color
- Large value text
- Small trend indicator
- Hover: slight scale

#### ProgressBar
**Purpose**: Visual progress indicator

**Props**:
- value: number (0-100)
- label: string
- showPercentage: boolean
- color: string
- size: 'sm' | 'md' | 'lg'

**Visual Design**:
- Rounded bar
- Smooth fill animation
- Label inside or outside
- Gradient option

#### ClientAvatar
**Purpose**: Display client photo

**Props**:
- src: string
- name: string
- size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- status: 'online' | 'offline' | 'away'
- showStatus: boolean

**Visual Design**:
- Circular image
- Fallback to initials
- Status indicator dot
- Border on hover

#### StatusBadge
**Purpose**: Display status indicator

**Props**:
- status: string
- variant: 'success' | 'warning' | 'error' | 'info'

**Statuses**:
- Active (green)
- Inactive (gray)
- Pending (yellow)
- On Hold (orange)
- Placed (blue)

**Visual Design**:
- Rounded pill shape
- Small text
- Color-coded background
- Icon optional

#### EmptyState
**Purpose**: Display when no data available

**Props**:
- icon: LucideIcon
- title: string
- description: string
- action: { label: string, onClick: function }

**Visual Design**:
- Centered content
- Large icon (light color)
- Headline and description
- Optional CTA button
- Friendly illustration

#### LoadingSpinner
**Purpose**: Indicate loading state

**Props**:
- size: 'sm' | 'md' | 'lg'
- text: string

**Visual Design**:
- Spinning circle or dots
- Optional loading text
- Centered or inline

#### SearchBar
**Purpose**: Global and local search

**Features**:
- Real-time search
- Recent searches
- Search suggestions
- Filter options
- Keyboard shortcut (Cmd/Ctrl + K)

**Visual Design**:
- Input with search icon
- Clear button when typing
- Dropdown for results
- Highlight matched text

---

## 3. Detailed Component Specifications

### 3.1 CoachDashboard Overview Page

**File**: `src/pages/coach/CoachDashboard.tsx`

**Layout**:
```tsx
<CoachDashboardLayout>
  <div className="p-6 space-y-6">
    {/* Page Header */}
    <PageHeader
      title="Dashboard"
      subtitle={`Welcome back, ${coachName}`}
      actions={
        <Button>
          <Plus className="mr-2" />
          Add Client
        </Button>
      }
    />

    {/* Stats Grid */}
    <DashboardStatsGrid />

    {/* Two Column Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column (2/3) */}
      <div className="lg:col-span-2 space-y-6">
        <RecentActivityFeed />
        <ClientProgressOverview />
      </div>

      {/* Right Column (1/3) */}
      <div className="space-y-6">
        <UpcomingSessionsWidget />
        <QuickActionsPanel />
        <PendingReviewsWidget />
      </div>
    </div>
  </div>
</CoachDashboardLayout>
```

**Data Requirements**:
```typescript
interface DashboardData {
  stats: {
    activeClients: number;
    activeClientsChange: number;
    successRate: number;
    successRateChange: number;
    pendingReviews: number;
    sessionsThisWeek: number;
  };
  recentActivity: Activity[];
  upcomingSessions: Session[];
  clientProgress: ClientProgressSummary[];
}
```

**State Management**:
- Use React Query for data fetching
- Cache dashboard data for 5 minutes
- Refetch on window focus
- Optimistic updates for quick actions

**Interactions**:
- Click stat card → Navigate to detailed view
- Click activity item → Navigate to related screen
- Click session → Open session detail panel
- Quick actions → Open respective modals

**Loading States**:
- Skeleton screens for all sections
- Progressive loading: stats first, then widgets
- Error boundaries for each widget

---

### 3.2 Client List Page

**File**: `src/pages/coach/ClientList.tsx`

**Layout**:
```tsx
<CoachDashboardLayout>
  <div className="p-6">
    <PageHeader
      title="Clients"
      subtitle={`${totalClients} total clients`}
      actions={
        <>
          <ViewModeToggle /> {/* Table/Card/Kanban */}
          <Button variant="primary">
            <Plus /> Add Client
          </Button>
        </>
      }
    />

    {/* Filters and Search */}
    <div className="flex gap-4 mb-6">
      <SearchBar
        placeholder="Search clients..."
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <Select value={statusFilter}>
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
      </Select>
      <Select value={sortBy}>
        <option value="name">Name</option>
        <option value="lastActivity">Last Activity</option>
        <option value="progress">Progress</option>
      </Select>
      <Button variant="outline">
        <Filter /> More Filters
      </Button>
    </div>

    {/* Content */}
    {viewMode === 'table' && <ClientListTable />}
    {viewMode === 'card' && <ClientCardGrid />}
    {viewMode === 'kanban' && <ClientKanbanBoard />}

    {/* Pagination */}
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={setPage}
    />
  </div>
</CoachDashboardLayout>
```

**Data Requirements**:
```typescript
interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive' | 'pending' | 'placed';
  progress: number; // 0-100
  lastActivity: Date;
  nextSession: Date | null;
  stats: {
    applicationsSent: number;
    interviews: number;
    offers: number;
    documentsReviewed: number;
    sessionsCompleted: number;
  };
  tags: string[];
  assignedCoach: string;
  startDate: Date;
  targetCompanies: string[];
  targetRoles: string[];
}

interface ClientListQuery {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}
```

**Filtering Logic**:
- Real-time search across: name, email, company
- Debounced search (300ms)
- Multiple filters can be active
- URL query params sync for deep linking
- "Clear all filters" button

**Sorting Options**:
- Name (A-Z, Z-A)
- Last Activity (Newest, Oldest)
- Progress (High to Low, Low to High)
- Next Session (Soonest, Latest)
- Start Date (Newest, Oldest)

**Bulk Actions**:
- Select all/none
- Select by filter
- Actions:
  - Send message to selected
  - Schedule sessions with selected
  - Export selected to CSV
  - Add tag to selected
  - Change status of selected

---

### 3.3 Client Detail Page

**File**: `src/pages/coach/ClientDetail.tsx`

**Layout**:
```tsx
<CoachDashboardLayout>
  <div className="space-y-0">
    {/* Sticky Header */}
    <ClientDetailHeader
      client={client}
      sticky={true}
    />

    {/* Tab Navigation */}
    <ClientTabNavigation
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />

    {/* Tab Content */}
    <div className="p-6">
      {activeTab === 'overview' && <ClientOverviewTab />}
      {activeTab === 'documents' && <ClientDocumentsTab />}
      {activeTab === 'progress' && <ClientProgressTab />}
      {activeTab === 'applications' && <ClientApplicationsTab />}
      {activeTab === 'notes' && <ClientNotesTab />}
      {activeTab === 'resources' && <ClientResourcesTab />}
    </div>
  </div>
</CoachDashboardLayout>
```

**Overview Tab Content**:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main Content */}
  <div className="lg:col-span-2 space-y-6">
    {/* Current Goals */}
    <Card>
      <CardHeader>
        <h3>Current Goals</h3>
        <Button variant="ghost">Add Goal</Button>
      </CardHeader>
      <CardContent>
        <GoalsList goals={client.goals} />
      </CardContent>
    </Card>

    {/* Recent Applications */}
    <Card>
      <CardHeader>
        <h3>Recent Applications</h3>
        <Button variant="ghost">View All</Button>
      </CardHeader>
      <CardContent>
        <ApplicationsList
          applications={client.recentApplications}
          limit={5}
        />
      </CardContent>
    </Card>

    {/* Session History */}
    <Card>
      <CardHeader>
        <h3>Session History</h3>
      </CardHeader>
      <CardContent>
        <SessionTimeline sessions={client.sessions} />
      </CardContent>
    </Card>
  </div>

  {/* Sidebar */}
  <div className="space-y-6">
    {/* Quick Actions */}
    <Card>
      <CardContent className="space-y-2">
        <Button fullWidth>
          <Calendar /> Schedule Session
        </Button>
        <Button fullWidth variant="outline">
          <MessageSquare /> Send Message
        </Button>
        <Button fullWidth variant="outline">
          <FileText /> Review Documents
        </Button>
      </CardContent>
    </Card>

    {/* Contact Info */}
    <Card>
      <CardHeader>
        <h3>Contact Information</h3>
      </CardHeader>
      <CardContent>
        <ContactInfo client={client} />
      </CardContent>
    </Card>

    {/* Tags */}
    <Card>
      <CardHeader>
        <h3>Tags</h3>
      </CardHeader>
      <CardContent>
        <TagManager
          tags={client.tags}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
        />
      </CardContent>
    </Card>
  </div>
</div>
```

**Documents Tab**:
- Grid of document cards
- Filter by type (Resume, Cover Letter, Portfolio, Other)
- Sort by date, status
- Quick preview on hover
- Batch actions: Download, Send to client, Delete

**Progress Tab**:
- Detailed ClientProgressTracker component
- Timeline of milestones
- Skills assessment charts
- Application metrics
- Document improvement tracking

**Applications Tab**:
- Table of all job applications
- Columns: Company, Role, Date Applied, Status, Next Step
- Filter by status
- Add new application
- Link to job posting

**Notes Tab**:
- Chronological list of coach notes
- Session notes automatically added
- Add quick note
- Rich text editor for longer notes
- Search notes
- Tag notes by topic

**Resources Tab**:
- List of resources shared with client
- Share new resource button
- Track if client opened/downloaded
- Client feedback on usefulness

---

### 3.4 Document Review Page

**File**: `src/pages/coach/DocumentReview.tsx`

**Layout**:
```tsx
<div className="flex h-screen">
  {/* Document List Sidebar */}
  <DocumentReviewSidebar
    documents={pendingDocuments}
    activeDocument={activeDocId}
    onSelectDocument={setActiveDocId}
    width={280}
    collapsible={true}
  />

  {/* Main Viewer */}
  <div className="flex-1 flex flex-col">
    {/* Toolbar */}
    <div className="border-b p-4 flex justify-between">
      <div className="flex gap-2">
        <Button variant="ghost" size="sm">
          <ChevronLeft /> Previous
        </Button>
        <Button variant="ghost" size="sm">
          Next <ChevronRight />
        </Button>
        <Separator orientation="vertical" />
        <Button variant="ghost" size="sm">
          <ZoomOut />
        </Button>
        <span className="px-2 py-1">100%</span>
        <Button variant="ghost" size="sm">
          <ZoomIn />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline">
          <Download /> Download
        </Button>
        <Button variant="outline">
          <Copy /> Compare Versions
        </Button>
        <Button variant="primary">
          <Check /> Approve Document
        </Button>
      </div>
    </div>

    {/* Document Viewer */}
    <div className="flex-1 flex">
      <div className="flex-1 overflow-auto bg-gray-100 p-8">
        <DocumentViewerPanel
          documentUrl={activeDocument.url}
          zoom={zoomLevel}
        />
      </div>

      {/* Comments Sidebar */}
      <CommentPanel
        documentId={activeDocId}
        comments={comments}
        onAddComment={handleAddComment}
        width={360}
      />
    </div>
  </div>
</div>
```

**Comment Types**:
```typescript
interface Comment {
  id: string;
  documentId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  type: 'general' | 'inline' | 'suggestion';
  content: string;
  position?: { page: number; x: number; y: number }; // for inline
  status: 'open' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
  replies: Reply[];
}

interface Reply {
  id: string;
  commentId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}
```

**Review Workflow**:
1. Select document from sidebar
2. Read through document
3. Add inline comments by clicking on document
4. Add general feedback in comments panel
5. Optionally compare with previous version
6. Mark as reviewed or request changes
7. Notify client

**Keyboard Shortcuts**:
- `N` - Next document
- `P` - Previous document
- `C` - Add comment
- `+` - Zoom in
- `-` - Zoom out
- `F` - Fullscreen
- `Escape` - Close fullscreen
- `Cmd/Ctrl + Enter` - Submit comment

---

### 3.5 Analytics Page

**File**: `src/pages/coach/Analytics.tsx`

**Layout**:
```tsx
<CoachDashboardLayout>
  <div className="p-6">
    <PageHeader
      title="Analytics & Reports"
      actions={
        <>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Button variant="outline">
            <Download /> Export Report
          </Button>
          <Button variant="primary">
            <Plus /> Custom Report
          </Button>
        </>
      }
    />

    {/* Overview Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        title="Total Clients"
        value={analytics.totalClients}
        change={analytics.clientsChange}
        icon={Users}
        color="blue"
      />
      <StatCard
        title="Placement Rate"
        value={`${analytics.placementRate}%`}
        change={analytics.placementRateChange}
        icon={TrendingUp}
        color="green"
      />
      <StatCard
        title="Avg. Time to Placement"
        value={`${analytics.avgTimeToPlacement} days`}
        change={analytics.timeChange}
        icon={Clock}
        color="purple"
      />
      <StatCard
        title="Client Satisfaction"
        value={analytics.satisfaction}
        change={analytics.satisfactionChange}
        icon={Star}
        color="yellow"
      />
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Client Growth Over Time */}
      <Card>
        <CardHeader>
          <h3>Client Growth</h3>
          <Select value={growthMetric}>
            <option value="new">New Clients</option>
            <option value="active">Active Clients</option>
            <option value="placed">Placed Clients</option>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clientGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="clients"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Success Pipeline */}
      <Card>
        <CardHeader>
          <h3>Success Pipeline</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <FunnelChart data={pipelineData}>
              {/* Funnel implementation */}
            </FunnelChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    {/* More Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Time Distribution */}
      <Card>
        <CardHeader>
          <h3>Time Distribution</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={timeDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {timeDistribution.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Document Review Turnaround */}
      <Card>
        <CardHeader>
          <h3>Review Turnaround</h3>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reviewTurnaround}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="docType" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgDays" fill="#10B981" />
              <ReferenceLine y={2} stroke="red" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Session Completion Rate */}
      <Card>
        <CardHeader>
          <h3>Session Completion</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProgressBar
              label="Scheduled"
              value={95}
              color="blue"
            />
            <ProgressBar
              label="Completed"
              value={88}
              color="green"
            />
            <ProgressBar
              label="Cancelled"
              value={7}
              color="red"
            />
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Detailed Tables */}
    <div className="mt-6">
      <Tabs defaultValue="clients">
        <TabsList>
          <TabsTrigger value="clients">Client Performance</TabsTrigger>
          <TabsTrigger value="documents">Document Stats</TabsTrigger>
          <TabsTrigger value="sessions">Session Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="clients">
          <ClientPerformanceTable data={clientPerformance} />
        </TabsContent>
        <TabsContent value="documents">
          <DocumentStatsTable data={documentStats} />
        </TabsContent>
        <TabsContent value="sessions">
          <SessionStatsTable data={sessionStats} />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</CoachDashboardLayout>
```

**Chart Data Structures**:
```typescript
interface ClientGrowthData {
  month: string;
  newClients: number;
  activeClients: number;
  placedClients: number;
}

interface PipelineData {
  stage: string;
  count: number;
  conversion: number;
}

interface TimeDistribution {
  name: string;
  value: number;
  color: string;
}

interface ReviewTurnaround {
  docType: string;
  avgDays: number;
  target: number;
}
```

---

## 4. User Flows

### 4.1 Coach Onboarding Flow

**Steps**:
1. **Account Creation**
   - Sign up form
   - Email verification
   - Password setup
   - Terms acceptance

2. **Profile Setup**
   - Upload photo
   - Add bio and expertise
   - Set specializations
   - Add certifications
   - Link LinkedIn/website

3. **Availability Configuration**
   - Set working hours
   - Define time zone
   - Set session duration preferences
   - Configure booking buffer times

4. **Workspace Setup**
   - Choose notification preferences
   - Connect calendar (Google/Outlook)
   - Set up email signature
   - Import existing clients (optional)

5. **Tutorial/Walkthrough**
   - Dashboard tour
   - Client management basics
   - Document review tutorial
   - Scheduling demo
   - Analytics overview

6. **First Actions**
   - Invite first client
   - Upload first resource
   - Schedule first session
   - Send first message

**Flow Diagram**:
```
Start → Account → Profile → Availability → Workspace → Tutorial → Dashboard
  ↓        ↓         ↓           ↓            ↓          ↓         ↓
[Form]  [Upload]  [Calendar] [Settings]   [Connect]  [Tour]   [Complete]
```

**Success Criteria**:
- Profile 100% complete
- At least 1 availability slot set
- Tutorial completed
- First client added or invited

---

### 4.2 Client Management Workflow

**Adding New Client**:
1. Click "Add Client" button
2. Choose: Manual entry OR Send invite
3. If Manual:
   - Fill client details form
   - Set initial goals
   - Upload existing documents (optional)
   - Assign tags
   - Schedule initial session
4. If Invite:
   - Enter client email
   - Customize invite message
   - Send invite
   - Client fills profile on their side

**Updating Client Status**:
1. Navigate to client detail
2. Click status badge
3. Select new status from dropdown
4. Optionally add note about status change
5. Save (auto-notifies client)

**Archiving/Removing Client**:
1. Navigate to client detail
2. Click "More Actions" (...)
3. Select "Archive Client" or "Remove Client"
4. Confirm with reason
5. Client moved to archived list

**Bulk Operations**:
1. Client list view
2. Select multiple clients (checkboxes)
3. Click "Bulk Actions" button
4. Choose action (e.g., "Send Message")
5. Complete action form
6. Confirm and execute

---

### 4.3 Document Review Process

**Flow**:
1. **Notification**: Client submits document
2. **Review**: Coach receives notification
3. **Access**: Click notification → Document Review page
4. **Read**: Review document content
5. **Comment**: Add inline and general comments
6. **Suggest**: Make specific improvement suggestions
7. **Compare**: (Optional) Compare with previous version
8. **Decide**: Approve OR Request Changes
9. **Notify**: Client receives review and comments
10. **Follow-up**: If changes requested, repeat when resubmitted

**Decision Points**:
- Approve: Document meets standards → Mark approved → Notify client
- Request Changes: Issues found → Add comments → Set status to "Changes Requested"
- Defer: Need more time → Save progress → Return later

**Workflow States**:
```
Submitted → In Review → [Approved] OR [Changes Requested]
                              ↓              ↓
                        [Completed]    [Resubmitted] → In Review
```

---

### 4.4 Communication Patterns

**Proactive Coach Outreach**:
1. **Weekly Check-in**:
   - Every Monday
   - Send personalized message
   - Ask about progress
   - Offer assistance

2. **Milestone Celebrations**:
   - Detect milestone completion
   - Send congratulatory message
   - Suggest next steps

3. **Gentle Nudges**:
   - No activity for 7 days
   - Send encouraging message
   - Offer to schedule session

**Reactive Communication**:
1. **Client Messages**:
   - Notification received
   - Read message
   - Respond within 24 hours
   - Mark as resolved if needed

2. **Document Submissions**:
   - Auto-acknowledgment sent
   - Manual review within 48 hours
   - Detailed feedback provided

3. **Session Requests**:
   - Review request
   - Check availability
   - Confirm or suggest alternatives
   - Send calendar invite

**Communication Templates**:
- Session reminder (1 day before)
- Session follow-up (same day)
- Document received confirmation
- Review completed notification
- Weekly progress summary
- Monthly report

---

### 4.5 Session Management Flow

**Scheduling Session**:
1. Coach or client initiates
2. If coach: Click "Schedule Session"
3. Select client (if from dashboard)
4. Choose date and time
5. Select session type and duration
6. Add agenda items
7. Send invite
8. Both parties receive confirmation

**Preparing for Session**:
1. 1 day before: Review client's recent activity
2. Check documents submitted
3. Review previous session notes
4. Prepare agenda
5. Gather relevant resources
6. Send agenda to client

**During Session**:
1. Join meeting (virtual) or arrive (in-person)
2. Follow agenda
3. Take notes in real-time (optional)
4. Mark action items

**After Session**:
1. Add session notes
2. List action items for client
3. Upload any shared resources
4. Mark session as complete
5. Schedule follow-up if needed
6. Send summary to client

**Rescheduling**:
1. Navigate to session detail
2. Click "Reschedule"
3. Choose new date/time
4. Add reason (optional)
5. Send updated invite
6. Both parties notified

---

## 5. Data Requirements

### 5.1 Core Data Models

#### Coach Profile
```typescript
interface CoachProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  specializations: string[];
  certifications: Certification[];
  experience: number; // years
  rating: number; // 0-5
  reviewCount: number;
  linkedIn: string;
  website: string;
  availability: Availability;
  settings: CoachSettings;
  createdAt: Date;
  updatedAt: Date;
}

interface Certification {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
}

interface Availability {
  timezone: string;
  schedule: WeeklySchedule;
  bufferBetweenSessions: number; // minutes
  maxSessionsPerDay: number;
  blockedDates: Date[];
}

interface WeeklySchedule {
  [day: string]: TimeSlot[];
}

interface TimeSlot {
  start: string; // "09:00"
  end: string; // "17:00"
}

interface CoachSettings {
  notifications: NotificationSettings;
  calendar: CalendarSettings;
  emailSignature: string;
}
```

#### Client
```typescript
interface Client {
  id: string;
  coachId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  status: 'active' | 'inactive' | 'pending' | 'placed' | 'on-hold';
  startDate: Date;
  lastActivityDate: Date;
  
  // Background
  currentTitle?: string;
  currentCompany?: string;
  yearsExperience: number;
  education: Education[];
  skills: Skill[];
  
  // Career Goals
  targetRoles: string[];
  targetCompanies: string[];
  targetSalary: SalaryRange;
  targetLocations: string[];
  jobSearchStatus: 'not-started' | 'actively-searching' | 'passively-looking' | 'interviewing' | 'offer-stage';
  
  // Progress
  progress: number; // 0-100
  goals: Goal[];
  milestones: Milestone[];
  
  // Stats
  stats: ClientStats;
  
  // Metadata
  tags: string[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
}

interface Education {
  school: string;
  degree: string;
  field: string;
  graduationYear: number;
}

interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  endorsements: number;
}

interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'short-term' | 'medium-term' | 'long-term';
  targetDate: Date;
  status: 'not-started' | 'in-progress' | 'completed' | 'abandoned';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: 'goal-completed' | 'interview' | 'offer' | 'placement' | 'other';
}

interface ClientStats {
  totalDocuments: number;
  documentsReviewed: number;
  applicationsSent: number;
  responsesReceived: number;
  interviewsScheduled: number;
  interviewsCompleted: number;
  offersReceived: number;
  sessionsAttended: number;
  sessionsCancelled: number;
  averageResponseRate: number;
}
```

#### Document
```typescript
interface Document {
  id: string;
  clientId: string;
  coachId: string;
  title: string;
  type: 'resume' | 'cover-letter' | 'portfolio' | 'other';
  status: 'draft' | 'submitted' | 'in-review' | 'changes-requested' | 'approved';
  fileUrl: string;
  fileType: string;
  fileSize: number;
  version: number;
  previousVersionId?: string;
  
  // Review
  reviewedAt?: Date;
  reviewedBy?: string;
  comments: DocumentComment[];
  overallFeedback?: string;
  improvementScore?: number; // 0-100
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
}

interface DocumentComment {
  id: string;
  documentId: string;
  authorId: string;
  authorName: string;
  authorRole: 'coach' | 'client';
  type: 'general' | 'inline' | 'suggestion';
  content: string;
  position?: {
    page: number;
    x: number;
    y: number;
    highlightedText?: string;
  };
  status: 'open' | 'resolved';
  replies: CommentReply[];
  createdAt: Date;
  updatedAt: Date;
}

interface CommentReply {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
}
```

#### Session
```typescript
interface Session {
  id: string;
  coachId: string;
  clientId: string;
  type: 'initial' | 'follow-up' | 'document-review' | 'strategy' | 'interview-prep' | 'other';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  
  // Schedule
  scheduledDate: Date;
  duration: number; // minutes
  timezone: string;
  
  // Location
  location: {
    type: 'virtual' | 'in-person';
    meetingLink?: string;
    address?: string;
  };
  
  // Agenda
  agenda: AgendaItem[];
  preparationNotes?: string;
  
  // Outcome
  sessionNotes?: string;
  actionItems: ActionItem[];
  clientSatisfaction?: number; // 1-5
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  duration?: number; // minutes
  completed: boolean;
}

interface ActionItem {
  id: string;
  title: string;
  description?: string;
  assignedTo: 'coach' | 'client';
  dueDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
  completedAt?: Date;
}
```

#### Message
```typescript
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'coach' | 'client';
  recipientId: string;
  content: string;
  attachments: Attachment[];
  status: 'sent' | 'delivered' | 'read';
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Conversation {
  id: string;
  coachId: string;
  clientId: string;
  lastMessageAt: Date;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}
```

#### Resource
```typescript
interface Resource {
  id: string;
  coachId: string;
  title: string;
  description: string;
  type: 'template' | 'guide' | 'checklist' | 'video' | 'article' | 'tool' | 'other';
  category: string;
  tags: string[];
  fileUrl: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
  
  // Access
  visibility: 'private' | 'all-clients' | 'specific-clients';
  sharedWith: string[]; // client IDs
  allowDownload: boolean;
  
  // Usage
  viewCount: number;
  downloadCount: number;
  shareCount: number;
  rating: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

interface ResourceShare {
  id: string;
  resourceId: string;
  coachId: string;
  clientId: string;
  sharedAt: Date;
  viewedAt?: Date;
  downloadedAt?: Date;
  clientFeedback?: string;
  clientRating?: number;
}
```

#### Note
```typescript
interface Note {
  id: string;
  coachId: string;
  clientId: string;
  sessionId?: string; // if related to session
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Activity
```typescript
interface Activity {
  id: string;
  type: 'document-submitted' | 'application-sent' | 'interview-scheduled' | 'session-completed' | 'goal-completed' | 'message-received' | 'milestone-reached';
  clientId: string;
  clientName: string;
  clientAvatar: string;
  title: string;
  description: string;
  metadata: Record<string, any>;
  timestamp: Date;
}
```

---

### 5.2 API Endpoints

#### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/reset-password
```

#### Coach
```
GET    /api/coach/profile
PUT    /api/coach/profile
PATCH  /api/coach/availability
GET    /api/coach/settings
PUT    /api/coach/settings
GET    /api/coach/stats
```

#### Clients
```
GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PUT    /api/clients/:id
DELETE /api/clients/:id
PATCH  /api/clients/:id/status
GET    /api/clients/:id/stats
GET    /api/clients/:id/activity
POST   /api/clients/:id/notes
GET    /api/clients/:id/goals
POST   /api/clients/:id/goals
PUT    /api/clients/:id/goals/:goalId
DELETE /api/clients/:id/goals/:goalId
```

#### Documents
```
GET    /api/documents
POST   /api/documents
GET    /api/documents/:id
PUT    /api/documents/:id
DELETE /api/documents/:id
GET    /api/documents/:id/comments
POST   /api/documents/:id/comments
PUT    /api/documents/:id/comments/:commentId
DELETE /api/documents/:id/comments/:commentId
POST   /api/documents/:id/comments/:commentId/replies
PATCH  /api/documents/:id/status
GET    /api/documents/:id/versions
GET    /api/documents/:id/compare/:versionId
```

#### Sessions
```
GET    /api/sessions
POST   /api/sessions
GET    /api/sessions/:id
PUT    /api/sessions/:id
DELETE /api/sessions/:id
PATCH  /api/sessions/:id/status
POST   /api/sessions/:id/notes
GET    /api/sessions/upcoming
GET    /api/sessions/past
```

#### Messages
```
GET    /api/conversations
GET    /api/conversations/:id
POST   /api/conversations/:id/messages
GET    /api/messages/:id
PUT    /api/messages/:id
DELETE /api/messages/:id
PATCH  /api/messages/:id/read
```

#### Resources
```
GET    /api/resources
POST   /api/resources
GET    /api/resources/:id
PUT    /api/resources/:id
DELETE /api/resources/:id
POST   /api/resources/:id/share
GET    /api/resources/shared
GET    /api/resources/categories
GET    /api/resources/tags
```

#### Analytics
```
GET    /api/analytics/dashboard
GET    /api/analytics/clients
GET    /api/analytics/documents
GET    /api/analytics/sessions
GET    /api/analytics/performance
POST   /api/analytics/export
```

#### Activity Feed
```
GET    /api/activity/recent
GET    /api/activity/client/:clientId
```

---

### 5.3 State Management Strategy

**Global State (React Context)**:
- Auth state (user, token, role)
- Coach profile
- UI preferences (theme, sidebar collapsed)
- Notifications

**Server State (React Query)**:
- Clients list
- Client details
- Documents
- Sessions
- Messages
- Resources
- Analytics

**Local State (useState)**:
- Form inputs
- Modal open/close
- Filter selections
- Sort preferences
- UI toggles

**URL State (React Router)**:
- Current page
- Active tab
- Search query
- Filter parameters
- Pagination

**Example React Query Setup**:
```typescript
// hooks/useClients.ts
export function useClients(filters?: ClientFilters) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: () => fetchClients(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useClient(clientId: string) {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: () => fetchClient(clientId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateClientData) => updateClient(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clients']);
      queryClient.invalidateQueries(['client', data.id]);
    },
  });
}
```

---

## 6. File Structure

```
src/
├── pages/
│   └── coach/
│       ├── CoachDashboard.tsx          # Main dashboard
│       ├── ClientList.tsx              # Client list with views
│       ├── ClientDetail.tsx            # Client detail page
│       ├── DocumentReview.tsx          # Document review interface
│       ├── Analytics.tsx               # Analytics dashboard
│       ├── ResourceLibrary.tsx         # Resource management
│       ├── Messages.tsx                # Communication hub
│       ├── Calendar.tsx                # Calendar view
│       └── CoachProfile.tsx            # Coach profile settings
│
├── components/
│   ├── coach/
│   │   ├── dashboard/
│   │   │   ├── DashboardStatsGrid.tsx
│   │   │   ├── RecentActivityFeed.tsx
│   │   │   ├── UpcomingSessionsWidget.tsx
│   │   │   ├── QuickActionsPanel.tsx
│   │   │   └── PendingReviewsWidget.tsx
│   │   │
│   │   ├── clients/
│   │   │   ├── ClientListTable.tsx
│   │   │   ├── ClientCard.tsx
│   │   │   ├── ClientCardGrid.tsx
│   │   │   ├── ClientKanbanBoard.tsx
│   │   │   ├── ClientDetailHeader.tsx
│   │   │   ├── ClientTabNavigation.tsx
│   │   │   ├── ClientProgressTracker.tsx
│   │   │   ├── ClientOverviewTab.tsx
│   │   │   ├── ClientDocumentsTab.tsx
│   │   │   ├── ClientProgressTab.tsx
│   │   │   ├── ClientApplicationsTab.tsx
│   │   │   ├── ClientNotesTab.tsx
│   │   │   ├── ClientResourcesTab.tsx
│   │   │   ├── AddClientModal.tsx
│   │   │   └── ClientFilters.tsx
│   │   │
│   │   ├── documents/
│   │   │   ├── DocumentReviewSidebar.tsx
│   │   │   ├── DocumentViewerPanel.tsx
│   │   │   ├── CommentPanel.tsx
│   │   │   ├── DocumentComment.tsx
│   │   │   ├── DocumentComparisonView.tsx
│   │   │   ├── DocumentToolbar.tsx
│   │   │   └── AddCommentForm.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── CoachPerformanceCard.tsx
│   │   │   ├── ClientSuccessMetrics.tsx
│   │   │   ├── TimeDistributionChart.tsx
│   │   │   ├── ProgressLineChart.tsx
│   │   │   ├── SuccessFunnelChart.tsx
│   │   │   ├── ReviewTurnaroundChart.tsx
│   │   │   ├── CustomReportBuilder.tsx
│   │   │   ├── ClientComparisonTool.tsx
│   │   │   └── ExportReportModal.tsx
│   │   │
│   │   ├── resources/
│   │   │   ├── ResourceLibraryGrid.tsx
│   │   │   ├── ResourceCard.tsx
│   │   │   ├── ResourceDetailView.tsx
│   │   │   ├── ResourceUploadWizard.tsx
│   │   │   ├── ResourceFilters.tsx
│   │   │   ├── ResourcePreviewModal.tsx
│   │   │   └── ShareResourceModal.tsx
│   │   │
│   │   ├── messages/
│   │   │   ├── MessageList.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   ├── MessageThread.tsx
│   │   │   ├── ComposerBox.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageTemplates.tsx
│   │   │   └── AttachmentPreview.tsx
│   │   │
│   │   ├── calendar/
│   │   │   ├── CalendarView.tsx
│   │   │   ├── MonthView.tsx
│   │   │   ├── WeekView.tsx
│   │   │   ├── DayView.tsx
│   │   │   ├── AgendaView.tsx
│   │   │   ├── SessionScheduler.tsx
│   │   │   ├── SessionDetailPanel.tsx
│   │   │   ├── AvailabilitySettings.tsx
│   │   │   └── SessionCard.tsx
│   │   │
│   │   └── shared/
│   │       ├── CoachDashboardLayout.tsx
│   │       ├── CoachSidebar.tsx
│   │       ├── CoachHeader.tsx
│   │       ├── NotificationCenter.tsx
│   │       ├── GoalsList.tsx
│   │       ├── ApplicationsList.tsx
│   │       ├── SessionTimeline.tsx
│   │       ├── ContactInfo.tsx
│   │       └── TagManager.tsx
│   │
│   └── ui/                             # Shared UI components (Radix)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── toast.tsx
│       ├── tooltip.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── progress.tsx
│       ├── separator.tsx
│       ├── calendar.tsx
│       └── ... (other Radix components)
│
├── hooks/
│   ├── coach/
│   │   ├── useCoachProfile.ts
│   │   ├── useClients.ts
│   │   ├── useClientDetail.ts
│   │   ├── useDocuments.ts
│   │   ├── useSessions.ts
│   │   ├── useMessages.ts
│   │   ├── useResources.ts
│   │   ├── useAnalytics.ts
│   │   └── useActivity.ts
│   │
│   └── shared/
│       ├── useAuth.ts
│       ├── useDebounce.ts
│       ├── useInfiniteScroll.ts
│       ├── useLocalStorage.ts
│       └── useMediaQuery.ts
│
├── lib/
│   ├── api/
│   │   ├── coach.ts
│   │   ├── clients.ts
│   │   ├── documents.ts
│   │   ├── sessions.ts
│   │   ├── messages.ts
│   │   ├── resources.ts
│   │   └── analytics.ts
│   │
│   ├── utils/
│   │   ├── date.ts
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── helpers.ts
│   │
│   └── constants/
│       ├── routes.ts
│       ├── statuses.ts
│       └── colors.ts
│
├── types/
│   ├── coach.ts
│   ├── client.ts
│   ├── document.ts
│   ├── session.ts
│   ├── message.ts
│   ├── resource.ts
│   └── analytics.ts
│
└── styles/
    ├── globals.css
    └── coach.css
```

---

## 7. Responsive Design Strategy

### 7.1 Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large desktop */
```

### 7.2 Layout Adaptations

**Mobile (< 768px)**:
- Sidebar → Drawer (slide-in menu)
- Multi-column grids → Single column
- Table view → Card view
- Horizontal tabs → Dropdown menu
- Side panels → Full-screen modals
- Reduced padding and spacing
- Larger touch targets (min 44x44px)

**Tablet (768px - 1023px)**:
- Collapsible sidebar (narrow icons only)
- 2-column grids
- Table view with horizontal scroll
- Tabs remain visible but scrollable
- Side panels remain but narrower

**Desktop (1024px+)**:
- Full sidebar always visible
- 3-4 column grids
- Full table view
- All features visible
- Side-by-side panels
- Hover interactions

### 7.3 Component Responsive Patterns

**DashboardStatsGrid**:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Stats cards */}
</div>
```

**ClientListTable**:
```tsx
{/* Desktop: Table */}
<div className="hidden md:block">
  <Table>...</Table>
</div>

{/* Mobile: Cards */}
<div className="md:hidden space-y-4">
  {clients.map(client => (
    <ClientCard key={client.id} client={client} />
  ))}
</div>
```

**DocumentReviewSidebar**:
```tsx
{/* Desktop: Fixed sidebar */}
<aside className="hidden lg:block w-80 border-r">
  {/* Sidebar content */}
</aside>

{/* Mobile: Sheet/Drawer */}
<Sheet>
  <SheetTrigger>
    <Button>Documents</Button>
  </SheetTrigger>
  <SheetContent side="left">
    {/* Same sidebar content */}
  </SheetContent>
</Sheet>
```

---

## 8. Accessibility Considerations

### 8.1 Keyboard Navigation

**Essential Shortcuts**:
- `Tab` / `Shift+Tab` - Navigate between interactive elements
- `Enter` / `Space` - Activate buttons and links
- `Escape` - Close modals and dropdowns
- `Arrow keys` - Navigate within lists and menus
- `/` or `Cmd+K` - Focus search bar
- `?` - Show keyboard shortcuts help

**Custom Shortcuts**:
- `C` - Add new client
- `S` - Schedule session
- `M` - Open messages
- `N` - Create new note
- `R` - Review next document

### 8.2 Screen Reader Support

**ARIA Labels**:
```tsx
<button
  aria-label="Add new client"
  aria-describedby="add-client-tooltip"
>
  <Plus />
</button>

<div role="status" aria-live="polite">
  {successMessage}
</div>

<table aria-label="Client list">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
</table>
```

**Focus Management**:
- Trap focus in modals
- Return focus after modal close
- Skip navigation link
- Focus on first error in forms
- Visible focus indicators

**Semantic HTML**:
- Use proper heading hierarchy (h1, h2, h3)
- Use `<nav>`, `<main>`, `<aside>`, `<section>`
- Use `<button>` for actions, `<a>` for navigation
- Use `<label>` for form inputs

### 8.3 Color Contrast

**Minimum Ratios (WCAG AA)**:
- Normal text: 4.5:1
- Large text (18px+): 3:1
- UI components: 3:1

**Status Colors**:
- Success: Green with sufficient contrast
- Warning: Orange/yellow with dark text
- Error: Red with high contrast
- Info: Blue with readable text

**Dark Mode**:
- Provide dark mode toggle
- Maintain contrast ratios in both modes
- Test all colors in both themes

### 8.4 Form Accessibility

**Labels and Instructions**:
```tsx
<div>
  <Label htmlFor="client-name">
    Client Name
    <span aria-label="required">*</span>
  </Label>
  <Input
    id="client-name"
    name="clientName"
    required
    aria-required="true"
    aria-invalid={errors.clientName ? "true" : "false"}
    aria-describedby={errors.clientName ? "name-error" : undefined}
  />
  {errors.clientName && (
    <p id="name-error" role="alert" className="text-red-600">
      {errors.clientName.message}
    </p>
  )}
</div>
```

**Error Handling**:
- Show errors inline and in summary
- Use `role="alert"` for error messages
- Focus first error field on submit
- Provide clear error descriptions

---

## Implementation Priority

### Phase 1 (MVP) - P0
1. CoachDashboard overview page
2. ClientList (table view only)
3. ClientDetail (overview tab only)
4. Basic document review
5. Simple messaging
6. Session scheduling

### Phase 2 - P1
1. Analytics dashboard
2. ClientList (card and kanban views)
3. Full document review with comments
4. Resource library
5. Calendar views
6. Full client detail tabs

### Phase 3 - P2
1. Advanced analytics and reports
2. Custom report builder
3. Message templates
4. Bulk client operations
5. Advanced calendar features
6. Coach profile customization

---

## Notes for Developers

### Design System
- Use Tailwind utility classes
- Follow Radix UI patterns for consistency
- Use Lucide icons throughout
- Maintain consistent spacing (4, 8, 16, 24, 32px)

### Performance
- Lazy load pages and heavy components
- Implement virtual scrolling for long lists
- Optimize images and assets
- Use React Query for efficient data fetching
- Memoize expensive computations

### Testing
- Write unit tests for utilities and hooks
- Integration tests for user flows
- Accessibility tests with axe-core
- Visual regression testing
- Mobile device testing

### Documentation
- Document all components with JSDoc
- Maintain Storybook for UI components
- Keep API documentation updated
- Write user guides for complex features

---

**End of UI Plan Document**
