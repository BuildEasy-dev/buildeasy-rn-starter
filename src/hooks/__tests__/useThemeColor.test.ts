import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../use-theme-color';

// Mock Tamagui's useTheme hook
jest.mock('@tamagui/core', () => ({
  useTheme: jest.fn(),
}));

// Mock the useColorScheme hook
jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: jest.fn(),
}));

describe('useThemeColor', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockUseColorScheme = require('@/hooks/use-color-scheme').useColorScheme;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockUseTheme = require('@tamagui/core').useTheme;

  beforeEach(() => {
    jest.clearAllMocks();
    // Setup default Tamagui theme mock
    mockUseTheme.mockReturnValue({
      color: { val: '#000000' }, // Default text color
      background: { val: '#FFFFFF' }, // Default background
      primary: { val: '#007AFF' }, // Default primary/tint color
      placeholderColor: { val: '#999999' },
      tabIconDefault: { val: '#CCCCCC' },
      tabIconSelected: { val: '#007AFF' },
    });
  });

  it('returns theme color when no custom color provided', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#000000');
  });

  it('returns theme color regardless of color scheme when no custom props', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#000000'); // Should use theme color, not depend on scheme
  });

  it('returns custom light color when provided and theme is light', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({ light: '#FF0000' }, 'text'));

    expect(result.current).toBe('#FF0000');
  });

  it('returns custom dark color when provided and theme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useThemeColor({ dark: '#00FF00' }, 'text'));

    expect(result.current).toBe('#00FF00');
  });

  it('falls back to theme default when custom color not provided', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({ dark: '#00FF00' }, 'background'));

    expect(result.current).toBe('#FFFFFF');
  });

  it('defaults to light theme when useColorScheme returns null', () => {
    mockUseColorScheme.mockReturnValue(null);

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#000000'); // Should use theme color
  });

  it('prioritizes custom props over theme colors', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#CUSTOM', dark: '#CUSTOM_DARK' }, 'text')
    );

    expect(result.current).toBe('#CUSTOM');
  });

  it('works with different semantic token names', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result: tintResult } = renderHook(() => useThemeColor({}, 'tint'));
    const { result: backgroundResult } = renderHook(() => useThemeColor({}, 'background'));
    const { result: iconResult } = renderHook(() => useThemeColor({}, 'icon'));

    expect(tintResult.current).toBe('#007AFF'); // Maps to primary
    expect(backgroundResult.current).toBe('#FFFFFF'); // Maps to background
    expect(iconResult.current).toBe('#000000'); // Maps to color
  });

  it('handles theme updates', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result, rerender } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#000000');

    // Simulate theme change by updating the theme mock
    mockUseTheme.mockReturnValue({
      color: { val: '#FFFFFF' }, // Changed color for dark theme
      background: { val: '#000000' },
      primary: { val: '#007AFF' },
    });
    rerender({});

    expect(result.current).toBe('#FFFFFF');
  });
});
