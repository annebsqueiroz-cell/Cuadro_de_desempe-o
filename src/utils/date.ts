export const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatMonthLabel(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const monthIndex = parseInt(monthStr, 10) - 1;
  const monthName = MONTH_NAMES_ES[monthIndex] || 'Mes';
  return `${monthName} de ${yearStr}`;
}

export function getMonthOptions(): { key: string; label: string }[] {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-11

  const options: { key: string; label: string }[] = [];

  // Generate 6 months past and 3 months ahead
  for (let offset = -4; offset <= 2; offset++) {
    const d = new Date(currentYear, currentMonth + offset, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const key = `${y}-${m}`;
    options.push({
      key,
      label: formatMonthLabel(key),
    });
  }

  return options;
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}
