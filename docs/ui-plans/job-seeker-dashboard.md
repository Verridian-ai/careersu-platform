# Job Seeker Dashboard - UI Plan

**CareerSU Platform - AI-Powered Career Success Platform**

Version: 1.0  
Date: 2025-11-07  
Status: Planning  

---

## Table of Contents

1. [Screen Inventory](#1-screen-inventory)
2. [Component Breakdown](#2-component-breakdown)
3. [Detailed Specifications](#3-detailed-specifications)
4. [User Flows](#4-user-flows)
5. [Data Requirements](#5-data-requirements)
6. [File Structure](#6-file-structure)
7. [Technical Implementation Notes](#7-technical-implementation-notes)

---

## 1. Screen Inventory

### 1.1 Primary Dashboard Views

#### Main Dashboard (Default State)
- **Route**: `/dashboard`
- **Description**: Primary landing screen after login showing complete overview
- **Key Elements**:
  - Navigation sidebar/header
  - Welcome banner with personalized greeting
  - Quick action buttons (4 primary actions)
  - Stats cards row (3-4 metrics)
  - Recent activity feed
  - AI recommendations section
  - Progress chart/visualization
  - Goal tracker widget

#### First-Time User Dashboard
- **Route**: `/dashboard?onboarding=true`
- **Description**: Dashboard with onboarding overlay and tutorial hints
- **Key Elements**:
  - Same layout as main dashboard
  - Onboarding modal/tour overlay
  - Interactive tooltips on key features
  - Progress checklist (setup tasks)
  - Sample data placeholders with "Get Started" CTAs

#### Empty State Dashboard
- **Route**: `/dashboard` (no data)
- **Description**: Dashboard for users with no applications or documents
- **Key Elements**:
  - Empty state illustrations
  - "Get Started" prompts
  - Setup wizard CTA
  - Template suggestions
  - Video tutorials or help links

### 1.2 Dashboard State Variations

#### Loading State
- Skeleton loaders for all components
- Progressive loading (priority content first)
- Loading indicators for data-heavy sections

#### Error State
- Error messages with retry options
- Partial content display (show what's available)
- Fallback to cached data when possible

#### Success States
- Achievement notifications
- Milestone celebrations
- Goal completion animations

---

## 2. Component Breakdown

### 2.1 Layout Components

#### DashboardLayout
**Purpose**: Main container and layout structure

**Structure**:
```
┌─────────────────────────────────────────────────┐
│  Navigation (Sidebar/Header)                    │
├──────┬──────────────────────────────────────────┤
│      │  Main Content Area                       │
│ Side │  ┌────────────────────────────────────┐  │
│ bar  │  │  Dashboard Header                  │  │
│      │  ├────────────────────────────────────┤  │
│      │  │  Content Grid                      │  │
│      │  │                                    │  │
│      │  └────────────────────────────────────┘  │
└──────┴──────────────────────────────────────────┘
```

**Props**:
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}
```

**Responsive Behavior**:
- Desktop (>1024px): Fixed sidebar + content area
- Tablet (768px-1024px): Collapsible sidebar
- Mobile (<768px): Bottom navigation + hamburger menu

---

#### NavigationSidebar
**Purpose**: Primary navigation and user context

**Elements**:
- Logo and branding
- User profile section (avatar, name, role)
- Navigation menu items:
  - Dashboard (home)
  - Documents
  - Jobs
  - Applications
  - AI Chat
  - Profile/Settings
- Quick stats mini-widget
- Upgrade/Premium CTA (if applicable)
- Help/Support link
- Logout button

**Props**:
```typescript
interface NavigationSidebarProps {
  user: User;
  activeRoute: string;
  collapsed?: boolean;
  onNavigate: (route: string) => void;
  stats?: {
    activeApplications: number;
    unreadMessages: number;
    recommendations: number;
  };
}
```

**Visual Design**:
- Width: 256px (expanded), 64px (collapsed)
- Background: Neutral gray (slate-50/slate-900)
- Active state: Primary color highlight + icon
- Hover states: Subtle background change
- Icons: Lucide icons (24px)

**Interactive Elements**:
- Hover tooltips on collapsed state
- Active route highlighting
- Smooth expand/collapse animation
- Notification badges on menu items

---

#### DashboardHeader
**Purpose**: Page title, breadcrumbs, and contextual actions

**Elements**:
- Page title ("Dashboard" or "Welcome back, [Name]")
- Breadcrumb navigation
- Search bar (global search)
- Notification bell icon (with badge)
- User avatar dropdown menu
- Quick action button (mobile)

**Props**:
```typescript
interface DashboardHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  searchEnabled?: boolean;
  onSearch?: (query: string) => void;
  notifications?: Notification[];
  user: User;
}
```

**Visual Design**:
- Height: 64px
- Background: White (light mode), Dark gray (dark mode)
- Border bottom: 1px subtle gray
- Sticky positioning on scroll

---

### 2.2 Dashboard Content Components

#### WelcomeBanner
**Purpose**: Personalized greeting and motivational content

**Elements**:
- Greeting message: "Good morning/afternoon/evening, [FirstName]!"
- Motivational quote or tip of the day
- Current date and time
- Progress summary (e.g., "You're 60% closer to your goal")
- Dismissible (option to hide)

**Props**:
```typescript
interface WelcomeBannerProps {
  user: User;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  progressPercentage?: number;
  motivationalMessage?: string;
  onDismiss?: () => void;
}
```

**Visual Design**:
- Background: Gradient (primary to secondary color)
- Text: White or high contrast
- Height: Auto (min 120px)
- Border radius: 12px
- Padding: 24px
- Optional background pattern/illustration

**Responsive**:
- Desktop: Full width with illustration
- Mobile: Stacked layout, smaller padding

---

#### QuickActionsCard
**Purpose**: Primary call-to-action buttons for key workflows

**Elements**:
4 Primary Actions:
1. **Create Document**
   - Icon: FileText
   - Label: "Create Resume"
   - Sublabel: "Start from template"
   
2. **Browse Jobs**
   - Icon: Briefcase
   - Label: "Find Jobs"
   - Sublabel: "AI-matched opportunities"
   
3. **AI Career Chat**
   - Icon: MessageSquare or Bot
   - Label: "Ask AI Coach"
   - Sublabel: "Get instant advice"
   
4. **Track Applications**
   - Icon: ClipboardCheck
   - Label: "My Applications"
   - Sublabel: "View status"

**Props**:
```typescript
interface QuickAction {
  id: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  route: string;
  badge?: number; // notification count
  color?: string; // theme color
  onClick: () => void;
}

interface QuickActionsCardProps {
  actions: QuickAction[];
  layout?: 'grid' | 'list';
}
```

**Visual Design**:
- Layout: 2x2 grid (desktop), 1x4 list (mobile)
- Each action button:
  - Background: White with border or subtle color
  - Hover: Elevated shadow + color shift
  - Size: 160px x 140px (desktop)
  - Icon size: 32px
  - Text alignment: Center
  - Border radius: 8px

**Interactive**:
- Hover animation (scale, shadow)
- Click ripple effect
- Loading state (when navigating)

---

#### StatsCards
**Purpose**: Display key performance metrics

**Card Types**:

1. **Total Applications**
   - Icon: FileCheck
   - Value: Number (e.g., "24")
   - Label: "Total Applications"
   - Change indicator: "+3 this week" (green) or "-2 this week" (red)
   - Trend sparkline chart

2. **Interviews Scheduled**
   - Icon: Calendar
   - Value: Number (e.g., "5")
   - Label: "Interviews Scheduled"
   - Next interview: Date/time
   - CTA: "View Calendar"

3. **Success Rate**
   - Icon: TrendingUp
   - Value: Percentage (e.g., "38%")
   - Label: "Response Rate"
   - Comparison: "Industry avg: 25%"
   - Visual: Progress bar or radial chart

4. **Active Documents** (Optional)
   - Icon: FileText
   - Value: Number (e.g., "8")
   - Label: "Resume Versions"
   - Recent: Last edited document
   - CTA: "Manage Docs"

**Props**:
```typescript
interface StatCard {
  id: string;
  title: string;
  value: number | string;
  icon: LucideIcon;
  changeValue?: number;
  changePercentage?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  trend?: number[]; // for sparkline
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface StatsCardsProps {
  stats: StatCard[];
  loading?: boolean;
  onRefresh?: () => void;
}
```

**Visual Design**:
- Layout: Row of 3-4 cards (desktop), Stacked (mobile)
- Card dimensions: Flex-grow with min-width 240px
- Background: White with subtle border
- Padding: 20px
- Border radius: 8px
- Shadow: Subtle elevation
- Change indicator colors:
  - Positive: Green (#10B981)
  - Negative: Red (#EF4444)
  - Neutral: Gray (#6B7280)

**Data Visualization**:
- Sparkline chart: 40px height, subtle line
- Progress bars: Height 8px
- Radial charts: 60px diameter

---

#### RecentActivityFeed
**Purpose**: Show chronological list of recent events and updates

**Activity Types**:
1. **Application Submitted**
   - Icon: Send
   - Message: "Applied to [Job Title] at [Company]"
   - Timestamp: "2 hours ago"
   - Action: "View Application"

2. **Document Updated**
   - Icon: FileEdit
   - Message: "Updated [Document Name]"
   - Timestamp: "Yesterday"
   - Action: "View Document"

3. **Interview Scheduled**
   - Icon: Calendar
   - Message: "Interview scheduled with [Company]"
   - Timestamp: "3 days ago"
   - Details: Date/time
   - Action: "Add to Calendar"

4. **AI Recommendation**
   - Icon: Sparkles or Zap
   - Message: "New job matches your profile"
   - Timestamp: "1 week ago"
   - Action: "View Jobs"

5. **Application Status Change**
   - Icon: Bell
   - Message: "Application status updated: Under Review"
   - Company: [Company Name]
   - Timestamp: "2 days ago"
   - Action: "View Details"

**Props**:
```typescript
interface ActivityItem {
  id: string;
  type: 'application' | 'document' | 'interview' | 'recommendation' | 'status_change';
  title: string;
  description?: string;
  timestamp: Date;
  icon: LucideIcon;
  iconColor?: string;
  metadata?: {
    company?: string;
    jobTitle?: string;
    documentName?: string;
  };
  action?: {
    label: string;
    onClick: () => void;
  };
  read?: boolean;
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number; // default: 10
  loading?: boolean;
  onLoadMore?: () => void;
  onItemClick?: (item: ActivityItem) => void;
  showFilters?: boolean;
}
```

**Visual Design**:
- Container: Card with scrollable area (max-height: 400px)
- List items:
  - Height: Auto (min 64px)
  - Padding: 16px
  - Border bottom: 1px divider
  - Hover: Background highlight
- Icon:
  - Size: 24px
  - Background circle: 40px diameter
  - Color coded by type
- Timestamp:
  - Font size: 12px
  - Color: Muted gray
  - Relative time format
- Unread indicator: Blue dot or bold text

**Interactive Elements**:
- Hover state on items
- Click to view details
- "Mark as read" on hover
- "Load more" button at bottom
- Filter dropdown: "All", "Applications", "Documents", "Interviews"

---

#### AIRecommendationsCard
**Purpose**: Display AI-powered job recommendations and suggestions

**Elements**:
- Section title: "Recommended for You"
- Subtitle: "Based on your profile and preferences"
- Recommendation cards (3-4 visible):
  
  **Job Recommendation**:
  - Company logo/placeholder
  - Job title
  - Company name
  - Location
  - Match percentage: "92% match"
  - Key matching skills (tags)
  - Salary range (if available)
  - Posted date
  - Action buttons: "View Details", "Quick Apply"

  **Document Suggestion**:
  - Icon: FileText
  - Title: "Optimize your resume for tech roles"
  - Description: "AI detected areas for improvement"
  - Action: "Review Suggestions"

  **Skill Gap Alert**:
  - Icon: Target or Award
  - Title: "Top skills for your target roles"
  - Skills list with progress bars
  - Action: "View Learning Resources"

**Props**:
```typescript
interface JobRecommendation {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location: string;
  matchPercentage: number;
  matchingSkills: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate: Date;
  jobUrl: string;
  description?: string;
}

interface DocumentSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  documentId?: string;
  suggestions: string[];
}

interface SkillGapAlert {
  id: string;
  title: string;
  skills: {
    name: string;
    currentLevel: number;
    targetLevel: number;
    resources?: string[];
  }[];
}

interface AIRecommendationsCardProps {
  jobRecommendations?: JobRecommendation[];
  documentSuggestions?: DocumentSuggestion[];
  skillGaps?: SkillGapAlert[];
  loading?: boolean;
  onRefresh?: () => void;
  onJobClick?: (job: JobRecommendation) => void;
  onSuggestionClick?: (suggestion: DocumentSuggestion) => void;
}
```

**Visual Design**:
- Container: Card with horizontal scrollable area
- Recommendation cards:
  - Width: 320px
  - Height: Auto (min 240px)
  - Background: White with gradient border on hover
  - Border radius: 8px
  - Padding: 16px
  - Shadow: Subtle elevation
- Match percentage:
  - Badge style
  - Background: Gradient based on percentage
    - >80%: Green
    - 60-80%: Blue
    - <60%: Yellow
  - Font weight: Bold
- Skill tags:
  - Inline badges
  - Max 3 visible, "+X more" overflow
  - Size: Small (12px font)

**Data Visualization**:
- Match percentage: Radial progress indicator or badge
- Skill gaps: Horizontal progress bars

**Interactive Elements**:
- Horizontal scroll with arrows
- Card hover: Elevation increase
- "View All Recommendations" link
- "Refresh Recommendations" button
- Swipe gesture support (mobile)

---

#### ProgressChart
**Purpose**: Visualize job search progress over time

**Chart Types**:

1. **Application Timeline** (Line/Area Chart)
   - X-axis: Time (weeks/months)
   - Y-axis: Number of applications
   - Multiple lines:
     - Applications sent
     - Responses received
     - Interviews scheduled
   - Interactive tooltips on hover

2. **Application Funnel** (Funnel/Bar Chart)
   - Stages:
     - Applications Sent
     - Reviewed
     - Interviews
     - Offers
     - Accepted
   - Visual: Horizontal funnel or vertical bars
   - Percentage conversion rates

3. **Success Rate Over Time** (Combo Chart)
   - Line: Success percentage
   - Bars: Number of applications per week
   - Goal line indicator

**Props**:
```typescript
interface ChartDataPoint {
  date: string;
  applications: number;
  responses: number;
  interviews: number;
  offers?: number;
}

interface ProgressChartProps {
  data: ChartDataPoint[];
  chartType?: 'line' | 'area' | 'bar' | 'funnel';
  timeRange?: '7d' | '30d' | '90d' | '1y' | 'all';
  onTimeRangeChange?: (range: string) => void;
  loading?: boolean;
  height?: number; // default: 300px
}
```

**Visual Design**:
- Container: Card with title and controls
- Chart dimensions:
  - Height: 300px (desktop), 240px (mobile)
  - Width: 100% of container
- Color scheme:
  - Primary: Blue (#3B82F6) - Applications
  - Success: Green (#10B981) - Interviews
  - Warning: Yellow (#F59E0B) - In Review
  - Secondary: Purple (#8B5CF6) - Offers
- Grid lines: Subtle gray
- Axes labels: 12px, muted color
- Legend: Top right, toggleable

**Interactive Elements**:
- Time range selector: Tabs or dropdown
- Hover tooltips with exact values
- Click to drill down into specific period
- Export chart as image (optional)
- Toggle data series visibility

**Library**: Recharts components
- `ResponsiveContainer`
- `AreaChart` or `LineChart`
- `CartesianGrid`
- `XAxis`, `YAxis`
- `Tooltip`
- `Legend`

---

#### GoalTrackerWidget
**Purpose**: Display and track career goals and milestones

**Elements**:
- Section title: "Your Goals"
- Goal items:
  
  **Goal Card**:
  - Goal title: "Apply to 50 jobs"
  - Progress bar: 24/50 (48%)
  - Status: "In Progress" | "Completed" | "Upcoming"
  - Due date: "Target: Dec 31, 2025"
  - Action: "Update Progress"

**Goal Types**:
1. **Application Goal**: Number of applications
2. **Interview Goal**: Number of interviews
3. **Skill Goal**: Complete certifications/courses
4. **Timeline Goal**: Get offer by specific date
5. **Custom Goal**: User-defined

**Props**:
```typescript
interface Goal {
  id: string;
  title: string;
  description?: string;
  type: 'applications' | 'interviews' | 'skills' | 'timeline' | 'custom';
  target: number;
  current: number;
  unit?: string; // 'applications', 'interviews', 'skills', etc.
  dueDate?: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  createdAt: Date;
  completedAt?: Date;
}

interface GoalTrackerWidgetProps {
  goals: Goal[];
  onAddGoal?: () => void;
  onUpdateGoal?: (goalId: string, progress: number) => void;
  onDeleteGoal?: (goalId: string) => void;
  maxVisible?: number; // default: 3
}
```

**Visual Design**:
- Container: Card with list of goals
- Goal item:
  - Height: Auto (min 80px)
  - Padding: 16px
  - Border bottom: 1px divider
- Progress bar:
  - Height: 8px
  - Border radius: 4px
  - Background: Light gray
  - Fill: Gradient based on progress
    - On track: Blue/Green
    - Behind schedule: Yellow
    - Overdue: Red
- Status badge:
  - Size: Small
  - Colors:
    - In Progress: Blue
    - Completed: Green
    - Overdue: Red
    - Not Started: Gray

**Interactive Elements**:
- "+ Add Goal" button
- Edit goal (pencil icon)
- Delete goal (trash icon)
- Quick progress update (click to edit)
- "View All Goals" link

---

### 2.3 Supporting Components

#### LoadingSkeletons
**Purpose**: Placeholder content during data loading

**Variants**:
- `StatsCardSkeleton`: Rectangles with shimmer animation
- `ActivityFeedSkeleton`: List of shimmer rows
- `RecommendationCardSkeleton`: Card-shaped shimmer blocks
- `ChartSkeleton`: Rectangle with axis lines

**Visual Design**:
- Background: Light gray (slate-200)
- Animation: Shimmer/pulse effect
- Shape: Matches final component dimensions
- Border radius: Same as actual components

---

#### EmptyStateCard
**Purpose**: Display when no data available

**Props**:
```typescript
interface EmptyStateCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  illustration?: string; // optional image URL
}
```

**Visual Design**:
- Center-aligned content
- Icon: 48px, muted color
- Title: 18px, semibold
- Description: 14px, muted
- Action button: Primary style
- Padding: 48px vertical

---

#### ErrorBoundaryCard
**Purpose**: Handle component-level errors gracefully

**Elements**:
- Error icon (AlertTriangle)
- Error message: "Something went wrong"
- Description: User-friendly error explanation
- Actions:
  - "Try Again" button
  - "Report Issue" link
  - "Go Home" link

---

## 3. Detailed Specifications

### 3.1 Visual Design System

#### Color Palette

**Primary Colors**:
```scss
--primary-50: #EFF6FF;
--primary-100: #DBEAFE;
--primary-500: #3B82F6; // Main primary
--primary-600: #2563EB;
--primary-700: #1D4ED8;
```

**Semantic Colors**:
```scss
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

**Neutral Colors**:
```scss
--slate-50: #F8FAFC;
--slate-100: #F1F5F9;
--slate-200: #E2E8F0;
--slate-500: #64748B;
--slate-700: #334155;
--slate-900: #0F172A;
```

#### Typography

**Font Family**: Inter (fallback: system-ui, sans-serif)

**Font Scales**:
- Display: 48px, 700 weight
- H1: 32px, 700 weight
- H2: 24px, 600 weight
- H3: 20px, 600 weight
- H4: 18px, 600 weight
- Body Large: 16px, 400 weight
- Body: 14px, 400 weight
- Body Small: 12px, 400 weight
- Caption: 11px, 400 weight

**Line Heights**:
- Headings: 1.2
- Body: 1.5
- Captions: 1.4

#### Spacing System

**Base Unit**: 4px

**Scale**:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

#### Border Radius

- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- full: 9999px

#### Shadows

```scss
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

#### Animation

**Durations**:
- Fast: 150ms
- Normal: 300ms
- Slow: 500ms

**Easings**:
- Default: cubic-bezier(0.4, 0, 0.2, 1)
- In: cubic-bezier(0.4, 0, 1, 1)
- Out: cubic-bezier(0, 0, 0.2, 1)
- Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)

---

### 3.2 Responsive Design Specifications

#### Breakpoints

```scss
// Tailwind CSS default breakpoints
sm: 640px    // Mobile landscape
md: 768px    // Tablet
lg: 1024px   // Desktop
xl: 1280px   // Large desktop
2xl: 1536px  // Extra large desktop
```

#### Layout Behavior by Breakpoint

**Mobile (<768px)**:
- Single column layout
- Bottom navigation bar (sticky)
- Hamburger menu for secondary nav
- Stats cards: Stack vertically
- Quick actions: 2x2 grid or list
- Charts: Full width, reduced height
- Activity feed: Full width
- Recommendations: Horizontal scroll

**Tablet (768px-1024px)**:
- Collapsible sidebar
- 2-column grid where appropriate
- Stats cards: 2 per row
- Quick actions: 2x2 grid
- Charts: Maintain full features
- Side-by-side content sections

**Desktop (>1024px)**:
- Fixed sidebar (256px width)
- Multi-column grid (up to 3 columns)
- Stats cards: All in one row
- Quick actions: 2x2 grid or horizontal row
- Side panels for additional info
- Hover states more prominent

#### Component Responsive Behavior

**NavigationSidebar**:
- Mobile: Hidden, accessible via hamburger
- Tablet: Collapsible (icon-only mode)
- Desktop: Fully expanded

**StatsCards**:
- Mobile: 1 column, full width
- Tablet: 2 columns
- Desktop: 3-4 columns in row

**QuickActionsCard**:
- Mobile: 2x2 grid or vertical list
- Tablet: 2x2 grid
- Desktop: 2x2 grid or 1x4 horizontal

**RecentActivityFeed**:
- Mobile: Full width, larger touch targets
- Tablet: Half width or full width
- Desktop: Fixed width column (max 400px)

**AIRecommendationsCard**:
- Mobile: Full width cards, swipeable
- Tablet: 2 cards visible, horizontal scroll
- Desktop: 3 cards visible, scroll or grid

**ProgressChart**:
- Mobile: Simplified, key metrics only
- Tablet: Full features, responsive sizing
- Desktop: Full features, larger canvas

---

### 3.3 Interactive Elements

#### Hover States

**Cards**:
- Transform: translateY(-2px)
- Shadow: Increase elevation
- Border: Highlight color
- Transition: 200ms ease

**Buttons**:
- Background: Darken 10%
- Transform: scale(1.02)
- Shadow: Increase
- Transition: 150ms ease

**Links**:
- Text decoration: Underline
- Color: Darken 20%
- Transition: 100ms ease

#### Click/Tap Feedback

**Ripple Effect**: For buttons and interactive cards
**Scale Animation**: Brief scale(0.98) on click
**Loading State**: Disable + spinner if async action

#### Focus States

**Keyboard Navigation**:
- Outline: 2px solid primary color
- Offset: 2px
- Border radius: Inherit from element

---

### 3.4 Loading States

#### Initial Page Load

1. **Skeleton Screens** (0-500ms):
   - Layout structure visible
   - All components show skeleton placeholders
   - No flash of empty content

2. **Progressive Loading** (500ms-2s):
   - Priority 1: User info, navigation
   - Priority 2: Stats cards
   - Priority 3: Charts, recommendations
   - Priority 4: Activity feed

3. **Complete** (>2s):
   - All content loaded
   - Animations for new content appearance
   - Error handling for failed requests

#### Component Loading

**Individual Components**:
- Local spinner or skeleton within component bounds
- Preserve layout (no jumping)
- Timeout handling (show error after 10s)

#### Refresh/Update

- Subtle loading indicator (top bar or inline)
- Optimistic updates where possible
- Background refetch without disrupting UI

---

### 3.5 Empty States

#### No Applications

**Visual**:
- Icon: ClipboardList (48px)
- Illustration: Empty clipboard or search graphic
- Title: "No applications yet"
- Description: "Start applying to jobs to see your progress here"
- Action: "Browse Jobs" primary button

#### No Documents

**Visual**:
- Icon: FileText (48px)
- Title: "Create your first document"
- Description: "Build a professional resume with our AI-powered editor"
- Action: "Create Resume" primary button

#### No Recommendations

**Visual**:
- Icon: Sparkles (48px)
- Title: "Complete your profile for recommendations"
- Description: "Add your skills and preferences to get personalized job matches"
- Action: "Complete Profile" primary button

#### No Activity

**Visual**:
- Icon: Activity (48px)
- Title: "No recent activity"
- Description: "Your recent actions will appear here"
- Secondary text: "Start exploring jobs or create a document"

---

### 3.6 Error States

#### API Error

**Display**:
- Icon: AlertTriangle
- Message: "Unable to load data"
- Description: "Please check your connection and try again"
- Actions:
  - "Retry" button
  - "Use cached data" (if available)

#### Component Error

**Error Boundary**:
- Catch errors within component scope
- Display localized error message
- Rest of dashboard remains functional
- "Report issue" option

#### Network Offline

**Banner**:
- Position: Top of page (sticky)
- Background: Warning yellow
- Message: "You're offline. Some features may not work."
- Dismissible: Yes
- Auto-hide when back online

---

### 3.7 Success States & Feedback

#### Application Submitted

**Toast Notification**:
- Position: Bottom right
- Duration: 5 seconds
- Content: "Application submitted successfully!"
- Icon: CheckCircle (green)
- Action: "View Application" link

#### Goal Completed

**Modal/Celebration**:
- Confetti animation
- Icon: Trophy or PartyPopper
- Title: "Goal achieved!"
- Message: "You've reached your target of 50 applications"
- Action: "Set new goal" button

#### Document Saved

**Inline Indicator**:
- Icon: Check
- Message: "Saved" (fade in/out)
- Position: Near save button

---

## 4. User Flows

### 4.1 First-Time User Onboarding

**Goal**: Help new users understand the dashboard and take first actions

**Steps**:

1. **Welcome Screen** (Modal/Overlay)
   - Welcome message
   - Brief intro to dashboard features
   - "Take a Tour" vs "Skip to Dashboard" options

2. **Guided Tour** (If selected)
   - **Step 1**: Spotlight on Quick Actions
     - "Start here: Create your first resume or browse jobs"
   - **Step 2**: Highlight Stats Cards
     - "Track your progress as you apply"
   - **Step 3**: Show Activity Feed
     - "Stay updated on all your activities"
   - **Step 4**: Point to AI Recommendations
     - "Get personalized job suggestions"
   - **Step 5**: Navigation
     - "Explore all features from the sidebar"
   - **Complete**: "You're all set! Start your job search."

3. **Profile Completion Prompt**
   - If profile incomplete:
     - Banner: "Complete your profile to get better recommendations"
     - Progress indicator: "3 of 5 steps complete"
     - Action: "Complete Profile" button

4. **First Action Encouragement**
   - Empty state cards with clear CTAs
   - Suggested first actions:
     - "Create your first resume"
     - "Browse recommended jobs"
     - "Set your career goals"

**Visual Flow**:
```
Login Success → Welcome Modal → Guided Tour (optional) 
  ↓
Profile Completion Check → Dashboard with Empty States
  ↓
First Action → Updated Dashboard with Data
```

**Implementation Notes**:
- Store onboarding completion in user profile
- Option to restart tour from help menu
- Track onboarding completion rate
- A/B test different onboarding flows

---

### 4.2 Returning User Experience

**Goal**: Quick overview and access to relevant information

**Steps**:

1. **Dashboard Load**
   - Show cached data immediately
   - Fetch fresh data in background
   - Update UI smoothly when new data arrives

2. **Personalized Greeting**
   - Time-based: "Good morning/afternoon/evening, [Name]"
   - Context-aware: "Welcome back! You have 2 new job matches"

3. **Priority Information Display**
   - Unread notifications badge
   - Upcoming interviews highlighted
   - New recommendations badge
   - Pending actions alert

4. **Quick Re-engagement**
   - "Pick up where you left off" section (optional)
   - Recent documents quick access
   - In-progress applications
   - Draft documents

**Visual Flow**:
```
Login → Dashboard Load (cached) → Background Refresh
  ↓
Check for Updates → Highlight New Content
  ↓
User Engages → Navigate to Relevant Section
```

**Notifications Priority**:
1. Urgent: Interview reminders (< 24 hours)
2. Important: Application status changes
3. Standard: New job recommendations
4. Low: General tips and updates

---

### 4.3 Quick Action Workflows

#### Create Document Flow

**Starting Point**: Dashboard Quick Actions

**Steps**:
1. Click "Create Document" button
2. Navigate to document creation page
3. [Document creation flow continues on separate page]

**Expected Outcome**: New document created, user redirected to editor

---

#### Browse Jobs Flow

**Starting Point**: Dashboard Quick Actions

**Steps**:
1. Click "Browse Jobs" button
2. Navigate to jobs page
3. [Job browsing flow continues on separate page]

**Expected Outcome**: User finds relevant jobs, can apply or save

---

#### AI Career Chat Flow

**Starting Point**: Dashboard Quick Actions

**Steps**:
1. Click "AI Career Chat" button
2. Open chat interface (new page or modal)
3. [Chat interaction continues]

**Expected Outcome**: User gets career advice, may take action based on suggestions

---

#### Track Applications Flow

**Starting Point**: Dashboard Quick Actions or Stats Card

**Steps**:
1. Click "Track Applications" button or Applications stat card
2. Navigate to applications tracking page
3. [Application tracking flow continues]

**Expected Outcome**: User views and manages all applications

---

### 4.4 Goal Setting Flow

**Starting Point**: Goal Tracker Widget

**Steps**:
1. Click "+ Add Goal" button
2. Open goal creation modal
3. Select goal type:
   - Applications target
   - Interviews target
   - Skills to acquire
   - Timeline goal
   - Custom goal
4. Fill in details:
   - Goal title
   - Target number/date
   - Description (optional)
5. Click "Create Goal"
6. Goal appears in tracker
7. Receive progress updates
8. Celebrate when achieved

**Visual Flow**:
```
Click Add Goal → Select Type → Enter Details
  ↓
Create Goal → Appears in Widget → Track Progress
  ↓
Achieve Goal → Celebration Animation → Set New Goal
```

---

### 4.5 Recommendation Interaction Flow

**Starting Point**: AI Recommendations Card

**Steps**:

**For Job Recommendation**:
1. View recommended job card
2. Click to view full details
3. Options:
   - Apply now → Application flow
   - Save for later → Added to saved jobs
   - Not interested → Feedback modal, hide card

**For Document Suggestion**:
1. View suggestion card
2. Click "Review Suggestions"
3. Navigate to document with suggestions highlighted
4. User can accept/reject suggestions

**For Skill Gap Alert**:
1. View skill gap card
2. Click "View Learning Resources"
3. Navigate to learning resources or external links
4. Track skill acquisition progress

---

## 5. Data Requirements

### 5.1 Dashboard Metrics & KPIs

#### User Stats

**Required Data**:
```typescript
interface UserStats {
  totalApplications: number;
  applicationsThisWeek: number;
  applicationsThisMonth: number;
  totalInterviews: number;
  upcomingInterviews: number;
  successRate: number; // percentage
  responseRate: number; // percentage
  averageResponseTime: number; // in days
  totalDocuments: number;
  activeDocuments: number;
  profileCompleteness: number; // percentage
}
```

**API Endpoint**: `GET /api/v1/dashboard/stats`

**Response Example**:
```json
{
  "stats": {
    "totalApplications": 24,
    "applicationsThisWeek": 3,
    "applicationsThisMonth": 12,
    "totalInterviews": 5,
    "upcomingInterviews": 2,
    "successRate": 38.5,
    "responseRate": 45.2,
    "averageResponseTime": 7,
    "totalDocuments": 8,
    "activeDocuments": 4,
    "profileCompleteness": 85
  },
  "trends": {
    "applications": {
      "change": 3,
      "changePercentage": 14.3,
      "direction": "up"
    },
    "successRate": {
      "change": 2.5,
      "changePercentage": 6.9,
      "direction": "up"
    }
  }
}
```

---

#### Application Timeline Data

**Required Data**:
```typescript
interface TimelineData {
  period: string; // ISO date string
  applications: number;
  responses: number;
  interviews: number;
  offers: number;
}

interface ApplicationTimeline {
  timeRange: '7d' | '30d' | '90d' | '1y' | 'all';
  data: TimelineData[];
}
```

**API Endpoint**: `GET /api/v1/dashboard/timeline?range=30d`

**Response Example**:
```json
{
  "timeRange": "30d",
  "data": [
    {
      "period": "2025-10-08",
      "applications": 3,
      "responses": 1,
      "interviews": 0,
      "offers": 0
    },
    {
      "period": "2025-10-15",
      "applications": 5,
      "responses": 2,
      "interviews": 1,
      "offers": 0
    }
    // ... more data points
  ]
}
```

---

### 5.2 Activity Feed Data Structure

**Required Data**:
```typescript
interface ActivityItem {
  id: string;
  userId: string;
  type: 'application' | 'document' | 'interview' | 'recommendation' | 'status_change' | 'goal_achieved' | 'profile_update';
  title: string;
  description?: string;
  timestamp: string; // ISO date string
  metadata: {
    // Type-specific metadata
    jobTitle?: string;
    companyName?: string;
    documentName?: string;
    documentId?: string;
    applicationId?: string;
    interviewDate?: string;
    status?: string;
    goalName?: string;
  };
  read: boolean;
  actionUrl?: string; // URL to navigate to
}

interface ActivityFeed {
  activities: ActivityItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

**API Endpoint**: `GET /api/v1/dashboard/activity?page=1&limit=10`

**Response Example**:
```json
{
  "activities": [
    {
      "id": "act_123456",
      "userId": "user_789",
      "type": "application",
      "title": "Applied to Senior Software Engineer at TechCorp",
      "description": "Your application has been submitted",
      "timestamp": "2025-11-07T10:30:00Z",
      "metadata": {
        "jobTitle": "Senior Software Engineer",
        "companyName": "TechCorp",
        "applicationId": "app_456"
      },
      "read": false,
      "actionUrl": "/applications/app_456"
    },
    {
      "id": "act_123457",
      "userId": "user_789",
      "type": "interview",
      "title": "Interview scheduled with DataSystems Inc.",
      "description": "Phone screening on Nov 15 at 2:00 PM",
      "timestamp": "2025-11-06T14:20:00Z",
      "metadata": {
        "companyName": "DataSystems Inc.",
        "interviewDate": "2025-11-15T14:00:00Z",
        "applicationId": "app_445"
      },
      "read": true,
      "actionUrl": "/applications/app_445"
    }
  ],
  "totalCount": 47,
  "page": 1,
  "pageSize": 10,
  "hasMore": true
}
```

---

### 5.3 AI Recommendations Data

#### Job Recommendations

**Required Data**:
```typescript
interface JobRecommendation {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  locationType: 'remote' | 'hybrid' | 'onsite';
  matchScore: number; // 0-100
  matchingSkills: string[];
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  postedDate: string; // ISO date
  description: string;
  matchReasons: string[]; // Why this job is recommended
  applicationUrl: string;
}

interface RecommendationsResponse {
  jobRecommendations: JobRecommendation[];
  documentSuggestions: DocumentSuggestion[];
  skillGaps: SkillGapRecommendation[];
  lastUpdated: string; // ISO date
}
```

**API Endpoint**: `GET /api/v1/dashboard/recommendations`

**Response Example**:
```json
{
  "jobRecommendations": [
    {
      "id": "rec_job_001",
      "jobId": "job_789",
      "jobTitle": "Senior Frontend Developer",
      "companyName": "InnovateTech",
      "companyLogo": "https://cdn.example.com/logos/innovatetech.png",
      "location": "San Francisco, CA",
      "locationType": "hybrid",
      "matchScore": 92,
      "matchingSkills": ["React", "TypeScript", "Tailwind CSS"],
      "salaryRange": {
        "min": 120000,
        "max": 160000,
        "currency": "USD"
      },
      "postedDate": "2025-11-05T00:00:00Z",
      "description": "We're looking for an experienced frontend developer...",
      "matchReasons": [
        "Your React skills match job requirements",
        "Similar role to your experience",
        "Located in your preferred location"
      ],
      "applicationUrl": "/jobs/job_789"
    }
  ],
  "documentSuggestions": [
    {
      "id": "rec_doc_001",
      "title": "Optimize your resume for tech roles",
      "description": "AI detected areas for improvement in your resume",
      "priority": "high",
      "documentId": "doc_456",
      "suggestions": [
        "Add more quantifiable achievements",
        "Highlight leadership experience",
        "Include relevant certifications"
      ]
    }
  ],
  "skillGaps": [
    {
      "id": "rec_skill_001",
      "title": "Top skills for your target roles",
      "description": "Based on analysis of jobs you're interested in",
      "skills": [
        {
          "name": "System Design",
          "currentLevel": 3,
          "targetLevel": 5,
          "importance": "high",
          "resources": [
            {
              "title": "System Design Interview Course",
              "url": "https://example.com/course",
              "type": "course"
            }
          ]
        }
      ]
    }
  ],
  "lastUpdated": "2025-11-07T08:00:00Z"
}
```

---

### 5.4 Goals Data

**Required Data**:
```typescript
interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  type: 'applications' | 'interviews' | 'skills' | 'timeline' | 'custom';
  target: number;
  current: number;
  unit: string; // 'applications', 'interviews', 'days', etc.
  dueDate?: string; // ISO date
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  completedAt?: string; // ISO date
}

interface GoalsResponse {
  goals: Goal[];
  totalCompleted: number;
  totalActive: number;
}
```

**API Endpoints**:
- `GET /api/v1/dashboard/goals` - Fetch all goals
- `POST /api/v1/dashboard/goals` - Create new goal
- `PUT /api/v1/dashboard/goals/:id` - Update goal progress
- `DELETE /api/v1/dashboard/goals/:id` - Delete goal

**Response Example**:
```json
{
  "goals": [
    {
      "id": "goal_001",
      "userId": "user_789",
      "title": "Apply to 50 jobs",
      "description": "Submit applications to 50 relevant positions",
      "type": "applications",
      "target": 50,
      "current": 24,
      "unit": "applications",
      "dueDate": "2025-12-31T23:59:59Z",
      "status": "in_progress",
      "createdAt": "2025-10-01T00:00:00Z",
      "updatedAt": "2025-11-07T10:30:00Z"
    },
    {
      "id": "goal_002",
      "userId": "user_789",
      "title": "Complete AWS certification",
      "description": "Get AWS Solutions Architect certification",
      "type": "skills",
      "target": 1,
      "current": 0,
      "unit": "certifications",
      "dueDate": "2025-11-30T23:59:59Z",
      "status": "in_progress",
      "createdAt": "2025-10-15T00:00:00Z",
      "updatedAt": "2025-10-15T00:00:00Z"
    }
  ],
  "totalCompleted": 3,
  "totalActive": 2
}
```

---

### 5.5 User Profile Data

**Required for Dashboard Personalization**:
```typescript
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'job_seeker' | 'career_coach';
  profileCompleteness: number; // percentage
  preferences: {
    jobTypes: string[];
    locations: string[];
    salaryRange?: {
      min: number;
      max: number;
      currency: string;
    };
    remotePreference: 'remote' | 'hybrid' | 'onsite' | 'any';
  };
  skills: string[];
  experience: {
    years: number;
    level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  };
  targetRoles: string[];
  createdAt: string;
  lastLoginAt: string;
}
```

**API Endpoint**: `GET /api/v1/users/me`

---

### 5.6 Real-Time Updates

#### WebSocket Events

**Connection**: `wss://api.careersu.com/ws?userId={userId}&token={authToken}`

**Event Types**:

1. **New Recommendation**
```json
{
  "type": "recommendation.new",
  "data": {
    "count": 3,
    "message": "You have new job recommendations"
  }
}
```

2. **Application Status Update**
```json
{
  "type": "application.status_changed",
  "data": {
    "applicationId": "app_456",
    "jobTitle": "Senior Software Engineer",
    "companyName": "TechCorp",
    "oldStatus": "submitted",
    "newStatus": "under_review"
  }
}
```

3. **Goal Achievement**
```json
{
  "type": "goal.achieved",
  "data": {
    "goalId": "goal_001",
    "goalTitle": "Apply to 50 jobs"
  }
}
```

4. **Interview Reminder**
```json
{
  "type": "interview.reminder",
  "data": {
    "applicationId": "app_445",
    "companyName": "DataSystems Inc.",
    "interviewDate": "2025-11-15T14:00:00Z",
    "minutesUntil": 60
  }
}
```

**Implementation**:
- Use WebSocket for real-time updates
- Fallback to polling (30-second interval) if WebSocket unavailable
- Show toast notifications for important events
- Update relevant dashboard components in real-time
- Batch updates to avoid UI thrashing

---

### 5.7 Caching Strategy

#### Local Storage

**Cached Data**:
- User profile (expires: 1 hour)
- Dashboard stats (expires: 5 minutes)
- Activity feed (expires: 2 minutes)
- Recommendations (expires: 1 hour)

**Keys**:
```typescript
const CACHE_KEYS = {
  USER_PROFILE: 'careersu_user_profile',
  DASHBOARD_STATS: 'careersu_dashboard_stats',
  ACTIVITY_FEED: 'careersu_activity_feed',
  RECOMMENDATIONS: 'careersu_recommendations',
  GOALS: 'careersu_goals',
};
```

#### Service Worker

- Cache static assets (JS, CSS, images)
- Implement stale-while-revalidate for API responses
- Offline support for critical features

---

## 6. File Structure

### 6.1 Component Organization

```
src/
├── components/
│   ├── dashboard/
│   │   ├── index.ts                          # Barrel export
│   │   ├── DashboardLayout.tsx               # Main layout wrapper
│   │   ├── DashboardHeader.tsx               # Top header bar
│   │   ├── NavigationSidebar.tsx             # Side navigation
│   │   ├── WelcomeBanner.tsx                 # Personalized greeting
│   │   ├── QuickActionsCard.tsx              # Quick action buttons
│   │   ├── StatsCards/
│   │   │   ├── index.tsx                     # Stats cards container
│   │   │   ├── StatCard.tsx                  # Individual stat card
│   │   │   ├── ApplicationsCard.tsx          # Applications stat
│   │   │   ├── InterviewsCard.tsx            # Interviews stat
│   │   │   ├── SuccessRateCard.tsx           # Success rate stat
│   │   │   └── DocumentsCard.tsx             # Documents stat
│   │   ├── RecentActivityFeed/
│   │   │   ├── index.tsx                     # Feed container
│   │   │   ├── ActivityItem.tsx              # Single activity item
│   │   │   ├── ActivityIcon.tsx              # Icon component
│   │   │   └── ActivityFilters.tsx           # Filter dropdown
│   │   ├── AIRecommendationsCard/
│   │   │   ├── index.tsx                     # Recommendations container
│   │   │   ├── JobRecommendation.tsx         # Job recommendation card
│   │   │   ├── DocumentSuggestion.tsx        # Document suggestion card
│   │   │   ├── SkillGapAlert.tsx             # Skill gap card
│   │   │   └── RecommendationCarousel.tsx    # Carousel wrapper
│   │   ├── ProgressChart/
│   │   │   ├── index.tsx                     # Chart container
│   │   │   ├── ApplicationTimelineChart.tsx  # Timeline chart
│   │   │   ├── ApplicationFunnelChart.tsx    # Funnel chart
│   │   │   ├── SuccessRateChart.tsx          # Success rate chart
│   │   │   └── ChartControls.tsx             # Time range selector
│   │   ├── GoalTrackerWidget/
│   │   │   ├── index.tsx                     # Goals widget container
│   │   │   ├── GoalCard.tsx                  # Individual goal card
│   │   │   ├── GoalProgressBar.tsx           # Progress bar component
│   │   │   ├── AddGoalModal.tsx              # Create goal modal
│   │   │   └── EditGoalModal.tsx             # Edit goal modal
│   │   ├── EmptyStates/
│   │   │   ├── EmptyApplications.tsx         # No applications state
│   │   │   ├── EmptyDocuments.tsx            # No documents state
│   │   │   ├── EmptyRecommendations.tsx      # No recommendations state
│   │   │   └── EmptyActivity.tsx             # No activity state
│   │   ├── LoadingStates/
│   │   │   ├── DashboardSkeleton.tsx         # Full page skeleton
│   │   │   ├── StatsCardSkeleton.tsx         # Stat card skeleton
│   │   │   ├── ActivityFeedSkeleton.tsx      # Feed skeleton
│   │   │   ├── RecommendationSkeleton.tsx    # Recommendation skeleton
│   │   │   └── ChartSkeleton.tsx             # Chart skeleton
│   │   ├── ErrorStates/
│   │   │   ├── ErrorBoundary.tsx             # Error boundary HOC
│   │   │   ├── ErrorCard.tsx                 # Error display card
│   │   │   └── OfflineBanner.tsx             # Offline indicator
│   │   └── Onboarding/
│   │       ├── OnboardingModal.tsx           # Welcome modal
│   │       ├── OnboardingTour.tsx            # Product tour
│   │       ├── TourStep.tsx                  # Single tour step
│   │       └── ProfileCompletionBanner.tsx   # Profile prompt
│   │
│   └── ui/                                    # Radix UI base components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── progress.tsx
│       ├── skeleton.tsx
│       ├── toast.tsx
│       ├── tooltip.tsx
│       └── ... (other Radix UI components)
│
├── pages/
│   ├── DashboardPage.tsx                     # Main dashboard page
│   └── ... (other pages)
│
├── hooks/
│   ├── dashboard/
│   │   ├── useDashboardStats.ts              # Fetch dashboard stats
│   │   ├── useActivityFeed.ts                # Fetch activity feed
│   │   ├── useRecommendations.ts             # Fetch recommendations
│   │   ├── useGoals.ts                       # Goals CRUD operations
│   │   ├── useTimelineData.ts                # Chart data fetching
│   │   └── useRealTimeUpdates.ts             # WebSocket connection
│   ├── useAuth.ts                            # Authentication hook
│   ├── useUser.ts                            # User profile hook
│   └── useToast.ts                           # Toast notifications
│
├── services/
│   ├── api/
│   │   ├── dashboard.ts                      # Dashboard API calls
│   │   ├── activities.ts                     # Activity feed API
│   │   ├── recommendations.ts                # Recommendations API
│   │   ├── goals.ts                          # Goals API
│   │   └── websocket.ts                      # WebSocket service
│   ├── cache/
│   │   ├── localStorage.ts                   # Local storage wrapper
│   │   └── cacheManager.ts                   # Cache management
│   └── analytics/
│       └── tracker.ts                        # Analytics tracking
│
├── types/
│   ├── dashboard.ts                          # Dashboard type definitions
│   ├── activity.ts                           # Activity feed types
│   ├── recommendation.ts                     # Recommendation types
│   ├── goal.ts                               # Goal types
│   └── user.ts                               # User types
│
├── utils/
│   ├── dateFormatters.ts                     # Date formatting utilities
│   ├── numberFormatters.ts                   # Number formatting
│   ├── chartHelpers.ts                       # Chart data processing
│   └── dashboardHelpers.ts                   # Dashboard-specific utilities
│
├── constants/
│   ├── dashboard.ts                          # Dashboard constants
│   ├── colors.ts                             # Color palette
│   └── animations.ts                         # Animation configs
│
└── styles/
    ├── dashboard.css                         # Dashboard-specific styles
    └── globals.css                           # Global styles
```

---

### 6.2 Key Files Detail

#### src/pages/DashboardPage.tsx

**Purpose**: Main dashboard page component

**Responsibilities**:
- Fetch all dashboard data
- Manage page-level state
- Handle real-time updates
- Coordinate sub-components
- Error boundary wrapping

**Structure**:
```typescript
import React, { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { AIRecommendationsCard } from '@/components/dashboard/AIRecommendationsCard';
import { ProgressChart } from '@/components/dashboard/ProgressChart';
import { GoalTrackerWidget } from '@/components/dashboard/GoalTrackerWidget';
import { useDashboardStats } from '@/hooks/dashboard/useDashboardStats';
import { useActivityFeed } from '@/hooks/dashboard/useActivityFeed';
import { useRecommendations } from '@/hooks/dashboard/useRecommendations';
import { useGoals } from '@/hooks/dashboard/useGoals';
import { useRealTimeUpdates } from '@/hooks/dashboard/useRealTimeUpdates';

export function DashboardPage() {
  const { stats, loading: statsLoading, error: statsError } = useDashboardStats();
  const { activities, loading: activitiesLoading } = useActivityFeed();
  const { recommendations, loading: recsLoading } = useRecommendations();
  const { goals, loading: goalsLoading } = useGoals();
  
  // Setup real-time updates
  useRealTimeUpdates({
    onApplicationUpdate: (data) => {
      // Handle application status update
    },
    onNewRecommendation: (data) => {
      // Handle new recommendation
    },
    onGoalAchieved: (data) => {
      // Show celebration
    },
  });

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <DashboardHeader title="Dashboard" />
        
        <div className="dashboard-content">
          <WelcomeBanner user={user} />
          
          <div className="dashboard-grid">
            <QuickActionsCard />
            
            <StatsCards 
              stats={stats} 
              loading={statsLoading} 
              error={statsError} 
            />
            
            <div className="dashboard-two-column">
              <RecentActivityFeed 
                activities={activities}
                loading={activitiesLoading}
              />
              
              <AIRecommendationsCard 
                recommendations={recommendations}
                loading={recsLoading}
              />
            </div>
            
            <ProgressChart data={stats?.timeline} />
            
            <GoalTrackerWidget 
              goals={goals}
              loading={goalsLoading}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
```

---

#### src/hooks/dashboard/useDashboardStats.ts

**Purpose**: Custom hook for fetching dashboard statistics

**Implementation**:
```typescript
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/services/api/dashboard';
import { useCache } from '@/hooks/useCache';

export function useDashboardStats() {
  const { getCached, setCache } = useCache();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      // Try cache first
      const cached = getCached('dashboard_stats');
      if (cached) return cached;
      
      // Fetch fresh data
      const response = await dashboardApi.getStats();
      setCache('dashboard_stats', response, 5 * 60 * 1000); // 5 min cache
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });

  return {
    stats: data,
    loading: isLoading,
    error,
    refetch,
  };
}
```

---

#### src/services/api/dashboard.ts

**Purpose**: API service for dashboard endpoints

**Implementation**:
```typescript
import { apiClient } from './client';
import type { DashboardStats, ActivityFeed, Recommendations } from '@/types/dashboard';

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  async getActivityFeed(page = 1, limit = 10): Promise<ActivityFeed> {
    const response = await apiClient.get('/dashboard/activity', {
      params: { page, limit },
    });
    return response.data;
  },

  async getRecommendations(): Promise<Recommendations> {
    const response = await apiClient.get('/dashboard/recommendations');
    return response.data;
  },

  async getTimeline(range: string): Promise<TimelineData[]> {
    const response = await apiClient.get('/dashboard/timeline', {
      params: { range },
    });
    return response.data;
  },
};
```

---

## 7. Technical Implementation Notes

### 7.1 Performance Optimization

#### Code Splitting

```typescript
// Lazy load heavy components
const ProgressChart = lazy(() => import('@/components/dashboard/ProgressChart'));
const AIRecommendationsCard = lazy(() => import('@/components/dashboard/AIRecommendationsCard'));

// Use Suspense for loading states
<Suspense fallback={<ChartSkeleton />}>
  <ProgressChart data={timelineData} />
</Suspense>
```

#### Memoization

```typescript
// Memoize expensive calculations
const processedStats = useMemo(() => {
  return calculateStatistics(rawData);
}, [rawData]);

// Memoize components
const MemoizedActivityItem = memo(ActivityItem);
```

#### Virtual Scrolling

```typescript
// For long activity feeds
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: activities.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 80,
});
```

---

### 7.2 Accessibility

#### Keyboard Navigation

- All interactive elements focusable
- Tab order logical and intuitive
- Arrow keys for carousel navigation
- Escape to close modals/dropdowns
- Enter/Space to activate buttons

#### ARIA Labels

```typescript
<button
  aria-label="Create new resume"
  aria-describedby="create-resume-description"
>
  <FileText className="w-6 h-6" />
  <span>Create Resume</span>
</button>

<div id="create-resume-description" className="sr-only">
  Start creating your resume from professional templates
</div>
```

#### Screen Reader Support

- Semantic HTML elements
- ARIA landmarks
- Live regions for dynamic updates
- Descriptive link text
- Form labels properly associated

#### Color Contrast

- WCAG 2.1 AA minimum (4.5:1 for normal text)
- AAA preferred (7:1 for normal text)
- Test with contrast checker tools
- Don't rely solely on color for information

---

### 7.3 Testing Strategy

#### Unit Tests

**Test Coverage**:
- All custom hooks
- Utility functions
- Data processing functions
- Component logic

**Example**:
```typescript
// useDashboardStats.test.ts
describe('useDashboardStats', () => {
  it('should fetch stats on mount', async () => {
    const { result } = renderHook(() => useDashboardStats());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.stats).toBeDefined();
  });

  it('should handle error states', async () => {
    // Mock API error
    server.use(
      rest.get('/api/dashboard/stats', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const { result } = renderHook(() => useDashboardStats());
    
    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });
});
```

#### Integration Tests

**Test Scenarios**:
- Full dashboard rendering
- User interactions (clicks, navigation)
- Data updates and refresh
- Error handling and recovery

#### E2E Tests

**Critical Flows**:
- Login → Dashboard load
- Dashboard → Create document
- Dashboard → Browse jobs
- Dashboard → AI chat
- Goal creation and completion
- Real-time updates

---

### 7.4 Analytics Tracking

#### Events to Track

```typescript
// Dashboard view
analytics.track('Dashboard Viewed', {
  userId: user.id,
  timestamp: new Date(),
});

// Quick action clicks
analytics.track('Quick Action Clicked', {
  action: 'create_document',
  source: 'dashboard',
});

// Stat card interactions
analytics.track('Stat Card Clicked', {
  cardType: 'applications',
  currentValue: 24,
});

// Activity feed interactions
analytics.track('Activity Item Clicked', {
  activityType: 'application',
  activityId: 'act_123',
});

// Recommendation interactions
analytics.track('Recommendation Clicked', {
  recommendationType: 'job',
  matchScore: 92,
  jobId: 'job_789',
});

// Goal interactions
analytics.track('Goal Created', {
  goalType: 'applications',
  target: 50,
});

// Chart interactions
analytics.track('Chart Time Range Changed', {
  chartType: 'application_timeline',
  newRange: '30d',
});
```

---

### 7.5 Error Handling

#### Error Boundary Implementation

```typescript
class DashboardErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to error tracking service
    errorTracker.captureException(error, {
      context: 'DashboardErrorBoundary',
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorCard
          title="Something went wrong"
          description="We're having trouble loading the dashboard"
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}
```

#### API Error Handling

```typescript
try {
  const stats = await dashboardApi.getStats();
  return stats;
} catch (error) {
  if (error.status === 401) {
    // Unauthorized - redirect to login
    router.push('/login');
  } else if (error.status === 500) {
    // Server error - show error message
    toast.error('Unable to load dashboard data. Please try again.');
  } else if (error.status === 404) {
    // Not found - show empty state
    return null;
  } else {
    // Unknown error
    toast.error('An unexpected error occurred');
  }
  
  throw error;
}
```

---

### 7.6 Security Considerations

#### Data Protection

- All API calls authenticated with JWT token
- Token stored in httpOnly cookie (not localStorage)
- CSRF protection enabled
- XSS protection via content security policy

#### Input Validation

- Validate all user inputs (goal creation, etc.)
- Sanitize data before rendering
- Prevent injection attacks

#### Sensitive Data

- Don't log sensitive user data
- Mask PII in error reports
- Secure WebSocket connections (WSS)

---

### 7.7 Browser Support

**Supported Browsers**:
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: iOS 14+
- Chrome Mobile: Android 10+

**Polyfills**:
- Intersection Observer (for lazy loading)
- ResizeObserver (for responsive components)
- Web Animations API (for complex animations)

---

### 7.8 Progressive Enhancement

#### Core Functionality

Works without JavaScript:
- View cached dashboard data
- Navigate via links
- Basic styling maintained

#### Enhanced Features (Requires JS)

- Real-time updates
- Interactive charts
- Smooth animations
- Modal interactions
- Form validation

---

## 8. Appendix

### 8.1 Related Documentation

- [Design System Documentation](#)
- [API Documentation](#)
- [Component Library Storybook](#)
- [User Research Findings](#)
- [Accessibility Guidelines](#)

### 8.2 Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-07 | Initial | Complete UI plan created |

### 8.3 Feedback & Iterations

**Feedback Process**:
1. Share with design team for review
2. Present to stakeholders
3. Conduct user testing with prototype
4. Iterate based on feedback
5. Final approval before development

**Open Questions**:
1. Should we include a "Recent Documents" quick access widget?
2. Do we need a separate onboarding flow for returning users?
3. Should goals be collapsible to save space?
4. Include a dark mode toggle?
5. Add export functionality for stats/reports?

---

## Summary

This UI plan provides comprehensive specifications for building the Job Seeker Dashboard for the CareerSU platform. It includes:

- **Screen inventory** with all views and states
- **Detailed component breakdown** with props, visual design, and interactions
- **Complete specifications** for every dashboard element
- **User flows** covering onboarding and key interactions
- **Data requirements** with API endpoints and response formats
- **File structure** showing component organization
- **Technical implementation** notes for performance, accessibility, and testing

The dashboard is designed to be:
- **User-centric**: Clear information hierarchy and intuitive navigation
- **Performance-focused**: Optimized loading, caching, and real-time updates
- **Accessible**: WCAG 2.1 AA compliant with keyboard navigation support
- **Responsive**: Works seamlessly across desktop, tablet, and mobile devices
- **Scalable**: Modular component architecture for easy maintenance and expansion

This plan serves as the single source of truth for implementing the Job Seeker Dashboard and should be referenced throughout the development process.

