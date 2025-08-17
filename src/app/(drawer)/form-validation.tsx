import { ScreenWrapper } from '@/components/layout/wrappers/screen-wrapper';
import { FormValidationShowcase } from '@/features/ui-showcase/components/form-validation-showcase';

export default function FormValidationScreen() {
  return (
    <ScreenWrapper scrollable padding={8} safeArea="bottom">
      <FormValidationShowcase />
    </ScreenWrapper>
  );
}
