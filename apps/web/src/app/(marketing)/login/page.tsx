import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center">
        <div className="w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Clinicall Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Sign in to your account to continue</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </main>
  );
}