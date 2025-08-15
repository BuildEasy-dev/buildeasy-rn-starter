import { ScreenWrapper } from '@/components/layout/wrappers/screen-wrapper';
import { RadioShowcase } from '@/features/ui-showcase/components/radio-showcase';

export default function RadiosScreen() {
  return (
    <ScreenWrapper scrollable padding={8}>
      <RadioShowcase />
    </ScreenWrapper>
  );
}
