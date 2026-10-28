'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import SignInPromptDialog from '@/components/SignInPromptDialog';
import OrderSuccessDialog from '@/components/OrderSuccessDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, setQty, remove, clear } = useCart();
  const { isSignedIn } = useUser();
  const [signInOpen, setSignInOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);

  async function handleCheckout(isDemo = true) {
    if (!isSignedIn) {
      setSignInOpen(true);
      toast.error('Please sign in to proceed with checkout.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, demo: isDemo })
      });

      if (res.status === 401) {
        setLoading(false);
        setSignInOpen(true);
        toast.error('Sign in required.');
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        toast.error(data.error || 'Checkout failed.');
        return;
      }

      clear();
      setLoading(false);
      toast.success(`Order #${data.orderId} created successfully!`);
      setSuccessData(data);
    } catch (err) {
      setLoading(false);
      toast.error('Network error during checkout.');
    }
  }

  return (
    <div className="py-10 max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-border/70">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Your Cart</h1>
          <p className="text-xs text-muted-foreground mt-1">Review your selected items and finalize order.</p>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clear();
              toast.info('Cart cleared');
            }}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Clear All
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Card className="bg-card/40 border-dashed border-border/80">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground/50">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Explore our catalogue of processors, microcontrollers, and laptop spares to add items to your cart.
            </p>
            <Link href="/products" className="pt-2">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="overflow-hidden bg-card/60">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Item & Part #</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(i => (
                  <TableRow key={i.id}>
                    <TableCell>
                      <div className="font-semibold text-foreground text-sm">{i.name}</div>
                      <code className="text-xs text-muted-foreground font-mono">{i.part_no}</code>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      ₹{i.price.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 border border-border rounded-lg bg-background w-fit p-0.5">
                        <button
                          onClick={() => setQty(i.id, i.qty - 1)}
                          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground text-xs"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-mono text-xs px-2 font-semibold min-w-[20px] text-center">
                          {i.qty}
                        </span>
                        <button
                          onClick={() => setQty(i.id, i.qty + 1)}
                          className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground text-xs"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-foreground text-sm font-mono">
                      ₹{(i.price * i.qty).toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          remove(i.id);
                          toast.info(`Removed ${i.name} from cart`);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {/* Checkout Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-border/80 bg-card/60">
            <div>
              <span className="text-xs text-muted-foreground block">Total Payable</span>
              <div className="text-2xl font-black text-foreground">
                ₹{total.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Button
                variant="default"
                size="lg"
                disabled={loading}
                onClick={() => handleCheckout(true)}
                className="font-bold shadow-md shadow-primary/20"
              >
                {loading ? 'Processing…' : 'Pay now (demo)'}
              </Button>
              <Button
                variant="whatsapp"
                size="lg"
                disabled={loading}
                onClick={() => handleCheckout(false)}
                className="gap-2 text-xs"
              >
                💬 Send order to WhatsApp (91 93210 09638)
              </Button>
            </div>
          </div>
        </div>
      )}

      <SignInPromptDialog open={signInOpen} onOpenChange={setSignInOpen} />
      {successData && (
        <OrderSuccessDialog
          open={!!successData}
          onOpenChange={open => !open && setSuccessData(null)}
          orderId={successData.orderId}
          whatsappUrl={successData.whatsappUrl}
        />
      )}
    </div>
  );
}
