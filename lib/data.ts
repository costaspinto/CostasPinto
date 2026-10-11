import { createClient } from '@/lib/supabase/server';

export type PortfolioProject = {

  id?: string;

  name: string;

  category: string;

  description: string;

  stack: string[];

  href: string;

  demoUrl?: string | null;

  featured?: boolean;

};

export type PortfolioEducation = {

  name: string;

  detail: string;

  institution: string;

  period: string;

};

export type PortfolioExperience = {

  role: string;

  organization: string;

  description: string;

  period: string;

};

export type PortfolioCertification = {

  name: string;

  issuer: string;

  credentialUrl?: string | null;

  issuedAt?: string | null;

};

export type PortfolioData = {

  name: string;

  headline: string;

  heroTitle: string;

  heroDescription: string;

  aboutTitle: string;

  location: string;

  summary: string;

  projectsEyebrow: string;

  projectsTitle: string;

  projectsDescription: string;

  avatarUrl?: string | null;
  resumeUrl?: string | null;

  email?: string | null;

  links: { linkedin: string; github: string; portfolio: string };

  skills: string[];

  projects: PortfolioProject[];

  education: PortfolioEducation[];

  experience: PortfolioExperience[];

  certifications: PortfolioCertification[];

};

export const fallbackProfile: PortfolioData = {

  name: 'Costas Pinto',

  headline: 'AI/ML Engineer | Generative AI | LLM Applications',

  heroTitle: 'I build AI that\ndoes useful things.',

  heroDescription: 'I build practical AI and machine learning applications, with a focus on generative AI, LLM-powered tools, and turning experiments into useful products.',

  aboutTitle: 'Curious by nature. Practical by design.',

  location: 'Maharashtra, India',

  summary: 'I build practical AI and machine learning applications, with a focus on generative AI, LLM-powered tools, and turning experiments into useful products.',

  projectsEyebrow: 'Selected work',

  projectsTitle: 'Projects with a purpose.',

  projectsDescription: 'Explore selected AI/ML applications and featured projects.',

  avatarUrl: null,
  resumeUrl: null,

  email: null,

  links: {

    linkedin: 'https\://www\.linkedin.com/in/costaspinto/',

    github: 'https\://github.com/costaspinto',

    portfolio: 'https\://costas-portfolio-ai.vercel.app/',

  },

  skills: [

    'Python', 'TypeScript', 'SQL', 'Machine Learning', 'Deep Learning',

    'LLMs', 'RAG', 'LangChain', 'Hugging Face', 'PyTorch', 'TensorFlow',

    'FastAPI', 'Streamlit',

  ],

  projects: [

    {

      name: 'DocuReadAI', category: 'Generative AI',

      description: 'A retrieval-augmented generation application designed to help users query document content.',

      stack: ['RAG', 'LLMs', 'Vector Search'], href: 'https\://github.com/costaspinto',

    },

    {

      name: 'WildScan', category: 'Computer Vision',

      description: 'An image-classification project using a ResNet50-based approach.',

      stack: ['Python', 'ResNet50', 'Deep Learning'], href: 'https\://github.com/costaspinto',

    },

    {

      name: 'PulmoProbe AI', category: 'Applied ML',

      description: 'A predictive-analysis application built with an XGBoost model.',

      stack: ['Python', 'XGBoost', 'Streamlit'], href: 'https\://github.com/costaspinto',

    },

    {

      name: 'FutureSTOCK', category: 'Time Series',

      description: 'A stock time-series exploration project with an interactive Streamlit interface.',

      stack: ['LSTM', 'Python', 'Streamlit'], href: 'https\://github.com/costaspinto',

    },

  ],

  education: [

    { name: 'Master of Computer Applications', detail: 'Artificial Intelligence & Machine Learning', institution: 'Manipal University Jaipur', period: '2024–2026' },

    { name: 'Bachelor of Science', detail: 'Computer Science', institution: 'Shivaji University, Kolhapur', period: '2016–2019' },

  ],

  experience: [],

  certifications: [],

};

const hasSupabaseConfig = () => Boolean(

  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,

);

function period(start?: string | null, end?: string | null, current = false) {

  const fmt = (value?: string | null) => value ? value.slice(0, 4) : '';

  const first = fmt(start);

  const last = current ? 'Present' : fmt(end);

  return [first, last].filter(Boolean).join(' – ');

}

const SKILL_ALIASES: Record<string, string> = {

  'python': 'Python',

  'javascript': 'JavaScript',

  'typescript': 'TypeScript',

  'sql': 'SQL',

  'java': 'Java',

  'html': 'HTML',

  'css': 'CSS',

  'machine learning': 'Machine Learning',

  'deep learning': 'Deep Learning',

  'artificial intelligence': 'Artificial Intelligence',

  'generative ai': 'Generative AI',

  'large language models': 'LLMs',

  'llm': 'LLMs',

  'llms': 'LLMs',

  'rag': 'RAG',

  'retrieval-augmented generation': 'RAG',

  'langchain': 'LangChain',

  'hugging face': 'Hugging Face',

  'pytorch': 'PyTorch',

  'tensorflow': 'TensorFlow',

  'keras': 'Keras',

  'scikit-learn': 'Scikit-learn',

  'sklearn': 'Scikit-learn',

  'xgboost': 'XGBoost',

  'computer vision': 'Computer Vision',

  'natural language processing': 'NLP',

  'nlp': 'NLP',

  'reinforcement learning': 'Reinforcement Learning',

  'fastapi': 'FastAPI',

  'flask': 'Flask',

  'streamlit': 'Streamlit',

  'react': 'React',

  'next.js': 'Next.js',

  'nextjs': 'Next.js',

  'node.js': 'Node.js',

  'nodejs': 'Node.js',

  'docker': 'Docker',

  'git': 'Git',

  'github': 'GitHub',

  'aws': 'AWS',

  'amazon bedrock': 'Amazon Bedrock',

  'cloud computing': 'Cloud Computing',

  'google cloud': 'Google Cloud',

  'vertex ai': 'Vertex AI',

  'oracle cloud': 'Oracle Cloud Infrastructure',

  'data science': 'Data Science',

  'data analytics': 'Data Analytics',

  'pandas': 'Pandas',

  'numpy': 'NumPy',

  'transformers': 'Transformers',

  'prompt engineering': 'Prompt Engineering',

  'ai agents': 'AI Agents',

  'fine-tuning': 'LLM Fine-tuning',

};

function deriveSkills(

  existingSkills: string[],

  repositoryMetadata: Array<{

    language: string | null;

    topics: string[] | null;

  }>,

  certificationNames: string[],

): string[] {

  const skills = new Map<string, string>();

  const addSkill = (value: string) => {

    const normalized = value.trim().toLowerCase();

    const canonical = SKILL_ALIASES[normalized];

    if (canonical) {

      skills.set(canonical.toLowerCase(), canonical);

    }

  };

  for (const value of existingSkills) {

    const trimmed = value.trim();

    if (!trimmed) continue;

    const normalized = trimmed.toLowerCase();

    const canonical = SKILL_ALIASES[normalized] ?? trimmed;

    skills.set(canonical.toLowerCase(), canonical);

  }

  for (const repo of repositoryMetadata) {

    if (repo.language) addSkill(repo.language);

    for (const topic of repo.topics ?? []) addSkill(topic);

  }

  for (const certification of certificationNames) {

    const title = certification.toLowerCase();

    for (const [keyword, canonical] of Object.entries(SKILL_ALIASES)) {

      if (title.includes(keyword)) {

        skills.set(canonical.toLowerCase(), canonical);

      }

    }

  }

  return Array.from(skills.values()).sort((a, b) =>

    a.localeCompare(b),

  );

}

export async function getPortfolioData(): Promise<PortfolioData> {

  if (!hasSupabaseConfig()) return fallbackProfile;

  try {

    const supabase = await createClient();

    const [

      profileResult,

      projectsResult,

      skillsResult,

      educationResult,

      experienceResult,

      certificationResult,

      githubSkillsResult,

    ] = await Promise.all([

      supabase.from('profile').select('*').eq('is_published', true).order('updated_at', { ascending: false }).limit(1).maybeSingle(),

      supabase.from('projects').select('*').eq('is_published', true).eq('featured', true).order('updated_at', { ascending: false }).limit(4),

      supabase.from('skills').select('*').eq('is_published', true).order('sort_order', { ascending: true }),

      supabase.from('education').select('*').eq('is_published', true).order('end_date', { ascending: false }),

      supabase.from('experiences').select('*').eq('is_published', true).order('start_date', { ascending: false }),

      supabase.from('certifications').select('*').eq('is_published', true).order('issued_at', { ascending: false }),

      supabase.from('github_repos').select('language,topics').eq('is_published', true),

    ]);

    type ProfileRecord = { full_name?: string | null; headline?: string | null; hero_title?: string | null; hero_description?: string | null; about_title?: string | null; location?: string | null; summary?: string | null; projects_eyebrow?: string | null; projects_title?: string | null; projects_description?: string | null; email?: string | null; avatar_url?: string | null; linkedin_url?: string | null; github_url?: string | null };

    type ProjectRecord = { id: string; name: string; category: string | null; description: string | null; technologies: string[] | null; repository_url: string | null; demo_url: string | null; featured: boolean | null };

    type SkillRecord = { name: string };

    type EducationRecord = { qualification: string; field_of_study: string | null; description: string | null; institution: string; start_date: string | null; end_date: string | null };

    type ExperienceRecord = { role: string; organization: string; description: string | null; start_date: string | null; end_date: string | null; is_current: boolean | null };

    type CertificationRecord = { name: string; issuer: string; credential_url: string | null; issued_at: string | null };

    const dbProfile = profileResult.data as ProfileRecord | null;

    const dbProjects = ((projectsResult.data ?? []) as ProjectRecord[]).map((item) => ({

      id: item.id,

      name: item.name,

      category: item.category || 'Project',

      description: item.description || 'Project details coming soon.',

      stack: Array.isArray(item.technologies) ? item.technologies : [],

      href: item.repository_url || item.demo_url || fallbackProfile.links.github,

      demoUrl: item.demo_url,

      featured: Boolean(item.featured),

    }));

    const dbSkills = ((skillsResult.data ?? []) as SkillRecord[])

      .map((item) => item.name)

      .filter(Boolean);

    const repositoryMetadata = (githubSkillsResult.data ?? []) as Array<{

      language: string | null;

      topics: string[] | null;

    }>;

    const certificationNames = (

      (certificationResult.data ?? []) as CertificationRecord[]

    ).map((item) => item.name);

    const combinedSkills = deriveSkills(

      dbSkills.length ? dbSkills : fallbackProfile.skills,

      repositoryMetadata,

      certificationNames,

    );

    const dbEducation = ((educationResult.data ?? []) as EducationRecord[]).map((item) => ({

      name: item.qualification,

      detail: item.field_of_study || item.description || '',

      institution: item.institution,

      period: period(item.start_date, item.end_date),

    }));

    const dbExperience = ((experienceResult.data ?? []) as ExperienceRecord[]).map((item) => ({

      role: item.role,

      organization: item.organization,

      description: item.description || '',

      period: period(item.start_date, item.end_date, Boolean(item.is_current)),

    }));

    const dbCertifications = ((certificationResult.data ?? []) as CertificationRecord[]).map((item) => ({

      name: item.name,

      issuer: item.issuer,

      credentialUrl: item.credential_url,

      issuedAt: item.issued_at,

    }));

    return {

      ...fallbackProfile,

      name: dbProfile?.full_name || fallbackProfile.name,

      headline: dbProfile?.headline || fallbackProfile.headline,

      heroTitle: dbProfile?.hero_title || fallbackProfile.heroTitle,

      heroDescription: dbProfile?.hero_description || fallbackProfile.heroDescription,

      aboutTitle: dbProfile?.about_title || fallbackProfile.aboutTitle,

      location: dbProfile?.location || fallbackProfile.location,

      summary: dbProfile?.summary || fallbackProfile.summary,

      projectsEyebrow: dbProfile?.projects_eyebrow || fallbackProfile.projectsEyebrow,

      projectsTitle: dbProfile?.projects_title || fallbackProfile.projectsTitle,

      projectsDescription: dbProfile?.projects_description || fallbackProfile.projectsDescription,

      email: dbProfile?.email || fallbackProfile.email,

      avatarUrl: dbProfile?.avatar_url || fallbackProfile.avatarUrl,
      resumeUrl: (dbProfile as { resume_path?: string | null } | null)?.resume_path ?? null,

      links: {

        linkedin: dbProfile?.linkedin_url || fallbackProfile.links.linkedin,

        github: dbProfile?.github_url || fallbackProfile.links.github,

        portfolio: process.env.NEXT_PUBLIC_SITE_URL || fallbackProfile.links.portfolio,

      },

      projects: (dbProjects.length ? dbProjects : fallbackProfile.projects).slice(0, 4),

      skills: combinedSkills,

      // Only published Supabase records appear on the public portfolio.
      education: dbEducation,

      experience: dbExperience,

      certifications: dbCertifications,

    };

  } catch (error) {

    console.error('Portfolio data read failed; using fallback data.', error);

    // Keep education and experience data-driven even if Supabase is temporarily unavailable.
    return { ...fallbackProfile, education: [], experience: [] };

  }

}

export async function getPublicAssistantKnowledge(): Promise<Array<{ title: string; content: string }>> {

  if (!hasSupabaseConfig()) return [];

  try {

    const supabase = await createClient();

    const { data, error } = await supabase

      .from('ai_knowledge')

      .select('title,content')

      .eq('is_published', true)

      .order('sort_order', { ascending: true })

      .limit(30);

    if (error) return [];

    return ((data ?? []) as Array<{ title: string; content: string }>).map((item) => ({ title: item.title, content: item.content }));

  } catch {

    return [];

  }

}

export type GitHubRepository = {

  github_id: number;

  name: string;

  full_name: string;

  description: string | null;

  html_url: string;

  homepage: string | null;

  language: string | null;

  topics: string[];

  stargazers_count: number;

  forks_count: number;

  is_fork: boolean;

  is_archived: boolean;

  is_featured: boolean;

};

export async function getGitHubRepositories(): Promise<GitHubRepository[]> {

  if (!hasSupabaseConfig()) return [];

  try {

    const supabase = await createClient();

    const { data, error } = await supabase

      .from('github_repos')

      .select(

        'github_id,name,full_name,description,html_url,homepage,language,topics,stargazers_count,forks_count,is_fork,is_archived,is_featured',

      )

      .eq('is_published', true)

      .order('is_featured', { ascending: false })

      .order('stargazers_count', { ascending: false })

      .order('name', { ascending: true });

    if (error) {

      console.error('GitHub repository read failed:', error.message);

      return [];

    }

    return (data ?? []) as GitHubRepository[];

  } catch (error) {

    console.error('GitHub repository read failed:', error);

    return [];

  }

}
