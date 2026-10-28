import { auth } from '@clerk/nextjs/server';
import db from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'My Orders – Rajeshwar Infotech',
  description: 'View and track your past hardware orders, invoices, and delivery status.'
};

const WHATSAPP_NUMBER = '919321009638';

function getWhatsAppUrl(o) {
  let items = [];
  try {
    items = JSON.parse(o.items || '[]');
  } catch {}
  const itemLines = items.map((i, idx) => {
    const partNo = i.part_no ? ` (${i.part_no})` : '';
    const unitPrice = (i.price || 0).toLocaleString('en-IN');
    const subtotal = ((i.price || 0) * (i.qty || 1)).toLocaleString('en-IN');
    return `${idx + 1}. *${i.name}*${partNo}\n   Qty: ${i.qty} × ₹${unitPrice} = ₹${subtotal}`;
  });

  const lines = [
    `🛒 *Order #${o.id} - Rajeshwar Infotech*`,
    `*Customer:* ${o.email || 'Customer'}`,
    `*Date:* ${o.created?.slice(0, 10) || ''}`,
    `────────────────────`,
    `*Items Ordered:*`,
    ...itemLines,
    `────────────────────`,
    `*Total Amount:* ₹${o.amount.toLocaleString('en-IN')}`,
    `*Status:* ${o.status}`,
    `────────────────────`,
    `Hello, I would like to check on my order #${o.id}. Thank you!`
  ];
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export default async function OrdersPage() {
  const { userId } = await auth();
  const rows = await db.all(
    "SELECT * FROM orders WHERE user_id=? AND status!='Pending' ORDER BY id DESC",
    [userId || '']
  );

  return (
    <div className="py-10 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="pb-4 border-b border-border/70">
        <h1 className="text-3xl font-extrabold text-foreground">My Orders</h1>
        <p className="text-xs text-muted-foreground mt-1">Review your past orders and dispatch progress.</p>
      </div>

      {rows.length === 0 ? (
        <Card className="bg-card/40 border-dashed border-border/80">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground/50">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No orders found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              You haven't placed any orders yet. Discover high-quality components in our catalogue.
            </p>
            <Link href="/products" className="pt-2">
              <Button className="gap-2">
                Browse Products <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden bg-card/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Support</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(o => {
                let parsedItems = [];
                try {
                  parsedItems = JSON.parse(o.items || '[]');
                } catch {}

                return (
                  <TableRow key={o.id}>
                    <TableCell className="font-mono font-bold text-xs text-primary">
                      #{o.id}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {o.created ? o.created.slice(0, 10) : 'Recent'}
                    </TableCell>
                    <TableCell className="text-xs text-foreground max-w-xs">
                      {parsedItems.map(i => `${i.name} ×${i.qty}`).join(', ') || 'Item batch'}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-xs text-foreground whitespace-nowrap">
                      ₹{o.amount.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          o.status === 'Paid'
                            ? 'default'
                            : o.status === 'Cancelled'
                            ? 'destructive'
                            : 'warning'
                        }
                      >
                        {o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <a
                        href={getWhatsAppUrl(o)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button variant="whatsapp" size="sm" className="h-7 text-xs px-2.5">
                          💬 Chat
                        </Button>
                      </a>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
