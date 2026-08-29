import React, { useState, useEffect } from 'react';
import { SmartNote } from '../types';
import { Calendar, Clock, CheckCircle2, Circle, Plus, Trash2, Award, BookOpen, AlertCircle, Sparkles, BarChart2, PieChart as PieIcon, Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { motion } from 'motion/react';

interface StudyPlannerProps {
  notes: SmartNote[];
}

interface StudySession {
  id: string;
  noteId: string;
  noteTitle: string;
  scheduledDate: string;
  durationMinutes: number;
  completed: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({ notes }) => {
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem('voicenotes_ai_study_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [
      {
        id: '1',
        noteId: notes[0]?.id || '1',
        noteTitle: notes[0]?.title || 'Introduction to Lecture Notes',
        scheduledDate: new Date(Date.now()).toISOString().split('T')[0],
        durationMinutes: 45,
        completed: false,
        priority: 'High'
      },
      {
        id: '2',
        noteId: notes[1]?.id || '2',
        noteTitle: notes[1]?.title || 'Advanced Concepts & Active Recall',
        scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        durationMinutes: 60,
        completed: true,
        priority: 'Medium'
      },
      {
        id: '3',
        noteId: notes[2]?.id || '3',
        noteTitle: notes[2]?.title || 'Final Exam Revision & Practice',
        scheduledDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        durationMinutes: 90,
        completed: false,
        priority: 'High'
      }
    ];
  });

  const [examDate, setExamDate] = useState(() => {
    return localStorage.getItem('voicenotes_ai_exam_date') || '2026-09-15';
  });

  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id || '');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(45);
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High');

  // Pomodoro Timer State
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [pomodoroCount, setPomodoroCount] = useState<number>(0);

  const modeTimes = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (pomodoroMode === 'focus') {
        setPomodoroCount(c => c + 1);
        alert('🎉 Pomodoro Focus session completed! Take a well-deserved break.');
      } else {
        alert('🔔 Break time is over! Ready to focus again?');
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, pomodoroMode]);

  const switchPomodoroMode = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
    setPomodoroMode(mode);
    setIsTimerRunning(false);
    setTimeLeft(modeTimes[mode]);
  };

  const resetPomodoro = () => {
    setIsTimerRunning(false);
    setTimeLeft(modeTimes[pomodoroMode]);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    localStorage.setItem('voicenotes_ai_study_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('voicenotes_ai_exam_date', examDate);
  }, [examDate]);

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    const noteObj = notes.find(n => n.id === selectedNoteId);

    const newSession: StudySession = {
      id: Date.now().toString(),
      noteId: selectedNoteId || 'custom',
      noteTitle: noteObj ? noteObj.title : 'Custom Study Review Session',
      scheduledDate: sessionDate,
      durationMinutes: Number(duration),
      completed: false,
      priority
    };

    setSessions([newSession, ...sessions]);
  };

  const toggleComplete = (id: string) => {
    setSessions(sessions.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const daysRemaining = Math.max(0, Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const completedCount = sessions.filter(s => s.completed).length;
  const progressPercentage = sessions.length > 0 ? Math.round((completedCount / sessions.length) * 100) : 0;

  // Calculate consecutive Daily Study Streak
  const completedDatesSet = new Set(sessions.filter(s => s.completed).map(s => s.scheduledDate));
  let studyStreak = 0;
  let streakDate = new Date();
  let todayKey = streakDate.toISOString().split('T')[0];
  if (!completedDatesSet.has(todayKey)) {
    streakDate.setDate(streakDate.getDate() - 1);
    if (completedDatesSet.has(streakDate.toISOString().split('T')[0])) {
      while (true) {
        let key = streakDate.toISOString().split('T')[0];
        if (completedDatesSet.has(key)) {
          studyStreak++;
          streakDate.setDate(streakDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      studyStreak = 0;
    }
  } else {
    while (true) {
      let key = streakDate.toISOString().split('T')[0];
      if (completedDatesSet.has(key)) {
        studyStreak++;
        streakDate.setDate(streakDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Prepare chart data for Study Minutes per Day
  const dateMap: Record<string, number> = {};
  sessions.forEach(s => {
    const day = s.scheduledDate;
    if (!dateMap[day]) dateMap[day] = 0;
    dateMap[day] += s.durationMinutes;
  });

  const barChartData = Object.keys(dateMap).sort().map(date => ({
    date: date.slice(5), // MM-DD
    minutes: dateMap[date]
  }));

  // Prepare pie chart data for completion status & priorities
  const pieChartData = [
    { name: 'Completed Sessions', value: completedCount, color: '#10b981' },
    { name: 'Pending Sessions', value: sessions.length - completedCount, color: '#6366f1' },
  ];

  const COLORS = ['#10b981', '#6366f1'];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner / Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-tr from-amber-500 to-orange-600 text-white p-6 rounded-3xl shadow-xl border border-amber-400/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-100">Daily Study Streak</span>
            <span className="text-xl">🔥</span>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold">{studyStreak}</span>
            <span className="text-sm font-medium text-amber-100">Days Streak</span>
          </div>
          <p className="text-xs text-amber-100/90 pt-1">
            {studyStreak > 0 ? 'Keep the momentum going!' : 'Complete a session today!'}
          </p>
        </div>

        <div className="bg-gradient-to-tr from-purple-900 to-indigo-900 text-white p-6 rounded-3xl shadow-xl border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-bold text-purple-200">Exam Countdown</span>
            <Calendar className="w-5 h-5 text-purple-300" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold">{daysRemaining}</span>
            <span className="text-sm font-medium text-purple-200">Days Left</span>
          </div>
          <div className="pt-2 flex items-center space-x-2">
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="bg-slate-900/80 border border-purple-700/60 rounded-xl px-3 py-1.5 text-xs text-white"
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-bold text-slate-500">Study Roadmap Progress</span>
            <Award className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{progressPercentage}%</span>
            <span className="text-xs text-slate-500">{completedCount} of {sessions.length} sessions done</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400">Total Study Time</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-white">
              {sessions.filter(s => s.completed).reduce((acc, curr) => acc + curr.durationMinutes, 0)} mins
            </span>
            <p className="text-xs text-slate-400 mt-1">Logged across completed review sessions</p>
          </div>
        </div>
      </div>

      {/* Pomodoro Focus Timer Section */}
      <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 text-white p-8 rounded-3xl shadow-2xl border border-indigo-500/30 flex flex-col items-center space-y-6">
        <div className="flex items-center justify-between w-full max-w-xl border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Timer className="w-6 h-6 text-indigo-400 animate-pulse" />
            <h3 className="text-lg font-bold">Pomodoro Focus Timer</h3>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
            Completed Pomodoros: {pomodoroCount} 🍅
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 space-x-1">
          <button
            onClick={() => switchPomodoroMode('focus')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              pomodoroMode === 'focus' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Focus (25m)
          </button>
          <button
            onClick={() => switchPomodoroMode('shortBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              pomodoroMode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            ☕ Short Break (5m)
          </button>
          <button
            onClick={() => switchPomodoroMode('longBreak')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              pomodoroMode === 'longBreak' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            🌴 Long Break (15m)
          </button>
        </div>

        {/* Timer Display */}
        <div className="text-center space-y-2">
          <div className="text-6xl md:text-7xl font-black font-mono tracking-wider bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            {formatTimer(timeLeft)}
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            {pomodoroMode === 'focus' ? 'Deep Focus Session - Eliminate Distractions' : 'Relax & Recharge'}
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl flex items-center space-x-2 transition-all ${
              isTimerRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isTimerRunning ? 'Pause Timer' : 'Start Focus'}</span>
          </button>

          <button
            onClick={resetPomodoro}
            className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl transition-all"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Recharts Analytics Visual Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Study Minutes per Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xl lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Study Time Trends (Minutes per Day)</h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Scheduled Review Duration</span>
          </div>
          <div className="h-64 w-full">
            {barChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">No session dates scheduled yet.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="minutes" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Pie Circle Chart: Completion Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
          className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <PieIcon className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Completion Status</h3>
            </div>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            {sessions.length === 0 ? (
              <div className="text-slate-400 text-xs">No sessions available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Schedule New Review Session Form */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">Schedule Review Session for Note</h3>
        </div>

        <form onSubmit={handleAddSession} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-1.5 lg:col-span-2">
            <label className="text-xs font-semibold text-slate-700">Select Lecture Note</label>
            <select
              value={selectedNoteId}
              onChange={(e) => setSelectedNoteId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {notes.length === 0 ? (
                <option value="">No notes available</option>
              ) : (
                notes.map((n) => (
                  <option key={n.id} value={n.id}>{n.title}</option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Review Date</label>
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Duration (Minutes)</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value={15}>15 mins (Quick)</option>
              <option value={30}>30 mins (Standard)</option>
              <option value={45}>45 mins (Deep Review)</option>
              <option value={60}>60 mins (Exam Prep)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Session</span>
          </button>
        </form>
      </div>

      {/* Scheduled Sessions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Your Scheduled Study Sessions ({sessions.length})</h3>
          <span className="text-xs text-slate-500">Click circle to mark review session complete</span>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No review sessions scheduled yet.</p>
            <p className="text-xs text-slate-500">Use the form above to schedule active recall sessions for your notes.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  session.completed
                    ? 'bg-emerald-50/50 border-emerald-200 text-slate-600'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleComplete(session.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      session.completed ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 hover:border-blue-600 bg-white'
                    }`}
                  >
                    {session.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <div className="space-y-0.5">
                    <h4 className={`text-sm font-bold ${session.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {session.noteTitle}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{session.scheduledDate}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{session.durationMinutes} mins</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                        session.priority === 'High' ? 'bg-rose-100 text-rose-700' : session.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {session.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-xl hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

