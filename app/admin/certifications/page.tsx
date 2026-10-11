

import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { CertificationsManager } from '../certifications-manager';
export const dynamic = 'force-dynamic';

type CertificationRow = {
  id: string;
  name: string;
  issuer: string;
  credential_url: string | null;
  issued_at: string | null;
  is_published: boolean;
  source: string;
};

type SearchParams = {
  status?: string;
  added?: string;
  updated?: string;
  failed?: string;
};

export default async function CertificationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const params = await searchParams;

  let rows: CertificationRow[] = [];
  let loadError = false;

  try {
    const db = createAdminClient();

    const { data, error } = await db
      .from('certifications')
      .select(
        'id,name,issuer,credential_url,issued_at,is_published,source'
      )
      .order('issued_at', {
        ascending: false,
        nullsFirst: false,
      })
      .order('name', { ascending: true });

    if (error) {
      console.error('Failed to load certifications:', error.message);
      loadError = true;
    } else {
      rows = (data ?? []) as CertificationRow[];
    }
  } catch (error) {
    console.error('Error loading certifications:', error);
    loadError = true;
  }

  let statusMessage: string | null = null;

  switch (params.status) {
    case 'imported':
      statusMessage = `Import complete: ${params.added ?? '0'} added, ${
        params.updated ?? '0'
      } updated, ${params.failed ?? '0'} failed.`;
      break;

    case 'invalid-file':
      statusMessage = 'Choose a CSV file smaller than 2 MB.';
      break;

    case 'invalid-columns':
      statusMessage =
        'The CSV needs a Name or Certification Name column.';
      break;

    case 'no-records':
      statusMessage = 'No certification rows were found in that CSV.';
      break;

    case 'database-error':
      statusMessage =
        'Could not read certifications. Check your Supabase table and server credentials.';
      break;
  }

  return (
    <CertificationsManager
      rows={rows}
      loadError={loadError}
      statusMessage={statusMessage}
    />
  );
}
