# Document Editor & Management UI Plan
## CareerSU Platform

**Version:** 1.0  
**Last Updated:** 2025-11-07  
**Status:** Planning Phase

---

## Table of Contents

1. [Overview](#overview)
2. [Screen Inventory](#screen-inventory)
3. [Component Breakdown](#component-breakdown)
4. [Detailed Specifications](#detailed-specifications)
5. [User Flows](#user-flows)
6. [Data Requirements](#data-requirements)
7. [File Structure](#file-structure)
8. [Technical Considerations](#technical-considerations)
9. [Accessibility](#accessibility)
10. [Performance](#performance)

---

## Overview

### Purpose
The Document Editor and Management system is the core feature of CareerSU, providing users with a professional, AI-powered environment to create, edit, and manage career documents (resumes, cover letters, professional portfolios).

### Key Objectives
- Provide a Word-like editing experience in the browser
- Integrate AI-powered optimization and suggestions
- Enable seamless template usage and customization
- Support version control and collaboration
- Offer multiple export formats (PDF, DOCX, TXT)
- Ensure responsive design across all devices

### Target Users
- **Job Seekers**: Creating and optimizing resumes/cover letters
- **Career Coaches**: Reviewing and providing feedback on client documents

---

## Screen Inventory

### 1. Documents List Page
**Route:** `/documents`

**Purpose:** Central hub for viewing and managing all user documents

**Key Features:**
- Grid/List view toggle
- Document cards with previews
- Quick actions (edit, duplicate, delete, export)
- Search and filter functionality
- Sort options (date, name, type, status)
- Create new document button
- Bulk actions (select multiple, delete, export)

**Layout:**
```
+----------------------------------------------------------+
|  Header (Navigation, User Menu)                           |
+----------------------------------------------------------+
|  Documents Page                                           |
|  +------------------------------------------------------+ |
|  | [+ New Document] [Templates] [Grid/List] [Search]    | |
|  +------------------------------------------------------+ |
|  | Filters: [All] [Resume] [Cover Letter] [Portfolio]   | |
|  | Sort: [Recent] [Name] [Modified]                      | |
|  +------------------------------------------------------+ |
|  |                                                        | |
|  | +-------------+  +-------------+  +-------------+     | |
|  | | Document 1  |  | Document 2  |  | Document 3  |     | |
|  | | [Preview]   |  | [Preview]   |  | [Preview]   |     | |
|  | | Resume      |  | Cover Letter|  | Resume      |     | |
|  | | 2 days ago  |  | 5 days ago  |  | 1 week ago  |     | |
|  | | [Edit][...] |  | [Edit][...] |  | [Edit][...] |     | |
|  | +-------------+  +-------------+  +-------------+     | |
|  |                                                        | |
|  | +-------------+  +-------------+  +-------------+     | |
|  | | Document 4  |  | Document 5  |  | Document 6  |     | |
|  | +-------------+  +-------------+  +-------------+     | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### 2. Document Editor Page
**Route:** `/documents/:id/edit`

**Purpose:** Full-featured document editing environment

**Key Features:**
- Rich text editor with formatting toolbar
- AI suggestion panel (collapsible)
- Template selection
- Version history sidebar
- Auto-save indicator
- Export options
- Collaboration tools (comments, sharing)
- Full-screen mode
- Zoom controls

**Layout:**
```
+----------------------------------------------------------+
|  Editor Toolbar                                           |
|  [Format] [Insert] [Tools] [AI] [View] [Share] [Export] |
+----------------------------------------------------------+
|                    |                        |             |
|  Template Panel    |  Editor Canvas        | AI Panel    |
|  (Collapsible)     |                        | (Toggle)    |
|                    |  [Document Content]    |             |
|  - Resume          |   Lorem ipsum...       | Suggestions:|
|  - Cover Letter    |   Professional         | - Improve   |
|  - Blank           |   experience in...     | - Optimize  |
|                    |                        | - Fix       |
|  [Apply Template]  |  [Auto-save: On]      | [Apply All] |
|                    |                        |             |
+----------------------------------------------------------+
|  Status Bar: Words: 342 | Characters: 1,892 | Auto-saved |
+----------------------------------------------------------+
```

### 3. Template Selection Modal
**Trigger:** Click "New Document" or "Use Template" button

**Purpose:** Browse and select from professional templates

**Key Features:**
- Template preview
- Category filtering (Resume, Cover Letter, Portfolio)
- Industry-specific templates
- Blank template option
- Template customization preview
- Search functionality

**Layout:**
```
+----------------------------------------------------------+
|  Choose a Template                               [X]     |
+----------------------------------------------------------+
|  [Search templates...]                                    |
|  Categories: [All] [Resume] [Cover Letter] [Portfolio]   |
+----------------------------------------------------------+
|                                                           |
|  +-------------+  +-------------+  +-------------+        |
|  | Professional|  | Modern      |  | Creative    |        |
|  | Resume      |  | Resume      |  | Resume      |        |
|  | [Preview]   |  | [Preview]   |  | [Preview]   |        |
|  | [Use]       |  | [Use]       |  | [Use]       |        |
|  +-------------+  +-------------+  +-------------+        |
|                                                           |
|  +-------------+  +-------------+  +-------------+        |
|  | Corporate   |  | Tech        |  | Blank       |        |
|  | Cover Letter|  | Resume      |  | Document    |        |
|  | [Preview]   |  | [Preview]   |  | [Use]       |        |
|  | [Use]       |  | [Use]       |  |             |        |
|  +-------------+  +-------------+  +-------------+        |
|                                                           |
+----------------------------------------------------------+
|                    [Cancel]  [Start from Blank]          |
+----------------------------------------------------------+
```

### 4. Version History Panel
**Location:** Sidebar in editor

**Purpose:** Track and restore previous versions

**Key Features:**
- Chronological version list
- Version comparison (diff view)
- Restore functionality
- Auto-saved versions
- Manual save points
- Version naming/tagging
- Version metadata (date, author, changes)

**Layout:**
```
+---------------------------+
| Version History      [X]  |
+---------------------------+
| [Current Version]         |
|                           |
| ⚫ Auto-save              |
|    Nov 7, 2:34 PM         |
|    Minor edits            |
|    [View] [Restore]       |
|                           |
| ⚪ Manual Save            |
|    Nov 7, 1:15 PM         |
|    "Added experience"     |
|    [View] [Restore]       |
|                           |
| ⚪ Auto-save              |
|    Nov 7, 12:45 PM        |
|    Formatting changes     |
|    [View] [Restore]       |
|                           |
| ⚪ Manual Save            |
|    Nov 6, 4:20 PM         |
|    "Initial draft"        |
|    [View] [Restore]       |
|                           |
| [Load More]               |
+---------------------------+
```

### 5. Export Dialog
**Trigger:** Click "Export" button

**Purpose:** Download document in various formats

**Key Features:**
- Format selection (PDF, DOCX, TXT, HTML)
- Quality settings
- Page layout options
- Filename customization
- Download preview
- Batch export (multiple documents)

**Layout:**
```
+----------------------------------------------------------+
|  Export Document                                 [X]     |
+----------------------------------------------------------+
|                                                           |
|  Document: "Software Engineer Resume"                    |
|                                                           |
|  Format:                                                  |
|  ( ) PDF - Best for sharing and printing                 |
|  (•) DOCX - Editable Microsoft Word format               |
|  ( ) TXT - Plain text                                    |
|  ( ) HTML - Web format                                   |
|                                                           |
|  Options:                                                 |
|  [✓] Include metadata                                    |
|  [✓] Optimize for printing                               |
|  [ ] Password protect (PDF only)                         |
|                                                           |
|  Page Setup:                                              |
|  Size: [US Letter ▾]   Margins: [Normal ▾]              |
|                                                           |
|  Filename:                                                |
|  [Software_Engineer_Resume_2025.docx]                    |
|                                                           |
|  +-----------------------------------------------------+  |
|  |  [Preview]                                          |  |
|  |  Page 1 of 1                                        |  |
|  +-----------------------------------------------------+  |
|                                                           |
+----------------------------------------------------------+
|                    [Cancel]  [Download]                  |
+----------------------------------------------------------+
```

---

## Component Breakdown

### Documents List Components

#### 1. DocumentsPageHeader
**Purpose:** Main navigation and actions for documents page

**Elements:**
- Title: "My Documents"
- New Document button (primary CTA)
- Templates button
- View toggle (Grid/List)
- Search input
- Filter dropdown

**Props:**
```typescript
interface DocumentsPageHeaderProps {
  onNewDocument: () => void;
  onOpenTemplates: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterOptions: FilterOption[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}
```

**Styling:**
- Background: white
- Border-bottom: 1px solid gray-200
- Padding: 16px 24px
- Height: 72px
- Sticky positioning at top

#### 2. DocumentCard
**Purpose:** Display individual document with preview and actions

**Elements:**
- Document thumbnail/preview
- Document title (editable inline)
- Document type badge
- Last modified date
- Action menu (Edit, Duplicate, Delete, Export, Share)
- Selection checkbox (for bulk actions)
- Status indicators (Draft, Shared, Archived)

**Props:**
```typescript
interface DocumentCardProps {
  document: Document;
  viewMode: 'grid' | 'list';
  isSelected: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onExport: (id: string) => void;
  onShare: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}
```

**Styling - Grid Mode:**
- Card size: 280px width x 360px height
- Border-radius: 8px
- Box-shadow: 0 1px 3px rgba(0,0,0,0.1)
- Hover: shadow-md transition
- Preview: 280px x 200px

**Styling - List Mode:**
- Full width
- Height: 80px
- Horizontal layout
- Preview: 60px x 80px thumbnail

#### 3. DocumentsGrid
**Purpose:** Container for document cards in grid layout

**Props:**
```typescript
interface DocumentsGridProps {
  documents: Document[];
  viewMode: 'grid' | 'list';
  selectedIds: string[];
  onSelectDocument: (id: string) => void;
  onEditDocument: (id: string) => void;
  loading: boolean;
  emptyState?: React.ReactNode;
}
```

**Styling:**
- Display: grid (grid mode) or flex column (list mode)
- Grid columns: auto-fill, minmax(280px, 1fr)
- Gap: 24px (grid), 12px (list)
- Padding: 24px

#### 4. DocumentsFilters
**Purpose:** Advanced filtering and sorting controls

**Elements:**
- Type filter (All, Resume, Cover Letter, Portfolio)
- Status filter (Draft, Published, Archived)
- Date range picker
- Sort options (Recent, Name A-Z, Modified, Created)
- Clear filters button

**Props:**
```typescript
interface DocumentsFiltersProps {
  filters: DocumentFilters;
  onFilterChange: (filters: DocumentFilters) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}
```

#### 5. BulkActions
**Purpose:** Actions for multiple selected documents

**Elements:**
- Selected count display
- Bulk delete button
- Bulk export button
- Bulk move to folder
- Clear selection

**Props:**
```typescript
interface BulkActionsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkExport: () => void;
  onClearSelection: () => void;
}
```

### Document Editor Components

#### 6. EditorToolbar
**Purpose:** Main formatting and editing controls

**Sections:**
1. **Format Controls:**
   - Font family dropdown
   - Font size selector
   - Bold, Italic, Underline, Strikethrough
   - Text color picker
   - Background color picker
   - Clear formatting

2. **Paragraph Controls:**
   - Heading levels (H1-H6)
   - Alignment (Left, Center, Right, Justify)
   - Lists (Bullet, Numbered)
   - Indent/Outdent
   - Line spacing

3. **Insert Controls:**
   - Link
   - Image
   - Table
   - Horizontal rule
   - Page break
   - Special characters

4. **Tools:**
   - Find and replace
   - Word count
   - Spell check
   - Grammar check

5. **AI Controls:**
   - AI suggestions toggle
   - Optimize selection
   - Rewrite section
   - Improve clarity

6. **View Controls:**
   - Zoom (50%-200%)
   - Full-screen mode
   - Focus mode
   - Preview

7. **Document Actions:**
   - Save manually
   - Version history
   - Share
   - Export
   - Print

**Props:**
```typescript
interface EditorToolbarProps {
  formatState: FormatState;
  onFormat: (command: FormatCommand) => void;
  onInsert: (type: InsertType) => void;
  onAIAction: (action: AIAction) => void;
  viewSettings: ViewSettings;
  onViewChange: (settings: ViewSettings) => void;
  documentMeta: DocumentMeta;
  onSave: () => void;
  onExport: () => void;
  onShare: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}
```

**Styling:**
- Height: 56px (collapsed), up to 112px (with second row)
- Background: white
- Border-bottom: 1px solid gray-200
- Sticky position at top
- Grouped buttons with separators
- Icon buttons: 32px x 32px
- Dropdowns: min-width 120px
- Tooltips on all controls

#### 7. EditorCanvas
**Purpose:** Main document editing area

**Features:**
- Rich text editing with contentEditable
- Inline formatting
- Drag and drop support
- Paste from Word support
- Auto-formatting
- Real-time spell check
- Grammar highlighting
- Page layout with margins
- Print preview styling

**Props:**
```typescript
interface EditorCanvasProps {
  content: EditorContent;
  onChange: (content: EditorContent) => void;
  readOnly: boolean;
  className?: string;
  onSelectionChange: (selection: Selection) => void;
  editorRef: React.RefObject<HTMLDivElement>;
  spellCheck: boolean;
  autoFocus: boolean;
}
```

**Styling:**
- Max-width: 8.5in (letter size) or A4
- Min-height: 11in
- Background: white
- Padding: 1in (mimics page margins)
- Box-shadow: page effect
- Font: Professional (default: Inter or Arial)
- Line-height: 1.5
- Responsive on mobile (full width, reduced margins)

#### 8. AISuggestionsPanel
**Purpose:** Display AI-powered suggestions and improvements

**Elements:**
- Panel toggle button
- Suggestion categories tabs:
  - Grammar & Spelling
  - Clarity & Conciseness
  - Impact & Power Words
  - ATS Optimization
  - Industry Keywords
- Individual suggestion cards with:
  - Issue description
  - Before/After preview
  - Accept/Reject buttons
  - Explanation
- Bulk actions (Accept All, Reject All)
- Suggestion count badge

**Props:**
```typescript
interface AISuggestionsPanelProps {
  suggestions: AISuggestion[];
  isOpen: boolean;
  onToggle: () => void;
  onAcceptSuggestion: (id: string) => void;
  onRejectSuggestion: (id: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  loading: boolean;
  selectedText?: string;
  onOptimizeSelection: () => void;
}
```

**Styling:**
- Width: 320px (desktop), full width (mobile)
- Background: gray-50
- Border-left: 1px solid gray-200
- Overflow-y: auto
- Suggestion card: white background, rounded, shadow-sm
- Category tabs: horizontal scrollable on mobile

#### 9. TemplateSelector
**Purpose:** Browse and apply document templates

**Elements:**
- Template grid/list
- Category filter
- Search input
- Template preview modal
- Template metadata (name, description, industry)
- Apply button
- Favorite/star templates

**Props:**
```typescript
interface TemplateSelectorProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
  onPreview: (template: Template) => void;
  category?: string;
  searchQuery?: string;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
}
```

**Layout:**
- Modal: 90vw x 80vh (max-width: 1200px)
- Template cards: 280px x 360px
- Grid: 3-4 columns on desktop
- Preview: split view (template + metadata)

#### 10. VersionHistorySidebar
**Purpose:** View and manage document versions

**Elements:**
- Version list (chronological)
- Version comparison view
- Restore button
- Version metadata:
  - Timestamp
  - Author
  - Changes summary
  - Manual/Auto save indicator
- Search versions
- Filter (auto-save, manual, major changes)
- Version naming/tagging
- Diff highlighting (additions/deletions)

**Props:**
```typescript
interface VersionHistorySidebarProps {
  versions: DocumentVersion[];
  currentVersionId: string;
  onRestore: (versionId: string) => void;
  onCompare: (versionId1: string, versionId2: string) => void;
  onNameVersion: (versionId: string, name: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}
```

**Styling:**
- Width: 320px
- Background: white
- Border-left: 1px solid gray-200
- Version item: padding 12px, hover background
- Current version: blue highlight
- Diff view: green (additions), red (deletions)

#### 11. ExportDialog
**Purpose:** Configure and download documents

**Elements:**
- Format selection radio group
- Format-specific options
- Page setup (size, orientation, margins)
- Filename input
- Preview pane
- Download button
- Multiple document selection (batch export)

**Props:**
```typescript
interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  onExport: (config: ExportConfig) => Promise<void>;
  formats: ExportFormat[];
}
```

**Styling:**
- Modal: 600px width
- Preview: 400px x 500px
- Format icons and descriptions
- Download button: primary, prominent

#### 12. CollaborationPanel
**Purpose:** Share documents and manage collaborators

**Elements:**
- Share link generator
- Access control (view, comment, edit)
- Collaborator list
- Permission management
- Comment thread
- @mention support
- Activity log
- Notification settings

**Props:**
```typescript
interface CollaborationPanelProps {
  documentId: string;
  collaborators: Collaborator[];
  comments: Comment[];
  onShare: (config: ShareConfig) => void;
  onAddCollaborator: (email: string, permission: Permission) => void;
  onRemoveCollaborator: (userId: string) => void;
  onAddComment: (text: string, selection?: Selection) => void;
  onResolveComment: (commentId: string) => void;
}
```

#### 13. AutoSaveIndicator
**Purpose:** Show document save status

**States:**
- Saving... (with spinner)
- Saved (with checkmark, fades after 2s)
- Error saving (with retry button)
- Offline (with warning icon)

**Props:**
```typescript
interface AutoSaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error' | 'offline';
  lastSaved?: Date;
  onRetry?: () => void;
}
```

**Styling:**
- Position: fixed bottom-right or in status bar
- Small, unobtrusive
- Color-coded: blue (saving), green (saved), red (error), yellow (offline)

#### 14. KeyboardShortcutsMenu
**Purpose:** Display available keyboard shortcuts

**Categories:**
- General (Save, Print, etc.)
- Formatting (Bold, Italic, etc.)
- Navigation
- Editing
- AI features

**Props:**
```typescript
interface KeyboardShortcutsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}
```

---

## Detailed Specifications

### Visual Design

#### Color Palette
```css
/* Primary Colors */
--primary-blue: #3B82F6;
--primary-blue-hover: #2563EB;
--primary-blue-light: #DBEAFE;

/* Secondary Colors */
--success-green: #10B981;
--warning-yellow: #F59E0B;
--error-red: #EF4444;

/* Neutral Colors */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-500: #6B7280;
--gray-700: #374151;
--gray-900: #111827;

/* Document Canvas */
--canvas-bg: #FFFFFF;
--canvas-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

/* Editor Colors */
--toolbar-bg: #FFFFFF;
--toolbar-border: #E5E7EB;
--editor-selection: rgba(59, 130, 246, 0.2);
--ai-highlight: rgba(16, 185, 129, 0.15);
```

#### Typography
```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-editor: 'Inter', 'Arial', sans-serif;
--font-mono: 'Fira Code', 'Courier New', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

#### Spacing System
```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */

/* Component Spacing */
--toolbar-height: 56px;
--sidebar-width: 320px;
--page-padding: 24px;
--card-padding: 16px;
```

### Editing Capabilities

#### Rich Text Formatting

**Text Formatting:**
- Bold (Ctrl/Cmd + B)
- Italic (Ctrl/Cmd + I)
- Underline (Ctrl/Cmd + U)
- Strikethrough (Ctrl/Cmd + Shift + X)
- Superscript (Ctrl/Cmd + .)
- Subscript (Ctrl/Cmd + ,)
- Clear formatting (Ctrl/Cmd + \)

**Font Controls:**
- Font family: System fonts + Google Fonts
  - Inter (default)
  - Arial
  - Times New Roman
  - Georgia
  - Helvetica
  - Calibri
- Font size: 8pt - 72pt (dropdown + custom input)
- Text color: Color picker + recent colors
- Highlight color: Color picker + highlighter palette

**Paragraph Formatting:**
- Headings: H1, H2, H3, H4, H5, H6
- Paragraph styles: Normal, Title, Subtitle, Quote
- Alignment: Left, Center, Right, Justify
- Lists:
  - Bulleted (disc, circle, square)
  - Numbered (1, 2, 3 / a, b, c / i, ii, iii)
  - Checklist
- Indentation: Increase/Decrease (Tab/Shift+Tab)
- Line spacing: 1.0, 1.15, 1.5, 2.0, custom
- Paragraph spacing: Before/After

**Advanced Formatting:**
- Tables:
  - Insert (rows x columns)
  - Add/remove rows/columns
  - Merge/split cells
  - Table styles and borders
- Links:
  - Insert/Edit (URL + display text)
  - Remove link
  - Open in new tab option
- Images:
  - Upload from device
  - Insert from URL
  - Resize and position
  - Alt text for accessibility
  - Wrap text options
- Special inserts:
  - Horizontal rule
  - Page break
  - Special characters (©, ™, ®, etc.)
  - Date/time stamp

#### Toolbar Organization

**Primary Toolbar (Always Visible):**
```
+----------------------------------------------------------------+
| [Undo] [Redo] | [Font ▾] [Size ▾] [B] [I] [U] | [Color] [BG] |
| [Align ▾] [Lists ▾] [Indent] [Outdent] | [Link] [Image]      |
| [AI ✨] | [View ▾] [Share] [Export] | [···]                 |
+----------------------------------------------------------------+
```

**Contextual Toolbar (On text selection):**
```
+----------------------------------------+
| [B] [I] [U] [Color] [AI Improve] [···] |
+----------------------------------------+
```

**Toolbar Groups:**

1. **History Group:**
   - Undo (Ctrl/Cmd + Z)
   - Redo (Ctrl/Cmd + Y)

2. **Font Group:**
   - Font family dropdown
   - Font size dropdown
   - Bold, Italic, Underline
   - Strikethrough
   - Text color
   - Highlight color

3. **Paragraph Group:**
   - Style/Heading dropdown
   - Alignment buttons
   - List format dropdown
   - Indent/Outdent

4. **Insert Group:**
   - Link
   - Image
   - Table
   - More (dropdown for special characters, etc.)

5. **AI Group:**
   - AI suggestions toggle (shows count badge)
   - Optimize selection
   - Rewrite dropdown (professional, casual, concise)

6. **View Group:**
   - Zoom level
   - Full-screen
   - Focus mode
   - Preview

7. **Actions Group:**
   - Share
   - Export
   - Print
   - More options (...)

### AI Integration Points

#### 1. Real-time Suggestions
**Trigger:** As user types
**Frequency:** Every 3 seconds of inactivity
**Types:**
- Spelling errors (red squiggle)
- Grammar issues (blue squiggle)
- Style improvements (green squiggle)
- ATS optimization hints (purple badge)

**Implementation:**
```typescript
// Debounced AI analysis
const analyzeContent = debounce(async (content: string) => {
  const suggestions = await aiService.analyze({
    content,
    documentType: 'resume',
    analyzeFor: ['grammar', 'clarity', 'ats', 'impact']
  });
  
  setSuggestions(suggestions);
}, 3000);
```

#### 2. AI Optimization Panel
**Sections:**

**Grammar & Spelling:**
- Detects errors
- Suggests corrections
- Provides explanations
- One-click fix

**Clarity & Conciseness:**
- Identifies verbose phrases
- Suggests simpler alternatives
- Highlights passive voice
- Recommends active voice

**Impact & Power Words:**
- Suggests stronger verbs
- Recommends industry keywords
- Identifies weak phrases
- Provides powerful alternatives

**ATS Optimization:**
- Keyword density analysis
- Missing skills detection
- Format compatibility check
- Section structure recommendations

#### 3. AI Writing Assistants

**Rewrite Selection:**
- Professional tone
- Casual tone
- Concise version
- Expanded version
- Bullet points to paragraph
- Paragraph to bullet points

**Auto-Complete:**
- Sentence completion
- Section suggestions
- Template filling

**Content Generation:**
- Job description matching
- Achievement quantification
- Skill elaboration
- Summary generation

**Implementation:**
```typescript
interface AIAction {
  type: 'rewrite' | 'optimize' | 'suggest' | 'complete';
  target: 'selection' | 'document' | 'section';
  tone?: 'professional' | 'casual' | 'concise';
  context?: {
    jobTitle?: string;
    industry?: string;
    targetCompany?: string;
  };
}

const performAIAction = async (action: AIAction, content: string) => {
  const result = await aiService.process(action, content);
  return result;
};
```

### Responsive Behavior

#### Breakpoints
```css
/* Mobile */
@media (max-width: 640px) { /* sm */ }

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) { /* md */ }

/* Desktop */
@media (min-width: 1025px) { /* lg */ }

/* Large Desktop */
@media (min-width: 1280px) { /* xl */ }
```

#### Layout Adaptations

**Mobile (< 640px):**
- Single column layout
- Collapsible toolbar (icon-only)
- Bottom sheet for menus
- Full-width editor canvas
- Reduced margins (0.5in)
- AI panel as modal overlay
- Touch-optimized controls (min 44px)
- Simplified toolbar (essential actions only)

**Tablet (641px - 1024px):**
- Two-column layout possible
- Compact toolbar
- Collapsible sidebars
- Standard margins (0.75in)
- AI panel slides over
- Full toolbar with some grouped items

**Desktop (> 1024px):**
- Three-column layout
- Full toolbar always visible
- Persistent sidebars
- Full margins (1in)
- AI panel side-by-side
- All features accessible

**Component Behavior:**

```typescript
// Example responsive toolbar
const EditorToolbar = () => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  
  if (isMobile) {
    return <MobileToolbar />;
  }
  
  if (isTablet) {
    return <CompactToolbar />;
  }
  
  return <FullToolbar />;
};
```

### Keyboard Shortcuts

#### Document Actions
- `Ctrl/Cmd + S` - Save document
- `Ctrl/Cmd + P` - Print
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` / `Ctrl/Cmd + Shift + Z` - Redo
- `Ctrl/Cmd + F` - Find
- `Ctrl/Cmd + H` - Find and replace
- `Ctrl/Cmd + Shift + S` - Save version
- `Ctrl/Cmd + Shift + E` - Export
- `Ctrl/Cmd + /` - Show keyboard shortcuts

#### Text Formatting
- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + U` - Underline
- `Ctrl/Cmd + Shift + X` - Strikethrough
- `Ctrl/Cmd + K` - Insert link
- `Ctrl/Cmd + \` - Clear formatting
- `Ctrl/Cmd + Shift + 7` - Numbered list
- `Ctrl/Cmd + Shift + 8` - Bulleted list
- `Ctrl/Cmd + ]` - Increase indent
- `Ctrl/Cmd + [` - Decrease indent

#### Paragraph Formatting
- `Ctrl/Cmd + Shift + L` - Align left
- `Ctrl/Cmd + Shift + E` - Align center
- `Ctrl/Cmd + Shift + R` - Align right
- `Ctrl/Cmd + Shift + J` - Justify
- `Ctrl/Cmd + Alt + 1-6` - Heading levels

#### Navigation
- `Ctrl/Cmd + Home` - Go to start
- `Ctrl/Cmd + End` - Go to end
- `Ctrl/Cmd + ←` - Move cursor to word start
- `Ctrl/Cmd + →` - Move cursor to word end

#### AI Features
- `Ctrl/Cmd + Shift + A` - Toggle AI panel
- `Ctrl/Cmd + Shift + O` - Optimize selection
- `Ctrl/Cmd + Shift + R` - Rewrite selection
- `Tab` (in AI suggestion) - Accept suggestion

#### View Controls
- `Ctrl/Cmd + +` - Zoom in
- `Ctrl/Cmd + -` - Zoom out
- `Ctrl/Cmd + 0` - Reset zoom
- `F11` - Full screen
- `Ctrl/Cmd + Shift + F` - Focus mode

#### Implementation
```typescript
const useEditorShortcuts = (editor: Editor) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      
      if (modifier && e.key === 's') {
        e.preventDefault();
        editor.save();
      }
      
      if (modifier && e.key === 'b') {
        e.preventDefault();
        editor.format('bold');
      }
      
      // ... more shortcuts
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editor]);
};
```

### Auto-save Functionality

#### Auto-save Strategy

**Triggers:**
1. **Time-based:** Every 30 seconds of activity
2. **Content-based:** After 50 characters of change
3. **Action-based:** On blur (when leaving editor)
4. **Idle-based:** 3 seconds after last keystroke

**Implementation:**
```typescript
interface AutoSaveConfig {
  interval: number; // milliseconds
  debounceDelay: number;
  minChanges: number; // minimum characters changed
  enabled: boolean;
}

const useAutoSave = (
  content: string,
  onSave: (content: string) => Promise<void>,
  config: AutoSaveConfig
) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const previousContent = useRef(content);
  const saveTimeout = useRef<NodeJS.Timeout>();
  
  const save = useCallback(async () => {
    try {
      setSaveStatus('saving');
      await onSave(content);
      setSaveStatus('saved');
      setLastSaved(new Date());
      previousContent.current = content;
      
      // Reset to idle after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  }, [content, onSave]);
  
  // Debounced save on content change
  useEffect(() => {
    if (!config.enabled) return;
    
    const changes = Math.abs(content.length - previousContent.current.length);
    if (changes < config.minChanges) return;
    
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(save, config.debounceDelay);
    
    return () => clearTimeout(saveTimeout.current);
  }, [content, save, config]);
  
  // Interval-based save
  useEffect(() => {
    if (!config.enabled) return;
    
    const interval = setInterval(() => {
      if (content !== previousContent.current) {
        save();
      }
    }, config.interval);
    
    return () => clearInterval(interval);
  }, [content, save, config]);
  
  return { saveStatus, lastSaved, manualSave: save };
};
```

**Save Indicators:**
```typescript
const AutoSaveIndicator = ({ status, lastSaved }: AutoSaveIndicatorProps) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'saving':
        return (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            <span>Saving...</span>
          </>
        );
      case 'saved':
        return (
          <>
            <Check className="w-4 h-4 text-green-600" />
            <span>Saved {formatRelativeTime(lastSaved)}</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>Error saving</span>
          </>
        );
      case 'offline':
        return (
          <>
            <WifiOff className="w-4 h-4 text-yellow-600" />
            <span>Offline - will save when online</span>
          </>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {getStatusMessage()}
    </div>
  );
};
```

**Offline Support:**
```typescript
const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const pendingChanges = useRef<DocumentChange[]>([]);
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Sync pending changes
      syncPendingChanges();
    };
    
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const syncPendingChanges = async () => {
    while (pendingChanges.current.length > 0) {
      const change = pendingChanges.current[0];
      try {
        await saveToServer(change);
        pendingChanges.current.shift();
      } catch (error) {
        console.error('Failed to sync change:', error);
        break;
      }
    }
  };
  
  return { isOnline, pendingChanges };
};
```

**Version Control Integration:**
- Auto-saves create lightweight versions (not in history by default)
- Major milestones (manual saves) create named versions
- Configurable auto-version creation (every N auto-saves)
- Conflict resolution for concurrent edits

---

## User Flows

### 1. Creating a New Document

**Flow:** User wants to create a resume from scratch

**Steps:**

1. **Entry Point:**
   - User clicks "New Document" button on Documents page
   - OR uses keyboard shortcut `Ctrl/Cmd + N`
   - OR clicks "+" FAB on mobile

2. **Template Selection:**
   ```
   [Documents Page]
        ↓
   Click "New Document"
        ↓
   [Template Selection Modal Opens]
        ↓
   User browses templates
        ↓
   Filter by category: "Resume"
        ↓
   Preview template: "Professional Resume"
        ↓
   Click "Use Template"
   ```

3. **Document Creation:**
   ```
   [Template Selected]
        ↓
   System creates new document with template
        ↓
   Generates unique document ID
        ↓
   Sets initial metadata (title, type, created date)
        ↓
   Redirect to Editor: /documents/{id}/edit
   ```

4. **Initial Edit:**
   ```
   [Editor Opens]
        ↓
   Template content loads
        ↓
   User sees placeholder text
        ↓
   Auto-focus on title/name field
        ↓
   User starts typing
        ↓
   Auto-save kicks in
   ```

5. **AI Assistance (Optional):**
   ```
   User types experience description
        ↓
   AI analyzes content
        ↓
   Suggestions appear in panel
        ↓
   User reviews and applies suggestions
   ```

**Success Criteria:**
- Document created within 2 seconds
- Template applied correctly
- Auto-save activates
- User can immediately start editing

**Error Handling:**
- Template load failure: Show error, offer retry or blank document
- Network error: Create document locally, sync when online
- Invalid template: Fall back to blank document

**User Actions:**
```typescript
interface CreateDocumentFlow {
  // Step 1: Trigger
  onNewDocument: () => void;
  
  // Step 2: Template Selection
  onBrowseTemplates: () => void;
  onSearchTemplates: (query: string) => void;
  onFilterByCategory: (category: DocumentType) => void;
  onPreviewTemplate: (templateId: string) => void;
  onSelectTemplate: (templateId: string) => void;
  onStartBlank: () => void;
  
  // Step 3: Document Creation
  createDocument: (config: CreateDocumentConfig) => Promise<Document>;
  
  // Step 4: Navigate to Editor
  navigateToEditor: (documentId: string) => void;
  
  // Step 5: AI Assistance
  onEnableAI: () => void;
  onApplySuggestion: (suggestionId: string) => void;
}
```

### 2. Editing Existing Document

**Flow:** User wants to edit their resume

**Steps:**

1. **Finding Document:**
   ```
   [Documents Page]
        ↓
   User sees document grid
        ↓
   Option A: Click document card
   Option B: Search for document
   Option C: Filter by type
        ↓
   Click "Edit" on document card
   ```

2. **Loading Editor:**
   ```
   [Redirect to /documents/{id}/edit]
        ↓
   Show loading state
        ↓
   Fetch document content
        ↓
   Load editor with content
        ↓
   Initialize auto-save
        ↓
   Load AI suggestions
   ```

3. **Making Edits:**
   ```
   [Editor Ready]
        ↓
   User selects text
        ↓
   Contextual toolbar appears
        ↓
   User applies formatting
        ↓
   Content updates
        ↓
   Auto-save triggers
   ```

4. **Using Advanced Features:**
   ```
   User highlights paragraph
        ↓
   Clicks "AI Optimize"
        ↓
   AI analyzes selection
        ↓
   Suggestions appear
        ↓
   User accepts/rejects
        ↓
   Content updated
   ```

5. **Finishing Up:**
   ```
   User reviews document
        ↓
   Final auto-save
        ↓
   Option A: Export (go to Export Flow)
   Option B: Return to Documents (click Back)
   Option C: Continue editing
   ```

**Performance Requirements:**
- Document load time: < 1 second
- Edit responsiveness: < 50ms keystroke latency
- Auto-save: < 500ms
- AI suggestions: < 3 seconds

**Interaction Details:**
```typescript
interface EditDocumentFlow {
  // Step 1: Open Document
  onOpenDocument: (documentId: string) => void;
  
  // Step 2: Load Editor
  loadDocument: (documentId: string) => Promise<Document>;
  initializeEditor: (content: EditorContent) => void;
  
  // Step 3: Edit
  onContentChange: (content: EditorContent) => void;
  onFormat: (command: FormatCommand) => void;
  onSelectionChange: (selection: Selection) => void;
  
  // Step 4: AI Features
  onOptimizeSelection: (selection: Selection) => void;
  onAcceptSuggestion: (suggestionId: string) => void;
  
  // Step 5: Finish
  onSave: () => Promise<void>;
  onBack: () => void;
  onExport: () => void;
}
```

### 3. Using Templates

**Flow:** Apply a template to enhance document

**Steps:**

1. **Accessing Templates:**
   ```
   [In Editor]
        ↓
   User clicks "Templates" in toolbar
        ↓
   OR from Documents page: "New from Template"
        ↓
   [Template Browser Opens]
   ```

2. **Browsing Templates:**
   ```
   [Template Browser]
        ↓
   Show all templates in grid
        ↓
   User filters by:
     - Category (Resume, Cover Letter)
     - Industry (Tech, Finance, Creative)
     - Style (Modern, Classic, Creative)
        ↓
   User searches: "software engineer"
        ↓
   Results update in real-time
   ```

3. **Previewing Template:**
   ```
   User clicks template card
        ↓
   [Preview Modal Opens]
        ↓
   Full-size template preview
        ↓
   Template metadata displayed:
     - Name
     - Description
     - Best for (industry/role)
     - Features
        ↓
   Previous/Next navigation
   ```

4. **Applying Template:**
   ```
   User clicks "Use This Template"
        ↓
   [Confirmation Dialog if editing existing doc]
   "This will replace your current formatting. Continue?"
   [Keep Current] [Apply Template]
        ↓
   User confirms
        ↓
   Template applies to document
        ↓
   Content preserved, only formatting changes
        ↓
   Version saved before change
   ```

5. **Customization:**
   ```
   [Template Applied]
        ↓
   User edits content sections
        ↓
   Modifies colors, fonts
        ↓
   Adds/removes sections
        ↓
   Document now personalized
   ```

**Template Structure:**
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  category: 'resume' | 'cover-letter' | 'portfolio';
  industry: string[];
  style: 'modern' | 'classic' | 'creative' | 'minimal';
  thumbnail: string;
  previewUrl: string;
  
  // Template content
  sections: TemplateSection[];
  styles: TemplateStyles;
  layout: TemplateLayout;
  
  // Metadata
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

interface TemplateSection {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'custom';
  title: string;
  content: string;
  placeholder: string;
  required: boolean;
  order: number;
}
```

**User Actions:**
```typescript
interface TemplateFlow {
  // Browse
  onOpenTemplates: () => void;
  onFilterTemplates: (filter: TemplateFilter) => void;
  onSearchTemplates: (query: string) => void;
  
  // Preview
  onPreviewTemplate: (templateId: string) => void;
  onNavigateTemplates: (direction: 'prev' | 'next') => void;
  
  // Apply
  onApplyTemplate: (templateId: string, options: ApplyOptions) => Promise<void>;
  onCancelTemplate: () => void;
  
  // Customize
  onModifySection: (sectionId: string, content: string) => void;
  onChangeStyles: (styles: Partial<TemplateStyles>) => void;
}
```

### 4. AI Optimization Process

**Flow:** Use AI to improve document content

**Steps:**

1. **Activating AI:**
   ```
   [In Editor]
        ↓
   Option A: AI panel auto-opens with suggestions
   Option B: User clicks "AI" button in toolbar
   Option C: User selects text and clicks "Optimize"
        ↓
   [AI Panel Opens]
   ```

2. **Real-time Analysis:**
   ```
   [Typing Content]
        ↓
   Every 3 seconds of inactivity:
        ↓
   Content sent to AI service
        ↓
   AI analyzes for:
     - Grammar errors
     - Clarity issues
     - ATS optimization
     - Impact/power words
        ↓
   Suggestions populate panel
        ↓
   Inline indicators (squiggly lines)
   ```

3. **Reviewing Suggestions:**
   ```
   [AI Panel with Suggestions]
        ↓
   Grouped by category:
   
   📝 Grammar & Spelling (3)
     - "recieve" → "receive"
     - Missing comma
     - Subject-verb agreement
   
   ✨ Clarity (2)
     - Simplify: "utilized" → "used"
     - Active voice suggestion
   
   💪 Impact (5)
     - Power words
     - Quantify achievements
     - Stronger verbs
   
   🎯 ATS Optimization (4)
     - Missing keywords
     - Skill suggestions
     - Format recommendations
        ↓
   User clicks suggestion to preview
        ↓
   Before/After comparison shown
   ```

4. **Applying Suggestions:**
   ```
   User reviews suggestion
        ↓
   Option A: Click "Accept"
     → Content updates immediately
     → Suggestion removed from list
     → Undo available
   
   Option B: Click "Reject"
     → Suggestion removed
     → AI learns preference
   
   Option C: Click "Accept All" (category)
     → All suggestions in category applied
     → Confirmation dialog
     → Can undo in batch
   ```

5. **Targeted Optimization:**
   ```
   User selects specific text
        ↓
   Right-click or toolbar:
   "Optimize Selection"
        ↓
   [Optimization Menu]
     - Make more professional
     - Make more concise
     - Add impact
     - Match job description
     - Quantify achievement
        ↓
   User selects optimization type
        ↓
   AI processes
        ↓
   Multiple alternatives shown
        ↓
   User selects preferred version
   ```

**AI Service Integration:**
```typescript
interface AIOptimizationFlow {
  // Analysis
  analyzeContent: (content: string, options: AnalysisOptions) => Promise<Suggestions>;
  
  // Suggestions
  getSuggestions: (documentId: string) => Promise<AISuggestion[]>;
  onAcceptSuggestion: (suggestionId: string) => void;
  onRejectSuggestion: (suggestionId: string) => void;
  onAcceptAll: (category: string) => void;
  
  // Targeted optimization
  optimizeSelection: (
    text: string,
    type: OptimizationType,
    context?: OptimizationContext
  ) => Promise<string[]>;
  
  // Job matching
  matchToJob: (
    resumeContent: string,
    jobDescription: string
  ) => Promise<MatchAnalysis>;
}

interface AISuggestion {
  id: string;
  category: 'grammar' | 'clarity' | 'impact' | 'ats';
  severity: 'error' | 'warning' | 'suggestion';
  original: string;
  suggestion: string;
  explanation: string;
  position: { start: number; end: number };
  confidence: number;
}

interface MatchAnalysis {
  score: number; // 0-100
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  sectionAnalysis: SectionMatch[];
}
```

**AI Panel States:**
```typescript
type AIPanelState = 
  | { type: 'analyzing'; progress: number }
  | { type: 'suggestions'; count: number; categories: CategoryCount[] }
  | { type: 'empty'; message: string }
  | { type: 'error'; error: string; retry: () => void };

const AISuggestionsPanel = ({ state, suggestions, onAction }: Props) => {
  switch (state.type) {
    case 'analyzing':
      return <LoadingState progress={state.progress} />;
    
    case 'suggestions':
      return (
        <SuggestionsList
          suggestions={suggestions}
          onAccept={onAction.accept}
          onReject={onAction.reject}
        />
      );
    
    case 'empty':
      return <EmptyState message={state.message} />;
    
    case 'error':
      return <ErrorState error={state.error} onRetry={state.retry} />;
  }
};
```

### 5. Exporting Documents

**Flow:** Download document in preferred format

**Steps:**

1. **Initiating Export:**
   ```
   [In Editor or Documents Page]
        ↓
   Option A: Click "Export" button in toolbar
   Option B: Right-click document → "Export"
   Option C: Document card menu → "Export"
   Option D: Keyboard shortcut: Ctrl/Cmd + Shift + E
        ↓
   [Export Dialog Opens]
   ```

2. **Selecting Format:**
   ```
   [Export Dialog]
        ↓
   Format options displayed:
   
   ( ) PDF
       Best for: Sharing, printing, job applications
       Features: Preserves formatting, widely compatible
   
   (•) DOCX
       Best for: Further editing, ATS systems
       Features: Editable, compatible with Word
   
   ( ) TXT
       Best for: Plain text, email pasting
       Features: No formatting, universal
   
   ( ) HTML
       Best for: Web publishing, email
       Features: Keeps basic formatting
        ↓
   User selects format
        ↓
   Format-specific options appear
   ```

3. **Configuring Export:**
   ```
   [DOCX Selected]
        ↓
   Options shown:
   
   ✓ Include metadata
     (Author, created date, keywords)
   
   ✓ Optimize for ATS
     (Simple formatting, standard fonts)
   
   ✓ Embed fonts
     (Ensure consistent display)
   
   Page Setup:
     Size: [US Letter ▾]
     Orientation: [Portrait ▾]
     Margins: [Normal (1") ▾]
   
   Filename:
     [John_Doe_Resume_2025.docx]
     [📁 Choose location]
   ```

4. **Preview & Validate:**
   ```
   [Preview Panel]
        ↓
   Document preview renders
        ↓
   User reviews:
     - Formatting preserved
     - Page breaks correct
     - No content missing
        ↓
   Validation checks:
     ✓ No images too large
     ✓ Links valid
     ✓ Fonts available
     ✓ No unsupported features
        ↓
   Show any warnings/issues
   ```

5. **Downloading:**
   ```
   User clicks "Download"
        ↓
   [Processing State]
   "Generating DOCX..."
   [Progress bar: 0% → 100%]
        ↓
   Document generated on server
        ↓
   File downloads to device
        ↓
   [Success Message]
   "Resume downloaded successfully!"
   [Open File] [Export Another]
        ↓
   Dialog auto-closes after 2s
   ```

**Export Configuration:**
```typescript
interface ExportConfig {
  format: 'pdf' | 'docx' | 'txt' | 'html';
  filename: string;
  
  // Page setup
  pageSize: 'letter' | 'a4' | 'legal';
  orientation: 'portrait' | 'landscape';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // Format-specific options
  pdf?: {
    quality: 'high' | 'medium' | 'low';
    embedFonts: boolean;
    protectDocument: boolean;
    password?: string;
    allowPrinting: boolean;
    allowCopying: boolean;
  };
  
  docx?: {
    includeMetadata: boolean;
    embedFonts: boolean;
    optimizeForATS: boolean;
    compatibility: 'latest' | 'office2016' | 'office2010';
  };
  
  html?: {
    includeStyles: boolean;
    inlineCSS: boolean;
    standalone: boolean;
  };
}

interface ExportFlow {
  onOpenExportDialog: (documentId: string) => void;
  onSelectFormat: (format: ExportFormat) => void;
  onConfigureOptions: (config: Partial<ExportConfig>) => void;
  onPreview: () => Promise<string>; // Returns preview URL
  onExport: (config: ExportConfig) => Promise<Blob>;
  onDownload: (blob: Blob, filename: string) => void;
}
```

**Batch Export:**
```typescript
// For exporting multiple documents
interface BatchExportConfig extends ExportConfig {
  documentIds: string[];
  zipFilename?: string; // If exporting as single ZIP
  individualFiles?: boolean; // Or separate downloads
}

const exportMultiple = async (config: BatchExportConfig) => {
  const files = await Promise.all(
    config.documentIds.map(id => exportDocument(id, config))
  );
  
  if (config.zipFilename) {
    return createZip(files, config.zipFilename);
  }
  
  // Trigger multiple downloads
  files.forEach((blob, index) => {
    downloadFile(blob, `document_${index + 1}.${config.format}`);
  });
};
```

### 6. Version Management

**Flow:** Track changes and restore previous versions

**Steps:**

1. **Accessing Version History:**
   ```
   [In Editor]
        ↓
   User clicks "Version History" icon
        ↓
   OR from toolbar: View → Version History
        ↓
   OR keyboard shortcut: Ctrl/Cmd + Alt + H
        ↓
   [Version History Panel Slides In]
   ```

2. **Viewing Versions:**
   ```
   [Version History Panel]
        ↓
   Versions listed chronologically:
   
   ⚫ Current Version
      Nov 7, 2025, 3:45 PM
      Auto-save
      [Editing now]
   
   ⚪ Version 12
      Nov 7, 2025, 2:30 PM
      Manual save: "Final draft"
      [View] [Restore]
   
   ⚪ Version 11
      Nov 7, 2025, 1:15 PM
      Auto-save
      [View] [Restore]
   
   ⚪ Version 10
      Nov 6, 2025, 4:50 PM
      Manual save: "Added experience"
      [View] [Restore]
        ↓
   User clicks "View" on Version 10
   ```

3. **Comparing Versions:**
   ```
   [Version Comparison View]
        ↓
   Split screen:
   
   Left: Current Version     Right: Version 10
   ────────────────────────────────────────
   Experience                Experience
   
   + Software Engineer II    Software Engineer
     Acme Corp               Acme Corp
     2023 - Present          2022 - Present
   
   - Led team of 5          Led development
   + Increased performance
     by 40%
        ↓
   Green: Additions
   Red: Deletions
   Yellow: Modifications
        ↓
   User reviews changes
   ```

4. **Restoring Version:**
   ```
   User clicks "Restore" on Version 10
        ↓
   [Confirmation Dialog]
   "Restore to this version?"
   
   Your current work will be saved as a new
   version before restoring.
   
   Version: #10 - "Added experience"
   Date: Nov 6, 2025, 4:50 PM
   
   [Cancel] [Restore Version]
        ↓
   User confirms
        ↓
   Current version saved automatically
        ↓
   Version 10 content restored
        ↓
   Editor updates with old content
        ↓
   New version created in history
        ↓
   [Success Message]
   "Version restored successfully"
   ```

5. **Managing Versions:**
   ```
   [Version Context Menu]
        ↓
   Right-click on version:
   
   - View this version
   - Restore this version
   - Compare with current
   - Name this version
   - Download this version
   - Delete this version
        ↓
   User selects "Name this version"
        ↓
   [Inline Edit]
   "Auto-save" → "Draft for Tech Company"
        ↓
   Version renamed
   ```

**Version Data Structure:**
```typescript
interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  
  // Content
  content: EditorContent;
  contentHash: string; // For deduplication
  
  // Metadata
  name?: string; // Optional user-provided name
  createdAt: Date;
  createdBy: User;
  saveType: 'auto' | 'manual' | 'milestone';
  
  // Changes
  changesSummary: string; // AI-generated or manual
  linesAdded: number;
  linesRemoved: number;
  charactersChanged: number;
  
  // Relationships
  parentVersionId?: string;
  tags: string[];
}

interface VersionHistoryFlow {
  // View
  onOpenVersionHistory: () => void;
  loadVersions: (documentId: string) => Promise<DocumentVersion[]>;
  onSelectVersion: (versionId: string) => void;
  
  // Compare
  onCompareVersions: (v1: string, v2: string) => Promise<VersionDiff>;
  
  // Restore
  onRestoreVersion: (versionId: string) => Promise<void>;
  
  // Manage
  onNameVersion: (versionId: string, name: string) => Promise<void>;
  onDeleteVersion: (versionId: string) => Promise<void>;
  onDownloadVersion: (versionId: string) => Promise<Blob>;
}

interface VersionDiff {
  additions: DiffChunk[];
  deletions: DiffChunk[];
  modifications: DiffChunk[];
  unchanged: DiffChunk[];
}

interface DiffChunk {
  type: 'add' | 'delete' | 'modify' | 'unchanged';
  content: string;
  lineNumber: number;
  position: { start: number; end: number };
}
```

**Auto-versioning Strategy:**
```typescript
const autoVersionConfig = {
  // Create version after N auto-saves
  autoSaveThreshold: 10,
  
  // Create version after time period
  timeThreshold: '1 hour',
  
  // Create version on significant changes
  significantChangeThreshold: 500, // characters
  
  // Maximum auto-versions to keep
  maxAutoVersions: 50,
  
  // Never delete manual versions
  preserveManualVersions: true,
};

const shouldCreateVersion = (
  lastVersion: DocumentVersion,
  currentContent: EditorContent,
  autoSaveCount: number
): boolean => {
  // After threshold of auto-saves
  if (autoSaveCount >= autoVersionConfig.autoSaveThreshold) {
    return true;
  }
  
  // After time period
  const hoursSinceLastVersion = 
    (Date.now() - lastVersion.createdAt.getTime()) / (1000 * 60 * 60);
  if (hoursSinceLastVersion >= 1) {
    return true;
  }
  
  // Significant content change
  const changeSize = Math.abs(
    currentContent.length - lastVersion.content.length
  );
  if (changeSize >= autoVersionConfig.significantChangeThreshold) {
    return true;
  }
  
  return false;
};
```

---

## Data Requirements

### Data Structures

#### 1. Document
```typescript
interface Document {
  // Identity
  id: string;
  userId: string;
  
  // Content
  title: string;
  type: 'resume' | 'cover-letter' | 'portfolio' | 'other';
  content: EditorContent;
  plainText: string; // For search
  wordCount: number;
  characterCount: number;
  
  // Metadata
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  lastOpenedAt: Date;
  
  // Organization
  folderId?: string;
  tags: string[];
  templateId?: string;
  
  // Versioning
  currentVersion: number;
  versionHistory: string[]; // Array of version IDs
  
  // Sharing & Collaboration
  isShared: boolean;
  shareSettings?: ShareSettings;
  collaborators: Collaborator[];
  
  // AI Data
  aiOptimizationScore?: number; // 0-100
  atsScore?: number; // 0-100
  targetJobDescription?: string;
  
  // Export history
  lastExportedAt?: Date;
  exportCount: number;
}

interface EditorContent {
  // Structured content format
  type: 'doc';
  content: ContentNode[];
  
  // Alternative: HTML string
  // html: string;
  
  // Alternative: Markdown
  // markdown: string;
}

interface ContentNode {
  type: 'paragraph' | 'heading' | 'list' | 'blockquote' | 'table' | 'image';
  attrs?: Record<string, any>;
  content?: ContentNode[];
  text?: string;
  marks?: Mark[];
}

interface Mark {
  type: 'bold' | 'italic' | 'underline' | 'strike' | 'link' | 'color' | 'highlight';
  attrs?: Record<string, any>;
}
```

#### 2. Template
```typescript
interface Template {
  id: string;
  name: string;
  description: string;
  
  // Categorization
  category: 'resume' | 'cover-letter' | 'portfolio';
  industry: string[];
  role: string[];
  level: 'entry' | 'mid' | 'senior' | 'executive';
  style: 'modern' | 'classic' | 'creative' | 'minimal';
  
  // Content
  content: EditorContent;
  sections: TemplateSection[];
  
  // Styling
  styles: {
    fontFamily: string;
    fontSize: number;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
    };
    spacing: {
      lineHeight: number;
      paragraphSpacing: number;
    };
  };
  
  // Layout
  layout: {
    columns: 1 | 2;
    margins: { top: number; right: number; bottom: number; left: number };
    pageSize: 'letter' | 'a4';
  };
  
  // Assets
  thumbnail: string;
  preview: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isPremium: boolean;
  popularity: number;
  usageCount: number;
  rating: number;
  
  // Tags
  tags: string[];
  keywords: string[];
}

interface TemplateSection {
  id: string;
  type: SectionType;
  title: string;
  placeholder: string;
  required: boolean;
  order: number;
  defaultContent?: EditorContent;
}

type SectionType =
  | 'header'
  | 'contact'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'projects'
  | 'awards'
  | 'languages'
  | 'interests'
  | 'references'
  | 'custom';
```

#### 3. Version
```typescript
interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  
  // Content snapshot
  content: EditorContent;
  contentHash: string;
  
  // Metadata
  name?: string;
  description?: string;
  createdAt: Date;
  createdBy: string;
  saveType: 'auto' | 'manual' | 'milestone' | 'template-apply' | 'restore';
  
  // Change tracking
  changesSummary: string;
  diffFromPrevious?: VersionDiff;
  statistics: {
    linesAdded: number;
    linesRemoved: number;
    linesModified: number;
    charactersChanged: number;
  };
  
  // Relationships
  parentVersionId?: string;
  childVersionIds: string[];
  
  // Flags
  isBookmarked: boolean;
  isDeleted: boolean;
  tags: string[];
}
```

#### 4. AI Suggestion
```typescript
interface AISuggestion {
  id: string;
  documentId: string;
  versionId: string;
  
  // Classification
  category: 'grammar' | 'spelling' | 'clarity' | 'impact' | 'ats' | 'style';
  severity: 'error' | 'warning' | 'info' | 'suggestion';
  
  // Content
  original: string;
  suggestion: string;
  explanation: string;
  examples?: string[];
  
  // Position
  position: {
    start: number;
    end: number;
    lineNumber?: number;
  };
  
  // Context
  context: {
    before: string;
    after: string;
  };
  
  // Metadata
  confidence: number; // 0-1
  priority: number; // 1-10
  aiModel: string;
  createdAt: Date;
  
  // User interaction
  status: 'pending' | 'accepted' | 'rejected' | 'dismissed';
  appliedAt?: Date;
  
  // Related
  relatedSuggestions: string[];
  category Tags: string[];
}
```

#### 5. Export Configuration
```typescript
interface ExportRecord {
  id: string;
  documentId: string;
  userId: string;
  
  // Configuration
  format: 'pdf' | 'docx' | 'txt' | 'html';
  config: ExportConfig;
  
  // Results
  fileUrl: string;
  fileSize: number;
  fileName: string;
  
  // Metadata
  exportedAt: Date;
  expiresAt?: Date; // For temporary download links
  downloadCount: number;
  
  // Status
  status: 'processing' | 'completed' | 'failed';
  error?: string;
}
```

#### 6. Collaboration
```typescript
interface Collaborator {
  userId: string;
  email: string;
  name: string;
  avatar?: string;
  permission: 'view' | 'comment' | 'edit';
  invitedAt: Date;
  acceptedAt?: Date;
  status: 'pending' | 'active' | 'revoked';
}

interface Comment {
  id: string;
  documentId: string;
  userId: string;
  
  // Content
  text: string;
  mentions: string[]; // User IDs
  
  // Position (optional - can be inline or document-level)
  position?: {
    start: number;
    end: number;
  };
  quotedText?: string;
  
  // Thread
  parentId?: string; // For replies
  threadId: string;
  
  // Metadata
  createdAt: Date;
  updatedAt?: Date;
  isResolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  
  // Reactions
  reactions: {
    emoji: string;
    userIds: string[];
  }[];
}

interface ShareSettings {
  linkSharing: {
    enabled: boolean;
    shareLink: string;
    accessLevel: 'view' | 'comment' | 'edit';
    password?: string;
    expiresAt?: Date;
    allowDownload: boolean;
  };
  
  emailSharing: {
    enabled: boolean;
    domains: string[]; // Allowed email domains
    requireApproval: boolean;
  };
  
  public: {
    isPublic: boolean;
    publicUrl?: string;
    allowIndexing: boolean;
  };
}
```

### API Endpoints

#### Document Management

```typescript
// List documents
GET /api/documents
Query Params:
  - page: number
  - limit: number
  - type: string
  - status: string
  - search: string
  - sortBy: string
  - sortOrder: 'asc' | 'desc'
Response: {
  documents: Document[];
  total: number;
  page: number;
  pages: number;
}

// Get single document
GET /api/documents/:id
Response: Document

// Create document
POST /api/documents
Body: {
  title: string;
  type: string;
  templateId?: string;
  content?: EditorContent;
}
Response: Document

// Update document
PATCH /api/documents/:id
Body: Partial<Document>
Response: Document

// Delete document
DELETE /api/documents/:id
Response: { success: boolean }

// Duplicate document
POST /api/documents/:id/duplicate
Body: {
  title?: string;
  includeVersion History?: boolean;
}
Response: Document
```

#### Content & Editing

```typescript
// Save content (auto-save)
POST /api/documents/:id/content
Body: {
  content: EditorContent;
  versionType: 'auto' | 'manual';
  versionName?: string;
}
Response: {
  documentId: string;
  versionId: string;
  savedAt: Date;
}

// Get content
GET /api/documents/:id/content
Query Params:
  - versionId?: string (optional, gets specific version)
Response: {
  content: EditorContent;
  versionId: string;
  updatedAt: Date;
}
```

#### Templates

```typescript
// List templates
GET /api/templates
Query Params:
  - category: string
  - industry: string
  - style: string
  - search: string
  - page: number
  - limit: number
Response: {
  templates: Template[];
  total: number;
}

// Get template
GET /api/templates/:id
Response: Template

// Apply template to document
POST /api/documents/:id/apply-template
Body: {
  templateId: string;
  preserveContent: boolean;
}
Response: Document
```

#### Version History

```typescript
// List versions
GET /api/documents/:id/versions
Query Params:
  - limit: number
  - saveType: string
Response: {
  versions: DocumentVersion[];
  total: number;
}

// Get specific version
GET /api/documents/:id/versions/:versionId
Response: DocumentVersion

// Compare versions
GET /api/documents/:id/versions/compare
Query Params:
  - v1: string (version ID)
  - v2: string (version ID)
Response: VersionDiff

// Restore version
POST /api/documents/:id/versions/:versionId/restore
Response: {
  document: Document;
  newVersionId: string;
}

// Name/tag version
PATCH /api/documents/:id/versions/:versionId
Body: {
  name?: string;
  tags?: string[];
}
Response: DocumentVersion

// Delete version
DELETE /api/documents/:id/versions/:versionId
Response: { success: boolean }
```

#### AI Features

```typescript
// Analyze document
POST /api/ai/analyze
Body: {
  documentId: string;
  content: EditorContent;
  options: {
    grammar: boolean;
    clarity: boolean;
    impact: boolean;
    ats: boolean;
  };
}
Response: {
  suggestions: AISuggestion[];
  scores: {
    overall: number;
    grammar: number;
    clarity: number;
    impact: number;
    ats: number;
  };
}

// Optimize selection
POST /api/ai/optimize
Body: {
  text: string;
  type: 'professional' | 'concise' | 'impact';
  context?: {
    jobTitle?: string;
    industry?: string;
  };
}
Response: {
  alternatives: string[];
  explanation: string;
}

// Match to job
POST /api/ai/match-job
Body: {
  documentContent: EditorContent;
  jobDescription: string;
}
Response: {
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
}

// Apply suggestion
POST /api/ai/suggestions/:id/apply
Response: {
  success: boolean;
  updatedContent: EditorContent;
}

// Dismiss suggestion
POST /api/ai/suggestions/:id/dismiss
Response: { success: boolean }
```

#### Export

```typescript
// Export document
POST /api/documents/:id/export
Body: ExportConfig
Response: {
  exportId: string;
  status: 'processing' | 'completed';
  downloadUrl?: string;
}

// Check export status
GET /api/exports/:exportId
Response: {
  status: 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  error?: string;
}

// Download exported file
GET /api/exports/:exportId/download
Response: File (blob)

// Export history
GET /api/documents/:id/exports
Response: {
  exports: ExportRecord[];
  total: number;
}
```

#### Collaboration

```typescript
// Share document
POST /api/documents/:id/share
Body: {
  emails?: string[];
  permission: 'view' | 'comment' | 'edit';
  message?: string;
  linkSharing?: boolean;
}
Response: {
  shareLink?: string;
  invitations: Collaborator[];
}

// Update collaborator permission
PATCH /api/documents/:id/collaborators/:userId
Body: {
  permission: 'view' | 'comment' | 'edit';
}
Response: Collaborator

// Remove collaborator
DELETE /api/documents/:id/collaborators/:userId
Response: { success: boolean }

// List comments
GET /api/documents/:id/comments
Response: {
  comments: Comment[];
  threads: CommentThread[];
}

// Add comment
POST /api/documents/:id/comments
Body: {
  text: string;
  position?: { start: number; end: number };
  parentId?: string;
  mentions?: string[];
}
Response: Comment

// Resolve comment
POST /api/documents/:id/comments/:commentId/resolve
Response: Comment

// Delete comment
DELETE /api/documents/:id/comments/:commentId
Response: { success: boolean }
```

### State Management

#### Client-Side State

```typescript
// Document Editor State
interface EditorState {
  // Document
  document: Document | null;
  isLoading: boolean;
  error: Error | null;
  
  // Content
  content: EditorContent;
  isDirty: boolean; // Has unsaved changes
  selection: Selection | null;
  
  // Auto-save
  saveStatus: 'idle' | 'saving' | 'saved' | 'error' | 'offline';
  lastSaved: Date | null;
  autoSaveEnabled: boolean;
  
  // History (undo/redo)
  history: {
    past: EditorContent[];
    future: EditorContent[];
    canUndo: boolean;
    canRedo: boolean;
  };
  
  // UI State
  panels: {
    ai: boolean;
    versions: boolean;
    comments: boolean;
    templates: boolean;
  };
  toolbar: {
    formatState: FormatState;
    viewMode: 'edit' | 'preview' | 'focus';
    zoom: number;
  };
  
  // AI
  aiSuggestions: AISuggestion[];
  aiLoading: boolean;
  
  // Collaboration
  collaborators: Collaborator[];
  comments: Comment[];
  isShared: boolean;
}

// Documents List State
interface DocumentsState {
  // Data
  documents: Document[];
  total: number;
  
  // Loading
  isLoading: boolean;
  error: Error | null;
  
  // Filters & Sort
  filters: {
    type: string[];
    status: string[];
    tags: string[];
    dateRange?: { start: Date; end: Date };
  };
  search: string;
  sortBy: 'name' | 'created' | 'updated' | 'opened';
  sortOrder: 'asc' | 'desc';
  
  // View
  viewMode: 'grid' | 'list';
  
  // Pagination
  page: number;
  limit: number;
  
  // Selection (for bulk actions)
  selectedIds: Set<string>;
}
```

#### Redux/Zustand Store Example

```typescript
// Using Zustand
import create from 'zustand';

interface DocumentStore {
  // State
  documents: Map<string, Document>;
  currentDocumentId: string | null;
  
  // Actions
  loadDocument: (id: string) => Promise<void>;
  saveDocument: (id: string, content: EditorContent) => Promise<void>;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => Promise<void>;
  
  // Content
  updateContent: (content: EditorContent) => void;
  undo: () => void;
  redo: () => void;
  
  // AI
  loadAISuggestions: () => Promise<void>;
  applySuggestion: (suggestionId: string) => void;
  
  // Templates
  applyTemplate: (templateId: string) => Promise<void>;
}

const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: new Map(),
  currentDocumentId: null,
  
  loadDocument: async (id) => {
    try {
      const response = await fetch(`/api/documents/${id}`);
      const document = await response.json();
      
      set(state => ({
        documents: new Map(state.documents).set(id, document),
        currentDocumentId: id,
      }));
    } catch (error) {
      console.error('Failed to load document:', error);
    }
  },
  
  saveDocument: async (id, content) => {
    try {
      const response = await fetch(`/api/documents/${id}/content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      const result = await response.json();
      
      set(state => {
        const documents = new Map(state.documents);
        const doc = documents.get(id);
        if (doc) {
          documents.set(id, {
            ...doc,
            content,
            updatedAt: result.savedAt,
          });
        }
        return { documents };
      });
    } catch (error) {
      console.error('Failed to save document:', error);
    }
  },
  
  // ... more actions
}));
```

---

## File Structure

### Recommended Component Organization

```
src/
├── components/
│   ├── documents/
│   │   ├── DocumentsPage/
│   │   │   ├── DocumentsPage.tsx
│   │   │   ├── DocumentsPage.styles.ts
│   │   │   └── DocumentsPage.test.tsx
│   │   ├── DocumentCard/
│   │   │   ├── DocumentCard.tsx
│   │   │   ├── DocumentCard.styles.ts
│   │   │   └── DocumentCard.test.tsx
│   │   ├── DocumentsGrid/
│   │   │   └── DocumentsGrid.tsx
│   │   ├── DocumentsList/
│   │   │   └── DocumentsList.tsx
│   │   ├── DocumentsFilters/
│   │   │   └── DocumentsFilters.tsx
│   │   ├── DocumentsSearch/
│   │   │   └── DocumentsSearch.tsx
│   │   └── BulkActions/
│   │       └── BulkActions.tsx
│   │
│   ├── editor/
│   │   ├── Editor/
│   │   │   ├── Editor.tsx
│   │   │   ├── Editor.context.tsx
│   │   │   ├── Editor.hooks.ts
│   │   │   └── Editor.test.tsx
│   │   ├── EditorToolbar/
│   │   │   ├── EditorToolbar.tsx
│   │   │   ├── ToolbarGroup.tsx
│   │   │   ├── FormatButtons.tsx
│   │   │   ├── FontControls.tsx
│   │   │   ├── ParagraphControls.tsx
│   │   │   ├── InsertMenu.tsx
│   │   │   └── ViewControls.tsx
│   │   ├── EditorCanvas/
│   │   │   ├── EditorCanvas.tsx
│   │   │   ├── ContentRenderer.tsx
│   │   │   └── EditorCanvas.styles.ts
│   │   ├── StatusBar/
│   │   │   └── StatusBar.tsx
│   │   └── ContextualToolbar/
│   │       └── ContextualToolbar.tsx
│   │
│   ├── ai/
│   │   ├── AISuggestionsPanel/
│   │   │   ├── AISuggestionsPanel.tsx
│   │   │   ├── SuggestionCard.tsx
│   │   │   ├── SuggestionCategories.tsx
│   │   │   └── SuggestionActions.tsx
│   │   ├── AIOptimizeButton/
│   │   │   └── AIOptimizeButton.tsx
│   │   ├── AIRewriteMenu/
│   │   │   └── AIRewriteMenu.tsx
│   │   └── ATSScoreCard/
│   │       └── ATSScoreCard.tsx
│   │
│   ├── templates/
│   │   ├── TemplateSelector/
│   │   │   ├── TemplateSelector.tsx
│   │   │   ├── TemplateGrid.tsx
│   │   │   ├── TemplateCard.tsx
│   │   │   └── TemplatePreview.tsx
│   │   ├── TemplateFilters/
│   │   │   └── TemplateFilters.tsx
│   │   └── TemplateSearch/
│   │       └── TemplateSearch.tsx
│   │
│   ├── versions/
│   │   ├── VersionHistorySidebar/
│   │   │   ├── VersionHistorySidebar.tsx
│   │   │   ├── VersionList.tsx
│   │   │   ├── VersionItem.tsx
│   │   │   └── VersionActions.tsx
│   │   ├── VersionComparison/
│   │   │   ├── VersionComparison.tsx
│   │   │   └── DiffView.tsx
│   │   └── RestoreDialog/
│   │       └── RestoreDialog.tsx
│   │
│   ├── export/
│   │   ├── ExportDialog/
│   │   │   ├── ExportDialog.tsx
│   │   │   ├── FormatSelector.tsx
│   │   │   ├── ExportOptions.tsx
│   │   │   ├── PageSetup.tsx
│   │   │   └── ExportPreview.tsx
│   │   └── BatchExport/
│   │       └── BatchExport.tsx
│   │
│   ├── collaboration/
│   │   ├── ShareDialog/
│   │   │   ├── ShareDialog.tsx
│   │   │   ├── ShareLink.tsx
│   │   │   ├── InviteCollaborators.tsx
│   │   │   └── PermissionSelector.tsx
│   │   ├── CommentsPanel/
│   │   │   ├── CommentsPanel.tsx
│   │   │   ├── CommentThread.tsx
│   │   │   ├── Comment.tsx
│   │   │   └── CommentInput.tsx
│   │   └── CollaboratorsList/
│   │       └── CollaboratorsList.tsx
│   │
│   ├── ui/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Select/
│   │   ├── Dialog/
│   │   ├── Dropdown/
│   │   ├── Tooltip/
│   │   ├── Badge/
│   │   ├── Card/
│   │   ├── Tabs/
│   │   ├── ScrollArea/
│   │   └── Separator/
│   │
│   └── common/
│       ├── AutoSaveIndicator/
│       ├── LoadingSpinner/
│       ├── EmptyState/
│       ├── ErrorBoundary/
│       └── KeyboardShortcuts/
│
├── pages/
│   ├── DocumentsPage.tsx
│   └── EditorPage.tsx
│
├── hooks/
│   ├── useDocuments.ts
│   ├── useDocument.ts
│   ├── useEditor.ts
│   ├── useAutoSave.ts
│   ├── useKeyboardShortcuts.ts
│   ├── useAISuggestions.ts
│   ├── useVersionHistory.ts
│   ├── useExport.ts
│   └── useCollaboration.ts
│
├── services/
│   ├── api/
│   │   ├── documents.ts
│   │   ├── templates.ts
│   │   ├── versions.ts
│   │   ├── ai.ts
│   │   ├── export.ts
│   │   └── collaboration.ts
│   ├── editor/
│   │   ├── EditorService.ts
│   │   ├── FormatService.ts
│   │   └── ContentParser.ts
│   └── storage/
│       └── LocalStorageService.ts
│
├── store/
│   ├── documents.store.ts
│   ├── editor.store.ts
│   └── ui.store.ts
│
├── types/
│   ├── document.types.ts
│   ├── editor.types.ts
│   ├── template.types.ts
│   ├── version.types.ts
│   ├── ai.types.ts
│   └── collaboration.types.ts
│
├── utils/
│   ├── editor/
│   │   ├── content-utils.ts
│   │   ├── selection-utils.ts
│   │   ├── format-utils.ts
│   │   └── export-utils.ts
│   ├── formatters/
│   │   ├── date.ts
│   │   ├── text.ts
│   │   └── number.ts
│   └── validation/
│       ├── document.ts
│       └── export.ts
│
├── constants/
│   ├── editor.constants.ts
│   ├── keyboard-shortcuts.ts
│   └── export-formats.ts
│
└── styles/
    ├── editor.css
    └── themes/
        ├── default.ts
        └── dark.ts
```

### Key Files Breakdown

#### DocumentsPage.tsx
```typescript
import { DocumentsPageHeader } from './DocumentsPageHeader';
import { DocumentsFilters } from './DocumentsFilters';
import { DocumentsGrid } from './DocumentsGrid';
import { useDocuments } from '@/hooks/useDocuments';

export const DocumentsPage = () => {
  const {
    documents,
    loading,
    filters,
    setFilters,
    viewMode,
    setViewMode,
  } = useDocuments();
  
  return (
    <div className="documents-page">
      <DocumentsPageHeader
        onNewDocument={() => {}}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      <DocumentsFilters
        filters={filters}
        onChange={setFilters}
      />
      
      <DocumentsGrid
        documents={documents}
        loading={loading}
        viewMode={viewMode}
      />
    </div>
  );
};
```

#### Editor.tsx
```typescript
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { AISuggestionsPanel } from '@/components/ai/AISuggestionsPanel';
import { VersionHistorySidebar } from '@/components/versions/VersionHistorySidebar';
import { useEditor } from '@/hooks/useEditor';

export const Editor = ({ documentId }: { documentId: string }) => {
  const {
    document,
    content,
    updateContent,
    formatState,
    onFormat,
    suggestions,
    versions,
  } = useEditor(documentId);
  
  return (
    <div className="editor-layout">
      <EditorToolbar
        formatState={formatState}
        onFormat={onFormat}
      />
      
      <div className="editor-workspace">
        <EditorCanvas
          content={content}
          onChange={updateContent}
        />
        
        <AISuggestionsPanel
          suggestions={suggestions}
        />
      </div>
      
      <VersionHistorySidebar
        versions={versions}
      />
    </div>
  );
};
```

---

## Technical Considerations

### Rich Text Editor Foundation

**Options:**

1. **TipTap** (Recommended)
   - Pros: Modern, extensible, React-friendly
   - Cons: Smaller ecosystem than others
   - Best for: Full customization

2. **Slate.js**
   - Pros: Highly customizable, React-first
   - Cons: Steeper learning curve
   - Best for: Complex document structures

3. **Draft.js**
   - Pros: Facebook-backed, stable
   - Cons: Older, less active development
   - Best for: Simpler use cases

4. **Quill**
   - Pros: Easy to use, good defaults
   - Cons: Less React-friendly
   - Best for: Quick implementation

**Recommended: TipTap**

```typescript
// Editor setup with TipTap
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';

const useDocumentEditor = (initialContent: string) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Link,
      Table,
      TableRow,
      TableCell,
      TableHeader,
      // Custom extensions
      CustomHeading,
      CustomParagraph,
      AIHighlight,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      // Auto-save logic
      debouncedSave(editor.getJSON());
    },
  });
  
  return editor;
};
```

### Performance Optimization

**1. Virtual Scrolling**
```typescript
// For large document lists
import { useVirtualizer } from '@tanstack/react-virtual';

const DocumentsList = ({ documents }: Props) => {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: documents.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Estimated row height
    overscan: 5,
  });
  
  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <DocumentCard
            key={virtualRow.key}
            document={documents[virtualRow.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

**2. Code Splitting**
```typescript
// Lazy load heavy components
import { lazy, Suspense } from 'react';

const Editor = lazy(() => import('@/components/editor/Editor'));
const TemplateSelector = lazy(() => import('@/components/templates/TemplateSelector'));
const ExportDialog = lazy(() => import('@/components/export/ExportDialog'));

const EditorPage = () => (
  <Suspense fallback={<EditorSkeleton />}>
    <Editor documentId={id} />
  </Suspense>
);
```

**3. Memoization**
```typescript
// Prevent unnecessary re-renders
import { memo, useMemo, useCallback } from 'react';

const DocumentCard = memo(({ document, onClick }: Props) => {
  const formattedDate = useMemo(
    () => formatDate(document.updatedAt),
    [document.updatedAt]
  );
  
  const handleClick = useCallback(
    () => onClick(document.id),
    [onClick, document.id]
  );
  
  return <Card onClick={handleClick}>{/* ... */}</Card>;
});
```

**4. Debouncing & Throttling**
```typescript
import { debounce, throttle } from 'lodash';

// Debounce auto-save
const debouncedSave = debounce(
  (content: EditorContent) => saveDocument(content),
  3000
);

// Throttle AI suggestions
const throttledAnalyze = throttle(
  (content: EditorContent) => analyzeWithAI(content),
  5000,
  { leading: true, trailing: true }
);
```

### State Management Strategy

**Recommendation: Zustand + React Query**

```typescript
// Document store (Zustand)
import create from 'zustand';

const useDocumentStore = create((set) => ({
  currentDocument: null,
  setDocument: (doc) => set({ currentDocument: doc }),
  updateContent: (content) => set((state) => ({
    currentDocument: { ...state.currentDocument, content }
  })),
}));

// Server state (React Query)
import { useQuery, useMutation } from '@tanstack/react-query';

const useDocument = (id: string) => {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => fetchDocument(id),
  });
};

const useSaveDocument = () => {
  return useMutation({
    mutationFn: (data) => saveDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
    },
  });
};
```

### Error Handling

```typescript
// Error boundary for editor
class EditorErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Editor error:', error, errorInfo);
    // Send to error tracking service
    trackError(error, { component: 'Editor', ...errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <EditorErrorState
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
        />
      );
    }
    
    return this.props.children;
  }
}

// API error handling
const handleAPIError = (error: Error) => {
  if (error instanceof NetworkError) {
    // Show offline mode
    showToast('You are offline. Changes will sync when online.');
  } else if (error instanceof AuthError) {
    // Redirect to login
    redirectToLogin();
  } else {
    // Generic error
    showToast('Something went wrong. Please try again.');
  }
};
```

---

## Accessibility

### WCAG 2.1 AA Compliance

**1. Keyboard Navigation**
```typescript
// All interactive elements accessible via keyboard
const DocumentCard = ({ document }: Props) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Edit ${document.title}`}
    >
      {/* Card content */}
    </div>
  );
};

// Editor keyboard shortcuts
const useEditorKeyboard = (editor: Editor) => {
  useEffect(() => {
    const shortcuts = {
      'Mod-b': () => editor.chain().focus().toggleBold().run(),
      'Mod-i': () => editor.chain().focus().toggleItalic().run(),
      'Mod-u': () => editor.chain().focus().toggleUnderline().run(),
      'Mod-s': (e) => {
        e.preventDefault();
        saveDocument();
      },
    };
    
    // Register shortcuts...
  }, [editor]);
};
```

**2. ARIA Labels & Roles**
```typescript
const EditorToolbar = () => {
  return (
    <div role="toolbar" aria-label="Text formatting">
      <button
        aria-label="Bold"
        aria-pressed={isBold}
        onClick={toggleBold}
      >
        <Bold className="w-5 h-5" />
      </button>
      
      <button
        aria-label="Italic"
        aria-pressed={isItalic}
        onClick={toggleItalic}
      >
        <Italic className="w-5 h-5" />
      </button>
      
      {/* More buttons... */}
    </div>
  );
};
```

**3. Focus Management**
```typescript
const TemplateSelector = ({ onSelect }: Props) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Trap focus inside modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        // Handle Tab navigation within modal
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Modal content */}
    </div>
  );
};
```

**4. Screen Reader Support**
```typescript
const AutoSaveIndicator = ({ status }: Props) => {
  return (
    <div role="status" aria-live="polite" aria-atomic="true">
      {status === 'saving' && (
        <span>
          <Loader2 className="animate-spin" />
          <span className="sr-only">Saving document...</span>
        </span>
      )}
      
      {status === 'saved' && (
        <span>
          <Check />
          <span className="sr-only">Document saved successfully</span>
        </span>
      )}
    </div>
  );
};
```

**5. Color Contrast**
```css
/* Ensure WCAG AA contrast ratios */
.text-primary {
  color: #1f2937; /* 4.5:1 on white */
}

.text-secondary {
  color: #4b5563; /* 4.5:1 on white */
}

.bg-primary {
  background-color: #3b82f6;
  color: #ffffff; /* 4.5:1 contrast */
}

.ai-highlight {
  background-color: rgba(16, 185, 129, 0.15);
  border-bottom: 2px solid #10b981; /* Visible without color */
}
```

---

## Performance

### Performance Targets

- **Initial Load:** < 2 seconds
- **Time to Interactive:** < 3 seconds
- **Editor Responsiveness:** < 50ms keystroke latency
- **Auto-save:** < 500ms
- **AI Suggestions:** < 3 seconds
- **Document Export:** < 5 seconds (PDF), < 2 seconds (DOCX)

### Optimization Techniques

**1. Bundle Optimization**
```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'editor': ['@tiptap/react', '@tiptap/starter-kit'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

**2. Image Optimization**
```typescript
// Lazy load images with blur placeholder
const DocumentThumbnail = ({ src, alt }: Props) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={cn('transition-opacity', loaded ? 'opacity-100' : 'opacity-0')}
      />
    </div>
  );
};
```

**3. Caching Strategy**
```typescript
// Service worker for offline support
// sw.js
const CACHE_NAME = 'careersu-v1';
const ASSETS = ['/index.html', '/main.js', '/main.css'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

**4. Web Workers for Heavy Processing**
```typescript
// Export processing in web worker
// export.worker.ts
self.addEventListener('message', async (e) => {
  const { type, data } = e.data;
  
  if (type === 'EXPORT_PDF') {
    const pdfBlob = await generatePDF(data.content, data.options);
    self.postMessage({ type: 'EXPORT_COMPLETE', blob: pdfBlob });
  }
});

// In component
const useExport = () => {
  const worker = useRef<Worker>();
  
  useEffect(() => {
    worker.current = new Worker(new URL('./export.worker.ts', import.meta.url));
    
    worker.current.onmessage = (e) => {
      if (e.data.type === 'EXPORT_COMPLETE') {
        downloadFile(e.data.blob);
      }
    };
    
    return () => worker.current?.terminate();
  }, []);
  
  const exportDocument = (content: EditorContent, options: ExportOptions) => {
    worker.current?.postMessage({ type: 'EXPORT_PDF', data: { content, options } });
  };
  
  return { exportDocument };
};
```

---

## Implementation Roadmap

### Phase 1: Core Document Management (Week 1-2)
- [ ] Documents list page
- [ ] Document card component
- [ ] Create/Delete documents
- [ ] Basic search and filters
- [ ] Grid/List view toggle

### Phase 2: Basic Editor (Week 3-4)
- [ ] Editor canvas with TipTap
- [ ] Basic toolbar (formatting)
- [ ] Auto-save functionality
- [ ] Content persistence

### Phase 3: Rich Formatting (Week 5)
- [ ] Advanced toolbar
- [ ] Font controls
- [ ] Paragraph formatting
- [ ] Lists and tables
- [ ] Links and images

### Phase 4: Templates (Week 6)
- [ ] Template data model
- [ ] Template selector modal
- [ ] Template preview
- [ ] Apply template to document
- [ ] Basic template library

### Phase 5: AI Integration (Week 7-8)
- [ ] AI suggestions panel
- [ ] Real-time analysis
- [ ] Grammar/spelling checks
- [ ] Clarity suggestions
- [ ] ATS optimization

### Phase 6: Version Control (Week 9)
- [ ] Version history sidebar
- [ ] Auto-versioning
- [ ] Version comparison (diff)
- [ ] Restore functionality

### Phase 7: Export (Week 10)
- [ ] Export dialog
- [ ] PDF export
- [ ] DOCX export
- [ ] Format options
- [ ] Preview

### Phase 8: Collaboration (Week 11-12)
- [ ] Sharing functionality
- [ ] Comments system
- [ ] Collaborator management
- [ ] Real-time updates (optional)

### Phase 9: Polish & Optimization (Week 13-14)
- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Mobile responsiveness
- [ ] Error handling
- [ ] Testing
- [ ] Documentation

---

## Summary

This comprehensive UI plan provides detailed specifications for building a professional-grade document editor and management system for the CareerSU platform. The design emphasizes:

- **User Experience:** Intuitive, Word-like editing with modern web technologies
- **AI Integration:** Seamless AI-powered suggestions and optimization
- **Collaboration:** Sharing, commenting, and real-time features
- **Performance:** Fast, responsive, and optimized for all devices
- **Accessibility:** WCAG 2.1 AA compliant with full keyboard navigation
- **Scalability:** Modular architecture supporting future enhancements

The implementation uses React 18.3.1, TypeScript, Tailwind CSS, and Radix UI, with TipTap as the rich text editor foundation. The modular component structure allows for incremental development and easy maintenance.

---

**Next Steps:**
1. Review and approve this UI plan
2. Set up development environment
3. Begin Phase 1 implementation
4. Regular testing and iteration
5. User feedback collection
6. Continuous improvement

---

*Document prepared for the CareerSU Platform development team.*
*For questions or clarifications, please refer to the inline documentation and code examples.*
