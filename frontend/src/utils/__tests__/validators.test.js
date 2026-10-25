import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUrl,
  sanitizeInput,
} from '../validators';

describe('Validators Unit Tests', () => {
  describe('validateEmail', () => {
    test('accepts valid email addresses', () => {
      expect(validateEmail('student@example.com').isValid).toBe(true);
      expect(validateEmail('instructor.test+tag@edtech.org').isValid).toBe(true);
    });

    test('rejects invalid emails', () => {
      expect(validateEmail('not-an-email').isValid).toBe(false);
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail(null).isValid).toBe(false);
    });
  });

  describe('validatePassword', () => {
    test('accepts strong password', () => {
      const res = validatePassword('Pass1234!');
      expect(res.isValid).toBe(true);
      expect(res.score).toBeGreaterThanOrEqual(2);
    });

    test('rejects short password (< 8 chars)', () => {
      const res = validatePassword('abc');
      expect(res.isValid).toBe(false);
    });

    test('rejects empty password', () => {
      expect(validatePassword('').isValid).toBe(false);
    });
  });

  describe('validateUrl', () => {
    test('accepts valid http and https URLs', () => {
      expect(validateUrl('https://edtechacademy.vercel.app').isValid).toBe(true);
      expect(validateUrl('http://localhost:3000').isValid).toBe(true);
    });

    test('rejects invalid URL protocols or gibberish', () => {
      expect(validateUrl('ftp://example.com').isValid).toBe(false);
      expect(validateUrl('not a url').isValid).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    test('escapes HTML tags to prevent XSS injection', () => {
      const malicious = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(malicious);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });

    test('returns empty string for null or non-string input', () => {
      expect(sanitizeInput(null)).toBe('');
      expect(sanitizeInput(undefined)).toBe('');
    });
  });
});
