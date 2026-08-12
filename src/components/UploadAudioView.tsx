import React, { useState } from 'react';
import { SmartNote, NoteCategory, NoteLanguage } from '../types';
import { Upload, FileAudio, Sparkles, RefreshCw, ArrowLeft, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface UploadAudioViewProps {
  onNoteCreated: (note: SmartNote) => void;
  onBack: () => void;
}

export const UploadAudioView: React.FC<UploadAudioViewProps> = ({
  onNoteCreated,
  onBack,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [customTitle, setCustomTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory>('Professional');
  const [selectedLanguage, setSelectedLanguage] = useState<NoteLanguage>('Bilingual (Hinglish)');
  const [rawTextTranscript, setRawTextTranscript] = useState('');
  const [inputType, setInputType] = useState<'audio' | 'text'>('audio');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setAudioUrl(URL.createObjectURL(file));
      if (!customTitle) {
        // remove extension for title suggestion
        const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setCustomTitle(cleanName.replace(/[-_]/g, ' '));
      }
      setErrorMsg(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setAudioUrl(URL.createObjectURL(file));
      if (!customTitle) {
        const cleanName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setCustomTitle(cleanName.replace(/[-_]/g, ' '));
      }
      setErrorMsg(null);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      if (inputType === 'audio') {
        if (!selectedFile) {
          throw new Error('Please select an audio file to upload.');
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
          const base64String = (reader.result as string).split(',')[1];

          const response = await fetch('/api/notes/generate-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioData: base64String,
              mimeType: selectedFile.type || 'audio/mp3',
              customTitle: customTitle.trim() || undefined,
              category: selectedCategory,
              language: selectedLanguage,
            }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Failed to process audio file');
          }

          const newNote: SmartNote = {
            id: `note-${Date.now()}`,
            title: data.title || customTitle || selectedFile.name,
            category: data.category || selectedCategory,
            language: data.language || selectedLanguage,
            tags: data.tags || ['Audio Upload', selectedCategory],
            summary: data.summary || 'Summary generated from audio file.',
            transcript: data.transcript || 'Verbatim transcript from uploaded audio.',
            keyPoints: data.keyPoints || ['Key takeaway from recording.'],
            actionItems: data.actionItems || [],
            deadlines: data.deadlines || [],
            questions: data.questions || [],
            audioDurationSeconds: 180, // estimated 3 mins
            createdAt: new Date().toISOString(),
            audioUrl: audioUrl || undefined,
            sourceType: 'upload',
          };

          onNoteCreated(newNote);
        };
      } else {
        if (!rawTextTranscript.trim()) {
          throw new Error('Please enter raw transcript text.');
        }

        const response = await fetch('/api/notes/generate-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: rawTextTranscript,
            customTitle: customTitle.trim() || 'Text Transcript Note',
            category: selectedCategory,
            language: selectedLanguage,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to process transcript');
        }

        const newNote: SmartNote = {
          id: `note-${Date.now()}`,
          title: data.title || customTitle || 'Smart Note from Text',
          category: data.category || selectedCategory,
          language: data.language || selectedLanguage,
          tags: data.tags || ['Text Note', selectedCategory],
          summary: data.summary || 'Summary generated from transcript.',
          transcript: rawTextTranscript,
          keyPoints: data.keyPoints || ['Key takeaway.'],
          actionItems: data.actionItems || [],
          deadlines: data.deadlines || [],
          questions: data.questions || [],
          audioDurationSeconds: 120,
          createdAt: new Date().toISOString(),
          sourceType: 'text',
        };

        onNoteCreated(newNote);
      }
    } catch (err: any) {
      console.error('Upload/processing error:', err);
      setErrorMsg(err.message || 'Failed to process with AI. Please try again.');
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
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
          <Upload className="w-3.5 h-3.5" />
          <span>Audio Upload & Text Import</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Upload Audio or Transcript</h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Upload MP3, WAV, M4A, or WebM audio files, or paste raw meeting notes to instantly generate structured smart notes.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Input Type Switcher */}
        <div className="flex justify-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setInputType('audio')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-medium transition-all ${
              inputType === 'audio'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileAudio className="w-4 h-4" />
            <span>Audio File</span>
          </button>
          <button
            type="button"
            onClick={() => setInputType('text')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl text-xs font-medium transition-all ${
              inputType === 'text'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Raw Transcript</span>
          </button>
        </div>

        {inputType === 'audio' ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500/80 rounded-3xl p-10 text-center space-y-4 bg-slate-950/40 transition-all cursor-pointer relative"
          >
            <input
              type="file"
              accept="audio/*,video/*,.mp3,.wav,.m4a,.webm,.ogg,.mp4,.mov,.avi"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
              <Upload className="w-8 h-8" />
            </div>
            {selectedFile ? (
              <div className="space-y-1">
                <p className="text-white font-semibold">{selectedFile.name}</p>
                <p className="text-xs text-emerald-400">Ready for Lightning-Fast AI Smart Note Extraction</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-white font-medium">Drag & drop your audio or video file here, or <span className="text-indigo-400 underline">browse</span></p>
                <p className="text-xs text-slate-500">Supports MP3, WAV, M4A, MP4, WebM, MOV (up to 50MB)</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Paste Transcript or Meeting Notes</label>
            <textarea
              rows={6}
              placeholder="Paste raw transcript, meeting notes, or lecture discussion text here..."
              value={rawTextTranscript}
              onChange={(e) => setRawTextTranscript(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}

        {/* Audio playback if file selected */}
        {audioUrl && inputType === 'audio' && (
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-2">
            <p className="text-xs text-slate-400">Audio Preview</p>
            <audio controls src={audioUrl} className="w-full h-10" />
          </div>
        )}

        {/* Form Meta */}
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Note Title</label>
            <input
              type="text"
              placeholder="e.g. Weekly Strategy Sync"
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
            onClick={handleSubmit}
            disabled={isProcessing || (inputType === 'audio' && !selectedFile) || (inputType === 'text' && !rawTextTranscript.trim())}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white py-4 rounded-2xl font-semibold shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-cyan-300" />
                <span>⚡ Generating AI Smart Notes in seconds...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span>Generate Smart Notes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
