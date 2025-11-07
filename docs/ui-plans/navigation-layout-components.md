# CareerSU Platform - Navigation, Layout & Component System

**Document Version:** 1.0.0  
**Last Updated:** 2025-11-07  
**Status:** Draft  

---

## Table of Contents

1. [Overview](#overview)
2. [Navigation System](#1-navigation-system)
3. [Layout Components](#2-layout-components)
4. [Shared Components Library](#3-shared-components-library)
5. [Design System Specifications](#4-design-system-specifications)
6. [Accessibility Requirements](#5-accessibility-requirements)
7. [File Structure](#6-file-structure)
8. [Implementation Checklist](#7-implementation-checklist)

---

## Overview

This document defines the complete UI architecture for the CareerSU platform, including navigation patterns, layout systems, shared components, and design specifications. The system is built using React 18.3.1, TypeScript, Tailwind CSS, and Radix UI components.

### Core Principles

- **Consistency**: Uniform design patterns across all pages
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **Responsiveness**: Mobile-first, works on all devices
- **Performance**: Optimized for fast loading and smooth interactions
- **Maintainability**: Modular, reusable, well-documented components

### Technology Stack

- **Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.0.1
- **Styling**: Tailwind CSS v3.4.16 + tailwindcss-animate
- **UI Primitives**: Radix UI (comprehensive collection)
- **Icons**: Lucide React (v0.364.0)
- **Routing**: React Router DOM v6
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner (toast library)
- **Class Management**: clsx + tailwind-merge + class-variance-authority

---

## 1. Navigation System

### 1.1 Main Navigation Bar

#### Desktop Navigation (≥1024px)

**Component**: `MainNavigation.tsx`

```typescript
// Location: src/components/navigation/MainNavigation.tsx

interface MainNavigationProps {
  variant?: 'authenticated' | 'public';
  userRole?: 'job-seeker' | 'coach' | 'admin';
  currentPath?: string;
}
```

**Structure**:
```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo]  Dashboard  Jobs  Documents  Chat  [Search]  [User Menu] │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications**:
- **Height**: 64px (h-16)
- **Background**: bg-white dark:bg-gray-900
- **Border**: border-b border-gray-200 dark:border-gray-800
- **Shadow**: shadow-sm
- **Position**: sticky top-0, z-50
- **Padding**: px-4 md:px-6 lg:px-8

**Logo Section**:
- Size: 40px × 40px (h-10 w-10)
- Text: "CareerSU" text-xl font-bold text-primary
- Link: Routes to "/" or "/dashboard" based on auth state
- Spacing: mr-8

**Navigation Links**:
- Typography: text-sm font-medium
- Colors:
  - Default: text-gray-600 dark:text-gray-300
  - Hover: text-gray-900 dark:text-white
  - Active: text-primary border-b-2 border-primary
- Spacing: space-x-6
- Transition: transition-colors duration-200

**Search Bar** (Optional, for larger screens):
- Width: w-64 lg:w-96
- Margin: mx-auto
- Component: Radix UI Command/Combobox
- Shortcut: ⌘K / Ctrl+K

**User Menu**:
- Avatar: 32px × 32px (h-8 w-8)
- Dropdown: Radix UI DropdownMenu
- Items: Profile, Settings, Notifications, Logout
- Position: ml-auto

#### Mobile Navigation (<1024px)

**Component**: `MobileNavigation.tsx`

```
┌─────────────────────────────┐
│ [☰]  [Logo]        [Avatar] │
└─────────────────────────────┘
```

**Specifications**:
- **Height**: 56px (h-14)
- **Hamburger Menu**: 
  - Size: 24px × 24px
  - Icon: lucide-react Menu
  - Position: left side, ml-4
- **Logo**: Center-aligned
- **Avatar**: Right side, mr-4

**Mobile Menu Drawer**:
- Component: Radix UI Sheet/Dialog
- Animation: Slide from left
- Width: 80% max-w-sm
- Background: bg-white dark:bg-gray-900
- Links: Full width, py-4 px-6, text-base

### 1.2 Sidebar Navigation

#### Desktop Sidebar (≥1024px)

**Component**: `SidebarNavigation.tsx`

```typescript
interface SidebarNavigationProps {
  collapsed?: boolean;
  onToggle?: () => void;
  sections: NavigationSection[];
  footer?: React.ReactNode;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface NavigationItem {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string | number;
  notifications?: number;
}
```

**Specifications**:
- **Width**: 
  - Expanded: 256px (w-64)
  - Collapsed: 64px (w-16)
- **Height**: Full viewport minus header (h-[calc(100vh-4rem)])
- **Background**: bg-gray-50 dark:bg-gray-900
- **Border**: border-r border-gray-200 dark:border-gray-800
- **Position**: sticky left-0, top-16
- **Transition**: transition-all duration-300

**Navigation Items**:
```
┌──────────────────────┐
│ [Icon] Dashboard     │  ← Default state
│ [Icon] Jobs       (3)│  ← With badge
│                      │
│ DOCUMENTS            │  ← Section header
│ [Icon] My Resumes    │
│ [Icon] Cover Letters │
│                      │
│ [Toggle Collapse]    │  ← Footer
└──────────────────────┘
```

**Item States**:
- Default: text-gray-600 dark:text-gray-400
- Hover: bg-gray-100 dark:bg-gray-800
- Active: bg-primary-50 text-primary border-l-4 border-primary
- Disabled: opacity-50 cursor-not-allowed

**Collapsed State**:
- Shows only icons
- Tooltip on hover (Radix UI Tooltip)
- Badges appear as dots

### 1.3 Breadcrumbs

**Component**: `Breadcrumbs.tsx`

```typescript
interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}
```

**Specifications**:
- **Container**: flex items-center space-x-2 text-sm
- **Separator**: ChevronRight icon (lucide-react), text-gray-400
- **Items**:
  - Link: text-gray-600 hover:text-gray-900 transition-colors
  - Current: text-gray-900 font-medium
- **Max Display**: Show ellipsis (...) if >4 items
- **Responsive**: Hide on mobile (<640px), show on tablet+

**Example**:
```
Dashboard > Documents > Resumes > Software Engineer Resume
```

### 1.4 Footer

**Component**: `Footer.tsx`

```typescript
interface FooterProps {
  variant?: 'full' | 'minimal';
  showNewsletter?: boolean;
}
```

#### Full Footer (Landing/Marketing Pages)

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  CAREERSU          PRODUCT         COMPANY        LEGAL   │
│                                                           │
│  AI-Powered        Features        About          Terms   │
│  Career Success    Pricing         Careers        Privacy │
│                    Customers       Blog           Cookies │
│                                                           │
│  ──────────────────────────────────────────────────────── │
│                                                           │
│  © 2025 CareerSU. All rights reserved.  [Social Icons]   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

**Specifications**:
- **Background**: bg-gray-900 dark:bg-black
- **Text**: text-gray-300
- **Padding**: py-12 px-4 md:px-6 lg:px-8
- **Grid**: grid grid-cols-2 md:grid-cols-4 gap-8

**Section Headers**:
- Typography: text-sm font-semibold text-white uppercase tracking-wider
- Margin: mb-4

**Links**:
- Typography: text-sm
- Color: text-gray-400 hover:text-white
- Spacing: space-y-2
- Transition: transition-colors duration-200

#### Minimal Footer (App Pages)

```
┌──────────────────────────────────────────────────┐
│  © 2025 CareerSU  |  Terms  |  Privacy  |  Help  │
└──────────────────────────────────────────────────┘
```

**Specifications**:
- **Height**: 48px (h-12)
- **Background**: bg-gray-50 dark:bg-gray-900
- **Border**: border-t border-gray-200 dark:border-gray-800
- **Content**: flex justify-center items-center text-sm text-gray-600

### 1.5 User Menu / Dropdown

**Component**: `UserMenu.tsx`

```typescript
interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role: string;
  };
  onLogout: () => void;
}
```

**Trigger**:
- Avatar + Name (desktop) or Avatar only (mobile)
- Chevron down icon
- Hover/active states

**Dropdown Menu** (Radix UI DropdownMenu):

```
┌─────────────────────────┐
│ John Doe                │  ← User info section
│ john@example.com        │
│ ─────────────────────── │
│ [Icon] My Profile       │
│ [Icon] Settings         │
│ [Icon] Notifications    │
│ [Icon] Billing          │
│ ─────────────────────── │
│ [Icon] Help & Support   │
│ [Icon] Keyboard Shortcuts│
│ ─────────────────────── │
│ [Icon] Sign Out         │
└─────────────────────────┘
```

**Specifications**:
- **Width**: w-64
- **Padding**: p-2
- **Background**: bg-white dark:bg-gray-800
- **Border**: border border-gray-200 dark:border-gray-700
- **Shadow**: shadow-lg
- **Radius**: rounded-lg

**Menu Items**:
- Padding: px-3 py-2 rounded-md
- Hover: bg-gray-100 dark:bg-gray-700
- Icon: mr-3, size-4
- Typography: text-sm

**User Info Section**:
- Padding: p-3
- Border: border-b border-gray-200
- Avatar: h-10 w-10
- Name: text-sm font-medium
- Email: text-xs text-gray-500

---

## 2. Layout Components

### 2.1 App Shell / Wrapper

**Component**: `AppShell.tsx`

```typescript
interface AppShellProps {
  children: React.ReactNode;
  variant?: 'public' | 'authenticated';
  showSidebar?: boolean;
  sidebarContent?: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}
```

**Structure**:
```
┌─────────────────────────────────────┐
│        Header (Navigation)          │ ← Sticky top
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │    Main Content          │
│ (optional)│                         │
│          │                          │
│          │                          │
├──────────┴──────────────────────────┤
│          Footer (optional)          │
└─────────────────────────────────────┘
```

**Specifications**:
- **Container**: min-h-screen flex flex-col
- **Layout**: Use CSS Grid or Flexbox
- **Main Content**: flex-1 overflow-auto
- **Background**: bg-gray-50 dark:bg-gray-950

### 2.2 Page Layouts

#### Full-Width Layout

**Component**: `FullWidthLayout.tsx`

```typescript
interface FullWidthLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}
```

**Specifications**:
- **Container**: w-full
- **Content**: No max-width constraint
- **Padding**: px-4 md:px-6 lg:px-8
- **Use Cases**: Dashboard, data tables, editors

#### Centered Layout

**Component**: `CenteredLayout.tsx`

```typescript
interface CenteredLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}
```

**Specifications**:
- **Container**: mx-auto w-full
- **Max Widths**:
  - sm: max-w-screen-sm (640px)
  - md: max-w-screen-md (768px)
  - lg: max-w-screen-lg (1024px)
  - xl: max-w-screen-xl (1280px)
  - 2xl: max-w-screen-2xl (1536px)
- **Padding**: px-4 md:px-6 lg:px-8
- **Use Cases**: Content pages, forms, articles

#### Split Layout

**Component**: `SplitLayout.tsx`

```typescript
interface SplitLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  ratio?: '50-50' | '60-40' | '40-60' | '70-30' | '30-70';
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
}
```

**Specifications**:
- **Container**: grid grid-cols-1 lg:grid-cols-2
- **Ratios** (using grid-template-columns):
  - 50-50: lg:grid-cols-2
  - 60-40: lg:grid-cols-[60%_40%]
  - 40-60: lg:grid-cols-[40%_60%]
  - 70-30: lg:grid-cols-[70%_30%]
  - 30-70: lg:grid-cols-[30%_70%]
- **Gap**: gap-4 (sm), gap-6 (md), gap-8 (lg)
- **Responsive**: Stack on mobile (<1024px)
- **Use Cases**: Settings pages, detail views

### 2.3 Dashboard Layout

**Component**: `DashboardLayout.tsx`

```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  widgets?: React.ReactNode;
}
```

**Structure**:
```
┌─────────────────────────────────────────────┐
│              Top Navigation Bar             │
├──────────┬──────────────────────────────────┤
│          │  Dashboard Header                │
│          ├──────────────────────────────────┤
│          │  ┌────────┬────────┬────────┐   │
│ Sidebar  │  │Widget 1│Widget 2│Widget 3│   │
│          │  └────────┴────────┴────────┘   │
│          │                                  │
│          │  Main Content Area               │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

**Specifications**:
- **Grid**: grid grid-cols-[auto_1fr]
- **Sidebar**: Collapsible, responsive
- **Content Area**: Scrollable, overflow-y-auto
- **Widget Grid**: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- **Padding**: p-6 md:p-8

### 2.4 Authentication Layout

**Component**: `AuthLayout.tsx`

```typescript
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showLogo?: boolean;
  backgroundImage?: string;
  footer?: React.ReactNode;
}
```

**Structure**:
```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│        ┌─────────────────┐         │
│        │     [Logo]      │         │
│        │                 │         │
│        │  Welcome Back   │         │
│        │  Sign in to...  │         │
│        │                 │         │
│        │  [Form Content] │         │
│        │                 │         │
│        └─────────────────┘         │
│                                     │
└─────────────────────────────────────┘
```

**Specifications**:
- **Container**: min-h-screen flex items-center justify-center
- **Background**: bg-gradient-to-br from-primary-50 to-secondary-50
- **Card**: max-w-md w-full bg-white rounded-xl shadow-2xl p-8
- **Logo**: mx-auto mb-8, h-12 w-auto
- **Title**: text-2xl font-bold text-center mb-2
- **Subtitle**: text-sm text-gray-600 text-center mb-8

### 2.5 Responsive Breakpoints

**Tailwind CSS Breakpoints** (default):

```typescript
const breakpoints = {
  sm: '640px',   // Small devices (landscape phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices
  '2xl': '1536px' // 2K screens
};
```

**Usage Guidelines**:
- **Mobile First**: Base styles apply to mobile, use breakpoint prefixes for larger screens
- **Navigation**: Switch to mobile menu at lg (1024px)
- **Sidebar**: Hide/collapse at lg (1024px)
- **Grid Columns**: 
  - Base: 1 column
  - md: 2 columns
  - lg: 3 columns
  - xl: 4 columns (if needed)
- **Container Padding**:
  - Base: px-4
  - md: px-6
  - lg: px-8
  - xl: px-12

---

## 3. Shared Components Library

### 3.1 Button Components

**Component**: `Button.tsx`

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}
```

**Variants**:

1. **Default** (Primary):
   - Background: bg-primary hover:bg-primary-600
   - Text: text-white
   - Border: none
   - Shadow: shadow-sm hover:shadow

2. **Destructive**:
   - Background: bg-red-600 hover:bg-red-700
   - Text: text-white
   - Use: Delete actions, dangerous operations

3. **Outline**:
   - Background: transparent hover:bg-gray-100
   - Text: text-gray-700
   - Border: border-2 border-gray-300

4. **Secondary**:
   - Background: bg-gray-200 hover:bg-gray-300
   - Text: text-gray-900
   - Border: none

5. **Ghost**:
   - Background: transparent hover:bg-gray-100
   - Text: text-gray-700
   - Border: none

6. **Link**:
   - Background: transparent
   - Text: text-primary underline-offset-4 hover:underline
   - Border: none

**Sizes**:
```typescript
const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 py-2 text-base',
  lg: 'h-12 px-6 text-lg',
  icon: 'h-10 w-10' // Square, centered icon
};
```

**States**:
- **Hover**: Scale, shadow, background changes
- **Active**: Scale down slightly (scale-95)
- **Disabled**: opacity-50 cursor-not-allowed
- **Loading**: Show spinner, disable interaction, opacity-70

**Loading State**:
```tsx
{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
```

**Icon Integration**:
```tsx
{icon && iconPosition === 'left' && <Icon className="mr-2 h-4 w-4" />}
{children}
{icon && iconPosition === 'right' && <Icon className="ml-2 h-4 w-4" />}
```

### 3.2 Form Input Components

#### Text Input

**Component**: `Input.tsx`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}
```

**Specifications**:
- **Base**: 
  - Height: h-10
  - Padding: px-3 py-2
  - Border: border border-gray-300 rounded-md
  - Text: text-sm
  - Focus: focus:ring-2 focus:ring-primary focus:border-primary
  
- **States**:
  - Default: border-gray-300
  - Focus: ring-2 ring-primary border-primary
  - Error: border-red-500 focus:ring-red-500
  - Disabled: bg-gray-100 cursor-not-allowed opacity-60

- **Label**: 
  - Typography: text-sm font-medium text-gray-700
  - Margin: mb-1.5
  - Required indicator: text-red-500 ml-1 *

- **Helper Text**: 
  - Typography: text-xs text-gray-500
  - Margin: mt-1.5

- **Error Message**:
  - Typography: text-xs text-red-600
  - Margin: mt-1.5
  - Icon: AlertCircle (lucide-react)

#### Select / Dropdown

**Component**: `Select.tsx` (Radix UI Select)

```typescript
interface SelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface SelectOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  disabled?: boolean;
}
```

**Specifications**:
- **Trigger**: Same styling as Input
- **Content**: 
  - Background: bg-white
  - Border: border border-gray-200 rounded-md
  - Shadow: shadow-lg
  - Max Height: max-h-64 overflow-auto

- **Items**:
  - Padding: px-3 py-2
  - Hover: bg-gray-100
  - Selected: bg-primary-50 text-primary font-medium
  - Disabled: opacity-50 cursor-not-allowed

#### Checkbox

**Component**: `Checkbox.tsx` (Radix UI Checkbox)

```typescript
interface CheckboxProps {
  label?: string;
  description?: string;
  checked?: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
}
```

**Specifications**:
- **Box**: 
  - Size: h-4 w-4
  - Border: border-2 border-gray-300 rounded
  - Checked: bg-primary border-primary
  - Icon: Check (lucide-react), text-white

- **Label**: 
  - Typography: text-sm font-medium text-gray-700
  - Margin: ml-2

- **Description**: 
  - Typography: text-xs text-gray-500
  - Margin: ml-6 mt-1

#### Radio Group

**Component**: `RadioGroup.tsx` (Radix UI RadioGroup)

```typescript
interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value?: string;
  onValueChange: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}
```

**Specifications**:
- **Container**: 
  - Vertical: space-y-3
  - Horizontal: flex space-x-6

- **Radio Button**:
  - Size: h-4 w-4
  - Border: border-2 border-gray-300 rounded-full
  - Selected: border-primary with inner dot (h-2 w-2 bg-primary rounded-full)

#### Textarea

**Component**: `Textarea.tsx`

```typescript
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  fullWidth?: boolean;
}
```

**Specifications**:
- **Base**: Same as Input, but min-h-24
- **Resize**: resize-{variant}
- **Max Characters**: Optional character counter

#### Switch / Toggle

**Component**: `Switch.tsx` (Radix UI Switch)

```typescript
interface SwitchProps {
  label?: string;
  description?: string;
  checked?: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}
```

**Specifications**:
- **Track**: 
  - Size: h-6 w-11 rounded-full
  - Off: bg-gray-200
  - On: bg-primary

- **Thumb**:
  - Size: h-5 w-5 rounded-full bg-white
  - Shadow: shadow-sm
  - Transition: transform 200ms

### 3.3 Card Components

**Component**: `Card.tsx`

```typescript
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}
```

**Variants**:

1. **Default**:
   - Background: bg-white dark:bg-gray-800
   - Border: border border-gray-200 dark:border-gray-700
   - Radius: rounded-lg
   - Shadow: shadow-sm

2. **Outlined**:
   - Background: bg-white dark:bg-gray-800
   - Border: border-2 border-gray-300 dark:border-gray-600
   - Radius: rounded-lg
   - Shadow: none

3. **Elevated**:
   - Background: bg-white dark:bg-gray-800
   - Border: none
   - Radius: rounded-xl
   - Shadow: shadow-lg hover:shadow-xl transition-shadow

**Padding**:
```typescript
const padding = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};
```

**Sub-components**:

```typescript
// CardHeader
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
}

// CardContent
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

// CardFooter
interface CardFooterProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right' | 'between';
}
```

**States**:
- **Hoverable**: hover:shadow-md hover:-translate-y-0.5 transition-all
- **Clickable**: cursor-pointer active:scale-[0.98]

### 3.4 Modal / Dialog Components

**Component**: `Dialog.tsx` (Radix UI Dialog)

```typescript
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
}
```

**Specifications**:

**Overlay**:
- Background: bg-black/50 backdrop-blur-sm
- Animation: fade-in
- Z-index: z-50

**Content Sizes**:
```typescript
const sizes = {
  sm: 'max-w-sm',    // 384px
  md: 'max-w-md',    // 448px
  lg: 'max-w-lg',    // 512px
  xl: 'max-w-xl',    // 576px
  full: 'max-w-full m-4'
};
```

**Content**:
- Background: bg-white dark:bg-gray-900
- Border: rounded-xl
- Shadow: shadow-2xl
- Padding: p-6
- Max Height: max-h-[90vh] overflow-y-auto
- Animation: slide-in-from-bottom + fade-in

**Header**:
- Title: text-xl font-semibold mb-2
- Description: text-sm text-gray-600 dark:text-gray-400
- Close Button: absolute top-4 right-4, size-4

**Footer**:
- Border: border-t border-gray-200 pt-4 mt-6
- Layout: flex justify-end space-x-3
- Buttons: Primary + Secondary

**AlertDialog** (Confirmation):

```typescript
interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionLabel?: string;
  cancelLabel?: string;
  onAction: () => void;
  variant?: 'default' | 'destructive';
}
```

### 3.5 Tooltip Components

**Component**: `Tooltip.tsx` (Radix UI Tooltip)

```typescript
interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
}
```

**Specifications**:
- **Background**: bg-gray-900 dark:bg-gray-700
- **Text**: text-white text-xs
- **Padding**: px-2 py-1
- **Radius**: rounded
- **Arrow**: 4px
- **Max Width**: max-w-xs
- **Shadow**: shadow-lg
- **Animation**: fade-in + scale
- **Delay**: 200ms (default)

### 3.6 Badge Components

**Component**: `Badge.tsx`

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  icon?: LucideIcon;
  removable?: boolean;
  onRemove?: () => void;
}
```

**Variants**:
```typescript
const variants = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  outline: 'border-2 border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
};
```

**Sizes**:
```typescript
const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
};
```

**Specifications**:
- **Base**: inline-flex items-center rounded-full font-medium
- **Dot**: Optional 6px colored dot on left
- **Icon**: mr-1, size based on badge size
- **Remove Button**: X icon, ml-1, hover:bg-opacity-20

### 3.7 Avatar Components

**Component**: `Avatar.tsx` (Radix UI Avatar)

```typescript
interface AvatarProps {
  src?: string;
  alt: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away' | 'busy';
  border?: boolean;
}
```

**Sizes**:
```typescript
const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-20 w-20 text-2xl'
};
```

**Specifications**:
- **Shape**: 
  - Circle: rounded-full
  - Square: rounded-md
- **Image**: object-cover
- **Fallback**: 
  - Background: bg-primary
  - Text: text-white font-semibold uppercase
  - Content: Initials (first 2 characters)
- **Border**: ring-2 ring-white
- **Status Indicator**:
  - Position: absolute bottom-0 right-0
  - Size: 1/4 of avatar size
  - Border: ring-2 ring-white
  - Colors:
    - online: bg-green-500
    - offline: bg-gray-400
    - away: bg-yellow-500
    - busy: bg-red-500

**AvatarGroup**:

```typescript
interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarProps['size'];
  spacing?: 'normal' | 'tight';
}
```

- **Layout**: flex items-center -space-x-2 (overlapping)
- **Overflow**: Show "+X" badge for remaining

### 3.8 Loading Spinner Components

**Component**: `Spinner.tsx`

```typescript
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  variant?: 'circle' | 'dots' | 'bars';
}
```

**Variants**:

1. **Circle** (Default):
   - Icon: Loader2 from lucide-react
   - Animation: animate-spin
   - Sizes: 12px (xs), 16px (sm), 24px (md), 32px (lg), 48px (xl)

2. **Dots**:
   - Three dots bouncing
   - Animation: animate-bounce with delays
   
3. **Bars**:
   - Three vertical bars
   - Animation: animate-pulse with delays

**Loading Overlay**:

```typescript
interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  blur?: boolean;
}
```

**Specifications**:
- **Overlay**: absolute inset-0 bg-white/80 dark:bg-gray-900/80
- **Blur**: backdrop-blur-sm (if enabled)
- **Content**: Center spinner + message
- **Z-index**: z-40

### 3.9 Empty State Components

**Component**: `EmptyState.tsx`

```typescript
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  illustration?: string; // SVG path
}
```

**Specifications**:
- **Container**: flex flex-col items-center justify-center py-12 px-4
- **Icon**: 
  - Size: h-24 w-24
  - Color: text-gray-400
  - Margin: mb-4
- **Title**: 
  - Typography: text-xl font-semibold text-gray-900
  - Margin: mb-2
- **Description**: 
  - Typography: text-sm text-gray-600 text-center max-w-md
  - Margin: mb-6
- **Action Button**: Primary button

**Common Use Cases**:
- No search results
- Empty list/table
- No notifications
- No messages
- First-time user experience

### 3.10 Error State Components

**Component**: `ErrorState.tsx`

```typescript
interface ErrorStateProps {
  title?: string;
  message: string;
  error?: Error;
  retry?: () => void;
  showDetails?: boolean;
  variant?: 'page' | 'inline' | 'toast';
}
```

**Page Error**:
```
┌────────────────────────┐
│     [Error Icon]       │
│                        │
│  Something went wrong  │
│  Error message here... │
│                        │
│  [Retry Button]        │
│  [View Details]        │
└────────────────────────┘
```

**Specifications**:
- **Container**: Same as EmptyState
- **Icon**: AlertTriangle (lucide-react), text-red-500
- **Title**: text-xl font-semibold text-red-900
- **Message**: text-sm text-red-700
- **Error Details**: Collapsible, monospace, bg-red-50, p-4, rounded

**Inline Error**:
- **Container**: border-l-4 border-red-500 bg-red-50 p-4 rounded
- **Icon**: AlertCircle, text-red-500
- **Layout**: flex items-start

**ErrorBoundary**:

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
```

### 3.11 Toast Notification Components

**Library**: Sonner (already in dependencies)

**Component**: `toast` function from 'sonner'

```typescript
import { toast } from 'sonner';

// Usage
toast.success('Document saved successfully');
toast.error('Failed to save document');
toast.loading('Saving document...');
toast.info('New feature available');
toast.warning('Your session will expire soon');
```

**Custom Toast Component**:

```typescript
interface ToastProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}
```

**Specifications**:
- **Position**: bottom-right (default), configurable
- **Duration**: 4000ms (default)
- **Max Toasts**: 3 visible at once
- **Animation**: Slide in from right, fade out
- **Theme**: Matches app theme (light/dark)

**Toast Variants** (via Sonner):
- Success: Green background, CheckCircle icon
- Error: Red background, XCircle icon
- Warning: Yellow background, AlertTriangle icon
- Info: Blue background, Info icon
- Loading: Spinner icon

### 3.12 Tabs Components

**Component**: `Tabs.tsx` (Radix UI Tabs)

```typescript
interface TabsProps {
  tabs: Tab[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  orientation?: 'horizontal' | 'vertical';
}

interface Tab {
  value: string;
  label: string;
  icon?: LucideIcon;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}
```

**Variants**:

1. **Default** (Line):
   - List: border-b border-gray-200
   - Trigger: pb-3 border-b-2 border-transparent
   - Active: border-primary text-primary

2. **Pills**:
   - Trigger: px-4 py-2 rounded-full
   - Active: bg-primary text-white
   - Inactive: hover:bg-gray-100

3. **Underline**:
   - List: Space between tabs
   - Trigger: pb-2
   - Active: border-b-2 border-primary

**Specifications**:
- **List**: 
  - Horizontal: flex space-x-8
  - Vertical: flex flex-col space-y-2
- **Trigger**: 
  - Typography: text-sm font-medium
  - Transition: transition-all duration-200
  - Disabled: opacity-50 cursor-not-allowed
- **Content**: 
  - Padding: pt-6
  - Animation: fade-in

### 3.13 Accordion Components

**Component**: `Accordion.tsx` (Radix UI Accordion)

```typescript
interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
  variant?: 'default' | 'bordered' | 'separated';
}

interface AccordionItem {
  value: string;
  title: string;
  content: React.ReactNode;
  icon?: LucideIcon;
  disabled?: boolean;
}
```

**Variants**:

1. **Default**:
   - Border: border-b border-gray-200 (between items)
   - No outer border

2. **Bordered**:
   - Border: border border-gray-200 rounded-lg
   - Items: border-b (except last)

3. **Separated**:
   - Each item: border rounded-lg mb-2
   - Shadow: shadow-sm

**Specifications**:
- **Trigger**: 
  - Layout: flex justify-between items-center
  - Padding: py-4
  - Typography: text-sm font-medium
  - Icon: ChevronDown, rotate-180 when open
  - Hover: bg-gray-50
- **Content**: 
  - Padding: pb-4 pt-2
  - Animation: slide-down/slide-up
  - Typography: text-sm text-gray-600

### 3.14 Dropdown / Popover Components

**Component**: `DropdownMenu.tsx` (Radix UI DropdownMenu)

```typescript
interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

interface DropdownMenuItem {
  type: 'item' | 'checkbox' | 'radio' | 'separator' | 'label';
  label?: string;
  icon?: LucideIcon;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}
```

**Specifications**:
- **Content**: 
  - Width: min-w-48
  - Background: bg-white dark:bg-gray-800
  - Border: border border-gray-200 dark:border-gray-700
  - Shadow: shadow-lg
  - Radius: rounded-lg
  - Padding: p-1
- **Item**: 
  - Padding: px-2 py-1.5 rounded-md
  - Typography: text-sm
  - Hover: bg-gray-100 dark:bg-gray-700
  - Icon: mr-2 h-4 w-4
  - Shortcut: ml-auto text-xs text-gray-500
  - Danger: text-red-600 hover:bg-red-50
- **Separator**: 
  - Margin: my-1
  - Border: border-t border-gray-200
- **Label**: 
  - Padding: px-2 py-1.5
  - Typography: text-xs font-semibold text-gray-500 uppercase

**Popover Component**:

```typescript
interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
```

- Similar styling to DropdownMenu
- Used for custom content (forms, pickers, etc.)

### 3.15 Search Bar Components

**Component**: `SearchBar.tsx`

```typescript
interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  loading?: boolean;
  suggestions?: SearchSuggestion[];
  icon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

interface SearchSuggestion {
  value: string;
  label: string;
  category?: string;
  icon?: LucideIcon;
}
```

**Specifications**:
- **Container**: relative
- **Input**: 
  - Base: Same as Input component
  - Left Padding: pl-10 (for icon)
  - Right Padding: pr-10 (for clear button)
- **Search Icon**: 
  - Position: absolute left-3
  - Size: h-5 w-5
  - Color: text-gray-400
- **Clear Button**: 
  - Position: absolute right-3
  - Icon: X (lucide-react)
  - Show only when value exists
- **Suggestions Dropdown**: 
  - Position: absolute top-full mt-1 w-full
  - Max Height: max-h-64 overflow-y-auto
  - Styling: Same as Select dropdown

**Advanced Search Bar** (with filters):

```typescript
interface AdvancedSearchBarProps extends SearchBarProps {
  filters?: SearchFilter[];
  activeFilters?: Record<string, any>;
  onFilterChange?: (filters: Record<string, any>) => void;
}
```

### 3.16 Data Table Components

**Component**: `DataTable.tsx`

```typescript
interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  selection?: SelectionConfig;
  actions?: TableAction<T>[];
  emptyState?: React.ReactNode;
  stickyHeader?: boolean;
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
}

interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}
```

**Specifications**:

**Table Container**:
- **Wrapper**: overflow-x-auto rounded-lg border border-gray-200
- **Shadow**: shadow-sm

**Table**:
- **Base**: w-full
- **Background**: bg-white
- **Border Collapse**: border-collapse

**Table Header** (thead):
- **Background**: bg-gray-50
- **Border**: border-b-2 border-gray-200
- **Typography**: text-xs font-semibold text-gray-700 uppercase tracking-wider
- **Padding**: px-6 py-3
- **Sticky**: top-0 z-10 (if stickyHeader)

**Table Body** (tbody):
- **Border**: border-b border-gray-200 (between rows)
- **Striped**: even:bg-gray-50 (if enabled)
- **Hoverable**: hover:bg-gray-50 (if enabled)

**Table Row** (tr):
- **Padding**: px-6 py-4
- **Typography**: text-sm text-gray-900
- **Transition**: transition-colors

**Table Cell** (td):
- **Align**: text-{align}
- **Width**: w-{width} (if specified)

**Sortable Headers**:
- **Cursor**: cursor-pointer
- **Hover**: hover:bg-gray-100
- **Icons**: ChevronUp/ChevronDown (lucide-react)

**Selection Column**:
- **Width**: w-12
- **Checkbox**: Centered in cell
- **Header**: Select all checkbox

**Actions Column**:
- **Width**: w-24
- **Alignment**: text-right
- **Content**: DropdownMenu with actions

**Loading State**:
- **Overlay**: Skeleton rows or spinner
- **Rows**: 5-10 skeleton rows

**Empty State**:
- **Container**: Center in table
- **Content**: EmptyState component

### 3.17 Pagination Components

**Component**: `Pagination.tsx`

```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  showPageSize?: boolean;
  showInfo?: boolean;
  variant?: 'default' | 'simple' | 'compact';
}
```

**Variants**:

1. **Default** (Full pagination):
```
┌────────────────────────────────────────────────┐
│ Showing 1-10 of 100 items  [10▼] per page      │
│ [First] [Prev] 1 2 [3] 4 5 ... 10 [Next] [Last]│
└────────────────────────────────────────────────┘
```

2. **Simple** (Prev/Next only):
```
┌────────────────────────────┐
│ [← Previous]  [Next →]     │
└────────────────────────────┘
```

3. **Compact** (Minimal):
```
┌────────────────────────────┐
│ [←] Page 3 of 10 [→]       │
└────────────────────────────┘
```

**Specifications**:

**Container**:
- **Layout**: flex items-center justify-between
- **Padding**: px-6 py-3
- **Border**: border-t border-gray-200
- **Background**: bg-gray-50

**Page Info**:
- **Typography**: text-sm text-gray-700
- **Content**: "Showing {start}-{end} of {total} items"

**Page Size Selector**:
- **Component**: Select
- **Options**: [10, 25, 50, 100]
- **Typography**: text-sm

**Pagination Buttons**:
- **Container**: flex items-center space-x-2
- **Button**: 
  - Size: h-8 w-8 (for numbers), px-3 (for text)
  - Typography: text-sm
  - Border: border border-gray-300 rounded
  - Active: bg-primary text-white border-primary
  - Disabled: opacity-50 cursor-not-allowed
  - Hover: bg-gray-100

**Ellipsis**:
- **Content**: "..."
- **Styling**: px-2 text-gray-500

**Page Numbers Display**:
- Show 5 pages around current
- Always show first and last
- Use ellipsis for gaps

---

## 4. Design System Specifications

### 4.1 Color Palette

#### Primary Colors

```typescript
const primaryColors = {
  50: '#EFF6FF',   // Lightest
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6',  // Base (DEFAULT)
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',  // Darkest
  950: '#172554'
};
```

**Usage**:
- **Primary Actions**: Buttons, links, active states
- **Brand Identity**: Logo, headers, accents
- **Interactive Elements**: Focus rings, selections

#### Secondary Colors

```typescript
const secondaryColors = {
  50: '#F0FDF4',
  100: '#DCFCE7',
  200: '#BBF7D0',
  300: '#86EFAC',
  400: '#4ADE80',
  500: '#10B981',  // Base (DEFAULT)
  600: '#059669',
  700: '#047857',
  800: '#065F46',
  900: '#064E3B',
  950: '#022C22'
};
```

**Usage**:
- **Success States**: Confirmations, positive feedback
- **Growth Indicators**: Progress, achievements
- **Call-to-Action**: Secondary buttons

#### Accent Colors

```typescript
const accentColors = {
  50: '#FAF5FF',
  100: '#F3E8FF',
  200: '#E9D5FF',
  300: '#D8B4FE',
  400: '#C084FC',
  500: '#8B5CF6',  // Base (DEFAULT)
  600: '#7C3AED',
  700: '#6D28D9',
  800: '#5B21B6',
  900: '#4C1D95',
  950: '#2E1065'
};
```

**Usage**:
- **Innovation Features**: AI tools, premium features
- **Highlights**: Important information, badges
- **Creativity**: Design elements, illustrations

#### Neutral/Gray Scale

```typescript
const grayColors = {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',  // Base
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  950: '#030712'
};
```

**Usage**:
- **Text**: Body text, headings, labels
- **Borders**: Dividers, outlines, separators
- **Backgrounds**: Cards, sections, overlays

#### Semantic Colors

```typescript
const semanticColors = {
  // Success (Green)
  success: {
    light: '#10B981',    // green-500
    DEFAULT: '#059669',  // green-600
    dark: '#047857'      // green-700
  },
  
  // Warning (Yellow/Amber)
  warning: {
    light: '#F59E0B',    // amber-500
    DEFAULT: '#D97706',  // amber-600
    dark: '#B45309'      // amber-700
  },
  
  // Error/Danger (Red)
  error: {
    light: '#EF4444',    // red-500
    DEFAULT: '#DC2626',  // red-600
    dark: '#B91C1C'      // red-700
  },
  
  // Info (Blue)
  info: {
    light: '#3B82F6',    // blue-500
    DEFAULT: '#2563EB',  // blue-600
    dark: '#1D4ED8'      // blue-700
  }
};
```

#### Dark Mode Colors

```typescript
const darkModeColors = {
  background: {
    primary: '#030712',    // gray-950
    secondary: '#111827',  // gray-900
    tertiary: '#1F2937'    // gray-800
  },
  text: {
    primary: '#F9FAFB',    // gray-50
    secondary: '#D1D5DB',  // gray-300
    tertiary: '#9CA3AF'    // gray-400
  },
  border: {
    primary: '#374151',    // gray-700
    secondary: '#1F2937'   // gray-800
  }
};
```

### 4.2 Typography Scale

#### Font Families

```typescript
const fontFamilies = {
  sans: [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif'
  ],
  mono: [
    'Fira Code',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace'
  ]
};
```

**Implementation**:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
```

#### Font Sizes

```typescript
const fontSizes = {
  xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],      // 16px (default)
  lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }],// 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
  '5xl': ['3rem', { lineHeight: '1' }],          // 48px
  '6xl': ['3.75rem', { lineHeight: '1' }],       // 60px
  '7xl': ['4.5rem', { lineHeight: '1' }],        // 72px
  '8xl': ['6rem', { lineHeight: '1' }],          // 96px
  '9xl': ['8rem', { lineHeight: '1' }]           // 128px
};
```

#### Font Weights

```typescript
const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,    // Default body text
  medium: 500,    // UI elements, subheadings
  semibold: 600,  // Headings, emphasis
  bold: 700,      // Strong emphasis
  extrabold: 800,
  black: 900
};
```

#### Typography Usage Guidelines

**Display Headings** (Hero sections, landing pages):
- **text-6xl** to **text-9xl**
- **font-bold** or **font-extrabold**
- **tracking-tight** (-0.025em)
- **leading-none** or **leading-tight**

**Page Headings**:
- H1: text-4xl md:text-5xl font-bold
- H2: text-3xl md:text-4xl font-bold
- H3: text-2xl md:text-3xl font-semibold
- H4: text-xl md:text-2xl font-semibold
- H5: text-lg md:text-xl font-semibold
- H6: text-base md:text-lg font-semibold

**Body Text**:
- Large: text-lg leading-relaxed
- Default: text-base leading-normal
- Small: text-sm leading-normal
- Extra Small: text-xs leading-normal

**UI Text**:
- Buttons: text-sm font-medium
- Labels: text-sm font-medium
- Helper Text: text-xs text-gray-500
- Placeholders: text-sm text-gray-400

**Code/Monospace**:
- Inline Code: font-mono text-sm bg-gray-100 px-1.5 py-0.5 rounded
- Code Blocks: font-mono text-sm

### 4.3 Spacing System

#### Base Spacing Scale (Tailwind Default)

```typescript
const spacing = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem'       // 384px
};
```

#### Spacing Usage Guidelines

**Component Padding**:
- Dense: p-2 (8px)
- Default: p-4 (16px)
- Comfortable: p-6 (24px)
- Spacious: p-8 (32px)

**Section Spacing**:
- Tight: py-8 (32px)
- Default: py-12 (48px)
- Comfortable: py-16 (64px)
- Spacious: py-24 (96px)

**Gap Between Elements**:
- Tight: gap-2 (8px)
- Default: gap-4 (16px)
- Comfortable: gap-6 (24px)
- Spacious: gap-8 (32px)

**Container Padding**:
- Mobile: px-4 (16px)
- Tablet: md:px-6 (24px)
- Desktop: lg:px-8 (32px)
- Wide: xl:px-12 (48px)

### 4.4 Border Radius

```typescript
const borderRadius = {
  none: '0px',
  sm: '0.125rem',    // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px'     // Pills/Circles
};
```

**Usage Guidelines**:
- **Buttons**: rounded-md (6px)
- **Cards**: rounded-lg (8px) or rounded-xl (12px)
- **Modals**: rounded-xl (12px)
- **Inputs**: rounded-md (6px)
- **Badges**: rounded-full (pill shape)
- **Avatars**: rounded-full (circle)
- **Images**: rounded-lg (8px)

### 4.5 Shadows

```typescript
const boxShadow = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000'
};
```

**Usage Guidelines**:
- **Cards (Default)**: shadow-sm
- **Cards (Elevated)**: shadow-lg hover:shadow-xl
- **Dropdowns/Popovers**: shadow-lg
- **Modals**: shadow-2xl
- **Buttons (Hover)**: shadow-md
- **Sticky Headers**: shadow-sm
- **Focus States**: shadow-outline (custom)

**Custom Focus Shadow**:
```typescript
const focusShadow = {
  outline: '0 0 0 3px rgba(59, 130, 246, 0.5)' // Primary color with opacity
};
```

### 4.6 Animations

#### Tailwind CSS Animate (tailwindcss-animate)

**Included Animations**:
```typescript
const animations = {
  // Spin (for loaders)
  'spin': 'spin 1s linear infinite',
  
  // Ping (for notifications)
  'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
  
  // Pulse (for loading states)
  'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  
  // Bounce (for emphasis)
  'bounce': 'bounce 1s infinite',
  
  // Custom animations from tailwindcss-animate
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'fade-in': 'fade-in 0.2s ease-out',
  'fade-out': 'fade-out 0.2s ease-out',
  'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
  'slide-in-from-bottom': 'slide-in-from-bottom 0.3s ease-out',
  'slide-in-from-left': 'slide-in-from-left 0.3s ease-out',
  'slide-in-from-right': 'slide-in-from-right 0.3s ease-out',
  'zoom-in': 'zoom-in 0.2s ease-out',
  'zoom-out': 'zoom-out 0.2s ease-out'
};
```

#### Transition Guidelines

**Default Transitions**:
```typescript
const transitions = {
  // All properties
  'transition-all': 'transition-all duration-200 ease-in-out',
  
  // Specific properties
  'transition-colors': 'transition-colors duration-200 ease-in-out',
  'transition-opacity': 'transition-opacity duration-200 ease-in-out',
  'transition-transform': 'transition-transform duration-200 ease-in-out',
  'transition-shadow': 'transition-shadow duration-200 ease-in-out'
};
```

**Duration Scale**:
```typescript
const duration = {
  75: '75ms',
  100: '100ms',
  150: '150ms',
  200: '200ms',   // Default
  300: '300ms',
  500: '500ms',
  700: '700ms',
  1000: '1000ms'
};
```

**Easing Functions**:
```typescript
const easing = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'  // Default
};
```

#### Animation Usage Guidelines

**Hover Effects**:
- Buttons: `transition-all hover:scale-105 hover:shadow-md`
- Cards: `transition-all hover:-translate-y-1 hover:shadow-lg`
- Links: `transition-colors hover:text-primary`

**Loading States**:
- Spinners: `animate-spin`
- Pulsing: `animate-pulse`
- Skeleton: `animate-pulse bg-gray-200`

**Entrance Animations**:
- Modals: `animate-fade-in`
- Dropdowns: `animate-slide-in-from-top`
- Toasts: `animate-slide-in-from-right`
- Side Panels: `animate-slide-in-from-left`

**Exit Animations**:
- Use same animations in reverse
- Consider opacity fade-out

**Micro-interactions**:
- Button Click: `active:scale-95`
- Icon Hover: `hover:rotate-6`
- Badge Pulse: `animate-ping` (notification dot)

### 4.7 Responsive Breakpoints

#### Breakpoint Values

```typescript
const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};
```

#### Container Max-Widths

```typescript
const container = {
  center: true,
  padding: {
    DEFAULT: '1rem',  // 16px
    sm: '1.5rem',     // 24px
    lg: '2rem',       // 32px
    xl: '3rem'        // 48px
  },
  screens: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};
```

#### Responsive Design Patterns

**Mobile First Approach**:
```tsx
// Base styles apply to mobile
<div className="text-sm px-4 py-2">
  {/* Mobile: text-sm, px-4, py-2 */}
</div>

// Override for larger screens
<div className="text-sm md:text-base lg:text-lg px-4 md:px-6 lg:px-8">
  {/* Responsive sizing */}
</div>
```

**Common Responsive Patterns**:

1. **Grid Layouts**:
```tsx
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
```

2. **Flex Direction**:
```tsx
className="flex flex-col md:flex-row gap-4"
```

3. **Hide/Show**:
```tsx
className="hidden lg:block"  // Hide on mobile, show on desktop
className="block lg:hidden"  // Show on mobile, hide on desktop
```

4. **Text Sizes**:
```tsx
className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
```

5. **Spacing**:
```tsx
className="p-4 md:p-6 lg:p-8 xl:p-12"
```

### 4.8 Z-Index Scale

```typescript
const zIndex = {
  0: 0,
  10: 10,      // Sticky elements
  20: 20,      // Fixed elements
  30: 30,      // Dropdowns, popovers
  40: 40,      // Overlays, loading screens
  50: 50,      // Modals, dialogs
  60: 60,      // Notifications, toasts
  70: 70,      // Tooltips
  80: 80,      // Context menus
  90: 90,      // Mobile navigation
  100: 100,    // Critical overlays
  auto: 'auto'
};
```

**Layer Hierarchy**:
1. **Base Layer** (z-0): Normal page content
2. **Sticky Elements** (z-10): Sticky headers, footers
3. **Fixed Elements** (z-20): Fixed navigation, toolbars
4. **Dropdowns** (z-30): Dropdown menus, selects, date pickers
5. **Overlays** (z-40): Loading overlays, backdrops
6. **Modals** (z-50): Modal dialogs, alerts
7. **Notifications** (z-60): Toast notifications
8. **Tooltips** (z-70): Tooltip overlays
9. **Context Menus** (z-80): Right-click menus
10. **Mobile Navigation** (z-90): Mobile drawer, hamburger menu
11. **Critical** (z-100): Emergency overlays, system messages

---

## 5. Accessibility Requirements

### 5.1 Keyboard Navigation

#### Focus Management

**Focus Visible States**:
```tsx
// All interactive elements must have visible focus
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
```

**Focus Order**:
- Logical tab order (top to bottom, left to right)
- Skip navigation links for screen readers
- Focus trapping in modals
- Focus restoration when closing modals

**Keyboard Shortcuts**:
```typescript
const keyboardShortcuts = {
  'Cmd+K / Ctrl+K': 'Open search',
  'Esc': 'Close modal/dropdown',
  'Tab': 'Next element',
  'Shift+Tab': 'Previous element',
  'Enter': 'Activate button/link',
  'Space': 'Toggle checkbox/switch',
  'Arrow Keys': 'Navigate menu items',
  '?': 'Show keyboard shortcuts (optional)'
};
```

#### Interactive Element Requirements

**Buttons**:
- Must be keyboard accessible (Tab, Enter, Space)
- Clear focus indicator
- Disabled state prevents interaction

**Links**:
- Keyboard accessible (Tab, Enter)
- Distinct from buttons (semantic HTML)
- Skip links for main content

**Forms**:
- Tab order follows visual order
- Labels associated with inputs
- Error messages announced to screen readers
- Submit on Enter (for text inputs)

**Dropdowns/Menus**:
- Arrow keys to navigate items
- Enter to select
- Esc to close
- Type-ahead search (optional)

**Modals**:
- Focus trapped within modal
- Esc to close
- Focus returns to trigger element on close

### 5.2 Screen Reader Support

#### ARIA Labels and Attributes

**Required ARIA**:
```tsx
// Buttons without text
<button aria-label="Close">
  <X className="h-4 w-4" />
</button>

// Form inputs
<input aria-describedby="email-help" aria-invalid={!!error} />

// Loading states
<div aria-live="polite" aria-busy="true">Loading...</div>

// Expandable sections
<button aria-expanded={isOpen} aria-controls="section-id">
  Toggle
</button>

// Modals
<div role="dialog" aria-labelledby="modal-title" aria-modal="true">
  <h2 id="modal-title">Modal Title</h2>
</div>

// Navigation
<nav aria-label="Main navigation">...</nav>

// Search
<input type="search" aria-label="Search documents" />
```

**ARIA Live Regions**:
```tsx
// Announcements (non-intrusive)
<div aria-live="polite">Document saved</div>

// Urgent announcements
<div aria-live="assertive" role="alert">Error occurred</div>

// Status updates
<div role="status" aria-live="polite">Loading...</div>
```

**ARIA Roles**:
```typescript
const ariaRoles = {
  navigation: 'nav',
  main: 'main',
  complementary: 'aside',
  contentinfo: 'footer',
  banner: 'header',
  search: 'search',
  dialog: 'dialog',
  alertdialog: 'alertdialog',
  menu: 'menu',
  menuitem: 'menuitem',
  tab: 'tab',
  tabpanel: 'tabpanel',
  tablist: 'tablist'
};
```

#### Semantic HTML

**Use Proper Elements**:
```tsx
// Correct
<button onClick={handleClick}>Click me</button>
<a href="/page">Go to page</a>

// Incorrect
<div onClick={handleClick}>Click me</div>
<div onClick={() => navigate('/page')}>Go to page</div>
```

**Headings Hierarchy**:
- Use h1-h6 in order
- Don't skip levels
- One h1 per page

**Lists**:
- Use ul/ol for lists
- Use dl for definition lists

**Forms**:
- Use <label> for all inputs
- Group related inputs with <fieldset> and <legend>
- Use <button type="submit"> for form submission

### 5.3 Focus Management

#### Focus Trapping (Modals)

```typescript
// Custom hook for focus trap
function useFocusTrap(ref: React.RefObject<HTMLElement>, active: boolean) {
  useEffect(() => {
    if (!active) return;
    
    const element = ref.current;
    if (!element) return;
    
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [active, ref]);
}
```

#### Focus Restoration

```typescript
// Store and restore focus
function useRestoreFocus() {
  const previousActiveElement = useRef<HTMLElement | null>(null);
  
  const store = () => {
    previousActiveElement.current = document.activeElement as HTMLElement;
  };
  
  const restore = () => {
    previousActiveElement.current?.focus();
  };
  
  return { store, restore };
}
```

### 5.4 Color Contrast

**WCAG AA Requirements**:
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt or 14pt bold): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

**Primary Color Contrast**:
```typescript
// Ensure sufficient contrast
const contrastPairs = {
  'text-gray-900 on bg-white': '21:1',      // Excellent
  'text-gray-600 on bg-white': '7:1',       // Good
  'text-primary on bg-white': '8:1',        // Good
  'text-white on bg-primary': '8:1',        // Good
  'text-white on bg-secondary': '5:1',      // Good
};
```

**Testing Tools**:
- WebAIM Contrast Checker
- Chrome DevTools Accessibility Panel
- axe DevTools extension

### 5.5 Other Accessibility Features

#### Alternative Text

```tsx
// Images
<img src="..." alt="Descriptive text" />

// Decorative images
<img src="..." alt="" role="presentation" />

// Icons with meaning
<Icon aria-label="Information" />

// Icons in buttons
<button>
  <Icon aria-hidden="true" />
  <span>Click me</span>
</button>
```

#### Form Validation

```tsx
// Accessible error messages
<div>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    aria-describedby="email-error"
    aria-invalid={!!error}
  />
  {error && (
    <p id="email-error" role="alert">
      {error}
    </p>
  )}
</div>
```

#### Skip Links

```tsx
// Add to top of layout
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-100 focus:p-4 focus:bg-white"
>
  Skip to main content
</a>

<main id="main-content">
  {/* Main content */}
</main>
```

#### Screen Reader Only Text

```css
/* Tailwind utility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.not-sr-only {
  position: static;
  width: auto;
  height: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

---

## 6. File Structure

### 6.1 Recommended Directory Structure

```
src/
├── components/
│   ├── ui/                          # Base UI components (shadcn-style)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio-group.tsx
│   │   ├── switch.tsx
│   │   ├── textarea.tsx
│   │   ├── label.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── tooltip.tsx
│   │   ├── toast.tsx
│   │   ├── tabs.tsx
│   │   ├── accordion.tsx
│   │   ├── popover.tsx
│   │   ├── separator.tsx
│   │   ├── skeleton.tsx
│   │   └── spinner.tsx
│   │
│   ├── navigation/                  # Navigation components
│   │   ├── MainNavigation.tsx
│   │   ├── MobileNavigation.tsx
│   │   ├── SidebarNavigation.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── Footer.tsx
│   │   └── UserMenu.tsx
│   │
│   ├── layout/                      # Layout components
│   │   ├── AppShell.tsx
│   │   ├── FullWidthLayout.tsx
│   │   ├── CenteredLayout.tsx
│   │   ├── SplitLayout.tsx
│   │   ├── DashboardLayout.tsx
│   │   └── AuthLayout.tsx
│   │
│   ├── forms/                       # Form components
│   │   ├── FormField.tsx
│   │   ├── FormLabel.tsx
│   │   ├── FormError.tsx
│   │   ├── FormHelper.tsx
│   │   ├── SearchBar.tsx
│   │   └── AdvancedSearch.tsx
│   │
│   ├── data-display/                # Data display components
│   │   ├── DataTable.tsx
│   │   ├── DataTablePagination.tsx
│   │   ├── DataTableFilters.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   └── LoadingState.tsx
│   │
│   ├── feedback/                    # Feedback components
│   │   ├── Alert.tsx
│   │   ├── Toast.tsx
│   │   ├── Progress.tsx
│   │   ├── LoadingOverlay.tsx
│   │   └── ConfirmDialog.tsx
│   │
│   └── common/                      # Common/shared components
│       ├── Logo.tsx
│       ├── ThemeToggle.tsx
│       ├── UserAvatar.tsx
│       ├── StatusBadge.tsx
│       └── PageHeader.tsx
│
├── lib/                             # Utility libraries
│   ├── utils.ts                     # General utilities (cn, etc.)
│   ├── constants.ts                 # App constants
│   ├── validation.ts                # Zod schemas
│   └── api.ts                       # API utilities
│
├── hooks/                           # Custom React hooks
│   ├── useMediaQuery.ts
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useFocusTrap.ts
│   ├── useKeyboardShortcut.ts
│   ├── useOnClickOutside.ts
│   └── useDisclosure.ts
│
├── types/                           # TypeScript types
│   ├── index.ts
│   ├── components.ts
│   ├── navigation.ts
│   └── user.ts
│
├── styles/                          # Global styles
│   ├── globals.css                  # Global CSS, Tailwind directives
│   └── themes.css                   # Theme variables
│
├── pages/                           # Page components
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── DocumentsPage.tsx
│   ├── JobsPage.tsx
│   └── ChatPage.tsx
│
└── App.tsx                          # Root component
```

### 6.2 Component Organization

#### Base UI Components (`components/ui/`)

**Pattern**: shadcn/ui style - copy and own

```typescript
// button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary-600',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border-2 border-gray-300 hover:bg-gray-100',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        ghost: 'hover:bg-gray-100',
        link: 'underline-offset-4 hover:underline text-primary'
      },
      size: {
        sm: 'h-8 px-3',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'md'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
```

#### Composite Components (`components/navigation/`, etc.)

```typescript
// MainNavigation.tsx
import { Button } from '@/components/ui/button';
import { UserMenu } from './UserMenu';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/hooks/useAuth';

export function MainNavigation() {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              <NavLink href="/dashboard">Dashboard</NavLink>
              <NavLink href="/jobs">Jobs</NavLink>
              <NavLink href="/documents">Documents</NavLink>
              <NavLink href="/chat">Chat</NavLink>
            </nav>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
```

### 6.3 Utility Functions

#### `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Truncate text with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Generate initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
```

### 6.4 Custom Hooks Library

#### `hooks/useMediaQuery.ts`

```typescript
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
}

// Convenience hooks
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)');
```

#### `hooks/useDisclosure.ts`

```typescript
import { useState, useCallback } from 'react';

interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useDisclosure(defaultOpen = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return { isOpen, open, close, toggle };
}
```

#### `hooks/useFocusTrap.ts`

```typescript
import { useEffect, useRef } from 'react';

export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    if (!active) return;
    
    const element = ref.current;
    if (!element) return;
    
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();
    
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);
  
  return ref;
}
```

---

## 7. Implementation Checklist

### Phase 1: Foundation (Week 1)

#### Design System Setup
- [ ] Configure Tailwind CSS with custom theme
- [ ] Set up CSS variables for colors
- [ ] Define typography scale
- [ ] Configure spacing system
- [ ] Set up border radius values
- [ ] Configure shadows
- [ ] Set up animations with tailwindcss-animate
- [ ] Configure breakpoints
- [ ] Set up z-index scale
- [ ] Create globals.css with base styles

#### Base Utilities
- [ ] Create `lib/utils.ts` with cn() function
- [ ] Set up class-variance-authority
- [ ] Configure clsx and tailwind-merge
- [ ] Create common utility functions
- [ ] Set up constants file

#### Type Definitions
- [ ] Create base TypeScript types
- [ ] Define component prop types
- [ ] Create navigation types
- [ ] Define user types
- [ ] Set up API types

### Phase 2: Base UI Components (Week 2)

#### Buttons & Inputs
- [ ] Button component with all variants
- [ ] Input component
- [ ] Textarea component
- [ ] Label component
- [ ] Select component (Radix UI)
- [ ] Checkbox component (Radix UI)
- [ ] Radio Group component (Radix UI)
- [ ] Switch component (Radix UI)

#### Cards & Containers
- [ ] Card component with sub-components
- [ ] Separator component
- [ ] Skeleton component for loading states

#### Overlays & Dialogs
- [ ] Dialog/Modal component (Radix UI)
- [ ] AlertDialog component (Radix UI)
- [ ] Popover component (Radix UI)
- [ ] Tooltip component (Radix UI)
- [ ] DropdownMenu component (Radix UI)

#### Feedback Components
- [ ] Badge component
- [ ] Avatar component (Radix UI)
- [ ] Spinner/Loader component
- [ ] Progress component
- [ ] Toast setup with Sonner

### Phase 3: Navigation Components (Week 3)

#### Main Navigation
- [ ] MainNavigation component (desktop)
- [ ] MobileNavigation component
- [ ] Responsive navigation switching
- [ ] Navigation links with active states
- [ ] Search bar integration

#### Sidebar
- [ ] SidebarNavigation component
- [ ] Collapsible sidebar
- [ ] Sidebar items with icons
- [ ] Active state handling
- [ ] Badge/notification support

#### Secondary Navigation
- [ ] Breadcrumbs component
- [ ] UserMenu dropdown
- [ ] Footer component (full & minimal)
- [ ] Skip navigation links

### Phase 4: Layout System (Week 3-4)

#### Layout Components
- [ ] AppShell component
- [ ] FullWidthLayout
- [ ] CenteredLayout
- [ ] SplitLayout
- [ ] DashboardLayout
- [ ] AuthLayout

#### Responsive Behavior
- [ ] Mobile layout adaptations
- [ ] Tablet optimizations
- [ ] Desktop layouts
- [ ] Breakpoint testing

### Phase 5: Data Display Components (Week 4)

#### Complex Components
- [ ] DataTable component
- [ ] DataTable pagination
- [ ] DataTable sorting
- [ ] DataTable filtering
- [ ] DataTable selection

#### Additional Components
- [ ] Tabs component (Radix UI)
- [ ] Accordion component (Radix UI)
- [ ] SearchBar component
- [ ] AdvancedSearch component

#### States
- [ ] EmptyState component
- [ ] ErrorState component
- [ ] LoadingState component
- [ ] LoadingOverlay component

### Phase 6: Custom Hooks (Week 4-5)

#### Utility Hooks
- [ ] useMediaQuery hook
- [ ] useDebounce hook
- [ ] useLocalStorage hook
- [ ] useDisclosure hook
- [ ] useOnClickOutside hook
- [ ] useKeyboardShortcut hook

#### Accessibility Hooks
- [ ] useFocusTrap hook
- [ ] useRestoreFocus hook
- [ ] useAriaAnnouncer hook

### Phase 7: Accessibility & Testing (Week 5)

#### Accessibility Audit
- [ ] Keyboard navigation testing
- [ ] Screen reader testing (NVDA/JAWS)
- [ ] Focus management verification
- [ ] ARIA labels audit
- [ ] Color contrast checking
- [ ] Form accessibility review

#### Documentation
- [ ] Component usage documentation
- [ ] Accessibility guidelines
- [ ] Code examples
- [ ] Storybook setup (optional)

### Phase 8: Polish & Optimization (Week 6)

#### Performance
- [ ] Code splitting implementation
- [ ] Lazy loading components
- [ ] Bundle size optimization
- [ ] Animation performance check

#### Dark Mode
- [ ] Dark mode color scheme
- [ ] ThemeToggle component
- [ ] Persistent theme storage
- [ ] Theme context setup

#### Final Review
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Performance metrics
- [ ] Accessibility final check
- [ ] Code review
- [ ] Documentation review

---

## Conclusion

This UI plan provides a comprehensive foundation for the CareerSU platform. The component library follows industry best practices, emphasizes accessibility, and uses modern React patterns.

### Key Takeaways

1. **Component-Driven**: Build reusable, composable components
2. **Accessibility First**: WCAG 2.1 AA compliance minimum
3. **Responsive Design**: Mobile-first approach
4. **Type Safety**: Full TypeScript coverage
5. **Performance**: Optimized for fast loading
6. **Consistency**: Unified design system

### Next Steps

1. Review and approve this plan
2. Set up development environment
3. Configure Tailwind CSS
4. Begin Phase 1 implementation
5. Iterate and refine based on feedback

### Maintenance

- Regular accessibility audits
- Component library updates
- Design system evolution
- Performance monitoring
- User feedback integration

---

**Document Author**: CareerSU Development Team  
**Review Status**: Pending Approval  
**Version**: 1.0.0  
**Date**: 2025-11-07
