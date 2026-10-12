'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type ExpandableTextProps = {
  text: string;
  className?: string;
  collapsedClassName?: string;
  label?: string;
  fallback?: string;
};

export function ExpandableText({
  text,
  className = '',
  collapsedClassName = '',
  label = 'Know more',
  fallback = '',
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const value = text?.trim() || fallback;
  if (!value) return null;

  const canExpand = value.length > 180 || value.split('\n').length > 2;
  return (
    <div className={className}>
      <p className={expanded ? 'expandable-copy' : `expandable-copy expandable-copy--collapsed ${collapsedClassName}`}>
        {value}
      </p>
      {canExpand && (
        <button
          type="button"
          className="expandable-toggle"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? 'Show less' : label}
          {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      )}
    </div>
  );
}
