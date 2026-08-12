import React from 'react';
import { SmartNote, ActiveTab } from '../types';
import { Sparkles, Mic, Upload, FileText, Clock, CheckCircle2, Calendar, ArrowRight, Brain, ShieldCheck, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardViewProps {
  notes: SmartNote[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectNote: (note: SmartNote) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  notes,
  setActiveTab,
  onSelectNote,
}) => {
  const totalNotes = notes.length;
  const totalSeconds = notes.reduce((acc, note) => acc + (note.audioDurationSeconds || 0), 0);
  const totalMinutes = (totalSeconds / 60).toFixed(1);

  const allActionItems = notes.flatMap(n => n.actionItems || []);
  const completedActions = allActionItems.filter(a => a.completed).length;
  const pendingActions = allActionItems.length - completedActions;

  const categoryCounts = notes.reduce((acc, note) => {
    acc[note.category] = (acc[note.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentNotes = [...notes].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  // Compute last 7 days productivity data
  const getLast7DaysData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800/80 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Audio Intelligence Engine Active</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Welcome to VoiceNotes AI
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm sm:text-base">
              Transform lectures, meetings, interviews, and brainstorms into crystal-clear executive summaries, searchable transcripts, and actionable deadlines instantly.
            </p>
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('record')}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-3 rounded-xl font-medium shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
            >
              <Mic className="w-4 h-4 text-rose-300 animate-pulse" />
              <span>Record Voice</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className="flex-1 md:flex-initial flex items-center justify-center space-x-2 bg-slate-800/80 hover:bg-slate-700/80 text-white px-5 py-3 rounded-xl font-medium border border-slate-700 transition-all"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload Audio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Smart Notes</p>
            <p className="text-3xl font-bold text-white">{totalNotes}</p>
            <div className="flex items-center space-x-1 text-xs text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>All synced securely</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Minutes Processed</p>
            <p className="text-3xl font-bold text-white">{totalMinutes}m</p>
            <div className="flex items-center space-x-1 text-xs text-cyan-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Real-time AI STT</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Action Items</p>
            <p className="text-3xl font-bold text-white">{completedActions}/{allActionItems.length}</p>
            <div className="flex items-center space-x-1 text-xs text-indigo-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{pendingActions} pending tasks</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">AI Categories</p>
            <p className="text-3xl font-bold text-white">{Object.keys(categoryCounts).length}</p>
            <div className="flex items-center space-x-1 text-xs text-emerald-400">
              <Brain className="w-3.5 h-3.5" />
              <span>Students, Founders & Pros</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Brain className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 7-Day Productivity Graph */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">7-Day Productivity Activity</h2>
              <p className="text-xs text-slate-400">Number of smart notes processed over the last 7 days</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span>Live Analytics</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNotes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="label" stroke="#64748b" textAnchor="end" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#1e293b',
                  borderRadius: '1rem',
                  color: '#f8fafc',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                }}
                formatter={(value: any) => [`${value} notes`, 'Processed']}
                labelStyle={{ color: '#94a3b8', fontWeight: 600, marginBottom: '4px' }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#818cf8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorNotes)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Target Audiences / Category Quick Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { name: 'Student', desc: 'Lectures & Study notes', count: categoryCounts['Student'] || 0, color: 'from-blue-600/20 to-indigo-600/20 border-blue-500/30 text-blue-400' },
          { name: 'Entrepreneur', desc: 'Pitches & Strategy', count: categoryCounts['Entrepreneur'] || 0, color: 'from-violet-600/20 to-purple-600/20 border-violet-500/30 text-violet-400' },
          { name: 'Professional', desc: 'Meetings & Syncs', count: categoryCounts['Professional'] || 0, color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30 text-emerald-400' },
          { name: 'Content Creator', desc: 'Scripts & Ideation', count: categoryCounts['Content Creator'] || 0, color: 'from-rose-600/20 to-orange-600/20 border-rose-500/30 text-rose-400' },
        ].map((cat) => (
          <div
            key={cat.name}
            onClick={() => setActiveTab('notes')}
            className={`cursor-pointer rounded-2xl bg-gradient-to-br ${cat.color} border p-5 transition-all hover:scale-[1.02] shadow-md`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-white">{cat.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900/80 text-xs font-bold text-slate-200">
                {cat.count}
              </span>
            </div>
            <p className="text-xs text-slate-400">{cat.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Recent Smart Notes</h2>
          </div>
          <button
            onClick={() => setActiveTab('notes')}
            className="flex items-center space-x-1 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            <span>View All Notes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recentNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note)}
              className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-lg space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 text-xs font-medium">
                      {note.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {Math.round((note.audioDurationSeconds || 0) / 60)}m audio
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {note.title}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 line-clamp-2">
                {note.summary}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                      #{tag}
                    </span>
                  ))}
                </div>
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
