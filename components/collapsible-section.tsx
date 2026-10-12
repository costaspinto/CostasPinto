'use client';

import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type CollapsibleSectionProps = {
  children: ReactNode;
  className?: string;
  label?: string;
  summary?: string;
  defaultOpen?: boolean;
};

export function CollapsibleSection({
  children,
  className = '',
  label = 'Show more',
  summary,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={className}>
      <div hidden={!open}>{children}</div>
      {(!open && summary) && <p className="text-sm text-slate-500">{summary}</p>}
      <div className="collapsible-section-controls">
        <button type="button" className="expandable-toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          {open ? 'Show less' : label}
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      </div>
    </div>
  );
}
