'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  buildDemoLoginUrl,
  DEMO_CREDENTIALS,
  getDemoCredentialsByEmail,
  getDemoCredentialsByRole,
  type DemoRole,
} from '@/lib/demo-auth';

type DemoLoginFormProps = {
  defaultRole?: DemoRole | null;
};

export function DemoLoginForm({ defaultRole = 'Super Admin' }: DemoLoginFormProps) {
  const router = useRouter();
  const initialRole = defaultRole ?? 'Super Admin';
  const [email, setEmail] = useState(getDemoCredentialsByRole(initialRole).email);
  const [password, setPassword] = useState(getDemoCredentialsByRole(initialRole).password);
  const [error, setError] = useState<string | null>(null);

  const selectedCredential = useMemo(() => getDemoCredentialsByEmail(email), [email]);

  function handleRoleChange(nextRole: DemoRole) {
    const credentials = getDemoCredentialsByRole(nextRole);
    setEmail(credentials.email);
    setPassword(credentials.password);
    setError(null);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const credentials = getDemoCredentialsByEmail(email);
    if (!credentials || credentials.password !== password) {
      setError('Use one of the documented demo credential pairs below.');
      return;
    }

    router.push(buildDemoLoginUrl(credentials.role));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50"
      >
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Demo auth</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Sign in to ClinicAll</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            This is a demo-only login flow. Use the deterministic credentials below to preview the app for each role.
          </p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {DEMO_CREDENTIALS.map((credentials) => (
            <button
              key={credentials.role}
              type="button"
              onClick={() => handleRoleChange(credentials.role)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                selectedCredential?.role === credentials.role
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="text-sm font-semibold text-slate-900">{credentials.label}</div>
              <div className="mt-1 text-xs text-slate-500">{credentials.email}</div>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-emerald-500"
              placeholder="superadmin@clinicall.demo"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-emerald-500"
              placeholder="demo1234"
            />
          </label>

          {error ? (
            <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
          ) : null}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Continue to dashboard
          </button>
        </div>
      </form>

      <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Demo credentials</p>
          <p className="mt-2 text-sm text-slate-600">Every account uses the same password for quick role switching.</p>
        </div>

        <div className="space-y-3">
          {DEMO_CREDENTIALS.map((credentials) => (
            <div key={credentials.role} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-900">{credentials.label}</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {credentials.role}
                </span>
              </div>
              <div className="mt-2 space-y-1 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-700">Email:</span> {credentials.email}
                </p>
                <p>
                  <span className="font-medium text-slate-700">Password:</span> {credentials.password}
                </p>
                <p>{credentials.description}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
