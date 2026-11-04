import React, { useState } from 'react';
import { Clock, Award, TrendingUp, Calendar } from 'lucide-react';
import { StatCard, TabBar } from '../../components/dashboard/Common';
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const WATCH_TIME_DATA = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.8 },
  { day: 'Wed', hours: 1.2 },
  { day: 'Thu', hours: 3.5 },
  { day: 'Fri', hours: 2.0 },
  { day: 'Sat', hours: 4.2 },
  { day: 'Sun', hours: 3.0 }
];

const COMPLETION_DATA = [
  { name: 'Completed', value: 65 },
  { name: 'In Progress', value: 25 },
  { name: 'Not Started', value: 10 }
];

const QUIZ_SCORE_DATA = [
  { week: 'W1', score: 75 },
  { week: 'W2', score: 82 },
  { week: 'W3', score: 78 },
  { week: 'W4', score: 88 },
  { week: 'W5', score: 92 }
];

const TIME_OF_DAY_DATA = [
  { hour: '06:00', count: 10 },
  { hour: '09:00', count: 30 },
  { hour: '12:00', count: 45 },
  { hour: '15:00', count: 60 },
  { hour: '18:00', count: 80 },
  { hour: '21:00', count: 70 },
  { hour: '00:00', count: 25 }
];

const PIE_COLORS = ['#3fb950', '#58a6ff', '#8b949e'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface border border-border rounded-lg p-2.5 shadow-md text-xs">
        <p className="font-semibold text-text">{label}</p>
        <p className="text-muted mt-0.5">
          {payload[0].name || 'Value'}: <span className="font-medium text-text">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const [range, setRange] = useState('Weekly');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-text">Study Analytics & Performance</h2>
          <p className="text-xs text-muted mt-0.5">Track your curriculum watch time, quiz accuracy, and study frequency</p>
        </div>
        <TabBar tabs={['Weekly', 'Monthly', 'Yearly']} active={range} onChange={setRange} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Clock} label="Total Study Time" value="47h 30m" trend="+8h this week" color="indigo" />
        <StatCard icon={Award} label="Completed Modules" value="2" trend="1 in progress" color="emerald" />
        <StatCard icon={TrendingUp} label="Average Quiz Score" value="87%" trend="+5% improvement" color="purple" />
        <StatCard icon={Calendar} label="Active Study Days" value="23" trend="Consistent" color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Watch Time */}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-text">Weekly Study Hours</h3>
            <span className="text-[11px] text-muted font-medium">Hours / Day</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WATCH_TIME_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="day" stroke="var(--muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="hours" stroke="#58a6ff" fill="#58a6ff" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Completion Distribution */}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-text">Curriculum Progress Ratio</h3>
            <span className="text-[11px] text-muted font-medium">Breakdown (%)</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COMPLETION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {COMPLETION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="var(--surface)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs mt-2">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success" /> <span className="text-muted">Completed (65%)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-accent" /> <span className="text-muted">In Progress (25%)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-surface-3" /> <span className="text-muted">Not Started (10%)</span></div>
          </div>
        </div>

        {/* Quiz Scores */}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-text">Assessment Score Trajectory</h3>
            <span className="text-[11px] text-muted font-medium">Score / 100</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={QUIZ_SCORE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="week" stroke="var(--muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted)" fontSize={11} domain={[50, 100]} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="score" stroke="#3fb950" strokeWidth={2} dot={{ fill: '#3fb950', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Activity */}
        <div className="bg-surface border border-border rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-text">Peak Study Hours</h3>
            <span className="text-[11px] text-muted font-medium">Activity Frequency</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TIME_OF_DAY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.6} />
                <XAxis dataKey="hour" stroke="var(--muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#ff6b4a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
