import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Star, Users, Clock, Play, Heart, Share2, CheckCircle, 
  ChevronDown, ChevronUp, BookOpen, Lock, ArrowLeft
} from 'lucide-react';
import Footer from '../components/common/Footer';
import { supabase } from '../config/supabaseClient';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import PaymentModalSecure from '../components/PaymentModalSecure';
import { extractYouTubeVideoId } from '../utils/youtubeUtils';
import { addToWishlist, removeFromWishlist } from '../services/operations/wishlistAPI';
import { addToCart } from '../slices/cartSlice';

function CourseVideoPlayer({ courseData, isEnrolled, navigate, handleEnrollment }) {
  const isFree = courseData.is_free || Number(courseData.price) === 0;

  const videoId =
    courseData.youtube_video_id ||
    extractYouTubeVideoId(courseData.preview_video_url || '') ||
    null;

  const thumbnail =
    (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null) ||
    courseData.youtube_thumbnail_url ||
    courseData.final_thumbnail_url ||
    courseData.thumbnail_url ||
    courseData.thumbnail ||
    null;

  const canWatch = isFree || isEnrolled;

  const handleClick = () => {
    if (isEnrolled) {
      navigate(`/learn/${courseData.id}`);
    } else {
      handleEnrollment();
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="relative aspect-video w-full bg-surface-2 overflow-hidden group cursor-pointer border-b border-border"
    >
      {thumbnail ? (
        <img 
          src={thumbnail} 
          alt={courseData.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          onError={(e) => { e.target.style.display = 'none'; }} 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted">
          <BookOpen className="w-10 h-10" />
        </div>
      )}
      
      {canWatch ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 hover:bg-black/50 transition-colors">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="h-5 w-5 text-black ml-0.5 fill-current" />
          </div>
          <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white bg-black/70 px-2.5 py-0.5 rounded">
            {isEnrolled ? "Go to Classroom" : "Free Access"}
          </span>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-4 text-center">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-2 text-white">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-white">Enroll to View Coursework</span>
          <span className="text-[11px] text-muted mt-0.5">Lectures & materials accessible in classroom</span>
        </div>
      )}
    </div>
  );
}

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);

  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const isWishlisted = wishlist.some((item) => item.id === courseId);

  // Fetch course details & sections from Supabase
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const { data: course, error } = await supabase
          .from('courses')
          .select(`
            *,
            instructor:instructor_id(
              id,
              first_name,
              last_name,
              avatar_url,
              image,
              about
            )
          `)
          .eq('id', courseId)
          .single();

        if (error) throw error;

        if (course) {
          // Fetch sections and lessons in parallel
          const [secRes, lesRes] = await Promise.all([
            supabase
              .from('sections')
              .select('id, section_name, order_index')
              .eq('course_id', courseId)
              .order('order_index', { ascending: true }),
            supabase
              .from('course_lessons')
              .select('id, title, duration, duration_seconds, position, is_free_preview, section_id')
              .eq('course_id', courseId)
              .order('position', { ascending: true }),
          ]);

          const sections = secRes.data || [];
          const lessons = lesRes.data || [];

          const sortedSections = sections.map(sec => ({
            ...sec,
            sub_sections: lessons.filter(l => l.section_id === sec.id)
          }));

          setCourseData({
            ...course,
            sections: sortedSections,
            course_name: course.title || course.course_name,
            course_description: course.description || course.course_description || course.short_description
          });

          if (sortedSections.length > 0) {
            setActiveSection(sortedSections[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching course detail:", err);
        toast.error("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user?.id || !courseId) return;
      try {
        const { data } = await supabase
          .from('course_enrollments')
          .select('id')
          .eq('course_id', courseId)
          .eq('student_id', user.id)
          .maybeSingle();

        if (data) {
          setIsEnrolled(true);
        }
      } catch (err) {
        console.error("Enrollment check error:", err);
      }
    };

    checkEnrollment();
  }, [user, courseId]);

  const handleEnrollment = async () => {
    const activeToken = token || (await supabase.auth.getSession()).data.session?.access_token;

    if (!activeToken) {
      toast.error("Please login to enroll in this course");
      navigate('/login', { state: { from: `/courses/${courseId}?enroll=true` } });
      return;
    }

    try {
      const isFree = courseData.is_free || Number(courseData.price) === 0;
      const apiUrl = process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_BASE_URL || 'http://localhost:4000/api/v1';
      const baseUrl = apiUrl.endsWith('/api/v1') ? apiUrl : `${apiUrl}/api/v1`;

      if (isFree) {
        toast.loading("Enrolling in course...");
        
        const response = await fetch(`${baseUrl}/course/enroll/free/${courseData.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${activeToken}`
          }
        });
        
        const resData = await response.json();
        toast.dismiss();

        if (resData.success) {
          toast.success("Enrolled successfully!");
          setIsEnrolled(true);
          navigate(`/learn/${courseData.id}`);
        } else {
          toast.error(resData.message || "Failed to process free enrollment");
        }
      } else {
        setShowPaymentModal(true);
      }
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to process transaction checkout");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please log in to add to cart');
      return;
    }
    dispatch(addToCart(courseData));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please log in to manage wishlist');
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlist(courseData.id, token));
    } else {
      dispatch(addToWishlist(courseData.id, courseData, token));
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: courseData.course_name,
        text: courseData.course_description,
        url: url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Course link copied to clipboard!');
    }
  };

  const handlePaymentSuccess = () => {
    setIsEnrolled(true);
    setShowPaymentModal(false);
    toast.success("Enrollment confirmed! Redirecting to classroom...");
    navigate(`/learn/${courseData.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <FaSpinner className="text-muted text-3xl animate-spin" />
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-text mb-2">Course not found</h2>
          <button
            onClick={() => navigate('/explore-courses')}
            className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold"
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const toggleSection = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-canvas text-text">
      {/* Hero Section */}
      <div className="bg-surface border-b border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/explore-courses')}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to course catalog</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">
                Course Syllabus
              </span>
              <h1 className="text-3xl sm:text-4xl font-semibold text-text tracking-tight mb-4 leading-tight">
                {courseData.course_name}
              </h1>

              <p className="text-muted text-sm mb-6 leading-relaxed">
                {courseData.course_description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-xs text-muted mb-6">
                <div className="flex items-center gap-1 text-warning">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-text font-semibold">{courseData.average_rating || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{courseData.enrolled_students_count || 0} enrolled</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{courseData.total_duration || 'Full Curriculum'}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center font-semibold text-text text-sm">
                  {courseData.instructor?.first_name?.charAt(0) || 'F'}
                </div>
                <div>
                  <p className="text-text text-xs font-semibold">
                    {courseData.instructor?.first_name} {courseData.instructor?.last_name}
                  </p>
                  <p className="text-muted text-[11px]">Faculty Instructor</p>
                </div>
              </div>
            </div>

            {/* Sticky Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm sticky top-24">
                <CourseVideoPlayer 
                  courseData={courseData} 
                  isEnrolled={isEnrolled} 
                  navigate={navigate} 
                  handleEnrollment={handleEnrollment} 
                />

                <div className="p-5 space-y-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-text">
                      {courseData.price > 0 ? `₹${courseData.price}` : <span className="text-success">FREE</span>}
                    </span>
                    {courseData.original_price > courseData.price && (
                      <span className="text-xs text-muted line-through">
                        ₹{courseData.original_price}
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={isEnrolled ? () => navigate(`/learn/${courseData.id || courseId}`) : handleEnrollment}
                    className="w-full btn-primary py-2.5 rounded-lg text-sm font-semibold"
                  >
                    {isEnrolled ? "Go to Classroom" : (courseData.is_free || Number(courseData.price) === 0 ? "Enroll Free" : "Purchase Course")}
                  </button>

                  {!isEnrolled && token && user?.accountType === "Student" && (
                    <button 
                      onClick={handleAddToCart}
                      className="w-full btn-secondary py-2 rounded-lg text-xs font-semibold"
                    >
                      Add to Cart
                    </button>
                  )}

                  <div className="flex gap-2">
                    {token && user?.accountType === "Student" && (
                      <button 
                        onClick={handleWishlist}
                        className={`flex-1 btn-secondary py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 ${
                          isWishlisted ? 'text-danger' : ''
                        }`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                        <span>{isWishlisted ? 'Wishlisted' : 'Save'}</span>
                      </button>
                    )}
                    <button 
                      onClick={handleShare}
                      className="flex-1 btn-secondary py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border text-xs text-muted">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Permanent curriculum access</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span>Verified completion certificate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum & Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            {/* Syllabus Sections */}
            <section>
              <h2 className="text-lg font-semibold text-text mb-4">Course Syllabus & Modules</h2>
              <div className="space-y-3">
                {courseData.sections?.map((section, index) => (
                  <div key={section.id} className="bg-surface border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-surface-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-muted">Section {index + 1}:</span>
                        <span className="text-xs font-semibold text-text">{section.section_name}</span>
                        <span className="text-[11px] text-muted">
                          ({section.sub_sections?.length || 0} lectures)
                        </span>
                      </div>
                      {activeSection === section.id ? (
                        <ChevronUp className="h-4 w-4 text-muted" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted" />
                      )}
                    </button>
                    
                    {activeSection === section.id && (
                      <div className="border-t border-border divide-y divide-border/60 bg-surface-2/40">
                        {section.sub_sections?.map((lesson) => (
                          <div key={lesson.id} className="px-5 py-2.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <Play className="h-3.5 w-3.5 text-muted" />
                              <span className="text-text">{lesson.title}</span>
                            </div>
                            {lesson.duration && (
                              <span className="text-[11px] font-mono text-muted">{lesson.duration}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Instructor Bio */}
            <section className="bg-surface border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-text mb-4">Faculty Information</h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-2 border border-border flex items-center justify-center font-bold text-base text-text shrink-0">
                  {courseData.instructor?.first_name?.charAt(0) || 'F'}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text">
                    {courseData.instructor?.first_name} {courseData.instructor?.last_name}
                  </h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    {courseData.instructor?.about || 'Senior faculty instructor and domain specialist.'}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />

      {/* Payment Modal */}
      {showPaymentModal && courseData && (
        <PaymentModalSecure
          course={courseData}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default CourseDetail;
