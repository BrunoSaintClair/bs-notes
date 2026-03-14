export function formatDate(dateStr: string): string {
  return dateStr.split('-').reverse().join('/');
}

export function formatDateTime(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
