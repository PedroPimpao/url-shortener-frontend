'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LockKeyhole, Mail } from 'lucide-react';
import {
  AuthDivider,
  AuthField,
  AuthSubmitButton,
  AuthSwitchLink,
  MobileAuthLink,
  authInputClassName,
} from '@/components/auth/auth-form-controls';
import {
  AuthFormPanel,
  AuthPageShell,
} from '@/components/auth/auth-page-shell';
import { FormMessage } from '@/components/form-message';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/session';
import SocialLoginOptions from '@/components/social-login-options';

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (formData: FormData) => {
    setError('');
    setIsSubmitting(true);
    try {
      const tokens = await api.login({
        email: String(formData.get('email')).trim().toLowerCase(),
        password: String(formData.get('password')),
      });
      saveSession(tokens.access_token, tokens.refresh_token);
      router.replace('/dashboard');
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : 'Não foi possível entrar.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      backHref="/"
      mobileTag="Acesso"
      mobileEyebrow="Bem-vindo de volta"
      mobileTitle="Entre na sua conta"
      mobileDescription="Continue de onde parou. Seus projetos estão te esperando."
      desktopEyebrow="Você pode facilmente"
      desktopTitle="Acelerar seu trabalho com nosso App Web"
      desktopDescription="Organize projetos, colabore em tempo real e acompanhe tudo em um único painel."
      desktopItems={['Discord', 'Instagram', 'Spotify', 'YouTube', 'TikTok']}
    >
      <AuthFormPanel
        eyebrow="Acesso à conta"
        title="Comece agora"
        description="Faça login na sua conta para continuar."
      >
        <FormMessage>{error}</FormMessage>
        <form action={submit}>
          <AuthField
            id="new-login-email"
            label="E-mail"
            icon={Mail}
            className="mb-4 md:mb-5"
          >
            <Input
              id="new-login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              required
              className={authInputClassName}
            />
          </AuthField>
          <AuthField
            id="new-login-password"
            label="Senha"
            icon={LockKeyhole}
            className="mb-3.5 md:mb-0"
            aside={
              <Link
                href="/forgot-password"
                className="mb-2 hidden text-[12.5px] font-semibold text-[#3d5afe] hover:underline md:block"
              >
                Esqueceu a senha?
              </Link>
            }
          >
            <PasswordInput
              id="new-login-password"
              name="password"
              autoComplete="current-password"
              placeholder="Sua senha"
              required
              minLength={6}
              className={authInputClassName}
            />
          </AuthField>
          <div className="mb-4 text-right md:hidden">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#3d5afe]"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <div className="mt-6">
            <AuthSubmitButton
              loading={isSubmitting}
              idleLabel="Entrar"
              loadingLabel="Entrando..."
            />
          </div>
          <MobileAuthLink href="/signup">Criar conta</MobileAuthLink>
          <AuthSwitchLink
            text="Não tem uma conta?"
            href="/signup"
            label="Cadastre-se"
          />
          <AuthDivider>ou continue com</AuthDivider>
          <SocialLoginOptions />
        </form>
      </AuthFormPanel>
    </AuthPageShell>
  );
};

export default LoginPage;
