import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Trash2,
  Copy,
  Check,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { ChatMessage, StudentProfile, CareerRoadmap } from '../types';
import { BackButton } from './BackButton';

interface AdvisorChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClearHistory?: () => void;
  isThinking: boolean;
  profile: StudentProfile;
  roadmap?: CareerRoadmap | null;
  onBack?: () => void;
}

const FEATURED_PROMPTS = [
  'Which career suits my technical background?',
  'How do I prepare for technical interviews?',
  'What are the highest ROI skills for 2026?',
  'Review my current learning roadmap and gaps.'
];

export const AdvisorChat: React.FC<AdvisorChatProps> = ({
  messages,
  onSendMessage,
  onClearHistory,
  isThinking,
  onBack,
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

  const handleCopyConversation = () => {
    const chatText = messages
      .map(m => `[${m.sender === 'ai' ? 'AI Advisor' : 'Student'}]: ${m.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(chatText);
    setCopiedChat(true);
    setTimeout(() => setCopiedChat(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* 1. Header */}
      <div className="border-b border-white/[0.08] pb-5 space-y-1">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div className="flex items-start gap-3">
            {onBack && <BackButton onClick={onBack} />}
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 uppercase tracking-wider">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Interactive Mentorship</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                AI Career Advisor
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Consult with your AI mentor on career trajectory strategy, interview preparation, and technical benchmarking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-xs">
            {messages.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleCopyConversation}
                  className="text-slate-400 hover:text-white font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copiedChat ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
                  <span>{copiedChat ? 'Copied' : 'Copy'}</span>
                </button>
                {onClearHistory && (
                  <button
                    type="button"
                    onClick={onClearHistory}
                    className="text-slate-400 hover:text-rose-400 font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Featured Prompt Chips */}
      {messages.length <= 1 && (
        <div className="p-4 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-2.5">
          <span className="text-xs uppercase tracking-wider font-mono text-indigo-400 font-semibold block">
            Suggested Inquiries
          </span>
          <div className="flex flex-wrap gap-2">
            {FEATURED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSendMessage(prompt)}
                disabled={isThinking}
                className="px-3 py-1.5 rounded-lg border border-white/[0.08] bg-[#0E111B] text-xs text-slate-300 hover:border-indigo-500/40 hover:text-white transition-all text-left cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Messages Stream */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#131724] border border-white/[0.08] shadow-sm space-y-4 min-h-[360px]">
        {messages.length === 0 ? (
          <div className="text-center py-16 text-slate-400 space-y-2">
            <Sparkles className="w-6 h-6 mx-auto text-indigo-400" />
            <p className="text-xs">No conversation history yet. Ask any career question to begin.</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isAI = msg.sender === 'ai';

            return (
              <div 
                key={msg.id || idx} 
                className={`p-4 rounded-xl space-y-1.5 border ${
                  isAI 
                    ? 'bg-[#0E111B] border-white/[0.06]' 
                    : 'bg-indigo-600/10 border-indigo-500/20'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className={`font-semibold ${isAI ? 'text-indigo-400' : 'text-white'}`}>
                    {isAI ? 'CareerCompass AI Advisor' : 'You'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{msg.timestamp || ''}</span>
                </div>

                <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>
              </div>
            );
          })
        )}

        {isThinking && (
          <div className="p-4 rounded-xl bg-[#0E111B] border border-white/[0.06] space-y-2 animate-pulse">
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Advisor is generating response...</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full w-2/3" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Chat Input Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask advice on interviews, skills, job strategy..."
          disabled={isThinking}
          className="flex-1 px-4 py-2.5 rounded-lg border border-white/[0.12] bg-[#131724] text-white text-xs focus:outline-none focus:border-indigo-500 shadow-xs"
        />
        <button
          type="submit"
          disabled={isThinking || !inputText.trim()}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
