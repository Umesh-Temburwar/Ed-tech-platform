# 📋 EdTech Platform - Interview Quick Reference

> **Quick lookup guide for key concepts**

---

## 🔑 Key Metrics

| Metric | Value |
|--------|-------|
| User Roles | 3 (Student, Instructor, Admin) |
| Database Tables | 11 |
| API Endpoints | 50+ |
| React Components | 100+ |
| Authentication Methods | 3 (Email, Google, GitHub) |
| Payment Gateway | Razorpay |
| Frontend Framework | React 18 |
| Backend Framework | Express.js |
| Database | Supabase (PostgreSQL) |
| Media Storage | Cloudinary |

---

## 🏗️ Architecture in 30 Seconds

```
User (Browser)
    ↓
React Frontend (Port 3000)
    ↓
Express Backend (Port 4000)
    ↓
Supabase Database (PostgreSQL)
    ↓
Third-party Services (Razorpay, Cloudinary, Email)
```

---

## 👥 User Flows

### Student
1. Signup → Email Verification → Browse Courses
2. Select Course → Add to Cart → Checkout
3. Pay via Razorpay → Enrollment Created → Access Course
4. Watch Videos → Track Progress → Leave Review

### Instructor
1. Signup → Set Instructor Role → Create Course
2. Add Sections & Lectures → Upload Videos → Publish
3. View Student Enrollments → See Reviews → Access Analytics

### Admin
1. Signup → Admin Role → Access Dashboard
2. Manage Users → Verify Courses → Monitor Payments
3. View System Stats → Generate Reports

---

## 🔐 Security Layers

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Transport | HTTPS | Encryption in transit |
| Authentication | JWT + Supabase Auth | User verification |
| Authorization | RLS Policies | Database-level access control |
| Input | Validators | Prevent malicious data |
| CORS | Express CORS | Prevent unauthorized origins |
| Secrets | Environment variables | Hide sensitive keys |
| Passwords | bcryptjs + salt | Hash before storage |

---

## 📊 Database Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| auth.users | User authentication | id, email, password_hash |
| profiles | User extended data | id, first_name, account_type |
| courses | Course information | id, instructor_id, title, price |
| course_sections | Course organization | id, course_id, order |
| course_lectures | Video content | id, section_id, video_url |
| enrollments | Student-Course link | student_id, course_id, status |
| payments | Transaction records | user_id, course_id, razorpay_id |
| reviews | Course feedback | user_id, course_id, rating |
| wishlist | User favorites | user_id, course_id |
| cart_items | Shopping cart | user_id, course_id |
| support_tickets | Help requests | user_id, subject, status |

---

## 🔌 API Endpoint Categories

| Category | Base Route | Purpose |
|----------|-----------|---------|
| Auth | `/api/v1/auth` | Login, signup, tokens |
| Course | `/api/v1/course` | CRUD operations on courses |
| Enrollment | `/api/v1/enrollment` | Enroll, progress tracking |
| Payment | `/api/v1/payment` | Razorpay integration |
| Profile | `/api/v1/profile` | User profile management |
| Admin | `/api/v1/admin` | System management |
| Cart | `/api/v1/cart` | Shopping cart operations |
| Wishlist | `/api/v1/wishlist` | Favorites management |
| Support | `/api/v1/support` | Help tickets |

---

## 🔄 Key Flows

### Authentication Flow
```
1. User → Email/Password or OAuth
2. Backend → Verify credentials
3. Backend → Generate JWT token
4. Frontend → Store token + user data
5. All requests → Include JWT in header
```

### Payment Flow
```
1. Frontend → Create order endpoint
2. Backend → Create Razorpay order
3. Frontend → Open Razorpay modal
4. User → Complete payment
5. Frontend → Verify payment endpoint
6. Backend → Verify signature & create enrollment
7. Database → Update payment status
8. Frontend → Show success, redirect
```

### Course Access Flow
```
1. Student → Browse courses
2. Student → Click enroll/buy
3. Payment flow (if paid course)
4. Enrollment created in database
5. RLS policies grant access to content
6. Student → Watch videos
```

---

## 🛠️ Tech Stack Summary

### Frontend Dependencies (Key)
```
react 18.3.1
@reduxjs/toolkit 1.9.5
react-router-dom 6.30.3
@supabase/supabase-js 2.39.0
tailwindcss 3.2.7
framer-motion 10.16.16
chart.js 4.3.0
```

### Backend Dependencies (Key)
```
express 4.21.2
@supabase/supabase-js 2.39.0
jsonwebtoken 9.0.2
bcryptjs 2.4.3
cloudinary 2.10.0
razorpay 2.9.6
nodemailer 6.9.16
```

---

## 💡 Interview Tips

### When Asked About Architecture
"The system follows MVC pattern. Frontend is React, backend is Express, and database is Supabase PostgreSQL. All communication is JSON over HTTPS."

### When Asked About Security
"We use JWT for auth, RLS policies for database-level access control, bcryptjs for password hashing, and input validation throughout. OAuth is handled by Supabase securely."

### When Asked About Scalability
"We can add caching with Redis, use database read replicas, implement pagination, use Cloudinary CDN, and deploy multiple backend instances behind a load balancer."

### When Asked About Challenges
"Integrating Razorpay required careful payment verification. Authentication across OAuth providers needed session sync. RLS policies took time to get right initially."

### When Asked About Design Decisions
"We chose Supabase for built-in auth and real-time. Redux for predictable state. Express for simplicity and flexibility. Razorpay for secure payments."

---

## 🎯 Key Concepts to Master

1. **JWT Tokens**: Structure, verification, expiration
2. **RLS Policies**: How they work, why they're important
3. **Redux**: Actions, reducers, selectors, dispatch
4. **Middleware**: Express middleware, authentication flow
5. **Payment Integration**: Razorpay order creation, verification
6. **OAuth**: Google, GitHub login flows
7. **Database Relationships**: Foreign keys, constraints
8. **Error Handling**: Try-catch, error middleware
9. **API Design**: RESTful principles, status codes
10. **Security**: HTTPS, secrets management, input validation

---

## ⚡ Quick Answers Template

### "Tell me about this project"

"This is an EdTech platform built with React frontend and Express backend, powered by Supabase database. It enables students to enroll in courses, instructors to create content, and admins to manage the platform. Key features include JWT authentication, Razorpay payment integration, video hosting on Cloudinary, and Row-Level Security for data protection. The architecture separates frontend and backend, with all communication via REST APIs."

### "What's your role/contribution?"

"[Adjust based on your actual work] I implemented the [authentication/payment/course management/dashboard] system. Key contributions include [specific features]. I focused on security, performance, and user experience."

### "What challenges did you face?"

"[Choose 1-2 realistic challenges]
- Integrating Razorpay safely required careful signature verification
- Getting RLS policies right to ensure proper data access control
- Managing state across components needed Redux for consistency
- Handling OAuth with multiple providers required session synchronization"

### "What would you do differently?"

"In retrospect, I would:
- Add TypeScript for better type safety
- Implement automated tests from the start
- Add more detailed error logging for production
- Use WebSockets for real-time notifications
- Cache frequently accessed data with Redis"

---

## 🚀 Demo Scenarios

### Demo User Flows

**Student**: 
- Email: student@example.com
- Password: Test123!
- Can browse, search, enroll, pay, watch videos

**Instructor**:
- Email: instructor@example.com
- Password: Test123!
- Can create courses, upload videos, view students

**Admin**:
- Email: admin@example.com
- Password: Test123!
- Can manage users, courses, payments

### Test Payment
- Use Razorpay test mode
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

---

## 📱 Common Interview Questions & Answers

**Q: How many tables in the database?**
A: 11 core tables including auth.users, profiles, courses, enrollments, payments, etc.

**Q: How does payment verification work?**
A: Razorpay signature is verified using HMAC-SHA256. Order amount is verified against database. Only then is enrollment created.

**Q: What if a user tries to access another user's data?**
A: RLS policies at database level prevent it. Even if they craft a malicious API call, the database returns nothing due to policies.

**Q: How are videos stored?**
A: On Cloudinary. Backend sends file to Cloudinary, gets URL, stores URL in database.

**Q: How long are JWT tokens valid?**
A: Typically 24 hours. Refresh tokens can extend the session.

**Q: What happens when a user logs out?**
A: JWT token is removed from localStorage. Since backend doesn't maintain session state (stateless), user is immediately logged out.

**Q: How are passwords hashed?**
A: Using bcryptjs with 10 salt rounds. Hash never stored as plain text.

**Q: What if Cloudinary is down?**
A: New uploads fail, but existing videos still accessible from CDN cache. Graceful degradation needed.

**Q: How would you add a messaging feature?**
A: Add messages table, WebSocket support for real-time, RLS policies for access control.

**Q: How do you prevent CSRF attacks?**
A: HTTPS only, SameSite cookie attribute, CORS restrictions, JWT tokens (not cookies).

---

## 🎓 Final Checklist Before Interview

- [ ] Understand full authentication flow
- [ ] Know Razorpay payment integration completely
- [ ] Can explain RLS policies and why they matter
- [ ] Understand Redux state management
- [ ] Know database schema relationships
- [ ] Can discuss performance optimization
- [ ] Understand security measures implemented
- [ ] Can explain error handling
- [ ] Know deployment strategy
- [ ] Have answers for "why this tech" questions

---

**Good luck! You've got this! 🚀**
