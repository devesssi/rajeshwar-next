import { currentUser } from '@clerk/nextjs/server';
export async function isAdmin() {
  const u = await currentUser(); if (!u) return false;
  const list = (process.env.ADMIN_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  return (u.emailAddresses || []).some(e => list.includes((e?.emailAddress || '').toLowerCase()));
}
