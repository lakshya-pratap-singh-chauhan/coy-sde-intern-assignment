export function timeAgo(sqliteTimestamp: string): string {
  if (!sqliteTimestamp) return '';
  const date = new Date(sqliteTimestamp.replace(' ', 'T') + 'Z');
  const timestamp = date.getTime();
  if (isNaN(timestamp)) return '';

  const now = Date.now();
  const diffMs = now - timestamp;
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  if (diffMs < oneHour) {
    return 'Just now';
  }
  if (diffMs < oneDay) {
    return 'Today';
  }
  if (diffMs < 2 * oneDay) {
    return 'Yesterday';
  }
  if (diffMs < 7 * oneDay) {
    const days = Math.floor(diffMs / oneDay);
    return `${days} days ago`;
  }
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
