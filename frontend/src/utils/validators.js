/**
 * Form Input Validators & Sanitization Helpers
 * Centralized client-side validation logic with friendly error messages
 */

/**
 * Validates email address format
 * @param {string} email
 * @returns {{ isValid: boolean, message: string }}
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { isValid: false, message: "Email address is required" };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: "Please provide a valid email address" };
  }
  return { isValid: true, message: "" };
};

/**
 * Validates password strength
 * Requires at least 8 characters, one number, and one letter
 * @param {string} password
 * @returns {{ isValid: boolean, message: string, score: number }}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required", score: 0 };
  }
  if (password.length < 8) {
    return { isValid: false, message: "Password must be at least 8 characters long", score: 1 };
  }

  let score = 1;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score < 2) {
    return { isValid: false, message: "Password must contain a letter and a number", score };
  }

  return { isValid: true, message: "", score };
};

/**
 * Validates phone numbers (optional or formatted)
 * @param {string} phone
 * @returns {{ isValid: boolean, message: string }}
 */
export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return { isValid: true, message: "" };
  const cleaned = phone.replace(/[\s-()]/g, "");
  if (!/^\+?[0-9]{10,14}$/.test(cleaned)) {
    return { isValid: false, message: "Please provide a valid phone number (10-14 digits)" };
  }
  return { isValid: true, message: "" };
};

/**
 * Validates standard web URLs
 * @param {string} url
 * @returns {{ isValid: boolean, message: string }}
 */
export const validateUrl = (url) => {
  if (!url || !url.trim()) {
    return { isValid: false, message: "URL cannot be empty" };
  }
  try {
    const parsed = new URL(url.trim());
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { isValid: false, message: "URL must start with http:// or https://" };
    }
    return { isValid: true, message: "" };
  } catch {
    return { isValid: false, message: "Please provide a valid URL" };
  }
};

/**
 * Escapes special HTML characters to prevent XSS in rendered text
 * @param {string} str
 * @returns {string}
 */
export const sanitizeInput = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
