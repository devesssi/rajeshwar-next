import { auth, currentUser } from '@clerk/nextjs/server';
import db from '@/lib/db';

const WHATSAPP_NUMBER = '919321009638';

export function buildWhatsAppMessage({ orderId, email, items, amount }) {
  const itemLines = items.map((i, idx) => {
    const partNo = i.part_no ? ` (${i.part_no})` : '';
    const unitPrice = Number(i.price || 0).toLocaleString('en-IN');
    const subtotal = (Number(i.price || 0) * Number(i.qty || 1)).toLocaleString('en-IN');
    return `${idx + 1}. *${i.name}*${partNo}\n   Qty: ${i.qty} × ₹${unitPrice} = ₹${subtotal}`;
  });

  const lines = [
    `🛒 *New Order - Rajeshwar Infotech*`,
    `*Order #:* ${orderId}`,
    `*Customer:* ${email || 'Customer'}`,
    `*Date:* ${new Date().toLocaleDateString('en-IN')}`,
    `────────────────────`,
    `*Items Ordered:*`,
    ...itemLines,
    `────────────────────`,
    `*Total Amount:* ₹${Number(amount || 0).toLocaleString('en-IN')}`,
    `────────────────────`,
    `Please confirm my order and share delivery / payment details. Thank you!`
  ];
  return lines.join('\n');
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return Response.json({ error: 'Sign in required' }, { status: 401 });

    const { items = [], demo = true } = await req.json();

    const rows = [];
    for (const i of items) {
      const p = await db.get('SELECT id, name, part_no, price FROM products WHERE id = ?', [i.id]);
      if (p) {
        rows.push({
          p,
          q: Math.max(1, parseInt(i.qty) || 1)
        });
      }
    }

    if (!rows.length) return Response.json({ error: 'Cart is empty' }, { status: 400 });

    const amount = rows.reduce((s, r) => s + (Number(r.p.price) || 0) * r.q, 0);
    const u = await currentUser();
    const email = u?.emailAddresses?.[0]?.emailAddress || '';

    const itemDetails = rows.map(r => ({
      id: r.p.id,
      name: r.p.name,
      part_no: r.p.part_no,
      qty: r.q,
      price: r.p.price
    }));

    const status = demo ? 'Paid' : 'WhatsApp Order';
    const paymentDesc = demo ? 'Demo Payment' : 'WhatsApp (+91 93210 09638)';

    const info = await db.run(
      "INSERT INTO orders(user_id, email, items, amount, status, rp_order, rp_payment) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        email,
        JSON.stringify(itemDetails),
        amount,
        status,
        'ORD-' + Date.now(),
        paymentDesc
      ]
    );

    const orderId = info.lastInsertRowid;
    const message = buildWhatsAppMessage({ orderId, email, items: itemDetails, amount });
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    return Response.json({
      ok: true,
      orderId,
      amount,
      status,
      whatsappNumber: WHATSAPP_NUMBER,
      whatsappUrl
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return Response.json({ error: 'Checkout server error. Please try again.' }, { status: 500 });
  }
}
