# Profile & Settings UI Plan - CareerSU Platform

**Document Version:** 1.0  
**Last Updated:** 2025-11-07  
**Status:** Planning Phase  
**Tech Stack:** React 18.3.1, TypeScript, Vite, Tailwind CSS, Radix UI, Lucide Icons

---

## Table of Contents

1. [Overview](#overview)
2. [Screen Inventory](#screen-inventory)
3. [Component Breakdown](#component-breakdown)
4. [Detailed Component Specifications](#detailed-component-specifications)
5. [User Flows](#user-flows)
6. [Data Requirements](#data-requirements)
7. [File Structure](#file-structure)
8. [Accessibility Requirements](#accessibility-requirements)
9. [Responsive Design Strategy](#responsive-design-strategy)
10. [Implementation Phases](#implementation-phases)

---

## Overview

### Purpose
The Profile & Settings module enables users to manage their personal information, professional details, skills, preferences, and account settings. This is a critical component for both Job Seekers and Career Coaches to maintain their platform presence and customize their experience.

### Key Objectives
- Provide intuitive profile management for both user types
- Enable comprehensive skills and experience tracking
- Offer granular control over notifications and privacy
- Support profile completeness tracking
- Ensure responsive design across all devices
- Maintain accessibility standards (WCAG 2.1 AA)

### User Types
1. **Job Seekers**: Manage career profiles, skills, job preferences
2. **Career Coaches**: Manage professional profiles, expertise areas, coaching preferences

---

## Screen Inventory

### 1. Profile Overview Page (`/profile`)
**Purpose:** Display user's complete profile with edit capabilities  
**Access:** All authenticated users  
**Key Sections:**
- Profile header with avatar and banner
- Personal information display
- Professional summary
- Skills showcase
- Experience timeline
- Education history
- Achievements & certifications
- Portfolio/work samples (Job Seekers)
- Coaching specializations (Coaches)

### 2. Edit Profile Page (`/profile/edit`)
**Purpose:** Comprehensive profile editing interface  
**Access:** Profile owner only  
**Key Sections:**
- Basic information form
- Professional details form
- Bio/summary editor
- Contact information
- Social links

### 3. Skills Management Page (`/profile/skills`)
**Purpose:** Add, edit, and organize skills with proficiency levels  
**Access:** Profile owner only  
**Key Features:**
- Skill search and autocomplete
- Skill categories (Technical, Soft Skills, Languages, Tools)
- Proficiency level indicators
- Skill endorsements (future feature)
- Recommended skills based on profile

### 4. Experience & Education Page (`/profile/experience`)
**Purpose:** Manage work experience and educational background  
**Access:** Profile owner only  
**Key Sections:**
- Work experience entries
- Education entries
- Certifications
- Achievements/awards

### 5. Settings Page (`/settings`)
**Purpose:** Central hub for all account settings  
**Access:** Account owner only  
**Navigation Tabs:**
- Account Settings
- Preferences
- Notifications
- Privacy & Security
- Billing (if applicable)

### 6. Account Settings (`/settings/account`)
**Purpose:** Manage core account information  
**Key Features:**
- Email address management
- Password change
- User role/type
- Account deletion

### 7. Preferences (`/settings/preferences`)
**Purpose:** Customize platform experience  
**Key Features:**
- Display preferences (theme, language)
- Job search preferences (Job Seekers)
- Coaching preferences (Coaches)
- Email frequency
- Default dashboard view

### 8. Notification Settings (`/settings/notifications`)
**Purpose:** Control all notification preferences  
**Key Features:**
- Email notifications toggle
- Push notifications toggle
- Notification categories (Jobs, Messages, Updates, Tips)
- Frequency settings (Instant, Daily Digest, Weekly)

### 9. Privacy Settings (`/settings/privacy`)
**Purpose:** Control privacy and data sharing  
**Key Features:**
- Profile visibility settings
- Search engine indexing
- Data sharing preferences
- Connected accounts
- Download personal data
- Account deactivation

---

## Component Breakdown

### Profile Components

#### 1. ProfileHeader
**Description:** Banner-style header with avatar, name, and key information  
**Props:**
- `user: User`
- `isOwner: boolean`
- `onEditClick: () => void`
- `onAvatarChange: (file: File) => void`

**Visual Elements:**
- Background banner (optional image upload)
- Large profile avatar (circular, 128px)
- User name (h1)
- Headline/title (subtitle)
- Location (with map pin icon)
- Edit profile button (if owner)
- Profile completeness indicator
- Social links (LinkedIn, GitHub, Portfolio)

**States:**
- Default view
- Hover state (shows edit overlay on avatar)
- Loading state (avatar upload)
- Error state (upload failed)

#### 2. ProfileCompleteness
**Description:** Progress indicator showing profile completion percentage  
**Props:**
- `percentage: number`
- `missingFields: string[]`
- `onComplete: (field: string) => void`

**Visual Elements:**
- Circular progress indicator or linear bar
- Percentage text
- Expandable checklist of missing fields
- Quick action buttons for each missing field

**Logic:**
- Calculate based on required fields filled
- Minimum 60% for basic profile
- 100% includes all optional fields

#### 3. ProfileSection
**Description:** Reusable container for profile sections  
**Props:**
- `title: string`
- `icon: LucideIcon`
- `children: ReactNode`
- `editable?: boolean`
- `onEdit?: () => void`
- `isEmpty?: boolean`
- `emptyMessage?: string`

**Visual Elements:**
- Section header with icon
- Edit button (if editable)
- Content area
- Empty state with CTA
- Divider line

#### 4. PersonalInfoCard
**Description:** Displays personal/contact information  
**Props:**
- `user: User`
- `editable: boolean`

**Fields Displayed:**
- Full name
- Email address
- Phone number
- Date of birth (optional)
- Location (city, state, country)
- Website/portfolio URL
- Social media links

**Layout:**
- Two-column grid on desktop
- Single column on mobile
- Icons for each field type

#### 5. ProfessionalSummary
**Description:** Bio/summary section with rich text support  
**Props:**
- `summary: string`
- `editable: boolean`
- `maxLength: number` (default: 2000)
- `onSave: (text: string) => void`

**Features:**
- Rich text display
- Character counter
- Edit mode with textarea
- Markdown support (optional)
- AI writing assistant button

#### 6. SkillsDisplay
**Description:** Visual representation of user skills  
**Props:**
- `skills: Skill[]`
- `editable: boolean`
- `maxVisible?: number`

**Visual Elements:**
- Skill tags/pills with proficiency colors
- Skill categories
- Proficiency indicators (1-5 stars or bars)
- "View all" expansion
- Add skill button (if editable)

**Skill Categories:**
- Technical Skills
- Soft Skills
- Languages
- Tools & Software

**Proficiency Levels:**
- Beginner (1) - Light blue
- Intermediate (2-3) - Medium blue
- Advanced (4) - Dark blue
- Expert (5) - Indigo/purple

#### 7. ExperienceTimeline
**Description:** Chronological work experience display  
**Props:**
- `experiences: Experience[]`
- `editable: boolean`

**Visual Elements:**
- Vertical timeline with dots/icons
- Company logo placeholder
- Job title (bold)
- Company name
- Date range
- Location
- Description (expandable)
- Technologies/skills used (tags)
- Edit/delete buttons (if editable)

**Entry Structure:**
```typescript
interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
}
```

#### 8. EducationList
**Description:** Education history with degrees and certifications  
**Props:**
- `education: Education[]`
- `editable: boolean`

**Visual Elements:**
- Card-based layout
- Institution logo/icon
- Degree/certificate name
- Institution name
- Date range
- GPA (optional)
- Honors/awards (optional)
- Description
- Edit/delete buttons (if editable)

#### 9. AvatarUpload
**Description:** Profile picture upload with crop functionality  
**Props:**
- `currentAvatar?: string`
- `onUpload: (file: File) => Promise<void>`
- `onDelete?: () => void`

**Features:**
- Drag-and-drop support
- Click to browse
- Image preview
- Crop/resize tool (using canvas or library)
- File size validation (max 5MB)
- Format validation (JPG, PNG, WebP)
- Loading state during upload
- Error handling

**Visual States:**
- Empty state with placeholder icon
- Preview with hover overlay ("Change Photo")
- Uploading with progress bar
- Error state with retry option

### Settings Components

#### 10. SettingsLayout
**Description:** Container layout for all settings pages  
**Props:**
- `children: ReactNode`

**Structure:**
- Vertical tab navigation (left sidebar on desktop)
- Horizontal tabs (mobile)
- Content area
- Breadcrumb navigation
- Save indicator ("All changes saved" / "Unsaved changes")

**Navigation Items:**
- Account
- Preferences
- Notifications
- Privacy & Security
- Billing (future)

#### 11. SettingsSection
**Description:** Reusable section container for settings  
**Props:**
- `title: string`
- `description: string`
- `children: ReactNode`
- `divider?: boolean`

**Visual Elements:**
- Section title (h3)
- Description text (muted)
- Content area
- Optional divider

#### 12. FormField
**Description:** Reusable form field with label and validation  
**Props:**
- `label: string`
- `name: string`
- `type: 'text' | 'email' | 'password' | 'tel' | 'url' | 'date'`
- `value: string`
- `onChange: (value: string) => void`
- `error?: string`
- `helpText?: string`
- `required?: boolean`
- `disabled?: boolean`
- `placeholder?: string`

**Features:**
- Label with required indicator
- Input with proper type
- Validation error display
- Help text
- Character counter (for limited fields)
- Copy button (for specific fields like API keys)

#### 13. ToggleSwitch
**Description:** Switch component for boolean settings  
**Props:**
- `label: string`
- `description?: string`
- `checked: boolean`
- `onChange: (checked: boolean) => void`
- `disabled?: boolean`

**Using:** `@radix-ui/react-switch`

**Visual Elements:**
- Label text
- Description (muted, smaller)
- Switch control (Radix UI)
- Active state indicator

#### 14. NotificationSettings
**Description:** Comprehensive notification preferences  
**Props:**
- `settings: NotificationPreferences`
- `onUpdate: (settings: NotificationPreferences) => void`

**Categories:**
- Job Alerts
  - New job matches (toggle + frequency)
  - Application status updates (toggle)
  - Recommended jobs (toggle + frequency)
- Messages
  - New messages (toggle)
  - Message requests (toggle)
- Platform Updates
  - Product updates (toggle)
  - Tips and tutorials (toggle)
  - Newsletter (toggle + frequency)

**Frequency Options:**
- Instant
- Hourly
- Daily Digest
- Weekly Digest
- Never

**Visual Structure:**
- Grouped by category
- Each row: Category name, toggle, frequency dropdown
- "Email" and "Push" columns
- Master toggles for each channel

#### 15. PrivacySettings
**Description:** Privacy and data control settings  
**Props:**
- `settings: PrivacySettings`
- `onUpdate: (settings: PrivacySettings) => void`

**Settings:**
- Profile Visibility
  - Public (anyone can view)
  - Members only (logged-in users)
  - Private (only me)
- Search Engine Indexing (toggle)
- Show Profile in Search Results (toggle)
- Allow Messages from Non-Connections (toggle)
- Data Sharing with Partners (toggle)

**Danger Zone:**
- Download My Data (button)
- Deactivate Account (button)
- Delete Account (button with confirmation)

#### 16. PasswordChangeForm
**Description:** Secure password update form  
**Props:**
- `onSubmit: (data: PasswordChange) => Promise<void>`

**Fields:**
- Current password (password input)
- New password (password input)
- Confirm new password (password input)
- Password strength indicator
- Requirements checklist:
  - At least 8 characters
  - Contains uppercase letter
  - Contains lowercase letter
  - Contains number
  - Contains special character

**Validation:**
- Real-time password strength
- Match validation for confirm field
- Server-side validation
- Rate limiting protection

#### 17. PreferencesForm
**Description:** User preference settings  
**Props:**
- `preferences: UserPreferences`
- `onUpdate: (preferences: UserPreferences) => void`

**Preferences:**
- Display Settings
  - Theme (Light, Dark, System)
  - Language (English, Spanish, etc.)
  - Date format (MM/DD/YYYY, DD/MM/YYYY)
  - Time zone (auto-detect or manual)
  
- Job Search Preferences (Job Seekers)
  - Desired job titles (multi-select)
  - Preferred locations (multi-select)
  - Remote work preference (On-site, Hybrid, Remote, Any)
  - Salary range (min-max slider)
  - Job type (Full-time, Part-time, Contract, Internship)
  - Company size preference
  - Industry preferences
  
- Coaching Preferences (Coaches)
  - Areas of expertise (multi-select)
  - Client capacity (number input)
  - Session duration (dropdown)
  - Availability timezone
  - Coaching style (dropdown)

#### 18. SkillsManager
**Description:** Advanced skill management interface  
**Props:**
- `skills: Skill[]`
- `onAdd: (skill: Skill) => void`
- `onUpdate: (id: string, skill: Skill) => void`
- `onDelete: (id: string) => void`
- `suggestions?: string[]`

**Features:**
- Skill search with autocomplete
- Add custom skills
- Categorization (drag-drop or dropdown)
- Proficiency slider (1-5)
- Years of experience (optional)
- Bulk import from resume
- Recommended skills based on job title
- Skill verification (future feature)

**Visual Layout:**
- Search bar with add button
- Category tabs
- Skill cards with:
  - Skill name
  - Proficiency indicator
  - Years of experience
  - Edit/delete buttons
- Suggested skills section
- Empty state with popular skills

#### 19. ExperienceEditor
**Description:** Modal/drawer for adding/editing experience  
**Props:**
- `experience?: Experience`
- `onSave: (experience: Experience) => void`
- `onCancel: () => void`

**Form Fields:**
- Job title (required)
- Company name (required)
- Location (city, state/country)
- Employment type (Full-time, Part-time, Contract, etc.)
- Start date (month/year picker)
- End date (month/year picker or "Present" checkbox)
- Description (rich text editor)
- Achievements (bullet points, dynamic list)
- Skills used (multi-select from existing skills)

**Validation:**
- Required fields
- Date logic (end date after start date)
- Character limits

**Features:**
- AI writing assistant for description
- Template suggestions based on job title
- Import from LinkedIn (future)

#### 20. EducationEditor
**Description:** Modal/drawer for adding/editing education  
**Props:**
- `education?: Education`
- `onSave: (education: Education) => void`
- `onCancel: () => void`

**Form Fields:**
- Institution name (required)
- Degree type (Bachelor's, Master's, PhD, Certificate, etc.)
- Field of study (required)
- Start date (month/year)
- End date (month/year or "Present")
- GPA (optional)
- Honors/awards (optional)
- Description (optional)
- Activities/societies (optional)

---

## Detailed Component Specifications

### Profile Header Component

#### Desktop Layout (≥1024px)
```
┌─────────────────────────────────────────────────────────┐
│  Banner Image (1200x300px)                     [Edit]   │
│                                                          │
│    ┌────────┐                                           │
│    │        │  John Smith                               │
│    │ Avatar │  Senior Software Engineer                 │
│    │        │  📍 San Francisco, CA                     │
│    │ 128px  │  🔗 LinkedIn • GitHub • Portfolio         │
│    └────────┘  Profile 85% Complete [Progress bar]      │
└─────────────────────────────────────────────────────────┘
```

#### Mobile Layout (<768px)
```
┌─────────────────────┐
│  Banner (375x150)   │
│                     │
│   ┌────────┐        │
│   │ Avatar │        │
│   │  96px  │        │
│   └────────┘        │
│                     │
│   John Smith        │
│   Sr. Software Eng. │
│   📍 SF, CA         │
│   [Links]           │
│   Progress: 85%     │
└─────────────────────┘
```

#### Visual Specifications
- **Banner:**
  - Dimensions: 1200x300px (desktop), 375x150px (mobile)
  - Fallback: Gradient background (blue to purple)
  - Upload button: Top-right corner, appears on hover
  - File size limit: 5MB
  - Formats: JPG, PNG, WebP

- **Avatar:**
  - Size: 128px (desktop), 96px (mobile)
  - Border: 4px white border with shadow
  - Position: Overlaps banner by 50%
  - Hover state: Overlay with "Change Photo" text
  - Fallback: Initials with gradient background

- **Name:**
  - Font: Inter, Bold, 32px (desktop), 24px (mobile)
  - Color: Gray-900
  - Line height: 1.2

- **Headline:**
  - Font: Inter, Regular, 18px (desktop), 16px (mobile)
  - Color: Gray-600
  - Max length: 120 characters

- **Location & Links:**
  - Font: Inter, Regular, 14px
  - Color: Gray-500
  - Icons: Lucide icons, 16px
  - Links: Blue-600, hover underline

- **Progress Bar:**
  - Height: 8px
  - Background: Gray-200
  - Fill: Gradient (green to blue based on percentage)
  - Border radius: 9999px
  - Percentage text: Above bar, 12px, gray-600

#### Interactions
- Click avatar: Open upload modal
- Click banner: Open upload modal (if owner)
- Click edit button: Navigate to /profile/edit
- Click social link: Open in new tab
- Click progress bar: Expand checklist of missing fields

### Skills Display Component

#### Visual Layout
```
┌─────────────────────────────────────────────────┐
│ 💼 Skills                              [+ Add]  │
├─────────────────────────────────────────────────┤
│                                                 │
│ Technical Skills                                │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│ │JavaScript│ │React     │ │TypeScript│         │
│ │ ★★★★★    │ │ ★★★★★    │ │ ★★★★☆    │         │
│ └──────────┘ └──────────┘ └──────────┘         │
│                                                 │
│ Soft Skills                                     │
│ ┌──────────┐ ┌──────────┐                      │
│ │Leadership│ │Teamwork  │ ...                  │
│ │ ★★★★☆    │ │ ★★★★★    │                      │
│ └──────────┘ └──────────┘                      │
│                                                 │
│              [View All Skills]                  │
└─────────────────────────────────────────────────┘
```

#### Skill Pill Specifications
- **Container:**
  - Padding: 12px 16px
  - Border radius: 8px
  - Background: Based on proficiency level
  - Border: 1px solid (darker shade)
  - Shadow: sm
  - Transition: all 0.2s

- **Proficiency Colors:**
  - Level 1 (Beginner): bg-blue-50, border-blue-200, text-blue-700
  - Level 2-3 (Intermediate): bg-blue-100, border-blue-300, text-blue-800
  - Level 4 (Advanced): bg-blue-500, border-blue-600, text-white
  - Level 5 (Expert): bg-indigo-600, border-indigo-700, text-white

- **Stars:**
  - Filled: Yellow-400
  - Empty: Gray-300
  - Size: 14px
  - Spacing: 2px

- **Hover State (if editable):**
  - Scale: 1.02
  - Shadow: md
  - Cursor: pointer
  - Show edit icon

#### Category Tabs
- Tab list: Horizontal scroll on mobile
- Active tab: Blue-600 border-bottom (2px)
- Inactive tab: Gray-500 text
- Font: Inter, Medium, 14px

#### Add Skill Flow
1. Click "+ Add" button
2. Show autocomplete search input
3. Select from suggestions or enter custom
4. Set category (dropdown)
5. Set proficiency (slider with star preview)
6. Optional: Add years of experience
7. Save button adds to list

### Experience Timeline Component

#### Desktop Layout
```
┌─────────────────────────────────────────────────┐
│ 💼 Work Experience                     [+ Add]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ●────────────────────────────────────          │
│  │                                              │
│  │  Senior Software Engineer                   │
│  │  TechCorp Inc. • San Francisco, CA          │
│  │  Jan 2022 - Present (2 years)               │
│  │                                              │
│  │  Led development of microservices...        │
│  │  • Increased performance by 40%             │
│  │  • Mentored 5 junior developers             │
│  │                                              │
│  │  Skills: React TypeScript Node.js AWS       │
│  │                                   [Edit] [X] │
│  ●────────────────────────────────────          │
│  │                                              │
│  │  Software Engineer                          │
│  │  StartupXYZ • Remote                        │
│  │  Mar 2020 - Dec 2021 (1 year 10 months)     │
│  │  ...                                         │
│  │                                              │
└─────────────────────────────────────────────────┘
```

#### Visual Specifications
- **Timeline Line:**
  - Width: 2px
  - Color: Gray-300
  - Left margin: 8px

- **Timeline Dot:**
  - Size: 16px
  - Border: 3px solid blue-600
  - Background: White
  - Shadow: sm
  - Position: Absolute, left aligned with line

- **Entry Container:**
  - Padding: 20px 0 20px 32px
  - Hover: bg-gray-50
  - Border radius: 8px
  - Transition: background 0.2s

- **Job Title:**
  - Font: Inter, Semibold, 18px
  - Color: Gray-900

- **Company & Location:**
  - Font: Inter, Regular, 14px
  - Color: Gray-600
  - Separator: " • "

- **Date Range:**
  - Font: Inter, Regular, 14px
  - Color: Gray-500
  - Format: "MMM YYYY - MMM YYYY (X years Y months)"
  - Current: " - Present" in green-600

- **Description:**
  - Font: Inter, Regular, 14px
  - Color: Gray-700
  - Line height: 1.6
  - Max lines: 3 (collapsed), expandable
  - "Read more" link if truncated

- **Achievements:**
  - Bullet points (•)
  - Indent: 16px
  - Font: Inter, Regular, 14px
  - Color: Gray-700

- **Skills Tags:**
  - Inline pills
  - Small size
  - Gray-100 background
  - Gray-700 text
  - 4px spacing

- **Action Buttons:**
  - Edit: Pencil icon, gray-400, hover gray-600
  - Delete: X icon, gray-400, hover red-600
  - Size: 20px
  - Position: Top-right of entry
  - Visible on hover (desktop) or always (mobile)

### Settings Layout

#### Desktop Layout (≥1024px)
```
┌─────────────────────────────────────────────────────────┐
│  Settings                                               │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│  Account     │  Account Settings                        │
│  Preferences │  ────────────────                        │
│  Notifications│                                         │
│  Privacy     │  Email Address                           │
│  Billing     │  [john@example.com]          [Change]   │
│              │                                          │
│              │  Password                                │
│              │  [••••••••••••••]             [Change]   │
│              │                                          │
│              │  ...                                     │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

#### Mobile Layout (<768px)
```
┌────────────────────┐
│  Settings          │
├────────────────────┤
│ Account Preferences│
│ Notifications etc. │
├────────────────────┤
│                    │
│  Email Address     │
│  [john@example...] │
│  [Change]          │
│                    │
│  Password          │
│  [••••••••••••]    │
│  [Change]          │
│                    │
└────────────────────┘
```

#### Sidebar Navigation
- Width: 240px (desktop)
- Background: Gray-50
- Border: 1px gray-200 right border

- **Nav Item:**
  - Padding: 12px 16px
  - Font: Inter, Medium, 14px
  - Color: Gray-700 (inactive), Blue-600 (active)
  - Background: Transparent (inactive), White (active)
  - Border-left: 3px blue-600 (active)
  - Icon: 20px, left aligned
  - Hover: bg-gray-100

- **Mobile Tabs:**
  - Horizontal scroll
  - Inline-flex
  - Padding: 12px 16px
  - Border-bottom: 2px (active)

#### Content Area
- Padding: 32px (desktop), 16px (mobile)
- Max width: 800px
- Background: White

#### Save Indicator
- Position: Top-right
- Font: Inter, Medium, 12px
- Unsaved: "Unsaved changes" in yellow-600 with dot
- Saved: "All changes saved" in green-600 with checkmark
- Saving: "Saving..." with spinner

### Notification Settings

#### Visual Layout
```
┌─────────────────────────────────────────────────────────┐
│  Notification Settings                                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Choose how you want to receive notifications          │
│                                                         │
│  ┌─────────────────────────────────────────────┐       │
│  │ Notification Type       Email    Push       │       │
│  ├─────────────────────────────────────────────┤       │
│  │ JOB ALERTS                                  │       │
│  │ New job matches         [On] ▼   [On]      │       │
│  │                         Daily               │       │
│  │ Application updates     [On]     [On]      │       │
│  │ Recommended jobs        [Off]    [On] ▼    │       │
│  │                                  Weekly     │       │
│  │                                             │       │
│  │ MESSAGES                                    │       │
│  │ New messages            [On]     [On]      │       │
│  │ Message requests        [On]     [Off]     │       │
│  │                                             │       │
│  │ PLATFORM UPDATES                            │       │
│  │ Product updates         [On]     [Off]     │       │
│  │ Tips & tutorials        [On] ▼   [Off]     │       │
│  │                         Weekly              │       │
│  │ Newsletter              [Off]    [Off]     │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
│  [Reset to Defaults]                   [Save Changes]  │
└─────────────────────────────────────────────────────────┘
```

#### Table Specifications
- **Header:**
  - Background: Gray-50
  - Font: Inter, Semibold, 12px, uppercase
  - Color: Gray-600
  - Padding: 12px 16px
  - Sticky on scroll

- **Category Headers:**
  - Font: Inter, Bold, 11px, uppercase
  - Color: Gray-900
  - Background: Gray-100
  - Padding: 8px 16px
  - Letter spacing: 0.05em

- **Rows:**
  - Padding: 12px 16px
  - Border-bottom: 1px gray-200
  - Hover: bg-gray-50
  - Align-items: center

- **Labels:**
  - Font: Inter, Regular, 14px
  - Color: Gray-700
  - Width: 40%

- **Toggle Switches:**
  - Radix UI Switch component
  - Active: Blue-600
  - Inactive: Gray-300
  - Size: 20px height, 36px width

- **Frequency Dropdown:**
  - Only shows when toggle is ON
  - Options: Instant, Hourly, Daily, Weekly, Never
  - Font: Inter, Regular, 13px
  - Color: Gray-600
  - Indent: 8px from label

#### Responsive Behavior
- Desktop: Table layout
- Tablet: Stacked cards per category
- Mobile: Full-width stacked list

### Privacy Settings

#### Visual Layout
```
┌─────────────────────────────────────────────────────────┐
│  Privacy & Security                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Profile Visibility                                     │
│  Control who can see your profile                       │
│  ○ Public - Anyone on the internet                      │
│  ● Members only - Logged in users                       │
│  ○ Private - Only me                                    │
│                                                         │
│  ────────────────────────────────────────────           │
│                                                         │
│  Search & Indexing                                      │
│  Make my profile discoverable [On]                      │
│  Allow search engines to index [Off]                    │
│                                                         │
│  ────────────────────────────────────────────           │
│                                                         │
│  Communications                                         │
│  Allow messages from non-connections [On]               │
│                                                         │
│  ────────────────────────────────────────────           │
│                                                         │
│  Data & Privacy                                         │
│  Share data with partners [Off]                         │
│                                                         │
│  [Download My Data]                                     │
│                                                         │
│  ────────────────────────────────────────────           │
│                                                         │
│  DANGER ZONE                                            │
│  [Deactivate Account]  [Delete Account]                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Section Specifications

- **Radio Group:**
  - Radix UI Radio Group
  - Spacing: 12px between options
  - Font: Inter, Regular, 14px
  - Radio size: 20px
  - Active color: Blue-600
  - Description text: Gray-500, 13px

- **Toggle Switches:**
  - Same as notification settings
  - Label on left, toggle on right
  - Description below label (gray-500, 12px)

- **Danger Zone:**
  - Background: Red-50
  - Border: 1px red-200
  - Border radius: 8px
  - Padding: 20px
  - Margin top: 40px

- **Danger Buttons:**
  - Outline style
  - Color: Red-600
  - Hover: bg-red-50
  - Font: Inter, Medium, 14px
  - Requires confirmation modal

#### Confirmation Modal (Delete Account)
```
┌─────────────────────────────────────┐
│  Delete Account?                    │
├─────────────────────────────────────┤
│                                     │
│  ⚠️ This action cannot be undone.  │
│                                     │
│  All your data will be permanently  │
│  deleted including:                 │
│  • Profile information              │
│  • Work history                     │
│  • Documents and resumes            │
│  • Application history              │
│                                     │
│  Type DELETE to confirm:            │
│  [_________________]                │
│                                     │
│  [Cancel]    [Delete My Account]   │
└─────────────────────────────────────┘
```

---

## User Flows

### Flow 1: View Own Profile

```
┌─────────────┐
│  Dashboard  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Click Profile│
│   in Nav    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Profile Page Loads  │
│ - Shows all sections│
│ - Edit buttons show │
│ - Progress indicator│
└──────┬──────────────┘
       │
       ▼
┌──────────────────┐
│ Scroll to review │
│ - Personal info  │
│ - Skills         │
│ - Experience     │
│ - Education      │
└──────────────────┘
```

### Flow 2: Edit Profile Information

```
┌──────────────┐
│Profile Page  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│Click Edit    │
│Profile Button│
└──────┬───────┘
       │
       ▼
┌────────────────────┐
│Edit Profile Page   │
│- Form pre-filled   │
│- All fields visible│
└──────┬─────────────┘
       │
       ▼
┌────────────────┐
│Modify fields   │
│- Name          │
│- Headline      │
│- Location      │
│- Bio           │
└──────┬─────────┘
       │
       ▼
┌────────────────┐
│Validation      │
│- Real-time     │
│- On blur       │
└──────┬─────────┘
       │
       ▼
┌────────────────┐
│Click Save      │
└──────┬─────────┘
       │
       ├─Success─►┌──────────────┐
       │          │Toast: Saved  │
       │          │Redirect back │
       │          └──────────────┘
       │
       └─Error───►┌──────────────┐
                  │Show errors   │
                  │Stay on form  │
                  └──────────────┘
```

### Flow 3: Add a New Skill

```
┌──────────────┐
│Profile Page  │
│Skills Section│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│Click + Add   │
│Skill Button  │
└──────┬───────┘
       │
       ▼
┌───────────────────────┐
│Modal/Drawer Opens     │
│- Search input focused │
└──────┬────────────────┘
       │
       ▼
┌───────────────────┐
│Type skill name    │
│- Autocomplete     │
│- Suggestions shown│
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│Select or create   │
│- From suggestions │
│- Or custom skill  │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│Choose category    │
│- Technical        │
│- Soft skills      │
│- Languages        │
│- Tools            │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│Set proficiency    │
│- Slider (1-5)     │
│- Star preview     │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│Optional: Years    │
│of experience      │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│Click Save         │
└──────┬────────────┘
       │
       ▼
┌───────────────────┐
│Skill added to list│
│- Animated entrance│
│- Toast confirmation│
│- Modal closes     │
└───────────────────┘
```

### Flow 4: Add Work Experience

```
┌──────────────┐
│Profile Page  │
│Experience    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│Click + Add   │
│Experience    │
└──────┬───────┘
       │
       ▼
┌─────────────────────┐
│Experience Editor    │
│Modal Opens          │
│- Empty form         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│Fill Required Fields │
│- Job title*         │
│- Company*           │
│- Start date*        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│Current job?         │
│☑ I currently work   │
│  here               │
└──────┬──────────────┘
       │
       ├─Yes─►[End date disabled]
       │
       └─No──►[End date required]
       
       ▼
┌─────────────────────┐
│Add description      │
│- Rich text editor   │
│- AI assist available│
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│Add achievements     │
│- Bullet point list  │
│- Add/remove items   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│Tag relevant skills  │
│- Multi-select       │
│- From existing      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│Click Save           │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│Validation           │
└──────┬──────────────┘
       │
       ├─Valid──►┌──────────────────┐
       │         │Add to timeline   │
       │         │Sort by date      │
       │         │Toast confirmation│
       │         └──────────────────┘
       │
       └─Invalid►┌──────────────────┐
                 │Show errors       │
                 │Highlight fields  │
                 └──────────────────┘
```

### Flow 5: Update Notification Settings

```
┌──────────────┐
│Settings Page │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│Click Notifications│
│Tab               │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│Notification Settings │
│Page Loads            │
│- Current prefs shown │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│Toggle notification   │
│- Click switch        │
│- Immediate UI update │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│If enabled, select    │
│frequency             │
│- Dropdown appears    │
│- Choose option       │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│Auto-save             │
│- Debounced API call  │
│- Show saving indicator│
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│Confirmation          │
│- "Changes saved"     │
│- Green checkmark     │
└────────────────────── ┘
```

### Flow 6: Change Password

```
┌──────────────┐
│Settings >    │
│Account       │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│Click Change      │
│Password          │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│Password Change Form  │
│Modal Opens           │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│Enter current password│
│- Masked input        │
│- Show/hide toggle    │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│Enter new password    │
│- Strength indicator  │
│- Requirements list   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│Confirm new password  │
│- Must match above    │
│- Real-time validation│
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│Check requirements    │
│☑ 8+ characters       │
│☑ Uppercase           │
│☑ Lowercase           │
│☑ Number              │
│☑ Special char        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│Click Change Password │
└──────┬───────────────┘
       │
       ├─Success►┌──────────────────┐
       │         │Toast: Password   │
       │         │changed           │
       │         │Modal closes      │
       │         │Session continues │
       │         └──────────────────┘
       │
       └─Error──►┌──────────────────┐
                 │Show error        │
                 │- Wrong current   │
                 │- Weak password   │
                 │- Server error    │
                 └──────────────────┘
```

### Flow 7: Upload Profile Picture

```
┌──────────────┐
│Profile Page  │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│Hover over avatar │
│- Overlay appears │
│- "Change Photo"  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│Click avatar      │
└──────┬───────────┘
       │
       ▼
┌──────────────────────┐
│Upload Modal Opens    │
│- Drag & drop area    │
│- Browse button       │
└──────┬───────────────┘
       │
       ├─Drag file──►┌─────────────┐
       │             │File dropped │
       │             └──────┬──────┘
       │                    │
       └─Click browse──►┌───┴──────┐
                        │File picker│
                        └───┬──────┘
                            │
                            ▼
┌──────────────────────────────┐
│Validate file                 │
│- Type (JPG, PNG, WebP)       │
│- Size (max 5MB)              │
└──────┬───────────────────────┘
       │
       ├─Invalid►┌────────────────┐
       │         │Error message   │
       │         │Try again       │
       │         └────────────────┘
       │
       └─Valid──►┌────────────────┐
                 │Show preview    │
                 └────┬───────────┘
                      │
                      ▼
┌──────────────────────────────┐
│Crop/Adjust Tool              │
│- Zoom slider                 │
│- Drag to position            │
│- Rotation (optional)         │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────┐
│Click Save        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│Upload to server  │
│- Progress bar    │
│- Cancel option   │
└──────┬───────────┘
       │
       ├─Success►┌──────────────────┐
       │         │Update avatar     │
       │         │Toast: Saved      │
       │         │Modal closes      │
       │         └──────────────────┘
       │
       └─Error──►┌──────────────────┐
                 │Error message     │
                 │Retry option      │
                 └──────────────────┘
```

### Flow 8: Manage Privacy Settings

```
┌──────────────┐
│Settings >    │
│Privacy       │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│Privacy Settings Page │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────────┐
│Profile Visibility        │
│Review current setting    │
│- Public                  │
│- Members only            │
│- Private                 │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│Change visibility         │
│- Click radio button      │
│- Immediate preview       │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│Confirmation modal        │
│"This will affect who can │
│ see your profile"        │
└──────┬───────────────────┘
       │
       ├─Confirm►┌───────────────┐
       │         │Save setting   │
       │         │Toast: Updated │
       │         └───────────────┘
       │
       └─Cancel─►[No change]
       
       │
       ▼
┌──────────────────────────┐
│Toggle other settings     │
│- Search discoverability  │
│- Search engine indexing  │
│- Message permissions     │
│- Data sharing            │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│Auto-save each toggle     │
│- Debounced updates       │
│- Visual confirmation     │
└────────────────────────── ┘
```

---

## Data Requirements

### Data Models

#### User Profile
```typescript
interface User {
  id: string;
  email: string;
  userType: 'job_seeker' | 'career_coach';
  
  // Profile information
  firstName: string;
  lastName: string;
  displayName?: string;
  headline: string; // Max 120 chars
  bio: string; // Max 2000 chars
  
  // Contact & Location
  phoneNumber?: string;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Media
  avatarUrl?: string;
  bannerUrl?: string;
  
  // Social Links
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
    website?: string;
  };
  
  // Metadata
  profileCompleteness: number; // 0-100
  isProfilePublic: boolean;
  isVerified: boolean;
  joinedDate: Date;
  lastActiveDate: Date;
  
  // Relations
  skillIds: string[];
  experienceIds: string[];
  educationIds: string[];
  
  // Settings
  preferences: UserPreferences;
  notificationSettings: NotificationPreferences;
  privacySettings: PrivacySettings;
}
```

#### Skill
```typescript
interface Skill {
  id: string;
  userId: string;
  name: string;
  category: SkillCategory;
  proficiencyLevel: 1 | 2 | 3 | 4 | 5;
  yearsOfExperience?: number;
  isCustom: boolean; // True if user-created, false if from taxonomy
  endorsementCount?: number; // Future feature
  createdAt: Date;
  updatedAt: Date;
}

enum SkillCategory {
  TECHNICAL = 'technical',
  SOFT_SKILLS = 'soft_skills',
  LANGUAGES = 'languages',
  TOOLS = 'tools',
}

// Skill Taxonomy (for autocomplete)
interface SkillTaxonomy {
  id: string;
  name: string;
  category: SkillCategory;
  aliases: string[]; // Alternative names
  relatedSkills: string[]; // Related skill IDs
  popularity: number; // For sorting suggestions
}
```

#### Experience
```typescript
interface Experience {
  id: string;
  userId: string;
  
  jobTitle: string;
  company: string;
  employmentType: EmploymentType;
  location: string;
  
  startDate: Date; // Month and year
  endDate?: Date; // Optional if current
  isCurrent: boolean;
  
  description: string; // Rich text, max 2000 chars
  achievements: string[]; // Bullet points
  
  skillIds: string[]; // Related skills
  
  createdAt: Date;
  updatedAt: Date;
}

enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance',
}
```

#### Education
```typescript
interface Education {
  id: string;
  userId: string;
  
  institution: string;
  degreeType: DegreeType;
  fieldOfStudy: string;
  
  startDate: Date; // Month and year
  endDate?: Date; // Optional if current
  isCurrent: boolean;
  
  gpa?: string;
  grade?: string;
  honors?: string[];
  description?: string;
  activities?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

enum DegreeType {
  HIGH_SCHOOL = 'high_school',
  ASSOCIATES = 'associates',
  BACHELORS = 'bachelors',
  MASTERS = 'masters',
  PHD = 'phd',
  PROFESSIONAL = 'professional',
  CERTIFICATE = 'certificate',
  BOOTCAMP = 'bootcamp',
}
```

#### User Preferences
```typescript
interface UserPreferences {
  userId: string;
  
  // Display Preferences
  theme: 'light' | 'dark' | 'system';
  language: string; // ISO 639-1 code
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeZone: string; // IANA timezone
  
  // Job Search Preferences (Job Seekers)
  jobSearchPreferences?: {
    desiredJobTitles: string[];
    preferredLocations: string[];
    remotePreference: 'onsite' | 'hybrid' | 'remote' | 'any';
    salaryRange: {
      min: number;
      max: number;
      currency: string;
    };
    jobTypes: EmploymentType[];
    companySizePreference: ('startup' | 'small' | 'medium' | 'large' | 'enterprise')[];
    industryPreferences: string[];
  };
  
  // Coaching Preferences (Coaches)
  coachingPreferences?: {
    expertiseAreas: string[];
    clientCapacity: number;
    sessionDuration: number; // minutes
    availabilityTimezone: string;
    coachingStyle: string;
  };
  
  // Dashboard
  defaultDashboardView: string;
  
  updatedAt: Date;
}
```

#### Notification Preferences
```typescript
interface NotificationPreferences {
  userId: string;
  
  // Channels
  emailNotifications: boolean;
  pushNotifications: boolean;
  
  // Categories
  jobAlerts: NotificationCategorySettings;
  messages: NotificationCategorySettings;
  platformUpdates: NotificationCategorySettings;
  
  updatedAt: Date;
}

interface NotificationCategorySettings {
  enabled: boolean;
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly' | 'never';
  
  // Subcategories
  subCategories?: {
    [key: string]: {
      enabled: boolean;
      frequency?: 'instant' | 'hourly' | 'daily' | 'weekly' | 'never';
    };
  };
}

// Example:
// {
//   jobAlerts: {
//     enabled: true,
//     frequency: 'daily',
//     subCategories: {
//       newMatches: { enabled: true, frequency: 'instant' },
//       applicationUpdates: { enabled: true, frequency: 'instant' },
//       recommendations: { enabled: true, frequency: 'weekly' },
//     }
//   }
// }
```

#### Privacy Settings
```typescript
interface PrivacySettings {
  userId: string;
  
  // Profile Visibility
  profileVisibility: 'public' | 'members_only' | 'private';
  
  // Search & Discovery
  allowSearchEngineIndexing: boolean;
  showInSearchResults: boolean;
  
  // Communications
  allowMessagesFromNonConnections: boolean;
  
  // Data Sharing
  shareDataWithPartners: boolean;
  
  // Account Status
  accountStatus: 'active' | 'deactivated';
  
  updatedAt: Date;
}
```

### API Endpoints

#### Profile Endpoints

```typescript
// Get user profile
GET /api/users/:userId/profile
Response: User

// Update profile
PATCH /api/users/:userId/profile
Body: Partial<User>
Response: User

// Upload avatar
POST /api/users/:userId/avatar
Body: FormData (file)
Response: { avatarUrl: string }

// Delete avatar
DELETE /api/users/:userId/avatar
Response: { success: boolean }

// Upload banner
POST /api/users/:userId/banner
Body: FormData (file)
Response: { bannerUrl: string }

// Delete banner
DELETE /api/users/:userId/banner
Response: { success: boolean }
```

#### Skills Endpoints

```typescript
// Get user skills
GET /api/users/:userId/skills
Response: Skill[]

// Add skill
POST /api/users/:userId/skills
Body: Omit<Skill, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
Response: Skill

// Update skill
PATCH /api/users/:userId/skills/:skillId
Body: Partial<Skill>
Response: Skill

// Delete skill
DELETE /api/users/:userId/skills/:skillId
Response: { success: boolean }

// Search skill taxonomy
GET /api/skills/taxonomy/search?q={query}
Response: SkillTaxonomy[]

// Get suggested skills
GET /api/users/:userId/skills/suggestions
Response: SkillTaxonomy[]
```

#### Experience Endpoints

```typescript
// Get user experiences
GET /api/users/:userId/experiences
Response: Experience[]

// Add experience
POST /api/users/:userId/experiences
Body: Omit<Experience, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
Response: Experience

// Update experience
PATCH /api/users/:userId/experiences/:experienceId
Body: Partial<Experience>
Response: Experience

// Delete experience
DELETE /api/users/:userId/experiences/:experienceId
Response: { success: boolean }

// Reorder experiences (for manual sorting)
POST /api/users/:userId/experiences/reorder
Body: { experienceIds: string[] }
Response: { success: boolean }
```

#### Education Endpoints

```typescript
// Get user education
GET /api/users/:userId/education
Response: Education[]

// Add education
POST /api/users/:userId/education
Body: Omit<Education, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
Response: Education

// Update education
PATCH /api/users/:userId/education/:educationId
Body: Partial<Education>
Response: Education

// Delete education
DELETE /api/users/:userId/education/:educationId
Response: { success: boolean }
```

#### Settings Endpoints

```typescript
// Get user preferences
GET /api/users/:userId/preferences
Response: UserPreferences

// Update preferences
PATCH /api/users/:userId/preferences
Body: Partial<UserPreferences>
Response: UserPreferences

// Get notification settings
GET /api/users/:userId/notifications/settings
Response: NotificationPreferences

// Update notification settings
PATCH /api/users/:userId/notifications/settings
Body: Partial<NotificationPreferences>
Response: NotificationPreferences

// Get privacy settings
GET /api/users/:userId/privacy
Response: PrivacySettings

// Update privacy settings
PATCH /api/users/:userId/privacy
Body: Partial<PrivacySettings>
Response: PrivacySettings

// Change password
POST /api/users/:userId/password/change
Body: { currentPassword: string; newPassword: string }
Response: { success: boolean }

// Download user data (GDPR)
GET /api/users/:userId/data/download
Response: File (JSON or ZIP)

// Deactivate account
POST /api/users/:userId/deactivate
Body: { password: string; reason?: string }
Response: { success: boolean }

// Delete account
DELETE /api/users/:userId
Body: { password: string; confirmation: string }
Response: { success: boolean }
```

### Form Validation Rules

#### Profile Form
```typescript
const profileValidation = {
  firstName: {
    required: true,
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z\s-']+$/,
  },
  lastName: {
    required: true,
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z\s-']+$/,
  },
  headline: {
    required: true,
    minLength: 10,
    maxLength: 120,
  },
  bio: {
    required: false,
    maxLength: 2000,
  },
  phoneNumber: {
    required: false,
    pattern: /^\+?[1-9]\d{1,14}$/, // E.164 format
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  website: {
    required: false,
    pattern: /^https?:\/\/.+/,
  },
};
```

#### Skill Form
```typescript
const skillValidation = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  category: {
    required: true,
    enum: Object.values(SkillCategory),
  },
  proficiencyLevel: {
    required: true,
    min: 1,
    max: 5,
  },
  yearsOfExperience: {
    required: false,
    min: 0,
    max: 70,
  },
};
```

#### Experience Form
```typescript
const experienceValidation = {
  jobTitle: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  company: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  employmentType: {
    required: true,
    enum: Object.values(EmploymentType),
  },
  location: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  startDate: {
    required: true,
    type: 'date',
  },
  endDate: {
    required: false,
    type: 'date',
    custom: (value, formData) => {
      if (!formData.isCurrent && !value) {
        return 'End date is required unless currently working here';
      }
      if (value && value < formData.startDate) {
        return 'End date must be after start date';
      }
      return true;
    },
  },
  description: {
    required: false,
    maxLength: 2000,
  },
  achievements: {
    required: false,
    custom: (value) => {
      if (value && value.length > 0) {
        return value.every(a => a.length <= 500);
      }
      return true;
    },
  },
};
```

#### Education Form
```typescript
const educationValidation = {
  institution: {
    required: true,
    minLength: 2,
    maxLength: 200,
  },
  degreeType: {
    required: true,
    enum: Object.values(DegreeType),
  },
  fieldOfStudy: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  startDate: {
    required: true,
    type: 'date',
  },
  endDate: {
    required: false,
    type: 'date',
    custom: (value, formData) => {
      if (!formData.isCurrent && !value) {
        return 'End date is required unless currently studying';
      }
      if (value && value < formData.startDate) {
        return 'End date must be after start date';
      }
      return true;
    },
  },
  gpa: {
    required: false,
    pattern: /^\d\.\d{1,2}$/, // e.g., 3.75
    custom: (value) => {
      const num = parseFloat(value);
      return num >= 0 && num <= 4.0;
    },
  },
};
```

#### Password Validation
```typescript
const passwordValidation = {
  currentPassword: {
    required: true,
    minLength: 8,
  },
  newPassword: {
    required: true,
    minLength: 8,
    maxLength: 128,
    custom: (value) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      
      return {
        valid: hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
        requirements: {
          hasUpperCase,
          hasLowerCase,
          hasNumber,
          hasSpecialChar,
          minLength: value.length >= 8,
        },
      };
    },
  },
  confirmPassword: {
    required: true,
    custom: (value, formData) => {
      return value === formData.newPassword || 'Passwords must match';
    },
  },
};
```

---

## File Structure

```
src/
├── components/
│   ├── profile/
│   │   ├── ProfileHeader.tsx
│   │   ├── ProfileCompleteness.tsx
│   │   ├── ProfileSection.tsx
│   │   ├── PersonalInfoCard.tsx
│   │   ├── ProfessionalSummary.tsx
│   │   ├── SkillsDisplay.tsx
│   │   ├── SkillPill.tsx
│   │   ├── ExperienceTimeline.tsx
│   │   ├── ExperienceEntry.tsx
│   │   ├── EducationList.tsx
│   │   ├── EducationCard.tsx
│   │   ├── AvatarUpload.tsx
│   │   ├── BannerUpload.tsx
│   │   ├── SkillsManager.tsx
│   │   ├── SkillSearchInput.tsx
│   │   ├── ExperienceEditor.tsx
│   │   ├── EducationEditor.tsx
│   │   ├── SocialLinks.tsx
│   │   └── index.ts
│   │
│   ├── settings/
│   │   ├── SettingsLayout.tsx
│   │   ├── SettingsNavigation.tsx
│   │   ├── SettingsSection.tsx
│   │   ├── FormField.tsx
│   │   ├── ToggleSwitch.tsx
│   │   ├── NotificationSettings.tsx
│   │   ├── NotificationRow.tsx
│   │   ├── PrivacySettings.tsx
│   │   ├── PasswordChangeForm.tsx
│   │   ├── PasswordStrengthIndicator.tsx
│   │   ├── PreferencesForm.tsx
│   │   ├── DangerZone.tsx
│   │   ├── DeleteAccountModal.tsx
│   │   └── index.ts
│   │
│   └── ui/
│       ├── button.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── select.tsx
│       ├── switch.tsx
│       ├── radio-group.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── toast.tsx
│       ├── tabs.tsx
│       ├── separator.tsx
│       ├── progress.tsx
│       ├── dropdown-menu.tsx
│       ├── calendar.tsx
│       └── index.ts
│
├── pages/
│   ├── profile/
│   │   ├── ProfilePage.tsx
│   │   ├── EditProfilePage.tsx
│   │   ├── SkillsPage.tsx
│   │   └── ExperiencePage.tsx
│   │
│   └── settings/
│       ├── SettingsPage.tsx
│       ├── AccountSettingsPage.tsx
│       ├── PreferencesPage.tsx
│       ├── NotificationsPage.tsx
│       └── PrivacyPage.tsx
│
├── hooks/
│   ├── useProfile.ts
│   ├── useSkills.ts
│   ├── useExperience.ts
│   ├── useEducation.ts
│   ├── useSettings.ts
│   ├── useNotifications.ts
│   ├── usePrivacy.ts
│   ├── useImageUpload.ts
│   ├── useFormValidation.ts
│   └── useAutoSave.ts
│
├── lib/
│   ├── api/
│   │   ├── profile.ts
│   │   ├── skills.ts
│   │   ├── experience.ts
│   │   ├── education.ts
│   │   ├── settings.ts
│   │   └── uploads.ts
│   │
│   ├── validations/
│   │   ├── profile.ts
│   │   ├── skill.ts
│   │   ├── experience.ts
│   │   ├── education.ts
│   │   ├── password.ts
│   │   └── common.ts
│   │
│   └── utils/
│       ├── dateFormatters.ts
│       ├── imageCompression.ts
│       ├── profileCompleteness.ts
│       └── passwordStrength.ts
│
├── types/
│   ├── user.ts
│   ├── skill.ts
│   ├── experience.ts
│   ├── education.ts
│   ├── preferences.ts
│   ├── notifications.ts
│   └── privacy.ts
│
└── constants/
    ├── skillCategories.ts
    ├── employmentTypes.ts
    ├── degreeTypes.ts
    ├── notificationCategories.ts
    └── countries.ts
```

### Component File Organization

Each component file should follow this structure:

```typescript
// ComponentName.tsx

import React from 'react';
import { LucideIcon } from 'lucide-react';
// ... other imports

// Types
interface ComponentNameProps {
  // ... props
}

// Component
export const ComponentName: React.FC<ComponentNameProps> = ({
  // ... props
}) => {
  // Hooks
  // State
  // Effects
  // Handlers
  
  // Render
  return (
    // ... JSX
  );
};

// Display name (for debugging)
ComponentName.displayName = 'ComponentName';

// Default export
export default ComponentName;
```

### Hook File Organization

```typescript
// useHookName.ts

import { useState, useEffect } from 'react';
import { apiMethod } from '@/lib/api';
// ... other imports

// Types
interface UseHookNameOptions {
  // ... options
}

interface UseHookNameReturn {
  // ... return values
}

// Hook
export const useHookName = (
  options: UseHookNameOptions
): UseHookNameReturn => {
  // State
  // Effects
  // Methods
  
  // Return
  return {
    // ... values and methods
  };
};

// Default export
export default useHookName;
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance

#### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Logical tab order throughout forms
- Focus indicators visible on all focusable elements
- Skip links for main content
- Keyboard shortcuts for common actions:
  - `Ctrl/Cmd + S`: Save changes
  - `Esc`: Close modals/drawers
  - `Tab`: Next field
  - `Shift + Tab`: Previous field

#### Screen Reader Support
- Semantic HTML elements (`<main>`, `<nav>`, `<section>`, `<article>`)
- ARIA labels for all interactive elements
- ARIA live regions for dynamic content updates
- Form labels properly associated with inputs
- Error messages announced to screen readers
- Loading states announced
- Success/failure feedback announced

#### Visual Accessibility
- Minimum contrast ratio 4.5:1 for normal text
- Minimum contrast ratio 3:1 for large text (18pt+)
- Focus indicators: 2px solid outline with high contrast
- Color not used as sole means of conveying information
- Text resizable up to 200% without loss of functionality
- Touch targets minimum 44x44px

#### Form Accessibility
- Label for every form field
- Required fields indicated with asterisk and `aria-required`
- Error messages with `aria-invalid` and `aria-describedby`
- Group related fields with `<fieldset>` and `<legend>`
- Autocomplete attributes where appropriate
- Help text associated with `aria-describedby`

#### Component-Specific Requirements

**ProfileHeader:**
- Avatar image has meaningful alt text
- Edit buttons have descriptive aria-labels
- Progress bar has aria-valuenow, aria-valuemin, aria-valuemax

**SkillsDisplay:**
- Skill pills are buttons or links with proper roles
- Proficiency level announced to screen readers
- Add skill button has clear label

**ExperienceTimeline:**
- Timeline semantically structured with proper headings
- Dates in accessible format
- Edit/delete buttons have descriptive labels including item name

**Forms:**
- Real-time validation errors announced
- Success messages announced
- Required fields clearly marked
- Error summary at top of form on submit

**Modals/Drawers:**
- Focus trapped within modal when open
- Focus returned to trigger element on close
- Esc key closes modal
- Backdrop click closes modal (with warning if unsaved changes)

### Testing Checklist
- [ ] Keyboard-only navigation works throughout
- [ ] Screen reader (NVDA/JAWS/VoiceOver) can access all content
- [ ] Color contrast passes WCAG AA
- [ ] Forms are fully accessible
- [ ] Focus indicators are visible
- [ ] ARIA labels are meaningful
- [ ] Error messages are clear and helpful
- [ ] Loading states are announced
- [ ] Touch targets are adequate size

---

## Responsive Design Strategy

### Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Small devices (landscape phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices
  '2xl': '1536px', // 2X large devices
};
```

### Layout Strategies

#### Profile Page

**Mobile (<768px):**
- Single column layout
- Stacked sections
- Avatar: 96px centered
- Banner: Full width, 150px height
- Sections: Full width cards with 16px padding
- Skills: 2-3 per row, smaller pills
- Timeline: Simplified with smaller dots
- Sticky header with edit button

**Tablet (768px - 1023px):**
- Single column with wider content area
- Avatar: 112px
- Banner: Full width, 200px height
- Sections: Max width 700px, centered
- Skills: 3-4 per row
- Timeline: Full design

**Desktop (≥1024px):**
- Two-column layout for some sections
- Avatar: 128px
- Banner: Full width, 300px height
- Sections: Max width 1200px
- Skills: 4-6 per row
- Timeline: Full design with hover effects
- Sidebar navigation (future feature)

#### Edit Profile Page

**Mobile:**
- Full-width form fields
- Stacked layout
- Bottom action bar (sticky)
- Collapsible sections

**Tablet:**
- Form fields max width 500px
- Centered layout
- Bottom action bar

**Desktop:**
- Two-column form layout
- Left: Form fields (60%)
- Right: Preview (40%) or tips
- Fixed action bar at top

#### Settings Page

**Mobile:**
- Tab navigation at top (horizontal scroll)
- Full-width content
- Sticky save button at bottom
- Collapsible sections

**Tablet:**
- Tab navigation at top
- Content max width 700px, centered
- Fixed save indicator

**Desktop:**
- Sidebar navigation (left, 240px)
- Content area (right, remaining space)
- Content max width 800px
- Sticky save indicator at top-right

### Component Responsive Behavior

#### SkillsDisplay
- Mobile: 2 columns, compact pills
- Tablet: 3 columns
- Desktop: 4-6 columns, full-size pills

#### ExperienceTimeline
- Mobile: Simplified timeline, smaller dots, condensed spacing
- Tablet: Full timeline
- Desktop: Full timeline with hover effects

#### NotificationSettings
- Mobile: Stacked list, each row full width
- Tablet: Table layout with columns
- Desktop: Full table with all columns visible

#### Forms
- Mobile: Full-width inputs, stacked
- Tablet: Inputs max width 500px
- Desktop: Two-column grid for related fields

### Touch Targets

- Minimum size: 44x44px
- Spacing: 8px minimum between targets
- Larger for primary actions: 48x48px

### Typography Scaling

```css
/* Mobile */
h1: 24px / 1.2
h2: 20px / 1.3
h3: 18px / 1.4
body: 14px / 1.5
small: 12px / 1.4

/* Tablet */
h1: 28px / 1.2
h2: 22px / 1.3
h3: 18px / 1.4
body: 14px / 1.5
small: 12px / 1.4

/* Desktop */
h1: 32px / 1.2
h2: 24px / 1.3
h3: 20px / 1.4
body: 16px / 1.5
small: 14px / 1.4
```

### Images

- Avatar: 96px (mobile), 112px (tablet), 128px (desktop)
- Banner: Responsive heights, maintain aspect ratio
- Lazy loading for non-critical images
- Optimized formats (WebP with JPG fallback)

### Performance Considerations

- Code splitting by page
- Lazy load modals/drawers
- Debounce search inputs
- Throttle scroll events
- Virtualize long lists (skills, experience if >20 items)
- Optimize images on upload
- Cache API responses

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
**Goal:** Set up basic profile viewing and editing

**Tasks:**
- [ ] Create data models and TypeScript types
- [ ] Set up API endpoints (mock or real)
- [ ] Build ProfileHeader component
- [ ] Build ProfileSection component
- [ ] Build PersonalInfoCard component
- [ ] Create ProfilePage layout
- [ ] Create EditProfilePage layout
- [ ] Implement basic form validation
- [ ] Set up routing

**Deliverables:**
- Users can view their profile
- Users can edit basic information (name, headline, bio, location)
- Profile page is responsive

### Phase 2: Skills Management (Week 3)
**Goal:** Enable comprehensive skills management

**Tasks:**
- [ ] Build SkillsDisplay component
- [ ] Build SkillPill component
- [ ] Build SkillsManager component
- [ ] Build SkillSearchInput with autocomplete
- [ ] Create skill taxonomy data
- [ ] Implement skill CRUD operations
- [ ] Add proficiency level selection
- [ ] Add skill categorization
- [ ] Build suggested skills feature

**Deliverables:**
- Users can add/edit/delete skills
- Skills are categorized and searchable
- Proficiency levels are visual and clear
- Suggested skills based on profile

### Phase 3: Experience & Education (Week 4)
**Goal:** Enable work experience and education management

**Tasks:**
- [ ] Build ExperienceTimeline component
- [ ] Build ExperienceEntry component
- [ ] Build ExperienceEditor modal
- [ ] Build EducationList component
- [ ] Build EducationCard component
- [ ] Build EducationEditor modal
- [ ] Implement date pickers
- [ ] Add rich text editor for descriptions
- [ ] Implement experience/education CRUD
- [ ] Add sorting and filtering

**Deliverables:**
- Users can manage work experience
- Users can manage education history
- Timeline is visual and chronological
- Forms have proper validation

### Phase 4: Media Uploads (Week 5)
**Goal:** Enable avatar and banner image uploads

**Tasks:**
- [ ] Build AvatarUpload component
- [ ] Build BannerUpload component
- [ ] Implement image crop/resize functionality
- [ ] Set up file upload API endpoints
- [ ] Add image compression
- [ ] Implement drag-and-drop
- [ ] Add upload progress indicators
- [ ] Handle upload errors
- [ ] Implement image deletion

**Deliverables:**
- Users can upload and crop avatar
- Users can upload and adjust banner
- Images are optimized for web
- Upload experience is smooth

### Phase 5: Settings - Account & Preferences (Week 6)
**Goal:** Enable account and preference management

**Tasks:**
- [ ] Build SettingsLayout component
- [ ] Build SettingsNavigation component
- [ ] Build SettingsSection component
- [ ] Build FormField component
- [ ] Build PreferencesForm component
- [ ] Build PasswordChangeForm component
- [ ] Build PasswordStrengthIndicator component
- [ ] Implement password change logic
- [ ] Implement preferences CRUD
- [ ] Add theme switching

**Deliverables:**
- Users can change password
- Users can update preferences
- Settings are organized and navigable
- Forms have validation and feedback

### Phase 6: Notifications & Privacy (Week 7)
**Goal:** Enable notification and privacy controls

**Tasks:**
- [ ] Build NotificationSettings component
- [ ] Build NotificationRow component
- [ ] Build ToggleSwitch component
- [ ] Build PrivacySettings component
- [ ] Build DangerZone component
- [ ] Build DeleteAccountModal component
- [ ] Implement notification preferences CRUD
- [ ] Implement privacy settings CRUD
- [ ] Add account deactivation flow
- [ ] Add account deletion flow with confirmation

**Deliverables:**
- Users can control all notifications
- Users can manage privacy settings
- Account deletion requires confirmation
- Data download is available (GDPR)

### Phase 7: Polish & Optimization (Week 8)
**Goal:** Refine UX, accessibility, and performance

**Tasks:**
- [ ] Comprehensive accessibility audit
- [ ] Keyboard navigation testing
- [ ] Screen reader testing
- [ ] Performance optimization
- [ ] Add loading skeletons
- [ ] Add empty states
- [ ] Implement optimistic updates
- [ ] Add animations and transitions
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Fix bugs and edge cases

**Deliverables:**
- WCAG 2.1 AA compliant
- Smooth animations
- Fast load times
- Works across devices and browsers
- Professional polish

### Phase 8: Advanced Features (Future)
**Goal:** Add nice-to-have features

**Ideas:**
- Social profile import (LinkedIn)
- Skill endorsements
- Profile strength tips
- AI profile optimization suggestions
- Profile templates
- Public profile sharing
- QR code for profile
- Profile analytics
- Comparison with similar profiles

---

## Design Tokens

### Colors

```typescript
const colors = {
  // Primary (Blue)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Secondary (Green)
  secondary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#10b981',  // Secondary
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  
  // Accent (Purple)
  accent: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',  // Accent
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  
  // Neutral (Gray)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Semantic
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};
```

### Spacing

```typescript
const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
};
```

### Border Radius

```typescript
const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  full: '9999px',
};
```

### Shadows

```typescript
const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: 'none',
};
```

### Transitions

```typescript
const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
};
```

---

## Security Considerations

### Input Sanitization
- Sanitize all user inputs before saving
- XSS protection for rich text fields
- SQL injection prevention (use parameterized queries)
- File upload validation (type, size, content)

### Authentication & Authorization
- Verify user owns the profile being edited
- JWT token validation on all API calls
- Rate limiting on sensitive operations (password change, account deletion)
- CSRF protection

### Data Privacy
- Encrypt sensitive data at rest
- HTTPS only for all communications
- Don't expose sensitive data in client-side code
- Implement proper CORS policies

### File Uploads
- Validate file types (whitelist approach)
- Scan uploads for malware
- Limit file sizes
- Store in secure, non-public location
- Generate unique filenames to prevent overwrites
- Implement CDN with access controls

### Password Management
- Hash passwords with bcrypt (or Argon2)
- Enforce password complexity requirements
- Rate limit password change attempts
- Require current password for sensitive changes
- Optional: 2FA for account changes

### Account Deletion
- Require password confirmation
- Require typing "DELETE" to confirm
- Implement soft delete with grace period
- Permanently delete data after grace period
- Notify user via email after deletion

---

## Testing Strategy

### Unit Tests
- Test all validation functions
- Test utility functions (date formatting, password strength, etc.)
- Test custom hooks
- Test form submission handlers

### Component Tests
- Test component rendering
- Test user interactions
- Test form validation
- Test error states
- Test loading states
- Test empty states

### Integration Tests
- Test complete user flows
- Test API integration
- Test data persistence
- Test file uploads
- Test form submissions

### E2E Tests
- Test critical paths:
  - Profile editing workflow
  - Skills management workflow
  - Password change workflow
  - Account deletion workflow
- Test across different devices
- Test across different browsers

### Accessibility Tests
- Automated testing with axe or Pa11y
- Manual keyboard navigation testing
- Screen reader testing
- Color contrast testing

### Performance Tests
- Lighthouse audits
- Load time testing
- Bundle size analysis
- API response time monitoring

---

## Monitoring & Analytics

### User Behavior Tracking
- Profile completion rate
- Most commonly edited fields
- Average time to complete profile
- Skills most frequently added
- Feature usage statistics

### Error Tracking
- Form validation errors
- API errors
- Upload failures
- Client-side errors

### Performance Monitoring
- Page load times
- API response times
- Time to interactive
- Core Web Vitals

### A/B Testing Opportunities
- Profile layout variations
- Form field order
- CTA button text
- Skill suggestion algorithm

---

## Future Enhancements

### Short Term (3-6 months)
- LinkedIn profile import
- Resume parser (auto-populate from uploaded resume)
- Profile templates
- Skill endorsements
- Profile strength score
- AI-powered profile optimization suggestions
- Public profile sharing

### Medium Term (6-12 months)
- Profile analytics dashboard
- Achievements & certifications
- Portfolio section with file uploads
- Video introduction
- Custom profile URL
- Profile comparison with similar users
- Profile export (PDF)

### Long Term (12+ months)
- Social features (follow, endorse)
- Profile verification badge
- Integration with third-party tools
- API for external applications
- White-label profile pages
- Multi-language support
- Advanced privacy controls (granular field visibility)

---

## Appendix

### Sample Skill Taxonomy

```typescript
const sampleSkills = [
  // Programming Languages
  { name: 'JavaScript', category: 'technical', popularity: 95 },
  { name: 'Python', category: 'technical', popularity: 93 },
  { name: 'Java', category: 'technical', popularity: 85 },
  { name: 'TypeScript', category: 'technical', popularity: 82 },
  { name: 'C++', category: 'technical', popularity: 70 },
  
  // Frameworks
  { name: 'React', category: 'technical', popularity: 90 },
  { name: 'Node.js', category: 'technical', popularity: 85 },
  { name: 'Angular', category: 'technical', popularity: 75 },
  { name: 'Vue.js', category: 'technical', popularity: 72 },
  { name: 'Django', category: 'technical', popularity: 68 },
  
  // Tools
  { name: 'Git', category: 'tools', popularity: 95 },
  { name: 'Docker', category: 'tools', popularity: 80 },
  { name: 'AWS', category: 'tools', popularity: 85 },
  { name: 'Kubernetes', category: 'tools', popularity: 70 },
  { name: 'Jenkins', category: 'tools', popularity: 65 },
  
  // Soft Skills
  { name: 'Leadership', category: 'soft_skills', popularity: 90 },
  { name: 'Communication', category: 'soft_skills', popularity: 95 },
  { name: 'Teamwork', category: 'soft_skills', popularity: 92 },
  { name: 'Problem Solving', category: 'soft_skills', popularity: 88 },
  { name: 'Time Management', category: 'soft_skills', popularity: 85 },
  
  // Languages
  { name: 'English', category: 'languages', popularity: 98 },
  { name: 'Spanish', category: 'languages', popularity: 75 },
  { name: 'Mandarin', category: 'languages', popularity: 60 },
  { name: 'French', category: 'languages', popularity: 55 },
  { name: 'German', category: 'languages', popularity: 50 },
];
```

### Sample Form States

```typescript
// Loading State
{
  loading: true,
  data: null,
  error: null,
}

// Success State
{
  loading: false,
  data: { /* user data */ },
  error: null,
}

// Error State
{
  loading: false,
  data: null,
  error: {
    message: 'Failed to load profile',
    code: 'PROFILE_LOAD_ERROR',
  },
}

// Submitting State
{
  submitting: true,
  data: { /* current data */ },
  error: null,
}

// Validation Error State
{
  loading: false,
  data: { /* current data */ },
  error: null,
  validationErrors: {
    firstName: 'First name is required',
    email: 'Invalid email format',
  },
}
```

### Sample API Responses

```typescript
// Success Response
{
  success: true,
  data: {
    // ... entity data
  },
  message: 'Profile updated successfully',
}

// Error Response
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    details: [
      { field: 'firstName', message: 'First name is required' },
      { field: 'email', message: 'Invalid email format' },
    ],
  },
}

// List Response
{
  success: true,
  data: [
    // ... array of entities
  ],
  pagination: {
    page: 1,
    pageSize: 20,
    totalPages: 5,
    totalItems: 93,
  },
}
```

---

## Conclusion

This UI plan provides a comprehensive blueprint for implementing the Profile & Settings features of the CareerSU platform. The modular component architecture, detailed specifications, and phased implementation approach ensure that the development process is organized, efficient, and results in a high-quality user experience.

### Key Takeaways

1. **User-Centric Design**: Every component is designed with the user's needs in mind, providing intuitive interfaces for managing career information.

2. **Accessibility First**: WCAG 2.1 AA compliance is built into the design from the start, not added as an afterthought.

3. **Responsive & Mobile-Ready**: All components adapt seamlessly across devices, ensuring a consistent experience.

4. **Scalable Architecture**: The component structure is modular and reusable, making future enhancements easier.

5. **Data-Driven**: Comprehensive data models and API specifications ensure smooth integration with the backend.

6. **Security-Conscious**: Security considerations are integrated throughout, protecting user data and privacy.

### Next Steps

1. Review this plan with the development team
2. Prioritize features based on user needs and business goals
3. Begin Phase 1 implementation
4. Set up testing infrastructure
5. Establish design system components
6. Create mockups for key screens
7. Develop API endpoints (or mock data)
8. Start building core components

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-07 | AI Assistant | Initial comprehensive UI plan |

---

*This document is a living specification and should be updated as requirements evolve and implementation progresses.*
