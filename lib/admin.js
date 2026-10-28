import { currentUser } from '@clerk/nextjs/server';

export async function isAdmin() {
  try {
    const u = await currentUser();
    if (!u) return false;
    const rawList = process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'tiwaridevesh745@gmail.com, ashokcho2005@gmail.com';
    const list = rawList
      .toLowerCase()
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    return (u.emailAddresses || []).some(e => list.includes((e?.emailAddress || '').toLowerCase()));
  } catch (err) {
    console.error('isAdmin check error:', err);
    return false;
  }
}
