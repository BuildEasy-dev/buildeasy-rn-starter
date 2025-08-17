import { ScreenWrapper } from '@/components/layout';
import { TextInputShowcase } from '@/features/ui-showcase/components/text-input-showcase';

export default function TextInputsScreen() {
  return (
    <ScreenWrapper safeArea="bottom">
      <TextInputShowcase />
    </ScreenWrapper>
  );
}
