import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../../ui/GlassCard';

const LEARNING_GOALS = [
  { id: 'job', label: 'Get a Job', icon: '💼' },
  { id: 'upskill', label: 'Upskill', icon: '📈' },
  { id: 'projects', label: 'Build Projects', icon: '🚀' },
  { id: 'freelance', label: 'Freelancing', icon: '💻' },
  { id: 'interviews', label: 'Crack Interviews', icon: '🎯' },
  { id: 'explore', label: 'Explore Technology', icon: '🔬' },
];

const LEARNING_STYLES = [
  { id: 'video', label: 'Video', icon: '🎬' },
  { id: 'text', label: 'Text', icon: '📚' },
  { id: 'projects', label: 'Projects', icon: '🛠️' },
  { id: 'live', label: 'Live Classes', icon: '🎙️' },
];

const DAILY_TIMES = ['15 mins', '30 mins', '1 hour', '2+ hours'];

export default function LearningPreferencesStep({ formData, onChange, onNext, onPrev }) {
  const handleGoalSelect = (goal) => onChange({ learning_goal: goal });
  const handleStyleSelect = (style) => onChange({ preferred_learning_style: style });
  const handleDailyTime = (time) => onChange({ daily_learning_time: time });
  const handleToggle = (key) => onChange({ [key]: !formData[key] });

  return (
    <GlassCard className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">Learning Preferences</h2>
          <p className="text-gray-400 text-sm">Customize your learning experience</p>
        </div>

        {/* Learning Goals */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-indigo-400">Primary Learning Goal</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {LEARNING_GOALS.map((goal) => (
              <motion.button
                key={goal.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGoalSelect(goal.id)}
                className={`p-4 rounded-2xl text-left transition-all
                  ${formData.learning_goal === goal.id
                    ? 'bg-gradient-to-br from-indigo-600/30 to-cyan-600/30 border-2 border-indigo-500/60 shadow-lg shadow-indigo-500/20'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
              >
                <div className="text-3xl mb-2">{goal.icon}</div>
                <div className="text-sm font-bold text-white">{goal.label}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Study Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-cyan-400">Study Preferences</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Daily Learning Time</label>
            <div className="flex flex-wrap gap-2">
              {DAILY_TIMES.map((time) => (
                <motion.button
                  key={time}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDailyTime(time)}
                  className={`px-4 py-2 rounded-full text-sm font-medium
                    ${formData.daily_learning_time === time
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                    }`}
                >
                  {time}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Preferred Learning Style</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {LEARNING_STYLES.map((style) => (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStyleSelect(style.id)}
                  className={`p-4 rounded-xl text-center
                    ${formData.preferred_learning_style === style.id
                      ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-2 border-purple-500/60'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                >
                  <div className="text-2xl mb-1">{style.icon}</div>
                  <div className="text-xs font-semibold text-white">{style.label}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-amber-400">Platform Preferences</h3>
          <div className="space-y-3">
            {[
              { key: 'notifications_enabled', label: 'Notifications Enabled' },
              { key: 'email_updates', label: 'Email Updates' },
              { key: 'dark_mode', label: 'Dark Mode' },
              { key: 'interest_recommendations', label: 'Interest & Category Recommendations' },
            ].map((pref) => (
              <div key={pref.key} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="text-sm font-medium text-white">{pref.label}</span>
                <button
                  onClick={() => handleToggle(pref.key)}
                  className={`w-12 h-6 rounded-full transition-colors relative
                    ${formData[pref.key] ? 'bg-gradient-to-r from-indigo-500 to-cyan-500' : 'bg-gray-700'}`}
                >
                  <motion.div
                    animate={{ x: formData[pref.key] ? 26 : 2 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={onPrev}
            className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-all"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-xl text-white font-bold hover:opacity-90 transition-all shadow-lg"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </GlassCard>
  );
}
