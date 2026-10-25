/**
 * Currency and Price Formatting Utilities
 * Handles price display, currency symbols, discount percentages, and compact numbers
 */

/**
 * Formats a monetary number with appropriate currency symbol and thousand separators
 * @param {number|string} amount - Numerical price
 * @param {string} [currency='INR'] - 'INR' or 'USD'
 * @returns {string}
 */
export const formatPrice = (amount, currency = 'INR') => {
  if (amount == null || amount === "" || isNaN(Number(amount))) {
    return currency === 'INR' ? '₹0' : '$0';
  }

  const num = Number(amount);
  if (num === 0) return 'Free';

  try {
    if (currency.toUpperCase() === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(num);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      maximumFractionDigits: 0,
    }).format(num);
  } catch {
    const symbol = currency.toUpperCase() === 'INR' ? '₹' : '$';
    return `${symbol}${num.toLocaleString()}`;
  }
};

/**
 * Calculates discount percentage between original and discounted price
 * @param {number|string} originalPrice
 * @param {number|string} discountedPrice
 * @returns {number} Integer percentage discount (e.g., 25 for 25% off)
 */
export const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
  const orig = Number(originalPrice);
  const disc = Number(discountedPrice);
  if (!orig || !disc || orig <= disc) return 0;
  return Math.round(((orig - disc) / orig) * 100);
};

/**
 * Formats compact numbers for review counts and student enrollments (e.g. 1.5k, 25k)
 * @param {number|string} count
 * @returns {string}
 */
export const formatCompactNumber = (count) => {
  if (count == null || isNaN(Number(count))) return '0';
  const num = Number(count);
  try {
    return new Intl.NumberFormat('en', { notation: 'compact', compactDisplay: 'short' }).format(num);
  } catch {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return String(num);
  }
};
