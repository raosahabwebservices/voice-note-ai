import React from 'react';
import { SmartNote, ActiveTab, UserProfile } from '../types';
import { Sparkles, Mic, Upload, FileText, Clock, ArrowRight, Brain, ShieldCheck, TrendingUp, Calendar, Target, AlertTriangle, BookOpen, Award } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardViewProps {
  notes: SmartNote[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectNote: (note: SmartNote) => void;
  currentUser: UserProfile;
  onUpdateNote?: (note: SmartNote) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  notes,
  setActiveTab,
  onSelectNote,
  currentUser,
  onUpdateNote,
}) => {
  const totalNotes = notes.length;
  const totalSeconds = notes.reduce((acc, note) => acc + (note.audioDurationSeconds || 0), 0);
  const totalMinutes = (totalSeconds / 60).toFixed(1);

  // Student metrics
  const totalFlashcards = notes.reduce((acc, note) => acc + (note.keyPoints?.length || 5), 0);
  const totalQuestions = notes.reduce((acc, note) => acc + (note.questions?.length || 3), 0);
  const examReadiness = notes.length > 0 ? Math.min(94, 45 + notes.length * 7) : 0;

  // Identify notes created or last reviewed more than 24 hours ago
  const now = new Date().getTime();
  const twentyFourHoursMs = 24 * 60 * 60 * 1000;
  const revisionNotes = notes.filter(note => {
    const refTime = note.lastReviewed ? new Date(note.lastReviewed).getTime() : new Date(note.createdAt).getTime();
    return (now - refTime) > twentyFourHoursMs;
  });

  // Mock weak topics or extracted concepts from notes
  const weakTopics = [
    { topic: 'Dynamic Programming & Recursion', noteTitle: notes[0]?.title || 'Data Structures Lecture', accuracy: '52%' },
    { topic: 'Organic Reaction Mechanisms', noteTitle: notes[1]?.title || 'Organic Chemistry II', accuracy: '64%' },
    { topic: 'Max-Flow Min-Cut Theorem', noteTitle: notes[2]?.title || 'Advanced Algorithms', accuracy: '58%' },
  ].slice(0, Math.min(3, Math.max(1, notes.length)));

  const upcomingExams = [
    { subject: 'Data Structures & Algorithms', date: 'Sept 15, 2026', daysLeft: 18, urgent: true },
    { subject: 'Operating Systems Mid-Term', date: 'Sept 22, 2026', daysLeft: 25, urgent: false },
    { subject: 'Computer Networks Final', date: 'Oct 05, 2026', daysLeft: 38, urgent: false },
  ];

  const recentNotes = [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  // Compute last 7 days study activity data
  const getLast7DaysData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      days.push({ dateStr, label: displayLabel, count: 0, minutes: 0 });
    }

    notes.forEach(note => {
      const noteDateStr = new Date(note.createdAt).toISOString().split('T')[0];
      const found = days.find(d => d.dateStr === noteDateStr);
      if (found) {
        found.count += 1;
        found.minutes += Math.round((note.audioDurationSeconds || 0) / 60);
      }
    });

    return days;
  };

  const chartData = getLast7DaysData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn bg-slate-50 min-h-screen text-slate-900">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/25 text-white text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Study Companion & Lecture Notes Engine</span>
              </div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400 text-slate-900 text-xs font-bold shadow-sm">
                <Target className="w-3.5 h-3.5 text-amber-900" />
                <span>Exam Readiness: {examReadiness}% 🎯</span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-amber-200">{currentUser.name}</span>!
            </h1>
            <p className="text-indigo-100 max-w-2xl text-sm sm:text-base font-medium">
              Turn your college lectures into crystal-clear smart notes, active recall flashcards, MCQs, and exam-ready answers instantly.
            </p>
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('record')}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 bg-white text-blue-600 hover:bg-slate-100 px-5 py-3 rounded-xl font-bold shadow-md transition-all hover:scale-105"
            >
              <Mic className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Record Lecture</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 bg-blue-900/40 hover:bg-blue-900/60 text-white px-5 py-3 rounded-xl font-medium border border-white/20 backdrop-blur-md transition-all"
            >
              <Upload className="w-4 h-4 text-cyan-300" />
              <span>Upload Audio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Student Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recorded Lectures</p>
            <p className="text-3xl font-extrabold text-slate-900">{totalNotes}</p>
            <div className="flex items-center space-x-1 text-xs text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{totalMinutes} mins of audio</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Flashcards</p>
            <p className="text-3xl font-extrabold text-slate-900">{totalFlashcards}</p>
            <div className="flex items-center space-x-1 text-xs text-cyan-600 font-medium">
              <Brain className="w-3.5 h-3.5" />
              <span>Ready for active recall</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
            <Brain className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Exam Questions</p>
            <p className="text-3xl font-extrabold text-slate-900">{totalQuestions}</p>
            <div className="flex items-center space-x-1 text-xs text-indigo-600 font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>MCQs & Short Answer Banks</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Exam Readiness</p>
            <p className="text-3xl font-extrabold text-slate-900">{examReadiness}%</p>
            <div className="flex items-center space-x-1 text-xs text-amber-600 font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>On track for exams</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Student-Centric Widgets: Upcoming Exams & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">📅 Upcoming Exams & Countdowns</h2>
                <p className="text-xs text-slate-500">Plan your revision schedule before exam day</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('study_planner')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
            >
              Study Planner →
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {upcomingExams.map((exam, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{exam.subject}</h4>
                  <p className="text-xs text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-400" />
                    {exam.date}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${exam.urgent ? 'bg-rose-100 text-rose-700 border border-rose-200 animate-pulse' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                  ⏳ {exam.daysLeft} days left
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weak Topics (Based on Quiz Performance) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">⚠️ Weak Topics & Focus Areas</h2>
                <p className="text-xs text-slate-500">Topics needing active revision based on quiz accuracy</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
              AI Quiz Analytics
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No lecture notes yet. Record or upload a lecture to track weak topics!
              </div>
            ) : (
              weakTopics.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60">
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{item.topic}</h4>
                    <p className="text-xs text-slate-500">Source: {item.noteTitle}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200">
                      Accuracy {item.accuracy}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Student Achievements & Badges System */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-0.5 rounded-full bg-white/25 text-amber-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                🏆 Student Achievement Milestones
              </span>
              <span className="text-xs text-amber-100">Level 3 Scholar</span>
            </div>
            <h2 className="text-2xl font-black text-white">Your Learning Streaks & Badges</h2>
            <p className="text-amber-100 text-xs sm:text-sm">
              Consistent daily revision unlocks prestigious achievement badges and maximizes your exam retention score.
            </p>
          </div>
          <div className="flex items-center space-x-3 bg-white/15 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20">
            <div className="text-3xl font-black text-amber-200">🔥 {currentUser.studyStreak || Math.max(5, notes.length + 2)}</div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Day Study Streak</p>
              <p className="text-[10px] text-amber-100">Keep it burning daily!</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-1">
            <span className="text-amber-100 text-xs font-semibold">Notes Reviewed</span>
            <p className="text-2xl font-extrabold text-white">
              {currentUser.notesReviewedCount || Math.max(12, notes.length * 3)} <span className="text-xs font-normal text-amber-200">notes</span>
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-1">
            <span className="text-amber-100 text-xs font-semibold">Practice Tests / MCQs</span>
            <p className="text-2xl font-extrabold text-white">
              {currentUser.testsCompletedCount || Math.max(8, notes.length * 2)} <span className="text-xs font-normal text-amber-200">tests completed</span>
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 space-y-1">
            <span className="text-amber-100 text-xs font-semibold">Memory Retention Score</span>
            <p className="text-2xl font-extrabold text-white">
              92% <span className="text-xs font-normal text-emerald-300">↑ Excellent</span>
            </p>
          </div>
        </div>

        {/* Badge Showcase */}
        <div className="space-y-3 pt-2 border-t border-white/20">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-100">Unlocked Badges & Rewards</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 flex items-center space-x-3 shadow-sm">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-xs font-bold text-white">Streak Master</p>
                <p className="text-[10px] text-amber-200">5+ Days Streak</p>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 flex items-center space-x-3 shadow-sm">
              <span className="text-2xl">📚</span>
              <div>
                <p className="text-xs font-bold text-white">Bookworm</p>
                <p className="text-[10px] text-amber-200">10+ Notes Studied</p>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 flex items-center space-x-3 shadow-sm">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="text-xs font-bold text-white">Exam Ace</p>
                <p className="text-[10px] text-amber-200">5+ Tests Completed</p>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-3 flex items-center space-x-3 shadow-sm">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-xs font-bold text-white">Speed Learner</p>
                <p className="text-[10px] text-amber-200">30s AI Summary Pro</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Revision Widget (Spaced Repetition > 24 Hours) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center text-violet-600">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">🔄 Daily Active Revision & Spaced Repetition</h2>
              <p className="text-xs text-slate-500">Notes created or last reviewed over 24 hours ago, recommended for memory reinforcement</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-violet-700 bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-200">
            {revisionNotes.length} Notes Due for Review
          </span>
        </div>

        {revisionNotes.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <p className="text-sm font-semibold text-slate-700">🎉 All caught up on your active daily revision!</p>
            <p className="text-xs text-slate-500">Notes recorded within the last 24 hours are locked in for fresh memory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {revisionNotes.map((note) => {
              const refTime = note.lastReviewed || note.createdAt;
              const hoursAgo = Math.round((now - new Date(refTime).getTime()) / (1000 * 60 * 60));
              return (
                <div key={note.id} className="bg-slate-50 border border-slate-200 hover:border-violet-300 rounded-2xl p-5 space-y-3 flex flex-col justify-between transition-all">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 text-[10px] font-bold uppercase">
                        Due for Review
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {hoursAgo}h ago
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{note.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{note.summary}</p>
                  </div>
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => onSelectNote(note)}
                      className="flex-1 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-sm transition-all text-center"
                    >
                      Review Now →
                    </button>
                    {onUpdateNote && (
                      <button
                        onClick={() => {
                          const updated = { ...note, lastReviewed: new Date().toISOString() };
                          onUpdateNote(updated);
                        }}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all"
                        title="Mark as Reviewed for another 24 hours"
                      >
                        ✓ Done
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7-Day Study Activity Graph */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">📈 7-Day Study & Lecture Activity</h2>
              <p className="text-xs text-slate-500">Lectures recorded and processed over the last 7 days</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>Live Student Stats</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '1rem',
                  color: '#0f172a',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                }}
                formatter={(value: any) => [`${value} lectures`, 'Processed']}
                labelStyle={{ color: '#475569', fontWeight: 600, marginBottom: '4px' }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorNotes)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Smart Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">📚 Recent Lecture Smart Notes</h2>
          </div>
          <button
            onClick={() => setActiveTab('notes')}
            className="flex items-center space-x-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span>View All Lectures</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recentNotes.length === 0 ? (
            <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl">
                🎙️
              </div>
              <h3 className="text-lg font-bold text-slate-900">No lectures recorded yet</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Record your first college lecture or upload an audio file to generate AI smart notes, exam questions, and flashcards instantly.
              </p>
              <button
                onClick={() => setActiveTab('record')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all"
              >
                Record Your First Lecture
              </button>
            </div>
          ) : (
            recentNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className="group bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-300 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                        {note.category}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center space-x-1 font-medium">
                        <Clock className="w-3 h-3 mr-1" />
                        {Math.round((note.audioDurationSeconds || 0) / 60)}m audio
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {note.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2">
                  {note.summary}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex flex-wrap gap-1.5">
                    {note.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="font-medium">{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
