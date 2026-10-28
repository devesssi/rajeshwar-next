'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function OrderSuccessDialog({ open, onOpenChange, orderId, whatsappUrl }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="h-14 w-14 rounded-2xl bg-primary/20 border border-primary/40 text-primary flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Order Confirmed!</DialogTitle>
          <DialogDescription className="text-center text-sm pt-2">
            Your order <span className="font-mono font-bold text-foreground bg-secondary px-2 py-0.5 rounded">#{orderId}</span> has been created successfully and recorded in your account.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button variant="whatsapp" className="w-full gap-2">
                💬 Open in WhatsApp
              </Button>
            </a>
          )}
          <Link href="/orders" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
            <Button variant="default" className="w-full gap-1">
              View My Orders <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
