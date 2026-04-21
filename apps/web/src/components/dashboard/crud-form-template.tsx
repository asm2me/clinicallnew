import type { ReactNode } from 'react';

import { CrudModal } from './crud-modal';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning';

type CrudFormModalProps = {
  title: string;
  description?: string;
  triggerLabel: string;
  triggerClassName?: string;
  children: ReactNode;
};

type CrudFormGridProps = {
  children: ReactNode;
  className?: string;
};

type CrudFormActionsProps = {
  children: ReactNode;
  className?: string;
};

export function crudPopupTriggerClassName(variant: ButtonVariant = 'primary') {
  if (variant === 'secondary') {
    return 'inline-flex items-center justify-center rounded-xl border border-border/70 bg-card/90 px-3 py-2 text-sm font-medium text-foreground transition hover:bg-accent hover:text-foreground';
  }

  if (variant === 'danger') {
    return 'inline-flex items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-100 transition hover:bg-red-500/15';
  }

  if (variant === 'warning') {
    return 'inline-flex items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-500/15';
  }

  return 'inline-flex items-center justify-center rounded-xl bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-95';
}

export function crudInputClassName() {
  return 'w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15';
}

export function crudSelectClassName() {
  return crudInputClassName();
}

export function crudTextAreaClassName() {
  return 'min-h-28 w-full rounded-xl border border-border/70 bg-background/80 px-3 py-2 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/15';
}

export function CrudFormModal({
  title,
  description,
  triggerLabel,
  triggerClassName,
  children,
}: CrudFormModalProps) {
  return (
    <CrudModal
      title={title}
      description={description}
      triggerLabel={triggerLabel}
      triggerClassName={triggerClassName}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-border/70 bg-card/70 px-4 py-3 text-sm text-muted-foreground">
          Complete the form fields below, then submit to save your changes.
        </div>

        {children}
      </div>
    </CrudModal>
  );
}

export function CrudFormGrid({ children, className }: CrudFormGridProps) {
  return <div className={className ?? 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'}>{children}</div>;
}

export function CrudFormActions({ children, className }: CrudFormActionsProps) {
  return (
    <div
      className={
        className ??
        'flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-border/70 bg-card/70 px-4 py-3'
      }
    >
      {children}
    </div>
  );
}
