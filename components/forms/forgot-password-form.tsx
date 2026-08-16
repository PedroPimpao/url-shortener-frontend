'use client';

import { useEffect, useState } from 'react';
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
import { api } from '@/lib/api';

type Step = 'request' | 'verify' | 'complete' | 'done';

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export const ForgotPasswordForm = () => {
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (step !== 'verify' || secondsLeft === 0) return;
    const timer = window.setInterval(
      () => setSecondsLeft((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [step, secondsLeft]);

  const submit = async (formData: FormData) => {
    setError('');
    setMessage('');
    try {
      if (step === 'request') {
        const normalizedEmail = String(formData.get('email'))
          .trim()
          .toLowerCase();
        const result = await api.requestPasswordReset(normalizedEmail);
        setEmail(normalizedEmail);
        setMessage(result.message);
        setSecondsLeft(120);
        setStep('verify');
        return;
      }
      if (step === 'verify') {
        const result = await api.verifyPasswordReset(email, otp);
        setToken(result.reset_token);
        setStep('complete');
        return;
      }
      const password = String(formData.get('password'));
      const confirmation = String(formData.get('confirmation'));
      if (password !== confirmation) {
        setError('A nova senha e a confirmação precisam ser iguais.');
        return;
      }
      await api.completePasswordReset(token, password, confirmation);
      setStep('done');
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Não foi possível redefinir sua senha.',
      );
    }
  };

  const resendCode = async () => {
    if (isResending || secondsLeft > 0) return;
    setError('');
    setMessage('');
    setIsResending(true);
    try {
      const result = await api.requestPasswordReset(email);
      setMessage(result.message);
      setOtp('');
      setSecondsLeft(120);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : 'Não foi possível reenviar o código.',
      );
    } finally {
      setIsResending(false);
    }
  };

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
      <FormMessage>{error}</FormMessage>
      <FormMessage success>{message}</FormMessage>
      <form action={submit}>
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
              type="button"
              variant="link"
              disabled={secondsLeft > 0 || isResending}
              onClick={resendCode}
              className="mt-2 text-[#3d5afe] disabled:opacity-50"
            >
              {isResending ? 'Reenviando...' : 'Reenviar código'}
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
