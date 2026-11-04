import React, { useState, useEffect } from 'react';
import { Brain, Download, Clock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { TabBar, Badge, ProgressBar, EmptyState } from '../../components/dashboard/Common';
import { QUIZ_SCHEDULED, QUIZ_COMPLETED, QUIZ_QUESTIONS } from '../../data/student-dashboard-data';

const QuizPage = () => {
  const [quizState, setQuizState] = useState('list'); // list, active, result
  const [tab, setTab] = useState('Scheduled');
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let timer;
    if (quizState === 'active' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && quizState === 'active') {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [quizState, timeLeft]);

  const handleStart = (quiz) => {
    setActiveQuiz(quiz);
    setQuizState('active');
    setTimeLeft(quiz.duration * 60);
    setCurrentQ(0);
    setAnswers({});
  };

  const handleSubmit = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    setScore(Math.round((correct / QUIZ_QUESTIONS.length) * 100));
    setQuizState('result');
  };

  if (quizState === 'active') {
    const isAnswered = answers[currentQ] !== undefined;

    return (
      <div className="max-w-3xl mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center bg-surface border border-border rounded-xl p-5 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-text">{activeQuiz?.title || 'Knowledge Assessment'}</h2>
            <p className="text-muted text-xs mt-0.5">Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</p>
          </div>
          <div className={`px-3 py-1.5 rounded-lg border font-mono font-medium text-sm flex items-center gap-1.5 ${
            timeLeft <= 30
              ? 'bg-danger/10 border-danger text-danger'
              : 'bg-surface-2 border-border text-text'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}</span>
          </div>
        </div>

        <ProgressBar pct={((currentQ + 1) / QUIZ_QUESTIONS.length) * 100} size="h-1.5" />

        <div className="bg-surface border border-border rounded-xl p-6 sm:p-8 shadow-sm">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-2">
            Question {currentQ + 1}
          </span>
          <h3 className="text-base sm:text-lg font-medium text-text mb-6 leading-relaxed">
            {QUIZ_QUESTIONS[currentQ].q}
          </h3>

          <div className="space-y-3">
            {QUIZ_QUESTIONS[currentQ].options.map((opt, i) => {
              const selected = answers[currentQ] === i;
              return (
                <button
                  key={i}
                  onClick={() => setAnswers({...answers, [currentQ]: i})}
                  className={`w-full p-3.5 rounded-lg border text-left text-xs sm:text-sm font-medium transition-colors flex items-center justify-between ${
                    selected
                      ? 'bg-surface-2 border-hot text-text ring-1 ring-hot'
                      : 'bg-surface-2 border-border text-text hover:border-border/80 hover:bg-surface-3'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border text-[11px] flex items-center justify-center font-semibold ${
                      selected ? 'border-hot bg-hot text-white' : 'border-border text-muted bg-surface'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {selected && <CheckCircle2 className="w-4 h-4 text-hot" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Selector & Bottom Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {QUIZ_QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-colors ${
                  i === currentQ
                    ? 'border-hot bg-hot text-white shadow-sm'
                    : answers[i] !== undefined
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-border bg-surface-2 text-muted hover:text-text'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className="btn-secondary py-2 px-4 rounded-lg text-xs font-medium flex items-center gap-1.5 disabled:opacity-40"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {currentQ === QUIZ_QUESTIONS.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="btn-primary py-2 px-6 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Submit Assessment</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentQ(Math.min(QUIZ_QUESTIONS.length - 1, currentQ + 1))}
                className="btn-primary py-2 px-6 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (quizState === 'result') {
    const isPassing = score >= 70;
    const correctCount = Math.round((score / 100) * QUIZ_QUESTIONS.length);
    const incorrectCount = QUIZ_QUESTIONS.length - correctCount;

    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="bg-surface border border-border rounded-xl p-8 shadow-sm text-center">
          <div className={`w-16 h-16 rounded-full border mx-auto mb-4 flex items-center justify-center ${
            isPassing ? 'bg-success/10 border-success/30 text-success' : 'bg-danger/10 border-danger/30 text-danger'
          }`}>
            <span className="text-xl font-bold">{score}%</span>
          </div>

          <h2 className="text-xl font-semibold text-text mb-1">
            {isPassing ? 'Assessment Completed' : 'Assessment Not Cleared'}
          </h2>
          <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
            {isPassing 
              ? 'Congratulations! You achieved passing threshold for this topic assessment.'
              : 'The minimum passing score is 70%. Review the module lectures and attempt again.'}
          </p>

          <div className="grid grid-cols-3 gap-3 my-6 p-4 rounded-lg bg-surface-2 border border-border">
            <div>
              <p className="text-[11px] text-muted font-medium">Correct</p>
              <p className="text-lg font-semibold text-success mt-0.5">{correctCount}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted font-medium">Incorrect</p>
              <p className="text-lg font-semibold text-danger mt-0.5">{incorrectCount}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted font-medium">Total Questions</p>
              <p className="text-lg font-semibold text-text mt-0.5">{QUIZ_QUESTIONS.length}</p>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleStart(activeQuiz)}
              className="btn-secondary py-2 px-4 rounded-lg text-xs font-medium"
            >
              Retake Test
            </button>
            <button
              onClick={() => setQuizState('list')}
              className="btn-primary py-2 px-5 rounded-lg text-xs font-semibold"
            >
              Return to Quizzes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-text">Assessments & Practice Quizzes</h2>
          <p className="text-xs text-muted mt-0.5">Test syllabus understanding with timed chapter quizzes</p>
        </div>
        <TabBar tabs={['Scheduled', 'Completed']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Scheduled' ? (
        <div className="space-y-3">
          {QUIZ_SCHEDULED.length > 0 ? QUIZ_SCHEDULED.map(quiz => (
            <div
              key={quiz.id}
              className="bg-surface border border-border rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-border/80 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center shrink-0 text-accent">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text">{quiz.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                    <Badge text={quiz.difficulty} color={quiz.difficulty === 'Hard' ? 'red' : 'indigo'} />
                    <span>{quiz.questionCount} Questions</span>
                    <span>·</span>
                    <span>{quiz.duration} mins</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStart(quiz)}
                className="btn-primary py-2 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 self-end sm:self-auto"
              >
                <span>Start Assessment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )) : (
            <EmptyState
              icon={Brain}
              title="No pending assessments"
              subtitle="All assigned practice quizzes have been submitted."
            />
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUIZ_COMPLETED.map(q => (
            <div
              key={q.id}
              className="bg-surface border border-border rounded-xl p-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 border border-success/30 flex items-center justify-center text-success text-xs font-bold">
                  {q.score}%
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-text">{q.title}</h4>
                  <p className="text-[11px] text-muted mt-0.5">{q.date}</p>
                </div>
              </div>
              <button 
                className="p-2 text-muted hover:text-text rounded-md hover:bg-surface-2 transition-colors"
                title="Download report"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
