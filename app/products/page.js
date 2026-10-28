import Link from 'next/link';
import db from '@/lib/db';
import AddToCart from '@/components/AddToCart';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PackageOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Products – Rajeshwar Infotech',
  description: 'Browse our complete catalogue of genuine computer parts, laptop spares, micro components, and networking hardware.'
};

export default async function ProductsPage({ searchParams }) {
  const { q = '', cat = '' } = await searchParams;
  const cats = await db.all('SELECT * FROM categories ORDER BY id ASC');

  let rows = [];
  if (cat && q) {
    rows = await db.all(
      `SELECT p.*, c.icon FROM products p JOIN categories c ON c.id = p.category_id 
       WHERE (p.name LIKE ? OR p.part_no LIKE ? OR p.brand LIKE ?) AND p.category_id = ? ORDER BY p.id`,
      [`%${q}%`, `%${q}%`, `%${q}%`, Number(cat)]
    );
  } else if (cat) {
    rows = await db.all(
      `SELECT p.*, c.icon FROM products p JOIN categories c ON c.id = p.category_id 
       WHERE p.category_id = ? ORDER BY p.id`,
      [Number(cat)]
    );
  } else if (q) {
    rows = await db.all(
      `SELECT p.*, c.icon FROM products p JOIN categories c ON c.id = p.category_id 
       WHERE (p.name LIKE ? OR p.part_no LIKE ? OR p.brand LIKE ?) ORDER BY p.id`,
      [`%${q}%`, `%${q}%`, `%${q}%`]
    );
  } else {
    rows = await db.all(
      `SELECT p.*, c.icon FROM products p JOIN categories c ON c.id = p.category_id ORDER BY p.id`
    );
  }

  return (
    <div className="py-8 space-y-8 animate-fade-in">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/70">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Product <span className="text-primary">Catalogue</span>
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl text-sm sm:text-base">
            Genuine electronic components, processors, laptop replacements, and networking hardware ready for dispatch.
          </p>
        </div>

        <form action="/products" method="GET" className="flex items-center gap-2 w-full md:w-auto max-w-md">
          {cat ? <input type="hidden" name="cat" value={cat} /> : null}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={q}
              placeholder="Search name, brand, part #…"
              className="pl-9 bg-card/60"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link href={q ? `/products?q=${encodeURIComponent(q)}` : '/products'}>
          <Button
            size="sm"
            variant={!cat ? 'default' : 'outline'}
            className="rounded-full shrink-0"
          >
            All Products
          </Button>
        </Link>
        {cats.map(c => {
          const isActive = String(cat) === String(c.id);
          const href = q
            ? `/products?cat=${c.id}&q=${encodeURIComponent(q)}`
            : `/products?cat=${c.id}`;
          return (
            <Link key={c.id} href={href}>
              <Button
                size="sm"
                variant={isActive ? 'default' : 'outline'}
                className="rounded-full shrink-0 flex items-center gap-1.5"
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>Products</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary text-muted-foreground font-normal">
            {rows.length} found
          </span>
        </h2>
        {(q || cat) && (
          <Link href="/products">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
              Reset Filters
            </Button>
          </Link>
        )}
      </div>

      {/* Product Grid or Empty State */}
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border/80 bg-card/30">
          <PackageOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-semibold text-foreground">No products found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            We couldn't find any items matching your criteria. Try adjusting your search term or category filter.
          </p>
          <Link href="/products" className="mt-4">
            <Button variant="outline" size="sm">
              View All Products
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {rows.map(p => (
            <Card key={p.id} className="flex flex-col justify-between overflow-hidden group hover:shadow-lg hover:shadow-primary/5 transition-all">
              <CardHeader className="p-4 pb-2 relative">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-2xl p-2 rounded-lg bg-secondary/70 border border-border/50">
                    {p.icon || '📦'}
                  </span>
                  <Badge variant={p.availability === 'Limited' ? 'warning' : 'default'}>
                    {p.availability}
                  </Badge>
                </div>
                <div className="mt-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {p.brand}
                  </span>
                  <Link href={`/product/${p.id}`}>
                    <CardTitle className="text-base font-bold mt-0.5 group-hover:text-primary transition-colors line-clamp-1">
                      {p.name}
                    </CardTitle>
                  </Link>
                  <code className="text-[11px] font-mono text-muted-foreground mt-1 block truncate">
                    {p.part_no}
                  </code>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-0">
                <div className="text-xl font-extrabold text-foreground mt-2">
                  ₹{p.price.toLocaleString('en-IN')}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 border-t border-border/40 mt-auto flex items-center justify-between gap-2 bg-secondary/10">
                <Link href={`/product/${p.id}`} className="text-xs text-muted-foreground hover:text-foreground">
                  Specs →
                </Link>
                <AddToCart p={p} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
