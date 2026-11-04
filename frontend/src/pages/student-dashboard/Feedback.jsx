import React, { useState } from 'react';
import { Star, History, CheckCircle2 } from 'lucide-react';
import { TabBar, Badge, EmptyState } from '../../components/dashboard/Common';
import { FEEDBACK_PENDING, FEEDBACK_HISTORY } from '../../data/student-dashboard-data';

const FeedbackPage = () => {
  const [tab, setTab] = useState('Pending');
  const [ratings, setRatings] = useState({});
  const [hoverStar, setHoverStar] = useState(0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text">Course Feedback & Evaluations</h2>
          <p className="text-xs text-muted mt-0.5">Share course assessments to help faculty calibrate curriculum depth</p>
        </div>
        <TabBar tabs={['Pending', 'History']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Pending' ? (
        <div className="space-y-4">
          {FEEDBACK_PENDING.length > 0 ? FEEDBACK_PENDING.map(course => (
            <div 
              key={course.id} 
              className="bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col md:flex-row gap-5"
            >
              <div className="w-full md:w-44 h-28 rounded-lg overflow-hidden border border-border bg-surface-2 shrink-0">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-text">{course.title}</h4>
                    <p className="text-xs text-muted mt-0.5">Faculty: {course.instructor}</p>
                  </div>
                  <Badge text="Pending Review" color="amber" />
                </div>

                <div className="flex items-center gap-1.5 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverStar(s)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setRatings({...ratings, [course.id]: {...ratings[course.id], stars: s}})}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${
                        (hoverStar || ratings[course.id]?.stars) >= s
                          ? 'text-warning fill-warning'
                          : 'text-muted'
                      }`} />
                    </button>
                  ))}
                  <span className="text-xs text-muted ml-2">
                    {ratings[course.id]?.stars ? `${ratings[course.id].stars} / 5 stars` : 'Rate module'}
                  </span>
                </div>

                {ratings[course.id]?.stars > 0 && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    <textarea
                      placeholder="Detail what concepts were clear, and where pacing or explanation could improve..."
                      rows={3}
                      className="input-field"
                    />
                    <div className="flex justify-end">
                      <button className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold">
                        Submit Evaluation
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )) : (
            <EmptyState
              icon={CheckCircle2}
              title="No pending reviews"
              subtitle="All completed courses have been evaluated."
            />
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {FEEDBACK_HISTORY.map((h, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 shadow-sm space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-semibold text-text">{h.course}</h4>
                  <p className="text-[11px] text-muted">{h.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`w-3.5 h-3.5 ${j < h.rating ? 'text-warning fill-warning' : 'text-muted'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-text leading-relaxed">"{h.review}"</p>
              <div className="text-[11px] text-muted flex items-center gap-1.5 pt-1">
                <History className="w-3 h-3" />
                <span>{h.helpful} students found this evaluation helpful</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
