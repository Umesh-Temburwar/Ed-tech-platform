import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Clock, 
  Star, 
  CheckCircle2 
} from 'lucide-react';
import { removeFromCart } from '../slices/cartSlice';
import { toast } from 'react-hot-toast';
import Footer from '../components/common/Footer';

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cart.reduce((total, item) => {
    const priceValue = item.salePrice || item.price;
    const price = typeof priceValue === 'string' 
      ? Number(priceValue.replace(/[^\d]/g, '')) 
      : priceValue;
    return total + (price * (item.quantity || 1));
  }, 0);
  const total = subtotal;

  const handleRemoveFromCart = (courseId) => {
    dispatch(removeFromCart(courseId));
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to proceed with enrollment');
      navigate('/login');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    navigate('/course-purchase', {
      state: {
        cartItems: cart,
        subtotal,
        total
      }
    });
  };

  const handleContinueShopping = () => {
    navigate('/explore-courses');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-canvas text-text flex flex-col justify-between transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 py-24 text-center my-auto">
          <div className="w-16 h-16 rounded-2xl bg-surface-2 border border-border flex items-center justify-center text-muted mx-auto mb-5 shadow-sm">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-muted max-w-md mx-auto leading-relaxed mb-8">
            You haven't selected any courses yet. Browse our comprehensive Computer Science curriculum to enroll.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/explore-courses">
              <button className="btn-primary py-2.5 px-6 text-xs font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Browse Catalog
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-text transition-colors duration-200 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header */}
        <div className="mb-8 pb-5 border-b border-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-1">
              Checkout & Enrollment
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-text tracking-tight">
              Course Enrollment Cart
            </h1>
          </div>
          <div className="text-xs text-muted">
            <span className="font-semibold text-text">{cart.length}</span> {cart.length === 1 ? 'course' : 'courses'} selected
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {cart.map((course) => (
                <motion.div
                  key={course._id || course.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-surface border border-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-sm hover:border-border/80 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-24 h-16 rounded-lg bg-surface-2 border border-border overflow-hidden shrink-0">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.courseName || course.title} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted">
                          <BookOpen className="w-6 h-6 opacity-40" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-text truncate">
                        {course.courseName || course.title}
                      </h3>
                      <p className="text-xs text-muted line-clamp-1 mt-0.5">
                        {course.courseDescription || course.description || 'Full comprehensive syllabus'}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] text-muted mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted" />
                          {course.duration || 'Self-Paced'}
                        </span>
                        <span className="flex items-center gap-1 text-warning">
                          <Star className="w-3 h-3 fill-current" />
                          {course.averageRating || course.rating || 4.8}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border">
                    <div className="text-right">
                      <span className="text-base font-bold text-text">
                        {course.price > 0 ? `₹${Number(course.price).toLocaleString()}` : <span className="text-success">FREE</span>}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(course._id || course.id)}
                      title="Remove course from cart"
                      className="p-1.5 rounded-md text-muted hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="pt-2">
              <button
                onClick={handleContinueShopping}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Continue Browsing Courses
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-5 sticky top-24">
              <h2 className="text-base font-semibold text-text border-b border-border pb-3">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Selected Courses</span>
                  <span className="font-medium text-text">{cart.length}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-text">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-text">Total Tuition</span>
                  <span className="text-xl font-bold text-text">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* What's Included */}
              <div className="p-3.5 rounded-lg bg-surface-2 border border-border space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                  Included with Enrollment
                </span>
                <p className="flex items-center gap-2 text-text">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  Full Lifetime Lecture Archive Access
                </p>
                <p className="flex items-center gap-2 text-text">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  Downloadable Study Notes & Practice Tests
                </p>
                <p className="flex items-center gap-2 text-text">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  Verified Certificate of Completion
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary py-3 text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <span>Proceed to Enrollment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted pt-2 border-t border-border">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>SSL Secured Checkout & Account Sync</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
