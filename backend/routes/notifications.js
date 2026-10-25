const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseAdmin');
const { auth } = require('../middleware/auth');

// Apply auth middleware to all notification routes
router.use(auth);

// GET notifications for authenticated user
router.get('/', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthenticated' });
    const { data, error } = await supabase.from('notifications').select('*').eq('student_id', userId);
    if (error) throw error;
    return res.json({ success: true, notifications: data });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

// Mark single notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true, updated_at: new Date().toISOString() })
      .match({ id, student_id: userId })
      .select();

    if (error) throw error;
    return res.json({ success: true, message: 'Notification marked as read', data });
  } catch (e) {
    console.error('Error marking notification as read:', e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

// Mark all notifications as read for current user
router.put('/read-all', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthenticated' });

    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true, updated_at: new Date().toISOString() })
      .eq('student_id', userId)
      .eq('read', false)
      .select();

    if (error) throw error;
    return res.json({ success: true, message: 'All notifications marked as read', data });
  } catch (e) {
    console.error('Error marking all notifications as read:', e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
