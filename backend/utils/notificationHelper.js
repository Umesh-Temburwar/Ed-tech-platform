/**
 * Notification Helper Utility
 * Handles dispatching and formatting user notifications across controllers
 */
const supabase = require('../config/supabaseAdmin');

/**
 * Creates a notification record for a student or instructor
 * @param {Object} options
 * @param {string} options.userId - ID of the recipient user
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {'enrollment'|'course'|'payment'|'warning'|'success'|'info'} [options.type='info']
 * @param {string} [options.link] - Optional link to redirect
 */
async function sendNotification({ userId, title, message, type = 'info', link = null }) {
  if (!userId || !title) {
    console.warn('[NotificationHelper] Missing required fields: userId or title');
    return null;
  }

  try {
    const payload = {
      student_id: userId,
      title,
      message,
      type,
      link,
      read: false,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('notifications')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn('[NotificationHelper] Could not insert notification into DB:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.error('[NotificationHelper] Exception creating notification:', err.message);
    return null;
  }
}

module.exports = {
  sendNotification,
};
