import React, { useState, useRef, useEffect } from 'react';
import { SmartNote, NoteCategory, NoteLanguage } from '../types';
import { Mic, Square, Play, Pause, RefreshCw, Sparkles, CheckCircle2, ArrowLeft, Volume2, AlertCircle } from 'lucide-react';

interface RecordAudioViewProps {
  onNoteCreated: (note: SmartNote) => void;
  onBack: () => void;
}

export const RecordAudioView: React.FC<RecordAudioViewProps> = ({
  onNoteCreated,
  onBack,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>('Professional');
  const [selectedLanguage, setSelectedLanguage] = useState<NoteLanguage>('Bilingual (Hinglish)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);
    setAudioBlob(null);
    setAudioUrl(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop all microphone tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(250); // collect 250ms chunks
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMsg('Microphone access denied or not supported in this browser. Please check permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleProcessRecording = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];

        const response = await fetch('/api/notes/generate-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioData: base64String,
            mimeType: audioBlob.type || 'audio/webm',
            customTitle: customTitle.trim() || undefined,
            category: selectedCategory,
            language: selectedLanguage,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to process audio');
        }

        const newNote: SmartNote = {
          id: `note-${Date.now()}`,
          title: data.title || customTitle || 'Voice Recording Note',
          category: data.category || selectedCategory,
          language: data.language || selectedLanguage,
          tags: data.tags || ['Voice Recording', selectedCategory],
          summary: data.summary || 'Summary generated from audio recording.',
          transcript: data.transcript || 'Verbatim audio transcript.',
          keyPoints: data.keyPoints || ['Key takeaway from recording.'],
          actionItems: data.actionItems || [],
          deadlines: data.deadlines || [],
          questions: data.questions || [],
          audioDurationSeconds: recordingSeconds || 30,
          createdAt: new Date().toISOString(),
          audioUrl: audioUrl || undefined,
          sourceType: 'recording',
        };

        onNoteCreated(newNote);
      };
    } catch (err: any) {
      console.error('AI processing error:', err);
      setErrorMsg(err.message || 'Failed to generate smart notes with AI. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Notes</span>
        </button>
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium">
          <Mic className="w-3.5 h-3.5 animate-pulse" />
          <span>Browser Voice Recorder</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Record Your Voice Note</h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Speak naturally. Gemini AI will automatically transcribe your speech, extract action items, deadlines, key points, and write an executive summary.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center justify-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Recorder Animation / Timer */}
        <div className="py-10 flex flex-col items-center justify-center space-y-6">
          <div className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all ${
            isRecording && !isPaused
              ? 'bg-rose-600/20 border-2 border-rose-500 shadow-2xl shadow-rose-500/30 scale-105'
              : 'bg-slate-800/80 border border-slate-700'
          }`}>
            {isRecording && !isPaused && (
              <div className="absolute inset-0 rounded-full bg-rose-500/10 animate-ping pointer-events-none" />
            )}
            <Mic className={`w-14 h-14 ${isRecording && !isPaused ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
          </div>

          <div className="space-y-1">
            <div className="text-4xl font-mono font-bold tracking-wider text-white">
              {formatTime(recordingSeconds)}
            </div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
              {isRecording ? (isPaused ? 'Recording Paused' : 'Listening & Recording...') : audioBlob ? 'Recording Ready for AI' : 'Ready to record'}
            </p>
          </div>
        </div>

        {/* Recorder Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isRecording && !audioBlob && (
            <button
              onClick={startRecording}
              className="flex items-center space-x-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-rose-600/30 transition-all hover:scale-105"
            >
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          )}

          {isRecording && (
            <>
              <button
                onClick={pauseRecording}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3.5 rounded-2xl font-medium border border-slate-700 transition-all"
              >
                {isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5 text-amber-400" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                onClick={stopRecording}
                className="flex items-center space-x-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-lg shadow-rose-600/30 transition-all"
              >
                <Square className="w-5 h-5 fill-current" />
                <span>Stop Recording</span>
              </button>
            </>
          )}

          {audioBlob && !isRecording && (
            <button
              onClick={startRecording}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl text-sm font-medium border border-slate-700 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Rerecord</span>
            </button>
          )}
        </div>

        {/* Audio playback preview if recorded */}
        {audioUrl && !isRecording && (
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3 max-w-lg mx-auto text-left">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <Volume2 className="w-4 h-4 text-indigo-400" />
                <span>Playback Recording ({formatTime(recordingSeconds)})</span>
              </span>
            </div>
            <audio controls src={audioUrl} className="w-full h-10" />
          </div>
        )}

        {/* Note Configuration Form before submitting to AI */}
        {audioBlob && !isRecording && (
          <div className="space-y-6 pt-6 border-t border-slate-800 max-w-lg mx-auto text-left">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Note Title (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Q3 Product Planning Sync"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Category</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Student', 'Entrepreneur', 'Professional', 'Content Creator'] as NoteCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Output Language / भाषा</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Bilingual (Hinglish)', 'Hindi', 'English'] as NoteLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      selectedLanguage === lang
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleProcessRecording}
              disabled={isProcessing}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white py-4 rounded-2xl font-semibold shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Processing Audio with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                  <span>Generate Smart Notes with AI</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
