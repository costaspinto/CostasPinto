
'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { Bot, Send, X, Github, Linkedin, ExternalLink } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const GITHUB_URL = 'https://github.com/costaspinto';
const LINKEDIN_URL = 'https://www.linkedin.com/in/costaspinto/';

function formatInline(text: string): ReactNode[] {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content
    .replace(/\r\n/g, '\n')
    .split('\n');

  return (
    <div className="space-y-2 break-words">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) return <div key={index} className="h-1" />;

        if (/^[-*•]\s/.test(trimmed)) {
          return (
            <div key={index} className="flex gap-2 pl-1">
              <span aria-hidden="true">•</span>
              <span>{formatInline(trimmed.replace(/^[-*•]\s+/, ''))}</span>
            </div>
          );
        }

        if (/^\d+[.)]\s/.test(trimmed)) {
          return (
            <div key={index} className="flex gap-2 pl-1">
              <span className="font-medium text-forest">
                {trimmed.match(/^\d+[.)]/)?.[0]}
              </span>
              <span>{formatInline(trimmed.replace(/^\d+[.)]\s+/, ''))}</span>
            </div>
          );
        }

        if (trimmed.startsWith('### ')) {
          return (
            <p key={index} className="pt-1 font-semibold">
              {formatInline(trimmed.slice(4))}
            </p>
          );
        }

        if (trimmed.startsWith('## ')) {
          return (
            <p key={index} className="pt-1 font-semibold">
              {formatInline(trimmed.slice(3))}
            </p>
          );
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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hi! I’m Costas’s portfolio assistant. Ask me about his AI projects, technical skills, education, or experience.',
    },
  ]);

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const text = input.trim();
    if (!text || busy) return;

    const next: Message[] = [
      ...messages,
      { role: 'user', content: text },
    ];

    setMessages(next);
    setInput('');
    setBusy(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });

      const data = await response.json();

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
    } catch (err) {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content:
            err instanceof Error
              ? err.message
              : 'I couldn’t respond right now. Please try again.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {open && (
        <section
          aria-label="Ask Costas AI chat"
          className="fixed bottom-24 right-4 z-50 flex h-[min(640px,78vh)] w-[min(410px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between bg-ink p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/10 p-2">
                <Bot size={21} />
              </div>
              <div>
                <p className="font-semibold">Ask Costas AI</p>
                <p className="text-xs text-emerald-100">
                  Portfolio assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-2 transition hover:bg-white/10"
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-ink transition hover:border-forest hover:text-forest"
            >
              <Github size={14} />
              GitHub
              <ExternalLink size={11} />
            </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-ink transition hover:border-forest hover:text-forest"
            >
              <Linkedin size={14} />
              LinkedIn
              <ExternalLink size={11} />
            </a>
          </div>

          <div
            aria-live="polite"
            className="flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'rounded-br-md bg-forest text-white'
                      : 'rounded-bl-md border border-slate-100 bg-white text-ink shadow-sm'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <FormattedMessage content={message.content} />
                  ) : (
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-slate-100 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  Costas AI is thinking…
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my work…"
              aria-label="Your message"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-emerald-50"
              maxLength={1000}
            />

            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close Ask Costas AI' : 'Open Ask Costas AI'}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-forest px-5 py-4 font-semibold text-white shadow-xl transition hover:-translate-y-1 hover:bg-ink"
      >
        {open ? <X size={19} /> : <Bot size={20} />}
        <span>{open ? 'Close chat' : 'Ask Costas AI'}</span>
      </button>
    </>
  );
}
