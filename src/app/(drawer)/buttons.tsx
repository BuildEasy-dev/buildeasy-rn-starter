import { ScreenWrapper } from '@/components/layout/wrappers/screen-wrapper';
import { ButtonShowcase } from '@/features/ui-showcase/components/button-showcase';

export default function ButtonsScreen() {
  return (
    <ScreenWrapper scrollable padding={8} safeArea="bottom">
      <ButtonShowcase />
    </ScreenWrapper>
  );
}
