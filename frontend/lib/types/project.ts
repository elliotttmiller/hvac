export type ProjectStatus =
  | 'not_started'
  | 'in_progress'
  | 'delayed'
  | 'completed'
  | 'closed'
  | 'active'
  | 'pending'
  | 'queued'
  | 'running'
  | string; // allow legacy / unknown strings

export function normalizeStatus(raw?: string | null): string {
  if (!raw) return '';
  return raw.toString().trim().toLowerCase();
}
