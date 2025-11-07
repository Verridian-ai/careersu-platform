# CareerSU Landing Page & Authentication UI Plan

**Document Version**: 1.0  
**Last Updated**: November 2024  
**Target Users**: Job Seekers and Career Coaches  
**Platform**: Web (React 18.3.1, TypeScript, Tailwind CSS, Radix UI)

---

## Table of Contents

1. [Overview](#overview)
2. [Screen Inventory](#screen-inventory)
3. [Component Breakdown](#component-breakdown)
4. [Detailed Specifications](#detailed-specifications)
5. [User Flows](#user-flows)
6. [Data Requirements](#data-requirements)
7. [File Structure & Organization](#file-structure--organization)
8. [Design System & Tokens](#design-system--tokens)

---

## Overview

The Landing Page and Authentication module serves as the entry point for all CareerSU users. It provides:
- Clear value proposition and feature showcase
- Professional, modern design aligned with platform branding
- Seamless authentication experience for both user types
- Responsive design across all devices
- Accessibility compliance (WCAG 2.1 AA)

### Design Principles

- **Clarity**: Clear communication of platform value
- **Trust**: Professional design builds confidence
- **Accessibility**: Inclusive for all users
- **Performance**: Fast load times
- **Consistency**: Aligned with overall platform design system

---

## Screen Inventory

### Primary Screens

| Screen | Purpose | User Types | Priority |
|--------|---------|-----------|----------|
| **Landing Page** | Platform introduction, feature showcase, CTAs | All (unauthenticated) | P0 |
| **Login** | User authentication | Job Seekers, Coaches | P0 |
| **Register** | New account creation | Job Seekers, Coaches | P0 |
| **Register - Role Selection** | User type selection during signup | New Users | P0 |
| **Forgot Password** | Password recovery initiation | All | P1 |
| **Reset Password** | Password change with token | All | P1 |
| **Email Verification** | Email confirmation flow | New Users | P1 |
| **Session Expired** | Re-authentication prompt | Authenticated Users | P2 |

### Secondary Screens

- **Loading States**: Skeleton screens during auth
- **Error States**: Invalid credentials, network errors
- **Success States**: Post-registration, post-reset confirmations

---

## Component Breakdown

### 1. Landing Page

#### Layout Structure

```
┌─────────────────────────────────────────────────┐
│          Navigation Header                      │
├─────────────────────────────────────────────────┤
│          Hero Section                           │
│    (CTA: Get Started, View Demo)                │
├─────────────────────────────────────────────────┤
│          Feature Showcase (3-4 Cards)           │
├─────────────────────────────────────────────────┤
│          Benefits Section                       │
├─────────────────────────────────────────────────┤
│          Testimonials/Social Proof              │
├─────────────────────────────────────────────────┤
│          Call-to-Action Section                 │
├─────────────────────────────────────────────────┤
│          Footer                                 │
└─────────────────────────────────────────────────┘
```

#### Components Required

**Header/Navigation**
- Logo (SVG)
- Navigation menu (desktop) / Hamburger menu (mobile)
- Authentication buttons (Login, Sign Up)
- Radix UI Components:
  - Dialog (for mobile menu)
  - NavigationMenu (optional, for mega menu)

**Hero Section**
- Background image or gradient
- Headline text
- Subheadline text
- Primary CTA button ("Get Started")
- Secondary CTA button ("View Demo")
- Lucide Icons: ArrowRight, Sparkles, Play

**Feature Cards Section**
- 3-4 feature cards with:
  - Icon (Lucide)
  - Title (h3)
  - Description text
  - Optional link/arrow
- Responsive grid (1 col mobile, 2 col tablet, 4 col desktop)

**Benefits Section**
- Two-column layout (image + text) or alternate
- Checkbox list items with benefits
- Visual emphasis on unique selling points
- Lucide Icons: CheckCircle, Zap, Users, TrendingUp

**Testimonials Section**
- Carousel/slider of testimonial cards
- Avatar, name, role, company, quote
- Star ratings (5-star)
- Radix UI Components:
  - Carousel (Embla)
  - Avatar

**CTA Section**
- Prominent call-to-action box
- Heading + description
- Primary button
- Optional form (email signup)

**Footer**
- Company info
- Links (Resources, About, Privacy, Terms)
- Social media links
- Copyright notice
- Lucide Icons: Github, Twitter, Linkedin

#### Lucide Icons Used
- `Sparkles`, `ArrowRight`, `Play` (Hero)
- `CheckCircle`, `Zap`, `Users`, `TrendingUp`, `BarChart3`, `Briefcase`, `BookOpen` (Features)
- `Star` (Testimonials)
- `Github`, `Twitter`, `Linkedin`, `Mail` (Footer)

---

### 2. Login Screen

#### Layout Structure

```
┌──────────────────────────────────┐
│         Header/Logo              │
│      (Back link to landing)      │
├──────────────────────────────────┤
│                                  │
│    Login Form Container          │
│    ┌──────────────────────────┐  │
│    │ Heading: "Sign In"       │  │
│    │ Subheading              │  │
│    │                          │  │
│    │ Email Input              │  │
│    │ Password Input           │  │
│    │                          │  │
│    │ Forgot Password Link     │  │
│    │ Sign In Button (Full)    │  │
│    │                          │  │
│    │ Divider "OR"             │  │
│    │ Demo Account Section     │  │
│    │ ┌────────┐  ┌────────┐  │  │
│    │ │ Demo   │  │ Demo   │  │  │
│    │ │ Job    │  │ Coach  │  │  │
│    │ │ Seeker │  │        │  │  │
│    │ └────────┘  └────────┘  │  │
│    │                          │  │
│    │ Don't have account? ...  │  │
│    │ Create Account Link      │  │
│    └──────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

#### Components Required

**Form Container**
- Card component (Radix UI base styling via Tailwind)
- Responsive width (max 420px on desktop, full on mobile)
- Shadow and border styling

**Form Elements**
- Label component (Radix UI Label)
- Input field (email) with:
  - Placeholder
  - Validation messages
  - Icons (mail icon)
- Input field (password) with:
  - Show/hide password toggle
  - Validation messages
  - Lock icon

**Buttons**
- Primary: "Sign In" button
  - Full width
  - Loading state with spinner
  - Disabled state during submission
- Secondary: "Create Account" link button
- Text: "Forgot Password?" link

**Demo Account Buttons**
- Two button variants showing demo credentials
- Quick-action buttons
- Radix UI Tooltip for credential display
- Icons: User, Key

**Form Validation**
- Required field indicators
- Real-time error messages below inputs
- Success checkmarks for valid fields
- Radix UI Components:
  - Form validation via react-hook-form + zod

#### Lucide Icons Used
- `Mail` (email input)
- `Lock` (password input)
- `Eye`, `EyeOff` (password visibility)
- `AlertCircle`, `CheckCircle` (validation)
- `User`, `Key` (demo buttons)
- `ChevronLeft` (back link)

---

### 3. Register Screen

#### Layout Structure

```
┌──────────────────────────────────┐
│         Header/Logo              │
│      (Back link to login)        │
├──────────────────────────────────┤
│                                  │
│    Register Form Container       │
│    ┌──────────────────────────┐  │
│    │ Heading: "Create Account"│  │
│    │ Subheading              │  │
│    │                          │  │
│    │ First Name Input         │  │
│    │ Last Name Input          │  │
│    │ Email Input              │  │
│    │ Password Input           │  │
│    │ Confirm Password Input   │  │
│    │                          │  │
│    │ User Type Selection      │  │
│    │ ┌─────────────────────┐ │  │
│    │ │ ○ Job Seeker        │ │  │
│    │ │ ○ Career Coach      │ │  │
│    │ └─────────────────────┘ │  │
│    │                          │  │
│    │ Terms & Privacy Checkbox │  │
│    │ Create Account Button    │  │
│    │                          │  │
│    │ Already have account?    │  │
│    │ Sign In Link             │  │
│    └──────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

#### Components Required

**Form Elements**
- Label component (Radix UI)
- Text inputs for:
  - First name
  - Last name
  - Email (with validation)
  - Password (with strength meter)
  - Confirm password
- Password strength indicator
  - Visual bar showing strength levels
  - Text feedback (Weak, Fair, Good, Strong)

**User Type Selection**
- Radio group (Radix UI RadioGroup)
- Two options: Job Seeker, Career Coach
- Description text for each option
- Icons and visual differentiation

**Checkbox**
- Terms & Privacy acceptance
- Radix UI Checkbox
- Link to terms and privacy policy pages

**Password Strength Meter**
- Visual progress bar (Radix UI Progress)
- Real-time validation
- Requirements checklist (minimum length, uppercase, number, special char)

**Buttons**
- Primary: "Create Account" (full width, loading state)
- Link: "Already have an account? Sign In"

**Form Validation**
- Required field indicators
- Real-time validation messages
- Email format validation
- Password confirmation matching
- Terms acceptance requirement

#### Lucide Icons Used
- `Mail`, `User`, `Lock`, `Eye`, `EyeOff`
- `RadioCircle`, `Circle` (radio buttons)
- `Check`, `AlertCircle` (validation)
- `Briefcase`, `Users` (user type selection)

---

### 4. Forgot Password Screen

#### Layout Structure

```
┌──────────────────────────────────┐
│         Header/Logo              │
│      (Back link)                 │
├──────────────────────────────────┤
│                                  │
│    Recovery Form Container       │
│    ┌──────────────────────────┐  │
│    │ Heading: "Reset Password"│  │
│    │ Description Text         │  │
│    │                          │  │
│    │ Email Input              │  │
│    │                          │  │
│    │ Send Reset Link Button   │  │
│    │                          │  │
│    │ Back to Sign In Link     │  │
│    └──────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

#### Components Required

- Email input field with validation
- Primary button "Send Reset Link"
- Text: "We'll send you an email with a link to reset your password"
- Back link to login
- Success state message (optional, after submission)
- Error handling for email not found

#### Lucide Icons Used
- `Mail`, `ChevronLeft`, `Send`

---

### 5. Reset Password Screen

#### Layout Structure

Similar to Register, but with:
- "Set New Password" heading
- New password input
- Confirm password input
- "Reset Password" button
- Password strength indicator

#### Components Required

- Heading with token verification status
- New password input with strength meter
- Confirm password input
- Primary button "Reset Password"
- Success message after reset
- Error message for invalid/expired token

---

### 6. Email Verification Screen

#### Layout Structure

```
┌──────────────────────────────────┐
│      Verification Container      │
│                                  │
│    Icon/Animation                │
│    "Verify Your Email"           │
│                                  │
│    Verification Code Input       │
│    (6 digit code with auto-focus)│
│                                  │
│    "Verify" Button               │
│                                  │
│    "Resend Code" Link            │
│    Countdown timer               │
│                                  │
│    "Change Email" Link           │
└──────────────────────────────────┘
```

#### Components Required

- Icon animation (verification check or envelope)
- 6-digit code input (Radix UI Input or custom)
- Auto-focus on digit entry
- Resend button with countdown timer
- Primary verify button
- Error messages for invalid codes

#### Lucide Icons Used
- `Mail`, `MailCheck`, `RotateCw`, `Clock`

---

## Detailed Specifications

### Typography & Hierarchy

**Landing Page**
- Hero Headline: `text-4xl md:text-6xl font-bold` (48-72px)
- Section Headings: `text-3xl md:text-4xl font-bold` (36-48px)
- Feature Titles: `text-xl font-semibold` (20px)
- Body Text: `text-base md:text-lg` (16px)
- Small Text: `text-sm` (14px)

**Authentication Screens**
- Page Heading: `text-3xl font-bold` (32px)
- Form Labels: `text-sm font-medium` (14px)
- Input Text: `text-base` (16px)
- Error Messages: `text-sm text-red-600` (14px)
- Helper Text: `text-xs text-gray-600` (12px)

### Color Palette

**Primary Colors**
- Primary Blue: `#0EA5E9` (Radix Slate + Tailwind Sky)
- Primary Hover: `#0284C7`
- Success Green: `#10B981`
- Error Red: `#EF4444`
- Warning Orange: `#F97316`

**Neutral Colors**
- Background: `#FFFFFF`
- Surface: `#F9FAFB` (light gray)
- Border: `#E5E7EB` (medium gray)
- Text Primary: `#111827` (dark gray)
- Text Secondary: `#6B7280` (medium gray)

### Spacing System

- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px
- 3XL: 64px

### Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Landing Page Specifications

#### Hero Section
- **Desktop**: Full viewport height (calc(100vh - navbar height))
- **Mobile**: 60vh minimum
- **Background**: Gradient or high-quality image
- **CTA Buttons**: 
  - Primary button: Solid blue background, white text
  - Secondary button: Transparent, blue border, blue text
  - Hover state: Slight scale (1.02) and shadow increase
  - Active state: Darker background

#### Feature Cards
- **Desktop Layout**: 4 columns, grid with gap-6
- **Tablet Layout**: 2 columns
- **Mobile Layout**: 1 column, stacked vertically
- **Card Styling**: 
  - White background with subtle shadow
  - Border: 1px solid #E5E7EB
  - Hover state: Shadow elevation increase, slight scale
  - Padding: 24px (6 units)
  - Border radius: 8px

#### Navigation Menu (Mobile)
- **Trigger**: Hamburger menu icon in top-right
- **Menu Position**: Fixed, slide-in from left or right
- **Z-index**: 50
- **Overlay**: Semi-transparent backdrop (rgba 0 0 0 / 0.5)
- **Animation**: Smooth slide in/out (200ms)

### Authentication Screen Specifications

#### Form Container
- **Desktop**: 
  - Max-width: 420px
  - Centered on viewport
  - Padding: 48px (3xl)
- **Mobile**: 
  - Full width with 16px padding on sides
  - Padding: 24px (lg)

#### Input Fields
- **Height**: 40px (min-h-10)
- **Border radius**: 6px
- **Border**: 1px solid #E5E7EB
- **Padding**: 12px 16px
- **Font size**: 16px
- **Focus state**: 
  - Border color: #0EA5E9
  - Box shadow: `0 0 0 3px rgba(14, 165, 233, 0.1)`
  - No outline (outline: none)
- **Disabled state**: 
  - Background: #F3F4F6
  - Cursor: not-allowed
  - Opacity: 0.6

#### Buttons
- **Primary Button** (Sign In, Create Account, etc.)
  - Height: 40px (min-h-10)
  - Border radius: 6px
  - Background: #0EA5E9
  - Color: white
  - Font weight: 600
  - Full width on mobile, auto on desktop
  - Hover: Background #0284C7, shadow increase
  - Active: Background #0369A1, slight scale down (0.98)
  - Disabled: Background #D1D5DB, cursor not-allowed
  - Loading state: Spinner animation, disabled interaction

- **Secondary Button** (Links, text buttons)
  - Background: transparent
  - Color: #0EA5E9
  - Text-decoration: underline on hover
  - No padding initially, padding-y: 8px on button style

- **Demo Account Buttons**
  - Display as card/tile style
  - Background: #F3F4F6
  - Border: 1px solid #E5E7EB
  - Padding: 16px
  - Border radius: 6px
  - Hover: Border color #0EA5E9, shadow increase
  - Cursor: pointer

#### Form Labels
- **Font size**: 14px (text-sm)
- **Font weight**: 500
- **Color**: #111827
- **Margin bottom**: 6px
- **Required indicator**: Red asterisk (*) appended

#### Validation States

**Error State**
- Input border: #EF4444
- Error message: `text-sm text-red-600` below input
- Icon: AlertCircle in red
- Background: Light red tint (optional): `#FEE2E2`

**Success State**
- Input border: #10B981
- Success message: Green checkmark (optional)
- Icon: CheckCircle in green

**Focus State**
- Border color: #0EA5E9
- Box shadow: `0 0 0 3px rgba(14, 165, 233, 0.1)`
- Background: White

#### Password Visibility Toggle
- Icon button: 24x24px
- Positioned: Absolute right inside input field, 12px from right edge
- Color: #6B7280
- Hover: Color #111827
- Cursor: pointer

#### Radio Group (User Type Selection)
- Layout: Vertical stack on mobile, horizontal on desktop
- Option cards: 
  - Border: 2px solid #E5E7EB
  - Padding: 16px
  - Border radius: 8px
  - Hover: Border color #0EA5E9
  - Selected: Border color #0EA5E9, background #F0F9FF

#### Checkbox (Terms & Privacy)
- Label next to checkbox
- Checkbox size: 20x20px
- Links in label: Color #0EA5E9, underline on hover

#### Password Strength Meter
- Progress bar height: 4px
- Width: Full input width
- Margin top: 8px
- Colors:
  - Weak (0-33%): #EF4444 (Red)
  - Fair (34-66%): #F97316 (Orange)
  - Good (67-85%): #EAB308 (Yellow)
  - Strong (86-100%): #10B981 (Green)

#### Error Messages
- Font size: 12px (text-xs)
- Color: #EF4444
- Margin top: 4px
- Icon: AlertCircle
- Display: Flex with icon

#### Success Messages
- Font size: 14px (text-sm)
- Color: #10B981
- Background: #ECFDF5
- Padding: 12px 16px
- Border radius: 6px
- Icon: CheckCircle

### Animations & Transitions

**Button Hover**
- Duration: 200ms
- Easing: ease-out
- Properties: background-color, box-shadow, transform

**Input Focus**
- Duration: 150ms
- Easing: ease-in-out
- Properties: border-color, box-shadow

**Page Transitions**
- Duration: 300ms
- Easing: ease-out
- Fade in/out effects

**Loading Spinner**
- Duration: 1s
- Rotation: 360deg
- Infinite animation

**Form Validation Messages**
- Slide down animation
- Duration: 200ms
- Opacity fade-in

### Accessibility Requirements

**WCAG 2.1 AA Compliance**

**Navigation & Structure**
- Semantic HTML: `<form>`, `<label>`, `<button>`, `<nav>`, `<main>`
- Proper heading hierarchy: H1 → H2 → H3
- Skip to main content link
- Landmarks: `<header>`, `<main>`, `<footer>`

**Forms**
- All inputs have associated labels via `<label for="">` or aria-label
- Form groups have fieldset + legend for radio groups and checkboxes
- Required fields marked with asterisk AND aria-required="true"
- Error messages: aria-describedby pointing to error message ID
- Field IDs match label htmlFor attributes
- Success/error states conveyed through color AND icons/text

**Buttons**
- Sufficient color contrast (4.5:1 for text, 3:1 for graphics)
- Focus indicators visible (outline or equivalent)
- Minimum size: 44x44px (touch targets)
- Label text clear and meaningful
- aria-label for icon-only buttons

**Images & Icons**
- Lucide icons wrapped in semantic context or have aria-label
- Decorative icons: aria-hidden="true"
- Informational icons: aria-label describing purpose
- Alt text for any raster images

**Motion & Animation**
- prefers-reduced-motion media query respected
- No auto-playing animations that loop > 3 seconds
- No flashing content (> 3 flashes per second)

**Keyboard Navigation**
- Tab order logical and intuitive
- Focus visible on all interactive elements
- Escape key closes modals/menus
- Enter key submits forms
- Arrow keys for radio groups and dropdowns

**Color & Contrast**
- Text contrast: 4.5:1 for normal text, 3:1 for large text
- Don't rely on color alone to convey information
- Focus indicators: 3px minimum width

**Language**
- html lang="en"
- Accessible error messages (clear, constructive)
- Plain language, avoid jargon

---

## User Flows

### 1. Landing Page Visitor Flow

```
┌──────────────────┐
│  Visit Landing   │
│     Page         │
└────────┬─────────┘
         │
         ├─→ ┌──────────────────┐
         │   │  Explore Features │
         │   │  Read Content     │
         │   │  View Testimonials│
         │   └────────┬─────────┘
         │            │
         ├─→ ┌────────┴─────────┐
         │   │  Click "Get       │
         │   │  Started" CTA     │
         │   └────────┬─────────┘
         │            │
         │   ┌────────▼─────────┐
         │   │ Navigate to      │
         │   │ Signup Flow      │
         │   └──────────────────┘
         │
         ├─→ ┌──────────────────┐
         │   │  Click "View Demo"│
         │   │  (Opens Demo Acct │
         │   │   Modal/Info)     │
         │   └──────────────────┘
         │
         └─→ ┌──────────────────┐
             │  Click Login Link │
             │  Navigate to      │
             │  Login Screen     │
             └──────────────────┘
```

### 2. Login Flow

```
┌─────────────────────┐
│   Visit Login Page  │
└──────────┬──────────┘
           │
           ├─→ ┌──────────────────────────┐
           │   │ See Demo Account Options │
           │   │ Click "Use Demo Account" │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ Pre-fill email/password  │
           │   │ Auto-submit Login        │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ Authenticate            │
           │   │ Redirect to Dashboard   │
           │   └──────────────────────────┘
           │
           ├─→ ┌──────────────────────────┐
           │   │ Enter Email & Password   │
           │   │ Validate Inputs (Client) │
           │   │ Click "Sign In"          │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ Submit to Backend        │
           │   │ Server-side Validation   │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ Check Credentials        │
           │   │ Generate Session Token   │
           │   │ Return Success/Error     │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ Store Session Token      │
           │   │ Redirect to Dashboard    │
           │   └──────────────────────────┘
           │
           ├─→ ┌──────────────────────────┐
           │   │ Invalid Credentials      │
           │   │ Show Error Message       │
           │   │ Remain on Login Page     │
           │   └──────────────────────────┘
           │
           └─→ ┌──────────────────────────┐
               │ Click "Forgot Password?" │
               │ Navigate to Password     │
               │ Recovery Page           │
               └──────────────────────────┘
```

### 3. Registration Flow

```
┌──────────────────────┐
│ Navigate to Sign Up  │
└──────────┬───────────┘
           │
           ├─→ ┌──────────────────────────┐
           │   │ Enter Name, Email        │
           │   │ Enter Password           │
           │   │ Confirm Password         │
           │   │ (Real-time validation)   │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ See Password Strength    │
           │   │ Meter Update             │
           │   └──────────────────────────┘
           │
           ├─→ ┌──────────────────────────┐
           │   │ Select User Type         │
           │   │ (Job Seeker/Coach)       │
           │   │ (Radio group selection)  │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ Accept Terms &           │
           │   │ Privacy Policy           │
           │   │ Checkbox required        │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ Click "Create Account"   │
           │   │ Submit Form              │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ Server Validation        │
           │   │ Check email uniqueness   │
           │   │ Create user account      │
           │   │ Send verification email  │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ Redirect to Email        │
           │   │ Verification Page        │
           │   │ Display instructions     │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ User receives email      │
           │   │ Clicks verification link │
           │   │ or enters code           │
           │   └──────────┬───────────────┘
           │              │
           │   ┌──────────▼───────────────┐
           │   │ Email verified           │
           │   │ Account activated        │
           │   │ Auto-login user          │
           │   │ Redirect to onboarding/  │
           │   │ dashboard                │
           │   └──────────────────────────┘
           │
           └─→ ┌──────────────────────────┐
               │ Validation Errors        │
               │ Display inline errors    │
               │ (email exists, weak pwd, │
               │  mismatch, etc)          │
               │ Allow correction         │
               └──────────────────────────┘
```

### 4. Password Reset Flow

```
┌──────────────────────────────┐
│ Click "Forgot Password?"      │
│ Navigate to Recovery Page     │
└──────────┬───────────────────┘
           │
           ├─→ ┌─────────────────────────────┐
           │   │ Enter email address         │
           │   │ Click "Send Reset Link"     │
           │   └────────────┬────────────────┘
           │                │
           │   ┌────────────▼────────────────┐
           │   │ Server validates email      │
           │   │ Generates reset token       │
           │   │ Sends reset email           │
           │   └────────────┬────────────────┘
           │                │
           │   ┌────────────▼────────────────┐
           │   │ Show success message        │
           │   │ "Check your email..."       │
           │   │ Offer resend option         │
           │   └─────────────────────────────┘
           │
           └─→ ┌─────────────────────────────┐
               │ User checks email           │
               │ Clicks reset link           │
               │ (token in URL)              │
               │ Navigate to reset page      │
               └────────────┬────────────────┘
                            │
                  ┌─────────▼─────────────────┐
                  │ Server validates token    │
                  │ (expiration, validity)    │
                  └────────────┬──────────────┘
                               │
                  ┌────────────▼──────────────┐
                  │ If valid:                 │
                  │ Display reset form        │
                  │ If invalid/expired:       │
                  │ Show error, link to       │
                  │ request new token         │
                  └────────────┬──────────────┘
                               │
                  ┌────────────▼──────────────┐
                  │ User enters new password  │
                  │ Sees strength meter       │
                  │ Confirms password         │
                  │ Clicks "Reset Password"   │
                  └────────────┬──────────────┘
                               │
                  ┌────────────▼──────────────┐
                  │ Server validates new pwd  │
                  │ Updates password          │
                  │ Invalidates reset token   │
                  │ Returns success           │
                  └────────────┬──────────────┘
                               │
                  ┌────────────▼──────────────┐
                  │ Show success message      │
                  │ "Password reset           │
                  │  successfully!"           │
                  │ Auto-redirect to login    │
                  │ (after 3 seconds)         │
                  └───────────────────────────┘
```

---

## Data Requirements

### 1. Landing Page Data

**Static Content**
- Hero section copy (headline, subheadline, CTA text)
- Feature list (4 features with icons, titles, descriptions)
- Benefits list (5-7 items)
- Testimonials array (name, role, company, quote, avatar)
- Footer links and social media URLs

**Dynamic Elements**
- Navigation menu items (from config)
- Feature cards (from config)
- CTA sections (configurable)

### 2. Authentication Data

#### User Input Captured

**Login Form**
```
{
  email: string (required, valid email)
  password: string (required, min 8 chars)
}
```

**Registration Form**
```
{
  firstName: string (required, 2-50 chars)
  lastName: string (required, 2-50 chars)
  email: string (required, valid email, unique)
  password: string (required, min 8 chars, strength validation)
  confirmPassword: string (required, must match password)
  userType: enum ('job_seeker' | 'coach') (required)
  acceptTerms: boolean (required, must be true)
}
```

**Forgot Password Form**
```
{
  email: string (required, valid email)
}
```

**Reset Password Form**
```
{
  newPassword: string (required, min 8 chars, strength validation)
  confirmPassword: string (required, must match)
  resetToken: string (from URL, required)
}
```

**Email Verification Form**
```
{
  verificationCode: string (required, 6 digits)
  userId: string (from URL or session)
}
```

#### Data Returned by Server

**Login Response**
```
{
  success: boolean
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    userType: 'job_seeker' | 'coach'
    emailVerified: boolean
    createdAt: timestamp
  }
  token: string (JWT or session token)
  refreshToken?: string
  expiresIn: number (seconds)
}
```

**Registration Response**
```
{
  success: boolean
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    userType: 'job_seeker' | 'coach'
    emailVerified: false
    createdAt: timestamp
  }
  message: string ("Account created. Please verify your email.")
}
```

**Forgot Password Response**
```
{
  success: boolean
  message: string ("If an account exists...")
}
```

**Reset Password Response**
```
{
  success: boolean
  message: string ("Password reset successfully")
}
```

**Email Verification Response**
```
{
  success: boolean
  verified: boolean
  user?: {
    id: string
    emailVerified: true
  }
  token?: string (auto-login)
}
```

### 3. Validation Rules

**Email**
- Required
- Valid email format (RFC 5322)
- Max 255 characters
- Unique (check against existing users)
- Lowercase comparison for uniqueness

**Password**
- Required
- Minimum 8 characters
- Must contain at least:
  - One uppercase letter (A-Z)
  - One lowercase letter (a-z)
  - One number (0-9)
  - One special character (!@#$%^&*)
- Maximum 128 characters
- Cannot be one of last 5 passwords

**First Name**
- Required
- 2-50 characters
- Alphanumeric and common punctuation only (no special chars)

**Last Name**
- Required
- 2-50 characters
- Alphanumeric and common punctuation only

**User Type**
- Required
- Enum: 'job_seeker' | 'coach'

**Terms Acceptance**
- Required
- Must be explicitly checked (true)

### 4. API Endpoints Required

**Authentication Endpoints**

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|--------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/register` | Create new account | No |
| POST | `/api/auth/logout` | End user session | Yes |
| POST | `/api/auth/forgot-password` | Initiate password reset | No |
| POST | `/api/auth/reset-password` | Complete password reset | No |
| POST | `/api/auth/verify-email` | Verify email with code | No |
| POST | `/api/auth/resend-verification` | Resend verification email | No |
| POST | `/api/auth/refresh-token` | Refresh session token | Yes |
| GET | `/api/auth/validate-email` | Check if email is unique | No |
| GET | `/api/auth/validate-password` | Check password strength | No |

**Example Endpoint Details**

```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "user": {
    "id": "usr_12345",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "userType": "job_seeker",
    "emailVerified": true
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 86400
}

Response (401 Unauthorized):
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

## File Structure & Organization

### Recommended Directory Structure

```
src/
├── components/
│   ├── landing/
│   │   ├── LandingPage.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Benefits.tsx
│   │   ├── Testimonials.tsx
│   │   ├── CallToAction.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   │
│   ├── auth/
│   │   ├── AuthLayout.tsx
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── ResetPasswordForm.tsx
│   │   ├── EmailVerification.tsx
│   │   ├── DemoAccountCard.tsx
│   │   ├── PasswordStrengthMeter.tsx
│   │   ├── FormField.tsx
│   │   └── index.ts
│   │
│   ├── common/
│   │   ├── Navigation.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── Logo.tsx
│   │   ├── Button.tsx (custom wrapper)
│   │   ├── Input.tsx (custom wrapper)
│   │   ├── Label.tsx (custom wrapper)
│   │   ├── ErrorMessage.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── index.ts
│   │
│   └── index.ts
│
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   └── EmailVerificationPage.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useLogin.ts
│   ├── useRegister.ts
│   ├── usePasswordReset.ts
│   ├── useEmailVerification.ts
│   └── useFormValidation.ts
│
├── services/
│   ├── authService.ts
│   ├── apiClient.ts
│   └── errorHandler.ts
│
├── schemas/
│   ├── auth.schema.ts (Zod schemas for forms)
│   └── validation.ts
│
├── types/
│   ├── auth.ts
│   ├── user.ts
│   └── api.ts
│
├── context/
│   ├── AuthContext.tsx
│   └── useAuthContext.ts
│
├── utils/
│   ├── validation.ts
│   ├── formatting.ts
│   ├── constants.ts
│   └── errorMessages.ts
│
├── styles/
│   ├── globals.css
│   ├── tailwind.config.ts
│   └── animations.css
│
└── App.tsx
```

### Key Files Description

**Landing Page Components**
- `LandingPage.tsx`: Main page container
- `Hero.tsx`: Hero section with CTA
- `Features.tsx`: Feature showcase grid
- `Benefits.tsx`: Benefits section
- `Testimonials.tsx`: Testimonial carousel
- `CallToAction.tsx`: CTA section
- `Footer.tsx`: Footer with links

**Auth Components**
- `AuthLayout.tsx`: Container for auth pages
- `LoginForm.tsx`: Login form logic and validation
- `RegisterForm.tsx`: Registration form with steps
- `PasswordStrengthMeter.tsx`: Visual strength indicator
- `DemoAccountCard.tsx`: Demo account quick-action button
- `FormField.tsx`: Reusable form field with validation display

**Common Components**
- `Navigation.tsx`: Header navigation
- `MobileMenu.tsx`: Mobile hamburger menu
- `Button.tsx`: Custom button wrapper for consistency
- `Input.tsx`: Custom input wrapper with styling
- `Label.tsx`: Custom label wrapper
- `ErrorMessage.tsx`: Styled error message display

**Hooks**
- `useAuth.ts`: Auth context consumer
- `useLogin.ts`: Login form logic and API call
- `useRegister.ts`: Registration form logic and API call
- `usePasswordReset.ts`: Password reset flow logic
- `useFormValidation.ts`: Reusable form validation logic

**Services**
- `authService.ts`: All API calls for auth endpoints
- `apiClient.ts`: Axios/fetch client with interceptors
- `errorHandler.ts`: Standardized error handling

**Types & Schemas**
- `auth.schema.ts`: Zod schemas for all auth forms
- `auth.ts`: TypeScript interfaces for auth types
- `user.ts`: User-related types
- `api.ts`: API request/response types

---

## Design System & Tokens

### Tailwind Configuration

**Colors (extended)**
```typescript
colors: {
  primary: '#0EA5E9',
  'primary-dark': '#0284C7',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F97316',
  background: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
  }
}
```

**Spacing**
```typescript
spacing: {
  // Already extends Tailwind defaults
  // Use: space-4, px-6, gap-8, etc.
}
```

**Border Radius**
```typescript
borderRadius: {
  'sm': '4px',
  'base': '6px',
  'md': '8px',
  'lg': '12px',
}
```

**Shadows**
```typescript
boxShadow: {
  'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
}
```

**Animations**
```typescript
animation: {
  'spin': 'spin 1s linear infinite',
  'fade-in': 'fadeIn 300ms ease-out',
  'slide-down': 'slideDown 200ms ease-out',
}
```

### Component Variants

**Button Variants** (using CVA - class-variance-authority)
```typescript
button({
  variant: 'primary' | 'secondary' | 'outline' | 'ghost',
  size: 'sm' | 'md' | 'lg',
  state: 'default' | 'hover' | 'active' | 'disabled' | 'loading'
})
```

**Input Variants**
```typescript
input({
  state: 'default' | 'focus' | 'error' | 'success' | 'disabled'
})
```

**Card Variants**
```typescript
card({
  variant: 'default' | 'outlined' | 'elevated',
  hover: boolean
})
```

---

## Conclusion

This comprehensive UI plan provides all specifications needed for development of the CareerSU landing page and authentication screens. The document covers:

- Clear screen inventory with priorities
- Detailed component breakdowns with Radix UI and Lucide components
- Responsive specifications across all devices
- Complete user flow diagrams
- Data requirements and API specifications
- Recommended file structure for scalable development
- Design system and token documentation

**Next Steps:**
1. Review and approve design specifications
2. Create Figma/design mockups based on specifications
3. Set up component library with storybook
4. Begin implementation following file structure
5. Implement unit tests for validation logic
6. Set up E2E tests for user flows

**Version Control:**
- Document Version: 1.0
- Last Updated: November 2024
- Maintained by: CareerSU Platform Team

