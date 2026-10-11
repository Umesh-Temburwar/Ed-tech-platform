import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { profileEndpoints } from "../apis"

const {
  GET_INSTRUCTOR_DATA_API,
} = profileEndpoints

export async function getInstructorDashboardRealTime(token) {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    toast.error("Could Not Get Instructor Dashboard Data")
  }
  toast.dismiss(toastId)
  return result
}

// Student dashboard stats (simplified for now, fetching enrolled courses)
export async function getStudentDashboardRealTime(token) {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector("GET", profileEndpoints.GET_USER_ENROLLED_COURSES_API, null, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    toast.error("Could Not Get Student Dashboard Data")
  }
  toast.dismiss(toastId)
  return result
}

export async function updateUserActivity(token, activityData) {
  return { success: true };
}

export async function getRealTimeNotifications(token) {
  // Notifications can be fetched from a 'notifications' table in Supabase
  return { notifications: [], unreadCount: 0 };
}

export const ActivityTracker = {
  trackActivity: async (activityData) => ({ success: true }),
  trackLessonCompleted: async (token, courseId, lessonId) => ({ success: true }),
  trackQuizCompleted: async (token, courseId, quizId, score) => ({ success: true }),
  trackCourseEnrollment: async (token, courseId) => ({ success: true }),
  trackCourseCompleted: async (token, courseId) => ({ success: true }),
  trackDashboardView: async (token, dashboardType) => ({ success: true }),
  trackGoalCompleted: async (token, goalId, goalTitle) => ({ success: true }),
  trackAchievementEarned: async (token, achievementId, title) => ({ success: true }),
  trackLessonStarted: async (token, courseId, lessonId) => ({ success: true }),
  trackProfileUpdated: async (token, updatedFields) => ({ success: true }),
};

export const DashboardRealTime = {
  initialize: async (token, accountType) => {
    if (accountType === "Instructor") {
      return await getInstructorDashboardRealTime(token);
    }
    return await getStudentDashboardRealTime(token);
  },
  refresh: async (token, accountType) => {
    if (accountType === "Instructor") {
      return await getInstructorDashboardRealTime(token);
    }
    return await getStudentDashboardRealTime(token);
  },
  getNotifications: async (token) => ({ notifications: [], unreadCount: 0 }),
};

export default {
  getStudentDashboardRealTime,
  getInstructorDashboardRealTime,
  updateUserActivity,
  getRealTimeNotifications,
  ActivityTracker,
  DashboardRealTime,
};
