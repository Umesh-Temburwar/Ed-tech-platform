import React from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { Badge } from '../../components/dashboard/Common';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Aarav Sharma', xp: 5250, courses: 8, avatar: 'https://api.dicebear.com/5.x/initials/svg?seed=AS' },
  { rank: 2, name: 'Riya Patel', xp: 4800, courses: 7, avatar: 'https://api.dicebear.com/5.x/initials/svg?seed=RP' },
  { rank: 3, name: 'Ibrahim Khan', xp: 4500, courses: 9, avatar: 'https://api.dicebear.com/5.x/initials/svg?seed=IK' },
  { rank: 4, name: 'Sophie Williams', xp: 3900, courses: 6, avatar: 'https://api.dicebear.com/5.x/initials/svg?seed=SW' },
  { rank: 5, name: 'Arjun Verma', xp: 3750, courses: 7, avatar: 'https://api.dicebear.com/5.x/initials/svg?seed=AV' },
  { rank: 6, name: 'You (Student)', xp: 1250, courses: 3, avatar: 'https://api.dicebear.com/5.x/initials/svg?seed=You', isYou: true }
];

const LeaderboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-text">Academic Leaderboard</h2>
          <p className="text-xs text-muted mt-0.5">Top peer performance rankings based on course completions and assessments</p>
        </div>
        <Badge text="Academic Term 2026" color="indigo" />
      </div>

      {/* Top 3 Honor Roll Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LEADERBOARD_DATA.slice(0, 3).map((user) => (
          <div
            key={user.rank}
            className="bg-surface border border-border rounded-xl p-5 shadow-sm flex items-center gap-4 hover:border-border/80 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border ${
              user.rank === 1
                ? 'bg-warning/10 border-warning/30 text-warning'
                : user.rank === 2
                ? 'bg-surface-2 border-border text-text'
                : 'bg-hot/10 border-hot/30 text-hot'
            }`}>
              #{user.rank}
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border border-border shrink-0 bg-surface-2">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-text truncate">{user.name}</h4>
              <p className="text-xs text-muted mt-0.5">{user.courses} courses · {user.xp.toLocaleString()} pts</p>
            </div>
          </div>
        ))}
      </div>

      {/* Full Table */}
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-semibold text-text">Full Cohort Standings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-2 border-b border-border text-muted">
              <tr>
                <th className="py-2.5 px-4 font-semibold w-16">Rank</th>
                <th className="py-2.5 px-4 font-semibold">Student</th>
                <th className="py-2.5 px-4 font-semibold text-center">Courses Completed</th>
                <th className="py-2.5 px-4 font-semibold text-right">Activity Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {LEADERBOARD_DATA.map((user) => (
                <tr
                  key={user.rank}
                  className={`transition-colors ${
                    user.isYou ? 'bg-accent/5 font-medium' : 'hover:bg-surface-2'
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-semibold ${
                      user.rank === 1
                        ? 'text-warning font-bold'
                        : user.rank === 2
                        ? 'text-muted font-bold'
                        : user.rank === 3
                        ? 'text-hot font-bold'
                        : 'text-muted'
                    }`}>
                      {user.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-border shrink-0 bg-surface-2">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-text font-medium">{user.name}</span>
                      {user.isYou && <Badge text="You" color="indigo" />}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center text-muted">
                    {user.courses}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-text">
                    {user.xp.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
