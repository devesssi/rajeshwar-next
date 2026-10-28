'use client';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);

    const clientErrors = {};
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name) clientErrors.name = 'Please enter your name';
    if (!email || !email.includes('@')) clientErrors.email = 'Please enter a valid email';
    if (!message || message.length < 5) clientErrors.message = 'Please enter a message (min 5 characters)';

    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      toast.error('Please resolve the errors highlighted below.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone: formData.get('phone')?.toString().trim(), message })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setSubmitted(true);
          toast.success(data.message || 'Your message has been received!');
        } else if (data.errors) {
          setErrors(data.errors);
          toast.error('Please fix the form errors.');
        } else {
          toast.error(data.error || 'Could not send message.');
        }
      } catch (err) {
        toast.error('Connection error. Please verify your connection.');
      }
    });
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-primary/40 bg-card/60">
        <CheckCircle2 className="h-12 w-12 text-primary mb-3" />
        <h3 className="text-xl font-bold text-foreground">Message Received!</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-sm">
          Thank you for reaching out to Rajeshwar Infotech. A technical representative will review your inquiry and respond soon.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => {
            setSubmitted(false);
            setErrors({});
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Full Name <span className="text-destructive">*</span>
        </label>
        <Input
          name="name"
          placeholder="e.g. Ramesh Patel"
          className={errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}
        />
        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Email Address <span className="text-destructive">*</span>
          </label>
          <Input
            name="email"
            type="email"
            placeholder="ramesh@company.com"
            className={errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
          />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
            Phone / WhatsApp Number
          </label>
          <Input
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Inquiry / Part Requirements <span className="text-destructive">*</span>
        </label>
        <textarea
          name="message"
          rows={4}
          placeholder="Specify component part numbers, quantities, target pricing, or technical questions…"
          className={`flex w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
            errors.message ? 'border-destructive focus-visible:ring-destructive' : 'border-border'
          }`}
        />
        {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
      </div>

      <Button type="submit" disabled={isPending} className="w-full gap-2">
        <Send className="h-4 w-4" />
        {isPending ? 'Sending Message…' : 'Submit Inquiry'}
      </Button>
    </form>
  );
}
