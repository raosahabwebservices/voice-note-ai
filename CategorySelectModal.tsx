import React, { useState } from 'react';
import { UserProfile } from '../types';
import { GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

interface CategorySelectModalProps {
  user: UserProfile;
  token: string;
  onCategorySelected: (updatedUser: UserProfile) => void;
}

const CATEGORY = {
  id: 'Student' as const,
  title: 'Student',
  desc: 'Summarize lectures, organize study materials, revision notes & exam prep',
  icon: GraduationCap,
  gradient: 'from-blue-500 to-indigo-600',
  badgeBg: 'bg-blue-50 text-blue-700 border-blue-200'
};

export const CategorySelectModal: React.FC<CategorySelectModalProps> = ({
  user,
  token,
  onCategorySelected,
}) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/auth/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ category: 'Student' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update category');

      onCategorySelected(data.user);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to save category');
      setLoading(false);
    }
  };

  const Icon = CATEGORY.icon;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto text-white shadow-lg">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome, {user.name}!</h2>
          <p className="text-slate-600 text-sm">
            VoiceNotes AI is customized exclusively for students to summarize lectures, organize study materials, and ace your exams.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="p-5 rounded-2xl border-2 border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-600/20 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${CATEGORY.gradient} flex items-center justify-center text-white shadow-sm`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">{CATEGORY.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{CATEGORY.desc}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <span>{loading ? 'Setting up Student Workspace...' : 'Continue as Student'}</span>
        </button>
      </div>
    </div>
  );
};
