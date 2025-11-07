# AI Chat & Career Assistant - Comprehensive UI Plan

## Document Overview

**Project**: CareerSU AI Chat & Career Assistant Interface  
**Version**: 1.0.0  
**Last Updated**: November 7, 2025  
**Technology Stack**: React 18.3.1, TypeScript, Vite, Tailwind CSS, Radix UI, Lucide Icons  
**Backend**: Convex with real-time capabilities  
**Author**: Verridian AI Team

---

## Table of Contents

1. [Screen Inventory](#1-screen-inventory)
2. [Component Breakdown](#2-component-breakdown)
3. [Detailed Component Specifications](#3-detailed-component-specifications)
4. [User Flows](#4-user-flows)
5. [Data Requirements](#5-data-requirements)
6. [File Structure](#6-file-structure)
7. [Responsive Design](#7-responsive-design)
8. [Accessibility Considerations](#8-accessibility-considerations)
9. [Performance Optimization](#9-performance-optimization)
10. [Integration Points](#10-integration-points)

---

## 1. Screen Inventory

### 1.1 Main Chat Interface Page (`/chat`)
**Purpose**: Primary AI conversation interface for career assistance  
**Route**: `/chat` or `/assistant`  
**Access**: Authenticated users (both Job Seekers and Career Coaches)

**Layout Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│  [Header/Navigation]                                        │
├─────────────────┬───────────────────────────────────────────┤
│                 │                                           │
│  Conversation   │         Main Chat Area                    │
│  History        │                                           │
│  Sidebar        │  • Welcome State / Conversation           │
│  (Collapsible)  │  • Message Stream                         │
│                 │  • Suggested Prompts                      │
│                 │  • Quick Actions                          │
│                 │                                           │
│                 ├───────────────────────────────────────────┤
│                 │  Input Area (Fixed Bottom)                │
│                 │  • Text Input + Attachments + Send        │
└─────────────────┴───────────────────────────────────────────┘
```

**Viewport Breakpoints**:
- Desktop: 1024px+ (Two-column with sidebar)
- Tablet: 768px-1023px (Sidebar toggleable)
- Mobile: <768px (Sidebar as drawer overlay)

### 1.2 Quick Actions Panel
**Purpose**: Contextual career assistance shortcuts  
**Location**: Embedded in main chat interface  
**Display**: Grid of actionable cards

**Quick Action Categories**:
- Resume Review & Optimization
- Interview Preparation
- Career Advice & Planning
- Job Search Strategy
- Skill Gap Analysis
- Salary Negotiation Tips
- Cover Letter Writing
- LinkedIn Profile Optimization

### 1.3 Conversation History Sidebar
**Purpose**: Access to past conversations and chat sessions  
**Features**:
- Chronologically organized conversations
- Search functionality
- Star/Pin important chats
- Delete conversations
- New conversation button

### 1.4 Suggested Prompts Interface
**Purpose**: Help users get started with effective queries  
**Display**: Carousel or grid of prompt cards  
**Context**: Shows when chat is empty or user is inactive

### 1.5 Document Upload & Review Modal
**Purpose**: Upload resumes, cover letters, or job descriptions for AI analysis  
**Type**: Modal dialog overlay  
**Supported Formats**: PDF, DOCX, TXT

---

## 2. Component Breakdown

### 2.1 Layout Components

#### 2.1.1 ChatLayout
**File**: `src/components/chat/ChatLayout.tsx`

**Responsibilities**:
- Main layout container for chat interface
- Manages sidebar visibility state
- Responsive breakpoint handling
- Keyboard shortcuts

**Structure**:
```tsx
<ChatLayout>
  <ChatSidebar />
  <ChatMainArea>
    <ChatHeader />
    <ChatMessagesArea />
    <ChatInputArea />
  </ChatMainArea>
</ChatLayout>
```

**Props**:
```typescript
interface ChatLayoutProps {
  initialSidebarOpen?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

#### 2.1.2 ChatSidebar
**File**: `src/components/chat/ChatSidebar.tsx`

**Features**:
- Conversation list with infinite scroll
- Search conversations
- Filter by date/topic
- New chat button
- User settings access

**Components**:
- `ConversationList`
- `ConversationItem`
- `SearchBar`
- `NewChatButton`

**Props**:
```typescript
interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  className?: string;
}
```

#### 2.1.3 ChatHeader
**File**: `src/components/chat/ChatHeader.tsx`

**Elements**:
- Sidebar toggle button (mobile)
- Current conversation title (editable)
- Conversation actions (rename, delete, share)
- Export conversation button
- Settings dropdown

**Props**:
```typescript
interface ChatHeaderProps {
  conversationTitle?: string;
  onToggleSidebar?: () => void;
  onRenameConversation?: (newTitle: string) => void;
  onDeleteConversation?: () => void;
  onExportConversation?: () => void;
  showSidebarToggle?: boolean;
}
```

### 2.2 Message Components

#### 2.2.1 ChatMessagesArea
**File**: `src/components/chat/ChatMessagesArea.tsx`

**Responsibilities**:
- Scrollable message container
- Auto-scroll to bottom on new messages
- Virtualized rendering for performance
- Loading states
- Empty state with welcome screen

**Features**:
- Infinite scroll for history
- Message grouping by timestamp
- Scroll-to-bottom button
- Typing indicators

**Props**:
```typescript
interface ChatMessagesAreaProps {
  messages: Message[];
  isLoading?: boolean;
  isEmpty?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  conversationId?: string;
}
```

#### 2.2.2 MessageBubble
**File**: `src/components/chat/MessageBubble.tsx`

**Variants**:
- User messages (right-aligned, blue background)
- AI messages (left-aligned, gray background)
- System messages (centered, subtle)

**Features**:
- Markdown rendering
- Code syntax highlighting
- Copy message button
- Timestamp
- Edit message (user only)
- Regenerate response (AI only)
- Feedback buttons (thumbs up/down)

**Props**:
```typescript
interface MessageBubbleProps {
  message: Message;
  type: 'user' | 'ai' | 'system';
  isStreaming?: boolean;
  onEdit?: (messageId: string, newContent: string) => void;
  onRegenerate?: (messageId: string) => void;
  onFeedback?: (messageId: string, feedback: 'positive' | 'negative') => void;
  showAvatar?: boolean;
  className?: string;
}
```

**Visual Design**:
```
User Message:
┌─────────────────────────────────────────┐
│  How can I improve my resume?      👤   │
│  [timestamp]                            │
└─────────────────────────────────────────┘

AI Message:
┌─────────────────────────────────────────┐
│ 🤖                                      │
│  I'd be happy to help improve your      │
│  resume! Here are key recommendations:  │
│                                         │
│  1. **Summary Section**                 │
│     - Focus on achievements...          │
│                                         │
│  [Copy] [Regenerate] [👍] [👎]         │
│  [timestamp]                            │
└─────────────────────────────────────────┘
```

#### 2.2.3 MessageContent
**File**: `src/components/chat/MessageContent.tsx`

**Rendering Capabilities**:
- **Markdown**: Headers, lists, links, emphasis
- **Code Blocks**: Syntax highlighting with language detection
- **Tables**: Formatted data tables
- **Blockquotes**: Highlighted quotes
- **Links**: Auto-detection and safe rendering
- **Images**: Inline image support (if sent by AI)
- **Lists**: Bullet and numbered lists

**Props**:
```typescript
interface MessageContentProps {
  content: string;
  format?: 'text' | 'markdown' | 'html';
  isStreaming?: boolean;
  className?: string;
}
```

**Libraries**:
- `react-markdown` for markdown parsing
- `react-syntax-highlighter` for code highlighting
- `rehype-sanitize` for XSS protection

#### 2.2.4 StreamingIndicator
**File**: `src/components/chat/StreamingIndicator.tsx`

**Purpose**: Show AI is typing/generating response

**Visual**:
```
🤖 AI is typing...
   ⚫ ⚫ ⚫  (animated dots)
```

**Props**:
```typescript
interface StreamingIndicatorProps {
  show: boolean;
  message?: string;
  className?: string;
}
```

### 2.3 Input Components

#### 2.3.1 ChatInputArea
**File**: `src/components/chat/ChatInputArea.tsx`

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  [Attach] [📎]                                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │ Type your message...                          [🎤]│ │
│  │                                                    │ │
│  └───────────────────────────────────────────────────┘ │
│  [Quick Actions ▼]                           [Send 🚀]│
└─────────────────────────────────────────────────────────┘
```

**Features**:
- Auto-expanding textarea (max 5 lines)
- File attachment button
- Voice input button (future)
- Character/token counter
- Send button (enabled when text present)
- Quick action dropdown
- Keyboard shortcuts (Cmd/Ctrl+Enter to send)
- Shift+Enter for new line

**Props**:
```typescript
interface ChatInputAreaProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  onAttachFile: (files: File[]) => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
  showQuickActions?: boolean;
  className?: string;
}
```

**State Management**:
```typescript
const [inputValue, setInputValue] = useState('');
const [attachments, setAttachments] = useState<File[]>([]);
const [isExpanded, setIsExpanded] = useState(false);
```

#### 2.3.2 MessageInput
**File**: `src/components/chat/MessageInput.tsx`

**Component**: Custom textarea with auto-resize

**Features**:
- Auto-height adjustment
- Paste handling (text and images)
- Drag and drop file support
- Mention/command autocomplete (@, /)
- Emoji picker integration

**Props**:
```typescript
interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}
```

#### 2.3.3 AttachmentButton
**File**: `src/components/chat/AttachmentButton.tsx`

**Functionality**:
- Opens file picker
- Drag-and-drop zone
- Supported file types: PDF, DOCX, TXT, images
- File size limit: 10MB
- Multiple file selection

**Props**:
```typescript
interface AttachmentButtonProps {
  onAttach: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
}
```

#### 2.3.4 AttachmentPreview
**File**: `src/components/chat/AttachmentPreview.tsx`

**Display**: Shows attached files before sending

**Visual**:
```
┌─────────────────────────────────────────┐
│  📄 resume.pdf (234 KB)            [×]  │
│  📄 cover-letter.docx (45 KB)      [×]  │
└─────────────────────────────────────────┘
```

**Props**:
```typescript
interface AttachmentPreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  className?: string;
}
```

### 2.4 Quick Action Components

#### 2.4.1 QuickActionsPanel
**File**: `src/components/chat/QuickActionsPanel.tsx`

**Purpose**: Contextual shortcuts for common career tasks

**Layout**: 2x4 grid on desktop, 1x4 on mobile

**Action Cards**:
```
┌─────────────────────────────────────────────────────────┐
│  📝 Resume Review    💼 Interview Prep                  │
│  🎯 Career Advice    📊 Skill Analysis                  │
│  💰 Salary Tips      ✍️  Cover Letter                   │
│  🔗 LinkedIn Help    🔍 Job Strategy                    │
└─────────────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface QuickActionsPanelProps {
  onSelectAction: (action: QuickAction) => void;
  visibleActions?: QuickActionType[];
  customActions?: QuickAction[];
  className?: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  prompt: string;
  requiresUpload?: boolean;
  category: 'resume' | 'interview' | 'career' | 'search';
}
```

#### 2.4.2 QuickActionCard
**File**: `src/components/chat/QuickActionCard.tsx`

**Visual Design**:
```
┌─────────────────────────┐
│  📝                     │
│  Resume Review          │
│  Upload your resume for │
│  AI-powered feedback    │
│                         │
│  [Get Started →]        │
└─────────────────────────┘
```

**States**:
- Default
- Hover (elevated shadow)
- Active/Selected
- Disabled

**Props**:
```typescript
interface QuickActionCardProps {
  action: QuickAction;
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
}
```

### 2.5 Suggested Prompts Components

#### 2.5.1 SuggestedPromptsSection
**File**: `src/components/chat/SuggestedPromptsSection.tsx`

**Purpose**: Help users start conversations with effective prompts

**Display Context**:
- Empty chat state (new conversation)
- After 30 seconds of inactivity
- When user types "help" or "?"

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  💡 Suggested Questions                                 │
│                                                         │
│  ┌───────────────────────────────────────────┐         │
│  │ "How can I make my resume ATS-friendly?"  │         │
│  └───────────────────────────────────────────┘         │
│  ┌───────────────────────────────────────────┐         │
│  │ "What should I say in a thank-you email?" │         │
│  └───────────────────────────────────────────┘         │
│  ┌───────────────────────────────────────────┐         │
│  │ "How do I negotiate a higher salary?"     │         │
│  └───────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface SuggestedPromptsSectionProps {
  prompts: SuggestedPrompt[];
  onSelectPrompt: (prompt: string) => void;
  category?: PromptCategory;
  maxDisplay?: number;
  className?: string;
}

interface SuggestedPrompt {
  id: string;
  text: string;
  category: PromptCategory;
  icon?: LucideIcon;
}

type PromptCategory = 
  | 'resume' 
  | 'interview' 
  | 'career-planning' 
  | 'job-search' 
  | 'networking'
  | 'skills';
```

#### 2.5.2 PromptCard
**File**: `src/components/chat/PromptCard.tsx`

**Interactive Element**: Clickable card that inserts prompt into input

**Visual**:
```
┌─────────────────────────────────────────┐
│  "How can I improve my resume?"         │
│  Resume • Optimization                  │
└─────────────────────────────────────────┘
```

**Props**:
```typescript
interface PromptCardProps {
  prompt: SuggestedPrompt;
  onClick: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}
```

### 2.6 Conversation History Components

#### 2.6.1 ConversationList
**File**: `src/components/chat/ConversationList.tsx`

**Features**:
- Grouped by date (Today, Yesterday, Last 7 days, etc.)
- Infinite scroll for loading more
- Search/filter conversations
- Pinned conversations at top

**Structure**:
```
Today
  ├─ Resume optimization tips
  └─ Interview preparation

Yesterday
  ├─ Career change advice
  └─ LinkedIn profile review

Last 7 Days
  ├─ Salary negotiation strategies
  └─ Cover letter feedback
```

**Props**:
```typescript
interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onPinConversation: (id: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}
```

#### 2.6.2 ConversationItem
**File**: `src/components/chat/ConversationItem.tsx`

**Display**:
```
┌─────────────────────────────────────────┐
│ 📌 Resume optimization tips             │
│ How can I make my resume...             │
│ 2 hours ago • 12 messages               │
└─────────────────────────────────────────┘
```

**States**:
- Default
- Active (currently selected)
- Hover (show actions)
- Pinned (indicator)

**Actions** (visible on hover):
- Pin/Unpin
- Rename
- Delete
- Share

**Props**:
```typescript
interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick: () => void;
  onDelete: () => void;
  onPin: () => void;
  onRename: (newTitle: string) => void;
  className?: string;
}
```

### 2.7 Loading & Error Components

#### 2.7.1 LoadingIndicator
**File**: `src/components/chat/LoadingIndicator.tsx`

**Variants**:
- **Skeleton Loading**: For initial message load
- **Spinner**: For general loading
- **Streaming Dots**: For AI response generation

**Props**:
```typescript
interface LoadingIndicatorProps {
  variant?: 'skeleton' | 'spinner' | 'dots';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

#### 2.7.2 ErrorDisplay
**File**: `src/components/chat/ErrorDisplay.tsx`

**Error Types**:
- Connection errors
- Rate limit errors
- Invalid input errors
- Server errors

**Visual**:
```
┌─────────────────────────────────────────┐
│  ⚠️ Connection Error                    │
│                                         │
│  Unable to connect to the AI service.   │
│  Please check your internet connection. │
│                                         │
│  [Retry]  [Dismiss]                     │
└─────────────────────────────────────────┘
```

**Props**:
```typescript
interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  variant?: 'inline' | 'toast' | 'modal';
  className?: string;
}
```

### 2.8 Welcome Screen Component

#### 2.8.1 WelcomeScreen
**File**: `src/components/chat/WelcomeScreen.tsx`

**Purpose**: First-time user experience and empty state

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                    🤖                                   │
│         AI Career Assistant                             │
│                                                         │
│  Your 24/7 partner for career success                  │
│                                                         │
│  ┌─────────────────────────────────────────┐           │
│  │  Get started with these suggestions:    │           │
│  │                                         │           │
│  │  📝 Resume Review                       │           │
│  │  💼 Interview Preparation               │           │
│  │  🎯 Career Planning                     │           │
│  │  📊 Skill Assessment                    │           │
│  └─────────────────────────────────────────┘           │
│                                                         │
│  Or ask me anything about your career!                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface WelcomeScreenProps {
  userName?: string;
  onSelectQuickAction: (action: QuickAction) => void;
  onSelectPrompt: (prompt: string) => void;
  className?: string;
}
```

### 2.9 File Upload Components

#### 2.9.1 FileUploadModal
**File**: `src/components/chat/FileUploadModal.tsx`

**Purpose**: Upload documents for AI analysis

**Features**:
- Drag-and-drop zone
- File type validation
- File size validation
- Preview before upload
- Upload progress indicator

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Upload Document for Review                        [×]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │         📄                                      │   │
│  │                                                 │   │
│  │     Drag and drop your file here               │   │
│  │     or click to browse                         │   │
│  │                                                 │   │
│  │     Supported: PDF, DOCX, TXT (Max 10MB)       │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Selected: resume.pdf (234 KB)                          │
│                                                         │
│  What would you like me to analyze?                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Please review my resume and provide feedback    │   │
│  │ on formatting and content...                    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│                              [Cancel]  [Upload & Ask]  │
└─────────────────────────────────────────────────────────┘
```

**Props**:
```typescript
interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, prompt: string) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  title?: string;
}
```

#### 2.9.2 FileDropZone
**File**: `src/components/chat/FileDropZone.tsx`

**Radix UI**: Uses `@radix-ui/react-dialog` for modal

**Props**:
```typescript
interface FileDropZoneProps {
  onDrop: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}
```

### 2.10 Code Display Components

#### 2.10.1 CodeBlock
**File**: `src/components/chat/CodeBlock.tsx`

**Purpose**: Display code snippets with syntax highlighting

**Features**:
- Language detection
- Syntax highlighting
- Copy to clipboard button
- Line numbers (optional)

**Visual**:
```
┌─────────────────────────────────────────┐
│  JavaScript                  [Copy 📋] │
├─────────────────────────────────────────┤
│ 1  const greet = (name) => {            │
│ 2    return `Hello, ${name}!`;          │
│ 3  };                                   │
└─────────────────────────────────────────┘
```

**Props**:
```typescript
interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  fileName?: string;
  className?: string;
}
```

---

## 3. Detailed Component Specifications

### 3.1 Visual Design System

#### 3.1.1 Color Palette

**Message Bubbles**:
- User: `bg-blue-600 text-white` (Primary blue)
- AI: `bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100`
- System: `bg-yellow-50 dark:bg-yellow-900/20 text-yellow-900 dark:text-yellow-100`

**Interactive Elements**:
- Primary Button: `bg-blue-600 hover:bg-blue-700`
- Secondary Button: `bg-gray-200 hover:bg-gray-300`
- Danger Button: `bg-red-600 hover:bg-red-700`

**Status Colors**:
- Success: `text-green-600`
- Warning: `text-yellow-600`
- Error: `text-red-600`
- Info: `text-blue-600`

#### 3.1.2 Typography

**Message Content**:
- Body: `font-sans text-base leading-relaxed`
- User Message: `font-medium`
- AI Message: `font-normal`
- Timestamp: `text-xs text-gray-500`

**Headings** (in AI responses):
- H1: `text-2xl font-bold`
- H2: `text-xl font-semibold`
- H3: `text-lg font-medium`

**Code**:
- Inline: `font-mono text-sm bg-gray-100 px-1 rounded`
- Block: `font-mono text-sm`

#### 3.1.3 Spacing & Layout

**Message Spacing**:
- Between messages: `mb-4`
- Within message bubble: `p-4`
- Timestamp: `mt-1`

**Container Padding**:
- Chat area: `p-4 md:p-6 lg:p-8`
- Sidebar: `p-4`
- Input area: `p-4`

**Border Radius**:
- Message bubbles: `rounded-2xl`
- Buttons: `rounded-lg`
- Cards: `rounded-xl`
- Input: `rounded-lg`

### 3.2 Message Formatting Options

#### 3.2.1 Markdown Support

**Supported Syntax**:
```markdown
# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
~~Strikethrough~~

- Bullet list
- Another item

1. Numbered list
2. Another item

[Link text](https://example.com)

> Blockquote

`inline code`

```language
code block
```

| Table | Header |
|-------|--------|
| Cell  | Cell   |
```

**Rendering Library**: `react-markdown` with plugins:
- `remark-gfm` for GitHub Flavored Markdown
- `remark-breaks` for line breaks
- `rehype-sanitize` for XSS protection
- `rehype-highlight` for code syntax

#### 3.2.2 Code Highlighting

**Supported Languages**:
- JavaScript/TypeScript
- Python
- Java
- C/C++/C#
- HTML/CSS
- SQL
- Bash/Shell
- JSON/YAML
- Markdown

**Library**: `react-syntax-highlighter` with `prism` theme

**Theme**: 
- Light mode: `prism-light`
- Dark mode: `prism-dark`

#### 3.2.3 Rich Content Rendering

**Lists**:
- Bullet lists with proper indentation
- Numbered lists with sequential numbering
- Nested lists support

**Tables**:
- Responsive tables with horizontal scroll
- Striped rows for readability
- Header styling

**Links**:
- External links open in new tab
- Underlined on hover
- Security: `rel="noopener noreferrer"`

**Images** (if supported):
- Max width: 100%
- Lazy loading
- Alt text required
- Loading placeholder

### 3.3 Real-time Message Streaming

#### 3.3.1 Streaming Implementation

**Technology**: Server-Sent Events (SSE) or WebSocket

**Flow**:
```typescript
// Client-side streaming handler
const handleStreamingResponse = (conversationId: string, messageId: string) => {
  const eventSource = new EventSource(
    `/api/chat/${conversationId}/stream/${messageId}`
  );
  
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'content') {
      // Append content to message
      appendMessageContent(messageId, data.content);
    }
    
    if (data.type === 'done') {
      // Mark message as complete
      markMessageComplete(messageId);
      eventSource.close();
    }
  };
  
  eventSource.onerror = (error) => {
    handleStreamingError(error);
    eventSource.close();
  };
};
```

**State Management**:
```typescript
interface StreamingState {
  messageId: string;
  isStreaming: boolean;
  content: string;
  error?: Error;
}

const [streamingState, setStreamingState] = useState<StreamingState>({
  messageId: '',
  isStreaming: false,
  content: '',
});
```

**Visual Feedback**:
- Cursor animation at end of streaming text
- Typing indicator before stream starts
- Smooth content appearance
- Auto-scroll to follow stream

#### 3.3.2 Streaming Optimizations

**Debouncing**: Update UI every 50ms to avoid re-render thrashing

**Content Chunking**: Render complete sentences/paragraphs

**Auto-scroll**: Keep newest content visible
```typescript
const scrollToBottom = useCallback(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, []);

useEffect(() => {
  if (isStreaming) {
    scrollToBottom();
  }
}, [streamingState.content, isStreaming]);
```

### 3.4 Responsive Behavior

#### 3.4.1 Desktop (1024px+)

**Layout**:
- Two-column layout
- Sidebar width: 280px
- Main chat area: flexible
- Input area: full width of main area

**Features**:
- Resizable sidebar (using `react-resizable-panels`)
- Keyboard shortcuts enabled
- Hover states active
- Tooltips visible

#### 3.4.2 Tablet (768px - 1023px)

**Layout**:
- Sidebar as toggleable overlay
- Full-width chat area
- Collapsed sidebar shows icon only

**Adjustments**:
- Touch-optimized button sizes (min 44x44px)
- Swipe gestures to open/close sidebar
- Reduced padding

#### 3.4.3 Mobile (<768px)

**Layout**:
- Single column
- Full-screen chat
- Sidebar as drawer overlay
- Floating action button for new chat

**Optimizations**:
- Virtual keyboard handling
- Fixed input at bottom (above keyboard)
- Pull-to-refresh for conversation list
- Swipe gestures for navigation

**Input Behavior**:
```typescript
// Prevent viewport zoom on input focus (iOS)
useEffect(() => {
  const input = inputRef.current;
  if (input && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
    input.style.fontSize = '16px'; // Prevent zoom
  }
}, []);
```

### 3.5 Error Handling

#### 3.5.1 Error Types & Responses

**Network Errors**:
```typescript
{
  type: 'network',
  message: 'Unable to connect to the AI service',
  action: 'retry',
  retryable: true
}
```

**Display**:
```
⚠️ Connection Error
Unable to connect. Please check your internet connection.
[Retry] [Dismiss]
```

**Rate Limit Errors**:
```typescript
{
  type: 'rate_limit',
  message: 'Too many requests',
  retryAfter: 60, // seconds
  retryable: true
}
```

**Display**:
```
⏱️ Rate Limit Reached
Please wait 60 seconds before sending another message.
```

**Validation Errors**:
```typescript
{
  type: 'validation',
  message: 'Message is too long',
  field: 'message',
  retryable: false
}
```

**Display**: Inline error below input field

**Server Errors**:
```typescript
{
  type: 'server',
  message: 'Internal server error',
  code: 500,
  retryable: true
}
```

**Display**:
```
❌ Something Went Wrong
We're experiencing technical difficulties.
[Contact Support] [Retry]
```

#### 3.5.2 Error Recovery

**Automatic Retry**: Exponential backoff for network errors
```typescript
const retryWithBackoff = async (
  fn: () => Promise<any>,
  maxRetries = 3,
  delay = 1000
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => 
        setTimeout(resolve, delay * Math.pow(2, i))
      );
    }
  }
};
```

**Offline Mode**: Queue messages for sending when online
```typescript
const queueMessage = (message: Message) => {
  const queue = getOfflineQueue();
  queue.push(message);
  saveOfflineQueue(queue);
};

// On reconnect
window.addEventListener('online', () => {
  processOfflineQueue();
});
```

**Error Boundary**: Catch React component errors
```typescript
<ErrorBoundary
  fallback={<ErrorDisplay error="Something went wrong" />}
  onError={logError}
>
  <ChatInterface />
</ErrorBoundary>
```

### 3.6 Context Awareness

#### 3.6.1 Conversation Context

**Context Tracking**:
```typescript
interface ConversationContext {
  conversationId: string;
  userId: string;
  userProfile: UserProfile;
  previousMessages: Message[];
  documents: UploadedDocument[];
  preferences: UserPreferences;
  sessionData: SessionData;
}
```

**Context Injection**:
- User profile data (skills, experience, goals)
- Previously uploaded documents
- Conversation history (last N messages)
- User preferences (tone, detail level)
- Current session context (time, location)

#### 3.6.2 Smart Suggestions

**Context-Based Prompts**:
```typescript
const getContextualPrompts = (context: ConversationContext) => {
  const prompts: SuggestedPrompt[] = [];
  
  // If user uploaded resume
  if (context.documents.some(doc => doc.type === 'resume')) {
    prompts.push({
      id: 'review-resume',
      text: 'Can you review my resume?',
      category: 'resume'
    });
  }
  
  // If user is job searching
  if (context.userProfile.status === 'job_searching') {
    prompts.push({
      id: 'interview-prep',
      text: 'Help me prepare for interviews',
      category: 'interview'
    });
  }
  
  return prompts;
};
```

**Personalization**:
- Address user by name
- Reference previous conversations
- Remember user preferences
- Adapt response style

---

## 4. User Flows

### 4.1 Starting a New Conversation

**Flow Steps**:

1. **Entry Point**:
   - Click "New Chat" button in sidebar
   - Navigate to `/chat` from dashboard
   - Click quick action from anywhere

2. **Welcome Screen**:
   - Display welcome message with AI avatar
   - Show suggested prompts
   - Show quick action cards
   - Display empty input field

3. **User Action**:
   - Option A: Click suggested prompt → Auto-fill input
   - Option B: Click quick action → Auto-fill prompt + possible file upload
   - Option C: Type custom message

4. **Send Message**:
   - Validate input (not empty, within length limit)
   - Disable input while sending
   - Show sending indicator
   - Scroll to bottom

5. **Receive Response**:
   - Show typing indicator
   - Stream AI response in real-time
   - Enable input when complete
   - Auto-save conversation

6. **Continue Conversation**:
   - User can send follow-up messages
   - Conversation title auto-generated from first message
   - Conversation appears in sidebar history

**User Journey Map**:
```
[Dashboard] → [New Chat Button] → [Welcome Screen] → [Select Quick Action]
                                                   ↓
                                              [Upload File (optional)]
                                                   ↓
                                              [AI Processes]
                                                   ↓
                                              [Stream Response]
                                                   ↓
                                              [Continue Chat]
```

### 4.2 Continuing an Existing Conversation

**Flow Steps**:

1. **Access Conversation**:
   - Click conversation from sidebar
   - Navigate from notification/email link
   - Resume from dashboard "Recent Conversations"

2. **Load Conversation**:
   - Show loading skeleton
   - Fetch message history
   - Scroll to last read position or bottom
   - Display "New messages" indicator if applicable

3. **Continue Chatting**:
   - Context preserved from previous messages
   - Can upload new files
   - Can reference previous responses

4. **Conversation Actions**:
   - Rename conversation
   - Export conversation
   - Delete conversation
   - Share conversation (if feature enabled)

**State Preservation**:
```typescript
interface ConversationState {
  conversationId: string;
  messages: Message[];
  lastReadMessageId?: string;
  scrollPosition?: number;
  draftMessage?: string;
}
```

### 4.3 Using Quick Actions

**Quick Action Flow**:

1. **Trigger Quick Action**:
   - From welcome screen
   - From quick actions dropdown in input area
   - From dashboard quick links

2. **Action Types**:

   **A. Simple Prompt** (e.g., "Career Advice"):
   - Click action → Auto-fill prompt → Send
   
   **B. Upload Required** (e.g., "Resume Review"):
   - Click action → Open upload modal → Select file → Add custom prompt → Upload & Ask
   
   **C. Multi-Step** (e.g., "Interview Prep"):
   - Click action → Choose sub-category → Answer questions → Generate prep plan

3. **Execution**:
   - Show appropriate UI (modal, inline, etc.)
   - Validate inputs
   - Send to AI with action context
   - Display specialized response format

4. **Completion**:
   - Conversation created/continued
   - Action results displayed
   - Follow-up suggestions offered

**Example: Resume Review Quick Action**:
```
User clicks "Resume Review"
         ↓
Upload Modal Opens
         ↓
User selects resume.pdf
         ↓
User enters: "Please review for a software engineer role"
         ↓
Click "Upload & Ask"
         ↓
File uploaded + prompt sent
         ↓
AI analyzes document
         ↓
Structured review displayed:
  - Summary Assessment
  - Strengths (bulleted)
  - Areas for Improvement (bulleted)
  - Specific Recommendations
  - ATS Compatibility Score
         ↓
User can ask follow-up questions
```

### 4.4 Uploading Documents for Review

**Upload Flow**:

1. **Initiate Upload**:
   - Click attachment button in input area
   - Click upload-based quick action
   - Drag and drop file into chat area

2. **File Selection**:
   - Open file picker OR
   - Drag file into drop zone

3. **File Validation**:
   - Check file type (PDF, DOCX, TXT)
   - Check file size (<10MB)
   - Display error if invalid

4. **Preview & Prompt**:
   - Show file preview (name, size, type)
   - Allow removal before upload
   - Provide prompt input for analysis request

5. **Upload**:
   - Show progress bar
   - Upload to server
   - Generate file ID

6. **AI Processing**:
   - File content extracted
   - Sent to AI with user prompt
   - Streaming response begins

7. **Response & References**:
   - AI response references document
   - File attached to conversation
   - Can be referenced in follow-up questions

**Supported Document Types**:
```typescript
const SUPPORTED_TYPES = {
  'application/pdf': { 
    ext: '.pdf', 
    icon: FileText, 
    color: 'red' 
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    ext: '.docx',
    icon: FileText,
    color: 'blue'
  },
  'text/plain': { 
    ext: '.txt', 
    icon: FileText, 
    color: 'gray' 
  },
  'image/png': { 
    ext: '.png', 
    icon: Image, 
    color: 'purple' 
  },
  'image/jpeg': { 
    ext: '.jpg', 
    icon: Image, 
    color: 'purple' 
  },
};
```

### 4.5 Saving & Sharing Conversations

#### 4.5.1 Auto-Save Flow

**Automatic Saving**:
- Every message auto-saved to database
- Draft messages saved to localStorage
- No manual save action required

**Draft Recovery**:
```typescript
// Save draft on input change
useEffect(() => {
  const timer = setTimeout(() => {
    saveDraftToLocalStorage(conversationId, inputValue);
  }, 500);
  return () => clearTimeout(timer);
}, [inputValue, conversationId]);

// Restore draft on mount
useEffect(() => {
  const draft = getDraftFromLocalStorage(conversationId);
  if (draft) {
    setInputValue(draft);
  }
}, [conversationId]);
```

#### 4.5.2 Export Conversation Flow

**Export Options**:

1. **Text Format (.txt)**:
   - Plain text conversation
   - Includes timestamps
   - No formatting

2. **Markdown (.md)**:
   - Preserves formatting
   - Includes code blocks
   - Readable in text editors

3. **PDF**:
   - Formatted document
   - Includes branding
   - Professional appearance

4. **JSON**:
   - Full data export
   - Includes metadata
   - For backup/import

**Export Flow**:
```
Click "Export" button
         ↓
Export modal opens
         ↓
Select format (TXT, MD, PDF, JSON)
         ↓
Click "Download"
         ↓
Generate file
         ↓
Browser download starts
```

**Implementation**:
```typescript
const exportConversation = (
  conversation: Conversation, 
  format: ExportFormat
) => {
  let content: string;
  let filename: string;
  let mimeType: string;
  
  switch (format) {
    case 'txt':
      content = generateTextExport(conversation);
      filename = `${conversation.title}.txt`;
      mimeType = 'text/plain';
      break;
    case 'markdown':
      content = generateMarkdownExport(conversation);
      filename = `${conversation.title}.md`;
      mimeType = 'text/markdown';
      break;
    case 'pdf':
      // Use library like jsPDF
      content = generatePDFExport(conversation);
      filename = `${conversation.title}.pdf`;
      mimeType = 'application/pdf';
      break;
    case 'json':
      content = JSON.stringify(conversation, null, 2);
      filename = `${conversation.title}.json`;
      mimeType = 'application/json';
      break;
  }
  
  downloadFile(content, filename, mimeType);
};
```

#### 4.5.3 Share Conversation Flow

**Share Options**:

1. **Copy Link**:
   - Generate shareable URL
   - Conversation becomes read-only to others
   - Requires authentication to view

2. **Email Share**:
   - Send conversation via email
   - Include summary + link
   - Recipient can view in browser

3. **Share with Coach** (for job seekers):
   - Select coach from list
   - Add note about what feedback needed
   - Coach gets notification

**Privacy Controls**:
```typescript
interface ShareSettings {
  shareId: string;
  expiresAt?: Date;
  requireAuth: boolean;
  allowedUsers?: string[];
  permissions: 'view' | 'comment';
}
```

**Share Flow**:
```
Click "Share" button
         ↓
Share modal opens
         ↓
Choose share method:
  - Copy Link
  - Email
  - Share with Coach
         ↓
Configure settings:
  - Who can access
  - Expiration date
  - Permissions
         ↓
Generate share link
         ↓
Copy to clipboard / Send email
         ↓
Show confirmation
```

---

## 5. Data Requirements

### 5.1 Message Data Structure

```typescript
interface Message {
  id: string; // Unique message ID
  conversationId: string; // Parent conversation
  type: 'user' | 'ai' | 'system';
  content: string; // Message text (Markdown)
  createdAt: Date;
  updatedAt?: Date;
  
  // Author info
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: 'user' | 'assistant' | 'system';
  };
  
  // Message metadata
  metadata?: {
    tokens?: number; // Token count
    model?: string; // AI model used
    latency?: number; // Response time (ms)
    streamingComplete?: boolean;
  };
  
  // Attachments
  attachments?: Attachment[];
  
  // User interactions
  feedback?: {
    rating: 'positive' | 'negative';
    comment?: string;
    timestamp: Date;
  };
  
  // Editing
  isEdited?: boolean;
  editHistory?: {
    previousContent: string;
    editedAt: Date;
  }[];
  
  // AI-specific
  regenerationOf?: string; // If regenerated from previous message
  suggestedActions?: QuickAction[];
}

interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: Date;
  processedContent?: string; // Extracted text for AI
}
```

### 5.2 Conversation History Format

```typescript
interface Conversation {
  id: string;
  userId: string;
  
  // Conversation metadata
  title: string; // Auto-generated or user-edited
  summary?: string; // AI-generated summary
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  
  // Categorization
  category?: ConversationCategory;
  tags?: string[];
  
  // Status
  status: 'active' | 'archived' | 'deleted';
  isPinned: boolean;
  
  // Messages
  messageCount: number;
  messages?: Message[]; // Populated when loaded
  
  // Context
  context?: {
    jobSeekerProfile?: string;
    uploadedDocuments?: string[];
    relatedJobs?: string[];
  };
  
  // Sharing
  shareSettings?: ShareSettings;
  sharedWith?: string[];
}

type ConversationCategory = 
  | 'resume'
  | 'interview'
  | 'career-planning'
  | 'job-search'
  | 'networking'
  | 'skills'
  | 'general';

interface ConversationSummary {
  // For conversation list display
  id: string;
  title: string;
  preview: string; // First 100 chars of last message
  lastMessageAt: Date;
  messageCount: number;
  isPinned: boolean;
  category?: ConversationCategory;
}
```

### 5.3 AI Context Management

```typescript
interface AIContext {
  // User context
  user: {
    id: string;
    name: string;
    profile: UserProfile;
    preferences: UserPreferences;
  };
  
  // Conversation context
  conversation: {
    id: string;
    history: Message[]; // Last N messages for context
    category?: ConversationCategory;
    uploadedDocuments?: DocumentContext[];
  };
  
  // System context
  system: {
    timestamp: Date;
    sessionId: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
  
  // Instructions
  instructions?: {
    tone?: 'professional' | 'friendly' | 'concise';
    detailLevel?: 'brief' | 'moderate' | 'detailed';
    responseFormat?: 'structured' | 'conversational';
  };
}

interface UserProfile {
  currentRole?: string;
  targetRole?: string;
  experience?: number; // years
  skills?: string[];
  education?: Education[];
  location?: string;
  careerGoals?: string[];
  industry?: string;
}

interface UserPreferences {
  responseStyle: 'professional' | 'friendly' | 'concise';
  detailLevel: 'brief' | 'moderate' | 'detailed';
  language: string;
  timezone: string;
}

interface DocumentContext {
  id: string;
  type: 'resume' | 'cover-letter' | 'job-description' | 'other';
  fileName: string;
  extractedContent: string;
  uploadedAt: Date;
}
```

### 5.4 API Integration

#### 5.4.1 REST API Endpoints

```typescript
// Conversations
GET    /api/conversations           // List user conversations
POST   /api/conversations           // Create new conversation
GET    /api/conversations/:id       // Get conversation details
PATCH  /api/conversations/:id       // Update conversation (title, etc.)
DELETE /api/conversations/:id       // Delete conversation
POST   /api/conversations/:id/share // Share conversation

// Messages
GET    /api/conversations/:id/messages      // Get messages (paginated)
POST   /api/conversations/:id/messages      // Send new message
PATCH  /api/messages/:id                    // Edit message
DELETE /api/messages/:id                    // Delete message
POST   /api/messages/:id/regenerate         // Regenerate AI response
POST   /api/messages/:id/feedback           // Submit feedback

// File uploads
POST   /api/uploads                          // Upload file
GET    /api/uploads/:id                      // Get upload details

// Export
GET    /api/conversations/:id/export/:format // Export conversation
```

#### 5.4.2 Request/Response Examples

**Send Message**:
```typescript
// POST /api/conversations/:id/messages
Request:
{
  "content": "How can I improve my resume?",
  "attachments": [
    {
      "fileId": "upload_123",
      "fileName": "resume.pdf"
    }
  ]
}

Response:
{
  "message": {
    "id": "msg_456",
    "conversationId": "conv_789",
    "type": "user",
    "content": "How can I improve my resume?",
    "createdAt": "2025-11-07T12:00:00Z",
    "author": {
      "id": "user_123",
      "name": "John Doe",
      "role": "user"
    },
    "attachments": [...]
  },
  "aiResponse": {
    "id": "msg_457",
    "conversationId": "conv_789",
    "type": "ai",
    "content": "I'd be happy to help...",
    "createdAt": "2025-11-07T12:00:02Z",
    "author": {
      "id": "assistant",
      "name": "AI Career Assistant",
      "role": "assistant"
    }
  }
}
```

**List Conversations**:
```typescript
// GET /api/conversations?limit=20&offset=0
Response:
{
  "conversations": [
    {
      "id": "conv_789",
      "title": "Resume optimization tips",
      "preview": "How can I improve my resume for...",
      "lastMessageAt": "2025-11-07T12:00:00Z",
      "messageCount": 12,
      "isPinned": false,
      "category": "resume"
    },
    // ...more conversations
  ],
  "total": 45,
  "hasMore": true
}
```

### 5.5 WebSocket/Streaming Support

#### 5.5.1 WebSocket Events

```typescript
// Client → Server events
interface ClientEvents {
  'message:send': {
    conversationId: string;
    content: string;
    attachments?: string[];
  };
  
  'message:edit': {
    messageId: string;
    newContent: string;
  };
  
  'typing:start': {
    conversationId: string;
  };
  
  'typing:stop': {
    conversationId: string;
  };
}

// Server → Client events
interface ServerEvents {
  'message:stream': {
    messageId: string;
    chunk: string;
    isComplete: boolean;
  };
  
  'message:complete': {
    message: Message;
  };
  
  'conversation:update': {
    conversationId: string;
    updates: Partial<Conversation>;
  };
  
  'error': {
    code: string;
    message: string;
  };
}
```

#### 5.5.2 Streaming Implementation

**Using Server-Sent Events (SSE)**:
```typescript
// Client-side
const streamMessage = (conversationId: string, content: string) => {
  const eventSource = new EventSource(
    `/api/conversations/${conversationId}/stream?content=${encodeURIComponent(content)}`
  );
  
  let fullContent = '';
  
  eventSource.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'content') {
      fullContent += data.content;
      updateMessageContent(data.messageId, fullContent);
    }
    
    if (data.type === 'complete') {
      finalizeMessage(data.messageId, fullContent);
      eventSource.close();
    }
  });
  
  eventSource.addEventListener('error', (error) => {
    handleStreamError(error);
    eventSource.close();
  });
};
```

**Using WebSocket**:
```typescript
// WebSocket connection
const ws = new WebSocket('wss://api.careersu.com/chat');

ws.onopen = () => {
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    token: getAuthToken()
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'message:stream':
      handleStreamChunk(data);
      break;
    case 'message:complete':
      handleMessageComplete(data);
      break;
    case 'error':
      handleError(data);
      break;
  }
};

// Send message
const sendMessage = (conversationId: string, content: string) => {
  ws.send(JSON.stringify({
    type: 'message:send',
    conversationId,
    content
  }));
};
```

### 5.6 Offline Support & Caching

```typescript
// Service Worker for offline support
interface CachedConversation {
  conversation: Conversation;
  messages: Message[];
  cachedAt: Date;
}

// Cache strategy
const cacheConversation = async (conversationId: string) => {
  const conversation = await fetchConversation(conversationId);
  const messages = await fetchMessages(conversationId);
  
  await cache.put(`conversation:${conversationId}`, {
    conversation,
    messages,
    cachedAt: new Date()
  });
};

// Queue for offline messages
interface QueuedMessage {
  id: string;
  conversationId: string;
  content: string;
  createdAt: Date;
  status: 'pending' | 'sending' | 'failed';
}

const queueOfflineMessage = (message: QueuedMessage) => {
  const queue = getOfflineQueue();
  queue.push(message);
  saveToIndexedDB('messageQueue', queue);
};

// Process queue when online
window.addEventListener('online', async () => {
  const queue = getOfflineQueue();
  
  for (const queuedMessage of queue) {
    try {
      await sendMessage(queuedMessage);
      removeFromQueue(queuedMessage.id);
    } catch (error) {
      markQueuedMessageFailed(queuedMessage.id);
    }
  }
});
```

---

## 6. File Structure

### 6.1 Component Organization

```
src/
├── components/
│   ├── chat/
│   │   ├── layout/
│   │   │   ├── ChatLayout.tsx
│   │   │   ├── ChatSidebar.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   └── ChatMainArea.tsx
│   │   │
│   │   ├── messages/
│   │   │   ├── ChatMessagesArea.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageContent.tsx
│   │   │   ├── MessageActions.tsx
│   │   │   ├── StreamingIndicator.tsx
│   │   │   └── MessageList.tsx
│   │   │
│   │   ├── input/
│   │   │   ├── ChatInputArea.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   ├── AttachmentButton.tsx
│   │   │   ├── AttachmentPreview.tsx
│   │   │   ├── SendButton.tsx
│   │   │   └── VoiceInputButton.tsx (future)
│   │   │
│   │   ├── quick-actions/
│   │   │   ├── QuickActionsPanel.tsx
│   │   │   ├── QuickActionCard.tsx
│   │   │   └── QuickActionModal.tsx
│   │   │
│   │   ├── prompts/
│   │   │   ├── SuggestedPromptsSection.tsx
│   │   │   ├── PromptCard.tsx
│   │   │   └── PromptCarousel.tsx
│   │   │
│   │   ├── conversations/
│   │   │   ├── ConversationList.tsx
│   │   │   ├── ConversationItem.tsx
│   │   │   ├── ConversationSearch.tsx
│   │   │   └── NewConversationButton.tsx
│   │   │
│   │   ├── upload/
│   │   │   ├── FileUploadModal.tsx
│   │   │   ├── FileDropZone.tsx
│   │   │   ├── FilePreview.tsx
│   │   │   └── UploadProgress.tsx
│   │   │
│   │   ├── rendering/
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── MarkdownRenderer.tsx
│   │   │   ├── TableRenderer.tsx
│   │   │   └── LinkRenderer.tsx
│   │   │
│   │   ├── feedback/
│   │   │   ├── FeedbackButtons.tsx
│   │   │   ├── FeedbackModal.tsx
│   │   │   └── RatingStars.tsx
│   │   │
│   │   ├── state/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   └── ErrorState.tsx
│   │   │
│   │   └── export/
│   │       ├── ExportModal.tsx
│   │       ├── ShareModal.tsx
│   │       └── ExportButton.tsx
│   │
│   └── ui/                    # Shared Radix UI components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── scroll-area.tsx
│       ├── separator.tsx
│       ├── tooltip.tsx
│       └── toast.tsx
│
├── pages/
│   ├── ChatPage.tsx           # Main chat page
│   └── ConversationPage.tsx   # Individual conversation view
│
├── hooks/
│   ├── chat/
│   │   ├── useChat.ts         # Main chat logic
│   │   ├── useConversations.ts
│   │   ├── useMessages.ts
│   │   ├── useStreaming.ts
│   │   ├── useAttachments.ts
│   │   └── useChatContext.ts
│   │
│   └── shared/
│       ├── useWebSocket.ts
│       ├── useAutoScroll.ts
│       └── useDebounce.ts
│
├── lib/
│   ├── chat/
│   │   ├── api.ts             # API client functions
│   │   ├── streaming.ts       # Streaming utilities
│   │   ├── markdown.ts        # Markdown utilities
│   │   └── export.ts          # Export utilities
│   │
│   └── utils.ts               # Shared utilities
│
├── types/
│   ├── chat.ts                # Chat-related types
│   ├── message.ts             # Message types
│   ├── conversation.ts        # Conversation types
│   └── api.ts                 # API types
│
├── contexts/
│   ├── ChatContext.tsx        # Chat state context
│   └── ConversationContext.tsx # Conversation context
│
└── constants/
    ├── chat.ts                # Chat constants
    ├── prompts.ts             # Suggested prompts
    └── quickActions.ts        # Quick action definitions
```

### 6.2 Key Files Content

#### 6.2.1 ChatPage.tsx
```typescript
import React from 'react';
import { ChatLayout } from '@/components/chat/layout/ChatLayout';
import { ChatProvider } from '@/contexts/ChatContext';
import { useAuth } from '@/hooks/useAuth';

export default function ChatPage() {
  const { user } = useAuth();
  
  return (
    <ChatProvider userId={user.id}>
      <ChatLayout />
    </ChatProvider>
  );
}
```

#### 6.2.2 useChat.ts
```typescript
import { useState, useEffect, useCallback } from 'react';
import { useConversations } from './useConversations';
import { useMessages } from './useMessages';
import { useStreaming } from './useStreaming';

export const useChat = (conversationId?: string) => {
  const { 
    conversations, 
    currentConversation,
    createConversation,
    updateConversation,
    deleteConversation
  } = useConversations();
  
  const {
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    loadMoreMessages
  } = useMessages(conversationId);
  
  const {
    isStreaming,
    streamingContent,
    startStreaming
  } = useStreaming();
  
  const handleSendMessage = useCallback(async (
    content: string,
    attachments?: File[]
  ) => {
    const newConversation = currentConversation || await createConversation();
    
    await sendMessage(newConversation.id, content, attachments);
    
    // Start streaming AI response
    startStreaming(newConversation.id);
  }, [currentConversation, createConversation, sendMessage, startStreaming]);
  
  return {
    conversations,
    currentConversation,
    messages,
    isStreaming,
    streamingContent,
    sendMessage: handleSendMessage,
    editMessage,
    deleteMessage,
    loadMoreMessages,
    updateConversation,
    deleteConversation
  };
};
```

#### 6.2.3 types/chat.ts
```typescript
export interface Message {
  id: string;
  conversationId: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  author: Author;
  metadata?: MessageMetadata;
  attachments?: Attachment[];
  feedback?: Feedback;
  isEdited?: boolean;
  editHistory?: EditHistory[];
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  category?: ConversationCategory;
  tags?: string[];
  status: ConversationStatus;
  isPinned: boolean;
  messageCount: number;
  messages?: Message[];
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  role: 'user' | 'assistant' | 'system';
}

export interface MessageMetadata {
  tokens?: number;
  model?: string;
  latency?: number;
  streamingComplete?: boolean;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: Date;
  processedContent?: string;
}

export interface Feedback {
  rating: 'positive' | 'negative';
  comment?: string;
  timestamp: Date;
}

export type ConversationCategory = 
  | 'resume'
  | 'interview'
  | 'career-planning'
  | 'job-search'
  | 'networking'
  | 'skills'
  | 'general';

export type ConversationStatus = 'active' | 'archived' | 'deleted';
```

#### 6.2.4 constants/quickActions.ts
```typescript
import { 
  FileText, 
  Briefcase, 
  Target, 
  BarChart, 
  DollarSign, 
  PenLine,
  Linkedin,
  Search
} from 'lucide-react';
import type { QuickAction } from '@/types/chat';

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'resume-review',
    title: 'Resume Review',
    description: 'Upload your resume for AI-powered feedback',
    icon: FileText,
    prompt: 'Please review my resume and provide detailed feedback on content, formatting, and ATS compatibility.',
    requiresUpload: true,
    category: 'resume'
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep',
    description: 'Prepare for your upcoming interview',
    icon: Briefcase,
    prompt: 'Help me prepare for an interview. I need practice questions and tips.',
    requiresUpload: false,
    category: 'interview'
  },
  {
    id: 'career-advice',
    title: 'Career Advice',
    description: 'Get personalized career guidance',
    icon: Target,
    prompt: 'I need career advice. Can you help me plan my next steps?',
    requiresUpload: false,
    category: 'career'
  },
  {
    id: 'skill-analysis',
    title: 'Skill Analysis',
    description: 'Identify skill gaps for your target role',
    icon: BarChart,
    prompt: 'Help me identify skill gaps for my target role and create a learning plan.',
    requiresUpload: false,
    category: 'career'
  },
  {
    id: 'salary-negotiation',
    title: 'Salary Tips',
    description: 'Learn how to negotiate effectively',
    icon: DollarSign,
    prompt: 'Give me tips on salary negotiation and how to ask for a higher offer.',
    requiresUpload: false,
    category: 'career'
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter',
    description: 'Write or improve your cover letter',
    icon: PenLine,
    prompt: 'Help me write a compelling cover letter for a job application.',
    requiresUpload: true,
    category: 'resume'
  },
  {
    id: 'linkedin-optimization',
    title: 'LinkedIn Help',
    description: 'Optimize your LinkedIn profile',
    icon: Linkedin,
    prompt: 'Help me optimize my LinkedIn profile to attract recruiters.',
    requiresUpload: false,
    category: 'search'
  },
  {
    id: 'job-strategy',
    title: 'Job Strategy',
    description: 'Develop an effective job search plan',
    icon: Search,
    prompt: 'Help me create an effective job search strategy.',
    requiresUpload: false,
    category: 'search'
  }
];
```

---

## 7. Responsive Design

### 7.1 Breakpoint Strategy

```typescript
// tailwind.config.js
export default {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet portrait
      'lg': '1024px',  // Tablet landscape / Small desktop
      'xl': '1280px',  // Desktop
      '2xl': '1536px'  // Large desktop
    }
  }
}
```

### 7.2 Layout Adjustments

#### Desktop (1024px+)
```css
.chat-layout {
  @apply grid grid-cols-[280px_1fr] gap-0;
}

.chat-sidebar {
  @apply block border-r;
}

.message-bubble {
  @apply max-w-[70%];
}

.quick-actions-grid {
  @apply grid-cols-4 gap-4;
}
```

#### Tablet (768px - 1023px)
```css
.chat-layout {
  @apply grid grid-cols-1;
}

.chat-sidebar {
  @apply fixed left-0 top-0 h-full w-[280px] z-40
         transform transition-transform duration-300
         -translate-x-full data-[open=true]:translate-x-0;
}

.message-bubble {
  @apply max-w-[80%];
}

.quick-actions-grid {
  @apply grid-cols-2 gap-3;
}
```

#### Mobile (<768px)
```css
.chat-layout {
  @apply flex flex-col h-screen;
}

.chat-sidebar {
  @apply fixed inset-0 z-50
         transform transition-transform duration-300
         -translate-x-full data-[open=true]:translate-x-0;
}

.message-bubble {
  @apply max-w-[85%];
}

.quick-actions-grid {
  @apply grid-cols-1 gap-2;
}

.chat-input-area {
  @apply fixed bottom-0 left-0 right-0 
         bg-white border-t p-3;
}
```

### 7.3 Touch Interactions

```typescript
// Swipe to open/close sidebar
const useSidebarSwipe = () => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - close sidebar
      closeSidebar();
    }
    
    if (touchEnd - touchStart > 75) {
      // Swipe right - open sidebar
      openSidebar();
    }
  };
  
  return { handleTouchStart, handleTouchMove, handleTouchEnd };
};
```

### 7.4 Keyboard Navigation

```typescript
// Keyboard shortcuts
const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K: Focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        focusSearch();
      }
      
      // Cmd/Ctrl + N: New conversation
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        createNewConversation();
      }
      
      // Cmd/Ctrl + Enter: Send message
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        sendMessage();
      }
      
      // Escape: Close modal/sidebar
      if (e.key === 'Escape') {
        closeOverlays();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
```

---

## 8. Accessibility Considerations

### 8.1 WCAG 2.1 AA Compliance

#### Color Contrast
- Text: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio

```css
/* Good contrast examples */
.user-message {
  @apply bg-blue-600 text-white; /* 7.3:1 ratio */
}

.ai-message {
  @apply bg-gray-100 text-gray-900; /* 14.1:1 ratio */
}
```

#### Keyboard Navigation
- All interactive elements focusable
- Focus indicators visible
- Logical tab order
- Skip navigation links

```tsx
<button
  className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  aria-label="Send message"
>
  Send
</button>
```

### 8.2 Screen Reader Support

#### ARIA Labels
```tsx
// Chat input
<textarea
  aria-label="Type your message"
  aria-describedby="input-help"
  aria-required="true"
/>
<span id="input-help" className="sr-only">
  Press Ctrl+Enter to send, Shift+Enter for new line
</span>

// Message list
<div role="log" aria-live="polite" aria-label="Conversation messages">
  {messages.map(message => (
    <article
      key={message.id}
      aria-label={`Message from ${message.author.name}`}
    >
      {message.content}
    </article>
  ))}
</div>

// Loading state
<div role="status" aria-live="polite">
  <span className="sr-only">AI is typing a response</span>
  <StreamingIndicator />
</div>
```

#### Semantic HTML
```tsx
<main aria-label="Chat interface">
  <aside aria-label="Conversation history">
    <nav aria-label="Conversations">
      <ul>
        {conversations.map(conv => (
          <li key={conv.id}>
            <button aria-current={isActive ? 'page' : undefined}>
              {conv.title}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
  
  <section aria-label="Current conversation">
    <h1 className="sr-only">{conversationTitle}</h1>
    {/* Messages */}
  </section>
</main>
```

### 8.3 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Focus search |
| `Cmd/Ctrl + N` | New conversation |
| `Cmd/Ctrl + Enter` | Send message |
| `Shift + Enter` | New line in message |
| `Escape` | Close modal/drawer |
| `Tab` | Navigate forward |
| `Shift + Tab` | Navigate backward |
| `Arrow Up/Down` | Navigate conversation list |
| `/` | Focus message input |

---

## 9. Performance Optimization

### 9.1 Code Splitting

```typescript
// Lazy load chat components
const ChatPage = lazy(() => import('@/pages/ChatPage'));
const FileUploadModal = lazy(() => import('@/components/chat/upload/FileUploadModal'));
const ExportModal = lazy(() => import('@/components/chat/export/ExportModal'));

// Route-based code splitting
<Route
  path="/chat"
  element={
    <Suspense fallback={<LoadingSpinner />}>
      <ChatPage />
    </Suspense>
  }
/>
```

### 9.2 Virtual Scrolling

```typescript
// For long message lists
import { useVirtualizer } from '@tanstack/react-virtual';

const MessageList = ({ messages }: { messages: Message[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated message height
    overscan: 5 // Render 5 extra items outside viewport
  });
  
  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map(virtualItem => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            <MessageBubble message={messages[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 9.3 Memoization

```typescript
// Memoize expensive components
const MessageBubble = memo(({ message }: { message: Message }) => {
  // Component code
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.message.id === nextProps.message.id &&
         prevProps.message.content === nextProps.message.content;
});

// Memoize expensive calculations
const formattedMessages = useMemo(() => {
  return messages.map(msg => ({
    ...msg,
    formattedDate: formatDate(msg.createdAt),
    processedContent: processMarkdown(msg.content)
  }));
}, [messages]);

// Memoize callbacks
const handleSendMessage = useCallback((content: string) => {
  sendMessage(conversationId, content);
}, [conversationId, sendMessage]);
```

### 9.4 Image & Asset Optimization

```typescript
// Lazy load images
<img
  src={message.author.avatar}
  loading="lazy"
  alt={message.author.name}
  className="w-10 h-10 rounded-full"
/>

// Use WebP with fallback
<picture>
  <source srcSet="/avatar.webp" type="image/webp" />
  <img src="/avatar.png" alt="Avatar" />
</picture>
```

### 9.5 Debouncing & Throttling

```typescript
// Debounce search input
const debouncedSearch = useDebouncedCallback(
  (query: string) => {
    searchConversations(query);
  },
  300 // 300ms delay
);

// Throttle auto-save
const throttledSave = useThrottledCallback(
  (draft: string) => {
    saveDraftToLocalStorage(conversationId, draft);
  },
  1000 // Max once per second
);

// Auto-scroll throttling
const throttledScrollToBottom = useThrottledCallback(
  () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  },
  100
);
```

---

## 10. Integration Points

### 10.1 Backend Services

#### Convex Integration
```typescript
// convex/messages.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// Query messages
export const getMessages = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, { conversationId }) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_conversation', (q) => 
        q.eq('conversationId', conversationId)
      )
      .order('desc')
      .take(50);
  },
});

// Send message
export const sendMessage = mutation({
  args: {
    conversationId: v.id('conversations'),
    content: v.string(),
    type: v.union(v.literal('user'), v.literal('ai')),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert('messages', {
      ...args,
      createdAt: Date.now(),
      author: await ctx.auth.getUserIdentity(),
    });
    
    return messageId;
  },
});
```

#### React Integration
```typescript
// Using Convex React hooks
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const ChatMessages = ({ conversationId }: { conversationId: Id<'conversations'> }) => {
  const messages = useQuery(api.messages.getMessages, { conversationId });
  const sendMessage = useMutation(api.messages.sendMessage);
  
  const handleSend = async (content: string) => {
    await sendMessage({
      conversationId,
      content,
      type: 'user'
    });
  };
  
  return (
    <div>
      {messages?.map(msg => (
        <MessageBubble key={msg._id} message={msg} />
      ))}
    </div>
  );
};
```

### 10.2 AI Service Integration

```typescript
// AI streaming integration
const streamAIResponse = async (
  conversationId: string,
  userMessage: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void
) => {
  const response = await fetch('/api/ai/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conversationId,
      message: userMessage,
      context: await getConversationContext(conversationId)
    })
  });
  
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  if (!reader) return;
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete();
        break;
      }
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          
          if (data.type === 'content') {
            onChunk(data.content);
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  }
};
```

### 10.3 Authentication Integration

```typescript
// Auth context integration
const ChatPage = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <ChatProvider userId={user.id}>
      <ChatLayout />
    </ChatProvider>
  );
};

// Protected API calls
const apiClient = {
  async sendMessage(conversationId: string, content: string) {
    const token = await getAuthToken();
    
    return fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
  }
};
```

### 10.4 Document Editor Integration

```typescript
// Link to document editor from chat
const handleOpenInEditor = (documentId: string) => {
  navigate(`/documents/${documentId}/edit`);
};

// Create document from chat suggestion
const handleCreateDocument = async (template: string) => {
  const document = await createDocument({
    title: 'Untitled Document',
    template,
    createdFrom: 'ai-chat'
  });
  
  navigate(`/documents/${document.id}/edit`);
};

// Import document context into chat
const handleImportDocument = async (documentId: string) => {
  const document = await fetchDocument(documentId);
  
  sendMessage(
    `Please review this document:\n\n${document.content}`,
    [{ id: documentId, type: 'document' }]
  );
};
```

### 10.5 Notification Integration

```typescript
// Toast notifications
import { toast } from 'sonner';

// Success notification
toast.success('Message sent successfully');

// Error notification
toast.error('Failed to send message', {
  description: 'Please check your connection and try again',
  action: {
    label: 'Retry',
    onClick: () => retrySendMessage()
  }
});

// Loading notification
const toastId = toast.loading('Uploading file...');
// Later
toast.success('File uploaded', { id: toastId });

// Custom AI notification
toast.custom((t) => (
  <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-lg">
    <Bot className="w-6 h-6 text-blue-600" />
    <div>
      <p className="font-medium">AI Response Ready</p>
      <p className="text-sm text-gray-600">Your career analysis is complete</p>
    </div>
  </div>
));
```

---

## Appendix

### A. Icon Reference

All icons from `lucide-react`:

```typescript
import {
  MessageSquare,    // Chat icon
  Send,            // Send button
  Paperclip,       // Attachment
  Mic,             // Voice input
  Smile,           // Emoji
  Plus,            // New conversation
  Search,          // Search
  MoreVertical,    // Menu
  Edit2,           // Edit
  Trash2,          // Delete
  Star,            // Pin/Favorite
  Download,        // Export
  Share2,          // Share
  Copy,            // Copy
  Check,           // Checkmark
  X,               // Close
  ChevronLeft,     // Back
  ChevronRight,    // Forward
  ChevronDown,     // Expand
  ChevronUp,       // Collapse
  Settings,        // Settings
  User,            // User avatar
  Bot,             // AI avatar
  FileText,        // Document
  Image,           // Image
  AlertCircle,     // Error
  Info,            // Information
  Loader2,         // Loading
  ThumbsUp,        // Positive feedback
  ThumbsDown,      // Negative feedback
} from 'lucide-react';
```

### B. Color Palette Reference

```typescript
export const colors = {
  // Primary
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Neutral
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
  
  // Success
  green: {
    500: '#10b981',
    600: '#059669',
  },
  
  // Warning
  yellow: {
    500: '#f59e0b',
    600: '#d97706',
  },
  
  // Error
  red: {
    500: '#ef4444',
    600: '#dc2626',
  },
};
```

### C. Animation Reference

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse (for typing indicator) */
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* Spin (for loading) */
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

## Implementation Checklist

### Phase 1: Core Chat Interface
- [ ] ChatLayout component
- [ ] ChatSidebar with conversation list
- [ ] ChatMessagesArea with message display
- [ ] MessageBubble component
- [ ] ChatInputArea with send functionality
- [ ] Basic message sending/receiving

### Phase 2: Enhanced Features
- [ ] Real-time message streaming
- [ ] Markdown rendering
- [ ] Code syntax highlighting
- [ ] File upload functionality
- [ ] Quick actions panel
- [ ] Suggested prompts

### Phase 3: Advanced Features
- [ ] Conversation management (rename, delete, pin)
- [ ] Export conversations
- [ ] Share conversations
- [ ] Search conversations
- [ ] Message editing
- [ ] Feedback system

### Phase 4: Polish & Optimization
- [ ] Responsive design refinement
- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] Error handling
- [ ] Offline support
- [ ] Analytics integration

---

**Document End**

*This UI plan is a living document and will be updated as the CareerSU platform evolves.*
