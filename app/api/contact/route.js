import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req) {
  try {
    const data = await req.json();
    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const phone = String(data.phone || '').trim();
    const message = String(data.message || '').trim();

    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email || !email.includes('@')) errors.email = 'A valid email is required';
    if (!message || message.length < 5) errors.message = 'Message must be at least 5 characters';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    await db.run(
      'INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message]
    );

    return NextResponse.json({
      success: true,
      message: 'Your message has been received! Our support team will get in touch shortly.'
    });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { success: false, error: 'Database error. Please try again.' },
      { status: 500 }
    );
  }
}
