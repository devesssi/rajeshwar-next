import db from '@/lib/db';
import { isAdmin } from '@/lib/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AdminAddProductForm,
  AdminProductRow,
  AdminOrderStatusForm,
} from '@/components/AdminClientViews';
import { ShieldAlert, Package, ShoppingCart, IndianRupee, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Dashboard – Rajeshwar Infotech',
  description: 'Manage store catalogue, update inventory pricing, and track incoming customer orders.'
};

export default async function AdminPage() {
  const authorized = await isAdmin();

  // Requirement 8: Friendly "Access denied" screen for non-admins
  if (!authorized) {
    return (
      <div className="py-20 max-w-md mx-auto text-center space-y-6 animate-fade-in">
        <div className="h-20 w-20 rounded-3xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-foreground">Access Denied</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This administrative dashboard is restricted. Please sign in with an email address registered in <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">ADMIN_EMAILS</code>.
          </p>
        </div>
        <div className="pt-2 flex justify-center gap-3">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const s = await db.get(
    `SELECT 
      (SELECT COUNT(*) FROM products) as p,
      (SELECT COUNT(*) FROM orders WHERE status != 'Pending') as o,
      (SELECT COALESCE(SUM(amount), 0) FROM orders WHERE status NOT IN ('Pending', 'Cancelled')) as r,
      (SELECT COUNT(*) FROM messages) as m`
  );

  const cats = await db.all('SELECT * FROM categories ORDER BY id ASC');
  const orders = await db.all("SELECT * FROM orders WHERE status != 'Pending' ORDER BY id DESC");
  const prods = await db.all(
    `SELECT p.*, c.name as cat 
     FROM products p 
     JOIN categories c ON c.id = p.category_id 
     ORDER BY p.id DESC`
  );
  const messages = await db.all('SELECT * FROM messages ORDER BY id DESC LIMIT 20');

  return (
    <div className="py-10 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-foreground">Admin Dashboard</h1>
            <Badge variant="default" className="text-xs">Authorized</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time management for products, order processing, and procurement inquiries.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/70 border-border/70">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Catalogue</p>
              <h3 className="text-2xl font-black text-foreground mt-1">{s.p || 0}</h3>
              <span className="text-[11px] text-primary">Active products</span>
            </div>
            <Package className="h-8 w-8 text-primary/40" />
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border/70">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Orders</p>
              <h3 className="text-2xl font-black text-foreground mt-1">{s.o || 0}</h3>
              <span className="text-[11px] text-primary">Processed</span>
            </div>
            <ShoppingCart className="h-8 w-8 text-primary/40" />
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border/70">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Revenue</p>
              <h3 className="text-2xl font-black text-foreground mt-1">₹{(s.r || 0).toLocaleString('en-IN')}</h3>
              <span className="text-[11px] text-primary">Total sales</span>
            </div>
            <IndianRupee className="h-8 w-8 text-primary/40" />
          </CardContent>
        </Card>

        <Card className="bg-card/70 border-border/70">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Inquiries</p>
              <h3 className="text-2xl font-black text-foreground mt-1">{s.m || 0}</h3>
              <span className="text-[11px] text-primary">Customer messages</span>
            </div>
            <MessageSquare className="h-8 w-8 text-primary/40" />
          </CardContent>
        </Card>
      </div>

      {/* Tabs Navigation for Products, Orders & Messages */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="bg-card/80 border border-border flex flex-wrap h-auto gap-1.5 p-1.5 w-full justify-start">
          <TabsTrigger value="products">Products ({prods.length})</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="add">Add New Product</TabsTrigger>
          <TabsTrigger value="messages">Contact Messages ({messages.length})</TabsTrigger>
        </TabsList>

        {/* Tab 1: Products */}
        <TabsContent value="products" className="space-y-4">
          <Card className="overflow-hidden bg-card/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/40 text-xs font-semibold text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-3">Product Name & Part #</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price & Status</th>
                    <th className="p-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {prods.map(p => (
                    <AdminProductRow key={p.id} product={p} />
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Orders */}
        <TabsContent value="orders" className="space-y-4">
          <Card className="overflow-hidden bg-card/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-secondary/40 text-xs font-semibold text-muted-foreground border-b border-border">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Customer Email & Date</th>
                    <th className="p-3">Items Ordered</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Status Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {orders.map(o => {
                    let itemsArr = [];
                    try {
                      itemsArr = JSON.parse(o.items || '[]');
                    } catch {}
                    return (
                      <tr key={o.id} className="border-b border-border/60 hover:bg-muted/20">
                        <td className="p-3 font-mono font-bold text-primary">#{o.id}</td>
                        <td className="p-3">
                          <div className="font-semibold text-foreground">{o.email || 'Guest Customer'}</div>
                          <div className="text-[11px] text-muted-foreground">{o.created?.slice(0, 10)}</div>
                        </td>
                        <td className="p-3 text-foreground max-w-xs">
                          {itemsArr.map(i => `${i.name} ×${i.qty}`).join(', ')}
                        </td>
                        <td className="p-3 font-bold font-mono">₹{o.amount.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <AdminOrderStatusForm order={o} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 3: Add Product */}
        <TabsContent value="add" className="space-y-4">
          <Card className="bg-card/60">
            <CardHeader className="p-6 pb-2">
              <CardTitle className="text-lg">Add New Hardware Item</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <AdminAddProductForm categories={cats} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Messages */}
        <TabsContent value="messages" className="space-y-4">
          <Card className="overflow-hidden bg-card/60">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No customer inquiries received yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/40 font-semibold text-muted-foreground border-b border-border">
                    <tr>
                      <th className="p-3">Sender</th>
                      <th className="p-3">Contact Details</th>
                      <th className="p-3">Message</th>
                      <th className="p-3">Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(m => (
                      <tr key={m.id} className="border-b border-border/60 hover:bg-muted/20">
                        <td className="p-3 font-bold text-foreground">{m.name}</td>
                        <td className="p-3">
                          <div>{m.email}</div>
                          {m.phone && <div className="text-muted-foreground">{m.phone}</div>}
                        </td>
                        <td className="p-3 text-muted-foreground max-w-sm whitespace-pre-wrap">{m.message}</td>
                        <td className="p-3 text-muted-foreground whitespace-nowrap">{m.created?.slice(0, 16)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
