# Layout Template Implementation Todo List

## Overview

Implementation tasks for creating reusable layout template components that enhance Expo Router's file-based navigation system while building upon existing components (HapticTab, TabBarBackground, IconSymbol).

## Progress Summary (Updated: 2025-01-10)

**✅ PHASE 1 COMPLETED** - Core Foundation Components

- **Commit**: `e8981ed` - feat: implement ScreenWrapper component with layout system
- **Files Added**: 7 new layout components + TypeScript types
- **Integration**: Successfully integrated with existing tab screens
- **Dependencies**: Added @tamagui/stacks for enhanced layout primitives

**✅ PHASE 2 PARTIALLY COMPLETED** - Modal System Implementation

- **Commit**: `3092f06` - feat: add gemini cli workflows and improve modal wrapper
- **New Components**: ModalWrapper + ModalHeaderButton with smart header detection
- **Features**: Auto header detection, 6 button variants, flexible configuration
- **Integration**: Uses existing IconSymbol, ThemedView, ScreenWrapper components

**🎯 Next Priority**: Phase 2 Navigation Enhancement (EnhancedTabConfig, StackHeaderConfig)

## Phase 1: Core Foundation Components

### 1. Base Wrapper Components

- [x] **ScreenWrapper** (`src/components/layout/wrappers/screen-wrapper.tsx`) ✅
  - Safe area handling (top/bottom/both)
  - Consistent padding (default 16px, customizable)
  - Scrollable content support
  - Loading/error/empty states
  - Pull-to-refresh functionality
  - Keyboard avoiding behavior
  - Theme-aware background colors

- [x] **ModalWrapper** (`src/components/layout/wrappers/modal-wrapper.tsx`) ✅
  - ✅ Smart header detection based on props
  - ✅ Flexible header configuration (left/right/title)
  - ✅ Configurable title alignment (left/center/right)
  - ✅ Integrated ModalHeaderButton component
  - ✅ Scrollable/non-scrollable content support
  - ✅ Uses ScreenWrapper for consistent safe area handling
  - ✅ Theme-aware styling with ThemedView/ThemedScrollView

- [x] **TabScreenWrapper** (`src/components/layout/wrappers/tab-screen-wrapper.tsx`) ✅
  - Extends ScreenWrapper functionality
  - Tab bar height calculations
  - Badge management support
  - Scroll-to-top on tab press
  - Tab-specific gesture handling

- [ ] **DrawerWrapper** (`src/components/layout/wrappers/drawer-wrapper.tsx`)
  - Drawer toggle button integration
  - Drawer-specific gestures
  - Consistent header with menu button

### 2. Common State Components

- [x] **LoadingState** (`src/components/layout/common/loading-state.tsx`) ✅
  - Consistent loading indicators
  - Optional loading messages
  - Theme-aware styling

- [x] **ErrorState** (`src/components/layout/common/error-state.tsx`) ✅
  - Error message display
  - Retry button
  - Error icon/illustration

- [x] **EmptyState** (`src/components/layout/common/empty-state.tsx`) ✅
  - Empty state illustrations
  - Customizable messages
  - Call-to-action buttons

- [x] **SafeAreaWrapper** (`src/components/layout/common/safe-area-wrapper.tsx`) ✅
  - Reusable safe area handling
  - Edge configuration

## Phase 2: Navigation Enhancement

### 3. Enhanced Navigation Configurations

- [x] **ModalHeaderButton** (`src/components/layout/wrappers/modal-header-button.tsx`) ✅
  - ✅ 6 predefined variants: cancel, back, close, done, save, next
  - ✅ Automatic router.back() navigation for most variants
  - ✅ Icon support using existing IconSymbol component
  - ✅ Theme-aware colors with useThemeColor hook
  - ✅ Disabled state handling with visual feedback
  - ✅ Smart default actions with customizable overrides
  - ✅ Consistent iOS-style button styling

- [x] **CreateModalOptions** (`src/components/layout/navigation/create-options.tsx`) ✅
  - ✅ Standardized modal screen options for ModalWrapper
  - ✅ Platform-specific animations (slide_from_bottom on iOS, slide_from_right on Android)
  - ✅ Automatic header hiding (since ModalWrapper provides custom header)
  - ✅ Gesture-enabled swipe to dismiss
  - ✅ Modal presentation style configuration

- [ ] **EnhancedTabConfig** (`src/components/layout/navigation/enhanced-tab-config.tsx`)
  - Build on existing HapticTab component
  - Use existing TabBarBackground
  - Add variants: default, compact, floating
  - Badge styling support
  - Animated icon support
  - Custom height options
  - Integration with useThemeColor hook

- [ ] **StackHeaderConfig** (`src/components/layout/navigation/enhanced-stack-config.tsx`)
  - Header variants: default, large, transparent
  - Back button configurations: default, icon-only, title-only, hidden
  - Center title option
  - Common header actions (settings, close, search)
  - Theme-aware colors via React Navigation's ThemeProvider

### 4. Drawer Navigation Components

- [ ] **DrawerContent** (`src/components/layout/navigation/drawer-content.tsx`)
  - Custom drawer with sections
  - User profile header support
  - Grouped navigation items
  - Footer actions (logout)
  - Integration with DrawerContentScrollView

- [ ] **DrawerItem** (`src/components/layout/navigation/drawer-item.tsx`)
  - Custom drawer item styling
  - Icon support
  - Active state indication
  - Badge support

## Phase 3: Content Layout Components

### 5. List Components

- [ ] **ListLayout** (`src/components/layout/content/list/list-layout.tsx`)
  - FlatList wrapper with defaults
  - Pull-to-refresh
  - Infinite scroll support
  - Empty state handling
  - Header/footer support
  - Separator options

- [ ] **ListItem** (`src/components/layout/content/list/list-item.tsx`)
  - Consistent list item styling
  - Leading/trailing elements
  - Subtitle support
  - Press handlers

- [ ] **ListEmptyState** (`src/components/layout/content/list/list-empty-state.tsx`)
  - List-specific empty states

### 6. Grid Components

- [ ] **GridLayout** (`src/components/layout/content/grid/grid-layout.tsx`)
  - Responsive grid system
  - Auto columns or fixed count
  - Spacing control
  - Aspect ratio support

- [ ] **GridItem** (`src/components/layout/content/grid/grid-item.tsx`)
  - Grid item wrapper
  - Press animations
  - Image optimization

- [ ] **GridResponsive** (`src/components/layout/content/grid/grid-responsive.tsx`)
  - Breakpoint-based columns
  - Orientation handling

### 7. Card Components

- [ ] **Card** (`src/components/layout/content/card/card.tsx`)
  - Variants: elevated, outlined, filled
  - Padding presets
  - Press handlers
  - Theme integration

- [ ] **CardHeader** (`src/components/layout/content/card/card-header.tsx`)
  - Title and subtitle
  - Avatar support
  - Action buttons

- [ ] **CardContent** (`src/components/layout/content/card/card-content.tsx`)
  - Content wrapper with spacing

- [ ] **CardFooter** (`src/components/layout/content/card/card-footer.tsx`)
  - Action buttons
  - Metadata display

## Phase 4: Integration & Testing

### 8. TypeScript & Exports

- [x] **Type Definitions** ✅ (Partial)
  - Create comprehensive TypeScript interfaces
  - Proper generic types for lists/grids
  - Navigation type extensions
  - **COMPLETED**: ThemedColor interface in `src/components/types.ts`

- [x] **Index Export** (`src/components/layout/index.ts`) ✅
  - Clean export structure
  - Grouped exports by category

### 9. Theme Integration

- [x] **Tamagui Integration** ✅
  - Use Tamagui components where appropriate
  - Ensure theme variables work correctly
  - Dark/light mode support
  - **COMPLETED**: Added @tamagui/stacks dependency, using YStack components

- [x] **Color System** ✅
  - Integrate with existing useThemeColor hook
  - Ensure all components are theme-aware

### 10. Example Implementations

- [ ] **Social Media Pattern**
  - Tab navigation with cards in feed
  - Modal for creating posts
  - Profile stack navigation

- [ ] **E-commerce Pattern**
  - Product grid layout
  - Cart with list layout
  - Checkout stack flow

- [ ] **Messaging Pattern**
  - Chat list layout
  - Message composition modal
  - Settings drawer

### 11. Testing & Validation

- [x] **Expo Router Compatibility** ✅
  - Test with file-based routing
  - Verify navigation props pass-through
  - Deep linking support

- [x] **Component Integration** ✅
  - Verify HapticTab integration
  - Test TabBarBackground on iOS/Android
  - Confirm IconSymbol usage

- [ ] **Platform Testing**
  - iOS specific features (blur, swipe back)
  - Android specific features (hardware back)
  - Web compatibility

### 12. Documentation

- [ ] **Component Documentation**
  - Props documentation for each component
  - Usage examples
  - Migration guide from current setup

- [ ] **Pattern Documentation**
  - Common app patterns
  - Best practices
  - Performance tips

## Priority Order

1. **High Priority** (Core functionality)
   - ✅ ScreenWrapper
   - ✅ TabScreenWrapper
   - ✅ ModalWrapper + ModalHeaderButton
   - ✅ LoadingState, ErrorState, EmptyState
   - EnhancedTabConfig

2. **Medium Priority** (Enhanced UX)
   - ListLayout
   - Card components
   - StackHeaderConfig

3. **Lower Priority** (Additional features)
   - DrawerWrapper and DrawerContent
   - GridLayout
   - Example implementations

## Success Criteria

- ✅ All components work with existing HapticTab, TabBarBackground, IconSymbol
- ✅ Full TypeScript support with proper types
- ✅ Theme integration with light/dark modes
- ✅ Consistent with Expo Router patterns
- ✅ No breaking changes to existing code
- ✅ Performance optimized (lazy loading, memoization)
- ✅ Platform-specific features work correctly
- ✅ Documentation complete with examples

## Implementation Notes

### Recent Updates (2025-01-10)

**ModalWrapper System** - Fully implemented with smart header detection:

- **Smart Logic**: Headers only render when headerTitle, headerLeft, or headerRight props are provided
- **Button System**: ModalHeaderButton with 6 variants (cancel, back, close, done, save, next)
- **Integration**: Uses existing IconSymbol, ThemedView, ScreenWrapper for consistency
- **Navigation**: Automatic router.back() behavior with customizable overrides
- **Theming**: Full theme support with useThemeColor integration

### General Guidelines

- Build on existing components, don't replace them
- Maintain backward compatibility
- Follow existing project conventions (kebab-case files, TypeScript strict mode)
- Use Tamagui components where it makes sense
- Ensure all components respect the theme system
