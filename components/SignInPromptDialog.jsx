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
import { SignInButton } from '@clerk/nextjs';
import { LogIn } from 'lucide-react';

export default function SignInPromptDialog({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-2">
            <LogIn className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-xl">Sign in to continue</DialogTitle>
          <DialogDescription className="text-center text-sm pt-1">
            Please sign in to your Rajeshwar Infotech account to proceed with checkout and track your orders.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center pt-2">
          <SignInButton mode="modal">
            <Button className="w-full sm:w-auto px-6">
              Sign In / Register
            </Button>
          </SignInButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
