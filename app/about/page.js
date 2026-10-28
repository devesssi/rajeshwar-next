import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, Award, Users, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'About Us – Rajeshwar Infotech',
  description: 'Learn about Rajeshwar Infotech, our legacy of technical sourcing, component authenticity, and enterprise supply chain.'
};

export default function AboutPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <Badge variant="outline">Company Background</Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          About <span className="text-primary">Rajeshwar Infotech</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Supplying authentic computer hardware, specialized laptop components, semiconductors, and micro electronics for over a decade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/60">
          <CardContent className="p-6 text-center space-y-2">
            <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-foreground">100% Genuine</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every part is verified against manufacturer lot numbers and official distributor registries.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardContent className="p-6 text-center space-y-2">
            <Award className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-foreground">Technical Expertise</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our engineers assist with datasheet verification and pin-to-pin compatible replacement identification.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/60">
          <CardContent className="p-6 text-center space-y-2">
            <Users className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-bold text-foreground">Nationwide Supply</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Serving repair hubs, industrial manufacturers, IoT prototyping labs, and individual builders across India.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card/40 p-8 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Our Core Mission</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          At Rajeshwar Infotech, we bridge the gap between hard-to-source electronics and engineers who need them fast. Whether you are replacing a single rare laptop panel or sourcing 10,000 microcontrollers for an IoT assembly run, we deliver certified components with speed and transparent pricing.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
            <span>Authorized channel procurement only</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
            <span>Anti-static ESD safe packaging standards</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
            <span>GST invoices and commercial batch documentation</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
            <span>Responsive WhatsApp and phone support</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link href="/products">
          <Button size="lg">Explore Our Catalogue</Button>
        </Link>
      </div>
    </div>
  );
}
