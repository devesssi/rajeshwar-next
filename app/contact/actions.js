'use server';
import db from '@/lib/db';

export async function submitContactMessage(prevState, formData) {
  try {
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const message = String(formData.get('message') || '').trim();

    const errors = {};
    if (!name) errors.name = 'Name is required';
    if (!email || !email.includes('@')) errors.email = 'A valid email address is required';
    if (!message || message.length < 5) errors.message = 'Please provide a message of at least 5 characters';

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    await db.run(
      'INSERT INTO messages (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone, message]
    );

    return { success: true, message: 'Message sent! Our support team will get in touch shortly.' };
  } catch (err) {
    console.error('Contact form error:', err);
    return { success: false, error: 'Failed to record message. Please try again or reach out on WhatsApp.' };
  }
}
