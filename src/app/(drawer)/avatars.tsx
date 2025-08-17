import { ScreenWrapper } from '@/components/layout/wrappers/screen-wrapper';
import { AvatarShowcase } from '@/features/ui-showcase/components/avatar-showcase';

export default function AvatarsScreen() {
  return (
    <ScreenWrapper scrollable padding={8} safeArea="bottom">
      <AvatarShowcase />
    </ScreenWrapper>
  );
}
