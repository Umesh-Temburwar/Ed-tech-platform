import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Users, Clock, Heart, Share2, ShoppingCart, BookOpen } from 'lucide-react';
import Footer from '../components/common/Footer';
import { supabase } from '../config/supabaseClient';
import { getYoutubeThumbnail } from '../utils/youtubeUtils';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { addToWishlist, removeFromWishlist } from '../services/operations/wishlistAPI';
import { addToCart } from '../slices/cartSlice';

const ExploreCourses = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  const handleAddToCart = (course, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      toast.error('Please log in to add to cart');
      return;
    }
    dispatch(addToCart(course));
  };

  const handleToggleWishlist = (course, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      toast.error('Please log in to add to wishlist');
      return;
    }
    const isWishlisted = wishlist.some((item) => item.id === course.id);
    if (isWishlisted) {
      dispatch(removeFromWishlist(course.id, token));
    } else {
      dispatch(addToWishlist(course.id, course, token));
    }
  };

  const handleShare = (course, e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/courses/${course.id}`;
    if (navigator.share) {
      navigator.share({
        title: course.title || course.course_name,
        text: course.description || course.short_description,
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Course link copied to clipboard!');
    }
  };

  // Fetch user enrollments
  useEffect(() => {
    if (user?.id) {
      const fetchEnrollments = async () => {
        const { data } = await supabase
          .from("course_enrollments")
          .select("course_id")
          .eq("student_id", user.id);
        if (data) {
          setEnrolledCourseIds(new Set(data.map(d => d.course_id)));
        }
      };
      fetchEnrollments();
    }
  }, [user]);

  // Fetch courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('courses')
          .select(`
            id,
            title,
            course_name,
            description,
            course_description,
            short_description,
            price,
            discount_price,
            discounted_price,
            status,
            is_published,
            is_free,
            final_thumbnail_url,
            youtube_thumbnail_url,
            custom_thumbnail_url,
            thumbnail_url,
            thumbnail,
            computed_thumbnail,
            preview_video_url,
            youtube_video_url,
            created_at,
            average_rating,
            rating,
            total_students,
            enrolled_students_count,
            instructor:instructor_id(
              id,
              first_name,
              last_name,
              avatar_url,
              image
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const enrichedCourses = data.map(course => {
            const rawThumb =
              course.final_thumbnail_url ||
              course.youtube_thumbnail_url ||
              course.custom_thumbnail_url ||
              course.thumbnail_url ||
              course.thumbnail ||
              course.computed_thumbnail ||
              (course.preview_video_url ? getYoutubeThumbnail(course.preview_video_url) : '') ||
              (course.youtube_video_url ? getYoutubeThumbnail(course.youtube_video_url) : '');

            return {
              ...course,
              course_name: course.title || course.course_name || 'Untitled Course',
              course_description: course.description || course.course_description || course.short_description || '',
              thumbnail: rawThumb,
              price: course.is_free ? 0 : (course.price || 0),
              average_rating: course.average_rating || course.rating || 0,
              enrolled_students_count: course.enrolled_students_count || course.total_students || 0,
            };
          });
          
          setCourses(enrichedCourses);
          setFilteredCourses(enrichedCourses);
        } else {
          setCourses([]);
          setFilteredCourses([]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
        setFilteredCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter and sort courses
  useEffect(() => {
    let result = [...courses];

    if (searchQuery) {
      result = result.filter(
        course =>
          course.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.course_description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => (b.enrolled_students_count || 0) - (a.enrolled_students_count || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        break;
    }

    setFilteredCourses(result);
  }, [courses, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-canvas text-text">
      {/* Header Section */}
      <div className="border-b border-border bg-surface py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">
              Academic Offerings
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold text-text tracking-tight mb-3">
              Course Catalog
            </h1>
            <p className="text-muted text-sm leading-relaxed mb-6">
              Rigorous, university-level curricula across core Computer Science disciplines, systems, and algorithms.
            </p>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                placeholder="Search courses by topic, algorithm, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-text focus:outline-none cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Additions</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          <div className="text-xs text-muted">
            <span className="text-text font-semibold">{filteredCourses.length}</span> courses available
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-4 space-y-3 animate-pulse">
                <div className="h-44 bg-surface-2 rounded-lg"></div>
                <div className="h-5 bg-surface-2 rounded w-3/4"></div>
                <div className="h-4 bg-surface-2 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-surface border border-dashed border-border rounded-xl">
            <BookOpen className="w-10 h-10 text-muted mx-auto mb-3" />
            <h3 className="text-base font-semibold text-text mb-1">No courses found</h3>
            <p className="text-xs text-muted">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:border-border/80 transition-colors flex flex-col justify-between"
              >
                <Link to={`/courses/${course.id}`} className="block">
                  <div className="relative h-44 bg-surface-2 border-b border-border overflow-hidden">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.course_name || course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const src = e.target.src;
                          if (src.includes('maxresdefault')) {
                            e.target.src = src.replace('maxresdefault', 'hqdefault');
                          } else {
                            e.target.style.display = 'none';
                          }
                        }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">
                        <BookOpen className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-semibold text-text mb-1.5 line-clamp-1">
                      {course.course_name}
                    </h3>
                    
                    <p className="text-muted text-xs mb-3 line-clamp-2 leading-relaxed">
                      {course.course_description}
                    </p>

                    <div className="flex items-center gap-2 mb-3 text-xs text-muted">
                      <span className="text-text font-medium">
                        {course.instructor?.first_name} {course.instructor?.last_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted">
                      <div className="flex items-center gap-1 text-warning">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span className="text-text font-medium">{course.average_rating || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        <span>{course.enrolled_students_count || 0} enrolled</span>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-5 pb-5 pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-base font-semibold text-text">
                      {course.price > 0 ? `₹${course.price}` : <span className="text-success">FREE</span>}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {enrolledCourseIds.has(course.id || course._id) ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/learn/${course.id || course._id}`);
                        }}
                        className="btn-primary py-1.5 px-3 rounded-lg text-xs font-semibold"
                      >
                        Go to Classroom
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(`/courses/${course.id || course._id}`);
                          }}
                          className="btn-primary py-1.5 px-3 rounded-lg text-xs font-semibold"
                        >
                          Enroll Now
                        </button>
                        {token && user?.accountType === 'Student' && (
                          <button
                            onClick={(e) => {
                              const c = { ...course };
                              if (!c._id) c._id = c.id;
                              handleAddToCart(c, e);
                            }}
                            className="btn-secondary p-1.5 rounded-lg text-xs"
                            title="Add to cart"
                          >
                            <ShoppingCart className="h-3.5 w-3.5 text-muted" />
                          </button>
                        )}
                      </>
                    )}
                    {token && user?.accountType === 'Student' && (
                      <button
                        onClick={(e) => handleToggleWishlist(course, e)}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          wishlist.some((item) => item.id === course.id)
                            ? 'bg-danger/10 border-danger text-danger'
                            : 'btn-secondary'
                        }`}
                        title="Wishlist"
                      >
                        <Heart className="h-3.5 w-3.5 fill-current" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleShare(course, e)}
                      className="btn-secondary p-1.5 rounded-lg text-xs text-muted hover:text-text"
                      title="Share course"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ExploreCourses;
