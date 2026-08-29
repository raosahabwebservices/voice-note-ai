import React, { useState } from 'react';
import { UserProfile, SmartNote } from '../types';
import { Zap, ShieldCheck, Crown, ArrowRight, CheckCircle2, AlertCircle, Calendar, CreditCard, Sparkles, Building2 } from 'lucide-react';

interface SubscriptionManagementProps {
  currentUser: UserProfile;
  notes: SmartNote[];
  onUpdatePlan: (newPlan: 'Free' | 'Basic' | 'Pro' | 'Enterprise') => void;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({
  currentUser,
  notes,
  onUpdatePlan,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'student' | 'enterprise'>('student');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [targetPlan, setTargetPlan] = useState<string>('Pro');

  // Compute usage
  const totalSeconds = notes.reduce((acc, note) => acc + (note.audioDurationSeconds || 0), 0);
  const totalMinutesUsed = Math.round(totalSeconds / 60);

  const studentLimit = currentUser.plan === 'Pro' ? 1000 : 300;
  const usagePercentage = Math.min(100, Math.round((totalMinutesUsed / studentLimit) * 100));

  const handleUpgradeClick = (planName: string) => {
    setTargetPlan(planName);
    setIsUpgradeModalOpen(true);
  };

  const confirmUpgrade = () => {
    if (targetPlan.includes('Free') || targetPlan.includes('₹0')) {
      onUpdatePlan('Free');
    } else if (targetPlan.includes('Pro') || targetPlan.includes('₹199')) {
      onUpdatePlan('Pro');
    } else if (targetPlan.includes('Enterprise') || targetPlan.includes('₹4,999') || targetPlan.includes('₹9,999') || targetPlan.includes('₹19,999')) {
      onUpdatePlan('Enterprise');
    } else {
      onUpdatePlan('Basic');
    }
    setIsUpgradeModalOpen(false);
    alert(`Successfully updated plan to ${targetPlan}!`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn text-slate-900 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 text-white shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full bg-white/20 text-cyan-200 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            💳 Subscription & Usage Billing
          </span>
          <span className="text-xs text-indigo-100">VoiceNotes AI Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Manage Your Subscription & Plan</h1>
        <p className="text-indigo-100 text-sm sm:text-base max-w-2xl">
          View your current plan limits, audio minute usage, renewal dates, and upgrade options for students and coaching institutes.
        </p>
      </div>

      {/* Current Plan Status Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 text-2xl font-black">
              {currentUser.plan === 'Enterprise' ? '🏫' : currentUser.plan === 'Pro' ? '🚀' : '🎓'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                  Current Plan: {currentUser.plan}
                </span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                {currentUser.plan === 'Enterprise' ? 'Enterprise Coaching Growth Plan (₹9,999/mo)' : currentUser.plan === 'Pro' ? 'Pro Exam Preparation Plan (₹199/mo)' : 'Basic Student Plan (₹99/mo)'}
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleUpgradeClick(currentUser.plan === 'Pro' ? 'Enterprise Coaching (₹4,999/mo)' : 'PRO Plan (₹199/mo)')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
            >
              ⚡ Upgrade Plan
            </button>
          </div>
        </div>

        {/* Usage & Limits */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Audio Transcription Minutes Usage</h3>
              <p className="text-xs text-slate-500">Resets on the 1st of every month</p>
            </div>
            <span className="text-sm font-bold text-slate-900">
              {totalMinutesUsed} / {studentLimit} minutes ({usagePercentage}%)
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercentage > 85 ? 'bg-rose-500' : 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, usagePercentage)}%` }}
            ></div>
          </div>

          {usagePercentage >= 80 && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3 text-amber-800 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Approaching limit!</strong> You have used {totalMinutesUsed} of your {studentLimit} audio minutes. Upgrade to Pro for 1,000 minutes/month.
              </div>
            </div>
          )}
        </div>

        {/* Renewal & Billing Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium">Renewal Date</span>
            <p className="font-bold text-slate-900 text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-1 text-blue-600" /> Sept 28, 2026
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium">Billing Cycle</span>
            <p className="font-bold text-slate-900 text-sm flex items-center">
              <CreditCard className="w-4 h-4 mr-1 text-emerald-600" /> Monthly Auto-Debit
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 font-medium">Account Segment</span>
            <p className="font-bold text-slate-900 text-sm">
              {currentUser.plan === 'Enterprise' ? '🏫 B2B Coaching Institute' : '🎓 Individual Student'}
            </p>
          </div>
        </div>
      </div>

      {/* Available Plans Selection */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Available Upgrade Plans</h2>
            <p className="text-xs text-slate-500">Choose between student individual plans and coaching enterprise packages</p>
          </div>
          <div className="flex items-center bg-slate-200 p-1 rounded-xl">
            <button
              onClick={() => setSelectedCategory('student')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              🎓 Student Plans (B2C)
            </button>
            <button
              onClick={() => setSelectedCategory('enterprise')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === 'enterprise' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
              }`}
            >
              🏫 Coaching Enterprise (B2B)
            </button>
          </div>
        </div>

        {selectedCategory === 'student' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase">
                  Free Plan
                </span>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">₹0 <span className="text-xs font-medium text-slate-500">/ forever</span></h3>
                  <p className="text-xs text-slate-600 mt-1">For getting started with AI lecture notes.</p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" /> 60 audio minutes/month</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" /> Basic AI summaries & notes</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" /> 30s AI processing speed</li>
                </ul>
              </div>
              <button
                onClick={() => handleUpgradeClick('Free Plan (₹0/mo)')}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-all"
              >
                Select Free Plan
              </button>
            </div>

            {/* Basic Plan */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                  Basic Student
                </span>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">₹99 <span className="text-xs font-medium text-slate-500">/ month</span></h3>
                  <p className="text-xs text-slate-600 mt-1">For casual / individual students.</p>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" /> 300 audio minutes/month</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" /> AI transcription & smart notes</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" /> Key points & flashcards</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-emerald-600 mr-2" /> Subject & chapter organization</li>
                </ul>
              </div>
              <button
                onClick={() => handleUpgradeClick('Basic (₹99/mo)')}
                className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-all"
              >
                Select Basic Plan
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-400 text-slate-900 text-[10px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                ⭐ Most Popular
              </div>
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full bg-white/20 text-cyan-200 text-xs font-bold uppercase">
                  Pro Exam Edition
                </span>
                <div>
                  <h3 className="text-2xl font-black text-white">₹199 <span className="text-xs font-medium text-indigo-200">/ month</span></h3>
                  <p className="text-xs text-indigo-100 mt-1">For serious students preparing for exams.</p>
                </div>
                <ul className="space-y-2.5 text-xs text-indigo-100">
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-cyan-300 mr-2" /> 1,000 audio minutes/month</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-cyan-300 mr-2" /> Ask My Lecture & AI Tutor</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-cyan-300 mr-2" /> Automatic MCQ & test generation</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-cyan-300 mr-2" /> Weak-topic detection & memory score</li>
                  <li className="flex items-center"><CheckCircle2 className="w-4 h-4 text-cyan-300 mr-2" /> AI revision planner & exam mode</li>
                </ul>
              </div>
              <button
                onClick={() => handleUpgradeClick('PRO (₹199/mo)')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
              >
                Upgrade to PRO — ₹199/mo
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">Starter Enterprise</span>
                <h3 className="text-xl font-bold text-slate-900">₹4,999 <span className="text-xs text-slate-500">/mo</span></h3>
                <p className="text-xs text-slate-600">Up to 100 students. Coaching-branded portal, student/teacher/admin accounts.</p>
              </div>
              <button
                onClick={() => handleUpgradeClick('Enterprise Starter (₹4,999/mo)')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Select Starter
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between border-blue-400">
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">Growth Enterprise</span>
                <h3 className="text-xl font-bold text-slate-900">₹9,999 <span className="text-xs text-slate-500">/mo</span></h3>
                <p className="text-xs text-slate-600">Up to 300 students. Advanced analytics, batch management & homework tracking.</p>
              </div>
              <button
                onClick={() => handleUpgradeClick('Enterprise Growth (₹9,999/mo)')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Select Growth
              </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">Institute Plan</span>
                <h3 className="text-xl font-bold text-slate-900">₹19,999 <span className="text-xs text-slate-500">/mo</span></h3>
                <p className="text-xs text-slate-600">Up to 1,000 students. Dedicated infrastructure, custom AI usage limits & white-label.</p>
              </div>
              <button
                onClick={() => handleUpgradeClick('Enterprise Institute (₹19,999/mo)')}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Select Institute
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto text-xl font-bold">
                ⚡
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Confirm Plan Upgrade</h3>
              <p className="text-xs text-slate-500">
                You are upgrading to <strong className="text-slate-900">{targetPlan}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Plan:</span>
                <span className="font-bold text-slate-900">{targetPlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billing Cycle:</span>
                <span className="font-bold text-slate-900">Monthly</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900">Total Due Today:</span>
                <span className="font-bold text-blue-600">Instant Activation</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsUpgradeModalOpen(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpgrade}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                Confirm & Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
