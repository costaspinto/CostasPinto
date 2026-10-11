'use server';

import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';

type CsvCertification = {
  name: string;
  issuer: string;
  issued_at: string | null;
  expires_at: string | null;
  credential_url: string | null;
  source_id: string | null;
};

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      row.push(cell.trim());
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell.trim());
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some((value) => value.length > 0)) rows.push(row);
  return rows;
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase().replace(/[\s_-]+/g, ' ');
}

function getColumn(headers: string[], aliases: string[]): number {
  return headers.findIndex((header) => aliases.includes(header));
}

function cell(row: string[], index: number): string {
  return index >= 0 ? (row[index] ?? '').trim() : '';
}

function parseDate(value: string): string | null {
  if (!value) return null;
  const clean = value.trim();
  const direct = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (direct) return `${direct[1]}-${direct[2].padStart(2, '0')}-${direct[3].padStart(2, '0')}`;

  const monthYear = clean.match(/^([A-Za-z]{3,9})\s+(\d{4})$/);
  if (monthYear) {
    const date = new Date(`${monthYear[1]} 1, ${monthYear[2]}`);
    if (!Number.isNaN(date.getTime())) {
      return `${monthYear[2]}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    }
  }

  const parsed = new Date(clean);
  if (Number.isNaN(parsed.getTime())) return null;
  return `${parsed.getUTCFullYear()}-${String(parsed.getUTCMonth() + 1).padStart(2, '0')}-${String(parsed.getUTCDate()).padStart(2, '0')}`;
}

function readCertifications(csv: string): CsvCertification[] {
  const rows = parseCsv(csv.replace(/^\uFEFF/, ''));
  if (rows.length < 2) return [];
  const headers = rows[0].map(normalizeHeader);
  const nameIndex = getColumn(headers, ['name', 'certification name', 'certificate name', 'certification']);
  const issuerIndex = getColumn(headers, ['issuing organization', 'issuing organisation', 'issuer', 'organization', 'organisation']);
  const issuedIndex = getColumn(headers, ['issue date', 'issued at', 'date issued', 'issued date']);
  const expiresIndex = getColumn(headers, ['expiration date', 'expiry date', 'expires at', 'expiration']);
  const urlIndex = getColumn(headers, ['credential url', 'credential link', 'url', 'credential url']);
  const idIndex = getColumn(headers, ['credential id', 'credential identifier', 'id']);

  if (nameIndex < 0) throw new Error('CSV must contain a Name or Certification Name column.');

  return rows.slice(1, 501).map((row) => ({
    name: cell(row, nameIndex).slice(0, 250),
    issuer: cell(row, issuerIndex).slice(0, 200),
    issued_at: parseDate(cell(row, issuedIndex)),
    expires_at: parseDate(cell(row, expiresIndex)),
    credential_url: cell(row, urlIndex).slice(0, 1000) || null,
    source_id: cell(row, idIndex).slice(0, 250) || null,
  })).filter((item) => item.name.length > 0);
}

export async function importCertificationsCsv(formData: FormData) {
  await requireAdmin();

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0 || file.size > 2_000_000) {
    redirect('/admin/certifications?status=invalid-file');
  }

  let records: CsvCertification[];
  try {
    records = readCertifications(await file.text());
  } catch (error) {
    const status = error instanceof Error && error.message.includes('must contain')
      ? 'invalid-columns'
      : 'invalid-file';
    redirect(`/admin/certifications?status=${status}`);
  }

  if (records.length === 0) redirect('/admin/certifications?status=no-records');

  const db = createAdminClient();
  const { data: existing, error: readError } = await db
    .from('certifications')
    .select('id,name,issuer,credential_url,source_id,issued_at,expires_at');
  if (readError) {
    console.error('Certification import lookup failed:', readError.message);
    redirect('/admin/certifications?status=database-error');
  }

  const existingRows = existing ?? [];
  let added = 0;
  let updated = 0;
  let failed = 0;

  for (const record of records) {
    const match = existingRows.find((item) =>
      (record.source_id && item.source_id && item.source_id === record.source_id) ||
      (record.credential_url && item.credential_url && item.credential_url === record.credential_url) ||
      (item.name.trim().toLowerCase() === record.name.trim().toLowerCase() &&
        (item.issuer ?? '').trim().toLowerCase() === record.issuer.trim().toLowerCase()),
    );

    const payload = {
      ...record,
      issued_at: record.issued_at ?? match?.issued_at ?? null,
      expires_at: record.expires_at ?? match?.expires_at ?? null,
      credential_url: record.credential_url ?? match?.credential_url ?? null,
      source_id: record.source_id ?? match?.source_id ?? null,
      source: 'csv_import',
      is_published: true,
      updated_at: new Date().toISOString(),
    };

    const result = match
      ? await db.from('certifications').update(payload).eq('id', match.id)
      : await db.from('certifications').insert(payload);

    if (result.error) {
      failed += 1;
      console.error('Certification import row failed:', result.error.message);
    } else if (match) {
      updated += 1;
    } else {
      added += 1;
      existingRows.push({ ...record, id: `imported-${added}` });
    }
  }

  redirect(`/admin/certifications?status=imported&added=${added}&updated=${updated}&failed=${failed}`);
}
