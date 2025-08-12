import React from 'react';
import { ViewStyle } from 'react-native';
import { EmptyState } from '@/components/layout/common';
import { type IconSymbolName } from '@/components/ui/icon-symbol';

export interface ListEmptyStateProps {
  title?: string;
  message?: string;
  icon?: IconSymbolName;
  onAction?: () => void;
  actionLabel?: string;
  containerStyle?: ViewStyle;
}

/**
 * List-specific empty state component.
 * Wraps the common EmptyState with list-optimized defaults.
 */
export function ListEmptyState({
  title = 'No items found',
  message,
  icon = 'doc.text',
  onAction,
  actionLabel = 'Try Again',
  containerStyle,
}: ListEmptyStateProps) {
  return (
    <EmptyState
      title={title}
      message={message}
      icon={icon}
      actionLabel={actionLabel}
      onAction={onAction}
      fullScreen={false}
      containerStyle={containerStyle}
    />
  );
}
