# 🎓 EdTech Platform - Interview Preparation Guide

> **Complete Project Overview with Technical Details & Interview Q&A**

---

## 📚 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture & Design](#architecture--design)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Key Features](#key-features)
7. [Authentication Flow](#authentication-flow)
8. [Interview Q&A](#interview-qa)
9. [Project Structure](#project-structure)
10. [Important Concepts](#important-concepts)

---

## Project Overview

### What is EdTech Platform?

EdTech Platform is a **full-stack educational technology platform** that enables:

- **Students** to discover, enroll in, and learn from courses
- **Instructors** to create, manage, and monitor courses
- **Admins** to manage users, courses, and payments
- **Payment processing** via Razorpay integration
- **Real-time notifications** and course updates

### Project Type
- **Monorepo** with separate frontend (React) and backend (Node.js/Express)
- **Production-Ready**: Includes authentication, authorization, payments, and notifications
- **Scalable**: Uses Supabase (PostgreSQL) for database, Cloudinary for media

### Key Metrics
- **Routes**: 50+ API endpoints
- **Tables**: 10+ database tables
- **React Components**: 100+
- **Authentication Methods**: Email/Password, Google OAuth, GitHub OAuth
- **Payment Gateway**: Razorpay
- **User Roles**: Student, Instructor, Admin

---

## Tech Stack

### Frontend
```
├── React 18.3.1            # UI framework
├── Redux Toolkit 1.9.5     # State management
├── React Router v6         # Client-side routing
├── Tailwind CSS 3.2.7      # Utility-first CSS
├── Framer Motion 10.16     # Animations
├── Axios 1.4.0             # HTTP client
├── Chart.js 4.3.0          # Data visualization
├── Supabase JS 2.39.0      # Backend-as-a-service
└── React Hot Toast         # Toast notifications
```

### Backend
```
├── Node.js                 # Runtime
├── Express.js 4.21.2       # HTTP server
├── Supabase 2.39.0         # Database & Auth
├── JWT 9.0.2               # Token-based auth
├── BCryptjs 2.4.3          # Password hashing
├── Cloudinary 2.10.0       # Media storage
├── Nodemailer 6.9.16       # Email service
├── Razorpay 2.9.6          # Payment gateway
└── Nodemon 3.1.14          # Dev server
```

### Database
```
├── Supabase (PostgreSQL)   # Main database
├── Tables: 10+
├── Row Level Security (RLS)
└── Real-time subscriptions
```

### Deployment
```
├── Frontend: Vercel
├── Backend: Vercel / Railway
└── Database: Supabase Cloud
```

---

## Architecture & Design

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Browser (React)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Redux Store → Components → Router                   │   │
│  │  Pages: Login, Dashboard, Course, Cart, Payment      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
              ↓                          ↓
┌─────────────────────────────────────────────────────────────┐
│              Express Server (Node.js) - Port 4000            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes: /api/v1/                                    │   │
│  │    - /auth (login, signup, token refresh)            │   │
│  │    - /course (CRUD)                                  │   │
│  │    - /payment (Razorpay integration)                 │   │
│  │    - /admin (dashboard)                              │   │
│  │    - /profile (user profile)                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
              ↓              ↓              ↓
    ┌─────────────────────────────────────────────────┐
    │  Supabase         Cloudinary     Razorpay       │
    │  (PostgreSQL)     (Media)        (Payments)     │
    │  RLS Policies     Storage        Orders         │
    │  JWT Auth         Verification   Webhooks       │
    └─────────────────────────────────────────────────┘
```

### Design Patterns Used

1. **MVC Pattern** (Backend)
   - Models: Supabase tables
   - Views: React components
   - Controllers: Express route handlers

2. **Redux Pattern** (Frontend)
   - Actions → Reducers → Store → Components

3. **Middleware Pattern** (Backend)
   - CORS, Authentication, Error handling

4. **Repository Pattern** (Backend)
   - Supabase client initialization
   - Reusable database queries

---

## Database Schema

### Core Tables

#### 1. **auth.users** (Supabase built-in)
```sql
├── id (UUID)
├── email (VARCHAR)
├── encrypted_password (VARCHAR)
├── email_confirmed_at (TIMESTAMP)
├── raw_user_meta_data (JSONB)
└── created_at (TIMESTAMP)
```

#### 2. **profiles** (User Extended Data)
```sql
├── id (UUID) - Primary Key, FK to auth.users
├── email (VARCHAR)
├── first_name (VARCHAR)
├── last_name (VARCHAR)
├── full_name (VARCHAR)
├── account_type (ENUM: 'Student', 'Instructor', 'Admin')
├── image (TEXT) - Avatar URL
├── avatar_url (TEXT)
├── contact_number (VARCHAR)
├── about (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

#### 3. **courses**
```sql
├── id (UUID) - Primary Key
├── instructor_id (UUID) - FK to profiles
├── title (VARCHAR)
├── description (TEXT)
├── category (VARCHAR)
├── price (DECIMAL)
├── thumbnail_url (TEXT)
├── level (ENUM: 'Beginner', 'Intermediate', 'Advanced')
├── rating (DECIMAL)
├── rating_count (INTEGER)
├── status (ENUM: 'Draft', 'Published')
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

#### 4. **course_sections**
```sql
├── id (UUID)
├── course_id (UUID) - FK to courses
├── title (VARCHAR)
├── order (INTEGER)
└── created_at (TIMESTAMP)
```

#### 5. **course_lectures** (Videos & Content)
```sql
├── id (UUID)
├── section_id (UUID) - FK to course_sections
├── title (VARCHAR)
├── description (TEXT)
├── video_url (TEXT)
├── duration (INTEGER) - Seconds
├── order (INTEGER)
├── is_free_preview (BOOLEAN)
└── created_at (TIMESTAMP)
```

#### 6. **enrollments**
```sql
├── id (UUID)
├── student_id (UUID) - FK to profiles
├── course_id (UUID) - FK to courses
├── status (ENUM: 'Active', 'Completed', 'Dropped')
├── progress_percentage (INTEGER)
├── enrolled_at (TIMESTAMP)
└── completed_at (TIMESTAMP)
```

#### 7. **payments**
```sql
├── id (UUID)
├── user_id (UUID) - FK to profiles
├── course_id (UUID) - FK to courses
├── razorpay_order_id (VARCHAR)
├── razorpay_payment_id (VARCHAR)
├── amount (DECIMAL)
├── currency (VARCHAR)
├── status (ENUM: 'Pending', 'Success', 'Failed')
├── payment_date (TIMESTAMP)
└── created_at (TIMESTAMP)
```

#### 8. **wishlist**
```sql
├── id (UUID)
├── user_id (UUID) - FK to profiles
├── course_id (UUID) - FK to courses
├── added_at (TIMESTAMP)
```

#### 9. **cart_items**
```sql
├── id (UUID)
├── user_id (UUID) - FK to profiles
├── course_id (UUID) - FK to courses
├── added_at (TIMESTAMP)
```

#### 10. **reviews**
```sql
├── id (UUID)
├── user_id (UUID) - FK to profiles
├── course_id (UUID) - FK to courses
├── rating (INTEGER) - 1-5
├── review_text (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

#### 11. **support_tickets**
```sql
├── id (UUID)
├── user_id (UUID) - FK to profiles
├── subject (VARCHAR)
├── message (TEXT)
├── status (ENUM: 'Open', 'In Progress', 'Resolved')
├── created_at (TIMESTAMP)
└── resolved_at (TIMESTAMP)
```

---

## API Endpoints

### Authentication Routes (`/api/v1/auth`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/signup` | Register new user |
| POST | `/login` | Login user |
| POST | `/refresh-token` | Refresh JWT token |
| POST | `/logout` | Logout user |
| POST | `/forgot-password` | Send password reset email |
| POST | `/reset-password` | Reset password |
| GET | `/verify-token` | Verify JWT validity |

### Course Routes (`/api/v1/course`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Get all courses |
| GET | `/:id` | Get course details |
| POST | `/create` | Create course (Instructor) |
| PUT | `/:id` | Update course (Instructor) |
| DELETE | `/:id` | Delete course (Instructor) |
| POST | `/:id/sections` | Add section to course |
| POST | `/:id/lectures` | Add lecture to section |
| GET | `/:id/lectures` | Get all lectures in course |

### Enrollment Routes (`/api/v1/enrollment`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/enroll` | Enroll in course |
| GET | `/my-courses` | Get enrolled courses |
| GET | `/:id/progress` | Get course progress |
| PUT | `/:id/progress` | Update progress |

### Payment Routes (`/api/v1/payment`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/create-order` | Create Razorpay order |
| POST | `/verify-payment` | Verify payment success |
| GET | `/history` | Get payment history |

### Cart Routes (`/api/v1/cart`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Get cart items |
| POST | `/add` | Add course to cart |
| DELETE | `/remove/:courseId` | Remove from cart |
| POST | `/checkout` | Checkout cart |

### Wishlist Routes (`/api/v1/wishlist`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Get wishlist |
| POST | `/add/:courseId` | Add to wishlist |
| DELETE | `/remove/:courseId` | Remove from wishlist |

### Profile Routes (`/api/v1/profile`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/` | Get user profile |
| PUT | `/` | Update profile |
| PUT | `/avatar` | Upload avatar |
| GET | `/instructor` | Get instructor profile |

### Admin Routes (`/api/v1/admin`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/dashboard` | Admin dashboard stats |
| GET | `/users` | Get all users |
| GET | `/courses` | Get all courses |
| PUT | `/users/:id/role` | Change user role |
| DELETE | `/courses/:id` | Delete course |

### Support Routes (`/api/v1/support`)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/tickets` | Create support ticket |
| GET | `/tickets` | Get my tickets |
| PUT | `/tickets/:id` | Update ticket status |

---

## Key Features

### 1. User Authentication & Authorization

**Features:**
- Email/Password signup and login
- Google OAuth integration
- GitHub OAuth integration
- JWT-based session management
- Row-Level Security (RLS) for data access control
- Role-based access (Student, Instructor, Admin)

**Security:**
- Passwords hashed with bcryptjs
- JWT tokens expire in 24 hours
- Refresh tokens for session persistence
- CORS protection
- Environment variables for secrets

### 2. Course Management

**Instructor Features:**
- Create and edit courses
- Organize courses into sections and lectures
- Upload video lectures (via Cloudinary)
- Set course price and level
- View enrollment statistics
- Handle course reviews and ratings

**Student Features:**
- Browse courses by category
- Search and filter courses
- View course details and reviews
- Enroll in courses
- Watch video lectures
- Track progress
- Rate and review courses

### 3. Payment Integration (Razorpay)

**Payment Flow:**
1. Student adds course to cart
2. Initiates checkout
3. Razorpay modal opens
4. Payment processed securely
5. Order verified on backend
6. Enrollment created automatically
7. Confirmation email sent

**Features:**
- Secure Razorpay integration
- Multiple payment methods
- Payment history tracking
- Receipt generation
- Refund handling

### 4. User Dashboard

**Student Dashboard:**
- Enrolled courses
- Course progress
- Wishlist
- Payment history
- Support tickets
- Profile management

**Instructor Dashboard:**
- Created courses
- Student enrollments
- Revenue statistics
- Course analytics
- Support tickets

**Admin Dashboard:**
- Total users/courses/revenue
- User management
- Course management
- Payment verification
- System analytics

### 5. Notifications & Communication

**Real-time Features:**
- Course enrollment notifications
- Payment confirmation emails
- Support ticket updates
- Course launch announcements
- Rating/review notifications

### 6. Media Management (Cloudinary)

- Video lecture uploads
- Image thumbnail storage
- Avatar management
- Secure CDN delivery
- Automatic optimization



---

## Authentication Flow

### 1. User Registration Flow

```
Frontend (Signup Page)
    ↓ User enters email, password, role
Frontend (validate input)
    ↓ Call /api/v1/auth/signup
Backend (Express)
    ↓ Validate email (not exists)
    ↓ Hash password with bcryptjs
Supabase Auth
    ↓ Create user in auth.users
    ↓ Send confirmation email
Supabase Database
    ↓ Create profile record
    ↓ Set account_type (Student/Instructor)
Backend (return JWT)
    ↓ Return access_token, refresh_token
Frontend (Redux)
    ↓ Store token in localStorage
    ↓ Store user data in Redux
    ↓ Redirect to dashboard
```

### 2. User Login Flow

```
Frontend (Login Page)
    ↓ User enters email, password
Frontend (call /api/v1/auth/login)
Backend (Express)
    ↓ Get user from profiles by email
    ↓ Compare password hash with bcryptjs
    ↓ Verify password matches
Backend (return JWT)
    ↓ Generate JWT with user data
    ↓ Set refresh token
Frontend (Redux)
    ↓ Store tokens in localStorage
    ↓ Store user profile in Redux
    ↓ Redirect based on user role
```

### 3. Token Validation

```
Frontend (All API calls)
    ↓ Add Authorization: Bearer {token}
Backend Middleware (authenticate)
    ↓ Extract token from header
    ↓ Verify JWT signature
    ↓ Check token expiration
    ↓ Extract user ID from payload
    ↓ Fetch user data from database
    ↓ Attach to req.user
Route Handler
    ↓ Access req.user.id
    ↓ Apply RLS policies automatically
```

### 4. OAuth Flow (Google/GitHub)

```
Frontend (Login Button)
    ↓ Click "Login with Google"
Supabase Auth
    ↓ Redirect to Google OAuth
Google
    ↓ User grants permission
    ↓ Return authorization code
Supabase Auth
    ↓ Exchange code for ID token
    ↓ Create/update user
Backend (Webhook)
    ↓ Create/update profile record
Frontend
    ↓ Store session in localStorage
    ↓ Redirect to dashboard
```

---

## Project Structure

### Frontend Structure

```
frontend/src/
├── components/                    # Reusable components
│   ├── Navbar/
│   ├── Sidebar/
│   ├── Cards/
│   └── Modals/
├── pages/                         # Route pages
│   ├── Homepage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── Dashboard.jsx
│   ├── CourseLearningPage.jsx
│   ├── CourseDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── AdminDashboard.jsx
│   └── InstructorDashboard.jsx
├── services/
│   ├── operations/
│   │   ├── authAPI.js             # Auth API calls
│   │   ├── courseAPI.js           # Course API calls
│   │   ├── paymentAPI.js          # Payment API calls
│   │   └── profileAPI.js          # Profile API calls
│   └── apis/
├── slices/                        # Redux state
│   ├── authSlice.js
│   ├── profileSlice.js
│   ├── cartSlice.js
│   ├── courseSlice.js
│   └── notificationSlice.js
├── hooks/                         # Custom hooks
│   ├── useAuth.js
│   ├── useProfile.js
│   └── useCourse.js
├── utils/
│   ├── supabaseAuthHelpers.js
│   ├── constants.js
│   ├── validators.js
│   └── formatters.js
├── config/
│   └── supabaseClient.js          # Supabase initialization
└── App.jsx
```

### Backend Structure

```
backend/
├── config/
│   ├── supabase.js                # Supabase client
│   ├── supabaseAdmin.js           # Admin client
│   ├── cloudinary.js              # Cloudinary config
│   └── razorpay.js                # Razorpay config
├── controllers/
│   ├── Auth.js                    # Auth logic
│   ├── Course.js                  # Course logic
│   ├── Payment.js                 # Payment logic
│   ├── Profile.js                 # Profile logic
│   ├── Admin.js                   # Admin logic
│   └── Support.js                 # Support logic
├── middleware/
│   ├── authenticate.js            # JWT verification
│   ├── authorize.js               # Role-based auth
│   └── errorHandler.js            # Error handling
├── routes/
│   ├── User.js                    # User routes
│   ├── Course.js                  # Course routes
│   ├── Payments.js                # Payment routes
│   ├── Admin.js                   # Admin routes
│   └── Support.js                 # Support routes
├── utils/
│   ├── mailSender.js              # Email sending
│   ├── cloudinaryUpload.js        # File upload
│   └── razorpayHelper.js          # Payment helper
└── index.js                       # Server entry
```

---

## Important Concepts

### 1. Row-Level Security (RLS) in Supabase

**What is RLS?**
- Database-level security that restricts data access based on user roles
- Policies defined at table level
- Applied automatically to all queries

**Example Policy:**
```sql
-- Students can only see their own profile
CREATE POLICY "student_own_profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Students can see courses they enrolled in
CREATE POLICY "student_enrolled_courses"
ON enrollments FOR SELECT
USING (student_id = auth.uid());
```

**Benefits:**
- Secure by default
- Can't bypass with malicious API calls
- Reduces backend validation code

### 2. JWT (JSON Web Tokens)

**Structure:**
```
Header.Payload.Signature

Header: {"alg": "HS256", "typ": "JWT"}
Payload: {"sub": "user_id", "email": "user@example.com", "role": "student"}
Signature: HMACSHA256(encoded_header + "." + encoded_payload, secret)
```

**Flow:**
1. User logs in → Backend generates JWT
2. Frontend stores JWT in localStorage
3. Every API request includes JWT in Authorization header
4. Backend verifies JWT signature
5. If valid, processes request; if invalid, returns 401

### 3. Redux State Management

**Pattern:**
```javascript
// Action: describes what happened
{ type: "LOGIN_SUCCESS", payload: { user, token } }

// Reducer: returns new state based on action
const authSlice = (state = {}, action) => {
  if (action.type === "LOGIN_SUCCESS") {
    return { ...state, user: action.payload.user };
  }
}

// Component uses Redux state
const user = useSelector(state => state.auth.user);
```

**Benefits:**
- Centralized state management
- Easy to debug (Redux DevTools)
- Predictable data flow
- Reusable across components

### 4. Middleware in Express

**Purpose:** Process request before it reaches route handler

**Types:**
- CORS: Handle cross-origin requests
- Authentication: Verify JWT token
- Authorization: Check user role/permissions
- Error handling: Catch and format errors

```javascript
app.use(cors())                    // CORS middleware
app.use(authenticate)              // Auth middleware
app.post("/api/courses", authorize, courseController.create)  // Specific middleware
app.use(errorHandler)              // Error middleware
```

### 5. Razorpay Payment Integration

**Payment Flow:**
```
1. Frontend creates order → Call /api/create-order
2. Backend creates Razorpay order → Returns order_id
3. Frontend displays Razorpay modal
4. User completes payment on Razorpay
5. Razorpay redirects with payment_id
6. Frontend calls /api/verify-payment
7. Backend verifies payment signature
8. If valid: Update database, create enrollment
9. Return success to frontend
```

**Security:**
- Order amount verified on backend
- Payment signature verified (Razorpay key)
- Can't modify amount on client

---

## Interview Q&A

### 1. Project Overview Questions

**Q1: What is this project about?**

A: EdTech Platform is a full-stack educational technology application that enables students to discover and enroll in online courses, instructors to create and manage courses, and admins to oversee the platform. It includes payment integration, real-time notifications, and comprehensive dashboards for each user role.

**Q2: What are the main components of the architecture?**

A: 
- **Frontend**: React 18 with Redux for state management, Tailwind CSS for styling
- **Backend**: Node.js/Express API server with JWT authentication
- **Database**: Supabase (PostgreSQL) with Row-Level Security policies
- **Third-party Services**: Razorpay (payments), Cloudinary (media), Supabase Auth

**Q3: What user roles exist in the system?**

A: Three main roles:
1. **Student**: Browse courses, enroll, watch lectures, leave reviews
2. **Instructor**: Create courses, manage content, view analytics
3. **Admin**: Manage users, courses, payments, system analytics

**Q4: What is the tech stack?**

A: See section "Tech Stack" above. Key technologies:
- Frontend: React, Redux, React Router, Tailwind CSS
- Backend: Express.js, Node.js
- Database: Supabase (PostgreSQL)
- External: Razorpay, Cloudinary, Nodemailer

---

### 2. Authentication & Authorization Questions

**Q5: How does authentication work in this system?**

A: 
1. User provides email and password
2. Backend hashes password and stores in Supabase Auth
3. On login, password is verified using bcryptjs
4. Backend generates JWT token containing user ID and role
5. Frontend stores token in localStorage
6. Every API request includes token in Authorization header
7. Backend middleware verifies token signature and extracts user ID

**Q6: What is Row-Level Security and why is it important?**

A: RLS is database-level security where policies restrict data access based on user roles.

Example:
```sql
CREATE POLICY "student_own_profile"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

This policy ensures students can only view their own profile, even if they try to query another user's data directly. It's important because:
- Security enforced at database level (can't bypass)
- Reduces validation code on backend
- Automatic filtering based on user context

**Q7: How are passwords secured?**

A: 
1. Frontend: Sent over HTTPS only
2. Backend: Never stored as plain text
3. Backend: Hashed using bcryptjs with salt rounds
4. Database: Only hash stored in auth.users
5. Verification: Use bcryptjs.compare() to check on login

**Q8: How does OAuth (Google/GitHub) login work?**

A:
1. User clicks "Login with Google"
2. Redirects to Google OAuth consent screen
3. User approves, Google returns authorization code
4. Backend exchanges code for ID token
5. ID token contains user email and profile info
6. Supabase creates/updates user automatically
7. Webhook triggers to create profile record
8. User is logged in with JWT token

---

### 3. Database & Data Model Questions

**Q9: Describe the core database tables.**

A:
- **auth.users** (Supabase built-in): Core authentication data
- **profiles**: Extended user data (name, role, avatar, etc.)
- **courses**: Course information (title, price, instructor)
- **course_sections**: Logical groupings within courses
- **course_lectures**: Individual video lessons
- **enrollments**: Links students to courses
- **payments**: Payment transaction records
- **wishlist**: User favorites
- **cart_items**: Shopping cart
- **reviews**: Course ratings and feedback

**Q10: What is the relationship between auth.users and profiles table?**

A: 
- One-to-one relationship
- auth.users.id (UUID) is primary key
- profiles.id (UUID) is foreign key to auth.users.id
- When user signs up: entry created in auth.users automatically, then profiles row created manually via API
- RLS policies ensure users only access their own profile

**Q11: How do you ensure data consistency between related tables?**

A:
1. Foreign key constraints prevent orphaned records
2. Cascade delete policies remove related data
3. Transactions ensure atomicity
4. RLS policies prevent unauthorized data access
5. Backend validation before database writes
6. Supabase triggers for automatic updates

**Q12: How is payment data structured?**

A:
```
payment {
  id, user_id, course_id, razorpay_order_id, 
  razorpay_payment_id, amount, status, created_at
}
```

Status flow: Pending → Success/Failed
- Razorpay order created first
- After user completes payment, payment verified
- Enrollment automatically created on success
- Payment status updated in database

---

### 4. Backend/API Questions

**Q13: How does the backend handle API requests?**

A:
1. Request comes to Express server (port 4000)
2. Middleware processes: CORS, JSON parsing, authentication
3. Router matches URL pattern to controller
4. Controller processes business logic
5. Controller queries database via Supabase
6. RLS policies automatically filter data
7. Controller returns JSON response
8. Error middleware catches any errors

**Q14: How do you handle authentication on backend?**

A:
```javascript
// Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Route usage
app.post("/api/courses", authenticate, courseController.create);
```

**Q15: How are file uploads handled?**

A:
1. Frontend: User selects file (image/video)
2. Express receives file via express-fileupload
3. Backend sends file to Cloudinary
4. Cloudinary returns secure URL
5. URL stored in database
6. Frontend displays media from Cloudinary CDN

Benefits:
- No large files stored on server
- Automatic image optimization
- Global CDN for fast delivery
- Secure delivery with tokens

**Q16: How is error handling implemented?**

A:
1. Try-catch blocks in controllers
2. Custom error classes for different types
3. Centralized error middleware
4. Consistent JSON error responses
5. Logging for debugging

Example:
```javascript
try {
  const course = await supabase.from("courses").select().eq("id", id);
} catch (error) {
  next(new ApiError(error.message, 500));
}

// Error middleware
app.use((err, req, res, next) => {
  res.status(err.status).json({ error: err.message });
});
```

---

### 5. Frontend/React Questions

**Q17: How is state managed in the frontend?**

A: Using Redux Toolkit with slices:

```javascript
// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    }
  }
});

// Component usage
const user = useSelector(state => state.auth.user);
dispatch(setUser(userData));
```

Benefits: Centralized state, easy debugging, predictable updates

**Q18: How are API calls made from frontend?**

A: Using Axios with centralized services:

```javascript
// services/operations/authAPI.js
export const login = (email, password) => async (dispatch) => {
  try {
    const { data } = await axios.post("/api/v1/auth/login", { email, password });
    dispatch(setToken(data.token));
    dispatch(setUser(data.user));
  } catch (error) {
    toast.error(error.message);
  }
};

// Component usage
const dispatch = useDispatch();
dispatch(login(email, password));
```

Benefits: Reusable, centralized error handling, consistent patterns

**Q19: How is routing implemented?**

A: Using React Router v6:

```javascript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
    <Route path="/course/:id" element={<CourseDetail />} />
  </Routes>
</BrowserRouter>
```

Protected routes check if user is authenticated before rendering.

**Q20: How are forms validated?**

A: Using React Hook Form with custom validators:

```javascript
const { register, handleSubmit, formState: { errors } } = useForm();

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("email", { 
    required: "Email required",
    pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email" }
  })} />
  {errors.email && <span>{errors.email.message}</span>}
</form>
```

---

### 6. Payment Integration Questions

**Q21: How does Razorpay payment integration work?**

A:
1. Frontend creates order: `POST /api/create-order` with amount
2. Backend creates Razorpay order, returns order_id
3. Frontend opens Razorpay modal with order_id
4. User completes payment on Razorpay
5. Razorpay returns payment_id and signature
6. Frontend calls `POST /api/verify-payment` with IDs and signature
7. Backend verifies signature using Razorpay key
8. If valid: Create enrollment, return success
9. If invalid: Return error

**Q22: How is payment security ensured?**

A:
1. **HTTPS**: All communication encrypted
2. **Amount Verification**: Backend verifies order amount matches database
3. **Signature Verification**: Payment signature verified using secret key
4. **Order ID Matching**: Verify received payment_id matches order_id
5. **User Verification**: Ensure payment user matches logged-in user
6. **Status Checks**: Verify payment status in Razorpay before granting access

```javascript
// Signature verification
const signature = crypto.createHmac('sha256', RAZORPAY_SECRET)
  .update(order_id + "|" + payment_id)
  .digest('hex');

if (signature !== provided_signature) {
  throw new Error("Payment verification failed");
}
```

---

### 7. Deployment & DevOps Questions

**Q23: How would you deploy this application?**

A:
- **Frontend**: Vercel (automatic deployments from GitHub)
- **Backend**: Vercel, Railway, or Render
- **Database**: Supabase Cloud (managed PostgreSQL)
- **Media**: Cloudinary (already using CDN)

Deployment steps:
1. Push code to GitHub
2. Configure environment variables on platform
3. Platform auto-builds and deploys
4. Database migrations run automatically
5. Monitor logs and performance

**Q24: What are the environment variables needed?**

A:

Frontend:
```
REACT_APP_SUPABASE_URL
REACT_APP_SUPABASE_ANON_KEY
REACT_APP_BACKEND_URL
```

Backend:
```
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
CLOUD_NAME (Cloudinary)
API_KEY (Cloudinary)
API_SECRET (Cloudinary)
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
JWT_SECRET
MAIL_HOST, MAIL_USER, MAIL_PASS
```

---

### 8. Scalability & Performance Questions

**Q25: How would you scale this application?**

A:
1. **Database**: Use Supabase Read Replicas for read-heavy queries
2. **Caching**: Add Redis for session and frequently accessed data
3. **CDN**: Media already on Cloudinary CDN
4. **Load Balancing**: Deploy multiple backend instances
5. **API Optimization**: Implement pagination, filtering, search indexes
6. **Frontend**: Code splitting, lazy loading, compression

**Q26: What would you do to improve performance?**

A:
1. **Frontend**:
   - Code splitting with React.lazy()
   - Image optimization (Cloudinary transforms)
   - Memoization (React.memo, useMemo)
   - Virtual scrolling for large lists

2. **Backend**:
   - Database query optimization (indexes)
   - Caching frequently accessed data
   - Async/await for non-blocking operations
   - Query pagination

3. **General**:
   - Monitor with tools like Sentry
   - Performance profiling
   - Load testing
   - CDN for static assets

---

### 9. Security Questions

**Q27: What security measures are implemented?**

A:
1. **Authentication**: JWT tokens, OAuth
2. **Authorization**: RLS policies at database level
3. **Data Protection**: Password hashing (bcryptjs), HTTPS
4. **Input Validation**: Sanitize and validate all inputs
5. **CORS**: Restrict cross-origin requests
6. **Secrets Management**: Environment variables for secrets
7. **SQL Injection Protection**: Parameterized queries via Supabase
8. **XSS Protection**: React escapes HTML by default

**Q28: What if a user tries to access data they shouldn't?**

A:
1. **Frontend**: PrivateRoute component checks authentication
2. **Backend**: authenticate middleware verifies JWT
3. **Backend**: authorize middleware checks user role
4. **Database**: RLS policies prevent unauthorized data access
5. Result: Request returns 401/403 error

Example RLS:
```sql
-- Only students can see their own enrollments
CREATE POLICY "student_enrollments"
ON enrollments FOR SELECT
USING (student_id = auth.uid());
```

---

### 10. Problem-Solving Questions

**Q29: A student can't enroll in a course. How would you debug?**

A:
1. Check frontend console for errors
2. Check Network tab for API response
3. Check backend logs for error details
4. Verify:
   - User is authenticated (valid JWT)
   - Course exists and is published
   - User hasn't already enrolled
   - Payment was successful (if paid course)
   - RLS policies allow enrollment creation
5. Check database directly for inconsistencies

**Q30: Payment succeeded but enrollment wasn't created. What could be wrong?**

A:
1. **Race condition**: Payment verified before database write
2. **Webhook timeout**: Razorpay webhook didn't trigger
3. **Database error**: RLS policy prevented write
4. **Error handling**: Exception thrown but not handled
5. Solution: Implement webhook handler, retry logic, transaction cleanup

```javascript
// Idempotent enrollment creation
const existingEnrollment = await getEnrollment(userId, courseId);
if (existingEnrollment) return; // Already enrolled

// Atomic transaction
await createEnrollment(userId, courseId);
```

---

## Additional Resources

### Important Files to Review

1. **Frontend Configuration**:
   - `frontend/src/config/supabaseClient.js` - Supabase initialization
   - `frontend/src/slices/authSlice.js` - Redux auth state
   - `frontend/src/services/operations/authAPI.js` - Auth API calls

2. **Backend Configuration**:
   - `backend/config/supabase.js` - Supabase client setup
   - `backend/middleware/authenticate.js` - JWT verification
   - `backend/controllers/Auth.js` - Authentication logic

3. **Database**:
   - `docs/supabase_schema.sql` - Database schema
   - `supabase/migrations/` - Database migrations

### Common Interview Follow-ups

- "Tell me about a challenge you faced and how you solved it"
  → Discuss authentication issues, payment integration debugging
  
- "What would you do differently if you built this again?"
  → Consider TypeScript, better error handling, testing
  
- "How do you keep your code maintainable?"
  → Clear structure, constants, helper functions, comments
  
- "How do you handle rapid growth?"
  → Caching, database optimization, load testing, monitoring

### Practice Questions to Answer

1. Walk through the entire payment flow from start to finish
2. Explain how a new student gets access to course content
3. Describe how an instructor can update course content
4. Explain the role of RLS in this system
5. How would you add a new feature (e.g., course ratings)?

---

## Summary

This EdTech platform demonstrates:
- **Full-stack development** with React + Node.js
- **Authentication & Authorization** with JWT and RLS
- **Payment integration** with Razorpay
- **Database design** with PostgreSQL relationships
- **State management** with Redux
- **API design** with Express.js
- **Security best practices** across the stack

Good luck with your interview! 🎉
