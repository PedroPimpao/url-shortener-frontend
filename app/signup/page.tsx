'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LockKeyhole, Mail, UserRound } from 'lucide-react';
import {
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
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { api } from '@/lib/api';

const PasswordStrength = ({ strength }: { strength: number }) => (
  <div className="flex gap-1.5">
    {[1, 2, 3, 4].map((level) => (
      <span
        key={level}
        className={`h-1 flex-1 rounded transition-colors ${strength < level ? 'bg-[#e7eaf3]' : strength < 3 ? 'bg-[#ff5c7a]' : strength === 3 ? 'bg-amber-400' : 'bg-emerald-500'}`}
      />
    ))}
  </div>
);

const SignupPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const strength = useMemo(
    () =>
      password
        ? Math.min(
            4,
            [
              password.length >= 6,
              password.length >= 10,
              /[A-Z]/.test(password) && /[a-z]/.test(password),
              /\d|[^a-zA-Z]/.test(password),
            ].filter(Boolean).length,
          )
        : 0,
    [password],
  );

  const submit = async (formData: FormData) => {
    if (!formData.get('agree')) {
      setError(
        'Você precisa aceitar os Termos de Uso e a Política de Privacidade.',
      );
      return;
    }
    setError('');
    try {
      const firstName = String(formData.get('firstName')).trim();
      const lastName = String(formData.get('lastName')).trim();
      await api.createAccount({
        name: [firstName, lastName].filter(Boolean).join(' '),
        email: String(formData.get('email')).trim().toLowerCase(),
        password: String(formData.get('password')),
      });
      router.push('/login');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Não foi possível criar a conta.',
      );
    }
  };

  return (
    <AuthPageShell
      backHref="/login"
      mobileTag="Cadastro"
      eyebrow="Leva menos de 1 minuto"
      title="Crie sua conta gratuita"
      description="Tudo pronto para você criar e gerenciar seus links.."
    >
      <AuthFormPanel
        eyebrow="Novo por aqui"
        title="Crie sua conta"
        description="Preencha os dados abaixo para começar gratuitamente."
        showProgress
      >
        <FormMessage>{error}</FormMessage>
        <form action={submit}>
          <div className="md:grid md:grid-cols-2 md:gap-3">
            <AuthField
              id="new-signup-first"
              label={
                <>
                  <span className="md:hidden">Nome completo</span>
                  <span className="hidden md:inline">Nome</span>
                </>
              }
              icon={UserRound}
              className="mb-3.5 md:mb-4"
            >
              <Input
                id="new-signup-first"
                name="firstName"
                autoComplete="given-name"
                placeholder="Seu nome"
                required
                className={authInputClassName}
              />
            </AuthField>
            <AuthField
              id="new-signup-last"
              label="Sobrenome"
              className="mb-4 hidden md:flex"
            >
              <Input
                id="new-signup-last"
                name="lastName"
                autoComplete="family-name"
                placeholder="Seu sobrenome"
                className={authInputClassName}
              />
            </AuthField>
          </div>
          <AuthField
            id="new-signup-email"
            label="E-mail"
            icon={Mail}
            className="mb-3.5 md:mb-4"
          >
            <Input
              id="new-signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              required
              className={authInputClassName}
            />
          </AuthField>
          <AuthField
            id="new-signup-password"
            label="Senha"
            icon={LockKeyhole}
            className="mb-2"
          >
            <PasswordInput
              id="new-signup-password"
              name="password"
              autoComplete="new-password"
              placeholder="Crie uma senha forte"
              required
              minLength={6}
              maxLength={72}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={authInputClassName}
            />
          </AuthField>
          <PasswordStrength strength={strength} />
          <Field orientation="horizontal" className="my-4 items-start gap-2.5">
            <input
              id="new-signup-agree"
              name="agree"
              type="checkbox"
              required
              className="mt-0.5 size-4 shrink-0 accent-[#3d5afe]"
            />
            <FieldLabel
              htmlFor="new-signup-agree"
              className="cursor-pointer items-start"
            >
              <FieldDescription className="text-xs leading-5">
                Eu concordo com os{' '}
                <Link href="#" className="font-semibold text-[#3d5afe]">
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link href="#" className="font-semibold text-[#3d5afe]">
                  Política de Privacidade
                </Link>
                .
              </FieldDescription>
            </FieldLabel>
          </Field>
          <AuthSubmitButton idleLabel="Criar conta" loadingLabel="Criando..." />
          <MobileAuthLink href="/login">Já tenho conta</MobileAuthLink>
          <AuthSwitchLink
            text="Já tem uma conta?"
            href="/login"
            label="Entrar"
          />
        </form>
      </AuthFormPanel>
    </AuthPageShell>
  );
};

export default SignupPage;
