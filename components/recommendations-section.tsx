import Link from 'next/link';
import { Star, MessageSquareQuote, Send } from 'lucide-react';
import type { Recommendation } from '@/lib/recommendations';

export function RecommendationsSection({ items }: { items: Recommendation[] }) {
  return (
    <section
      id="recommendations"
      className="border-y border-emerald-900/40 bg-[#07110d] py-10 text-slate-100 sm:py-14"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-emerald-400">
              <MessageSquareQuote size={19} />
              <p className="text-xs font-bold uppercase tracking-[.18em]">
                Recommendations
              </p>
            </div>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              What people say
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Feedback from people who have worked with me. New submissions are reviewed before publication.
            </p>
          </div>

          <Link
            href="/feedback"
            className="inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-full border border-emerald-600/40 bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07110d]"
          >
            <Send size={16} />
            Write a Recommendation
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-emerald-900/50 bg-[#0c1712] p-6 transition hover:-translate-y-1 hover:border-emerald-700 hover:bg-[#0e1d15] hover:shadow-lg"
              >
                <div
                  className="flex gap-1 text-amber-400"
                  aria-label={`${item.rating} out of 5 stars`}
                >
                  {Array.from({ length: item.rating }, (_, i) => (
                    <Star key={i} size={15} fill="currentColor" />
                  ))}
                </div>

                <blockquote className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  &ldquo;{item.recommendation}&rdquo;
                </blockquote>

                <div className="mt-5 border-t border-emerald-900/50 pt-4">
                  <p className="font-bold text-white">{item.reviewer_name}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {[item.reviewer_role, item.organization].filter(Boolean).join(' · ')}
                  </p>

                  {item.profile_url && (
                    <a
                      className="mt-2 inline-block text-xs font-semibold text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
                      href={item.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View profile
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-5 flex flex-col items-start gap-4 rounded-2xl border border-dashed border-emerald-800/60 bg-[#0c1712] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
            <div>
              <p className="font-bold text-white">
                Be the first to share your experience
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Worked with me? Share your feedback and help others learn about the experience.
              </p>
            </div>
          </div>
        )}

        <p className="mt-5 text-xs leading-5 text-slate-500">
          All submissions are reviewed before appearing publicly.
        </p>
      </div>
    </section>
  );
}

