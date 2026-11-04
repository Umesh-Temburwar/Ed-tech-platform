import React, { useState } from 'react';
import { TabBar } from '../../components/dashboard/Common';
import { NOTIFICATIONS_DATA } from '../../data/student-dashboard-data';

const NotificationsPage = () => {
  const [filter, setFilter] = useState('All');
  const [readIds, setReadIds] = useState(new Set([6, 7, 8]));

  const filtered = NOTIFICATIONS_DATA.filter(n => 
    filter === 'All' || 
    n.type === filter || 
    (filter === 'Unread' && !readIds.has(n.id))
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-text">Notifications & Course Alerts</h2>
          <p className="text-xs text-muted mt-0.5">Stay informed about new lectures, quiz submissions, and grades</p>
        </div>
        <button 
          onClick={() => setReadIds(new Set(NOTIFICATIONS_DATA.map(n => n.id)))} 
          className="text-xs text-accent font-semibold hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <TabBar tabs={['All', 'Unread', 'Courses', 'Quizzes', 'System']} active={filter} onChange={setFilter} />

      <div className="space-y-3">
        {filtered.map(n => {
          const isUnread = !readIds.has(n.id);
          return (
            <div 
              key={n.id} 
              className={`bg-surface border rounded-xl p-4 shadow-sm flex items-center gap-4 cursor-pointer transition-colors ${
                isUnread 
                  ? 'border-border/80 bg-surface' 
                  : 'border-border/60 bg-surface/60 opacity-80'
              } hover:border-border`}
              onClick={() => { 
                const nxt = new Set(readIds); 
                nxt.add(n.id); 
                setReadIds(nxt); 
              }}
            >
              <div className="w-9 h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0 text-muted">
                <n.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className={`text-xs font-semibold truncate ${isUnread ? 'text-text' : 'text-muted'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-muted ml-3 shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-muted truncate">{n.desc}</p>
              </div>
              {isUnread && (
                <div className="w-2 h-2 bg-hot rounded-full shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationsPage;
