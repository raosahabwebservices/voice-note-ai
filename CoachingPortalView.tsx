import React, { useState } from 'react';
import { SmartNote, UserProfile } from '../types';
import { Building2, Users, BookOpen, Layers, Mic, Upload, Sparkles, CheckCircle2, Shield, Calendar, Award, TrendingUp, ArrowRight, Settings } from 'lucide-react';

interface CoachingPortalViewProps {
  currentUser: UserProfile;
  notes: SmartNote[];
  onSelectNote: (note: SmartNote) => void;
}

export const CoachingPortalView: React.FC<CoachingPortalViewProps> = ({ currentUser, notes, onSelectNote }) => {
  const [roleMode, setRoleMode] = useState<'student' | 'teacher' | 'admin'>(
    currentUser.role === 'ADMIN' ? 'admin' : 'student'
  );

  // Mock Coaching State
  const [coachingName] = useState('Apex Elite Academy & Coaching');
  const [selectedBatch, setSelectedBatch] = useState('Batch 2026 - JEE/NEET Advanced');
  const [selectedSubject, setSelectedSubject] = useState('Physics - Electrodynamics');
  const [selectedChapter, setSelectedChapter] = useState('Chapter 3: Electromagnetic Induction');

  // Admin states
  const [batches, setBatches] = useState([
    { id: 'b1', name: 'Batch 2026 - JEE/NEET Advanced', studentsCount: 142, teacher: 'Dr. R. K. Sharma', subjects: 4 },
    { id: 'b2', name: 'Batch 2026 - Medical Foundation', studentsCount: 98, teacher: 'Prof. Anjali Gupta', subjects: 3 },
    { id: 'b3', name: 'Class 12 CBSE Boards Intensive', studentsCount: 215, teacher: 'Mr. Rajesh Verma', subjects: 5 }
  ]);
  const [teachers, setTeachers] = useState([
    { id: 't1', name: 'Dr. R. K. Sharma', subject: 'Physics', email: 'sharma@apex.edu', status: 'Active' },
    { id: 't2', name: 'Prof. Anjali Gupta', subject: 'Biology & Chemistry', email: 'anjali@apex.edu', status: 'Active' },
    { id: 't3', name: 'Mr. Rajesh Verma', subject: 'Mathematics', email: 'rajesh@apex.edu', status: 'Active' }
  ]);
  const [newBatchName, setNewBatchName] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'lectures' | 'batches' | 'teachers' | 'analytics'>('overview');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-slate-900 min-h-screen bg-slate-50">
      {/* Coaching Header & Role Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
              🏫
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-blue-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider border border-blue-400/30">
                  Enterprise Coaching Portal
                </span>
                <span className="text-xs text-slate-400">Powered by VoiceNotes AI</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{coachingName}</h1>
            </div>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center bg-white/10 p-1.5 rounded-2xl backdrop-blur-md border border-white/20">
            <button
              onClick={() => setRoleMode('student')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                roleMode === 'student' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              🎓 Student View
            </button>
            <button
              onClick={() => setRoleMode('teacher')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                roleMode === 'teacher' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              👨‍🏫 Teacher Panel
            </button>
            <button
              onClick={() => setRoleMode('admin')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                roleMode === 'admin' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:text-white'
              }`}
            >
              ⚙️ Admin & Billing
            </button>
          </div>
        </div>
      </div>

      {/* --- STUDENT EXPERIENCE IN COACHING --- */}
      {roleMode === 'student' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
                  🎓
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">My Coaching Hierarchy</h2>
                  <p className="text-xs text-slate-500">Access your institute published lectures, notes, tests & revision</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Enrolled in: {selectedBatch}</span>
              </div>
            </div>

            {/* Hierarchy Path Breadcrumb */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-blue-600">Coaching Institute</span>
                <p className="font-bold text-slate-900 text-sm">Apex Elite Academy</p>
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-600">Active Batch</span>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                >
                  {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
              </div>
              <div className="p-4 rounded-2xl bg-violet-50/60 border border-violet-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-violet-600">Subject</span>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="Physics - Electrodynamics">Physics - Electrodynamics</option>
                  <option value="Organic Chemistry">Organic Chemistry</option>
                  <option value="Calculus & Vectors">Calculus & Vectors</option>
                </select>
              </div>
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-cyan-600">Chapter</span>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full bg-transparent font-bold text-slate-900 text-sm focus:outline-none cursor-pointer"
                >
                  <option value="Chapter 3: Electromagnetic Induction">Chapter 3: Electromagnetic Induction</option>
                  <option value="Chapter 4: Alternating Currents">Chapter 4: Alternating Currents</option>
                </select>
              </div>
            </div>
          </div>

          {/* Published Lectures & Study Material */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">📚 Published Lectures & AI Study Notes</h3>
                <p className="text-xs text-slate-500">Recordings, summaries, questions, and active recall flashcards uploaded by your coaching faculty</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                {notes.length} Lectures Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {notes.length === 0 ? (
                <div className="col-span-full py-12 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-slate-500 text-sm">No coaching lectures published yet for this chapter.</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => onSelectNote(note)}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 transition-all cursor-pointer shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {selectedSubject}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Faculty Verified ✓</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{note.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{note.summary}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                      <span>⚡ {note.keyPoints?.length || 5} Key Concepts</span>
                      <span>❓ {note.questions?.length || 3} Exam Questions</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- TEACHER PANEL --- */}
      {roleMode === 'teacher' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  👨‍🏫
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Faculty Lecture Upload & AI Generation</h2>
                  <p className="text-xs text-slate-500">Record or upload classroom audio to generate AI notes, MCQs, and tests instantly</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Select Batch:</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500">
                      {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Select Subject:</label>
                    <input
                      type="text"
                      defaultValue="Physics - Electrodynamics"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="p-8 border-2 border-dashed border-slate-300 rounded-2xl text-center space-y-3 bg-slate-50">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                    <Mic className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Record Live Lecture or Upload Audio</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Upload MP3, WAV, M4A classroom recordings. AI will automatically transcribe and publish study material to enrolled students.
                  </p>
                  <button
                    onClick={() => alert('Faculty lecture recording initialized. AI transcription processing...')}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    Start Recording / Upload Audio
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">📊 Faculty Quick Stats</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Assigned Batches</span>
                  <span className="text-sm font-bold text-slate-900">3 Batches</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Lectures Published</span>
                  <span className="text-sm font-bold text-emerald-600">28 Lectures</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">Student Engagement</span>
                  <span className="text-sm font-bold text-blue-600">94.2% Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ADMIN & BILLING PANEL --- */}
      {roleMode === 'admin' && (
        <div className="space-y-6">
          {/* Admin Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enrolled Students</p>
              <p className="text-3xl font-extrabold text-slate-900">455</p>
              <span className="text-xs text-emerald-600 font-medium">Active across 3 batches</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Audio Minutes</p>
              <p className="text-3xl font-extrabold text-slate-900">3,420 m</p>
              <span className="text-xs text-blue-600 font-medium">Lecture library archive</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Student Score</p>
              <p className="text-3xl font-extrabold text-slate-900">84.6%</p>
              <span className="text-xs text-emerald-600 font-medium">Based on AI test analytics</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enterprise Plan</p>
              <p className="text-3xl font-extrabold text-indigo-600">Growth (₹9,999/mo)</p>
              <span className="text-xs text-slate-500 font-medium">Renews Sept 25, 2026</span>
            </div>
          </div>

          {/* Batches & Teachers Management */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">⚙️ Institute Batch & Teacher Management</h3>
                <p className="text-xs text-slate-500">Create coaching batches, assign faculty, and monitor student engagement</p>
              </div>
              <button
                onClick={() => {
                  const name = prompt('Enter new batch name:');
                  if (name) setBatches(prev => [...prev, { id: `b-${Date.now()}`, name, studentsCount: 0, teacher: 'Dr. Sharma', subjects: 3 }]);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                + Create New Batch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {batches.map(batch => (
                <div key={batch.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">Active Batch</span>
                    <span className="text-xs text-slate-500 font-medium">{batch.studentsCount} Students</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{batch.name}</h4>
                  <p className="text-xs text-slate-600">Lead Faculty: <strong className="text-slate-900">{batch.teacher}</strong></p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span>{batch.subjects} Subjects</span>
                    <button className="text-blue-600 hover:text-blue-700 font-bold">Manage Batch →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
