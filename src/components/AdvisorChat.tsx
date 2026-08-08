import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  Zap, 
  Compass,
  Trash2,
  Copy,
  Check,
  Award,
  History,
  Info,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { ChatMessage, StudentProfile, CareerRoadmap } from '../types';

interface AdvisorChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClearHistory?: () => void;
  isThinking: boolean;
  profile: StudentProfile;
  roadmap?: CareerRoadmap | null;
}

const FEATURED_PROMPTS = [
  { label: 'Which career suits me?', icon: '🎯', description: 'Personalized career recommendations based on major' },
  { label: 'How to get into Google?', icon: '🚀', description: 'Step-by-step FAANG campus hiring guide' },
  { label: 'Should I learn AWS?', icon: '☁️', description: 'Cloud skills & ROI breakdown' },
  { label: 'Explain DSA.', icon: '🧩', description: 'Data Structures & Algorithms basics & interview tips' },
  { label: 'Review my roadmap.', icon: '🗺️', description: 'AI audit of active career readiness plan' },
];

export const AdvisorChat: React.FC<AdvisorChatProps> = ({
  messages,
  onSendMessage,
  onClearHistory,
  isThinking,
  profile,
  roadmap,
}) => {
  const [inputText, setInputText] = useState('');
  const [copiedChat, setCopiedChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isThinking) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handlePromptClick = (promptText: string) => {
    if (isThinking) return;
    onSendMessage(promptText);
  };

  const handleCopyConversation = () => {
    const chatText = messages
      .map(m => `[${m.timestamp}] ${m.sender === 'ai' ? 'AI Mentor' : 'Student'}: ${m.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(chatText);
    setCopiedChat(true);
    setTimeout(() => setCopiedChat(false), 2000);
  };

  // Simple, clean Markdown formatter for formatted chat text
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (!trimmed) return <div key={idx} className="h-1" />;

          // H3 Heading
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-sm font-black text-white pt-2 pb-1 border-b border-indigo-500/20 flex items-center gap-1.5">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }

          // H4 Heading
          if (trimmed.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-xs font-bold text-indigo-300 pt-1">
                {trimmed.replace('#### ', '')}
              </h4>
            );
          }

          // Bullet point
          if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
            const content = trimmed.replace(/^[-•*]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                <span>{renderInlineFormatting(content)}</span>
              </div>
            );
          }

          // Numbered item
          if (/^\d+\.\s/.test(trimmed)) {
            const num = trimmed.match(/^\d+/)?.[0];
            const content = trimmed.replace(/^\d+\.\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 pt-1">
                <span className="text-xs font-bold text-indigo-300 font-mono bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/30 shrink-0">
                  {num}
                </span>
                <span className="pt-0.5">{renderInlineFormatting(content)}</span>
              </div>
            );
          }

          return <p key={idx}>{renderInlineFormatting(trimmed)}</p>;
        })}
      </div>
    );
  };

  // Helper to render bold **text** and `code` inline
  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-indigo-200">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-indigo-300 text-[11px] border border-slate-800">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] min-h-[580px] flex flex-col rounded-3xl bg-slate-900/70 border border-indigo-500/30 backdrop-blur-xl shadow-2xl overflow-hidden mb-12">
      
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">AI Career Mentor</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Active & Persistent
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Personalized guidance for <span className="text-indigo-300 font-semibold">{profile.major || 'Computer Science'}</span> ({profile.gradYear || '2026'})
            </p>
          </div>
        </div>

        {/* History Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
            <History className="w-3 h-3 text-indigo-400" />
            <span>History Saved ({messages.length})</span>
          </div>

          {messages.length > 0 && (
            <>
              <button
                onClick={handleCopyConversation}
                title="Copy Chat"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1 border border-slate-700"
              >
                {copiedChat ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span className="hidden sm:inline">{copiedChat ? 'Copied' : 'Copy Chat'}</span>
              </button>

              {onClearHistory && (
                <button
                  onClick={onClearHistory}
                  title="Clear Chat History"
                  className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/30 transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="py-8 space-y-8 max-w-2xl mx-auto">
            {/* Welcome Banner */}
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-white">Welcome to your Personal AI Mentor</h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-lg mx-auto">
                Ask anything about career suitability, landing roles at Google, learning AWS, mastering DSA, or getting an instant review of your career roadmap. Your chat history is saved automatically!
              </p>
            </div>

            {/* Quick Featured Prompt Buttons */}
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Frequently Asked Student Questions:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FEATURED_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(item.label)}
                    disabled={isThinking}
                    className="p-3.5 rounded-2xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group flex items-start justify-between gap-2 shadow-md hover:shadow-indigo-500/10"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white group-hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isAI = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                {isAI && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 text-xs shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] p-4 sm:p-5 rounded-3xl text-xs leading-relaxed space-y-2 ${
                    isAI
                      ? 'bg-slate-950/80 border border-indigo-500/20 text-slate-100 shadow-xl'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg'
                  }`}
                >
                  {isAI ? (
                    renderFormattedText(msg.text)
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}

                  <div className={`pt-1 flex items-center justify-between text-[9px] border-t ${
                    isAI ? 'border-slate-800 text-slate-500' : 'border-indigo-400/30 text-indigo-100'
                  }`}>
                    <span>{isAI ? 'AI Mentor' : 'You'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {!isAI && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-indigo-300 border border-white/10 flex items-center justify-center shrink-0 text-xs font-bold">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {isThinking && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>AI Mentor is analyzing your query and profile context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Featured Quick Prompts Pills Row */}
      <div className="p-3 px-4 sm:px-6 bg-slate-950/60 border-t border-white/5 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Quick Ask:</span>
        {FEATURED_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handlePromptClick(item.label)}
            disabled={isThinking}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-[11px] font-semibold whitespace-nowrap border border-slate-800 hover:border-indigo-500/40 transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-4 bg-slate-950/90 border-t border-white/10 flex items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask AI Mentor: Which career suits me? How to get into Google? Explain DSA..."
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
        />
        <button
          type="submit"
          disabled={isThinking || !inputText.trim()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          <span>Send</span>
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
