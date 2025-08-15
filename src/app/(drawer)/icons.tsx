import { ScreenWrapper } from '@/components/layout/wrappers/screen-wrapper';
import { IconShowcase } from '@/features/ui-showcase/components/icon-showcase';

export default function IconsScreen() {
  return (
    <ScreenWrapper scrollable padding={8}>
      <IconShowcase />
    </ScreenWrapper>
  );
}
