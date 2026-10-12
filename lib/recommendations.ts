import { createClient } from '@/lib/supabase/server';

export type Recommendation = {
  id: string; reviewer_name: string; reviewer_role: string; organization: string;
  recommendation: string; profile_url: string | null; rating: number; created_at: string;
};

export async function getPublicRecommendations(): Promise<Recommendation[]> {
  try {
    const db = await createClient();
    const { data, error } = await db.from('recommendations')
      .select('id,reviewer_name,reviewer_role,organization,recommendation,profile_url,rating,created_at')
      .eq('is_approved', true).eq('is_published', true).order('created_at', { ascending: false }).limit(12);
    if (error) { console.error('Public recommendations query failed:', error.message); return []; }
    return (data ?? []) as Recommendation[];
  } catch (error) {
    console.error('Public recommendations are unavailable:', error instanceof Error ? error.message : 'unknown error');
    return [];
  }
}
