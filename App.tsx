import React, { useState, useEffect } from 'react';
import { SmartNote, ActiveTab, UserProfile } from './types';
import { AuthView } from './components/AuthView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdminLoginPage } from './components/AdminLoginPage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { NotesListView } from './components/NotesListView';
import { RecordAudioView } from './components/RecordAudioView';
import { UploadAudioView } from './components/UploadAudioView';
import { NoteDetailModal } from './components/NoteDetailModal';
import { DocumentationView } from './components/DocumentationView';
import { PreSaleView } from './components/PreSaleView';
import { VoiceCommandAssistant } from './components/VoiceCommandAssistant';
import { CategorySelectModal } from './components/CategorySelectModal';
import { StudyPlanner } from './components/StudyPlanner';
import { CoachingPortalView } from './components/CoachingPortalView';
import { SubscriptionManagement } from './components/SubscriptionManagement';
import { Sparkles } from 'lucide-react';
import { safeFetchJson } from './lib/utils';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('voicenotes_ai_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('voicenotes_ai_token');
    if (savedToken) return savedToken;
    return null;
  });

  const [notes, setNotes] = useState<SmartNote[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab | 'admin'>('dashboard');
  const [selectedNote, setSelectedNote] = useState<SmartNote | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, setLoadingNotes] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch notes from server when authenticated
  useEffect(() => {
    if (token && currentUser) {
      setLoadingNotes(true);
      fetch('/api/notes', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(async res => {
          if (res.status === 401) {
            localStorage.removeItem('voicenotes_ai_user');
            localStorage.removeItem('voicenotes_ai_token');
            setCurrentUser(null);
            setToken(null);
            setShowAuthModal(true);
            showToast('Session expired. Please sign in again.');
            return [];
          }
          return safeFetchJson(res);
        })
        .then(data => {
          if (Array.isArray(data)) {
            setNotes(data);
          }
        })
        .catch(err => {
          console.error("Failed to fetch notes:", err);
          showToast(`Error: ${err.message || 'Failed to fetch notes'}`);
        })
        .finally(() => setLoadingNotes(false));
    }
  }, [token, currentUser]);

  const handleLoginSuccess = (user: UserProfile, authToken: string) => {
    setCurrentUser(user);
    setToken(authToken);
    localStorage.setItem('voicenotes_ai_user', JSON.stringify(user));
    localStorage.setItem('voicenotes_ai_token', authToken);
    showToast(`Welcome back, ${user.name}!`);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('voicenotes_ai_user');
    localStorage.removeItem('voicenotes_ai_token');
    showToast('Signed out successfully.');
  };

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

  const handleDeleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setNotes(prev => prev.filter(n => n.id !== id));
        if (selectedNote?.id === id) {
          setSelectedNote(null);
        }
        showToast('Note deleted successfully.');
      }
    } catch (e) {
      showToast('Failed to delete note.');
    }
  };

  // If not authenticated, show PreSaleView landing page or AuthView modal
  if (!currentUser || !token) {
    if (showAuthModal) {
      return (
        <div className="relative">
          <AuthView onLoginSuccess={handleLoginSuccess} />
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute top-4 right-4 z-50 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold border border-slate-700 shadow-xl"
          >
            ✕ Back to Landing Page
          </button>
        </div>
      );
    }
    return (
      <PreSaleView
        setActiveTab={(tab) => {
          if (tab === 'presale') {
            // stay
          } else {
            setShowAuthModal(true);
          }
        }}
        showToast={showToast}
        currentUser={currentUser}
        onOpenAuth={() => setShowAuthModal(true)}
      />
    );
  }

  // If user has logged in/registered but not selected their role/category yet
  if (!currentUser.userCategory) {
    return (
      <CategorySelectModal
        user={currentUser}
        token={token}
        onCategorySelected={(updated) => {
          setCurrentUser(updated);
          localStorage.setItem('voicenotes_ai_user', JSON.stringify(updated));
          showToast(`Welcome! Workflow tailored for ${updated.userCategory}.`);
        }}
      />
    );
  }



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
        activeTab={activeTab as ActiveTab}
        setActiveTab={setActiveTab}
        notesCount={notes.length}
        totalMinutes={totalMinutes}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {activeTab === 'presale' && (
          <PreSaleView
            setActiveTab={setActiveTab}
            showToast={showToast}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            notes={notes}
            setActiveTab={setActiveTab}
            onSelectNote={(note) => setSelectedNote(note)}
            currentUser={currentUser}
            onUpdateNote={handleUpdateNote}
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
            token={token}
          />
        )}

        {activeTab === 'upload' && (
          <UploadAudioView
            onNoteCreated={handleNoteCreated}
            token={token}
          />
        )}

        {activeTab === ('coaching' as any) && (
          <CoachingPortalView
            currentUser={currentUser}
            notes={notes}
            onSelectNote={(note) => setSelectedNote(note)}
          />
        )}

        {activeTab === ('subscription' as any) && (
          <SubscriptionManagement
            currentUser={currentUser}
            notes={notes}
            onUpdatePlan={(newPlan) => {
              setCurrentUser(prev => prev ? { ...prev, plan: newPlan } : prev);
            }}
          />
        )}

        {activeTab === 'admin_login' && (
          <AdminLoginPage
            onAdminLoginSuccess={(user, tok) => {
              setCurrentUser(user);
              setToken(tok);
              localStorage.setItem('voicenotes_ai_user', JSON.stringify(user));
              localStorage.setItem('voicenotes_ai_token', tok);
              setActiveTab('admin');
            }}
            onBackToHome={() => setActiveTab('presale')}
            showToast={showToast}
          />
        )}

        {activeTab === 'admin' && (
          currentUser && currentUser.email === 'hy399035@gmail.com' ? (
            <AdminDashboardView
              currentUser={currentUser}
              token={token || ''}
              onExitAdmin={() => setActiveTab('dashboard')}
            />
          ) : (
            <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold">
                🔒
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Restricted Admin Access</h2>
                <p className="text-sm text-slate-400">
                  Only administrator <code className="text-indigo-400">hy399035@gmail.com</code> with password <code className="text-indigo-400">hm harshit@9034</code> can access the Admin Dashboard.
                </p>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setShowAuthModal(true);
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg"
              >
                Sign In as Admin
              </button>
            </div>
          )
        )}

        {activeTab === 'study_planner' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6 space-y-1">
              <h1 className="text-2xl font-extrabold text-white">Interactive Study Planner & Exam Tracker</h1>
              <p className="text-sm text-slate-400">Schedule review sessions for your lecture notes, set target exam dates, and track completion progress.</p>
            </div>
            <StudyPlanner notes={notes} />
          </div>
        )}
      </main>

      {/* Note Detail Modal */}
      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          token={token}
          onClose={() => setSelectedNote(null)}
          onUpdate={handleUpdateNote}
          onDelete={handleDeleteNote}
          showToast={showToast}
        />
      )}

      {/* Hands-Free Voice Command Assistant */}
      <VoiceCommandAssistant
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        showToast={showToast}
      />
    </div>
  );
}
