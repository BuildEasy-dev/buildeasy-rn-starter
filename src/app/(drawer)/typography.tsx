import React from 'react';
import { ScreenWrapper } from '@/components/layout';
import { TypographyShowcase } from '@/features/ui-showcase';

export default function TypographyPage() {
  return (
    <ScreenWrapper scrollable safeArea="bottom" padding={8}>
      <TypographyShowcase />
    </ScreenWrapper>
  );
}
