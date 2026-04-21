'use client';

import Link from 'next/link';
import { useState } from 'react';

const primaryLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
];

const journalLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/90 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="grid gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,1fr)] lg:items-center">
            <div className="flex items-start justify-between gap-4">
              <Link
                href="/"
                className="group inline-flex items-start gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-sm font-semibold text-foreground transition-transform duration-200 group-hover:-translate-y-0.5">
                  CL
                </span>
                <span className="space-y-0.5">
                  <span className="block text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                    Clinicall
                  </span>
                  <span className="block text-base font-semibold text-foreground">
                    Operating system for modern clinics
                  </span>
                </span>
              </Link>

              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-foreground transition hover:bg-accent lg:hidden"
                aria-expanded={isOpen}
                aria-controls="mobile-site-navigation"
                onClick={() => setIsOpen((value) => !value)}
              >
                <span className="sr-only">Toggle site navigation</span>
                <MenuIcon />
              </button>
            </div>

            <nav
              aria-label="Primary"
              className="hidden lg:flex lg:items-center lg:justify-center"
            >
              <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card/80 p-1">
                {primaryLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="hidden items-center justify-end gap-4 lg:flex">
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Journal
                </p>
                <div className="mt-1 flex items-center gap-3">
                  {journalLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="h-10 w-px bg-border" />

              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
                >
                  Start free
                  <ArrowUpRightIcon />
                </Link>
              </div>
            </div>
          </div>

          <div
            id="mobile-site-navigation"
            className={isOpen ? 'border-t border-border lg:hidden' : 'hidden'}
          >
            <div className="grid gap-6 px-4 py-5 sm:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Navigate
                </p>
                <div className="mt-3 grid gap-2">
                  {[...primaryLinks, ...journalLinks].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Link
                  href="/login"
                  className="rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
                  onClick={() => setIsOpen(false)}
                >
                  Start free
                  <ArrowUpRightIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}