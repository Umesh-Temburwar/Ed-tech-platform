/**
 * Date and Time Formatter Utilities
 * Provides consistent formatting across courses, reviews, payments, and dashboards
 */

/**
 * Formats a date into a long human-readable date string (e.g. "October 25, 2026")
 * @param {string|Date|number} date
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string|null}
 */
export const formattedDate = (date, options = {}) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...options,
  });
};

/**
 * Formats a date into a short date string (e.g. "Oct 25, 2026")
 * @param {string|Date|number} date
 * @returns {string}
 */
export const formatShortDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Formats a date into relative human time (e.g. "5m ago", "2h ago", "3d ago", "Just now")
 * @param {string|Date|number} date
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";

  const now = Date.now();
  const diffMs = now - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
};

/**
 * Formats seconds into MM:SS or HH:MM:SS
 * @param {number} totalSeconds
 * @returns {string}
 */
export const formatDurationSeconds = (totalSeconds) => {
  if (!totalSeconds || isNaN(totalSeconds) || totalSeconds <= 0) return "0:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num) => String(num).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
};

/**
 * Formats a date into localized date and time string
 * @param {string|Date|number} date
 * @returns {string}
 */
export const formatFullDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};