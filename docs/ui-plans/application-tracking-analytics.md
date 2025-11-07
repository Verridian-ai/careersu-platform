# Application Tracking & Analytics UI Plan

## Document Information
- **Feature**: Application Tracking and Analytics
- **Version**: 1.0
- **Last Updated**: 2025-11-07
- **Status**: Planning Phase

---

## Table of Contents
1. [Screen Inventory](#1-screen-inventory)
2. [Component Breakdown](#2-component-breakdown)
3. [Detailed Specifications](#3-detailed-specifications)
4. [User Flows](#4-user-flows)
5. [Data Requirements](#5-data-requirements)
6. [File Structure](#6-file-structure)

---

## 1. Screen Inventory

### 1.1 Applications Dashboard
**Route**: `/applications`
**Purpose**: Main hub for viewing and managing job applications

**Key Features**:
- Quick stats overview (Total applications, Active, Offers, Success rate)
- View toggle (List/Board/Calendar)
- Search and filter capabilities
- Bulk actions
- Quick add application button

**Views**:
- **List View**: Tabular format with sortable columns
- **Board View**: Kanban-style pipeline visualization
- **Calendar View**: Timeline-based application tracking

---

### 1.2 Application Details Page
**Route**: `/applications/:id`
**Purpose**: Detailed view of a single job application

**Sections**:
- Application header (Company, role, status badge)
- Quick actions (Edit, Delete, Move stage, Add note)
- Timeline/Activity feed
- Application details panel
- Documents attached
- Notes and reminders
- Contact information
- Interview schedule

---

### 1.3 Analytics Dashboard
**Route**: `/analytics`
**Purpose**: Comprehensive career progress analytics

**Sections**:
- **Overview KPIs**: Total applications, response rate, interview rate, offer rate
- **Application Pipeline**: Visual funnel chart
- **Time-based Analytics**: Applications over time
- **Success Metrics**: Conversion rates by stage
- **Job Market Insights**: Top companies, industries, locations
- **Performance Trends**: Weekly/Monthly comparisons

---

### 1.4 Progress Reports
**Route**: `/analytics/reports`
**Purpose**: Generate and view detailed progress reports

**Features**:
- Date range selector
- Report type selector (Summary, Detailed, Custom)
- Export options (PDF, CSV, Excel)
- Scheduled reports
- Report templates
- Share report functionality

---

### 1.5 Insights Panel
**Component**: Sidebar/Modal across application screens
**Purpose**: AI-powered insights and recommendations

**Content**:
- Application optimization tips
- Best time to apply insights
- Success pattern analysis
- Industry benchmarking
- Next best actions
- Goal progress tracking

---

## 2. Component Breakdown

### 2.1 Application Components

#### ApplicationCard
**Location**: `src/components/applications/ApplicationCard.tsx`

**Props**:
```typescript
interface ApplicationCardProps {
  application: Application;
  view: 'compact' | 'detailed';
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  className?: string;
}
```

**Visual Design**:
- Card with company logo on left
- Job title and company name as header
- Status badge (color-coded)
- Key metadata (Applied date, Location, Salary)
- Action buttons on hover
- Priority indicator (optional)
- Quick status dropdown

**Responsive Behavior**:
- Desktop: Full card with all info
- Tablet: Condensed layout, stacked elements
- Mobile: Vertical stack, swipe actions

---

#### ApplicationTable
**Location**: `src/components/applications/ApplicationTable.tsx`

**Features**:
- Sortable columns (Company, Position, Status, Date, Location)
- Column visibility toggle
- Row selection (checkboxes)
- Inline editing
- Context menu (right-click actions)
- Pagination/Infinite scroll
- Bulk actions toolbar

**Columns**:
1. Selection checkbox
2. Company (with logo)
3. Position
4. Status (badge with dropdown)
5. Applied Date (sortable)
6. Last Updated
7. Location
8. Salary Range
9. Priority
10. Actions (overflow menu)

**Sorting & Filtering**:
- Sort by any column (asc/desc)
- Multi-column sorting
- Filter by status, date range, location, salary
- Saved filter presets

---

#### KanbanBoard
**Location**: `src/components/applications/KanbanBoard.tsx`

**Columns** (Application Pipeline):
1. **Wishlist** - Jobs to apply to
2. **Applied** - Application submitted
3. **Phone Screen** - Initial phone call scheduled
4. **Interview** - In interview process
5. **Offer** - Received offer
6. **Accepted** - Offer accepted
7. **Rejected** - Application rejected

**Features**:
- Drag-and-drop between columns
- Column collapse/expand
- Application count per column
- Quick add card in each column
- Column customization (rename, reorder, hide)
- WIP limits (optional)
- Swimlanes (group by priority/company)

**Visual Design**:
- Vertical columns with scrollable cards
- Color-coded status indicators
- Card compact view (company logo, title, key info)
- Empty state illustrations
- Loading skeletons

---

#### StatusPipeline
**Location**: `src/components/applications/StatusPipeline.tsx`

**Purpose**: Visual funnel/pipeline chart showing application flow

**Props**:
```typescript
interface StatusPipelineProps {
  data: {
    stage: string;
    count: number;
    percentage: number;
  }[];
  interactive?: boolean;
  onStageClick?: (stage: string) => void;
}
```

**Visual Design**:
- Horizontal funnel chart
- Width represents conversion rate
- Show count and percentage
- Click to filter applications by stage
- Animated transitions
- Gradient fills

---

#### ApplicationDetailsPanel
**Location**: `src/components/applications/ApplicationDetailsPanel.tsx`

**Sections**:

1. **Header Section**:
   - Company logo (large)
   - Job title (H1)
   - Company name (with link)
   - Location, Salary, Job type
   - Status badge with dropdown
   - Action buttons (Edit, Delete, Share)

2. **Quick Info Cards**:
   - Applied Date
   - Last Updated
   - Days Since Applied
   - Expected Response Time

3. **Tabs**:
   - **Overview**: Job description, requirements, responsibilities
   - **Activity**: Timeline of all interactions
   - **Documents**: Attached resumes, cover letters
   - **Contacts**: Recruiter info, hiring manager
   - **Notes**: Personal notes and reminders
   - **Interviews**: Scheduled interviews, feedback

4. **AI Insights Sidebar**:
   - Application score
   - Match percentage
   - Recommendations
   - Similar applications

---

#### TimelineActivityFeed
**Location**: `src/components/applications/TimelineActivityFeed.tsx`

**Events**:
- Application submitted
- Status changed
- Email received/sent
- Interview scheduled
- Note added
- Document uploaded
- Reminder triggered

**Visual Design**:
- Vertical timeline with connector lines
- Icon for each event type
- Timestamp (relative time)
- Event description
- Expandable for details
- User avatar for manual actions
- Color coding by event type

**Features**:
- Filter by event type
- Date range filter
- Search events
- Export timeline
- Activity grouping (by day)

---

### 2.2 Analytics Components

#### KPIWidget
**Location**: `src/components/analytics/KPIWidget.tsx`

**Props**:
```typescript
interface KPIWidgetProps {
  title: string;
  value: number | string;
  change?: {
    value: number;
    period: string;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: LucideIcon;
  format?: 'number' | 'percentage' | 'currency' | 'duration';
  trend?: number[];
  color?: 'blue' | 'green' | 'purple' | 'orange';
}
```

**Visual Design**:
- Card with colored accent
- Large value display
- Icon on top-right
- Change indicator (↑ 12% vs last month)
- Mini trend sparkline
- Loading state with skeleton

**KPI Examples**:
- Total Applications (number)
- Response Rate (percentage)
- Average Time to Response (duration)
- Success Rate (percentage)
- Interviews Scheduled (number)
- Offers Received (number)

---

#### ApplicationFunnelChart
**Location**: `src/components/analytics/ApplicationFunnelChart.tsx`

**Purpose**: Visualize conversion through application stages

**Data Structure**:
```typescript
interface FunnelData {
  stage: string;
  value: number;
  percentage: number;
  conversionRate: number;
}
```

**Visual Design**:
- Funnel shape (widest at top)
- Color gradient per stage
- Labels with count and percentage
- Hover tooltips with details
- Interactive (click to drill down)
- Responsive sizing

**Using**: Recharts (FunnelChart component)

---

#### ApplicationTrendChart
**Location**: `src/components/analytics/ApplicationTrendChart.tsx`

**Purpose**: Show applications over time with multiple metrics

**Chart Types**:
- Line chart (applications over time)
- Area chart (cumulative applications)
- Bar chart (applications per week/month)
- Combo chart (applications + responses)

**Props**:
```typescript
interface TrendChartProps {
  data: {
    date: string;
    applications: number;
    responses: number;
    interviews: number;
    offers: number;
  }[];
  metrics: ('applications' | 'responses' | 'interviews' | 'offers')[];
  period: 'week' | 'month' | 'quarter' | 'year';
  chartType: 'line' | 'area' | 'bar' | 'combo';
}
```

**Features**:
- Toggle metrics visibility
- Zoom and pan
- Date range selector
- Export chart as image
- Custom tooltips
- Legend with toggle

---

#### SuccessRateGauge
**Location**: `src/components/analytics/SuccessRateGauge.tsx`

**Purpose**: Visual gauge showing overall success rate

**Visual Design**:
- Circular gauge (0-100%)
- Color coding:
  - Red: 0-30%
  - Orange: 31-50%
  - Yellow: 51-70%
  - Green: 71-100%
- Center percentage display
- Animated fill
- Benchmark line (industry average)

**Using**: Recharts (RadialBarChart)

---

#### TopCompaniesChart
**Location**: `src/components/analytics/TopCompaniesChart.tsx`

**Purpose**: Show top companies/industries/locations

**Chart Type**: Horizontal bar chart

**Data**:
```typescript
interface TopItemData {
  name: string;
  count: number;
  percentage: number;
  successRate: number;
}
```

**Features**:
- Switch between Companies, Industries, Locations
- Color-coded bars
- Click to filter applications
- Show success rate per item
- Top 10 by default, expandable

---

#### HeatmapCalendar
**Location**: `src/components/analytics/HeatmapCalendar.tsx`

**Purpose**: Calendar heatmap showing application activity

**Visual Design**:
- GitHub-style contribution heatmap
- Each cell = 1 day
- Color intensity = activity level
- Tooltips with date and count
- Month labels
- Day of week labels
- Year view or rolling 12 months

**Interactions**:
- Click date to see applications
- Hover for details
- Scroll through time periods

---

### 2.3 Filter & Search Components

#### ApplicationFilters
**Location**: `src/components/applications/ApplicationFilters.tsx`

**Filter Types**:

1. **Status Filter**:
   - Multi-select checkboxes
   - All application statuses
   - "Select All" option

2. **Date Range Filter**:
   - Preset ranges (Last 7 days, Last 30 days, Last 3 months, All time)
   - Custom date picker (start/end date)
   - Relative dates (Yesterday, This week, This month)

3. **Location Filter**:
   - Autocomplete input
   - Multi-select
   - Remote/On-site/Hybrid toggle

4. **Salary Range Filter**:
   - Dual range slider
   - Manual input (min/max)
   - Currency selector

5. **Priority Filter**:
   - High, Medium, Low, None
   - Radio buttons or checkboxes

6. **Company/Industry Filter**:
   - Autocomplete multi-select
   - Recently used companies
   - Favorite companies

**UI Layout**:
- Collapsible sidebar (desktop)
- Bottom sheet (mobile)
- Filter chips showing active filters
- "Clear all" button
- Save filter preset
- Filter count badge

---

#### ApplicationSearch
**Location**: `src/components/applications/ApplicationSearch.tsx`

**Features**:
- Full-text search (job title, company, notes)
- Search suggestions/autocomplete
- Recent searches
- Search operators (AND, OR, NOT)
- Advanced search modal
- Search results highlighting
- Clear button

**Search Fields**:
- Job title
- Company name
- Location
- Notes
- Contact names
- Document content

---

### 2.4 Action Components

#### QuickAddApplication
**Location**: `src/components/applications/QuickAddApplication.tsx`

**Trigger**: FAB button, keyboard shortcut (Cmd/Ctrl + K)

**Form Fields**:
1. Company name (required, autocomplete)
2. Job title (required)
3. Job URL (optional)
4. Location (optional, autocomplete)
5. Salary range (optional)
6. Status (default: Wishlist)
7. Priority (optional)
8. Applied date (default: today)
9. Notes (optional)

**Design**:
- Modal dialog
- Smart form (auto-fill from URL)
- Quick actions (Save & Close, Save & Add Another)
- Validation with helpful errors
- Loading states

---

#### BulkActionsToolbar
**Location**: `src/components/applications/BulkActionsToolbar.tsx`

**Appears**: When one or more applications selected

**Actions**:
- Change status (batch update)
- Update priority
- Add tags
- Archive/Delete
- Export selected
- Move to folder

**Design**:
- Sticky toolbar at top
- Selection count display
- Action buttons with icons
- Deselect all button
- Confirmation dialogs for destructive actions

---

#### ExportDialog
**Location**: `src/components/applications/ExportDialog.tsx`

**Export Formats**:
- CSV (for spreadsheets)
- Excel (.xlsx)
- PDF (formatted report)
- JSON (for developers)

**Options**:
- Select fields to export
- Date range
- Filter by status
- Include/exclude archived
- Sort order

**Design**:
- Modal dialog
- Format selector with icons
- Preview of data
- Progress bar during export
- Download link when complete

---

### 2.5 Shared UI Components

#### DateRangePicker
**Location**: `src/components/ui/DateRangePicker.tsx`

**Using**: `react-day-picker` with Radix UI Popover

**Features**:
- Preset ranges (Today, Last 7 days, Last 30 days, This month, Last 3 months, Custom)
- Dual calendar for custom range
- Clear button
- Apply/Cancel buttons
- Keyboard navigation

---

#### StatusBadge
**Location**: `src/components/ui/StatusBadge.tsx`

**Props**:
```typescript
interface StatusBadgeProps {
  status: ApplicationStatus;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onStatusChange?: (newStatus: ApplicationStatus) => void;
}
```

**Status Colors**:
- Wishlist: Gray
- Applied: Blue
- Phone Screen: Cyan
- Interview: Purple
- Offer: Green
- Accepted: Emerald
- Rejected: Red

**Design**:
- Rounded badge
- Icon + text
- Dropdown on click (if interactive)
- Smooth color transitions

---

#### EmptyState
**Location**: `src/components/ui/EmptyState.tsx`

**Variants**:
1. **No Applications**: "Start tracking your first application"
2. **No Search Results**: "No applications match your filters"
3. **No Analytics Data**: "Apply to jobs to see your analytics"

**Design**:
- Centered layout
- Illustration/icon
- Heading and description
- Primary CTA button
- Secondary action (optional)

---

## 3. Detailed Specifications

### 3.1 Application Dashboard Specifications

#### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Applications" + Add Button + Search           │
├─────────────────────────────────────────────────────────┤
│ KPI Cards Row                                           │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐         │
│ │Total │ │Active│ │Inter │ │Offers│ │Success│         │
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘         │
├─────────────────────────────────────────────────────────┤
│ Toolbar: [View Toggle] [Sort] [Filter] [Export]        │
├───────────┬─────────────────────────────────────────────┤
│ Filters   │ Main Content Area                           │
│ Sidebar   │                                             │
│           │ ┌─────────────────────────────────────┐   │
│ Status    │ │ Application List/Board/Calendar     │   │
│ Date      │ │                                     │   │
│ Location  │ │                                     │   │
│ Salary    │ │                                     │   │
│ Priority  │ │                                     │   │
│           │ └─────────────────────────────────────┘   │
└───────────┴─────────────────────────────────────────────┘
```

#### Responsive Breakpoints
- **Desktop (≥1280px)**: Full layout with sidebar
- **Tablet (768-1279px)**: Collapsible sidebar, stacked KPIs
- **Mobile (<768px)**: Bottom sheet filters, vertical KPIs, simplified cards

---

### 3.2 Kanban Board Specifications

#### Column Configuration
```typescript
const DEFAULT_COLUMNS = [
  {
    id: 'wishlist',
    title: 'Wishlist',
    color: 'gray',
    order: 0,
    description: 'Jobs you want to apply to'
  },
  {
    id: 'applied',
    title: 'Applied',
    color: 'blue',
    order: 1,
    description: 'Application submitted'
  },
  {
    id: 'phone_screen',
    title: 'Phone Screen',
    color: 'cyan',
    order: 2,
    description: 'Initial screening call'
  },
  {
    id: 'interview',
    title: 'Interview',
    color: 'purple',
    order: 3,
    description: 'In interview process'
  },
  {
    id: 'offer',
    title: 'Offer',
    color: 'green',
    order: 4,
    description: 'Received offer'
  },
  {
    id: 'accepted',
    title: 'Accepted',
    color: 'emerald',
    order: 5,
    description: 'Offer accepted'
  },
  {
    id: 'rejected',
    title: 'Rejected',
    color: 'red',
    order: 6,
    description: 'Application declined'
  }
];
```

#### Drag-and-Drop Behavior
- **Library**: `@dnd-kit/core` or `react-beautiful-dnd`
- **Features**:
  - Smooth animations
  - Drop zone highlighting
  - Auto-scroll on edge
  - Keyboard accessibility
  - Optimistic updates
  - Undo/Redo capability

#### Card Design in Board View
```
┌────────────────────────────┐
│ ┌──┐ Company Name          │
│ │  │ Job Title             │
│ └──┘                       │
│ 📍 Location | 💰 $XX-XX   │
│ 📅 Applied 3 days ago      │
│ [Priority] [Tags]          │
│ ┌─────┐ ┌─────┐ ┌─────┐  │
│ │ 👁️  │ │ ✏️  │ │ ⋮   │  │
│ └─────┘ └─────┘ └─────┘  │
└────────────────────────────┘
```

---

### 3.3 Analytics Dashboard Specifications

#### Dashboard Layout
```
┌──────────────────────────────────────────────────────────┐
│ Header: "Analytics" + Date Range Selector + Export      │
├──────────────────────────────────────────────────────────┤
│ KPI Grid (4 columns)                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│ │ Total   │ │Response │ │Interview│ │ Success │       │
│ │ Apps    │ │  Rate   │ │  Rate   │ │  Rate   │       │
│ │ 156     │ │  68%    │ │  24%    │ │  12%    │       │
│ │ +12 ↑   │ │ +5% ↑   │ │ -2% ↓   │ │ +3% ↑   │       │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
├──────────────────────────────────────────────────────────┤
│ Charts Row 1 (2 columns)                                 │
│ ┌───────────────────────┐ ┌───────────────────────┐    │
│ │ Application Funnel    │ │ Applications Over     │    │
│ │                       │ │ Time                  │    │
│ │ [Funnel Chart]        │ │ [Line Chart]          │    │
│ │                       │ │                       │    │
│ └───────────────────────┘ └───────────────────────┘    │
├──────────────────────────────────────────────────────────┤
│ Charts Row 2 (2 columns)                                 │
│ ┌───────────────────────┐ ┌───────────────────────┐    │
│ │ Top Companies         │ │ Success Rate Gauge    │    │
│ │ [Bar Chart]           │ │ [Radial Chart]        │    │
│ │                       │ │                       │    │
│ └───────────────────────┘ └───────────────────────┘    │
├──────────────────────────────────────────────────────────┤
│ Charts Row 3 (Full width)                                │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Activity Heatmap                                   │  │
│ │ [Calendar Heatmap]                                 │  │
│ └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

#### Chart Specifications

**Application Funnel Chart**:
- Type: Funnel Chart (Recharts)
- Data: Count and percentage per stage
- Colors: Gradient from blue to green
- Interactive: Click to filter applications
- Tooltip: Stage name, count, conversion rate

**Applications Over Time**:
- Type: Line/Area Chart (Recharts)
- X-axis: Date (weekly/monthly buckets)
- Y-axis: Application count
- Multiple lines: Applications, Responses, Interviews, Offers
- Features: Zoom, pan, toggle metrics
- Colors: Distinct color per metric

**Top Companies/Industries**:
- Type: Horizontal Bar Chart (Recharts)
- Data: Top 10 by application count
- Bars colored by success rate
- Click to filter applications
- Tooltip: Count, success rate, avg response time

**Success Rate Gauge**:
- Type: Radial Bar Chart (Recharts)
- Range: 0-100%
- Color coding: Red < 30%, Orange 30-50%, Yellow 50-70%, Green > 70%
- Benchmark line: Industry average
- Animated fill

**Activity Heatmap**:
- Type: Calendar Heatmap (custom component)
- View: Last 12 months or year-to-date
- Color intensity: Application activity
- Tooltip: Date, count, applications list
- Click: Navigate to applications for that date

---

### 3.4 Application Details Page Specifications

#### Page Layout
```
┌──────────────────────────────────────────────────────┐
│ Breadcrumb: Applications > [Company] - [Role]       │
├──────────────────────────────────────────────────────┤
│ Header Section                                       │
│ ┌──────┐                                             │
│ │ Logo │ Company Name - Job Title                    │
│ └──────┘ 📍 Location | 💰 Salary | 🏢 Full-time     │
│          [Status Badge ▼] [Edit] [Delete] [⋮]       │
├──────────────────────────────────────────────────────┤
│ Quick Info Cards                                     │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│ │ Applied │ │ Updated │ │ Days    │ │Expected │   │
│ │ Jun 15  │ │ Jun 20  │ │ 5 days  │ │ 2 weeks │   │
│ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
├─────────────────────┬────────────────────────────────┤
│ Main Content        │ Sidebar                        │
│                     │                                │
│ [Tabs]              │ AI Insights                    │
│ • Overview          │ ┌────────────────────────┐    │
│ • Activity          │ │ Match Score: 87%       │    │
│ • Documents         │ │ Strong match for:      │    │
│ • Contacts          │ │ - React expertise      │    │
│ • Notes             │ │ - TypeScript skills    │    │
│ • Interviews        │ │                        │    │
│                     │ │ Recommendations:       │    │
│ [Tab Content]       │ │ - Follow up in 2 days  │    │
│                     │ │ - Prepare for tech     │    │
│                     │ │   interview            │    │
│                     │ └────────────────────────┘    │
│                     │                                │
│                     │ Related Applications           │
│                     │ ┌────────────────────────┐    │
│                     │ │ Similar role at...     │    │
│                     │ └────────────────────────┘    │
└─────────────────────┴────────────────────────────────┘
```

#### Tab Content Specifications

**Overview Tab**:
- Job description (formatted text)
- Requirements (bulleted list)
- Responsibilities (bulleted list)
- Company info (from database/API)
- Salary and benefits
- Application URL (link)

**Activity Tab**:
- Timeline component (TimelineActivityFeed)
- All events chronologically
- Filter by event type
- Add manual event button

**Documents Tab**:
- Attached resumes (list with preview)
- Cover letters
- Portfolios
- Upload new document button
- Download/View actions

**Contacts Tab**:
- Recruiter information (name, email, phone, LinkedIn)
- Hiring manager
- Referral contact
- Add contact button
- Contact history (emails, calls)

**Notes Tab**:
- Rich text editor for notes
- Sticky notes style
- Tags for organization
- Search notes
- Pin important notes

**Interviews Tab**:
- List of scheduled interviews
- Date, time, type (phone, video, onsite)
- Interviewer information
- Preparation notes
- Feedback after interview
- Add interview button

---

### 3.5 Status Workflow Specifications

#### Status Transitions
```
Wishlist
  ↓
Applied
  ↓
Phone Screen ←→ Interview (can go back and forth)
  ↓              ↓
  ↓            Offer
  ↓              ↓
  ↓           Accepted
  ↓
Rejected (can happen from any stage)
```

#### Automated Status Updates
- Email integration: Auto-detect rejection emails
- Calendar integration: Auto-create interview stage
- Manual override: Always allow manual status change

#### Status Change Dialog
- Dropdown or modal for status change
- Optional note field (Why this change?)
- Date/time of status change
- Notification preferences
- Undo option (5 seconds)

---

### 3.6 Data Visualization Approach

#### Chart Library
**Primary**: Recharts
- Reasons: React-native, TypeScript support, customizable, good docs
- Charts: Line, Area, Bar, Funnel, Radial, Scatter

#### Color Palette for Charts
```typescript
const chartColors = {
  primary: '#3B82F6',    // Blue
  secondary: '#10B981',  // Green
  tertiary: '#8B5CF6',   // Purple
  quaternary: '#F59E0B', // Orange
  danger: '#EF4444',     // Red
  neutral: '#6B7280',    // Gray
};

const statusColors = {
  wishlist: '#6B7280',
  applied: '#3B82F6',
  phoneScreen: '#06B6D4',
  interview: '#8B5CF6',
  offer: '#10B981',
  accepted: '#059669',
  rejected: '#EF4444',
};
```

#### Responsive Charts
- Desktop: Full-size with all features
- Tablet: Condensed labels, smaller legends
- Mobile: Simplified charts, vertical orientation
- All: Touch-friendly interactions

#### Accessibility
- ARIA labels for all charts
- Keyboard navigation
- Screen reader descriptions
- Color-blind friendly palettes
- High contrast mode support

---

## 4. User Flows

### 4.1 Adding a New Application

**Entry Points**:
1. "Add Application" button in header
2. Quick add FAB button
3. Keyboard shortcut (Cmd/Ctrl + K)
4. "Add to Wishlist" from job board

**Flow**:
```
1. User clicks "Add Application"
   ↓
2. Quick Add Modal opens
   ↓
3. User enters:
   - Company name (autocomplete suggests)
   - Job title
   - Job URL (optional - auto-fill if provided)
   - Location (optional)
   - Salary range (optional)
   - Status (default: Wishlist)
   - Priority (optional)
   - Applied date (default: today)
   ↓
4. User clicks "Save"
   ↓
5. Validation runs
   ↓
6a. If valid:
    - Application created
    - Success toast appears
    - Modal closes
    - Application appears in list
    - Option to "Undo" for 5 seconds
   ↓
6b. If invalid:
    - Error messages shown
    - Focus on first error field
    - User corrects and retries
```

**Smart Features**:
- URL parser: Extract company, title from job posting URL
- Company autocomplete: Suggest from existing + database
- Duplicate detection: Warn if similar application exists
- Template suggestions: Based on previous applications

---

### 4.2 Updating Application Status

**Trigger Methods**:
1. Drag-and-drop on Kanban board
2. Status dropdown in list view
3. Status badge click in details page
4. Bulk action on multiple applications

**Flow**:
```
1. User initiates status change
   ↓
2. Status dropdown/dialog appears
   ↓
3. User selects new status
   ↓
4. Optional: Add note about change
   ↓
5. User confirms
   ↓
6. Status updates with animation
   ↓
7. Timeline event added
   ↓
8. Success feedback (toast/animation)
   ↓
9. Analytics updated
   ↓
10. Undo option available (5 seconds)
```

**Smart Features**:
- Status suggestions: Based on application age
- Auto-follow-ups: Remind to follow up after X days
- Email triggers: Send thank you email after interview
- Calendar integration: Add interview to calendar

---

### 4.3 Viewing Application Details

**Entry Points**:
1. Click application card
2. Click row in table
3. Search result click
4. Notification link

**Flow**:
```
1. User clicks application
   ↓
2. Details page loads with skeleton
   ↓
3. Data fetched in parallel:
   - Application details
   - Activity timeline
   - Documents
   - Related applications
   ↓
4. Content renders progressively
   ↓
5. User can:
   - Read details
   - Switch tabs
   - Edit information
   - Change status
   - Add notes
   - Upload documents
   - Schedule interviews
   ↓
6. All changes auto-save
   ↓
7. "Last updated" timestamp shown
```

---

### 4.4 Analyzing Progress

**Flow**:
```
1. User navigates to Analytics
   ↓
2. Default view: Last 30 days
   ↓
3. KPIs load first (quick numbers)
   ↓
4. Charts load progressively
   ↓
5. User can:
   - Change date range
   - Toggle metrics
   - Click chart elements to filter
   - Export charts
   - Generate reports
   ↓
6. Insights panel shows:
   - Key trends
   - Recommendations
   - Benchmarks
   ↓
7. User can drill down:
   - Click funnel stage → see applications
   - Click company bar → see company apps
   - Click date → see daily applications
```

---

### 4.5 Generating Reports

**Flow**:
```
1. User clicks "Generate Report"
   ↓
2. Report dialog opens
   ↓
3. User selects:
   - Report type (Summary/Detailed/Custom)
   - Date range
   - Metrics to include
   - Format (PDF/CSV/Excel)
   ↓
4. Preview shows sample data
   ↓
5. User clicks "Generate"
   ↓
6. Progress bar shows generation status
   ↓
7. Report ready:
   - Download link
   - Email option
   - Share link
   ↓
8. Report saved to history
   ↓
9. Can schedule recurring reports
```

---

## 5. Data Requirements

### 5.1 Application Data Structure

```typescript
interface Application {
  id: string;
  userId: string;
  
  // Job Information
  company: {
    id?: string;
    name: string;
    logo?: string;
    website?: string;
    industry?: string;
    size?: string;
  };
  
  jobTitle: string;
  jobUrl?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  
  // Application Details
  status: ApplicationStatus;
  priority: Priority;
  appliedDate: Date;
  lastUpdated: Date;
  
  // Job Specifications
  location: {
    city?: string;
    state?: string;
    country?: string;
    remote: boolean;
    hybrid: boolean;
  };
  
  salary: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'yearly';
  };
  
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
  
  // Contacts
  contacts: Contact[];
  
  // Documents
  documents: Document[];
  
  // Notes & Reminders
  notes: Note[];
  reminders: Reminder[];
  
  // Interviews
  interviews: Interview[];
  
  // Metadata
  source?: string; // where job was found
  referral?: string;
  tags: string[];
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type ApplicationStatus = 
  | 'wishlist'
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'accepted'
  | 'rejected';

type Priority = 'high' | 'medium' | 'low' | null;

interface Contact {
  id: string;
  name: string;
  role: 'recruiter' | 'hiring_manager' | 'referral' | 'other';
  email?: string;
  phone?: string;
  linkedin?: string;
  notes?: string;
}

interface Document {
  id: string;
  type: 'resume' | 'cover_letter' | 'portfolio' | 'other';
  name: string;
  url: string;
  uploadedAt: Date;
}

interface Note {
  id: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Reminder {
  id: string;
  title: string;
  date: Date;
  completed: boolean;
  notificationSent: boolean;
}

interface Interview {
  id: string;
  type: 'phone' | 'video' | 'onsite' | 'other';
  date: Date;
  duration: number; // minutes
  interviewers: string[];
  location?: string;
  meetingLink?: string;
  preparationNotes?: string;
  feedback?: string;
  completed: boolean;
}
```

---

### 5.2 Status States and Transitions

```typescript
interface StatusTransition {
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  timestamp: Date;
  note?: string;
  userId: string;
}

// Valid transitions
const STATUS_FLOW = {
  wishlist: ['applied', 'rejected'],
  applied: ['phone_screen', 'interview', 'rejected'],
  phone_screen: ['interview', 'rejected', 'applied'],
  interview: ['offer', 'rejected', 'phone_screen'],
  offer: ['accepted', 'rejected'],
  accepted: [], // terminal state
  rejected: [], // terminal state
};
```

---

### 5.3 Analytics Metrics

```typescript
interface AnalyticsMetrics {
  period: {
    start: Date;
    end: Date;
  };
  
  // Core Metrics
  totalApplications: number;
  activeApplications: number;
  
  // Stage Counts
  stageBreakdown: {
    [key in ApplicationStatus]: number;
  };
  
  // Conversion Rates
  conversionRates: {
    appliedToPhoneScreen: number;
    phoneScreenToInterview: number;
    interviewToOffer: number;
    offerToAccepted: number;
    overallSuccessRate: number;
    rejectionRate: number;
  };
  
  // Time Metrics
  averageTimeToResponse: number; // days
  averageTimeToInterview: number; // days
  averageTimeToOffer: number; // days
  averageProcessDuration: number; // days
  
  // Trend Data
  applicationsOverTime: {
    date: string;
    applications: number;
    responses: number;
    interviews: number;
    offers: number;
  }[];
  
  // Top Lists
  topCompanies: {
    name: string;
    count: number;
    successRate: number;
  }[];
  
  topIndustries: {
    name: string;
    count: number;
    successRate: number;
  }[];
  
  topLocations: {
    name: string;
    count: number;
    successRate: number;
  }[];
  
  // Activity Data
  activityHeatmap: {
    date: string;
    count: number;
  }[];
  
  // Comparison to Previous Period
  periodComparison: {
    applications: {
      current: number;
      previous: number;
      change: number;
    };
    successRate: {
      current: number;
      previous: number;
      change: number;
    };
    // ... other metrics
  };
}
```

---

### 5.4 Chart Data Formats

#### Funnel Chart Data
```typescript
interface FunnelChartData {
  stage: string;
  value: number;
  percentage: number;
  fill: string;
}

// Example
const funnelData: FunnelChartData[] = [
  { stage: 'Applied', value: 100, percentage: 100, fill: '#3B82F6' },
  { stage: 'Phone Screen', value: 68, percentage: 68, fill: '#06B6D4' },
  { stage: 'Interview', value: 24, percentage: 24, fill: '#8B5CF6' },
  { stage: 'Offer', value: 12, percentage: 12, fill: '#10B981' },
  { stage: 'Accepted', value: 8, percentage: 8, fill: '#059669' },
];
```

#### Line Chart Data
```typescript
interface LineChartData {
  date: string;
  applications?: number;
  responses?: number;
  interviews?: number;
  offers?: number;
}

// Example
const lineData: LineChartData[] = [
  {
    date: '2025-10-01',
    applications: 5,
    responses: 2,
    interviews: 1,
    offers: 0
  },
  // ... more data points
];
```

#### Bar Chart Data
```typescript
interface BarChartData {
  name: string;
  value: number;
  successRate?: number;
  fill?: string;
}

// Example
const topCompanies: BarChartData[] = [
  { name: 'Google', value: 12, successRate: 25, fill: '#3B82F6' },
  { name: 'Meta', value: 8, successRate: 12.5, fill: '#10B981' },
  // ... more companies
];
```

#### Heatmap Data
```typescript
interface HeatmapData {
  date: string; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // intensity level
}

// Example
const heatmapData: HeatmapData[] = [
  { date: '2025-01-01', count: 3, level: 2 },
  { date: '2025-01-02', count: 0, level: 0 },
  { date: '2025-01-03', count: 7, level: 4 },
  // ... 365 days
];
```

---

### 5.5 API Endpoints

#### Application Endpoints
```
GET    /api/applications              - List all applications (with filters)
POST   /api/applications              - Create new application
GET    /api/applications/:id          - Get application details
PUT    /api/applications/:id          - Update application
DELETE /api/applications/:id          - Delete application
PATCH  /api/applications/:id/status   - Update status only
POST   /api/applications/bulk         - Bulk operations
```

#### Analytics Endpoints
```
GET    /api/analytics/metrics         - Get analytics metrics
GET    /api/analytics/funnel          - Get funnel data
GET    /api/analytics/trends          - Get trend data
GET    /api/analytics/top-companies   - Get top companies
GET    /api/analytics/top-industries  - Get top industries
GET    /api/analytics/heatmap         - Get activity heatmap
POST   /api/analytics/reports         - Generate report
```

#### Support Endpoints
```
GET    /api/companies                 - Search companies
GET    /api/locations                 - Search locations
POST   /api/documents/upload          - Upload document
GET    /api/documents/:id             - Download document
```

---

### 5.6 Query Parameters

#### List Applications
```
GET /api/applications?
  status=applied,interview          // Filter by status (comma-separated)
  &priority=high,medium             // Filter by priority
  &dateFrom=2025-01-01              // Filter by applied date range
  &dateTo=2025-12-31
  &location=San Francisco           // Filter by location
  &salaryMin=100000                 // Filter by salary
  &salaryMax=200000
  &company=Google                   // Filter by company
  &search=engineer                  // Full-text search
  &sortBy=appliedDate               // Sort field
  &sortOrder=desc                   // Sort direction
  &page=1                           // Pagination
  &limit=20
```

#### Get Analytics
```
GET /api/analytics/metrics?
  dateFrom=2025-01-01               // Date range
  &dateTo=2025-12-31
  &groupBy=week                     // week, month, quarter
  &compareWith=previousPeriod       // Comparison
```

---

### 5.7 Real-time Updates

#### WebSocket Events
```typescript
// Client subscribes to application updates
socket.on('application:created', (application: Application) => {
  // Add to list
});

socket.on('application:updated', (application: Application) => {
  // Update in list
});

socket.on('application:deleted', (id: string) => {
  // Remove from list
});

socket.on('application:status-changed', (data: {
  id: string;
  status: ApplicationStatus;
  previousStatus: ApplicationStatus;
}) => {
  // Update status with animation
});
```

---

## 6. File Structure

### 6.1 Component Organization

```
src/
├── pages/
│   ├── applications/
│   │   ├── ApplicationsPage.tsx           # Main applications page
│   │   ├── ApplicationDetailsPage.tsx     # Individual application details
│   │   └── index.ts
│   └── analytics/
│       ├── AnalyticsDashboard.tsx         # Analytics dashboard
│       ├── ReportsPage.tsx                # Reports page
│       └── index.ts
│
├── components/
│   ├── applications/
│   │   ├── ApplicationCard.tsx            # Application card component
│   │   ├── ApplicationTable.tsx           # Table view component
│   │   ├── ApplicationFilters.tsx         # Filter sidebar
│   │   ├── ApplicationSearch.tsx          # Search component
│   │   ├── KanbanBoard.tsx                # Kanban board view
│   │   ├── KanbanColumn.tsx               # Kanban column
│   │   ├── KanbanCard.tsx                 # Kanban card
│   │   ├── ApplicationDetailsPanel.tsx    # Details panel
│   │   ├── TimelineActivityFeed.tsx       # Activity timeline
│   │   ├── StatusPipeline.tsx             # Pipeline visualization
│   │   ├── QuickAddApplication.tsx        # Quick add modal
│   │   ├── BulkActionsToolbar.tsx         # Bulk actions
│   │   ├── ExportDialog.tsx               # Export dialog
│   │   └── index.ts
│   │
│   ├── analytics/
│   │   ├── KPIWidget.tsx                  # KPI card component
│   │   ├── ApplicationFunnelChart.tsx     # Funnel chart
│   │   ├── ApplicationTrendChart.tsx      # Trend line chart
│   │   ├── SuccessRateGauge.tsx           # Gauge chart
│   │   ├── TopCompaniesChart.tsx          # Bar chart
│   │   ├── HeatmapCalendar.tsx            # Calendar heatmap
│   │   ├── InsightsPanel.tsx              # AI insights
│   │   ├── ReportGenerator.tsx            # Report generation
│   │   └── index.ts
│   │
│   └── ui/
│       ├── StatusBadge.tsx                # Status badge
│       ├── PriorityBadge.tsx              # Priority badge
│       ├── DateRangePicker.tsx            # Date range picker
│       ├── EmptyState.tsx                 # Empty state
│       ├── LoadingSkeleton.tsx            # Loading skeletons
│       └── ... (other shared UI components)
│
├── hooks/
│   ├── useApplications.ts                 # Applications data hook
│   ├── useApplicationFilters.ts           # Filter state hook
│   ├── useAnalytics.ts                    # Analytics data hook
│   ├── useChartData.ts                    # Chart data transformation
│   ├── useDragAndDrop.ts                  # Drag and drop logic
│   └── index.ts
│
├── lib/
│   ├── api/
│   │   ├── applications.ts                # Application API calls
│   │   ├── analytics.ts                   # Analytics API calls
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── applicationUtils.ts            # Application helpers
│   │   ├── analyticsUtils.ts              # Analytics calculations
│   │   ├── chartUtils.ts                  # Chart data transformations
│   │   ├── dateUtils.ts                   # Date formatting
│   │   └── exportUtils.ts                 # Export helpers
│   │
│   └── constants/
│       ├── applicationConstants.ts        # Status, priority constants
│       ├── chartConstants.ts              # Chart colors, configs
│       └── index.ts
│
├── types/
│   ├── application.ts                     # Application types
│   ├── analytics.ts                       # Analytics types
│   ├── chart.ts                           # Chart data types
│   └── index.ts
│
└── context/
    ├── ApplicationContext.tsx             # Application state context
    ├── AnalyticsContext.tsx               # Analytics state context
    └── index.ts
```

---

### 6.2 Type Definitions File

**File**: `src/types/application.ts`
```typescript
export type ApplicationStatus = 
  | 'wishlist'
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'accepted'
  | 'rejected';

export type Priority = 'high' | 'medium' | 'low' | null;

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';

export type ContactRole = 'recruiter' | 'hiring_manager' | 'referral' | 'other';

export type DocumentType = 'resume' | 'cover_letter' | 'portfolio' | 'other';

export type InterviewType = 'phone' | 'video' | 'onsite' | 'other';

export interface Application {
  id: string;
  userId: string;
  company: Company;
  jobTitle: string;
  jobUrl?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  status: ApplicationStatus;
  priority: Priority;
  appliedDate: Date;
  lastUpdated: Date;
  location: Location;
  salary: Salary;
  jobType: JobType;
  contacts: Contact[];
  documents: Document[];
  notes: Note[];
  reminders: Reminder[];
  interviews: Interview[];
  source?: string;
  referral?: string;
  tags: string[];
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ... other interfaces
```

---

### 6.3 Constants File

**File**: `src/lib/constants/applicationConstants.ts`
```typescript
export const APPLICATION_STATUSES = [
  { value: 'wishlist', label: 'Wishlist', color: 'gray' },
  { value: 'applied', label: 'Applied', color: 'blue' },
  { value: 'phone_screen', label: 'Phone Screen', color: 'cyan' },
  { value: 'interview', label: 'Interview', color: 'purple' },
  { value: 'offer', label: 'Offer', color: 'green' },
  { value: 'accepted', label: 'Accepted', color: 'emerald' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
] as const;

export const PRIORITIES = [
  { value: 'high', label: 'High', color: 'red' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'low', label: 'Low', color: 'gray' },
] as const;

export const STATUS_FLOW = {
  wishlist: ['applied', 'rejected'],
  applied: ['phone_screen', 'interview', 'rejected'],
  phone_screen: ['interview', 'rejected', 'applied'],
  interview: ['offer', 'rejected', 'phone_screen'],
  offer: ['accepted', 'rejected'],
  accepted: [],
  rejected: [],
} as const;

export const DEFAULT_KANBAN_COLUMNS = [
  { id: 'wishlist', title: 'Wishlist', order: 0 },
  { id: 'applied', title: 'Applied', order: 1 },
  { id: 'phone_screen', title: 'Phone Screen', order: 2 },
  { id: 'interview', title: 'Interview', order: 3 },
  { id: 'offer', title: 'Offer', order: 4 },
  { id: 'accepted', title: 'Accepted', order: 5 },
  { id: 'rejected', title: 'Rejected', order: 6 },
] as const;
```

---

### 6.4 Utility Functions

**File**: `src/lib/utils/applicationUtils.ts`
```typescript
import { Application, ApplicationStatus } from '@/types/application';
import { STATUS_FLOW } from '@/lib/constants/applicationConstants';

/**
 * Check if status transition is valid
 */
export function isValidStatusTransition(
  from: ApplicationStatus,
  to: ApplicationStatus
): boolean {
  return STATUS_FLOW[from].includes(to);
}

/**
 * Get days since application
 */
export function getDaysSinceApplied(appliedDate: Date): number {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - appliedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get status color
 */
export function getStatusColor(status: ApplicationStatus): string {
  const statusColors = {
    wishlist: 'gray',
    applied: 'blue',
    phone_screen: 'cyan',
    interview: 'purple',
    offer: 'green',
    accepted: 'emerald',
    rejected: 'red',
  };
  return statusColors[status];
}

/**
 * Format salary range
 */
export function formatSalaryRange(salary: {
  min?: number;
  max?: number;
  currency: string;
  period: 'hourly' | 'yearly';
}): string {
  const { min, max, currency, period } = salary;
  const periodLabel = period === 'hourly' ? '/hr' : '/year';
  
  if (min && max) {
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()} ${periodLabel}`;
  } else if (min) {
    return `${currency}${min.toLocaleString()}+ ${periodLabel}`;
  } else if (max) {
    return `Up to ${currency}${max.toLocaleString()} ${periodLabel}`;
  }
  return 'Not specified';
}

/**
 * Sort applications by field
 */
export function sortApplications(
  applications: Application[],
  field: keyof Application,
  order: 'asc' | 'desc'
): Application[] {
  return [...applications].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filter applications
 */
export function filterApplications(
  applications: Application[],
  filters: {
    status?: ApplicationStatus[];
    priority?: Priority[];
    dateFrom?: Date;
    dateTo?: Date;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    search?: string;
  }
): Application[] {
  return applications.filter(app => {
    // Status filter
    if (filters.status && !filters.status.includes(app.status)) {
      return false;
    }
    
    // Priority filter
    if (filters.priority && !filters.priority.includes(app.priority)) {
      return false;
    }
    
    // Date range filter
    if (filters.dateFrom && app.appliedDate < filters.dateFrom) {
      return false;
    }
    if (filters.dateTo && app.appliedDate > filters.dateTo) {
      return false;
    }
    
    // Location filter
    if (filters.location && !app.location.city?.includes(filters.location)) {
      return false;
    }
    
    // Salary filter
    if (filters.salaryMin && app.salary.max && app.salary.max < filters.salaryMin) {
      return false;
    }
    if (filters.salaryMax && app.salary.min && app.salary.min > filters.salaryMax) {
      return false;
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        app.jobTitle.toLowerCase().includes(searchLower) ||
        app.company.name.toLowerCase().includes(searchLower) ||
        app.notes.some(note => note.content.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });
}
```

---

**File**: `src/lib/utils/analyticsUtils.ts`
```typescript
import { Application } from '@/types/application';
import { AnalyticsMetrics } from '@/types/analytics';

/**
 * Calculate analytics metrics from applications
 */
export function calculateAnalyticsMetrics(
  applications: Application[],
  dateFrom: Date,
  dateTo: Date
): AnalyticsMetrics {
  const filteredApps = applications.filter(app => 
    app.appliedDate >= dateFrom && app.appliedDate <= dateTo
  );
  
  // Stage breakdown
  const stageBreakdown = filteredApps.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Conversion rates
  const applied = stageBreakdown.applied || 0;
  const phoneScreen = stageBreakdown.phone_screen || 0;
  const interview = stageBreakdown.interview || 0;
  const offer = stageBreakdown.offer || 0;
  const accepted = stageBreakdown.accepted || 0;
  
  const conversionRates = {
    appliedToPhoneScreen: applied > 0 ? (phoneScreen / applied) * 100 : 0,
    phoneScreenToInterview: phoneScreen > 0 ? (interview / phoneScreen) * 100 : 0,
    interviewToOffer: interview > 0 ? (offer / interview) * 100 : 0,
    offerToAccepted: offer > 0 ? (accepted / offer) * 100 : 0,
    overallSuccessRate: applied > 0 ? (accepted / applied) * 100 : 0,
    rejectionRate: applied > 0 ? ((stageBreakdown.rejected || 0) / applied) * 100 : 0,
  };
  
  // Top companies
  const companyCount = filteredApps.reduce((acc, app) => {
    const name = app.company.name;
    if (!acc[name]) {
      acc[name] = { count: 0, accepted: 0 };
    }
    acc[name].count++;
    if (app.status === 'accepted') {
      acc[name].accepted++;
    }
    return acc;
  }, {} as Record<string, { count: number; accepted: number }>);
  
  const topCompanies = Object.entries(companyCount)
    .map(([name, data]) => ({
      name,
      count: data.count,
      successRate: (data.accepted / data.count) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    period: { start: dateFrom, end: dateTo },
    totalApplications: filteredApps.length,
    activeApplications: filteredApps.filter(app => 
      !['accepted', 'rejected'].includes(app.status)
    ).length,
    stageBreakdown,
    conversionRates,
    averageTimeToResponse: 0, // Calculate from timeline data
    averageTimeToInterview: 0,
    averageTimeToOffer: 0,
    averageProcessDuration: 0,
    applicationsOverTime: [],
    topCompanies,
    topIndustries: [],
    topLocations: [],
    activityHeatmap: [],
    periodComparison: {
      applications: { current: 0, previous: 0, change: 0 },
      successRate: { current: 0, previous: 0, change: 0 },
    },
  };
}

/**
 * Transform applications to funnel data
 */
export function transformToFunnelData(applications: Application[]) {
  const stages = [
    { key: 'applied', label: 'Applied', color: '#3B82F6' },
    { key: 'phone_screen', label: 'Phone Screen', color: '#06B6D4' },
    { key: 'interview', label: 'Interview', color: '#8B5CF6' },
    { key: 'offer', label: 'Offer', color: '#10B981' },
    { key: 'accepted', label: 'Accepted', color: '#059669' },
  ];
  
  const stageCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const total = applications.length;
  
  return stages.map(stage => ({
    stage: stage.label,
    value: stageCounts[stage.key] || 0,
    percentage: total > 0 ? ((stageCounts[stage.key] || 0) / total) * 100 : 0,
    fill: stage.color,
  }));
}
```

---

## 7. Implementation Notes

### 7.1 Technology Stack Confirmation

**Frontend Framework**: React 18.3.1 with TypeScript
**Build Tool**: Vite 6.0.1
**Styling**: Tailwind CSS v3.4.16
**UI Components**: Radix UI primitives
**Icons**: Lucide React (v0.364.0)
**Charts**: Recharts (v2.12.4)
**Forms**: React Hook Form (v7.54.2) + Zod validation
**Date Handling**: date-fns (v3.0.0) + react-day-picker (v8.10.1)
**State Management**: React hooks + TanStack Query (v5.90.7)
**Routing**: React Router DOM (v6.26.2)
**Drag & Drop**: `@dnd-kit/core` (recommended, needs to be added)

---

### 7.2 Additional Dependencies Needed

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.0.8",
    "@dnd-kit/sortable": "^7.0.2",
    "@dnd-kit/utilities": "^3.2.1",
    "react-to-print": "^2.15.1"
  }
}
```

---

### 7.3 Responsive Design Strategy

**Breakpoints** (Tailwind CSS):
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet portrait)
- `lg`: 1024px (tablet landscape / small desktop)
- `xl`: 1280px (desktop)
- `2xl`: 1536px (large desktop)

**Responsive Components**:
1. **ApplicationCard**: 
   - Mobile: Full width, stacked
   - Tablet: 2 columns
   - Desktop: 3-4 columns

2. **KanbanBoard**:
   - Mobile: Single column with tabs
   - Tablet: Horizontal scroll
   - Desktop: All columns visible

3. **Analytics**:
   - Mobile: Stacked charts, simplified
   - Tablet: 2-column grid
   - Desktop: 3-column grid

4. **Filters**:
   - Mobile: Bottom sheet modal
   - Desktop: Sidebar

---

### 7.4 Performance Optimizations

1. **Virtual Scrolling**: For large application lists (use `react-virtual`)
2. **Lazy Loading**: Load charts only when visible
3. **Memoization**: Memoize expensive calculations with `useMemo`
4. **Debouncing**: Debounce search and filter inputs
5. **Code Splitting**: Lazy load analytics dashboard
6. **Image Optimization**: Company logos lazy loaded
7. **API Pagination**: Load applications in batches
8. **Caching**: TanStack Query for API caching

---

### 7.5 Accessibility Requirements

1. **Keyboard Navigation**: 
   - Tab through all interactive elements
   - Escape to close modals
   - Enter to submit forms
   - Arrow keys for dropdowns

2. **Screen Readers**:
   - ARIA labels on all buttons
   - ARIA descriptions on charts
   - Status announcements for updates

3. **Color Contrast**: 
   - WCAG AA compliant (4.5:1 for text)
   - Color not only indicator

4. **Focus Management**:
   - Visible focus indicators
   - Focus trap in modals
   - Return focus on close

5. **Semantic HTML**:
   - Proper heading hierarchy
   - List markup for lists
   - Table markup for tables

---

### 7.6 Testing Strategy

1. **Unit Tests**: 
   - Utility functions
   - Data transformations
   - Hooks

2. **Component Tests**:
   - Render tests
   - Interaction tests
   - Accessibility tests

3. **Integration Tests**:
   - User flows
   - API integration
   - State management

4. **E2E Tests**:
   - Critical paths
   - Application CRUD
   - Status updates

---

## 8. Next Steps

### Phase 1: Core Application Tracking (Week 1-2)
- [ ] Set up file structure
- [ ] Create type definitions
- [ ] Build ApplicationCard component
- [ ] Build ApplicationTable component
- [ ] Build ApplicationFilters component
- [ ] Build QuickAddApplication modal
- [ ] Implement ApplicationsPage with list view
- [ ] Add basic CRUD operations

### Phase 2: Kanban Board & Details (Week 3-4)
- [ ] Implement KanbanBoard component
- [ ] Add drag-and-drop functionality
- [ ] Build ApplicationDetailsPage
- [ ] Build TimelineActivityFeed
- [ ] Add status update flows
- [ ] Implement bulk actions

### Phase 3: Analytics Dashboard (Week 5-6)
- [ ] Build KPIWidget component
- [ ] Implement ApplicationFunnelChart
- [ ] Implement ApplicationTrendChart
- [ ] Build other chart components
- [ ] Create AnalyticsDashboard page
- [ ] Add date range filtering
- [ ] Implement export functionality

### Phase 4: Polish & Optimization (Week 7-8)
- [ ] Add loading states and skeletons
- [ ] Implement error handling
- [ ] Add empty states
- [ ] Optimize performance
- [ ] Add animations and transitions
- [ ] Accessibility audit
- [ ] Responsive testing
- [ ] User testing and feedback

---

## 9. Appendix

### 9.1 Color Palette Reference

```css
/* Status Colors */
--status-wishlist: #6B7280;
--status-applied: #3B82F6;
--status-phone-screen: #06B6D4;
--status-interview: #8B5CF6;
--status-offer: #10B981;
--status-accepted: #059669;
--status-rejected: #EF4444;

/* Priority Colors */
--priority-high: #EF4444;
--priority-medium: #F59E0B;
--priority-low: #6B7280;

/* Chart Colors */
--chart-primary: #3B82F6;
--chart-secondary: #10B981;
--chart-tertiary: #8B5CF6;
--chart-quaternary: #F59E0B;
--chart-danger: #EF4444;

/* Semantic Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### 9.2 Icon Reference (Lucide React)

```typescript
import {
  Briefcase,        // Applications
  BarChart3,        // Analytics
  Kanban,           // Board view
  List,             // List view
  Calendar,         // Calendar view
  Filter,           // Filters
  Search,           // Search
  Plus,             // Add new
  Edit,             // Edit
  Trash2,           // Delete
  Download,         // Export
  Upload,           // Upload
  FileText,         // Document
  Phone,            // Phone screen
  Video,            // Video interview
  MapPin,           // Location
  DollarSign,       // Salary
  Clock,            // Time
  TrendingUp,       // Success
  TrendingDown,     // Decline
  AlertCircle,      // Alert
  CheckCircle,      // Success
  XCircle,          // Error
  MoreVertical,     // More options
  ChevronDown,      // Dropdown
  ChevronUp,        // Collapse
  ArrowLeft,        // Back
  ArrowRight,       // Forward
  X,                // Close
  Eye,              // View
  EyeOff,           // Hide
  Star,             // Favorite
  Tag,              // Tags
  Users,            // Contacts
  Mail,             // Email
  Link,             // Link
  ExternalLink,     // External link
} from 'lucide-react';
```

### 9.3 Animation Guidelines

**Transition Durations**:
- Fast: 150ms (hover, focus)
- Normal: 250ms (dropdowns, tooltips)
- Slow: 350ms (modals, slides)

**Easing Functions**:
- `ease-in-out`: General animations
- `ease-out`: Entrances
- `ease-in`: Exits
- `spring`: Drag and drop

**Animation Library**: Tailwind CSS animations + Framer Motion (optional)

---

## Document Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-07 | Initial UI plan created | System |

---

## Feedback & Iteration

This UI plan is a living document. As development progresses, it should be updated based on:
- User feedback
- Technical constraints
- Design iterations
- New requirements

Please review and provide feedback on:
1. Component structure and organization
2. Data models and API design
3. User flows and interactions
4. Visual design and layout
5. Technical implementation approach

---

**End of Document**
