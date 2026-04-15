type DemoBannerProps = {
  message?: string;
};

export function DemoBanner({ message = 'Demo workspace — data is illustrative and role-scoped.' }: DemoBannerProps) {
  return (
    <div
      role="status"
      aria-label="Demo mode notice"
      className="mb-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
    >
      <span aria-hidden="true" className="shrink-0">
        ⚠
      </span>
      {message}
    </div>
  );
}
