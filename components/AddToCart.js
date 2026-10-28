'use client';
import { useState } from 'react';
import { useCart } from './CartProvider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, ShoppingBag } from 'lucide-react';

export default function AddToCart({ p, size = "sm" }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(p);
    setAdded(true);
    toast.success(`Added ${p.name} to cart!`);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <Button
      size={size}
      variant={added ? "secondary" : "default"}
      onClick={handleAdd}
      className="gap-1.5 transition-all text-xs font-semibold"
    >
      {added ? (
        <>
          <Check className="h-3.5 w-3.5 text-primary" />
          <span>Added ✓</span>
        </>
      ) : (
        <>
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Add to cart</span>
        </>
      )}
    </Button>
  );
}
