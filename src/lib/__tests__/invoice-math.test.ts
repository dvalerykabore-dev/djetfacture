import { describe, it, expect } from 'vitest';
import { calculateInvoiceTotals, InvoiceLineItem } from '../invoice-math';
import { formatFCFA, formatDateFR } from '../format';

describe('Logic métier d’arithmétique financière DJETFACTURE (FCFA)', () => {
  it('calcule correctement une ligne simple à 18% de TVA', () => {
    const items: InvoiceLineItem[] = [
      {
        description: 'Audit de sécurité',
        quantity: 1,
        unitPrice: BigInt(1000000),
        taxRate: 18,
      },
    ];

    const totals = calculateInvoiceTotals(items);
    expect(totals.subtotal).toBe(BigInt(1000000));
    expect(totals.taxGroupTotals[18]).toBe(BigInt(180000));
    expect(totals.taxTotal).toBe(BigInt(180000));
    expect(totals.total).toBe(BigInt(1180000));
  });

  it('gère les quantités décimales et les remises sans erreur de flottant', () => {
    const items: InvoiceLineItem[] = [
      {
        description: 'Assistance technique (2.5 jours)',
        quantity: 2.5,
        unitPrice: BigInt(200000), // Brut = 500 000
        discountPercent: 10, // Remise = 50 000 -> HT = 450 000
        taxRate: 18,
      },
    ];

    const totals = calculateInvoiceTotals(items);
    expect(totals.subtotal).toBe(BigInt(450000));
    expect(totals.taxGroupTotals[18]).toBe(BigInt(81000)); // 450 000 * 18% = 81 000
    expect(totals.total).toBe(BigInt(531000));
  });

  it('regroupe la TVA par groupe de taux pour éviter l’accumulation d’arrondis', () => {
    const items: InvoiceLineItem[] = [
      {
        description: 'Ligne 1 (TVA 18%)',
        quantity: 1,
        unitPrice: BigInt(100000),
        taxRate: 18,
      },
      {
        description: 'Ligne 2 (TVA 18%)',
        quantity: 1,
        unitPrice: BigInt(200000),
        taxRate: 18,
      },
      {
        description: 'Ligne 3 (Exonérée 0%)',
        quantity: 1,
        unitPrice: BigInt(500000),
        taxRate: 0,
      },
    ];

    const totals = calculateInvoiceTotals(items);
    expect(totals.subtotal).toBe(BigInt(800000));
    expect(totals.taxGroupTotals[18]).toBe(BigInt(54000)); // (100k + 200k) * 18% = 54k
    expect(totals.taxGroupTotals[0]).toBe(BigInt(0));
    expect(totals.total).toBe(BigInt(854000));
  });

  it('formate les montants en FCFA avec séparateur de milliers et sans centimes', () => {
    expect(formatFCFA(1250000)).toContain('1 250 000 FCFA');
    expect(formatFCFA(0)).toContain('0 FCFA');
  });

  it('formate les dates au format français JJ/MM/AAAA', () => {
    expect(formatDateFR('2026-07-25')).toBe('25/07/2026');
  });
});
