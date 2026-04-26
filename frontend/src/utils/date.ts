const dayMs = 24 * 60 * 60 * 1000;

function toUtcDate(dateText: string): Date {
  const [year, month, day] = dateText.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function normalizeDate(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

function formatDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function daysTogether(startDate: string, today = new Date()): number {
  const start = toUtcDate(startDate);
  const current = normalizeDate(today);
  return Math.max(1, Math.floor((current.getTime() - start.getTime()) / dayMs) + 1);
}

export function nextAnniversaryCountdown(startDate: string, today = new Date()) {
  const start = toUtcDate(startDate);
  const current = normalizeDate(today);
  let anniversary = new Date(Date.UTC(current.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));

  if (anniversary.getTime() < current.getTime()) {
    anniversary = new Date(Date.UTC(current.getUTCFullYear() + 1, start.getUTCMonth(), start.getUTCDate()));
  }

  return {
    date: formatDate(anniversary),
    days: Math.ceil((anniversary.getTime() - current.getTime()) / dayMs)
  };
}
