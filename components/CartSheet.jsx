'use client';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import SignInPromptDialog from './SignInPromptDialog';
import OrderSuccessDialog from './OrderSuccessDialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartSheet({ open, onOpenChange }) {
  const { items, setQty, remove, clear } = useCart();
  const { isSignedIn } = useUser();
  const [signInOpen, setSignInOpen] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0);
  const count = items.reduce((s, i) => s + (i.qty || 1), 0);

  async function handleCheckout(isDemo = true) {
    if (!isSignedIn) {
      setSignInOpen(true);
      toast.error('Please sign in to continue checkout.');
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
        toast.error('Sign-in required to complete checkout.');
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        toast.error(data.error || 'Payment failed.');
        return;
      }

      clear();
      setLoading(false);
      onOpenChange(false);
      toast.success(`Order #${data.orderId} placed successfully!`);
      setSuccessData(data);
    } catch (err) {
      setLoading(false);
      toast.error('An unexpected error occurred during checkout.');
    }
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col h-full w-full sm:max-w-md bg-card/95 backdrop-blur-md p-6">
          <SheetHeader className="pb-4 border-b border-border/70 text-left">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <span>Shopping Cart</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-primary font-mono ml-auto">
                {count} items
              </span>
            </SheetTitle>
          </SheetHeader>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                <div className="h-16 w-16 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground/60">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h4 className="font-semibold text-foreground text-base">Your cart is empty</h4>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Browse our inventory of computer components and add items to your cart.
                </p>
                <Link href="/products" onClick={() => onOpenChange(false)} className="pt-2">
                  <Button size="sm" variant="outline">
                    Explore Catalogue
                  </Button>
                </Link>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-xl border border-border/60 bg-secondary/20 hover:border-border transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-sm text-foreground truncate">
                      {item.name}
                    </h5>
                    <p className="text-xs font-mono text-muted-foreground truncate">
                      {item.part_no || 'Part #N/A'}
                    </p>
                    <div className="text-sm font-bold text-primary mt-1">
                      ₹{(item.price || 0).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => {
                        remove(item.id);
                        toast.info(`Removed ${item.name} from cart`);
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-1.5 border border-border rounded-lg bg-background p-0.5">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground text-xs"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-mono text-xs px-1.5 min-w-[20px] text-center font-semibold">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground text-xs"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <SheetFooter className="border-t border-border/70 pt-4 flex-col sm:flex-col gap-3">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="text-xl font-extrabold text-foreground">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex flex-col gap-2 w-full pt-1">
                <Button
                  onClick={() => handleCheckout(true)}
                  disabled={loading}
                  className="w-full gap-2 font-bold shadow-md shadow-primary/20"
                >
                  {loading ? 'Processing Order…' : 'Pay now (demo)'}
                </Button>

                <Button
                  variant="whatsapp"
                  onClick={() => handleCheckout(false)}
                  disabled={loading}
                  className="w-full gap-2 text-xs"
                >
                  💬 Send order to WhatsApp (91 93210 09638)
                </Button>

                <Link
                  href="/cart"
                  onClick={() => onOpenChange(false)}
                  className="text-center text-xs text-muted-foreground hover:text-primary transition-colors pt-1"
                >
                  View full cart page →
                </Link>
              </div>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <SignInPromptDialog open={signInOpen} onOpenChange={setSignInOpen} />
      {successData && (
        <OrderSuccessDialog
          open={!!successData}
          onOpenChange={open => !open && setSuccessData(null)}
          orderId={successData.orderId}
          whatsappUrl={successData.whatsappUrl}
        />
      )}
    </>
  );
}
