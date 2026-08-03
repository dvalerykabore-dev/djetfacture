/**
 * Centralized formatting utility for DJETFACTURE (FCFA, French dates, Phone numbers)
 */

/**
 * Format a integer amount in FCFA (XOF/XAF, exponent 0).
 * Example: 1250000 -> "1 250 000 FCFA"
 */
export function formatFCFA(amount: number | bigint): string {
  const num = typeof amount === 'bigint' ? Number(amount) : amount;
  const formattedNumber = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(num);

  return `${formattedNumber} FCFA`;
}

/**
 * Format date string or Date object to DD/MM/YYYY French format.
 * Example: "2026-07-25" -> "25/07/2026"
 */
export function formatDateFR(date: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return typeof date === 'string' ? date : '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Format African phone numbers neatly (e.g. +221 77 123 45 67)
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  return phone.replace(/(\+\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}
