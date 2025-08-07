# Mobile App Layout Guide

A practical guide for choosing the right layout pattern for your mobile app features.

## Quick Decision Framework

Ask yourself these questions in order:

1. **Is this your main navigation?**
   - 3-5 main sections → **Tabs**
   - 6+ sections → **Drawer**
2. **Is this a step-by-step process?**
   - Yes → **Stack**
3. **Does this need full attention?**
   - Yes → **Modal**
4. **What type of content?**
   - Many similar items → **List**
   - Visual/image heavy → **Grid**
   - Mixed content blocks → **Cards**

## Layout Patterns Overview

### 1. Stack Layout

**What it is:** Screens that stack on top of each other with back navigation

**Perfect for:**

- Onboarding flows (Welcome → Setup → Complete)
- Form wizards (Basic Info → Details → Review → Submit)
- Article reading (List → Article → Comments)
- Settings (Main → Account → Security)
- E-commerce checkout (Cart → Shipping → Payment)

**Key characteristics:**

- Linear progression
- Clear hierarchy
- Back button always available
- Each screen has a specific purpose
- History is maintained

**Avoid when:**

- Users need to jump between sections
- Content needs side-by-side comparison
- Features are equally important

### 2. Tab Layout

**What it is:** 3-5 main sections accessible via bottom bar

**Perfect for:**

- Social apps (Feed, Search, Post, Notifications, Profile)
- E-commerce (Shop, Search, Cart, Orders, Account)
- Media apps (Home, Browse, Downloads, Profile)
- Productivity (Tasks, Calendar, Projects, Settings)

**Key characteristics:**

- Always visible navigation
- Quick switching between sections
- Each tab is independent
- Shows current location clearly
- Equal importance sections

**Avoid when:**

- More than 5 main sections
- Sections are rarely used
- Deep hierarchies needed
- Sequential workflows

### 3. Drawer Layout

**What it is:** Hidden side menu with many navigation options

**Perfect for:**

- Enterprise apps with many features
- Apps with 6+ sections
- Settings and preferences
- Admin dashboards
- Apps with user accounts (profile, settings, logout)

**Key characteristics:**

- Saves screen space
- Accommodates many options
- Can show user info
- Good for grouping features
- Secondary navigation

**Avoid when:**

- Core features need quick access
- You have less than 5 options
- Users are new to the app
- Discovery is important

### 4. Modal Layout

**What it is:** Temporary overlay that requires user action

**Perfect for:**

- Creating new content (posts, tasks, events)
- Quick forms and inputs
- Confirmations and alerts
- Image/video viewers
- Filters and settings
- Share sheets

**Key characteristics:**

- Focuses user attention
- Blocks interaction with background
- Clear dismiss option
- Temporary task
- Doesn't affect navigation history

**Avoid when:**

- Multi-step processes
- Long forms
- Users need to reference background
- Content is permanent

### 5. List Layout

**What it is:** Vertical scrolling collection of items

**Perfect for:**

- Conversations and messages
- Search results
- Transaction history
- Notifications
- Settings and options
- Contacts

**Key characteristics:**

- Efficient for many items
- Easy to scan
- Natural scrolling
- Good for text content
- Supports pull-to-refresh

**Avoid when:**

- Visual content is primary
- Few items (less than 5)
- Need horizontal scrolling
- Complex item layouts

### 6. Grid Layout

**What it is:** Items arranged in rows and columns

**Perfect for:**

- Photo galleries
- Product catalogs
- App launchers
- Video thumbnails
- Category selection
- Dashboard widgets

**Key characteristics:**

- Visual-first presentation
- Efficient space usage
- Good for browsing
- Equal importance items
- Quick recognition

**Avoid when:**

- Text-heavy content
- Detailed information
- Items have different priorities
- Need item descriptions

### 7. Card Layout

**What it is:** Self-contained content blocks with mixed media

**Perfect for:**

- Social media feeds
- News articles
- Product showcases
- Recipe collections
- Event listings
- User profiles

**Key characteristics:**

- Rich content display
- Clear visual separation
- Multiple actions per item
- Mixed media support
- Scannable format

**Avoid when:**

- Simple data lists
- Minimal information per item
- Dense data tables
- Uniform content

## Common App Patterns

### Social Media App

```
Tabs (bottom)
├── Home (Stack + List with Cards)
├── Search (Grid)
├── Create (Modal)
├── Notifications (List)
└── Profile (Stack)
```

### E-commerce App

```
Tabs (bottom)
├── Shop (Stack + Grid)
├── Categories (List)
├── Cart (Stack)
├── Orders (List)
└── Account (Stack)
```

### Banking App

```
Drawer (main)
├── Dashboard (Cards)
├── Accounts (List)
├── Transfers (Stack)
├── Payments (Stack)
└── Settings (List)
```

### Messaging App

```
Tabs (bottom)
├── Chats (List)
├── Calls (List)
├── Contacts (List)
└── Settings (Stack)
```

### News App

```
Tabs (top)
├── Headlines (List with Cards)
├── Categories (Grid → Stack)
├── Saved (List)
└── Search (Stack)
```

## Key Principles

### 1. Consistency

- Similar content → Same layout
- Maintain patterns throughout app
- Predictable navigation

### 2. Hierarchy

- Important features → Tabs
- Secondary features → Drawer
- Temporary tasks → Modal

### 3. User Goals

- Browsing → Grid/Cards
- Specific task → Stack
- Quick switch → Tabs

### 4. Content Type

- Text → List
- Images → Grid
- Mixed → Cards

### 5. Frequency

- Daily use → Tabs
- Sometimes → Drawer
- Rarely → Stack/Modal

## Common Mistakes to Avoid

1. **Too many tabs** - More than 5 becomes cluttered
2. **Deep stacks** - Users get lost beyond 3-4 levels
3. **Overusing modals** - Annoying for frequent tasks
4. **Wrong layout for content** - Grid for text, List for images
5. **Hidden primary features** - Core features in drawer
6. **Inconsistent patterns** - Different layouts for similar content
7. **No empty states** - Blank screens confuse users
8. **Missing back navigation** - Users feel trapped
9. **Unclear current location** - No active state indicators
10. **Ignoring platform conventions** - iOS/Android differences

## Layout Combinations

Most successful apps combine multiple layouts:

- **Stack + Tabs**: Most common, each tab has its own navigation
- **Drawer + Tabs**: Enterprise apps with many features
- **Stack + Modal**: Forms and creation flows
- **List + Cards**: Social feeds and timelines
- **Grid + Stack**: Browse and detail pattern

## Performance Tips

- **Lists**: Use FlatList for 10+ items
- **Images**: Lazy load in grids
- **Tabs**: Load on demand, not all at once
- **Modals**: Unmount when closed
- **Navigation**: Keep stack depth shallow

## Platform Considerations

### iOS Preferences

- Bottom tabs
- Swipe back gesture
- Modal sheets from bottom
- Large titles in navigation

### Android Preferences

- Bottom navigation (Material 3)
- Hardware back button
- Full-screen modals
- Floating action buttons

## Testing Checklist

Before launching, ensure:

- [ ] Navigation is intuitive
- [ ] Back button works everywhere
- [ ] Current location is clear
- [ ] Loading states exist
- [ ] Empty states are helpful
- [ ] Errors are handled gracefully
- [ ] Performance is smooth
- [ ] Gestures work as expected

## Summary

Choose your layout based on:

1. **Number of options** (few → tabs, many → drawer)
2. **User journey** (linear → stack, parallel → tabs)
3. **Content type** (text → list, visual → grid)
4. **Task importance** (core → visible, temporary → modal)
5. **User frequency** (often → accessible, rare → hidden)

Remember: The best layout is invisible - users shouldn't think about navigation, just accomplish their goals.
