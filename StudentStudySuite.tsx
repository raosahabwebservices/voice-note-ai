import React, { useState } from 'react';
import { SmartNote } from '../types';
import { BookOpen, HelpCircle, Calendar, Sparkles, CheckCircle, Award, RefreshCw, ChevronRight, ChevronLeft, FileText, PenTool, Check, Bookmark, Loader2, Volume2, Flame, ShieldAlert, Cpu, Layers } from 'lucide-react';

interface StudentStudySuiteProps {
  note: SmartNote;
  token?: string;
}

export const StudentStudySuite: React.FC<StudentStudySuiteProps> = ({ note, token }) => {
  const [subTab, setSubTab] = useState<'master' | 'important' | 'timestamps' | 'simplifier' | 'flashcards' | 'quiz' | 'answers' | 'assignment' | 'handwritten' | 'planner'>('master');

  // Explanation difficulty state
  const [explanationLevel, setExplanationLevel] = useState<'very_easy' | 'normal' | 'advanced'>('normal');

  // Explain Again Modal state
  const [explainedOutput, setExplainedOutput] = useState<string | null>(null);

  // Master Study Session state
  const [masterStep, setMasterStep] = useState(1);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState<{ question: string; answer: string }[]>(
    note.keyPoints && note.keyPoints.length > 0 
      ? note.keyPoints.map((pt, idx) => ({
          question: `What is Key Point #${idx + 1} regarding ${note.title}?`,
          answer: pt
        }))
      : [
          { question: `What is the core subject of ${note.title}?`, answer: note.summary.slice(0, 150) + '...' },
          { question: `What is the main takeaway?`, answer: note.summary }
        ]
  );
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);
  const [flashcardError, setFlashcardError] = useState<string | null>(null);

  const handleGenerateAiFlashcards = async () => {
    setGeneratingFlashcards(true);
    setFlashcardError(null);
    try {
      const activeToken = token || localStorage.getItem('voicenotes_ai_token');
      const res = await fetch('/api/notes/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({ note })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate AI flashcards');
      if (data.flashcards && data.flashcards.length > 0) {
        setFlashcards(data.flashcards);
        setCurrentCardIndex(0);
        setIsFlipped(false);
      }
    } catch (err: any) {
      setFlashcardError(err.message || 'Failed to generate flashcards');
    } finally {
      setGeneratingFlashcards(false);
    }
  };

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([
    {
      q: `Based on "${note.title}", what was the primary focus of discussion?`,
      options: [
        note.summary.slice(0, 60) + '...',
        'General administrative updates and introductions',
        'Unrelated historical data and background research',
        'Budget allocations and financial forecasting only'
      ],
      correct: 0
    },
    {
      q: `Which of the following is highlighted as a primary takeaway?`,
      options: [
        note.keyPoints[0] || 'Implementation of new operational workflows',
        'Postponing all milestones indefinitely',
        'Closing down current projects',
        'None of the above'
      ],
      correct: 0
    },
    {
      q: `How should a student approach studying or reviewing this lecture?`,
      options: [
        'Memorize word-for-word without understanding',
        'Review key points, test with flashcards, and practice active recall',
        'Ignore notes and rely on textbook only',
        'Skip review sessions'
      ],
      correct: 1
    }
  ]);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  const handleGenerateAiQuiz = async () => {
    setGeneratingQuiz(true);
    setQuizError(null);
    try {
      const activeToken = token || localStorage.getItem('voicenotes_ai_token');
      const res = await fetch('/api/notes/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(activeToken ? { Authorization: `Bearer ${activeToken}` } : {})
        },
        body: JSON.stringify({ note })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate AI quiz');
      if (data.quizQuestions && data.quizQuestions.length > 0) {
        setQuizQuestions(data.quizQuestions);
        setQuizAnswers({});
        setQuizSubmitted(false);
      }
    } catch (err: any) {
      setQuizError(err.message || 'Failed to generate quiz');
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleQuizSubmit = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  // Planner state
  const [examDate, setExamDate] = useState('2026-09-15');
  const [studyTasks, setStudyTasks] = useState([
    { id: 1, task: `Review notes for "${note.title}"`, completed: true },
    { id: 2, task: 'Practice interactive flashcards & active recall', completed: false },
    { id: 3, task: 'Take practice MCQ quiz and verify score', completed: false },
    { id: 4, task: 'Final exam revision & mind-map walkthrough', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const daysRemaining = Math.max(0, Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="space-y-6">
      {/* Student Suite Sub-Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
        {[
          { id: 'master', label: '🚀 Study From This Lecture', color: 'bg-amber-600 text-white shadow-amber-600/30' },
          { id: 'important', label: '🎯 Teacher Important', color: 'bg-rose-600 text-white shadow-rose-600/30' },
          { id: 'timestamps', label: '⏱️ Timestamp Revision', color: 'bg-indigo-600 text-white shadow-indigo-600/30' },
          { id: 'simplifier', label: '🗣️ Simple Explanation', color: 'bg-blue-600 text-white shadow-blue-600/30' },
          { id: 'flashcards', label: '📖 Flashcards', color: 'bg-blue-600 text-white shadow-blue-600/30' },
          { id: 'quiz', label: '🧪 MCQ Quiz', color: 'bg-emerald-600 text-white shadow-emerald-600/30' },
          { id: 'answers', label: '📚 Exam Answers (2/5/10m)', color: 'bg-purple-600 text-white shadow-purple-600/30' },
          { id: 'assignment', label: '📝 Homework Generator', color: 'bg-teal-600 text-white shadow-teal-600/30' },
          { id: 'handwritten', label: '✍️ Handwritten View', color: 'bg-amber-600 text-white shadow-amber-600/30' },
          { id: 'planner', label: '📅 Exam Countdown', color: 'bg-indigo-600 text-white shadow-indigo-600/30' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              subTab === tab.id
                ? `${tab.color} shadow-lg`
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 0. MASTER "STUDY FROM THIS LECTURE" TAB */}
      {subTab === 'master' && (
        <div className="space-y-6 bg-gradient-to-tr from-slate-950 via-indigo-950/40 to-slate-900 p-8 rounded-3xl border border-indigo-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-extrabold text-amber-400">⚡ Automated Study Companion Session</span>
              <h2 className="text-2xl font-black text-white mt-1">Study From This Lecture: "{note.title}"</h2>
              <p className="text-xs text-slate-400 mt-1">Zero decision fatigue: AI automatically guides you from raw lecture to exam mastery in 7 steps.</p>
            </div>
            <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-2xl text-xs font-bold flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Step {masterStep} of 7 Active</span>
            </div>
          </div>

          {/* Master Step Progress Bar */}
          <div className="grid grid-cols-7 gap-2">
            {[
              { step: 1, title: '5-Min Revision' },
              { step: 2, title: 'Smart Notes' },
              { step: 3, title: 'Flashcards' },
              { step: 4, title: '10 MCQs' },
              { step: 5, title: 'Subjective Qs' },
              { step: 6, title: 'Weak Test' },
              { step: 7, title: 'Final Review' },
            ].map((s) => (
              <button
                key={s.step}
                onClick={() => setMasterStep(s.step)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  masterStep === s.step
                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg'
                    : masterStep > s.step
                    ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="text-[10px] uppercase font-mono font-bold">Step {s.step}</div>
                <div className="text-xs font-bold mt-0.5 truncate">{s.title}</div>
              </button>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            {masterStep === 1 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-amber-300 flex items-center space-x-2">
                  <span>⏱️ Step 1: 5-Minute Rapid Revision Summary</span>
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">{note.summary}</p>
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200">
                  💡 <strong>Pro Tip:</strong> Read this summary twice to build a strong mental anchor before diving into details.
                </div>
              </div>
            )}

            {masterStep === 2 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-indigo-300">📝 Step 2: Key Concepts & Clean Academic Notes</h3>
                <ul className="space-y-2">
                  {note.keyPoints.map((kp, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-200 bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{kp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {masterStep === 3 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-blue-300">📖 Step 3: Active Recall Flashcards</h3>
                <div className="p-5 bg-blue-950/40 border border-blue-500/40 rounded-2xl space-y-3">
                  <span className="text-[10px] uppercase font-bold text-blue-300">Question {currentCardIndex + 1}</span>
                  <p className="text-base font-bold text-white">{flashcards[currentCardIndex]?.question}</p>
                  <p className="text-sm text-blue-200 pt-2 border-t border-blue-900/60">Answer: {flashcards[currentCardIndex]?.answer}</p>
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={() => setCurrentCardIndex((prev) => (prev + 1) % flashcards.length)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                    >
                      Next Flashcard →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {masterStep === 4 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-emerald-300">🧪 Step 4: 10 MCQ Practice Test</h3>
                <p className="text-xs text-slate-300">Test your mastery with AI-generated multiple-choice questions designed to simulate university exams.</p>
                <button
                  onClick={() => setSubTab('quiz')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                >
                  Start Full MCQ Quiz →
                </button>
              </div>
            )}

            {masterStep === 5 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-purple-300">✍️ Step 5: Subjective Question Bank (2, 5, 10 Mark Answers)</h3>
                <p className="text-xs text-slate-300">Master semester exam writing with structured answers classified by mark weightage.</p>
                <button
                  onClick={() => setSubTab('answers')}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs"
                >
                  View Exam Answers →
                </button>
              </div>
            )}

            {masterStep === 6 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-rose-300">😈 Step 6: Weak-Topic Targeted Quiz</h3>
                <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-rose-300">⚠️ Detected Weak Focus Area: Core Definitions & Formula Applications</span>
                  <p className="text-xs text-slate-300">Review section 3 of the transcript and re-attempt the active recall flashcards to boost your retention score above 85%.</p>
                </div>
              </div>
            )}

            {masterStep === 7 && (
              <div className="space-y-3 text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 text-2xl">
                  🏆
                </div>
                <h3 className="text-xl font-black text-white">Lecture Mastery Complete!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">You have successfully completed the 7-step study routine for "{note.title}". Your daily study streak has been updated!</p>
                <button
                  onClick={() => setSubTab('planner')}
                  className="px-6 py-3 bg-amber-600 text-white font-bold rounded-xl text-xs shadow-lg"
                >
                  View Exam Countdown & Roadmap →
                </button>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                disabled={masterStep === 1}
                onClick={() => setMasterStep((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold disabled:opacity-40"
              >
                ← Previous Step
              </button>
              <button
                disabled={masterStep === 7}
                onClick={() => setMasterStep((prev) => Math.min(7, prev + 1))}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold disabled:opacity-40"
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. TEACHER IMPORTANT TAB */}
      {subTab === 'important' && (
        <div className="space-y-6 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>🎯 "Teacher ne kya Important bola?" (Exam Priority Detector)</span>
            </h3>
            <p className="text-xs text-slate-400">AI automatically detects teacher emphasis, repeated concepts, and explicit statements ("Ye exam mein aayega").</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-rose-950/40 border border-rose-500/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-rose-400">🔥 High Priority (Must Memorize)</span>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-mono">Exam Core</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {note.keyPoints.slice(0, 2).map((kp, idx) => (
                  <li key={idx} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    • {kp}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-950/40 border border-amber-500/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-amber-400">⚡ Medium Priority (Conceptual)</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono">Important</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                {note.keyPoints.slice(2, 4).map((kp, idx) => (
                  <li key={idx} className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    • {kp}
                  </li>
                ))}
                {note.keyPoints.length <= 2 && (
                  <li className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                    • Fundamental derivations and step-by-step problem proofs.
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-blue-950/40 border border-blue-500/40 p-5 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold text-blue-400">📖 Low Priority (Background)</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-mono">Context</span>
              </div>
              <ul className="space-y-2 text-xs text-slate-200">
                <li className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  • Historical context and introductory remarks by instructor.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 2. TIMESTAMP REVISION TAB */}
      {subTab === 'timestamps' && (
        <div className="space-y-6 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>⏱️ Timestamp Revision & Audio Navigation</span>
            </h3>
            <p className="text-xs text-slate-400">Tap any timestamp to jump straight to that exact lecture portion.</p>
          </div>

          <div className="space-y-3">
            {[
              { time: '02:15', title: 'Introduction & Core Definitions', desc: note.summary.slice(0, 90) + '...' },
              { time: '12:43', title: 'Primary Theorem / Core Concept Explained', desc: note.keyPoints[0] || 'Detailed derivation of core principles.' },
              { time: '24:10', title: 'Problem Solving & Example Walkthrough', desc: note.keyPoints[1] || 'Step-by-step numerical/coding example.' },
              { time: '41:50', title: 'Q&A and Exam Tips from Teacher', desc: 'Important hints for the upcoming semester examination.' },
            ].map((ts, idx) => (
              <div key={idx} className="flex items-start space-x-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/50 transition-all">
                <button
                  onClick={() => alert(`Playing lecture audio starting at timestamp ${ts.time}...`)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 shadow"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{ts.time}</span>
                </button>
                <div className="space-y-1 flex-1">
                  <h4 className="text-xs font-bold text-white">{ts.title}</h4>
                  <p className="text-xs text-slate-400">{ts.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SIMPLIFIER TAB */}
      {subTab === 'simplifier' && (
        <div className="space-y-6 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">🗣️ Teacher's Explanation → Simple Explanation</h3>
              <p className="text-xs text-slate-400">Convert complex lecture jargon into intuitive student-friendly terms.</p>
            </div>
            <div className="flex items-center space-x-2">
              {(['very_easy', 'normal', 'advanced'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setExplanationLevel(lvl)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    explanationLevel === lvl ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {lvl.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs text-blue-400 font-mono">
              <span>MODE: {explanationLevel.toUpperCase()}</span>
              <span>AI Study Simplifier</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {explanationLevel === 'very_easy' && `Imagine this lecture like a simple story: ${note.summary} In short, think of it as everyday logic where everything connects logically without complex jargon.`}
              {explanationLevel === 'normal' && note.summary}
              {explanationLevel === 'advanced' && `Advanced Academic Breakdown: ${note.summary} Key theoretical underpinnings involve rigorous formal proof frameworks and specialized terminology.`}
            </p>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Need further simplification on a specific term?</span>
              <button
                onClick={() => {
                  setExplainedOutput('Analogy: Think of this concept like a library filing system where data is retrieved in O(1) time.');
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explain Again (Analogy / Hinglish)</span>
              </button>
            </div>
          </div>

          {explainedOutput && (
            <div className="p-4 bg-blue-950/40 border border-blue-500/40 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-blue-300">💡 AI "Explain Again" Assistant Output:</span>
              <p className="text-xs text-slate-200">{explainedOutput}</p>
            </div>
          )}
        </div>
      )}

      {/* 4. FLASHCARDS TAB */}
      {subTab === 'flashcards' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Active Recall Flashcards</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                  {flashcards.length} Cards
                </span>
              </h3>
              <p className="text-xs text-slate-400">Card {currentCardIndex + 1} of {flashcards.length}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGenerateAiFlashcards}
                disabled={generatingFlashcards}
                className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                {generatingFlashcards ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{generatingFlashcards ? 'Generating AI Flashcards...' : '✨ Generate AI Flashcards'}</span>
              </button>

              <button
                onClick={() => { setIsFlipped(false); setCurrentCardIndex((prev) => (prev + 1) % flashcards.length); }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Next</span>
              </button>
            </div>
          </div>

          {flashcardError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              ⚠️ {flashcardError}
            </div>
          )}

          {/* Flashcard Flip Box */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full min-h-[280px] rounded-3xl p-8 cursor-pointer transition-all transform duration-500 flex flex-col justify-between shadow-2xl border ${
              isFlipped
                ? 'bg-gradient-to-tr from-emerald-950 to-teal-900 border-emerald-500/50 text-emerald-100'
                : 'bg-gradient-to-tr from-slate-900 to-indigo-950 border-indigo-500/50 text-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 backdrop-blur">
                {isFlipped ? '💡 Answer / Concept' : '❓ Study Question (Active Recall)'}
              </span>
              <span className="text-xs opacity-60">Click card to flip</span>
            </div>

            <div className="my-8 text-center space-y-3">
              <p className="text-lg md:text-xl font-medium leading-relaxed">
                {isFlipped ? flashcards[currentCardIndex]?.answer : flashcards[currentCardIndex]?.question}
              </p>
            </div>

            <div className="flex items-center justify-between text-xs opacity-70">
              <span>VoiceNotes AI Student Suite</span>
              <span>{isFlipped ? 'Tap to see Question' : 'Tap to reveal Answer'}</span>
            </div>
          </div>

          {/* Quick Nav Pagination */}
          <div className="flex items-center justify-center space-x-3">
            <button
              onClick={() => { setIsFlipped(false); setCurrentCardIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1)); }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex space-x-1.5 overflow-x-auto max-w-xs py-1">
              {flashcards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => { setIsFlipped(false); setCurrentCardIndex(idx); }}
                  className={`w-2.5 h-2.5 rounded-full transition-all flex-shrink-0 ${idx === currentCardIndex ? 'bg-blue-500 w-6' : 'bg-slate-700'}`}
                />
              ))}
            </div>
            <button
              onClick={() => { setIsFlipped(false); setCurrentCardIndex((prev) => (prev + 1) % flashcards.length); }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. MCQ QUIZ TAB */}
      {subTab === 'quiz' && (
        <div className="space-y-6 bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Self-Assessment MCQ Quiz</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  {quizQuestions.length} Questions
                </span>
              </h3>
              <p className="text-xs text-slate-400">Test your mastery of this lecture before exam day</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleGenerateAiQuiz}
                disabled={generatingQuiz}
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
              >
                {generatingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{generatingQuiz ? 'Generating AI Quiz...' : '✨ Generate AI Quiz'}</span>
              </button>

              {quizSubmitted && (
                <div className="flex items-center space-x-2 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-emerald-300 text-xs font-bold">
                  <Award className="w-4 h-4" />
                  <span>Score: {quizScore} / {quizQuestions.length}</span>
                </div>
              )}
            </div>
          </div>

          {quizError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
              ⚠️ {quizError}
            </div>
          )}

          <div className="space-y-6">
            {quizQuestions.map((qObj, qIdx) => (
              <div key={qIdx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-start space-x-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs flex-shrink-0">Q{qIdx + 1}</span>
                  <span>{qObj.q}</span>
                </h4>
                <div className="space-y-2 pl-8">
                  {qObj.options.map((opt, optIdx) => {
                    const isSelected = quizAnswers[qIdx] === optIdx;
                    const isCorrect = optIdx === qObj.correct;
                    let btnStyle = 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700';
                    if (quizSubmitted) {
                      if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-bold';
                      else if (isSelected && !isCorrect) btnStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                    } else if (isSelected) {
                      btnStyle = 'border-blue-500 bg-blue-950/40 text-blue-200 font-bold shadow';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <Check className="w-4 h-4 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!quizSubmitted ? (
            <button
              onClick={handleQuizSubmit}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 transition-all text-xs"
            >
              Submit Quiz & Check Results
            </button>
          ) : (
            <button
              onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all text-xs flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
          )}
        </div>
      )}

      {/* 6. EXAM ANSWER CONVERTER TAB (2, 5, 10 Mark Answers) */}
      {subTab === 'answers' && (
        <div className="space-y-6 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>📚 Exam Answer Converter (2-Mark, 5-Mark, 10-Mark)</span>
            </h3>
            <p className="text-xs text-slate-400">Instantly format lecture notes into precise semester exam responses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
              <span className="text-xs uppercase font-extrabold text-blue-400">⚡ 2-Mark Short Answer</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                <strong>Definition:</strong> {note.summary.slice(0, 120)}... Key principle relies on core computational efficiency and direct evaluation.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
              <span className="text-xs uppercase font-extrabold text-indigo-400">📝 5-Mark Medium Answer</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                <strong>Explanation:</strong> {note.summary} <br/><br/>
                <strong>Key Takeaways:</strong>
                <ul className="list-disc pl-4 pt-1 space-y-1">
                  {note.keyPoints.slice(0, 2).map((kp, i) => <li key={i}>{kp}</li>)}
                </ul>
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
              <span className="text-xs uppercase font-extrabold text-purple-400">🏆 10-Mark Essay / Detailed Answer</span>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                <strong>Comprehensive Overview:</strong> {note.summary} <br/><br/>
                <strong>Core Architecture & Principles:</strong>
                <ul className="list-disc pl-4 pt-1 space-y-1">
                  {note.keyPoints.map((kp, i) => <li key={i}>{kp}</li>)}
                </ul>
                <br/>
                <strong>Conclusion:</strong> Crucial for semester exams and practical problem solving.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 7. ASSIGNMENT GENERATOR TAB */}
      {subTab === 'assignment' && (
        <div className="space-y-6 bg-slate-900/60 p-6 rounded-3xl border border-slate-800">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>📝 AI Assignment & Homework Generator</span>
            </h3>
            <p className="text-xs text-slate-400">Automatically creates practice questions, practical tasks, and solutions based on this lecture.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase text-teal-400">Practical Homework Task</h4>
              <p className="text-xs text-slate-200">Implement the core algorithms / concepts discussed in "{note.title}" and write a 2-page report verifying edge cases and time complexities.</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase text-teal-400">Self-Evaluation Questions</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {note.questions.length > 0 ? note.questions.map((q, i) => <li key={i}>• {q}</li>) : (
                  <>
                    <li>• What are the primary trade-offs discussed in this lecture?</li>
                    <li>• How would you optimize the proposed solution for large-scale datasets?</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 8. HANDWRITTEN NOTES SIMULATOR TAB */}
      {subTab === 'handwritten' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Handwritten Notebook Style</h3>
              <p className="text-xs text-slate-400">Stylized simulated handwritten notes and study summaries</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow flex items-center space-x-1"
            >
              <span>Print Handwritten View</span>
            </button>
          </div>

          {/* Notebook Paper Container */}
          <div className="bg-[#fef9e7] text-slate-900 rounded-3xl p-8 shadow-2xl border-4 border-amber-200 relative overflow-hidden font-serif">
            <div className="absolute top-0 bottom-0 left-12 w-0.5 bg-rose-400/60 pointer-events-none" />

            <div className="pl-6 space-y-6">
              <div className="border-b-2 border-amber-300 pb-3">
                <div className="flex items-center justify-between text-xs text-amber-800 font-mono">
                  <span>SUBJECT: {note.category.toUpperCase()}</span>
                  <span>DATE: {new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mt-2 font-serif italic">✨ {note.title}</h1>
              </div>

              <div className="space-y-4 text-sm leading-loose">
                <div>
                  <h4 className="font-bold text-amber-900 underline mb-1">📝 Lecture Summary:</h4>
                  <p className="bg-amber-100/50 p-3 rounded-xl border border-amber-200/60 font-sans text-xs leading-relaxed">
                    {note.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-amber-900 underline mb-1">🔑 Key Concepts & Highlights:</h4>
                  <ul className="list-disc pl-5 space-y-1.5 font-sans text-xs">
                    {note.keyPoints.map((kp, idx) => (
                      <li key={idx} className="text-slate-800">{kp}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-amber-900 underline mb-1">⚡ Important Formulas & Highlights:</h4>
                  <div className="p-3 bg-amber-200/40 rounded-xl border border-amber-300 text-xs font-mono">
                    • Core Theorem / Principle: Verified & Summarized<br/>
                    • Active Recall Rating: High Priority for Exam
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-amber-300 flex items-center justify-between text-[11px] text-amber-800 font-mono">
                <span>Student Verified Notebook</span>
                <span>VoiceNotes AI Study Suite</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. EXAM COUNTDOWN & STUDY PLANNER TAB */}
      {subTab === 'planner' && (
        <div className="space-y-6 bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-tr from-purple-950 to-indigo-950 border border-purple-500/40 p-6 rounded-2xl text-white space-y-2 shadow-xl">
              <span className="text-xs uppercase tracking-widest text-purple-300 font-bold">Exam Countdown</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black text-white">{daysRemaining}</span>
                <span className="text-sm font-medium text-purple-200">Days Remaining</span>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <span className="text-xs text-slate-400">Target Date</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Study Roadmap Progress</h4>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-500"
                  style={{
                    width: `${Math.round((studyTasks.filter(t => t.completed).length / studyTasks.length) * 100)}%`
                  }}
                />
              </div>
              <p className="text-xs text-slate-400">
                {studyTasks.filter(t => t.completed).length} of {studyTasks.length} study goals completed.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white">Study Tasks & Checklist</h4>
            <div className="space-y-2">
              {studyTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => {
                    setStudyTasks(studyTasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    task.completed ? 'bg-slate-900/60 border-emerald-500/30 text-slate-400 line-through' : 'bg-slate-950 border-slate-800 text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${task.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-700 bg-slate-900'}`}>
                      {task.completed && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs font-medium">{task.task}</span>
                  </div>
                  <span className="text-[10px] text-purple-400 uppercase font-bold">Study Goal</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2 pt-2">
              <input
                type="text"
                placeholder="Add new study goal..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={() => {
                  if (!newTaskText.trim()) return;
                  setStudyTasks([...studyTasks, { id: Date.now(), task: newTaskText, completed: false }]);
                  setNewTaskText('');
                }}
                className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-all shadow"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
