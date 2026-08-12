import React, { useState } from 'react';
import { SmartNote, NoteCategory, ActiveTab } from '../types';
import { Search, Filter, Mic, Upload, Plus, Trash2, Clock, CheckCircle2, Calendar, FileText, ArrowUpDown, Sparkles } from 'lucide-react';

interface NotesListViewProps {
  notes: SmartNote[];
  onSelectNote: (note: SmartNote) => void;
  onDeleteNote: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const NotesListView: React.FC<NotesListViewProps> = ({
  notes,
  onSelectNote,
  onDeleteNote,
  setActiveTab,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Extract all unique tags
  const allTags = Array.from(new Set(notes.flatMap(n => n.tags || [])));

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.transcript.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.keyPoints && note.keyPoints.some(kp => kp.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesTag = selectedTag === 'All' || (note.tags && note.tags.includes(selectedTag));

    return matchesSearch && matchesCategory && matchesTag;
  });

  // Sort notes
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center space-x-3">
            <span>Smart Notes Library</span>
            <span className="px-3 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 text-sm font-semibold">
              {notes.length} total
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Search, filter, and inspect your AI-transcribed voice notes instantly.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('record')}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Mic className="w-4 h-4 text-rose-300 animate-pulse" />
            <span>Record Voice</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-700 transition-all"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload Audio</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -transform -translate-y-1/2 w-4 h-4 text-slate-400" style={{ transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search across all notes, transcripts, key points & action items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 w-full md:w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs font-medium text-slate-400 mr-2 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {['All', 'Work', 'Personal', 'Study', 'Tech', 'Podcast', 'Finance', 'Student', 'Entrepreneur', 'Professional', 'Content Creator', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/60">
            <span className="text-xs font-medium text-slate-500 mr-2">Tags:</span>
            <button
              onClick={() => setSelectedTag('All')}
              className={`px-2.5 py-1 rounded-md text-[11px] ${
                selectedTag === 'All' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'bg-slate-950 text-slate-400 border border-slate-800'
              }`}
            >
              All Tags
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  selectedTag === tag
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-3xl space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-500">
            <FileText className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">No notes found</h3>
            <p className="text-sm text-slate-400">
              {searchTerm ? 'Try adjusting your search query or filters.' : 'Record your first voice note or upload an audio file to get started.'}
            </p>
          </div>
          <div className="pt-2 flex justify-center space-x-3">
            <button
              onClick={() => setActiveTab('record')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
            >
              Record Voice Now
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNotes.map((note) => {
            const completedCount = (note.actionItems || []).filter(a => a.completed).length;
            const totalActions = (note.actionItems || []).length;

            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className="group bg-slate-900/70 hover:bg-slate-900 border border-slate-800/80 hover:border-indigo-500/60 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-xl flex flex-col justify-between space-y-5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none" />

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 text-xs font-medium">
                        {note.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium">
                        {note.language || 'English'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete "${note.title}"?`)) {
                          onDeleteNote(note.id);
                        }
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  <p className="text-sm text-slate-300 line-clamp-3">
                    {note.summary}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/80 relative z-10">
                  <div className="flex flex-wrap gap-1.5">
                    {(note.tags || []).slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 text-xs border border-slate-800">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{Math.round((note.audioDurationSeconds || 0) / 60)} min audio</span>
                    </div>
                    {totalActions > 0 && (
                      <div className="flex items-center space-x-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{completedCount}/{totalActions} tasks</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
