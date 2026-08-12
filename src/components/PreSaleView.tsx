import React, { useState } from 'react';
import { 
  Zap, Mic, Brain, Target, Tag, ShieldCheck, CheckCircle2, 
  ArrowRight, QrCode, MessageSquare, Copy, Check, Sparkles, 
  Clock, TrendingUp, Send, FileText, Lock, Smartphone, HelpCircle, User
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';
import { QRCodeSVG } from 'qrcode.react';

interface PreSaleViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  showToast: (msg: string) => void;
  currentUser: UserProfile | null;
}

export const PreSaleView: React.FC<PreSaleViewProps> = ({ setActiveTab, showToast, currentUser }) => {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    whatsapp: currentUser?.phone || '',
    utrNumber: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const spotsClaimed = 5; // Urgency counter: 5 claimed, 95 spots remaining
  const totalSpots = 100;
  const percentage = (spotsClaimed / totalSpots) * 100;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText('raos38908@okhdfcbank');
    setCopied(true);
    showToast('UPI ID copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.utrNumber) {
      showToast('Please enter your email and UTR / Transaction ID.');
      return;
    }
    setSubmitted(true);
    showToast('Payment submission received! Activation in progress...');
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-900 border-b border-indigo-500/30 py-2.5 px-4 text-center text-xs sm:text-sm font-medium text-indigo-200 flex items-center justify-center space-x-2">
        <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
        <span>LIMITED PRE-SALE DEAL: First 100 Early Adopters Get Lifetime Access for ₹1,999 instead of ₹9,999/year!</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {currentUser && (
          <div className="bg-indigo-950/80 border border-indigo-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center">
                {currentUser.fullName.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-indigo-300">Signed in as <strong className="text-white">{currentUser.email}</strong></p>
                <p className="text-xs text-slate-300">
                  Status: {currentUser.isPremium ? <span className="text-emerald-400 font-bold">⚡ Premium Lifetime Active</span> : <span className="text-amber-400 font-bold">🔒 Payment Pending (₹1,999)</span>}
                </p>
              </div>
            </div>
            {currentUser.isPremium ? (
              <button
                onClick={() => setActiveTab('notes')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
              >
                Go to My Voice Notes →
              </button>
            ) : (
              <a
                href="#pricing-section"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg"
              >
                Pay ₹1,999 & Submit UTR ↓
              </a>
            )}
          </div>
        )}

        {/* HERO SECTION */}
        <div className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/10">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span>LIMITED PRE-SALE DEAL (FIRST 100 USERS ONLY)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Turn Messy Voice Rambles into{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Structured Actionable Notes
            </span>{' '}
            in Seconds.
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop typing long thoughts. Speak in Hinglish, English, or Hindi — VoiceNotes AI automatically transcribes, cleans filler words, and generates instant summaries, tasks, and key insights.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#pricing-section"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-lg shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all text-center flex items-center justify-center space-x-3"
            >
              <span>Claim Lifetime Access • ₹1,999</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-base transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Explore Live App Demo</span>
            </button>
          </div>
        </div>

        {/* LIVE URGENCY & COUNTER WIDGET */}
        <div className="bg-gradient-to-br from-slate-900/90 to-slate-900/60 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">LIVE PRE-SALE STATUS</h2>
            </div>
            
            <div className="bg-indigo-950/60 border border-indigo-500/30 px-4 py-2 rounded-2xl flex items-center space-x-2">
              <span className="text-2xl font-black text-indigo-400">{spotsClaimed}</span>
              <span className="text-slate-400 font-medium">/ {totalSpots} Spots Claimed</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="w-full bg-slate-950 rounded-full h-4 p-0.5 border border-slate-800 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span>0 claimed</span>
              <span className="text-indigo-400 font-bold">{totalSpots - spotsClaimed} spots remaining</span>
              <span>100 sold</span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start space-x-3 text-slate-300 text-sm">
            <Zap className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">⚡ First 100 early adopters get Lifetime Access for ₹1,999.</strong> Price jumps to ₹9,999/year after all 100 seats fill up. No recurring monthly bills ever.
            </p>
          </div>
        </div>

        {/* WHAT YOU GET — FEATURES */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">What You Get — Powerful AI Features</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
              Designed specifically for fast-moving founders, students, creators, and professionals who think out loud.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 rounded-3xl p-6 transition-all duration-300 space-y-4 hover:shadow-xl hover:shadow-indigo-500/10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">🎙️ 1-Tap Instant Audio Recording & Upload</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Record live meetings, lectures, or random thoughts directly in your browser, or upload existing audio files in any format (MP3, WAV, M4A).
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 rounded-3xl p-6 transition-all duration-300 space-y-4 hover:shadow-xl hover:shadow-indigo-500/10">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">🧠 Hinglish & Local Accent First</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Understands mixed Hindi-English speech, Indian terminology, slang, names, and regional context perfectly without breaking a sweat.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 rounded-3xl p-6 transition-all duration-300 space-y-4 hover:shadow-xl hover:shadow-indigo-500/10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">🎯 Auto Action-Items</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Extracts tasks, follow-ups, and action items directly into clean checklist formats so nothing ever slips through the cracks.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 rounded-3xl p-6 transition-all duration-300 space-y-4 hover:shadow-xl hover:shadow-indigo-500/10">
              <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">🏷️ Smart Categorization</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automatically tags and categorizes your notes for Founders, Students, Creators, and Professionals with key takeaways and timelines.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 rounded-3xl p-6 transition-all duration-300 space-y-4 hover:shadow-xl hover:shadow-indigo-500/10 md:col-span-2 lg:col-span-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">⚡ Zero Monthly Subscription</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Say goodbye to recurring $15/month SaaS software fees. Pay once during this exclusive pre-sale window and use forever without recurring charges.
              </p>
            </div>

          </div>

          {/* NEW ADVANCED AI CAPABILITIES SHOWCASE */}
          <div className="mt-16 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-violet-950/40 border border-indigo-500/30 rounded-3xl p-8 sm:p-10 space-y-8 shadow-2xl">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
                ✨ Advanced AI Capabilities
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                More Than Just Transcripts — Visual Thinking & AI Debate Partners
              </h3>
              <p className="text-slate-300 text-sm max-w-2xl mx-auto">
                VoiceNotes AI transforms your raw audio notes into interactive visual graphs, brutal VC critiques, and logic decision matrices instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-lg">
                  🧠
                </div>
                <h4 className="font-bold text-white text-base">D3.js Visual Mind-Map</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Automatically turns your rambling voice notes and key points into interactive force-directed flowcharts and mind maps. Process complex ideas 10x faster.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-lg">
                  🔥
                </div>
                <h4 className="font-bold text-white text-base">AI Opponent / Roast My Idea</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Acts as a brutally honest Startup VC & Tech Mentor. Critiques your voice notes, highlights 3 fatal flaws, and tests your conviction with hard debate questions.
                </p>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                  ⚖️
                </div>
                <h4 className="font-bold text-white text-base">Voice-to-Logic Decision Maker</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Confused between options (e.g. ₹1,999 vs $49 pricing)? Automatically generates a Pro vs. Con table with a strategic AI recommendation.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* PRICING & PAYMENT SECTION */}
        <div id="pricing-section" className="bg-gradient-to-b from-indigo-950/80 via-slate-900 to-slate-950 border-2 border-indigo-500/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-lg">
            Best Value Deal
          </div>

          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider border border-indigo-500/30">
                Secure Lifetime Account
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Get Lifetime Access Today</h2>
              <p className="text-slate-300 text-base sm:text-lg">
                Say goodbye to $15/month subscriptions. Secure your lifetime account now before the 100-seat pre-sale closes.
              </p>
            </div>

            <div className="flex items-baseline justify-center space-x-4">
              <span className="text-5xl sm:text-7xl font-black text-white">₹1,999</span>
              <div className="text-left">
                <span className="text-lg text-slate-500 line-through">₹9,999/year</span>
                <p className="text-xs text-emerald-400 font-semibold">Save 80% • One-Time Payment</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-3 text-slate-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Unlimited Audio Processing (Fair Usage 300 mins/mo)</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Hinglish & Local Accent Engine</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Executive Summaries & Action Items</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Priority Access to Future Features</span>
              </div>
            </div>

            {/* HOW TO PAY & CLAIM ACCESS */}
            <div className="space-y-6 pt-6 border-t border-slate-800">
              <h3 className="text-2xl font-bold text-white">How to Pay & Claim Access</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">1</div>
                  <h4 className="font-bold text-white text-sm">Scan UPI QR Code</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Scan the QR code below or use UPI ID <code className="text-indigo-400 font-mono bg-slate-950 px-1 py-0.5 rounded">raos38908@okhdfcbank</code> in PhonePe, GPay, or Paytm.
                  </p>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">2</div>
                  <h4 className="font-bold text-white text-sm">Pay ₹1,999</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Complete the payment of ₹1,999 to <strong className="text-slate-200">Rao Sahab</strong> and take a screenshot or copy your UTR / transaction ID.
                  </p>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">3</div>
                  <h4 className="font-bold text-white text-sm">Submit & Activate</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Click the button below to submit your details and screenshot for instant manual activation within 2 hours.
                  </p>
                </div>

              </div>

              {/* QR CODE CARD */}
              <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-indigo-500/30 max-w-md mx-auto space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-base">R</div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Rao Sahab</h4>
                      <p className="text-xs text-slate-400">Verified Merchant UPI</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                    Active
                  </span>
                </div>

                {/* Real Scannable UPI QR Code */}
                <div className="bg-white p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center space-y-4">
                  <div className="w-52 h-52 bg-white rounded-xl p-3 flex items-center justify-center relative shadow-sm border border-slate-200">
                    <QRCodeSVG
                      value="upi://pay?pa=raos38908@okhdfcbank&pn=Rao%20Sahab&am=1999&cu=INR"
                      size={180}
                      level="H"
                      includeMargin={false}
                      imageSettings={{
                        src: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-pay-icon.svg",
                        x: undefined,
                        y: undefined,
                        height: 36,
                        width: 36,
                        excavate: true,
                      }}
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-xs text-slate-700 font-bold">Scan & Pay ₹1,999 with PhonePe, GPay, Paytm</p>
                    <p className="text-[11px] text-slate-500">Receiver: Rao Sahab (raos38908@okhdfcbank)</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-medium block">UPI ID for Direct Transfer:</label>
                  <div className="flex items-center justify-between bg-slate-900 px-4 py-3 rounded-xl border border-slate-800">
                    <code className="text-sm font-mono text-indigo-300 font-bold">raos38908@okhdfcbank</code>
                    <button
                      onClick={handleCopyUpi}
                      className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Submit Payment Screenshot & Activate</span>
                    <Send className="w-4 h-4" />
                  </button>
                  
                  <a
                    href="https://wa.me/919034675743?text=Hi%20Rao%20Sahab,%20I%20have%20paid%20₹1,999%20for%20VoiceNotes%20AI%20Lifetime%20Access.%20Here%20is%20my%20UTR%20and%20details:"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* TRUST & GUARANTEE FOOTER */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-indigo-400 font-semibold text-sm">
            <Lock className="w-4 h-4" />
            <span>Instant Manual Activation within 2 Hours | Direct VIP Onboarding Support</span>
          </div>
          <p className="text-slate-400 text-xs">
            Questions? Contact WhatsApp support at <strong className="text-slate-200">+91 9034675743</strong> or email support anytime.
          </p>
        </div>

      </div>

      {/* PAYMENT SUBMISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Submit Payment Details</h3>
                <p className="text-xs text-slate-400">For instant activation of VoiceNotes AI Lifetime Access</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Submission Successful!</h4>
                <p className="text-slate-300 text-sm">
                  Thank you! We have logged your UTR and details. Your lifetime account will be activated within <strong className="text-indigo-400">2 hours</strong>. We will also reach out via WhatsApp / Email.
                </p>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSubmitted(false);
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm"
                >
                  Close & Explore App Demo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Email Address (for Account Login)</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., +91 98765 43210"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">UTR / UPI Transaction ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 4235XXXXXXXX"
                    value={formData.utrNumber}
                    onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Submit & Claim Lifetime Access</span>
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
