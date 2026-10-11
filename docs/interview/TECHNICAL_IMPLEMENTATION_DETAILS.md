# 🔧 EdTech Platform - Technical Implementation Details

> **Deep dive into implementation details, code patterns, and technical decisions**

---

## Frontend Implementation

### Redux Store Structure

```javascript
store {
  auth: {
    user: { id, email, firstName, lastName, accountType, image },
    token: "jwt_token_here",
    refreshToken: "refresh_token",
    isLoading: false,
    error: null
  },
  
  profile: {
    data: { ...user profile fields... },
    isLoading: false,
    error: null
  },
  
  course: {
    courses: [],
    currentCourse: null,
    isLoading: false,
    error: null
  },
  
  cart: {
    items: [ { courseId, courseName, price } ],
    totalPrice: 0,
    itemCount: 0
  },
  
  notification: {
    notifications: [],
    unreadCount: 0
  }
}
```

### Component Hierarchy

```
App
├── Router
│   ├── HomePage
│   ├── LoginPage
│   ├── SignupPage
│   ├── PrivateRoute
│   │   ├── Dashboard
│   │   │   ├── StudentDashboard
│   │   │   ├── InstructorDashboard
│   │   │   └── AdminDashboard
│   │   ├── CourseLearning
│   │   └── Cart
│   └── PublicPages
│       ├── CourseDetail
│       ├── CourseBrowse
│       └── SearchResults
└── Navbar/Sidebar (on all pages)
```

### Authentication Hook

```javascript
// Custom hook for authentication
const useAuth = () => {
  const user = useSelector(state => state.auth.user);
  const token = useSelector(state => state.auth.token);
  const isAuthenticated = !!user && !!token;
  
  return {
    user,
    token,
    isAuthenticated,
    isStudent: user?.accountType === 'Student',
    isInstructor: user?.accountType === 'Instructor',
    isAdmin: user?.accountType === 'Admin'
  };
};

// Component usage
const MyComponent = () => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <Redirect to="/login" />;
  return <Dashboard user={user} />;
};
```

### API Call Pattern

```javascript
// Service layer: services/operations/courseAPI.js
export const fetchCourses = (filters) => async (dispatch) => {
  dispatch(setLoading(true));
  
  try {
    const { data } = await axios.get(
      `/api/v1/course`,
      { params: filters },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    dispatch(setCourses(data));
  } catch (error) {
    dispatch(setError(error.message));
    toast.error(error.message);
  } finally {
    dispatch(setLoading(false));
  }
};

// Component: pages/CourseList.jsx
const CourseList = () => {
  const dispatch = useDispatch();
  const courses = useSelector(state => state.course.courses);
  
  useEffect(() => {
    dispatch(fetchCourses({}));
  }, [dispatch]);
  
  return (
    <div>
      {courses.map(course => <CourseCard key={course.id} course={course} />)}
    </div>
  );
};
```

### Form Handling with React Hook Form

```javascript
const CourseForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      title: '',
      price: 0,
      level: 'Beginner'
    }
  });
  
  const onSubmit = async (data) => {
    try {
      await dispatch(createCourse(data));
      toast.success('Course created!');
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('title', {
          required: 'Title is required',
          minLength: { value: 5, message: 'Min 5 characters' }
        })}
      />
      {errors.title && <span>{errors.title.message}</span>}
      
      <input type="number" {...register('price')} />
      
      <button type="submit">Create Course</button>
    </form>
  );
};
```

---

## Backend Implementation

### Express Server Setup

```javascript
const express = require('express');
const app = express();

// Middleware stack order matters
app.use(cors());                      // CORS first
app.use(express.json());              // Body parsing
app.use(authenticate);                // Authentication
app.use(requestLogger);               // Logging

// Routes after middleware
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/course', courseRoutes);
app.use('/api/v1/payment', paymentRoutes);

// Error handling last
app.use(errorHandler);
app.use(notFoundHandler);

app.listen(PORT);
```

### Authentication Middleware

```javascript
// middleware/authenticate.js
const authenticate = async (req, res, next) => {
  try {
    // Extract token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Verify token signature
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Fetch user from database
    const { data: user } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', decoded.sub)
      .single();
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Attach to request for next middleware/route
    req.user = user;
    req.userId = decoded.sub;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### Authorization Middleware

```javascript
// middleware/authorize.js
const authorize = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!allowedRoles.includes(req.user.account_type)) {
    return res.status(403).json({ error: 'Permission denied' });
  }
  
  next();
};

// Usage in route
app.post('/api/v1/course/create',
  authenticate,
  authorize(['Instructor', 'Admin']),
  courseController.create
);
```

### Course Controller Example

```javascript
// controllers/Course.js
exports.create = async (req, res) => {
  try {
    const { title, description, price, category, level } = req.body;
    const instructorId = req.userId;
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create course in Supabase
    const { data, error } = await supabase
      .from('courses')
      .insert({
        instructor_id: instructorId,
        title,
        description,
        price,
        category,
        level,
        status: 'Draft'
      })
      .select();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Course created',
      data: data[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### Supabase Query Examples

```javascript
// Single record with filtering
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();

// Multiple records with filtering and ordering
const { data, error } = await supabase
  .from('courses')
  .select('*, sections:course_sections(*)')
  .eq('instructor_id', instructorId)
  .order('created_at', { ascending: false })
  .limit(10);

// With joins
const { data, error } = await supabase
  .from('enrollments')
  .select(`
    *,
    course:courses(*),
    student:profiles(*)
  `)
  .eq('student_id', studentId);

// Upsert (insert or update)
const { data, error } = await supabase
  .from('profiles')
  .upsert({
    id: userId,
    first_name: 'John',
    updated_at: new Date()
  }, { onConflict: 'id' });
```

### Error Handling Pattern

```javascript
// Custom error class
class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

// Controller with error handling
exports.getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      throw new ApiError('Course not found', 404);
    }
    
    res.json(data);
  } catch (error) {
    next(error); // Pass to error middleware
  }
};

// Error middleware
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({
    success: false,
    error: message
  });
  
  // Log to monitoring service
  if (status === 500) {
    console.error('[ERROR]', err.stack);
  }
};
```

### File Upload with Cloudinary

```javascript
// controllers/Upload.js
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.files?.video) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const file = req.files.video;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      file.tempFilePath,
      {
        resource_type: 'video',
        folder: 'courses/videos',
        quality: 'auto'
      }
    );
    
    // Clean up temp file
    fs.unlinkSync(file.tempFilePath);
    
    res.json({
      success: true,
      url: result.secure_url,
      duration: result.duration
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## Database Implementation

### RLS Policy Examples

```sql
-- Policy 1: Students can only view their profile
CREATE POLICY "students_own_profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Policy 2: Instructors can update their own profile
CREATE POLICY "instructors_update_own_profile"
ON profiles FOR UPDATE
USING (auth.uid() = id AND account_type = 'Instructor')
WITH CHECK (auth.uid() = id AND account_type = 'Instructor');

-- Policy 3: Students can see enrolled courses
CREATE POLICY "student_enrolled_courses"
ON enrollments FOR SELECT
USING (student_id = auth.uid());

-- Policy 4: Only instructors can update their courses
CREATE POLICY "instructor_update_own_courses"
ON courses FOR UPDATE
USING (instructor_id = auth.uid())
WITH CHECK (instructor_id = auth.uid());

-- Policy 5: Admin can see everything
CREATE POLICY "admin_all_access"
ON courses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.account_type = 'Admin'
  )
);
```

### Database Triggers

```sql
-- Trigger to update profile when auth user is created
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION create_profile_on_signup();

CREATE FUNCTION create_profile_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (new.id, new.email, NOW())
  ON CONFLICT DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update enrollment progress
CREATE TRIGGER update_enrollment_progress
AFTER INSERT ON lecture_progress
FOR EACH ROW EXECUTE FUNCTION calc_course_progress();
```

### Database Indexes

```sql
-- Improve search performance
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_reviews_course ON reviews(course_id);

-- Full-text search index
CREATE INDEX idx_courses_search 
ON courses USING GIN (to_tsvector('english', title || ' ' || description));

-- Query with FTS
SELECT * FROM courses
WHERE to_tsvector('english', title || ' ' || description) @@ plainto_tsquery('python');
```

---

## Payment Integration (Razorpay)

### Payment Flow Implementation

```javascript
// Step 1: Create order
exports.createOrder = async (req, res) => {
  try {
    const { courseId, amount } = req.body;
    const userId = req.userId;
    
    // Verify course exists and get current price
    const { data: course } = await supabase
      .from('courses')
      .select('price')
      .eq('id', courseId)
      .single();
    
    // Verify amount matches
    if (amount !== course.price * 100) { // Razorpay uses paise
      return res.status(400).json({ error: 'Amount mismatch' });
    }
    
    // Create order in Razorpay
    const order = await razorpayInstance.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `order_${userId}_${courseId}`,
      notes: { userId, courseId }
    });
    
    res.json({
      success: true,
      orderId: order.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Step 2: Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const userId = req.userId;
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    
    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    // Get payment details from Razorpay
    const payment = await razorpayInstance.payments.fetch(paymentId);
    
    if (payment.status !== 'captured') {
      return res.status(400).json({ error: 'Payment not captured' });
    }
    
    // Extract course from receipt
    const courseId = payment.notes.courseId;
    
    // Create payment record
    const { data: paymentRecord } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        course_id: courseId,
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: 'Success'
      })
      .select();
    
    // Check if already enrolled
    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', userId)
      .eq('course_id', courseId)
      .single();
    
    // Create enrollment if new
    if (!existing) {
      await supabase
        .from('enrollments')
        .insert({
          student_id: userId,
          course_id: courseId,
          status: 'Active',
          progress_percentage: 0
        });
    }
    
    res.json({
      success: true,
      message: 'Payment verified and enrollment created'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## Security Implementation

### Password Security

```javascript
// Signup - Hash password
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`
  }
});

// Supabase handles hashing with bcryptjs automatically
// Never store or log plain passwords
```

### JWT Token Implementation

```javascript
// Generate JWT on login
const generateToken = (userId, role) => {
  return jwt.sign(
    { sub: userId, role: role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT on every request
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return null; // Token expired, need refresh
    }
    return null; // Invalid token
  }
};
```

### Input Validation

```javascript
// Validate email
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Sanitize input
const sanitizeInput = (input) => {
  return input.trim().replace(/[<>\"']/g, '');
};

// Validate in controller
if (!isValidEmail(email)) {
  throw new ApiError('Invalid email format', 400);
}

const title = sanitizeInput(req.body.title);
```

---

## Performance Optimization

### Frontend Optimizations

```javascript
// Code splitting
const Dashboard = React.lazy(() => import('./Dashboard'));
const CourseList = React.lazy(() => import('./CourseList'));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>

// Memoization
const CourseCard = React.memo(({ course }) => {
  return <div>{course.title}</div>;
}, (prevProps, nextProps) => {
  return prevProps.course.id === nextProps.course.id;
});

// useCallback for event handlers
const handleDelete = useCallback((courseId) => {
  dispatch(deleteCourse(courseId));
}, [dispatch]);

// useMemo for expensive calculations
const filteredCourses = useMemo(() => {
  return courses.filter(c => c.category === selectedCategory);
}, [courses, selectedCategory]);
```

### Backend Optimizations

```javascript
// Database query optimization
// ❌ Bad: N+1 query problem
const courses = await supabase.from('courses').select('*');
for (let course of courses) {
  const instructor = await supabase
    .from('profiles')
    .select('*')
    .eq('id', course.instructor_id);
}

// ✅ Good: Use joins
const { data } = await supabase
  .from('courses')
  .select(`
    *,
    instructor:profiles(first_name, last_name, image)
  `);

// Pagination
const page = req.query.page || 1;
const limit = 20;
const offset = (page - 1) * limit;

const { data } = await supabase
  .from('courses')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1);

// Caching frequently accessed data
const cacheKey = `courses_${category}`;
let data = cache.get(cacheKey);

if (!data) {
  data = await supabase.from('courses').select('*').eq('category', category);
  cache.set(cacheKey, data, 60); // Cache for 60 seconds
}
```

---

## Testing Strategy

### Frontend Unit Tests

```javascript
// components/__tests__/CourseCard.test.js
import { render, screen } from '@testing-library/react';
import CourseCard from '../CourseCard';

describe('CourseCard', () => {
  it('renders course title', () => {
    const course = { id: 1, title: 'React Basics', price: 99 };
    render(<CourseCard course={course} />);
    expect(screen.getByText('React Basics')).toBeInTheDocument();
  });
  
  it('displays price', () => {
    const course = { id: 1, title: 'React', price: 99 };
    render(<CourseCard course={course} />);
    expect(screen.getByText('₹99')).toBeInTheDocument();
  });
});
```

### Backend Integration Tests

```javascript
// __tests__/auth.test.js
const request = require('supertest');
const app = require('../index');

describe('Authentication', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Test123!'
      });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

---

## Deployment Checklist

- [ ] All environment variables set
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Database backups configured
- [ ] Error logging setup (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Database migrations applied
- [ ] Rate limiting implemented
- [ ] Security headers added
- [ ] CDN configured

---

**This implementation serves as a production-ready reference! 🚀**
