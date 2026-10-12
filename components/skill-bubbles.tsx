'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

type SkillBubblesProps = {
  skills: string[];
  technologiesByProject?: Array<{ name: string; technologies: string[] }>;
};

const groups: Array<{ label: string; match: RegExp }> = [
  { label: 'Languages', match: /python|javascript|typescript|java|sql|html|css|bash|r\b/i },
  { label: 'AI / ML', match: /machine learning|deep learning|artificial intelligence|generative ai|llm|rag|nlp|computer vision|reinforcement|xgboost|resnet|lstm|pytorch|tensorflow|keras|scikit|hugging face|transformers|langchain|faiss|chromadb|vector/i },
  { label: 'Frameworks & APIs', match: /fastapi|flask|streamlit|react|next\.js|node\.js|express|tailwind|rest api/i },
  { label: 'Data & Cloud', match: /sql|postgres|supabase|mongodb|pandas|numpy|aws|azure|google cloud|oracle cloud|docker|vercel|github actions|git/i },
];

function uniqueSkills(skills: string[]) {
  const map = new Map<string, string>();
  for (const skill of skills) {
    const clean = skill.trim();
    if (clean) map.set(clean.toLowerCase(), clean);
  }
  return [...map.values()].sort((a, b) => a.localeCompare(b));
}

export function SkillBubbles({ skills, technologiesByProject = [] }: SkillBubblesProps) {
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState(false);
  const merged = useMemo(() => uniqueSkills([
    ...skills,
    ...technologiesByProject.flatMap((project) => project.technologies),
  ]), [skills, technologiesByProject]);
  const categorized = useMemo(() => merged.map((skill) => ({
    name: skill,
    group: groups.find((item) => item.match.test(skill))?.label ?? 'Other tools',
  })), [merged]);
  const categories = ['All', ...groups.map((group) => group.label), 'Other tools'];
  const selected = categorized.filter((skill) => category === 'All' || skill.group === category);
  const visible = expanded ? selected : selected.slice(0, 18);

  return (
    <div className="skill-bubbles">
      <div className="skill-bubbles__filters" aria-label="Filter skills by category">
        <span className="skill-bubbles__filter-icon"><Filter size={15} /> Filter</span>
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={category === item ? 'skill-filter skill-filter--active' : 'skill-filter'}
            onClick={() => { setCategory(item); setExpanded(false); }}
            aria-pressed={category === item}
          >{item}</button>
        ))}
      </div>
      <div className="skill-bubbles__cloud">
        {visible.map((skill, index) => (
          <span key={skill.name} className={`skill-bubble skill-bubble--${index % 5}`} title={skill.group}>
            <span className="skill-bubble__dot" aria-hidden="true" />
            {skill.name}
          </span>
        ))}
      </div>
      {selected.length > 18 && (
        <button type="button" className="skill-bubbles__more" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded}>
          {expanded ? 'Show fewer skills' : `Show all ${selected.length} skills`}
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      )}
      <p className="skill-bubbles__hint">Project-linked technologies are combined with your manually curated skills. Categories are inferred from names; review them in admin for the final word.</p>
    </div>
  );
}
