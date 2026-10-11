/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight, Play, Youtube } from 'lucide-react';
import type { YouTubeVideo } from '@/lib/youtube';

function durationLabel(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function VideoCard({ video, isShort }: { video: YouTubeVideo; isShort: boolean }) {
  const published = video.published_at
    ? new Date(video.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'On YouTube';

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-slate-900/5">
      <a href={video.watch_url} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${video.title} on YouTube`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600">
        <div className={`relative overflow-hidden bg-slate-100 ${isShort ? 'aspect-[9/12]' : 'aspect-video'}`}>
          {video.thumbnail_url ? (
            <img src={video.thumbnail_url} alt={`Thumbnail: ${video.title}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400"><Youtube size={34} /></div>
          )}
          <span className="absolute bottom-3 right-3 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white">
            {durationLabel(video.duration_seconds)}
          </span>
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/15">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white opacity-95 shadow-lg transition group-hover:scale-110">
              <Play size={20} fill="currentColor" />
            </span>
          </span>
          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            {isShort ? 'Short' : 'Video'}
          </span>
        </div>
      </a>
      <div className="p-4 sm:p-5">
        <h4 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-slate-950 transition group-hover:text-red-700">{video.title}</h4>
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>{published}</span>
          <a href={video.watch_url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1 font-bold text-red-700 hover:text-red-800">Watch <ArrowUpRight size={13} /></a>
        </div>
      </div>
    </article>
  );
}

export function YouTubeSection({ videos }: { videos: YouTubeVideo[] }) {
  const shorts = videos.filter((video) => video.content_type === 'short');
  const regularVideos = videos.filter((video) => video.content_type === 'video');

  return (
    <section id="youtube" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.2em] text-red-700"><Youtube size={15} /> ArkByte · YouTube</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">Videos worth a watch.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">Short-form tech content and longer videos on AI, technology, and the things I’m learning and building.</p>
        </div>
        <a href="https://www.youtube.com/@ArkByteab" target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2">
          <Youtube size={17} /> Visit ArkByte <ArrowUpRight size={15} />
        </a>
      </div>

      {videos.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <Youtube className="mx-auto text-red-600" size={30} />
          <h3 className="mt-3 font-bold text-slate-900">Videos will appear here after the first sync.</h3>
          <p className="mt-2 text-sm text-slate-600">The channel is connected through the YouTube Data API. Visit ArkByte to watch content in the meantime.</p>
        </div>
      ) : (
        <div className="mt-10 space-y-14">
          {shorts.length > 0 && (
            <div>
              <div className="mb-5 flex items-end justify-between gap-3"><div><h3 className="text-2xl font-extrabold tracking-tight text-slate-950">Shorts</h3><p className="mt-1 text-sm text-slate-500">Quick ideas in seconds.</p></div><span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700">{shorts.length} synced</span></div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{shorts.slice(0, 10).map((video) => <VideoCard key={video.video_id} video={video} isShort />)}</div>
            </div>
          )}
          {regularVideos.length > 0 && (
            <div>
              <div className="mb-5 flex items-end justify-between gap-3"><div><h3 className="text-2xl font-extrabold tracking-tight text-slate-950">Videos</h3><p className="mt-1 text-sm text-slate-500">Longer walkthroughs and ideas.</p></div><span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">{regularVideos.length} synced</span></div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{regularVideos.slice(0, 9).map((video) => <VideoCard key={video.video_id} video={video} isShort={false} />)}</div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
