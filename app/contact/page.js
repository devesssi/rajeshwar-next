import ContactForm from './ContactForm';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';

export const metadata = {
  title: 'Contact Us – Rajeshwar Infotech',
  description: 'Get in touch with Rajeshwar Infotech for component sourcing, wholesale inquiries, or direct WhatsApp support.'
};

export default function ContactPage() {
  return (
    <div className="py-12 max-w-5xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <Badge variant="outline">Direct Communications</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Contact <span className="text-primary">Our Procurement Team</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Need a quote for specific component part numbers, volume pricing, or tech support? Reach us through the form below or on WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-card/70 border-primary/30">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] shrink-0 border border-[#25D366]/20">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Direct WhatsApp</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Quick responses for stock & order status</p>
                  <a
                    href="https://wa.me/919321009638?text=Hello%20Rajeshwar%20Infotech%2C%20I%20have%20an%20inquiry%20regarding%20components."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 font-mono font-bold text-xs text-primary hover:underline"
                  >
                    +91 93210 09638 →
                  </a>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Email Desk</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">For formal purchase orders and RFQs</p>
                  <p className="mt-1 font-mono text-xs text-foreground">sales@rajeshwarinfotech.com</p>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Distribution Hub</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Lamington Road / Electronics Market, Mumbai, MH, India
                  </p>
                </div>
              </div>

              <div className="border-t border-border/50 pt-4 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground text-sm">Operating Hours</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Monday – Saturday: 10:00 AM – 7:30 PM IST</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <Card className="bg-card/70 border-border/80">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-foreground mb-1">Send an Inquiry</h3>
              <p className="text-xs text-muted-foreground mb-6">
                Fill in your details and our components specialist will reply promptly.
              </p>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
