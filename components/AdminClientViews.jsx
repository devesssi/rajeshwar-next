'use client';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { addProduct, updateProduct, delProduct, setStatus } from '@/app/admin/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, Plus, Save, AlertTriangle } from 'lucide-react';

const AV = ['In Stock', 'Limited', 'Out of Stock'];
const ST = ['WhatsApp Order', 'Paid', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

export function AdminAddProductForm({ categories }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await addProduct(formData);
      if (res.success) {
        toast.success(res.message);
        form.reset();
      } else {
        toast.error(res.error || 'Failed to add product');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-2xl border border-border/70 bg-card/50 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Product Name *</label>
          <Input name="name" placeholder="e.g. Intel Core i5-13400F" required />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Brand *</label>
          <Input name="brand" placeholder="e.g. Intel, AMD, Samsung" required />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Part Number *</label>
          <Input name="part_no" placeholder="e.g. BX8071513400F" required />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Price (₹ INR) *</label>
          <Input name="price" type="number" placeholder="17500" required />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Category *</label>
          <select
            name="category_id"
            className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Availability</label>
          <select
            name="availability"
            className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {AV.map(x => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-muted-foreground block mb-1">
          Specifications (Format: Key:Value;Key:Value)
        </label>
        <Input name="specs" placeholder="Cores:10;Socket:LGA1700;Boost:4.6 GHz" />
      </div>

      <Button type="submit" disabled={isPending} className="gap-2">
        <Plus className="h-4 w-4" />
        {isPending ? 'Adding…' : 'Add Product'}
      </Button>
    </form>
  );
}

export function AdminProductRow({ product }) {
  const [isPending, startTransition] = useTransition();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  function handleUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('id', product.id);

    startTransition(async () => {
      const res = await updateProduct(formData);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || 'Failed to update');
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set('id', product.id);
      const res = await delProduct(formData);
      setDeleteConfirmOpen(false);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || 'Failed to delete');
      }
    });
  }

  return (
    <>
      <tr className="border-b border-border/60 hover:bg-muted/20 text-xs">
        <td className="p-3">
          <div className="font-semibold text-foreground">{product.name}</div>
          <code className="text-[11px] font-mono text-muted-foreground">{product.part_no}</code>
        </td>
        <td className="p-3 font-semibold text-primary">{product.cat}</td>
        <td className="p-3">
          <form onSubmit={handleUpdate} className="flex items-center gap-2">
            <Input
              name="price"
              type="number"
              defaultValue={product.price}
              className="w-24 h-8 text-xs font-mono"
            />
            <select
              name="availability"
              defaultValue={product.availability}
              className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {AV.map(x => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
            <Button size="sm" variant="outline" type="submit" disabled={isPending} className="h-8 px-2.5">
              <Save className="h-3.5 w-3.5" />
            </Button>
          </form>
        </td>
        <td className="p-3 text-right">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDeleteConfirmOpen(true)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </td>
      </tr>

      {/* Delete Confirmation Dialog (Requirement 7) */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="h-12 w-12 rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center">Delete Product Confirmation</DialogTitle>
            <DialogDescription className="text-center pt-1 text-xs">
              Are you sure you want to delete <span className="font-bold text-foreground">"{product.name}"</span> (Part #{product.part_no})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? 'Deleting…' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function AdminOrderStatusForm({ order }) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set('id', order.id);

    startTransition(async () => {
      const res = await setStatus(formData);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.error || 'Failed to update order status');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
      <select
        name="status"
        defaultValue={order.status}
        className="h-8 rounded-md border border-border bg-background px-2 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {ST.map(x => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </select>
      <Button size="sm" variant="outline" type="submit" disabled={isPending} className="h-8 px-2.5 text-xs">
        Save
      </Button>
    </form>
  );
}
