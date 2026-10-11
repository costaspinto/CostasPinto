'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowUpRight,
  Bot,
  Github,
  Linkedin,
  MessageCircle,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatResponse = {
  answer?: string;
  error?: string;
};

const GITHUB_URL = 'https://github.com/costaspinto';
const LINKEDIN_URL = 'https://www.linkedin.com/in/costaspinto/';
const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content:
    'Hi! I’m Costas’s portfolio assistant. Ask me about his AI projects, technical skills, education, or experience. I can help you find the most relevant details.',
};
const QUICK_PROMPTS = [
  'Show me your AI projects',
  'What technologies do you use?',
  'Tell me about your experience',
];

function formatInline(text: string): ReactNode[] {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="font-semibold text-slate-950">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');

  return (
    <div className="space-y-2 break-words">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-1" />;

        if (/^[-*•]\s/.test(trimmed)) {
          return (
            <div key={index} className="flex gap-2 pl-1">
              <span aria-hidden="true" className="text-emerald-700">•</span>
              <span>{formatInline(trimmed.replace(/^[-*•]\s+/, ''))}</span>
            </div>
          );
        }

        if (/^\d+[.)]\s/.test(trimmed)) {
          return (
            <div key={index} className="flex gap-2 pl-1">
              <span className="font-semibold text-emerald-800">
                {trimmed.match(/^\d+[.)]/)?.[0]}
              </span>
              <span>{formatInline(trimmed.replace(/^\d+[.)]\s+/, ''))}</span>
            </div>
          );
        }

        if (trimmed.startsWith('### ')) {
          return <p key={index} className="pt-1 font-semibold text-slate-950">{formatInline(trimmed.slice(4))}</p>;
        }
        if (trimmed.startsWith('## ')) {
          return <p key={index} className="pt-1 font-semibold text-slate-950">{formatInline(trimmed.slice(3))}</p>;
        }

        return <p key={index}>{formatInline(trimmed)}</p>;
      })}
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, busy, open]);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  async function askQuestion(rawText: string) {
    const text = rawText.trim();
    if (!text || busy) return;

    const next: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const data = (await response.json().catch(() => ({}))) as ChatResponse;

      if (!response.ok) {
        throw new Error(data.error || 'Chat request failed. Please try again.');
      }

      setMessages([
        ...next,
        {
          role: 'assistant',
          content: data.answer || 'I couldn’t generate a response. Please try again.',
        },
      ]);
    } catch (error) {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : 'I couldn’t respond right now. Please try again.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askQuestion(input);
  }

  function resetConversation() {
    if (busy) return;
    setMessages([INITIAL_MESSAGE]);
    setInput('');
  }

  return (
    <>
      {open && (
        <section
          id="costas-ai-chat"
          aria-label="Ask Costas AI chat"
          className="fixed bottom-24 right-3 z-[200] flex h-[min(680px,calc(100dvh-8rem))] w-[min(430px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white shadow-[0_28px_90px_-24px_rgba(2,44,34,0.45)] sm:right-5"
        >
          <header className="relative isolate overflow-hidden bg-gradient-to-br from-[#06281e] via-emerald-900 to-teal-800 px-4 pb-4 pt-5 text-white sm:px-5">
            <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 -z-10 h-40 w-40 rounded-full bg-emerald-300/15 blur-2xl" />
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-inner">
                  <Bot size={22} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.19em] text-emerald-200">Costas Pinto</p>
                  <h2 className="mt-0.5 text-lg font-bold tracking-tight">AI portfolio assistant</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-100/85">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                    Ask about projects, skills, and experience
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={resetConversation}
                  disabled={busy}
                  aria-label="Reset conversation"
                  title="New conversation"
                  className="rounded-xl p-2.5 text-emerald-50/90 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="rounded-xl p-2.5 text-emerald-50/90 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={19} />
                </button>
              </div>
            </div>
          </header>

          <div className="flex items-center gap-2.5 border-b border-slate-100 bg-white px-4 py-3 sm:px-5">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
            >
              <Github size={14} /> GitHub <ArrowUpRight size={11} />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
            >
              <Linkedin size={14} /> LinkedIn <ArrowUpRight size={11} />
            </a>
            <span className="ml-auto hidden items-center gap-1.5 text-[11px] font-medium text-slate-400 sm:inline-flex">
              <Sparkles size={12} className="text-emerald-700" /> Portfolio Q&amp;A
            </span>
          </div>

          <div
            aria-live="polite"
            aria-relevant="additions text"
            role="log"
            className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-[#f8fbf9] to-white p-4 sm:p-5"
          >
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <span className="mb-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900">
                    <Bot size={15} />
                  </span>
                )}
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-emerald-900 text-white shadow-sm shadow-emerald-950/10'
                      : 'rounded-bl-md border border-slate-100 bg-white text-slate-700 shadow-[0_4px_18px_-12px_rgba(15,23,42,0.25)]'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <FormattedMessage content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && !busy && (
              <div className="pl-9 pt-1">
                <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Try asking</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void askQuestion(prompt)}
                      className="rounded-xl border border-emerald-100 bg-white px-3 py-2 text-left text-xs font-medium text-emerald-950 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {busy && (
              <div className="flex items-end gap-2" role="status" aria-label="Costas AI is responding">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-900">
                  <Bot size={15} />
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-100 bg-white px-4 py-3 shadow-sm">
                  <span className="text-xs text-slate-500">Thinking</span>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-700" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-700 [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-700 [animation-delay:240ms]" />
                </div>
              </div>
            )}
            <div ref={conversationEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-100 bg-white p-3 sm:p-4">
            <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-50">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about my work…"
                aria-label="Your message"
                autoComplete="off"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                maxLength={1000}
                disabled={busy}
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-white shadow-sm transition hover:bg-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={17} />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400">AI-generated responses may occasionally be inaccurate.</p>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Close Ask Costas AI' : 'Open Ask Costas AI'}
        aria-expanded={open}
        aria-controls="costas-ai-chat"
        className="fixed bottom-5 right-4 z-[201] inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-gradient-to-r from-[#06281e] to-emerald-800 px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_35px_-10px_rgba(6,78,59,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-900 hover:to-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 sm:right-5 sm:px-5"
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        <span>{open ? 'Close chat' : 'Ask Costas AI'}</span>
        {!open && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10"><Sparkles size={13} /></span>}
      </button>
    </>
  );
}
