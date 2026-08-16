'use client';

import { useActionState } from 'react';
import Link from 'next/link';
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
import SocialLoginOptions from '@/components/social-login-options';
import { loginAction } from '@/app/_actions/auth';
import { initialActionState } from '@/app/_actions/types';

const LoginPage = () => {
  const [state, formAction] = useActionState(loginAction, initialActionState);

  return (
    <AuthPageShell
      backHref="/"
      mobileTag="Acesso"
      eyebrow="Bem-vindo de volta"
      title="Entre na sua conta"
      description="Continue de onde parou. Gerencie seus links."
    >
      <AuthFormPanel
        eyebrow="Acesso à conta"
        title="Comece agora"
        description="Faça login na sua conta para continuar."
      >
        <FormMessage>{state.error}</FormMessage>
        <form action={formAction}>
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
            <AuthSubmitButton idleLabel="Entrar" loadingLabel="Entrando..." />
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
