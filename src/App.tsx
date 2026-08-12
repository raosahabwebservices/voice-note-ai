import React, { useState, useEffect } from 'react';
import { SmartNote, ActiveTab } from './types';
import { INITIAL_SAMPLE_NOTES } from './data/sampleNotes';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { NotesListView } from './components/NotesListView';
import { RecordAudioView } from './components/RecordAudioView';
import { UploadAudioView } from './components/UploadAudioView';
import { NoteDetailModal } from './components/NoteDetailModal';
import { DocumentationView } from './components/DocumentationView';
import { PreSaleView } from './components/PreSaleView';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState<SmartNote[]>(() => {
    try {
      const saved = localStorage.getItem('voicenotes_ai_notes');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load notes from localStorage:', e);
    }
    return INITIAL_SAMPLE_NOTES;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('presale');
  const [selectedNote, setSelectedNote] = useState<SmartNote | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('voicenotes_ai_notes', JSON.stringify(notes));
    } catch (e) {
      console.error('Failed to save notes to localStorage:', e);
    }
  }, [notes]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNoteCreated = (newNote: SmartNote) => {
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
    setActiveTab('notes');
    showToast('Smart note generated successfully with AI!');
  };

  const handleUpdateNote = (updatedNote: SmartNote) => {
    setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n));
    setSelectedNote(updatedNote);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
    showToast('Note deleted successfully.');
  };

  const totalSeconds = notes.reduce((acc, note) => acc + (note.audioDurationSeconds || 0), 0);
  const totalMinutes = totalSeconds / 60;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notesCount={notes.length}
        totalMinutes={totalMinutes}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'presale' && (
          <PreSaleView
            setActiveTab={setActiveTab}
            showToast={showToast}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            notes={notes}
            setActiveTab={setActiveTab}
            onSelectNote={(note) => setSelectedNote(note)}
          />
        )}

        {activeTab === 'notes' && (
          <NotesListView
            notes={notes}
            onSelectNote={(note) => setSelectedNote(note)}
            onDeleteNote={handleDeleteNote}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'record' && (
          <RecordAudioView
            onNoteCreated={handleNoteCreated}
            onBack={() => setActiveTab('notes')}
          />
        )}

        {activeTab === 'upload' && (
          <UploadAudioView
            onNoteCreated={handleNoteCreated}
            onBack={() => setActiveTab('notes')}
          />
        )}

        {activeTab === 'documentation' && (
          <DocumentationView />
        )}
      </main>

      {/* Note Detail Modal */}
      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400">VoiceNotes AI</span>
            <span>— AI-powered audio intelligence for students, founders & professionals.</span>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveTab('documentation')} className="hover:text-indigo-400 transition-colors">
              PRD & Architecture
            </button>
            <button onClick={() => setActiveTab('record')} className="hover:text-indigo-400 transition-colors">
              Record Voice
            </button>
            <button onClick={() => setActiveTab('upload')} className="hover:text-indigo-400 transition-colors">
              Upload Audio
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
