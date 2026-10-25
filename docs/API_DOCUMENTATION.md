# EdTech Platform — API Reference Documentation

Comprehensive specification for all backend REST API endpoints available in the EdTech Platform monorepo.

---

## Base URLs
- **Local Development**: `http://localhost:4000/api/v1`
- **Health Check**: `http://localhost:4000/api/health`

---

## Authentication & Headers
Most protected endpoints require an `Authorization` header containing a valid Supabase JWT Bearer token:
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 1. Authentication Endpoints (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/sendotp` | Sends email verification OTP | No |
| `POST` | `/signup` | Registers new student or instructor | No |
| `POST` | `/login` | Authenticates user & issues session cookie | No |
| `POST` | `/changepassword` | Updates account password | Yes |
| `POST` | `/reset-password-token` | Generates reset password token email | No |
| `POST` | `/reset-password` | Resets account password via token | No |

---

## 2. Course & Curriculum Endpoints (`/api/v1/course`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/getAllCourses` | Lists all published courses | No |
| `GET` | `/getCourseDetails` | Fetches full course curriculum with sections | No |
| `POST` | `/createCourse` | Creates a new course draft (Instructor only) | Yes |
| `POST` | `/editCourse` | Updates existing course details | Yes |
| `POST` | `/deleteCourse` | Deletes course and associated assets | Yes |
| `POST` | `/addSection` | Adds section to course curriculum | Yes |
| `POST` | `/updateSection` | Renames section in curriculum | Yes |
| `POST` | `/deleteSection` | Removes section and attached lessons | Yes |
| `POST` | `/addSubSection` | Adds a lecture/lesson video to a section | Yes |
| `POST` | `/updateSubSection` | Updates lesson title or video URL | Yes |
| `POST` | `/deleteSubSection` | Removes lesson from section | Yes |

---

## 3. Notification Endpoints (`/api/v1/notifications`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | Returns authenticated user's notifications | Yes |
| `PUT` | `/:id/read` | Marks a specific notification as read | Yes |
| `PUT` | `/read-all` | Marks all user notifications as read | Yes |
| `DELETE` | `/:id` | Deletes a notification from user list | Yes |

---

## 4. Payment & Checkout Endpoints (`/api/v1/payment`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/capturePayment` | Initiates Razorpay checkout order | Yes |
| `POST` | `/verifyPayment` | Validates HMAC-SHA256 signature and enrolls student | Yes |
| `POST` | `/sendPaymentSuccessEmail` | Dispatches confirmation receipt email | Yes |

---

## 5. Health & Diagnostics (`/api/health`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | System uptime, memory metrics, DB connectivity | No |

---

## Standard Error Response Format
All errors follow the unified schema:
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```
