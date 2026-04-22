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
    return 'odoo-button-secondary';
  }

  if (variant === 'danger') {
    return 'inline-flex items-center justify-center rounded-xl border border-red-500/35 bg-[linear-gradient(180deg,rgba(254,242,242,0.98),rgba(254,226,226,0.94))] px-3 py-2.5 text-sm font-medium text-red-700 shadow-[0_5px_0_rgba(248,113,113,0.5),0_14px_24px_-18px_rgba(127,29,29,0.3)] transition hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,rgba(254,242,242,1),rgba(254,202,202,0.96))] hover:shadow-[0_7px_0_rgba(248,113,113,0.55),0_18px_28px_-18px_rgba(127,29,29,0.34)] active:translate-y-[3px] active:shadow-[0_2px_0_rgba(248,113,113,0.5)]';
  }

  if (variant === 'warning') {
    return 'inline-flex items-center justify-center rounded-xl border border-amber-400/40 bg-[linear-gradient(180deg,rgba(255,251,235,0.98),rgba(254,243,199,0.96))] px-3 py-2.5 text-sm font-medium text-amber-800 shadow-[0_5px_0_rgba(251,191,36,0.45),0_14px_24px_-18px_rgba(120,53,15,0.28)] transition hover:-translate-y-0.5 hover:bg-[linear-gradient(180deg,rgba(255,251,235,1),rgba(253,230,138,0.96))] hover:shadow-[0_7px_0_rgba(251,191,36,0.5),0_18px_28px_-18px_rgba(120,53,15,0.32)] active:translate-y-[3px] active:shadow-[0_2px_0_rgba(251,191,36,0.45)]';
  }

  return 'btn-primary rounded-xl px-4 py-2.5';
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
