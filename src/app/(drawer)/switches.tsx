import { ScreenWrapper } from '@/components/layout/wrappers/screen-wrapper';
import { SwitchShowcase } from '@/features/ui-showcase/components/switch-showcase';

export default function SwitchesScreen() {
  return (
    <ScreenWrapper scrollable padding={8}>
      <SwitchShowcase />
    </ScreenWrapper>
  );
}
