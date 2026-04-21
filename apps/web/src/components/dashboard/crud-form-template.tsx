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
    return 'inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50';
  }

  if (variant === 'danger') {
    return 'inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100';
  }

  if (variant === 'warning') {
    return 'inline-flex items-center justify-center rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-100';
  }

  return 'inline-flex items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700';
}

export function crudInputClassName() {
  return 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100';
}

export function crudSelectClassName() {
  return crudInputClassName();
}

export function crudTextAreaClassName() {
  return 'min-h-28 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-100';
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
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
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
        'flex flex-wrap items-center justify-end gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3'
      }
    >
      {children}
    </div>
  );
}
