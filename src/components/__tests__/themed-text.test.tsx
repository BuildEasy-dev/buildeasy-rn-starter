import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '@/components/themed/themed-text';

// Mock the useThemeColor hook
jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: jest.fn((props: any, colorName: string) => {
    const mockColors: Record<string, string> = {
      text: '#000000',
    };
    return props.light || props.dark || mockColors[colorName] || '#000000';
  }),
}));

describe('ThemedText', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => {
      render(<ThemedText>Hello World</ThemedText>);
    }).not.toThrow();
  });

  it('renders with different types without crashing', () => {
    expect(() => {
      render(<ThemedText type="body1">Default Text</ThemedText>);
      render(<ThemedText type="h1">Title Text</ThemedText>);
      render(<ThemedText type="h3">Subtitle Text</ThemedText>);
      render(
        <ThemedText type="body1" weight="semibold">
          Semi Bold Text
        </ThemedText>
      );
      render(
        <ThemedText type="body1" variant="link">
          Link Text
        </ThemedText>
      );
    }).not.toThrow();
  });

  it('renders with custom colors without crashing', () => {
    expect(() => {
      render(
        <ThemedText lightColor="#FF0000" darkColor="#00FF00">
          Custom Color Text
        </ThemedText>
      );
    }).not.toThrow();
  });

  it('renders with custom styles without crashing', () => {
    const customStyle = { marginTop: 20, fontSize: 18 };
    expect(() => {
      render(<ThemedText style={customStyle}>Styled Text</ThemedText>);
    }).not.toThrow();
  });

  it('renders with additional Text props without crashing', () => {
    const onPress = jest.fn();
    expect(() => {
      render(
        <ThemedText onPress={onPress} testID="themed-text">
          Pressable Text
        </ThemedText>
      );
    }).not.toThrow();
  });

  it('calls useThemeColor with correct parameters', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockUseThemeColor = require('@/hooks/use-theme-color').useThemeColor;

    render(
      <ThemedText lightColor="#FF0000" darkColor="#00FF00">
        Test
      </ThemedText>
    );

    expect(mockUseThemeColor).toHaveBeenCalledWith({ light: '#FF0000', dark: '#00FF00' }, 'text');
  });

  it('calls useThemeColor with default parameters when no colors provided', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockUseThemeColor = require('@/hooks/use-theme-color').useThemeColor;

    render(<ThemedText>Test</ThemedText>);

    expect(mockUseThemeColor).toHaveBeenCalledWith({}, 'text');
  });
});
