import { ArrowDownToLine, ExternalLink, FileText, Eye } from 'lucide-react';

type ResumeLinks = {
  previewUrl: string;
  downloadUrl: string;
};

/** Derive Google Drive preview/download URLs from an admin-managed share link. */
function getResumeLinks(rawUrl?: string | null): ResumeLinks | null {
  if (!rawUrl?.trim()) return null;

  try {
    const url = new URL(rawUrl.trim());
    const host = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || !['drive.google.com', 'docs.google.com'].includes(host)) {
      return null;
    }

    const idFromPath = url.pathname.match(/\/(?:file|document|spreadsheets|presentation)\/d\/([^/]+)/)?.[1];
    const fileId = idFromPath ?? url.searchParams.get('id');
    if (!fileId) return null;

    const id = encodeURIComponent(fileId);
    const googleDocMatch = url.pathname.match(/\/(document|spreadsheets|presentation)\/d\//);
    const docType = googleDocMatch?.[1];

    if (docType && host === 'docs.google.com') {
      const base = `https://docs.google.com/${docType}/d/${id}`;
      return {
        previewUrl: `${base}/preview`,
        downloadUrl: `${base}/export?format=pdf`,
      };
    }

    return {
      previewUrl: `https://drive.google.com/file/d/${id}/preview`,
      downloadUrl: `https://drive.google.com/uc?export=download&id=${id}`,
    };
  } catch {
    return null;
  }
}

export function ResumeActions({ resumeUrl }: { resumeUrl?: string | null }) {
  const links = getResumeLinks(resumeUrl);
  if (!links) return null;

  return (
    <div id="resume" className="mt-4 flex flex-wrap items-center gap-3" aria-label="Resume links">
      <a
        href={links.previewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white px-5 py-3 text-sm font-semibold text-emerald-950 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-700 hover:bg-emerald-50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        aria-label="Preview resume in a new tab"
      >
        <Eye size={17} className="text-emerald-800" />
        Preview resume
        <ExternalLink size={14} className="text-slate-400 transition-colors group-hover:text-emerald-800" />
      </a>
      <a
        href={links.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-950/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2"
        aria-label="Download resume"
      >
        <ArrowDownToLine size={17} />
        Download resume
        <FileText size={14} className="text-emerald-100 transition-transform group-hover:translate-y-0.5" />
      </a>
    </div>
  );
}
