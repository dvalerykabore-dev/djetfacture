/**
 * Money arithmetic functions working strictly with BigInt/integers in minor units.
 * FCFA has exponent 0 (1 FCFA = 1 unit).
 */

export function roundHalfUp(value: number): bigint {
  return BigInt(Math.floor(value + 0.5));
}

export function calculateLineSubtotal(
  quantity: number,
  unitPrice: bigint,
  discountPercent: number = 0
): bigint {
  const brut = Math.round(quantity * Number(unitPrice));
  const discount = Math.round((brut * discountPercent) / 100);
  return BigInt(brut - discount);
}
