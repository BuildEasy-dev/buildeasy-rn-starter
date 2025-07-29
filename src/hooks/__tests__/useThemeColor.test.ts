import { renderHook } from '@testing-library/react-native';
import { useThemeColor } from '../useThemeColor';

// Mock the Colors constant
jest.mock('@/constants/Colors', () => ({
  Colors: {
    light: {
      text: '#000000',
      background: '#FFFFFF',
      tint: '#007AFF',
    },
    dark: {
      text: '#FFFFFF',
      background: '#000000',
      tint: '#007AFF',
    },
  },
}));

// Mock the useColorScheme hook
jest.mock('@/hooks/useColorScheme', () => ({
  useColorScheme: jest.fn(),
}));

describe('useThemeColor', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockUseColorScheme = require('@/hooks/useColorScheme').useColorScheme;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns light color when theme is light', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#000000');
  });

  it('returns dark color when theme is dark', () => {
    mockUseColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#FFFFFF');
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

    expect(result.current).toBe('#000000');
  });

  it('prioritizes custom props over theme colors', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result } = renderHook(() =>
      useThemeColor({ light: '#CUSTOM', dark: '#CUSTOM_DARK' }, 'text')
    );

    expect(result.current).toBe('#CUSTOM');
  });

  it('works with different color names', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result: tintResult } = renderHook(() => useThemeColor({}, 'tint'));

    const { result: backgroundResult } = renderHook(() => useThemeColor({}, 'background'));

    expect(tintResult.current).toBe('#007AFF');
    expect(backgroundResult.current).toBe('#FFFFFF');
  });

  it('updates when theme changes', () => {
    mockUseColorScheme.mockReturnValue('light');

    const { result, rerender } = renderHook(() => useThemeColor({}, 'text'));

    expect(result.current).toBe('#000000');

    // Simulate theme change
    mockUseColorScheme.mockReturnValue('dark');
    rerender({});

    expect(result.current).toBe('#FFFFFF');
  });
});
