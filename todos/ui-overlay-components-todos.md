# UI Overlay Components TODO

Implementation plan for common overlay components in `src/components/ui/`.

## Components to Implement

### Phase 1: Essential Overlays (High Priority)

#### 1. ✅ LoadingOverlay

- **Location**: Already exists as `ThemedLoadingOverlay`
- **Action**: Move/rename to `src/components/ui/loading-overlay.tsx`
- **Features**: Activity indicator with optional message

#### 2. ✅ ConfirmOverlay

- **Location**: `src/components/ui/confirm-overlay.tsx`
- **Priority**: HIGH
- **Status**: COMPLETED
- **Features**:
  - Title and message text
  - Confirm/Cancel buttons
  - Destructive action styling (red confirm button)
  - Custom button labels
  - onConfirm/onCancel callbacks
- **Use Cases**: Delete confirmation, logout confirmation, data loss warnings

#### 3. ✅ ActionSheetOverlay

- **Location**: `src/components/ui/action-sheet-overlay.tsx`
- **Priority**: HIGH
- **Status**: COMPLETED
- **Features**:
  - List of action buttons with icons
  - Destructive action support
  - Cancel button
  - Section grouping with separators
  - onAction callback with action ID
  - Support for both simple actions and grouped sections
  - Subtitle support for actions
  - Accessibility features
- **Use Cases**: More options menu, share actions, edit operations

### Phase 2: Common Use Cases (Medium Priority)

#### 4. ✅ InputOverlay

- **Location**: `src/components/ui/input-overlay.tsx`
- **Priority**: MEDIUM
- **Status**: COMPLETED
- **Features**:
  - Single/multi-line text input
  - Input validation
  - Placeholder and label
  - Character counter
  - onSubmit/onCancel callbacks
- **Use Cases**: Quick edit, rename items, comment input

### Phase 3: Advanced Overlays (Lower Priority)

#### 5. 🟢 DatePickerOverlay

- **Location**: `src/components/ui/date-picker-overlay.tsx`
- **Priority**: LOW
- **Features**:
  - Native date/time picker wrapper
  - Date range selection
  - Min/max date constraints
  - Localization support
- **Use Cases**: Event scheduling, date selection, time booking

#### 6. 🟢 ImagePreviewOverlay

- **Location**: `src/components/ui/image-preview-overlay.tsx`
- **Priority**: LOW
- **Features**:
  - Fullscreen image display
  - Pinch to zoom
  - Swipe between images
  - Share/save actions
  - Loading states
- **Use Cases**: Photo gallery, avatar preview, image details

#### 7. 🟢 ShareOverlay

- **Location**: `src/components/ui/share-overlay.tsx`
- **Priority**: LOW
- **Features**:
  - Platform-specific share options
  - Copy link functionality
  - Save to device
  - Custom share actions
- **Use Cases**: Content sharing, link sharing, export options

## Implementation Guidelines

### Design Patterns

- All components extend base `ThemedOverlay` functionality
- Consistent prop naming: `visible`, `onClose`, `title`, etc.
- Support for custom styling via style props
- Theme-aware colors using `useThemeColor`
- Performance optimizations (useMemo, useCallback)

### File Structure

```
src/components/ui/
├── confirm-overlay.tsx
├── action-sheet-overlay.tsx
├── input-overlay.tsx
├── date-picker-overlay.tsx
├── image-preview-overlay.tsx
├── share-overlay.tsx
└── index.ts (export all)
```

### API Consistency

```typescript
interface BaseOverlayProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  variant?: 'center' | 'bottom' | 'top' | 'fullscreen';
  animationSpeed?: 'fast' | 'normal' | 'slow';
}
```

### Testing Strategy

- Unit tests for each component
- Integration tests with ThemedOverlay
- Accessibility testing (screen reader support)
- Performance testing on older devices

## Migration Plan

### Phase 1: Setup (Week 1)

- [x] Create base component structure
- [x] Implement ConfirmOverlay
- [x] Implement ActionSheetOverlay
- [ ] Update index.ts exports

### Phase 2: Core Features (Week 2)

- [x] Implement InputOverlay
- [x] Add comprehensive testing
- [ ] Documentation and examples

### Phase 3: Advanced Features (Week 3)

- [ ] Implement DatePickerOverlay
- [ ] Performance optimization review
- [ ] Final polish and edge cases

### Phase 4: Polish (Week 4)

- [ ] Implement ImagePreviewOverlay
- [x] Implement ShareOverlay
- [ ] Accessibility improvements
- [ ] Performance benchmarking

## Success Criteria

- [ ] All components follow consistent API patterns
- [ ] Components are performant (< 100ms render time)
- [ ] Comprehensive test coverage (> 80%)
- [ ] Accessible to screen readers
- [ ] Works on iOS and Android
- [ ] Integrates seamlessly with existing theme system
- [ ] Well-documented with usage examples

## Notes

- Prioritize user experience over feature completeness
- Ensure components work well on both mobile and tablet
- Consider platform-specific behaviors (iOS vs Android)
- Plan for future extensions (web support, additional variants)
