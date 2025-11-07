# Collaboration and Messaging UI Plan

## Document Overview

**Feature**: Collaboration and Messaging System  
**Platform**: CareerSU - AI-Powered Career Success Platform  
**Version**: 1.0  
**Last Updated**: November 7, 2025  
**Tech Stack**: React 18.3.1, TypeScript, Tailwind CSS, Radix UI, Lucide Icons

---

## Table of Contents

1. [Screen Inventory](#screen-inventory)
2. [Component Breakdown](#component-breakdown)
3. [Detailed Component Specifications](#detailed-component-specifications)
4. [User Flows](#user-flows)
5. [Data Requirements](#data-requirements)
6. [File Structure](#file-structure)
7. [Real-time Integration](#real-time-integration)
8. [Accessibility Considerations](#accessibility-considerations)

---

## 1. Screen Inventory

### 1.1 Messages/Inbox Page (`/messages`)

**Purpose**: Central hub for all conversations between job seekers and coaches

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ Navigation Bar                                    [🔔] [👤]  │
├──────────────┬──────────────────────────────────────────────┤
│              │                                              │
│  Sidebar     │         Main Content Area                    │
│              │                                              │
│  - Messages  │   ┌──────────────────────────────────────┐  │
│  - Documents │   │  Conversation List / Thread View     │  │
│  - Calendar  │   │                                      │  │
│              │   │                                      │  │
│              │   └──────────────────────────────────────┘  │
│              │                                              │
└──────────────┴──────────────────────────────────────────────┘
```

**Key Elements**:
- Conversation list (left panel)
- Active conversation thread (right panel)
- Message composer at bottom
- Search and filter bar
- New conversation button
- Notification badge for unread messages

---

### 1.2 Conversation View (`/messages/:conversationId`)

**Purpose**: Full-screen view of a single conversation thread

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ [←] Sarah Johnson - Career Coach              [📞] [📹] [⋮] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Avatar] Sarah Johnson                    10:30 AM        │
│  ┌─────────────────────────────────────────────────┐      │
│  │ Hi John! I've reviewed your resume...          │      │
│  └─────────────────────────────────────────────────┘      │
│                                                             │
│                  [Avatar] You           10:35 AM            │
│      ┌─────────────────────────────────────────────────┐  │
│      │ Thank you! I'd love to discuss...             │  │
│      └─────────────────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [📎] [😊] Type your message...              [Send Button]   │
└─────────────────────────────────────────────────────────────┘
```

**Key Elements**:
- Conversation header with participant info
- Action buttons (call, video, menu)
- Scrollable message thread
- Message composer with rich text support
- File attachment button
- Emoji picker
- Send button

---

### 1.3 Document Comments Panel (`/documents/:documentId`)

**Purpose**: Inline commenting system for document collaboration

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ Document Editor                     [💬 Comments] [Share]   │
├────────────────────────────┬────────────────────────────────┤
│                            │                                │
│   Document Content         │    Comments Panel             │
│                            │                                │
│   Lorem ipsum dolor...     │  ┌──────────────────────────┐ │
│   [highlighted text]       │  │ Sarah Johnson            │ │
│                            │  │ 2 hours ago              │ │
│                            │  │                          │ │
│                            │  │ Consider rephrasing      │ │
│                            │  │ this section...          │ │
│                            │  │                          │ │
│                            │  │ [Reply] [Resolve]        │ │
│                            │  └──────────────────────────┘ │
│                            │                                │
└────────────────────────────┴────────────────────────────────┘
```

**Key Elements**:
- Document editor (main area)
- Collapsible comments sidebar
- Comment threads linked to document sections
- Inline comment indicators
- Comment composer
- Resolve/unresolve functionality
- Filter by resolved/unresolved

---

### 1.4 Notifications Center

**Purpose**: Centralized notification management

**Dropdown View** (from nav bar):
```
┌────────────────────────────────────────┐
│ Notifications                    [⚙️]  │
├────────────────────────────────────────┤
│ [Mark all as read]                     │
├────────────────────────────────────────┤
│ 🟢 New message from Sarah Johnson     │
│    "I've reviewed your resume..."      │
│    2 minutes ago                       │
├────────────────────────────────────────┤
│ 💬 New comment on "Software Resume"   │
│    Sarah added a comment               │
│    1 hour ago                          │
├────────────────────────────────────────┤
│ 📅 Meeting reminder                    │
│    Career coaching session in 30 min   │
│    Today at 2:00 PM                    │
├────────────────────────────────────────┤
│ [View All Notifications]               │
└────────────────────────────────────────┘
```

**Full Page View** (`/notifications`):
- Tabbed interface (All, Messages, Comments, Meetings, System)
- Infinite scroll
- Bulk actions
- Filter and search

**Key Elements**:
- Notification badge with count
- Dropdown quick view (5 most recent)
- Full notifications page
- Action buttons (mark read, delete)
- Deep links to relevant content
- Filter by type and date
- Read/unread states

---

### 1.5 Scheduling Calendar (`/calendar`)

**Purpose**: Schedule and manage meetings between job seekers and coaches

**Layout**:
```
┌─────────────────────────────────────────────────────────────┐
│ Calendar                              [+ New Meeting]        │
├─────────────────────────────────────────────────────────────┤
│ [Day] [Week] [Month] [Agenda]     < November 2025 >        │
├─────────────────────────────────────────────────────────────┤
│ Mon    Tue    Wed    Thu    Fri    Sat    Sun              │
│                                                             │
│                     1      2      3      4      5           │
│                                                             │
│  6      7      8      9      10     11     12               │
│         [Meeting]                                           │
│         2:00 PM                                             │
│                                                             │
│  13     14     15     16     17     18     19               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Elements**:
- Multiple calendar views (day, week, month, agenda)
- Meeting creation dialog
- Availability slots
- Recurring meeting support
- Meeting details sidebar
- Integration with video conferencing
- Reminder settings
- Time zone support

---

## 2. Component Breakdown

### 2.1 Message Components

#### ConversationList
- **Purpose**: Display all user conversations
- **Location**: Left sidebar of messages page
- **Key Features**:
  - List of conversation items
  - Search/filter functionality
  - Sort options (recent, unread, starred)
  - Infinite scroll
  - Virtual scrolling for performance

#### ConversationItem
- **Purpose**: Single conversation preview
- **Contains**:
  - Participant avatar
  - Participant name
  - Last message preview
  - Timestamp
  - Unread badge
  - Online status indicator

#### ConversationThread
- **Purpose**: Display messages in a conversation
- **Contains**:
  - Message list with virtual scrolling
  - Date separators
  - System messages (e.g., "Sarah joined")
  - Typing indicators
  - Read receipts
  - Message grouping by sender

#### Message
- **Purpose**: Individual message bubble
- **Contains**:
  - Sender avatar (optional, grouped messages)
  - Message text with rich formatting
  - Timestamp
  - Read status
  - Attachment previews
  - Reactions (emoji)
  - Action menu (edit, delete, reply)

#### MessageComposer
- **Purpose**: Input field for new messages
- **Contains**:
  - Rich text editor
  - Toolbar (bold, italic, link, etc.)
  - Attachment button
  - Emoji picker button
  - Send button
  - Character counter
  - Draft auto-save

---

### 2.2 Comment Components

#### CommentsPanel
- **Purpose**: Sidebar panel for document comments
- **Contains**:
  - Comment thread list
  - Filter controls (all, resolved, unresolved)
  - Sort options (newest, oldest, position)
  - New comment button

#### CommentThread
- **Purpose**: Group of related comments
- **Contains**:
  - Original comment
  - Reply comments
  - Quoted text/context
  - Resolve button
  - Collapse/expand control

#### Comment
- **Purpose**: Single comment in a thread
- **Contains**:
  - Author avatar and name
  - Timestamp
  - Comment text with rich formatting
  - Edit/delete buttons (for author)
  - Reply button
  - Like/reaction buttons

#### CommentComposer
- **Purpose**: Input for new comments
- **Contains**:
  - Text input with basic formatting
  - @ mention support
  - Cancel/submit buttons
  - Character limit indicator

#### InlineCommentIndicator
- **Purpose**: Highlight commented text in document
- **Contains**:
  - Visual highlight
  - Comment count badge
  - Tooltip preview on hover
  - Click to open comments panel

---

### 2.3 Notification Components

#### NotificationBell
- **Purpose**: Notification icon in navigation
- **Contains**:
  - Bell icon
  - Unread count badge
  - Animated pulse for new notifications
  - Dropdown trigger

#### NotificationDropdown
- **Purpose**: Quick view of recent notifications
- **Contains**:
  - Header with "Mark all as read"
  - List of 5 most recent notifications
  - "View all" link
  - Settings icon

#### NotificationItem
- **Purpose**: Single notification display
- **Contains**:
  - Type icon (message, comment, meeting, etc.)
  - Notification text
  - Timestamp
  - Read/unread indicator
  - Action buttons
  - Deep link to source

#### NotificationCenter
- **Purpose**: Full page notification management
- **Contains**:
  - Tabbed navigation by type
  - Filter and search controls
  - Bulk action toolbar
  - Infinite scroll list
  - Notification preferences link

---

### 2.4 Calendar Components

#### CalendarView
- **Purpose**: Display calendar with meetings
- **Contains**:
  - Header with view controls
  - Calendar grid (day/week/month)
  - Meeting blocks
  - Time indicators
  - Current time marker

#### MeetingBlock
- **Purpose**: Visual representation of meeting
- **Contains**:
  - Meeting title
  - Time range
  - Participant avatars
  - Status indicator (upcoming, in-progress, completed)
  - Color coding by type

#### MeetingScheduler
- **Purpose**: Dialog for creating meetings
- **Contains**:
  - Title input
  - Date/time pickers
  - Duration selector
  - Participant selector
  - Description field
  - Video link option
  - Recurring meeting options
  - Reminder settings

#### AvailabilitySelector
- **Purpose**: Select available time slots
- **Contains**:
  - Weekly time grid
  - Toggle for available/unavailable
  - Preset options (working hours, etc.)
  - Time zone selector

#### MeetingDetails
- **Purpose**: Display/edit meeting information
- **Contains**:
  - Meeting title
  - Date/time
  - Participants list
  - Description
  - Video link
  - Action buttons (join, edit, cancel)
  - Notes section

---

### 2.5 Video Call Components

#### VideoCallButton
- **Purpose**: Initiate video call from conversation
- **Contains**:
  - Video camera icon
  - Tooltip
  - Click handler to start call

#### VideoCallDialog
- **Purpose**: In-app video call interface
- **Contains**:
  - Video feed (remote)
  - Video feed (local, picture-in-picture)
  - Audio controls
  - Video controls
  - Screen share button
  - End call button
  - Participant list
  - Chat sidebar (optional)

---

## 3. Detailed Component Specifications

### 3.1 ConversationList Component

**Visual Design**:
```
┌────────────────────────────────┐
│ [🔍] Search conversations...   │
├────────────────────────────────┤
│ [Filter ▾] [Sort: Recent ▾]   │
├────────────────────────────────┤
│ ┌────────────────────────────┐ │
│ │ [👤] Sarah Johnson         │ │
│ │ I've reviewed your...   🔵 │ │
│ │ 10:30 AM                   │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ [👤] Mike Davis            │ │
│ │ Thanks for the feedback!   │ │
│ │ Yesterday                  │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │
│ │ [👤] Lisa Chen             │ │
│ │ When can we schedule...    │ │
│ │ Nov 5                      │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

**Props**:
```typescript
interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onSearch: (query: string) => void;
  onFilter: (filter: ConversationFilter) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore: () => void;
}
```

**State**:
- `searchQuery`: string
- `selectedFilter`: ConversationFilter
- `sortBy`: 'recent' | 'unread' | 'starred'

**Behavior**:
- Real-time updates when new messages arrive
- Highlight active conversation
- Show unread count badge
- Smooth scroll to load more
- Keyboard navigation support

**Responsive**:
- **Mobile**: Full width, slides in from left
- **Tablet**: Fixed sidebar (300px)
- **Desktop**: Fixed sidebar (320px)

**Real-time**:
- WebSocket connection for live updates
- Optimistic UI updates
- Auto-scroll to new messages
- Toast notification for new conversations

---

### 3.2 Message Component

**Visual Design**:
```
Sent message (right-aligned):
                    ┌─────────────────────────────┐
                    │ This is my message text    │
                    │ with multiple lines        │
                    └─────────────────────────────┘
                    Sent • 10:30 AM        ✓✓ Read

Received message (left-aligned):
[👤]
┌─────────────────────────────┐
│ This is a received message  │
│ from the other person       │
└─────────────────────────────┘
10:32 AM

Message with attachment:
[👤]
┌─────────────────────────────┐
│ Here's the document!        │
│ ┌───────────────────────┐   │
│ │ 📄 Resume_Final.pdf   │   │
│ │ 245 KB                │   │
│ │ [Download]            │   │
│ └───────────────────────┘   │
└─────────────────────────────┘
10:35 AM
```

**Props**:
```typescript
interface MessageProps {
  message: {
    id: string;
    senderId: string;
    text: string;
    timestamp: Date;
    attachments?: Attachment[];
    reactions?: Reaction[];
    readBy?: string[];
    editedAt?: Date;
  };
  currentUserId: string;
  sender: User;
  showAvatar: boolean;
  onReply: (messageId: string) => void;
  onEdit: (messageId: string, newText: string) => void;
  onDelete: (messageId: string) => void;
  onReact: (messageId: string, emoji: string) => void;
}
```

**Features**:
- **Rich Text**: Support for bold, italic, links, mentions
- **Markdown**: Optional markdown rendering
- **Code Blocks**: Syntax highlighted code snippets
- **Link Preview**: Automatic preview for URLs
- **Reactions**: Quick emoji reactions
- **Edit History**: Show edited indicator
- **Read Receipts**: Show who has read the message

**Interaction States**:
- Hover: Show action menu (reply, edit, delete, react)
- Long press (mobile): Open action sheet
- Double tap: Quick react
- Right click: Context menu

**Responsive**:
- **Mobile**: Max width 85% of screen
- **Tablet/Desktop**: Max width 600px
- Touch-friendly tap targets (44x44px minimum)

---

### 3.3 MessageComposer Component

**Visual Design**:
```
┌─────────────────────────────────────────────────────────┐
│ [B] [I] [Link] [Code]                     [Draft saved] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Type your message...                                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [📎] [😊] [@] [/]                    [Send] or Enter ⏎  │
└─────────────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface MessageComposerProps {
  conversationId: string;
  onSend: (message: NewMessage) => void;
  onTyping: (isTyping: boolean) => void;
  placeholder?: string;
  replyTo?: Message;
  maxLength?: number;
  allowAttachments?: boolean;
  allowRichText?: boolean;
}
```

**Features**:
- **Rich Text Editor**: TipTap or similar
- **Auto-save Draft**: Save to local storage every 2 seconds
- **File Upload**: Drag & drop or click to upload
- **Emoji Picker**: Radix UI Popover with emoji search
- **@ Mentions**: Auto-complete for participants
- **/ Commands**: Slash commands for quick actions
- **Keyboard Shortcuts**:
  - `Enter`: Send message
  - `Shift+Enter`: New line
  - `Cmd/Ctrl+B`: Bold
  - `Cmd/Ctrl+I`: Italic
  - `Cmd/Ctrl+K`: Add link
  - `Esc`: Cancel reply/edit

**State Management**:
```typescript
const [content, setContent] = useState('');
const [attachments, setAttachments] = useState<File[]>([]);
const [mentionSuggestions, setMentionSuggestions] = useState<User[]>([]);
const [isUploading, setIsUploading] = useState(false);
const [isDraftSaved, setIsDraftSaved] = useState(false);
```

**Validation**:
- Min length: 1 character
- Max length: 5000 characters
- File size limit: 10MB per file
- Allowed file types: Images, PDFs, Office docs
- Show character counter when approaching limit

**Responsive**:
- **Mobile**: Expands to comfortable typing size, toolbar collapses to icon row
- **Tablet/Desktop**: Fixed height with auto-expand, full toolbar visible

---

### 3.4 CommentsPanel Component

**Visual Design**:
```
┌─────────────────────────────────────────┐
│ Comments                          [✕]   │
├─────────────────────────────────────────┤
│ [All] [Unresolved (3)] [Resolved (5)]  │
│ [Sort: Newest ▾]                        │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [👤] Sarah Johnson    2 hours ago   │ │
│ │ "...experience in software..."      │ │
│ │                                     │ │
│ │ Consider rephrasing this section    │ │
│ │ to highlight your leadership...     │ │
│ │                                     │ │
│ │ [Reply] [Resolve]            [⋮]   │ │
│ │                                     │ │
│ │ ↳ [👤] You            1 hour ago    │ │
│ │   Great suggestion! I'll update...  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [👤] Sarah Johnson    5 hours ago   │ │
│ │ "...Stanford University..."         │ │
│ │                                     │ │
│ │ Add graduation year for clarity     │ │
│ │                                     │ │
│ │ [Reply] [Resolve]            [⋮]   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Props**:
```typescript
interface CommentsPanelProps {
  documentId: string;
  comments: CommentThread[];
  currentUserId: string;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (comment: NewComment) => void;
  onReply: (threadId: string, reply: string) => void;
  onResolve: (threadId: string) => void;
  onDelete: (commentId: string) => void;
  onNavigateToText: (threadId: string) => void;
}
```

**Features**:
- **Filter Tabs**: All, Unresolved, Resolved
- **Sort Options**: Newest, Oldest, Document position
- **Quoted Context**: Show the referenced text
- **Navigation**: Click to jump to commented text in document
- **Real-time**: Live updates when collaborators add comments
- **Threading**: Support nested replies
- **Resolution**: Mark threads as resolved/unresolved

**State**:
```typescript
const [activeFilter, setActiveFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');
const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'position'>('newest');
const [replyingToId, setReplyingToId] = useState<string | null>(null);
```

**Behavior**:
- Scroll to highlighted comment when user clicks inline indicator
- Auto-collapse resolved threads
- Show notification when new comments added
- Optimistic UI updates for immediate feedback

**Responsive**:
- **Mobile**: Full-screen modal overlay
- **Tablet**: Slide-in panel (400px)
- **Desktop**: Fixed sidebar panel (400px)

---

### 3.5 NotificationDropdown Component

**Visual Design**:
```
┌──────────────────────────────────────────────┐
│ Notifications                        [⚙️]    │
├──────────────────────────────────────────────┤
│ [Mark all as read]    [Filter ▾]            │
├──────────────────────────────────────────────┤
│ 🔵 💬 New message from Sarah Johnson         │
│    "I've reviewed your resume and have..."   │
│    2 minutes ago                             │
├──────────────────────────────────────────────┤
│ 💭 New comment on "Software Resume"          │
│    Sarah added a comment                     │
│    1 hour ago                                │
├──────────────────────────────────────────────┤
│ 📅 Meeting reminder                          │
│    Career coaching session in 30 minutes     │
│    Today at 2:00 PM          [Join] [Snooze] │
├──────────────────────────────────────────────┤
│ ✅ Resume updated                             │
│    Your changes have been saved              │
│    3 hours ago                               │
├──────────────────────────────────────────────┤
│ 🎯 New job match                             │
│    Senior Software Engineer at TechCorp      │
│    Yesterday                    [View] [Save] │
├──────────────────────────────────────────────┤
│ [View All Notifications →]                   │
└──────────────────────────────────────────────┘
```

**Props**:
```typescript
interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onNavigate: (notification: Notification) => void;
  onDismiss: (id: string) => void;
  maxVisible?: number; // Default: 5
}
```

**Notification Types**:
```typescript
type NotificationType = 
  | 'message'
  | 'comment'
  | 'mention'
  | 'meeting_reminder'
  | 'meeting_invitation'
  | 'document_shared'
  | 'document_updated'
  | 'job_match'
  | 'application_status'
  | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actions?: NotificationAction[];
  metadata?: Record<string, any>;
}
```

**Features**:
- **Grouped Notifications**: Group similar notifications
- **Action Buttons**: Quick actions (reply, view, dismiss)
- **Smart Truncation**: Truncate long messages with "..."
- **Real-time Updates**: WebSocket for instant delivery
- **Sound/Vibration**: Optional audio/haptic feedback
- **Badge Count**: Show unread count on bell icon

**Interaction**:
- Click notification → Navigate to source and mark as read
- Hover → Show preview/additional details
- Swipe (mobile) → Dismiss or mark as read
- Long press → Show action menu

**Responsive**:
- **Mobile**: Full width, 90% screen height max
- **Tablet/Desktop**: 400px width, max 600px height

---

### 3.6 CalendarView Component

**Visual Design (Month View)**:
```
┌────────────────────────────────────────────────────────────┐
│ Calendar                    [+ New Meeting]    [⚙️]        │
├────────────────────────────────────────────────────────────┤
│ [Day] [Week] [Month] [Agenda]    < November 2025 >   [⋮]  │
├────────────────────────────────────────────────────────────┤
│  Sun     Mon     Tue     Wed     Thu     Fri     Sat       │
├────────────────────────────────────────────────────────────┤
│                                       1       2       3     │
│                                                             │
│   4       5       6       7       8       9      10         │
│                                                             │
│  11      12      13      14      15      16      17         │
│         ┌────┐                                              │
│         │2:00│                                              │
│         │ PM │                                              │
│         └────┘                                              │
│                                                             │
│  18      19      20      21      22      23      24         │
│                ┌────┐                                       │
│                │3:30│                                       │
│                │ PM │                                       │
│                └────┘                                       │
│                                                             │
│  25      26      27      28      29      30                 │
└────────────────────────────────────────────────────────────┘
```

**Week View**:
```
┌────────────────────────────────────────────────────────────┐
│       Mon 11   Tue 12   Wed 13   Thu 14   Fri 15           │
├────────────────────────────────────────────────────────────┤
│ 8 AM                                                        │
│ 9 AM                                                        │
│10 AM          ┌──────────────┐                             │
│11 AM          │ Resume Review│                             │
│12 PM          │ with Sarah   │                             │
│ 1 PM          └──────────────┘                             │
│ 2 PM  ┌──────────────┐                                     │
│ 3 PM  │ Interview    │                                     │
│ 4 PM  │ Prep Session │                                     │
│ 5 PM  └──────────────┘                                     │
│ 6 PM                                                        │
└────────────────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface CalendarViewProps {
  view: 'day' | 'week' | 'month' | 'agenda';
  currentDate: Date;
  meetings: Meeting[];
  onViewChange: (view: CalendarView) => void;
  onDateChange: (date: Date) => void;
  onMeetingClick: (meeting: Meeting) => void;
  onCreateMeeting: (date: Date) => void;
  userTimeZone: string;
}
```

**Features**:
- **Multiple Views**: Day, Week, Month, Agenda
- **Drag & Drop**: Resize and move meetings
- **Color Coding**: Different colors for meeting types
- **Availability Overlay**: Show available/busy times
- **Time Zone Support**: Display times in user's timezone
- **Recurring Meetings**: Visual indicators for series
- **Conflict Detection**: Warning for overlapping meetings

**Navigation**:
- Previous/Next buttons
- Date picker for quick jump
- Today button to return to current date
- Keyboard shortcuts (arrow keys, 't' for today)

**Responsive**:
- **Mobile**: Agenda view by default, swipe between days
- **Tablet**: Week view, collapsible sidebar
- **Desktop**: Full month/week grid

---

### 3.7 MeetingScheduler Component

**Visual Design**:
```
┌────────────────────────────────────────────────┐
│ Schedule Meeting                         [✕]   │
├────────────────────────────────────────────────┤
│                                                │
│ Title *                                        │
│ ┌────────────────────────────────────────────┐ │
│ │ Career Coaching Session                    │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ Participants *                                 │
│ ┌────────────────────────────────────────────┐ │
│ │ [👤] Sarah Johnson (Coach)          [✕]   │ │
│ │ [+ Add participant]                        │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ Date & Time *                                  │
│ ┌──────────────────┐  ┌──────────────────────┐│
│ │ Nov 12, 2025  📅 │  │ 2:00 PM  🕐       ▾ ││
│ └──────────────────┘  └──────────────────────┘│
│                                                │
│ Duration *                                     │
│ ┌────────────────────────────────────────────┐ │
│ │ 60 minutes                              ▾  │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ Video Link                                     │
│ ┌────────────────────────────────────────────┐ │
│ │ [✓] Generate video link automatically      │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ Description                                    │
│ ┌────────────────────────────────────────────┐ │
│ │ We'll review your updated resume and...    │ │
│ │                                            │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ 🔁 Repeat                                      │
│ ┌────────────────────────────────────────────┐ │
│ │ Does not repeat                         ▾  │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ 🔔 Reminders                                   │
│ ┌────────────────────────────────────────────┐ │
│ │ [✓] 30 minutes before                      │ │
│ │ [✓] 1 day before                           │ │
│ └────────────────────────────────────────────┘ │
│                                                │
├────────────────────────────────────────────────┤
│              [Cancel]  [Schedule Meeting]      │
└────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface MeetingSchedulerProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (meeting: NewMeeting) => void;
  defaultDate?: Date;
  defaultParticipants?: User[];
  suggestedTimes?: Date[];
}
```

**Form Fields**:
```typescript
interface MeetingFormData {
  title: string;
  participants: User[];
  date: Date;
  duration: number; // minutes
  description?: string;
  videoLink?: string;
  recurring?: RecurringPattern;
  reminders: ReminderSetting[];
  timeZone: string;
}
```

**Features**:
- **Smart Scheduling**: Show available time slots
- **Participant Availability**: Check participant calendars
- **Auto Video Link**: Generate unique meeting link
- **Recurring Options**: Daily, weekly, monthly patterns
- **Reminder Settings**: Multiple reminder options
- **Time Zone Detection**: Auto-detect user timezone
- **Conflict Warning**: Alert for scheduling conflicts

**Validation**:
- Title: Required, max 200 characters
- Participants: At least 1 required
- Date: Must be future date
- Duration: 15-480 minutes (15 min to 8 hours)
- Description: Optional, max 5000 characters

**Responsive**:
- **Mobile**: Full-screen modal, single column
- **Tablet/Desktop**: Centered dialog, 600px width

---

### 3.8 VideoCallDialog Component

**Visual Design**:
```
┌────────────────────────────────────────────────────┐
│                                                    │
│         [Large Video Feed - Sarah Johnson]         │
│                                                    │
│                                                    │
│                                  ┌───────────────┐ │
│                                  │ [You]         │ │
│                                  │ (Picture in   │ │
│                                  │  Picture)     │ │
│                                  └───────────────┘ │
│                                                    │
│  Sarah Johnson                          00:15:23   │
│                                                    │
├────────────────────────────────────────────────────┤
│      [🎤] [🎥] [🖥️] [💬]    [🔴 End Call]        │
└────────────────────────────────────────────────────┘
```

**With Screen Share**:
```
┌────────────────────────────────────────────────────┐
│                                                    │
│     [Screen Share - Resume Document]               │
│                                                    │
│                                                    │
│  ┌────────┐  ┌────────┐                           │
│  │ Sarah  │  │  You   │                           │
│  │        │  │        │                           │
│  └────────┘  └────────┘                           │
│                                                    │
├────────────────────────────────────────────────────┤
│  [🎤] [🎥] [🖥️ Sharing] [💬]  [🔴 End Call]      │
└────────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface VideoCallDialogProps {
  meetingId: string;
  participants: User[];
  isOpen: boolean;
  onClose: () => void;
  onMuteToggle: (isMuted: boolean) => void;
  onVideoToggle: (isVideoOff: boolean) => void;
  onScreenShare: (isSharing: boolean) => void;
  videoService: 'integrated' | 'zoom' | 'teams' | 'meet';
}
```

**Features**:
- **Video Feeds**: Multiple participant support
- **Audio Controls**: Mute/unmute microphone
- **Video Controls**: Enable/disable camera
- **Screen Sharing**: Share entire screen or window
- **Chat Sidebar**: Text chat during call
- **Recording**: Optional call recording
- **Participant List**: Show all participants
- **Layout Options**: Grid, speaker, sidebar views
- **Network Quality**: Indicator for connection quality

**Controls**:
- Mic: Toggle audio on/off
- Camera: Toggle video on/off
- Screen Share: Start/stop sharing
- Chat: Toggle chat sidebar
- End Call: Hang up and close dialog

**Responsive**:
- **Mobile**: Full-screen, simplified controls
- **Tablet**: Full-screen with control bar
- **Desktop**: Flexible window, detachable

---

## 4. User Flows

### 4.1 Starting a New Conversation

**Actor**: Job Seeker or Coach

**Steps**:
1. Navigate to Messages page (`/messages`)
2. Click "+ New Message" button
3. Participant selector dialog opens
4. Search and select participant(s)
5. (Optional) Enter subject/title
6. Click "Start Conversation"
7. Conversation thread opens
8. Type first message in composer
9. Click Send or press Enter
10. Message appears in thread
11. Participant receives notification

**Success Criteria**:
- Conversation created in database
- Participant notified
- User can continue messaging
- Conversation appears in both users' lists

**Error Handling**:
- Network error: Show retry option, save draft
- Invalid participant: Show error message
- Empty message: Disable send button

**Edge Cases**:
- Starting conversation with blocked user
- User has too many active conversations
- Participant's messaging is disabled

---

### 4.2 Responding to Messages

**Actor**: Job Seeker or Coach

**Steps**:
1. Receive notification (push, email, or in-app)
2. Click notification to open conversation
3. Read new message(s)
4. (Optional) Review conversation history
5. Type response in message composer
6. (Optional) Attach file or add emoji
7. Click Send
8. Message sent and marked as read
9. Sender receives delivery confirmation
10. Typing indicator disappears

**Success Criteria**:
- Message delivered successfully
- Read receipt sent
- Sender sees message immediately (real-time)
- Conversation moved to top of list

**Optimistic Updates**:
- Show message immediately with "sending" indicator
- Update to "sent" when confirmed
- Retry automatically on failure

**Real-time Updates**:
- WebSocket updates for instant delivery
- Typing indicator shows when other user is typing
- Read receipts update in real-time

---

### 4.3 Commenting on Documents

**Actor**: Coach (primary), Job Seeker (secondary)

**Steps**:
1. Navigate to document editor (`/documents/:id`)
2. Select text to comment on
3. Click "Add Comment" button or right-click → "Comment"
4. Comment composer appears in sidebar
5. Type comment text
6. (Optional) @ mention document owner
7. Click "Post Comment"
8. Comment thread created
9. Highlight appears on selected text
10. Document owner receives notification

**For Replying to Comments**:
1. Open document with comments
2. Click on comment thread in sidebar
3. Click "Reply" button
4. Type reply
5. Click "Post Reply"
6. Reply added to thread
7. Original commenter notified

**For Resolving Comments**:
1. Review comment thread
2. Make requested changes to document
3. Click "Resolve" button on comment
4. Comment marked as resolved
5. Thread collapsed (optional filter)
6. All participants notified

**Success Criteria**:
- Comment visible to all collaborators
- Text selection preserved
- Notifications sent
- Real-time updates for active users

---

### 4.4 Scheduling a Meeting

**Actor**: Coach (initiator) or Job Seeker

**Steps**:
1. Navigate to Calendar page (`/calendar`)
2. Click "+ New Meeting" or click time slot
3. Meeting scheduler dialog opens
4. Fill in meeting details:
   - Title
   - Participants
   - Date & time
   - Duration
   - Description
5. (Optional) Enable video link generation
6. (Optional) Set recurring pattern
7. Set reminder preferences
8. Click "Schedule Meeting"
9. System checks for conflicts
10. Meeting created and saved
11. All participants notified
12. Calendar updated
13. Video link generated (if enabled)
14. Confirmation shown

**Alternative Flow - Find Available Time**:
1. Start scheduling meeting
2. Click "Find available time"
3. System analyzes participant calendars
4. Shows suggested time slots
5. Select preferred slot
6. Continue with scheduling

**Success Criteria**:
- Meeting appears on all participants' calendars
- Notifications sent to all participants
- Reminders scheduled
- Video link accessible

**Error Handling**:
- Scheduling conflict: Warn and show alternatives
- Participant unavailable: Suggest different times
- Network error: Save draft and retry

---

### 4.5 Managing Notifications

**Actor**: Any user

**Viewing Notifications**:
1. Click notification bell icon
2. Dropdown shows recent notifications (5 most recent)
3. Unread notifications highlighted
4. Click notification to navigate to source
5. Notification marked as read

**Notification Center**:
1. Click "View All Notifications"
2. Full page opens with all notifications
3. Use tabs to filter by type
4. Use search to find specific notifications
5. Bulk select for actions
6. Mark as read/unread
7. Delete notifications

**Managing Preferences**:
1. Click settings icon in notifications
2. Preferences dialog opens
3. Toggle notification types on/off
4. Set delivery methods (push, email, SMS)
5. Set quiet hours
6. Save preferences

**Success Criteria**:
- User can easily view and manage notifications
- Preferences persist across sessions
- Notifications delivered via selected channels
- No spam or excessive notifications

---

### 4.6 Joining a Video Call

**Actor**: Job Seeker or Coach

**From Meeting Reminder**:
1. Receive meeting reminder notification
2. Click "Join" button
3. Permission requests (camera, microphone)
4. Grant permissions
5. Video preview shown
6. Click "Join Meeting"
7. Enter video call interface
8. Connected to other participants

**From Calendar**:
1. Navigate to Calendar
2. Click on meeting event
3. Meeting details shown
4. Click "Join Video Call"
5. Permission requests
6. Grant permissions
7. Join call

**During Call**:
1. Control audio/video
2. Share screen if needed
3. Use chat for text messages
4. End call when finished

**Success Criteria**:
- Smooth connection with minimal latency
- Clear audio and video quality
- All controls responsive
- Graceful error handling for connection issues

---

## 5. Data Requirements

### 5.1 Message Data Structure

```typescript
interface Conversation {
  id: string;
  participants: User[];
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: Message;
  unreadCount: Record<string, number>; // userId -> count
  metadata: {
    isGroup: boolean;
    subject?: string;
    isPinned?: boolean;
  };
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  richText?: JSONContent; // TipTap/ProseMirror format
  timestamp: Date;
  editedAt?: Date;
  attachments: Attachment[];
  reactions: Reaction[];
  readBy: ReadReceipt[];
  replyTo?: string; // Parent message ID
  metadata: {
    isDeleted: boolean;
    isSystemMessage: boolean;
  };
}

interface Attachment {
  id: string;
  name: string;
  type: string; // MIME type
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
}

interface Reaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

interface ReadReceipt {
  userId: string;
  readAt: Date;
}

interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}
```

---

### 5.2 Comment Data Structure

```typescript
interface CommentThread {
  id: string;
  documentId: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  quotedText: string; // The text being commented on
  selection: TextSelection; // Start/end positions
  replies: Comment[];
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

interface Comment {
  id: string;
  threadId: string;
  authorId: string;
  text: string;
  createdAt: Date;
  editedAt?: Date;
  reactions: Reaction[];
}

interface TextSelection {
  start: number;
  end: number;
  anchorNode?: string;
  focusNode?: string;
}
```

---

### 5.3 Notification Data Structure

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  readAt?: Date;
  actionUrl?: string;
  actions: NotificationAction[];
  metadata: Record<string, any>;
  groupId?: string; // For grouping similar notifications
}

type NotificationType = 
  | 'message'
  | 'comment'
  | 'mention'
  | 'meeting_reminder'
  | 'meeting_invitation'
  | 'meeting_updated'
  | 'meeting_cancelled'
  | 'document_shared'
  | 'document_updated'
  | 'document_comment'
  | 'job_match'
  | 'application_status'
  | 'coach_assignment'
  | 'system';

interface NotificationAction {
  label: string;
  action: string;
  url?: string;
  handler?: string;
}

interface NotificationPreferences {
  userId: string;
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  types: Record<NotificationType, boolean>;
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM
    end: string; // HH:MM
    timezone: string;
  };
}
```

---

### 5.4 Meeting/Calendar Data Structure

```typescript
interface Meeting {
  id: string;
  title: string;
  description?: string;
  organizerId: string;
  participants: Participant[];
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  timeZone: string;
  location?: string;
  videoLink?: string;
  status: MeetingStatus;
  recurring?: RecurringPattern;
  reminders: ReminderSetting[];
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

interface Participant {
  userId: string;
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
  isOptional: boolean;
  respondedAt?: Date;
}

type MeetingStatus = 
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  endDate?: Date;
  occurrences?: number;
}

interface ReminderSetting {
  method: 'email' | 'push' | 'sms';
  minutesBefore: number;
}

interface Availability {
  userId: string;
  slots: AvailabilitySlot[];
  timezone: string;
  updatedAt: Date;
}

interface AvailabilitySlot {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
}
```

---

### 5.5 User Data (relevant fields)

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'job_seeker' | 'coach' | 'admin';
  profile: {
    title?: string;
    bio?: string;
    timezone: string;
    language: string;
  };
  settings: {
    notifications: NotificationPreferences;
    availability: Availability;
    videoCallPreferences: {
      defaultMuted: boolean;
      defaultVideoOff: boolean;
      preferredService: 'integrated' | 'zoom' | 'teams' | 'meet';
    };
  };
  status: {
    online: boolean;
    lastSeen: Date;
    currentActivity?: string;
  };
}
```

---

## 6. File Structure

### 6.1 Component Organization

```
src/
├── components/
│   ├── messaging/
│   │   ├── ConversationList.tsx
│   │   ├── ConversationItem.tsx
│   │   ├── ConversationThread.tsx
│   │   ├── Message.tsx
│   │   ├── MessageComposer.tsx
│   │   ├── MessageAttachment.tsx
│   │   ├── MessageReactions.tsx
│   │   ├── TypingIndicator.tsx
│   │   ├── ReadReceipts.tsx
│   │   └── index.ts
│   │
│   ├── comments/
│   │   ├── CommentsPanel.tsx
│   │   ├── CommentThread.tsx
│   │   ├── Comment.tsx
│   │   ├── CommentComposer.tsx
│   │   ├── InlineCommentIndicator.tsx
│   │   ├── CommentHighlight.tsx
│   │   └── index.ts
│   │
│   ├── notifications/
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationDropdown.tsx
│   │   ├── NotificationItem.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── NotificationPreferences.tsx
│   │   └── index.ts
│   │
│   ├── calendar/
│   │   ├── CalendarView.tsx
│   │   ├── CalendarGrid.tsx
│   │   ├── DayView.tsx
│   │   ├── WeekView.tsx
│   │   ├── MonthView.tsx
│   │   ├── AgendaView.tsx
│   │   ├── MeetingBlock.tsx
│   │   ├── MeetingScheduler.tsx
│   │   ├── MeetingDetails.tsx
│   │   ├── AvailabilitySelector.tsx
│   │   ├── TimeSlotPicker.tsx
│   │   └── index.ts
│   │
│   ├── video-call/
│   │   ├── VideoCallDialog.tsx
│   │   ├── VideoFeed.tsx
│   │   ├── VideoControls.tsx
│   │   ├── ScreenShare.tsx
│   │   ├── ParticipantList.tsx
│   │   ├── CallChat.tsx
│   │   └── index.ts
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Dialog.tsx
│       ├── Dropdown.tsx
│       ├── Avatar.tsx
│       ├── Badge.tsx
│       ├── ScrollArea.tsx
│       ├── Tooltip.tsx
│       └── ... (other Radix UI components)
│
├── pages/
│   ├── MessagesPage.tsx
│   ├── NotificationsPage.tsx
│   ├── CalendarPage.tsx
│   └── ...
│
├── hooks/
│   ├── useConversations.ts
│   ├── useMessages.ts
│   ├── useComments.ts
│   ├── useNotifications.ts
│   ├── useMeetings.ts
│   ├── useWebSocket.ts
│   ├── useTypingIndicator.ts
│   ├── useReadReceipts.ts
│   ├── usePresence.ts
│   └── ...
│
├── lib/
│   ├── api/
│   │   ├── messages.ts
│   │   ├── comments.ts
│   │   ├── notifications.ts
│   │   ├── meetings.ts
│   │   └── ...
│   │
│   ├── websocket/
│   │   ├── client.ts
│   │   ├── handlers.ts
│   │   └── types.ts
│   │
│   ├── utils/
│   │   ├── date-formatting.ts
│   │   ├── text-formatting.ts
│   │   ├── file-upload.ts
│   │   ├── notification-helpers.ts
│   │   └── ...
│   │
│   └── constants/
│       ├── notification-types.ts
│       ├── meeting-durations.ts
│       └── ...
│
├── types/
│   ├── messaging.ts
│   ├── comments.ts
│   ├── notifications.ts
│   ├── calendar.ts
│   └── ...
│
└── styles/
    ├── messaging.css
    ├── comments.css
    └── ...
```

---

### 6.2 State Management

**Using React Context + Hooks**:

```typescript
// contexts/MessagingContext.tsx
export const MessagingProvider = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  
  // WebSocket connection
  useWebSocket({
    onMessage: handleNewMessage,
    onTyping: handleTypingIndicator,
    onRead: handleReadReceipt,
  });
  
  return (
    <MessagingContext.Provider value={{ ... }}>
      {children}
    </MessagingContext.Provider>
  );
};

// contexts/NotificationsContext.tsx
export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useWebSocket({
    onNotification: handleNewNotification,
  });
  
  return (
    <NotificationsContext.Provider value={{ ... }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// contexts/CalendarContext.tsx
export const CalendarProvider = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [availability, setAvailability] = useState<Availability | null>(null);
  
  return (
    <CalendarContext.Provider value={{ ... }}>
      {children}
    </CalendarContext.Provider>
  );
};
```

**Alternative: Using React Query / TanStack Query**:

```typescript
// Already in package.json: @tanstack/react-query

// hooks/useConversations.ts
export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
    refetchInterval: 30000, // Refetch every 30s
  });
};

// hooks/useMessages.ts
export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId,
  });
};

// hooks/useSendMessage.ts
export const useSendMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data, variables) => {
      // Optimistic update
      queryClient.setQueryData(['messages', variables.conversationId], (old) => {
        return [...old, data];
      });
    },
  });
};
```

---

## 7. Real-time Integration

### 7.1 WebSocket Architecture

**Connection Management**:
```typescript
// lib/websocket/client.ts

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // ms
  
  connect(userId: string, token: string) {
    const wsUrl = `${WS_BASE_URL}?userId=${userId}&token=${token}`;
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = this.handleOpen;
    this.ws.onmessage = this.handleMessage;
    this.ws.onerror = this.handleError;
    this.ws.onclose = this.handleClose;
  }
  
  private handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    
    switch (data.type) {
      case 'message':
        this.handlers.onMessage(data.payload);
        break;
      case 'typing':
        this.handlers.onTyping(data.payload);
        break;
      case 'read':
        this.handlers.onRead(data.payload);
        break;
      case 'notification':
        this.handlers.onNotification(data.payload);
        break;
      case 'comment':
        this.handlers.onComment(data.payload);
        break;
      case 'meeting_updated':
        this.handlers.onMeetingUpdate(data.payload);
        break;
      case 'presence':
        this.handlers.onPresence(data.payload);
        break;
    }
  };
  
  send(type: string, payload: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }
  
  private reconnect = () => {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, this.reconnectDelay * Math.pow(2, this.reconnectAttempts));
    }
  };
}
```

---

### 7.2 Real-time Events

**Message Events**:
```typescript
// New message received
{
  type: 'message',
  payload: {
    conversationId: string;
    message: Message;
  }
}

// Typing indicator
{
  type: 'typing',
  payload: {
    conversationId: string;
    userId: string;
    isTyping: boolean;
  }
}

// Read receipt
{
  type: 'read',
  payload: {
    conversationId: string;
    messageId: string;
    userId: string;
    readAt: Date;
  }
}
```

**Comment Events**:
```typescript
// New comment
{
  type: 'comment',
  payload: {
    documentId: string;
    thread: CommentThread;
  }
}

// Comment resolved
{
  type: 'comment_resolved',
  payload: {
    documentId: string;
    threadId: string;
    resolvedBy: string;
  }
}
```

**Notification Events**:
```typescript
{
  type: 'notification',
  payload: {
    notification: Notification;
  }
}
```

**Presence Events**:
```typescript
{
  type: 'presence',
  payload: {
    userId: string;
    status: 'online' | 'offline' | 'away';
    lastSeen: Date;
  }
}
```

---

### 7.3 Optimistic Updates

**Message Sending**:
```typescript
const sendMessage = async (text: string) => {
  // 1. Create optimistic message
  const optimisticMessage: Message = {
    id: `temp-${Date.now()}`,
    conversationId,
    senderId: currentUser.id,
    text,
    timestamp: new Date(),
    status: 'sending',
    // ...
  };
  
  // 2. Update UI immediately
  setMessages(prev => [...prev, optimisticMessage]);
  
  try {
    // 3. Send to server
    const sentMessage = await api.sendMessage(optimisticMessage);
    
    // 4. Replace optimistic message with real one
    setMessages(prev => 
      prev.map(m => m.id === optimisticMessage.id ? sentMessage : m)
    );
  } catch (error) {
    // 5. Mark as failed
    setMessages(prev => 
      prev.map(m => 
        m.id === optimisticMessage.id 
          ? { ...m, status: 'failed' } 
          : m
      )
    );
  }
};
```

---

### 7.4 Offline Support

**Message Queue**:
```typescript
// lib/offline/message-queue.ts

class MessageQueue {
  private queue: QueuedMessage[] = [];
  
  constructor() {
    this.loadFromStorage();
    window.addEventListener('online', this.processQueue);
  }
  
  add(message: Message) {
    this.queue.push({
      message,
      attempts: 0,
      queuedAt: new Date(),
    });
    this.saveToStorage();
  }
  
  private async processQueue() {
    while (this.queue.length > 0) {
      const item = this.queue[0];
      
      try {
        await api.sendMessage(item.message);
        this.queue.shift();
        this.saveToStorage();
      } catch (error) {
        item.attempts++;
        if (item.attempts >= 3) {
          // Remove failed message
          this.queue.shift();
        }
        break;
      }
    }
  }
  
  private saveToStorage() {
    localStorage.setItem('messageQueue', JSON.stringify(this.queue));
  }
  
  private loadFromStorage() {
    const stored = localStorage.getItem('messageQueue');
    if (stored) {
      this.queue = JSON.parse(stored);
    }
  }
}
```

---

## 8. Accessibility Considerations

### 8.1 Keyboard Navigation

**Message List**:
- `Tab`: Navigate between conversations
- `Enter`: Open selected conversation
- `↑/↓`: Navigate within conversation list
- `/`: Focus search box

**Message Thread**:
- `Tab`: Navigate between messages
- `Enter`: Open message actions menu
- `Shift+Tab`: Navigate backwards
- `Esc`: Close composer/cancel edit

**Composer**:
- `Enter`: Send message (configurable)
- `Shift+Enter`: New line
- `Esc`: Cancel edit/reply
- `Ctrl+B`: Bold
- `Ctrl+I`: Italic

**Calendar**:
- `←/→`: Previous/next day
- `↑/↓`: Previous/next week
- `Page Up/Down`: Previous/next month
- `T`: Jump to today
- `N`: New meeting

---

### 8.2 Screen Reader Support

**ARIA Labels**:
```tsx
<button 
  aria-label={`Send message to ${recipient.name}`}
  aria-describedby="send-button-hint"
>
  Send
</button>

<div 
  role="region" 
  aria-label="Conversation thread"
  aria-live="polite"
  aria-relevant="additions"
>
  {messages.map(message => (
    <Message 
      key={message.id}
      aria-label={`Message from ${message.sender.name} at ${formatTime(message.timestamp)}`}
      {...message}
    />
  ))}
</div>
```

**Live Regions**:
```tsx
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
  className="sr-only"
>
  {typingUsers.length > 0 && (
    `${typingUsers.join(', ')} ${typingUsers.length === 1 ? 'is' : 'are'} typing...`
  )}
</div>

<div 
  role="alert" 
  aria-live="assertive" 
  className="sr-only"
>
  {newMessageCount > 0 && (
    `${newMessageCount} new ${newMessageCount === 1 ? 'message' : 'messages'}`
  )}
</div>
```

---

### 8.3 Focus Management

**Modal Dialogs**:
```tsx
const MeetingScheduler = ({ isOpen, onClose }) => {
  const firstInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      // Focus first input when dialog opens
      firstInputRef.current?.focus();
      
      // Trap focus within dialog
      const handleTab = (e: KeyboardEvent) => {
        // Focus trap implementation
      };
      
      document.addEventListener('keydown', handleTab);
      return () => document.removeEventListener('keydown', handleTab);
    }
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <Input ref={firstInputRef} label="Meeting title" />
        {/* ... */}
      </DialogContent>
    </Dialog>
  );
};
```

---

### 8.4 Color Contrast

**Ensuring WCAG AA Compliance**:
- Text on background: Minimum 4.5:1 contrast ratio
- Large text (18pt+): Minimum 3:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio

**Status Colors**:
```css
/* High contrast status indicators */
.status-online {
  background-color: #16a34a; /* Green with 4.5:1 contrast */
}

.status-away {
  background-color: #f59e0b; /* Amber with 4.5:1 contrast */
}

.status-offline {
  background-color: #6b7280; /* Gray with 4.5:1 contrast */
}

.unread-badge {
  background-color: #dc2626; /* Red with 4.5:1 contrast */
  color: #ffffff;
}
```

---

### 8.5 Reduced Motion

**Respecting User Preferences**:
```css
/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// In components
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
>
  {content}
</motion.div>
```

---

## 9. Performance Optimizations

### 9.1 Virtual Scrolling

**For Long Message Lists**:
```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const MessageList = ({ messages }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated row height
    overscan: 5, // Render 5 extra items
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <Message message={messages[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

### 9.2 Lazy Loading

**Code Splitting**:
```tsx
// Lazy load heavy components
const VideoCallDialog = lazy(() => import('./VideoCallDialog'));
const CalendarView = lazy(() => import('./CalendarView'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <VideoCallDialog />
</Suspense>
```

**Image Lazy Loading**:
```tsx
<img 
  src={avatar} 
  loading="lazy" 
  alt={user.name}
/>
```

---

### 9.3 Debouncing & Throttling

**Typing Indicator**:
```tsx
import { useDebouncedCallback } from 'use-debounce';

const MessageComposer = () => {
  const sendTypingIndicator = useDebouncedCallback(
    (isTyping: boolean) => {
      ws.send('typing', { conversationId, isTyping });
    },
    500 // 500ms delay
  );
  
  const handleChange = (value: string) => {
    setMessage(value);
    sendTypingIndicator(value.length > 0);
  };
};
```

**Scroll Events**:
```tsx
import { throttle } from 'lodash';

const handleScroll = throttle(() => {
  // Load more messages when near top
  if (scrollTop < 100 && hasMore) {
    loadMoreMessages();
  }
}, 200);
```

---

### 9.4 Memoization

**Expensive Calculations**:
```tsx
const ConversationList = ({ conversations }) => {
  // Memoize filtered/sorted conversations
  const filteredConversations = useMemo(() => {
    return conversations
      .filter(c => c.lastMessage?.text.includes(searchQuery))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [conversations, searchQuery]);
  
  return (
    <>
      {filteredConversations.map(conversation => (
        <ConversationItem key={conversation.id} {...conversation} />
      ))}
    </>
  );
};

// Memoize components that rarely change
const ConversationItem = memo(({ conversation }) => {
  return <div>{/* ... */}</div>;
});
```

---

## 10. Security Considerations

### 10.1 Input Sanitization

**Prevent XSS Attacks**:
```tsx
import DOMPurify from 'dompurify';

const sanitizeMessage = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title'],
  });
};

<div dangerouslySetInnerHTML={{ 
  __html: sanitizeMessage(message.richText) 
}} />
```

---

### 10.2 File Upload Validation

**Restrict File Types & Sizes**:
```tsx
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const validateFile = (file: File) => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('File type not allowed');
  }
  
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large (max 10MB)');
  }
  
  return true;
};
```

---

### 10.3 Rate Limiting

**Client-side Rate Limiting**:
```tsx
class RateLimiter {
  private requests: number[] = [];
  private limit: number;
  private window: number;
  
  constructor(limit: number, window: number) {
    this.limit = limit;
    this.window = window;
  }
  
  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.window);
    
    if (this.requests.length < this.limit) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }
}

const messageLimiter = new RateLimiter(10, 60000); // 10 messages per minute

const sendMessage = () => {
  if (!messageLimiter.canMakeRequest()) {
    toast.error('Too many messages. Please wait a moment.');
    return;
  }
  
  // Send message...
};
```

---

## 11. Testing Strategy

### 11.1 Unit Tests

**Component Testing**:
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MessageComposer } from './MessageComposer';

describe('MessageComposer', () => {
  it('sends message on Enter key', () => {
    const onSend = jest.fn();
    render(<MessageComposer onSend={onSend} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello!' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    
    expect(onSend).toHaveBeenCalledWith('Hello!');
  });
  
  it('creates new line on Shift+Enter', () => {
    render(<MessageComposer onSend={jest.fn()} />);
    
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Line 1' } });
    fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });
    
    expect(input.value).toContain('\n');
  });
});
```

---

### 11.2 Integration Tests

**Message Flow**:
```tsx
describe('Messaging Flow', () => {
  it('sends and receives messages', async () => {
    const { user: sender } = renderWithAuth(<MessagesPage />);
    const { user: receiver } = renderWithAuth(<MessagesPage />);
    
    // Sender starts conversation
    fireEvent.click(screen.getByText('+ New Message'));
    fireEvent.change(screen.getByPlaceholderText('Search...'), {
      target: { value: 'Receiver' },
    });
    fireEvent.click(screen.getByText('Receiver User'));
    
    // Sender types and sends message
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello!' } });
    fireEvent.click(screen.getByText('Send'));
    
    // Receiver should see message
    await waitFor(() => {
      expect(receiver.screen.getByText('Hello!')).toBeInTheDocument();
    });
  });
});
```

---

### 11.3 E2E Tests

**Using Playwright/Cypress**:
```typescript
describe('Meeting Scheduling', () => {
  it('schedules a meeting successfully', () => {
    cy.login('coach@careersu.com', 'coach123');
    cy.visit('/calendar');
    
    cy.contains('+ New Meeting').click();
    cy.get('[name="title"]').type('Resume Review Session');
    cy.get('[name="participants"]').type('John Doe');
    cy.get('[role="option"]').contains('John Doe').click();
    cy.get('[name="date"]').type('2025-11-15');
    cy.get('[name="time"]').type('14:00');
    cy.get('button').contains('Schedule Meeting').click();
    
    cy.contains('Meeting scheduled successfully').should('be.visible');
    cy.contains('Resume Review Session').should('be.visible');
  });
});
```

---

## 12. Implementation Phases

### Phase 1: Core Messaging (Week 1-2)
- ✅ Basic conversation list
- ✅ Message thread view
- ✅ Message composer
- ✅ Real-time message delivery
- ✅ Read receipts
- ✅ File attachments

### Phase 2: Comments & Notifications (Week 3)
- ✅ Document comments panel
- ✅ Comment threads
- ✅ Notification system
- ✅ Notification preferences

### Phase 3: Calendar & Scheduling (Week 4)
- ✅ Calendar views
- ✅ Meeting scheduler
- ✅ Availability management
- ✅ Meeting reminders

### Phase 4: Video Calls (Week 5)
- ✅ Video call integration
- ✅ Screen sharing
- ✅ In-call chat

### Phase 5: Polish & Optimization (Week 6)
- ✅ Performance optimizations
- ✅ Accessibility improvements
- ✅ Testing
- ✅ Documentation

---

## 13. Dependencies & Libraries

### Required NPM Packages

**Already in package.json**:
- `react` - Core React library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing
- `@radix-ui/*` - UI components
- `lucide-react` - Icons
- `date-fns` - Date formatting
- `tailwindcss` - Styling
- `sonner` - Toast notifications

**Additional packages needed**:
```json
{
  "dependencies": {
    "@tiptap/react": "^2.1.13",
    "@tiptap/starter-kit": "^2.1.13",
    "@tanstack/react-virtual": "^3.0.0",
    "dompurify": "^3.0.6",
    "@types/dompurify": "^3.0.5",
    "socket.io-client": "^4.5.4",
    "emoji-picker-react": "^4.5.16",
    "react-dropzone": "^14.2.3"
  }
}
```

---

## 14. API Endpoints

### Messaging API
```
GET    /api/conversations              - List conversations
POST   /api/conversations              - Create conversation
GET    /api/conversations/:id          - Get conversation details
GET    /api/conversations/:id/messages - Get messages
POST   /api/conversations/:id/messages - Send message
PUT    /api/messages/:id               - Edit message
DELETE /api/messages/:id               - Delete message
POST   /api/messages/:id/reactions     - Add reaction
POST   /api/messages/:id/read          - Mark as read
```

### Comments API
```
GET    /api/documents/:id/comments     - Get document comments
POST   /api/documents/:id/comments     - Add comment
POST   /api/comments/:id/replies       - Add reply
PUT    /api/comments/:id               - Edit comment
DELETE /api/comments/:id               - Delete comment
POST   /api/comments/:id/resolve       - Resolve comment
```

### Notifications API
```
GET    /api/notifications              - Get notifications
PUT    /api/notifications/:id/read     - Mark as read
POST   /api/notifications/read-all     - Mark all as read
DELETE /api/notifications/:id          - Delete notification
GET    /api/notifications/preferences  - Get preferences
PUT    /api/notifications/preferences  - Update preferences
```

### Calendar API
```
GET    /api/meetings                   - List meetings
POST   /api/meetings                   - Create meeting
GET    /api/meetings/:id               - Get meeting details
PUT    /api/meetings/:id               - Update meeting
DELETE /api/meetings/:id               - Cancel meeting
POST   /api/meetings/:id/respond       - Accept/decline invitation
GET    /api/availability/:userId       - Get user availability
PUT    /api/availability               - Update availability
```

### WebSocket Events
```
WS     /ws                             - WebSocket connection
```

---

## 15. Conclusion

This comprehensive UI plan provides a complete blueprint for implementing the Collaboration and Messaging features in the CareerSU platform. The plan covers:

- **Detailed screen layouts** for all major views
- **Component specifications** with props, state, and behavior
- **User flows** for all key interactions
- **Data structures** for API integration
- **File organization** for maintainable code
- **Real-time integration** with WebSockets
- **Accessibility** for inclusive design
- **Performance optimizations** for smooth UX
- **Security considerations** for safe operations
- **Testing strategy** for quality assurance

### Next Steps

1. **Review & Approval**: Share this plan with stakeholders
2. **Set Up Project**: Install dependencies and configure tools
3. **Create Base Components**: Start with UI primitives
4. **Implement Phase 1**: Build core messaging functionality
5. **Iterate**: Gather feedback and refine implementation

### Success Metrics

- **User Engagement**: Track message frequency and response times
- **Feature Adoption**: Monitor usage of comments, calendar, video calls
- **Performance**: Measure load times and real-time latency
- **Accessibility**: Test with screen readers and keyboard navigation
- **User Satisfaction**: Collect feedback through surveys

---

**Document prepared by**: Claude Code Agent  
**For**: CareerSU Platform Development Team  
**Date**: November 7, 2025
