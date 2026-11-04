import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Bookmark, Star, Play, BookOpen } from 'lucide-react';
import { TabBar, Badge, ProgressBar, EmptyState } from '../../components/dashboard/Common';
import { getUserEnrolledCourses } from '../../services/operations/profileAPI';
import { FaSpinner, FaGraduationCap } from 'react-icons/fa';

const CoursesPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.profile);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [bookmarks, setBookmarks] = useState(new Set());
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const { token } = useSelector(s => s.auth);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    load();
  }, [token]);

  const load = async () => {
    try {
      const data = await getUserEnrolledCourses(token);

      const merged = (data || []).map(row => ({
        ...row,
        id: row._id,
        progress: Math.round(row.progressPercentage || 0),
        instructor_name: row.instructor 
          ? `${row.instructor.firstName || ''} ${row.instructor.lastName || ''}`.trim() 
          : 'Faculty',
        category: (row.category?.name || row.category) || 'Computer Science',
        lastAccessed: new Date(row.updatedAt || row.createdAt || Date.now()).toLocaleDateString(),
        title: row.courseName,
        thumbnail: row.thumbnail,
      }));

      setCourses(merged);
    } catch (e) {
      console.error('[StudentCourses]', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter(c => {
    const matchesFilter =
      filter === 'All' ||
      (filter === 'In Progress' && !c.completed) ||
      (filter === 'Completed' && c.completed) ||
      (filter === 'Bookmarked' && bookmarks.has(c.id));
    const matchesSearch = (c.title || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleBookmark = (id) => {
    const next = new Set(bookmarks);
    if (next.has(id)) next.delete(id); else next.add(id);
    setBookmarks(next);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FaSpinner className="w-6 h-6 text-muted animate-spin" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 bg-surface border border-dashed border-border rounded-xl">
        <FaGraduationCap className="text-muted text-5xl" />
        <p className="text-text font-medium text-sm text-center">
          You haven't enrolled in any courses yet.
        </p>
        <button
          onClick={() => navigate('/explore-courses')}
          className="btn-primary py-2 px-4 text-xs font-semibold rounded-lg mt-2"
        >
          Browse Course Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Filter courses by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <TabBar tabs={['All', 'In Progress', 'Completed', 'Bookmarked']} active={filter} onChange={setFilter} />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((course) => (
            <div 
              key={course.id} 
              className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-border/80 transition-colors"
            >
              <div>
                {/* Thumbnail */}
                <div className="h-44 relative overflow-hidden bg-surface-2 border-b border-border">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted">
                      <BookOpen className="w-8 h-8" />
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3">
                    <Badge
                      text={course.completed ? 'Completed' : 'In Progress'}
                      color={course.completed ? 'emerald' : 'indigo'}
                    />
                  </div>
                  <button
                    onClick={() => toggleBookmark(course.id)}
                    className={`absolute top-3 right-3 p-1.5 rounded-md border text-xs transition-colors ${
                      bookmarks.has(course.id)
                        ? 'bg-warning text-white border-warning'
                        : 'bg-surface/80 border-border text-muted hover:text-text'
                    }`}
                    title={bookmarks.has(course.id) ? 'Remove bookmark' : 'Bookmark course'}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-muted mb-1.5">
                    <span className="font-medium text-text">{course.category}</span>
                    <span>·</span>
                    <span>{course.instructor_name}</span>
                  </div>

                  <h3 className="text-base font-semibold text-text line-clamp-2 leading-snug mb-3">
                    {course.title}
                  </h3>

                  {/* Progress Section */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-muted">{course.completed ? 'Completed' : 'Progress'}</span>
                      <span className={course.completed ? 'text-success font-semibold' : 'text-text font-semibold'}>
                        {course.progress}%
                      </span>
                    </div>
                    <ProgressBar pct={course.progress} color={course.completed ? 'bg-success' : 'bg-hot'} />
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 pb-5 pt-3 border-t border-border flex items-center justify-between gap-3">
                <span className="text-[11px] text-muted">
                  Accessed: {course.lastAccessed}
                </span>
                <button
                  onClick={() => navigate(`/learn/${course.id}`)}
                  className="btn-primary py-1.5 px-3.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{course.completed ? 'Review' : 'Continue'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No courses match your filter"
          subtitle="Try adjusting your keyword or switching tabs to locate enrolled courses."
          ctaText="Clear filter"
          onCta={() => { setFilter('All'); setSearch(''); }}
        />
      )}
    </div>
  );
};

export default CoursesPage;
