export type Project = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  technologies: string[];
  repository_url: string | null;
  demo_url: string | null;
  image_path: string | null;
  featured: boolean;
  is_published: boolean;
  source: string;
  source_id: string | null;
  updated_at: string;
};

export type PortfolioProfile = {
  id: string;
  slug: string;
  full_name: string;
  headline: string;
  hero_title: string;
  hero_description: string;
  about_title: string;
  summary: string;
  location: string;
  email: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  resume_path: string | null;
  avatar_url: string | null;
  is_published: boolean;
  source: string;
  updated_at: string;
};

export type AIKnowledgeEntry = {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SyncStatus = {
  provider: 'github' | 'linkedin';
  status: 'success' | 'failed' | 'not_configured' | 'partial_failure';
  records_seen: number;
  records_changed: number;
  message?: string;
  finished_at?: string;
};
