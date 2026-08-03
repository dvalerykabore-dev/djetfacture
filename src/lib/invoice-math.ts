import { roundHalfUp, calculateLineSubtotal } from './money';

export interface InvoiceLineItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: bigint;
  discountPercent?: number;
  taxRate: number; // e.g. 18 for 18%
}

export interface InvoiceTotals {
  subtotal: bigint;
  taxGroupTotals: Record<number, bigint>;
  taxTotal: bigint;
  total: bigint;
}

/**
 * Calculates complete invoice totals according to section 3.4 rules:
 * - Line subtotal = round(quantity * unit_price) - discount
 * - Group lines by tax rate
 * - Tax(t) = round_half_up(base(t) * t / 100)
 * - Total = sum(line_subtotals) + sum(tax(t))
 */
export function calculateInvoiceTotals(items: InvoiceLineItem[]): InvoiceTotals {
  let subtotal = 0n;
  const taxBases: Record<number, bigint> = {};

  for (const item of items) {
    const lineSub = calculateLineSubtotal(
      item.quantity,
      item.unitPrice,
      item.discountPercent || 0
    );
    subtotal += lineSub;

    const rate = item.taxRate || 0;
    taxBases[rate] = (taxBases[rate] || 0n) + lineSub;
  }

  const taxGroupTotals: Record<number, bigint> = {};
  let taxTotal = 0n;

  for (const [rateStr, base] of Object.entries(taxBases)) {
    const rate = Number(rateStr);
    if (rate > 0) {
      const taxAmount = roundHalfUp((Number(base) * rate) / 100);
      taxGroupTotals[rate] = taxAmount;
      taxTotal += taxAmount;
    } else {
      taxGroupTotals[0] = 0n;
    }
  }

  return {
    subtotal,
    taxGroupTotals,
    taxTotal,
    total: subtotal + taxTotal,
  };
}
