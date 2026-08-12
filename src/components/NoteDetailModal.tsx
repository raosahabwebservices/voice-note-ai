import React, { useState } from 'react';
import { SmartNote, ActionItem } from '../types';
import { X, Copy, Download, Trash2, CheckCircle2, Circle, Calendar, HelpCircle, FileText, Sparkles, Clock, Check, Volume2, MessageSquare, Send, Flame, Scale } from 'lucide-react';
import { D3MindMap } from './D3MindMap';
import { AiRoastView } from './AiRoastView';
import { DecisionMatrixView } from './DecisionMatrixView';

interface NoteDetailModalProps {
  note: SmartNote;
  onClose: () => void;
  onUpdateNote: (updatedNote: SmartNote) => void;
  onDeleteNote: (id: string) => void;
}

export const NoteDetailModal: React.FC<NoteDetailModalProps> = ({
  note,
  onClose,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'keypoints' | 'actions' | 'deadlines' | 'questions' | 'transcript' | 'chat' | 'mindmap' | 'roast' | 'matrix'>('summary');
  const [copied, setCopied] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: `Hi! I'm your VoiceNote AI assistant. Ask me anything about "${note.title}". For example: "Paisa kitna dena tha?" or "What are the main action items?"` }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const question = textToSend || chatInput;
    if (!question.trim() || chatLoading) return;

    const newMessages = [...messages, { role: 'user' as const, content: question }];
    setMessages(newMessages);
    if (!textToSend) setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('/api/notes/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          note,
          messages: newMessages,
          question,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }

      setMessages([...newMessages, { role: 'assistant', content: data.answer }]);
    } catch (err: any) {
      console.error(err);
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error answering your question. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const toggleActionItem = (index: number) => {
    const updatedActions = [...note.actionItems];
    updatedActions[index] = {
      ...updatedActions[index],
      completed: !updatedActions[index].completed,
    };
    onUpdateNote({
      ...note,
      actionItems: updatedActions,
    });
  };

  const handleCopyNote = () => {
    const textContent = `
# ${note.title}
Category: ${note.category}
Tags: ${note.tags.join(', ')}
Date: ${new Date(note.createdAt).toLocaleString()}

## Summary
${note.summary}

## Key Points
${note.keyPoints.map(kp => `- ${kp}`).join('\n')}

## Action Items
${note.actionItems.map(ai => `- [${ai.completed ? 'x' : ' '}] ${ai.task} (${ai.assignee || 'Self'})`).join('\n')}

## Deadlines & Milestones
${note.deadlines.map(d => `- ${d.event}: ${d.date}`).join('\n')}

## Transcript
${note.transcript}
    `.trim();

    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    const textContent = `
========================================
VOICENOTES AI - SMART NOTE EXPORT
========================================
Title: ${note.title}
Category: ${note.category}
Tags: ${note.tags.join(', ')}
Date: ${new Date(note.createdAt).toLocaleString()}
Duration: ${Math.round(note.audioDurationSeconds / 60)} minutes

--- EXECUTIVE SUMMARY ---
${note.summary}

--- KEY POINTS ---
${note.keyPoints.map(kp => `• ${kp}`).join('\n')}

--- ACTION ITEMS ---
${note.actionItems.map(ai => `[${ai.completed ? 'X' : ' '}] ${ai.task} (${ai.assignee || 'Self'})`).join('\n')}

--- IMPORTANT DATES & DEADLINES ---
${note.deadlines.map(d => `• ${d.event}: ${d.date}`).join('\n')}

--- QUESTIONS EXTRACTOR ---
${note.questions.map(q => `? ${q}`).join('\n')}

--- FULL TRANSCRIPT ---
${note.transcript}
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_voicenote.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    // Print window for clean PDF export
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${note.title} - VoiceNotes AI</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #111; max-width: 800px; margin: 40px auto; padding: 20px; }
            h1 { font-size: 26px; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 6px; }
            .meta { font-size: 13px; color: #555; margin-bottom: 24px; }
            h2 { font-size: 18px; color: #4f46e5; margin-top: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
            p, li { font-size: 14px; color: #374151; }
            ul { padding-left: 20px; }
            .badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-right: 6px; }
            .footer { margin-top: 40px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>${note.title}</h1>
          <div class="meta">
            <span class="badge">${note.category}</span>
            <span>Created: ${new Date(note.createdAt).toLocaleString()}</span> | 
            <span>Duration: ${Math.round(note.audioDurationSeconds / 60)} mins</span>
          </div>

          <h2>Executive Summary</h2>
          <p>${note.summary}</p>

          <h2>Key Points</h2>
          <ul>
            ${note.keyPoints.map(kp => `<li>${kp}</li>`).join('')}
          </ul>

          <h2>Action Items</h2>
          <ul>
            ${note.actionItems.map(ai => `<li>[${ai.completed ? 'DONE' : 'PENDING'}] ${ai.task} <em>(${ai.assignee || 'Self'})</em></li>`).join('')}
          </ul>

          ${note.deadlines.length > 0 ? `
            <h2>Deadlines & Milestones</h2>
            <ul>
              ${note.deadlines.map(d => `<li><strong>${d.event}</strong>: ${d.date}</li>`).join('')}
            </ul>
          ` : ''}

          <h2>Full Transcript</h2>
          <p style="white-space: pre-wrap; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${note.transcript}</p>

          <div class="footer">Generated by VoiceNotes AI - Smart Audio-to-Insights Engine</div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/40">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 text-xs font-semibold">
                {note.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                {note.language || 'English'}
              </span>
              <span className="text-xs text-slate-400 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 mr-1" />
                {Math.round(note.audioDurationSeconds / 60)} min recording
              </span>
              <span className="text-xs text-slate-500">
                • {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {note.title}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyNote}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
              title="Download TXT"
            >
              <Download className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">TXT</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all"
              title="Print / PDF Export"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">PDF / Print</span>
            </button>

            <button
              onClick={() => {
                if (confirm(`Delete note "${note.title}"?`)) {
                  onDeleteNote(note.id);
                  onClose();
                }
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-all"
              title="Delete Note"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Audio Player if available */}
        {note.audioUrl && (
          <div className="px-6 py-3 bg-indigo-950/30 border-b border-indigo-900/40 flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <Volume2 className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-indigo-300">Original Audio Recording</p>
              <audio controls src={note.audioUrl} className="w-full h-8 mt-1" />
            </div>
          </div>
        )}

        {/* Navigation Sub-Tabs */}
        <div className="flex overflow-x-auto px-6 py-2 border-b border-slate-800 bg-slate-950/80 space-x-2">
          {[
            { id: 'summary', label: 'Summary', icon: Sparkles },
            { id: 'mindmap', label: '🧠 Visual Mind-Map', icon: Sparkles },
            { id: 'roast', label: '🔥 AI Opponent / Roast', icon: Flame },
            { id: 'matrix', label: '⚖️ Decision Matrix', icon: Scale },
            { id: 'keypoints', label: `Key Points (${note.keyPoints?.length || 0})`, icon: FileText },
            { id: 'actions', label: `Action Items (${note.actionItems?.length || 0})`, icon: CheckCircle2 },
            { id: 'deadlines', label: `Deadlines (${note.deadlines?.length || 0})`, icon: Calendar },
            { id: 'questions', label: `Questions (${note.questions?.length || 0})`, icon: HelpCircle },
            { id: 'transcript', label: 'Full Transcript', icon: FileText },
            { id: 'chat', label: '💬 Talk to Note', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Executive Summary</h3>
                <p className="text-slate-200 text-base leading-relaxed bg-slate-950/50 p-5 rounded-2xl border border-slate-800/80">
                  {note.summary}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tags & Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-slate-800 text-indigo-300 text-xs font-medium border border-slate-700">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keypoints' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Core Takeaways & Key Points</h3>
              <ul className="space-y-3">
                {note.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                    <span className="w-6 h-6 rounded-full bg-indigo-600/20 text-indigo-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-slate-200 text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Action Items & Tasks</h3>
                <span className="text-xs text-slate-400">
                  {note.actionItems.filter(a => a.completed).length} of {note.actionItems.length} completed
                </span>
              </div>
              <div className="space-y-2.5">
                {note.actionItems.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => toggleActionItem(index)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                      item.completed
                        ? 'bg-slate-950/30 border-slate-800 text-slate-500 line-through'
                        : 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/50 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button className="text-indigo-400 hover:text-indigo-300">
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                      <span className="text-sm font-medium">{item.task}</span>
                    </div>
                    {item.assignee && (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs">
                        {item.assignee}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'deadlines' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Important Dates & Deadlines</h3>
              {note.deadlines.length === 0 ? (
                <p className="text-sm text-slate-400 bg-slate-950/40 p-6 rounded-xl border border-slate-800 text-center">
                  No specific deadlines or dates mentioned in this recording.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {note.deadlines.map((dl, index) => (
                    <div key={index} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 space-y-1">
                      <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{dl.date}</span>
                      </div>
                      <p className="text-sm font-medium text-white">{dl.event}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Extracted Questions & Follow-ups</h3>
              {note.questions.length === 0 ? (
                <p className="text-sm text-slate-400 bg-slate-950/40 p-6 rounded-xl border border-slate-800 text-center">
                  No open questions identified in this recording.
                </p>
              ) : (
                <div className="space-y-3">
                  {note.questions.map((q, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                      <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-200">{q}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'mindmap' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span>D3.js Interactive Visual Mind-Map</span>
                </h3>
                <span className="text-xs text-slate-500">Visual Thinking Tool</span>
              </div>
              <D3MindMap note={note} />
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex items-center justify-between text-xs text-slate-400">
                <span>💡 Tip: Drag nodes around or zoom to explore relationships between your insights and action items.</span>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-all"
                >
                  Ask AI about this Graph
                </button>
              </div>
            </div>
          )}

          {activeTab === 'roast' && (
            <AiRoastView note={note} />
          )}

          {activeTab === 'matrix' && (
            <DecisionMatrixView note={note} />
          )}

          {activeTab === 'transcript' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Full Verbatim Transcript</h3>
                <button
                  onClick={() => navigator.clipboard.writeText(note.transcript)}
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Copy Transcript
                </button>
              </div>
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                {note.transcript}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="flex flex-col h-[400px] sm:h-[450px] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  <span>Interactive Assistant — Talk to Your Voice Note</span>
                </h3>
                <span className="text-xs text-slate-500">Powered by Gemini AI</span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/25'
                          : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-bl-none shadow-inner'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl rounded-bl-none flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-xs text-slate-400 ml-2">Searching transcript & thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompt Suggestions */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => handleSendMessage("Is note mein maine kitne logon ke naam liye?")}
                  className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-all"
                >
                  💡 Kitne logon ke naam liye?
                </button>
                <button
                  onClick={() => handleSendMessage("Paisa kitna dena tha kisiko?")}
                  className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-all"
                >
                  💵 Paisa kitna dena tha?
                </button>
                <button
                  onClick={() => handleSendMessage("What are the key action items and next steps?")}
                  className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-all"
                >
                  🎯 Main Action Items?
                </button>
              </div>

              {/* Chat Input Box */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Ask anything about this note... (e.g. Paisa kitna dena tha?)"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>VoiceNotes AI v1.0 • Powered by Gemini 3.6 Flash</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition-all"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
