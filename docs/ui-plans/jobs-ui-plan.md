# Jobs Page & Job Details - Comprehensive UI Plan

**Project**: CareerSU Platform  
**Version**: 1.0.0  
**Last Updated**: November 7, 2025  
**Tech Stack**: React 18.3.1, TypeScript, Vite, Tailwind CSS, Radix UI, Lucide Icons

---

## Table of Contents

1. [Screen Inventory](#1-screen-inventory)
2. [Component Breakdown](#2-component-breakdown)
3. [Detailed Specifications](#3-detailed-specifications)
4. [User Flows](#4-user-flows)
5. [Data Requirements](#5-data-requirements)
6. [File Structure](#6-file-structure)
7. [Implementation Phases](#7-implementation-phases)

---

## 1. Screen Inventory

### 1.1 Jobs Browse/Search Page (`/jobs`)

**Purpose**: Main job discovery interface with advanced search, filtering, and AI-powered matching.

**Key Elements**:
- Search bar with keyword, location, and company filters
- Advanced filter panel (collapsible on mobile)
- Job cards grid/list view toggle
- AI match score indicators
- Pagination with infinite scroll option
- Sort controls (relevance, date, salary, match score)
- Active filters display with quick clear
- Results count and search context

**Layout**: 
```
┌─────────────────────────────────────────────────┐
│ Header: Search Bar + View Toggle + Sort        │
├───────────┬─────────────────────────────────────┤
│           │                                     │
│  Filters  │   Job Cards Grid                    │
│  Panel    │   (2-3 columns responsive)          │
│           │                                     │
│  [Sticky] │   [Scrollable]                      │
│           │                                     │
└───────────┴─────────────────────────────────────┘
```

---

### 1.2 Job Details Page (`/jobs/:jobId`)

**Purpose**: Comprehensive view of a single job posting with application actions.

**Key Elements**:
- Job header (title, company, location, posted date)
- AI match score with breakdown
- Company profile card
- Job description with formatted sections
- Requirements and qualifications lists
- Salary and benefits information
- Similar jobs recommendations
- Application tracking status (if already applied)
- Action buttons (Save, Apply, Share)
- Company culture insights
- Application deadline countdown

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Job Header + Match Score + Actions             │
├───────────────────────┬─────────────────────────┤
│                       │                         │
│  Main Content         │   Sidebar               │
│  - Description        │   - Company Card        │
│  - Requirements       │   - Quick Apply         │
│  - Responsibilities   │   - Similar Jobs        │
│  - Benefits           │   - Share Options       │
│                       │                         │
└───────────────────────┴─────────────────────────┘
```

---

### 1.3 Application Modal/Page (`/jobs/:jobId/apply`)

**Purpose**: Streamlined application submission with document selection.

**Key Elements**:
- Multi-step form (Document Selection → Review → Submit)
- Resume/CV selector with preview
- Cover letter option (use existing or generate with AI)
- Additional questions form (if required)
- Application preview
- Success confirmation with tracking number
- Auto-fill from profile

**Layout**: Modal (desktop) / Full Page (mobile)

---

### 1.4 Saved Jobs Page (`/jobs/saved`)

**Purpose**: Collection of jobs bookmarked by user for later review.

**Key Elements**:
- Compact job cards with save date
- Organize by folders/tags
- Bulk actions (remove, apply to multiple)
- Sort by match score, save date, application deadline
- Quick apply from saved list
- Notes field per saved job

**Layout**: Similar to main jobs page but simplified

---

### 1.5 Application Tracker Page (`/applications`)

**Purpose**: Dashboard to monitor all job applications and their statuses.

**Key Elements**:
- Application cards with status badges
- Timeline view of application progress
- Filter by status (submitted, reviewing, interview, rejected, accepted)
- Interview scheduler integration
- Follow-up reminders
- Analytics (response rate, avg. time to response)
- Document version tracking per application

**Layout**:
```
┌─────────────────────────────────────────────────┐
│ Stats Overview (Total, Pending, Interview, etc)│
├─────────────────────────────────────────────────┤
│ Filter Tabs: All | Submitted | Interview | ... │
├─────────────────────────────────────────────────┤
│                                                 │
│  Application Cards (Timeline/Kanban View)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Search & Filter Components

#### SearchBar Component
```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
}
```

**Features**:
- Real-time search with debouncing (300ms)
- Autocomplete suggestions from job titles, companies, skills
- Recent searches history (max 10)
- Clear button
- Search icon with loading state
- Keyboard navigation (arrow keys, Enter, Escape)

**Radix UI Components**: `@radix-ui/react-popover` for suggestions dropdown

---

#### FilterPanel Component
```typescript
interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  isCollapsed?: boolean;
}

interface FilterState {
  location: LocationFilter;
  salary: SalaryRange;
  jobType: JobType[];
  experienceLevel: ExperienceLevel[];
  skills: string[];
  companySize: CompanySize[];
  remote: RemoteOption;
  postedDate: DateRange;
  matchScoreMin: number;
}
```

**Filter Categories**:

1. **Location Filter**
   - City/State autocomplete
   - Radius selector (10, 25, 50, 100 miles)
   - Remote toggle
   - Multiple locations support

2. **Salary Range**
   - Dual range slider (Radix Slider)
   - Min/Max input fields
   - Currency selector (USD default)
   - Annual/Hourly toggle

3. **Job Type** (Multi-select)
   - Full-time
   - Part-time
   - Contract
   - Temporary
   - Internship

4. **Experience Level** (Multi-select)
   - Entry Level
   - Mid Level
   - Senior Level
   - Lead/Manager
   - Executive

5. **Skills** (Tag-based multi-select)
   - Autocomplete from skill database
   - Required vs. Preferred toggle
   - Skill match percentage threshold

6. **Company Size**
   - Startup (1-50)
   - Small (51-200)
   - Medium (201-1000)
   - Large (1001-10000)
   - Enterprise (10000+)

7. **Remote Options**
   - On-site
   - Hybrid
   - Remote

8. **Posted Date**
   - Last 24 hours
   - Last 7 days
   - Last 30 days
   - Custom range

9. **AI Match Score**
   - Minimum match percentage slider
   - Only show jobs above X% match

**Radix UI Components**:
- `@radix-ui/react-checkbox` for multi-select options
- `@radix-ui/react-slider` for range inputs
- `@radix-ui/react-collapsible` for expandable sections
- `@radix-ui/react-accordion` for filter categories
- `@radix-ui/react-switch` for toggles

---

#### ActiveFilters Component
```typescript
interface ActiveFiltersProps {
  filters: FilterState;
  onRemoveFilter: (filterKey: string, value?: any) => void;
  onClearAll: () => void;
}
```

**Features**:
- Display active filters as removable chips
- Clear all button
- Filter count badge
- Smooth animations on add/remove

**UI**: Horizontal scrollable pill list with X buttons

---

### 2.2 Job Card Components

#### JobCard Component
```typescript
interface JobCardProps {
  job: Job;
  view: 'grid' | 'list';
  onSave: (jobId: string) => void;
  onApply: (jobId: string) => void;
  onClick: (jobId: string) => void;
  isSaved?: boolean;
  hasApplied?: boolean;
}
```

**Grid View Layout** (Card ~350px width):
```
┌────────────────────────────────────────┐
│ [Logo] Company Name      [Save Icon]  │
│                                        │
│ Job Title                              │
│ Location • Job Type • Remote          │
│                                        │
│ [AI Match: 85%] [Salary Range]        │
│                                        │
│ Skills: React, TypeScript, Node.js +2  │
│                                        │
│ Posted 2 days ago                      │
│                                        │
│ [Quick Apply Button]                   │
└────────────────────────────────────────┘
```

**List View Layout** (Full width):
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Job Title                                    [Save Icon] │
│       Company Name • Location • Job Type                        │
│       Skills: React, TypeScript, Node.js                        │
│       [AI: 85%] Salary: $80k-$120k Posted: 2 days  [Apply]    │
└─────────────────────────────────────────────────────────────────┘
```

**States**:
- Default
- Hover (slight elevation, border highlight)
- Saved (filled bookmark icon)
- Applied (badge "Applied on [date]")
- Expired (grayed out, "No longer accepting applications")

**Radix UI Components**:
- `@radix-ui/react-hover-card` for preview on hover
- `@radix-ui/react-context-menu` for right-click actions

---

#### MatchScoreIndicator Component
```typescript
interface MatchScoreIndicatorProps {
  score: number; // 0-100
  breakdown?: MatchBreakdown;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

interface MatchBreakdown {
  skillsMatch: number;
  experienceMatch: number;
  locationMatch: number;
  salaryMatch: number;
  cultureMatch: number;
}
```

**Visual Design**:
- Circular progress indicator (using Radix Progress)
- Color gradient: 
  - 0-40%: Red (#EF4444)
  - 41-70%: Yellow (#F59E0B)
  - 71-100%: Green (#10B981)
- Percentage text in center
- Tooltip on hover showing breakdown

**Breakdown Tooltip**:
```
AI Match Score: 85%
─────────────────────
✓ Skills Match: 92%
✓ Experience: 88%
✓ Location: 100%
✓ Salary: 75%
✓ Culture Fit: 70%
```

**Radix UI Components**:
- `@radix-ui/react-progress` for circular indicator
- `@radix-ui/react-tooltip` for breakdown display

---

### 2.3 Job Details Components

#### JobHeader Component
```typescript
interface JobHeaderProps {
  job: Job;
  matchScore: number;
  onSave: () => void;
  onApply: () => void;
  onShare: () => void;
  isSaved: boolean;
  applicationStatus?: ApplicationStatus;
}
```

**Layout**:
```
┌────────────────────────────────────────────────────────┐
│  [Company Logo]                                        │
│  Senior Software Engineer                              │
│  TechCorp Inc. • San Francisco, CA • Remote           │
│  Posted 3 days ago • 47 applicants                     │
│                                                        │
│  [AI Match: 85%]  $120k-$160k/year                    │
│                                                        │
│  [💾 Save]  [📤 Share]  [Apply Now ➜]                │
└────────────────────────────────────────────────────────┘
```

**Features**:
- Breadcrumb navigation (Jobs > Category > Job Title)
- Status banner if already applied
- Quick actions toolbar
- Application deadline countdown (if applicable)

---

#### CompanyCard Component
```typescript
interface CompanyCardProps {
  company: Company;
  stats?: CompanyStats;
}

interface Company {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  founded: number;
  website: string;
  description: string;
  locations: string[];
  benefits: string[];
  culture: CultureTags[];
}
```

**Card Layout** (Sidebar):
```
┌─────────────────────────────┐
│  [Company Logo]             │
│  TechCorp Inc.              │
│  Software & Technology      │
│                             │
│  👥 1000-5000 employees     │
│  📍 10 locations            │
│  🏢 Founded 2010            │
│                             │
│  [View Company Page ➜]      │
│                             │
│  ⭐ 4.2/5 on Glassdoor      │
│  💼 23 open positions       │
└─────────────────────────────┘
```

---

#### JobDescription Component
```typescript
interface JobDescriptionProps {
  description: string;
  sections: JobSection[];
}

interface JobSection {
  title: string;
  content: string | string[];
  type: 'paragraph' | 'list' | 'bullets';
}
```

**Sections**:
1. **Overview** - Company background and role context
2. **Responsibilities** - Bulleted list of key duties
3. **Requirements** - Categorized (Must-have, Nice-to-have)
4. **Qualifications** - Education and experience
5. **Benefits & Perks** - Compensation and additional perks
6. **About the Team** - Team size, structure, culture

**Formatting**:
- Rich text rendering with markdown support
- Highlighted keywords matching user profile
- Expandable sections (Radix Accordion)
- Print-friendly layout

---

#### RequirementsList Component
```typescript
interface RequirementsListProps {
  requirements: Requirement[];
  userSkills: string[];
  highlightMatches?: boolean;
}

interface Requirement {
  id: string;
  text: string;
  type: 'required' | 'preferred';
  category: 'skill' | 'experience' | 'education' | 'certification';
  matched: boolean;
}
```

**Visual Design**:
```
Requirements
────────────────────────────
✅ 5+ years of React experience        [Matched]
✅ TypeScript proficiency               [Matched]
❌ GraphQL experience                   [Not Matched]
⭕ AWS certification                    [Preferred]
```

**Features**:
- Check/cross icons for matched requirements
- Different styling for required vs. preferred
- Progress bar showing "X of Y requirements met"
- Tooltips explaining why something matched/didn't match

---

#### SimilarJobsCarousel Component
```typescript
interface SimilarJobsCarouselProps {
  currentJobId: string;
  limit?: number;
  algorithm: 'similar' | 'recommended' | 'sameCompany';
}
```

**Layout**: Horizontal scrollable carousel (using embla-carousel-react)

**Features**:
- 3-4 compact job cards
- Swipeable on mobile
- Navigation arrows
- Auto-play option
- Click to view details

---

### 2.4 Application Components

#### ApplicationModal Component
```typescript
interface ApplicationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (application: ApplicationData) => Promise<void>;
}
```

**Steps**:
1. **Select Documents**
   - Resume selector (dropdown of user's resumes)
   - Cover letter (upload, write, or AI-generate)
   - Portfolio links (optional)

2. **Additional Questions** (if required)
   - Dynamic form based on job requirements
   - Character limits with counters
   - Auto-save drafts

3. **Review & Submit**
   - Preview all submitted materials
   - Confirmation checklist
   - Terms acceptance
   - Submit button with loading state

**Radix UI Components**:
- `@radix-ui/react-dialog` for modal
- `@radix-ui/react-tabs` for multi-step form
- `@radix-ui/react-select` for document selection
- `@radix-ui/react-checkbox` for confirmations

---

#### QuickApply Component
```typescript
interface QuickApplyProps {
  jobId: string;
  defaultResume?: string;
  onSuccess: () => void;
}
```

**Purpose**: One-click application using default resume/cover letter

**Flow**:
1. Click "Quick Apply"
2. Confirmation dialog with selected documents
3. Submit with single click
4. Success toast notification

---

#### ApplicationStatusBadge Component
```typescript
interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  updatedAt: Date;
}

type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'reviewing'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_received'
  | 'rejected'
  | 'withdrawn'
  | 'accepted';
```

**Badge Styles**:
```typescript
const statusColors = {
  draft: 'gray',
  submitted: 'blue',
  reviewing: 'yellow',
  interview_scheduled: 'purple',
  interview_completed: 'purple',
  offer_received: 'green',
  rejected: 'red',
  withdrawn: 'gray',
  accepted: 'green'
};
```

**UI**: Pill-shaped badge with icon and text

---

### 2.5 Utility Components

#### SaveJobButton Component
```typescript
interface SaveJobButtonProps {
  jobId: string;
  isSaved: boolean;
  onToggle: (jobId: string, saved: boolean) => void;
  variant?: 'icon' | 'button';
}
```

**States**:
- Unsaved: Outline bookmark icon
- Saved: Filled bookmark icon (blue)
- Hover: Tooltip "Save for later" / "Saved"
- Animation: Heart-like pop on save

---

#### SortDropdown Component
```typescript
interface SortDropdownProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
  options: SortOption[];
}

type SortOption = {
  label: string;
  value: string;
  direction: 'asc' | 'desc';
};
```

**Options**:
- Relevance (AI match score)
- Date Posted (newest first)
- Salary (highest first)
- Company (A-Z)
- Experience Level

**Radix UI Component**: `@radix-ui/react-dropdown-menu`

---

#### ViewToggle Component
```typescript
interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}
```

**UI**: Icon toggle button (Grid icon / List icon)

**Radix UI Component**: `@radix-ui/react-toggle-group`

---

#### Pagination Component
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'standard' | 'infinite-scroll';
}
```

**Standard Variant**:
```
← Previous  [1] 2 3 ... 10  Next →
```

**Infinite Scroll Variant**:
```
[Load More Jobs] (remaining: 127)
```

---

## 3. Detailed Specifications

### 3.1 Jobs Browse Page Specifications

#### Search Functionality

**Keyword Search**:
- Search across: Job titles, company names, skills, descriptions
- Fuzzy matching with typo tolerance
- Boolean operators support (AND, OR, NOT)
- Phrase search with quotes
- Wildcard support (*)

**Location Search**:
- City, state, zip code support
- Geocoding for radius search
- "Near me" with geolocation
- Multiple location OR logic

**Auto-suggestions**:
- Popular job titles
- Trending companies
- Common skills
- Location names
- Recent searches (persisted)

**Search Performance**:
- Debounce: 300ms
- Min characters: 2
- Max results: 10 suggestions
- Cache duration: 5 minutes

---

#### Filter Options

**Location Filter**:
```typescript
interface LocationFilter {
  cities: string[];
  states: string[];
  countries: string[];
  radius?: {
    center: Coordinates;
    miles: number;
  };
  remote: 'only' | 'included' | 'excluded';
}
```

**Salary Range Filter**:
```typescript
interface SalaryFilter {
  min: number;
  max: number;
  currency: 'USD' | 'EUR' | 'GBP';
  period: 'hourly' | 'annual';
  showOnlyWithSalary: boolean;
}
```

**Skills Filter**:
```typescript
interface SkillsFilter {
  required: string[];
  preferred: string[];
  matchMode: 'all' | 'any';
  minMatchPercentage: number;
}
```

**Advanced Filters**:
```typescript
interface AdvancedFilters {
  industry: string[];
  companySize: CompanySize[];
  benefits: string[];
  visaSponsorship: boolean;
  securityClearance: boolean;
  diversityPrograms: boolean;
  applicationDeadline?: DateRange;
}
```

---

#### Sorting Mechanisms

**Sort Options**:

1. **Relevance** (Default)
   - AI match score (primary)
   - Keyword relevance (secondary)
   - Freshness boost (posted recently)

2. **Date Posted**
   - Newest first (default)
   - Oldest first (edge case)

3. **Match Score**
   - Highest match percentage first
   - Requires user profile

4. **Salary**
   - Highest first
   - Lowest first
   - Only jobs with disclosed salary

5. **Company**
   - Alphabetical (A-Z)
   - Alphabetical (Z-A)

6. **Application Deadline**
   - Soonest first
   - Latest first

**Sort Persistence**: Save last used sort in localStorage

---

#### AI Match Algorithm Display

**Match Score Calculation**:
```typescript
interface MatchCalculation {
  overall: number; // 0-100
  breakdown: {
    skills: {
      score: number;
      matched: string[];
      missing: string[];
      weight: number;
    };
    experience: {
      score: number;
      yearsRequired: number;
      yearsUser: number;
      weight: number;
    };
    education: {
      score: number;
      required: string;
      user: string;
      weight: number;
    };
    location: {
      score: number;
      distance: number;
      weight: number;
    };
    salary: {
      score: number;
      expectation: number;
      offered: number;
      weight: number;
    };
    culture: {
      score: number;
      alignment: string[];
      weight: number;
    };
  };
  confidence: number; // Algorithm confidence level
}
```

**Display Components**:

1. **Card Badge**: Simple percentage (e.g., "85% Match")
2. **Tooltip Breakdown**: Hover to see category scores
3. **Details Page**: Full breakdown with explanations

**Visual Indicators**:
- Progress rings for each category
- Color-coded bars
- Check/X icons for met/unmet criteria

**Explainability**:
```
Why this match?
───────────────
✅ You have 4/5 required skills
✅ Your experience exceeds requirement
✅ Location within 10 miles
⚠️ Salary slightly below expectation
✅ Company culture matches preferences
```

---

#### Responsive Behavior

**Desktop (≥1024px)**:
- Sidebar filter panel (300px width)
- Grid view: 3 columns
- List view: Full width cards
- Sticky filter panel on scroll

**Tablet (768px - 1023px)**:
- Collapsible filter panel (drawer)
- Grid view: 2 columns
- Filter button in header

**Mobile (<768px)**:
- Filter sheet (slide up from bottom)
- Grid view: 1 column (stacked cards)
- Simplified search bar
- Sticky apply/save buttons
- Reduced text on cards

**Touch Optimizations**:
- Minimum tap target: 44x44px
- Swipe gestures for cards
- Pull to refresh
- Bottom sheet for filters

---

#### Loading States

**Initial Load**:
- Skeleton cards (8-12 placeholders)
- Pulsing animation
- Loading spinner with text "Finding best matches..."

**Filter/Search Updates**:
- Dim current results
- Show loading overlay
- Preserve scroll position if possible

**Pagination**:
- Append skeleton cards
- Smooth scroll to new content
- "Loading more..." indicator

**Component**:
```typescript
const JobCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mt-4" />
    <div className="h-4 bg-gray-200 rounded w-2/3 mt-2" />
    <div className="h-10 bg-gray-200 rounded mt-4" />
  </div>
);
```

---

#### Empty States

**No Results**:
```
┌─────────────────────────────┐
│    🔍                       │
│                             │
│  No jobs found              │
│                             │
│  Try adjusting your filters │
│  or search terms            │
│                             │
│  [Clear Filters]            │
│  [Browse All Jobs]          │
└─────────────────────────────┘
```

**No Saved Jobs**:
```
┌─────────────────────────────┐
│    💼                       │
│                             │
│  No saved jobs yet          │
│                             │
│  Bookmark jobs to view      │
│  them later                 │
│                             │
│  [Explore Jobs ➜]           │
└─────────────────────────────┘
```

**No Applications**:
```
┌─────────────────────────────┐
│    📝                       │
│                             │
│  No applications yet        │
│                             │
│  Start applying to jobs     │
│  to track them here         │
│                             │
│  [Find Jobs ➜]              │
└─────────────────────────────┘
```

**Error State**:
```
┌─────────────────────────────┐
│    ⚠️                       │
│                             │
│  Something went wrong       │
│                             │
│  Unable to load jobs.       │
│  Please try again.          │
│                             │
│  [Retry]                    │
└─────────────────────────────┘
```

---

### 3.2 Job Details Page Specifications

#### URL Structure
```
/jobs/:jobId
/jobs/:jobId/apply
/jobs/:jobId/edit-application (if draft exists)
```

**SEO-Friendly Alternative**:
```
/jobs/:jobId/:slug
Example: /jobs/12345/senior-software-engineer-techcorp
```

---

#### Page Sections

**Section 1: Header**
- Job title (H1)
- Company name with logo (clickable)
- Location + Remote badge
- Posted date + Applicant count
- Application deadline (if exists)
- Match score (prominent)
- Quick actions (Save, Share, Apply)

**Section 2: Key Information (Grid)**
```
┌─────────────┬─────────────┬─────────────┐
│ 💰 Salary   │ 📍 Location │ ⏰ Job Type │
│ $120k-160k  │ Remote      │ Full-time   │
├─────────────┼─────────────┼─────────────┤
│ 📊 Level    │ 🏢 Size     │ 🏭 Industry │
│ Senior      │ 1000-5000   │ Technology  │
└─────────────┴─────────────┴─────────────┘
```

**Section 3: Main Content (2-column)**

*Left Column (70%)*:
1. Job Description (expandable)
2. Responsibilities (bulleted)
3. Requirements (categorized)
4. Qualifications
5. Benefits & Perks
6. About the Team
7. Equal Opportunity Statement

*Right Column (30%)*:
1. Company Card
2. Quick Apply Card
3. Similar Jobs
4. Share Options
5. Report Job

---

#### Interactive Elements

**Read More/Less**:
- Collapse long descriptions
- "Read more" expands full text
- Smooth animation

**Highlight User Skills**:
- User's matching skills highlighted in yellow
- Tooltip showing "You have this skill"

**Copy to Clipboard**:
- Job link
- Company name
- Job ID for reference

**Print View**:
- Clean, printer-friendly layout
- Remove unnecessary UI elements
- Include QR code to job page

---

#### Share Functionality

**Share Options**:
- Copy link
- Email
- LinkedIn
- Twitter
- Facebook

**Share Data**:
```typescript
interface ShareData {
  title: string; // Job title
  text: string;  // "Check out this job at [Company]"
  url: string;   // Job URL
}
```

**Native Share API** (mobile):
```typescript
if (navigator.share) {
  navigator.share(shareData);
}
```

---

#### Application Status Display

**If Already Applied**:
```
┌─────────────────────────────────────┐
│ ✅ Applied on March 15, 2025        │
│                                     │
│ Status: Under Review                │
│                                     │
│ [View Application] [Withdraw]       │
└─────────────────────────────────────┘
```

**If Saved**:
```
┌─────────────────────────────────────┐
│ 💾 Saved on March 10, 2025          │
│                                     │
│ [Apply Now ➜]                       │
└─────────────────────────────────────┘
```

---

### 3.3 Application Flow Specifications

#### Application States

```typescript
type ApplicationState = 
  | 'not_started'
  | 'draft'
  | 'submitted'
  | 'reviewing'
  | 'interview_requested'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_made'
  | 'rejected'
  | 'withdrawn'
  | 'accepted';
```

---

#### Multi-Step Form

**Step 1: Select Documents**
- Resume dropdown (list user's uploaded resumes)
- Preview selected resume
- Upload new resume option
- Cover letter options:
  - Use existing
  - Upload new
  - Generate with AI
  - Skip (if optional)

**Step 2: Answer Questions**
- Dynamic form based on employer questions
- Text inputs, textareas, radio buttons
- Character limits with live counters
- Required field validation
- Auto-save every 30 seconds

**Step 3: Review**
- Summary of all submitted info
- Document previews
- Edit button for each section
- Confirmation checkboxes:
  - "I certify this information is accurate"
  - "I authorize background check" (if required)

**Step 4: Submit**
- Loading spinner during submission
- Success message with tracking number
- Next steps information
- Add to calendar option (if interview scheduled)

---

#### Form Validation

```typescript
interface ApplicationValidation {
  resume: {
    required: true;
    formats: ['pdf', 'docx'];
    maxSize: 5 * 1024 * 1024; // 5MB
  };
  coverLetter: {
    required: boolean; // Depends on job
    minLength: 100;
    maxLength: 5000;
  };
  questions: Array<{
    id: string;
    required: boolean;
    type: 'text' | 'textarea' | 'select' | 'radio';
    validation?: string; // Regex pattern
  }>;
}
```

**Error Messages**:
- Required field: "This field is required"
- File size: "File size must be less than 5MB"
- File format: "Please upload a PDF or Word document"
- Character limit: "Maximum 5000 characters (you have X)"

---

#### Auto-Save Drafts

**Behavior**:
- Save draft every 30 seconds if changes detected
- Save on navigation away (beforeunload event)
- Show "Last saved at [time]" indicator
- Resume draft on return

**Storage**: IndexedDB or localStorage

```typescript
interface ApplicationDraft {
  jobId: string;
  userId: string;
  data: ApplicationData;
  lastSaved: Date;
  step: number;
}
```

---

#### Success Confirmation

**Modal Content**:
```
┌─────────────────────────────────────┐
│           ✅                        │
│                                     │
│  Application Submitted!             │
│                                     │
│  Your application has been sent to  │
│  TechCorp Inc.                      │
│                                     │
│  Tracking #: APP-2025-001234        │
│                                     │
│  What's next?                       │
│  • You'll receive a confirmation    │
│    email shortly                    │
│  • Employers typically respond      │
│    within 2 weeks                   │
│                                     │
│  [Track Application]                │
│  [Apply to Similar Jobs]            │
│  [Done]                             │
└─────────────────────────────────────┘
```

---

### 3.4 Saved Jobs Specifications

#### Organization

**Default View**: All saved jobs (chronological)

**Folder/Tag System**:
- Create custom folders ("Dream Jobs", "Backup Options")
- Tag jobs with labels ("High Priority", "Research")
- Filter by folder/tag

**Bulk Actions**:
- Select multiple jobs
- Apply to selected
- Move to folder
- Remove from saved
- Export list

---

#### Saved Job Card

**Compact Design**:
```
┌────────────────────────────────────────┐
│ [✓] [Logo] Software Engineer           │
│            TechCorp • Remote            │
│            Match: 85% • $120k-160k     │
│            Saved: Mar 10 • Expires: Mar 25 │
│            [Apply] [Remove]             │
└────────────────────────────────────────┘
```

**Features**:
- Checkbox for bulk selection
- Quick apply button
- Remove button
- Notes field (collapsible)
- Deadline warning (if within 7 days)

---

#### Notes Feature

```typescript
interface SavedJobNote {
  jobId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**UI**: Expandable textarea under each saved job

**Use Cases**:
- Why you saved this job
- Questions to ask in interview
- Salary negotiation notes
- Application reminders

---

### 3.5 Application Tracker Specifications

#### Dashboard Overview

**Metrics Cards**:
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ 📊 Total    │ ⏳ Pending  │ 💬 Interview│ ✅ Offers   │
│ 47          │ 23          │ 5           │ 2           │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

**Additional Stats**:
- Response rate (%)
- Avg. time to response
- Application per week trend
- Success rate by job type

---

#### Status Tabs

```
[ All (47) ] [ Submitted (23) ] [ Interview (5) ] [ Offer (2) ] [ Rejected (15) ]
```

**Filter Combinations**:
- By status
- By date range
- By company
- By job type
- By match score

---

#### Application Card (Timeline View)

```
┌─────────────────────────────────────────────────────────┐
│ [●] Senior Software Engineer                            │
│     TechCorp Inc. • Applied Mar 15, 2025                │
│                                                         │
│     Status: Under Review                                │
│     Match: 85%                                          │
│                                                         │
│     Timeline:                                           │
│     ✓ Applied - Mar 15                                  │
│     ✓ Viewed - Mar 16                                   │
│     ⏳ Interview TBD                                     │
│                                                         │
│     [View Job] [View Application] [Add Note]            │
└─────────────────────────────────────────────────────────┘
```

---

#### Kanban Board View (Alternative)

```
┌────────────┬────────────┬────────────┬────────────┐
│ Submitted  │ Reviewing  │ Interview  │ Offer      │
├────────────┼────────────┼────────────┼────────────┤
│ [Job Card] │ [Job Card] │ [Job Card] │ [Job Card] │
│ [Job Card] │ [Job Card] │            │            │
│ [Job Card] │            │            │            │
└────────────┴────────────┴────────────┴────────────┘
```

**Features**:
- Drag & drop to update status
- Column counts
- Add new application via +
- Filter within columns

---

#### Application Detail View

**Modal/Sidebar Content**:
1. Job information recap
2. Submitted documents (downloadable)
3. Application answers
4. Status timeline with dates
5. Notes section
6. Action buttons:
   - View original job posting
   - Download application PDF
   - Withdraw application
   - Add interview date
   - Update status

---

#### Notifications & Reminders

**Notification Types**:
- Application status changed
- Interview scheduled
- Offer received
- Application deadline approaching
- Follow-up reminder (if no response in 2 weeks)

**Reminder System**:
```typescript
interface ApplicationReminder {
  applicationId: string;
  type: 'follow_up' | 'interview_prep' | 'deadline';
  scheduledFor: Date;
  message: string;
  sent: boolean;
}
```

---

## 4. User Flows

### 4.1 Job Discovery Flow

```
Start
  ↓
Dashboard → Click "Browse Jobs"
  ↓
Jobs Page (loads with default filters based on profile)
  ↓
User Actions:
  ├─→ Enter search keywords
  ├─→ Apply filters
  ├─→ Change sort order
  └─→ Toggle view (grid/list)
  ↓
Browse job cards
  ↓
User sees interesting job
  ↓
Actions:
  ├─→ Click "Save" (adds to saved jobs)
  ├─→ Click card (go to job details)
  └─→ Click "Quick Apply" (application modal)
  ↓
End
```

---

### 4.2 Filtering & Searching Flow

```
Jobs Page
  ↓
User enters search query
  ↓
Auto-suggestions appear
  ↓
User selects suggestion OR presses Enter
  ↓
Results update (with loading state)
  ↓
User opens filter panel
  ↓
Selects filters:
  - Location
  - Salary range
  - Job type
  - Experience level
  - Skills
  - etc.
  ↓
Results update in real-time
  ↓
Active filters displayed as chips
  ↓
User can:
  ├─→ Remove individual filter (click X on chip)
  ├─→ Clear all filters
  └─→ Refine filters further
  ↓
End
```

**Optimization**: Debounced search + optimistic UI updates

---

### 4.3 Viewing Job Details Flow

```
Jobs Page
  ↓
User clicks on job card
  ↓
Navigate to /jobs/:jobId
  ↓
Page loads:
  ├─→ Job header
  ├─→ Match score
  ├─→ Company info
  └─→ Job description
  ↓
User scrolls through content
  ↓
Match breakdown tooltip (on hover)
  ↓
User reads requirements
  ├─→ Green checkmarks = matched
  └─→ Red X = not matched
  ↓
User decides:
  ├─→ Save for later
  ├─→ Share with friend
  ├─→ Apply now
  └─→ Return to search
  ↓
End
```

---

### 4.4 Saving Jobs Flow

```
User finds interesting job
  ↓
Clicks "Save" button (bookmark icon)
  ↓
Icon animates (fill + bounce)
  ↓
Toast notification: "Job saved!"
  ↓
Job added to Saved Jobs list
  ↓
Optional: Prompt for folder/tag
  ↓
User can later:
  ├─→ View all saved jobs at /jobs/saved
  ├─→ Organize into folders
  ├─→ Add notes
  └─→ Apply from saved list
  ↓
End
```

**Edge Case**: If user unsaves, show undo option in toast

---

### 4.5 Applying to Jobs Flow

#### Quick Apply Flow

```
Job Details Page
  ↓
User clicks "Quick Apply"
  ↓
Modal appears with:
  - Default resume (pre-selected)
  - Default cover letter (if exists)
  ↓
User reviews selections
  ↓
Clicks "Submit Application"
  ↓
Loading state
  ↓
Success confirmation
  ↓
Application added to tracker
  ↓
Email confirmation sent
  ↓
End
```

#### Full Application Flow

```
Job Details Page
  ↓
User clicks "Apply"
  ↓
Application modal/page opens
  ↓
Step 1: Select Documents
  ├─→ Choose resume from dropdown
  ├─→ Preview selected resume
  ├─→ Choose/upload cover letter
  └─→ Add portfolio links (optional)
  ↓
Click "Next"
  ↓
Step 2: Answer Questions
  ├─→ Fill required fields
  ├─→ Character counters update
  └─→ Auto-save every 30s
  ↓
Click "Next"
  ↓
Step 3: Review
  ├─→ See all submitted information
  ├─→ Preview documents
  ├─→ Check confirmation boxes
  └─→ Edit if needed (go back)
  ↓
Click "Submit Application"
  ↓
Validation runs
  ├─→ If errors: Show messages, prevent submit
  └─→ If valid: Proceed
  ↓
Loading spinner
  ↓
API call to submit application
  ↓
Success Response:
  ├─→ Show confirmation modal
  ├─→ Display tracking number
  ├─→ Send confirmation email
  └─→ Add to application tracker
  ↓
User actions:
  ├─→ Track application
  ├─→ Apply to similar jobs
  └─→ Return to job search
  ↓
End
```

---

### 4.6 Tracking Applications Flow

```
User navigates to /applications
  ↓
Dashboard loads with:
  - Summary metrics
  - Status tabs
  - Application cards
  ↓
User filters by status (e.g., "Interview")
  ↓
List updates to show only interviews
  ↓
User clicks on an application card
  ↓
Detail view opens (modal/sidebar)
  ↓
User sees:
  - Job information
  - Status timeline
  - Submitted documents
  - Notes
  ↓
User actions:
  ├─→ Add note
  ├─→ Update status
  ├─→ Schedule interview (opens calendar)
  ├─→ Withdraw application
  └─→ Download application PDF
  ↓
Changes saved
  ↓
Timeline updates
  ↓
End
```

---

### 4.7 Interview Scheduling Flow

```
Application status changes to "Interview Requested"
  ↓
User receives notification
  ↓
Opens application detail
  ↓
Clicks "Schedule Interview"
  ↓
Calendar picker appears
  ↓
User selects date & time
  ↓
Optional: Add to Google Calendar / iCal
  ↓
Confirmation email sent
  ↓
Status updated to "Interview Scheduled"
  ↓
Timeline shows interview date
  ↓
Reminder set for 1 day before
  ↓
End
```

---

## 5. Data Requirements

### 5.1 Job Posting Data Structure

```typescript
interface Job {
  // Identifiers
  id: string;
  slug: string; // URL-friendly
  externalId?: string; // If from external API
  
  // Basic Info
  title: string;
  description: string;
  responsibilities: string[];
  
  // Company
  company: Company;
  
  // Location
  location: Location;
  remote: RemoteType;
  
  // Employment Details
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  salaryRange?: SalaryRange;
  
  // Requirements
  requirements: Requirement[];
  qualifications: Qualification[];
  skills: Skill[];
  
  // Benefits
  benefits: string[];
  perks: string[];
  
  // Metadata
  category: string;
  industry: string;
  postedAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  
  // Application
  applicationUrl?: string; // External apply link
  applicationProcess: ApplicationProcess;
  questionsRequired: boolean;
  customQuestions?: ApplicationQuestion[];
  
  // Stats
  viewCount: number;
  applicationCount: number;
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  
  // Flags
  isFeatured: boolean;
  isActive: boolean;
  isUrgent: boolean;
  visaSponsorship: boolean;
}

interface Company {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  industry: string;
  size: CompanySize;
  founded: number;
  headquarters: string;
  locations: string[];
  socialLinks: SocialLinks;
  culture: CultureTag[];
  benefits: string[];
  diversity: DiversityInfo;
  ratings?: CompanyRatings;
}

interface Location {
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timezone?: string;
}

type RemoteType = 'on-site' | 'remote' | 'hybrid';

type JobType = 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';

type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'hourly' | 'annual';
  equity?: boolean;
  bonus?: boolean;
}

interface Requirement {
  id: string;
  text: string;
  type: 'required' | 'preferred';
  category: 'skill' | 'experience' | 'education' | 'certification';
  weight: number; // For matching algorithm
}

interface Skill {
  id: string;
  name: string;
  category: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsRequired?: number;
}

interface ApplicationProcess {
  type: 'internal' | 'external' | 'email';
  steps: string[];
  estimatedTime: number; // minutes
  documentsRequired: DocumentType[];
}

interface ApplicationQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file';
  required: boolean;
  options?: string[]; // For select/radio
  maxLength?: number;
  placeholder?: string;
}

type DocumentType = 'resume' | 'cover-letter' | 'portfolio' | 'transcript' | 'certification';

type CompanySize = 'startup' | 'small' | 'medium' | 'large' | 'enterprise';

interface CompanyRatings {
  overall: number;
  culture: number;
  workLifeBalance: number;
  compensation: number;
  careerGrowth: number;
  management: number;
  source: string; // Glassdoor, Indeed, etc.
  reviewCount: number;
}
```

---

### 5.2 Filter Criteria Data

```typescript
interface FilterCriteria {
  // Search
  keywords?: string;
  
  // Location
  locations?: string[];
  radius?: number;
  remote?: RemoteType[];
  
  // Salary
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  
  // Job Details
  jobTypes?: JobType[];
  experienceLevels?: ExperienceLevel[];
  
  // Company
  companies?: string[];
  companySizes?: CompanySize[];
  industries?: string[];
  
  // Skills
  requiredSkills?: string[];
  preferredSkills?: string[];
  
  // Date
  postedAfter?: Date;
  postedBefore?: Date;
  
  // Advanced
  benefits?: string[];
  visaSponsorship?: boolean;
  diversityPrograms?: boolean;
  
  // AI
  minMatchScore?: number;
  
  // Pagination
  page: number;
  limit: number;
  
  // Sort
  sortBy: SortField;
  sortOrder: 'asc' | 'desc';
}

type SortField = 'relevance' | 'date' | 'salary' | 'match-score' | 'company' | 'title';
```

---

### 5.3 Match Score Calculation

```typescript
interface MatchScore {
  jobId: string;
  userId: string;
  overall: number; // 0-100
  breakdown: MatchBreakdown;
  confidence: number; // 0-1
  calculatedAt: Date;
  factors: MatchFactor[];
}

interface MatchBreakdown {
  skills: CategoryScore;
  experience: CategoryScore;
  education: CategoryScore;
  location: CategoryScore;
  salary: CategoryScore;
  culture: CategoryScore;
  availability: CategoryScore;
}

interface CategoryScore {
  score: number; // 0-100
  weight: number; // 0-1, sum of all weights = 1
  details: string;
  matched: string[];
  missing: string[];
}

interface MatchFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  weight: number;
}

// Algorithm weights (configurable)
const MATCH_WEIGHTS = {
  skills: 0.35,        // 35%
  experience: 0.25,    // 25%
  education: 0.10,     // 10%
  location: 0.10,      // 10%
  salary: 0.10,        // 10%
  culture: 0.05,       // 5%
  availability: 0.05   // 5%
};

// Calculation example
function calculateMatchScore(job: Job, userProfile: UserProfile): MatchScore {
  const skills = calculateSkillsMatch(job.skills, userProfile.skills);
  const experience = calculateExperienceMatch(job.experienceLevel, userProfile.yearsExperience);
  const education = calculateEducationMatch(job.requirements, userProfile.education);
  // ... other calculations
  
  const overall = 
    skills.score * MATCH_WEIGHTS.skills +
    experience.score * MATCH_WEIGHTS.experience +
    education.score * MATCH_WEIGHTS.education +
    // ... etc
  
  return {
    jobId: job.id,
    userId: userProfile.id,
    overall: Math.round(overall),
    breakdown: { skills, experience, education, /* ... */ },
    confidence: calculateConfidence(userProfile),
    calculatedAt: new Date(),
    factors: generateFactors(/* ... */)
  };
}
```

---

### 5.4 Application Data

```typescript
interface Application {
  // Identifiers
  id: string;
  trackingNumber: string; // User-facing (e.g., APP-2025-001234)
  
  // References
  jobId: string;
  userId: string;
  resumeId: string;
  coverLetterId?: string;
  
  // Status
  status: ApplicationStatus;
  statusHistory: StatusChange[];
  
  // Submission
  submittedAt: Date;
  documents: ApplicationDocument[];
  answers: ApplicationAnswer[];
  
  // Employer Actions
  viewedByEmployer: boolean;
  viewedAt?: Date;
  employerNotes?: string;
  
  // Interviews
  interviews: Interview[];
  
  // User Actions
  notes: string;
  tags: string[];
  
  // Metadata
  source: 'web' | 'mobile' | 'api';
  ipAddress?: string;
  userAgent?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  withdrawnAt?: Date;
}

type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'reviewing'
  | 'interview_requested'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_made'
  | 'rejected'
  | 'withdrawn'
  | 'accepted';

interface StatusChange {
  from: ApplicationStatus;
  to: ApplicationStatus;
  timestamp: Date;
  note?: string;
  triggeredBy: 'user' | 'employer' | 'system';
}

interface ApplicationDocument {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

interface ApplicationAnswer {
  questionId: string;
  question: string;
  answer: string | string[];
  type: ApplicationQuestion['type'];
}

interface Interview {
  id: string;
  type: 'phone' | 'video' | 'onsite' | 'technical';
  scheduledAt?: Date;
  duration?: number; // minutes
  location?: string;
  meetingLink?: string;
  interviewers?: string[];
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  notes?: string;
  feedback?: string;
}
```

---

### 5.5 User Profile Data (for Matching)

```typescript
interface UserProfile {
  id: string;
  
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: Location;
  
  // Professional
  headline: string;
  summary: string;
  yearsExperience: number;
  currentRole?: string;
  
  // Skills
  skills: UserSkill[];
  
  // Experience
  workHistory: WorkExperience[];
  
  // Education
  education: Education[];
  certifications: Certification[];
  
  // Preferences
  jobPreferences: JobPreferences;
  
  // Documents
  resumes: Resume[];
  coverLetters: CoverLetter[];
  
  // Privacy
  profileVisibility: 'public' | 'private' | 'connections';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

interface UserSkill {
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
  endorsed?: boolean;
}

interface JobPreferences {
  desiredRoles: string[];
  industries: string[];
  locations: string[];
  remotePreference: RemoteType[];
  jobTypes: JobType[];
  salaryExpectation: SalaryRange;
  willingToRelocate: boolean;
  visaSponsorshipNeeded: boolean;
  availability: Date;
  culturalValues: string[];
}

interface Resume {
  id: string;
  name: string;
  url: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 5.6 API Endpoints

#### Jobs API

```typescript
// GET /api/jobs
// Search and filter jobs
interface GetJobsRequest {
  query?: string;
  filters?: FilterCriteria;
  page?: number;
  limit?: number;
  sortBy?: SortField;
  sortOrder?: 'asc' | 'desc';
}

interface GetJobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: FilterCriteria;
  facets?: FilterFacets; // For dynamic filter counts
}

// GET /api/jobs/:id
// Get single job details
interface GetJobResponse {
  job: Job;
  matchScore?: MatchScore;
  similarJobs: Job[];
  userStatus?: {
    saved: boolean;
    applied: boolean;
    applicationId?: string;
  };
}

// POST /api/jobs/:id/save
// Save job for later
interface SaveJobRequest {
  folderId?: string;
  tags?: string[];
  note?: string;
}

interface SaveJobResponse {
  success: boolean;
  savedJob: SavedJob;
}

// DELETE /api/jobs/:id/save
// Remove from saved jobs
interface UnsaveJobResponse {
  success: boolean;
}

// GET /api/jobs/saved
// Get user's saved jobs
interface GetSavedJobsResponse {
  savedJobs: SavedJob[];
  folders: SavedJobFolder[];
}

// POST /api/jobs/:id/apply
// Submit application
interface ApplyToJobRequest {
  resumeId: string;
  coverLetterId?: string;
  answers: ApplicationAnswer[];
  portfolioLinks?: string[];
}

interface ApplyToJobResponse {
  success: boolean;
  application: Application;
  trackingNumber: string;
}
```

#### Applications API

```typescript
// GET /api/applications
// Get user's applications
interface GetApplicationsRequest {
  status?: ApplicationStatus[];
  jobId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  page?: number;
  limit?: number;
}

interface GetApplicationsResponse {
  applications: Application[];
  total: number;
  stats: {
    total: number;
    byStatus: Record<ApplicationStatus, number>;
    responseRate: number;
    avgResponseTime: number;
  };
}

// GET /api/applications/:id
// Get single application details
interface GetApplicationResponse {
  application: Application;
  job: Job;
  timeline: StatusChange[];
}

// PATCH /api/applications/:id
// Update application
interface UpdateApplicationRequest {
  status?: ApplicationStatus;
  notes?: string;
  tags?: string[];
  interviewDate?: Date;
}

interface UpdateApplicationResponse {
  success: boolean;
  application: Application;
}

// POST /api/applications/:id/withdraw
// Withdraw application
interface WithdrawApplicationResponse {
  success: boolean;
  application: Application;
}
```

#### Match API

```typescript
// POST /api/match/calculate
// Calculate match score for a job
interface CalculateMatchRequest {
  jobId: string;
  userId?: string; // Optional, uses authenticated user
}

interface CalculateMatchResponse {
  matchScore: MatchScore;
  recommendations: string[];
}

// GET /api/match/recommendations
// Get recommended jobs
interface GetRecommendationsRequest {
  limit?: number;
  excludeApplied?: boolean;
  minScore?: number;
}

interface GetRecommendationsResponse {
  jobs: Job[];
  matchScores: MatchScore[];
}
```

#### Search API

```typescript
// GET /api/search/suggestions
// Get autocomplete suggestions
interface GetSuggestionsRequest {
  query: string;
  type: 'job-title' | 'company' | 'skill' | 'location';
  limit?: number;
}

interface GetSuggestionsResponse {
  suggestions: SearchSuggestion[];
}

interface SearchSuggestion {
  text: string;
  type: string;
  count?: number;
  icon?: string;
}
```

---

### 5.7 Filter Facets (Dynamic Counts)

```typescript
interface FilterFacets {
  jobType: { [key in JobType]: number };
  experienceLevel: { [key in ExperienceLevel]: number };
  remote: { [key in RemoteType]: number };
  companySize: { [key in CompanySize]: number };
  salaryRanges: Array<{ range: string; count: number }>;
  locations: Array<{ city: string; count: number }>;
  industries: Array<{ name: string; count: number }>;
  postedDate: {
    last24h: number;
    last7days: number;
    last30days: number;
  };
}

// Example usage in UI:
// Full-time (127)
// Part-time (43)
// Contract (89)
```

---

## 6. File Structure

### 6.1 Directory Organization

```
src/
├── pages/
│   ├── jobs/
│   │   ├── JobsPage.tsx                    # Main jobs browse page
│   │   ├── JobDetailsPage.tsx              # Single job view
│   │   ├── SavedJobsPage.tsx               # Saved jobs list
│   │   ├── ApplicationsPage.tsx            # Application tracker
│   │   └── index.ts                        # Exports
│   └── ...
│
├── components/
│   ├── jobs/
│   │   ├── search/
│   │   │   ├── SearchBar.tsx               # Search input with suggestions
│   │   │   ├── SearchSuggestions.tsx       # Autocomplete dropdown
│   │   │   └── RecentSearches.tsx          # Recent searches list
│   │   │
│   │   ├── filters/
│   │   │   ├── FilterPanel.tsx             # Main filter container
│   │   │   ├── FilterSection.tsx           # Collapsible filter category
│   │   │   ├── LocationFilter.tsx          # Location-specific filters
│   │   │   ├── SalaryRangeFilter.tsx       # Salary range slider
│   │   │   ├── SkillsFilter.tsx            # Skills multi-select
│   │   │   ├── ActiveFilters.tsx           # Active filter chips
│   │   │   └── FilterPresets.tsx           # Saved filter combinations
│   │   │
│   │   ├── cards/
│   │   │   ├── JobCard.tsx                 # Job card (grid/list views)
│   │   │   ├── JobCardSkeleton.tsx         # Loading skeleton
│   │   │   ├── CompanyCard.tsx             # Company info card
│   │   │   └── ApplicationCard.tsx         # Application tracker card
│   │   │
│   │   ├── details/
│   │   │   ├── JobHeader.tsx               # Job details header
│   │   │   ├── JobDescription.tsx          # Formatted job description
│   │   │   ├── RequirementsList.tsx        # Requirements with match indicators
│   │   │   ├── BenefitsList.tsx            # Benefits and perks
│   │   │   ├── SimilarJobs.tsx             # Similar jobs carousel
│   │   │   └── JobActions.tsx              # Save/Apply/Share buttons
│   │   │
│   │   ├── application/
│   │   │   ├── ApplicationModal.tsx        # Application submission modal
│   │   │   ├── ApplicationSteps.tsx        # Multi-step form container
│   │   │   ├── DocumentSelector.tsx        # Resume/cover letter selector
│   │   │   ├── QuestionForm.tsx            # Custom questions form
│   │   │   ├── ApplicationReview.tsx       # Review before submit
│   │   │   ├── ApplicationSuccess.tsx      # Success confirmation
│   │   │   └── QuickApply.tsx              # One-click apply
│   │   │
│   │   ├── tracking/
│   │   │   ├── ApplicationDashboard.tsx    # Stats overview
│   │   │   ├── StatusTabs.tsx              # Filter by status tabs
│   │   │   ├── ApplicationTimeline.tsx     # Timeline view
│   │   │   ├── KanbanBoard.tsx             # Kanban view (alternative)
│   │   │   ├── ApplicationDetail.tsx       # Single application detail
│   │   │   └── InterviewScheduler.tsx      # Schedule interview
│   │   │
│   │   ├── common/
│   │   │   ├── MatchScoreIndicator.tsx     # AI match score display
│   │   │   ├── MatchBreakdown.tsx          # Detailed match breakdown
│   │   │   ├── SaveJobButton.tsx           # Save/unsave button
│   │   │   ├── StatusBadge.tsx             # Application status badge
│   │   │   ├── SortDropdown.tsx            # Sort options dropdown
│   │   │   ├── ViewToggle.tsx              # Grid/list toggle
│   │   │   ├── Pagination.tsx              # Pagination controls
│   │   │   └── EmptyState.tsx              # No results message
│   │   │
│   │   └── index.ts                        # Component exports
│   │
│   └── ui/                                 # Radix UI components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── slider.tsx
│       ├── checkbox.tsx
│       ├── tooltip.tsx
│       ├── progress.tsx
│       ├── tabs.tsx
│       ├── accordion.tsx
│       └── ...
│
├── hooks/
│   ├── jobs/
│   │   ├── useJobs.ts                      # Fetch and filter jobs
│   │   ├── useJobDetails.ts                # Single job data
│   │   ├── useJobSearch.ts                 # Search functionality
│   │   ├── useJobFilters.ts                # Filter state management
│   │   ├── useSaveJob.ts                   # Save/unsave jobs
│   │   ├── useApplyToJob.ts                # Application submission
│   │   ├── useApplications.ts              # User's applications
│   │   ├── useMatchScore.ts                # Calculate match score
│   │   └── index.ts
│   └── ...
│
├── lib/
│   ├── api/
│   │   ├── jobs.ts                         # Jobs API client
│   │   ├── applications.ts                 # Applications API client
│   │   ├── match.ts                        # Match API client
│   │   └── search.ts                       # Search API client
│   │
│   ├── utils/
│   │   ├── matchCalculator.ts              # Match score algorithm
│   │   ├── filterHelpers.ts                # Filter utilities
│   │   ├── searchHelpers.ts                # Search utilities
│   │   ├── dateHelpers.ts                  # Date formatting
│   │   └── salaryHelpers.ts                # Salary formatting
│   │
│   └── constants/
│       ├── jobFilters.ts                   # Filter options constants
│       ├── applicationStatuses.ts          # Status definitions
│       └── matchWeights.ts                 # Match algorithm weights
│
├── types/
│   ├── job.ts                              # Job-related types
│   ├── application.ts                      # Application types
│   ├── match.ts                            # Match score types
│   ├── filter.ts                           # Filter types
│   └── index.ts
│
└── styles/
    └── jobs.css                            # Job-specific styles (if needed)
```

---

### 6.2 Component Exports Example

```typescript
// components/jobs/index.ts
export { SearchBar } from './search/SearchBar';
export { FilterPanel } from './filters/FilterPanel';
export { JobCard } from './cards/JobCard';
export { JobHeader } from './details/JobHeader';
export { ApplicationModal } from './application/ApplicationModal';
export { MatchScoreIndicator } from './common/MatchScoreIndicator';
// ... etc
```

---

### 6.3 Type Definitions Example

```typescript
// types/job.ts
export interface Job { /* ... */ }
export interface Company { /* ... */ }
export interface Location { /* ... */ }
export type JobType = 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
// ... etc

// types/application.ts
export interface Application { /* ... */ }
export type ApplicationStatus = 'draft' | 'submitted' | /* ... */;
export interface ApplicationDocument { /* ... */ }
// ... etc

// types/index.ts
export * from './job';
export * from './application';
export * from './match';
export * from './filter';
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goals**: Set up basic structure and core components

**Tasks**:
- [x] Set up file structure
- [ ] Create TypeScript types and interfaces
- [ ] Build base UI components (using Radix UI)
  - Button, Dialog, Dropdown, Slider, Checkbox, etc.
- [ ] Create mock data for development
- [ ] Set up React Router routes
- [ ] Implement basic layout (header, sidebar, content)

**Deliverables**:
- Type-safe component library
- Basic routing structure
- Reusable UI components

---

### Phase 2: Jobs Browse Page (Week 3-4)

**Goals**: Complete job search and filtering functionality

**Tasks**:
- [ ] Build SearchBar with autocomplete
- [ ] Implement FilterPanel with all filter types
- [ ] Create JobCard component (grid and list views)
- [ ] Add sorting and view toggle
- [ ] Implement pagination
- [ ] Add loading and empty states
- [ ] Connect to API (or use mock data)

**Deliverables**:
- Fully functional jobs browse page
- Working search and filters
- Responsive design

---

### Phase 3: Job Details & Match Score (Week 5-6)

**Goals**: Job details page with AI matching

**Tasks**:
- [ ] Build JobDetailsPage layout
- [ ] Create JobHeader component
- [ ] Implement JobDescription with formatting
- [ ] Build RequirementsList with match indicators
- [ ] Create MatchScoreIndicator component
- [ ] Add MatchBreakdown tooltip
- [ ] Implement match score calculation algorithm
- [ ] Build CompanyCard component
- [ ] Add SimilarJobs carousel

**Deliverables**:
- Complete job details page
- AI match score calculation
- Match breakdown visualization

---

### Phase 4: Application Flow (Week 7-8)

**Goals**: Application submission and tracking

**Tasks**:
- [ ] Build ApplicationModal with multi-step form
- [ ] Create DocumentSelector component
- [ ] Implement QuestionForm with validation
- [ ] Add ApplicationReview step
- [ ] Create QuickApply component
- [ ] Build success confirmation
- [ ] Implement draft auto-save
- [ ] Add form validation and error handling

**Deliverables**:
- Complete application submission flow
- Quick apply functionality
- Draft saving

---

### Phase 5: Saved Jobs & Tracking (Week 9-10)

**Goals**: Saved jobs management and application tracking

**Tasks**:
- [ ] Build SavedJobsPage
- [ ] Implement folder/tag organization
- [ ] Add notes feature
- [ ] Create ApplicationsPage (tracker)
- [ ] Build ApplicationDashboard with stats
- [ ] Implement StatusTabs and filtering
- [ ] Create ApplicationTimeline view
- [ ] Add KanbanBoard (alternative view)
- [ ] Build InterviewScheduler

**Deliverables**:
- Saved jobs management
- Application tracker dashboard
- Multiple view options

---

### Phase 6: Polish & Optimization (Week 11-12)

**Goals**: Refinement, performance, and UX improvements

**Tasks**:
- [ ] Optimize performance (code splitting, lazy loading)
- [ ] Add animations and transitions
- [ ] Improve mobile responsiveness
- [ ] Implement accessibility features (ARIA labels, keyboard nav)
- [ ] Add analytics tracking
- [ ] Perform user testing
- [ ] Fix bugs and edge cases
- [ ] Write documentation

**Deliverables**:
- Optimized, production-ready code
- Excellent mobile experience
- Accessible UI
- Complete documentation

---

### Phase 7: Advanced Features (Week 13+)

**Goals**: Enhanced functionality and integrations

**Optional Tasks**:
- [ ] Email notifications for application updates
- [ ] Browser notifications
- [ ] Calendar integration (Google Calendar, iCal)
- [ ] Export application data (CSV, PDF)
- [ ] Share job links on social media
- [ ] Job alerts and saved searches
- [ ] AI-powered cover letter generation
- [ ] Interview preparation resources
- [ ] Salary negotiation tools
- [ ] Company reviews and ratings

**Deliverables**:
- Advanced features based on priority
- Third-party integrations

---

## 8. Technical Considerations

### 8.1 Performance Optimizations

**Code Splitting**:
```typescript
// Lazy load pages
const JobsPage = lazy(() => import('./pages/jobs/JobsPage'));
const JobDetailsPage = lazy(() => import('./pages/jobs/JobDetailsPage'));
const ApplicationsPage = lazy(() => import('./pages/jobs/ApplicationsPage'));

// Route with Suspense
<Route 
  path="/jobs" 
  element={
    <Suspense fallback={<PageLoader />}>
      <JobsPage />
    </Suspense>
  } 
/>
```

**Memoization**:
```typescript
// Memoize expensive calculations
const matchScore = useMemo(
  () => calculateMatchScore(job, userProfile),
  [job, userProfile]
);

// Memoize components
const JobCard = memo(({ job, ...props }) => {
  // Component code
});
```

**Virtualization** (for long lists):
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

// Virtual scrolling for 1000+ jobs
const virtualizer = useVirtualizer({
  count: jobs.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 200, // Estimated card height
});
```

**Image Optimization**:
- Lazy load images below fold
- Use responsive images (srcset)
- WebP format with fallbacks
- Company logo CDN

---

### 8.2 State Management

**React Query for Server State**:
```typescript
// hooks/jobs/useJobs.ts
export function useJobs(filters: FilterCriteria) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Prefetch job details on hover
const queryClient = useQueryClient();
const prefetchJob = (jobId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJobDetails(jobId),
  });
};
```

**Local State with Context** (for filters):
```typescript
// contexts/JobFiltersContext.tsx
const JobFiltersContext = createContext<JobFiltersContextValue>(null);

export function JobFiltersProvider({ children }) {
  const [filters, setFilters] = useState<FilterCriteria>(defaultFilters);
  
  // ... filter logic
  
  return (
    <JobFiltersContext.Provider value={{ filters, setFilters, /* ... */ }}>
      {children}
    </JobFiltersContext.Provider>
  );
}

export const useJobFilters = () => useContext(JobFiltersContext);
```

**LocalStorage for Persistence**:
```typescript
// Persist filter preferences
useEffect(() => {
  localStorage.setItem('jobFilters', JSON.stringify(filters));
}, [filters]);

// Persist view preference
const [view, setView] = useLocalStorage('jobsView', 'grid');
```

---

### 8.3 Accessibility

**Keyboard Navigation**:
- Tab order follows visual flow
- Enter/Space for buttons
- Escape closes modals
- Arrow keys in dropdowns/lists

**ARIA Attributes**:
```typescript
<div
  role="search"
  aria-label="Job search"
>
  <input
    type="text"
    aria-label="Search jobs"
    aria-describedby="search-help"
  />
</div>

<button
  aria-label="Save job"
  aria-pressed={isSaved}
>
  <BookmarkIcon aria-hidden="true" />
</button>

<div
  role="region"
  aria-label="Job filters"
  aria-expanded={isPanelOpen}
>
  {/* Filters */}
</div>
```

**Focus Management**:
```typescript
// Focus trap in modal
import { FocusTrap } from '@radix-ui/react-focus-trap';

<Dialog.Root open={isOpen}>
  <FocusTrap>
    <Dialog.Content>
      {/* Modal content */}
    </Dialog.Content>
  </FocusTrap>
</Dialog.Root>
```

**Screen Reader Support**:
- Semantic HTML (nav, main, aside)
- Descriptive labels
- Live regions for dynamic updates
- Skip links

---

### 8.4 SEO Considerations

**Meta Tags**:
```typescript
// Job Details Page
<Helmet>
  <title>{job.title} at {job.company.name} | CareerSU</title>
  <meta name="description" content={job.seoDescription || job.description.slice(0, 160)} />
  <meta property="og:title" content={`${job.title} at ${job.company.name}`} />
  <meta property="og:description" content={job.description.slice(0, 200)} />
  <meta property="og:image" content={job.company.logo} />
  <meta property="og:url" content={`https://careersu.com/jobs/${job.id}/${job.slug}`} />
  <meta name="twitter:card" content="summary_large_image" />
  
  {/* Job Posting Structured Data */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": job.title,
      "description": job.description,
      "datePosted": job.postedAt,
      "validThrough": job.expiresAt,
      "employmentType": job.jobType.toUpperCase(),
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.company.name,
        "sameAs": job.company.website,
        "logo": job.company.logo
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.location.city,
          "addressRegion": job.location.state,
          "addressCountry": job.location.country
        }
      },
      "baseSalary": job.salaryRange && {
        "@type": "MonetaryAmount",
        "currency": job.salaryRange.currency,
        "value": {
          "@type": "QuantitativeValue",
          "minValue": job.salaryRange.min,
          "maxValue": job.salaryRange.max,
          "unitText": job.salaryRange.period
        }
      }
    })}
  </script>
</Helmet>
```

**URL Structure**:
- SEO-friendly slugs
- Canonical URLs
- Proper URL parameters for filters

---

### 8.5 Analytics & Tracking

**Events to Track**:
```typescript
// Search events
trackEvent('job_search', {
  query: searchQuery,
  filters: activeFilters,
  resultsCount: results.length
});

// Job view
trackEvent('job_viewed', {
  jobId: job.id,
  jobTitle: job.title,
  company: job.company.name,
  matchScore: matchScore.overall
});

// Application events
trackEvent('application_started', { jobId });
trackEvent('application_step_completed', { jobId, step: 1 });
trackEvent('application_submitted', { jobId, trackingNumber });

// Engagement
trackEvent('job_saved', { jobId });
trackEvent('job_shared', { jobId, platform: 'linkedin' });
```

---

## 9. Testing Strategy

### Unit Tests
- Component rendering
- User interactions
- Utility functions
- Match score calculation

### Integration Tests
- Search flow
- Filter application
- Application submission
- API interactions

### E2E Tests
- Complete user journeys
- Multi-step forms
- Cross-browser compatibility

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- WCAG 2.1 AA compliance

---

## 10. Future Enhancements

### AI Features
- Resume tailoring suggestions
- Cover letter generation
- Interview question predictions
- Salary negotiation advice

### Collaboration
- Share jobs with mentors
- Coach feedback on applications
- Peer review system

### Analytics
- Application success predictions
- Market insights
- Skill gap analysis

### Integrations
- LinkedIn profile import
- Calendar sync
- Email client integration
- ATS integration for employers

---

## Appendix

### Design Assets Needed
- Company logos (placeholder and CDN)
- Empty state illustrations
- Loading animations
- Success/error icons

### Third-Party Services
- Job data API (Indeed, LinkedIn, etc.)
- Geocoding service (Google Maps)
- Email service (SendGrid, Mailgun)
- Analytics (Google Analytics, Mixpanel)

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

---

**Document Status**: ✅ Complete  
**Last Review**: November 7, 2025  
**Next Review**: As needed during implementation  

**Contributors**: Claude Code AI  
**Approved By**: Verridian AI Team
