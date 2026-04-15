/**
 * Maps a status string (from demo-data) to the corresponding
 * CSS class name defined in globals.css under @layer components.
 */
export function getStatusClass(status: string): string {
  const normalized = status.toLowerCase().replace(/[\s\-_]/g, '-');

  const map: Record<string, string> = {
    confirmed: 'status-confirmed',
    completed: 'status-completed',
    pending: 'status-pending',
    cancelled: 'status-cancelled',
    canceled: 'status-cancelled',
    urgent: 'status-urgent',
    stable: 'status-stable',
    'needs-follow-up': 'status-needs-followup',
    'needs-followup': 'status-needs-followup',
    'under-review': 'status-under-review',
    operational: 'status-operational',
    launching: 'status-launching',
    available: 'status-available',
    // Activity-specific statuses
    improved: 'status-confirmed',
    healthy: 'status-stable',
    smooth: 'status-stable',
    done: 'status-completed',
    updated: 'status-confirmed',
    busy: 'status-pending',
    'needs-review': 'status-pending',
    new: 'status-launching',
  };

  return map[normalized] ?? 'status-default';
}

/**
 * Returns the full className string for a status badge pill.
 * Usage: <span className={statusBadge(item.status)}>{item.status}</span>
 */
export function statusBadge(status: string): string {
  return `inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(status)}`;
}
