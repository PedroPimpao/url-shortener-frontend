import {
  AuthFormPanel,
  AuthPageShell,
} from '@/components/auth/auth-page-shell';
import { ForgotPasswordForm } from '@/components/forms/forgot-password-form';

const ForgotPasswordPage = () => (
  <AuthPageShell
    backHref="/login"
    mobileTag="Recuperação"
    eyebrow="Recupere seu acesso"
    title="Redefina sua senha"
    description="Confirme sua identidade e escolha uma nova senha para acessar seus links."
  >
    <AuthFormPanel
      eyebrow="Segurança da conta"
      title="Recuperação de senha"
      description="Siga as etapas para voltar a acessar sua conta."
      showProgress
    >
      <ForgotPasswordForm />
    </AuthFormPanel>
  </AuthPageShell>
);

export default ForgotPasswordPage;
