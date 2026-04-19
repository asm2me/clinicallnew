'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

type SignOutButtonProps = {
  callbackUrl?: string;
  className?: string;
};

export function SignOutButton({
  callbackUrl = '/login',
  className = 'odoo-button-secondary w-full justify-center',
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);

    try {
      await signOut({
        callbackUrl,
        redirect: true,
      });
    } catch (error) {
      console.error('[logout] Sign-out failed:', error);
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isLoading}
      aria-busy={isLoading}
      className={className}
    >
      {isLoading ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
