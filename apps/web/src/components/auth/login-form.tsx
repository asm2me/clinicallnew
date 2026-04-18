'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function getCallbackPath(value: string | null) {
  if (!value) return '/dashboard';

  try {
    const url = new URL(value, window.location.origin);
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return value.startsWith('/') ? value : '/dashboard';
  }
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getCallbackPath(searchParams.get('callbackUrl'));
  const [email, setEmail] = useState('superadmin@clinicall.demo');
  const [password, setPassword] = useState('demo1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl
      });

      if (result?.error) {
        const errorMessages: Record<string, string> = {
          CredentialsSignin: 'Invalid email or password.',
          Configuration: 'Server configuration error. Please contact support.',
          AccessDenied: 'Access denied. Your account may be inactive.',
        };
        setError(errorMessages[result.error] ?? result.error);
        return;
      }

      if (result?.ok) {
        router.replace(result.url ?? callbackUrl);
        router.refresh();
        return;
      }

      setError('Sign in failed. Please check your credentials and try again.');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="you@company.com"
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="Enter your password"
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          required
        />
      </div>

      {error ? (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <p className="font-medium">Development sign-in</p>
          <p className="mt-1">
            Use <span className="font-semibold">superadmin@clinicall.demo</span>,{' '}
            <span className="font-semibold">tenantadmin@clinicall.demo</span>,{' '}
            <span className="font-semibold">doctor@clinicall.demo</span>,{' '}
            <span className="font-semibold">staff@clinicall.demo</span>, or{' '}
            <span className="font-semibold">patient@clinicall.demo</span> with password{' '}
            <span className="font-semibold">demo1234</span>.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Sign in to Clinicall'}
      </button>
    </form>
  );
}