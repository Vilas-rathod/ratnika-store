import { describe, expect, it } from 'vitest';
import { discountPercent, formatCompactINR, formatINR, titleCase } from './format';

describe('format helpers', () => {
  it('formats INR without decimals', () => {
    expect(formatINR(1499)).toBe('₹1,499');
  });

  it('computes discount percent correctly', () => {
    expect(discountPercent(1000, 750)).toBe(25);
    expect(discountPercent(500, 500)).toBe(0);
    expect(discountPercent(400, 500)).toBe(0); // never negative
  });

  it('formats compact INR for large values', () => {
    expect(formatCompactINR(150000)).toBe('₹1.5L');
    expect(formatCompactINR(2500)).toBe('₹2.5k');
  });

  it('title-cases enum values', () => {
    expect(titleCase('GOLD_PLATED')).toBe('Gold Plated');
    expect(titleCase('WEDDING')).toBe('Wedding');
  });
});
