let _counter = 0;

/**
 * Generate a unique ID that is guaranteed not to collide within the same session.
 * Combines timestamp, random string, and an incrementing counter to avoid
 * the `Date.now()` millisecond-collision bug.
 */
export function uid(): string {
  _counter = (_counter + 1) % 99999;
  return `${Date.now().toString(36)}-${_counter}-${Math.random().toString(36).slice(2, 8)}`;
}
