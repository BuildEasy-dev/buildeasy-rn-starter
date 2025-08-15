import { ScreenWrapper } from '@/components/layout/wrappers/screen-wrapper';
import { CheckboxShowcase } from '@/features/ui-showcase/components/checkbox-showcase';

export default function CheckboxesScreen() {
  return (
    <ScreenWrapper scrollable padding={8}>
      <CheckboxShowcase />
    </ScreenWrapper>
  );
}
