import {
  formattedDate,
  formatRelativeTime,
  formatDurationSeconds,
  formatShortDate,
} from '../dateFormatter';
import {
  formatPrice,
  calculateDiscountPercentage,
  formatCompactNumber,
} from '../currencyFormatter';

describe('Formatters Unit Tests', () => {
  describe('dateFormatter', () => {
    test('formats valid date string to long format', () => {
      const formatted = formattedDate('2026-10-25T12:00:00Z');
      expect(formatted).toContain('2026');
      expect(formatted).toContain('October');
    });

    test('returns null for invalid dates', () => {
      expect(formattedDate(null)).toBeNull();
      expect(formattedDate('not-a-valid-date')).toBeNull();
    });

    test('formats duration in seconds to MM:SS', () => {
      expect(formatDurationSeconds(65)).toBe('1:05');
      expect(formatDurationSeconds(0)).toBe('0:00');
      expect(formatDurationSeconds(3665)).toBe('1:01:05');
    });

    test('formats relative time for recent timestamps', () => {
      const now = Date.now();
      expect(formatRelativeTime(now - 10000)).toBe('Just now');
      expect(formatRelativeTime(now - 300000)).toBe('5m ago');
      expect(formatRelativeTime(now - 7200000)).toBe('2h ago');
    });
  });

  describe('currencyFormatter', () => {
    test('formats INR price with rupee symbol', () => {
      const price = formatPrice(1999, 'INR');
      expect(price).toMatch(/₹|Rs/);
      expect(price).toContain('1,999');
    });

    test('returns "Free" for 0 price', () => {
      expect(formatPrice(0)).toBe('Free');
    });

    test('calculates correct discount percentage', () => {
      expect(calculateDiscountPercentage(1000, 750)).toBe(25);
      expect(calculateDiscountPercentage(2000, 1000)).toBe(50);
      expect(calculateDiscountPercentage(100, 100)).toBe(0);
    });

    test('formats compact numbers for large follower/student counts', () => {
      expect(formatCompactNumber(1500)).toBe('1.5K');
      expect(formatCompactNumber(2500000)).toBe('2.5M');
      expect(formatCompactNumber(42)).toBe('42');
    });
  });
});
