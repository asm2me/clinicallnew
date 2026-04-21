"use client";

import { type ReactNode, useEffect, useId, useState } from "react";

export type CrudModalProps = {
  title: string;
  description?: string;
  triggerLabel?: string;
  triggerClassName?: string;
  children: ReactNode;
};

const defaultTriggerClassName =
  "inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700";

export function CrudModal({
  title,
  description,
  triggerLabel = "Open",
  triggerClassName,
  children,
}: CrudModalProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={triggerClassName ?? defaultTriggerClassName}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
        >
          <button
            type="button"
            aria-label="Close dialog backdrop"
            className="absolute inset-0 bg-slate-950/60"
            onClick={() => setOpen(false)}
          />

          <div className="relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100vh-4rem)]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="space-y-1">
                <h2 id={titleId} className="text-lg font-semibold text-slate-900">
                  {title}
                </h2>
                {description ? (
                  <p id={descriptionId} className="text-sm text-slate-600">
                    {description}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                aria-label="Close dialog"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                onClick={() => setOpen(false)}
              >
                <span aria-hidden="true" className="text-xl leading-none">
                  ×
                </span>
              </button>
            </div>

            <div className="overflow-y-auto px-5 py-4 sm:px-6 sm:py-5">{children}</div>
          </div>
        </div>
      ) : null}
    </>
  );
}