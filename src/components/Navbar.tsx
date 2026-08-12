import React from 'react';
import { Mic, Upload, FileText, LayoutDashboard, BookOpen, Sparkles, Zap } from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  notesCount: number;
  totalMinutes: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  notesCount,
  totalMinutes,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('presale')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                VoiceNotes AI
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-full animate-pulse">
                ⚡ PRE-SALE
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Smart Audio-to-Insights Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('presale')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'presale'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md shadow-rose-600/25'
                : 'text-amber-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-4 h-4 text-yellow-300 animate-bounce" />
            <span>⚡ Pre-Sale Deal</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'notes'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Notes</span>
            <span className="ml-1 px-1.5 py-0.5 text-xs bg-slate-800 text-slate-300 rounded-full">
              {notesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('record')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'record'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Mic className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>Record Voice</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Audio</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('documentation')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'documentation'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>PRD & Docs</span>
          </button>
        </nav>

        {/* Quick Action Pill */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('presale')}
            className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-rose-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 text-yellow-200 fill-yellow-200" />
            <span>₹1,999 Lifetime Deal</span>
          </button>
        </div>
      </div>

      {/* Mobile Subheader Navigation */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-800/60 bg-slate-950 space-x-2">
        <button
          onClick={() => setActiveTab('presale')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap flex items-center space-x-1 ${
            activeTab === 'presale' ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white' : 'bg-slate-900 text-amber-400'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>⚡ Pre-Sale Deal</span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
            activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
          }`}
        >
          Notes ({notesCount})
        </button>
        <button
          onClick={() => setActiveTab('record')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
            activeTab === 'record' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
          }`}
        >
          Record
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
            activeTab === 'upload' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
          }`}
        >
          Upload
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('documentation')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
            activeTab === 'documentation' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
          }`}
        >
          PRD
        </button>
      </div>
    </header>
  );
};
