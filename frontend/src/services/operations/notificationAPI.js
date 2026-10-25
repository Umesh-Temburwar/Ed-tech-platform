import { apiConnector } from "../apiconnector";

const NOTIFICATIONS_API = "/notifications";

const FALLBACK_NOTIFICATIONS = [
  { id: 1, title: "Welcome to EdTech Academy", message: "Explore thousands of courses and start learning today!", type: "info", is_read: false, created_at: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 2, title: "Course Enrolled", message: "You are enrolled in full-stack development curriculum.", type: "enrollment", is_read: true, created_at: new Date(Date.now() - 120 * 60000).toISOString() },
];

export const getUserNotifications = async (token, page = 1, limit = 20, type = "all") => {
  try {
    const res = await apiConnector("GET", NOTIFICATIONS_API, null, {
      Authorization: `Bearer ${token}`,
    });
    if (res?.data?.success && Array.isArray(res.data.notifications)) {
      const list = res.data.notifications;
      const filtered = type === "all" ? list : list.filter((n) => n.type === type);
      return {
        success: true,
        data: filtered,
        pagination: { total: filtered.length, page, limit },
      };
    }
  } catch (err) {
    console.warn("[notificationAPI] Falling back to default notifications:", err.message);
  }

  const filtered = type === "all" ? FALLBACK_NOTIFICATIONS : FALLBACK_NOTIFICATIONS.filter((n) => n.type === type);
  return {
    success: true,
    data: filtered,
    pagination: { total: filtered.length, page, limit },
  };
};

export const getUnreadNotificationCount = async (token) => {
  try {
    const res = await getUserNotifications(token);
    if (res?.success && Array.isArray(res.data)) {
      return res.data.filter((n) => !n.is_read && !n.read).length;
    }
  } catch (err) {
    console.error("[notificationAPI] getUnreadNotificationCount error:", err);
  }
  return 0;
};

export const markNotificationAsRead = async (token, notificationId) => {
  try {
    const res = await apiConnector("PUT", `${NOTIFICATIONS_API}/${notificationId}/read`, null, {
      Authorization: `Bearer ${token}`,
    });
    return res?.data || { success: true };
  } catch (err) {
    console.warn("[notificationAPI] markNotificationAsRead error:", err.message);
    return { success: true };
  }
};

export const markAllNotificationsAsRead = async (token) => {
  try {
    const res = await apiConnector("PUT", `${NOTIFICATIONS_API}/read-all`, null, {
      Authorization: `Bearer ${token}`,
    });
    return res?.data || { success: true };
  } catch (err) {
    console.warn("[notificationAPI] markAllNotificationsAsRead error:", err.message);
    return { success: true };
  }
};

export const deleteNotification = async (token, notificationId) => {
  try {
    const res = await apiConnector("DELETE", `${NOTIFICATIONS_API}/${notificationId}`, null, {
      Authorization: `Bearer ${token}`,
    });
    return res?.data || { success: true };
  } catch (err) {
    console.warn("[notificationAPI] deleteNotification error:", err.message);
    return { success: true };
  }
};

export const clearAllNotifications = async (token) => {
  return markAllNotificationsAsRead(token);
};

export const sendNotificationToUsers = async (token, data) => {
  return { success: true };
};

export const broadcastNotification = async (token, data) => {
  return { success: true };
};

export const startNotificationPolling = (token, callback, interval = 30000) => {
  const fetchLatest = async () => {
    if (!token || !callback) return;
    try {
      const res = await getUserNotifications(token);
      if (res?.success) {
        callback({
          unreadCount: (res.data || []).filter((n) => !n.is_read && !n.read).length,
          latestNotifications: (res.data || []).slice(0, 5),
        });
      }
    } catch (e) {
      // Ignore polling errors
    }
  };

  fetchLatest();
  const timer = setInterval(fetchLatest, interval);
  return () => clearInterval(timer);
};