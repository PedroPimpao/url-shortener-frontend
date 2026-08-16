'use client';

import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { CheckCircle2, LockKeyhole, Mail } from 'lucide-react';
import {
  AuthField,
  AuthSubmitButton,
  MobileAuthLink,
  authInputClassName,
} from '@/components/auth/auth-form-controls';
import { FormMessage } from '@/components/form-message';
import { Button } from '@/components/ui/button';
import { FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { PasswordInput } from '@/components/ui/password-input';
import { passwordRecoveryAction } from '@/app/_actions/auth';

type Step = 'request' | 'verify' | 'complete' | 'done';

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export const ForgotPasswordForm = () => {
  const [state, formAction] = useActionState(passwordRecoveryAction, {
    data: { step: 'request' as const },
  });
  const step: Step = state.data?.step ?? 'request';
  const email = state.data?.email ?? '';
  const [otp, setOtp] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(120);

  useEffect(() => {
    if (step !== 'verify' || secondsLeft === 0) return;
    const timer = window.setInterval(
      () => setSecondsLeft((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [step, secondsLeft]);

  if (step === 'done') {
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto mb-4 size-12 text-emerald-500" />
        <h3 className="text-xl font-bold">Senha atualizada</h3>
        <p className="mt-2 mb-6 text-sm leading-6 text-[#8992a9]">
          Sua senha foi redefinida. Você já pode entrar novamente.
        </p>
        <Button
          nativeButton={false}
          render={<Link href="/login" />}
          className="h-12.5 w-full rounded-[14px] bg-linear-to-r from-[#3d5afe] to-[#2541db] font-bold text-white"
        >
          Ir para o login
        </Button>
      </div>
    );
  }

  return (
    <>
      <FormMessage>{state.error}</FormMessage>
      <FormMessage success>
        {state.message
          ? `${state.message}${state.data?.otp ? `. Código: ${state.data.otp}` : ''}`
          : ''}
      </FormMessage>
      <form action={formAction}>
        <input type="hidden" name="step" value={step} />
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="token" value={state.data?.token ?? ''} />
        {step === 'request' && (
          <>
            <AuthField id="recovery-email" label="E-mail" icon={Mail}>
              <Input
                id="recovery-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="voce@email.com"
                required
                className={authInputClassName}
              />
            </AuthField>
            <div className="mt-6">
              <AuthSubmitButton
                idleLabel="Enviar código"
                loadingLabel="Enviando..."
              />
            </div>
          </>
        )}

        {step === 'verify' && (
          <div className="text-center">
            <p className="text-sm leading-6 text-[#8992a9]">
              Enviamos um código de verificação de 6 dígitos para
            </p>
            <p className="mt-1 font-semibold text-[#0b1130]">{email}</p>
            <InputOTP
              name="otp"
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={setOtp}
              containerClassName="my-8 justify-center"
              aria-label="Código de verificação de seis dígitos"
              required
            >
              <InputOTPGroup className="gap-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="size-11 rounded-xl border border-[#e7eaf3] bg-[#f6f8fc] text-base font-bold shadow-sm first:rounded-xl first:border last:rounded-xl data-[active=true]:border-[#3d5afe] data-[active=true]:ring-3 data-[active=true]:ring-[#3d5afe]/15"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription className="text-center text-xs">
              {secondsLeft > 0
                ? `O código expira em ${formatTime(secondsLeft)}`
                : 'O código expirou. Solicite um novo código.'}
            </FieldDescription>
            <Button
              type="submit"
              name="intent"
              value="resend"
              variant="link"
              disabled={secondsLeft > 0}
              onClick={() => {
                setOtp('');
                setSecondsLeft(120);
              }}
              className="mt-2 text-[#3d5afe] disabled:opacity-50"
            >
              Reenviar código
            </Button>
            <div className="mt-5">
              <AuthSubmitButton
                idleLabel="Verificar código"
                loadingLabel="Verificando..."
              />
            </div>
          </div>
        )}

        {step === 'complete' && (
          <>
            <AuthField
              id="recovery-password"
              label="Nova senha"
              icon={LockKeyhole}
              className="mb-4"
            >
              <PasswordInput
                id="recovery-password"
                name="password"
                autoComplete="new-password"
                placeholder="Crie uma senha forte"
                required
                minLength={8}
                maxLength={72}
                className={authInputClassName}
              />
            </AuthField>
            <AuthField
              id="recovery-confirmation"
              label="Confirme a nova senha"
              icon={LockKeyhole}
            >
              <PasswordInput
                id="recovery-confirmation"
                name="confirmation"
                autoComplete="new-password"
                placeholder="Repita a nova senha"
                required
                minLength={8}
                maxLength={72}
                className={authInputClassName}
              />
            </AuthField>
            <div className="mt-6">
              <AuthSubmitButton
                idleLabel="Redefinir senha"
                loadingLabel="Redefinindo..."
              />
            </div>
          </>
        )}
      </form>
      <MobileAuthLink href="/login">Voltar ao login</MobileAuthLink>
      <p className="mt-5 text-center text-sm text-[#8992a9] max-md:hidden">
        Lembrou sua senha?{' '}
        <Link
          href="/login"
          className="font-bold text-[#3d5afe] hover:underline"
        >
          Voltar ao login
        </Link>
      </p>
    </>
  );
};
