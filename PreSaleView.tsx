import React, { useState } from 'react';
import { 
  Zap, Mic, Brain, Target, Tag, ShieldCheck, CheckCircle2, 
  ArrowRight, QrCode, MessageSquare, Copy, Check, Sparkles, 
  Clock, TrendingUp, Send, FileText, Lock, Smartphone, HelpCircle, User, Star
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';
import { QRCodeSVG } from 'qrcode.react';

interface PreSaleViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  showToast: (msg: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth?: () => void;
}

export const PreSaleView: React.FC<PreSaleViewProps> = ({ setActiveTab, showToast, currentUser, onOpenAuth }) => {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    whatsapp: currentUser?.phone || '',
    utrNumber: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState({
    name: 'PRO',
    price: 199,
    priceStr: '₹199',
    duration: 'Monthly',
    minutes: '1,000 min',
  });

  const pricingPlans = [
    { 
      name: 'BASIC', 
      price: 99, 
      priceStr: '₹99', 
      duration: 'Monthly', 
      minutes: '300 min', 
      popular: false,
      desc: 'For casual / individual students.',
      features: ['300 audio mins/month', 'Audio recording & upload', 'AI transcription & smart notes', 'Lecture summary & key points', 'Important questions & flashcards', 'Subject/chapter organization']
    },
    { 
      name: 'PRO', 
      price: 199, 
      priceStr: '₹199', 
      duration: 'Monthly', 
      minutes: '1,000 min', 
      popular: true,
      desc: 'For serious students preparing for exams.',
      features: ['1,000 audio mins/month', 'Everything in Basic plus:', 'Ask My Lecture & AI Tutor', 'Automatic MCQ & test generation', 'Active recall & weak-topic detection', 'AI revision planner & exam mode']
    },
    { 
      name: 'ENTERPRISE', 
      price: 4999, 
      priceStr: '₹4,999', 
      duration: 'Monthly Starting', 
      minutes: 'Up to 100 Students', 
      popular: false,
      desc: 'For coaching institutes & academies.',
      features: ['Turn your coaching lectures into an AI-powered learning system', 'Coaching-branded portal', 'Student, teacher & admin accounts', 'Batch & subject management', 'Student progress & analytics dashboards']
    },
  ];

  const [testimonials, setTestimonials] = useState<Array<{ name: string; role: string; comment: string; rating: number; initials: string; bg: string }>>(() => {
    try {
      const saved = localStorage.getItem('voicenotes_ai_testimonials');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        name: 'Ananya Sharma',
        role: 'Computer Science Student, IIT Delhi',
        comment: 'VoiceNotes AI has completely transformed how I study. Recording lectures and getting instant smart notes, formulas, and flashcards saves me 15+ hours every week!',
        rating: 5,
        initials: 'AS',
        bg: 'bg-blue-100 text-blue-700'
      },
      {
        name: 'Rahul Verma',
        role: 'Medical Student, AIIMS Delhi',
        comment: 'As a medical student with massive syllabi, recording lectures and getting instant D3 mind maps and exam practice questions has been an absolute game-changer.',
        rating: 5,
        initials: 'RV',
        bg: 'bg-indigo-100 text-indigo-700'
      },
      {
        name: 'Priya Patel',
        role: 'Engineering Student, BITS Pilani',
        comment: 'No recurring monthly subscriptions! Paid ₹1,999 once during pre-sale and got lifetime unlimited access for my entire degree. Best student investment ever.',
        rating: 5,
        initials: 'PP',
        bg: 'bg-emerald-100 text-emerald-700'
      }
    ];
  });

  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: currentUser?.name || '',
    role: 'Beta Tester & Creator',
    comment: '',
    rating: 5
  });

  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.name.trim() || !newTestimonial.comment.trim()) {
      showToast('Please enter your name and feedback.');
      return;
    }
    const initials = newTestimonial.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AI';
    const entry = {
      name: newTestimonial.name,
      role: newTestimonial.role || 'Early Adopter',
      comment: newTestimonial.comment,
      rating: Number(newTestimonial.rating) || 5,
      initials,
      bg: 'bg-blue-100 text-blue-700'
    };
    const updated = [entry, ...testimonials];
    setTestimonials(updated);
    try {
      localStorage.setItem('voicenotes_ai_testimonials', JSON.stringify(updated));
    } catch (e) {}
    setIsTestimonialModalOpen(false);
    setNewTestimonial({ name: currentUser?.name || '', role: 'Beta Tester & Creator', comment: '', rating: 5 });
    showToast('Thank you! Your feedback has been published successfully.');
  };

  const spotsClaimed = 5;
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
    <div className="min-h-screen bg-white text-slate-900 selection:bg-blue-500 selection:text-white font-sans">
      {/* Top Navigation Bar with Logo and Sign In Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Mic className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-slate-950 tracking-tight">VoiceNotes AI</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveTab('admin_login' as any)}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <span>🔒 Admin Portal</span>
          </button>
          {!currentUser && (
            <button
              onClick={() => {
                if (onOpenAuth) onOpenAuth();
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow transition-all flex items-center space-x-1.5"
            >
              <span>🔐 Sign In / Register</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
        
        {currentUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center">
                {(currentUser.name || 'U').charAt(0)}
              </div>
              <div>
                <p className="text-xs text-slate-600">Signed in as <strong className="text-slate-900">{currentUser.email}</strong></p>
                <p className="text-xs text-slate-700">
                  Plan: <span className="text-blue-600 font-bold">{currentUser.isPremium ? 'Pro Active (1,000 min/mo)' : 'Basic Plan (300 min/mo)'}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow"
            >
              Go to Student Dashboard →
            </button>
          </div>
        )}

        {/* HERO SECTION */}
        <div className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs sm:text-sm font-semibold shadow-sm">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>🎓 YOUR PERSONAL AI STUDY COMPANION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            Record your lecture. Get notes, questions, flashcards & revision{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              automatically.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Turn any 1-hour college or school lecture into 5-minute revision notes, important exam questions, interactive flashcards, and active recall practice instantly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                if (currentUser) {
                  setActiveTab('dashboard');
                } else if (onOpenAuth) {
                  onOpenAuth();
                } else {
                  setActiveTab('dashboard');
                }
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-600/25 hover:scale-105 transition-all text-center flex items-center justify-center space-x-3"
            >
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <span>Get Started Free</span>
            </button>
            
            <a
              href="#pricing-section"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-base transition-all flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>View Student Plans</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* WHAT YOU GET — FEATURES */}
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">The Ultimate Student Study Workflow</h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
              Lecture → Smart Notes → Exam Questions → Flashcards → Active Recall → Exam Ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-3xl p-6 transition-all duration-300 space-y-4 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">🎙️ 1-Tap Instant Audio Recording & Upload</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Record live meetings, lectures, or random thoughts directly in your browser, or upload existing audio files in any format (MP3, WAV, M4A).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-3xl p-6 transition-all duration-300 space-y-4 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">🧠 Hinglish & Local Accent First</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Understands mixed Hindi-English speech, Indian terminology, slang, names, and regional context perfectly without breaking a sweat.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-3xl p-6 transition-all duration-300 space-y-4 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center text-cyan-600">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">🎯 Auto Action-Items</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Extracts tasks, follow-ups, and action items directly into clean checklist formats so nothing ever slips through the cracks.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-3xl p-6 transition-all duration-300 space-y-4 shadow-sm hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
                <Tag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">🏷️ Subject & Chapter Organization</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Automatically organizes your lectures by subject, semester, and chapter with key takeaways, formulas, and definitions.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-3xl p-6 transition-all duration-300 space-y-4 shadow-sm hover:shadow-md md:col-span-2 lg:col-span-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">⚡ Lifetime Student Access</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Say goodbye to recurring monthly subscription bills. Pay once during this exclusive pre-sale window and use for your entire degree without recurring charges.
              </p>
            </div>

          </div>

          {/* NEW ADVANCED AI CAPABILITIES SHOWCASE */}
          <div className="mt-16 bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-8 shadow-sm">
            <div className="text-center space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
                ✨ Advanced Study Tools
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                More Than Just Audio Notes — Flashcards, Practice Tests & AI Study Tutor
              </h3>
              <p className="text-slate-600 text-sm max-w-2xl mx-auto">
                VoiceNotes AI transforms your lecture recordings into interactive visual mind maps, exam practice tests, flashcards, and active recall study sessions instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                  🧠
                </div>
                <h4 className="font-bold text-slate-900 text-base">Visual D3 Mind-Map</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Automatically turns your lecture audio and key points into interactive force-directed concept maps and mind maps to master complex topics 10x faster.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg">
                  ❓
                </div>
                <h4 className="font-bold text-slate-900 text-base">Exam Questions & Flashcards</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Generates MCQs, short/long exam questions, viva questions, and swipe-based active recall flashcards from your exact lectures.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg">
                  📅
                </div>
                <h4 className="font-bold text-slate-900 text-base">Spaced Revision Planner</h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Automates revision schedules based on your exam dates using science-backed spaced repetition for long-term memory retention.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* PRICING & PAYMENT SECTION */}
        <div id="pricing-section" className="bg-slate-50 border-2 border-blue-200 rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden space-y-10">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-sm">
            Choose Your Plan
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider border border-blue-200">
              🎁 20-Min Free Trial Included in All Plans
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900">Select Your VoiceNotes AI Plan</h2>
            <p className="text-slate-600 text-base max-w-xl mx-auto">
              Every plan includes a 20-min free trial so you can experience AI transcription and smart notes risk-free before unlocking full access.
            </p>
          </div>

          {/* 6 PLANS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => {
              const isSelected = selectedPlan.name === plan.name;
              return (
                <div
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative rounded-3xl p-6 cursor-pointer transition-all flex flex-col justify-between border ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500 shadow-md scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      🔥 Most Popular Lifetime Deal
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {plan.duration}
                      </span>
                    </div>

                    <div className="flex items-baseline space-x-1">
                      <span className="text-4xl font-black text-slate-900">{plan.priceStr}</span>
                      <span className="text-xs text-slate-500">/{plan.duration === 'Lifetime' ? 'lifetime' : plan.duration.toLowerCase()}</span>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200 text-sm">
                      <p className="text-xs text-slate-500 font-medium">{plan.desc}</p>
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-xs">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <button
                      type="button"
                      className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{isSelected ? '✓ Selected Plan' : 'Select Plan'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAYMENT & QR CODE CARD FOR SELECTED PLAN */}
          <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-300 space-y-6 shadow-xl text-left">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Selected Plan</span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedPlan.name} ({selectedPlan.priceStr})</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Audio Minutes</span>
                <p className="text-sm font-bold text-emerald-600">{selectedPlan.minutes}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Receiver: <strong className="text-slate-900">Rao Sahab</strong></span>
                <span className="font-mono text-blue-600">raos38908@okhdfcbank</span>
              </div>

              {/* Real Scannable UPI QR Code */}
              <div className="bg-slate-50 p-6 rounded-2xl shadow-inner flex flex-col items-center justify-center space-y-4 border border-slate-200">
                <div className="w-52 h-52 bg-white rounded-xl p-3 flex items-center justify-center relative shadow-sm border border-slate-200">
                  <QRCodeSVG
                    value={`upi://pay?pa=raos38908@okhdfcbank&pn=Rao%20Sahab&am=${selectedPlan.price}&cu=INR`}
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
                  <p className="text-xs text-slate-800 font-bold">Scan & Pay {selectedPlan.priceStr} via PhonePe, GPay, Paytm</p>
                  <p className="text-[11px] text-slate-500">Receiver: Rao Sahab (raos38908@okhdfcbank)</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-600 font-medium block">UPI ID for Direct Transfer:</label>
                <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                  <code className="text-sm font-mono text-blue-600 font-bold">raos38908@okhdfcbank</code>
                  <button
                    onClick={handleCopyUpi}
                    className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2"
              >
                <span>Submit {selectedPlan.priceStr} Payment & Activate</span>
                <Send className="w-4 h-4" />
              </button>
              
              <a
                href={`https://wa.me/919034675743?text=Hi%20Rao%20Sahab,%20I%20have%20paid%20${encodeURIComponent(selectedPlan.priceStr)}%20for%20VoiceNotes%20AI%20(${encodeURIComponent(selectedPlan.name)}).%20Here%20is%20my%20UTR%20and%20details:`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>



        {/* FAQ SECTION */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm">Everything you need to know about the Pre-Sale Lifetime Deal.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base">Q: How soon is my account activated after paying ₹1,999?</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Accounts are manually verified and activated within <strong className="text-blue-600">2 hours</strong> of submitting your UTR or messaging us on WhatsApp. You'll receive instant confirmation.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base">Q: Does VoiceNotes AI support Hinglish and Indian accents?</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Yes! VoiceNotes AI is specifically fine-tuned for mixed Hindi-English (Hinglish), Indian terminology, regional accents, and fast technical meetings.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2 shadow-sm">
              <h3 className="font-bold text-slate-900 text-base">Q: Are there any monthly or recurring charges?</h3>
              <p className="text-slate-700 text-sm leading-relaxed">
                Zero recurring fees! This is an exclusive pre-sale lifetime access offer for the first 100 early adopters. Pay ₹1,999 once and use forever.
              </p>
            </div>
          </div>
        </div>

        {/* TRUST & GUARANTEE FOOTER */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-center space-y-3 shadow-sm">
          <div className="flex items-center justify-center space-x-2 text-blue-600 font-semibold text-sm">
            <Lock className="w-4 h-4" />
            <span>Instant Manual Activation within 2 Hours | Direct VIP Onboarding Support</span>
          </div>
          <p className="text-slate-600 text-xs">
            Questions? Contact WhatsApp support at <strong className="text-slate-900">+91 9034675743</strong> or email support anytime.
          </p>
        </div>

      </div>

      {/* PAYMENT SUBMISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Submit Payment Details</h3>
                <p className="text-xs text-slate-500">For instant activation of VoiceNotes AI Lifetime Access</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Submission Successful!</h4>
                <p className="text-slate-700 text-sm">
                  Thank you! We have logged your UTR and details. Your lifetime account will be activated within <strong className="text-blue-600">2 hours</strong>. We will also reach out via WhatsApp / Email.
                </p>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSubmitted(false);
                  }}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow"
                >
                  Close & Explore App Demo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rahul Sharma"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Email Address (for Account Login)</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g., +91 98765 43210"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">UTR / UPI Transaction ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 4235XXXXXXXX"
                    value={formData.utrNumber}
                    onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2"
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

      {/* TESTIMONIAL SUBMISSION MODAL */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Add Your Review & Feedback</h3>
                <p className="text-xs text-slate-500">Share your experience with VoiceNotes AI</p>
              </div>
              <button
                onClick={() => setIsTestimonialModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTestimonial} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ananya Patel"
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Your Role / Profession</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Startup Founder, Student, Developer"
                  value={newTestimonial.role}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Rating (1 to 5 Stars)</label>
                <select
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                >
                  <option value={5}>★★★★★ (5 Stars - Amazing)</option>
                  <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
                  <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Your Feedback / Review</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write what you love about VoiceNotes AI..."
                  value={newTestimonial.comment}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, comment: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Publish Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer with Email, Contact and Admin Button */}
      <footer className="mt-20 border-t border-slate-200 bg-slate-900 text-slate-300 py-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <p className="text-sm font-bold text-white">VoiceNotes AI - Smart Lecture Assistant</p>
            <p className="text-xs text-slate-400">Empowering students with 30s AI summaries and spaced repetition.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs text-slate-300">
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-400">Email:</span>
              <a href="mailto:hy399035@gmail.com" className="text-blue-400 hover:underline font-mono">hy399035@gmail.com</a>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-semibold text-slate-400">Contact:</span>
              <a href="tel:9034675743" className="text-emerald-400 hover:underline font-mono">9034675743</a>
            </div>
            <div>
              <button
                onClick={() => {
                  setActiveTab('admin_login' as any);
                }}
                className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs border border-indigo-500/40 transition-all flex items-center space-x-1 shadow-sm"
              >
                <span>🔒 Admin</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
