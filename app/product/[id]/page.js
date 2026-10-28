import Link from 'next/link';
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import AddToCart from '@/components/AddToCart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ChevronRight, Cpu } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const p = await db.get('SELECT name, brand, part_no FROM products WHERE id = ?', [id]);
  if (!p) return { title: 'Product Not Found' };
  return {
    title: `${p.name} (${p.part_no}) – Rajeshwar Infotech`,
    description: `Buy genuine ${p.brand} ${p.name}. Part #${p.part_no}. In stock with fast dispatch across India.`
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const p = await db.get(
    `SELECT p.*, c.name as cat, c.icon 
     FROM products p 
     JOIN categories c ON c.id = p.category_id 
     WHERE p.id = ?`,
    [id]
  );

  if (!p) notFound();

  const rel = await db.all(
    `SELECT * FROM products WHERE category_id = ? AND id != ? LIMIT 4`,
    [p.category_id, p.id]
  );

  let specsObj = {};
  try {
    specsObj = JSON.parse(p.specs || '{}');
  } catch {}

  return (
    <div className="py-8 space-y-10 animate-fade-in max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/products?cat=${p.category_id}`} className="hover:text-primary transition-colors">
          {p.cat}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-semibold truncate max-w-xs">{p.name}</span>
      </nav>

      {/* Main Product Card */}
      <Card className="border-border/80 bg-card/70 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-10">
          {/* Icon Preview */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-8 rounded-2xl bg-secondary/30 border border-border/50 text-center">
            <span className="text-7xl sm:text-8xl p-6 rounded-2xl bg-card border border-border shadow-inner">
              {p.icon || '💻'}
            </span>
            <Badge variant={p.availability === 'Limited' ? 'warning' : 'default'} className="mt-6 text-xs px-3 py-1">
              {p.availability}
            </Badge>
          </div>

          {/* Details & Actions */}
          <div className="md:col-span-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {p.brand}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1 tracking-tight">
                {p.name}
              </h1>
              <div className="mt-2 inline-flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Manufacturer Part #:</span>
                <code className="text-xs px-2 py-0.5 rounded bg-secondary font-mono text-foreground font-bold">
                  {p.part_no}
                </code>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-muted-foreground block">Price (Inc. Taxes)</span>
                <div className="text-3xl font-black text-foreground">
                  ₹{p.price.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AddToCart p={p} size="default" />
              </div>
            </div>

            {/* Specifications Table */}
            <div className="pt-4 border-t border-border/60">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">
                Technical Specifications
              </h3>
              <div className="rounded-xl border border-border/60 overflow-hidden bg-background/50">
                <Table>
                  <TableBody>
                    {Object.entries(specsObj).map(([k, v]) => (
                      <TableRow key={k} className="hover:bg-muted/20">
                        <TableCell className="w-1/3 font-semibold text-xs text-muted-foreground py-2.5">
                          {k}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-foreground py-2.5">
                          {v}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Related Products */}
      {rel.length > 0 && (
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-bold text-foreground">Related Hardware in {p.cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {rel.map(r => (
              <Link key={r.id} href={`/product/${r.id}`}>
                <Card className="h-full p-4 hover:border-primary/50 transition-all group">
                  <span className="text-xs text-primary font-semibold uppercase">{r.brand}</span>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate mt-1">
                    {r.name}
                  </h4>
                  <code className="text-[11px] font-mono text-muted-foreground block truncate mt-1">
                    {r.part_no}
                  </code>
                  <div className="text-sm font-extrabold text-foreground mt-3">
                    ₹{r.price.toLocaleString('en-IN')}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
